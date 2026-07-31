import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import {
  isUploadFolder,
  listStoredUploads,
  saveFolderUpload,
} from "@/lib/upload/store";
import type { UploadFolder } from "@/models/StoredUpload";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdminSession();
    const assets = await listStoredUploads();
    return NextResponse.json({ ok: true, success: true, assets });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("[upload list]", err);
    return NextResponse.json({ ok: false, error: "Failed to list uploads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();

    const form = await req.formData();
    const file = form.get("file");
    const folderRaw = String(form.get("folder") || "misc");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "file required" }, { status: 400 });
    }
    if (!isUploadFolder(folderRaw)) {
      return NextResponse.json(
        { success: false, error: "Invalid folder. Use pages, products, gallery, or misc." },
        { status: 400 },
      );
    }

    const saved = await saveFolderUpload(file, folderRaw as UploadFolder);

    return NextResponse.json({
      success: true,
      ok: true,
      url: saved.url,
      filename: saved.filename,
      folder: saved.folder,
      size: saved.size,
      mimeType: saved.mimeType,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("[upload]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
