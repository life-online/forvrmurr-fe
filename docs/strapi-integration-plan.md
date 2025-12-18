# Strapi Integration Plan

## Goals
- Introduce a headless CMS (Strapi) that allows non-technical stakeholders to manage all marketing copy, imagery, banners, and other user-facing content.
- Keep the CMS decoupled so it can be hosted separately while enabling seamless integration with the existing Next.js storefront, with production deployment readiness from day one.
- Replace all hard-coded text and media within the app with Strapi-driven content without regressing current functionality or performance.

## Assumptions & Constraints
- The CMS will live inside this repository for now (e.g. `cms/forvmurr-strapi`) but must function as a standalone project that can be extracted later and deployed independently immediately after development.
- Local development should support running both Next.js and Strapi simultaneously (`npm run dev` and `npm run cms`).
- Network/package installation may require coordination due to the current sandbox restrictions.
- We will consume Strapi strictly via REST APIs secured with API tokens.
- We prefer to evolve toward server-rendered content (Next.js `fetch`/`react-query`), but we must avoid creating blocking calls on critical paths. Incremental rollout is acceptable.

## Proposed Architecture
- **Strapi project** in `cms/forvmurr-strapi`, bootstrapped with TypeScript, SQLite (for local dev), and ready-to-configure Postgres/MySQL for deployed environments (staging/production).
- **Content modeling** built around dynamic zones so each page/component can compose reusable sections:
  - `hero_section` (title, subtitle, background image, CTA).
  - `rich_text_block` (heading, body copy, optional image).
  - `feature_highlight` (icon/image, title, description, CTA).
  - `testimonial` (quote, author, avatar).
  - `faq_item`, `cta_banner`, etc. (expand as needed after content audit).
  - `announcement_banner` specifically covering the global message `"The wait is over. Shop Prime & Premium perfumes—now in 8ml!"`.
- **Page singleton** vs. `page` collection:
  - All pages in the application are in scope. Marketing/landing pages (e.g. `/`, `/shop/gifting`, `/discover/why-decants`, `/about/*`, profile sub-pages, subscription flows, etc.) will be modeled as a `page` collection with `slug`, SEO metadata, and dynamic zones.
  - Global components (navbar, footer, announcement banner, metadata, CTA buttons) stored as `singleton` types.
- **Media**: rely on Strapi's local uploads directory in development; plan S3-compatible storage for production.
- **Auth**: use Strapi's REST API with either public read access on marketing content or an API token stored in the Next.js backend.
- **Integration layer**:
  - Create a light-weight client in `src/services/cms.ts` handling endpoint URLs, caching, error handling.
  - Fetch page data in relevant Next.js route handlers (`generateStaticParams`, `generateMetadata`, server components) with static regeneration where applicable.
  - Provide graceful fallbacks (static JSON or default copy) so the site still renders if the CMS is unreachable.

## Implementation Phases

### Phase 0 – Preparation
1. Catalog every page and shared component with static copy/images (per scope: whole app, including banners and profile flows).
2. Align on reusable Strapi component library covering all current content variations (allowing future extension).
3. Document environment variables required for both projects (Strapi URL, API token, upload config) and deployment prerequisites (database choice, hosting target).

### Phase 1 – Strapi Setup
1. Scaffold Strapi project under `cms/forvmurr-strapi` using `npx create-strapi-app`.
2. Configure TypeScript support, linting, and `package.json` scripts (`cms:dev`, `cms:build`, `cms:start`, `cms:deploy` placeholder).
3. Add Strapi environment config files (`.env`, `.env.example`) with sensible defaults (SQLite for local, Postgres config template for deployment) and admin credentials via env vars.
4. Document infrastructure requirements for immediate deployment (database, storage, hosting provider, build steps).
5. Update root `README.md` with instructions for running Strapi locally and deploying independently.

### Phase 2 – Content Modeling
1. Define reusable Strapi components (`hero-section`, `rich-text-block`, `feature-highlight`, `announcement-banner`, etc.).
2. Create `page` collection type:
   - Fields: `title`, `slug`, SEO metadata, `Sections` dynamic zone referencing the reusable components (capable of covering every page).
3. Add singleton types:
   - `global-settings` (site name, default metadata, nav links, theme toggles).
   - `footer` (link groups, CTA).
   - `announcement-banner` (message, style, visibility toggles).
4. Seed comprehensive content to mirror all current app pages and shared components for quick parity.

### Phase 3 – Next.js Integration
1. Create `src/services/cms.ts` to encapsulate API calls with caching and type definitions (generated via Strapi OpenAPI/TypeScript or manually).
2. Introduce environment variables to point to Strapi (`STRAPI_BASE_URL`, `STRAPI_API_TOKEN`, `STRAPI_PREVIEW_TOKEN` optional).
3. Replace all hard-coded copy, imagery, and CTAs across the app with Strapi-driven data:
   - Use server components or route handlers to fetch page data at build-time (`generateStaticParams`) or request-time with caching.
   - Map dynamic sections to React components (e.g. `HeroSection` consumes `hero_section` content, `PageTransition` toggles content, profile/checkout copy sourced via relevant components).
   - Ensure banners (`announcement-banner`) and global UI wrappers (Navbar, Footer, overlays) pull from Strapi singletons.
4. Provide runtime fallbacks (default copy or last-known cached response) so the UI remains usable if Strapi is unreachable, without losing editability guarantees.
5. Verify all REST endpoints respect auth requirements and caching rules.

### Phase 4 – Developer & Deployment Workflow
1. Provide scripts/docker-compose (if desired) for running Strapi + Next together in dev and preview.
2. Document content entry workflow for non-technical users (screenshots optional).
3. Configure CI checks (lint/test for both projects) and optionally add Strapi build/test steps to existing pipelines.
4. Outline deployment plan:
   - Hosting Strapi (e.g. Render, DigitalOcean, AWS) with Postgres and persistent storage.
   - Synchronizing environment variables/secrets between Strapi and Next.js.
   - Automated Strapi content export/import for multi-environment syncing.
5. Provide checklist for launching Strapi to production immediately after development.

### Phase 5 – Future Enhancements (Optional)
- Enable localization/internationalization if required.
- Integrate Strapi webhooks to trigger Next.js revalidation.
- Add role-based access for content editors.
- Explore incremental adoption for e-commerce/product data if Shopify remains the source of truth.

## Open Questions
1. Preferred hosting provider(s) for immediate production deployment (influences infra setup tasks).
2. Do we need automated content migration between environments beyond export/import tooling?
3. Any compliance/security requirements (audit logs, backup cadence) we should address up front?

---
**Next step:** Review this plan with the team/stakeholders, refine scope (especially Phase 0 content audit), then proceed with implementation.
