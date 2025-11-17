"use client";
export const runtime = 'edge';


import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Search, ChevronRight, X, LayoutGrid, List } from "lucide-react";
import {
  MENU_DATA,
  type MenuItem,
  type MenuCategory,
} from "@/app/data/menuData";

/* ============================
   Brand
============================ */
const BRAND = "#07518a";
const BRAND_TINT = "#0a6ab8";

/* ============================
   Helpers
============================ */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function getItemImage(i: MenuItem): string {
  // adjust to your item schema
  // @ts-ignore
  return i.image || i.img || i.icon || "/default-product.png";
}
function getCategoryIconSrc(c: MenuCategory): string {
  // pull icon from your category schema (no generated icons)
  // @ts-ignore
  return (c.titleIcon ||
    c.icon ||
    c.iconUrl ||
    c.image ||
    "/default-category.png") as string;
}

/* ============================
   Motion presets
============================ */
const easing = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
  transition: { duration: 0.28, ease: easing },
};

export default function ProductsPage() {
  const prefersReducedMotion = useReducedMotion();
  const categories: MenuCategory[] = MENU_DATA.products ?? [];

  // Items with category tag
  type ItemWithCat = MenuItem & { __cat: string };
  const allItems = useMemo<ItemWithCat[]>(() => {
    const out: ItemWithCat[] = [];
    categories.forEach((c) =>
      c.items.forEach((i) => out.push({ ...(i as MenuItem), __cat: c.title }))
    );
    return out;
  }, [categories]);

  // Category filter + search + view
  const [activeCat, setActiveCat] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    const source =
      activeCat === "All"
        ? allItems
        : allItems.filter((i) => i.__cat === activeCat);
    if (!query.trim()) return source;
    const q = query.toLowerCase();
    return source.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        (i.features || []).some((f) => f.toLowerCase().includes(q))
    );
  }, [allItems, activeCat, query]);

  // Scroll-driven hero animations
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const headingScale = useTransform(scrollYProgress, [0, 1], [1.04, 1]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const paragraphY = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const paragraphOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 1],
    [0.65, 0.9, 1]
  );
  const leftColY = useTransform(scrollYProgress, [0, 1], [0, -14]);
  const rightColY = useTransform(scrollYProgress, [0, 1], [14, 0]);

  // Lock body overscroll-x just in case (mobile bounce)
  useEffect(() => {
    const prev = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = prev;
    };
  }, []);

  return (
    <>
      {/* ===== FULL-BLEED HERO (centered heading, smaller size on mobile) ===== */}
      <section
        ref={heroRef}
        className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-x-clip overflow-hidden text-white"
        style={{
          ["--brand" as any]: BRAND,
          ["--brandTint" as any]: BRAND_TINT,
        }}
      >
        {/* Brand background layers */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,81,138,0.96),rgba(10,106,184,0.9))]" />
        <motion.span
          className="pointer-events-none absolute -top-24 -right-20 h-96 w-96 rounded-full bg-white/15 blur-3xl"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
        />
        <motion.span
          className="pointer-events-none absolute -bottom-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-[var(--brandTint)]/30 blur-3xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05 }}
        />

        {/* Hero content (max width) */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:py-12 md:py-16">
          {/* CENTERED, SLIGHTLY SMALLER HEADING WITH ENTRANCE ANIMATION */}
          <div className="w-full grid place-items-center text-center">
            <motion.h1
              style={{ scale: headingScale, y: headingY }}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: easing }}
              className="font-black tracking-tight leading-[1.08] max-w-3xl sm:max-w-4xl"
            >
              <span className="block text-2xl xs:text-3xl sm:text-4xl md:text-5xl">
                Products we design &amp; deliver
              </span>
            </motion.h1>
            {/* Accent underline that animates in */}
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: prefersReducedMotion ? "8rem" : "12rem",
                opacity: 1,
              }}
              transition={{ duration: 0.6, ease: easing, delay: 0.15 }}
              className="mt-3 h-1 rounded-full bg-white/80"
              aria-hidden
            />
          </div>

          {/* GRID: LEFT (icons) | RIGHT (text + search) */}
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {/* LEFT 50%: ICON SECTION from DATA (parallax) */}
            <motion.div
              style={{ y: leftColY }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 content-start"
            >
              {categories.slice(0, 9).map((c, idx) => {
                const iconSrc = getCategoryIconSrc(c);
                return (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.28, delay: idx * 0.03 }}
                    className="rounded-2xl bg-white p-4 text-[var(--brand)] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
                    title={c.title}
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={iconSrc}
                          alt={c.title}
                          className="h-10 w-10 object-contain"
                          loading="lazy"
                        />
                      </span>
                      <div className="text-sm font-semibold line-clamp-2">
                        {c.title}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* RIGHT 50%: Paragraph + search (parallax) */}
            <motion.div
              style={{ y: rightColY }}
              className="flex flex-col justify-center"
            >
              <motion.p
                style={{ y: paragraphY, opacity: paragraphOpacity }}
                className="mt-1 w-full text-white/90"
              >
                <span className="block">
                  Brihaspathi Technologies is your trusted partner for security,
                  ELV, IoT and AI-led solutions.
                </span>
                <span className="block mt-2">
                  From enterprise-grade cameras with video analytics to access
                  control, networking, servers, and automation, we craft
                  reliable systems end-to-end — design, deployment, and
                  long-term support.
                </span>
              </motion.p>

              {/* Search with clear button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-6 w-full"
              >
                <div className="relative max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products…"
                    className="w-full rounded-xl bg-white/15 pl-11 pr-10 py-3 text-sm outline-none placeholder:text-white/70 text-white backdrop-blur-sm transition focus:ring-2 focus:ring-white/30 shadow-sm"
                    aria-label="Search products"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                      aria-label="Clear search"
                      title="Clear"
                    >
                      <X className="h-4 w-4 text-white/80" />
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT (centered) ===== */}
      <div
        className="mx-auto max-w-7xl px-4 py-8 sm:py-10"
        style={{ ["--brand" as any]: BRAND }}
      >
        {/* Controls: filter chips + view toggle */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3">
          {/* Filter chips */}
          <div className="flex-1 min-w-0">
            <div
              className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1"
              role="tablist"
              aria-label="Product categories"
            >
              {["All", ...categories.map((c) => c.title)].map((title) => {
                const isAll = title === "All";
                const cat = categories.find((c) => c.title === title);
                const iconSrc = !isAll && cat ? getCategoryIconSrc(cat) : null;
                const selected = activeCat === title;
                return (
                  <button
                    key={title}
                    onClick={() => setActiveCat(title)}
                    className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition border focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40 ${
                      selected
                        ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                        : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                    }`}
                    role="tab"
                    aria-selected={selected}
                  >
                    {!isAll && iconSrc && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={iconSrc}
                        alt=""
                        className="h-5 w-5 object-contain"
                      />
                    )}
                    {title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* View toggle */}
          <div className="hidden xs:flex items-center gap-1">
            <button
              onClick={() => setView("grid")}
              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm transition ${
                view === "grid"
                  ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
              }`}
              title="Grid view"
              aria-pressed={view === "grid"}
            >
              <LayoutGrid className="h-4 w-4" /> Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm transition ${
                view === "list"
                  ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
              }`}
              title="List view"
              aria-pressed={view === "list"}
            >
              <List className="h-4 w-4" /> List
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-gray-500">
          Showing {filtered.length} item{filtered.length === 1 ? "" : "s"}
        </p>

        {/* Grid/List of cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCat}-${query}-${view}`}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22 }}
            className={
              view === "grid"
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                : "grid gap-3"
            }
          >
            {filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed p-12 text-center text-gray-500 bg-white">
                No matches found.
              </div>
            )}

            {filtered.map((item) => {
              const img = getItemImage(item);
              const href = `/products/${slugify(
                (item as ItemWithCat).__cat
              )}/${slugify(item.label)}`;

              if (view === "list") {
                return (
                  <motion.article
                    key={`list-${(item as ItemWithCat).__cat}-${item.label}`}
                    whileHover={{ x: 2 }}
                    className="group relative overflow-hidden rounded-xl border bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition"
                  >
                    <Link
                      href={href}
                      className="flex items-center gap-3 sm:gap-4"
                    >
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 grid place-items-center bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={item.label}
                          className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
                          {item.label}
                        </h3>
                        {item.features?.length ? (
                          <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                            {item.features[0]}
                          </p>
                        ) : null}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-0.5 transition" />
                    </Link>
                  </motion.article>
                );
              }

              // GRID CARD
              return (
                <motion.article
                  key={`grid-${(item as ItemWithCat).__cat}-${item.label}`}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-2xl shadow-[0_14px_40px_rgba(0,0,0,0.08)] bg-white"
                >
                  <Link href={href} className="block">
                    {/* Full, big image */}
                    <div className="relative h-60 sm:h-64 md:h-72 w-full bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={item.label}
                        className="absolute inset-0 h-full w-full object-contain p-6 transition duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>

                    {/* Label overlay pill */}
                    <div className="absolute inset-x-0 bottom-0">
                      <div className="mx-3 mb-3 rounded-xl border border-white/70 bg-[var(--brand)] text-white px-4 py-2.5 shadow-[0_6px_20px_rgba(7,81,138,0.35)]">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="line-clamp-2 text-base font-semibold">
                            {item.label}
                          </h3>
                          <ChevronRight className="h-5 w-5 text-white/90 group-hover:translate-x-0.5 transition" />
                        </div>
                      </div>
                    </div>

                    {/* top brand bar */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-[var(--brand)]" />
                  </Link>

                  {/* Hover halo */}
                  <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(200px_140px_at_75%_0%,rgba(7,81,138,0.12),transparent)]" />
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky bottom action bar (mobile): quick filters */}
      <div
        className="md:hidden fixed bottom-3 left-0 right-0 z-40 px-3"
        style={{ ["--brand" as any]: BRAND }}
      >
        <div className="mx-auto max-w-2xl rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 p-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-600 px-2">View</span>
            <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-1.5 text-sm ${
                  view === "grid"
                    ? "bg-[var(--brand)] text-white"
                    : "bg-white text-gray-800"
                }`}
                aria-label="Grid view"
              >
                Grid
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 text-sm ${
                  view === "list"
                    ? "bg-[var(--brand)] text-white"
                    : "bg-white text-gray-800"
                }`}
                aria-label="List view"
              >
                List
              </button>
            </div>
            <span className="text-xs text-gray-600 px-2">
              {filtered.length} items
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
