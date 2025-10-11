import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  strapiLocalLogin,
  strapiMe,
  AUTH_COOKIE_NAME,
  ROLE_COOKIE_NAME,
} from "@/lib/strapi";

const roleMap: Record<string, "superadmin" | "admin" | "user"> = {
  superadmin: "superadmin",
  admin: "admin",
  // Map Strapi default "authenticated" to our app "user"
  authenticated: "user",
  user: "user",
};

function normalize(name?: string) {
  return (name || "user").toLowerCase().replace(/[\s_-]+/g, "");
}

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    // 1) Login on Strapi Users&Permissions
    const { jwt } = await strapiLocalLogin(identifier, password);

    // 2) Try to load the role; default to "user"
    let role: "superadmin" | "admin" | "user" = "user";
    try {
      const me = await strapiMe(jwt); // must allow Users->me in Strapi
      const n = normalize(me?.role?.name);
      role = roleMap[n] ?? "user";
    } catch {
      /* ignore; stay "user" */
    }

    // 3) Set cookies
    cookies().set({
      name: AUTH_COOKIE_NAME,
      value: jwt,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
    cookies().set({
      name: ROLE_COOKIE_NAME,
      value: role,
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    // 4) IMPORTANT: return the shape your UI expects
    return NextResponse.json({ ok: true, role }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Login failed" },
      { status: 401 }
    );
  }
}
