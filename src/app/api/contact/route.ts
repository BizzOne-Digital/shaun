import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

/**
 * Universal form endpoint (contact / advertising / newsletter).
 * Email delivery uses Resend when RESEND_API_KEY is configured;
 * otherwise submissions are logged server-side and the client is
 * told to fall back to mailto — the site never crashes.
 */

const baseSchema = z.object({
  formType: z.enum(["contact", "advertising", "newsletter"]),
  name: z.string().min(2, "Name is too short").max(120),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(40).optional().or(z.literal("")),
  subject: z.string().max(200).optional().or(z.literal("")),
  inquiryType: z.string().max(80).optional().or(z.literal("")),
  businessName: z.string().max(160).optional().or(z.literal("")),
  website: z.string().max(300).optional().or(z.literal("")),
  targetAudience: z.string().max(400).optional().or(z.literal("")),
  preferredShow: z.string().max(120).optional().or(z.literal("")),
  campaignType: z.string().max(120).optional().or(z.literal("")),
  budget: z.string().max(80).optional().or(z.literal("")),
  startDate: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(5, "Message is too short").max(5000),
  // Honeypot — must stay empty; bots fill it in.
  company_website: z.string().max(0).optional().or(z.literal("")),
});

// ── Basic in-memory rate limiting (per server instance) ──────────
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function buildEmailBody(data: z.infer<typeof baseSchema>): string {
  const lines = [
    `Form type: ${data.formType}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone && `Phone: ${data.phone}`,
    data.businessName && `Business: ${data.businessName}`,
    data.website && `Website: ${data.website}`,
    data.inquiryType && `Inquiry type: ${data.inquiryType}`,
    data.subject && `Subject: ${data.subject}`,
    data.targetAudience && `Target audience: ${data.targetAudience}`,
    data.preferredShow && `Preferred show: ${data.preferredShow}`,
    data.campaignType && `Campaign type: ${data.campaignType}`,
    data.budget && `Approximate budget: ${data.budget}`,
    data.startDate && `Campaign start date: ${data.startDate}`,
    "",
    "Message:",
    data.message,
  ].filter(Boolean);
  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const json = await req.json();
    const parsed = baseSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Honeypot triggered → pretend success, deliver nothing.
    if (data.company_website) {
      return NextResponse.json({ ok: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL || "sbyoung1979@hotmail.com";
    const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

    if (!apiKey) {
      console.warn(
        "[Monsterous Radio] RESEND_API_KEY is not set — form submission logged only.\n" +
          buildEmailBody(data)
      );
      return NextResponse.json({ ok: true, delivered: false, fallback: true });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const subjectPrefix =
      data.formType === "advertising"
        ? "Advertising Inquiry"
        : data.formType === "newsletter"
          ? "Newsletter Signup"
          : "Website Contact";

    const { error } = await resend.emails.send({
      from: `Monsterous Radio Website <${from}>`,
      to: [to],
      replyTo: data.email,
      subject: `${subjectPrefix}: ${data.subject || data.name}`,
      text: buildEmailBody(data),
    });

    if (error) {
      console.error("[Monsterous Radio] Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Email delivery failed. Please email us directly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[Monsterous Radio] Contact route error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
