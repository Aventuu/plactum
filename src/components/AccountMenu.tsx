"use client";

import { useEffect, useRef, useState } from "react";
import { Check, User } from "lucide-react";

const PLAN_LABEL: Record<"founder" | "regular", string> = {
  founder: "Fundador",
  regular: "Regular",
};

export default function AccountMenu({
  email,
  isActive,
  plan,
  onSignOut,
}: {
  email: string;
  isActive: boolean;
  plan: "founder" | "regular" | null;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Mi cuenta"
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-panel border border-border text-paper cursor-pointer"
      >
        <User size={16} />
        {isActive && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber border-2 border-ink" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-border bg-panel p-4 shadow-lg z-50">
          <p className="text-xs text-muted-faint font-mono truncate">{email}</p>

          {isActive ? (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-amber/10 text-amber border border-amber/25">
              <Check size={12} /> {plan ? PLAN_LABEL[plan] : "Suscriptor"} · Acceso completo
            </span>
          ) : (
            <p className="mt-2 text-xs text-muted">Sin suscripción activa</p>
          )}

          <button
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="mt-3 w-full rounded-md py-2 text-sm text-muted hover:text-paper border border-border bg-transparent cursor-pointer"
          >
            Salir
          </button>
        </div>
      )}
    </div>
  );
}
