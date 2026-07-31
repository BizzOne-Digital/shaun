import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { NewsExplorer } from "@/components/news/NewsExplorer";
import { SideRail } from "@/components/home/SideRail";
import { siteConfig } from "@/config/siteConfig";
import { getCmsPage, getSection } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "News & Features",
  description:
    "Music news, station updates and features from Monsterous Radio — your 24/7 online radio station for the Philippines and North America.",
  alternates: { canonical: `${siteConfig.url}/news` },
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const page = await getCmsPage("news");
  const hero = getSection(page, "hero");

  return (
    <>
      <PageHero
        kicker="Editorial"
        title={hero?.headline || (
          <>
            News &amp; <span className="text-gradient-lime">Features</span>
          </>
        )}
        description={
          hero?.body ||
          "Station updates, programming stories and music features from the Monsterous Radio team."
        }
        image={hero?.image || "/studio/news-hero.png"}
        imagePosition="object-[70%_22%]"
        compact
      />

      {/* Reference-style content grid: stories left · Top Hits / Listen Live / ad right */}
      <section
        className="border-y border-line py-14"
        style={{ background: "linear-gradient(180deg, #110618 0%, #0b040f 100%)" }}
        aria-label="News articles"
      >
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          <div className="min-w-0">
            <NewsExplorer />
          </div>
          <SideRail />
        </div>
      </section>
    </>
  );
}
