import type { MetadataRoute } from "next";
import { getExpedienteCards, getFichaCards } from "@/lib/content";

// New expedientes are published between deploys (admin panel / editorial
// cron) — regenerate this on every request instead of freezing it at build.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [expedientes, fichas] = await Promise.all([getExpedienteCards(1000), getFichaCards(1000)]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: "https://www.plactum.com", changeFrequency: "daily", priority: 1 },
    { url: "https://www.plactum.com/reviews", changeFrequency: "weekly", priority: 0.7 },
    { url: "https://www.plactum.com/precios", changeFrequency: "monthly", priority: 0.6 },
    { url: "https://www.plactum.com/ingresar", changeFrequency: "yearly", priority: 0.2 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = expedientes.map((e) => ({
    url: `https://www.plactum.com/articulo/${e.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const fichaRoutes: MetadataRoute.Sitemap = fichas.map((f) => ({
    url: `https://www.plactum.com/reviews/${f.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...fichaRoutes];
}
