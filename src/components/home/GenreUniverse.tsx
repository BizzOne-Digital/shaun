"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/config/siteConfig";
import { SectionHeading } from "@/components/ui/SectionHeading";

const GENRE_COLORS = [
  "var(--lime)",
  "var(--purple-bright)",
  "var(--magenta)",
  "var(--lime-soft)",
];

/**
 * Genre Universe — genres rendered as an audio-frequency inspired field:
 * each genre sits on its own "frequency band" with animated level bars.
 */
export function GenreUniverse() {
  const reduced = useReducedMotion();
  const genres = siteConfig.genres;

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8" aria-label="Genres on Monsterous Radio">
      <SectionHeading
        kicker="Genre Universe"
        title="One Station. Every Frequency."
        description="From the 60s to today — twelve genres share one dial. Wherever your mood lands, there's a frequency for it."
        align="center"
      />

      <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
        {genres.map((genre, i) => {
          const color = GENRE_COLORS[i % GENRE_COLORS.length];
          const freq = (87.5 + i * 1.7).toFixed(1);
          return (
            <motion.div
              key={genre}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              whileHover={reduced ? undefined : { scale: 1.04 }}
              className="group relative cursor-default overflow-hidden rounded-xl border border-line bg-surface/70 p-4 transition-colors hover:border-white/25"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[0.6rem] font-bold tracking-widest text-muted/70">
                  {freq} FM
                </span>
                <span aria-hidden="true" className="inline-flex items-end gap-[2px]" style={{ height: 14 }}>
                  {[0.4, 0.9, 0.6, 1].map((h, j) => (
                    <motion.span
                      key={j}
                      className="w-[2.5px] rounded-full"
                      style={{ background: color, height: `${h * 100}%`, transformOrigin: "bottom" }}
                      animate={reduced ? undefined : { scaleY: [h, 0.3, h] }}
                      transition={{ duration: 0.9 + j * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                    />
                  ))}
                </span>
              </div>
              <p className="display mt-3 text-xl text-white transition-colors group-hover:text-lime sm:text-2xl">
                {genre}
              </p>
              <span
                aria-hidden="true"
                className="mt-3 block h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
                style={{ background: color }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
