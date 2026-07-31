import Link from "next/link";
import { connectDb } from "@/lib/db";
import { Page } from "@/models/Page";
import { defaultPages } from "@/lib/cms/defaults";

export const dynamic = "force-dynamic";

export default async function AdminPagesListPage() {
  let pages = defaultPages();
  try {
    await connectDb();
    const docs = await Page.find({}).sort({ title: 1 }).lean();
    if (docs.length) {
      pages = JSON.parse(JSON.stringify(docs));
    }
  } catch {
    /* use defaults */
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Pages</h2>
        <p className="mt-1 text-sm text-white/50">
          Open a page to edit every section — headlines, copy and images.
        </p>
      </div>

      <div className="grid gap-3">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={`/admin/pages/${page.slug}`}
            className="admin-card flex items-center justify-between gap-4 transition hover:border-lime/40"
          >
            <div>
              <p className="font-bold text-white">{page.title}</p>
              <p className="mt-1 text-xs text-white/40">
                {page.path} · {page.sections?.length ?? 0} sections
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-lime">Edit →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
