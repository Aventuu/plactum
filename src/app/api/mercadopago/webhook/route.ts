import { NextResponse } from "next/server";
import { FOUNDER_PRICE_COP, getPreapproval, verifyMercadoPagoSignature } from "@/lib/mercadopago";
import { createSupabaseServiceClient } from "@/lib/supabase-service";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");

  const verified = verifyMercadoPagoSignature({
    xSignature: request.headers.get("x-signature"),
    xRequestId: request.headers.get("x-request-id"),
    dataId,
  });

  if (!verified) {
    console.error("MercadoPago webhook: invalid signature");
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  // MercadoPago has shipped two notification shapes for this same event —
  // newer `type`/`data.id` and the older IPN-style `topic`/`id` — accept
  // either instead of betting on one.
  const type = url.searchParams.get("type") ?? url.searchParams.get("topic") ?? body?.type;
  const preapprovalId = dataId ?? body?.data?.id;

  // We only act on subscription/preapproval events — ignore everything else
  // MercadoPago might send to this same URL (e.g. plain payment events).
  if (type !== "subscription_preapproval" && type !== "preapproval") {
    return NextResponse.json({ ok: true });
  }
  if (!preapprovalId) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  let preapproval;
  try {
    preapproval = await getPreapproval(preapprovalId);
  } catch (err) {
    console.error("MercadoPago webhook: getPreapproval failed", err);
    return NextResponse.json({ error: "mercadopago_fetch_failed" }, { status: 502 });
  }

  const userId = preapproval.external_reference;
  if (!userId) {
    console.error("MercadoPago webhook: preapproval has no external_reference", preapproval.id);
    return NextResponse.json({ error: "missing_external_reference" }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();

  if (preapproval.status === "authorized") {
    const { error } = await supabase.rpc("activate_founder_subscriber", {
      p_user_id: userId,
      p_mp_subscription_id: preapproval.id,
      p_mp_payer_id: String(preapproval.payer_id),
      p_price_cop: FOUNDER_PRICE_COP,
    });
    if (error) console.error("MercadoPago webhook: activate_founder_subscriber failed", error);
  } else if (preapproval.status === "cancelled") {
    const { error } = await supabase.from("subscribers").update({ status: "canceled" }).eq("user_id", userId);
    if (error) console.error("MercadoPago webhook: cancel update failed", error);
  } else if (preapproval.status === "paused") {
    const { error } = await supabase.from("subscribers").update({ status: "past_due" }).eq("user_id", userId);
    if (error) console.error("MercadoPago webhook: pause update failed", error);
  }

  return NextResponse.json({ ok: true });
}
