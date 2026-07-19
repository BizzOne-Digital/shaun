"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Equalizer } from "@/components/animations/Equalizer";
import {
  formatTime,
  getDaySchedule,
  getPhilippineNow,
  phToLocal,
  toMinutes,
  type ResolvedBlock,
} from "@/lib/scheduleUtils";
import { dayLabels } from "@/data/schedule";
import type { DayKey } from "@/types";

/** Today's schedule strip: live block highlighted + the next four programs. */
export function TodaySchedule() {
  const [state, setState] = useState<{
    day: DayKey;
    blocks: ResolvedBlock[];
    nowMinutes: number;
  } | null>(null);
  const [localTime, setLocalTime] = useState(false);

  useEffect(() => {
    const compute = () => {
      const { day, minutes } = getPhilippineNow();
      setState({ day, blocks: getDaySchedule(day), nowMinutes: minutes });
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, []);

  const liveIndex = state
    ? state.blocks.findIndex(
        (b) => state.nowMinutes >= toMinutes(b.start) && state.nowMinutes < toMinutes(b.end)
      )
    : -1;

  const visible = state
    ? state.blocks.slice(Math.max(liveIndex, 0), Math.max(liveIndex, 0) + 5)
    : [];

  const time = (hhmm: string) => (localTime ? phToLocal(hhmm) : formatTime(hhmm));

  return (
    <section className="border-y border-line bg-surface/40 py-24" aria-label="Today's schedule">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker={state ? dayLabels[state.day] : "Today"}
            title="Today on the Station"
          />
          <Reveal delay={0.1}>
            <button
              type="button"
              onClick={() => setLocalTime((v) => !v)}
              className="btn btn-ghost !px-4 !py-2 text-[0.65rem]"
              aria-pressed={localTime}
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              {localTime ? "Showing Your Local Time" : "Showing Philippine Time"}
            </button>
          </Reveal>
        </div>

        <div className="mt-10 space-y-3">
          {state
            ? visible.map((block, i) => {
                const isLive = i === 0 && liveIndex >= 0;
                return (
                  <Reveal key={`${block.start}-${block.showSlug}`} delay={i * 0.06}>
                    <div
                      className={`flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border px-5 py-4 transition-colors sm:px-7 ${
                        isLive
                          ? "border-lime/50 bg-lime/[0.06] shadow-[0_0_40px_-12px_rgba(182,229,29,0.35)]"
                          : "border-line bg-surface/60 hover:border-white/20"
                      }`}
                    >
                      <span className={`w-40 shrink-0 font-mono text-sm ${isLive ? "text-lime" : "text-muted"}`}>
                        {time(block.start)} – {time(block.end)}
                      </span>
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        {block.slugExists ? (
                          <Link
                            href={`/shows/${block.showSlug}`}
                            className={`display truncate text-xl transition-colors hover:text-lime sm:text-2xl ${
                              isLive ? "text-white" : "text-white/85"
                            }`}
                          >
                            {block.name}
                          </Link>
                        ) : (
                          <span className="display truncate text-xl text-white/85 sm:text-2xl">{block.name}</span>
                        )}
                        <span className="hidden rounded-full border border-line px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted sm:inline">
                          {block.genre}
                        </span>
                      </div>
                      {isLive && (
                        <span className="flex items-center gap-2 text-[0.62rem] font-extrabold uppercase tracking-[0.25em] text-lime">
                          <Equalizer playing bars={4} height={13} />
                          Live Now
                        </span>
                      )}
                    </div>
                  </Reveal>
                );
              })
            : Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-[68px] animate-pulse rounded-2xl border border-line bg-surface/60" />
              ))}
        </div>

        <Reveal delay={0.2} className="mt-8">
          <Link href="/shows" className="btn btn-outline">
            Full Weekly Schedule <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
