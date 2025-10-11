import { NextRequest, NextResponse } from "next/server";
const STRAPI = "http://localhost:1337";
const ADMIN =
  "f5ab13cfa14e28f1b0652ea428a2f29fb432747d6e4b7165754bee57b4bec1c7f7e0b500c753fa354e44d9b41ff9e8d3e0bda0c8ca5ec0e8913f71ca1a95ecd115f385f2bbd3b99263391a8e75bfef32fa4f81e4795c3e56d6a15bb97094720eaf12e8a0f817d3024872760f3227b263f3d5fce0269770100fa0eaad9d7403bc";

function assertEnv() {
  if (!STRAPI || !ADMIN) throw new Error("Missing STRAPI envs");
}

export async function GET() {
  try {
    assertEnv();
    const url = new URL(`${STRAPI}/api/catalog-families`);
    url.search = new URLSearchParams({
      "pagination[page]": "1",
      "pagination[pageSize]": "100",
      sort: "title:asc",
    }).toString();
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${ADMIN}` },
      cache: "no-store" as any,
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    assertEnv();
    const body = await req.json(); // { data: {title, slug} }
    const r = await fetch(`${STRAPI}/api/catalog-families`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ADMIN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store" as any,
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "failed" },
      { status: 500 }
    );
  }
}
