import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/siteConfig";
import { shows } from "@/data/shows";
import { articles } from "@/data/articles";
import { events } from "@/data/events";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticRoutes = [
    "",
    "/listen",
    "/shows",
    "/events",
    "/news",
    "/advertise",
    "/media-kit",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const showRoutes = shows.map((s) => ({
    url: `${base}/shows/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${base}/news/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const eventRoutes = events.map((e) => ({
    url: `${base}/events/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...showRoutes, ...articleRoutes, ...eventRoutes];
}
