"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, Globe2 } from "lucide-react";
import MDLeadershipCard from "@/components/MDLeadershipCard";
import ForumsMembershipSection from "@/components/ForumsMembershipSection";
import AwardsSection from "@/components/AwardsSection";

/* =========================================
   Brand & Assets
========================================= */
const BRAND = "#07518a";
const HERO_IMAGE = "/MD_S_Corporate_Head_shot.-removebg-preview.png"; // ensure this exists in /public

/* =========================================
   Types & Data
========================================= */
type Contact = {
  phones: string[];
  emails: string[];
  website: string;
  location: string;
};
type Education = {
  degree: string;
  institution: string;
  year?: string | number;
};
type Experience = {
  title: string;
  org: string;
  start?: string | number;
  end?: string;
};

type PageOneProfile = {
  name: string;
  title: string;
  company: string;
  contact: Contact;
  summary: string;
  experience: Experience[];
  education: Education[];
};

const page1Data: PageOneProfile = {
  name: "Rajasekhar Papolu",
  title: "Managing Director | Technology Innovator | Business Leader",
  company: "Brihaspathi Technologies Limited",
  contact: {
    phones: ["+91 9676012345", "+91 9032699999"],
    emails: ["md@brihaspathi.com", "rajas2121@gmail.com"],
    website: "https://www.brihaspathi.com",
    location: "Hyderabad, India",
  },
  summary:
    "Visionary technology entrepreneur with 15+ years in IT, AI-driven security, smart governance, and digital transformation. Leads large-scale AI & IoT programs for government, banking, and enterprise; specializes in designing digital solutions that enhance governance, security, and operational efficiency.",
  experience: [
    {
      title: "Managing Director",
      org: "Brihaspathi Technologies Limited",
      start: 2011,
      end: "Present",
    },
  ],
  education: [
    {
      degree: "MBA, Master of Business Administration",
      institution: "Osmania University",
      year: 2012,
    },
    {
      degree: "B.Tech, Computer Science Engineering",
      institution: "JNTU Hyderabad",
      year: 2009,
    },
  ],
};

/* =========================================
   Motion Helpers
========================================= */
const spring = { type: "spring", stiffness: 120, damping: 18, mass: 0.7 };

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24, filter: "blur(4px)" as any },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" as any },
  viewport: { once: true, amount: 0.25 },
  transition: { ...spring, delay },
});

/* =========================================
   HERO (92svh, brand bg, one-time slide-in, clean image)
========================================= */
function Hero({ data }: { data: PageOneProfile }) {
  const reduce = useReducedMotion();
  const entrance = {
    initial: { x: "-10%", opacity: 0 },
    animate: { x: "6%", opacity: 1 },
    transition: reduce
      ? { duration: 0.01 }
      : { type: "tween", duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden h-[92svh] min-h-[560px]"
      style={{ backgroundColor: BRAND }}
    >
      {/* Subtle sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at -10% -20%, rgba(255,255,255,0.12), transparent 60%), radial-gradient(1200px 600px at 110% -10%, rgba(255,255,255,0.08), transparent 60%)",
        }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 0.45 }}
        transition={
          reduce
            ? { duration: 0.01 }
            : { duration: 2.2, repeat: Infinity, repeatType: "reverse" }
        }
        className="absolute -left-[10%] top-1/2 h-[120%] w-[70%] -translate-y-1/2 rotate-[12deg] bg-white/10 blur-3xl"
      />

      <div className="mx-auto grid h-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-14">
        {/* LEFT: company chip, name, QUOTE */}
        <motion.div
          initial={entrance.initial}
          animate={entrance.animate}
          transition={entrance.transition}
          className="relative"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold sm:text-xs"
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white",
            }}
          >
            <Globe2 size={14} color="#fff" />
            <span className="truncate">{data.company}</span>
          </div>

          <h1
            className="mt-3 font-black tracking-tight text-white"
            style={{ fontSize: "clamp(28px, 4.5vw, 56px)", lineHeight: 1.08 }}
          >
            {data.name}
          </h1>

          <blockquote
            className="mt-5 border-l-4 pl-4 text-white/95 sm:mt-6"
            style={{ borderColor: "rgba(255,255,255,0.6)" }}
          >
            <p
              className="leading-relaxed"
              style={{ fontSize: "clamp(16px, 2.3vw, 20px)" }}
            >
              “He envisions technology not just as innovation, but as governance
              in motion — transforming cities, securing nations, and empowering
              enterprises through the intelligence of AI and the precision of
              IoT.”
            </p>
          </blockquote>
        </motion.div>

        {/* RIGHT: clean image */}
        <motion.div
          initial={{ y: 8, scale: 0.99, opacity: 0.95 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={
            reduce
              ? { duration: 0.01 }
              : { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }
          }
          className="relative mx-auto w-full max-w-[520px] sm:max-w-[560px] mt-12"
        >
          <div
            className="relative w-full overflow-visible"
            style={{ aspectRatio: "4 / 5" }}
          >
            <Image
              src={HERO_IMAGE}
              alt={data.name}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 560px"
              className="object-contain will-change-transform"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================
   TITLE + MDLeadershipCard (the two-column animated card)
========================================= */
function LeadershipSection() {
  return (
    <section aria-label="Leadership" className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"></div>
      <MDLeadershipCard />
    </section>
  );
}

/* =========================================
   EXPERIENCE
========================================= */

/* =========================================
   EDUCATION (certifications removed)
========================================= */

/* =========================================
   PAGE
========================================= */
export default function Page() {
  const data = page1Data;

  return (
    <main className="w-full selection:bg-[rgba(7,81,138,0.15)] selection:text-slate-900">
      <Hero data={data} />
      <LeadershipSection />

      {/* Forums membership (keep or remove as you wish) */}
      <ForumsMembershipSection />

      <AwardsSection />
      {/* Footer/contact/certifications/awards removed as requested */}
    </main>
  );
}
