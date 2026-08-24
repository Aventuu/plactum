import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Tag from "@/components/Tag";
import { SIGNALS, PILLARS, FEATURED_ARTICLES, CATEGORY_COLOR, LATEST_ARTICLE } from "@/lib/data";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-14 sm:pt-24 sm:pb-20">
        <div className="mb-6 inline-block text-xs tracking-wider text-muted-faint font-mono">
          {LATEST_ARTICLE.issue} — {LATEST_ARTICLE.date}
        </div>
        <h1 className="max-w-3xl text-4xl leading-[1.1] sm:text-6xl sm:leading-[1.05] font-serif font-semibold text-paper">
          Quién construye la IA.
          <br />
          Quién le teme.
          <br />
          Quién no le cree.
        </h1>
        <p className="mt-6 max-w-xl text-base sm:text-lg text-muted">
          Cada semana leemos lo que publican, dicen y construyen los científicos, CEOs y
          críticos que están decidiendo el rumbo de la inteligencia artificial — y te
          contamos, en un solo análisis, qué significa de verdad.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={`/articulo/${LATEST_ARTICLE.slug}`}
            className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium bg-amber text-ink"
          >
            Leer más <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* SIGNAL STRIP */}
      <section className="border-y border-border bg-panel">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs tracking-wider text-muted-faint font-mono">
              ÚLTIMAS SEÑALES DETECTADAS
            </span>
            <span className="hidden sm:block text-xs text-muted-faint font-mono">← desliza →</span>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {SIGNALS.map((s) => (
              <div
                key={s.name}
                className="w-72 flex-shrink-0 rounded-lg p-4 bg-ink border border-border"
              >
                <Tag color={CATEGORY_COLOR[s.tag]}>{s.tag}</Tag>
                <div className="mt-3 text-sm font-semibold text-paper">{s.name}</div>
                <div className="text-xs mb-2 text-muted-faint">{s.role}</div>
                <p className="text-sm leading-relaxed text-muted">{s.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-faint">
            Ejemplo ilustrativo del formato — el número real se arma con fuentes verificadas de la semana.
          </p>
        </div>
      </section>

      {/* COBERTURA */}
      <section id="cobertura" className="mx-auto max-w-6xl px-6 py-20 scroll-mt-20">
        <span className="text-xs tracking-wider text-muted-faint font-mono">CÓMO ORGANIZAMOS LA SEÑAL</span>
        <h2 className="mt-3 max-w-2xl text-2xl sm:text-3xl font-serif font-semibold">
          La IA no habla con una sola voz. Nosotros seguimos las cuatro que importan.
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <div key={p.tag} className="rounded-lg p-6 bg-panel border border-border">
              <Tag color={CATEGORY_COLOR[p.tag]}>{p.tag}</Tag>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MÁS LEÍDOS */}
      <section className="border-y border-border bg-panel">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs tracking-wider text-muted-faint font-mono">MÁS LEÍDOS ESTA SEMANA</span>
              <h2 className="mt-3 max-w-2xl text-2xl sm:text-3xl font-serif font-semibold">
                Lo que más está leyendo el resto de los suscriptores.
              </h2>
            </div>
            <span className="hidden sm:block text-xs flex-shrink-0 text-muted-faint font-mono">← desliza →</span>
          </div>
          <div className="mt-10 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {FEATURED_ARTICLES.map((a) => (
              <Link
                key={a.slug}
                href={`/articulo/${a.slug}`}
                className="text-left w-72 sm:w-80 flex-shrink-0 rounded-lg p-6 bg-ink border border-border"
              >
                <div className="flex items-center justify-between gap-2">
                  <Tag color={CATEGORY_COLOR[a.tag]}>{a.tag}</Tag>
                  <span className="text-xs text-muted-faint font-mono">{a.rank}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold leading-snug font-serif text-paper">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.dek}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber">
                  Leer más <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-faint">
            Ejemplo ilustrativo del formato — en el sitio real, cada tarjeta lleva a su propio expediente.
          </p>
        </div>
      </section>

      {/* PRECIO — teaser */}
      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <span className="text-xs tracking-wider text-muted-faint font-mono">SUSCRIPCIÓN</span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-serif font-semibold">
          Un análisis a la semana. Cero ruido.
        </h2>
        <p className="mt-4 text-sm text-muted">
          Cupo fundador desde <span className="text-amber font-semibold">$4.99 USD/mes</span>, precio fijo de por vida.
        </p>
        <Link
          href="/precios"
          className="mt-6 inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium bg-amber text-ink"
        >
          Ver planes y precios <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
