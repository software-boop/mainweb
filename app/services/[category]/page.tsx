import Link from "next/link";
import slugify from "slugify";
import { MENU_DATA } from "@/app/data/menuData";

export default function ServiceCategoryPage({ params }: any) {
  const { category } = params;
  const categories = MENU_DATA.services;

  const categoryData = categories.find(
    (cat) => slugify(cat.title, { lower: true }) === category
  );

  if (!categoryData) {
    return <div className="p-6 text-red-500 text-xl">Category Not Found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{categoryData.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryData.items.map((item) => {
          const itemSlug = slugify(item.label, { lower: true });

          return (
            <Link
              key={item.label}
              href={`/services/${category}/${itemSlug}`}
              className="border p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <img src={item.image} className="w-full h-40 object-cover rounded" />
              <h3 className="text-xl font-semibold mt-3">{item.label}</h3>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
