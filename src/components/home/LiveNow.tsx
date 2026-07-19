"use client";

import Link from "next/link";
import { Play, Pause, ArrowRight, Loader2 } from "lucide-react";
import { usePlayer } from "@/providers/PlayerProvider";
import { Equalizer } from "@/components/animations/Equalizer";
import { Mascot } from "@/components/ui/Mascot";
import { Reveal } from "@/components/animations/Reveal";
import { formatTime } from "@/lib/scheduleUtils";

function countdownLabel(minutes: number | null): string {
  if (minutes === null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `in ${m} min`;
  return `in ${h}h ${m}m`;
}

/** "Live now" module: current show, spectrum, play button, and next-show countdown. */
export function LiveNow() {
  const { live, isPlaying, status, toggle, hasStream } = usePlayer();
  const current = live?.current;
  const next = live?.next;

  return (
    <section className="relative mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Live now on Monsterous Radio">
      <Reveal>
        <div className="glass relative z-10 grid gap-6 rounded-3xl p-6 sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex items-center gap-5">
            <Mascot className="h-24 w-24 shrink-0 sm:h-28 sm:w-28" />
            <div>
              <p className="flex items-center gap-2 text-[0.65rem] font-extrabold uppercase tracking-[0.28em] text-lime">
                <span aria-hidden="true" className="live-dot h-2 w-2 rounded-full bg-lime" />
                On Air Now
              </p>
              <h2 className="display mt-2 text-2xl text-white sm:text-4xl">
                {current ? current.name : "Monsterous Radio"}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {current
                  ? `${formatTime(current.start)} – ${formatTime(current.end)} Philippine Time · ${current.genre}`
                  : "Loading the live schedule…"}
              </p>
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <Equalizer playing={isPlaying} bars={24} height={44} color="var(--purple-bright)" />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {hasStream ? (
              <button type="button" onClick={toggle} className="btn btn-lime" aria-label={isPlaying ? "Pause live stream" : "Play live stream"}>
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Play className="h-4 w-4" aria-hidden="true" />
                )}
                {isPlaying ? "Pause" : "Listen Now"}
              </button>
            ) : (
              <Link href="/listen" className="btn btn-lime">
                <Play className="h-4 w-4" aria-hidden="true" />
                Listen Now
              </Link>
            )}
            {next && (
              <div className="text-sm text-muted">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-violet">Up Next {countdownLabel(live?.minutesToNext ?? null)}</p>
                <p className="mt-0.5 font-bold text-white">{next.name}</p>
              </div>
            )}
            <Link href="/shows" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-muted transition-colors hover:text-lime">
              Schedule <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
