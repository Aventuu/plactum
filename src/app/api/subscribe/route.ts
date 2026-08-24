import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";
import { founderWelcomeEmail } from "@/lib/emails";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const { error: insertError } = await getSupabase()
    .from("subscribers")
    .insert({ email, plan: "founder" });

  // Unique-email violation just means they already joined — not a failure.
  if (insertError && insertError.code !== "23505") {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  if (!insertError) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error: emailError } = await resend.emails.send({
        from: "Plactum <hola@plactum.com>",
        to: email,
        subject: "Ya estás en la lista fundadora de Plactum",
        html: founderWelcomeEmail(),
      });
      if (emailError) {
        console.error("Resend send failed:", emailError);
      }
    } catch (err) {
      // The subscriber row is already saved — a broken email send
      // shouldn't turn into a failed subscription for the caller.
      console.error("Resend send threw:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
