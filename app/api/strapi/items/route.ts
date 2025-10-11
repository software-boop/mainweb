import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const STRAPI = "http://localhost:1337";
const ADMIN =
  "f5ab13cfa14e28f1b0652ea428a2f29fb432747d6e4b7165754bee57b4bec1c7f7e0b500c753fa354e44d9b41ff9e8d3e0bda0c8ca5ec0e8913f71ca1a95ecd115f385f2bbd3b99263391a8e75bfef32fa4f81e4795c3e56d6a15bb97094720eaf12e8a0f817d3024872760f3227b263f3d5fce0269770100fa0eaad9d7403bc";
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const familySlug = searchParams.get("familySlug") || "";
    const typeSlug = searchParams.get("typeSlug") || "";
    const url = new URL(`${STRAPI}/api/catalog-items`);

    const params: Record<string, string> = {
      "pagination[page]": "1",
      "pagination[pageSize]": "100",
      sort: "label:asc",
      "fields[0]": "label",
      "fields[1]": "slug",
      "fields[2]": "priority",
    };
    if (familySlug) params["filters[family][slug][$eq]"] = familySlug;
    if (typeSlug) params["filters[type][slug][$eq]"] = typeSlug;

    url.search = new URLSearchParams(params).toString();

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
    const incoming = await req.formData();
    const raw = incoming.get("data");
    if (typeof raw !== "string") {
      return NextResponse.json(
        { error: "`data` must be JSON string" },
        { status: 400 }
      );
    }

    const fd = new FormData();
    fd.append("data", raw);

    const hero = incoming.get("heroImage");
    if (hero instanceof Blob) {
      // @ts-ignore
      fd.append("files.heroImage", hero, (hero as any).name || "hero.png");
    }

    let featureCount = 0;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.features)) featureCount = parsed.features.length;
    } catch (_e) {}

    for (let i = 0; i < featureCount; i++) {
      const f = incoming.get(`featureIcon_${i}`);
      if (f instanceof Blob) {
        // @ts-ignore
        fd.append(
          `files.features.${i}.icon`,
          f,
          (f as any).name || `icon_${i}.png`
        );
      }
    }

    const r = await fetch(`${STRAPI}/api/catalog-items`, {
      method: "POST",
      headers: { Authorization: `Bearer ${ADMIN}` },
      body: fd,
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
