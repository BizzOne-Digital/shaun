import { siteConfig } from "@/config/siteConfig";
import { CountUp } from "@/components/animations/CountUp";
import { Reveal } from "@/components/animations/Reveal";

/** Confirmed brand statistics only — no invented listener counts. */
export function StatsSection() {
  return (
    <section className="border-y border-line bg-black/50" aria-label="Monsterous Radio at a glance">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-14 sm:px-6 md:grid-cols-5 lg:px-8">
        {siteConfig.stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.07} className="px-4 py-6 text-center">
            <p className="display text-4xl text-gradient-lime sm:text-5xl">
              {stat.numeric !== null ? (
                <CountUp end={stat.numeric} suffix={stat.suffix ?? ""} />
              ) : (
                stat.value
              )}
            </p>
            <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-muted">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
