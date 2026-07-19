import Link from "next/link";
import Image from "next/image";
import { Play, Music } from "lucide-react";
import { topHits } from "@/data/topHits";
import { Reveal } from "@/components/animations/Reveal";
import { SidebarAd } from "@/components/advertising";

/**
 * Set to true after replacing public/brand/listen-live-bg.png with the
 * clean (text-free) mascot background — the card will then render the
 * "Listen Live!" text, play button and bottom strip on top of the image.
 */
const HAS_CLEAN_BG = true;

/**
 * Shared right sidebar (reference design): Top Hits chart,
 * Listen Live mascot promo and the 300×250 advertisement space.
 * Used on the homepage grid and the Shows & Schedule page.
 */
export function SideRail() {
  return (
    <aside className="space-y-5">
      {/* Top hits */}
      <Reveal delay={0.1}>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#150920]">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#53107a] to-[#2e0946] px-4 py-2.5">
            <h2 className="display text-base tracking-wide text-white">Top Hits</h2>
            <Link
              href="/listen"
              className="text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-lime hover:text-limesoft"
            >
              View All
            </Link>
          </div>
          <ol className="divide-y divide-white/[0.06]">
            {topHits.map((hit) => (
              <li key={hit.rank}>
                <Link href="/listen" className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.04]">
                  <span className="w-4 shrink-0 text-center font-mono text-sm font-bold text-lime">
                    {hit.rank}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                    style={{ background: `linear-gradient(135deg, ${hit.from}, ${hit.to})` }}
                  >
                    <Music className="h-4 w-4 text-white/80" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8rem] font-bold text-white">{hit.title}</span>
                    <span className="block truncate text-[0.65rem] text-muted">{hit.artist}</span>
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-lime/40 text-lime transition-colors group-hover:bg-lime group-hover:text-black">
                    <Play className="ml-0.5 h-3 w-3" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* Listen live promo — mascot artwork card.
          Background image lives at: public/brand/listen-live-bg.png */}
      <Reveal delay={0.15}>
        <Link
          href="/listen"
          className="group relative block overflow-hidden rounded-xl border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-lime/50 hover:shadow-[0_18px_44px_-14px_rgba(182,229,29,0.35)]"
          aria-label="Listen live — we're on air 24/7"
        >
          <div className="relative aspect-[320/230] w-full">
            <Image
              src="/brand/listen-live-bg.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {HAS_CLEAN_BG && (
              <>
                <div className="absolute inset-y-0 right-0 flex w-[55%] flex-col items-center justify-center pb-8 pr-2 text-center">
                  <p className="display text-2xl leading-none text-lime drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    Listen Live!
                  </p>
                  <p className="mt-1.5 text-xs font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    We&apos;re On Air 24/7
                  </p>
                  <span
                    className="mt-4 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_4px_18px_rgba(0,0,0,0.5)] ring-2 ring-white/25 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "radial-gradient(circle at 35% 30%, #e0447a, #8f1030 75%)" }}
                  >
                    <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-black/65 py-2 text-center text-[0.68rem] font-semibold text-limesoft backdrop-blur-sm">
                  Click to start listening now
                </div>
              </>
            )}
          </div>
        </Link>
      </Reveal>

      {/* Ad space */}
      <Reveal delay={0.2}>
        <SidebarAd />
      </Reveal>
    </aside>
  );
}
