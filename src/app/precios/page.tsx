import type { Metadata } from "next";
import FeatureList from "@/components/FeatureList";
import SubscribeForm from "@/components/SubscribeForm";
import { FAQ, FEATURES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Precios",
  description: "Cupo fundador desde $4.99 USD/mes, precio fijo de por vida.",
};

export default function Precios() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <span className="text-xs tracking-wider text-muted-faint font-mono">PRECIOS</span>
      <h1 className="mt-3 max-w-2xl text-3xl sm:text-5xl leading-[1.1] font-serif font-semibold">
        El precio sube cuando se llena el cupo.
      </h1>
      <p className="mt-4 max-w-lg text-base sm:text-lg text-muted">
        Los primeros suscriptores fijan su precio para siempre. Los que lleguen
        después, pagan el precio regular.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {/* FUNDADOR */}
        <div className="relative rounded-lg p-8 pt-10 bg-panel border border-amber">
          <div className="absolute -top-3 left-8">
            <span className="rounded-full px-3 py-1 text-xs font-medium bg-amber text-ink font-mono">
              CUPO FUNDADOR
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-semibold font-serif">$4.99</span>
            <span className="text-sm text-muted-faint">USD/mes</span>
          </div>
          <p className="mt-1 text-sm font-medium text-amber">Precio fijo de por vida — nunca sube</p>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs mb-1.5 text-muted-faint font-mono">
              <span>Cupos fundadores ocupados</span>
              <span>35%</span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden bg-border">
              <div className="h-full rounded-full bg-amber" style={{ width: "35%" }} />
            </div>
            <p className="mt-1.5 text-xs text-muted-faint">
              Vista de ejemplo — el sitio real mostrará el avance real sobre un cupo limitado, sin revelar el número total.
            </p>
          </div>

          <FeatureList items={[...FEATURES, "Precio congelado mientras sigas suscrito"]} checkColor="#E8A33D" />

          <SubscribeForm />
        </div>

        {/* REGULAR */}
        <div className="rounded-lg p-8 pt-10 bg-panel border border-border">
          <span className="text-xs font-medium tracking-wider text-muted-faint font-mono">PRECIO REGULAR</span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-semibold font-serif text-muted">$14.99</span>
            <span className="text-sm text-muted-faint">USD/mes</span>
          </div>
          <p className="mt-1 text-sm text-muted-faint">Se activa cuando se agote el cupo fundador</p>

          <FeatureList items={FEATURES} checkColor="#5B5D68" />

          <button
            disabled
            className="mt-6 w-full rounded-md py-2.5 text-sm font-medium cursor-not-allowed bg-transparent text-muted-faint border border-border"
          >
            Disponible al agotarse el fundador
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20 max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-serif font-semibold">Preguntas frecuentes</h2>
        <div className="mt-4">
          {FAQ.map((item) => (
            <div key={item.q} className="py-5 border-t border-border">
              <p className="text-sm font-semibold text-paper">{item.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
