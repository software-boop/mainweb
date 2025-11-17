"use client";

import { MENU_DATA } from "@/app/data/menuData";
import { slugify } from "@/lib/slugify";

export const runtime = "edge";

export default function SingleProductPage({ params }: any) {
  const { category, item } = params;

  const cat = MENU_DATA.products.find((c) => slugify(c.title) === category);
  if (!cat) return <div className="p-10 text-red-600">Category not found</div>;

  const product = cat.items.find((i) => slugify(i.label) === item);
  if (!product) return <div className="p-10 text-red-600">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{product.label}</h1>

      <p className="text-gray-700 mb-4">
        {product.description ?? "No description available."}
      </p>

      {product.features && (
        <ul className="list-disc ml-6 space-y-1">
          {product.features.map((f: string) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
