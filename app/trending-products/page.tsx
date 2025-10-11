"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Search,
  X,
  Filter,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sparkles,
  BadgePercent,
} from "lucide-react";
import { MENU_DATA, type MenuItem, type MenuCategory } from "@/app/data/aidata";

// —— utils
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

type AIItem = MenuItem & {
  __slug: string;
  __score: number; // popularity heat score
};

type SortKey = "popular" | "features" | "az";

const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};
const gridItem = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } },
};
const drawer = { hidden: { x: "100%" }, show: { x: 0 }, exit: { x: "100%" } };

export default function TrendingAIPage() {
  // ===== Palette (simple brand vars for a unique look)
  const BRAND = "#0e509e";
  const ACCENT = "#6dd6ff";

  // ===== Source data: only "AI Products"
  const categories: MenuCategory[] = MENU_DATA.services ?? [];
  const aiCat = categories.find((c) =>
    c.title.toLowerCase().includes("ai products")
  );
  const rawItems = aiCat?.items ?? [];

  // Build enriched items with stable “trending” score (deterministic)
  const items = useMemo<AIItem[]>(() => {
    const scoreOf = (m: MenuItem) => {
      // stable pseudo-popularity: features weight + label/desc signal
      const f = m.features.join("|");
      let hash = 0;
      const basis = `${m.label}|${m.description}|${f}`;
      for (let i = 0; i < basis.length; i++)
        hash = (hash * 31 + basis.charCodeAt(i)) % 1000003;
      const featureBoost = m.features.length * 14;
      const lenBoost = Math.min(40, Math.floor(m.description.length / 20));
      return 40 + (hash % 60) + featureBoost + lenBoost; // ~40–>200
    };
    return rawItems.map((m) => ({
      ...m,
      __slug: slugify(m.label),
      __score: scoreOf(m),
    }));
  }, [rawItems]);

  // ===== Feature cloud (for filters)
  const featureCloud = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.features.forEach((f) => set.add(f)));
    return Array.from(set).slice(0, 24);
  }, [items]);

  // ===== UI state
  const [query, setQuery] = useState("");
  const [displayQuery, setDisplayQuery] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setQuery(displayQuery), 160);
    return () => clearTimeout(t);
  }, [displayQuery]);

  const [activeTags, setActiveTags] = useState<string[]>([]);
  const toggleTag = (t: string) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const [sortKey, setSortKey] = useState<SortKey>("popular");

  const filtered = useMemo(() => {
    let base = items.slice();

    // tag filter
    if (activeTags.length) {
      base = base.filter((i) =>
        activeTags.every((t) => i.features.some((f) => f === t))
      );
    }
    // text search
    if (query.trim()) {
      const q = query.toLowerCase();
      base = base.filter(
        (i) =>
          i.label.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.features.some((f) => f.toLowerCase().includes(q))
      );
    }
    // sort
    base.sort((a, b) => {
      if (sortKey === "popular") return b.__score - a.__score;
      if (sortKey === "features") return b.features.length - a.features.length;
      return a.label.localeCompare(b.label);
    });
    return base;
  }, [items, activeTags, query, sortKey]);

  // ===== bookmarks (localStorage)
  const [saved, setSaved] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("ai:saved") || "[]");
    } catch {
      return [];
    }
  });
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("ai:saved", JSON.stringify(saved));
  }, [saved]);
  const toggleSave = (slug: string) =>
    setSaved((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );

  // ===== share (copy)
  const [copied, setCopied] = useState<string | null>(null);
  const onShare = async (slug: string) => {
    const url = `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/trending-ai#${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(slug);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      // ignore
    }
  };

  // drawer
  const [selected, setSelected] = useState<AIItem | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // stats
  const total = items.length;
  const hotCount = items.filter((i) => i.__score >= 120).length;

  return (
    <div
      className="relative min-h-[100dvh] w-full"
      style={
        {
          ["--brand" as any]: BRAND,
          ["--accent" as any]: ACCENT,
          ["--brand-soft" as any]: "rgba(14,80,158,0.06)",
          ["--card-border" as any]:
            "linear-gradient(135deg, var(--brand), var(--accent))",
        } as React.CSSProperties
      }
    >
      {/* background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute -top-48 left-1/2 h-[1200px] w-[1200px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, var(--accent), transparent 60%)",
          }}
        />
        <motion.div
          className="absolute -bottom-32 right-0 h-[700px] w-[700px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, var(--brand), transparent 60%)",
          }}
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* hero banner */}
      <section className="mx-auto max-w-7xl px-4 pt-12 pb-8">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
          style={{
            background: "linear-gradient(90deg, var(--brand), var(--accent))",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Trending AI
        </div>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            What’s hot in our AI products
          </h1>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 font-semibold text-slate-700 shadow-sm">
              <Flame className="h-4 w-4 text-orange-600" />
              {hotCount} hot picks
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 font-semibold text-slate-700 shadow-sm">
              <BadgePercent className="h-4 w-4 text-emerald-600" />
              {total} total
            </span>
          </div>
        </div>

        {/* marquee highlights */}
        <div className="relative mt-5 overflow-hidden rounded-xl border border-white/50 bg-white/60 backdrop-blur">
          <div
            className="absolute inset-0 -z-10 opacity-30"
            style={{
              background:
                "linear-gradient(120deg, var(--brand), var(--accent))",
            }}
          />
          <motion.div
            className="flex gap-6 whitespace-nowrap px-4 py-3 text-sm font-medium text-white"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
          >
            {items.flatMap((i) =>
              i.features.slice(0, 3).map((f) => (
                <span
                  key={`${i.__slug}-${f}`}
                  className="inline-flex items-center gap-2"
                >
                  <Flame className="h-4 w-4" />
                  {i.label} • {f}
                </span>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* toolbar */}
      <div className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          {/* search */}
          <div className="relative w-full md:max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={displayQuery}
              onChange={(e) => setDisplayQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white/90 pl-9 pr-10 py-2 text-sm outline-none transition shadow-sm focus:border-[var(--brand)] focus:ring-2"
              placeholder="Search AI products, features…"
              aria-label="Search AI"
            />
            {displayQuery && (
              <button
                onClick={() => {
                  setDisplayQuery("");
                  setQuery("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-100"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* sort */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none focus:border-[var(--brand)] focus:ring-2 md:w-48"
              aria-label="Sort by"
            >
              <option value="popular">Sort: Popular</option>
              <option value="features">Sort: Features count</option>
              <option value="az">Sort: A → Z</option>
            </select>
          </div>
        </div>

        {/* tag cloud */}
        <div className="mx-auto max-w-7xl px-4 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTags([])}
              className={`rounded-full px-3 py-1 text-xs transition ${
                activeTags.length === 0
                  ? "bg-[color:var(--brand)] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            {featureCloud.map((t) => {
              const active = activeTags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    active
                      ? "bg-[color:var(--brand)] text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  title={t}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* list */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-4 text-xs font-medium text-slate-600">
          Showing <strong>{filtered.length}</strong> of {items.length}
        </div>

        <motion.div
          variants={gridContainer}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed bg-white/70 p-10 text-center text-gray-500">
              No matches found.
            </div>
          )}

          {filtered.map((i) => {
            const hot = i.__score >= 120;
            const savedIt = saved.includes(i.__slug);
            return (
              <motion.article
                key={i.__slug}
                variants={gridItem}
                className="group relative overflow-hidden rounded-2xl p-[1px]"
                style={{ background: "var(--card-border)" }}
              >
                <div className="h-full rounded-2xl bg-white/90 p-4 shadow-sm backdrop-blur transition group-hover:shadow-md supports-[backdrop-filter]:bg-white/80">
                  {/* header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {hot && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700 ring-1 ring-orange-200">
                            <Flame className="h-3.5 w-3.5" />
                            Trending
                          </span>
                        )}
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 ring-1 ring-sky-200">
                          Score {i.__score}
                        </span>
                      </div>
                      <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-slate-900">
                        {i.label}
                      </h3>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => onShare(i.__slug)}
                        className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                        aria-label="Copy share link"
                        title="Copy share link"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleSave(i.__slug)}
                        className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                        aria-label={savedIt ? "Unsave" : "Save"}
                        title={savedIt ? "Unsave" : "Save"}
                      >
                        {savedIt ? (
                          <BookmarkCheck className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                    {i.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {i.features.slice(0, 3).map((f) => (
                      <span
                        key={`${i.__slug}-${f}`}
                        className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                      >
                        {f}
                      </span>
                    ))}
                    {i.features.length > 3 && (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                        +{i.features.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => setSelected(i)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 transition hover:bg-gray-50"
                    >
                      Details <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* tiny feedback on copied */}
                    <AnimatePresence>
                      {copied === i.__slug && (
                        <motion.span
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          className="text-xs font-medium text-emerald-600"
                        >
                          Link copied!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* brand glow */}
                <div
                  className="pointer-events-none absolute inset-0 -z-10 scale-105 rounded-2xl opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
                  style={{
                    background:
                      "radial-gradient(closest-side, var(--brand), transparent)",
                  }}
                />
              </motion.article>
            );
          })}
        </motion.div>
      </main>

      {/* drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-auto bg-white shadow-2xl"
              variants={drawer}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ type: "tween", duration: 0.22 }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(120deg, var(--brand), var(--accent))",
                }}
              >
                <div
                  className="absolute -right-16 -top-10 size-48 rounded-full opacity-30 blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle, white, transparent 60%)",
                  }}
                />
                <div
                  className="absolute -left-16 -bottom-10 size-48 rounded-full opacity-30 blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle, white, transparent 60%)",
                  }}
                />
                <div className="flex items-start justify-between gap-2 px-4 py-4 text-white">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide opacity-90">
                      AI Product
                    </div>
                    <h3 className="text-lg font-semibold">{selected.label}</h3>
                  </div>
                  <button
                    className="rounded-md p-2 hover:bg-white/10"
                    onClick={() => setSelected(null)}
                    aria-label="Close details"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="px-4 py-4">
                <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                  <p className="text-sm text-slate-800">
                    {selected.description}
                  </p>
                </div>

                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Key Features
                </h4>
                <ul className="grid list-disc gap-x-6 gap-y-2 pl-5 sm:grid-cols-2">
                  {selected.features.map((f) => (
                    <li key={f} className="text-sm text-gray-800">
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    onClick={() => onShare(selected.__slug)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 transition hover:bg-gray-50"
                  >
                    <Share2 className="h-4 w-4" />
                    Copy link
                  </button>
                  <button
                    onClick={() => toggleSave(selected.__slug)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 transition hover:bg-gray-50"
                  >
                    {saved.includes(selected.__slug) ? (
                      <BookmarkCheck className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    {saved.includes(selected.__slug) ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
