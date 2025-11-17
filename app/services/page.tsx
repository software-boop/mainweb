"use client";

import Link from "next/link";
import { MENU_DATA } from "@/app/data/menuData";
import { slugify } from "@/lib/slugify";

// export const runtime = "edge";

export default function ServicesPage() {
  const categories = MENU_DATA.services ?? [];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Services</h1>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const slug = slugify(cat.title);
          return (
            <li key={cat.title} className="p-5 border rounded-lg shadow-sm bg-white">
              <Link className="text-lg text-blue-700" href={`/services/${slug}`}>
                {cat.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
