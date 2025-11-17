import Link from "next/link";
import { MENU_DATA } from "@/app/data/menuData";
import { toSlug } from "@/lib/slugify";

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categories = MENU_DATA.products;

  const category = categories.find(
    (cat) => toSlug(cat.title) === params.category
  );

  if (!category) {
    return <div className="p-10 text-red-600">Category not found</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{category.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {category.items.map((item) => {
          const itemSlug = toSlug(item.label);

          return (
            <Link
              key={item.label}
              href={`/products/${params.category}/${itemSlug}`}
              className="p-6 border rounded-lg hover:bg-gray-100"
            >
              <h2 className="text-xl font-semibold">{item.label}</h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
