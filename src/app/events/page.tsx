import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { EventsExplorer } from "@/components/events/EventsExplorer";
import { SideRail } from "@/components/home/SideRail";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: "Concerts & Events",
  description:
    "Upcoming concerts, live performances and station events from Monsterous Radio — your 24/7 online radio station for the Philippines and North America.",
  alternates: { canonical: `${siteConfig.url}/events` },
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        kicker="What's Happening"
        title={
          <>
            Concerts &amp; <span className="text-gradient-lime">Events</span>
          </>
        }
        description="Live performances, festivals and station events featuring your favorite monster hits."
        image="/studio/news-hero.png"
        imagePosition="object-[70%_22%]"
        compact
      />

      <section
        className="border-y border-line py-14"
        style={{ background: "linear-gradient(180deg, #110618 0%, #0b040f 100%)" }}
        aria-label="Events listing"
      >
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          <div className="min-w-0">
            <EventsExplorer />
          </div>
          <SideRail />
        </div>
      </section>
    </>
  );
}
