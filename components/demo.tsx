"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useTransition, a } from "@react-spring/web";

// If you don't have cn(), you can just join classNames directly.
const cn = (...c: (string | false | undefined)[]) =>
  c.filter(Boolean).join(" ");

interface MasonryItem {
  id: number;
  height: number;
  image: string; // e.g., /news/1.jpeg
}

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MasonryProps {
  data: MasonryItem[];
}

const HEIGHTS = [200, 240, 280, 320, 360, 400] as const;

export const buildMasonryData = (
  count = 96,
  basePath = "/news",
  start = 1
): MasonryItem[] =>
  Array.from({ length: count }, (_, i) => {
    const id = start + i;
    return {
      id,
      image: `${basePath}/${id}.jpeg`, // make sure files actually exist with .jpeg; see fallback below
      height: HEIGHTS[i % HEIGHTS.length],
    };
  });

function Masonry({ data }: MasonryProps) {
  const [columns, setColumns] = useState<number>(2);
  const ref = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Responsive column count
  useEffect(() => {
    const updateColumns = () => {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(min-width: 1500px)").matches) setColumns(5);
      else if (window.matchMedia("(min-width: 1000px)").matches) setColumns(4);
      else if (window.matchMedia("(min-width: 600px)").matches) setColumns(3);
      else setColumns(1);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Measure container width
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
    const currHeights = new Array(Math.max(columns, 1)).fill(0);
    const items: GridItem[] = [];
    const colWidth =
      containerWidth > 0 ? containerWidth / Math.max(columns, 1) : 0;

    data.forEach((item) => {
      const targetCol = currHeights.indexOf(Math.min(...currHeights));
      const x = colWidth * targetCol;
      const y = currHeights[targetCol];
      const layoutHeight = Math.max(100, item.height);
      currHeights[targetCol] += layoutHeight;

      items.push({ ...item, x, y, width: colWidth, height: layoutHeight });
    });

    return [currHeights, items];
  }, [columns, data, containerWidth]);

  const transitions = useTransition<
    GridItem,
    { x: number; y: number; width: number; height: number; opacity: number }
  >(gridItems, {
    keys: (item) => item.id,
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
      style={{ height: Math.max(...columnHeights, 0) }}
    >
      {transitions((style, item) => (
        <a.div
          key={item.id}
          style={style}
          className="absolute p-[15px] [will-change:transform,width,height,opacity]"
        >
          <div className="relative w-full h-full overflow-hidden rounded-[8px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)]">
            <SmartImage src={item.image} alt={`news-${item.id}`} />
          </div>
        </a.div>
      ))}
    </div>
  );
}

// <Image> that falls back from .jpeg → .jpg automatically
function SmartImage({ src, alt }: { src: string; alt: string }) {
  const [current, setCurrent] = useState(src);
  const triedJpg = useRef(false);

  return (
    <Image
      src={current}
      alt={alt}
      fill
      sizes="(max-width: 600px) 100vw, (max-width: 1000px) 33vw, 20vw"
      style={{ objectFit: "cover" }}
      onError={() => {
        if (!triedJpg.current && current.endsWith(".jpeg")) {
          triedJpg.current = true;
          setCurrent(current.replace(/\.jpeg$/i, ".jpg"));
        }
      }}
      // Optional: set priority on the first few if you want faster LCP
      priority={alt.endsWith("-1") || alt.endsWith("-2") || alt.endsWith("-3")}
    />
  );
}

export const Component = Masonry;

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
