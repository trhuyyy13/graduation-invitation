import { NextResponse, type NextRequest } from "next/server";
import { verifyAndRotateSession } from "@/lib/adminSession";

const COOKIE_NAME = "hust_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  const session = cookie ? await verifyAndRotateSession(cookie) : { valid: false };

  if (!session.valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  if (session.newToken) {
    response.cookies.set(COOKIE_NAME, session.newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
