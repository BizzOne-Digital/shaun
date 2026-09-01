import { connectDb, isDbConfigured } from "@/lib/db";
import { Page } from "@/models/Page";
import { SiteSettings } from "@/models/SiteSettings";
import { ShowModel } from "@/models/Show";
import { ArticleModel } from "@/models/Article";
import { ScheduleModel } from "@/models/Schedule";
import { siteConfig } from "@/config/siteConfig";
import { shows as staticShows } from "@/data/shows";
import { articles as staticArticles } from "@/data/articles";
import { schedule as staticSchedule } from "@/data/schedule";
import { defaultPages } from "@/lib/cms/defaults";
import type { Show, Article, WeekSchedule } from "@/types";

function lean<T>(doc: unknown): T | null {
  if (!doc) return null;
  return JSON.parse(JSON.stringify(doc)) as T;
}

export async function getSiteSettings() {
  if (!isDbConfigured()) return siteConfig;
  try {
    await connectDb();
    const doc = await SiteSettings.findOne({ key: "main" }).lean();
    if (doc) return lean<typeof siteConfig & Record<string, unknown>>(doc)!;
  } catch (err) {
    console.warn("[CMS] settings fallback:", err);
  }
  return siteConfig;
}

export async function getCmsPage(slug: string) {
  if (!isDbConfigured()) return defaultPages().find((p) => p.slug === slug) ?? null;
  try {
    await connectDb();
    const doc = await Page.findOne({ slug }).lean();
    if (doc) return lean<ReturnType<typeof defaultPages>[number]>(doc);
  } catch (err) {
    console.warn("[CMS] page fallback:", err);
  }
  return defaultPages().find((p) => p.slug === slug) ?? null;
}

export async function getCmsPages() {
  if (!isDbConfigured()) return defaultPages();
  try {
    await connectDb();
    const docs = await Page.find({}).sort({ title: 1 }).lean();
    if (docs.length) return lean<ReturnType<typeof defaultPages>>(docs)!;
  } catch (err) {
    console.warn("[CMS] pages fallback:", err);
  }
  return defaultPages();
}

function normalizeShow(doc: Show): Show {
  const fallback = staticShows.find((s) => s.slug === doc.slug);
  const art = doc.art?.from && doc.art?.to && doc.art?.accent && doc.art?.word
    ? doc.art
    : fallback?.art ?? {
        from: "#53107a",
        to: "#050407",
        accent: "#b6e51d",
        word: doc.name.slice(0, 12).toUpperCase(),
        sub: doc.genre,
      };

  return {
    ...fallback,
    ...doc,
    genres: doc.genres?.length ? doc.genres : fallback?.genres ?? [doc.genre],
    art,
  };
}

export async function getCmsShows(): Promise<Show[]> {
  if (!isDbConfigured()) return staticShows;
  try {
    await connectDb();
    const docs = await ShowModel.find({ published: true }).sort({ order: 1, name: 1 }).lean();
    if (docs.length) {
      return lean<Show[]>(docs)!.map(normalizeShow);
    }
  } catch (err) {
    console.warn("[CMS] shows fallback:", err);
  }
  return staticShows;
}

export async function getCmsArticles(): Promise<Article[]> {
  if (!isDbConfigured()) return staticArticles;
  try {
    await connectDb();
    const docs = await ArticleModel.find({ published: true }).sort({ date: -1 }).lean();
    if (docs.length) return lean<Article[]>(docs)!;
  } catch (err) {
    console.warn("[CMS] articles fallback:", err);
  }
  return staticArticles;
}

export async function getCmsSchedule(): Promise<WeekSchedule> {
  if (!isDbConfigured()) return staticSchedule;
  try {
    await connectDb();
    const doc = await ScheduleModel.findOne({ key: "weekly" }).lean();
    if (doc && (doc as { week?: WeekSchedule }).week) {
      return lean<WeekSchedule>((doc as { week: WeekSchedule }).week)!;
    }
  } catch (err) {
    console.warn("[CMS] schedule fallback:", err);
  }
  return staticSchedule;
}

export function getSection(
  page: { sections?: Array<{ key: string; enabled?: boolean }> } | null,
  key: string,
) {
  const section = page?.sections?.find((s) => s.key === key);
  if (!section || section.enabled === false) return null;
  return section as {
    key: string;
    label: string;
    enabled: boolean;
    headline: string;
    subheadline: string;
    body: string;
    image: string;
    imageAlt: string;
    ctaLabel: string;
    ctaHref: string;
  };
}
