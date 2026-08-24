"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Header({ latestSlug }: { latestSlug: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const isPrecios = pathname === "/precios";

  const scrollToCobertura = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      document.getElementById("cobertura")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 flex-shrink-0 bg-amber" />
          <span className="text-xl font-bold uppercase text-paper font-display tracking-tight">
            Plactum
          </span>
          <span className="hidden sm:inline text-xs text-muted-faint font-mono">/ signal desk</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {isHome ? (
            <Link href="/#cobertura" onClick={scrollToCobertura} className="text-muted hover:opacity-80">
              Qué cubrimos
            </Link>
          ) : (
            <Link href="/" className="text-muted hover:opacity-80">
              Inicio
            </Link>
          )}
          {latestSlug && (
            <Link href={`/articulo/${latestSlug}`} className="text-muted hover:opacity-80">
              Último número
            </Link>
          )}
          <Link href="/precios" className={isPrecios ? "text-amber" : "text-muted hover:opacity-80"}>
            Precios
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/precios")}
            className="rounded-md px-4 py-2 text-sm font-medium bg-amber text-ink border-0 cursor-pointer"
          >
            Suscribirme
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 border border-border text-paper cursor-pointer"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-ink">
          <nav className="mx-auto flex max-w-6xl flex-col px-6 py-2 text-sm">
            {isHome ? (
              <Link
                href="/#cobertura"
                onClick={scrollToCobertura}
                className="py-3 border-b border-border text-left w-full text-muted"
              >
                Qué cubrimos
              </Link>
            ) : (
              <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 border-b border-border text-muted">
                Inicio
              </Link>
            )}
            {latestSlug && (
              <Link
                href={`/articulo/${latestSlug}`}
                onClick={() => setMenuOpen(false)}
                className="py-3 border-b border-border text-muted"
              >
                Último número
              </Link>
            )}
            <Link
              href="/precios"
              onClick={() => setMenuOpen(false)}
              className={`py-3 ${isPrecios ? "text-amber" : "text-muted"}`}
            >
              Precios
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
