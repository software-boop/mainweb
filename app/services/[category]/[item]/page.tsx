import slugify from "slugify";
import { MENU_DATA } from "@/app/data/menuData";

export default function ServiceItemPage({ params }: any) {
  const { category, item } = params;

  const categories = MENU_DATA.services;

  const categoryData = categories.find(
    (cat) => slugify(cat.title, { lower: true }) === category
  );

  if (!categoryData) {
    return <div className="p-6 text-red-500 text-xl">Category Not Found</div>;
  }

  const itemData = categoryData.items.find(
    (i) => slugify(i.label, { lower: true }) === item
  );

  if (!itemData) {
    return <div className="p-6 text-red-500 text-xl">Service Not Found</div>;
  }

  return (
    <div className="p-6">
      <img src={itemData.image} className="w-full h-60 object-cover rounded-xl mb-6" />

      <h1 className="text-3xl font-bold mb-4">{itemData.label}</h1>
      <p className="text-gray-700 mb-6">{itemData.description}</p>

      <h2 className="text-xl font-semibold mb-3">Features</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {itemData.features.map((f, idx) => (
          <li key={idx} className="flex gap-3 items-start">
            <img src={itemData.featureIcons[idx]} className="w-8 h-8" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
