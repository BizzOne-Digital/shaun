import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Page } from "@/models/Page";

export async function GET() {
  try {
    await requireAdminSession();
    await connectDb();
    const pages = await Page.find({}).sort({ title: 1 }).lean();
    return NextResponse.json({ ok: true, pages });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to load pages" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession();
    await connectDb();
    const body = await req.json();
    const slug = String(body.slug || "");
    if (!slug) {
      return NextResponse.json({ ok: false, error: "slug required" }, { status: 400 });
    }

    const updated = await Page.findOneAndUpdate(
      { slug },
      {
        title: body.title,
        path: body.path,
        seoDescription: body.seoDescription,
        sections: body.sections,
      },
      { new: true },
    ).lean();

    if (!updated) {
      return NextResponse.json({ ok: false, error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, page: updated });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error(err);
    return NextResponse.json({ ok: false, error: "Failed to save page" }, { status: 500 });
  }
}
