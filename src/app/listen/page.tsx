import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ListenExperience } from "@/components/player/ListenExperience";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: "Listen Live",
  description:
    "Listen live to Monsterous Radio — 24/7 online radio streaming Pop, Rock, OPM, K-Pop, Reggae and more to the Philippines and North America.",
  alternates: { canonical: `${siteConfig.url}/listen` },
};

export default function ListenPage() {
  return (
    <>
      <PageHero
        kicker="Live Stream"
        title={
          <>
            Listen <span className="text-gradient-lime">Live</span>
          </>
        }
        description="The monster never sleeps. Tune in from anywhere — the player follows you across the whole site."
        compact
      />
      <div className="pt-12">
        <ListenExperience />
      </div>
    </>
  );
}
