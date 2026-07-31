import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Page } from "@/models/Page";
import { ShowModel } from "@/models/Show";
import { ArticleModel } from "@/models/Article";
import { StoredUpload } from "@/models/StoredUpload";

export async function GET() {
  try {
    await requireAdminSession();
    await connectDb();
    const [pages, shows, articles, media] = await Promise.all([
      Page.countDocuments(),
      ShowModel.countDocuments(),
      ArticleModel.countDocuments(),
      StoredUpload.countDocuments(),
    ]);
    return NextResponse.json({
      ok: true,
      stats: { pages, shows, articles, media },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to load stats" }, { status: 500 });
  }
}
