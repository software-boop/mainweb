import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/strapi";
import { strapiMe } from "@/lib/strapi";

export async function GET() {
  try {
    const jwt = cookies().get(AUTH_COOKIE_NAME)?.value;
    if (!jwt)
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const me = await strapiMe(jwt); // includes roleName
    return NextResponse.json({ me }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to fetch" },
      { status: 500 }
    );
  }
}
