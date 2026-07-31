import Link from "next/link";
import { connectDb } from "@/lib/db";
import { Page } from "@/models/Page";
import { ShowModel } from "@/models/Show";
import { ArticleModel } from "@/models/Article";
import { StoredUpload } from "@/models/StoredUpload";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let stats = { pages: 0, shows: 0, articles: 0, media: 0 };
  let dbOk = true;

  try {
    await connectDb();
    const [pages, shows, articles, media] = await Promise.all([
      Page.countDocuments(),
      ShowModel.countDocuments(),
      ArticleModel.countDocuments(),
      StoredUpload.countDocuments(),
    ]);
    stats = { pages, shows, articles, media };
  } catch {
    dbOk = false;
  }

  const cards = [
    { label: "Pages", value: stats.pages, href: "/admin/pages" },
    { label: "Shows", value: stats.shows, href: "/admin/shows" },
    { label: "News", value: stats.articles, href: "/admin/news" },
    { label: "Media files", value: stats.media, href: "/admin/media" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="mt-1 text-sm text-white/50">
          Edit every page section, image, show, article and setting from the sidebar.
        </p>
      </div>

      {!dbOk && (
        <div className="rounded-xl border border-magenta/40 bg-magenta/10 px-4 py-3 text-sm text-white/80">
          MongoDB is not connected. Start MongoDB Compass / mongod, set{" "}
          <code className="text-lime">MONGODB_URI</code> in <code>.env.local</code>, then run{" "}
          <code className="text-lime">npm run seed</code>.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="admin-card transition hover:border-lime/40">
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-lime">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="admin-card space-y-3">
        <h3 className="font-bold text-white">Quick links</h3>
        <ul className="grid gap-2 text-sm text-white/70 sm:grid-cols-2">
          <li>
            <Link className="hover:text-lime" href="/admin/pages/home">
              Edit Home page sections
            </Link>
          </li>
          <li>
            <Link className="hover:text-lime" href="/admin/settings">
              Contact email, phone, tagline
            </Link>
          </li>
          <li>
            <Link className="hover:text-lime" href="/admin/schedule">
              Weekly schedule
            </Link>
          </li>
          <li>
            <Link className="hover:text-lime" href="/admin/media">
              Upload images
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
