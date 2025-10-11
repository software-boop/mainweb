// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useMemo, useState, useEffect } from "react";

// /* =========================================
//    Types
// ========================================= */

// export type Segment = "news" | "press-release";

// export interface NewsPressItem {
//   id: string;
//   segment: Segment; // "news" | "press-release"
//   slug: string; // e.g. "q3-results-strong"
//   title: string;
//   subtitle?: string;

//   // Header / hero
//   heroImage: string; // cloud/sky image
//   heroImageAlt: string;

//   // Middle content
//   excerpt: string;
//   body: {
//     heading: string;
//     paragraphs: string[];
//     bullets?: string[];
//     image?: { src: string; alt: string; caption?: string };
//   };

//   // Footer / meta
//   dateISO: string; // ISO date
//   author?: string;
//   organization?: string;
//   location?: string;
//   tags?: string[];
// }

// /* =========================================
//    Dummy Array (News + Press Releases)
//    Cloud-themed images
// ========================================= */

// export const NEWS_PRESS_DATA: NewsPressItem[] = [
//   {
//     id: "n-001",
//     segment: "news",
//     slug: "q3-results-strong",
//     title: "Q3 Results Show Strong Momentum",
//     subtitle: "Expanded customer adoption across APAC and EMEA",
//     heroImage:
//       "https://images.unsplash.com/photo-1499343245400-cddc78a01317?q=80&w=1600&auto=format&fit=crop",
//     heroImageAlt: "Calm clouds above a skyline at sunset",
//     excerpt:
//       "We closed Q3 with double-digit growth and record customer retention, driven by reliability and faster rollout cycles.",
//     body: {
//       heading: "Quarter Highlights",
//       paragraphs: [
//         "Revenue grew 17% quarter-over-quarter as enterprise adoption accelerated across regulated industries.",
//         "Operational excellence and focused execution reduced average deployment time by 28%.",
//         "Customer satisfaction (CSAT) improved to 4.7/5 backed by proactive support and onboarding.",
//       ],
//       bullets: ["17% QoQ growth", "28% faster deployments", "4.7/5 CSAT"],
//       image: {
//         src: "https://images.unsplash.com/photo-1502920917128-1aa500764ce7?q=80&w=1600&auto=format&fit=crop",
//         alt: "Cumulus clouds in a bright blue sky",
//         caption: "Clear roadmap and execution discipline.",
//       },
//     },
//     dateISO: "2025-09-25",
//     author: "Comms Team",
//     organization: "Acme Cloud",
//     location: "San Francisco, CA",
//     tags: ["Earnings", "Growth", "Customers"],
//   },
//   {
//     id: "p-001",
//     segment: "press-release",
//     slug: "acme-cloud-launches-edge-ai",
//     title: "Acme Cloud Launches Edge AI Suite",
//     subtitle: "Low-latency inference at the edge for real-time decisions",
//     heroImage:
//       "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
//     heroImageAlt: "Sunlit clouds above the horizon",
//     excerpt:
//       "The Edge AI Suite brings sub-50ms inference to industrial and retail workloads, reducing bandwidth costs and improving resilience.",
//     body: {
//       heading: "Purpose-Built for the Edge",
//       paragraphs: [
//         "Acme Edge AI ships with managed runtime, GPU scheduling, and fleet orchestration for global deployments.",
//         "Developers can build once and deploy anywhere with observability baked in.",
//       ],
//       bullets: ["Sub-50ms inference", "Fleet orchestration", "Observability"],
//       image: {
//         src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
//         alt: "Dramatic cloud formation",
//         caption: "Closer to users. Faster decisions.",
//       },
//     },
//     dateISO: "2025-09-10",
//     author: "PR Contact",
//     organization: "Acme Cloud",
//     location: "New York, NY",
//     tags: ["Press Release", "Edge", "AI"],
//   },
//   {
//     id: "n-002",
//     segment: "news",
//     slug: "partnership-with-neo-bank",
//     title: "Strategic Partnership with NeoBank",
//     subtitle: "Modernizing payment rails with real-time risk scoring",
//     heroImage:
//       "https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1600&auto=format&fit=crop",
//     heroImageAlt: "Clouds with a warm glow",
//     excerpt:
//       "Acme Cloud and NeoBank will co-develop real-time risk services and accelerate ISO 20022 readiness across regions.",
//     body: {
//       heading: "Why It Matters",
//       paragraphs: [
//         "The partnership brings safer payments to millions of users while improving compliance workflows.",
//         "Initial rollout targets APAC with EU support to follow in H1 next year.",
//       ],
//       bullets: ["Real-time risk scoring", "ISO 20022", "APAC-first rollout"],
//     },
//     dateISO: "2025-08-29",
//     author: "Editorial",
//     organization: "Acme Cloud",
//     location: "Singapore",
//     tags: ["Partnerships", "Fintech", "Compliance"],
//   },
//   {
//     id: "p-002",
//     segment: "press-release",
//     slug: "series-d-funding",
//     title: "Acme Cloud Announces Series D Funding",
//     subtitle: "Fueling global expansion and R&D",
//     heroImage:
//       "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop",
//     heroImageAlt: "Bright clouds and open sky",
//     excerpt:
//       "New investment will scale our go-to-market and accelerate platform innovation in security and data services.",
//     body: {
//       heading: "Use of Proceeds",
//       paragraphs: [
//         "Funding supports expansion in EMEA and LatAm, plus continued investment in data privacy features.",
//         "The company will hire across product, security, and developer experience.",
//       ],
//       bullets: ["Global expansion", "Privacy & security", "DX investments"],
//     },
//     dateISO: "2025-07-12",
//     author: "PR Contact",
//     organization: "Acme Cloud",
//     location: "London, UK",
//     tags: ["Press Release", "Funding", "Growth"],
//   },
// ];

// /* =========================================
//    Helpers
// ========================================= */

// type SegmentFilter = "all" | Segment;
// const SEGMENT_LABELS: Record<SegmentFilter, string> = {
//   all: "All",
//   news: "News",
//   "press-release": "Press Releases",
// };

// function sortNewestFirst(items: NewsPressItem[]) {
//   return [...items].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
// }

// /* =========================================
//    List Component (reusable)
// ========================================= */

// function NewsPressList({
//   items,
//   heading = "Latest Updates",
//   showSegmentBadge = true,
// }: {
//   items: NewsPressItem[];
//   heading?: string;
//   showSegmentBadge?: boolean;
// }) {
//   return (
//     <section className="mx-auto max-w-6xl px-6 py-6">
//       <header className="mb-6">
//         <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
//           {heading}
//         </h2>
//         <p className="text-gray-600 mt-1">
//           Company news and official press releases.
//         </p>
//       </header>

//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {items.map((item) => (
//           <article
//             key={item.id}
//             className="group relative overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-white hover:shadow-md transition"
//           >
//             {/* Image header */}
//             <Link
//               href={`/${item.segment}/${item.slug}`}
//               className="block relative h-48"
//             >
//               <Image
//                 src={item.heroImage}
//                 alt={item.heroImageAlt}
//                 fill
//                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                 className="object-cover transition-transform duration-500 group-hover:scale-105"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
//             </Link>

//             {/* Content */}
//             <div className="p-5">
//               <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
//                 {showSegmentBadge && (
//                   <span
//                     className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
//                       item.segment === "news"
//                         ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
//                         : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
//                     }`}
//                   >
//                     {item.segment === "news" ? "News" : "Press Release"}
//                   </span>
//                 )}
//                 <time dateTime={item.dateISO}>
//                   {new Date(item.dateISO).toLocaleDateString()}
//                 </time>
//                 {item.location && (
//                   <>
//                     <span>•</span>
//                     <span>{item.location}</span>
//                   </>
//                 )}
//               </div>

//               <h3 className="text-lg font-semibold text-gray-900">
//                 <Link href={`/${item.segment}/${item.slug}`}>
//                   <span className="absolute inset-0" />
//                   {item.title}
//                 </Link>
//               </h3>
//               {item.subtitle && (
//                 <p className="text-sm text-gray-600 mt-0.5">{item.subtitle}</p>
//               )}

//               <p className="text-sm text-gray-700 mt-3 line-clamp-3">
//                 {item.excerpt}
//               </p>

//               {/* Footer */}
//               <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
//                 {item.author && <span>By {item.author}</span>}
//                 {item.organization && (
//                   <>
//                     <span>•</span>
//                     <span>{item.organization}</span>
//                   </>
//                 )}
//                 {item.tags?.slice(0, 3).map((t) => (
//                   <span
//                     key={t}
//                     className="rounded-full bg-gray-100 px-2 py-0.5"
//                   >
//                     {t}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>
//     </section>
//   );
// }

// /* =========================================
//    Page: /updates with Segment Filter
// ========================================= */

// export default function UpdatesPage() {
//   const [filter, setFilter] = useState<SegmentFilter>(() => {
//     if (typeof window === "undefined") return "all";
//     const sp = new URLSearchParams(window.location.search);
//     return (sp.get("segment") as SegmentFilter) || "all";
//   });

//   // keep URL in sync when filter changes (no full refresh)
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const sp = new URLSearchParams(window.location.search);
//     if (filter === "all") sp.delete("segment");
//     else sp.set("segment", filter);
//     const url = `${window.location.pathname}${
//       sp.size ? `?${sp.toString()}` : ""
//     }`;
//     window.history.replaceState(null, "", url);
//   }, [filter]);

//   // filter + sort
//   const items = useMemo(() => {
//     const base =
//       filter === "all"
//         ? NEWS_PRESS_DATA
//         : NEWS_PRESS_DATA.filter((i) => i.segment === filter);
//     return sortNewestFirst(base);
//   }, [filter]);

//   return (
//     <main className="mx-auto max-w-6xl px-6 py-10">
//       <header className="mb-6">
//         <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//           Updates
//         </h1>
//         <p className="text-gray-600">
//           Browse all company news and press releases in one place.
//         </p>
//       </header>

//       {/* Filter Pills */}
//       <div className="mb-6 flex flex-wrap gap-2">
//         {(["all", "news", "press-release"] as SegmentFilter[]).map((key) => {
//           const active = filter === key;
//           return (
//             <button
//               key={key}
//               onClick={() => setFilter(key)}
//               className={[
//                 "rounded-full px-4 py-2 text-sm font-medium ring-1 transition",
//                 active
//                   ? "bg-blue-600 text-white ring-blue-600"
//                   : "bg-white text-gray-700 ring-gray-300 hover:bg-gray-50",
//               ].join(" ")}
//               aria-pressed={active}
//             >
//               {SEGMENT_LABELS[key]}
//             </button>
//           );
//         })}
//       </div>

//       <NewsPressList
//         items={items}
//         heading={
//           filter === "all"
//             ? "All Updates"
//             : filter === "news"
//             ? "Company News"
//             : "Press Releases"
//         }
//         showSegmentBadge
//       />
//     </main>
//   );
// }

// /* =========================================
//    Notes:
//    - If you click a card, it links to /news/[slug] or /press-release/[slug].
//    - Create those routes if you want detail pages, or change Link hrefs.
//    - For external images, add the domain to next.config.js images.domains.
// ========================================= */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

/* =========================================
   Types
========================================= */

export type Segment = "news" | "press-release";

export interface NewsPressItem {
  id: string;
  segment: Segment; // "news" | "press-release"
  slug: string; // e.g. "q3-results-strong"
  title: string;
  subtitle?: string;

  // Header / hero
  heroImage: string; // cloud/sky image
  heroImageAlt: string;

  // Middle content
  excerpt: string;
  body: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
    image?: { src: string; alt: string; caption?: string };
  };

  // Footer / meta
  dateISO: string; // ISO date
  author?: string;
  organization?: string;
  location?: string;
  tags?: string[];
}

/* =========================================
   Dummy Array (News + Press Releases)
========================================= */

const NEWS_PRESS_DATA: NewsPressItem[] = [
  {
    id: "n-001",
    segment: "news",
    slug: "q3-results-strong",
    title: "Q3 Results Show Strong Momentum",
    subtitle: "Expanded customer adoption across APAC and EMEA",
    heroImage:
      "https://images.unsplash.com/photo-1499343245400-cddc78a01317?q=80&w=1600&auto=format&fit=crop",
    heroImageAlt: "Calm clouds above a skyline at sunset",
    excerpt:
      "We closed Q3 with double-digit growth and record customer retention, driven by reliability and faster rollout cycles.",
    body: {
      heading: "Quarter Highlights",
      paragraphs: [
        "Revenue grew 17% quarter-over-quarter as enterprise adoption accelerated across regulated industries.",
        "Operational excellence and focused execution reduced average deployment time by 28%.",
        "Customer satisfaction (CSAT) improved to 4.7/5 backed by proactive support and onboarding.",
      ],
      bullets: ["17% QoQ growth", "28% faster deployments", "4.7/5 CSAT"],
      image: {
        src: "https://images.unsplash.com/photo-1502920917128-1aa500764ce7?q=80&w=1600&auto=format&fit=crop",
        alt: "Cumulus clouds in a bright blue sky",
        caption: "Clear roadmap and execution discipline.",
      },
    },
    dateISO: "2025-09-25",
    author: "Comms Team",
    organization: "Acme Cloud",
    location: "San Francisco, CA",
    tags: ["Earnings", "Growth", "Customers"],
  },
  {
    id: "p-001",
    segment: "press-release",
    slug: "acme-cloud-launches-edge-ai",
    title: "Acme Cloud Launches Edge AI Suite",
    subtitle: "Low-latency inference at the edge for real-time decisions",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    heroImageAlt: "Sunlit clouds above the horizon",
    excerpt:
      "The Edge AI Suite brings sub-50ms inference to industrial and retail workloads, reducing bandwidth costs and improving resilience.",
    body: {
      heading: "Purpose-Built for the Edge",
      paragraphs: [
        "Acme Edge AI ships with managed runtime, GPU scheduling, and fleet orchestration for global deployments.",
        "Developers can build once and deploy anywhere with observability baked in.",
      ],
      bullets: ["Sub-50ms inference", "Fleet orchestration", "Observability"],
      image: {
        src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
        alt: "Dramatic cloud formation",
        caption: "Closer to users. Faster decisions.",
      },
    },
    dateISO: "2025-09-10",
    author: "PR Contact",
    organization: "Acme Cloud",
    location: "New York, NY",
    tags: ["Press Release", "Edge", "AI"],
  },
  {
    id: "n-002",
    segment: "news",
    slug: "partnership-with-neo-bank",
    title: "Strategic Partnership with NeoBank",
    subtitle: "Modernizing payment rails with real-time risk scoring",
    heroImage:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1600&auto=format&fit=crop",
    heroImageAlt: "Clouds with a warm glow",
    excerpt:
      "Acme Cloud and NeoBank will co-develop real-time risk services and accelerate ISO 20022 readiness across regions.",
    body: {
      heading: "Why It Matters",
      paragraphs: [
        "The partnership brings safer payments to millions of users while improving compliance workflows.",
        "Initial rollout targets APAC with EU support to follow in H1 next year.",
      ],
      bullets: ["Real-time risk scoring", "ISO 20022", "APAC-first rollout"],
    },
    dateISO: "2025-08-29",
    author: "Editorial",
    organization: "Acme Cloud",
    location: "Singapore",
    tags: ["Partnerships", "Fintech", "Compliance"],
  },
  {
    id: "p-002",
    segment: "press-release",
    slug: "series-d-funding",
    title: "Acme Cloud Announces Series D Funding",
    subtitle: "Fueling global expansion and R&D",
    heroImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop",
    heroImageAlt: "Bright clouds and open sky",
    excerpt:
      "New investment will scale our go-to-market and accelerate platform innovation in security and data services.",
    body: {
      heading: "Use of Proceeds",
      paragraphs: [
        "Funding supports expansion in EMEA and LatAm, plus continued investment in data privacy features.",
        "The company will hire across product, security, and developer experience.",
      ],
      bullets: ["Global expansion", "Privacy & security", "DX investments"],
    },
    dateISO: "2025-07-12",
    author: "PR Contact",
    organization: "Acme Cloud",
    location: "London, UK",
    tags: ["Press Release", "Funding", "Growth"],
  },
];

/* =========================================
   Helpers
========================================= */

type SegmentFilter = "all" | Segment;
const SEGMENT_LABELS: Record<SegmentFilter, string> = {
  all: "All",
  news: "News",
  "press-release": "Press Releases",
};

function sortNewestFirst(items: NewsPressItem[]) {
  return [...items].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
}

/* =========================================
   Internal List Component (used by default export)
========================================= */

function NewsPressList({
  items,
  heading = "Latest Updates",
  showSegmentBadge = true,
}: {
  items: NewsPressItem[];
  heading?: string;
  showSegmentBadge?: boolean;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-6">
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          {heading}
        </h2>
        <p className="text-gray-600 mt-1">
          Company news and official press releases.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="group relative overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-white hover:shadow-md transition"
          >
            {/* Image header */}
            <Link
              href={`/${item.segment}/${item.slug}`}
              className="block relative h-48"
            >
              <Image
                src={item.heroImage}
                alt={item.heroImageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </Link>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                {showSegmentBadge && (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
                      item.segment === "news"
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                        : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    }`}
                  >
                    {item.segment === "news" ? "News" : "Press Release"}
                  </span>
                )}
                <time dateTime={item.dateISO}>
                  {new Date(item.dateISO).toLocaleDateString()}
                </time>
                {item.location && (
                  <>
                    <span>•</span>
                    <span>{item.location}</span>
                  </>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                <Link href={`/${item.segment}/${item.slug}`}>
                  <span className="absolute inset-0" />
                  {item.title}
                </Link>
              </h3>
              {item.subtitle && (
                <p className="text-sm text-gray-600 mt-0.5">{item.subtitle}</p>
              )}

              <p className="text-sm text-gray-700 mt-3 line-clamp-3">
                {item.excerpt}
              </p>

              {/* Footer */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                {item.author && <span>By {item.author}</span>}
                {item.organization && (
                  <>
                    <span>•</span>
                    <span>{item.organization}</span>
                  </>
                )}
                {item.tags?.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gray-100 px-2 py-0.5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* =========================================
   Default Export: Single Component
   - Renders the filter pills
   - Renders the list using the in-file data
========================================= */

export default function Updates() {
  const [filter, setFilter] = useState<SegmentFilter>(() => {
    if (typeof window === "undefined") return "all";
    const sp = new URLSearchParams(window.location.search);
    return (sp.get("segment") as SegmentFilter) || "all";
  });

  // keep URL in sync (no full refresh)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if (filter === "all") sp.delete("segment");
    else sp.set("segment", filter);
    const url = `${window.location.pathname}${
      sp.size ? `?${sp.toString()}` : ""
    }`;
    window.history.replaceState(null, "", url);
  }, [filter]);

  // filter + sort
  const items = useMemo(() => {
    const base =
      filter === "all"
        ? NEWS_PRESS_DATA
        : NEWS_PRESS_DATA.filter((i) => i.segment === filter);
    return sortNewestFirst(base);
  }, [filter]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Updates
        </h1>
        <p className="text-gray-600">
          Browse all company news and press releases in one place.
        </p>
      </header>

      {/* Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "news", "press-release"] as SegmentFilter[]).map((key) => {
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={[
                "rounded-full px-4 py-2 text-sm font-medium ring-1 transition",
                active
                  ? "bg-blue-600 text-white ring-blue-600"
                  : "bg-white text-gray-700 ring-gray-300 hover:bg-gray-50",
              ].join(" ")}
              aria-pressed={active}
            >
              {SEGMENT_LABELS[key]}
            </button>
          );
        })}
      </div>

      <NewsPressList
        items={items}
        heading={
          filter === "all"
            ? "All Updates"
            : filter === "news"
            ? "Company News"
            : "Press Releases"
        }
        showSegmentBadge
      />
    </section>
  );
}

/* =========================================
   How to use:
   1) Save as components/Updates.tsx
   2) Import anywhere:
      import Updates from "@/components/Updates";
      export default function Page() {
        return <Updates />;
      }
   3) For remote images, add domain to next.config.js:
      module.exports = { images: { domains: ["images.unsplash.com"] } }
========================================= */
