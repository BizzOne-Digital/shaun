import Link from "next/link";
import { shows } from "@/data/shows";
import { articles } from "@/data/articles";
import { ShowArtwork } from "@/components/ui/ShowArtwork";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { Reveal } from "@/components/animations/Reveal";
import { SideRail } from "@/components/home/SideRail";

/** Featured show display meta (days + airtime shown on the cards). */
const FEATURED: { slug: string; days: string; time: string }[] = [
  { slug: "sunday-reggae-sunsplash", days: "Every Sunday", time: "9:00 AM – 4:00 PM" },
  { slug: "lite-heart", days: "Daily", time: "3:00 AM – 6:00 AM" },
  { slug: "rock-this-time", days: "Nightly (except Friday)", time: "6:00 PM – 9:00 PM" },
  { slug: "the-daily-dose", days: "Mon–Thu & Saturday", time: "6:00 AM – 2:00 PM" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

/**
 * Homepage main grid (styled after the client's reference design):
 * left — Featured Shows + Latest News · right — Top Hits, Listen Live promo, ad space.
 */
export function HomeGrid() {
  const featured = FEATURED.map((f) => ({
    ...f,
    show: shows.find((s) => s.slug === f.slug)!,
  }));
  const news = articles.slice(0, 3);

  return (
    <section
      className="border-y border-line py-14"
      style={{ background: "linear-gradient(180deg, #110618 0%, #0b040f 100%)" }}
      aria-label="Featured shows and latest news"
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        {/* ── LEFT COLUMN ── */}
        <div className="min-w-0 space-y-8">
          {/* Featured shows */}
          <Reveal>
            <PanelHeader title="Featured Shows" href="/shows" linkLabel="View All Shows" />
            <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featured.map(({ show, days, time }) => (
                <Link
                  key={show.slug}
                  href={`/shows/${show.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#150920] transition-all duration-300 hover:-translate-y-1 hover:border-violet/60 hover:shadow-[0_18px_44px_-14px_rgba(83,16,122,0.6)]"
                >
                  <ShowArtwork
                    art={show.art}
                    image={show.image}
                    name={show.name}
                    className="aspect-square w-full shrink-0 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="flex flex-1 flex-col px-3.5 py-3">
                    <h3 className="truncate text-sm font-extrabold text-white transition-colors group-hover:text-lime">
                      {show.shortName ?? show.name}
                    </h3>
                    <p className="mt-0.5 text-[0.68rem] text-muted">{days}</p>
                    <p className="mt-1 text-[0.68rem] font-bold tracking-wide text-lime">{time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Latest news */}
          <Reveal delay={0.08}>
            <PanelHeader title="Latest News" href="/news" linkLabel="View All News" />
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {news.map((a) => (
                <Link
                  key={a.slug}
                  href={`/news/${a.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#150920] transition-all duration-300 hover:-translate-y-1 hover:border-violet/60 hover:shadow-[0_18px_44px_-14px_rgba(83,16,122,0.6)]"
                >
                  <ShowArtwork
                    art={{ ...a.art, accent: "#f8f6fb", word: a.art.word }}
                    image={a.image}
                    name={a.title}
                    className="aspect-[16/10] w-full shrink-0 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="flex flex-1 flex-col px-3.5 py-3">
                    <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.22em] text-magenta">
                      {a.category}
                    </p>
                    <h3 className="mt-1.5 line-clamp-2 text-sm font-extrabold leading-snug text-white transition-colors group-hover:text-lime">
                      {a.title}
                    </h3>
                    <p className="mt-auto pt-2 text-[0.65rem] text-muted">{formatDate(a.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <SideRail />
      </div>
    </section>
  );
}
