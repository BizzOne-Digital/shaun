import { NextResponse, type NextRequest } from "next/server";
import {
  getStoredUpload,
  isUploadFolder,
} from "@/lib/upload/store";
import type { UploadFolder } from "@/models/StoredUpload";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ folder: string; filename: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { folder: folderRaw, filename: filenameRaw } = await context.params;
    const folder = decodeURIComponent(folderRaw || "");
    const filename = decodeURIComponent(filenameRaw || "");

    if (
      !isUploadFolder(folder) ||
      !filename ||
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return new NextResponse("Not found", { status: 404 });
    }

    const doc = await getStoredUpload(folder as UploadFolder, filename);
    if (!doc?.data) {
      return new NextResponse("Not found", { status: 404 });
    }

    const raw = doc.data as unknown;
    let bytes: Buffer;
    if (Buffer.isBuffer(raw)) {
      bytes = raw;
    } else if (raw && typeof raw === "object" && "buffer" in raw) {
      bytes = Buffer.from((raw as { buffer: ArrayBuffer }).buffer);
    } else {
      bytes = Buffer.from(raw as Uint8Array);
    }

    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("[serve upload]", err);
    return new NextResponse("Not found", { status: 404 });
  }
}
