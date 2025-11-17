"use client";

import { MENU_DATA } from "@/app/data/menuData";
import { slugify } from "@/lib/slugify";

export const runtime = "edge";

export default function SingleServicePage({ params }: any) {
  const { category, item } = params;

  const cat = MENU_DATA.services.find((c) => slugify(c.title) === category);
  if (!cat) return <div className="p-10 text-red-600">Category not found</div>;

  const service = cat.items.find((i) => slugify(i.label) === item);
  if (!service) return <div className="p-10 text-red-600">Service not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{service.label}</h1>

      <p className="text-gray-700 mb-4">
        {service.description ?? "No description available."}
      </p>

      {service.features && (
        <ul className="list-disc ml-6 space-y-1">
          {service.features.map((f: string) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
