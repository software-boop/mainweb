"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Link as LinkIcon, Check } from "lucide-react";

/* =========================
   Brand & Content
========================= */
const BRAND = "#07518a";

type FAQ = {
  id: string;
  q: string;
  a: string;
  tags?: string[]; // kept for future use (not displayed now)
};

const FAQS: FAQ[] = [
  {
    id: "services",
    q: "What services does Brihaspathi Technologies Limited offer?",
    a: "BTL offers a wide range of services including CCTV surveillance systems, video analytics, IoT solutions, software development, solar energy systems, EPABX/IP PBX systems, biometric devices, GPS tracking solutions, and custom automation services for various industries.",
  },
  {
    id: "experience",
    q: "Is Brihaspathi Technologies Limited experienced in handling large-scale government and corporate projects?",
    a: "Yes, Brihaspathi Technologies has successfully executed over 18,000+ projects across India, including large-scale implementations for government departments, defense, public sector units, and private enterprises.",
  },
  {
    id: "support",
    q: "Do you provide after-sales support and maintenance for your products?",
    a: "Absolutely. We offer comprehensive after-sales support including regular maintenance, technical assistance, and upgrades to ensure seamless operation of our products and systems.",
  },
  {
    id: "customization",
    q: "Can Brihaspathi Technologies customize software and hardware solutions for specific business needs?",
    a: "Yes, we specialize in providing tailor-made software and hardware solutions to meet the unique requirements of different industries including education, healthcare, manufacturing, real estate, and agriculture.",
  },
  {
    id: "locations",
    q: "Where are your service locations and offices located?",
    a: "Brihaspathi Technologies has a strong presence with offices and service teams across major cities in India including Hyderabad, Bengaluru, Chennai, Delhi, Mumbai, and more, enabling prompt support and service delivery.",
  },
  {
    id: "quote-demo",
    q: "How can I get a quote or schedule a demo for your products and solutions?",
    a: "You can request a quote or schedule a product demo by visiting our official website www.brihaspathi.com, calling our customer support, or filling out the inquiry form online. Our team will connect with you promptly.",
  },
];

/* =========================
   Helpers
========================= */
const slugToHash = (id: string) => `#${id}`;
const hashToId = (hash: string) => hash.replace(/^#/, "");

export default function FAQPage() {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Open item if hash present
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = hashToId(window.location.hash || "");
    if (id) {
      setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allOpen = openIds.length === FAQS.length && FAQS.length > 0;
  const expandAll = () => setOpenIds(FAQS.map((f) => f.id));
  const collapseAll = () => setOpenIds([]);

  const copyLink = useCallback((id: string) => {
    const href = `${window.location.origin}/faq${slugToHash(id)}`;
    navigator.clipboard.writeText(href).then(() => {
      history.replaceState(null, "", slugToHash(id));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    });
  }, []);

  // SEO JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero (kept, simplified) */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(1200px 500px at 10% 0%, rgba(10,106,184,0.15), transparent), radial-gradient(1200px 500px at 90% 100%, rgba(7,81,138,0.18), transparent)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Brihaspathi Technologies — FAQ
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Quick answers about our services, experience, support, locations,
            and demos.
          </p>
        </div>
      </section>

      {/* Controls (Expand/Collapse only) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Total FAQs:{" "}
          <span className="font-semibold text-gray-700">{FAQS.length}</span>
        </p>
        <button
          onClick={allOpen ? collapseAll : expandAll}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          {allOpen ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {/* FAQ List */}
      <section className="pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="space-y-4">
            {FAQS.map((item) => {
              const isOpen = openIds.includes(item.id);
              return (
                <li key={item.id} id={item.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                    style={{ boxShadow: "0 10px 28px rgba(0,0,0,0.05)" }}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full flex items-start gap-4 text-left px-5 py-4 hover:bg-gray-50"
                      aria-expanded={isOpen}
                      aria-controls={`${item.id}-content`}
                    >
                      <div
                        className={`mt-1 flex-shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden
                      >
                        <ChevronDown className="size-5 text-gray-500" />
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                        {item.q}
                      </h3>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`${item.id}-content`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                        >
                          <div className="px-5 pb-5 pt-0">
                            <p className="text-gray-700 leading-relaxed">
                              {item.a}
                            </p>

                            <div className="mt-4 flex items-center justify-end">
                              <button
                                onClick={() => copyLink(item.id)}
                                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                                title="Copy link to this answer"
                              >
                                {copiedId === item.id ? (
                                  <>
                                    <Check className="size-4" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <LinkIcon className="size-4" />
                                    Copy link
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-4 left-0 right-0 px-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white/90 backdrop-blur shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600">Need a tailored solution?</p>
              <p className="text-sm font-medium text-gray-900">
                Request a quote or schedule a live demo with our team.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/contact"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: BRAND }}
              >
                Request Quote
              </a>
              <a
                href="/contact"
                className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50"
              >
                Schedule Demo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for CTA */}
      <div className="h-28" />
    </div>
  );
}
