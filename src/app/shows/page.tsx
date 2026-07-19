import type { Metadata } from "next";
import Image from "next/image";
import { ScheduleExplorer } from "@/components/schedule/ScheduleExplorer";
import { ShowsGrid } from "@/components/shows/ShowsGrid";
import { ShowCard } from "@/components/shows/ShowCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/animations/Reveal";
import { TopBannerAd } from "@/components/advertising";
import { shows } from "@/data/shows";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: "Shows & Schedule",
  description:
    "Explore the full Monsterous Radio weekly schedule — every genre, every mood, every day. Live now indicators, Philippine Time and local time conversion.",
  alternates: { canonical: `${siteConfig.url}/shows` },
};

export default function ShowsPage() {
  return (
    <>
      {/* ── HERO — live DJ arena backdrop ── */}
      <section className="relative overflow-hidden pt-[150px]" aria-label="Programming and shows">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/studio/shows-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_center]"
          />
          {/* readability overlays — dark from the left, vignette top/bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(5,4,7,0.94) 0%, rgba(5,4,7,0.82) 30%, rgba(5,4,7,0.42) 60%, rgba(5,4,7,0.1) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,4,7,0.85) 0%, transparent 30%, transparent 62%, rgba(11,4,15,0.98) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <Stagger className="max-w-3xl py-6 lg:py-10">
            <StaggerItem>
              <p className="kicker flex items-center gap-3">
                <span aria-hidden="true" className="live-dot inline-block h-2 w-2 rounded-full bg-lime" />
                24/7 Programming · Philippine Time
              </p>
            </StaggerItem>
            <StaggerItem>
              <h1 className="display mt-5 text-[clamp(2.4rem,7vw,5rem)] leading-[0.95]">
                <span className="block text-white">Programming &amp;</span>
                <span className="text-gradient-lime block">Shows</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                Monsterous Radio delivers diverse 24/7 programming across Reggae, Lite Rock, Rock,
                Pop and more — connecting listeners in the Philippines and North America with the
                perfect soundtrack for every moment.
              </p>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* ── Reference-style schedule grid + sidebar ── */}
      <ShowsGrid />

      {/* ── Full interactive schedule ── */}
      <section
        id="full-schedule"
        className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8"
        aria-label="Full weekly schedule"
      >
        <SectionHeading
          kicker="Full Schedule"
          title="The Complete Week"
          description="Browse every day, filter by genre, search shows and convert air times to your local timezone."
        />
        <div className="mt-10">
          <ScheduleExplorer />
        </div>
      </section>

      {/* ── All shows ── */}
      <section className="border-t border-line bg-surface/40 py-20" aria-label="All shows">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="The Lineup"
            title="Every Show on the Station"
            description="Tap any show for air times, genre details and sponsorship opportunities."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shows.map((show, i) => (
              <ShowCard key={show.slug} show={show} index={i} />
            ))}
          </div>
          <div className="mt-14">
            <TopBannerAd />
          </div>
        </div>
      </section>
    </>
  );
}
