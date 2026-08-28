import { getSupabase } from "@/lib/supabase";

export type CategoryTag = "constructor" | "contrarian" | "doomer" | "esceptico";

export const CATEGORY_COLOR: Record<CategoryTag, string> = {
  constructor: "#5B8DEF",
  contrarian: "#B47EE5",
  doomer: "#E15B5B",
  esceptico: "#6FBF73",
};

export const CATEGORY_LABEL: Record<CategoryTag, string> = {
  constructor: "Constructor",
  contrarian: "Contrarian",
  doomer: "Doomer",
  esceptico: "Escéptico",
};

export type Signal = {
  id: string;
  note: string;
  figuraName: string;
  figuraRole: string;
  category: CategoryTag | null;
  // When the underlying news/statement actually happened — not when we
  // hit publish. Falls back to publishedAt for older rows with no
  // event_date on record.
  eventDate: string | null;
  publishedAt: string | null;
};

export type ExpedienteCard = {
  slug: string;
  issueNumber: number;
  title: string;
  deck: string;
  category: CategoryTag;
};

export type ExpedienteFull = ExpedienteCard & {
  loEsencial: string[];
  cuerpo: { heading: string; body: string }[];
  porQueImporta: string;
  fuentes: { label: string; url: string }[];
  readingTimeMinutes: number | null;
  publishedAt: string;
  figuras: string[];
};

type SignalRow = {
  id: string;
  note: string;
  event_date: string | null;
  published_at: string | null;
  figuras: { name: string; role: string; category: CategoryTag | null } | null;
};

export async function getSignals(limit = 8): Promise<Signal[]> {
  const { data } = await getSupabase()
    .from("signales")
    .select("id, note, event_date, published_at, figuras(name, role, category)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit)
    .returns<SignalRow[]>();

  return (data ?? []).map((row) => ({
    id: row.id,
    note: row.note,
    figuraName: row.figuras?.name ?? "",
    figuraRole: row.figuras?.role ?? "",
    category: row.figuras?.category ?? null,
    eventDate: row.event_date,
    publishedAt: row.published_at,
  }));
}

export async function getExpedienteCards(limit = 10): Promise<ExpedienteCard[]> {
  const { data } = await getSupabase()
    .from("expedientes")
    .select("slug, issue_number, title, deck, category")
    .eq("status", "published")
    .order("issue_number", { ascending: false })
    .limit(limit);

  return (data ?? [])
    .filter((row): row is typeof row & { slug: string } => row.slug !== null)
    .map((row) => ({
      slug: row.slug,
      issueNumber: row.issue_number,
      title: row.title,
      deck: row.deck,
      category: row.category as CategoryTag,
    }));
}

export async function getLatestExpediente(): Promise<ExpedienteCard | null> {
  const [latest] = await getExpedienteCards(1);
  return latest ?? null;
}

type AdjacentExpediente = { slug: string; issueNumber: number; title: string };

export async function getAdjacentExpedientes(
  issueNumber: number
): Promise<{ prev: AdjacentExpediente | null; next: AdjacentExpediente | null }> {
  const [{ data: prevData }, { data: nextData }] = await Promise.all([
    getSupabase()
      .from("expedientes")
      .select("slug, issue_number, title")
      .eq("status", "published")
      .lt("issue_number", issueNumber)
      .order("issue_number", { ascending: false })
      .limit(1)
      .maybeSingle(),
    getSupabase()
      .from("expedientes")
      .select("slug, issue_number, title")
      .eq("status", "published")
      .gt("issue_number", issueNumber)
      .order("issue_number", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    prev: prevData ? { slug: prevData.slug!, issueNumber: prevData.issue_number, title: prevData.title } : null,
    next: nextData ? { slug: nextData.slug!, issueNumber: nextData.issue_number, title: nextData.title } : null,
  };
}

// "Ficha técnica" — the product-launch pillar: new models/tech, scrutinized
// the same way expedientes scrutinize people (claim vs. verifiable
// evidence), but with its own 6-part shape instead of the figure-tension
// template. Open access — no paywall — since it's meant to widen the
// audience, not gate it.
export type FichaCard = {
  slug: string;
  title: string;
  deck: string;
  modelo: string;
  laboratorio: string;
};

export type FichaFull = FichaCard & {
  queEs: string;
  promesaVsEvidencia: string;
  frenteAQueCompite: string;
  paraQuienImporta: string;
  fuentes: { label: string; url: string }[];
  readingTimeMinutes: number | null;
  publishedAt: string;
  figuras: string[];
};

export async function getFichaCards(limit = 10): Promise<FichaCard[]> {
  const { data } = await getSupabase()
    .from("fichas_tecnicas")
    .select("slug, title, deck, modelo, laboratorio")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  return (data ?? [])
    .filter((row): row is typeof row & { slug: string } => row.slug !== null)
    .map((row) => ({
      slug: row.slug,
      title: row.title,
      deck: row.deck,
      modelo: row.modelo,
      laboratorio: row.laboratorio,
    }));
}

export async function getLatestFicha(): Promise<FichaCard | null> {
  const [latest] = await getFichaCards(1);
  return latest ?? null;
}

export async function getFichaBySlug(slug: string): Promise<FichaFull | null> {
  const { data } = await getSupabase()
    .from("fichas_tecnicas")
    .select(
      "slug, title, deck, modelo, laboratorio, que_es, promesa_vs_evidencia, frente_a_que_compite, para_quien_importa, fuentes, reading_time_minutes, published_at, ficha_figuras(figuras(name))"
    )
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (!data || !data.slug) return null;

  const figuras = (data.ficha_figuras as unknown as { figuras: { name: string } | null }[])
    .map((ff) => ff.figuras?.name)
    .filter((name): name is string => Boolean(name));

  return {
    slug: data.slug,
    title: data.title,
    deck: data.deck,
    modelo: data.modelo,
    laboratorio: data.laboratorio,
    queEs: data.que_es,
    promesaVsEvidencia: data.promesa_vs_evidencia,
    frenteAQueCompite: data.frente_a_que_compite,
    paraQuienImporta: data.para_quien_importa,
    fuentes: data.fuentes as { label: string; url: string }[],
    readingTimeMinutes: data.reading_time_minutes,
    publishedAt: data.published_at,
    figuras,
  };
}

export async function getExpedienteBySlug(slug: string): Promise<ExpedienteFull | null> {
  const { data } = await getSupabase()
    .from("expedientes")
    .select(
      "slug, issue_number, title, deck, category, lo_esencial, cuerpo, por_que_importa, fuentes, reading_time_minutes, published_at, expediente_figuras(figuras(name))"
    )
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (!data || !data.slug) return null;

  const figuras = (
    data.expediente_figuras as unknown as { figuras: { name: string } | null }[]
  )
    .map((ef) => ef.figuras?.name)
    .filter((name): name is string => Boolean(name));

  return {
    slug: data.slug,
    issueNumber: data.issue_number,
    title: data.title,
    deck: data.deck,
    category: data.category as CategoryTag,
    loEsencial: data.lo_esencial as string[],
    cuerpo: data.cuerpo as { heading: string; body: string }[],
    porQueImporta: data.por_que_importa,
    fuentes: data.fuentes as { label: string; url: string }[],
    readingTimeMinutes: data.reading_time_minutes,
    publishedAt: data.published_at,
    figuras,
  };
}
