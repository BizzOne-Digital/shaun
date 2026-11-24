import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // CMS-uploaded images are served from /api/uploads/. Google uses the
        // longest matching rule, so this Allow wins over the /api/ Disallow
        // and lets Googlebot fetch logos, show artwork and hero images.
        allow: ["/", "/api/uploads/"],
        disallow: ["/api/", "/admin"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
