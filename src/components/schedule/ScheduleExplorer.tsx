"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Search, AlertCircle } from "lucide-react";
import { dayLabels, dayOrder } from "@/data/schedule";
import type { DayKey } from "@/types";
import {
  formatTime,
  getDaySchedule,
  getPhilippineNow,
  phToLocal,
  toMinutes,
  type ResolvedBlock,
} from "@/lib/scheduleUtils";
import { Equalizer } from "@/components/animations/Equalizer";
import { ShowArtwork } from "@/components/ui/ShowArtwork";
import { shows } from "@/data/shows";

const GENRE_FILTERS = ["All", ...Array.from(new Set(shows.map((s) => s.genre)))];

/**
 * Interactive weekly schedule: seven day tabs, PHT/local toggle,
 * genre filter, show search, live-row glow and next-show countdown.
 */
export function ScheduleExplorer() {
  const [selectedDay, setSelectedDay] = useState<DayKey | null>(null);
  const [localTime, setLocalTime] = useState(false);
  const [genre, setGenre] = useState("All");
  const [search, setSearch] = useState("");
  const [now, setNow] = useState<{ day: DayKey; minutes: number } | null>(null);

  useEffect(() => {
    const compute = () => {
      const { day, minutes } = getPhilippineNow();
      setNow({ day, minutes });
      setSelectedDay((prev) => prev ?? day);
    };
    compute();
    const id = setInterval(compute, 30_000);
    return () => clearInterval(id);
  }, []);

  const day: DayKey = selectedDay ?? "monday";
  const blocks = useMemo(() => getDaySchedule(day), [day]);

  const filtered = useMemo(() => {
    return blocks.filter((b) => {
      const show = shows.find((s) => s.slug === b.showSlug);
      const matchesGenre = genre === "All" || show?.genre === genre;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q || b.name.toLowerCase().includes(q) || b.genre.toLowerCase().includes(q);
      return matchesGenre && matchesSearch;
    });
  }, [blocks, genre, search]);

  const isLive = (b: ResolvedBlock) =>
    now !== null &&
    now.day === day &&
    now.minutes >= toMinutes(b.start) &&
    now.minutes < toMinutes(b.end);

  const nextBlock = useMemo(() => {
    if (!now || now.day !== day) return null;
    return blocks.find((b) => toMinutes(b.start) > now.minutes) ?? null;
  }, [blocks, now, day]);

  const time = (hhmm: string) => (localTime ? phToLocal(hhmm) : formatTime(hhmm));

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Day tabs */}
        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0 lg:pb-0"
          role="tablist"
          aria-label="Day of the week"
        >
          {dayOrder.map((d) => {
            const active = d === day;
            const isToday = now?.day === d;
            return (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedDay(d)}
                className={`relative shrink-0 rounded-full border px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-lime bg-lime text-black"
                    : "border-line text-muted hover:border-violet hover:text-white"
                }`}
              >
                {dayLabels[d]}
                {isToday && (
                  <span
                    aria-label="today"
                    className={`ml-2 inline-block h-1.5 w-1.5 rounded-full ${active ? "bg-black" : "live-dot bg-lime"}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setLocalTime((v) => !v)}
          aria-pressed={localTime}
          className="btn btn-ghost shrink-0 !px-4 !py-2 text-[0.65rem]"
        >
          <Globe className="h-3.5 w-3.5" aria-hidden="true" />
          {localTime ? "Your Local Time" : "Philippine Time (GMT+8)"}
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <label htmlFor="schedule-search" className="sr-only">
            Search shows
          </label>
          <input
            id="schedule-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shows or genres…"
            className="field !pl-11"
          />
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {GENRE_FILTERS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(g)}
              aria-pressed={genre === g}
              className={`shrink-0 rounded-full border px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.15em] transition-colors ${
                genre === g
                  ? "border-magenta bg-magenta/15 text-magenta"
                  : "border-line text-muted hover:text-white"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Countdown */}
      {nextBlock && (
        <p className="mt-6 text-sm text-muted">
          <span className="font-bold uppercase tracking-[0.2em] text-violet">Up next:</span>{" "}
          <span className="font-bold text-white">{nextBlock.name}</span> at {time(nextBlock.start)}
        </p>
      )}

      {/* Timeline */}
      <div className="mt-8 space-y-3">
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-line bg-surface/60 px-6 py-10 text-center text-muted">
            No shows match your filters on {dayLabels[day]}. Try clearing the search or genre filter.
          </p>
        )}
        {filtered.map((block) => {
          const live = isLive(block);
          return (
            <motion.div
              key={`${day}-${block.start}-${block.showSlug}`}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`grid grid-cols-[auto_1fr] items-center gap-4 rounded-2xl border p-4 transition-colors sm:grid-cols-[170px_64px_1fr_auto] sm:p-5 ${
                live
                  ? "border-lime/50 bg-lime/[0.06] shadow-[0_0_44px_-12px_rgba(182,229,29,0.4)]"
                  : "border-line bg-surface/60 hover:border-white/20"
              }`}
            >
              <div className={`font-mono text-sm ${live ? "text-lime" : "text-muted"}`}>
                <p>{time(block.start)}</p>
                <p className="opacity-60">{time(block.end)}</p>
              </div>
              <ShowArtwork
                art={block.art}
                image={block.image}
                name={block.name}
                className="h-14 w-14 shrink-0 rounded-xl sm:h-16 sm:w-16"
                sizes="64px"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {block.slugExists ? (
                    <Link
                      href={`/shows/${block.showSlug}`}
                      className="display text-xl text-white transition-colors hover:text-lime sm:text-2xl"
                    >
                      {block.name}
                    </Link>
                  ) : (
                    <span className="display text-xl text-white sm:text-2xl">{block.name}</span>
                  )}
                  <span className="rounded-full border border-line px-2.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-muted">
                    {block.genre}
                  </span>
                  {block.needsConfirmation && (
                    <span className="flex items-center gap-1 rounded-full border border-magenta/40 bg-magenta/10 px-2.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-magenta">
                      <AlertCircle className="h-3 w-3" aria-hidden="true" /> To be confirmed
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-muted">{block.tagline}</p>
              </div>
              {live && (
                <span className="col-span-2 flex items-center gap-2 text-[0.62rem] font-extrabold uppercase tracking-[0.25em] text-lime sm:col-span-1">
                  <Equalizer playing bars={4} height={13} />
                  Live Now
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted/70">
        All times shown in {localTime ? "your local time" : "Philippine Time (GMT+8)"}. Schedule
        subject to change.
      </p>
    </div>
  );
}
