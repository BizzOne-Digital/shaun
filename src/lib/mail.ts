import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/**
 * Gmail SMTP via nodemailer.
 *
 * Required env (use a Google App Password — not your normal Gmail password):
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=465
 *   SMTP_SECURE=true
 *   SMTP_USER=your@gmail.com
 *   SMTP_PASS=xxxx xxxx xxxx xxxx
 *   CONTACT_FROM_EMAIL=your@gmail.com   (must match SMTP_USER for Gmail)
 *   CONTACT_TO_EMAIL=inbox@example.com  (where form mail is delivered)
 */

export type SendMailInput = {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

let transporter: Transporter | null = null;

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      (process.env.CONTACT_FROM_EMAIL?.trim() || process.env.SMTP_USER?.trim()),
  );
}

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1"
      : port === 465;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  return transporter;
}

export async function sendMail(input: SendMailInput): Promise<void> {
  if (!isSmtpConfigured()) {
    throw new Error("SMTP is not configured");
  }

  const fromAddress =
    process.env.CONTACT_FROM_EMAIL?.trim() || process.env.SMTP_USER!.trim();
  const fromName = process.env.CONTACT_FROM_NAME?.trim() || "Monsterous Radio Website";
  const to = process.env.CONTACT_TO_EMAIL?.trim() || process.env.SMTP_USER!.trim();

  const mailer = getTransporter();

  await mailer.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}

/** Escape user content for HTML email bodies. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
