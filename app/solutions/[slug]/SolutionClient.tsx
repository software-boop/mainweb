"use client";

import React, { useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, animate } from "framer-motion";

type Sol = {
  slug: string;
  title: string;
  summary?: string;
  image?: string;
  features?: string[];
  useCases?: string[];
  outcomes?: string[];
  cta?: { href: string; label: string };
};

export default function SolutionClient({
  solution,
  prev,
  next,
  related,
}: {
  solution: Sol;
  prev: Sol | null;
  next: Sol | null;
  related: Sol[];
}) {
  const featuresRef = useRef<HTMLElement | null>(null);
  const useCasesRef = useRef<HTMLElement | null>(null);
  const outcomesRef = useRef<HTMLElement | null>(null);

  const brand = "#07518a";

  // ===== Smooth scroll using Framer's animate() (no <a href> jumps)
  const smoothScrollTo = useCallback((el: HTMLElement | null, offset = 0) => {
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top - offset;
    const start = window.scrollY;
    animate(0, 1, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (t) => {
        const cur = start + (y - start) * t;
        window.scrollTo(0, cur);
      },
    });
  }, []);

  const enter = useMemo(
    () => ({
      hidden: { opacity: 0, y: 16 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }),
    []
  );

  const fadeUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10 },
      show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.05, duration: 0.4 },
      }),
    }),
    []
  );

  return (
    <main
      style={{ ["--brand" as any]: brand } as React.CSSProperties}
      className="bg-white"
    >
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen w-full mt-10">
        <div className="relative z-10 mx-auto grid min-h-[70vh] max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-8 md:grid-cols-2">
          <motion.div
            variants={enter}
            initial="hidden"
            animate="show"
            className="max-w-xl"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold text-[color:var(--brand)] ring-1"
              style={{
                backgroundColor: "color-mix(in hsl, var(--brand) 10%, white)",
                borderColor: "color-mix(in hsl, var(--brand) 20%, transparent)",
              }}
            >
              Solution Profile
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {solution.title}
            </h1>
            {solution.summary && (
              <p className="mt-4 text-lg leading-7 text-gray-700">
                {solution.summary}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {"cta" in solution && solution.cta ? (
                <Link
                  href={solution.cta.href}
                  className="inline-flex items-center justify-center rounded-lg bg-[color:var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  {solution.cta.label}
                </Link>
              ) : null}

              {/* Button (no <a href>) → smooth scroll via framer-motion animate() */}
              <button
                onClick={() => smoothScrollTo(featuresRef.current, 12)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/90 px-4 py-2.5 text-sm font-semibold text-[color:var(--brand)] shadow-sm backdrop-blur transition hover:bg-white ring-1 ring-[color:var(--brand)]/30"
              >
                Explore features
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          <motion.div
            className="relative h-[360px] w-full overflow-hidden rounded-2xl bg-white shadow-sm md:h-[420px]"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {solution.image ? (
              <Image
                src={solution.image}
                alt={solution.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No image
              </div>
            )}
            <div className="pointer-events-none absolute -inset-1 rounded-3xl ring-1 ring-black/5" />
          </motion.div>
        </div>

        {/* Top breadcrumb + prev/next */}
        <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 pt-6">
          <nav className="text-sm text-gray-600">
            <Link href="/solutions" className="hover:underline">
              Solutions
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{solution.title}</span>
          </nav>

          <div className="flex gap-2">
            {prev && (
              <Link
                href={`/solutions/${prev.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur hover:bg-white"
                aria-label={`Previous: ${prev.title}`}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Link>
            )}
            {next && (
              <Link
                href={`/solutions/${next.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur hover:bg-white"
                aria-label={`Next: ${next.title}`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section ref={featuresRef} className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <motion.h2
            className="text-2xl font-semibold text-gray-900"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
            transition={{ duration: 0.4 }}
          >
            Key Features
          </motion.h2>

          {solution.features?.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {solution.features.map((f, i) => (
                <motion.div
                  key={f}
                  className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  custom={i}
                  viewport={{ once: true }}
                >
                  <div className="text-sm font-semibold text-gray-900">{f}</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-600">
              Add notable features for this solution.
            </p>
          )}

          {/* quick links to other sections via smooth scroll buttons */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => smoothScrollTo(useCasesRef.current, 12)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--brand)] ring-1 ring-[color:var(--brand)]/30 hover:bg-[color:var(--brand)]/5"
            >
              See use cases
            </button>
            <button
              onClick={() => smoothScrollTo(outcomesRef.current, 12)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--brand)] ring-1 ring-[color:var(--brand)]/30 hover:bg-[color:var(--brand)]/5"
            >
              See outcomes
            </button>
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section ref={useCasesRef} className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <motion.h2
            className="text-2xl font-semibold text-gray-900"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
            transition={{ duration: 0.4 }}
          >
            Use Cases
          </motion.h2>

          {solution.useCases?.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {solution.useCases.map((u, i) => (
                <motion.div
                  key={u}
                  className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  custom={i}
                  viewport={{ once: true }}
                >
                  <div className="text-sm font-semibold text-gray-900">{u}</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "City/Enterprise deployments",
                "Compliance & audits",
                "Integrations & APIs",
              ].map((u, i) => (
                <motion.div
                  key={u}
                  className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  custom={i}
                  viewport={{ once: true }}
                >
                  <div className="text-sm font-semibold text-gray-900">{u}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== OUTCOMES ===== */}
      <section ref={outcomesRef} className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <motion.h2
            className="text-2xl font-semibold text-gray-900"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
            transition={{ duration: 0.4 }}
          >
            Expected Outcomes
          </motion.h2>

          {solution.outcomes?.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {solution.outcomes.map((o, i) => (
                <motion.div
                  key={o}
                  className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  custom={i}
                  viewport={{ once: true }}
                >
                  <div className="text-sm font-semibold text-gray-900">{o}</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {["Faster response", "Better visibility", "Measurable ROI"].map(
                (o, i) => (
                  <motion.div
                    key={o}
                    className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    custom={i}
                    viewport={{ once: true }}
                  >
                    <div className="text-sm font-semibold text-gray-900">
                      {o}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== RELATED ===== */}
      {related.length ? (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Related Solutions</h2>
              <Link
                href="/solutions"
                className="text-sm font-medium text-[color:var(--brand)] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {related.map((s, i) => (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow"
                >
                  <Link href={`/solutions/${s.slug}`}>
                    <div className="relative aspect-[16/10]">
                      {s.image ? (
                        <Image
                          src={s.image}
                          alt={s.title}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {s.title}
                      </div>
                      {s.summary ? (
                        <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                          {s.summary}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ===== BACK LINK ===== */}
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Link
          href="/solutions"
          className="text-sm font-medium text-[color:var(--brand)] hover:underline"
        >
          ← Back to all solutions
        </Link>
      </div>
    </main>
  );
}
