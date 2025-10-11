// app/components/OrgTreeClean.tsx
"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "#07518a";
const TREE_SRC = "/brand-tree.png"; // place your PNG in /public

type Company = {
  id: string;
  name: string;
  side: "left" | "right" | "center";
  tagline: string;
  founded: number;
  hq: string;
  focus: string[];
  website?: string;
  // hotspot position (percent of the tree container)
  topPct: number;
  leftPct: number;
};

const COMPANIES: Company[] = [
  // top center
  {
    id: "brihaspathi",
    name: "Brihaspathi",
    side: "center",
    tagline: "The Guru of Tomorrow’s Technology",
    founded: 2006,
    hq: "Hyderabad, IN",
    focus: ["Systems Integration", "Security", "IT Services"],
    website: "#",
    topPct: 7,
    leftPct: 50,
  },
  // left branch (top ➜ bottom)
  {
    id: "technorock",
    name: "TechnoRock",
    side: "left",
    tagline: "Powerful • Smart • Quality",
    founded: 2018,
    hq: "Pune, IN",
    focus: ["Power Solutions", "Industrial Electronics", "R&D"],
    website: "#",
    topPct: 20,
    leftPct: 22,
  },
  {
    id: "btplus",
    name: "BT+",
    side: "left",
    tagline: "Hardware. Services. Plus.",
    founded: 2015,
    hq: "Hyderabad, IN",
    focus: ["Retail Hardware", "POS", "On-site Services"],
    website: "#",
    topPct: 38,
    leftPct: 18,
  },
  {
    id: "agq",
    name: "AGQ – Generic Private",
    side: "left",
    tagline: "Smart Manufacturing at Scale",
    founded: 2014,
    hq: "Bengaluru, IN",
    focus: ["Electronics", "OEM/ODM", "Supply Chain"],
    website: "#",
    topPct: 58,
    leftPct: 21,
  },
  {
    id: "trendy",
    name: "Trendy TV Originals",
    side: "left",
    tagline: "Entertainment for Every Screen",
    founded: 2020,
    hq: "Mumbai, IN",
    focus: ["OTT Originals", "Ad-Tech", "MarTech"],
    website: "#",
    topPct: 79,
    leftPct: 24,
  },
  // right branch (top ➜ bottom)
  {
    id: "trinai",
    name: "TRINAI",
    side: "right",
    tagline: "Vision with Intelligence",
    founded: 2021,
    hq: "Hyderabad, IN",
    focus: ["Computer Vision", "Edge AI", "Video Analytics"],
    website: "#",
    topPct: 20,
    leftPct: 78,
  },
  {
    id: "bizgaze",
    name: "BizGaze",
    side: "right",
    tagline: "Your Virtual ‘CXO’",
    founded: 2017,
    hq: "Hyderabad, IN",
    focus: ["BI Dashboards", "ERP Extensions", "Forecasting"],
    website: "#",
    topPct: 38,
    leftPct: 83,
  },
  {
    id: "anwi",
    name: "ANWI",
    side: "right",
    tagline: "Advanced Network Interfaces",
    founded: 2019,
    hq: "Chennai, IN",
    focus: ["Networking", "IoT Interfaces", "Industrial Protocols"],
    website: "#",
    topPct: 60,
    leftPct: 82,
  },
  {
    id: "nationspride",
    name: "Nations Pride",
    side: "right",
    tagline: "Energy Systems India",
    founded: 2016,
    hq: "Vijayawada, IN",
    focus: ["Solar EPC", "Storage", "EV Infra"],
    website: "#",
    topPct: 80,
    leftPct: 80,
  },
];

const springy = { type: "spring", stiffness: 380, damping: 30, mass: 0.6 };

function Panel({
  company,
  side,
  onClose,
}: {
  company?: Company;
  side: "left" | "right";
  onClose: () => void;
}) {
  const fromX = side === "left" ? -40 : 40;
  return (
    <AnimatePresence mode="wait">
      {company && (
        <motion.aside
          key={company.id}
          initial={{ opacity: 0, x: fromX, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: fromX, filter: "blur(6px)" }}
          transition={springy}
          style={{
            position: "sticky",
            top: 20,
            alignSelf: "start",
            width: "min(520px, 90vw)",
            borderRadius: 16,
            padding: "20px 22px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.65))",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#0b2f4a",
                fontSize: "clamp(20px,2.2vw,28px)",
              }}
            >
              {company.name}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                border: "none",
                background: "transparent",
                color: "#5a6b7b",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              ×
            </button>
          </div>

          <p style={{ margin: "6px 0 14px", color: "#506273" }}>
            {company.tagline}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              paddingTop: 10,
              borderTop: "1px dashed rgba(0,0,0,0.08)",
            }}
          >
            <span className="chip">Founded {company.founded}</span>
            <span className="chip">{company.hq}</span>
            {company.focus.map((f) => (
              <span key={f} className="chip">
                {f}
              </span>
            ))}
          </div>

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                marginTop: 14,
                padding: "10px 14px",
                borderRadius: 10,
                background: BRAND,
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Visit website
            </a>
          )}

          <style jsx>{`
            .chip {
              border-radius: 999px;
              padding: 6px 10px;
              border: 1px solid rgba(7, 81, 138, 0.25);
              background: rgba(7, 81, 138, 0.06);
              color: ${BRAND};
              font-size: 12px;
              font-weight: 600;
            }
          `}</style>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default function OrgTreeClean({
  imageSrc = TREE_SRC,
}: {
  imageSrc?: string;
}) {
  const [activeLeft, setActiveLeft] = useState<Company | undefined>();
  const [activeRight, setActiveRight] = useState<Company | undefined>();
  const centerNode = useMemo(
    () => COMPANIES.find((c) => c.side === "center"),
    []
  );

  return (
    <div
      style={
        {
          // CSS vars need a cast for TS
          ["--max" as any]: "1400px",
          maxWidth: "var(--max)",
          margin: "0 auto",
          padding: "24px 16px",
        } as React.CSSProperties
      }
    >
      <h1
        style={{
          textAlign: "center",
          color: BRAND,
          margin: "4px 0 20px",
          fontSize: "clamp(24px, 3vw, 36px)",
          letterSpacing: 0.2,
        }}
      >
        Group Companies
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr minmax(280px, 740px) 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* LEFT PANEL */}
        <Panel
          company={activeLeft}
          side="left"
          onClose={() => setActiveLeft(undefined)}
        />

        {/* TREE */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1", // keep square; adjust if your image changes
            marginInline: "auto",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 16px 50px rgba(0,0,0,0.12)",
            backgroundImage: `url(${imageSrc})`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#f7fbff",
          }}
        >
          {/* hotspots (clean, subtle) */}
          {COMPANIES.map((c) => {
            const isActive =
              activeLeft?.id === c.id || activeRight?.id === c.id;
            const toRightPanel = c.side === "right" || c.side === "center";
            const onClick = () =>
              toRightPanel ? setActiveRight(c) : setActiveLeft(c);

            return (
              <motion.button
                key={c.id}
                onClick={onClick}
                aria-label={c.name}
                initial={false}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.96 }}
                animate={{
                  scale: isActive ? 1.08 : 1,
                  boxShadow: isActive
                    ? `0 0 0 6px rgba(7,81,138,0.08), 0 10px 32px rgba(7,81,138,0.28)`
                    : "0 6px 18px rgba(0,0,0,0.08)",
                  borderColor: isActive ? BRAND : "rgba(255,255,255,0.6)",
                }}
                transition={springy}
                title={c.name}
                style={{
                  position: "absolute",
                  top: `${c.topPct}%`,
                  left: `${c.leftPct}%`,
                  transform: "translate(-50%, -50%)",
                  width: "clamp(28px, 4.5vw, 40px)",
                  height: "clamp(28px, 4.5vw, 40px)",
                  borderRadius: "999px",
                  border: "2px solid rgba(255,255,255,0.6)",
                  background:
                    "radial-gradient(circle at 30% 30%, #ffffff 0%, #eaf4ff 60%, #d6ecff 100%)",
                  cursor: "pointer",
                }}
              >
                {/* glow ring */}
                <motion.span
                  aria-hidden
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    position: "absolute",
                    inset: -8,
                    borderRadius: "inherit",
                    boxShadow: `0 0 0 8px rgba(7,81,138,0.14)`,
                  }}
                />
              </motion.button>
            );
          })}
        </div>

        {/* RIGHT PANEL (defaults to center node if nothing picked yet) */}
        <Panel
          company={activeRight ?? centerNode}
          side="right"
          onClose={() => setActiveRight(undefined)}
        />
      </div>

      {/* caption */}
      <p
        style={{
          textAlign: "center",
          color: "#5a6b7b",
          marginTop: 14,
          fontSize: 13,
        }}
      >
        Tap a dot on the tree to view details. Left dots open the left panel;
        right dots open the right panel.
      </p>
    </div>
  );
}
