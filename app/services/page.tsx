import Link from "next/link";
import slugify from "slugify";
import { MENU_DATA } from "@/app/data/menuData";

export default function ServicesPage() {
  const categories = MENU_DATA.services;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Our Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const catSlug = slugify(cat.title, { lower: true });

          return (
            <Link
              key={cat.title}
              href={`/services/${catSlug}`}
              className="border p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <img src={cat.titleIcon} className="w-10 h-10" />
                <h2 className="text-xl font-semibold">{cat.title}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
