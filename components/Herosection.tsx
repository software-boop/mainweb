"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue } from "framer-motion";
import { Button } from "../components/Button";
import {
  ArrowRight,
  Play,
  Database,
  Shield,
  Cpu,
  Radar,
  BarChart3,
} from "lucide-react";
// import { ContactsOutlined } from "@ant-design/icons";
import ScheduleConsultationButton from "../components/ScheduleConsultationButton";
/* =============================
   Brand
   ============================= */
const BRAND = "#07518a";
const BRAND_TINT = "#0a6ab8";
const backimage = "/background.jpg";

const mainimage = "/Mani.jpg";
const withAlpha = (hex: string, alpha: number) => {
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Ensure the file exists in /public (replace with your banner)
const BANNER = "/background.jpg";

export default function HeroSection() {
  // Subtle 3D tilt for the right visual on pointer move
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const visualRef = useRef<HTMLDivElement | null>(null);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = visualRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const max = 10; // deg (slightly reduced for compact layout)
    tiltY.set((px - 0.5) * max);
    tiltX.set(-(py - 0.5) * max);
  };

  const onPointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  // Entrance + micro-motion variants
  const leftCol = {
    hidden: { opacity: 0, x: -60 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.06,
      },
    },
  };
  const leftItem = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };
  const rightCol = {
    hidden: { opacity: 0, x: 60 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Small floating animation helper
  const float = (delay = 0) => ({
    translateY: [0, -6, 0],
    transition: {
      duration: 3.6,
      repeat: Infinity as const,
      ease: "easeInOut",

      delay,
    },
  });

  return (
    <section
      id="home"
      className="relative min-h-[110vh] flex items-center overflow-hidden pb-48"
      style={{
        backgroundImage: `url(${BANNER})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      aria-label="Hero"
    >
      {/* Decorative background */}
      <div className="absolute inset-0">
        {/* Soft brand tint */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${BRAND_TINT}20, ${BRAND}20)`,
          }}
        />
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(2,6,23,.06) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-center">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-4 sm:gap-6 lg:gap-10 py-6 sm:py-8">
            {/* LEFT — Text */}
            <motion.div
              variants={leftCol}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.2, once: false }}
              className="order-2 lg:order-1 text-center lg:text-left"
            >
              {/* Top pill */}
              <motion.div
                variants={leftItem}
                className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-sm border"
                style={{
                  color: BRAND,
                  backgroundColor: withAlpha(BRAND, 0.08),
                  borderColor: withAlpha(BRAND, 0.2),
                }}
              >
                <span
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mr-2"
                  style={{ backgroundColor: BRAND }}
                />
                India’s Most Trusted System Integrator
              </motion.div>

              {/* H1 — smaller */}
              <motion.h1
                variants={leftItem}
                className="mt-3 sm:mt-4 text-4xl sm:text-2xl lg:text-3xl font-bold leading-tight text-slate-900"
              >
                <span className="block">
                  {" "}
                  Where Technology Meets Innovation.
                </span>
                <span className="block" style={{ color: BRAND }}>
                  Trusted surveillance, ELV, and smart technology partner for
                  forward-thinking Business.
                </span>
                <span className="block"> </span>
              </motion.h1>

              {/* Tagline */}
              <motion.div variants={leftItem} className="mt-3 sm:mt-4">
                <p
                  className="text-sm sm:text-base font-semibold mb-1 tracking-wide"
                  style={{ color: BRAND }}
                >
                  About Us
                </p>
                <p className="text-xs sm:text-sm text-slate-600"></p>
              </motion.div>

              {/* Sub text — smaller */}
              <motion.p
                variants={leftItem}
                className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                From AI-powered surveillance to sustainable solar solutions,
                we’re not just building technology —
                <span className="font-semibold" style={{ color: BRAND }}>
                  {" "}
                  we’re crafting the intelligent infrastructure
                </span>{" "}
                that powers tomorrow’s world with cutting-edge IoT, automation,
                and enterprise solutions.
              </motion.p>

              {/* CTA — compact */}
              <motion.div
                variants={leftItem}
                className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              >
                <Button
                  className="text-white px-5 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: BRAND }}
                  onClick={() => {}}
                >
                  Explore Sollution
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                {/* <Button
                  variant="outline"
                  className="border-2 bg-transparent backdrop-blur-sm px-5 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base font-semibold rounded-full hover:scale-105 transition-all duration-300"
                  style={{ borderColor: BRAND, color: BRAND }}
                >
                  <ContactsOutlined className="mr-2 h-5 w-5" />
                  Schedule Consultation
                </Button> */}

                <ScheduleConsultationButton prefillSolution="cctv-installation" />
              </motion.div>

              {/* Stats — smaller */}
              <motion.div
                variants={leftItem}
                className="mt-7 sm:mt-9 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 max-w-3xl mx-auto lg:mx-0"
              >
                {[
                  { num: "300+", label: "Work force  " },
                  { num: "12K+", label: "Global Clients" },
                  { num: "99%", label: "Sucess rate" },
                  { num: "18+", label: "Years Experiance" },
                  // { num: "2M+", label: "Smart Devices" },
                  // { num: "1200+", label: "Projects Delivered" },
                ].map((s) => (
                  <div key={s.label} className="text-center group ">
                    <div
                      className="text-xl sm:text-2xl lg:text-3xl font-bold group-hover:scale-110 transition-transform duration-300"
                      style={{ color: BRAND }}
                    >
                      {s.num}
                    </div>
                    <div className="text-[11px] sm:text-xs md:text-sm text-slate-600 font-medium mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — Visual */}
            <motion.div
              variants={rightCol}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.2, once: false }}
              className="order-1 lg:order-2 w-full"
            >
              <motion.div
                ref={visualRef}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                style={{
                  transformStyle: "preserve-3d",
                  rotateX: tiltX,
                  rotateY: tiltY,
                }}
                className="relative mx-auto w-full max-w-[min(520px,92%)] h-[220px] sm:h-[320px] md:h-[380px] lg:h-[480px]"
              >
                {/* Soft backdrop — brand-tinted */}
                <motion.div
                  className="absolute inset-0 rounded-[2rem]"
                  style={{
                    transform: "translateZ(-36px)",
                    background: `linear-gradient(135deg,
                      ${withAlpha(BRAND, 0.12)} 0%,
                      ${withAlpha(BRAND, 0.08)} 45%,
                      ${withAlpha(BRAND, 0.12)} 100%)`,
                  }}
                  animate={{ opacity: [0.32, 0.5, 0.32] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Card frame with subtle brand stroke & glow */}
                <div
                  className="absolute inset-0 rounded-[2rem] bg-white/40 backdrop-blur-[2px] shadow-[0_0_50px_-12px_rgba(2,6,23,0.10)]"
                  style={{ border: `1px solid ${withAlpha(BRAND, 0.26)}` }}
                />

                {/* Inner media panel */}
                <div
                  className="absolute inset-3.5 rounded-[1.5rem] overflow-hidden bg-white ring-1"
                  style={{
                    boxShadow: `0 10px 26px ${withAlpha(BRAND, 0.12)}`,
                    borderColor: withAlpha(BRAND, 0.18),
                  }}
                >
                  <Image
                    src={mainimage}
                    alt="Innovation Visual"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, transparent 0%, ${withAlpha(
                        "#ffffff",
                        0.3
                      )} 100%)`,
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
