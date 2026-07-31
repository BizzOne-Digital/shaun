"use client";

import { useEffect, useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type Section = {
  _id?: string;
  key: string;
  label: string;
  enabled: boolean;
  headline: string;
  subheadline: string;
  body: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
};

type PageDoc = {
  slug: string;
  title: string;
  path: string;
  seoDescription: string;
  sections: Section[];
};

export function PageEditor({ initial }: { initial: PageDoc }) {
  const [page, setPage] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPage(initial);
  }, [initial]);

  function updateSection(index: number, patch: Partial<Section>) {
    setPage((prev) => {
      const sections = prev.sections.map((s, i) => (i === index ? { ...s, ...patch } : s));
      return { ...prev, sections };
    });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      setMessage("Saved — live site will use these updates.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime">Page</p>
          <h2 className="mt-1 text-2xl font-bold text-white">{page.title}</h2>
          <p className="mt-1 text-sm text-white/50">{page.path}</p>
        </div>
        <button type="button" onClick={save} disabled={saving} className="admin-btn">
          {saving ? "Saving…" : "Save page"}
        </button>
      </div>

      {message && (
        <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
          {message}
        </p>
      )}

      <div className="grid gap-4 rounded-2xl border border-white/10 bg-[#12081a] p-5">
        <label className="admin-label">
          Title
          <input
            className="admin-input mt-1"
            value={page.title}
            onChange={(e) => setPage({ ...page, title: e.target.value })}
          />
        </label>
        <label className="admin-label">
          SEO description
          <textarea
            className="admin-input mt-1 min-h-20"
            value={page.seoDescription}
            onChange={(e) => setPage({ ...page, seoDescription: e.target.value })}
          />
        </label>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.2em] text-white/60">
          Sections
        </h3>
        {page.sections.map((section, index) => (
          <div
            key={section.key + index}
            className="space-y-4 rounded-2xl border border-white/10 bg-[#12081a] p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-lime">
                  {section.label}
                </p>
                <p className="text-xs text-white/40">key: {section.key}</p>
              </div>
              <label className="flex items-center gap-2 text-xs text-white/70">
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={(e) => updateSection(index, { enabled: e.target.checked })}
                />
                Enabled
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="admin-label">
                Headline
                <input
                  className="admin-input mt-1"
                  value={section.headline}
                  onChange={(e) => updateSection(index, { headline: e.target.value })}
                />
              </label>
              <label className="admin-label">
                Subheadline
                <input
                  className="admin-input mt-1"
                  value={section.subheadline}
                  onChange={(e) => updateSection(index, { subheadline: e.target.value })}
                />
              </label>
            </div>

            <label className="admin-label">
              Body / copy
              <textarea
                className="admin-input mt-1 min-h-28"
                value={section.body}
                onChange={(e) => updateSection(index, { body: e.target.value })}
              />
            </label>

            <ImageUploadField
              label="Section image"
              folder="pages"
              value={section.image}
              onChange={(image) => updateSection(index, { image })}
            />

            <label className="admin-label">
              Image alt text
              <input
                className="admin-input mt-1"
                value={section.imageAlt}
                onChange={(e) => updateSection(index, { imageAlt: e.target.value })}
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="admin-label">
                CTA label
                <input
                  className="admin-input mt-1"
                  value={section.ctaLabel}
                  onChange={(e) => updateSection(index, { ctaLabel: e.target.value })}
                />
              </label>
              <label className="admin-label">
                CTA link
                <input
                  className="admin-input mt-1"
                  value={section.ctaHref}
                  onChange={(e) => updateSection(index, { ctaHref: e.target.value })}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
