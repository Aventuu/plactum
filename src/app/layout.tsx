import type { Metadata } from "next";
import { Space_Grotesk, Source_Serif_4, IBM_Plex_Mono, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLatestExpediente } from "@/lib/content";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Editorial content lives in Supabase and gets published between deploys —
// every page must read it fresh, not from a build-time snapshot.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.plactum.com"),
  title: {
    default: "Plactum — El ojo que no se cierra",
    template: "%s — Plactum",
  },
  description: "Vemos la señal antes de que sea ruido. Newsletter semanal sobre quién construye la IA, quién le teme y quién no le cree.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createSupabaseServerClient();
  const [latest, { data: userData }] = await Promise.all([
    getLatestExpediente(),
    supabase.auth.getUser(),
  ]);
  const user = userData.user;

  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${sourceSerif.variable} ${plexMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper font-sans">
        <Header latestSlug={latest?.slug ?? null} userEmail={user?.email ?? null} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
