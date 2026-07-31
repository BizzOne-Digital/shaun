import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  isUploadFolder,
  listStoredUploads,
  saveFolderUpload,
} from "@/lib/upload/store";
import type { UploadFolder } from "@/models/StoredUpload";

export const runtime = "nodejs";

/**
 * Legacy admin upload endpoint — now stores in MongoDB (same as /api/upload).
 * Kept so older admin UI calls keep working.
 */
export async function GET() {
  try {
    await requireAdminSession();
    const assets = await listStoredUploads();
    return NextResponse.json({ ok: true, assets });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to load media" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();

    const form = await req.formData();
    const file = form.get("file");
    const folderRaw = String(form.get("folder") || "misc");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "file required" }, { status: 400 });
    }
    if (!isUploadFolder(folderRaw)) {
      return NextResponse.json({ ok: false, error: "Invalid folder" }, { status: 400 });
    }

    const saved = await saveFolderUpload(file, folderRaw as UploadFolder);
    return NextResponse.json({
      ok: true,
      success: true,
      url: saved.url,
      filename: saved.filename,
      folder: saved.folder,
      size: saved.size,
      asset: saved,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error(err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
