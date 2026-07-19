import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { articles, getArticle, getRelatedArticles } from "@/data/articles";
import { siteConfig } from "@/config/siteConfig";
import { ShowArtwork } from "@/components/ui/ShowArtwork";
import { ShareButtons } from "@/components/news/ShareButtons";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `${siteConfig.url}/news/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.slug);
  const url = `${siteConfig.url}/news/${article.slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/brand/logo.png` },
    },
    mainEntityOfPage: url,
  };

  return (
    <>
      <Script
        id={`jsonld-article-${article.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <article className="pt-[150px]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted transition-colors hover:text-lime"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All Stories
            </Link>
            <p className="mt-6 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-magenta">
              {article.category} · {formatDate(article.date)} · {article.readingTime}
            </p>
            <h1 className="display mt-4 text-[clamp(2.2rem,5.5vw,3.8rem)] text-white">{article.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">{article.excerpt}</p>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
          <ShowArtwork
            art={{ ...article.art, accent: "#f8f6fb", word: article.art.word }}
            image={article.image}
            name={article.title}
            className="aspect-[16/7] w-full rounded-3xl"
          />
        </Reveal>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="space-y-6 text-base leading-[1.85] text-white/85">
            {article.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-12 border-t border-line pt-8">
            <ShareButtons url={url} title={article.title} />
          </div>
        </div>
      </article>

      <section className="border-t border-line bg-surface/40 py-16" aria-label="Related stories">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="Keep Reading" title="Related Stories" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.08}>
                <Link
                  href={`/news/${a.slug}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-violet/50"
                >
                  <ShowArtwork
                    art={{ ...a.art, accent: "#f8f6fb", word: a.art.word }}
                    image={a.image}
                    name={a.title}
                    className="aspect-[16/9] w-full"
                  />
                  <div className="p-5">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-magenta">
                      {a.category} · {formatDate(a.date)}
                    </p>
                    <h3 className="display mt-2 text-xl text-white transition-colors group-hover:text-lime">
                      {a.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
