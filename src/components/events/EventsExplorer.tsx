"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { events } from "@/data/events";
import { Reveal } from "@/components/animations/Reveal";
import { ShowArtwork } from "@/components/ui/ShowArtwork";

/**
 * Events grid with upcoming/past toggle.
 * Similar to NewsExplorer but event-focused.
 */
export function EventsExplorer() {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  const now = new Date();
  const filtered = events.filter((e) => {
    const eventDate = new Date(e.endDate || e.date);
    return filter === "upcoming" ? eventDate >= now : eventDate < now;
  });

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return filter === "upcoming" ? dateA - dateB : dateB - dateA;
  });

  function formatEventDate(iso: string, endIso?: string): string {
    const start = new Date(iso);
    const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };

    if (endIso) {
      const end = new Date(endIso);
      if (start.toDateString() === end.toDateString()) {
        return start.toLocaleDateString("en-US", opts);
      }
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", opts)}`;
    }

    return start.toLocaleDateString("en-US", opts);
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setFilter("upcoming")}
          className={`btn ${filter === "upcoming" ? "btn-primary" : "btn-ghost"}`}
        >
          Upcoming Events
        </button>
        <button
          type="button"
          onClick={() => setFilter("past")}
          className={`btn ${filter === "past" ? "btn-primary" : "btn-ghost"}`}
        >
          Past Events
        </button>
      </div>

      {sorted.length === 0 && (
        <div className="rounded-2xl border border-line bg-surface p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted" aria-hidden="true" />
          <p className="mt-4 text-lg font-bold text-white">
            No {filter} events at the moment
          </p>
          <p className="mt-2 text-sm text-muted">
            Check back soon for new concerts and station events.
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {sorted.map((event, i) => {
          const eventArt = {
            from: "#6f1599",
            to: "#0d0911",
            accent: "#f8f6fb",
            word: "LIVE",
          };

          return (
            <Reveal key={event.slug} delay={i * 0.08}>
              <Link
                href={`/events/${event.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-violet/50"
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="aspect-[16/9] w-full object-cover"
                  />
                ) : (
                  <ShowArtwork
                    art={eventArt}
                    name={event.title}
                    className="aspect-[16/9] w-full"
                  />
                )}
                <div className="p-5">
                  <div className="flex items-center gap-4 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-magenta">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      {formatEventDate(event.date, event.endDate)}
                    </span>
                    {event.ticketUrl && (
                      <span className="flex items-center gap-1.5 text-lime">
                        <Ticket className="h-3 w-3" aria-hidden="true" />
                        Tickets
                      </span>
                    )}
                  </div>
                  <h3 className="display mt-2 text-xl text-white transition-colors group-hover:text-lime">
                    {event.title}
                  </h3>
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>
                      {event.venue} · {event.location}
                    </span>
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
