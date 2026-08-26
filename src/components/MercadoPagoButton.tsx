"use client";

import { useState } from "react";

export default function MercadoPagoButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/mercadopago/subscribe", { method: "POST" });
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.init_point) {
      setLoading(false);
      setError("Algo salió mal. Intenta de nuevo en un momento.");
      return;
    }

    window.location.href = data.init_point;
  };

  return (
    <div className="mt-6">
      {error && <p className="mb-2 text-xs text-cat-red">{error}</p>}
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-md py-2.5 text-sm font-medium bg-amber text-ink border-0 cursor-pointer disabled:opacity-60"
      >
        {loading ? "Redirigiendo a MercadoPago..." : "Asegurar mi cupo fundador"}
      </button>
    </div>
  );
}
