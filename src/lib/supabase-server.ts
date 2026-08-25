import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Per-request client that reads/writes the visitor's auth session via
// cookies — use this (not lib/supabase.ts) anywhere the current signed-in
// user matters.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "plactum" },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render — middleware already
            // refreshes the session cookie, so this is safe to ignore.
          }
        },
      },
    }
  );
}

// Returns the signed-in user only if they're in plactum.admins — use this
// to gate the /admin panel and its server actions. RLS enforces the same
// rule independently on every write, so this is a UX check, not the only
// line of defense.
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return data ? user : null;
}
