import { createClient } from "@supabase/supabase-js";

function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "plactum" } }
  );
}

let client: ReturnType<typeof createSupabaseClient> | null = null;

export function getSupabase() {
  if (!client) {
    client = createSupabaseClient();
  }
  return client;
}
