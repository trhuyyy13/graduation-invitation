import { createAdminClient } from "@supabase/server/core";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Bypasses RLS with the secret key — safe here since every caller is a
 * server-only route already gated by the app's own admin cookie
 * (src/middleware.ts) or, for the public message form, its own validation.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createAdminClient();
  }
  return client;
}
