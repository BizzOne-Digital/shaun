import Link from "next/link";
import { Moon, Sparkles, Target, Users, RadioTower, Megaphone, ArrowRight } from "lucide-react";
import { shows } from "@/data/shows";
import { schedule } from "@/data/schedule";
import { formatTime, resolveBlock } from "@/lib/scheduleUtils";
import { ShowArtwork } from "@/components/ui/ShowArtwork";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { Reveal } from "@/components/animations/Reveal";
import { SideRail } from "@/components/home/SideRail";
import type { DayKey } from "@/types";

/** Featured show display meta (days + airtime shown on the cards). */
const FEATURED: { slug: string; days: string; time: string }[] = [
  { slug: "sunday-reggae-sunsplash", days: "Every Sunday", time: "9:00 AM – 4:00 PM" },
  { slug: "lite-heart", days: "Daily", time: "3:00 AM – 6:00 AM" },
  { slug: "rock-this-time", days: "Nightly (except Friday)", time: "6:00 PM – 9:00 PM" },
  { slug: "the-daily-dose", days: "Mon–Thu & Saturday", time: "6:00 AM – 2:00 PM" },
];

const FEATURED_SLUGS = new Set(FEATURED.map((f) => f.slug));

/** Compact schedule-block card used inside the programming rows. */
function BlockCard({ day, index }: { day: DayKey; index: number }) {
  const block = resolveBlock(schedule[day][index]);
  const show = shows.find((s) => s.slug === block.showSlug);
  const featured = FEATURED_SLUGS.has(block.showSlug);

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white/85"
        style={{ background: `linear-gradient(135deg, ${block.art.from}, ${block.art.to})` }}
      >
        {block.start >= "21:00" || block.end <= "06:00" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.62rem] font-bold uppercase tracking-[0.14em] text-lime">
          {formatTime(block.start)} – {formatTime(block.end)}
        </span>
        <span className="mt-0.5 block truncate text-[0.82rem] font-extrabold text-white transition-colors group-hover:text-lime">
          {block.name}
        </span>
        <span className="block truncate text-[0.65rem] text-muted">{block.genre}</span>
      </span>
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${featured ? "bg-lime" : "bg-violet"}`}
        title={featured ? "Featured show" : "Regular show"}
      />
    </>
  );

  const className =
    "group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#150920] px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet/60 hover:shadow-[0_14px_34px_-14px_rgba(83,16,122,0.6)]";

  return show ? (
    <Link href={`/shows/${show.slug}`} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}

function ProgrammingRow({ label, day }: { label: string; day: DayKey }) {
  return (
    <div>
      <p className="mb-2.5 flex items-center gap-2 text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-muted">
        <span aria-hidden="true" className="h-px w-6 bg-magenta/70" />
        {label}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {schedule[day].map((_, i) => (
          <BlockCard key={`${day}-${i}`} day={day} index={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Shows & Schedule content grid (styled after the client's reference design):
 * left — featured shows, weekday / Friday / weekend programming, advertise-by-show
 * strip · right — Top Hits, Listen Live promo, ad space.
 */
export function ShowsGrid() {
  const featured = FEATURED.map((f) => ({
    ...f,
    show: shows.find((s) => s.slug === f.slug)!,
  }));

  return (
    <section
      className="border-y border-line py-14"
      style={{ background: "linear-gradient(180deg, #110618 0%, #0b040f 100%)" }}
      aria-label="Weekly schedule overview"
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        {/* ── LEFT COLUMN ── */}
        <div className="min-w-0 space-y-8">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="display text-2xl tracking-wide text-white">Weekly Schedule</h2>
                <p className="mt-1 text-xs text-muted">
                  Your round-the-clock mix of monster hits · all times Philippine Time
                </p>
              </div>
              <div className="flex items-center gap-4 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-lime" /> Featured Show
                </span>
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-violet" /> Regular Show
                </span>
              </div>
            </div>
          </Reveal>

          {/* Featured shows */}
          <Reveal>
            <PanelHeader title="Featured Shows" href="#full-schedule" linkLabel="Full Schedule" />
            <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featured.map(({ show, days, time }) => (
                <Link
                  key={show.slug}
                  href={`/shows/${show.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#150920] transition-all duration-300 hover:-translate-y-1 hover:border-violet/60 hover:shadow-[0_18px_44px_-14px_rgba(83,16,122,0.6)]"
                >
                  <ShowArtwork
                    art={show.art}
                    image={show.image}
                    name={show.name}
                    className="aspect-square w-full shrink-0 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="flex flex-1 flex-col px-3.5 py-3">
                    <h3 className="truncate text-sm font-extrabold text-white transition-colors group-hover:text-lime">
                      {show.shortName ?? show.name}
                    </h3>
                    <p className="mt-0.5 text-[0.68rem] text-muted">{days}</p>
                    <p className="mt-1 text-[0.68rem] font-bold tracking-wide text-lime">{time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Weekday programming */}
          <Reveal delay={0.05}>
            <PanelHeader title="Weekday Programming" sub="(Mon – Thu)" />
            <div className="mt-4">
              <ProgrammingRow label="Monday to Thursday" day="monday" />
            </div>
          </Reveal>

          {/* Friday programming */}
          <Reveal delay={0.05}>
            <PanelHeader title="Friday Programming" sub="(Golds all day)" />
            <div className="mt-4">
              <ProgrammingRow label="Friday" day="friday" />
            </div>
          </Reveal>

          {/* Weekend programming */}
          <Reveal delay={0.05}>
            <PanelHeader title="Weekend Programming" sub="(Sat – Sun)" />
            <div className="mt-4 space-y-6">
              <ProgrammingRow label="Saturday" day="saturday" />
              <ProgrammingRow label="Sunday" day="sunday" />
            </div>
          </Reveal>

          {/* Evolving banner */}
          <Reveal delay={0.05}>
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-lime/25 bg-gradient-to-r from-[#1a2604]/60 via-[#150920] to-[#150920] px-5 py-4 sm:flex-row sm:items-center">
              <div>
                <p className="display text-lg tracking-wide text-lime">
                  New Shows. New Vibes. Always Evolving.
                </p>
                <p className="mt-1 text-xs text-muted">
                  We&apos;re always refining the lineup — check the full interactive schedule below.
                </p>
              </div>
              <a href="#full-schedule" className="btn btn-lime shrink-0 text-xs">
                See Full Schedule
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </Reveal>

          {/* Why advertise by show */}
          <Reveal delay={0.05}>
            <div className="rounded-xl border border-white/10 bg-[#150920] px-5 py-6">
              <h2 className="display text-center text-xl tracking-wide text-white">
                Why Advertise by Show?
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {[
                  {
                    icon: Target,
                    title: "Niche Targeting",
                    text: "Reach highly engaged audiences through specific shows that match your brand and message.",
                  },
                  {
                    icon: Users,
                    title: "Engaged Listeners",
                    text: "Our listeners tune in daily and build loyal connections with their favorite shows and hosts.",
                  },
                  {
                    icon: RadioTower,
                    title: "Cross-Genre Reach",
                    text: "From Reggae to Rock, Pop to Lite Rock — your brand gets exposure across multiple genres and regions.",
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="text-center">
                    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-lime/40 bg-lime/10 text-lime">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 text-sm font-extrabold text-white">{title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Sponsor CTA strip */}
          <Reveal delay={0.05}>
            <div
              className="flex flex-col items-start justify-between gap-4 rounded-xl px-6 py-5 sm:flex-row sm:items-center"
              style={{ background: "linear-gradient(90deg, #a1147c 0%, #53107a 100%)" }}
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/25 text-lime">
                  <Megaphone className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="display text-lg tracking-wide text-white">
                    Become a Part of the Monsterous Family.
                  </p>
                  <p className="mt-0.5 text-xs text-white/75">
                    Sponsor a show or run targeted ads that connect your brand with loyal listeners
                    in the Philippines and North America.
                  </p>
                </div>
              </div>
              <Link href="/advertise" className="btn btn-lime shrink-0 text-xs">
                Sponsor a Show
              </Link>
            </div>
          </Reveal>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <SideRail />
      </div>
    </section>
  );
}
