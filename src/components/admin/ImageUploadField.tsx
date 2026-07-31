"use client";

import { useState } from "react";
import Image from "next/image";
import type { UploadFolder } from "@/models/StoredUpload";
import { resolveCmsImage } from "@/lib/cms/resolveImage";

const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.8;

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    // Skip if already small enough and under ~2MB
    if (scale >= 1 && file.size < 2 * 1024 * 1024) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const preferWebp = file.type === "image/webp" || file.type === "image/png";
    const mime = preferWebp ? "image/webp" : "image/jpeg";
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), mime, JPEG_QUALITY),
    );
    if (!blob) return file;

    const ext = mime === "image/webp" ? "webp" : "jpg";
    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${base}.${ext}`, { type: mime });
  } catch {
    return file;
  }
}

export function ImageUploadField({
  label = "Image",
  value,
  onChange,
  folder = "misc",
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: UploadFolder;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const previewSrc = resolveCmsImage(value, "");

  async function onFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const prepared = await compressImage(file);
      const fd = new FormData();
      fd.set("file", prepared);
      fd.set("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Upload failed");
      }
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-white/50">
        {label}
        <span className="ml-2 font-normal normal-case tracking-normal text-white/30">
          folder: {folder}
        </span>
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-28 w-40 overflow-hidden rounded-xl border border-white/10 bg-black/40">
          {previewSrc ? (
            <Image
              src={previewSrc}
              alt=""
              fill
              unoptimized
              className="object-cover"
              sizes="160px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[0.65rem] text-white/30">
              No image
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/api/uploads/… or /studio/…"
            className="admin-input"
          />
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10">
              {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  void onFile(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
              />
            </label>
            {value ? (
              <button
                type="button"
                className="rounded-lg border border-magenta/40 px-3 py-2 text-xs font-semibold text-magenta hover:bg-magenta/10"
                disabled={uploading}
                onClick={() => onChange("")}
              >
                Remove
              </button>
            ) : null}
          </div>
          {error && <p className="text-xs text-magenta">{error}</p>}
          <p className="text-[0.65rem] text-white/35">
            JPEG / PNG / WebP / GIF · max ~4.5MB (auto-compressed in browser)
          </p>
        </div>
      </div>
    </div>
  );
}
