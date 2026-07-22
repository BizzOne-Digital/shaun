"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Loader2,
  Volume2,
  VolumeX,
  Share2,
  Check,
  CalendarDays,
  Smartphone,
  MonitorSpeaker,
} from "lucide-react";
import { usePlayer } from "@/providers/PlayerProvider";
import { Equalizer } from "@/components/animations/Equalizer";
import { ShowArtwork } from "@/components/ui/ShowArtwork";
import { Reveal } from "@/components/animations/Reveal";
import { formatTime } from "@/lib/scheduleUtils";
import { siteConfig } from "@/config/siteConfig";
import { SidebarAd } from "@/components/advertising";
import {
  SpacialPlayer,
  SpacialChat,
  SpacialHistory,
} from "@/components/player/SpacialEmbeds";

/** Immersive full-page listening experience for /listen. */
export function ListenExperience() {
  const { live, isPlaying, status, toggle, hasStream, volume, muted, setVolume, toggleMute } =
    usePlayer();
  const [shared, setShared] = useState(false);
  const current = live?.current;
  const next = live?.next;
  const volPercent = Math.round((muted ? 0 : volume) * 100);

  const share = async () => {
    const data = {
      title: "Monsterous Radio",
      text: "Listen live to Monsterous Radio — Playin' Your Favorite Monster Hits!",
      url: siteConfig.url + "/listen",
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(data.url);
        setShared(true);
        setTimeout(() => setShared(false), 2200);
      }
    } catch {
      // user dismissed the share sheet
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
      {/* Main player card */}
      <Reveal>
        <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full opacity-20 blur-[90px]"
            style={{ background: current?.art.from ?? "var(--purple)" }}
          />
          <div className="relative z-10 flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            {current ? (
              <ShowArtwork
                art={current.art}
                name={current.name}
                className="aspect-square w-56 shrink-0 rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] sm:w-64"
              />
            ) : (
              <div className="aspect-square w-56 shrink-0 animate-pulse rounded-2xl bg-elevated sm:w-64" />
            )}
            <div className="w-full text-center sm:text-left">
              <p className="flex items-center justify-center gap-2 text-[0.65rem] font-extrabold uppercase tracking-[0.28em] text-lime sm:justify-start">
                <span aria-hidden="true" className="live-dot h-2 w-2 rounded-full bg-lime" />
                Live Broadcast
              </p>
              <h2 className="display mt-3 text-4xl text-white sm:text-5xl">
                {current ? current.name : "Monsterous Radio"}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {current
                  ? `${formatTime(current.start)} – ${formatTime(current.end)} PHT · ${current.genre}`
                  : siteConfig.tagline}
              </p>

              {hasStream && (
                <div className="mt-7 flex flex-col items-center gap-5 sm:items-start">
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      onClick={toggle}
                      aria-label={isPlaying ? "Pause live stream" : "Play live stream"}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-lime text-black shadow-[0_0_50px_-8px_rgba(182,229,29,0.8)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                    >
                      {status === "loading" ? (
                        <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
                      ) : isPlaying ? (
                        <Pause className="h-8 w-8" aria-hidden="true" />
                      ) : (
                        <Play className="ml-1 h-8 w-8" aria-hidden="true" />
                      )}
                    </button>
                    <Equalizer playing={isPlaying} bars={16} height={40} color="var(--purple-bright)" />
                  </div>
                  <div className="flex w-full max-w-xs items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={muted ? "Unmute" : "Mute"}
                      className="text-muted hover:text-white"
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
                      className="volume flex-1"
                      style={{ "--vol": `${volPercent}%` } as React.CSSProperties}
                      aria-label="Stream volume"
                    />
                    <span className="w-9 text-right font-mono text-xs text-muted">{volPercent}%</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={share}
                className="btn btn-ghost mt-6 !px-4 !py-2 text-[0.65rem]"
              >
                {shared ? (
                  <Check className="h-3.5 w-3.5 text-lime" aria-hidden="true" />
                ) : (
                  <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {shared ? "Link Copied!" : "Share the Station"}
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#150920]">
            <p className="border-b border-white/10 px-4 py-2 text-[0.62rem] font-extrabold uppercase tracking-[0.22em] text-lime">
              Live Player
            </p>
            <div className="p-3 sm:p-4">
              <SpacialPlayer />
            </div>
          </div>
        </div>
      </Reveal>

      <div className="space-y-6">
        <Reveal delay={0.1}>
          <div className="card-surface rounded-2xl p-6">
            <h3 className="flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.25em] text-violet">
              <CalendarDays className="h-4 w-4" aria-hidden="true" /> Up Next
            </h3>
            {next ? (
              <div className="mt-4 flex items-center gap-4">
                <ShowArtwork art={next.art} name={next.name} className="h-16 w-16 shrink-0 rounded-xl" />
                <div>
                  <p className="font-bold text-white">{next.name}</p>
                  <p className="text-xs text-muted">
                    {formatTime(next.start)} PHT · {next.genre}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">Loading schedule…</p>
            )}
            <Link
              href="/shows"
              className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-lime hover:text-limesoft"
            >
              View Full Schedule →
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#150920]">
            <div className="border-b border-white/10 px-5 py-3">
              <h3 className="text-[0.68rem] font-extrabold uppercase tracking-[0.25em] text-lime">
                Recently Played
              </h3>
            </div>
            <div className="p-3 sm:p-4">
              <SpacialHistory />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#150920]">
            <div className="border-b border-white/10 px-5 py-3">
              <h3 className="text-[0.68rem] font-extrabold uppercase tracking-[0.25em] text-lime">
                Chat with the DJ
              </h3>
              <p className="mt-1 text-[0.65rem] text-muted">Send a message while you listen live.</p>
            </div>
            <div className="p-3 sm:p-4">
              <SpacialChat />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="card-surface rounded-2xl p-6 text-sm leading-relaxed text-muted">
            <h3 className="flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.25em] text-white">
              <Smartphone className="h-4 w-4 text-lime" aria-hidden="true" /> Listening on Mobile
            </h3>
            <p className="mt-3">
              Use the live player above to tune in. For the best experience use Chrome, Safari or
              Firefox.
            </p>
            <h3 className="mt-5 flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.25em] text-white">
              <MonitorSpeaker className="h-4 w-4 text-lime" aria-hidden="true" /> Browser Support
            </h3>
            <p className="mt-3">
              Monsterous Radio streams via Spacial SAM Cloud — no plugins needed. All current
              desktop and mobile browsers are supported.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <SidebarAd />
        </Reveal>
      </div>
    </div>
  );
}
