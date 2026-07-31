"use client";

import { useEffect, useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type Article = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  readingTime: string;
  image?: string;
  body: string[] | string;
  published?: boolean;
  art: { from: string; to: string; word: string };
};

const emptyArticle = (): Article => ({
  slug: "",
  title: "",
  category: "Station News",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  readingTime: "3 min read",
  image: "",
  body: "",
  published: true,
  art: { from: "#6f1599", to: "#0d0911", word: "NEWS" },
});

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Article | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/admin/news");
    const json = await res.json();
    if (json.ok) setArticles(json.articles);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!selected?.slug || !selected.title) {
      setMessage("Slug and title required.");
      return;
    }
    const res = await fetch("/api/admin/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...selected,
        body:
          typeof selected.body === "string"
            ? selected.body
            : selected.body.join("\n\n"),
      }),
    });
    const json = await res.json();
    setMessage(json.ok ? "Article saved." : json.error || "Save failed");
    if (json.ok) {
      await load();
      setSelected({
        ...json.article,
        body: Array.isArray(json.article.body)
          ? json.article.body.join("\n\n")
          : json.article.body,
      });
    }
  }

  async function remove(slug: string) {
    if (!confirm(`Delete article “${slug}”?`)) return;
    await fetch(`/api/admin/news?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    setSelected(null);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">News</h2>
          <p className="mt-1 text-sm text-white/50">Create and edit news / feature articles.</p>
        </div>
        <button type="button" className="admin-btn" onClick={() => setSelected(emptyArticle())}>
          New article
        </button>
      </div>

      {message && <p className="text-sm text-white/70">{message}</p>}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {articles.map((article) => (
            <button
              key={article.slug}
              type="button"
              onClick={() =>
                setSelected({
                  ...article,
                  body: Array.isArray(article.body) ? article.body.join("\n\n") : article.body,
                })
              }
              className={`admin-card w-full text-left transition hover:border-lime/40 ${
                selected?.slug === article.slug ? "border-lime/50" : ""
              }`}
            >
              <p className="font-bold text-white">{article.title}</p>
              <p className="text-xs text-white/40">
                {article.category} · {article.date}
              </p>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="admin-card space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="admin-label">
                Title
                <input
                  className="admin-input mt-1"
                  value={selected.title}
                  onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                />
              </label>
              <label className="admin-label">
                Slug
                <input
                  className="admin-input mt-1"
                  value={selected.slug}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                />
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="admin-label">
                Category
                <input
                  className="admin-input mt-1"
                  value={selected.category}
                  onChange={(e) => setSelected({ ...selected, category: e.target.value })}
                />
              </label>
              <label className="admin-label">
                Date
                <input
                  className="admin-input mt-1"
                  type="date"
                  value={selected.date?.slice(0, 10)}
                  onChange={(e) => setSelected({ ...selected, date: e.target.value })}
                />
              </label>
              <label className="admin-label">
                Reading time
                <input
                  className="admin-input mt-1"
                  value={selected.readingTime}
                  onChange={(e) => setSelected({ ...selected, readingTime: e.target.value })}
                />
              </label>
            </div>
            <label className="admin-label">
              Excerpt
              <textarea
                className="admin-input mt-1 min-h-20"
                value={selected.excerpt}
                onChange={(e) => setSelected({ ...selected, excerpt: e.target.value })}
              />
            </label>
            <label className="admin-label">
              Body (paragraphs separated by blank line)
              <textarea
                className="admin-input mt-1 min-h-40"
                value={typeof selected.body === "string" ? selected.body : selected.body.join("\n\n")}
                onChange={(e) => setSelected({ ...selected, body: e.target.value })}
              />
            </label>
            <ImageUploadField
              label="Article image"
              folder="misc"
              value={selected.image || ""}
              onChange={(image) => setSelected({ ...selected, image })}
            />
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={selected.published !== false}
                onChange={(e) => setSelected({ ...selected, published: e.target.checked })}
              />
              Published
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="admin-btn" onClick={save}>
                Save article
              </button>
              {selected.slug && (
                <button type="button" className="text-sm text-magenta" onClick={() => remove(selected.slug)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="admin-card text-sm text-white/40">Select an article or create a new one.</div>
        )}
      </div>
    </div>
  );
}
