"use client";

import Link from "next/link";
import { MENU_DATA } from "@/app/data/menuData";
import { slugify } from "@/lib/slugify";

// export const runtime = "edge";

export default function ServicesCategoryPage({ params }: any) {
  const { category } = params;
  const cat = MENU_DATA.services.find((c) => slugify(c.title) === category);

  if (!cat) return <div className="p-10 text-red-600">Category not found</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">{cat.title}</h1>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cat.items.map((item) => {
          const itemSlug = slugify(item.label);
          return (
            <li key={item.label} className="p-5 border rounded-lg shadow-sm bg-white">
              <Link
                className="text-lg text-blue-700"
                href={`/services/${category}/${itemSlug}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
