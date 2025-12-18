import type { Core } from '@strapi/strapi';

type GlobalSettingsSeed = {
  siteName: string;
  siteUrl: string;
  tagline: string;
  defaultSeo: Record<string, unknown>;
  announcement: Record<string, unknown>;
  primaryNavigation: Array<Record<string, unknown>>;
  accountNavigation: Array<Record<string, unknown>>;
  footerDescription: string;
  footerLinkGroups: Array<Record<string, unknown>>;
  footerSocialLinks: Array<Record<string, unknown>>;
  supportEmail: string;
  supportPhone: string;
  policyLinks: Array<Record<string, unknown>>;
};

type PageSeed = {
  title: string;
  slug: string;
  seo: Record<string, unknown>;
  sections: Array<Record<string, unknown>>;
};

type DictionaryEntrySeed = {
  key: string;
  type?: 'text' | 'richtext' | 'json';
  textValue?: string;
  richTextValue?: string;
  jsonValue?: unknown;
  description?: string;
};

type MediaAssetSeed = {
  key: string;
  title?: string;
  description?: string;
};

const globalSettingsSeed: GlobalSettingsSeed = {
  siteName: 'ForvrMurr',
  siteUrl: 'https://forvrmurr.com',
  tagline: 'Luxury perfume samples in 8ml bottles',
  defaultSeo: {
    metaTitle: 'ForvrMurr | Meet Your Next Obsession',
    metaDescription:
      'Explore coveted fragrances in 8ml portions. Smell rich. Explore more. No full bottle pressure.',
    keywords: [
      'luxury perfume',
      'perfume samples',
      'fragrance decants',
      'niche perfume',
      'designer fragrances',
    ],
    canonicalUrl: 'https://forvrmurr.com',
  },
  announcement: {
    key: 'global-announcement',
    message: 'The wait is over. Shop Prime & Premium perfumes—now in 8ml!',
    variant: 'default',
    isActive: true,
  },
  primaryNavigation: [
    {
      label: 'SHOP',
      href: '/shop',
      actionType: 'link',
      subLinks: [
        { label: 'All Fragrances', url: '/shop' },
        { label: 'Prime Collection', url: '/shop?type=prime' },
        { label: 'Premium Collection', url: '/shop?type=premium' },
        { label: 'Perfume Travel Case', url: '/shop/travel-case' },
        { label: 'Gifting', url: '/shop/gifting' },
      ],
    },
    {
      label: 'SUBSCRIPTIONS',
      href: '/subscriptions',
      actionType: 'link',
      subLinks: [
        { label: 'Monthly Prime', url: '/subscriptions/prime' },
        { label: 'Monthly Premium', url: '/subscriptions/premium' },
        { label: 'Manage Subscription', url: '/subscriptions/manage', isExternal: false },
      ],
    },
    {
      label: 'DISCOVER',
      href: '/discover',
      actionType: 'link',
      subLinks: [
        { label: 'Take Scent Quiz', url: '/discover/quiz' },
        { label: 'Why Choose Decants', url: '/discover/why-decants' },
      ],
    },
    {
      label: 'ABOUT',
      href: '/about',
      actionType: 'link',
      subLinks: [
        { label: 'Our Story', url: '/about/story' },
        { label: 'Meet the Founders', url: '/about/founders' },
        { label: 'FAQs', url: '/about/faq' },
        { label: 'Contact Us', url: '/about/contact' },
      ],
    },
  ],
  accountNavigation: [
    { label: 'Profile', href: '/profile', actionType: 'link' },
    { label: 'Order History', href: '/profile/orders', actionType: 'link' },
    { label: 'Wishlist', href: '/profile/wishlist', actionType: 'link' },
    { label: 'Manage Subscription', href: '/subscriptions/manage', actionType: 'link' },
    { label: 'Login', href: '/auth/login', actionType: 'login' },
    { label: 'Logout', href: '#', actionType: 'logout' },
  ],
  footerDescription:
    'Curated fragrances, delivered beautifully. Discover niche and designer scents in ready-to-spray 8ml bottles.',
  footerLinkGroups: [
    {
      title: 'Shop',
      links: [
        { label: 'Prime Collection', url: '/shop?type=prime' },
        { label: 'Premium Collection', url: '/shop?type=premium' },
        { label: 'Perfume Travel Case', url: '/shop/travel-case' },
        { label: 'Gifting', url: '/shop/gifting' },
      ],
    },
    {
      title: 'About',
      links: [
        { label: 'Our Story', url: '/about/story' },
        { label: 'Meet the Founders', url: '/about/founders' },
        { label: 'FAQs', url: '/about/faq' },
        { label: 'Contact Us', url: '/about/contact' },
      ],
    },
    {
      title: 'Discover',
      links: [
        { label: 'Take the Scent Quiz', url: '/discover/quiz' },
        { label: 'Why Choose Decants', url: '/discover/why-decants' },
        { label: 'Terms & Conditions', url: '/terms' },
        { label: 'Privacy Policy', url: '/privacy' },
      ],
    },
  ],
  footerSocialLinks: [
    {
      platform: 'Instagram',
      link: { label: 'Instagram', url: 'https://www.instagram.com/forvrmurr', isExternal: true },
    },
    {
      platform: 'Facebook',
      link: { label: 'Facebook', url: 'https://web.facebook.com/profile.php?id=61574755126571', isExternal: true },
    },
    {
      platform: 'Twitter',
      link: { label: 'Twitter', url: 'https://x.com/forvrmurr', isExternal: true },
    },
    {
      platform: 'TikTok',
      link: {
        label: 'TikTok',
        url: 'https://www.tiktok.com/@forvrmurr',
        isExternal: true,
      },
    },
  ],
  supportEmail: 'support@forvrmurr.com',
  supportPhone: '+234 000 000 0000',
  policyLinks: [
    { label: 'Terms & Conditions', url: '/terms' },
    { label: 'Privacy Policy', url: '/privacy' },
  ],
};

const pageSeeds: PageSeed[] = [
  {
    title: 'Home',
    slug: 'home',
    seo: {
      metaTitle: 'ForvrMurr | Meet Your Next Obsession',
      metaDescription:
        'Explore coveted fragrances like Delina, Khamrah & Oud Satin in 8ml portions. Smell rich. Explore more. No full bottle pressure.',
      canonicalUrl: 'https://forvrmurr.com',
    },
    sections: [
      {
        __component: 'sections.hero',
        key: 'home-hero',
        eyebrow: 'MEET YOUR NEXT OBSESSION',
        title: 'Explore coveted fragrances like Delina, Khamrah & Oud Satin - in 8ml portions.',
        subtitle: 'Smell rich. Explore more. No full bottle pressure.',
        tagline: 'Shop the Prime & Premium collections curated for every kind of obsession.',
        cta: { label: 'Shop Now', url: '/shop' },
        secondaryCta: { label: 'Take the Quiz', url: '/discover/quiz' },
      },
      {
        __component: 'sections.card-grid',
        key: 'home-category-selection',
        eyebrow: 'Start Here',
        title: 'ARE YOU PRIME OR PREMIUM?',
        subtitle: 'Find your perfect scent tier.',
        layout: 'two-column',
        cards: [
          {
            key: 'prime',
            title: 'Prime',
            description: 'Accessible niche and designer favorites for daily luxury and easy layering.',
            cta: { label: 'Explore Prime', url: '/shop?type=prime' },
          },
          {
            key: 'premium',
            title: 'Premium',
            description: 'Ultra-luxury and rare niche scents for the fragrance connoisseur.',
            cta: { label: 'Explore Premium', url: '/shop?type=premium' },
          },
        ],
      },
      {
        __component: 'sections.generic-content',
        key: 'home-product-showcase',
        title: 'GET YOUR HANDS ON HIGHLY RATED HITS + FRESH PICKS.',
        subtitle: 'Our Top Picks, Voted By You',
        layout: 'default',
        notes: 'Drives copy for ProductShowcase component including filter labels via dictionary entries.',
      },
      {
        __component: 'sections.generic-content',
        key: 'home-curated-experiences',
        title: 'OVER 200 CURATED FRAGRANCES. ONE SIGNATURE EXPERIENCE.',
        body:
          '<p>The luxury perfume world was built on exclusivity. We\'re here to break that barrier—without watering anything down. We stock <strong>over 200 of the best designer and niche fragrances in the world.</strong> From Parfums de Marly to Lattafa, Amouage to Armaf.</p><p>While most decants arrive in plain plastic vials, ours are a <strong>luxury experience—with premium packaging</strong>, mood-based bundles, and unforgettable scent storytelling.</p><p>Forvr Murr is more than a perfume shop. It\'s a curated world of scent, desire, and indulgence.</p>',
        layout: 'centered',
      },
    ],
  },
];

const dictionarySeeds: DictionaryEntrySeed[] = [
  {
    key: 'productShowcase.tagline',
    textValue: 'Our Top Picks, Voted By You',
    description: 'Eyebrow copy above the home product showcase carousel.',
  },
  {
    key: 'productShowcase.filter.all',
    textValue: 'All',
    description: 'Filter label for all product types in the showcase component.',
  },
  {
    key: 'productShowcase.filter.prime',
    textValue: 'Prime',
    description: 'Filter label for prime products in the showcase component.',
  },
  {
    key: 'productShowcase.filter.premium',
    textValue: 'Premium',
    description: 'Filter label for premium products in the showcase component.',
  },
  {
    key: 'footer.newsletter.copy',
    textValue: 'Subscribe to our newsletter for exclusive offers and fragrance tips.',
  },
  {
    key: 'navbar.currency.ngn',
    textValue: 'NGN',
  },
  {
    key: 'navbar.currency.gbp',
    textValue: 'GBP',
  },
];

const mediaAssetSeeds: MediaAssetSeed[] = [
  { key: 'hero.background.home', title: 'Home Hero Background' },
  { key: 'category.prime.left', title: 'Prime Bottle Left' },
  { key: 'category.prime.center', title: 'Prime Bottle Center' },
  { key: 'category.prime.right', title: 'Prime Bottle Right' },
  { key: 'category.premium.left', title: 'Premium Bottle Left' },
  { key: 'category.premium.center', title: 'Premium Bottle Center' },
  { key: 'category.premium.right', title: 'Premium Bottle Right' },
  { key: 'curated.experiences.hero', title: 'Curated Experiences Hero' },
];

export async function seedStrapi(strapi: Core.Strapi) {
  const globalSettingsExists = await strapi.db
    .query('api::global-settings.global-settings')
    .findMany({ limit: 1 });

  if (!globalSettingsExists || globalSettingsExists.length === 0) {
    await strapi.entityService.create('api::global-settings.global-settings', {
      data: globalSettingsSeed,
    });
  }

  for (const page of pageSeeds) {
    const existing = await strapi.db
      .query('api::page.page')
      .findOne({ where: { slug: page.slug } });

    if (!existing) {
      await strapi.entityService.create('api::page.page', {
        data: page,
      });
    }
  }

  for (const entry of dictionarySeeds) {
    const existing = await strapi.db
      .query('api::dictionary-entry.dictionary-entry')
      .findOne({ where: { key: entry.key } });

    if (!existing) {
      await strapi.entityService.create('api::dictionary-entry.dictionary-entry', {
        data: entry,
      });
    }
  }

  for (const asset of mediaAssetSeeds) {
    const existing = await strapi.db
      .query('api::media-asset.media-asset')
      .findOne({ where: { key: asset.key } });

    if (!existing) {
      await strapi.entityService.create('api::media-asset.media-asset', {
        data: asset,
      });
    }
  }
}
