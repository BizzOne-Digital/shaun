"use client";

import { createContext, useContext } from "react";
import { siteConfig } from "@/config/siteConfig";

export type RuntimeSiteConfig = {
  name: string;
  tagline: string;
  heroHeadline: string;
  description: string;
  logoUrl?: string;
  mascotUrl?: string;
  contact: typeof siteConfig.contact;
  social: typeof siteConfig.social;
  mediaKitUrl: string;
  mediaKitAvailable: boolean;
  showAdvertisingPrices: boolean;
  genres: readonly string[] | string[];
  url: string;
};

const SiteConfigContext = createContext<RuntimeSiteConfig>(siteConfig as RuntimeSiteConfig);

export function SiteConfigProvider({
  value,
  children,
}: {
  value: RuntimeSiteConfig;
  children: React.ReactNode;
}) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
