"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubscribe = () => {
    if (!email.includes("@")) return;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mt-6 rounded-md px-3 py-3 text-sm bg-cat-green/10 text-cat-green border border-cat-green/25">
        Listo. Revisa tu correo para confirmar.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 rounded-md px-3 py-2.5 bg-ink border border-border">
        <Mail size={16} className="text-muted-faint" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="w-full bg-transparent text-sm outline-none text-paper"
        />
      </div>
      <button
        onClick={handleSubscribe}
        className="mt-3 w-full rounded-md py-2.5 text-sm font-medium bg-amber text-ink border-0 cursor-pointer"
      >
        Asegurar mi cupo fundador
      </button>
    </div>
  );
}
