"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function Ingresar() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleSignIn = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setLoading(false);

    if (authError) {
      setError("Algo salió mal. Intenta de nuevo en un momento.");
      return;
    }

    setSent(true);
  };

  return (
    <section className="mx-auto max-w-md px-6 py-16 sm:py-24">
      <span className="text-xs tracking-wider text-muted-faint font-mono">MI CUENTA</span>
      <h1 className="mt-3 text-3xl sm:text-4xl leading-[1.1] font-serif font-semibold">Ingresar</h1>
      <p className="mt-4 text-base text-muted">
        Sin contraseñas. Escribe tu email y te mandamos un enlace para entrar.
      </p>

      {searchParams.get("error") && (
        <p className="mt-4 text-sm text-cat-red">
          El enlace no funcionó o ya expiró. Pide uno nuevo abajo.
        </p>
      )}

      {sent ? (
        <div className="mt-6 rounded-md px-3 py-3 text-sm bg-cat-green/10 text-cat-green border border-cat-green/25">
          Listo. Revisa tu correo y haz clic en el enlace para entrar.
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-center gap-2 rounded-md px-3 py-2.5 bg-panel border border-border">
            <Mail size={16} className="text-muted-faint" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-transparent text-sm outline-none text-paper"
            />
          </div>
          {error && <p className="mt-2 text-xs text-cat-red">{error}</p>}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="mt-3 w-full rounded-md py-2.5 text-sm font-medium bg-amber text-ink border-0 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviarme el enlace"}
          </button>
        </div>
      )}
    </section>
  );
}
