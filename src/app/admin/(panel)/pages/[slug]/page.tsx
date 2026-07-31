import { notFound } from "next/navigation";
import { connectDb } from "@/lib/db";
import { Page } from "@/models/Page";
import { defaultPages } from "@/lib/cms/defaults";
import { PageEditor } from "@/components/admin/PageEditor";

export const dynamic = "force-dynamic";

export default async function AdminPageEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let page = defaultPages().find((p) => p.slug === slug) ?? null;

  try {
    await connectDb();
    const doc = await Page.findOne({ slug }).lean();
    if (doc) page = JSON.parse(JSON.stringify(doc));
  } catch {
    /* fallback */
  }

  if (!page) notFound();

  return <PageEditor initial={page} />;
}
