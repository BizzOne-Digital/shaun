export function StatusStrip() {
  const items = [
    "MONSTEROUS RADIO IS LIVE",
    "24/7 ONLINE RADIO",
    "PHILIPPINES / NORTH AMERICA",
    "PLAYIN' YOUR FAVORITE MONSTER HITS!",
  ];
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2.5 text-[0.62rem] font-bold tracking-[0.28em] text-white/70">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "live-dot bg-lime" : "bg-violet/60"}`}
          />
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative z-50 overflow-hidden border-b border-line bg-black/80 py-1.5" role="status" aria-label="Monsterous Radio is live — 24/7 online radio serving the Philippines and North America">
      <div aria-hidden="true" className="marquee-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
