/**
 * One-way session token derived from the admin password, so the raw
 * password never sits in the browser's cookie jar (devtools, screen
 * shares, browser sync all show cookie values in plain text).
 */
const SESSION_SALT = "hust-admin-session-v1";

export async function adminSessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${SESSION_SALT}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
