"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export default function ArticlePaywall({ children }: { children: React.ReactNode }) {
  const lockedRef = useRef<HTMLDivElement>(null);
  const [showFloatingPaywall, setShowFloatingPaywall] = useState(false);

  useEffect(() => {
    const el = lockedRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowFloatingPaywall(true);
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={lockedRef} className="plactum-paywall relative mt-5 overflow-hidden" style={{ maxHeight: "140px" }}>
        {children}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(to bottom, transparent, var(--color-ink))" }}
        />
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:pb-6 transition-all duration-500 ease-out"
        style={{
          transform: showFloatingPaywall ? "translateY(0)" : "translateY(120%)",
          opacity: showFloatingPaywall ? 1 : 0,
          pointerEvents: showFloatingPaywall ? "auto" : "none",
        }}
      >
        <div
          className="mx-auto max-w-xl rounded-lg p-5 sm:p-6 bg-panel border border-amber"
          style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.45)" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber/10 border border-amber/25">
                <Lock size={16} className="text-amber" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold font-serif text-paper">Sigue leyendo con acceso completo</p>
                <p className="text-xs text-muted">Desde $4.99/mes, precio fijo de fundador.</p>
              </div>
            </div>
            <Link
              href="/precios"
              className="flex-shrink-0 inline-flex w-full items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium bg-amber text-ink sm:w-auto"
            >
              Desbloquear <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
