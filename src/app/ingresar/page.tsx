"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function Ingresar() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSendCode = async () => {
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

    setStep("code");
  };

  const handleVerifyCode = async () => {
    if (code.length < 4) return;
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    setLoading(false);

    if (verifyError) {
      setError("Código incorrecto o vencido. Revisa el correo más reciente.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <section className="mx-auto max-w-md px-6 py-16 sm:py-24">
      <span className="text-xs tracking-wider text-muted-faint font-mono">MI CUENTA</span>
      <h1 className="mt-3 text-3xl sm:text-4xl leading-[1.1] font-serif font-semibold">Ingresar</h1>
      <p className="mt-4 text-base text-muted">
        Sin contraseñas. Te mandamos un código por email.
      </p>

      {searchParams.get("error") && (
        <p className="mt-4 text-sm text-cat-red">El enlace no funcionó o ya expiró. Pide un código nuevo abajo.</p>
      )}

      {step === "email" ? (
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
            onClick={handleSendCode}
            disabled={loading}
            className="mt-3 w-full rounded-md py-2.5 text-sm font-medium bg-amber text-ink border-0 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviarme el código"}
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <p className="mb-3 text-xs text-muted-faint">
            Mandamos un código a <span className="text-paper">{email}</span>.
          </p>
          <div className="flex items-center gap-2 rounded-md px-3 py-2.5 bg-panel border border-border">
            <KeyRound size={16} className="text-muted-faint" />
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Código del correo"
              className="w-full bg-transparent text-sm tracking-[0.15em] outline-none text-paper"
            />
          </div>
          {error && <p className="mt-2 text-xs text-cat-red">{error}</p>}
          <button
            onClick={handleVerifyCode}
            disabled={loading || code.length < 4}
            className="mt-3 w-full rounded-md py-2.5 text-sm font-medium bg-amber text-ink border-0 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
          <button
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
            className="mt-3 w-full text-xs text-muted-faint bg-transparent border-0 cursor-pointer"
          >
            Usar otro email
          </button>
        </div>
      )}
    </section>
  );
}
