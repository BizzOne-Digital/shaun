"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const PLACEMENTS = [
  {
    id: "top",
    name: "Premium Top Banner",
    size: "970×90",
    description: "The first thing every visitor sees — maximum visibility above the navigation on high-traffic pages.",
  },
  {
    id: "player",
    name: "Player Placement",
    size: "320×50",
    description: "Positioned beside the live player controls — seen every time someone tunes in.",
  },
  {
    id: "side",
    name: "Sidebar Banner",
    size: "300×250",
    description: "Sits alongside schedule and editorial content for contextual, in-flow visibility.",
  },
  {
    id: "footer",
    name: "Footer Banner",
    size: "970×90",
    description: "Site-wide placement at the end of every page journey — cost-effective, always present.",
  },
] as const;

type PlacementId = (typeof PLACEMENTS)[number]["id"];

/**
 * Interactive wireframe of the website highlighting each ad position.
 * Hover / focus a zone to read its description.
 */
export function PlacementPreview() {
  const [active, setActive] = useState<PlacementId>("top");
  const info = PLACEMENTS.find((p) => p.id === active)!;

  const zoneClass = (id: PlacementId) =>
    `cursor-pointer rounded-md border transition-all duration-200 outline-none ${
      active === id
        ? "border-lime bg-lime/20 shadow-[0_0_24px_-6px_rgba(182,229,29,0.6)]"
        : "border-white/15 bg-white/[0.04] hover:border-violet/60"
    }`;

  const zoneProps = (id: PlacementId) => ({
    role: "button" as const,
    tabIndex: 0,
    onMouseEnter: () => setActive(id),
    onFocus: () => setActive(id),
    onClick: () => setActive(id),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActive(id);
      }
    },
    "aria-label": PLACEMENTS.find((p) => p.id === id)?.name,
    "aria-pressed": active === id,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,360px)] lg:items-center">
      {/* Wireframe */}
      <div className="card-surface rounded-2xl p-5 sm:p-7" aria-label="Website placement diagram">
        <div className="mx-auto max-w-lg space-y-2.5">
          {/* top banner */}
          <div {...zoneProps("top")} className={`${zoneClass("top")} flex h-10 items-center justify-center text-[0.58rem] font-bold uppercase tracking-[0.2em] ${active === "top" ? "text-lime" : "text-muted"}`}>
            Top Banner · 970×90
          </div>
          {/* nav bar */}
          <div className="flex h-8 items-center gap-2 rounded-md bg-white/[0.07] px-3">
            <span className="h-3 w-14 rounded-sm bg-lime/50" />
            <span className="ml-auto flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-2 w-8 rounded-sm bg-white/20" />
              ))}
            </span>
          </div>
          {/* hero */}
          <div className="flex h-24 flex-col justify-center gap-2 rounded-md bg-gradient-to-r from-purple/40 to-plum/60 px-4">
            <span className="h-4 w-3/5 rounded-sm bg-white/30" />
            <span className="h-2.5 w-2/5 rounded-sm bg-white/15" />
          </div>
          {/* player row w/ player ad */}
          <div className="flex gap-2.5">
            <div className="flex h-12 flex-1 items-center gap-2 rounded-md bg-white/[0.07] px-3">
              <span className="h-6 w-6 rounded-full bg-lime/60" />
              <span className="h-2.5 w-1/3 rounded-sm bg-white/20" />
            </div>
            <div {...zoneProps("player")} className={`${zoneClass("player")} flex h-12 w-2/5 items-center justify-center text-[0.55rem] font-bold uppercase tracking-[0.16em] ${active === "player" ? "text-lime" : "text-muted"}`}>
              Player Ad
            </div>
          </div>
          {/* content + sidebar */}
          <div className="flex gap-2.5">
            <div className="flex-1 space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 rounded-md bg-white/[0.06]" />
              ))}
            </div>
            <div {...zoneProps("side")} className={`${zoneClass("side")} flex h-[7.25rem] w-2/5 items-center justify-center text-[0.55rem] font-bold uppercase tracking-[0.16em] sm:w-1/3 ${active === "side" ? "text-lime" : "text-muted"}`}>
              Sidebar · 300×250
            </div>
          </div>
          {/* footer banner */}
          <div {...zoneProps("footer")} className={`${zoneClass("footer")} flex h-10 items-center justify-center text-[0.58rem] font-bold uppercase tracking-[0.2em] ${active === "footer" ? "text-lime" : "text-muted"}`}>
            Footer Banner · 970×90
          </div>
          <div className="h-10 rounded-md bg-white/[0.05]" />
        </div>
      </div>

      {/* Description */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-lime/30 bg-lime/[0.05] p-7"
        aria-live="polite"
      >
        <p className="font-mono text-xs text-lime">{info.size}</p>
        <h3 className="display mt-2 text-3xl text-white">{info.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{info.description}</p>
      </motion.div>
    </div>
  );
}
