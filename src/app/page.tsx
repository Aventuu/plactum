import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Tag from "@/components/Tag";
import { PILLARS } from "@/lib/data";
import { getSignals, getExpedienteCards, CATEGORY_COLOR, CATEGORY_LABEL } from "@/lib/content";

export default async function Home() {
  const [signals, expedientes] = await Promise.all([
    getSignals(8),
    getExpedienteCards(6),
  ]);
  const latest = expedientes[0];

  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-14 sm:pt-24 sm:pb-20 flex flex-col items-center text-center">
        {latest && (
          <div className="mb-6 text-xs tracking-wider text-muted-faint font-mono">
            EXPEDIENTE Nº {String(latest.issueNumber).padStart(3, "0")}
          </div>
        )}
        <h1 className="text-4xl leading-[1.1] sm:text-6xl sm:leading-[1.05] font-serif font-semibold text-paper">
          Un puñado de personas está decidiendo el futuro de la humanidad.
        </h1>
        {latest && (
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/articulo/${latest.slug}`}
              className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium bg-amber text-ink"
            >
              Descubre qué está pasando ahora <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* SIGNAL STRIP */}
      {signals.length > 0 && (
        <section className="border-y border-border bg-panel">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs tracking-wider text-muted-faint font-mono">
                ÚLTIMAS SEÑALES DETECTADAS
              </span>
              <span className="hidden sm:block text-xs text-muted-faint font-mono">← desliza →</span>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {signals.map((s) => (
                <div
                  key={s.id}
                  className="w-72 flex-shrink-0 rounded-lg p-4 bg-ink border border-border"
                >
                  {s.category && <Tag color={CATEGORY_COLOR[s.category]}>{CATEGORY_LABEL[s.category]}</Tag>}
                  <div className="mt-3 text-sm font-semibold text-paper">{s.figuraName}</div>
                  <div className="text-xs mb-2 text-muted-faint">{s.figuraRole}</div>
                  <p className="text-sm leading-relaxed text-muted">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COBERTURA */}
      <section id="cobertura" className="mx-auto max-w-6xl px-6 py-20 scroll-mt-20">
        <span className="text-xs tracking-wider text-muted-faint font-mono">CÓMO ORGANIZAMOS LA SEÑAL</span>
        <h2 className="mt-3 max-w-2xl text-2xl sm:text-3xl font-serif font-semibold">
          La IA no habla con una sola voz. Nosotros seguimos las cuatro que importan.
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <div key={p.tag} className="rounded-lg p-6 bg-panel border border-border">
              <Tag color={CATEGORY_COLOR[p.tag]}>{p.label}</Tag>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MÁS LEÍDOS */}
      {expedientes.length > 0 && (
        <section className="border-y border-border bg-panel">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs tracking-wider text-muted-faint font-mono">ARCHIVO DE EXPEDIENTES</span>
                <h2 className="mt-3 max-w-2xl text-2xl sm:text-3xl font-serif font-semibold">
                  Lo que ya publicamos.
                </h2>
              </div>
              <span className="hidden sm:block text-xs flex-shrink-0 text-muted-faint font-mono">← desliza →</span>
            </div>
            <div className="mt-10 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {expedientes.map((e) => (
                <Link
                  key={e.slug}
                  href={`/articulo/${e.slug}`}
                  className="text-left w-72 sm:w-80 flex-shrink-0 rounded-lg p-6 bg-ink border border-border"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Tag color={CATEGORY_COLOR[e.category]}>{CATEGORY_LABEL[e.category]}</Tag>
                    <span className="text-xs text-muted-faint font-mono">
                      Nº {String(e.issueNumber).padStart(3, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold leading-snug font-serif text-paper">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{e.deck}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber">
                    Leer más <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
