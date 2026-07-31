import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { ShowModel } from "@/models/Show";

export async function GET() {
  try {
    await requireAdminSession();
    await connectDb();
    const shows = await ShowModel.find({}).sort({ order: 1, name: 1 }).lean();
    return NextResponse.json({ ok: true, shows });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to load shows" }, { status: 500 });
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
    const show = await ShowModel.findOneAndUpdate({ slug: body.slug }, body, {
      upsert: true,
      new: true,
    }).lean();
    return NextResponse.json({ ok: true, show });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to save show" }, { status: 500 });
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
    await ShowModel.deleteOne({ slug });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to delete show" }, { status: 500 });
  }
}
