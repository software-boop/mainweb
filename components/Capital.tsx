// components/AnimatedCapabilitiesOrbit.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  motion,
  useInView,
  useAnimationControls,
  Variants,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "framer-motion";
import {
  Camera,
  RadioTower,
  Home,
  Lightbulb,
  Network,
  Brain,
} from "lucide-react";

/* ===== Brand + canvas ===== */
const BRAND = "#07518a";
const VW = 1200; // virtual SVG width
const VH = 600; // virtual SVG height
const CX = VW / 2;
const CY = VH / 2;

/* ===== Node placement (approx. your layout) ===== */
type NodeSpec = {
  id: string;
  label: string;
  x: number; // in SVG coordinates (0..VW)
  y: number; // in SVG coordinates (0..VH)
  align?: "left" | "right";
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const NODES: NodeSpec[] = [
  {
    id: "esec",
    label: "E-Security",
    x: 430,
    y: 120,
    align: "left",
    Icon: Camera,
  },
  {
    id: "it",
    label: "IT/Telecom",
    x: 980,
    y: 90,
    align: "right",
    Icon: RadioTower,
  },
  {
    id: "home",
    label: "Home Automation",
    x: 1060,
    y: 310,
    align: "right",
    Icon: Home,
  },
  { id: "elv", label: "ELV", x: 900, y: 480, align: "right", Icon: Lightbulb },
  {
    id: "iot",
    label: "Internet of Things",
    x: 360,
    y: 520,
    align: "left",
    Icon: Network,
  },
  {
    id: "ai",
    label: "AI-driven Software",
    x: 210,
    y: 360,
    align: "left",
    Icon: Brain,
  },
];

/* ===== Helpers ===== */
function curvePathTo(x: number, y: number) {
  const vx = x - CX;
  const vy = y - CY;
  const mx = CX + vx * 0.5;
  const my = CY + vy * 0.5;
  const len = Math.hypot(vx, vy) || 1;
  const px = (-vy / len) * (len * 0.18);
  const py = (vx / len) * (len * 0.18);
  const cpx = mx + px;
  const cpy = my + py;
  return `M ${CX},${CY} Q ${cpx},${cpy} ${x},${y}`;
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number
) {
  const s = polarToCartesian(cx, cy, r, end);
  const e = polarToCartesian(cx, cy, r, start);
  const largeArcFlag = end - start <= 180 ? "0" : "1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${e.x} ${e.y}`;
}
function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* ===== Variants ===== */
const root: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { when: "beforeChildren" } },
};

const centerOrb: Variants = {
  hidden: { scale: 0.6, opacity: 0, rotate: -8 },
  show: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};

const nodeVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.3 + i * 0.08,
    },
  }),
};

const pathVariant = (i: number, duration = 1.35): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration, ease: [0.42, 0, 0.2, 1], delay: 0.15 + i * 0.06 },
      opacity: { duration: 0.3, delay: 0.15 + i * 0.06 },
    },
  },
});

/* ===== Component ===== */
export default function AnimatedCapabilitiesOrbit() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.35 });
  const controls = useAnimationControls();
  const reduce = useReducedMotion();

  // pointer parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useTransform(my, [-0.5, 0.5], [6, -6]); // degrees-ish
  const tiltY = useTransform(mx, [-0.5, 0.5], [-6, 6]);
  const nudgeX = useTransform(mx, [-0.5, 0.5], [-8, 8]);
  const nudgeY = useTransform(my, [-0.5, 0.5], [-6, 6]);

  useEffect(() => {
    if (!inView) return;
    controls.start("show");
  }, [inView, controls]);

  // NOTE: we removed the continuous rotation on the center orb to keep it static, as requested.

  const paths = useMemo(() => NODES.map((n) => curvePathTo(n.x, n.y)), []);

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    mx.set(x - 0.5);
    my.set(y - 0.5);
  };

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2
            className="text-2xl md:text-3xl font-extrabold tracking-tight"
            style={{ color: BRAND }}
          >
            Our Capabilities
          </h2>
          <p className="mt-2 text-slate-600">
            Security, automation, software, and connectivity—integrated
            end-to-end.
          </p>
        </div>

        {/* Interactive canvas */}
        <motion.div
          ref={wrapRef}
          variants={root}
          initial="hidden"
          animate={controls}
          className="relative w-full overflow-hidden rounded-2xl bg-white"
          style={{
            // gentle 3D tilt
            rotateX: reduce ? 0 : (tiltX as any),
            rotateY: reduce ? 0 : (tiltY as any),
            transformStyle: "preserve-3d",
            perspective: 900,
          }}
          onMouseMove={onMove}
          onMouseLeave={() => {
            mx.set(0);
            my.set(0);
            setHoveredId(null);
          }}
        >
          {/* SVG layer (paths + center) */}
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="w-full h-auto select-none"
          >
            {/* dashed routes */}
            {paths.map((d, i) => {
              const id = NODES[i].id;
              const isHover = hoveredId === id;
              return (
                <motion.path
                  key={`p-${id}`}
                  d={d}
                  stroke={BRAND}
                  strokeWidth={isHover ? 5 : 3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="10 12"
                  fill="none"
                  variants={pathVariant(i)}
                  // allow hover on the stroke itself
                  style={{
                    filter: "url(#shadow)",
                    pointerEvents: "stroke" as any,
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredId(id)}
                  onMouseLeave={() =>
                    setHoveredId((cur) => (cur === id ? null : cur))
                  }
                  animate={{
                    opacity: isHover ? 1 : 0.9,
                  }}
                  transition={{ opacity: { duration: 0.2 } }}
                />
              );
            })}

            {/* Center orb group — static after entrance (no continuous animation) */}
            <motion.g variants={centerOrb}>
              {/* soft halo */}
              <circle
                cx={CX}
                cy={CY}
                r={116}
                stroke={BRAND}
                strokeOpacity="0.08"
                strokeWidth={28}
                fill="none"
              />
              {/* main disc */}
              <circle cx={CX} cy={CY} r={92} fill={BRAND} />
              {/* white arc */}
              <path
                d={describeArc(CX, CY, 84, 210, 360)}
                fill="none"
                stroke="#ffffff"
                strokeWidth={18}
                strokeLinecap="round"
              />
              {/* beta glyph */}
              <text
                x={CX}
                y={CY + 10}
                textAnchor="middle"
                fontSize="72"
                fontWeight={700}
                fill="#ffffff"
                style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
              >
                β
              </text>
            </motion.g>

            {/* defs for subtle shadow */}
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="2"
                  floodColor={BRAND}
                  floodOpacity="0.12"
                />
              </filter>
            </defs>
          </svg>

          {/* HTML nodes on top (for crisp icons/text + motion values) */}
          {NODES.map((n, i) => {
            const left = (n.x / VW) * 100;
            const top = (n.y / VH) * 100;
            const isHover = hoveredId === n.id;

            return (
              <motion.div
                key={n.id}
                custom={i}
                variants={nodeVariant}
                className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  x: reduce ? 0 : (nudgeX as any),
                  y: reduce ? 0 : (nudgeY as any),
                }}
                onMouseEnter={() => setHoveredId(n.id)}
                onMouseLeave={() =>
                  setHoveredId((cur) => (cur === n.id ? null : cur))
                }
              >
                {/* icon disc */}
                <motion.div
                  className="flex h-16 w-16 items-center justify-center rounded-full shadow-sm"
                  style={{ backgroundColor: BRAND, cursor: "pointer" }}
                  animate={{
                    scale: isHover ? 1.18 : 1,
                    boxShadow: isHover
                      ? "0 18px 40px -10px rgba(7,81,138,0.35)"
                      : "0 10px 25px -5px rgba(0,0,0,0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <n.Icon size={28} color="#fff" />
                </motion.div>
                {/* label */}
                <motion.div
                  className={`mt-2 text-sm md:text-base font-medium ${
                    n.align === "right" ? "text-right" : "text-left"
                  }`}
                  style={{ color: BRAND, pointerEvents: "none" }}
                  animate={{ scale: isHover ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 250, damping: 18 }}
                >
                  {n.label}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
