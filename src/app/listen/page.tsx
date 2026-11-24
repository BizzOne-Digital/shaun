import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ListenExperience } from "@/components/player/ListenExperience";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: "Listen Live: Online Radio",
  description:
    "Stream Monsterous Radio live online, 24/7. Pop, Rock, OPM, K-Pop and Reggae. Press play and listen free.",
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
