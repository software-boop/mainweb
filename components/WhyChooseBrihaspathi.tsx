"use client";

import React, { useMemo, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
} from "framer-motion";

/* ================= Types ================= */
export type WhyItem = {
  title: string;
  highlight?: string;
  description: string;
  icon?: string;
  imageSrc: string;
};

type Props = {
  items?: WhyItem[];
  title?: string;
  brandHex?: string;
};

const Nationwide = "/nationawide.png";
const Expertise = "/expertise (1).png";
const Trusted = "/end---end (1).png";
const nnovation = "/innovation-1 (1).png";

/* =============== Your content =============== */
const DEFAULT_ITEMS: WhyItem[] = [
  {
    title: "Nationwide Presence ",
    // highlight: "18+ Years of Excellence",
    description:
      "with proven success across industries and government verticals",
    imageSrc: Nationwide,
  },
  {
    title: "End‑to‑End Expertise ",
    // highlight: "One-Stop Technology Partner",
    description:
      "from design and deployment to maintenance and service support",
    // icon: "🛠️",
    imageSrc: Expertise,
  },
  {
    title: "Trusted by Leading ",
    // highlight: "Exceeding Industry Standards",
    description: "PSUs and Corporates for mission‑critical projects",
    // icon: "✅",
    imageSrc: Trusted,
  },
  {
    title: "Innovation",
    highlight: "Built for Tomorrow",
    description:
      "Designed to scale with your business and evolving technology.",
    // icon: "🚀",
    imageSrc: nnovation,
  },
];

/* =============== Motion helpers =============== */
const appear = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

/** Column parallax: whole lane glides upward with scroll */
function useLaneParallax(ref: React.RefObject<HTMLElement>, travel = -140) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 10%", "end 10%"],
  });
  return useTransform(scrollYProgress, [0, 1], [0, travel]);
}

/** Panel follow: as you scroll, the panel moves along Y then settles to 0 */
function usePanelFollow(ref: React.RefObject<HTMLElement>, amplitude = 26) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 30%", "end 15%"],
  });

  // Move from +amplitude -> 0 -> -amplitude across the view, then spring back to 0
  const raw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [amplitude, 0, -amplitude]
  );

  // Make it feel elastic/springy back to resting position (0)
  const velocity = useVelocity(raw);
  const y = useSpring(raw, {
    stiffness: 140,
    damping: 18,
    mass: 0.4,
  });

  // subtle opacity boost on entry
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.75, 1, 1]);

  return { y, opacity, velocity };
}

/** Tiny float on the image itself (adds life) */
function useImageFloat(ref: React.RefObject<HTMLElement>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 20%"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  return y;
}

/* =============== Plain Panel (image first, text below, with vertical line) =============== */
function Panel({
  item,
  brandHex,
  priority = false,
}: {
  item: WhyItem;
  brandHex: string;
  priority?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  const follow = usePanelFollow(panelRef, 28); // stronger amplitude for more “follow”
  const imageFloatY = useImageFloat(imgWrapRef);

  return (
    <motion.div
      ref={panelRef}
      style={{ y: follow.y, opacity: follow.opacity }}
      {...appear(0.05)}
      className="w-full "
    >
      {/* Image */}
      <motion.div
        ref={imgWrapRef}
        style={{ y: imageFloatY }}
        className="relative w-full aspect-[32/10]"
      >
        <Image
          src={item.imageSrc}
          alt={item.title}
          fill
          className="object-contain p-4 md:p-6"
          priority={priority}
        />
      </motion.div>

      {/* Content with vertical accent line (like reference) */}
      <div className="mt-4 md:mt-5 flex items-start gap-4">
        {/* Vertical line — stretches to text height */}
        <div
          className="self-stretch w-[2px] rounded-full"
          style={{ backgroundColor: brandHex }}
          aria-hidden
        />

        {/* Text block */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {item.icon && (
              <span className="text-xl md:text-2xl" aria-hidden>
                {item.icon}
              </span>
            )}
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: brandHex }}
              aria-hidden
            />
          </div>

          <h3
            className="text-2xl md:text-3xl font-semibold tracking-tight"
            style={{ color: brandHex }}
          >
            {item.title}
          </h3>

          {item.highlight && (
            <p
              className="mt-1 text-[11px] md:text-xs font-semibold tracking-widest uppercase"
              style={{ color: brandHex }}
            >
              {item.highlight}
            </p>
          )}

          <p className="mt-3 text-gray-700 leading-relaxed text-base md:text-lg">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* =============== Column (lane) that parallax-scrolls =============== */
function Lane({
  items,
  brandHex,
  travel,
  offsetTop = 0,
  align = "start",
}: {
  items: WhyItem[];
  brandHex: string;
  travel: number;
  offsetTop?: number;
  align?: "start" | "end";
}) {
  const laneRef = useRef<HTMLDivElement>(null);
  const y = useLaneParallax(laneRef, travel);

  return (
    <motion.div
      ref={laneRef}
      style={{ y }}
      className={`flex flex-col gap-16 md:gap-24 ${
        align === "end" ? "items-end" : ""
      }`}
    >
      {offsetTop > 0 && <div style={{ height: offsetTop }} aria-hidden />}
      {items.map((it, i) => (
        <div key={`${it.title}-${i}`} className="w-full md:max-w-[560px]">
          <Panel item={it} brandHex={brandHex} priority={i < 2} />
        </div>
      ))}
    </motion.div>
  );
}

/* =============== MAIN SECTION =============== */
export default function WhyMinimalZigZagInteractive({
  items,
  title = "Why Brihaspathi?",
  brandHex = "#07518a",
}: Props) {
  const data = useMemo(() => items ?? DEFAULT_ITEMS, [items]);

  // split into two lanes: even -> left, odd -> right
  const left: WhyItem[] = [];
  const right: WhyItem[] = [];
  data.forEach((it, idx) => (idx % 2 === 0 ? left.push(it) : right.push(it)));

  return (
    <section
      className="relative mb-0 bg-white"
      // exact 50px padding as requested
      style={{
        paddingTop: 100,
        // paddingBottom: 100,
        paddingLeft: 100,
        paddingRight: 100,
      }}
    >
      <motion.h2
        {...appear(0)}
        className="text-3xl md:text-4xl font-semibold tracking-tight text-center text-black"
      >
        {title}
      </motion.h2>

      <div className="mx-auto max-w-7xl mt-10 md:mt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {/* Left lane — starts slightly lower, gentler travel */}
          <Lane
            items={left}
            brandHex={brandHex}
            travel={-110}
            offsetTop={60}
            align="start"
          />

          {/* Right lane — starts higher, a touch more travel */}
          <Lane
            items={right}
            brandHex={brandHex}
            travel={-150}
            offsetTop={0}
            align="end"
          />
        </div>
      </div>
    </section>
  );
}
