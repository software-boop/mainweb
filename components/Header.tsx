"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Button } from "./Button";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search as SearchIcon,
  MessageCircle,
} from "lucide-react";
import { MegaMenu } from "./mega-menu";

/* =============================
   Config & Types
   ============================= */
const BRAND = "#07518a";
const BRAND_TINT = "#0a6ab8";

// logos in /public
const WHITE_LOGO = "/highbtlogo white- tm.png";
const BLUE_LOGO = "/highbtlogo tm (1).png";

const TOUCH_HIT = "min-h-[44px] min-w-[44px]";

const KEY = {
  ESC: "Escape",
  ENTER: "Enter",
  SPACE: " ",
  ARROW_DOWN: "ArrowDown",
  ARROW_UP: "ArrowUp",
} as const;

type SubItem = { label: string; href: string };
type MenuItem = {
  name: string;
  label: string;
  href: string;
  submenu?: SubItem[];
  hasMegaMenu?: boolean;
};

const menuItems: MenuItem[] = [
  { name: "home", label: "Home", href: "/" },
  { name: "products", label: "Products", href: "/products", hasMegaMenu: true },
  {
    name: "solutions",
    label: "Solutions",
    href: "/solutions",
    submenu: [
      { label: "Video Analytics", href: "/solutions/video-analytics" },
      { label: "Access Control", href: "/solutions/access-control" },
      { label: "Smart Retail", href: "/solutions/smart-retail" },
      { label: "Smart Bus", href: "/solutions/smart-bus" },
    ],
  },
  { name: "services", label: "Services", href: "/services", hasMegaMenu: true },

  // About with hover submenu
  {
    name: "about",
    label: "About",
    href: "/about",
    submenu: [
      { label: "Who we are", href: "/about/who-we-are" },
      { label: "Our story", href: "/about/our-story" },
      { label: "Our-Managing Director", href: "/about/founder" },
      { label: "Board of Directors", href: "/about/boardofdirectors" },
      { label: "our team", href: "/about/ourteam" },
      { label: "Careers", href: "/about/careers" },
    ],
  },

  {
    name: "Resources",
    label: "Resources",
    href: "/",
    submenu: [
      { label: "News", href: "/Resources/news" },
      { label: "Events", href: "/Resources/events" },
      { label: "Awards", href: "/Resources/awards" },
      { label: "Casestudies", href: "/Resources/casestudies" },
    ],
  },
  { name: "contact", label: "Contact", href: "/contact" },
];

/* =============================
   Utilities
   ============================= */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useTopProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  const progressOpacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);
  return { scaleX, progressOpacity };
}

/* =============================
   Search Modal
   ============================= */
function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === KEY.ESC) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;
    const focusable = container.querySelectorAll<HTMLElement>(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        (last || first)?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        (first || last)?.focus();
      }
    };
    container.addEventListener("keydown", onKey as any);
    return () => container.removeEventListener("keydown", onKey as any);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed left-1/2 top-20 z-[90] w-[min(720px,92vw)] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center gap-3">
              <SearchIcon className="h-5 w-5 text-gray-500" />
              <input
                ref={inputRef}
                placeholder="Search products, solutions, or docs…"
                className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
              />
              <Button
                variant="secondary"
                onClick={onClose}
                className={TOUCH_HIT}
              >
                Close
              </Button>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Try: “face recognition attendance” or “smart bus camera”
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* =============================
   Header (Hover-stable mega-menu)
   ============================= */
const Header: React.FC = () => {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<Record<string, boolean>>(
    {}
  );

  // NEW: hover-stability controller
  const closeTimerRef = useRef<number | null>(null);
  const navRegionRef = useRef<HTMLDivElement | null>(null);

  const scheduleClose = useCallback((delay = 120) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, delay) as unknown as number;
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openDropdown = useCallback(
    (name: string) => {
      cancelClose();
      setActiveDropdown(name);
    },
    [cancelClose]
  );

  const { scaleX, progressOpacity } = useTopProgress();

  const activeSection = useMemo(() => {
    const found =
      menuItems.find((m) => m.href !== "/" && pathname?.startsWith(m.href)) ??
      menuItems.find((m) => m.href === pathname) ??
      menuItems[0];
    return found?.name;
  }, [pathname]);

  // cross-fade bg on scroll
  const [bgProgress, setBgProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / 140));
      setBgProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onDark = bgProgress < 0.45;

  const linkClass = useCallback(
    (isActive: boolean) =>
      cn(
        "relative flex items-center  px-3 2xl:px-4 py-2 text-[0.95rem] font-medium transition-colors",
        onDark
          ? isActive
            ? "text-white"
            : "text-white/90 hover:text-white"
          : isActive
          ? "text-[var(--brand)]"
          : "text-gray-700 hover:text-[var(--brand)] hover:underline decoration-[var(--brand)] underline-offset-8 decoration-2"
      ),
    [onDark]
  );

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === KEY.ESC) setActiveDropdown(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onTopItemKeyDown = (e: React.KeyboardEvent, item: MenuItem) => {
    if (
      e.key === KEY.ENTER ||
      e.key === KEY.SPACE ||
      e.key === KEY.ARROW_DOWN
    ) {
      if (item.submenu || item.hasMegaMenu) {
        e.preventDefault();
        openDropdown(item.name);
      }
    }
    if (e.key === KEY.ESC) setActiveDropdown(null);
  };

  return (
    <>
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded focus:bg-black focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Page progress */}
      <motion.div
        aria-hidden
        style={{ scaleX, opacity: progressOpacity, backgroundColor: BRAND }}
        className="fixed left-0 top-0 z-[70] h-1 w-full origin-left pointer-events-none"
      />

      {/* Header */}
      <motion.nav
        initial={prefersReducedMotion ? false : { y: -100 }}
        animate={prefersReducedMotion ? undefined : { y: 0 }}
        className="fixed top-0 w-full z-[60] h-20 "
        style={{}}
      >
        {/* gradient → white cross-fade */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, ${BRAND_TINT} 0%, ${BRAND} 100%)`,
              opacity: 1 - bgProgress,
              transition: "opacity 200ms linear",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(255,255,255,0.96)",
              opacity: bgProgress,
              transition: "opacity 200ms linear",
            }}
          />
        </div>

        <div className="mx-auto max-w-[120rem] px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex h-14 md:h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
              className="flex items-center"
            >
              <Link
                href="/"
                className="flex items-center"
                aria-label="Home"
                prefetch={false}
              >
                <Image
                  src={onDark ? WHITE_LOGO : BLUE_LOGO}
                  alt="HighBT Logo"
                  width={220}
                  height={50}
                  priority
                  className="h-8 w-auto md:h-10"
                />
              </Link>
            </motion.div>

            {/* Desktop nav */}
            <div
              ref={navRegionRef}
              className="hidden items-center gap-0.5 lg:flex"
              onMouseEnter={cancelClose}
              onMouseLeave={() => scheduleClose(150)}
            >
              {menuItems.map((item) => {
                const isActive = activeSection === item.name;
                const hasDropdown = !!(item.submenu || item.hasMegaMenu);

                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() =>
                      hasDropdown
                        ? openDropdown(item.name)
                        : setActiveDropdown(null)
                    }
                    // NOTE: do NOT close on item mouse leave; close is controlled by region leave
                    onFocus={() => hasDropdown && openDropdown(item.name)}
                  >
                    <Link
                      href={item.href}
                      className={cn("group", linkClass(isActive))}
                      style={{ ["--brand" as any]: BRAND }}
                      prefetch={false}
                      onKeyDown={(e) => onTopItemKeyDown(e, item)}
                      aria-haspopup={hasDropdown ? "menu" : undefined}
                      aria-expanded={activeDropdown === item.name}
                      aria-controls={
                        hasDropdown ? `${item.name}-menu` : undefined
                      }
                    >
                      <span>{item.label}</span>
                      {hasDropdown && (
                        <ChevronDown
                          className={cn(
                            "ml-0.5 h-3.5 w-3.5 transition-transform duration-300",
                            activeDropdown === item.name && "rotate-180"
                          )}
                          style={{ color: onDark ? "#fff" : undefined }}
                          aria-hidden
                        />
                      )}
                      {!onDark && isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-0.5 left-0 right-0 h-0.5"
                          style={{ backgroundColor: BRAND }}
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                          aria-hidden
                        />
                      )}
                    </Link>

                    {/* MegaMenu */}
                    {item.hasMegaMenu && (
                      <div
                        onMouseEnter={cancelClose}
                        onMouseLeave={() => scheduleClose(150)}
                        className="absolute left-1/2 z-[65] w-[min(1200px,100vw)] -translate-x-1/2 mt-0  top-0"
                      >
                        <MegaMenu
                          isOpen={activeDropdown === item.name}
                          category={item.name as "products" | "services"}
                          id={`${item.name}-menu`}
                        />
                      </div>
                    )}

                    {/* Simple dropdown (Solutions/About/Resources) */}
                    <AnimatePresence>
                      {item.submenu && activeDropdown === item.name && (
                        <motion.div
                          id={`${item.name}-menu`}
                          role="menu"
                          aria-label={`${item.label} submenu`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-full z-[65] mt-1 w-64 rounded-md bg-white py-2 shadow-lg"
                          onMouseEnter={cancelClose}
                          onMouseLeave={() => scheduleClose(150)}
                        >
                          {item.submenu.map((sub, idx) => (
                            <motion.div
                              key={sub.href}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <Link
                                href={sub.href}
                                role="menuitem"
                                className={cn(
                                  "block px-4 py-2 text-sm hover:bg-gray-50",
                                  idx === 0
                                    ? "font-semibold text-gray-900"
                                    : "text-gray-700"
                                )}
                                prefetch={false}
                              >
                                {sub.label}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Actions (desktop) */}
            <div className="hidden items-center gap-2 lg:flex">
              <motion.button
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className={cn("rounded-lg p-2 transition-colors", TOUCH_HIT)}
                aria-label="Open search"
                style={{
                  color: onDark ? "rgba(255,255,255,0.95)" : "#374151",
                  backgroundColor: onDark
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                  border: onDark
                    ? "1px solid rgba(255,255,255,0.35)"
                    : "1px solid transparent",
                }}
              >
                <SearchIcon className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Mobile buttons */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
                className={cn("rounded-md p-2", TOUCH_HIT)}
                style={{
                  color: onDark ? "rgba(255,255,255,0.95)" : "#374151",
                  backgroundColor: onDark
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                }}
              >
                <SearchIcon className="h-6 w-6" />
              </button>
              <motion.button
                whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
                className={cn("rounded-md p-2", TOUCH_HIT)}
                style={{
                  color: onDark ? "rgba(255,255,255,0.95)" : "#374151",
                  backgroundColor: onDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(243,244,246,1)",
                }}
                onClick={() => setIsMenuOpen((s) => !s)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-drawer"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-[55] bg-black/40 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden
              />
              <motion.section
                id="mobile-drawer"
                className="fixed left-0 right-0 top-0 z-[60] lg:hidden"
                initial={{ y: -24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              >
                <div className="mx-auto w-full max-w-screen-sm overflow-hidden rounded-b-2xl bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <span className="text-base font-semibold text-gray-900">
                      Menu
                    </span>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      aria-label="Close menu"
                      className="rounded-md p-2 hover:bg-gray-100 min-h-[44px] min-w-[44px]"
                    >
                      <X className="h-6 w-6 text-gray-700" />
                    </button>
                  </div>

                  <nav className="max-h-[85vh] overflow-y-auto px-2 py-3">
                    {menuItems.map((item, index) => {
                      const expandable = !!(item.submenu || item.hasMegaMenu);
                      const open = !!expandedMobile[item.name];

                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="px-1"
                        >
                          <div className="flex items-stretch">
                            <Link
                              href={item.href}
                              className="flex-1 rounded-md px-3 py-3 text-[0.98rem] font-medium text-gray-900 hover:bg-gray-50"
                              onClick={() => setIsMenuOpen(false)}
                              prefetch={false}
                            >
                              {item.label}
                            </Link>

                            {expandable && (
                              <button
                                aria-label={`Toggle ${item.label} submenu`}
                                className="ml-1 rounded-md px-2 text-gray-700 hover:bg-gray-100 min-h-[44px] min-w-[44px]"
                                onClick={() =>
                                  setExpandedMobile((p) => ({
                                    ...p,
                                    [item.name]: !p[item.name],
                                  }))
                                }
                                aria-expanded={open}
                                aria-controls={`${item.name}-mobile-sub`}
                              >
                                <ChevronRight
                                  className={`h-5 w-5 transition-transform ${
                                    open ? "rotate-90" : ""
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          <AnimatePresence initial={false}>
                            {expandable && open && (
                              <motion.div
                                id={`${item.name}-mobile-sub`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                className="ml-2 mt-1 space-y-1 border-l-2 border-gray-100 pl-3"
                              >
                                {item.submenu ? (
                                  item.submenu.map((sub, idx) => (
                                    <Link
                                      key={sub.href}
                                      href={sub.href}
                                      className={cn(
                                        "block rounded-md px-3 py-2 text-sm hover:bg-gray-50",
                                        idx === 0
                                          ? "font-semibold text-gray-900"
                                          : "text-gray-700"
                                      )}
                                      onClick={() => setIsMenuOpen(false)}
                                      prefetch={false}
                                    >
                                      {sub.label}
                                    </Link>
                                  ))
                                ) : (
                                  <Link
                                    href={item.href}
                                    className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                    prefetch={false}
                                  >
                                    Explore {item.label}
                                  </Link>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </nav>
                </div>
              </motion.section>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Modal */}
      <SearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Spacer under fixed header */}
      <div aria-hidden className="h-14 md:h-16" />
    </>
  );
};

export default Header;
