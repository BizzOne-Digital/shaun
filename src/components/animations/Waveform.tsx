"use client";

import { useMemo } from "react";

interface WaveformProps {
  className?: string;
  color?: string;
  bars?: number;
  animate?: boolean;
  seed?: number;
}

/** Decorative scrolling waveform strip built from deterministic bars. */
export function Waveform({
  className = "",
  color = "var(--lime)",
  bars = 90,
  animate = true,
  seed = 7,
}: WaveformProps) {
  const heights = useMemo(() => {
    // Deterministic pseudo-random heights so SSR and client match
    const out: number[] = [];
    let x = seed;
    for (let i = 0; i < bars; i++) {
      x = (x * 9301 + 49297) % 233280;
      const r = x / 233280;
      out.push(18 + Math.round(r * 82));
    }
    return out;
  }, [bars, seed]);

  const strip = (key: string) => (
    <div key={key} className="flex h-full w-1/2 shrink-0 items-center gap-[3px] px-1">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-[2.5px] shrink-0 rounded-full"
          style={{ height: `${h}%`, background: color, opacity: 0.25 + (h / 100) * 0.75 }}
        />
      ))}
    </div>
  );

  return (
    <div aria-hidden="true" className={`overflow-hidden ${className}`}>
      <div className={`flex h-full w-[200%] ${animate ? "wave-drift" : ""}`}>
        {strip("a")}
        {strip("b")}
      </div>
    </div>
  );
}
