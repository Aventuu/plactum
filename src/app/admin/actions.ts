"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, requireAdmin } from "@/lib/supabase-server";

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function estimateReadingMinutes(expediente: {
  lo_esencial: string[];
  cuerpo: { heading: string; body: string }[];
  por_que_importa: string;
}) {
  const text = [
    ...expediente.lo_esencial,
    ...expediente.cuerpo.flatMap((s) => [s.heading, s.body]),
    expediente.por_que_importa,
  ].join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function publishSignal(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("No autorizado");
  const id = formData.get("id") as string;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("signales")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function discardSignal(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("No autorizado");
  const id = formData.get("id") as string;

  const supabase = await createSupabaseServerClient();
  await supabase.from("signales").delete().eq("id", id);

  revalidatePath("/admin");
}

export async function publishExpediente(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("No autorizado");
  const id = formData.get("id") as string;

  const supabase = await createSupabaseServerClient();
  const { data: expediente } = await supabase
    .from("expedientes")
    .select("title, lo_esencial, cuerpo, por_que_importa")
    .eq("id", id)
    .single();

  if (!expediente) throw new Error("Expediente no encontrado");

  const slug = slugify(expediente.title);
  const readingTimeMinutes = estimateReadingMinutes(
    expediente as {
      lo_esencial: string[];
      cuerpo: { heading: string; body: string }[];
      por_que_importa: string;
    }
  );

  await supabase
    .from("expedientes")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      slug,
      reading_time_minutes: readingTimeMinutes,
    })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/articulo/${slug}`);
}

export async function discardExpediente(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("No autorizado");
  const id = formData.get("id") as string;

  const supabase = await createSupabaseServerClient();
  await supabase.from("expedientes").delete().eq("id", id);

  revalidatePath("/admin");
}

function estimateFichaReadingMinutes(ficha: {
  que_es: string;
  promesa_vs_evidencia: string;
  frente_a_que_compite: string;
  para_quien_importa: string;
}) {
  const text = [ficha.que_es, ficha.promesa_vs_evidencia, ficha.frente_a_que_compite, ficha.para_quien_importa].join(
    " "
  );
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function publishFicha(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("No autorizado");
  const id = formData.get("id") as string;

  const supabase = await createSupabaseServerClient();
  const { data: ficha } = await supabase
    .from("fichas_tecnicas")
    .select("title, que_es, promesa_vs_evidencia, frente_a_que_compite, para_quien_importa")
    .eq("id", id)
    .single();

  if (!ficha) throw new Error("Ficha técnica no encontrada");

  const slug = slugify(ficha.title);
  const readingTimeMinutes = estimateFichaReadingMinutes(ficha);

  await supabase
    .from("fichas_tecnicas")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      slug,
      reading_time_minutes: readingTimeMinutes,
    })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/reviews");
  revalidatePath(`/reviews/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function discardFicha(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("No autorizado");
  const id = formData.get("id") as string;

  const supabase = await createSupabaseServerClient();
  await supabase.from("fichas_tecnicas").delete().eq("id", id);

  revalidatePath("/admin");
}

export async function approveFigura(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("No autorizado");
  const id = formData.get("id") as string;

  const supabase = await createSupabaseServerClient();
  await supabase.from("figuras").update({ status: "active" }).eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function rejectFigura(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("No autorizado");
  const id = formData.get("id") as string;

  const supabase = await createSupabaseServerClient();
  await supabase.from("figuras").delete().eq("id", id);

  revalidatePath("/admin");
}
