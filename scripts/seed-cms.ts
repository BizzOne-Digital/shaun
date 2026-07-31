/**
 * Seed MongoDB with admin user + current site content.
 *
 * Prerequisites:
 *   1. MongoDB running locally (MongoDB Compass / mongod)
 *   2. MONGODB_URI in .env.local (default mongodb://127.0.0.1:27017/monsterous-radio)
 *
 * Usage:
 *   npm run seed
 */

import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { hashPassword } from "../src/lib/auth";
import { defaultPages } from "../src/lib/cms/defaults";
import { AdminUser } from "../src/models/AdminUser";
import { Page } from "../src/models/Page";
import { SiteSettings } from "../src/models/SiteSettings";
import { ShowModel } from "../src/models/Show";
import { ArticleModel } from "../src/models/Article";
import { ScheduleModel } from "../src/models/Schedule";
import { siteConfig } from "../src/config/siteConfig";
import { shows } from "../src/data/shows";
import { articles } from "../src/data/articles";
import { schedule } from "../src/data/schedule";

loadEnvConfig(process.cwd());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/monsterous-radio";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@monsterousradio.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "MonsterousAdmin123!";

async function main() {
  console.log("Connecting:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const passwordHash = await hashPassword(ADMIN_PASSWORD);
  await AdminUser.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    { email: ADMIN_EMAIL, passwordHash, name: "Site Admin" },
    { upsert: true, new: true },
  );
  console.log(`Admin user: ${ADMIN_EMAIL}`);

  await SiteSettings.findOneAndUpdate(
    { key: "main" },
    {
      key: "main",
      name: siteConfig.name,
      tagline: siteConfig.tagline,
      heroHeadline: siteConfig.heroHeadline,
      description: siteConfig.description,
      logoUrl: "/brand/logo.png",
      mascotUrl: "/brand/monster.png",
      contact: { ...siteConfig.contact },
      social: { ...siteConfig.social },
      mediaKitUrl: siteConfig.mediaKitUrl,
      mediaKitAvailable: siteConfig.mediaKitAvailable,
      showAdvertisingPrices: siteConfig.showAdvertisingPrices,
      genres: [...siteConfig.genres],
      stats: siteConfig.stats.map((s) => ({ ...s })),
    },
    { upsert: true, new: true },
  );
  console.log("Site settings seeded");

  for (const page of defaultPages()) {
    await Page.findOneAndUpdate({ slug: page.slug }, page, { upsert: true, new: true });
  }
  console.log(`Pages seeded: ${defaultPages().length}`);

  let order = 0;
  for (const show of shows) {
    await ShowModel.findOneAndUpdate(
      { slug: show.slug },
      { ...show, published: true, order: order++ },
      { upsert: true, new: true },
    );
  }
  console.log(`Shows seeded: ${shows.length}`);

  for (const article of articles) {
    await ArticleModel.findOneAndUpdate(
      { slug: article.slug },
      { ...article, published: true },
      { upsert: true, new: true },
    );
  }
  console.log(`Articles seeded: ${articles.length}`);

  await ScheduleModel.findOneAndUpdate(
    { key: "weekly" },
    {
      key: "weekly",
      timezoneLabel: siteConfig.timezoneLabel,
      week: schedule,
    },
    { upsert: true, new: true },
  );
  console.log("Schedule seeded");

  await mongoose.disconnect();
  console.log("\nDone. Open MongoDB Compass → database `monsterous-radio`");
  console.log(`Login at /admin/login\n  Email: ${ADMIN_EMAIL}\n  Password: ${ADMIN_PASSWORD}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
