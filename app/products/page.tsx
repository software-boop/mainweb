import Link from "next/link";
import { MENU_DATA } from "@/app/data/menuData";
import { toSlug } from "@/lib/slugify";

export default function ProductsPage() {
  const categories = MENU_DATA.products;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const categorySlug = toSlug(cat.title);

          return (
            <Link
              key={cat.title}
              href={`/products/${categorySlug}`}
              className="p-6 border rounded-lg hover:bg-gray-100"
            >
              <h2 className="text-xl font-semibold">{cat.title}</h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
