import type { Metadata } from "next";
import { Anton, Manrope, Caveat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { siteConfig } from "@/config/siteConfig";
import { SiteShell } from "@/components/layout/SiteShell";
import { getRuntimeSiteConfig } from "@/lib/cms/runtimeConfig";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Monsterous Radio",
    "online radio Philippines",
    "24/7 online radio",
    "internet radio station",
    "music radio Philippines",
    "online radio North America",
    "radio advertising Philippines",
    "show sponsorship",
    "streaming radio",
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: "/brand/logo.png", width: 540, height: 200, alt: "Monsterous Radio logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/brand/logo.png"],
  },
  alternates: { canonical: siteConfig.url },
  icons: { icon: "/brand/logo.png" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RadioStation",
      name: siteConfig.name,
      url: siteConfig.url,
      slogan: siteConfig.tagline,
      description: siteConfig.description,
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      areaServed: ["Philippines", "North America"],
      sameAs: [siteConfig.social.facebook],
      logo: `${siteConfig.url}/brand/logo.png`,
    },
    {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/brand/logo.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phone,
        email: siteConfig.contact.email,
        contactType: "customer service",
      },
      sameAs: [siteConfig.social.facebook],
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const runtimeConfig = await getRuntimeSiteConfig();

  return (
    <html lang="en" className={`${anton.variable} ${manrope.variable} ${caveat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Script
          id="jsonld-station"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteShell config={runtimeConfig}>{children}</SiteShell>
      </body>
    </html>
  );
}
