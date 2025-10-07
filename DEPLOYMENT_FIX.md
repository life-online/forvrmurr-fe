# Production Build Fix

## Issue
The production server is unable to find modules that exist in the repository:
- `@/components/animations/*`
- `@/services/contact`
- `@/services/toast`
- `@/utils/animations`

## Root Cause
The production server likely has:
1. Stale code (not pulled latest commits)
2. Cached build artifacts
3. Old node_modules

## Solution

Run these commands on your production server:

```bash
# 1. Navigate to project directory
cd /path/to/forvrmurr-frontend

# 2. Pull latest code
git fetch origin
git pull origin main

# 3. Clean build cache and node_modules
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json

# 4. Reinstall dependencies (this will install Tailwind in dependencies now)
npm install

# 5. Build the project
npm run build

# 6. Start the production server
npm start
```

## Alternative: Quick Fix

If you just want to try a quick rebuild:

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

## Verify Files Exist

Before building, verify the files are present:

```bash
ls -la src/components/animations/
ls -la src/services/contact.ts
ls -la src/services/toast.ts
ls -la src/utils/animations.ts
```

All these files should exist. If they don't, the `git pull` didn't work properly.

## Latest Commits to Pull

Make sure you have these commits:
- `1d30771` - fix: move Tailwind CSS packages to dependencies
- `b339ae5` - feat: add analytics, quiz, and wishlist features
- `8a4b765` - fix: update navbar subscription link
- `bac2693` - feat: implement subscription interest waitlist form
- `da56245` - feat: add animations to subscription pages
- `0d94f04` - feat: enhance profile pages with animations
- `5981a39` - feat: add staggered animations to marketing pages
- `ce31c18` - fix: improve page transition UX
- `4343507` - feat: add animation components and utilities

Check with:
```bash
git log --oneline -10
```

## If Still Failing

If the build still fails after these steps, check:

1. **Node version**: Ensure you're using Node 18+ 
   ```bash
   node --version
   ```

2. **TypeScript paths**: The `tsconfig.json` should have:
   ```json
   "paths": {
     "@/*": ["./src/*"]
   }
   ```

3. **File permissions**: Ensure all files are readable
   ```bash
   chmod -R 755 src/
   ```

4. **Case sensitivity**: Linux servers are case-sensitive. Verify imports match file names exactly.
