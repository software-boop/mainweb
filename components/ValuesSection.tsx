// components/ValuesSection.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const BRAND = "#07518a";

type ValueItem = {
  key: "empathy" | "innovation" | "respect" | "ownership";
  title: string;
  blurb: string;
  image: { src: string; alt: string; width: number; height: number };
};

const withAlpha = (hex: string, a: number) => {
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// ---- data (no icons from lucide; you use images) ----
const VALUES: ValueItem[] = [
  {
    key: "empathy",
    title: "Empathy",
    blurb:
      "We listen with intent and design with compassion—understanding users, partners, and teammates before we build.",
    image: {
      src: "/icons_ourvalues/16.png",
      alt: "Empathy",
      width: 256,
      height: 256,
    },
  },
  {
    key: "respect",
    title: "Respect",
    blurb:
      "We value diverse perspectives and treat everyone with fairness, candor, and professionalism.",
    image: {
      src: "/icons_ourvalues/15.png",
      alt: "Respect",
      width: 256,
      height: 256,
    },
  },
  {
    key: "innovation",
    title: "Innovation",
    blurb:
      "We challenge assumptions and use technology creatively to deliver practical, scalable outcomes.",
    image: {
      src: "/icons_ourvalues/17.png",
      alt: "Innovation",
      width: 256,
      height: 256,
    },
  },
  {
    key: "ownership",
    title: "Ownership",
    blurb:
      "We think like owners—prioritizing long-term impact, accountability, and results.",
    image: {
      src: "/icons_ourvalues/18.png",
      alt: "Ownership",
      width: 256,
      height: 256,
    },
  },
];

// Animations
const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const gridVariants = {
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function ValuesSection() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      {/* soft brand grid bg */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(7,81,138,0.08) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-center text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          Our Values
        </h2>

        <motion.div
          variants={gridVariants}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
        >
          {VALUES.map((v) => (
            <motion.div
              key={v.key}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.995 }}
              className="flex flex-col items-center text-center rounded-2xl bg-white/75 backdrop-blur p-6 shadow-sm ring-1 ring-slate-200"
            >
              {/* Full circular badge with thick brand ring; image fully contained */}
              <div className="relative h-28 w-28">
                {/* Brand ring */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: `0 0 0 8px ${withAlpha(BRAND, 0.18)}` }}
                />
                {/* White inner circle with overflow hidden to keep image inside the circle */}
                <div
                  className="absolute inset-[6px] rounded-full bg-white shadow"
                  style={{
                    boxShadow: `0 10px 30px ${withAlpha("#000", 0.08)}`,
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image
                      src={v.image.src}
                      alt={v.image.alt}
                      fill
                      sizes="112px"
                      className="object-cover scale-110"
                      priority={false}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 text-lg font-semibold text-slate-900">
                {v.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {v.blurb}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
