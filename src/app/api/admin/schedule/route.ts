import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { ScheduleModel } from "@/models/Schedule";

export async function GET() {
  try {
    await requireAdminSession();
    await connectDb();
    const schedule = await ScheduleModel.findOne({ key: "weekly" }).lean();
    return NextResponse.json({ ok: true, schedule });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to load schedule" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdminSession();
    await connectDb();
    const body = await req.json();
    const schedule = await ScheduleModel.findOneAndUpdate(
      { key: "weekly" },
      {
        key: "weekly",
        timezoneLabel: body.timezoneLabel,
        week: body.week,
      },
      { upsert: true, new: true },
    ).lean();
    return NextResponse.json({ ok: true, schedule });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Failed to save schedule" }, { status: 500 });
  }
}
