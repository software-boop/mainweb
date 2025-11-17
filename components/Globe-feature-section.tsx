"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { motion, useInView } from "framer-motion";
import { MapPin, Globe2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* =====================================================
   Weserve — simplified without KPIs or video controls
   ===================================================== */

export type WeserveProps = {
  videoSrc?: string; // kept in props, not used visually (you can add <video> if needed)
  poster?: string;
  locations?: string[];
  title?: string;
  subtitle?: string;
};

export default function Weserve({
  videoSrc = "/Untitled design.mp4",
  poster,
  locations = ["India", "Dubai", "US"],
  title = "We serve",
  subtitle = "Global coverage. Local expertise.",
}: WeserveProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    margin: "-20% 0px -20% 0px",
    once: false,
  });

  // video control state preserved (no <video/> in markup by design)
  const [isPlaying, setIsPlaying] = useState(true);

  const cities = useMemo(() => {
    const seen = new Set<string>();
    return (locations ?? [])
      .map((c) => (c || "").trim())
      .filter(Boolean)
      .filter((c) =>
        seen.has(c.toLowerCase()) ? false : (seen.add(c.toLowerCase()), true)
      );
  }, [locations]);

  // Optional: hook you can extend if you re-add a <video> element later.
  useEffect(() => {
    // If you add a <video ref={videoRef}>, control it here with inView
    setIsPlaying(inView);
  }, [inView]);

  return (
    <section
      ref={sectionRef as any}
      className="relative w-full mx-auto overflow-hidden rounded-3xl bg-muted border border-gray-200 shadow-md px-6 py-16 md:px-16 md:py-24 lg:py-28 xl:py-32 bg-white   "
      style={{ height: "80vh" }}
    >
      <div className="flex flex-col-reverse items-center justify-between gap-10 md:flex-row">
        {/* Left: Text + Locations */}
        <div className="flex flex-col justify-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0% -10% 0%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
              <Globe2 className="h-4 w-4" /> Global Delivery
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              {title}{" "}
              <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
                worldwide
              </span>
            </h2>

            <p className="max-w-prose text-base sm:text-lg text-slate-600">
              {subtitle}
            </p>
          </motion.div>

          {/* Locations */}
          <div className="mt-2">
            <p className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Operating in
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {cities.map((place) => (
                <li
                  key={place}
                  className="group relative flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5"
                >
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600" />
                  <span className="font-medium text-slate-900">{place}</span>
                  <MapPin className="ml-auto h-4 w-4 text-slate-400 transition-opacity group-hover:opacity-100 opacity-60" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Globe wrapper (responsive) */}
        <div className="relative h-[220px] md:h-[280px] lg:h-[320px] xl:h-[320px] w-full max-w-64 lg:max-w-xl xl:max-w-96 mr-56">
          {" "}
          <Globe className="absolute -bottom-24 md:-bottom-24 lg:-bottom-20 xl:-bottom-16 -right-40 md:-right-44 lg:-right-48 xl:-right-56 scale-150 lg:scale-[1.8] xl:scale-[2.0]" />{" "}
        </div>
      </div>
    </section>
  );
}

/* ========================= Globe ========================= */

const GLOBE_CONFIG: Omit<COBEOptions, "width" | "height" | "onRender"> = {
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [21.0, 78.0], size: 0.08 }, // India
    { location: [39.8283, -98.5795], size: 0.08 }, // USA
    { location: [25.276987, 55.296249], size: 0.08 }, // Dubai
  ],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: typeof GLOBE_CONFIG;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // internals stored in refs so onRender always sees the latest values
  const phiRef = useRef(0);
  const dragAnchorRef = useRef<number | null>(null);
  const dragDeltaRef = useRef(0);
  const rotationRef = useRef(0);
  const sizeRef = useRef(0);

  const setCursor = (grabbing: boolean) => {
    if (canvasRef.current) {
      canvasRef.current.style.cursor = grabbing ? "grabbing" : "grab";
    }
  };

  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;
    sizeRef.current = canvasRef.current.offsetWidth;
  }, []);

  const handlePointerDown = (clientX: number) => {
    dragAnchorRef.current = clientX - dragDeltaRef.current;
    setCursor(true);
  };

  const handlePointerUpOrOut = () => {
    dragAnchorRef.current = null;
    setCursor(false);
  };

  const handleMove = (clientX: number) => {
    if (dragAnchorRef.current !== null) {
      const delta = clientX - dragAnchorRef.current;
      dragDeltaRef.current = delta;
      rotationRef.current = delta / 200; // sensitivity
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // initial size
    handleResize();
    window.addEventListener("resize", handleResize);

    const globe = createGlobe(canvasRef.current, {
      ...config,
      width: sizeRef.current * 2,
      height: sizeRef.current * 2,
      onRender: (state) => {
        if (dragAnchorRef.current === null) {
          // free-spin only when not dragging
          phiRef.current += 0.005;
        }
        state.phi = phiRef.current + rotationRef.current;
        state.width = sizeRef.current * 2;
        state.height = sizeRef.current * 2;
      },
    });

    // fade-in
    requestAnimationFrame(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      globe.destroy();
    };
  }, [config, handleResize]);

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-[300px]",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="w-full h-full opacity-0 transition-opacity duration-100 [contain:layout_paint_size]"
        onPointerDown={(e) => handlePointerDown(e.clientX)}
        onPointerUp={handlePointerUpOrOut}
        onPointerOut={handlePointerUpOrOut}
        onMouseMove={(e) => handleMove(e.clientX)}
        onTouchMove={(e) => e.touches[0] && handleMove(e.touches[0].clientX)}
      />
    </div>
  );
}
