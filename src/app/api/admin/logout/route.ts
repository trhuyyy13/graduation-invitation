import { NextResponse } from "next/server";
import { deleteAdminSession } from "@/lib/adminSession";

const COOKIE_NAME = "hust_admin";

export async function POST(request: Request) {
  const cookie = request.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);

  if (cookie) {
    await deleteAdminSession(cookie);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
