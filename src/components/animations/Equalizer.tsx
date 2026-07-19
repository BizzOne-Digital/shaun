"use client";

interface EqualizerProps {
  playing?: boolean;
  bars?: number;
  className?: string;
  color?: string;
  height?: number;
}

/** Animated equalizer bars (CSS-driven, pausable). */
export function Equalizer({
  playing = true,
  bars = 5,
  className = "",
  color = "var(--lime)",
  height = 18,
}: EqualizerProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-end gap-[2px] ${playing ? "" : "eq-paused"} ${className}`}
      style={{ height }}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="eq-bar inline-block w-[3px] rounded-full"
          style={{
            height: "100%",
            background: color,
            animationDelay: `${(i * 0.13) % 0.9}s`,
            animationDuration: `${0.7 + (i % 3) * 0.18}s`,
          }}
        />
      ))}
    </span>
  );
}
