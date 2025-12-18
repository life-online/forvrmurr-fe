import { cache } from "react";

type FetchOptions = {
  next?: RequestInit["next"];
  cache?: RequestInit["cache"];
  revalidate?: number;
  headers?: HeadersInit;
  query?: Record<string, string | number | boolean | undefined>;
};

const DEFAULT_REVALIDATE = 60;

const STRAPI_BASE_URL =
  process.env.STRAPI_BASE_URL ||
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL ||
  "http://localhost:1337";

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const buildQueryString = (query?: FetchOptions["query"]) => {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    params.append(key, String(value));
  });
  const result = params.toString();
  return result ? `?${result}` : "";
};

async function strapiFetch<T>(
  path: string,
  { query, headers, revalidate = DEFAULT_REVALIDATE }: FetchOptions = {},
): Promise<T> {
  const url = `${STRAPI_BASE_URL}${path}${buildQueryString(query)}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
      ...headers,
    },
    next: { revalidate },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Strapi request failed: ${response.status} ${response.statusText} — ${body}`,
    );
  }

  return response.json() as Promise<T>;
}

export type StrapiImage = {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: Record<string, { url: string; width: number; height: number }>;
};

type StrapiMediaData = {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
      caption?: string;
      width?: number;
      height?: number;
      formats?: Record<string, { url: string; width: number; height: number }>;
    };
  } | null;
};

export type GlobalSettings = {
  id: number;
  attributes: {
    siteName: string;
    siteUrl: string;
    tagline?: string;
    defaultSeo?: any;
    announcement?: any;
    primaryNavigation?: any[];
    accountNavigation?: any[];
    footerDescription?: string;
    footerLinkGroups?: any[];
    footerSocialLinks?: any[];
    supportEmail?: string;
    supportPhone?: string;
    policyLinks?: any[];
    metadata?: Record<string, unknown>;
    updatedAt: string;
  };
};

export type PageSection = {
  id: number;
  __component: string;
  key?: string;
  [key: string]: unknown;
};

export type PageContent = {
  id: number;
  attributes: {
    title: string;
    slug: string;
    seo?: Record<string, unknown>;
    sections: PageSection[];
  };
};

type StrapiResponse<T> = {
  data: T;
};

type StrapiCollectionResponse<T> = {
  data: T[];
};

export const getGlobalSettings = cache(async (): Promise<GlobalSettings | null> => {
  try {
    const result = await strapiFetch<StrapiResponse<GlobalSettings>>(
      "/api/global-settings",
      {
        query: {
          populate: "deep",
        },
      },
    );
    return result.data ?? null;
  } catch (error) {
    console.error("[CMS] Failed to load global settings", error);
    return null;
  }
});

export const getDictionary = cache(async (): Promise<Record<string, string>> => {
  try {
    const result = await strapiFetch<
      StrapiCollectionResponse<{
        id: number;
        attributes: {
          key: string;
          type: "text" | "richtext" | "json";
          textValue?: string | null;
          richTextValue?: string | null;
          jsonValue?: unknown;
        };
      }>
    >("/api/dictionary-entries", {
      query: {
        "pagination[pageSize]": 500,
      },
    });

    const entries: Record<string, string> = {};
    for (const item of result.data) {
      const { key, type, textValue, richTextValue, jsonValue } = item.attributes;
      if (type === "json") {
        entries[key] = JSON.stringify(jsonValue ?? {});
      } else if (type === "richtext") {
        entries[key] = richTextValue ?? "";
      } else {
        entries[key] = textValue ?? "";
      }
    }
    return entries;
  } catch (error) {
    console.error("[CMS] Failed to load dictionary entries", error);
    return {};
  }
});

export const getMediaAssets = cache(
  async (): Promise<Record<string, StrapiMediaData>> => {
    try {
      const result = await strapiFetch<
        StrapiCollectionResponse<{
          id: number;
          attributes: {
            key: string;
            title?: string;
            description?: string;
            asset: StrapiMediaData["data"];
          };
        }>
      >("/api/media-assets", {
        query: {
          populate: "asset",
          "pagination[pageSize]": 200,
        },
      });

      const assets: Record<string, StrapiMediaData> = {};
      for (const item of result.data) {
        assets[item.attributes.key] = {
          data: item.attributes.asset,
        };
      }
      return assets;
    } catch (error) {
      console.error("[CMS] Failed to load media assets", error);
      return {};
    }
  },
);

export const getPageBySlug = cache(async (slug: string): Promise<PageContent | null> => {
  try {
    const result = await strapiFetch<
      StrapiCollectionResponse<PageContent>
    >("/api/pages", {
      query: {
        "filters[slug][$eq]": slug,
        populate: "deep",
      },
    });

    if (!result.data.length) {
      return null;
    }

    return result.data[0];
  } catch (error) {
    console.error(`[CMS] Failed to load page content for slug "${slug}"`, error);
    return null;
  }
});

export const cmsConfig = {
  baseUrl: STRAPI_BASE_URL,
};
