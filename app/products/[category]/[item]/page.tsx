import { MENU_DATA } from "@/app/data/menuData";
import { toSlug } from "@/lib/slugify";

export default function ProductPage({
  params,
}: {
  params: { category: string; item: string };
}) {
  const categories = MENU_DATA.products;

  const category = categories.find(
    (cat) => toSlug(cat.title) === params.category
  );

  if (!category) return <div>Category not found</div>;

  const product = category.items.find(
    (p) => toSlug(p.label) === params.item
  );

  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{product.label}</h1>

      <img src={product.image} className="w-80 rounded mb-4" />

      <p className="text-lg mb-4">{product.description}</p>

      <h2 className="text-2xl font-semibold mb-2">Features</h2>
      <ul className="list-disc pl-6">
        {product.features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </div>
  );
}
