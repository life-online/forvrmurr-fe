"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { PageSection, StrapiImage } from "@/services/cms";

type MediaAsset = {
  url: string;
  alternativeText?: string;
  formats?: StrapiImage["formats"];
};

type CMSContextValue = {
  globals: Record<string, unknown> | null;
  dictionary: Record<string, string>;
  mediaAssets: Record<string, MediaAsset>;
  sections: Record<string, PageSection> | null;
};

export const CMSContext = createContext<CMSContextValue>({
  globals: null,
  dictionary: {},
  mediaAssets: {},
  sections: null,
});

type CMSProviderProps = {
  children: React.ReactNode;
  globals: Record<string, unknown> | null;
  dictionary: Record<string, string>;
  mediaAssets: Record<
    string,
    {
      data: {
        attributes: {
          url: string;
          alternativeText?: string;
          formats?: StrapiImage["formats"];
        };
      } | null;
    }
  >;
  sections?: PageSection[] | null;
};

const buildMediaMap = (
  assets: CMSProviderProps["mediaAssets"],
): Record<string, MediaAsset> => {
  const result: Record<string, MediaAsset> = {};
  if (!assets) return result;
  for (const [key, value] of Object.entries(assets)) {
    const media = value?.data?.attributes;
    if (media?.url) {
      result[key] = {
        url: media.url.startsWith("http")
          ? media.url
          : `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL || process.env.STRAPI_BASE_URL || ""}${media.url}`,
        alternativeText: media.alternativeText,
        formats: media.formats,
      };
    }
  }
  return result;
};

export const CMSProvider = ({
  children,
  globals,
  dictionary,
  mediaAssets,
  sections,
}: CMSProviderProps) => {
  const mediaMap = useMemo(() => buildMediaMap(mediaAssets), [mediaAssets]);
  const sectionMap = useMemo(() => {
    if (!sections) return null;
    return sections.reduce<Record<string, PageSection>>((acc, section) => {
      if (section.key) {
        acc[section.key] = section;
      }
      return acc;
    }, {});
  }, [sections]);

  const value = useMemo<CMSContextValue>(
    () => ({
      globals,
      dictionary,
      mediaAssets: mediaMap,
      sections: sectionMap,
    }),
    [dictionary, globals, mediaMap, sectionMap],
  );

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
};

export const useCMS = () => useContext(CMSContext);

export const useCmsText = (key: string, fallback = ""): string => {
  const { dictionary } = useCMS();
  return dictionary[key] ?? fallback;
};

export const useCmsMedia = (key: string): MediaAsset | null => {
  const { mediaAssets } = useCMS();
  return mediaAssets[key] ?? null;
};

export const useCmsSection = (key: string): PageSection | null => {
  const { sections } = useCMS();
  return sections?.[key] ?? null;
};
