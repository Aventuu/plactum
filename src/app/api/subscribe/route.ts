import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { founderWelcomeEmail } from "@/lib/emails";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const { error: insertError } = await supabase
    .from("subscribers")
    .insert({ email, plan: "founder" });

  // Unique-email violation just means they already joined — not a failure.
  if (insertError && insertError.code !== "23505") {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  if (!insertError) {
    await resend.emails.send({
      from: "Plactum <hola@plactum.com>",
      to: email,
      subject: "Ya estás en la lista fundadora de Plactum",
      html: founderWelcomeEmail(),
    });
  }

  return NextResponse.json({ ok: true });
}
