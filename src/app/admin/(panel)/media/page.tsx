"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { UploadFolder } from "@/models/StoredUpload";

type Asset = {
  _id?: string;
  url: string;
  filename: string;
  folder: UploadFolder;
  mimeType?: string;
  size?: number;
  createdAt?: string;
};

const FOLDERS: UploadFolder[] = ["pages", "products", "gallery", "misc"];

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [folder, setFolder] = useState<UploadFolder>("misc");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await fetch("/api/upload");
    const json = await res.json();
    if (json.ok) setAssets(json.assets);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Upload failed");
      setMessage(`Uploaded: ${json.url}`);
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Media Library</h2>
          <p className="mt-1 text-sm text-white/50">
            Images are stored in <strong className="text-lime">MongoDB</strong> (works on Vercel).
            URLs look like <code className="text-lime">/api/uploads/…</code>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="admin-input !w-auto"
            value={folder}
            onChange={(e) => setFolder(e.target.value as UploadFolder)}
          >
            {FOLDERS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <label className="admin-btn cursor-pointer">
            {uploading ? "Uploading…" : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                void onUpload(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      {message && <p className="text-sm text-white/70">{message}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {assets.map((asset) => (
          <div key={asset.url} className="admin-card space-y-2">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black/40">
              <Image
                src={asset.url}
                alt={asset.filename}
                fill
                unoptimized
                className="object-cover"
                sizes="280px"
              />
            </div>
            <p className="text-[0.65rem] uppercase tracking-wider text-white/40">{asset.folder}</p>
            <p className="truncate text-xs text-white/70">{asset.url}</p>
            <button
              type="button"
              className="text-xs font-bold text-lime"
              onClick={() => {
                void navigator.clipboard.writeText(asset.url);
                setMessage(`Copied ${asset.url}`);
              }}
            >
              Copy URL
            </button>
          </div>
        ))}
      </div>

      {!assets.length && (
        <p className="text-sm text-white/40">No uploads yet — add your first image above.</p>
      )}
    </div>
  );
}
