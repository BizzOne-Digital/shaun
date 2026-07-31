# Monsterous Radio — Website

> **Playin' Your Favorite Monster Hits!**
> A cinematic, production-quality website for the international 24/7 online radio
> station, built in the "Neo Broadcast Noir" visual direction.

Built with **Next.js (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · GSAP · Lenis · Lucide**.

---

## 1. Installation

```bash
npm install
npm run dev        # development → http://localhost:3000
npm run lint       # ESLint
npm run build      # production build
npm run start      # serve the production build
```

Node 18+ recommended.

## 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_RADIO_STREAM_URL` | **Direct** audio stream URL (MP3/AAC/HLS) from the streaming provider. Enables in-browser playback everywhere. |
| `NEXT_PUBLIC_RADIO_METADATA_URL` | Optional now-playing metadata endpoint (e.g. Icecast `status-json.xsl`). |
| `NEXT_PUBLIC_LEGACY_PLAYER_URL` | Optional legacy player embed URL — shown on /listen only when no direct stream URL exists. |
| `SMTP_HOST` | Gmail SMTP host (`smtp.gmail.com`). |
| `SMTP_PORT` | `465` (SSL) or `587` (STARTTLS). |
| `SMTP_SECURE` | `true` for port 465, `false` for 587. |
| `SMTP_USER` | Full Gmail address used to authenticate. |
| `SMTP_PASS` | Google **App Password** (not your normal Gmail password). |
| `CONTACT_FROM_EMAIL` | Sender address — must match `SMTP_USER` for Gmail. |
| `CONTACT_FROM_NAME` | Display name on outbound form emails. |
| `CONTACT_TO_EMAIL` | Destination mailbox for form submissions. |

**Without a stream URL** the site shows a graceful branded player state (no crash).
**Without SMTP credentials** form submissions are logged to the server console and the
visitor sees a success state with a mailto fallback — again, no crash.

## 3. Stream URL Setup

A webpage URL is **not** enough — you need the actual stream endpoint from the
streaming provider (usually ends in `.mp3`, `.aac` or `/stream`). Add it as
`NEXT_PUBLIC_RADIO_STREAM_URL`, rebuild, and the persistent player, Listen Live page,
homepage Live Now module and mobile menu all become playable instantly.

## 4b. Admin Panel (MongoDB CMS)

1. Install and start **MongoDB** locally (or Atlas).
2. Open **MongoDB Compass** and connect to:
   `mongodb://127.0.0.1:27017`
3. Add to `.env.local`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/monsterous-radio
AUTH_SECRET=change-me-to-a-long-random-string
ADMIN_EMAIL=admin@monsterousradio.com
ADMIN_PASSWORD=MonsterousAdmin123!
```

4. Seed the database (admin user + all current site content):

```bash
npm run seed
```

5. Open **http://localhost:3000/admin/login** and sign in.

Sidebar includes: **Dashboard · Pages · Shows · News · Schedule · Media · Site Settings**.  
Each page has section-by-section editors (headline, body, image upload).  
**Images are stored in MongoDB** (not `public/uploads`) so they work on Vercel.  
URLs look like `/api/uploads/{folder}/{filename}`. Use the same `MONGODB_URI` (Atlas) on Vercel so uploads survive redeploys.



1. On the sending Gmail account, turn on **2-Step Verification**.
2. Create an [App Password](https://myaccount.google.com/apppasswords) (select
   “Mail” / “Other” → name it e.g. `Monsterous Radio`).
3. Copy `.env.example` → `.env.local` and set:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your.gmail@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
CONTACT_FROM_EMAIL=your.gmail@gmail.com
CONTACT_FROM_NAME=Monsterous Radio Website
CONTACT_TO_EMAIL=sbyoung2000@gmail.com
```

4. Restart `npm run dev` after changing env vars.
5. All three forms (contact, advertising, newsletter) go through
   `src/app/api/contact/route.ts` → `src/lib/mail.ts` (nodemailer), with Zod
   validation, a honeypot field, and basic in-memory rate limiting.

**Notes:** Gmail rate-limits App Passwords (~100–500 messages/day depending on
account). For production volume, consider a dedicated transactional provider later.

## 5. Media Kit Setup

1. Place the approved PDF at `public/documents/monsterous-radio-media-kit.pdf`.
2. In `src/config/siteConfig.ts` set `mediaKitAvailable: true`.
   Until then, /media-kit elegantly disables the download and offers email requests.

## 6. Where to Edit Content

Everything editable lives in data/config files — no component changes needed:

| File | Contains |
| --- | --- |
| `src/config/siteConfig.ts` | **All contact info**, tagline, socials, stream settings, ad-slot toggles, `showAdvertisingPrices`, media-kit flag, genres, stats. |
| `src/data/schedule.ts` | Weekly schedule (Philippine Time) — confirmed against the client's official spreadsheet. |
| `src/data/shows.ts` | Show catalog — names, genres, descriptions, air-time summaries, artwork colors. Drop real artwork in `public/shows/` and set `image:` per show. |
| `src/data/articles.ts` | News & features articles (each becomes `/news/[slug]`). |
| `src/data/advertising.ts` | Advertising formats. Add `price` fields + flip `showAdvertisingPrices` when the client approves one rate card. |

### Business rules already applied

- Uses contact email `sbyoung2000@gmail.com` (never `info@monsterousradio.com`).
- No advertising prices published (old rate cards conflict).
- No invented listener counts, DJs, testimonials or events.
- No domain/DNS logic included.

## 7. Advertising System

Reusable components in `src/components/advertising/`:
`<AdSlot />`, `<TopBannerAd />`, `<SidebarAd />`, `<PlayerAd />`, `<FooterAd />`,
`<SponsorBadge />`, `<ShowSponsor />`.

Each accepts a campaign object (image, alt, url, sponsor name, start/end dates,
active flag). Empty slots show a premium "Advertise Here" placeholder or collapse —
configured per slot in `siteConfig.adSlots`.

## 8. Deployment

The site is a standard Next.js app — Vercel is the easiest target:

1. Push the repo to GitHub and import it in Vercel.
2. Add the environment variables from section 2.
3. Deploy. `sitemap.xml`, `robots.txt` and all metadata are generated automatically.

For other hosts: `npm run build && npm run start` behind any Node-capable server.
**Do not point the domain until the client approves the site** (per project rules).

## 9. Project Structure

```
src/
  app/            → routes (/, listen, shows, shows/[slug], news, news/[slug],
                    advertise, media-kit, about, contact, privacy, terms,
                    api/contact, sitemap, robots)
  components/
    advertising/  → ad slot system + placement preview
    animations/   → intro overlay, reveals, waveform, equalizer, count-up, magnetic buttons
    forms/        → contact, advertiser, newsletter + shared submit logic
    layout/       → header, status strip, footer, page hero
    news/         → news explorer, share buttons
    player/       → persistent radio player + listen experience
    schedule/     → interactive weekly schedule
    shows/        → show cards
    ui/           → show artwork generator, mascot, brand icons, section heading
  config/         → siteConfig.ts (single source of truth)
  data/           → schedule, shows, articles, advertising
  lib/            → schedule/time utilities
  providers/      → PlayerProvider (global audio), LenisProvider (smooth scroll)
  types/          → shared TypeScript types
public/
  brand/  shows/  news/  studio/  sponsors/  documents/  social/
```
