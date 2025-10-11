// app/team/page.tsx
"use client";

import React from "react";
import TeamGrid from "@/components/TeamGrid";
import CapabilitiesOrbit from "@/components/Capital";
import { motion, Variants } from "framer-motion";
import ValuesSection from "@/components/ValuesSection";
import LifeAtBTCarousel from "@/components/LifeAtBTCarousel";

const BRAND = "#07518a";

type Item = { title: string; desc: string };

const WHAT_WE_DO: Item[] = [
  {
    title: "E-Security & Surveillance",
    desc: "CCTV, video analytics, access control, fire & alarm integrations",
  },
  {
    title: "Home/Building Automation",
    desc: "Lighting, HVAC, sensors, voice/app control, energy optimization",
  },
  {
    title: "AI-Driven Software",
    desc: "Analytics dashboards, alerts, workflow automation, custom apps",
  },
  {
    title: "IoT & ELV Systems",
    desc: "Sensors, controllers, structured cabling, PA/BGM, paging",
  },
  {
    title: "IT/Telecom",
    desc: "Wired/wireless networks, IP telephony, data center & cloud connectivity",
  },
  {
    title: "Services",
    desc: "Consulting, deployment, monitoring, and comprehensive AMC",
  },
];

// parent for the whole reveal block
const group: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// each line; pass "dir" to slide from left or right
const line = (dir: "left" | "right"): Variants => ({
  hidden: { opacity: 0, x: dir === "left" ? -24 : 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
});

export default function Page() {
  const left = WHAT_WE_DO.slice(0, 3);
  const right = WHAT_WE_DO.slice(3);

  return (
    <main className="min-h-screen bg-white">
      {/* ===== Hero ===== */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border"
            style={{ color: BRAND, borderColor: BRAND }}
          >
            Who we are
          </span>

          <h1
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
            style={{ color: BRAND }}
          >
            A solutions partner that turns complex technology into outcomes
          </h1>

          <p className="mt-4 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-slate-700">
            We focus on what matters—
            <span className="font-semibold">
              safety, uptime, and efficiency
            </span>
            —for businesses, institutions, and city-scale projects.
          </p>

          <div
            className="mt-8 h-1.5 w-28 rounded-full"
            style={{ backgroundColor: BRAND }}
          />
          <CapabilitiesOrbit />
        </div>
      </section>

      {/* ===== What we do — slanted brand band, 2 columns, scroll reveal, no boxes ===== */}
      <section className="relative overflow-hidden">
        {/* Slanted brand band behind content */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute left-1/2 top-[-42%] h-[170%] w-[150vw] -translate-x-1/2 -rotate-6"
            style={{ backgroundColor: BRAND }}
          />
          {/* soft highlights */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background:
                "radial-gradient(500px 260px at 20% 20%, rgba(255,255,255,0.18) 0%, transparent 60%), radial-gradient(500px 260px at 80% 70%, rgba(255,255,255,0.12) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Content on top */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="text-center">
            <span
              className="inline-flex items-center justify-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide"
              style={{ color: "#fff", borderColor: "rgba(255,255,255,0.7)" }}
            >
              What we do
            </span>
            <h2 className="mt-3 text-[1.6rem] sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
              Secure, automate, and connect — end to end
            </h2>
          </div>

          {/* 2-column layout with a vertical center guide line */}
          <div className="relative mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2">
            {/* center line */}
            <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/25 md:block" />

            {/* Left column */}
            <motion.ul
              className="space-y-6 text-white/90"
              variants={group}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
            >
              {left.map((it, i) => (
                <motion.li
                  key={it.title}
                  variants={line("left")}
                  whileHover="hover"
                  className="group"
                >
                  <ItemRow item={it} side="left" index={i} />
                </motion.li>
              ))}
            </motion.ul>

            {/* Right column */}
            <motion.ul
              className="space-y-6 text-white/90"
              variants={group}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.4 }}
            >
              {right.map((it, i) => (
                <motion.li
                  key={it.title}
                  variants={line("right")}
                  whileHover="hover"
                  className="group"
                >
                  <ItemRow item={it} side="right" index={i} />
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Accent bar */}
        </div>
      </section>

      {/* ===== Team ===== */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <header className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-xl"
                style={{ border: `2px solid ${BRAND}` }}
              />
              <div>
                {/* <h2
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: BRAND }}
                >
                  Leadership Team
                </h2>
                <p className="text-slate-600">
                  People who bring experience, drive, and care to every
                  engagement.
                </p> */}
                <TeamGrid />
              </div>
            </div>
          </header>

          <ValuesSection />
          <LifeAtBTCarousel />
        </div>
      </section>
    </main>
  );
}

/* ---------- Item row component (no boxes) ---------- */

function ItemRow({
  item,
  side,
  index,
}: {
  item: Item;
  side: "left" | "right";
  index: number;
}) {
  // hover animation variants for the bullet
  const bullet: Variants = {
    rest: { scale: 1, opacity: 0.9 },
    hover: { scale: 1.25, opacity: 1 },
  };

  // underline swipe based on side (left->right or right->left)
  const underline: Variants = {
    rest: { scaleX: 0, originX: side === "left" ? 0 : 1, opacity: 0.6 },
    hover: { scaleX: 1, opacity: 1 },
  };

  // tiny nudge when hovering
  const nudge: Variants = {
    rest: { x: 0 },
    hover: { x: side === "left" ? 4 : -4 },
  };

  return (
    <motion.div
      className={`relative flex items-start gap-4 text-white`}
      initial="rest"
      whileHover="hover"
      animate="rest"
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {/* Bullet */}
      <motion.span
        className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-white"
        variants={bullet}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      />

      {/* Text content */}
      <motion.div className="flex-1" variants={nudge}>
        <div className="text-lg font-semibold leading-snug text-white">
          {item.title}
        </div>
        <div className="mt-1 text-sm sm:text-base text-white/85">
          {item.desc}
        </div>

        {/* Underline */}
        <motion.div
          className="mt-2 h-[2px] w-full bg-white/80"
          variants={underline}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </motion.div>
  );
}
