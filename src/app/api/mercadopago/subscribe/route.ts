import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createPreapproval } from "@/lib/mercadopago";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const origin = new URL(request.url).origin;

  try {
    const preapproval = await createPreapproval({
      payerEmail: user.email,
      externalReference: user.id,
      backUrl: `${origin}/precios?mp=return`,
    });

    if (!preapproval.init_point) {
      throw new Error("MercadoPago response had no init_point");
    }

    return NextResponse.json({ init_point: preapproval.init_point });
  } catch (err) {
    console.error("MercadoPago createPreapproval failed:", err);
    return NextResponse.json({ error: "mercadopago_failed" }, { status: 502 });
  }
}
