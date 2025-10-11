"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTransition, a } from "@react-spring/web";
import { cn } from "@/lib/utils";

/* =========================
   Types
========================= */
export interface MasonryItem {
  id: number | string;
  height: number; // visual height hint (px)
  image: string; // e.g. /news/1.jpeg
}

type GridItem = MasonryItem & {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface MasonryProps {
  data: MasonryItem[];
  /** Space between tiles (px) */
  gap?: number;
  /** Minimum rendered height per item (px) */
  minItemHeight?: number;
  /** Scale factor to map hint->layout height */
  heightHintScale?: number;
  /** Breakpoints for columns (mobile-first) */
  breakpoints?: {
    /** ≥1500px */ xl?: number;
    /** ≥1000px */ lg?: number;
    /** ≥600px  */ md?: number;
    /** <600px  */ base?: number;
  };
}

/* =========================
   Helpers
========================= */
const HEIGHTS = [200, 240, 280, 320, 360, 400] as const;

/** 84..96 are .jpg, rest are .jpeg */
export const buildMasonryData = (
  count = 96,
  basePath = "/news",
  start = 1
): MasonryItem[] =>
  Array.from({ length: count }, (_, i) => {
    const id = start + i;
    const ext = id >= 84 && id <= 96 ? "jpg" : "jpeg";
    return {
      id,
      image: `${basePath}/${id}.${ext}`,
      height: HEIGHTS[i % HEIGHTS.length],
    };
  });

/* =========================
   Masonry (animated)
========================= */
function Masonry({
  data,
  gap = 12,
  minItemHeight = 120,
  heightHintScale = 1.0,
  breakpoints = { xl: 5, lg: 4, md: 3, base: 1 },
}: MasonryProps) {
  const [columns, setColumns] = useState<number>(breakpoints.base ?? 1);
  const ref = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Responsive columns (SSR-safe)
  useEffect(() => {
    const updateColumns = () => {
      if (typeof window === "undefined") return;
      const xl = window.matchMedia("(min-width: 1500px)").matches;
      const lg = window.matchMedia("(min-width: 1000px)").matches;
      const md = window.matchMedia("(min-width: 600px)").matches;
      setColumns(
        xl
          ? breakpoints.xl ?? 5
          : lg
          ? breakpoints.lg ?? 4
          : md
          ? breakpoints.md ?? 3
          : breakpoints.base ?? 1
      );
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [breakpoints]);

  // Measure container width (ResizeObserver > resize)
  useEffect(() => {
    const measure = () => {
      if (ref.current) setContainerWidth(ref.current.offsetWidth);
    };
    measure();
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    if (ro && ref.current) ro.observe(ref.current);
    else window.addEventListener("resize", measure);
    return () => {
      if (ro && ref.current) ro.unobserve(ref.current);
      else window.removeEventListener("resize", measure);
    };
  }, []);

  // Compute layout
  const [columnHeights, gridItems] = useMemo<[number[], GridItem[]]>(() => {
    const nCols = Math.max(1, columns);
    const heights = new Array(nCols).fill(0) as number[];
    const items: GridItem[] = [];

    const totalGaps = gap * (nCols - 1);
    const colWidth =
      containerWidth > 0 ? (containerWidth - totalGaps) / nCols : 0;

    data.forEach((item) => {
      const target = heights.indexOf(Math.min(...heights));
      const x = target * (colWidth + gap);
      const y = heights[target];

      const h = Math.max(
        minItemHeight,
        Math.round(item.height * heightHintScale)
      );
      heights[target] = y + h + gap;

      items.push({ ...item, x, y, width: colWidth, height: h });
    });

    // Remove the last added gap from overall height
    const maxH = Math.max(0, ...heights.map((h) => h - gap));
    return [
      Array(nCols)
        .fill(0)
        .map((_, i) => (heights[i] ? heights[i] - gap : 0)),
      items,
    ].map((v, i) => (i === 0 ? (v as number[]).map(() => maxH) : v)) as [
      number[],
      GridItem[]
    ];
  }, [columns, data, containerWidth, gap, minItemHeight, heightHintScale]);

  // Animations
  const transitions = useTransition<
    GridItem,
    { x: number; y: number; width: number; height: number; opacity: number }
  >(gridItems, {
    keys: (it) => it.id,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  return (
    <div
      ref={ref}
      className={cn("relative w-full")}
      style={{ height: Math.max(0, ...columnHeights) }}
    >
      {transitions((style, item) => (
        <a.div
          key={item.id}
          style={style}
          className="absolute [will-change:transform,width,height,opacity]"
        >
          <div
            className="relative w-full h-full overflow-hidden rounded-[8px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] transition duration-300 ease hover:scale-[1.04] bg-white dark:bg-gray-800"
            style={{
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-label={`image-${item.id}`}
            role="img"
          />
        </a.div>
      ))}
    </div>
  );
}

export const Component = Masonry;

/* =========================
   Tiny demo (optional)
========================= */
export function DemoOne() {
  const data = useMemo(() => buildMasonryData(96, "/news", 1), []);
  return (
    <div className="flex w-full h-screen justify-center items-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-screen-xl mx-auto h-[80vh] overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-900 p-4">
        <Component data={data} />
      </div>
    </div>
  );
}
