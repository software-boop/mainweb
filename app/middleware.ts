import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "strapi_user_jwt";
const ROLE_COOKIE_NAME = process.env.ROLE_COOKIE_NAME || "strapi_role";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const jwt = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!jwt) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // Optional: role-specific blocking
    const role = (req.cookies.get(ROLE_COOKIE_NAME)?.value || "user")
      .toLowerCase()
      .replace(/[\s_-]+/g, "");

    if (pathname.startsWith("/dashboard/superadmin") && role !== "superadmin") {
      const u = req.nextUrl.clone();
      u.pathname = `/dashboard/${role}`;
      return NextResponse.redirect(u);
    }
    if (
      pathname.startsWith("/dashboard/admin") &&
      role !== "admin" &&
      role !== "superadmin"
    ) {
      const u = req.nextUrl.clone();
      u.pathname = `/dashboard/${role}`;
      return NextResponse.redirect(u);
    }
    if (
      pathname.startsWith("/dashboard/user") &&
      !["user", "admin", "superadmin"].includes(role)
    ) {
      const u = req.nextUrl.clone();
      u.pathname = `/dashboard/${role}`;
      return NextResponse.redirect(u);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
