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

const siteName = "Plactum";
const siteDescription =
  "Vemos la señal antes de que sea ruido. Newsletter semanal sobre quién construye la IA, quién le teme y quién no le cree.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.plactum.com"),
  title: {
    default: "Plactum — El ojo que no se cierra",
    template: "%s — Plactum",
  },
  description: siteDescription,
  keywords: ["inteligencia artificial", "IA", "newsletter", "Sam Altman", "AI safety", "Plactum"],
  alternates: { canonical: "https://www.plactum.com" },
  openGraph: {
    type: "website",
    url: "https://www.plactum.com",
    siteName,
    title: "Plactum — El ojo que no se cierra",
    description: siteDescription,
    locale: "es_CO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plactum — El ojo que no se cierra",
    description: siteDescription,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.plactum.com/#organization",
      name: siteName,
      url: "https://www.plactum.com",
      logo: "https://www.plactum.com/favicon.ico",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.plactum.com/#website",
      name: siteName,
      url: "https://www.plactum.com",
      description: siteDescription,
      publisher: { "@id": "https://www.plactum.com/#organization" },
      inLanguage: "es",
    },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createSupabaseServerClient();
  const [latest, { data: userData }] = await Promise.all([
    getLatestExpediente(),
    supabase.auth.getUser(),
  ]);
  const user = userData.user;

  let isActive = false;
  let plan: "founder" | "regular" | null = null;
  if (user) {
    const { data: subscriber } = await supabase
      .from("subscribers")
      .select("status, plan")
      .eq("user_id", user.id)
      .maybeSingle();
    isActive = subscriber?.status === "active";
    plan = subscriber?.plan ?? null;
  }

  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${sourceSerif.variable} ${plexMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-paper font-sans">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        <Header latestSlug={latest?.slug ?? null} userEmail={user?.email ?? null} isActive={isActive} plan={plan} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
