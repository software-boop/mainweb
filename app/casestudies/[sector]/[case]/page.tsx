// "use client";

// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
// } from "react";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import { CaseStudy, CASE_STUDIES_BY_SECTOR } from "@/app/data/Casestudy";
// import {
//   Card,
//   Carousel,
//   Modal,
//   Tag,
//   message as antdMsg,
//   ConfigProvider,
//   Button,
//   Collapse,
//   Progress,
//   Divider,
//   Space,
//   Avatar,
//   Rate,
//   Spin,
// } from "antd";
// import {
//   motion,
//   useScroll,
//   useTransform,
//   useReducedMotion,
//   useInView,
// } from "framer-motion";
// import {
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Share2,
//   Heart,
//   Maximize2,
//   Copy,
//   Check,
//   ZoomIn,
//   ZoomOut,
//   FileText,
//   Download,
//   Eye,
//   TrendingUp,
//   Target,
//   Award,
//   Clock,
//   MapPin,
//   Building,
//   User,
//   ArrowLeft,
//   ArrowRight,
//   Star,
//   BarChart3,
//   Calendar,
//   Globe,
// } from "lucide-react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

// const challange = "/c1-01.png";
// const sollution = "/c2-01.png";

// /* ===== Adjust this if your base path changes ===== */
// const BASE_PATH = "/casestudies";

// /* ===== PDF.js worker ===== */
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// /* ===== Brand ===== */
// const BRAND = "#07518a";
// const BRAND_TINT = "#0a6ab8";

// /* ===== Animations ===== */
// const riseIn = (delay = 0) => ({
//   initial: { opacity: 0, y: 40 },
//   whileInView: { opacity: 1, y: 0 },
//   viewport: { once: true, amount: 0.3, margin: "-10% 0px -10% 0px" },
//   transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
// });

// const slideFromLeft = {
//   initial: { x: "-20vw", opacity: 0 },
//   whileInView: { x: 0, opacity: 1 },
//   transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
// };

// const slideFromRight = {
//   initial: { x: "20vw", opacity: 0 },
//   whileInView: { x: 0, opacity: 1 },
//   transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
// };

// const bridgeReveal = {
//   initial: { opacity: 0, scale: 0.96 },
//   whileInView: { opacity: 1, scale: 1 },
//   transition: { duration: 0.6, ease: "easeOut" },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 36 },
//   show: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.5,
//       ease: [0.16, 1, 0.3, 1],
//       delay: Math.min(i * 0.05, 0.3),
//     },
//   }),
//   hover: { y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", scale: 1.02 },
// };

// /* ===== Utils ===== */
// function slugify(text: string): string {
//   return text
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// }
// function calculateReadTime(content: string[]): number {
//   const wordCount = content.join(" ").split(" ").length;
//   return Math.ceil(wordCount / 200);
// }

// /* ===== PDF Viewer ===== */
// function EnhancedPDFViewer({
//   pdfUrl,
//   title,
//   className = "",
// }: {
//   pdfUrl: string;
//   title: string;
//   className?: string;
// }) {
//   const [numPages, setNumPages] = useState(0);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [scale, setScale] = useState(1.0);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//     setNumPages(numPages);
//     setLoading(false);
//   };
//   const onDocumentLoadError = (e: Error) => {
//     setErr(`Failed to load PDF: ${e.message}`);
//     setLoading(false);
//   };

//   return (
//     <div
//       className={`relative bg-gray-50 rounded-2xl overflow-hidden ${className}`}
//     >
//       {loading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
//           <Spin size="large" />
//           <span className="ml-4 text-gray-600">Loading PDF...</span>
//         </div>
//       )}

//       <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <span className="text-sm font-medium text-gray-900">{title}</span>
//           <Divider type="vertical" />
//           <span className="text-sm text-gray-500">
//             Page {pageNumber} of {numPages || "—"}
//           </span>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button.Group>
//             <Button
//               icon={<ZoomOut className="h-4 w-4" />}
//               onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))}
//             />
//             <Button onClick={() => setScale(1)}>
//               {Math.round(scale * 100)}%
//             </Button>
//             <Button
//               icon={<ZoomIn className="h-4 w-4" />}
//               onClick={() => setScale((s) => Math.min(s + 0.2, 2))}
//             />
//           </Button.Group>
//           <Divider type="vertical" />
//           <Button.Group>
//             <Button
//               icon={<ChevronLeft className="h-4 w-4" />}
//               onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
//               disabled={pageNumber <= 1}
//             />
//             <Button
//               icon={<ChevronRight className="h-4 w-4" />}
//               onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
//               disabled={pageNumber >= numPages}
//             />
//           </Button.Group>
//           <Divider type="vertical" />
//           <Button
//             icon={<Download className="h-4 w-4" />}
//             href={pdfUrl}
//             download
//           >
//             Download
//           </Button>
//         </div>
//       </div>

//       {err ? (
//         <div className="p-8 text-center">
//           <FileText className="h-16 w-16 text-gray-400 mx-auto mb-3" />
//           <p className="text-gray-600">{err}</p>
//           <Button
//             type="primary"
//             href={pdfUrl}
//             target="_blank"
//             className="mt-4"
//             style={{ backgroundColor: BRAND }}
//           >
//             Open in New Tab
//           </Button>
//         </div>
//       ) : (
//         <div className="flex justify-center p-6 overflow-auto max-h-[70vh]">
//           <Document
//             file={pdfUrl}
//             onLoadSuccess={onDocumentLoadSuccess}
//             onLoadError={onDocumentLoadError}
//             loading=""
//           >
//             <Page
//               pageNumber={pageNumber}
//               scale={scale}
//               className="shadow-lg"
//               loading=""
//             />
//           </Document>
//         </div>
//       )}

//       {numPages > 1 && (
//         <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
//           <div className="flex items-center justify-center gap-4">
//             <Progress
//               percent={(pageNumber / numPages) * 100}
//               showInfo={false}
//               strokeColor={BRAND}
//               className="flex-1 max-w-md"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ===== Related Carousel (exclude current by NAME slug) ===== */
// function RelatedCaseStudiesCarousel({
//   currentCaseSlug,
//   sectorCases,
//   sectorTitle,
//   onCaseSelect,
// }: {
//   currentCaseSlug: string;
//   sectorCases: CaseStudy[];
//   sectorTitle: string;
//   onCaseSelect: (c: CaseStudy) => void;
// }) {
//   const related = useMemo(
//     () => sectorCases.filter((c) => slugify(c.name) !== currentCaseSlug),
//     [sectorCases, currentCaseSlug]
//   );
//   if (!related.length) return null;

//   return (
//     <motion.section {...riseIn(0)} className="max-w-7xl mx-auto px-6 py-16">
//       <div className="text-center mb-12">
//         <motion.h2
//           {...riseIn(0.1)}
//           className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
//         >
//           More {sectorTitle} Success Stories
//         </motion.h2>
//         <motion.p
//           {...riseIn(0.2)}
//           className="text-lg text-gray-600 max-w-2xl mx-auto"
//         >
//           Discover how we’ve helped other organizations in the{" "}
//           {sectorTitle.toLowerCase()} sector.
//         </motion.p>
//       </div>

//       <motion.div {...riseIn(0.3)}>
//         <Carousel
//           dots={false}
//           slidesToShow={3}
//           slidesToScroll={1}
//           autoplay
//           autoplaySpeed={4000}
//           infinite={related.length > 3}
//           responsive={[
//             { breakpoint: 1024, settings: { slidesToShow: 2 } },
//             { breakpoint: 640, settings: { slidesToShow: 1 } },
//           ]}
//           prevArrow={<CarouselArrow direction="prev" />}
//           nextArrow={<CarouselArrow direction="next" />}
//         >
//           {related.map((cs, i) => (
//             <div key={slugify(cs.name)} className="px-3">
//               <motion.div
//                 variants={cardVariants}
//                 custom={i}
//                 initial="hidden"
//                 whileInView="show"
//                 whileHover="hover"
//                 viewport={{ once: true, amount: 0.3 }}
//                 className="cursor-pointer"
//                 onClick={() => onCaseSelect(cs)}
//               >
//                 <Card
//                   hoverable
//                   className="h-full rounded-2xl overflow-hidden shadow-md border-0"
//                   cover={
//                     <div className="relative h-48 overflow-hidden">
//                       <img
//                         src={cs.avatar || "/default-case-study-image.jpg"}
//                         alt={cs.name}
//                         className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

//                       <div className="absolute bottom-4 left-4 text-white">
//                         <h3 className="font-semibold text-lg mb-1">
//                           {cs.name}
//                         </h3>
//                         <div className="flex items-center gap-2 text-sm opacity-90">
//                           <Building className="h-4 w-4" />
//                           {cs.company}
//                         </div>
//                       </div>
//                     </div>
//                   }
//                 >
//                   <div className="p-2">
//                     <div className="flex items-center justify-between mb-3">
//                       <Tag color="blue" className="rounded-full">
//                         {cs.role}
//                       </Tag>
//                       <div className="flex items-center gap-1 text-sm text-gray-500">
//                         <MapPin className="h-3 w-3" />
//                         {cs.city}
//                       </div>
//                     </div>
//                     <p className="text-gray-600 text-sm line-clamp-2 mb-4">
//                       {cs.quote ||
//                         "Exceptional results achieved through strategic implementation."}
//                     </p>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Avatar size="small" icon={<User />} />
//                         <span className="text-xs text-gray-500">
//                           Case Study
//                         </span>
//                       </div>
//                       <Button
//                         type="link"
//                         size="small"
//                         className="p-0 h-auto"
//                         style={{ color: BRAND }}
//                       >
//                         View Details →
//                       </Button>
//                     </div>
//                   </div>
//                 </Card>
//               </motion.div>
//             </div>
//           ))}
//         </Carousel>
//       </motion.div>
//     </motion.section>
//   );
// }

// function CarouselArrow({
//   direction,
//   onClick,
// }: {
//   direction: "prev" | "next";
//   onClick?: () => void;
// }) {
//   return (
//     <Button
//       type="text"
//       className={`absolute top-1/2 -translate-y-1/2 z-10 ${
//         direction === "prev" ? "-left-12" : "-right-12"
//       } w-10 h-10 rounded-full bg-white shadow-lg border-0 flex items-center justify-center hover:bg-gray-50`}
//       onClick={onClick}
//       icon={
//         direction === "prev" ? (
//           <ArrowLeft className="h-5 w-5" />
//         ) : (
//           <ArrowRight className="h-5 w-5" />
//         )
//       }
//     />
//   );
// }

// /* ===== Page ===== */
// export default function CaseStudyDetailPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const sectorSlug = (params?.sector as string) || "";
//   const caseSlug = (params?.case as string) || "";
//   const preservedNameParam = searchParams.get("name") || "";

//   const { currentSector, caseStudy, series, currentIndex } = useMemo(() => {
//     const sectorKey = Object.keys(CASE_STUDIES_BY_SECTOR).find(
//       (key) => slugify(key) === sectorSlug
//     );
//     if (!sectorKey)
//       return {
//         currentSector: null,
//         caseStudy: null,
//         series: [] as CaseStudy[],
//         currentIndex: -1,
//       };

//     const currentSector = CASE_STUDIES_BY_SECTOR[sectorKey];
//     const series = currentSector; // keep given order (or sort by name if you prefer)
//     const caseStudy =
//       series.find((it) => slugify(it.name) === caseSlug) || null;
//     const currentIndex = caseStudy
//       ? series.findIndex((it) => slugify(it.name) === caseSlug)
//       : -1;

//     return { currentSector, caseStudy, series, currentIndex };
//   }, [sectorSlug, caseSlug]);

//   /* FIXED: always include /casestudies prefix */
//   const pushToCase = useCallback(
//     (target: CaseStudy) => {
//       const href =
//         `${BASE_PATH}/${sectorSlug}/${slugify(target.name)}` +
//         (preservedNameParam
//           ? `?name=${encodeURIComponent(preservedNameParam)}`
//           : "");
//       router.push(href);
//     },
//     [router, sectorSlug, preservedNameParam]
//   );

//   const gotoSibling = useCallback(
//     (offset: number) => {
//       if (!series?.length || currentIndex < 0) return;
//       const nextIndex = (currentIndex + offset + series.length) % series.length;
//       pushToCase(series[nextIndex]);
//     },
//     [series, currentIndex, pushToCase]
//   );

//   if (!caseStudy || !currentSector) {
//     return (
//       <div className="container mx-auto p-8 min-h-screen flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <h1 className="text-3xl font-bold mb-2 text-gray-900">
//             Case Study Not Found
//           </h1>
//           <p className="text-gray-600 mb-6">
//             The requested case study could not be found. Please check the URL
//             and try again.
//           </p>
//           <Button
//             type="primary"
//             size="large"
//             onClick={() => router.push(BASE_PATH)}
//             style={{ backgroundColor: BRAND }}
//           >
//             Back to Case Studies
//           </Button>
//         </motion.div>
//       </div>
//     );
//   }

//   const images = useMemo(
//     () =>
//       caseStudy.avatar && caseStudy.avatar !== ""
//         ? [caseStudy.avatar]
//         : ["/default-case-study-image.jpg"],
//     [caseStudy.avatar]
//   );

//   const badges = useMemo(
//     () =>
//       [caseStudy.role, caseStudy.city || "", caseStudy.company || ""].filter(
//         Boolean
//       ) as string[],
//     [caseStudy]
//   );

//   const pdfUrl = useMemo(() => {
//     if (!caseStudy.pdf) return "";
//     const raw = caseStudy.pdf.startsWith("/")
//       ? caseStudy.pdf
//       : `/${caseStudy.pdf}`;
//     return encodeURI(raw);
//   }, [caseStudy.pdf]);

//   const readTime = useMemo(
//     () =>
//       calculateReadTime([
//         ...(caseStudy.challenges || []),
//         ...(caseStudy.solutions || []),
//         ...(caseStudy.results || []),
//         caseStudy.quote || "",
//       ]),
//     [caseStudy]
//   );

//   return (
//     <ConfigProvider theme={{ token: { colorPrimary: BRAND } }}>
//       <DetailUI
//         caseStudy={caseStudy}
//         images={images}
//         badges={badges}
//         pdfUrl={pdfUrl}
//         readTime={readTime}
//         sectorTitle={sectorSlug
//           .replace(/-/g, " ")
//           .replace(/\b\w/g, (l) => l.toUpperCase())}
//         onPrev={() => gotoSibling(-1)}
//         onNext={() => gotoSibling(1)}
//         onCaseSelect={pushToCase}
//         relatedCases={series}
//         caseSlug={caseSlug}
//       />
//     </ConfigProvider>
//   );
// }

// /* ===== UI Component ===== */
// function DetailUI({
//   caseStudy,
//   images,
//   badges,
//   pdfUrl,
//   readTime,
//   sectorTitle,
//   onPrev,
//   onNext,
//   onCaseSelect,
//   relatedCases,
//   caseSlug,
// }: {
//   caseStudy: CaseStudy;
//   images: string[];
//   badges: string[];
//   pdfUrl: string;
//   readTime: number;
//   sectorTitle: string;
//   onPrev: () => void;
//   onNext: () => void;
//   onCaseSelect: (c: CaseStudy) => void;
//   relatedCases: CaseStudy[];
//   caseSlug: string;
// }) {
//   const prefersReduced = useReducedMotion();
//   const featuresRef = useRef<HTMLDivElement | null>(null);
//   const imgWrapRef = useRef<HTMLDivElement | null>(null);
//   const [liked, setLiked] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [lightboxIndex, setLightboxIndex] = useState(0);
//   const [imgLoaded, setImgLoaded] = useState<boolean[]>(
//     images.map(() => false)
//   );
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [shareModalOpen, setShareModalOpen] = useState(false);
//   const [pdfModalOpen, setPdfModalOpen] = useState(false);
//   const isInView = useInView(imgWrapRef, { amount: 0.1 });

//   const { scrollYProgress } = useScroll({
//     target: imgWrapRef,
//     offset: ["start end", "end start"],
//   });
//   const imgScale = useTransform(
//     scrollYProgress,
//     [0, 1],
//     [1, prefersReduced ? 1 : 1.04]
//   );

//   const { scrollYProgress: featProgress } = useScroll({
//     target: featuresRef,
//     offset: ["start 80%", "end 20%"],
//   });
//   const featWidth = useTransform(featProgress, [0, 1], ["0%", "100%"]);

//   const scrollToFeatures = useCallback(
//     () =>
//       featuresRef.current?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       }),
//     []
//   );
//   const onCopyLink = useCallback(async () => {
//     try {
//       await navigator.clipboard.writeText(window.location.href);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1600);
//       antdMsg.success("Link copied to clipboard!");
//     } catch {
//       antdMsg.error("Failed to copy link");
//     }
//   }, []);
//   const openLightboxAt = useCallback((idx: number) => {
//     setLightboxIndex(idx);
//     setLightboxOpen(true);
//     setZoomLevel(1);
//   }, []);

//   // Arrow keys for prev/next
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "ArrowLeft" && !lightboxOpen) onPrev();
//       if (e.key === "ArrowRight" && !lightboxOpen) onNext();
//       if (e.key === "Escape" && lightboxOpen) setLightboxOpen(false);
//       if (e.key === "+" && lightboxOpen)
//         setZoomLevel((z) => Math.min(z + 0.1, 3));
//       if (e.key === "-" && lightboxOpen)
//         setZoomLevel((z) => Math.max(z - 0.1, 0.5));
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [onPrev, onNext, lightboxOpen]);

//   return (
//     <div className="w-full bg-white">
//       {/* HERO */}
//       <motion.section
//         className="relative min-h-[95vh] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-white"
//         initial="initial"
//         whileInView="animate"
//         viewport={{ amount: 0.2 }}
//       >
//         {/* background accents */}
//         <div className="pointer-events-none absolute inset-0 -z-10">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
//             whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
//             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
//             className="absolute top-[-15%] left-[-15%] h-[40rem] w-[40rem] rounded-full blur-3xl"
//             style={{
//               background: `radial-gradient(800px circle at 30% 30%, ${BRAND}18, ${BRAND_TINT}08, transparent)`,
//             }}
//           />
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
//             whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
//             transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
//             className="absolute bottom-[-15%] right-[-15%] h-[38rem] w-[38rem] rounded-full blur-3xl"
//             style={{
//               background: `radial-gradient(700px circle at 70% 70%, ${BRAND_TINT}15, ${BRAND}05, transparent)`,
//             }}
//           />
//         </div>

//         <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left */}
//           <div className="relative flex items-center order-2 lg:order-1">
//             <div className="px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12 w-full">
//               <motion.div
//                 {...riseIn(0)}
//                 className="flex items-center gap-2 text-sm text-gray-500 mb-6"
//               >
//                 <Globe className="h-4 w-4" />
//                 <span>Case Studies</span>
//                 <span>/</span>
//                 <span className="text-gray-900 font-medium">{sectorTitle}</span>
//               </motion.div>

//               <motion.h1
//                 {...riseIn(0.05)}
//                 className="relative text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-tight mb-6"
//               >
//                 <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
//                   {caseStudy.name}
//                 </span>
//                 <motion.span
//                   initial={{ width: 0 }}
//                   whileInView={{ width: "100%" }}
//                   transition={{ duration: 0.8, delay: 0.5 }}
//                   className="absolute -bottom-3 left-0 h-2 rounded-full"
//                   style={{
//                     background: `linear-gradient(90deg, ${BRAND}, ${BRAND_TINT}, ${BRAND})`,
//                   }}
//                 />
//               </motion.h1>

//               <motion.div
//                 {...riseIn(0.08)}
//                 className="flex flex-wrap items-center gap-4 mb-6"
//               ></motion.div>

//               <motion.div
//                 {...riseIn(0.1)}
//                 className="flex flex-wrap items-center gap-3 mb-6"
//               >
//                 {badges.slice(0, 3).map((badge, i) => (
//                   <motion.div
//                     key={i}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Tag
//                       color="blue"
//                       className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium border-0 shadow-sm hover:shadow-md transition-all duration-200"
//                       style={{ backgroundColor: `${BRAND}10`, color: BRAND }}
//                       onClick={() => antdMsg.info(`Tag: ${badge}`)}
//                     >
//                       {badge}
//                     </Tag>
//                   </motion.div>
//                 ))}
//               </motion.div>

//               <motion.div
//                 {...riseIn(0.12)}
//                 className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl mb-8"
//               >
//                 <InfoTile
//                   icon={<User className="h-5 w-5 text-blue-600" />}
//                   title="Role"
//                   value={caseStudy.role}
//                   colorClass="bg-blue-100"
//                 />
//                 <InfoTile
//                   icon={<Building className="h-5 w-5 text-green-600" />}
//                   title="Company"
//                   value={caseStudy.company || "Confidential"}
//                   colorClass="bg-green-100"
//                 />
//                 <InfoTile
//                   icon={<MapPin className="h-5 w-5 text-purple-600" />}
//                   title="Location"
//                   value={caseStudy.city || "Global"}
//                   colorClass="bg-purple-100"
//                 />
//               </motion.div>

//               <motion.blockquote
//                 {...riseIn(0.14)}
//                 className="relative pl-6 border-l-4 border-blue-400 bg-blue-50 p-6 rounded-r-2xl mb-8"
//               >
//                 <p className="text-lg sm:text-xl leading-relaxed text-gray-700 italic font-medium">
//                   “
//                   {caseStudy.quote ||
//                     "Outstanding results delivered through innovative solutions and strategic implementation."}
//                   ”
//                 </p>
//                 <cite className="block mt-3 text-sm font-semibold text-gray-900">
//                   —{" "}
//                   {caseStudy.company
//                     ? `${caseStudy.role}, ${caseStudy.company}`
//                     : caseStudy.role}
//                 </cite>
//               </motion.blockquote>

//               <motion.div
//                 {...riseIn(0.16)}
//                 className="flex flex-wrap items-center gap-4"
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={scrollToFeatures}
//                   className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
//                 >
//                   <BarChart3 className="h-5 w-5" />
//                   <span className="font-semibold">View Case Details</span>
//                   <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
//                 </motion.button>

//                 {!!pdfUrl && (
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => setPdfModalOpen(true)}
//                     className="inline-flex items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 text-gray-800 shadow-md transition-all duration-300 hover:shadow-lg"
//                   >
//                     <FileText className="h-5 w-5" />
//                     <span className="font-medium">View PDF</span>
//                   </motion.button>
//                 )}

//                 <div className="flex items-center gap-2">
//                   <IconBtn active={liked} onClick={() => setLiked((v) => !v)}>
//                     <Heart
//                       className={`h-5 w-5 ${
//                         liked ? "fill-current text-red-600" : "text-gray-600"
//                       }`}
//                     />
//                   </IconBtn>
//                   <IconBtn onClick={() => setShareModalOpen(true)}>
//                     <Share2 className="h-5 w-5 text-gray-600" />
//                   </IconBtn>
//                 </div>

//                 {/* Navigation Controls — FIXED PATH handled in pushToCase() */}
//                 <div className="flex items-center rounded-2xl border-2 border-gray-200 bg-white shadow-sm">
//                   <motion.button
//                     whileTap={{ scale: 0.95 }}
//                     whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
//                     onClick={onPrev}
//                     className="p-4 text-gray-700 transition-colors"
//                     aria-label="Previous case study"
//                   >
//                     <ChevronLeft className="h-6 w-6" />
//                   </motion.button>
//                   <div className="w-px h-8 bg-gray-200" />
//                   <motion.button
//                     whileTap={{ scale: 0.95 }}
//                     whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
//                     onClick={onNext}
//                     className="p-4 text-gray-700 transition-colors"
//                     aria-label="Next case study"
//                   >
//                     <ChevronRight className="h-6 w-6" />
//                   </motion.button>
//                 </div>
//               </motion.div>
//             </div>
//           </div>

//           {/* Right: Gallery */}
//           <div className="relative min-h-[60vh] lg:min-h-full order-1 lg:order-2">
//             <motion.div
//               ref={imgWrapRef}
//               className="absolute inset-0 p-4 lg:p-8"
//               style={{ scale: imgScale as any }}
//               initial={{ opacity: 0, x: 40 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true, amount: 0.3 }}
//               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//             >
//               <div
//                 className="absolute -inset-2 rounded-3xl opacity-60"
//                 style={{
//                   background: `conic-gradient(from 180deg at 50% 50%, ${BRAND}40, ${BRAND_TINT}60, transparent 70%)`,
//                   filter: "blur(20px)",
//                 }}
//               />
//               <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-2xl">
//                 <button
//                   onClick={() => openLightboxAt(0)}
//                   className="group relative block h-full w-full overflow-hidden"
//                 >
//                   {!imgLoaded[0] && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//                       <Spin size="large" />
//                     </div>
//                   )}
//                   <img
//                     src={images[0]}
//                     alt="Case study showcase"
//                     className={`h-full w-full object-cover transition-all duration-700 ${
//                       imgLoaded[0] ? "opacity-100" : "opacity-0"
//                     } group-hover:scale-105`}
//                     loading="eager"
//                     onLoad={() => setImgLoaded([true])}
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     whileHover={{ opacity: 1, y: 0 }}
//                     className="absolute bottom-6 right-6 flex items-center gap-2 rounded-xl bg-black/60 backdrop-blur px-4 py-2 text-white"
//                   >
//                     <Eye className="h-4 w-4" />
//                     <span className="text-sm font-medium">Preview</span>
//                   </motion.div>
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.section>

//       {/* DETAILS */}
//       <section
//         ref={featuresRef}
//         className="relative w-full bg-gradient-to-b from-white to-gray-50"
//       >
//         <div className="sticky top-0 z-20 h-1 w-full bg-gray-200">
//           <motion.div
//             className="h-full"
//             style={{
//               width: featWidth,
//               background: `linear-gradient(90deg, ${BRAND}, ${BRAND_TINT})`,
//             }}
//           />
//         </div>
//         <div>
//           {" "}
//           <div className="mt-20">
//             <motion.div {...riseIn(0)} className="text-center mb-16">
//               <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
//                 Deep Dive Analysis
//               </h2>
//               <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//                 Explore the comprehensive breakdown of challenges, solutions,
//                 and outcomes for this project.
//               </p>
//             </motion.div>

//             <div className="relative mb-12 mt-40">
//               {/* Left illustration (Challenges) */}
//               <motion.img
//                 src={challange}
//                 alt="Challenges side"
//                 className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 select-none pointer-events-none"
//                 style={{ height: 400, width: 700 }}
//                 initial={slideFromLeft.initial}
//                 whileInView={slideFromRight.whileInView}
//                 // transition={slideFrom.transition}
//                 viewport={{ once: true, amount: 0.3 }}
//               />

//               {/* Right illustration (Solutions) */}
//               <motion.img
//                 src={sollution}
//                 alt="Solutions side"
//                 className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none"
//                 style={{ height: 400, width: 700 }}
//                 initial={slideFromRight.initial}
//                 whileInView={slideFromRight.whileInView}
//                 transition={slideFromRight.transition}
//                 viewport={{ once: true, amount: 0.3 }}
//               />

//               {/* Center “bridge” bars */}
//               <motion.div
//                 className="mx-auto max-w-3xl"
//                 initial={bridgeReveal.initial}
//                 whileInView={bridgeReveal.whileInView}
//                 transition={bridgeReveal.transition}
//                 viewport={{ once: true, amount: 0.4 }}
//               >
//                 <div className="h-4 rounded-full bg-gray-300/80" />
//                 <div className="mt-3 h-4 w-2/3 mx-auto rounded-full bg-gray-200" />
//               </motion.div>
//             </div>
//           </div>
//         </div>
//         <div className="mx-auto max-w-7xl px-6 py-20">
//           <div className="mx-auto max-w-7xl px-6 py-20">
//             {/* Two columns: Challenges (left) | Solutions (right) */}
//             <div className="grid md:grid-cols-2 gap-12 items-stretch mb-16">
//               {/* Challenges */}
//               <motion.div
//                 initial={{ opacity: 0, y: 24 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
//                 className="relative h-full min-h-[22rem] rounded-2xl border border-red-100 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
//                     <Target className="h-6 w-6 text-red-600" />
//                   </div>
//                   <h3 className="text-xl font-extrabold text-gray-900">
//                     Challenges
//                   </h3>
//                 </div>

//                 <ul className="flex-1 space-y-3 list-disc list-outside pl-6">
//                   {(caseStudy.challenges || []).map((ch, i) => (
//                     <motion.li
//                       key={i}
//                       initial={{ opacity: 0, x: -12 }}
//                       whileInView={{ opacity: 1, x: 0 }}
//                       viewport={{ once: true }}
//                       transition={{ duration: 0.35, delay: i * 0.06 }}
//                       className="text-gray-700 leading-relaxed"
//                     >
//                       {ch}
//                     </motion.li>
//                   ))}
//                 </ul>

//                 {/* animated underline */}
//                 <motion.span
//                   initial={{ scaleX: 0 }}
//                   whileInView={{ scaleX: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.8, ease: "easeOut" }}
//                   className="absolute left-8 right-8 bottom-6 h-0.5 origin-left bg-gradient-to-r from-red-400 to-transparent"
//                 />
//               </motion.div>

//               {/* Solutions */}
//               <motion.div
//                 initial={{ opacity: 0, y: 24 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{
//                   duration: 0.6,
//                   delay: 0.1,
//                   ease: [0.16, 1, 0.3, 1],
//                 }}
//                 className="relative h-full min-h-[22rem] rounded-2xl border border-green-100 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration:300"
//               >
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
//                     <Award className="h-6 w-6 text-green-600" />
//                   </div>
//                   <h3 className="text-xl font-extrabold text-gray-900">
//                     Solutions
//                   </h3>
//                 </div>

//                 <ul className="flex-1 space-y-3 list-disc list-outside pl-6">
//                   {(caseStudy.solutions || []).map((sol, i) => (
//                     <motion.li
//                       key={i}
//                       initial={{ opacity: 0, x: 12 }}
//                       whileInView={{ opacity: 1, x: 0 }}
//                       viewport={{ once: true }}
//                       transition={{ duration: 0.35, delay: i * 0.06 }}
//                       className="text-gray-700 leading-relaxed"
//                     >
//                       {sol}
//                     </motion.li>
//                   ))}
//                 </ul>

//                 {/* animated underline */}
//                 <motion.span
//                   initial={{ scaleX: 0 }}
//                   whileInView={{ scaleX: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.8, ease: "easeOut" }}
//                   className="absolute left-8 right-8 bottom-6 h-0.5 origin-left bg-gradient-to-r from-green-400 to-transparent"
//                 />
//               </motion.div>
//             </div>

//             {/* Results (full width) */}
//             <motion.div
//               initial={{ opacity: 0, y: 24 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{
//                 duration: 0.6,
//                 delay: 0.15,
//                 ease: [0.16, 1, 0.3, 1],
//               }}
//               className="relative rounded-2xl border border-blue-100 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
//                   <TrendingUp className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-xl font-extrabold text-gray-900">
//                   Results & Outcomes
//                 </h3>
//               </div>

//               <ul className="space-y-3 list-disc list-outside pl-6">
//                 {(caseStudy.results || []).map((res, i) => (
//                   <motion.li
//                     key={i}
//                     initial={{ opacity: 0, y: 12 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.4, delay: i * 0.06 }}
//                     className="text-gray-800 leading-relaxed font-medium"
//                   >
//                     {res}
//                   </motion.li>
//                 ))}
//               </ul>

//               <motion.span
//                 initial={{ scaleX: 0 }}
//                 whileInView={{ scaleX: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.8, ease: "easeOut" }}
//                 className="absolute left-8 right-8 bottom-6 h-0.5 origin-left bg-gradient-to-r from-blue-400 to-transparent"
//               />
//             </motion.div>
//           </div>

//           <motion.div {...riseIn(0.2)}>
//             <Collapse
//               size="large"
//               className="mb-12 bg-white rounded-2xl shadow-lg overflow-hidden border-0"
//               items={[
//                 {
//                   key: "challenges",
//                   label: (
//                     <div className="flex items-center gap-4 py-2">
//                       <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
//                         <Target className="h-6 w-6 text-red-600" />
//                       </div>
//                       <div>
//                         <h3 className="text-lg font-bold text-gray-900">
//                           Challenges & Obstacles
//                         </h3>
//                         <p className="text-sm text-gray-600">
//                           Key problems that needed to be solved
//                         </p>
//                       </div>
//                     </div>
//                   ),
//                   children: (
//                     <div className="pl-16 pb-6">
//                       <div className="grid gap-4">
//                         {(caseStudy.challenges || []).map((ch, i) => (
//                           <div
//                             key={i}
//                             className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100"
//                           >
//                             <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                               <span className="text-red-800 font-bold text-sm">
//                                 {i + 1}
//                               </span>
//                             </div>
//                             <p className="text-gray-800 leading-relaxed">
//                               {ch}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ),
//                 },
//                 {
//                   key: "solutions",
//                   label: (
//                     <div className="flex items-center gap-4 py-2">
//                       <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                         <Award className="h-6 w-6 text-green-600" />
//                       </div>
//                       <div>
//                         <h3 className="text-lg font-bold text-gray-900">
//                           Solutions & Strategies
//                         </h3>
//                         <p className="text-sm text-gray-600">
//                           Innovative approaches implemented
//                         </p>
//                       </div>
//                     </div>
//                   ),
//                   children: (
//                     <div className="pl-16 pb-6">
//                       <div className="grid gap-4">
//                         {(caseStudy.solutions || []).map((sol, i) => (
//                           <div
//                             key={i}
//                             className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100"
//                           >
//                             <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                               <Check className="h-5 w-5 text-green-800" />
//                             </div>
//                             <p className="text-gray-800 leading-relaxed">
//                               {sol}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ),
//                 },
//                 {
//                   key: "results",
//                   label: (
//                     <div className="flex items-center gap-4 py-2">
//                       <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                         <TrendingUp className="h-6 w-6 text-blue-600" />
//                       </div>
//                       <div>
//                         <h3 className="text-lg font-bold text-gray-900">
//                           Results & Outcomes
//                         </h3>
//                         <p className="text-sm text-gray-600">
//                           Measurable impact and achievements
//                         </p>
//                       </div>
//                     </div>
//                   ),
//                   children: (
//                     <div className="pl-16 pb-6">
//                       <div className="grid gap-4">
//                         {(caseStudy.results || []).map((res, i) => (
//                           <div
//                             key={i}
//                             className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100"
//                           >
//                             <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                               <Star className="h-5 w-5 text-blue-800" />
//                             </div>
//                             <p className="text-gray-800 leading-relaxed font-medium">
//                               {res}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ),
//                 },
//               ]}
//             />
//           </motion.div>
//         </div>
//       </section>

//       {/* PDF Preview */}

//       {/* Related (by name/slug) */}
//       <RelatedCaseStudiesCarousel
//         currentCaseSlug={caseSlug}
//         sectorCases={relatedCases}
//         sectorTitle={sectorTitle}
//         onCaseSelect={onCaseSelect}
//       />

//       {/* Lightbox */}
//       <Modal
//         open={lightboxOpen}
//         onCancel={() => setLightboxOpen(false)}
//         footer={null}
//         width="95vw"
//         centered
//         className="lightbox-modal"
//         styles={{
//           body: { padding: 0 },
//           mask: { backgroundColor: "rgba(0,0,0,0.95)" },
//         }}
//       >
//         <div className="relative bg-black">
//           <div className="relative">
//             <img
//               src={images[lightboxIndex]}
//               alt={`Preview ${lightboxIndex + 1}`}
//               className="w-full max-h-[90vh] object-contain mx-auto"
//               style={{
//                 transform: `scale(${zoomLevel})`,
//                 transition: "transform 0.2s ease",
//               }}
//             />
//           </div>
//           <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-black/60 backdrop-blur rounded-2xl p-3">
//             <Button
//               type="text"
//               icon={<ZoomOut className="h-5 w-5" />}
//               onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.5))}
//               className="text-white hover:text-gray-300"
//             />
//             <span className="text-white text-sm px-2">
//               {Math.round(zoomLevel * 100)}%
//             </span>
//             <Button
//               type="text"
//               icon={<ZoomIn className="h-5 w-5" />}
//               onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 3))}
//               className="text-white hover:text-gray-300"
//             />
//           </div>
//         </div>
//       </Modal>

//       {/* Share */}
//       <Modal
//         open={shareModalOpen}
//         onCancel={() => setShareModalOpen(false)}
//         footer={null}
//         title={
//           <div className="flex items-center gap-3">
//             <Share2 className="h-5 w-5 text-blue-600" />
//             <span>Share This Case Study</span>
//           </div>
//         }
//         centered
//         width={480}
//       >
//         <div className="py-4">
//           <p className="text-gray-600 mb-6">
//             Share this case study with your network and colleagues.
//           </p>
//           <Space direction="vertical" size="middle" className="w-full">
//             <Button
//               size="large"
//               icon={<Copy className="h-5 w-5" />}
//               onClick={() => {
//                 navigator.clipboard.writeText(window.location.href);
//                 setCopied(true);
//                 setTimeout(() => setCopied(false), 1600);
//                 antdMsg.success("Link copied to clipboard!");
//               }}
//               className={`w-full ${
//                 copied ? "bg-green-50 border-green-200" : ""
//               }`}
//               type={copied ? "default" : "primary"}
//             >
//               {copied ? "Link Copied!" : "Copy Link to Clipboard"}
//             </Button>
//             <Divider>Or share via</Divider>
//             <div className="grid grid-cols-2 gap-3">
//               <Button
//                 size="large"
//                 className="h-12"
//                 onClick={() => {
//                   const url = encodeURIComponent(window.location.href);
//                   const text = encodeURIComponent(
//                     `Check out this case study: ${caseStudy.name}`
//                   );
//                   window.open(
//                     `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
//                     "_blank"
//                   );
//                 }}
//               >
//                 Twitter
//               </Button>
//               <Button
//                 size="large"
//                 className="h-12"
//                 onClick={() => {
//                   const url = encodeURIComponent(window.location.href);
//                   window.open(
//                     `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
//                     "_blank"
//                   );
//                 }}
//               >
//                 LinkedIn
//               </Button>
//             </div>
//           </Space>
//         </div>
//       </Modal>

//       <Modal
//         open={pdfModalOpen}
//         onCancel={() => setPdfModalOpen(false)}
//         footer={null}
//         width="95vw"
//         centered
//         title={
//           <div className="flex items-center gap-3">
//             <FileText className="h-5 w-5 text-blue-600" />
//             <span>{caseStudy.name} - Complete Documentation</span>
//           </div>
//         }
//         styles={{ body: { padding: 0, height: "85vh" } }}
//       >
//         <EnhancedPDFViewer
//           pdfUrl={pdfUrl}
//           title={caseStudy.name}
//           className="h-full"
//         />
//       </Modal>

//       <style jsx global>{`
//         .lightbox-modal .ant-modal-content {
//           background: transparent;
//           box-shadow: none;
//         }
//       `}</style>
//     </div>
//   );
// }

// function InfoTile({
//   icon,
//   title,
//   value,
//   colorClass,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   value: string;
//   colorClass: string;
// }) {
//   return (
//     <div className="flex items-center gap-3">
//       <div
//         className={`w-10 h-10 ${colorClass} rounded-xl flex items-center justify-center`}
//       >
//         {icon}
//       </div>
//       <div>
//         <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
//         <p className="font-semibold text-gray-900">{value}</p>
//       </div>
//     </div>
//   );
// }

// function IconBtn({
//   children,
//   onClick,
//   active,
// }: {
//   children: React.ReactNode;
//   onClick?: () => void;
//   active?: boolean;
// }) {
//   return (
//     <motion.button
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={onClick}
//       className={`p-3 rounded-xl border-2 transition-all duration-300 ${
//         active
//           ? "bg-red-50 border-red-200"
//           : "bg-gray-50 border-gray-200 hover:bg-gray-100"
//       }`}
//     >
//       {children}
//     </motion.button>
//   );
// }
"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CaseStudy, CASE_STUDIES_BY_SECTOR } from "@/app/data/Casestudy";
import {
  Carousel,
  Tag,
  message as antdMsg,
  ConfigProvider,
  Button,
  Collapse,
  Progress,
  Space,
  Spin,
} from "antd";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Target,
  Award,
  MapPin,
  Building,
  User,
  ArrowLeft,
  ArrowRight,
  Star,
  BarChart3,
  Globe,
  Eye,
} from "lucide-react";

/* ===== Brand ===== */
const BRAND = "#07518a";
const BRAND_TINT = "#0a6ab8";

/* ===== Static images (side ornaments) ===== */
const CHALLENGE_IMG = "/c1-01.png";
const SOLUTION_IMG = "/c2-01.png";

/* ===== Routing base path ===== */
const BASE_PATH = "/casestudies";

/* ===== Animations ===== */
const riseIn = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3, margin: "-10% 0px -10% 0px" },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});
const slideFromLeft = {
  initial: { x: "-20vw", opacity: 0 },
  whileInView: { x: 0, opacity: 1 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};
const slideFromRight = {
  initial: { x: "20vw", opacity: 0 },
  whileInView: { x: 0, opacity: 1 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};
const bridgeReveal = {
  initial: { opacity: 0, scale: 0.96 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut" },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      delay: Math.min(i * 0.06, 0.3),
    },
  }),
  hover: { y: -6, scale: 1.01 },
};

/* ===== Utils ===== */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function calculateReadTime(content: string[]): number {
  const wordCount = content.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.ceil(wordCount / 200);
}

/* ===== Image-only Related Carousel (no card bg) ===== */
function RelatedCaseStudiesCarousel({
  currentCaseSlug,
  sectorCases,
  sectorTitle,
  onCaseSelect,
}: {
  currentCaseSlug: string;
  sectorCases: CaseStudy[];
  sectorTitle: string;
  onCaseSelect: (c: CaseStudy) => void;
}) {
  const related = useMemo(
    () => sectorCases.filter((c) => slugify(c.name) !== currentCaseSlug),
    [sectorCases, currentCaseSlug]
  );
  if (!related.length) return null;

  return (
    <motion.section {...riseIn(0)} className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <motion.h2
          {...riseIn(0.05)}
          className="text-3xl md:text-4xl font-black text-gray-900"
        >
          More {sectorTitle} Success Stories
        </motion.h2>
      </div>

      <Carousel
        dots={false}
        slidesToShow={3}
        slidesToScroll={1}
        autoplay
        autoplaySpeed={4500}
        infinite={related.length > 3}
        responsive={[
          { breakpoint: 1024, settings: { slidesToShow: 2 } },
          { breakpoint: 640, settings: { slidesToShow: 1 } },
        ]}
        prevArrow={<CarouselArrow direction="prev" />}
        nextArrow={<CarouselArrow direction="next" />}
      >
        {related.map((cs, i) => (
          <div key={slugify(cs.name)} className="px-3">
            <motion.button
              variants={cardVariants}
              custom={i}
              initial="hidden"
              whileInView="show"
              whileHover="hover"
              viewport={{ once: true, amount: 0.25 }}
              onClick={() => onCaseSelect(cs)}
              className="group relative block overflow-hidden rounded-2xl focus:outline-none"
              aria-label={`Open case study ${cs.name}`}
            >
              <img
                src={cs.avatar || "/default-case-study-image.jpg"}
                alt={cs.name}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="pointer-events-none absolute bottom-3 left-3 right-3">
                <p className="text-white/95 font-semibold drop-shadow-sm">
                  {cs.name}
                </p>
                <p className="text-white/80 text-xs">
                  {(cs.company ?? "Confidential") +
                    (cs.city ? ` • ${cs.city}` : "")}
                </p>
              </div>
            </motion.button>
          </div>
        ))}
      </Carousel>
    </motion.section>
  );
}

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick?: () => void;
}) {
  return (
    <Button
      type="text"
      className={`absolute top-1/2 -translate-y-1/2 z-10 ${
        direction === "prev" ? "-left-12" : "-right-12"
      } w-10 h-10 rounded-full bg-white shadow-lg border-0 flex items-center justify-center hover:bg-gray-50`}
      onClick={onClick}
      icon={
        direction === "prev" ? (
          <ArrowLeft className="h-5 w-5" />
        ) : (
          <ArrowRight className="h-5 w-5" />
        )
      }
    />
  );
}

/* ===== Page ===== */
export default function CaseStudyDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sectorSlug = (params?.sector as string) || "";
  const caseSlug = (params?.case as string) || "";
  const preservedNameParam = searchParams.get("name") || "";

  const { currentSector, caseStudy, series, currentIndex } = useMemo(() => {
    const sectorKey = Object.keys(CASE_STUDIES_BY_SECTOR).find(
      (key) => slugify(key) === sectorSlug
    );
    if (!sectorKey)
      return {
        currentSector: null,
        caseStudy: null,
        series: [] as CaseStudy[],
        currentIndex: -1,
      };

    const currentSector = CASE_STUDIES_BY_SECTOR[sectorKey];
    const series = currentSector; // keep order
    const caseStudy =
      series.find((it) => slugify(it.name) === caseSlug) || null;
    const currentIndex = caseStudy
      ? series.findIndex((it) => slugify(it.name) === caseSlug)
      : -1;

    return { currentSector, caseStudy, series, currentIndex };
  }, [sectorSlug, caseSlug]);

  const pushToCase = useCallback(
    (target: CaseStudy) => {
      const href =
        `${BASE_PATH}/${sectorSlug}/${slugify(target.name)}` +
        (preservedNameParam
          ? `?name=${encodeURIComponent(preservedNameParam)}`
          : "");
      router.push(href);
    },
    [router, sectorSlug, preservedNameParam]
  );

  const gotoSibling = useCallback(
    (offset: number) => {
      if (!series?.length || currentIndex < 0) return;
      const nextIndex = (currentIndex + offset + series.length) % series.length;
      pushToCase(series[nextIndex]);
    },
    [series, currentIndex, pushToCase]
  );

  if (!caseStudy || !currentSector) {
    return (
      <div className="container mx-auto p-8 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Case Study Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested case study could not be found. Please check the URL
            and try again.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => router.push(BASE_PATH)}
            style={{ backgroundColor: BRAND }}
          >
            Back to Case Studies
          </Button>
        </motion.div>
      </div>
    );
  }

  const images = useMemo(
    () =>
      caseStudy.avatar && caseStudy.avatar !== ""
        ? [caseStudy.avatar]
        : ["/default-case-study-image.jpg"],
    [caseStudy.avatar]
  );

  const badges = useMemo(
    () =>
      [caseStudy.role, caseStudy.city || "", caseStudy.company || ""].filter(
        Boolean
      ) as string[],
    [caseStudy]
  );

  const readTime = useMemo(
    () =>
      calculateReadTime([
        ...(caseStudy.challenges || []),
        ...(caseStudy.solutions || []),
        ...(caseStudy.results || []),
        caseStudy.quote || "",
      ]),
    [caseStudy]
  );

  return (
    <ConfigProvider theme={{ token: { colorPrimary: BRAND } }}>
      <DetailUI
        caseStudy={caseStudy}
        images={images}
        badges={badges}
        readTime={readTime}
        sectorTitle={sectorSlug
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())}
        onPrev={() => gotoSibling(-1)}
        onNext={() => gotoSibling(1)}
        onCaseSelect={pushToCase}
        relatedCases={series}
        caseSlug={caseSlug}
      />
    </ConfigProvider>
  );
}

/* ===== UI Component ===== */
function DetailUI({
  caseStudy,
  images,
  badges,
  readTime,
  sectorTitle,
  onPrev,
  onNext,
  onCaseSelect,
  relatedCases,
  caseSlug,
}: {
  caseStudy: CaseStudy;
  images: string[];
  badges: string[];
  readTime: number;
  sectorTitle: string;
  onPrev: () => void;
  onNext: () => void;
  onCaseSelect: (c: CaseStudy) => void;
  relatedCases: CaseStudy[];
  caseSlug: string;
}) {
  const prefersReduced = useReducedMotion();
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const imgWrapRef = useRef<HTMLDivElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState<boolean[]>(
    images.map(() => false)
  );
  const isInView = useInView(imgWrapRef, { amount: 0.1 });

  // Parallax scale for right image
  const { scrollYProgress } = useScroll({
    target: imgWrapRef,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, prefersReduced ? 1 : 1.04]
  );

  // Sticky progress in details section
  const { scrollYProgress: featProgress } = useScroll({
    target: featuresRef,
    offset: ["start 80%", "end 20%"],
  });
  const featWidth = useTransform(featProgress, [0, 1], ["0%", "100%"]);

  const scrollToFeatures = useCallback(
    () =>
      featuresRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
    []
  );

  // Arrow keys for prev/next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext]);

  return (
    <div className="w-full bg-white">
      {/* ===== HERO (Left 3/4, Right 1/4) ===== */}
      <motion.section
        className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 to-white"
        initial="initial"
        whileInView="animate"
        viewport={{ amount: 0.2 }}
      >
        {/* subtle background accents */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[-15%] left-[-15%] h-[40rem] w-[40rem] rounded-full blur-3xl"
            style={{
              background: `radial-gradient(800px circle at 30% 30%, ${BRAND}18, ${BRAND_TINT}08, transparent)`,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[-15%] right-[-15%] h-[38rem] w-[38rem] rounded-full blur-3xl"
            style={{
              background: `radial-gradient(700px circle at 70% 70%, ${BRAND_TINT}15, ${BRAND}05, transparent)`,
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-center">
            {/* Left (3/4) */}
            <div className="lg:col-span-3">
              <motion.div
                {...riseIn(0)}
                className="flex items-center gap-2 text-sm text-gray-500 mb-6"
              >
                <Globe className="h-4 w-4" />
                <span>Case Studies</span>
                <span>/</span>
                <span className="text-gray-900 font-medium">{sectorTitle}</span>
                <span className="ml-auto text-xs text-gray-500">
                  ~{readTime} min read
                </span>
              </motion.div>

              <motion.h1
                {...riseIn(0.05)}
                className="relative text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-tight mb-6"
              >
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  {caseStudy.name}
                </span>
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute -bottom-3 left-0 h-2 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${BRAND}, ${BRAND_TINT}, ${BRAND})`,
                  }}
                />
              </motion.h1>

              {/* badges */}
              <motion.div
                {...riseIn(0.08)}
                className="flex flex-wrap items-center gap-3 mb-6"
              >
                {badges.slice(0, 3).map((badge, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05 }}>
                    <Tag
                      color="blue"
                      className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium border-0 shadow-sm hover:shadow-md transition-all duration-200"
                      style={{ backgroundColor: `${BRAND}10`, color: BRAND }}
                      onClick={() => antdMsg.info(`Tag: ${badge}`)}
                    >
                      {badge}
                    </Tag>
                  </motion.div>
                ))}
              </motion.div>

              {/* 3 key info tiles */}
              <motion.div
                {...riseIn(0.1)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl mb-8"
              >
                <InfoTile
                  icon={<User className="h-5 w-5 text-blue-600" />}
                  title="Role"
                  value={caseStudy.role}
                />
                <InfoTile
                  icon={<Building className="h-5 w-5 text-emerald-600" />}
                  title="Company"
                  value={caseStudy.company || "Confidential"}
                />
                <InfoTile
                  icon={<MapPin className="h-5 w-5 text-purple-600" />}
                  title="Location"
                  value={caseStudy.city || "Global"}
                />
              </motion.div>

              {/* quote */}
              <motion.blockquote
                {...riseIn(0.12)}
                className="relative pl-6 border-l-4 border-blue-500/70"
              >
                <p className="text-lg sm:text-xl leading-relaxed text-gray-700 italic">
                  “
                  {caseStudy.quote ||
                    "Outstanding results delivered through innovative solutions and strategic implementation."}
                  ”
                </p>
                <cite className="block mt-3 text-sm font-semibold text-gray-900">
                  {caseStudy.company
                    ? `${caseStudy.role}, ${caseStudy.company}`
                    : caseStudy.role}
                </cite>
              </motion.blockquote>

              {/* primary CTA + prev/next */}
              <motion.div
                {...riseIn(0.14)}
                className="mt-7 flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={scrollToFeatures}
                  className="group inline-flex items-center gap-3 rounded-xl px-6 py-3 text-white shadow-lg transition-all duration-300"
                  style={{
                    background: `linear-gradient(90deg, ${BRAND}, ${BRAND_TINT})`,
                  }}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-semibold">View Case Details</span>
                  <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
                </motion.button>

                <div className="flex items-center rounded-xl ring-1 ring-gray-200 bg-white">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onPrev}
                    className="p-3 text-gray-700"
                    aria-label="Previous case study"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </motion.button>
                  <div className="w-px h-7 bg-gray-200" />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onNext}
                    className="p-3 text-gray-700"
                    aria-label="Next case study"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Right (1/4) — small image, image-only */}
            <div className="lg:col-span-1">
              <motion.div
                ref={imgWrapRef}
                style={{ scale: imgScale as any }}
                className="relative"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  {!imgLoaded[0] && (
                    <div className="absolute inset-0 grid place-content-center bg-gray-100">
                      <Spin size="large" />
                    </div>
                  )}
                  <motion.img
                    src={images[0]}
                    alt={`${caseStudy.name} preview`}
                    className={`w-full h-[100px] object-contain transition-opacity duration-500 ${
                      imgLoaded[0] ? "opacity-100" : "opacity-0"
                    }`}
                    loading="eager"
                    onLoad={() => setImgLoaded([true])}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-black/55 backdrop-blur px-3 py-1.5 text-white"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== DETAILS ===== */}
      <section
        ref={featuresRef}
        className="relative w-full bg-gradient-to-b from-white to-gray-50"
      >
        {/* sticky progress bar */}
        <div className="sticky top-0 z-20 h-1 w-full bg-gray-200">
          <motion.div
            className="h-full"
            style={{
              width: featWidth,
              background: `linear-gradient(90deg, ${BRAND}, ${BRAND_TINT})`,
            }}
          />
        </div>

        {/* bridge + side art */}
        <div className="mt-20">
          <motion.div {...riseIn(0)} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Deep Dive Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore the comprehensive breakdown of challenges, solutions, and
              outcomes for this project.
            </p>
          </motion.div>

          <div className="relative mb-12 mt-40">
            <motion.img
              src={CHALLENGE_IMG}
              alt="Challenges side"
              className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 select-none pointer-events-none"
              style={{ height: 400, width: 700 }}
              initial={slideFromLeft.initial}
              whileInView={slideFromLeft.whileInView}
              transition={slideFromLeft.transition}
              viewport={{ once: true, amount: 0.3 }}
            />
            <motion.img
              src={SOLUTION_IMG}
              alt="Solutions side"
              className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none"
              style={{ height: 400, width: 700 }}
              initial={slideFromRight.initial}
              whileInView={slideFromRight.whileInView}
              transition={slideFromRight.transition}
              viewport={{ once: true, amount: 0.3 }}
            />
            <motion.div
              className="mx-auto max-w-3xl"
              initial={bridgeReveal.initial}
              whileInView={bridgeReveal.whileInView}
              transition={bridgeReveal.transition}
              viewport={{ once: true, amount: 0.4 }}
            >
              <div className="h-4 rounded-full bg-gray-300/80" />
              <div className="mt-3 h-4 w-2/3 mx-auto rounded-full bg-gray-200" />
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-20">
          {/* Challenges & Solutions */}
          <div className="grid md:grid-cols-2 gap-12 items-stretch mb-16">
            <DetailColumn
              tone="red"
              title="Challenges"
              icon={<Target className="h-6 w-6 text-red-600" />}
              items={caseStudy.challenges || []}
            />
            <DetailColumn
              tone="green"
              title="Solutions"
              icon={<Award className="h-6 w-6 text-green-600" />}
              items={caseStudy.solutions || []}
            />
          </div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-blue-100 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">
                Results & Outcomes
              </h3>
            </div>

            <ul className="space-y-3 list-disc list-outside pl-6">
              {(caseStudy.results || []).map((res, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="text-gray-800 leading-relaxed font-medium"
                >
                  {res}
                </motion.li>
              ))}
            </ul>

            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-8 right-8 bottom-6 h-0.5 origin-left bg-gradient-to-r from-blue-400 to-transparent"
            />
          </motion.div>

          {/* Optional collapsible summary blocks */}
          {/* <motion.div {...riseIn(0.2)} className="mt-12">
            <Collapse
              size="large"
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-0"
              items={[
                {
                  key: "challenges",
                  label: (
                    <HeaderRow
                      tone="red"
                      icon={<Target className="h-6 w-6 text-red-600" />}
                      title="Challenges & Obstacles"
                      subtitle="Key problems that needed to be solved"
                    />
                  ),
                  children: (
                    <BulletedList
                      tone="red"
                      items={caseStudy.challenges || []}
                    />
                  ),
                },
                {
                  key: "solutions",
                  label: (
                    <HeaderRow
                      tone="green"
                      icon={<Award className="h-6 w-6 text-green-600" />}
                      title="Solutions & Strategies"
                      subtitle="Innovative approaches implemented"
                    />
                  ),
                  children: (
                    <BulletedList
                      tone="green"
                      items={caseStudy.solutions || []}
                    />
                  ),
                },
                {
                  key: "results",
                  label: (
                    <HeaderRow
                      tone="blue"
                      icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
                      title="Results & Outcomes"
                      subtitle="Measurable impact and achievements"
                    />
                  ),
                  children: (
                    <BulletedList tone="blue" items={caseStudy.results || []} />
                  ),
                },
              ]}
            />
          </motion.div> */}
        </div>
      </section>

      {/* ===== RELATED (image-only) ===== */}
      <RelatedCaseStudiesCarousel
        currentCaseSlug={caseSlug}
        sectorCases={relatedCases}
        sectorTitle={sectorTitle}
        onCaseSelect={onCaseSelect}
      />
    </div>
  );
}

/* ===== Smaller UI pieces ===== */
function InfoTile({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center ring-1 ring-gray-200/70 bg-white">
        {icon}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
          {title}
        </p>
        <p className="text-gray-900 font-semibold">{value}</p>
      </div>
    </div>
  );
}

function DetailColumn({
  tone,
  title,
  icon,
  items,
}: {
  tone: "red" | "green";
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  const toneClass =
    tone === "red"
      ? "border-red-100 from-red-400"
      : "border-green-100 from-green-400";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative h-full min-h-[22rem] rounded-2xl border ${
        tone === "red" ? "border-red-100" : "border-green-100"
      } bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`w-12 h-12 rounded-xl ${
            tone === "red" ? "bg-red-100" : "bg-green-100"
          } flex items-center justify-center`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
      </div>

      <ul className="flex-1 space-y-3 list-disc list-outside pl-6">
        {items.map((it, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: tone === "red" ? -12 : 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="text-gray-700 leading-relaxed"
          >
            {it}
          </motion.li>
        ))}
      </ul>

      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`absolute left-8 right-8 bottom-6 h-0.5 origin-left bg-gradient-to-r ${
          tone === "red" ? "from-red-400" : "from-green-400"
        } to-transparent`}
      />
    </motion.div>
  );
}

function HeaderRow({
  tone,
  icon,
  title,
  subtitle,
}: {
  tone: "red" | "green" | "blue";
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  const toneBg =
    tone === "red"
      ? "bg-red-100"
      : tone === "green"
      ? "bg-green-100"
      : "bg-blue-100";
  return (
    <div className="flex items-center gap-4 py-2">
      <div
        className={`w-12 h-12 ${toneBg} rounded-xl flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

function BulletedList({
  tone,
  items,
}: {
  tone: "red" | "green" | "blue";
  items: string[];
}) {
  const toneItem =
    tone === "red"
      ? "bg-red-50 border-red-100"
      : tone === "green"
      ? "bg-green-50 border-green-100"
      : "bg-blue-50 border-blue-100";
  return (
    <div className="pl-16 pb-6">
      <div className="grid gap-4">
        {items.map((text, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 p-4 ${toneItem} rounded-xl border`}
          >
            <span className="text-gray-800 leading-relaxed">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
