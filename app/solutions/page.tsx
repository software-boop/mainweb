"use client";
export const runtime = 'edge';
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronRight } from "lucide-react";
import { solutions } from "@/app/data/Sollution";

const BRAND = "#07518a";

/** Optional: tiny category badge per card (purely visual) */
const CATEGORY_FOR_SLUG: Record<string, string> = {
  "video-analytics": "Security AI",
  "access-control": "Access & Identity",
  "smart-retail": "Retail",
  "smart-bus": "Transportation",
  "in-car-surveillance": "Law Enforcement",
};

type Item = {
  slug: string;
  title: string;
  summary?: string;
  image?: string;
  features: string[];
  category: string;
};

const enter = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function SolutionsPage() {
  // normalize data
  const items: Item[] = useMemo(
    () =>
      solutions.map((s) => ({
        slug: s.slug,
        title: s.title,
        summary: s.summary,
        image: s.image,
        features: s.features ?? [],
        category: CATEGORY_FOR_SLUG[s.slug] ?? "Other",
      })),
    []
  );

  const [query, setQuery] = useState("");

  // search-only filtering
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.summary ?? "").toLowerCase().includes(q) ||
        i.features.some((f) => f.toLowerCase().includes(q))
    );
  }, [items, query]);

  // ESC clears search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuery("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8"
      style={{ ["--brand" as any]: BRAND } as React.CSSProperties}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Solutions
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Explore AI Video Analytics, Access Control, Smart Retail, Smart Bus
            & In-Car Surveillance.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search solutions or features…"
            className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-8 py-2 text-sm outline-none focus:ring-2"
            aria-label="Search solutions"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={query || "all"}
          variants={enter}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.15 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed p-8 text-center text-gray-500">
              No matches found.
            </div>
          )}

          {filtered.map((item) => (
            <motion.div
              key={item.slug}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={`/solutions/${item.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:shadow"
              >
                <div className="relative aspect-[16/9] w-full bg-gray-50">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: "var(--brand)" }}
                      />
                      <span className="text-[--brand]">{item.category}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-[--brand]" />
                  </div>

                  <h3 className="mt-1 line-clamp-2 text-lg font-semibold">
                    {item.title}
                  </h3>

                  {item.summary && (
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      {item.summary}
                    </p>
                  )}

                  {/* Compact feature chips (no hashtags) */}
                  {item.features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.features.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                        >
                          {f}
                        </span>
                      ))}
                      {item.features.length > 3 && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                          +{item.features.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-600">
                      View details
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
