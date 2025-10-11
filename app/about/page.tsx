"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, useAnimation } from "framer-motion";
import CapabilitiesOrbit from "@/components/Capital";
import {
  ShieldCheck,
  Cpu,
  Home,
  Network,
  Radio,
  Factory,
  Sparkles,
  Target,
  Eye,
  Trophy,
  Users2,
  Camera,
  Building2,
  ChevronRight,
} from "lucide-react";
import OurJourney from "@/components/our_journey";
import ValuesSection from "@/components/ValuesSection";
const banner_image = "/b with services.png";
/** ----------------------------------------------------------------
 *  Brand & Motion (re-trigger on every scroll)
 *  ----------------------------------------------------------------*/
const BRAND = "#07518a";
type Dir = "left" | "right";

const slideVariants = (dir: Dir, delay = 0): Variants => {
  const x = dir === "left" ? -40 : 40;
  return {
    hidden: { opacity: 0, x },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut", delay },
    },
  };
};

const containerStagger: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const whileHoverLift = {
  whileHover: { y: -4, scale: 1.01, transition: { duration: 0.2 } },
};

function Section(
  props: React.PropsWithChildren<{ className?: string; id?: string }>
) {
  return (
    <section
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
        props.className || ""
      }`}
      id={props.id}
    >
      {props.children}
    </section>
  );
}

/** Reveal that re-plays on every enter/leave */
function RevealSlideLoop({
  children,
  className,
  dir,
  amount = 0.25,
  delay = 0,
  margin = "0px 0px -10% 0px",
}: React.PropsWithChildren<{
  className?: string;
  dir: Dir;
  amount?: number;
  delay?: number;
  margin?: string;
}>) {
  const controls = useAnimation();
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={controls}
      variants={slideVariants(dir, delay)}
      viewport={{ amount, margin, once: false }}
      onViewportEnter={() => controls.start("visible")}
      onViewportLeave={() => controls.start("hidden")}
    >
      {children}
    </motion.div>
  );
}

const sectors = [
  {
    title: "Government & Elections",
    img: "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1920&auto=format&fit=crop",
  },
  {
    title: "Border & Defence",
    img: "https://images.unsplash.com/photo-1611784013227-006affc1bf52?q=80&w=1920&auto=format&fit=crop",
  },
  {
    title: "Banking & Financial Services",
    img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1920&auto=format&fit=crop",
  },
  {
    title: "Industrial & Warehousing",
    img: "https://images.unsplash.com/photo-1581094271901-8022df4466b9?q=80&w=1920&auto=format&fit=crop",
  },
  {
    title: "Commercial & Real Estate",
    img: "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?q=80&w=1920&auto=format&fit=crop",
  },
  {
    title: "Education & Healthcare",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1920&auto=format&fit=crop",
  },
] as const;

const stats = [
  { icon: Trophy, label: "Years of Excellence", value: "18+" },
  { icon: Users2, label: "Customers", value: "12,000+" },
  { icon: Camera, label: "Cameras Installed", value: "2M+" },
  { icon: Building2, label: "Team", value: "300+" },
] as const;

const capabilities = [
  {
    icon: ShieldCheck,
    title: "E-Security & ELV",
    desc: "CCTV, ANPR, Fire/Intrusion Alarms, Access Control, VMS.",
  },
  {
    icon: Home,
    title: "Home Automation",
    desc: "Smart homes with secure access, surveillance and energy control.",
  },
  {
    icon: Cpu,
    title: "AI-Driven Software",
    desc: "Video analytics, face recognition, VMS, dashboards, automations.",
  },
  {
    icon: Radio,
    title: "IoT & Edge",
    desc: "Smart poles, sensors, GPS/MDVR, analytics at the edge.",
  },
  {
    icon: Network,
    title: "IT & Telecom",
    desc: "Servers, networking, fiber, data centers, IP PBX/EPABX.",
  },
  {
    icon: Factory,
    title: "Make-in-India",
    desc: "In-house manufacturing: TrinAI cameras, TechnoRack, systems.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="bg-gradient-to-b from-white to-slate-50/60">
      {/* ---------- HERO ---------- */}
      <div className="relative overflow-hidden">
        {/* backdrop blobs (brand color) */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[rgba(7,81,138,0.10)] blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[rgba(7,81,138,0.10)] blur-3xl" />
        </div>

        <Section className="pt-16 md:pt-24 lg:pt-28">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Hero text (left) */}
            <RevealSlideLoop dir="left">
              <motion.div
                variants={containerStagger}
                initial="hidden"
                animate="visible"
              >
                <motion.span
                  variants={slideVariants("left")}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-slate-700"
                  aria-label="Company tagline"
                  style={{ backgroundColor: "rgba(7,81,138,0.06)" }}
                >
                  <Sparkles className="h-3.5 w-3.5" style={{ color: BRAND }} />
                  Since 2006 • Next-Gen Innovation
                </motion.span>

                <motion.h1
                  variants={slideVariants("left")}
                  className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl"
                >
                  Building a{" "}
                  <span
                    className="text-[color:var(--brand)]"
                    style={{ ["--brand" as any]: BRAND }}
                  >
                    Connected, Secure
                  </span>{" "}
                  &{" "}
                  <span
                    className="text-[color:var(--brand)]"
                    style={{ ["--brand" as any]: BRAND }}
                  >
                    Sustainable
                  </span>{" "}
                  Future
                </motion.h1>

                <motion.p
                  variants={slideVariants("left")}
                  className="mt-4 max-w-xl text-slate-600"
                >
                  Brihaspathi Technologies delivers E-Security, Home Automation,
                  AI-driven Software, IoT, ELV and IT/Telecom solutions —
                  engineered to transform industries and cities.
                </motion.p>

                <motion.div
                  variants={slideVariants("left")}
                  className="mt-6 flex flex-wrap items-center gap-3"
                >
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-95"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${BRAND}, ${BRAND})`,
                    }}
                  >
                    Talk to us <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                  <Link
                    href="/solutions"
                    className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-100"
                    style={{ backgroundColor: "white" }}
                  >
                    Explore Solutions
                  </Link>
                </motion.div>

                {/* stats */}
                <motion.div
                  variants={containerStagger}
                  className="mt-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-4"
                >
                  {stats.map((s, i) => (
                    <motion.div
                      key={s.label}
                      variants={slideVariants(i % 2 === 0 ? "left" : "right")}
                      className="rounded-xl bg-white/80 p-4 text-center shadow-sm backdrop-blur"
                      whileHover={{ scale: 1.03 }}
                      transition={{
                        type: "spring",
                        stiffness: 240,
                        damping: 18,
                      }}
                    >
                      <s.icon
                        className="mx-auto h-5 w-5"
                        style={{ color: BRAND }}
                      />
                      <div className="mt-2 text-xl font-semibold text-slate-900">
                        {s.value}
                      </div>
                      <div className="text-xs text-slate-500">{s.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </RevealSlideLoop>

            {/* Hero image (right) */}
            <CapabilitiesOrbit />
          </div>
        </Section>
      </div>

      {/* ---------- MISSION / VISION ---------- */}
      <Section className="mt-16 md:mt-24" id="mission-vision">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Target,
              title: "Our Mission",
              desc: "Design and deliver state-of-the-art security & surveillance solutions that address today’s challenges and strengthen safety.",
            },
            {
              icon: Eye,
              title: "Our Vision",
              desc: "Lead the surveillance industry with tailor-made, innovative, integrated solutions at competitive prices — built on long-term trust.",
            },
          ].map((card, i) => (
            <RevealSlideLoop
              key={card.title}
              dir={i % 2 === 0 ? "left" : "right"}
            >
              <div
                className="group relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-sm"
                {...whileHoverLift}
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-transparent to-transparent transition group-hover:from-[rgba(7,81,138,0.05)] group-hover:to-[rgba(7,81,138,0.05)]" />
                <card.icon className="h-6 w-6" style={{ color: BRAND }} />
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {card.desc}
                </p>
              </div>
            </RevealSlideLoop>
          ))}
        </div>
      </Section>

      {/* ---------- WHAT WE DO ---------- */}
      <Section className="mt-16 md:mt-24" id="capabilities">
        <RevealSlideLoop dir="left" className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            End-to-End Capability. Enterprise Scale.
          </h2>
        </RevealSlideLoop>
        <RevealSlideLoop dir="right" className="text-center">
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            From edge devices to platforms and field execution, we bring
            integrated solutions across E-Security, Software, IoT and
            IT/Telecom.
          </p>
        </RevealSlideLoop>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <RevealSlideLoop key={c.title} dir={i % 2 === 0 ? "left" : "right"}>
              <div
                className="h-full rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
                {...whileHoverLift}
              >
                <c.icon className="h-6 w-6" style={{ color: BRAND }} />
                <h3 className="mt-3 text-base font-semibold text-slate-900">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
              </div>
            </RevealSlideLoop>
          ))}
        </div>
      </Section>

      {/* ---------- MILESTONES (TIMELINE) ---------- */}
      {/* <Section className="mt-16 md:mt-24" id="journey">
        <RevealSlideLoop dir="left" className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Our Journey
          </h2>
        </RevealSlideLoop>
        <RevealSlideLoop dir="right" className="text-center">
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            A footprint of nation-scale programs and domain firsts across
            elections, border, smart cities and education.
          </p>
        </RevealSlideLoop>

        <div className="relative mt-8">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-200 sm:left-1/2" />
          <div className="space-y-8">
            {[
              {
                year: "2006",
                title: "Started with Web & Marketing Services",
                side: "left" as const,
              },
              {
                year: "2014",
                title: "City Surveillance • Kurnool Smart City",
                side: "right" as const,
              },
              {
                year: "2016",
                title: "Sand Mine Surveillance via Radio Tech",
                side: "left" as const,
              },
              {
                year: "2021",
                title: "Make-in-India • In-house Manufacturing",
                side: "right" as const,
              },
              {
                year: "2023–24",
                title: "Election Webcasting • 100,000+ Cameras",
                side: "left" as const,
              },
              {
                year: "2025",
                title: "NEET, MHCET, TGBIE • 78,000+ Exam Cams",
                side: "right" as const,
              },
            ].map((e) => (
              <RevealSlideLoop key={e.year} dir={e.side}>
                <div className="relative grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
                  <div
                    className={`rounded-xl bg-white p-5 shadow-sm sm:pr-10 ${
                      e.side === "left" ? "" : "sm:order-3 sm:pl-10"
                    }`}
                  >
                    <div
                      className="text-xs font-medium"
                      style={{ color: BRAND }}
                    >
                      {e.year}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">
                      {e.title}
                    </div>
                  </div>
                  <div
                    className="mx-auto hidden h-3 w-3 rounded-full bg-[color:var(--brand)] shadow sm:block"
                    style={{ ["--brand" as any]: BRAND }}
                  />
                  <div className="hidden sm:block" />
                </div>
              </RevealSlideLoop>
            ))}
          </div>
        </div>
      </Section> */}

      <OurJourney />

      {/* ---------- SECTORS ---------- */}
      {/* <Section className="mt-16 md:mt-24" id="sectors">
        <RevealSlideLoop dir="left" className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Sector-wise Excellence
          </h2>
        </RevealSlideLoop>
        <RevealSlideLoop dir="right" className="text-center">
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Banking, Government, Defence, Industrial/Warehousing, Commercial,
            Residential and Education.
          </p>
        </RevealSlideLoop>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s, i) => (
            <RevealSlideLoop key={s.title} dir={i % 2 === 0 ? "left" : "right"}>
              <div
                className="group overflow-hidden rounded-2xl bg-white shadow-sm"
                {...whileHoverLift}
              >
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    {s.title}
                  </div>
                </div>
              </div>
            </RevealSlideLoop>
          ))}
        </div>
      </Section> */}
      <ValuesSection />
      {/* ---------- ACHIEVEMENTS HIGHLIGHTS ---------- */}
      <Section className="mt-16 md:mt-24" id="achievements">
        <RevealSlideLoop dir="left">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" style={{ color: BRAND }} />
              <h3 className="text-lg font-semibold text-slate-900">
                Recent Milestones
              </h3>
            </div>
            <ul className="mt-3 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <li>
                • General Elections 2024: deployed 100,000+ cameras & command
                centers.
              </li>
              <li>
                • NEET-NTA 2025: 65,000+ cameras; centralized real-time
                monitoring.
              </li>
              <li>• MHCET 2025: 4,500+ cameras across Maharashtra.</li>
              <li>• TGBIE IPE 2025: 8,500+ cameras, live monitored.</li>
              <li>
                • BSF Borders (Rajasthan & Bengal): 674 cameras for perimeter
                security.
              </li>
              <li>
                • Kaziranga National Park: IP thermal & ANPR for conservation.
              </li>
              <li>
                • Solar/Smart Pole rollouts, REIL 5MW & MEDA school rooftops.
              </li>
            </ul>
            <div className="mt-4">
              <Link
                href="/case-studies"
                className="inline-flex items-center text-sm font-medium hover:underline"
                style={{ color: BRAND }}
              >
                Browse case studies <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </RevealSlideLoop>
      </Section>

      {/* ---------- CTA ---------- */}
      <Section className="my-16 md:my-24">
        <RevealSlideLoop dir="right">
          <div
            className="relative overflow-hidden rounded-2xl p-6 text-white"
            style={{
              backgroundImage: `linear-gradient(90deg, ${BRAND}, ${BRAND})`,
            }}
          >
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <h3 className="text-xl font-semibold">
              Ready to secure what matters?
            </h3>
            <p className="mt-1 max-w-2xl text-white/90">
              Speak with our experts about enterprise surveillance, AI video
              analytics, and IoT-enabled deployments.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-white/90"
              >
                Get a Quote
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
              >
                View Products
              </Link>
            </div>
          </div>
        </RevealSlideLoop>
      </Section>
    </main>
  );
}
