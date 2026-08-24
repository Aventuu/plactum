import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePaywall from "@/components/ArticlePaywall";
import { ARTICLES, getArticleBySlug } from "@/lib/data";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title, description: article.dek };
}

export default async function Articulo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <span className="text-xs tracking-wider text-muted-faint font-mono">
        {article.issue} — {article.date}
      </span>
      <h1 className="mt-3 text-3xl sm:text-5xl leading-[1.1] font-serif font-semibold">{article.title}</h1>
      <p className="mt-4 text-sm text-muted-faint">Lectura libre hasta la mitad</p>

      {article.body.map((p, i) => (
        <p key={i} className="mt-5 text-base leading-relaxed text-muted font-serif">
          {p}
        </p>
      ))}

      <ArticlePaywall lockedStart={article.lockedStart} />

      <p className="mt-8 text-xs text-muted-faint">
        Artículo de ejemplo para el mockup, basado en hechos públicos reales — el número real se arma con fuentes verificadas de la semana.
      </p>
    </section>
  );
}
