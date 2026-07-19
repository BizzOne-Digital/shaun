import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Radio, Clock, Music2, ArrowLeft } from "lucide-react";
import { getShow, getRelatedShows, shows } from "@/data/shows";
import { schedule, dayLabels, dayOrder } from "@/data/schedule";
import { formatTime } from "@/lib/scheduleUtils";
import { siteConfig } from "@/config/siteConfig";
import { ShowArtwork } from "@/components/ui/ShowArtwork";
import { ShowCard } from "@/components/shows/ShowCard";
import { ShowSponsor } from "@/components/advertising";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function generateStaticParams() {
  return shows.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const show = getShow(slug);
  if (!show) return { title: "Show Not Found" };
  return {
    title: `${show.name} — ${show.genre}`,
    description: `${show.tagline} ${show.scheduleSummary} on Monsterous Radio.`,
    alternates: { canonical: `${siteConfig.url}/shows/${show.slug}` },
    openGraph: { title: `${show.name} | Monsterous Radio`, description: show.tagline },
  };
}

/** Builds "Monday 6:00 AM – 2:00 PM" style airtime rows from the schedule data. */
function getAirtimes(slug: string): { day: string; time: string }[] {
  const rows: { day: string; time: string }[] = [];
  for (const day of dayOrder) {
    for (const block of schedule[day]) {
      if (block.showSlug === slug) {
        rows.push({
          day: dayLabels[day],
          time: `${formatTime(block.start)} – ${formatTime(block.end)}`,
        });
      }
    }
  }
  return rows;
}

export default async function ShowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const show = getShow(slug);
  if (!show) notFound();

  const airtimes = getAirtimes(show.slug);
  const related = getRelatedShows(show.slug);

  return (
    <>
      <section className="noir-gradient grain relative overflow-hidden pt-[150px] pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/3 h-[400px] w-[500px] rounded-full opacity-[0.18] blur-[110px]"
          style={{ background: show.art.from }}
        />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(280px,380px)_1fr] lg:items-start lg:px-8">
          <Reveal>
            <ShowArtwork
              art={show.art}
              image={show.image}
              name={show.name}
              className="aspect-square w-full max-w-sm rounded-3xl shadow-[0_40px_80px_-24px_rgba(0,0,0,0.8)]"
              priority
            />
          </Reveal>
          <div>
            <Reveal>
              <Link
                href="/shows"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted transition-colors hover:text-lime"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All Shows
              </Link>
              <div className="mt-5 flex flex-wrap gap-2">
                {show.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-line bg-surface px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-lime"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <h1 className="display mt-5 text-[clamp(2.6rem,6.5vw,4.8rem)] text-white">{show.name}</h1>
              <p className="accent-script mt-2 text-2xl text-limesoft">{show.tagline}</p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{show.description}</p>
              {!show.host && (
                <p className="mt-4 text-xs italic text-muted/70">
                  Host information coming soon.
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/listen" className="btn btn-lime">
                  <Radio className="h-4 w-4" aria-hidden="true" /> Listen Live
                </Link>
                <Link href="/advertise" className="btn btn-magenta">
                  Sponsor This Show
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_minmax(300px,400px)] lg:px-8" aria-label="Air times and sponsorship">
        <Reveal>
          <h2 className="flex items-center gap-2.5 text-sm font-extrabold uppercase tracking-[0.25em] text-violet">
            <Clock className="h-4 w-4" aria-hidden="true" /> Broadcast Times
            <span className="text-[0.6rem] font-bold normal-case tracking-normal text-muted/70">(Philippine Time)</span>
          </h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-line">
            {airtimes.length > 0 ? (
              airtimes.map((row, i) => (
                <div
                  key={`${row.day}-${i}`}
                  className={`flex items-center justify-between px-5 py-3.5 text-sm ${
                    i % 2 === 0 ? "bg-surface/70" : "bg-surface/30"
                  }`}
                >
                  <span className="font-bold text-white">{row.day}</span>
                  <span className="font-mono text-muted">{row.time}</span>
                </div>
              ))
            ) : (
              <p className="bg-surface/60 px-5 py-6 text-sm text-muted">{show.scheduleSummary}</p>
            )}
          </div>
          <p className="mt-3 text-xs text-muted/70">Schedule subject to change.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="flex items-center gap-2.5 text-sm font-extrabold uppercase tracking-[0.25em] text-magenta">
            <Music2 className="h-4 w-4" aria-hidden="true" /> Sponsorship
          </h2>
          <div className="mt-5">
            <ShowSponsor campaign={show.sponsor} showName={show.name} />
          </div>
        </Reveal>
      </section>

      <section className="border-t border-line bg-surface/40 py-20" aria-label="Related shows">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="Keep Exploring" title="More From the Station" />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s, i) => (
              <ShowCard key={s.slug} show={s} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
