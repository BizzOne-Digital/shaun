"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Loader2,
  Radio,
  History,
  CalendarClock,
} from "lucide-react";
import { usePlayer } from "@/providers/PlayerProvider";
import { Equalizer } from "@/components/animations/Equalizer";
import { ShowArtwork } from "@/components/ui/ShowArtwork";
import { PlayerAd } from "@/components/advertising";
import { formatTime } from "@/lib/scheduleUtils";

/**
 * Persistent global radio player. Lives in the root layout so audio
 * survives route changes. Docks to the bottom on all viewports;
 * expandable drawer reveals recently played + upcoming show.
 */
export function RadioPlayer() {
  const {
    status,
    isPlaying,
    volume,
    muted,
    expanded,
    live,
    recent,
    hasStream,
    toggle,
    setVolume,
    toggleMute,
    setExpanded,
  } = usePlayer();
  const reduced = useReducedMotion();

  const current = live?.current;
  const next = live?.next;
  const volPercent = Math.round((muted ? 0 : volume) * 100);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40" role="region" aria-label="Monsterous Radio live player">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass mx-auto mb-[-1px] w-full max-w-3xl rounded-t-2xl border-b-0 px-5 py-5 sm:px-7"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.25em] text-lime">
                  <History className="h-3.5 w-3.5" aria-hidden="true" /> Recently Played
                </h3>
                {recent.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {recent.map((t, i) => (
                      <li key={i} className="flex justify-between gap-3 text-sm text-muted">
                        <span className="truncate text-white">{t.title}</span>
                        <span className="shrink-0">{t.time}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Track history will appear here once the stream metadata feed is connected.
                  </p>
                )}
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.25em] text-violet">
                  <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> Up Next
                </h3>
                {next ? (
                  <div className="mt-3 flex items-center gap-3">
                    <ShowArtwork art={next.art} name={next.name} className="h-14 w-14 shrink-0 rounded-lg" />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-white">{next.name}</p>
                      <p className="text-xs text-muted">
                        {formatTime(next.start)} PHT · {next.genre}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">Schedule loading…</p>
                )}
                <Link href="/shows" className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-lime hover:text-limesoft">
                  Full Schedule →
                </Link>
              </div>
            </div>
            <div className="mt-5">
              <PlayerAd />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass border-x-0 border-b-0">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-3 px-3 sm:gap-4 sm:px-6 lg:px-8">
          {/* Artwork + show info */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {current ? (
              <ShowArtwork art={current.art} name={current.name} className="hidden h-12 w-12 shrink-0 rounded-lg sm:flex" />
            ) : (
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-elevated sm:flex">
                <Radio className="h-5 w-5 text-violet" aria-hidden="true" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-lime/10 px-2 py-0.5 text-[0.58rem] font-extrabold uppercase tracking-[0.2em] text-lime">
                  <span aria-hidden="true" className="live-dot h-1.5 w-1.5 rounded-full bg-lime" />
                  Live
                </span>
                <p className="truncate text-sm font-bold text-white">
                  {current ? current.name : "Monsterous Radio"}
                </p>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted">
                {current
                  ? `${formatTime(current.start)} – ${formatTime(current.end)} PHT · ${current.genre}`
                  : "Playin' Your Favorite Monster Hits!"}
              </p>
            </div>
          </div>

          {/* Equalizer (desktop) */}
          <Equalizer playing={isPlaying} bars={7} height={22} className="hidden md:inline-flex" />

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {hasStream ? (
              <button
                type="button"
                onClick={toggle}
                aria-label={isPlaying ? "Pause live stream" : "Play live stream"}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-lime text-black shadow-[0_0_24px_-4px_rgba(182,229,29,0.7)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
              >
                {status === "loading" ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />
                )}
              </button>
            ) : (
              <Link
                href="/listen"
                className="flex h-12 items-center gap-2 rounded-full bg-lime px-5 text-xs font-extrabold uppercase tracking-[0.15em] text-black transition-transform hover:scale-105"
                aria-label="Open the Listen Live page"
              >
                <Radio className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Listen</span>
              </Link>
            )}

            {/* Volume (desktop) */}
            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className="text-muted transition-colors hover:text-white"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={volPercent}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                className="volume w-24"
                style={{ "--vol": `${volPercent}%` } as React.CSSProperties}
                aria-label="Stream volume"
              />
            </div>

            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label={expanded ? "Minimize player" : "Expand player"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-violet hover:text-white"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {status === "error" && (
          <p className="border-t border-line bg-magenta/10 px-4 py-1.5 text-center text-xs text-magenta">
            Stream temporarily unavailable — please try again shortly.
          </p>
        )}
      </div>
    </div>
  );
}
