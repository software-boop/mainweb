"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, ArrowLeft } from "lucide-react";

import type { MenuCategory, MenuItem } from "@/app/data/menuData";
import { MENU_DATA } from "@/app/data/menuData";

/* Helpers */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
const BRAND = "#07518a";

/* Motion variants */
const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
};
const gridItem = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } },
};

export default function ServicesSlugPage() {
  const { slug: rawSlug } = useParams() as { slug: string };
  const router = useRouter();
  const slug = decodeURIComponent(rawSlug).toLowerCase();

  const categories: (MenuCategory & { titleIcon?: string })[] =
    (MENU_DATA as any).services ?? [];

  // category?
  const matchedCategory = useMemo(
    () => categories.find((c) => slugify(c.title) === slug) || null,
    [categories, slug]
  );

  // item? (keep parent cat)
  const matchedItem = useMemo(() => {
    for (const c of categories) {
      const it = c.items.find((i) => slugify(i.label) === slug);
      if (it)
        return { item: it, cat: c } as { item: MenuItem; cat: MenuCategory };
    }
    return null;
  }, [categories, slug]);

  // If ITEM, redirect to pretty URL: /services/<subcategory>/<item>?name=<pretty>
  useEffect(() => {
    if (matchedItem) {
      const subcategory = slugify(matchedItem.cat.title);
      const itemSlug = slugify(matchedItem.item.label);
      const name = encodeURIComponent(matchedItem.item.label);
      router.replace(`/services/${subcategory}/${itemSlug}?name=${name}`);
    }
  }, [matchedItem, router]);

  const pageTitle = matchedCategory
    ? matchedCategory.title
    : matchedItem
    ? `Routing…`
    : `Services`;

  return (
    <div
      className="min-h-[100dvh] w-full"
      style={{ ["--brand" as any]: BRAND } as React.CSSProperties}
    >
      {/* Hero */}
      <div className="relative overflow-hidden pb-4">
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 pt-8">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{
                background: `linear-gradient(90deg, ${BRAND}, ${BRAND}CC)`,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Services
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
              {pageTitle}
            </h1>
          </div>

          {/* Icon-only back (no text link) */}
          <button
            type="button"
            onClick={() => router.push("/services")}
            className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            aria-label="Back to Services"
            title="Back to Services"
          >
            <ArrowLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-0.5" />
          </button>
        </header>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-14">
        {/* Category view */}
        {matchedCategory && <CategoryGrid category={matchedCategory} />}

        {/* Item view → redirect happens in useEffect */}
        {!matchedCategory && matchedItem && (
          <div className="text-sm text-slate-600">Taking you to the item…</div>
        )}

        {/* Not found */}
        {!matchedCategory && !matchedItem && <NotFound slug={slug} />}
      </main>
    </div>
  );
}

/* Components */
function CategoryGrid({
  category,
}: {
  category: MenuCategory & { titleIcon?: string };
}) {
  const router = useRouter();

  const getItemImage = (it: any) =>
    it.image || it.thumbnail || it.icon || "/images/placeholders/service.jpg";

  return (
    <section>
      {/* Title row (no counts) */}
      <div className="mb-3 flex items-center gap-2">
        {category.titleIcon ? (
          <span
            className="grid h-8 w-8 place-items-center overflow-hidden rounded-md bg-[var(--brand)]/10"
            style={{ ["--brand" as any]: BRAND }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={category.titleIcon}
              alt={`${category.title} icon`}
              className="h-6 w-6 object-contain"
            />
          </span>
        ) : null}
        <h2 className="text-base font-semibold text-slate-900">
          {category.title}
        </h2>
      </div>

      <motion.div
        variants={gridContainer}
        initial="hidden"
        animate="show"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {category.items.map((it) => {
          const sub = slugify(category.title);
          const item = slugify(it.label);
          const name = encodeURIComponent(it.label);
          const href = `/services/${sub}/${item}?name=${name}`;
          const imgSrc = getItemImage(it);

          return (
            <motion.div
              key={it.label}
              variants={gridItem}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 18,
                mass: 0.6,
              }}
              className="group relative flex cursor-pointer flex-col rounded-xl bg-white shadow-sm transition will-change-transform hover:shadow-md focus-within:shadow-md"
              role="button"
              onClick={() => router.push(href)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(href);
                }
              }}
              tabIndex={0}
            >
              {/* Image (no border) */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={it.label}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                {/* Soft top gradient for legibility (no border) */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/10 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900">
                  {it.label}
                </h3>
                {it.description && (
                  <p className="mt-1.5 line-clamp-2 text-xs text-slate-600">
                    {it.description}
                  </p>
                )}

                <div className="mt-3">
                  {/* Icon CTA; prevent bubbling so we don’t double-navigate */}
                  <Link
                    href={href}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand)] px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                    style={{ ["--brand" as any]: BRAND }}
                    aria-label={`View ${it.label}`}
                  >
                    View
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Focus ring (no borders) */}
              <span className="pointer-events-none absolute inset-0 rounded-xl ring-0 focus:rounded-xl group-focus-visible:ring-2 group-focus-visible:ring-[var(--brand)]" />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

function NotFound({ slug }: { slug: string }) {
  return (
    <section className="max-w-3xl">
      <div className="rounded-2xl bg-white/80 p-8 text-center text-slate-600 shadow-sm">
        <div className="text-lg font-semibold">No matching service found</div>
        <p className="mt-2 text-sm">
          “<b>{slug}</b>” didn’t match any category title or item label.
        </p>
        <div className="mt-4 flex items-center justify-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 rounded-full bg-[var(--brand)] px-3.5 py-2 text-xs font-semibold text-white transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            style={{ ["--brand" as any]: BRAND }}
          >
            <ArrowLeft className="h-4 w-4" />
            Services
          </Link>
        </div>
      </div>
    </section>
  );
}
