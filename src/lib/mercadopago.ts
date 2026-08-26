import crypto from "crypto";

// Real money, real subscribers — kept in COP because MercadoPago Colombia's
// subscriptions API settles in the account's local currency, not USD.
export const FOUNDER_PRICE_COP = 9900;

const MP_API = "https://api.mercadopago.com";

function accessToken() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("MERCADOPAGO_ACCESS_TOKEN is not set");
  return token;
}

export type Preapproval = {
  id: string;
  status: "pending" | "authorized" | "paused" | "cancelled";
  external_reference: string | null;
  payer_id: number;
  init_point?: string;
};

export async function createPreapproval(params: {
  payerEmail: string;
  externalReference: string;
  backUrl: string;
}): Promise<Preapproval> {
  const res = await fetch(`${MP_API}/preapproval`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason: "Plactum — Cupo Fundador",
      external_reference: params.externalReference,
      payer_email: params.payerEmail,
      back_url: params.backUrl,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: FOUNDER_PRICE_COP,
        currency_id: "COP",
      },
      status: "pending",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`MercadoPago createPreapproval failed: ${res.status} ${body}`);
  }

  return res.json();
}

export async function getPreapproval(id: string): Promise<Preapproval> {
  const res = await fetch(`${MP_API}/preapproval/${id}`, {
    headers: { Authorization: `Bearer ${accessToken()}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`MercadoPago getPreapproval failed: ${res.status} ${body}`);
  }

  return res.json();
}

// MercadoPago signs webhook calls as `x-signature: ts=...,v1=...`. The
// manifest to HMAC is fixed by their spec — see "Ensure the validity of
// notifications sent by Mercado Pago" in their docs.
export function verifyMercadoPagoSignature(params: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
}): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret || !params.xSignature || !params.xRequestId || !params.dataId) return false;

  const parsed = Object.fromEntries(
    params.xSignature.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key?.trim(), value?.trim()];
    })
  );
  const ts = parsed["ts"];
  const v1 = parsed["v1"];
  if (!ts || !v1) return false;

  const manifest = `id:${params.dataId.toLowerCase()};request-id:${params.xRequestId};ts:${ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(v1, "hex");
  if (expectedBuf.length !== actualBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}
