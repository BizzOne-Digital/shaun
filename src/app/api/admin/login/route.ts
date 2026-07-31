import { NextResponse, type NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import { AdminUser } from "@/models/AdminUser";
import {
  createSessionToken,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password required." }, { status: 400 });
    }

    await connectDb();
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    const token = await createSessionToken({
      sub: String(user._id),
      email: user.email,
    });

    const res = NextResponse.json({ ok: true, email: user.email });
    const cookie = sessionCookieOptions(token);
    res.cookies.set(cookie.name, cookie.value, cookie);
    return res;
  } catch (err) {
    console.error("[admin login]", err);
    return NextResponse.json(
      { ok: false, error: "Login failed. Is MongoDB running?" },
      { status: 500 },
    );
  }
}
