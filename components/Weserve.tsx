"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Globe2, Play, Pause, CheckCircle2 } from "lucide-react";

/* =====================================================
   Weserve — simplified without KPIs or video controls
   ===================================================== */

export type WeserveProps = {
  videoSrc?: string;
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, {
    margin: "-20% 0px -20% 0px",
    once: false,
  });
  const [isPlaying, setIsPlaying] = useState(true);

  const cities = useMemo(() => {
    const seen = new Set<string>();
    return locations
      .map((c) => (c || "").trim())
      .filter(Boolean)
      .filter((c) =>
        seen.has(c.toLowerCase()) ? false : (seen.add(c.toLowerCase()), true)
      );
  }, [locations]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = async () => {
      try {
        v.muted = true;
        await v.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    if (inView) {
      tryPlay();
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, [inView]);

  const cityToXY = (name: string) => {
    const key = name.toLowerCase();
    const anchors: Record<string, [number, number]> = {
      dubai: [0.58, 0.45],
      india: [0.62, 0.55],
      us: [0.2, 0.42],
      usa: [0.2, 0.42],
      europe: [0.48, 0.35],
      uk: [0.46, 0.32],
      singapore: [0.73, 0.7],
      australia: [0.86, 0.82],
    };
    if (anchors[key]) return anchors[key];
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    const x = 0.1 + (h % 7000) / 10000;
    const y = 0.25 + (Math.floor(h / 7000) % 6000) / 10000;
    return [Math.min(0.9, x), Math.min(0.9, y)];
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      aria-label="Global presence section"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-indigo-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,6,23,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,6,23,0.06)_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28 relative">
        <div className="grid items-stretch gap-10 md:grid-cols-2">
          {/* LEFT */}
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

          {/* RIGHT: Video without controls or background overlays */}
          <div className="relative isolate w-full min-h-[22rem] sm:min-h-[26rem] md:min-h-[30rem] lg:min-h-[34rem] overflow-hidden rounded-3xl shadow-xl">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={videoSrc}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              preload="metadata"
              aria-label="Showcase video"
            />

            {/* World overlay (SVG) with animated pins driven by cities */}
            <div className="absolute inset-0 pointer-events-none">
              <svg
                viewBox="0 0 1000 500"
                className="h-full w-full opacity-50 mix-blend-luminosity"
              >
                <defs>
                  <linearGradient id="glow" x1="0" x2="1">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <path
                  d="M10,250 C100,80 300,60 420,120 C540,180 700,130 840,150 C900,160 960,210 990,250 C960,290 900,340 840,350 C700,370 540,320 420,380 C300,440 100,420 10,250 Z"
                  fill="url(#glow)"
                  fillOpacity="0.08"
                  stroke="url(#glow)"
                  strokeOpacity="0.25"
                />
                {cities.map((c, i) => {
                  const [nx, ny] = cityToXY(c);
                  const x = nx * 1000;
                  const y = ny * 500;
                  return (
                    <g key={c} transform={`translate(${x}, ${y})`}>
                      <motion.circle
                        r={5}
                        fill="url(#glow)"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.05,
                          type: "spring",
                          stiffness: 160,
                          damping: 14,
                        }}
                      />
                      <motion.circle
                        r={12}
                        fill="none"
                        stroke="url(#glow)"
                        strokeOpacity={0.6}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{
                          scale: [0.9, 1.1, 0.9],
                          opacity: [0.35, 0.7, 0.35],
                        }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.08,
                        }}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {cities.length > 0 && (
          <div className="mt-10">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm">
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: [0, -400] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="flex gap-6 whitespace-nowrap px-6 py-3 text-sm font-medium text-slate-700"
              >
                {Array.from({ length: 3 }).map((_, loop) => (
                  <span key={loop} className="flex items-center gap-6">
                    {cities.map((c) => (
                      <span
                        key={`${c}-${loop}`}
                        className="inline-flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" /> {c}
                      </span>
                    ))}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
