import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFichaBySlug } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ficha = await getFichaBySlug(slug);
  if (!ficha) return {};

  const url = `https://www.plactum.com/lanzamientos/${ficha.slug}`;
  const keywords = [ficha.modelo, ficha.laboratorio, ...ficha.figuras, "inteligencia artificial", "Plactum"];

  return {
    title: ficha.title,
    description: ficha.deck,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: ficha.title,
      description: ficha.deck,
      siteName: "Plactum",
      locale: "es_CO",
      publishedTime: ficha.publishedAt,
      tags: [ficha.modelo, ficha.laboratorio],
    },
    twitter: {
      card: "summary_large_image",
      title: ficha.title,
      description: ficha.deck,
    },
  };
}

function formatPublishedDate(iso: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(iso))
    .toUpperCase();
}

export default async function Ficha({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ficha = await getFichaBySlug(slug);
  if (!ficha) notFound();

  const url = `https://www.plactum.com/lanzamientos/${ficha.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ficha.title,
    description: ficha.deck,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: ficha.publishedAt,
    dateModified: ficha.publishedAt,
    about: [ficha.modelo, ficha.laboratorio],
    inLanguage: "es",
    isAccessibleForFree: true,
    author: { "@type": "Organization", name: "Plactum", url: "https://www.plactum.com" },
    publisher: {
      "@type": "Organization",
      name: "Plactum",
      url: "https://www.plactum.com",
      logo: { "@type": "ImageObject", url: "https://www.plactum.com/favicon.ico" },
    },
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <span className="text-xs tracking-wider text-muted-faint font-mono">
        FICHA TÉCNICA — {formatPublishedDate(ficha.publishedAt)}
      </span>
      <h1 className="mt-3 text-3xl sm:text-5xl leading-[1.1] font-serif font-semibold">{ficha.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted font-serif">{ficha.deck}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full px-2.5 py-1 text-xs font-medium font-mono bg-panel border border-border text-paper">
          {ficha.laboratorio} · {ficha.modelo}
        </span>
        {ficha.readingTimeMinutes && (
          <span className="text-xs text-muted-faint font-mono">{ficha.readingTimeMinutes} min de lectura</span>
        )}
        {ficha.figuras.length > 0 && (
          <span className="text-xs text-muted-faint">{ficha.figuras.join(" · ")}</span>
        )}
      </div>

      <div className="mt-8 rounded-lg p-6 bg-panel border border-border">
        <span className="text-xs tracking-wider text-muted-faint font-mono">QUÉ ES</span>
        <p className="mt-3 text-sm leading-relaxed text-paper">{ficha.queEs}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl sm:text-2xl font-serif font-semibold text-paper">
          Qué prometen vs. qué se puede verificar hoy
        </h2>
        {ficha.promesaVsEvidencia.split("\n\n").map((p, i) => (
          <p key={i} className="mt-4 text-base leading-relaxed text-muted font-serif">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl sm:text-2xl font-serif font-semibold text-paper">Frente a qué compite</h2>
        {ficha.frenteAQueCompite.split("\n\n").map((p, i) => (
          <p key={i} className="mt-4 text-base leading-relaxed text-muted font-serif">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl sm:text-2xl font-serif font-semibold text-paper">Para quién importa</h2>
        {ficha.paraQuienImporta.split("\n\n").map((p, i) => (
          <p key={i} className="mt-4 text-base leading-relaxed text-muted font-serif">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl sm:text-2xl font-serif font-semibold text-paper">Fuentes</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {ficha.fuentes.map((f, i) => (
            <li key={i}>
              <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">
                {f.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
