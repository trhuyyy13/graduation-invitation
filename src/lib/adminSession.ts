import { getSupabase } from "@/lib/supabase";

/**
 * Admin auth is a real server-side session, not a value derived from the
 * password: the cookie holds a random opaque token that only means
 * anything cross-referenced against `admin_sessions`, so it can be
 * revoked on logout and rotated periodically without touching the
 * password itself.
 */
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // idle sessions expire after 30 days
const ROTATE_AFTER_MS = 1000 * 60 * 60 * 24; // token value itself is replaced once a day

function randomToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminSession(): Promise<string> {
  const token = randomToken();
  const now = Date.now();
  const { error } = await getSupabase()
    .from("admin_sessions")
    .insert({
      token,
      created_at: new Date(now).toISOString(),
      expires_at: new Date(now + SESSION_TTL_MS).toISOString(),
    });
  if (error) throw error;
  return token;
}

export type SessionCheck = { valid: boolean; newToken?: string };

/** Validates the session, extends its idle expiry, and — once a day —
 * swaps in a fresh token so a long-lived stolen cookie stops working. */
export async function verifyAndRotateSession(token: string): Promise<SessionCheck> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("admin_sessions")
    .select("token, created_at, expires_at")
    .eq("token", token)
    .maybeSingle();
  if (error) throw error;
  if (!data) return { valid: false };

  const now = Date.now();
  if (new Date(data.expires_at as string).getTime() < now) {
    await supabase.from("admin_sessions").delete().eq("token", token);
    return { valid: false };
  }

  const createdAt = new Date(data.created_at as string).getTime();
  if (now - createdAt > ROTATE_AFTER_MS) {
    const newToken = randomToken();
    await supabase
      .from("admin_sessions")
      .update({
        token: newToken,
        created_at: new Date(now).toISOString(),
        expires_at: new Date(now + SESSION_TTL_MS).toISOString(),
      })
      .eq("token", token);
    return { valid: true, newToken };
  }

  await supabase
    .from("admin_sessions")
    .update({ expires_at: new Date(now + SESSION_TTL_MS).toISOString() })
    .eq("token", token);
  return { valid: true };
}

export async function deleteAdminSession(token: string): Promise<void> {
  const { error } = await getSupabase().from("admin_sessions").delete().eq("token", token);
  if (error) throw error;
}
