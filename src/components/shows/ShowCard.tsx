"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Show } from "@/types";
import { ShowArtwork } from "@/components/ui/ShowArtwork";

/** Collectible album-cover style show card with subtle 3D hover depth. */
export function ShowCard({ show, index = 0 }: { show: Show; index?: number }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { y: -8, rotateX: 3, rotateY: -3 }}
      style={{ transformPerspective: 900 }}
      className="group h-full"
    >
      <Link
        href={`/shows/${show.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow duration-300 hover:shadow-[0_24px_60px_-18px_rgba(83,16,122,0.55)]"
      >
        <div className="relative aspect-square shrink-0 overflow-hidden">
          <ShowArtwork
            art={show.art}
            image={show.image}
            name={show.name}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute left-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-lime backdrop-blur-sm">
            {show.genre}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="display line-clamp-1 text-xl text-white transition-colors group-hover:text-lime">
            {show.name}
          </h3>
          <p className="mt-1.5 flex min-h-[2.5em] items-start gap-1.5 text-xs leading-relaxed text-muted">
            <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet" aria-hidden="true" />
            <span className="line-clamp-2">{show.scheduleSummary}</span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
