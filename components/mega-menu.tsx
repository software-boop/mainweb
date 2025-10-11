"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useId,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Search as SearchIcon,
  X,
  Box,
  Grid,
  Camera,
  Cpu,
  Cog,
  Shield,
  ScanFace,
  KeySquare,
  MonitorSmartphone,
  CircuitBoard,
  Layers,
  Database,
  Cable,
  Bot,
  Workflow,
  Package,
  Tag,
  Waypoints,
  AppWindow,
  Building2,
  Building,
  Store,
  Router,
  Server,
  HardDrive,
  PanelLeft,
} from "lucide-react";

import type { MenuCategory } from "@/app/data/menuData";
import { MENU_DATA } from "@/app/data/menuData";

const BRAND = "#07518a";

/* ===== Helpers ===== */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

/** Map string icon keys → Lucide icons (fallbacks) */
function getIcon(name?: string) {
  const size = 18;
  const dict: Record<string, JSX.Element> = {
    products: <Box size={size} />,
    services: <Cog size={size} />,
    solutions: <Grid size={size} />,
    camera: <Camera size={size} />,
    cctv: <Camera size={size} />,
    video: <Camera size={size} />,
    analytics: <ScanFace size={size} />,
    "video-analytics": <ScanFace size={size} />,
    "access-control": <KeySquare size={size} />,
    security: <Shield size={size} />,
    iot: <MonitorSmartphone size={size} />,
    edge: <Cpu size={size} />,
    gateway: <Router size={size} />,
    server: <Server size={size} />,
    storage: <HardDrive size={size} />,
    nvr: <HardDrive size={size} />,
    dvr: <HardDrive size={size} />,
    cable: <Cable size={size} />,
    network: <Router size={size} />,
    database: <Database size={size} />,
    software: <AppWindow size={size} />,
    platform: <Layers size={size} />,
    sdk: <Workflow size={size} />,
    api: <CircuitBoard size={size} />,
    package: <Package size={size} />,
    bot: <Bot size={size} />,
    retail: <Store size={size} />,
    enterprise: <Building2 size={size} />,
    building: <Building size={size} />,
    tags: <Tag size={size} />,
    routes: <Waypoints size={size} />,
  };
  if (!name) return <Box size={size} />;
  const key = name.toLowerCase().trim();
  return dict[key] ?? <Box size={size} />;
}

/* ===== Motion variants ===== */
const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
};

const columnVariants = {
  hidden: { opacity: 0, y: 4, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.04, duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  }),
};

const itemHoverVariants = {
  hover: { scale: 1.02, y: -1, transition: { duration: 0.12 } },
  tap: { scale: 0.98, transition: { duration: 0.08 } },
};

const searchFocusVariants = {
  focus: {
    scale: 1.01,
    boxShadow: "0 0 0 3px rgba(7, 81, 138, 0.1)",
    transition: { duration: 0.18 },
  },
};

/* ===== Props ===== */
export type MegaMenuProps = {
  isOpen: boolean;
  category: string; // "products" | "services" | "solutions"
  menuData?: (MenuCategory & { titleIcon?: string })[];
  id?: string;
  onClose?: () => void;
};

/* === tiny: clamp util for grid focus === */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

/* ===== Component ===== */
export function MegaMenu({
  isOpen,
  category,
  menuData = (MENU_DATA as any)[category] || [],
  id,
  onClose,
}: MegaMenuProps) {
  const uid = useId();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const firstFocusableRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState("");
  const [selectedCol, setSelectedCol] = useState(0);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  // For keyboard grid nav
  const rightPaneRef = useRef<HTMLDivElement | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const cols = useMemo(() => menuData ?? [], [menuData]);

  // search in label + description
  const filteredCols = useMemo(() => {
    if (!query.trim()) return cols;
    const q = query.toLowerCase();
    return cols
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (it) =>
            it.label.toLowerCase().includes(q) ||
            (it.description && it.description.toLowerCase().includes(q))
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [cols, query]);

  const effectiveSelected = useMemo(() => {
    const sel = filteredCols[selectedCol] ? selectedCol : 0;
    return Math.max(0, Math.min(sel, filteredCols.length - 1));
  }, [filteredCols, selectedCol]);

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onClose?.();
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  /* Autofocus search */
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => firstFocusableRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [isOpen]);

  /* Mobile: pre-open first two */
  useEffect(() => {
    if (!isOpen) return;
    const initial: Record<string, boolean> = {};
    filteredCols.slice(0, 2).forEach((c) => (initial[c.title] = true));
    setOpenMap(initial);
  }, [isOpen, filteredCols]);

  /* Desktop key nav (left rail + right grid) */
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const inRight =
        document.activeElement &&
        rightPaneRef.current?.contains(document.activeElement);

      const list = filteredCols[effectiveSelected]?.items ?? [];
      const gridCols = 2;
      if (inRight && list.length > 0) {
        if (
          ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)
        ) {
          e.preventDefault();
        }
        if (e.key === "ArrowRight")
          setFocusedIndex((i) => clamp(i + 1, 0, list.length - 1));
        if (e.key === "ArrowLeft")
          setFocusedIndex((i) => clamp(i - 1, 0, list.length - 1));
        if (e.key === "ArrowDown")
          setFocusedIndex((i) => clamp(i + gridCols, 0, list.length - 1));
        if (e.key === "ArrowUp")
          setFocusedIndex((i) => clamp(i - gridCols, 0, list.length - 1));
        if (e.key === "Enter" && focusedIndex >= 0) {
          const it = list[focusedIndex];
          if (!it) return;
          const href = `/${category}/${slugify(
            filteredCols[effectiveSelected].title
          )}/${slugify(it.label)}?name=${encodeURIComponent(it.label)}`;
          window.location.href = href;
        }
      }

      // Global
      if (
        e.key === "ArrowDown" &&
        filteredCols.length > effectiveSelected + 1
      ) {
        e.preventDefault();
        setSelectedCol(effectiveSelected + 1);
      } else if (e.key === "ArrowUp" && effectiveSelected > 0) {
        e.preventDefault();
        setSelectedCol(effectiveSelected - 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        (
          wrapperRef.current?.querySelector(
            '[data-left-rail="true"] button[aria-current="true"]'
          ) as HTMLButtonElement | undefined
        )?.focus();
      } else if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    filteredCols,
    effectiveSelected,
    category,
    focusedIndex,
    onClose,
  ]);

  const linkId = (href: string) => `mm-link-${uid}-${slugify(href)}`;

  /* Layout constants */
  const HEADER_H = 56; // px
  const PANEL_VH_DESKTOP = 40;
  const PANEL_VH_MOBILE = 70;

  /* Panel */
  const panel = (
    <motion.section
      id={id}
      role="menu"
      aria-label={`${category} mega menu`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="fixed left-1/2 top-16 md:top-20 z-[65] -translate-x-1/2"
      style={{ width: "50vw" }}
    >
      <div
        ref={wrapperRef}
        className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden relative"
        style={{
          ["--brand" as any]: BRAND,
          height: `clamp(${PANEL_VH_MOBILE}vh, 70vh, ${PANEL_VH_DESKTOP}vh)`,
        }}
      >
        {/* Top hairline */}
        <div
          className="absolute left-0 right-0 top-[56px] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent pointer-events-none z-10"
          aria-hidden
        />

        {/* Header */}
        <div
          className="flex items-center justify-between gap-2 px-3 py-2"
          style={{ height: HEADER_H }}
        >
          <motion.div
            className="relative w-full max-w-[480px]"
            variants={searchFocusVariants}
            whileFocus="focus"
          >
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              ref={firstFocusableRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${category}...`}
              aria-label={`Search ${category}`}
              className="w-full rounded-lg border-0 bg-gray-50/80 pl-9 pr-3 py-2 text-sm outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-[var(--brand)]/20"
              style={{ ["--brand" as any]: BRAND }}
            />
          </motion.div>

          <div className="hidden items-center gap-2 lg:flex">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={`/${category}`}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: BRAND }}
                prefetch={false}
                onClick={onClose}
              >
                Explore all {category}
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50/80"
              aria-label="Close menu"
            >
              Close
            </motion.button>
          </div>

          {/* Mobile close */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 transition-all duration-200 hover:bg-gray-50/80 lg:hidden"
            style={{ color: BRAND }}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Body */}
        <div
          className="h-full"
          style={{ height: `calc(100% - ${HEADER_H}px)` }}
        >
          {/* Mobile accordions */}
          <div className="px-3 py-3 lg:hidden h-full overflow-y-auto">
            <div className="sticky -top-3 h-3 bg-gradient-to-b from-white/80 to-transparent z-10 pointer-events-none" />
            <AnimatePresence mode="wait">
              {filteredCols.map((col, idx) => {
                const open = !!openMap[col.title];
                return (
                  <motion.div
                    key={col.title}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ delay: idx * 0.04, duration: 0.22 }}
                    className="mb-2 rounded-xl border bg-white/90 backdrop-blur-sm shadow-sm"
                  >
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(7,81,138,0.06)" }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-between rounded-t-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200"
                      onClick={() =>
                        setOpenMap((m) => ({
                          ...m,
                          [col.title]: !m[col.title],
                        }))
                      }
                      aria-expanded={open}
                      aria-controls={`acc-${slugify(col.title)}`}
                    >
                      <span className="inline-flex items-center gap-3">
                        {/* TITLE ICON (bigger) */}
                        {(col as any).titleIcon ? (
                          <span
                            className="h-8 w-8 rounded-md bg-[var(--brand)]/10 grid place-items-center overflow-hidden"
                            style={{ ["--brand" as any]: BRAND }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={(col as any).titleIcon}
                              alt={`${col.title} icon`}
                              className="h-7 w-7 object-contain"
                              loading="lazy"
                            />
                          </span>
                        ) : (
                          <span
                            className="p-1.5 rounded-md bg-[var(--brand)]/10"
                            style={{ ["--brand" as any]: BRAND }}
                          >
                            {getIcon((col as any).icon)}
                          </span>
                        )}
                        <span className="text-gray-900">{col.title}</span>
                      </span>
                      <motion.div
                        animate={{ rotate: open ? 90 : 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.ul
                          id={`acc-${slugify(col.title)}`}
                          initial={{ height: 0, opacity: 0, y: -8 }}
                          animate={{ height: "auto", opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden px-3 py-2 space-y-1"
                          role="group"
                          aria-label={col.title}
                        >
                          {col.items.map((it, itemIdx) => (
                            <motion.li
                              key={it.label}
                              initial={{ opacity: 0, x: -16 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIdx * 0.04 }}
                            >
                              <motion.div
                                variants={itemHoverVariants}
                                whileHover="hover"
                                whileTap="tap"
                              >
                                <Link
                                  href={`/${category}/${slugify(
                                    col.title
                                  )}/${slugify(
                                    it.label
                                  )}?name=${encodeURIComponent(it.label)}`}
                                  prefetch={false}
                                  onClick={onClose}
                                  className="block rounded-lg px-3 py-2 text-sm transition-all duration-200 text-[var(--brand)]/90 hover:bg-[var(--brand)]/10 hover:text-[var(--brand)] font-medium"
                                  style={{ ["--brand" as any]: BRAND }}
                                  dangerouslySetInnerHTML={{
                                    __html: highlight(it.label, query),
                                  }}
                                />
                              </motion.div>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredCols.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl bg-white/85 p-6 text-center backdrop-blur-sm"
              >
                <p className="text-sm text-gray-500">
                  No matches for “{query}”.
                </p>
              </motion.div>
            )}
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:grid lg:grid-cols-[260px_1fr] lg:gap-4 lg:px-4 lg:py-4 h-full relative">
            <div className="pointer-events-none absolute inset-x-4 top-4 h-6 bg-gradient-to-b from-white/70 to-transparent rounded-lg" />
            <div className="pointer-events-none absolute inset-x-4 bottom-4 h-6 bg-gradient-to-t from-white/70 to-transparent rounded-lg" />

            {/* Left rail */}
            <motion.aside
              data-left-rail="true"
              className="h-full rounded-xl overflow-hidden flex flex-col border"
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.22 }}
              style={{ borderColor: `${BRAND}22` }}
            >
              <div
                className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ background: BRAND }}
              >
                <PanelLeft className="h-3.5 w-3.5" />
                {category}
              </div>
              <ul className="flex-1 overflow-auto p-2 space-y-1">
                <AnimatePresence mode="wait">
                  {filteredCols.map((col, idx) => {
                    const active = idx === effectiveSelected;
                    return (
                      <motion.li
                        key={col.title}
                        custom={idx}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={columnVariants}
                      >
                        <motion.button
                          variants={itemHoverVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => {
                            setSelectedCol(idx);
                            setFocusedIndex(-1);
                          }}
                          className={[
                            "w-full text-left flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] transition-all duration-200",
                            active
                              ? "bg-[var(--brand)]/15 text-[var(--brand)] ring-1 ring-[var(--brand)]/20"
                              : "text-gray-800 hover:bg-[var(--brand)]/10 hover:text-[var(--brand)]",
                          ].join(" ")}
                          style={{ ["--brand" as any]: BRAND }}
                          aria-current={active ? "true" : undefined}
                        >
                          <span className="inline-flex items-center gap-3">
                            {/* TITLE ICON (bigger) */}
                            {(col as any).titleIcon ? (
                              <span
                                className={`h-8 w-8 rounded-md ${
                                  active
                                    ? "bg-[var(--brand)]/20"
                                    : "bg-[var(--brand)]/10"
                                } grid place-items-center overflow-hidden`}
                                style={{ ["--brand" as any]: BRAND }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={(col as any).titleIcon}
                                  alt={`${col.title} icon`}
                                  className="h-7 w-7 object-contain"
                                  loading="lazy"
                                />
                              </span>
                            ) : (
                              <span
                                className={`p-1.5 rounded-md ${
                                  active
                                    ? "bg-[var(--brand)]/20"
                                    : "bg-gray-100"
                                }`}
                              >
                                {getIcon((col as any).icon)}
                              </span>
                            )}
                            <span className="truncate">{col.title}</span>
                          </span>
                        </motion.button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </motion.aside>

            {/* Right content */}
            <motion.section
              className="h-full rounded-xl bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col relative border"
              initial={{ x: 16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.22 }}
              key={effectiveSelected}
              style={{ borderColor: `${BRAND}22` }}
            >
              {/* right header — brand bar without counts */}
              {filteredCols.length > 0 ? (
                <div
                  className="px-3 py-2 text-[11px] font-semibold tracking-wide text-white"
                  style={{ background: BRAND }}
                >
                  {filteredCols[effectiveSelected]?.title}
                </div>
              ) : (
                <div
                  className="px-3 py-2"
                  style={{ background: `${BRAND}0D` }}
                />
              )}

              {/* grid */}
              <div
                ref={rightPaneRef}
                className="flex-1 overflow-auto p-3 grid grid-cols-2 gap-2"
                role="grid"
                aria-label={`${
                  filteredCols[effectiveSelected]?.title || ""
                } items`}
              >
                {filteredCols.length === 0 ? (
                  <div className="col-span-2 flex h-full items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        No matches for “{query}”.
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredCols[effectiveSelected]?.items.map((it, idx) => {
                    const href = `/${category}/${slugify(
                      filteredCols[effectiveSelected].title
                    )}/${slugify(it.label)}?name=${encodeURIComponent(
                      it.label
                    )}`;
                    const isFocused = idx === focusedIndex;
                    return (
                      <motion.div
                        key={it.label}
                        custom={idx}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={columnVariants}
                      >
                        <Link
                          id={linkId(href)}
                          href={href}
                          prefetch={false}
                          onClick={onClose}
                          onFocus={() => setFocusedIndex(idx)}
                          className={[
                            "group relative block rounded-lg px-3 py-2 text-[13px] transition-all duration-200",
                            isFocused
                              ? "ring-2 ring-[var(--brand)]/30"
                              : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/30",
                            "text-gray-800 hover:text-[var(--brand)]",
                          ].join(" ")}
                          style={{ ["--brand" as any]: BRAND }}
                        >
                          <span className="absolute inset-0 rounded-lg border border-gray-200/70 group-hover:border-[var(--brand)]/30 transition-colors duration-200" />
                          <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[var(--brand)]/8 via-transparent to-transparent" />

                          <div className="relative flex items-center justify-between gap-3">
                            <div className="inline-flex items-center gap-2">
                              {/* Use TITLE ICON of the column for consistency */}
                              {(filteredCols[effectiveSelected] as any)
                                ?.titleIcon ? (
                                <span className=""></span>
                              ) : (
                                <span className="p-1.5 rounded-md bg-gray-100">
                                  {getIcon(
                                    (filteredCols[effectiveSelected] as any)
                                      .icon
                                  )}
                                </span>
                              )}
                              <span
                                className="group-hover:text-[var(--brand)] transition-colors duration-200"
                                dangerouslySetInnerHTML={{
                                  __html: highlight(it.label, query),
                                }}
                              />
                            </div>
                            <ChevronRight
                              className="h-4 w-4 text-gray-400 group-hover:text-[var(--brand)] transition-colors duration-200"
                              aria-hidden
                            />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Responsive width for small screens */}
      <style jsx global>{`
        @media (max-width: 1023px) {
          [aria-label="${category} mega menu"] {
            width: 92vw !important;
            min-width: 0 !important;
          }
        }
        /* Nicer scrollbars */
        [aria-label="${category} mega menu"] .overflow-auto {
          scrollbar-width: thin;
          scrollbar-color: ${BRAND} #e5e7eb;
        }
        [aria-label="${category} mega menu"] .overflow-auto::-webkit-scrollbar {
          height: 10px;
          width: 8px;
        }
        [aria-label="${category} mega menu"]
          .overflow-auto::-webkit-scrollbar-thumb {
          background: ${BRAND}22;
          border-radius: 9999px;
        }
        [aria-label="${category} mega menu"]
          .overflow-auto::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 9999px;
        }
      `}</style>
    </motion.section>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
            onClick={onClose}
            transition={{ duration: 0.18 }}
          />
          {panel}
        </>
      )}
    </AnimatePresence>
  );
}

// // "use client";

// // import Link from "next/link";
// // import { useEffect, useMemo, useRef, useState, useId } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import axios, { AxiosInstance } from "axios";
// // import {
// //   Search as SearchIcon,
// //   X,
// //   PanelLeft,
// //   Sparkles,
// //   ChevronRight,
// //   Box,
// // } from "lucide-react";

// // /* ================= Config & Axios ================= */
// // const BRAND = "#07518a";
// // const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// // let _client: AxiosInstance | null = null;
// // function api() {
// //   if (!_client) {
// //     _client = axios.create({ baseURL: API_URL });
// //     _client.interceptors.response.use(
// //       (r) => r,
// //       (err) => {
// //         const msg =
// //           err?.response?.data?.error?.message ||
// //           err?.response?.data?.message ||
// //           err?.message ||
// //           "Request failed";
// //         return Promise.reject(
// //           new Error(typeof msg === "string" ? msg : JSON.stringify(msg))
// //         );
// //       }
// //     );
// //   }
// //   return _client;
// // }

// // /* ================= Helpers ================= */
// // function slugify(text: string): string {
// //   return (text || "")
// //     .toLowerCase()
// //     .normalize("NFKD")
// //     .replace(/[\u0300-\u036f]/g, "")
// //     .replace(/[^a-z0-9]+/g, "-")
// //     .replace(/^-+|-+$/g, "");
// // }
// // function highlight(text: string, q: string) {
// //   if (!q.trim()) return text;
// //   const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// //   const re = new RegExp(`(${esc})`, "ig");
// //   return text.replace(
// //     re,
// //     "<mark class='bg-yellow-200 rounded px-0.5'>$1</mark>"
// //   );
// // }

// // /* ================= Motion variants ================= */
// // const containerVariants = {
// //   hidden: { opacity: 0, y: 8 },
// //   visible: {
// //     opacity: 1,
// //     y: 0,
// //     transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
// //   },
// //   exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
// // };
// // const columnVariants = {
// //   hidden: { opacity: 0, y: 4, scale: 0.98 },
// //   visible: (i: number) => ({
// //     opacity: 1,
// //     y: 0,
// //     scale: 1,
// //     transition: { delay: i * 0.04, duration: 0.2, ease: [0.22, 1, 0.36, 1] },
// //   }),
// // };
// // const itemHoverVariants = {
// //   hover: { scale: 1.02, y: -1, transition: { duration: 0.12 } },
// //   tap: { scale: 0.98, transition: { duration: 0.08 } },
// // };
// // const searchFocusVariants = {
// //   focus: {
// //     scale: 1.01,
// //     boxShadow: "0 0 0 3px rgba(7, 81, 138, 0.1)",
// //     transition: { duration: 0.18 },
// //   },
// // };

// // /* ================= Types ================= */
// // type Family = { id: number | string; title?: string; slug?: string };
// // type TypeRow = {
// //   id: number | string;
// //   title: string;
// //   slug: string;
// //   familyTitle: string;
// //   familySlug: string;
// // };
// // type ItemRow = {
// //   id: number | string;
// //   label: string;
// //   slug: string;
// //   typeId: number | string;
// // };

// // type Column = {
// //   title: string; // type title
// //   slug: string; // type slug
// //   familyTitle: string;
// //   familySlug: string;
// //   items: Array<{ label: string; slug: string }>;
// // };

// // /* ================= Normalizers ================= */
// // function normOne(raw: any) {
// //   if (!raw) return null;
// //   if (raw.attributes) {
// //     const a = raw.attributes;
// //     return {
// //       id: raw.id,
// //       documentId: raw.documentId || a.documentId,
// //       ...a,
// //     };
// //   }
// //   return raw;
// // }
// // function normMany(resData: any) {
// //   if (!resData) return [];
// //   const d = resData.data;
// //   if (Array.isArray(d)) return d.map(normOne).filter(Boolean);
// //   const one = normOne(d);
// //   return one ? [one] : [];
// // }

// // /* ================= API (safe populate) ================= */
// // async function listFamilies(): Promise<Family[]> {
// //   const qs =
// //     "pagination[pageSize]=200&sort=title:asc&fields[0]=title&fields[1]=slug";
// //   const res = await api().get(`/api/catalog-families?${qs}`);
// //   return normMany(res.data);
// // }

// // async function listTypesWithFamily(): Promise<
// //   Array<{
// //     id: number | string;
// //     title?: string;
// //     slug?: string;
// //     catalog_family?: any;
// //   }>
// // > {
// //   const qs = [
// //     "pagination[pageSize]=200",
// //     "sort=title:asc",
// //     "fields[0]=title",
// //     "fields[1]=slug",
// //     "populate[catalog_family][fields][0]=title",
// //     "populate[catalog_family][fields][1]=slug",
// //   ].join("&");
// //   const res = await api().get(`/api/catalog-types?${qs}`);
// //   return normMany(res.data);
// // }

// // async function listItemsForTypeIds(typeIds: Array<number | string>): Promise<
// //   Array<{
// //     id: number | string;
// //     label?: string;
// //     title?: string;
// //     slug?: string;
// //     catalog_type?: any;
// //   }>
// // > {
// //   if (!typeIds.length) return [];
// //   const idsCsv = typeIds.join(",");
// //   const qs = [
// //     "pagination[pageSize]=500",
// //     "sort=label:asc",
// //     `filters[catalog_type][id][$in]=${idsCsv}`,
// //     "populate[catalog_type][fields][0]=id",
// //     "fields[0]=label",
// //     "fields[1]=title",
// //     "fields[2]=slug",
// //   ].join("&");
// //   const res = await api().get(`/api/catalog-items?${qs}`);
// //   return normMany(res.data);
// // }

// // /* ================= Props ================= */
// // type MegaMenuProps = {
// //   isOpen: boolean;
// //   /** Pass a catalog-family slug (e.g. "cameras") to scope. */
// //   category: string;
// //   id?: string;
// //   onClose?: () => void;
// // };

// // /* ================= Component ================= */
// // export function MegaMenu({ isOpen, category, id, onClose }: MegaMenuProps) {
// //   const uid = useId();
// //   const wrapperRef = useRef<HTMLDivElement | null>(null);
// //   const firstFocusableRef = useRef<HTMLInputElement | null>(null);

// //   const [query, setQuery] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   // data
// //   const [families, setFamilies] = useState<Family[]>([]);
// //   const [types, setTypes] = useState<TypeRow[]>([]);
// //   const [items, setItems] = useState<ItemRow[]>([]);

// //   // selection
// //   const [selectedFamilySlug, setSelectedFamilySlug] = useState<string | null>(
// //     category || null
// //   );
// //   const [selectedTypeId, setSelectedTypeId] = useState<number | string | null>(
// //     null
// //   );

// //   // compose: types grouped into Columns (if you still need mobile accordions)
// //   const columns: Column[] = useMemo(() => {
// //     const byType = new Map<number | string, Column>();
// //     types.forEach((t) => {
// //       byType.set(t.id, {
// //         title: t.title,
// //         slug: t.slug,
// //         familyTitle: t.familyTitle,
// //         familySlug: t.familySlug,
// //         items: [],
// //       });
// //     });
// //     items.forEach((it) => {
// //       const col = byType.get(it.typeId);
// //       if (!col) return;
// //       col.items.push({ label: it.label, slug: it.slug });
// //     });
// //     const arr = Array.from(byType.values());
// //     arr.forEach((c) => c.items.sort((a, b) => a.label.localeCompare(b.label)));
// //     arr.sort((a, b) => a.title.localeCompare(b.title));
// //     return arr;
// //   }, [types, items]);

// //   // filtered lists for the right-side 2-column (types + items)
// //   const filteredTypes = useMemo(() => {
// //     const base = selectedFamilySlug
// //       ? types.filter((t) => t.familySlug === selectedFamilySlug)
// //       : types;
// //     if (!query.trim()) return base;
// //     const q = query.toLowerCase();
// //     return base.filter((t) => t.title.toLowerCase().includes(q));
// //   }, [types, selectedFamilySlug, query]);

// //   const filteredItems = useMemo(() => {
// //     const base = selectedTypeId
// //       ? items.filter((it) => it.typeId === selectedTypeId)
// //       : [];
// //     if (!query.trim()) return base;
// //     const q = query.toLowerCase();
// //     return base.filter((it) => it.label.toLowerCase().includes(q));
// //   }, [items, selectedTypeId, query]);

// //   // fetch + compose
// //   useEffect(() => {
// //     let mounted = true;
// //     (async () => {
// //       try {
// //         setLoading(true);

// //         const fams = await listFamilies();
// //         if (!mounted) return;
// //         setFamilies(fams);

// //         const typeRaw = await listTypesWithFamily();
// //         if (!mounted) return;

// //         // build TypeRow list (optionally filtered by category/family slug)
// //         const typeRows: TypeRow[] = typeRaw.map((t) => {
// //           const fam = t.catalog_family?.data
// //             ? normOne(t.catalog_family.data)
// //             : t.catalog_family;
// //           const familyTitle = fam?.title || "";
// //           const familySlug = fam?.slug || slugify(familyTitle);
// //           return {
// //             id: t.id,
// //             title: t.title || "",
// //             slug: t.slug || slugify(t.title || ""),
// //             familyTitle,
// //             familySlug,
// //           };
// //         });

// //         const scopedTypes = (
// //           category
// //             ? typeRows.filter(
// //                 (t) => t.familySlug.toLowerCase() === category.toLowerCase()
// //               )
// //             : typeRows
// //         ).sort((a, b) => a.title.localeCompare(b.title));

// //         setTypes(scopedTypes);

// //         // pick a default type to show items
// //         const defaultTypeId = scopedTypes[0]?.id ?? null;
// //         setSelectedTypeId(defaultTypeId);

// //         // fetch items for all scoped types (once)
// //         const typeIds = scopedTypes.map((t) => t.id);
// //         const itemRaw = await listItemsForTypeIds(typeIds);
// //         if (!mounted) return;

// //         const rows: ItemRow[] = itemRaw.map((it) => {
// //           const typ = it.catalog_type?.data
// //             ? normOne(it.catalog_type.data)
// //             : it.catalog_type;
// //           return {
// //             id: it.id,
// //             label: it.label || it.title || it.slug || "(item)",
// //             slug: it.slug || slugify(it.label || it.title || ""),
// //             typeId: typ?.id,
// //           };
// //         });
// //         setItems(rows);
// //       } catch (e: any) {
// //         console.error("[MegaMenu] load failed:", e);
// //       } finally {
// //         if (mounted) setLoading(false);
// //       }
// //     })();
// //     return () => {
// //       mounted = false;
// //     };
// //   }, [category]);

// //   // UI helpers
// //   const linkId = (href: string) => `mm-link-${uid}-${slugify(href)}`;

// //   /* Close on outside click */
// //   const wrapperRefObj = wrapperRef;
// //   useEffect(() => {
// //     if (!isOpen) return;
// //     const handleClick = (e: MouseEvent) => {
// //       if (
// //         wrapperRefObj.current &&
// //         !wrapperRefObj.current.contains(e.target as Node)
// //       ) {
// //         onClose?.();
// //       }
// //     };
// //     window.addEventListener("mousedown", handleClick);
// //     return () => window.removeEventListener("mousedown", handleClick);
// //   }, [isOpen, onClose, wrapperRefObj]);

// //   /* Autofocus search */
// //   useEffect(() => {
// //     if (!isOpen) return;
// //     const t = setTimeout(() => firstFocusableRef.current?.focus(), 50);
// //     return () => clearTimeout(t);
// //   }, [isOpen]);

// //   // Layout constants
// //   const HEADER_H = 56;
// //   const PANEL_VH_DESKTOP = 48;
// //   const PANEL_VH_MOBILE = 70;
// //   const ariaLabel = `${category || "catalog"} mega menu`;

// //   /* ================= Panel ================= */
// //   const panel = (
// //     <motion.section
// //       id={id}
// //       role="menu"
// //       aria-label={ariaLabel}
// //       initial="hidden"
// //       animate="visible"
// //       exit="exit"
// //       variants={containerVariants}
// //       className="fixed left-1/2 top-16 md:top-20 z-[65] -translate-x-1/2"
// //       style={{ width: "70vw", maxWidth: "1100px" }}
// //     >
// //       <div
// //         ref={wrapperRef}
// //         className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden"
// //         style={{
// //           ["--brand" as any]: BRAND,
// //           height: `clamp(${PANEL_VH_MOBILE}vh, 72vh, ${PANEL_VH_DESKTOP}vh)`,
// //         }}
// //       >
// //         {/* Header */}
// //         <div
// //           className="flex items-center justify-between gap-2 px-3 py-2"
// //           style={{ height: HEADER_H }}
// //         >
// //           <motion.div
// //             className="relative w-full max-w-[520px]"
// //             variants={searchFocusVariants}
// //             whileFocus="focus"
// //           >
// //             <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
// //             <input
// //               ref={firstFocusableRef}
// //               value={query}
// //               onChange={(e) => setQuery(e.target.value)}
// //               placeholder={`Search ${category || "catalog"} (types & items)…`}
// //               aria-label={`Search ${category || "catalog"}`}
// //               className="w-full rounded-lg border-0 bg-gray-50/80 pl-9 pr-3 py-2 text-sm outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-[var(--brand)]/20"
// //               style={{ ["--brand" as any]: BRAND }}
// //             />
// //           </motion.div>

// //           <motion.button
// //             whileHover={{ scale: 1.08 }}
// //             whileTap={{ scale: 0.94 }}
// //             onClick={onClose}
// //             aria-label="Close menu"
// //             className="rounded-lg p-2 transition-all duration-200 hover:bg-gray-50/80"
// //             style={{ color: BRAND }}
// //           >
// //             <X className="h-5 w-5" />
// //           </motion.button>
// //         </div>

// //         {/* Body */}
// //         <div
// //           className="h-full"
// //           style={{ height: `calc(100% - ${HEADER_H}px)` }}
// //         >
// //           {/* Mobile (accordions): Types → Items */}
// //           <div className="px-3 py-3 lg:hidden h-full overflow-y-auto">
// //             {loading ? (
// //               <div className="rounded-xl bg-white/85 p-6 text-center backdrop-blur-sm">
// //                 <Sparkles className="mx-auto h-7 w-7 text-gray-400 mb-2" />
// //                 <p className="text-sm text-gray-500">Loading…</p>
// //               </div>
// //             ) : (
// //               <>
// //                 {/* Types list */}
// //                 <div className="mb-3 rounded-xl border bg-white/85 backdrop-blur-sm">
// //                   <div className="flex items-center gap-2 bg-[var(--brand)]/5 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">
// //                     <Box className="h-3.5 w-3.5" />
// //                     Types
// //                   </div>
// //                   <ul className="max-h-[38vh] overflow-auto p-2 space-y-1">
// //                     {filteredTypes.map((t, idx) => {
// //                       const active = t.id === selectedTypeId;
// //                       return (
// //                         <motion.li
// //                           key={`t-${t.id}`}
// //                           custom={idx}
// //                           initial="hidden"
// //                           animate="visible"
// //                           exit="hidden"
// //                           variants={columnVariants}
// //                         >
// //                           <button
// //                             onClick={() => setSelectedTypeId(t.id)}
// //                             className={[
// //                               "w-full text-left rounded-lg px-2.5 py-2 text-[13px] transition-all duration-200",
// //                               active
// //                                 ? "bg-[var(--brand)]/10 text-[var(--brand)] shadow-sm"
// //                                 : "text-gray-700 hover:bg-gray-50/60",
// //                             ].join(" ")}
// //                             style={{ ["--brand" as any]: BRAND }}
// //                           >
// //                             {t.title}
// //                           </button>
// //                         </motion.li>
// //                       );
// //                     })}
// //                     {filteredTypes.length === 0 && (
// //                       <li className="px-2.5 py-2 text-sm text-gray-500">
// //                         No matching types.
// //                       </li>
// //                     )}
// //                   </ul>
// //                 </div>

// //                 {/* Items list */}
// //                 <div className="rounded-xl border bg-white/85 backdrop-blur-sm">
// //                   <div className="flex items-center gap-2 bg-[var(--brand)]/5 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">
// //                     <PanelLeft className="h-3.5 w-3.5" />
// //                     Items
// //                   </div>
// //                   <ul className="max-h-[38vh] overflow-auto p-2 space-y-1">
// //                     {filteredItems.map((it, idx) => {
// //                       const typeMeta = types.find(
// //                         (t) => t.id === selectedTypeId
// //                       );
// //                       if (!typeMeta) return null;
// //                       const href = `/${typeMeta.familySlug}/${typeMeta.slug}/${
// //                         it.slug
// //                       }?name=${encodeURIComponent(it.label)}`;
// //                       return (
// //                         <motion.li
// //                           key={`i-${it.id}`}
// //                           custom={idx}
// //                           initial="hidden"
// //                           animate="visible"
// //                           exit="hidden"
// //                           variants={columnVariants}
// //                         >
// //                           <motion.div
// //                             variants={itemHoverVariants}
// //                             whileHover="hover"
// //                             whileTap="tap"
// //                           >
// //                             <Link
// //                               href={href}
// //                               prefetch={false}
// //                               onClick={onClose}
// //                               className="block rounded-lg px-3 py-2 text-[13px] text-gray-700 transition-all duration-200 hover:bg-[var(--brand)]/5 hover:text-[var(--brand)]"
// //                               style={{ ["--brand" as any]: BRAND }}
// //                               dangerouslySetInnerHTML={{
// //                                 __html: highlight(it.label, query),
// //                               }}
// //                             />
// //                           </motion.div>
// //                         </motion.li>
// //                       );
// //                     })}
// //                     {filteredItems.length === 0 && (
// //                       <li className="px-2.5 py-2 text-sm text-gray-500">
// //                         No items for this type.
// //                       </li>
// //                     )}
// //                   </ul>
// //                 </div>
// //               </>
// //             )}
// //           </div>

// //           {/* Desktop 3-column: Left header bar, middle Types, right Items */}
// //           <div className="hidden lg:grid lg:grid-cols-[220px_300px_1fr] lg:gap-4 lg:px-4 lg:py-4 h-full">
// //             {/* Left rail: current family scope (readonly hint) */}
// //             <motion.aside
// //               className="h-full rounded-xl bg-white/85 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col"
// //               initial={{ x: -16, opacity: 0 }}
// //               animate={{ x: 0, opacity: 1 }}
// //               transition={{ duration: 0.22 }}
// //             >
// //               <div className="flex items-center gap-2 bg-[var(--brand)]/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--brand)]">
// //                 <PanelLeft className="h-3.5 w-3.5" />
// //                 {selectedFamilySlug || category || "catalog"}
// //               </div>
// //               <div className="p-3 text-sm text-gray-600">
// //                 Browse types, then pick an item.
// //               </div>
// //             </motion.aside>

// //             {/* Middle: TYPES list (catalog-type.title) */}
// //             <motion.section
// //               className="h-full rounded-xl bg-white/85 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col"
// //               initial={{ x: -8, opacity: 0 }}
// //               animate={{ x: 0, opacity: 1 }}
// //               transition={{ duration: 0.22 }}
// //             >
// //               <div className="bg-[var(--brand)]/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--brand)]">
// //                 Types
// //               </div>
// //               <ul className="flex-1 overflow-auto p-2 space-y-1">
// //                 {loading ? (
// //                   <li className="px-2.5 py-2 text-sm text-gray-500">
// //                     Loading…
// //                   </li>
// //                 ) : filteredTypes.length === 0 ? (
// //                   <li className="px-2.5 py-2 text-sm text-gray-500">
// //                     No matching types.
// //                   </li>
// //                 ) : (
// //                   filteredTypes.map((t, idx) => {
// //                     const active = t.id === selectedTypeId;
// //                     return (
// //                       <motion.li
// //                         key={`t-${t.id}`}
// //                         custom={idx}
// //                         initial="hidden"
// //                         animate="visible"
// //                         exit="hidden"
// //                         variants={columnVariants}
// //                       >
// //                         <button
// //                           onClick={() => setSelectedTypeId(t.id)}
// //                           className={[
// //                             "w-full text-left rounded-lg px-2.5 py-2 text-[13px] transition-all duration-200",
// //                             active
// //                               ? "bg-[var(--brand)]/10 text-[var(--brand)] shadow-sm"
// //                               : "text-gray-700 hover:bg-gray-50/60",
// //                           ].join(" ")}
// //                           style={{ ["--brand" as any]: BRAND }}
// //                         >
// //                           {t.title}
// //                         </button>
// //                       </motion.li>
// //                     );
// //                   })
// //                 )}
// //               </ul>
// //             </motion.section>

// //             {/* Right: ITEMS list (catalog-item.label) */}
// //             <motion.section
// //               className="h-full rounded-xl bg-white/85 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col"
// //               initial={{ x: 8, opacity: 0 }}
// //               animate={{ x: 0, opacity: 1 }}
// //               transition={{ duration: 0.22 }}
// //             >
// //               <div className="bg-[var(--brand)]/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--brand)]">
// //                 Items
// //               </div>
// //               <ul className="flex-1 overflow-auto p-3 space-y-1">
// //                 {loading ? (
// //                   <li className="px-2.5 py-2 text-sm text-gray-500">
// //                     Loading…
// //                   </li>
// //                 ) : filteredItems.length === 0 ? (
// //                   <li className="px-2.5 py-2 text-sm text-gray-500">
// //                     No items for this type.
// //                   </li>
// //                 ) : (
// //                   filteredItems.map((it, idx) => {
// //                     const t = types.find((t) => t.id === selectedTypeId);
// //                     if (!t) return null;
// //                     const href = `/${t.familySlug}/${t.slug}/${
// //                       it.slug
// //                     }?name=${encodeURIComponent(it.label)}`;
// //                     return (
// //                       <motion.li
// //                         key={`i-${it.id}`}
// //                         custom={idx}
// //                         initial="hidden"
// //                         animate="visible"
// //                         exit="hidden"
// //                         variants={columnVariants}
// //                       >
// //                         <motion.div
// //                           variants={itemHoverVariants}
// //                           whileHover="hover"
// //                           whileTap="tap"
// //                         >
// //                           <Link
// //                             id={linkId(href)}
// //                             href={href}
// //                             prefetch={false}
// //                             onClick={onClose}
// //                             className={[
// //                               "group flex items-center justify-between rounded-lg px-3 py-2 text-[13px] text-gray-700 transition-all duration-200",
// //                               "hover:bg-[var(--brand)]/5 hover:text-[var(--brand)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/20",
// //                             ].join(" ")}
// //                             style={{
// //                               ["--brand" as any]: BRAND,
// //                               outlineOffset: 2,
// //                             }}
// //                             dangerouslySetInnerHTML={{
// //                               __html: highlight(it.label, query),
// //                             }}
// //                           />
// //                         </motion.div>
// //                       </motion.li>
// //                     );
// //                   })
// //                 )}
// //               </ul>
// //             </motion.section>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Responsive width overrides */}
// //       <style jsx global>{`
// //         @media (max-width: 1023px) {
// //           [aria-label="${ariaLabel}"] {
// //             width: 92vw !important;
// //             min-width: 0 !important;
// //           }
// //         }
// //       `}</style>
// //     </motion.section>
// //   );

// //   return (
// //     <AnimatePresence>
// //       {isOpen && (
// //         <>
// //           {/* Backdrop */}
// //           <motion.div
// //             className="fixed inset-0 z-[60] bg-black/10"
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             exit={{ opacity: 0 }}
// //             aria-hidden="true"
// //             onClick={onClose}
// //             transition={{ duration: 0.18 }}
// //           />
// //           {panel}
// //         </>
// //       )}
// //     </AnimatePresence>
// //   );
// // }
// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useRef, useState, useId } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios, { AxiosInstance } from "axios";
// import {
//   Search as SearchIcon,
//   X,
//   PanelLeft,
//   Sparkles,
//   Box,
// } from "lucide-react";

// /* ================= Config & Axios ================= */
// const BRAND = "#07518a";
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// let _client: AxiosInstance | null = null;
// function api() {
//   if (!_client) {
//     _client = axios.create({ baseURL: API_URL });
//     _client.interceptors.response.use(
//       (r) => r,
//       (err) => {
//         const msg =
//           err?.response?.data?.error?.message ||
//           err?.response?.data?.message ||
//           err?.message ||
//           "Request failed";
//         return Promise.reject(
//           new Error(typeof msg === "string" ? msg : JSON.stringify(msg))
//         );
//       }
//     );
//   }
//   return _client;
// }

// /* ================= Helpers ================= */
// function slugify(text: string): string {
//   return (text || "")
//     .toLowerCase()
//     .normalize("NFKD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// }
// function highlight(text: string, q: string) {
//   if (!q.trim()) return text;
//   const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//   const re = new RegExp(`(${esc})`, "ig");
//   return text.replace(
//     re,
//     "<mark class='bg-yellow-200 rounded px-0.5'>$1</mark>"
//   );
// }

// /* ================= Motion variants ================= */
// const containerVariants = {
//   hidden: { opacity: 0, y: 8 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
//   },
//   exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
// };
// const columnVariants = {
//   hidden: { opacity: 0, y: 4, scale: 0.98 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { delay: i * 0.04, duration: 0.2, ease: [0.22, 1, 0.36, 1] },
//   }),
// };
// const itemHoverVariants = {
//   hover: { scale: 1.02, y: -1, transition: { duration: 0.12 } },
//   tap: { scale: 0.98, transition: { duration: 0.08 } },
// };
// const searchFocusVariants = {
//   focus: {
//     scale: 1.01,
//     boxShadow: "0 0 0 3px rgba(7, 81, 138, 0.1)",
//     transition: { duration: 0.18 },
//   },
// };

// /* ================= Types ================= */
// type Family = {
//   id: number | string;
//   title?: string;
//   slug?: string;
//   documentId?: string;
// };

// type TypeRow = {
//   id: number | string; // v4 id
//   documentId?: string; // v5 documentId (primary for REST path)
//   title: string;
//   slug: string;
//   familyTitle: string;
//   familySlug: string;
//   familyDocumentId?: string;
// };

// type ItemRow = {
//   id: number | string;
//   documentId?: string;
//   label: string; // <-- what you needed guaranteed
//   slug: string;
//   typeDocumentId?: string; // map to selected type (v5-safe)
//   typeId?: number | string; // v4 fallback (unused for filtering here)
// };

// /* ================= Normalizers (v4/v5) ================= */
// function normOne(raw: any) {
//   if (!raw) return null;
//   if (raw.attributes) {
//     const a = raw.attributes;
//     return {
//       id: raw.id,
//       documentId: raw.documentId || a.documentId,
//       ...a,
//     };
//   }
//   return raw;
// }
// function normMany(resData: any) {
//   if (!resData) return [];
//   const d = resData.data;
//   if (Array.isArray(d)) return d.map(normOne).filter(Boolean);
//   const one = normOne(d);
//   return one ? [one] : [];
// }

// /* ================= API ================= */
// // Families (light fields are fine)
// async function listFamilies(): Promise<Family[]> {
//   const qs = [
//     "pagination[pageSize]=200",
//     "sort=title:asc",
//     "fields[0]=title",
//     "fields[1]=slug",
//     "fields[2]=documentId",
//   ].join("&");
//   const res = await api().get(`/api/catalog-families?${qs}`);
//   return normMany(res.data);
// }

// // Types with their parent family (populate family only)
// async function listTypesWithFamily(): Promise<
//   Array<{
//     id: number | string;
//     documentId?: string;
//     title?: string;
//     slug?: string;
//     catalog_family?: any;
//   }>
// > {
//   const qs = [
//     "pagination[pageSize]=200",
//     "sort=title:asc",
//     "fields[0]=title",
//     "fields[1]=slug",
//     "fields[2]=documentId",
//     "populate[catalog_family][fields][0]=title",
//     "populate[catalog_family][fields][1]=slug",
//     "populate[catalog_family][fields][2]=documentId",
//   ].join("&");
//   const res = await api().get(`/api/catalog-types?${qs}`);
//   return normMany(res.data);
// }

// /**
//  * Items by Type(s)
//  * - First try Strapi v5: filter by relation documentId ($in).
//  * - If that fails (e.g. v4), fall back to filtering by relation numeric id ($in).
//  * - IMPORTANT: Do NOT use `fields[...]` for items so `label` is always returned.
//  */
// async function listItemsForTypes({
//   typeDocIds,
//   typeIds,
// }: {
//   typeDocIds: string[];
//   typeIds: Array<number | string>;
// }): Promise<
//   Array<{
//     id: number | string;
//     documentId?: string;
//     label?: string;
//     title?: string;
//     name?: string;
//     slug?: string;
//     catalog_type?: any;
//   }>
// > {
//   if (!typeDocIds.length && !typeIds.length) return [];

//   // Build a base that always includes populate to get the parent type.
//   const base = [
//     "pagination[pageSize]=500",
//     "sort=createdAt:asc",
//     "populate[catalog_type][fields][0]=documentId",
//     "populate[catalog_type][fields][1]=id",
//   ];

//   // Try v5 (documentId)
//   if (typeDocIds.length) {
//     try {
//       const qs = [
//         ...base,
//         `filters[catalog_type][documentId][$in]=${encodeURIComponent(
//           typeDocIds.join(",")
//         )}`,
//       ].join("&");
//       const res = await api().get(`/api/catalog-items?${qs}`);
//       return normMany(res.data);
//     } catch (e) {
//       // fall through to v4 attempt
//       // console.warn("v5 filter by documentId failed, trying v4 id", e);
//     }
//   }

//   // v4 fallback (id)
//   if (typeIds.length) {
//     const qs = [
//       ...base,
//       `filters[catalog_type][id][$in]=${typeIds.join(",")}`,
//     ].join("&");
//     const res = await api().get(`/api/catalog-items?${qs}`);
//     return normMany(res.data);
//   }

//   return [];
// }

// /* ================= Props ================= */
// type MegaMenuProps = {
//   isOpen: boolean;
//   /** Pass a catalog-family slug (e.g. "cameras") to scope. */
//   category: string;
//   id?: string;
//   onClose?: () => void;
// };

// /* ================= Component ================= */
// export function MegaMenu({ isOpen, category, id, onClose }: MegaMenuProps) {
//   const uid = useId();
//   const wrapperRef = useRef<HTMLDivElement | null>(null);
//   const firstFocusableRef = useRef<HTMLInputElement | null>(null);

//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);

//   // data
//   const [families, setFamilies] = useState<Family[]>([]);
//   const [types, setTypes] = useState<TypeRow[]>([]);
//   const [items, setItems] = useState<ItemRow[]>([]);

//   // selection
//   const [selectedFamilySlug, setSelectedFamilySlug] = useState<string | null>(
//     category || null
//   );
//   const [selectedTypeDocId, setSelectedTypeDocId] = useState<string | null>(
//     null
//   );

//   // fetch + compose
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setLoading(true);

//         // 1) Families (optional)
//         const fams = await listFamilies();
//         if (!mounted) return;
//         setFamilies(fams);

//         // 2) Types + family
//         const typeRaw = await listTypesWithFamily();
//         if (!mounted) return;

//         const typeRows: TypeRow[] = typeRaw.map((t) => {
//           const fam = t.catalog_family?.data
//             ? normOne(t.catalog_family.data)
//             : t.catalog_family;
//           const familyTitle = fam?.title || "";
//           const familySlug = fam?.slug || slugify(familyTitle);
//           const familyDocumentId = fam?.documentId;
//           return {
//             id: t.id,
//             documentId: t.documentId,
//             title: t.title || "",
//             slug: t.slug || slugify(t.title || ""),
//             familyTitle,
//             familySlug,
//             familyDocumentId,
//           };
//         });

//         const scopedTypes = (
//           category
//             ? typeRows.filter(
//                 (t) =>
//                   (t.familySlug || "").toLowerCase() === category.toLowerCase()
//               )
//             : typeRows
//         ).sort((a, b) => a.title.localeCompare(b.title));

//         setTypes(scopedTypes);

//         const defaultTypeDocId = scopedTypes[0]?.documentId ?? null;
//         setSelectedTypeDocId(defaultTypeDocId);

//         // 3) Items for all scoped types (try v5 docIds first, then v4 ids)
//         const typeDocIds = scopedTypes
//           .map((t) => t.documentId)
//           .filter(Boolean) as string[];
//         const typeIds = scopedTypes.map((t) => t.id);

//         const itemRaw = await listItemsForTypes({ typeDocIds, typeIds });
//         if (!mounted) return;

//         const rows: ItemRow[] = itemRaw.map((it) => {
//           const typ = it.catalog_type?.data
//             ? normOne(it.catalog_type.data)
//             : it.catalog_type;

//           // GUARANTEE a label value:
//           const label = it.label || it.title || it.name || it.slug || "(item)";

//           return {
//             id: it.id,
//             documentId: it.documentId,
//             label, // <-- we use this everywhere
//             slug: it.slug || slugify(label),
//             typeDocumentId: typ?.documentId,
//             typeId: typ?.id,
//           };
//         });
//         setItems(rows);
//       } catch (e: any) {
//         console.error("[MegaMenu] load failed:", e);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, [category]);

//   // FILTERED lists for the right-side 2 columns (types + items)
//   const filteredTypes = useMemo(() => {
//     const base = selectedFamilySlug
//       ? types.filter((t) => t.familySlug === selectedFamilySlug)
//       : types;
//     if (!query.trim()) return base;
//     const q = query.toLowerCase();
//     return base.filter((t) => t.title.toLowerCase().includes(q));
//   }, [types, selectedFamilySlug, query]);

//   const filteredItems = useMemo(() => {
//     const base = selectedTypeDocId
//       ? items.filter((it) => it.typeDocumentId === selectedTypeDocId)
//       : [];
//     if (!query.trim()) return base;
//     const q = query.toLowerCase();
//     return base.filter((it) => it.label.toLowerCase().includes(q));
//   }, [items, selectedTypeDocId, query]);

//   // UI helpers
//   const linkId = (href: string) => `mm-link-${uid}-${slugify(href)}`;

//   /* Close on outside click */
//   useEffect(() => {
//     if (!isOpen) return;
//     function handleClick(e: MouseEvent) {
//       if (
//         wrapperRef.current &&
//         !wrapperRef.current.contains(e.target as Node)
//       ) {
//         onClose?.();
//       }
//     }
//     window.addEventListener("mousedown", handleClick);
//     return () => window.removeEventListener("mousedown", handleClick);
//   }, [isOpen, onClose]);

//   /* Autofocus search */
//   useEffect(() => {
//     if (!isOpen) return;
//     const t = setTimeout(() => firstFocusableRef.current?.focus(), 50);
//     return () => clearTimeout(t);
//   }, [isOpen]);

//   // Layout constants
//   const HEADER_H = 56;
//   const PANEL_VH_DESKTOP = 48;
//   const PANEL_VH_MOBILE = 70;
//   const ariaLabel = `${category || "catalog"} mega menu`;

//   /* ================= Panel ================= */
//   const panel = (
//     <motion.section
//       id={id}
//       role="menu"
//       aria-label={ariaLabel}
//       initial="hidden"
//       animate="visible"
//       exit="exit"
//       variants={containerVariants}
//       className="fixed left-1/2 top-16 md:top-20 z-[65] -translate-x-1/2"
//       style={{ width: "70vw", maxWidth: "1100px" }}
//     >
//       <div
//         ref={wrapperRef}
//         className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden"
//         style={{
//           ["--brand" as any]: BRAND,
//           height: `clamp(${PANEL_VH_MOBILE}vh, 72vh, ${PANEL_VH_DESKTOP}vh)`,
//         }}
//       >
//         {/* Header */}
//         <div
//           className="flex items-center justify-between gap-2 px-3 py-2"
//           style={{ height: HEADER_H }}
//         >
//           <motion.div
//             className="relative w-full max-w-[520px]"
//             variants={searchFocusVariants}
//             whileFocus="focus"
//           >
//             <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             <input
//               ref={firstFocusableRef}
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder={`Search ${category || "catalog"} (types & items)…`}
//               aria-label={`Search ${category || "catalog"}`}
//               className="w-full rounded-lg border-0 bg-gray-50/80 pl-9 pr-3 py-2 text-sm outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-[var(--brand)]/20"
//               style={{ ["--brand" as any]: BRAND }}
//             />
//           </motion.div>

//           <motion.button
//             whileHover={{ scale: 1.08 }}
//             whileTap={{ scale: 0.94 }}
//             onClick={onClose}
//             aria-label="Close menu"
//             className="rounded-lg p-2 transition-all duration-200 hover:bg-gray-50/80"
//             style={{ color: BRAND }}
//           >
//             <X className="h-5 w-5" />
//           </motion.button>
//         </div>

//         {/* Body */}
//         <div
//           className="h-full"
//           style={{ height: `calc(100% - ${HEADER_H}px)` }}
//         >
//           {/* Mobile: stack types then items */}
//           <div className="px-3 py-3 lg:hidden h-full overflow-y-auto">
//             {/* Types */}
//             <div className="mb-3 rounded-xl border bg-white/85 backdrop-blur-sm">
//               <div className="flex items-center gap-2 bg-[var(--brand)]/5 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">
//                 <Box className="h-3.5 w-3.5" />
//                 Types
//               </div>
//               <ul className="max-h-[38vh] overflow-auto p-2 space-y-1">
//                 {filteredTypes.map((t, idx) => {
//                   const active =
//                     t.documentId && t.documentId === selectedTypeDocId;
//                   return (
//                     <motion.li
//                       key={`t-${t.documentId || t.id}`}
//                       custom={idx}
//                       initial="hidden"
//                       animate="visible"
//                       exit="hidden"
//                       variants={columnVariants}
//                     >
//                       <button
//                         onClick={() =>
//                           setSelectedTypeDocId(t.documentId || null)
//                         }
//                         className={[
//                           "w-full text-left rounded-lg px-2.5 py-2 text-[13px] transition-all duration-200",
//                           active
//                             ? "bg-[var(--brand)]/10 text-[var(--brand)] shadow-sm"
//                             : "text-gray-700 hover:bg-gray-50/60",
//                         ].join(" ")}
//                         style={{ ["--brand" as any]: BRAND }}
//                       >
//                         {t.title}
//                       </button>
//                     </motion.li>
//                   );
//                 })}
//                 {filteredTypes.length === 0 && (
//                   <li className="px-2.5 py-2 text-sm text-gray-500">
//                     No matching types.
//                   </li>
//                 )}
//               </ul>
//             </div>

//             {/* Items */}
//             <div className="rounded-xl border bg-white/85 backdrop-blur-sm">
//               <div className="flex items-center gap-2 bg-[var(--brand)]/5 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">
//                 <PanelLeft className="h-3.5 w-3.5" />
//                 Items
//               </div>
//               <ul className="max-h-[38vh] overflow-auto p-2 space-y-1">
//                 {filteredItems.map((it, idx) => {
//                   const t = types.find(
//                     (x) => x.documentId === selectedTypeDocId
//                   );
//                   if (!t) return null;
//                   const href = `/${t.familySlug}/${t.slug}/${
//                     it.slug
//                   }?name=${encodeURIComponent(it.label)}`;
//                   return (
//                     <motion.li
//                       key={`i-${it.documentId || it.id}`}
//                       custom={idx}
//                       initial="hidden"
//                       animate="visible"
//                       exit="hidden"
//                       variants={columnVariants}
//                     >
//                       <motion.div
//                         variants={itemHoverVariants}
//                         whileHover="hover"
//                         whileTap="tap"
//                       >
//                         <Link
//                           href={href}
//                           prefetch={false}
//                           onClick={onClose}
//                           className="block rounded-lg px-3 py-2 text-[13px] text-gray-700 transition-all duration-200 hover:bg-[var(--brand)]/5 hover:text-[var(--brand)]"
//                           style={{ ["--brand" as any]: BRAND }}
//                           dangerouslySetInnerHTML={{
//                             __html: highlight(it.label, query),
//                           }}
//                         />
//                       </motion.div>
//                     </motion.li>
//                   );
//                 })}
//                 {filteredItems.length === 0 && (
//                   <li className="px-2.5 py-2 text-sm text-gray-500">
//                     No items for this type.
//                   </li>
//                 )}
//               </ul>
//             </div>
//           </div>

//           {/* Desktop: left hint / middle types / right items */}
//           <div className="hidden lg:grid lg:grid-cols-[220px_300px_1fr] lg:gap-4 lg:px-4 lg:py-4 h-full">
//             {/* Left hint */}
//             <motion.aside
//               className="h-full rounded-xl bg-white/85 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col"
//               initial={{ x: -16, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.22 }}
//             >
//               <div className="flex items-center gap-2 bg-[var(--brand)]/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--brand)]">
//                 <PanelLeft className="h-3.5 w-3.5" />
//                 {selectedFamilySlug || category || "catalog"}
//               </div>
//               <div className="p-3 text-sm text-gray-600">
//                 Pick a type, then choose an item.
//               </div>
//             </motion.aside>

//             {/* Types */}
//             <motion.section
//               className="h-full rounded-xl bg-white/85 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col"
//               initial={{ x: -8, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.22 }}
//             >
//               <div className="bg-[var(--brand)]/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--brand)]">
//                 Types
//               </div>
//               <ul className="flex-1 overflow-auto p-2 space-y-1">
//                 {loading ? (
//                   <li className="px-2.5 py-2 text-sm text-gray-500">
//                     Loading…
//                   </li>
//                 ) : filteredTypes.length === 0 ? (
//                   <li className="px-2.5 py-2 text-sm text-gray-500">
//                     No matching types.
//                   </li>
//                 ) : (
//                   filteredTypes.map((t, idx) => {
//                     const active =
//                       t.documentId && t.documentId === selectedTypeDocId;
//                     return (
//                       <motion.li
//                         key={`t-${t.documentId || t.id}`}
//                         custom={idx}
//                         initial="hidden"
//                         animate="visible"
//                         exit="hidden"
//                         variants={columnVariants}
//                       >
//                         <button
//                           onClick={() =>
//                             setSelectedTypeDocId(t.documentId || null)
//                           }
//                           className={[
//                             "w-full text-left rounded-lg px-2.5 py-2 text-[13px] transition-all duration-200",
//                             active
//                               ? "bg-[var(--brand)]/10 text-[var(--brand)] shadow-sm"
//                               : "text-gray-700 hover:bg-gray-50/60",
//                           ].join(" ")}
//                           style={{ ["--brand" as any]: BRAND }}
//                         >
//                           {t.title}
//                         </button>
//                       </motion.li>
//                     );
//                   })
//                 )}
//               </ul>
//             </motion.section>

//             {/* Items */}
//             <motion.section
//               className="h-full rounded-xl bg-white/85 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col"
//               initial={{ x: 8, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.22 }}
//             >
//               <div className="bg-[var(--brand)]/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--brand)]">
//                 Items
//               </div>
//               <ul className="flex-1 overflow-auto p-3 space-y-1">
//                 {loading ? (
//                   <li className="px-2.5 py-2 text-sm text-gray-500">
//                     Loading…
//                   </li>
//                 ) : filteredItems.length === 0 ? (
//                   <li className="px-2.5 py-2 text-sm text-gray-500">
//                     No items for this type.
//                   </li>
//                 ) : (
//                   filteredItems.map((it, idx) => {
//                     const t = types.find(
//                       (x) => x.documentId === selectedTypeDocId
//                     );
//                     if (!t) return null;
//                     const href = `/${t.familySlug}/${t.slug}/${
//                       it.slug
//                     }?name=${encodeURIComponent(it.label)}`;
//                     return (
//                       <motion.li
//                         key={`i-${it.documentId || it.id}`}
//                         custom={idx}
//                         initial="hidden"
//                         animate="visible"
//                         exit="hidden"
//                         variants={columnVariants}
//                       >
//                         <motion.div
//                           variants={itemHoverVariants}
//                           whileHover="hover"
//                           whileTap="tap"
//                         >
//                           <Link
//                             id={linkId(href)}
//                             href={href}
//                             prefetch={false}
//                             onClick={onClose}
//                             className={[
//                               "group flex items-center justify-between rounded-lg px-3 py-2 text-[13px] text-gray-700 transition-all duration-200",
//                               "hover:bg-[var(--brand)]/5 hover:text-[var(--brand)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/20",
//                             ].join(" ")}
//                             style={{
//                               ["--brand" as any]: BRAND,
//                               outlineOffset: 2,
//                             }}
//                             dangerouslySetInnerHTML={{
//                               __html: highlight(it.label, query),
//                             }}
//                           />
//                         </motion.div>
//                       </motion.li>
//                     );
//                   })
//                 )}
//               </ul>
//             </motion.section>
//           </div>
//         </div>
//       </div>

//       {/* Responsive width overrides */}
//       <style jsx global>{`
//         @media (max-width: 1023px) {
//           [aria-label="${ariaLabel}"] {
//             width: 92vw !important;
//             min-width: 0 !important;
//           }
//         }
//       `}</style>
//     </motion.section>
//   );

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             className="fixed inset-0 z-[60] bg-black/10"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             aria-hidden="true"
//             onClick={onClose}
//             transition={{ duration: 0.18 }}
//           />
//           {panel}
//         </>
//       )}
//     </AnimatePresence>
//   );
// }
