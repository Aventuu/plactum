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
  figuras: { name: string; role: string; category: CategoryTag | null } | null;
};

export async function getSignals(limit = 8): Promise<Signal[]> {
  const { data } = await getSupabase()
    .from("signales")
    .select("id, note, figuras(name, role, category)")
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
