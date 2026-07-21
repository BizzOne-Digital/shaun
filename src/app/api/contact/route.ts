import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { escapeHtml, isSmtpConfigured, sendMail } from "@/lib/mail";

/**
 * Universal form endpoint (contact / advertising / newsletter).
 * Delivers via Gmail SMTP (nodemailer) when SMTP_* env vars are set.
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

type FormData = z.infer<typeof baseSchema>;

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

function subjectPrefix(formType: FormData["formType"]): string {
  if (formType === "advertising") return "Advertising Inquiry";
  if (formType === "newsletter") return "Newsletter Signup";
  return "Website Contact";
}

function buildPlainBody(data: FormData): string {
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

function buildHtmlBody(data: FormData): string {
  const row = (label: string, value?: string | null) =>
    value
      ? `<tr>
          <td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:6px 0;color:#111827;">${escapeHtml(value)}</td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;">
    <tr>
      <td style="padding:20px 24px;background:#150920;color:#b6e51d;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
        Monsterous Radio · ${escapeHtml(subjectPrefix(data.formType))}
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="font-size:14px;line-height:1.5;">
          ${row("Name", data.name)}
          ${row("Email", data.email)}
          ${row("Phone", data.phone)}
          ${row("Business", data.businessName)}
          ${row("Website", data.website)}
          ${row("Inquiry type", data.inquiryType)}
          ${row("Subject", data.subject)}
          ${row("Target audience", data.targetAudience)}
          ${row("Preferred show", data.preferredShow)}
          ${row("Campaign type", data.campaignType)}
          ${row("Budget", data.budget)}
          ${row("Start date", data.startDate)}
        </table>
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e7eb;">
          <p style="margin:0 0 8px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Message</p>
          <p style="margin:0;color:#111827;font-size:14px;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const json = await req.json();
    const parsed = baseSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Honeypot triggered → pretend success, deliver nothing.
    if (data.company_website) {
      return NextResponse.json({ ok: true });
    }

    if (!isSmtpConfigured()) {
      console.warn(
        "[Monsterous Radio] SMTP is not configured — form submission logged only.\n" +
          buildPlainBody(data),
      );
      return NextResponse.json({ ok: true, delivered: false, fallback: true });
    }

    await sendMail({
      subject: `${subjectPrefix(data.formType)}: ${data.subject || data.name}`,
      text: buildPlainBody(data),
      html: buildHtmlBody(data),
      replyTo: data.email,
    });

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[Monsterous Radio] Contact route error:", err);
    return NextResponse.json(
      { ok: false, error: "Email delivery failed. Please email us directly." },
      { status: 502 },
    );
  }
}
