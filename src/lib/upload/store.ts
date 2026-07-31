import { connectDb } from "@/lib/db";
import {
  StoredUpload,
  UPLOAD_FOLDERS,
  type UploadFolder,
} from "@/models/StoredUpload";

export const MAX_UPLOAD_BYTES = Math.floor(4.5 * 1024 * 1024); // 4.5MB — Vercel body limit headroom

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function uploadPublicUrl(folder: UploadFolder, filename: string): string {
  return `/api/uploads/${folder}/${encodeURIComponent(filename)}`;
}

/** Parse `/api/uploads/{folder}/{filename}` → parts, or null. */
export function parseUploadUrl(
  url: string,
): { folder: UploadFolder; filename: string } | null {
  if (!url?.startsWith("/api/uploads/")) return null;
  const parts = url.slice("/api/uploads/".length).split("/");
  if (parts.length !== 2) return null;
  const folder = decodeURIComponent(parts[0] || "");
  const filename = decodeURIComponent(parts[1] || "");
  if (!isUploadFolder(folder)) return null;
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return null;
  }
  return { folder, filename };
}

function sanitizeBaseName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "") || "image";
  return base.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 80) || "image";
}

function assertSafeFilename(filename: string): void {
  if (
    !filename ||
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\") ||
    filename.includes("\0")
  ) {
    throw new Error("Invalid filename");
  }
}

export type SaveUploadResult = {
  url: string;
  filename: string;
  folder: UploadFolder;
  size: number;
  mimeType: string;
};

/**
 * Persist an image File into MongoDB (Vercel-safe — no local filesystem writes).
 */
export async function saveFolderUpload(
  file: File,
  folder: UploadFolder,
): Promise<SaveUploadResult> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP and GIF images are allowed.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) {
    throw new Error("Empty file.");
  }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Image is too large (${(buffer.length / 1024 / 1024).toFixed(1)}MB). Max is 4.5MB — try a smaller or compressed image.`,
    );
  }

  const ext = EXT_BY_MIME[file.type] || "bin";
  const filename = `${Date.now()}-${sanitizeBaseName(file.name)}.${ext}`;
  assertSafeFilename(filename);

  await connectDb();

  await StoredUpload.findOneAndUpdate(
    { folder, filename },
    {
      folder,
      filename,
      mimeType: file.type,
      size: buffer.length,
      data: buffer,
    },
    { upsert: true, returnDocument: "after" },
  );

  return {
    url: uploadPublicUrl(folder, filename),
    filename,
    folder,
    size: buffer.length,
    mimeType: file.type,
  };
}

export async function getStoredUpload(folder: UploadFolder, filename: string) {
  assertSafeFilename(filename);
  if (!isUploadFolder(folder)) {
    throw new Error("Invalid folder");
  }
  await connectDb();
  return StoredUpload.findOne({ folder, filename }).lean();
}

/** Delete a stored upload when the CMS URL is `/api/uploads/...`. */
export async function deleteFolderUploadByUrl(url: string): Promise<boolean> {
  const parsed = parseUploadUrl(url);
  if (!parsed) return false;
  await connectDb();
  const result = await StoredUpload.deleteOne({
    folder: parsed.folder,
    filename: parsed.filename,
  });
  return result.deletedCount > 0;
}

export async function listStoredUploads(limit = 100) {
  await connectDb();
  const docs = await StoredUpload.find({})
    .select("folder filename mimeType size createdAt")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return docs.map((doc) => ({
    ...doc,
    url: uploadPublicUrl(doc.folder as UploadFolder, doc.filename),
  }));
}
