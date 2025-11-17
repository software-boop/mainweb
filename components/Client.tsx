"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ================== Types ================== */
type SectorItem = {
  name: string;
  folder: string;
  images: string[];
};

const clints = "/loyal-customer.png";
/* ================== Hardcoded Paths ==================
   Base: /Sector was Clients  (spaces encoded as %20)
====================================================== */

const BANKS = [
  "/Sector%20was%20Clients/BANKS/1.png",
  "/Sector%20was%20Clients/BANKS/2.png",
  "/Sector%20was%20Clients/BANKS/3.png",
  "/Sector%20was%20Clients/BANKS/4.png",
  "/Sector%20was%20Clients/BANKS/5.png",
  "/Sector%20was%20Clients/BANKS/6.png",
  "/Sector%20was%20Clients/BANKS/7.png",
  "/Sector%20was%20Clients/BANKS/8.png",
  "/Sector%20was%20Clients/BANKS/9.png",
  "/Sector%20was%20Clients/BANKS/10.png",
  "/Sector%20was%20Clients/BANKS/11.png",
];

const CENTRAL_STATE_GOVT = [
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/1.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/2.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/3.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/4.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/5.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/6.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/7.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/8.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/9.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/10.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/11.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/12.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/13.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/14.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/15.png",
  "/Sector%20was%20Clients/Central%20nd%20state%20Government%20logos/16.png",
];

const CORPORATES = [
  "/Sector%20was%20Clients/corporates%20logo/1.png",
  "/Sector%20was%20Clients/corporates%20logo/2.png",
  "/Sector%20was%20Clients/corporates%20logo/3.png",
  "/Sector%20was%20Clients/corporates%20logo/4.png",
  "/Sector%20was%20Clients/corporates%20logo/5.png",
  "/Sector%20was%20Clients/corporates%20logo/6.png",
];

const HOSPITALS = [
  "/Sector%20was%20Clients/Hospitals%20logo/1.png",
  "/Sector%20was%20Clients/Hospitals%20logo/2.png",
  "/Sector%20was%20Clients/Hospitals%20logo/3.png",
  "/Sector%20was%20Clients/Hospitals%20logo/4.png",
  "/Sector%20was%20Clients/Hospitals%20logo/5.png",
  "/Sector%20was%20Clients/Hospitals%20logo/6.png",
];

const INDUSTRIES = [
  "/Sector%20was%20Clients/INDUSTRIES/1.png",
  "/Sector%20was%20Clients/INDUSTRIES/2.png",
  "/Sector%20was%20Clients/INDUSTRIES/3.png",
  "/Sector%20was%20Clients/INDUSTRIES/4.png",
  "/Sector%20was%20Clients/INDUSTRIES/5.png",
  "/Sector%20was%20Clients/INDUSTRIES/6.png",
  "/Sector%20was%20Clients/INDUSTRIES/7.png",
  "/Sector%20was%20Clients/INDUSTRIES/8.png",
  "/Sector%20was%20Clients/INDUSTRIES/9.png",
  "/Sector%20was%20Clients/INDUSTRIES/10.png",
  "/Sector%20was%20Clients/INDUSTRIES/11.png",
];

const INSTITUTIONS = [
  "/Sector%20was%20Clients/Instutions/6.png",
  "/Sector%20was%20Clients/Instutions/7.png",
  "/Sector%20was%20Clients/Instutions/8.png",
  "/Sector%20was%20Clients/Instutions/9.png",
  "/Sector%20was%20Clients/Instutions/10.png",
];

const REAL_ESTATE = [
  "/Sector%20was%20Clients/real%20estate%20logos/1.png",
  "/Sector%20was%20Clients/real%20estate%20logos/2.png",
  "/Sector%20was%20Clients/real%20estate%20logos/3.png",
  "/Sector%20was%20Clients/real%20estate%20logos/4.png",
  "/Sector%20was%20Clients/real%20estate%20logos/5.png",
  "/Sector%20was%20Clients/real%20estate%20logos/6.png",
  "/Sector%20was%20Clients/real%20estate%20logos/7.png",
  "/Sector%20was%20Clients/real%20estate%20logos/8.png",
  "/Sector%20was%20Clients/real%20estate%20logos/9.png",
];

const SCHOOLS = [
  "/Sector%20was%20Clients/Schools%20logos/1.png",
  "/Sector%20was%20Clients/Schools%20logos/2.png",
  "/Sector%20was%20Clients/Schools%20logos/3.png",
  "/Sector%20was%20Clients/Schools%20logos/4.png",
  "/Sector%20was%20Clients/Schools%20logos/5.png",
  "/Sector%20was%20Clients/Schools%20logos/6.png",
];

const TEMPLES = [
  "/Sector%20was%20Clients/temples/11.png",
  "/Sector%20was%20Clients/temples/12.png",
  "/Sector%20was%20Clients/temples/13.png",
  "/Sector%20was%20Clients/temples/14.png",
];

const UNIVERSITIES = [
  "/Sector%20was%20Clients/Universities/1.png",
  "/Sector%20was%20Clients/Universities/2.png",
  "/Sector%20was%20Clients/Universities/3.png",
  "/Sector%20was%20Clients/Universities/4.png",
  "/Sector%20was%20Clients/Universities/5.png",
];

const SECTOR_LOGOS: SectorItem[] = [
  { name: "BANKS", folder: "BANKS", images: BANKS },
  {
    name: "Central & State Government",
    folder: "Central nd state Government logos",
    images: CENTRAL_STATE_GOVT,
  },
  { name: "Corporates", folder: "corporates logo", images: CORPORATES },
  { name: "Hospitals", folder: "Hospitals logo", images: HOSPITALS },
  { name: "INDUSTRIES", folder: "INDUSTRIES", images: INDUSTRIES },
  { name: "Institutions", folder: "Instutions", images: INSTITUTIONS },
  { name: "Real Estate", folder: "real estate logos", images: REAL_ESTATE },
  { name: "Schools", folder: "Schools logos", images: SCHOOLS },
  { name: "Temples", folder: "temples", images: TEMPLES },
  { name: "Universities", folder: "Universities", images: UNIVERSITIES },
];

/** utility: split into N rows (kept for marquee layout) */
function splitIntoRows<T>(arr: T[], rows: number): T[][] {
  const out: T[][] = Array.from({ length: rows }, () => []);
  arr.forEach((v, i) => out[i % rows].push(v));
  return out;
}

/** utility: simple de-dup to avoid repeated logos */
function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/* ================== Row (marquee) ================== */
type Dir = "left" | "right";

function IconRow({
  icons,
  broken,
  markBroken,
  direction = "left",
  speedSeconds = 12,
  sizePx = 56,
  gapPx = 28,
  priorityFirstN = 4,
  title,
}: {
  icons: string[];
  broken: Set<string>;
  markBroken: (src: string) => void;
  direction?: Dir;
  speedSeconds?: number;
  sizePx?: number;
  gapPx?: number;
  priorityFirstN?: number;
  title?: string;
}) {
  // filter out broken ones for both visible + cloned lanes
  const safeIcons = useMemo(
    () => icons.filter((s) => !broken.has(s)),
    [icons, broken]
  );

  if (safeIcons.length === 0) return null;

  return (
    <div
      className="group relative w-full overflow-hidden select-none bg-white"
      aria-label={title}
      style={
        {
          ["--speed" as any]: `${speedSeconds}s`,
          ["--gap" as any]: `${gapPx}px`,
          ["--icon" as any]: `${sizePx}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={`track flex items-center ${
          direction === "left" ? "animate-left" : "animate-right"
        }`}
      >
        <div className="lane flex items-center">
          {safeIcons.map((src, i) => {
            const isCritical = i < priorityFirstN;
            return (
              <div
                key={`a-${src}-${i}`}
                className="icon-wrap"
                title={`${title ?? "logo"} ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${title ?? "logo"} ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 56px, 48px"
                  priority={isCritical}
                  loading={isCritical ? "eager" : "lazy"}
                  fetchPriority={isCritical ? "high" : "low"}
                  decoding="async"
                  onError={() => markBroken(src)}
                />
              </div>
            );
          })}
        </div>
        <div className="lane flex items-center" aria-hidden="true">
          {safeIcons.map((src, i) => (
            <div key={`b-${src}-${i}`} className="icon-wrap">
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1024px) 56px, 48px"
                loading="lazy"
                fetchPriority="low"
                decoding="async"
                onError={() => markBroken(src)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="fade fade-left" />
      <div className="fade fade-right" />

      <style jsx>{`
        .track {
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }
        .lane {
          gap: var(--gap);
          padding-right: var(--gap);
        }
        .icon-wrap {
          position: relative;
          width: var(--icon);
          height: var(--icon);
          flex: 0 0 auto;
          contain: content;
        }
        .icon-wrap :global(img) {
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }
        @keyframes marquee-left {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes marquee-right {
          from {
            transform: translate3d(-50%, 0, 0);
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-left {
          animation: marquee-left var(--speed) linear infinite;
        }
        .animate-right {
          animation: marquee-right var(--speed) linear infinite;
        }
        .group:hover .animate-left,
        .group:hover .animate-right {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-left,
          .animate-right {
            animation: none !important;
          }
        }
        .fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 96px;
          pointer-events: none;
        }
        .fade-left {
          left: 0;
          background: linear-gradient(
            to right,
            var(--fade-bg) 0%,
            transparent 100%
          );
        }
        .fade-right {
          right: 0;
          background: linear-gradient(
            to left,
            var(--fade-bg) 0%,
            transparent 100%
          );
        }
      `}</style>
    </div>
  );
}

/* ================== Main Hero ================== */
export default function ClientsMarqueeHero({
  brandHex = "#07518a",
  ctaHref = "/casestudies",
  ctaLabel = "View case studies",
}: {
  brandHex?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  // 1) flatten -> dedupe (optional) -> split into rows
  const allIcons = useMemo(
    () => dedupe(SECTOR_LOGOS.flatMap((s) => s.images)),
    []
  );

  const ROWS = useMemo(() => splitIntoRows(allIcons, 4), [allIcons]);

  // 2) keep a single shared "broken srcs" set
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const markBroken = useCallback((src: string) => {
    // ignore if already marked
    setBroken((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  const skippedCount = broken.size;

  return (
    <section
      className="relative py-24 overflow-hidden bg-white "
      style={
        {
          ["--fade-bg" as any]: "var(--fade-color, #fff)",
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <span
          className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm rounded-full border bg-white "
          style={{ borderColor: brandHex, color: brandHex }}
        >
          <Image
            src={clints}
            alt="Our Clients"
            width={20}
            height={20}
            className="h-5 w-5 object-contain"
          />
          <span>Our Clients</span>
        </span>

        <h1
          className="text-4xl lg:text-6xl font-extrabold tracking-tight mt-1"
          style={{
            backgroundImage: `linear-gradient(90deg, ${brandHex}, ${brandHex})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Trusted Across Sectors
        </h1>

        <p className="mt-4 text-lg text-gray-700 dark:text-white/80 max-w-2xl mx-auto">
          We partner with <strong style={{ color: brandHex }}>banks</strong>,{" "}
          <strong style={{ color: brandHex }}>government</strong>,{" "}
          <strong style={{ color: brandHex }}>enterprises</strong>, and{" "}
          <strong style={{ color: brandHex }}>education & healthcare</strong>{" "}
          institutions across India.
        </p>

        <Button
          asChild
          className="mt-8 px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          style={{ backgroundColor: brandHex, color: "#fff" }}
        >
          <Link href={ctaHref} prefetch>
            {ctaLabel}
          </Link>
        </Button>

        <div className="mt-12 space-y-6">
          <IconRow
            icons={ROWS[0]}
            broken={broken}
            markBroken={markBroken}
            direction="left"
            speedSeconds={12}
            sizePx={56}
            gapPx={28}
            title="Row 1"
          />
          <IconRow
            icons={ROWS[1]}
            broken={broken}
            markBroken={markBroken}
            direction="right"
            speedSeconds={12}
            sizePx={56}
            gapPx={28}
            title="Row 2"
          />
          <IconRow
            icons={ROWS[2]}
            broken={broken}
            markBroken={markBroken}
            direction="left"
            speedSeconds={12}
            sizePx={56}
            gapPx={28}
            title="Row 3"
          />
          <IconRow
            icons={ROWS[3]}
            broken={broken}
            markBroken={markBroken}
            direction="right"
            speedSeconds={12}
            sizePx={56}
            gapPx={28}
            title="Row 4"
          />
        </div>
      </div>

      <style jsx>{`
        :global(html.dark) section[style] {
          --fade-color: #000;
        }
      `}</style>
    </section>
  );
}
