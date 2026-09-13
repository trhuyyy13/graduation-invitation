import { NextResponse, type NextRequest } from "next/server";
import { adminSessionToken } from "@/lib/adminSession";

const COOKIE_NAME = "hust_admin";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_PASSWORD;
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  const authorized = !!password && !!cookie && cookie === (await adminSessionToken(password));

  if (authorized) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
