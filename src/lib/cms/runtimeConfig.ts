import { siteConfig } from "@/config/siteConfig";
import { getSiteSettings } from "@/lib/cms/content";
import type { RuntimeSiteConfig } from "@/providers/SiteConfigProvider";

export async function getRuntimeSiteConfig(): Promise<RuntimeSiteConfig> {
  const settings = await getSiteSettings();
  const s = settings as Record<string, unknown>;

  return {
    name: String(s.name || siteConfig.name),
    tagline: String(s.tagline || siteConfig.tagline),
    heroHeadline: String(s.heroHeadline || siteConfig.heroHeadline),
    description: String(s.description || siteConfig.description),
    logoUrl: String(s.logoUrl || "/brand/logo.png"),
    mascotUrl: String(s.mascotUrl || "/brand/monster.png"),
    contact: {
      ...siteConfig.contact,
      ...((s.contact as object) || {}),
    },
    social: {
      ...siteConfig.social,
      ...((s.social as object) || {}),
    },
    mediaKitUrl: String(s.mediaKitUrl || siteConfig.mediaKitUrl),
    mediaKitAvailable: Boolean(
      s.mediaKitAvailable !== undefined ? s.mediaKitAvailable : siteConfig.mediaKitAvailable,
    ),
    showAdvertisingPrices: Boolean(
      s.showAdvertisingPrices !== undefined
        ? s.showAdvertisingPrices
        : siteConfig.showAdvertisingPrices,
    ),
    genres: (Array.isArray(s.genres) ? s.genres : siteConfig.genres) as string[],
    url: siteConfig.url,
  };
}
