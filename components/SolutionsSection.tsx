"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Star,
  Shield,
  Users,
  Home as HomeIcon,
  Zap,
  Network,
  Volume2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import survilence_image from "../public/Home_images/CCTV Surveillance 1.jpg";
import Biometric_image from "../public/Home_images/Biometric Access Control 1.jpg";
import Solar_image from "../public/Home_images/solar 1.jpg";
import It_infrastructure from "../public/Home_images/IT Infrastructure 1.jpg";
import smart_home_automation from "../public/Home_images/Smart Home Automation 1.jpg";
const PA_sound = "/5982.jpg";

const BRAND = "#07518a"; // your base brand color

const withAlpha = (hex: string, alpha: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// simple lighten/darken helpers (0..1)
const clamp = (v: number) => Math.max(0, Math.min(255, v));
const toHex = (n: number) => n.toString(16).padStart(2, "0");
function adjust(hexColor: string, amt: number) {
  const h = hexColor.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const R = clamp(
    r + (255 - r) * (amt > 0 ? amt : 0) + r * (amt < 0 ? amt : 0)
  );
  const G = clamp(
    g + (255 - g) * (amt > 0 ? amt : 0) + g * (amt < 0 ? amt : 0)
  );
  const B = clamp(
    b + (255 - b) * (amt > 0 ? amt : 0) + b * (amt < 0 ? amt : 0)
  );
  return `#${toHex(Math.round(R))}${toHex(Math.round(G))}${toHex(
    Math.round(B)
  )}`;
}
const lighten = (c: string, p = 0.15) => adjust(c, +p);
const darken = (c: string, p = 0.1) => adjust(c, -p);

const BRAND_LIGHT = lighten(BRAND, 0.18);
const BRAND_DARK = darken(BRAND, 0.08);

// mono gradients derived from the single brand color
const monoGradient = (base = BRAND) =>
  `linear-gradient(90deg, ${base} 0%, ${lighten(base, 0.18)} 100%)`;
const softMonoGradient = (base = BRAND, opacity = 0.12) =>
  `linear-gradient(90deg, ${withAlpha(
    lighten(base, 0.18),
    opacity
  )} 0%, ${withAlpha(base, opacity)} 100%)`;

const THEME = {
  bg: "#FFFFFF",
  text: "#0A0A0A",
  subText: "rgba(10,10,10,0.72)",
  ring: withAlpha(BRAND, 0.22),
  surfaceTint: withAlpha(BRAND, 0.08),
};

/* =============================
   Motion Config
   ============================= */
const MOTION_TIMING = {
  duration: 0.75,
  ease: [0.16, 1, 0.3, 1],
};

const drift = {
  translateX: [0, 8, -6, 10, 0],
  translateY: [0, -6, 8, -10, 0],
  rotate: [0, 2, -2, 1.5, 0],
};

function seeded(index: number) {
  let t = (index + 1) * 0x6d2b79f5;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function randomDirection(index: number) {
  const rnd = seeded(index);
  const dirs = [
    { x: -120, y: 0 },
    { x: 120, y: 0 },
    { x: 0, y: -120 },
    { x: 0, y: 120 },
  ];
  return dirs[Math.floor(rnd() * dirs.length)];
}
function randomDelay(index: number, base = 0.05, spread = 0.2) {
  const rnd = seeded(index)();
  return base + rnd * spread;
}
const floatForever = {
  animate: { ...drift },
  transition: {
    duration: 8,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  },
};

/* =============================
   Data
   ============================= */
const solutions = [
  {
    icon: Shield,
    title: "AI Surveillance & Smart CCTV",
    subtitle: "CCTV Surveillance",
    description:
      "AI-powered surveillance systems with 4K resolution, night vision, and intelligent analytics for comprehensive security coverage.",
    features: [
      "4K Ultra HD",
      "AI Analytics",
      "24/7 Monitoring",
      "Mobile Access",
    ],
    image: survilence_image,
    popular: true,
  },
  {
    icon: Users,
    title: "Extra Low Voltage ELV Systems",
    subtitle: "",
    description:
      "Multi-modal biometric systems combining fingerprint, facial recognition, and card-based access for maximum security.",
    features: [
      
      "Face Recognition",
      "Fingerprint",
      "Card Access",
      "Time Tracking",
    ],
    image: Biometric_image,
  },
  {
    icon: HomeIcon,
    title: "Smart Home Automation",
    subtitle: "Intelligent Living Solutions",
    description:
      "Complete home automation with voice control, mobile apps, and energy-efficient smart devices for modern living.",
    features: [
      "Voice Control",
      "Smart Lighting",
      "Climate Control",
      "Energy Saving",
    ],
    image: smart_home_automation,
  },
  {
    icon: Zap,
    title: "Solar & Renewable Energy",
    subtitle: "Sustainable Energy Solutions",
    description:
      "High-efficiency solar installations with smart grid integration and battery storage for sustainable energy independence.",
    features: [
      "Grid Integration",
      "Battery Storage",
      "Smart Monitoring",
      "ROI Tracking",
    ],
    image: Solar_image,
  },
  {
    icon: Network,
    subtitle: "Robust Networking & IT Infrastructure",
    title: "Data center setup",
    description:
      " Secure, scalable communication and networking solutions to support enterprise operations.",
    features: ["Fiber Optic", "WiFi 6", "Cloud Integration", "24/7 Support"],
    image: It_infrastructure,
  },
  {
    icon: Volume2,
    title: "Software Development.",
    subtitle: "",
    description:
      "Tailored technology solutions crafted to meet unique business and government requirements",
    features: ["Erp sollution", "HRMS", "software Development"],
    image: PA_sound,
  },
];

/* =============================
   Variants
   ============================= */
const featureItem = (i: number): Variants => ({
  hidden: { opacity: 0, x: 12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { ...MOTION_TIMING, delay: 0.05 * i },
  },
});

/* =============================
   Component (pure brand theme)
   ============================= */
export default function SolutionsSection() {
  return (
    <section
      id="solutions"
      className="relative overflow-hidden min-h-screen scroll-mt-28 py-20 md:py-28"
      style={{ backgroundColor: THEME.bg }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Heading */}
        <div className="text-center space-y-6 mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0, transition: MOTION_TIMING }}
            viewport={{ once: true, amount: 0.5 }}
            className="inline-block"
          >
            <Badge
              variant="outline"
              className="rounded-full border"
              style={{
                color: BRAND,
                borderColor: THEME.ring,
                background: softMonoGradient(BRAND, 0.08),
                backdropFilter: "blur(6px)",
              }}
            >
              <Star className="w-3 h-3 mr-1" style={{ color: BRAND }} /> Our
              Expertise
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { ...MOTION_TIMING, delay: 0.05 },
            }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-xl md:text-3xl font-bold"
            style={{ color: THEME.text }}
          >
            Comprehensive Technology Solutions Tailored for You
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { ...MOTION_TIMING, delay: 0.1 },
            }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-lg md:text-xl max-w-xl mx-auto"
            style={{ color: THEME.subText }}
          >
            Discover our comprehensive range designed to secure, automate, and
            optimize your operations.
          </motion.p>
        </div>

        {/* Solutions */}
        <div className="space-y-28 md:space-y-32">
          {solutions.map((solution, index) => {
            const contentFrom = randomDirection(index);
            const imageFrom = { x: -contentFrom.x, y: -contentFrom.y };
            const contentDelay = randomDelay(index, 0.05, 0.25);
            const imageDelay = randomDelay(index, 0.12, 0.25);
            const isOdd = index % 2 === 1;

            return (
              <div key={index} className="space-y-10">
                <div
                  className={`grid lg:grid-cols-2 gap-14 items-center ${
                    isOdd ? "lg:grid-flow-col-dense" : ""
                  }`}
                >
                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: contentFrom.x, y: contentFrom.y }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      transition: { ...MOTION_TIMING, delay: contentDelay },
                    }}
                    viewport={{ once: false, amount: 0.35 }}
                    className={`${isOdd ? "lg:col-start-2" : ""}`}
                  >
                    <div className="space-y-6">
                      {solution.popular && (
                        <Badge
                          className="rounded-full border-0"
                          style={{
                            color: "#fff",
                            background: monoGradient(BRAND),
                          }}
                        >
                          <Star className="w-3 h-3 mr-1" /> Most Popular
                        </Badge>
                      )}

                      {/* Floating icon tile — mono brand */}
                      <motion.div
                        {...floatForever}
                        className="inline-flex p-4 rounded-3xl"
                        style={{ background: softMonoGradient(BRAND, 0.12) }}
                      >
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{ background: monoGradient(BRAND_DARK) }}
                        >
                          <solution.icon
                            className="h-8 w-8"
                            style={{ color: "#fff" }}
                          />
                        </div>
                      </motion.div>

                      <div className="space-y-3">
                        <p
                          className="text-sm font-medium bg-clip-text text-transparent"
                          style={{ backgroundImage: monoGradient(BRAND) }}
                        >
                          {solution.subtitle}
                        </p>
                        <h3
                          className="text-3xl lg:text-4xl font-bold"
                          style={{ color: THEME.text }}
                        >
                          {solution.title}
                        </h3>
                        <p className="text-lg" style={{ color: THEME.subText }}>
                          {solution.description}
                        </p>
                      </div>

                      {/* Features */}
                      <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.35 }}
                        className="grid grid-cols-2 gap-4"
                      >
                        {solution.features.map((f, i) => (
                          <motion.div
                            key={`${f}-${i}`}
                            variants={featureItem(i)}
                            className="flex items-center space-x-3"
                          >
                            <span
                              className="w-2 h-2 rounded-full block"
                              style={{ background: BRAND }}
                            />
                            <span
                              className="font-medium"
                              style={{ color: THEME.text }}
                            >
                              {f}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                          className="border-0 rounded-full hover:shadow-xl hover:scale-[1.02] transition"
                          size="lg"
                          asChild
                          style={{
                            color: "#fff",
                            background: monoGradient(BRAND),
                          }}
                        >
                          <a href="#contact">
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-full transition"
                          size="lg"
                          style={{
                            borderColor: THEME.ring,
                            background: softMonoGradient(BRAND, 0.08),
                            color: THEME.text,
                          }}
                        >
                          view
                        </Button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Image — brand-only background auras */}
                  <motion.div
                    initial={{ opacity: 0, x: imageFrom.x, y: imageFrom.y }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      transition: { ...MOTION_TIMING, delay: imageDelay },
                    }}
                    viewport={{ once: false, amount: 0.35 }}
                    className={`${isOdd ? "lg:col-start-1" : ""}`}
                  >
                    <div className="relative group">
                      {/* brand aura layers (no multicolors) */}
                      <div
                        className="absolute inset-0 rounded-[3rem] rotate-6 group-hover:rotate-3 transition-transform duration-500"
                        style={{ background: softMonoGradient(BRAND, 0.16) }}
                      />
                      <div
                        className="absolute inset-0 rounded-[3rem] -rotate-6 group-hover:-rotate-3 transition-transform duration-500"
                        style={{ background: softMonoGradient(BRAND, 0.08) }}
                      />

                      <Card className="relative border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-[3rem] overflow-hidden group-hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                        <div className="aspect-[4/3] relative">
                          <Image
                            src={solution.image}
                            alt={solution.title || solution.subtitle}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority={index < 2}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Floating stat chip */}
                        {/* <div className="absolute top-6 right-6">
                          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                            <div className="text-center">
                              <div
                                className="text-2xl font-bold bg-clip-text text-transparent"
                                style={{ backgroundImage: monoGradient(BRAND) }}
                              >
                                99%
                              </div>
                              <div className="text-xs text-gray-600">
                                Uptime
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </Card>
                    </div>
                  </motion.div>
                </div>

                {/* Separator */}
                {index < solutions.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0.8 }}
                    whileInView={{
                      opacity: 1,
                      scaleX: 1,
                      transition: { ...MOTION_TIMING, delay: 0.1 },
                    }}
                    viewport={{ once: true, amount: 0.6 }}
                    className="h-px w-full"
                    style={{ backgroundColor: THEME.ring }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
