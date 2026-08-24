import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePaywall from "@/components/ArticlePaywall";
import Tag from "@/components/Tag";
import { getExpedienteBySlug, CATEGORY_COLOR, CATEGORY_LABEL } from "@/lib/content";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const expediente = await getExpedienteBySlug(slug);
  if (!expediente) return {};
  return { title: expediente.title, description: expediente.deck };
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

async function hasActiveAccess() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("subscribers")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  return data?.status === "active";
}

export default async function Articulo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [expediente, hasAccess] = await Promise.all([getExpedienteBySlug(slug), hasActiveAccess()]);
  if (!expediente) notFound();

  const [freeSection, ...lockedSections] = expediente.cuerpo;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <span className="text-xs tracking-wider text-muted-faint font-mono">
        EXPEDIENTE Nº {String(expediente.issueNumber).padStart(3, "0")} — {formatPublishedDate(expediente.publishedAt)}
      </span>
      <h1 className="mt-3 text-3xl sm:text-5xl leading-[1.1] font-serif font-semibold">{expediente.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted font-serif">{expediente.deck}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Tag color={CATEGORY_COLOR[expediente.category]}>{CATEGORY_LABEL[expediente.category]}</Tag>
        {expediente.readingTimeMinutes && (
          <span className="text-xs text-muted-faint font-mono">{expediente.readingTimeMinutes} min de lectura</span>
        )}
        {expediente.figuras.length > 0 && (
          <span className="text-xs text-muted-faint">{expediente.figuras.join(" · ")}</span>
        )}
      </div>

      {/* Lo esencial — gratis, antes del muro */}
      <div className="mt-8 rounded-lg p-6 bg-panel border border-border">
        <span className="text-xs tracking-wider text-muted-faint font-mono">LO ESENCIAL</span>
        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-paper">
          {expediente.loEsencial.map((bullet, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-amber flex-shrink-0">—</span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* Cuerpo — primera sección libre, el resto solo si hay suscripción activa */}
      <div className="mt-8">
        <h2 className="text-xl sm:text-2xl font-serif font-semibold text-paper">{freeSection.heading}</h2>
        {freeSection.body.split("\n\n").map((p, i) => (
          <p key={i} className="mt-4 text-base leading-relaxed text-muted font-serif">
            {p}
          </p>
        ))}
      </div>

      {hasAccess ? (
        <>
          {lockedSections.map((section, i) => (
            <div key={i} className="mt-8">
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-paper">{section.heading}</h2>
              {section.body.split("\n\n").map((p, j) => (
                <p key={j} className="mt-4 text-base leading-relaxed text-muted font-serif">
                  {p}
                </p>
              ))}
            </div>
          ))}

          <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-paper">Por qué importa</h2>
            <p className="mt-4 text-base leading-relaxed text-muted font-serif">{expediente.porQueImporta}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-paper">Fuentes</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {expediente.fuentes.map((f, i) => (
                <li key={i}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-amber hover:underline">
                    {f.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        // Sin suscripción activa: el resto del expediente (secciones
        // restantes, "por qué importa", fuentes) nunca se manda al cliente —
        // solo el encabezado de la siguiente sección, como anticipo.
        <ArticlePaywall>
          {lockedSections[0] && (
            <h2 className="mt-8 text-xl sm:text-2xl font-serif font-semibold text-paper">
              {lockedSections[0].heading}
            </h2>
          )}
        </ArticlePaywall>
      )}
    </section>
  );
}
