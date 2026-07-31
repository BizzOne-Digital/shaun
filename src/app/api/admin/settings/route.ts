import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";

export async function GET() {
  try {
    await requireAdminSession();
    await connectDb();
    const settings = await SiteSettings.findOne({ key: "main" }).lean();
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession();
    await connectDb();
    const body = await req.json();
    const settings = await SiteSettings.findOneAndUpdate(
      { key: "main" },
      { ...body, key: "main" },
      { upsert: true, new: true },
    ).lean();
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to save settings" }, { status: 500 });
  }
}
