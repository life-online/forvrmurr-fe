"use client";

import React, { useMemo } from "react";
import type { PageSection } from "@/services/cms";
import { CMSContext, useCMS } from "./CMSContext";

interface PageCMSProviderProps {
  sections: PageSection[] | null | undefined;
  children: React.ReactNode;
}

export default function PageCMSProvider({
  sections,
  children,
}: PageCMSProviderProps) {
  const context = useCMS();

  const sectionMap = useMemo(() => {
    if (!sections) return null;
    return sections.reduce<Record<string, PageSection>>((acc, section) => {
      if (section.key) {
        acc[section.key] = section;
      }
      return acc;
    }, {});
  }, [sections]);

  const value = useMemo(
    () => ({
      globals: context.globals,
      dictionary: context.dictionary,
      mediaAssets: context.mediaAssets,
      sections: sectionMap,
    }),
    [context, sectionMap],
  );

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}
