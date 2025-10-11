// components/Preloader.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  Variants,
} from "framer-motion";

/* ===================== Types ===================== */
type Slide =
  | { type: "text"; content: string }
  | {
      type: "image";
      src: string;
      alt?: string;
      width?: number;
      height?: number;
    };

export interface PreloaderProps {
  onComplete?: () => void;
  /** Tailwind classes for the background */
  backgroundClassName?: string;
  /** SVG curve fill color */
  curveFill?: string;
  /** Slides to show; if omitted, defaults below */
  slides?: Slide[];
  /** First delay before advancing (ms) */
  firstDelayMs?: number;
  /** Delay between subsequent slides (ms) */
  stepDelayMs?: number;

  /** kept for compatibility; ignored since loader/progress are removed */
  showProgress?: boolean;
  brandHex?: string;
  showOrbitalLoader?: boolean;
  loaderMessage?: string;
  loaderMessagePlacement?: "top" | "bottom" | "left" | "right";
  loaderSizePx?: number;
}

/** Default slides (replace with your own if you pass `slides` prop) */
const DEFAULT_SLIDES: Slide[] = [
  { type: "text", content: "Global Footprint: India | USA | Dubai" },
  {
    type: "image",
    src: "/highbtlogo-white-tm.png",
    alt: "Brihaspathi Logo",
    width: 280,
    height: 80,
  },
];

/* ===================== Motion variants ===================== */
const slideFadeScale: Variants = {
  initial: { opacity: 0, scale: 0.985, y: 8 },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.985,
    y: -8,
    transition: { duration: 0.36, ease: [0.4, 0, 1, 1] },
  },
};

const opacityOnce: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.7, delay: 0.12 } },
};

const slideUp: Variants = {
  initial: { top: 0 },
  exit: {
    // use -100svh where supported (mobile-safe), fallback to -100vh is fine
    top: "-100vh",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
  },
};

/* Word-by-word reveal for text slides */
const wordsParent: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.04,
    },
  },
};
const wordChild: Variants = {
  hidden: { y: 10, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ===================== Helpers ===================== */
function clsx(...parts: Array<string | false | undefined | null>): string {
  return parts.filter(Boolean).join(" ");
}

/* ===================== Component ===================== */
export default function Preloader({
  onComplete,
  backgroundClassName = "bg-[#04060a]",
  curveFill = "#07518a",
  slides = DEFAULT_SLIDES,
  firstDelayMs = 900,
  stepDelayMs = 260,

  // ignored legacy props
  showProgress,
  brandHex,
  showOrbitalLoader,
  loaderMessage,
  loaderMessagePlacement,
  loaderSizePx,
}: PreloaderProps) {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Spotlight
  const hostRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState<{ xPct: number; yPct: number }>({
    xPct: 50,
    yPct: 50,
  });

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = el.getBoundingClientRect();
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      setSpot({
        xPct: Math.max(0, Math.min(100, x)),
        yPct: Math.max(0, Math.min(100, y)),
      });
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchmove", onMove);
    };
  }, []);

  // Dimensions (tablet & medium laptop handled via clamp + breakpoints below)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const setDims = () =>
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    setDims();
    const onResize = () => window.requestAnimationFrame(setDims);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Autoplay slides then exit
  useEffect(() => {
    if (index === slides.length - 1) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        const doneTimer = setTimeout(() => onComplete?.(), 900);
        return () => clearTimeout(doneTimer);
      }, Math.max(stepDelayMs, 480));
      return () => clearTimeout(exitTimer);
    }
    const delay = index === 0 ? firstDelayMs : stepDelayMs;
    const stepTimer = setTimeout(() => setIndex((i) => i + 1), delay);
    return () => clearTimeout(stepTimer);
  }, [index, slides.length, firstDelayMs, stepDelayMs, onComplete]);

  // SVG curve
  const initialPath = useMemo(() => {
    const { width, height } = dimension;
    return `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${
      height + 300
    } 0 ${height} L0 0`;
  }, [dimension]);

  const targetPath = useMemo(() => {
    const { width, height } = dimension;
    return `M0 0 L${width} 0 L${width} ${height} Q${
      width / 2
    } ${height} 0 ${height} L0 0`;
  }, [dimension]);

  const curve: Variants = {
    initial: {
      d: initialPath,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  const current = slides[index];

  // Interactive spotlight
  const spotlightStyle: React.CSSProperties = {
    background: `radial-gradient(520px at ${spot.xPct}% ${spot.yPct}%, rgba(255,255,255,0.10), transparent 60%)`,
    pointerEvents: "none",
  };

  return (
    <motion.div
      ref={hostRef}
      role="status"
      aria-live="polite"
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      className={clsx(
        // responsive paddings for safe areas and better tablet/laptop look
        "fixed inset-0 z-[99999999999] flex min-h-svh w-screen items-center justify-center select-none",
        "px-4 sm:px-6 md:px-8",
        "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
        backgroundClassName
      )}
    >
      {/* Spotlight layer */}
      <div
        className="absolute inset-0 will-change-transform"
        style={spotlightStyle}
        aria-hidden="true"
      />

      {/* soft gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          background:
            "radial-gradient(60% 60% at 10% 10%, #1e293b 0%, transparent 60%), radial-gradient(60% 60% at 90% 20%, #0b3a63 0%, transparent 60%), radial-gradient(50% 50% at 50% 80%, #0a2240 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      {dimension.width > 0 && (
        <>
          {/* Content center with responsive max widths for tablet & medium laptops */}
          <motion.div
            variants={opacityOnce}
            initial="initial"
            animate={prefersReducedMotion ? "initial" : "enter"}
            className="
              absolute z-10 flex flex-col items-center justify-center
              text-center
              w-full
            "
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                variants={prefersReducedMotion ? {} : slideFadeScale}
                initial="initial"
                animate={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0, scale: 1 }
                    : "enter"
                }
                exit={prefersReducedMotion ? { opacity: 0 } : "exit"}
                className="flex flex-col items-center justify-center"
              >
                {/* Plain text (no dot) OR image */}
                {current.type === "text" ? (
                  <motion.h1
                    variants={prefersReducedMotion ? {} : wordsParent}
                    initial={prefersReducedMotion ? undefined : "hidden"}
                    animate={prefersReducedMotion ? undefined : "show"}
                    className={clsx(
                      // fluid, breakpoint-tuned font sizes (tablet & medium laptop friendly)
                      "text-white/95 font-semibold tracking-tight leading-[1.12]",
                      // Base (mobile)
                      "text-[clamp(1.4rem,6vw,2.2rem)]",
                      // Tablet (sm/md)
                      "sm:text-[clamp(1.6rem,5vw,2.6rem)]",
                      "md:text-[clamp(1.8rem,3.8vw,3.0rem)]",
                      // Medium laptop (lg)
                      "lg:text-[clamp(2.0rem,3vw,3.4rem)]",
                      // Large / XL
                      "xl:text-[clamp(2.2rem,2.6vw,3.8rem)] 2xl:text-[clamp(2.4rem,2.2vw,4.2rem)]",
                      // widths tuned per breakpoint to keep line-length readable
                      "max-w-[90vw] sm:max-w-[82vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[52vw]"
                    )}
                    aria-label={current.content}
                  >
                    {current.content.split(/\s+/).map((w, i) => (
                      <motion.span
                        key={`${w}-${i}`}
                        variants={prefersReducedMotion ? {} : wordChild}
                        className="inline-block mr-[0.5ch] whitespace-pre-wrap"
                      >
                        {w}
                      </motion.span>
                    ))}
                  </motion.h1>
                ) : (
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: 0, scale: 0.985, y: 8 }
                    }
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 1, scale: 1, y: 0 }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
                    }
                    className="flex items-center justify-center"
                  >
                    <Image
                      src={current.src}
                      alt={current.alt ?? "Slide image"}
                      width={current.width ?? 480}
                      height={current.height ?? 160}
                      priority
                      sizes="(min-width:1536px) 38vw, (min-width:1280px) 44vw, (min-width:1024px) 56vw, (min-width:640px) 70vw, 82vw"
                      className={clsx(
                        "h-auto w-auto opacity-95",
                        // responsive max widths (good on tablet & med laptops)
                        "max-w-[82vw] sm:max-w-[70vw] md:max-w-[56vw] lg:max-w-[44vw] xl:max-w-[38vw]"
                      )}
                      onError={(e) => {
                        const imgEl =
                          e.currentTarget as unknown as HTMLImageElement;
                        (imgEl.style as any).display = "none";
                      }}
                    />
                    <noscript>
                      <img
                        src={current.src}
                        alt={current.alt ?? "Slide image"}
                        style={{ maxWidth: "82vw", opacity: 0.95 }}
                        width={current.width ?? 480}
                        height={current.height ?? 160}
                      />
                    </noscript>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Exit curve */}
          <svg className="absolute top-0 h-[calc(100%+300px)] w-full">
            <motion.path
              variants={curve}
              initial="initial"
              animate={isExiting ? "exit" : "initial"}
              fill={curveFill}
            />
          </svg>
        </>
      )}
    </motion.div>
  );
}

/* ===================== Usage =====================

<Preloader
  onComplete={() => setShowApp(true)}
  backgroundClassName="bg-[#04060a]"
  curveFill="#07518a"
  slides={[
    { type: "text", content: "Global Footprint: India | USA | Dubai" },
    { type: "image", src: "/highbtlogo-white-tm.png", width: 380, height: 110 },
  ]}
/>

- No spinner/progress bar.
- Text shows as plain text (no dot), revealed word-by-word.
- Tablet & medium laptop are tuned via clamp() + breakpoint-specific max-widths & sizes.
- Honors “prefers-reduced-motion”.
*/
