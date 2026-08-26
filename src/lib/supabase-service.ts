import { createClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS entirely. Only ever import this from
// trusted server-to-server code with no user session to key off of (e.g.
// the MercadoPago webhook) — never expose it to a request path a browser
// can influence beyond a verified webhook signature.
export function createSupabaseServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    db: { schema: "plactum" },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
