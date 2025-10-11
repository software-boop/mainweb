import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, ROLE_COOKIE_NAME } from "@/lib/strapi";

export async function POST() {
  cookies().set({ name: AUTH_COOKIE_NAME, value: "", path: "/", maxAge: 0 });
  cookies().set({ name: ROLE_COOKIE_NAME, value: "", path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
