import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Ticket, Clock } from "lucide-react";
import { events, getEvent, getRelatedEvents } from "@/data/events";
import { siteConfig } from "@/config/siteConfig";
import { ShowArtwork } from "@/components/ui/ShowArtwork";
import { ShareButtons } from "@/components/news/ShareButtons";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: event.description,
    alternates: { canonical: `${siteConfig.url}/events/${event.slug}` },
    openGraph: {
      type: "website",
      title: event.title,
      description: event.description,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const related = getRelatedEvents(event.slug);
  const url = `${siteConfig.url}/events/${event.slug}`;

  const eventLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date,
    endDate: event.endDate || event.date,
    location: {
      "@type": "Place",
      name: event.venue,
      address: event.location,
    },
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  const eventArt = {
    from: "#6f1599",
    to: "#0d0911",
    accent: "#f8f6fb",
    word: "LIVE",
  };

  return (
    <>
      <Script
        id={`jsonld-event-${event.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
      />

      <article className="pt-[150px]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted transition-colors hover:text-lime"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All Events
            </Link>
            <h1 className="display mt-6 text-[clamp(2.2rem,5.5vw,3.8rem)] text-white">
              {event.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{event.description}</p>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="aspect-[16/7] w-full rounded-3xl object-cover"
            />
          ) : (
            <ShowArtwork
              art={eventArt}
              name={event.title}
              className="aspect-[16/7] w-full rounded-3xl"
            />
          )}
        </Reveal>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-violet">
                <Calendar className="h-4 w-4" aria-hidden="true" /> Date & Time
              </h2>
              <p className="mt-3 text-lg font-bold text-white">{formatDate(event.date)}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {formatTime(event.date)}
              </p>
              {event.endDate && (
                <p className="mt-3 text-sm text-muted">
                  Until {formatDate(event.endDate)} at {formatTime(event.endDate)}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-violet">
                <MapPin className="h-4 w-4" aria-hidden="true" /> Venue
              </h2>
              <p className="mt-3 text-lg font-bold text-white">{event.venue}</p>
              <p className="mt-1 text-sm text-muted">{event.location}</p>
            </div>
          </div>

          {event.ticketUrl && (
            <div className="mt-8">
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <Ticket className="h-4 w-4" aria-hidden="true" />
                Get Tickets
              </a>
            </div>
          )}

          {event.isDemo && (
            <div className="mt-8 rounded-2xl border border-magenta/40 bg-magenta/10 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-magenta">
                Demo Event
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                This is a sample event for demonstration purposes. Replace with real events in{" "}
                <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-xs text-white">
                  src/data/events.ts
                </code>
              </p>
            </div>
          )}

          <div className="mt-12 border-t border-line pt-8">
            <ShareButtons url={url} title={event.title} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line bg-surface/40 py-16" aria-label="Related events">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading kicker="More Events" title="You Might Like" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e, i) => (
                <Reveal key={e.slug} delay={i * 0.08}>
                  <Link
                    href={`/events/${e.slug}`}
                    className="group block h-full overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-violet/50"
                  >
                    {e.image ? (
                      <img
                        src={e.image}
                        alt={e.title}
                        className="aspect-[16/9] w-full object-cover"
                      />
                    ) : (
                      <ShowArtwork
                        art={eventArt}
                        name={e.title}
                        className="aspect-[16/9] w-full"
                      />
                    )}
                    <div className="p-5">
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-magenta">
                        {formatDate(e.date)}
                      </p>
                      <h3 className="display mt-2 text-xl text-white transition-colors group-hover:text-lime">
                        {e.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
