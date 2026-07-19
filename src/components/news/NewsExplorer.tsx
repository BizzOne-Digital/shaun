"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { articles, articleCategories } from "@/data/articles";
import { ShowArtwork } from "@/components/ui/ShowArtwork";
import { PanelHeader } from "@/components/ui/PanelHeader";
import { Reveal } from "@/components/animations/Reveal";

const PAGE_SIZE = 6;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

/**
 * News listing (reference design): search + category pills, featured story
 * panel and a grid of dark card tiles with load-more pagination.
 */
export function NewsExplorer() {
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesCategory = category === "All" || a.category === category;
      const matchesSearch =
        !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const [featured, ...others] = filtered;
  const visible = others.slice(0, limit);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <label htmlFor="news-search" className="sr-only">
            Search articles
          </label>
          <input
            id="news-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories…"
            className="field !pl-11"
          />
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {articleCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`shrink-0 rounded-full border px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.15em] transition-colors ${
                category === c
                  ? "border-lime bg-lime/15 text-lime"
                  : "border-line text-muted hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-[#150920] px-6 py-12 text-center text-muted">
          No stories match your search. Try a different keyword or category.
        </p>
      )}

      {/* Featured story */}
      {featured && (
        <Reveal>
          <PanelHeader title="Featured Story" href={`/news/${featured.slug}`} linkLabel="Read Story" />
          <Link
            href={`/news/${featured.slug}`}
            className="group mt-4 grid overflow-hidden rounded-xl border border-white/10 bg-[#150920] transition-all duration-300 hover:border-violet/60 hover:shadow-[0_18px_44px_-14px_rgba(83,16,122,0.6)] md:grid-cols-2"
          >
            <ShowArtwork
              art={{ ...featured.art, accent: "#f8f6fb", word: featured.art.word }}
              image={featured.image}
              name={featured.title}
              className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-[1.02] md:aspect-auto md:h-full"
            />
            <div className="flex flex-col justify-center p-6 sm:p-9">
              <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-magenta">
                {featured.category} · {formatDate(featured.date)}
              </p>
              <h2 className="display mt-3 text-2xl text-white transition-colors group-hover:text-lime sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{featured.excerpt}</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-lime">
                Read Story → · {featured.readingTime}
              </p>
            </div>
          </Link>
        </Reveal>
      )}

      {/* Latest stories grid */}
      {visible.length > 0 && (
        <Reveal delay={0.05}>
          <PanelHeader title="Latest Stories" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((a) => (
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
                    {a.category} · {formatDate(a.date)}
                  </p>
                  <h3 className="mt-1.5 line-clamp-2 text-sm font-extrabold leading-snug text-white transition-colors group-hover:text-lime">
                    {a.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{a.excerpt}</p>
                  <p className="mt-auto pt-2 text-[0.62rem] uppercase tracking-[0.2em] text-muted/70">
                    {a.readingTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      )}

      {others.length > limit && (
        <div className="text-center">
          <button type="button" onClick={() => setLimit((l) => l + PAGE_SIZE)} className="btn btn-outline">
            Load More Stories
          </button>
        </div>
      )}
    </div>
  );
}
