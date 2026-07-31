import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { ArticleModel } from "@/models/Article";

export async function GET() {
  try {
    await requireAdminSession();
    await connectDb();
    const articles = await ArticleModel.find({}).sort({ date: -1 }).lean();
    return NextResponse.json({ ok: true, articles });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to load articles" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession();
    await connectDb();
    const body = await req.json();
    if (!body.slug) {
      return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
    }
    if (typeof body.body === "string") {
      body.body = body.body
        .split(/\n\s*\n/)
        .map((p: string) => p.trim())
        .filter(Boolean);
    }
    const article = await ArticleModel.findOneAndUpdate({ slug: body.slug }, body, {
      upsert: true,
      new: true,
    }).lean();
    return NextResponse.json({ ok: true, article });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to save article" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdminSession();
    await connectDb();
    const slug = req.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
    }
    await ArticleModel.deleteOne({ slug });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to delete article" }, { status: 500 });
  }
}
