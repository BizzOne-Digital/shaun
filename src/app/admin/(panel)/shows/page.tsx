"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type Show = {
  slug: string;
  name: string;
  genre: string;
  genres: string[];
  tagline: string;
  description: string;
  scheduleSummary: string;
  image?: string;
  published?: boolean;
  art: { from: string; to: string; accent: string; word: string; sub?: string };
};

const emptyShow = (): Show => ({
  slug: "",
  name: "",
  genre: "",
  genres: [],
  tagline: "",
  description: "",
  scheduleSummary: "",
  image: "",
  published: true,
  art: { from: "#53107a", to: "#050407", accent: "#b6e51d", word: "SHOW", sub: "" },
});

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [selected, setSelected] = useState<Show | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/shows");
    const json = await res.json();
    if (json.ok) setShows(json.shows);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!selected?.slug || !selected.name) {
      setMessage("Slug and name are required.");
      return;
    }
    const res = await fetch("/api/admin/shows", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...selected,
        genres:
          typeof selected.genres === "string"
            ? String(selected.genres)
                .split(",")
                .map((g) => g.trim())
                .filter(Boolean)
            : selected.genres,
      }),
    });
    const json = await res.json();
    setMessage(json.ok ? "Show saved." : json.error || "Save failed");
    if (json.ok) {
      await load();
      setSelected(json.show);
    }
  }

  async function remove(slug: string) {
    if (!confirm(`Delete show “${slug}”?`)) return;
    await fetch(`/api/admin/shows?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    setSelected(null);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Shows</h2>
          <p className="mt-1 text-sm text-white/50">Edit show copy, artwork and schedule summary.</p>
        </div>
        <button type="button" className="admin-btn" onClick={() => setSelected(emptyShow())}>
          New show
        </button>
      </div>

      {message && <p className="text-sm text-white/70">{message}</p>}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {loading && <p className="text-sm text-white/40">Loading…</p>}
          {shows.map((show) => (
            <button
              key={show.slug}
              type="button"
              onClick={() => setSelected(show)}
              className={`admin-card w-full text-left transition hover:border-lime/40 ${
                selected?.slug === show.slug ? "border-lime/50" : ""
              }`}
            >
              <p className="font-bold text-white">{show.name}</p>
              <p className="text-xs text-white/40">{show.genre}</p>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="admin-card space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="admin-label">
                Name
                <input
                  className="admin-input mt-1"
                  value={selected.name}
                  onChange={(e) => setSelected({ ...selected, name: e.target.value })}
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
            <label className="admin-label">
              Genre
              <input
                className="admin-input mt-1"
                value={selected.genre}
                onChange={(e) => setSelected({ ...selected, genre: e.target.value })}
              />
            </label>
            <label className="admin-label">
              Genres (comma separated)
              <input
                className="admin-input mt-1"
                value={Array.isArray(selected.genres) ? selected.genres.join(", ") : selected.genres}
                onChange={(e) =>
                  setSelected({
                    ...selected,
                    genres: e.target.value.split(",").map((g) => g.trim()).filter(Boolean),
                  })
                }
              />
            </label>
            <label className="admin-label">
              Tagline
              <input
                className="admin-input mt-1"
                value={selected.tagline}
                onChange={(e) => setSelected({ ...selected, tagline: e.target.value })}
              />
            </label>
            <label className="admin-label">
              Description
              <textarea
                className="admin-input mt-1 min-h-28"
                value={selected.description}
                onChange={(e) => setSelected({ ...selected, description: e.target.value })}
              />
            </label>
            <label className="admin-label">
              Schedule summary
              <input
                className="admin-input mt-1"
                value={selected.scheduleSummary}
                onChange={(e) => setSelected({ ...selected, scheduleSummary: e.target.value })}
              />
            </label>
            <ImageUploadField
              label="Show image"
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
                Save show
              </button>
              {selected.slug && (
                <>
                  <Link href={`/shows/${selected.slug}`} className="text-sm text-lime underline" target="_blank">
                    View on site
                  </Link>
                  <button
                    type="button"
                    className="text-sm text-magenta"
                    onClick={() => remove(selected.slug)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="admin-card text-sm text-white/40">Select a show or create a new one.</div>
        )}
      </div>
    </div>
  );
}
