// components/LifeAtBrihaspathi.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Image } from "antd";

const BRAND = "#07518a";

const IMAGES: { src: string; alt: string }[] = [
  {
    src: "/life/WhatsApp Image 2025-10-03 at 11.57.55 AM.jpeg",
    alt: "Tech huddle",
  },
  {
    src: "/life/Copy of Fathers day celebrations _ brihaspathi Technologies (5).jpeg",
    alt: "Team discussion",
  },
  {
    src: "/life/DEV04344.jpg",
    alt: "Open collaboration space",
  },
  {
    src: "/life/DSC04595.JPG",
    alt: "Work lounge",
  },
  {
    src: "/life/WhatsApp Image 2025-03-08 at 8.56.54 PM.jpeg",
    alt: "Workshop corner",
  },
  {
    src: "/life/WhatsApp Image 2025-09-16 at 14.43.04.jpeg",
    alt: "Learning moment",
  },

  // {
  //   src: "https://images.unsplash.com/photo-1512757776210-3f23f0b3c3d8?q=80&w=1600&auto=format&fit=crop",
  //   alt: "Breakout area",
  // },
  // {
  //   src: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=1600&auto=format&fit=crop",
  //   alt: "Creative lounge",
  // },
];

export default function LifeAtBrihaspathi() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  // Smooth header motion (slow parallax up + subtle fade while scrolling past the section)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacityRaw = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const y = useSpring(yRaw, { stiffness: 120, damping: 20, mass: 0.3 });
  const opacity = useSpring(opacityRaw, {
    stiffness: 120,
    damping: 20,
    mass: 0.3,
  });

  const scrollByPage = (dir: number) => {
    const el = railRef.current;
    if (!el) return;
    const page = el.clientWidth;
    el.scrollBy({ left: dir * (page - 80), behavior: "smooth" });
  };

  // Vertical wheel -> horizontal scroll (nice UX on trackpads/mice)
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: "smooth" });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-neutral-50"
      aria-labelledby="life-title"
    >
      <div className="mx-auto min-h-screen max-w-7xl px-6 flex flex-col">
        {/* Animated header */}
        <motion.div
          style={{ y, opacity }}
          className="pt-12 md:pt-16 text-center"
        >
          <h1
            id="life-title"
            className="text-[2.2rem] md:text-5xl font-semibold tracking-tight text-neutral-900"
          >
            Life at Brihaspathi
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 20,
              delay: 0.1,
            }}
            style={{ backgroundColor: BRAND, transformOrigin: "center" }}
            aria-hidden="true"
            className="mx-auto mt-3 h-[4px] w-24 rounded-full"
          />

          <p className="mx-auto mt-6 max-w-5xl text-base md:text-lg leading-7 text-neutral-700">
            Is working in E-Security, Automation, AI, IoT, and IT/Telecom
            boring? <strong>Not here!</strong> At BT, every day mixes hands-on
            builds with collaboration and plenty of energy. We’re a diverse team
            united by excellence, innovation, and shared values—offering room to
            learn, create, and grow. We also nurture intrapreneurship so people
            can explore ideas and unlock their full potential. Join us and
            discover a truly great place to work.
          </p>
        </motion.div>

        {/* Image rail with AntD preview */}
        <div className="relative mt-10 md:mt-14">
          <div
            ref={railRef}
            className="no-scrollbar grid grid-flow-col auto-cols-[85%] xs:auto-cols-[70%] sm:auto-cols-[55%] md:auto-cols-[45%] lg:auto-cols-[25%] gap-6 md:gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory"
            aria-label="Life at Brihaspathi gallery"
            role="region"
          >
            <Image.PreviewGroup
              preview={{
                rootClassName: "bt-image-preview", // lets us brand the preview UI below
              }}
            >
              {IMAGES.map(({ src, alt }, i) => (
                <motion.figure
                  key={i}
                  className="group snap-start relative aspect-[16/9] rounded-[18px] border border-neutral-200 bg-white overflow-hidden shadow-sm"
                  whileHover={{ y: -4 }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 18,
                    mass: 0.4,
                  }}
                >
                  {/* AntD Image; wrapper fills the card, inner img is styled via global CSS */}
                  <Image
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className="h-full w-full block"
                    rootClassName="bt-image"
                    preview
                    // optional: show a tiny brand-tinted hover mask icon text
                    // preview={{ mask: <span className="text-xs font-medium">Preview</span> }}
                  />
                </motion.figure>
              ))}
            </Image.PreviewGroup>
          </div>

          {/* BRAND-COLORED GAP between carousel and buttons */}
          <div
            className="mx-auto mt-6 md:mt-8 h-3 w-40 rounded-full"
            style={{ backgroundColor: BRAND }}
            aria-hidden="true"
          />

          {/* Controls (below the gap) */}
          <div className="mt-5 md:mt-6 flex items-center justify-center gap-4">
            <button
              aria-label="Previous images"
              onClick={() => scrollByPage(-1)}
              className="h-12 w-12 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-neutral-200 grid place-items-center hover:bg-white/90 transition"
            >
              <ChevronLeft size={20} color={BRAND} strokeWidth={2.4} />
            </button>
            <button
              aria-label="Next images"
              onClick={() => scrollByPage(1)}
              className="h-12 w-12 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-neutral-200 grid place-items-center hover:bg-white/90 transition"
            >
              <ChevronRight size={20} color={BRAND} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>

      {/* Global styles: hide scrollbar, make AntD Image fill/cover, brand the preview UI, and keep the hover scale */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Make AntD <Image> fill the figure and crop nicely */
        .bt-image {
          width: 100%;
          height: 100%;
          display: block;
        }
        .bt-image .ant-image-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
          will-change: transform;
        }
        /* Keep your subtle zoom on hover */
        .group:hover .bt-image .ant-image-img {
          transform: scale(1.03);
        }

        /* Brand the AntD Preview overlay actions */
        .bt-image-preview
          .ant-image-preview-operations
          .ant-image-preview-operations-operation {
          color: ${BRAND};
        }
        .bt-image-preview .ant-image-preview-switch-left,
        .bt-image-preview .ant-image-preview-switch-right {
          color: ${BRAND};
        }
        .bt-image-preview .ant-image-preview-progress {
          color: ${BRAND};
        }
        .bt-image-preview .ant-image-preview-operations {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: saturate(140%) blur(6px);
        }
      `}</style>
    </section>
  );
}
