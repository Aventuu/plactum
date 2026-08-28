import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFichaCards } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Modelos y tecnologías nuevas de IA, evaluadas: qué prometen frente a qué se puede verificar hoy.",
};

export default async function Reviews() {
  const fichas = await getFichaCards(50);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <span className="text-xs tracking-wider text-muted-faint font-mono">REVIEWS</span>
      <h1 className="mt-3 max-w-2xl text-3xl sm:text-5xl leading-[1.1] font-serif font-semibold">
        Lo nuevo, puesto a prueba.
      </h1>
      <p className="mt-4 max-w-lg text-base sm:text-lg text-muted">
        Modelos y tecnologías que salen esta semana — qué prometen frente a qué se puede
        verificar hoy, con la misma distancia crítica de siempre.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {fichas.map((f) => (
          <Link
            key={f.slug}
            href={`/reviews/${f.slug}`}
            className="rounded-lg p-6 bg-panel border border-border hover:border-muted-faint"
          >
            <span className="text-xs text-muted-faint font-mono">
              {f.laboratorio} · {f.modelo}
            </span>
            <h2 className="mt-3 text-lg font-semibold leading-snug font-serif text-paper">{f.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.deck}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber">
              Leer ficha técnica <ArrowRight size={14} />
            </span>
          </Link>
        ))}
        {fichas.length === 0 && (
          <p className="text-sm text-muted-faint">Todavía no hay fichas técnicas publicadas.</p>
        )}
      </div>
    </section>
  );
}
