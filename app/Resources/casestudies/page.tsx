"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Building2,
  Stethoscope,
  GraduationCap,
  ShoppingCart,
  Banknote,
  Car,
  Plane,
  Utensils,
  Zap,
  Shield,
  Hammer,
  Gamepad2,
  Users,
  Briefcase,
  Star,
  MapPin,
  User,
  ChevronRight,
  Filter,
  X,
  Search as SearchIcon,
  LayoutGrid,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CaseStudy } from "@/app/data/Casestudy";
import { CASE_STUDIES_BY_SECTOR } from "@/app/data/Casestudy";

/* ===== Helpers ===== */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function titleCaseFromKey(key: string) {
  return key.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function highlight(text: string, q: string) {
  if (!q.trim()) return text;
  const re = new RegExp(`(${escapeRegExp(q)})`, "ig");
  return text.replace(
    re,
    "<mark class='bg-yellow-200 rounded px-0.5'>$1</mark>"
  );
}

/* ===== Icon & Color Maps ===== */
const sectorIcons: Record<string, React.ComponentType<any>> = {
  technology: Building2,
  healthcare: Stethoscope,
  education: GraduationCap,
  retail: ShoppingCart,
  finance: Banknote,
  automotive: Car,
  travel: Plane,
  food: Utensils,
  energy: Zap,
  security: Shield,
  construction: Hammer,
  gaming: Gamepad2,
  consulting: Users,
  business: Briefcase,
  "e-commerce": ShoppingCart,
  fintech: Banknote,
  manufacturing: Hammer,
  logistics: Car,
  entertainment: Gamepad2,
  telecommunications: Zap,
  insurance: Shield,
  "real-estate": Building2,
  default: Briefcase,
};

const sectorGradients: Record<string, string> = {
  technology: "from-blue-50 to-indigo-50",
  healthcare: "from-emerald-50 to-teal-50",
  education: "from-violet-50 to-purple-50",
  retail: "from-rose-50 to-orange-50",
  finance: "from-amber-50 to-yellow-50",
  automotive: "from-slate-50 to-zinc-50",
  travel: "from-sky-50 to-cyan-50",
  food: "from-orange-50 to-amber-50",
  energy: "from-lime-50 to-green-50",
  security: "from-indigo-50 to-blue-50",
  construction: "from-stone-50 to-amber-50",
  gaming: "from-fuchsia-50 to-pink-50",
  consulting: "from-gray-50 to-slate-50",
  business: "from-gray-50 to-slate-50",
  "e-commerce": "from-rose-50 to-orange-50",
  fintech: "from-amber-50 to-yellow-50",
  manufacturing: "from-stone-50 to-zinc-50",
  logistics: "from-slate-50 to-zinc-50",
  entertainment: "from-pink-50 to-rose-50",
  telecommunications: "from-sky-50 to-cyan-50",
  insurance: "from-indigo-50 to-blue-50",
  "real-estate": "from-blue-50 to-sky-50",
  default: "from-gray-50 to-slate-50",
};

function getSectorIcon(sectorName: string) {
  const key = sectorName.toLowerCase();
  const match = Object.keys(sectorIcons).find((k) => key.includes(k));
  return sectorIcons[match || "default"];
}
function getSectorGradient(sectorName: string) {
  const key = sectorName.toLowerCase();
  const match = Object.keys(sectorGradients).find((k) => key.includes(k));
  return sectorGradients[match || "default"];
}

/* ===== Small UI pieces ===== */
const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm">
    <div className="p-6">
      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-200" />
      <div className="mx-auto mb-2 h-4 w-40 rounded bg-gray-200" />
      <div className="mx-auto h-3 w-24 rounded bg-gray-200" />
    </div>
  </div>
);

/* ===== Component ===== */
export default function TwoPaneCaseStudies() {
  const params = useParams();
  const pathname = usePathname();

  /* Toolbar state */
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"name-asc" | "name-desc">("name-asc");
  const [density, setDensity] = useState<"comfy" | "compact">("comfy");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Favorites (persisted) */
  const [favs, setFavs] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cs_favs");
      if (raw) setFavs(new Set(JSON.parse(raw)));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("cs_favs", JSON.stringify(Array.from(favs)));
    } catch {}
  }, [favs]);

  /* Build sector list */
  const sectors = useMemo(
    () =>
      Object.entries(CASE_STUDIES_BY_SECTOR).map(([name, items]) => ({
        name,
        slug: slugify(name),
        count: items.length,
        icon: getSectorIcon(name),
        gradient: getSectorGradient(name),
      })),
    []
  );

  /* Active sector from URL or default */
  const sectorSlugFromUrl =
    (typeof params?.sector === "string" ? (params.sector as string) : "") || "";
  const activeSectorSlug =
    sectorSlugFromUrl || (sectors.length > 0 ? sectors[0].slug : "");

  /* Resolve active sector data */
  const { sectorKey, sectorTitle, items } = useMemo(() => {
    const key = Object.keys(CASE_STUDIES_BY_SECTOR).find(
      (k) => slugify(k) === activeSectorSlug
    );
    const list: CaseStudy[] = key ? CASE_STUDIES_BY_SECTOR[key] : [];
    const title = key ? titleCaseFromKey(key) : "Unknown";
    return { sectorKey: key, sectorTitle: title, items: list };
  }, [activeSectorSlug]);

  const activeSector = sectors.find((s) => s.slug === activeSectorSlug);

  /* Filter + sort */
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    let res = items.filter((cs) => {
      const name = cs.name?.toLowerCase?.() || "";
      const desc =
        (cs as any).summary?.toLowerCase?.() ||
        (cs as any).description?.toLowerCase?.() ||
        "";
      return !q || name.includes(q) || desc.includes(q);
    });
    if (sortKey === "name-asc")
      res.sort((a, b) => a.name.localeCompare(b.name));
    if (sortKey === "name-desc")
      res.sort((a, b) => b.name.localeCompare(a.name));
    return res;
  }, [items, query, sortKey]);

  /* Motion variants */
  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
    },
  };

  /* Card tilt/glow */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = (y / r.height - 0.5) * -6;
    const ry = (x / r.width - 0.5) * 6;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--px", `${x}px`);
    el.style.setProperty("--py", `${y}px`);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  /* Density → columns */
  const gridCols =
    density === "comfy"
      ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5";

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 bg-white text-black">
      {/* Header */}
      <header
        className={`mb-6 rounded-2xl border bg-gradient-to-r ${
          activeSector?.gradient || "from-gray-50 to-slate-50"
        } p-5`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {activeSector && (
              <div className="p-2 rounded-xl bg-white/70">
                <activeSector.icon className="h-6 w-6 text-blue-600" />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Case Studies
              </h1>
              <p className="text-muted-foreground mt-1">
                Explore detailed implementations across industries and sectors.
              </p>
            </div>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Mobile toggle for sidebar */}
            <button
              className="inline-flex md:hidden items-center gap-2 rounded-lg border bg-white/70 px-3 py-2 text-sm font-medium hover:bg-white transition"
              onClick={() => setSidebarOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Sectors
            </button>

            {/* Search */}
            <div className="relative flex-1 md:flex-none md:w-[320px]">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${sectorTitle}...`}
                className="w-full rounded-lg border bg-white/70 pl-9 pr-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Sort */}
            <select
              value={sortKey}
              onChange={(e) =>
                setSortKey(e.target.value as "name-asc" | "name-desc")
              }
              className="rounded-lg border bg-white/70 px-2 py-2 text-sm"
              title="Sort"
            >
              <option value="name-asc">A → Z</option>
              <option value="name-desc">Z → A</option>
            </select>

            {/* Density */}
            <div className="flex items-center rounded-lg border bg-white/70">
              <button
                onClick={() => setDensity("comfy")}
                className={`px-2.5 py-2 text-sm rounded-l-lg inline-flex items-center gap-1 transition ${
                  density === "comfy"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white"
                }`}
                title="Comfortable"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Comfy</span>
              </button>
              <button
                onClick={() => setDensity("compact")}
                className={`px-2.5 py-2 text-sm rounded-r-lg inline-flex items-center gap-1 transition ${
                  density === "compact"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-white"
                }`}
                title="Compact"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Compact</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile sector chips */}
        <div className="mt-4 md:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {sectors.map((s) => {
              const isActive = s.slug === activeSectorSlug;
              return (
                <Link key={s.slug} href={`/casestudies/${s.slug}`}>
                  <span
                    className={[
                      "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition",
                      isActive
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white/70 hover:bg-white",
                    ].join(" ")}
                  >
                    <s.icon className="h-4 w-4" />
                    {s.name}
                    <Badge
                      variant={isActive ? "default" : "secondary"}
                      className={`ml-1 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {s.count}
                    </Badge>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-6">
            <Card className="overflow-hidden shadow-lg">
              <div
                className={`p-4 bg-gradient-to-r ${
                  activeSector?.gradient || "from-gray-50 to-slate-50"
                } border-b`}
              >
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Industry Sectors
                </h2>
              </div>
              <div className="max-h-[70vh] overflow-auto">
                <nav aria-label="Sectors" className="p-2">
                  <AnimatePresence>
                    {sectors.map((s) => {
                      const IconComponent = s.icon;
                      const href = `/casestudies/${s.slug}`;
                      const isActive = s.slug === activeSectorSlug;

                      return (
                        <motion.div
                          key={s.slug}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link href={href}>
                            <div
                              className={[
                                "group flex items-center justify-between p-3 rounded-lg transition-all duration-200 mb-1",
                                "hover:bg-blue-50 hover:shadow-sm hover:scale-[1.01]",
                                isActive
                                  ? "bg-blue-100/70 shadow-sm"
                                  : "bg-white/70",
                              ].join(" ")}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={[
                                    "p-2 rounded-lg transition-colors duration-200",
                                    isActive
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700",
                                  ].join(" ")}
                                >
                                  <IconComponent className="h-4 w-4" />
                                </div>
                                <span
                                  className={[
                                    "font-medium truncate transition-colors duration-200",
                                    isActive
                                      ? "text-blue-800"
                                      : "text-gray-700 group-hover:text-blue-700",
                                  ].join(" ")}
                                  title={s.name}
                                >
                                  {s.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={isActive ? "default" : "secondary"}
                                  className={[
                                    "transition-all duration-200 text-xs",
                                    isActive
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700",
                                  ].join(" ")}
                                >
                                  {s.count}
                                </Badge>
                                <ChevronRight
                                  className={[
                                    "h-4 w-4 transition-all duration-200",
                                    isActive
                                      ? "text-blue-600 translate-x-1"
                                      : "text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1",
                                  ].join(" ")}
                                />
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {sectors.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">
                      No sectors available.
                    </div>
                  )}
                </nav>
              </div>
            </Card>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
                className="absolute left-0 top-0 h-full w-[320px] bg-white shadow-2xl p-3"
              >
                <div className="flex items-center justify-between p-2 border-b">
                  <h3 className="text-base font-semibold">Sectors</h3>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="rounded p-2 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-2 space-y-1 overflow-auto h-[calc(100%-48px)]">
                  {sectors.map((s) => {
                    const IconComponent = s.icon;
                    const isActive = s.slug === activeSectorSlug;
                    return (
                      <Link
                        key={s.slug}
                        href={`/casestudies/${s.slug}`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div
                          className={[
                            "flex items-center justify-between p-3 rounded-lg",
                            isActive
                              ? "bg-blue-100/70"
                              : "bg-white hover:bg-blue-50",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={[
                                "p-2 rounded-lg",
                                isActive
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700",
                              ].join(" ")}
                            >
                              <IconComponent className="h-4 w-4" />
                            </span>
                            <span className="font-medium">{s.name}</span>
                          </div>
                          <Badge
                            variant={isActive ? "default" : "secondary"}
                            className={
                              isActive
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {s.count}
                          </Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Pane */}
        <section className="lg:col-span-9">
          {/* Subheader */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {activeSector && (
                <div className="p-2 bg-blue-100 rounded-lg">
                  <activeSector.icon className="h-6 w-6 text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {sectorTitle}
                </h2>
                <p className="text-muted-foreground">
                  {filteredItems.length} result
                  {filteredItems.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Clear search (if active) */}
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-sm text-blue-700 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Content */}
          {items.length === 0 ? (
            <Card className="p-12">
              <CardContent className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No Case Studies Found
                </h3>
                <p className="text-muted-foreground">
                  There are currently no case studies available for this sector.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Grid */}
              <motion.div
                className={`grid gap-6 ${gridCols}`}
                initial="hidden"
                animate="visible"
                variants={listVariants}
              >
                {filteredItems.length === 0 && query && (
                  <div className="col-span-full">
                    <Card className="p-10 text-center">
                      <CardContent>
                        <div className="mx-auto w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center mb-3">
                          <SearchIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <h3 className="font-semibold">
                          No matches for “{query}”
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          Try a different keyword.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ===== CASE STUDY CARDS — BORDERLESS ===== */}
                <AnimatePresence>
                  {filteredItems.map((cs) => {
                    const caseSlug = slugify(cs.name);
                    const href = `/casestudies/${activeSectorSlug}/${caseSlug}`;
                    const avatarSrc =
                      cs.avatar && cs.avatar.trim() !== ""
                        ? cs.avatar
                        : "/default-case-study-image.jpg";
                    const [favs, setFavsInner] = [useState, useState]; // (ignore – avoids TS highlighting in snippet)
                    return (
                      <motion.div
                        key={cs.id}
                        variants={itemVariants}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      >
                        <Card
                          /* 👇 borderless look */
                          className="group h-full relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/80 backdrop-blur-sm rounded-2xl border-0 shadow-none"
                          onMouseMove={(e) => {
                            const el = e.currentTarget as HTMLDivElement;
                            const r = el.getBoundingClientRect();
                            const x = e.clientX - r.left;
                            const y = e.clientY - r.top;
                            const rx = (y / r.height - 0.5) * -6;
                            const ry = (x / r.width - 0.5) * 6;
                            el.style.setProperty("--rx", `${rx}deg`);
                            el.style.setProperty("--ry", `${ry}deg`);
                            el.style.setProperty("--px", `${x}px`);
                            el.style.setProperty("--py", `${y}px`);
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLDivElement;
                            el.style.setProperty("--rx", `0deg`);
                            el.style.setProperty("--ry", `0deg`);
                          }}
                          style={{
                            transform:
                              "perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
                            transformStyle: "preserve-3d",
                          }}
                        >
                          {/* Glow (kept) */}
                          <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(160px_120px_at_var(--px,50%)_0%,rgba(59,130,246,0.15),transparent)]" />

                          {/* Favorite toggle (borderless chip) */}
                          <FavButton id={String(cs.id)} />

                          <Link href={href}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                              <div className="mb-4">
                                <Avatar className="h-16 w-16 ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300 mx-auto">
                                  <AvatarImage src={avatarSrc} alt={cs.name} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold">
                                    {cs.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>

                              <div className="mb-3">
                                <h3
                                  className="text-base font-semibold group-hover:text-blue-700 transition-colors duration-200"
                                  dangerouslySetInnerHTML={{
                                    __html: highlight(cs.name, query),
                                  }}
                                />
                                {(cs as any).location && (
                                  <p className="mt-1 text-xs text-gray-500 inline-flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {(cs as any).location}
                                  </p>
                                )}
                              </div>

                              {(cs as any).author && (
                                <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                                  <User className="h-3.5 w-3.5" />
                                  {(cs as any).author}
                                </div>
                              )}

                              <div className="mt-auto flex items-center justify-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-200">
                                Read Case Study
                                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                              </div>
                            </CardContent>
                          </Link>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Initial skeletons */}
                {items.length === 0 &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={`s-${i}`} />
                  ))}
              </motion.div>
            </>
          )}
        </section>
      </div>

      {/* Subtle global styles for nicer scrollbars */}
      <style jsx global>{`
        .overflow-auto {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af #e5e7eb;
        }
        .overflow-auto::-webkit-scrollbar {
          height: 10px;
          width: 8px;
        }
        .overflow-auto::-webkit-scrollbar-thumb {
          background: #9ca3af44;
          border-radius: 9999px;
        }
        .overflow-auto::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 9999px;
        }
      `}</style>
    </main>
  );
}

/* ===== Favorite chip (borderless) ===== */
function FavButton({ id }: { id: string }) {
  const [isFav, setIsFav] = useState<boolean>(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cs_favs");
      const set = new Set<string>(raw ? JSON.parse(raw) : []);
      setIsFav(set.has(id));
    } catch {}
  }, [id]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const raw = localStorage.getItem("cs_favs");
      const set = new Set<string>(raw ? JSON.parse(raw) : []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      localStorage.setItem("cs_favs", JSON.stringify(Array.from(set)));
      setIsFav(set.has(id));
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      className={`absolute right-2 top-2 z-10 rounded-full p-1.5 transition ${
        isFav
          ? "bg-yellow-400 text-white"
          : "bg-white/80 text-gray-600 hover:bg-white"
      }`}
      title={isFav ? "Remove favorite" : "Add favorite"}
    >
      <Star className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
    </button>
  );
}
