"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Radio, CalendarDays, Megaphone } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Waveform } from "@/components/animations/Waveform";

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-[150px]" aria-label="Monsterous Radio hero">
      {/* Studio microphone photo background */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/studio/hero-mic.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center]"
        />
        {/* readability overlays — dark from the left, vignette top/bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,4,7,0.96) 0%, rgba(5,4,7,0.88) 32%, rgba(5,4,7,0.55) 58%, rgba(5,4,7,0.15) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,4,7,0.85) 0%, transparent 28%, transparent 68%, rgba(5,4,7,0.9) 100%)",
          }}
        />
      </div>

      {/* moving light beam accent */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-[12%] h-[130%] w-40 rotate-[18deg] opacity-[0.1]"
          style={{ background: "linear-gradient(to bottom, var(--purple-bright), transparent 75%)" }}
          animate={{ x: [0, 60, 0], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Floating ON AIR sign over the mic (desktop) */}
      <motion.span
        className="onair display absolute right-[6%] top-[38%] z-10 hidden rounded-lg border border-magenta/50 bg-black/60 px-5 py-2.5 text-2xl tracking-[0.25em] text-magenta backdrop-blur-sm lg:block"
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        ON AIR
      </motion.span>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 lg:pb-12">
        <Stagger className="max-w-4xl py-6 lg:py-8">
          <StaggerItem>
            <p className="kicker flex items-center gap-3">
              <span aria-hidden="true" className="live-dot inline-block h-2 w-2 rounded-full bg-lime" />
              24/7 International Online Radio
            </p>
          </StaggerItem>
          <StaggerItem>
            <h1 className="display mt-5 text-[clamp(1.55rem,7.5vw,4.8rem)]">
              <span className="block whitespace-nowrap text-white">Playing Your Favorite</span>
              <span className="text-gradient-lime block whitespace-nowrap">Monster Hits 24/7</span>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              From the biggest classics to today&apos;s hits, Monsterous Radio delivers nonstop
              music, specialty shows and unforgettable energy to listeners across the Philippines
              and North America.
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <MagneticButton>
                <Link href="/listen" className="btn btn-lime">
                  <Radio className="h-4 w-4" aria-hidden="true" />
                  Listen Live
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/shows" className="btn btn-magenta">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  View Programming
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/advertise" className="btn btn-magenta">
                  <Megaphone className="h-4 w-4" aria-hidden="true" />
                  Advertise With Us
                </Link>
              </MagneticButton>
            </div>
          </StaggerItem>
        </Stagger>
      </div>

      {/* animated waveform base */}
      <Waveform className="relative z-10 h-12 w-full opacity-60" bars={120} />
    </section>
  );
}
