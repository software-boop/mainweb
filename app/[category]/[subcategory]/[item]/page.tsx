"use client";
export const runtime = 'edge';

import React, { useMemo, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { MenuCategory, MenuItem, MENU_DATA } from "@/app/data/menuData";
import {
  ConfigProvider,
  Button,
  Typography,
  Tabs,
  Drawer,
  Card,
  List,
  Modal,
  Image as AntImage,
  Form,
  Input,
  message,
} from "antd";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

const { Title, Paragraph, Text } = Typography;

/* ===== Brand ===== */
const BRAND = "#07518a";
const BRAND_TINT = "#0a6ab8";

/* ===== Utils ===== */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const riseIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

const scrollToEl = (el?: HTMLElement | null) => {
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ===== Page ===== */
export default function InteractiveItemDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = (params?.category as string) || "";
  const subcategorySlug = (params?.subcategory as string) || "";
  const itemSlug = (params?.item as string) || "";
  const name = searchParams.get("name") || "";

  const { currentSubcat, item, series, currentIndex } = useMemo(() => {
    const section = MENU_DATA[category] || [];
    let currentSubcat: MenuCategory | null = null;
    let item: MenuItem | null = null;
    let series: MenuItem[] = [];
    let currentIndex = -1;

    for (const cat of section) {
      if (cat && slugify(cat.title) === subcategorySlug) {
        currentSubcat = cat;
        series = Array.isArray(cat.items) ? (cat.items as MenuItem[]) : [];
        item = series.find((it) => slugify(it.label) === itemSlug) || null;
        if (item) currentIndex = series.findIndex((it) => it === item);
        break;
      }
    }
    return { currentSubcat, item, series, currentIndex };
  }, [category, subcategorySlug, itemSlug]);

  const pushToItem = (target: MenuItem) => {
    const href =
      `/${category}/${subcategorySlug}/${slugify(target.label)}` +
      (name ? `?name=${encodeURIComponent(name)}` : "");
    router.push(href);
  };

  const gotoSibling = (offset: number) => {
    if (!series || !series.length || currentIndex < 0) return;
    const nextIndex = (currentIndex + offset + series.length) % series.length;
    pushToItem(series[nextIndex]);
  };

  if (!item || !currentSubcat) {
    return (
      <div className="container mx-auto p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Title level={2}>Item not found</Title>
          <Paragraph className="text-gray-600">
            The item you are looking for doesn't exist or may have been moved.
          </Paragraph>
          <Button
            type="primary"
            onClick={() => router.back()}
            className="rounded-full"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const images: string[] = (
    (Array.isArray((item as any).images) && (item as any).images.length > 0
      ? (item as any).images
      : [item.image]) as string[]
  ).filter(Boolean);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: BRAND } }}>
      <CleanMNCDetail
        label={item.label}
        description={item.description}
        features={item.features || []}
        featureIcons={item.featureIcons || []}
        images={images}
        onPrev={() => gotoSibling(-1)}
        onNext={() => gotoSibling(1)}
        groupTitle={currentSubcat.title}
        series={series}
        currentIndex={currentIndex}
        specsUrl={(item as any).specsUrl}
        badges={(item as any).badges || []}
      />
    </ConfigProvider>
  );
}

/* ===== View Component ===== */
function CleanMNCDetail({
  label,
  description,
  features,
  featureIcons,
  images,
  onPrev,
  onNext,
  groupTitle,
  series = [],
  currentIndex = 0,
  specsUrl,
  badges = [],
}: {
  label: string;
  description: string;
  features: string[];
  featureIcons: string[];
  images: string[];
  onPrev: () => void;
  onNext: () => void;
  groupTitle: string;
  series?: MenuItem[];
  currentIndex?: number;
  specsUrl?: string;
  badges?: string[];
}) {
  // ✅ All hooks are inside the function component body
  const prefersReduced = useReducedMotion();
  const [featureModal, setFeatureModal] = useState<string | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [form] = Form.useForm();

  // Detect product vs service
  const isProduct =
    Boolean(specsUrl) || /product|solution|device|hardware/i.test(groupTitle);

  // Subject auto-binding: include groupTitle + label
  const enquiryTitle = isProduct ? "Product Enquiry" : "Service Enquiry";
  const enquirySubject = `${enquiryTitle} | ${groupTitle} · ${label}`;

  // Ref for smooth scroll
  const featuresRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full bg-white">
      {/* HERO */}
      <section className="relative w-full min-h-[100dvh] flex items-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-[#f6fbff] to-[#eef6ff]" />
        <div className="mx-auto max-w-7xl px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
            {/* Left copy */}
            <motion.div {...riseIn(0)}>
              <Text className="uppercase tracking-widest text-[12px] text-gray-500">
                {groupTitle}
              </Text>

              <Title
                level={1}
                className="!mt-2 !mb-4 !text-4xl sm:!text-5xl md:!text-6xl font-extrabold tracking-tight"
                style={{ color: BRAND, lineHeight: 1.1 }}
              >
                {label}
              </Title>

              <Paragraph className="!text-lg md:!text-xl !text-gray-700 max-w-2xl">
                {description}
              </Paragraph>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  className="rounded-full"
                  onClick={onPrev}
                  icon={<ChevronLeft className="h-5 w-5" />}
                >
                  Previous
                </Button>
                <Button
                  className="rounded-full"
                  onClick={onNext}
                  icon={<ChevronRight className="h-5 w-5" />}
                >
                  Next
                </Button>
                <Button
                  type="primary"
                  className="rounded-full"
                  onClick={() => scrollToEl(featuresRef.current)}
                >
                  Explore Features
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => {
                    form.setFieldsValue({
                      subject: enquirySubject,
                      context: label,
                      type: isProduct ? "Product" : "Service",
                    });
                    setEnquiryOpen(true);
                  }}
                >
                  {isProduct ? "Product Enquiry" : "Service Enquiry"}
                </Button>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                {currentIndex + 1} / {series.length}
              </div>
            </motion.div>

            {/* Right visual */}
            <motion.div
              {...riseIn(0.05)}
              className="w-full flex justify-center"
            >
              <div className="relative rounded-2xl overflow-hidden w-[100%] sm:w-[70%] lg:w-1/2 h-[40vh]">
                <AntImage
                  src={images[0]}
                  alt={`${label} main`}
                  preview={{ movable: true }}
                  className="!w-full !h-full object-contain"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    background: "#fff",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Down arrow to features */}
          <div className="flex justify-center mt-10">
            <motion.button
              onClick={() => scrollToEl(featuresRef.current)}
              className="rounded-full border border-gray-200 px-5 py-3 text-gray-700 hover:bg-gray-50"
              whileHover={{ y: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              ↓ Explore features
            </motion.button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={featuresRef}
        className="relative w-full py-16 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...riseIn(0)} className="text-center mb-12">
            <Title level={2} className="!text-3xl md:!text-4xl !mb-3">
              Key Features
            </Title>
            <Paragraph className="!text-base md:!text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the capabilities that matter for enterprise deployments.
            </Paragraph>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div key={i} {...riseIn(i * 0.04)}>
                <Card
                  hoverable
                  className="rounded-2xl border border-gray-100 shadow-sm"
                  styles={{ body: { padding: 20 } }}
                  onClick={() => setFeatureModal(feature)}
                >
                  <div className="flex items-center gap-4">
                    {/* <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      {featureIcons?.[i] ? (
                        <img
                          src={featureIcons[i]}
                          alt={`${feature} icon`}
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <Info className="h-6 w-6 text-blue-600" />
                      )}
                    </div> */}
                    <div>
                      <Text strong className="text-[15px] leading-tight">
                        {feature}
                      </Text>
                      <div className="text-gray-500 text-xs mt-1">
                        Tap to learn more
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUEST ABOUT THIS */}
      <section className="relative w-full py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div
            className="rounded-3xl p-10 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
            style={{
              background: `linear-gradient(135deg, ${BRAND}15, ${BRAND_TINT}10, #ffffff)`,
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <Title level={2} className="!mb-2" style={{ color: BRAND }}>
                  Request About This
                </Title>
                <Paragraph className="!mb-4 !text-gray-700 max-w-2xl">
                  Tell us what you need regarding <strong>{label}</strong>. Our
                  team will get back with relevant details and options.
                </Paragraph>
                {!!badges.length && (
                  <div className="flex flex-wrap gap-2">
                    {badges.slice(0, 6).map((b, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: `${BRAND}20`, color: BRAND }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <Button
                  type="primary"
                  size="large"
                  className="rounded-full px-8"
                  onClick={() => {
                    form.setFieldsValue({
                      subject: enquirySubject,
                      context: label,
                      type: isProduct ? "Product" : "Service",
                    });
                    setEnquiryOpen(true);
                  }}
                >
                  Request About This
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature quick modal */}
      <Modal
        open={!!featureModal}
        onCancel={() => setFeatureModal(null)}
        footer={null}
        centered
        title={featureModal || "Feature"}
      >
        <Paragraph>
          This feature is designed for reliability, performance, and seamless
          integration in enterprise environments.
        </Paragraph>
      </Modal>

      {/* Enquiry modal */}
      <Modal
        open={enquiryOpen}
        onCancel={() => setEnquiryOpen(false)}
        title={enquiryTitle}
        okText="Send"
        okButtonProps={{ className: "rounded-full" }}
        cancelButtonProps={{ className: "rounded-full" }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log("Enquiry submitted", values); // replace with API call
              message.success("Your enquiry has been submitted.");
              setEnquiryOpen(false);
              form.resetFields();
            })
            .catch(() => {});
        }}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            subject: enquirySubject,
            context: label,
            type: isProduct ? "Product" : "Service",
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Form.Item label="Subject" name="subject" className="md:col-span-2">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Your name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { type: "email", required: true, message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input placeholder="Optional" />
          </Form.Item>
          <Form.Item
            label="Message"
            name="message"
            className="md:col-span-2"
            rules={[{ required: true, message: "Please add a short message" }]}
          >
            <Input.TextArea
              placeholder={`Tell us about your requirements for ${label}`}
              rows={4}
            />
          </Form.Item>
          <Form.Item name="context" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

// "use client";

// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
// } from "react";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import axios, { AxiosInstance } from "axios";
// import {
//   Card,
//   Carousel,
//   Modal,
//   Tooltip,
//   Tag,
//   message as antdMsg,
//   ConfigProvider,
//   Skeleton,
//   Button,
//   Rate,
//   Drawer,
//   Tabs,
//   Badge,
//   Divider,
//   Space,
//   Typography,
//   Avatar,
//   List,
//   Collapse,
//   Empty,
// } from "antd";
// import {
//   motion,
//   useScroll,
//   useTransform,
//   useReducedMotion,
//   useInView,
//   AnimatePresence,
//   useMotionValue,
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
//   Play,
//   Pause,
//   Bookmark,
//   MessageCircle,
//   Search,
//   Eye,
//   Info,
//   Award,
//   Zap,
//   Shield,
//   Sparkles,
// } from "lucide-react";

// const { Title, Text, Paragraph } = Typography;

// /* ================= Config & Axios ================= */
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// let _client: AxiosInstance | null = null;
// function api() {
//   if (!_client) {
//     _client = axios.create({ baseURL: API_URL });
//     _client.interceptors.response.use(
//       (r) => r,
//       (err) => {
//         const msg =
//           err?.response?.data?.error?.message ||
//           err?.response?.data?.message ||
//           err?.message ||
//           "Request failed";
//         return Promise.reject(
//           new Error(typeof msg === "string" ? msg : JSON.stringify(msg))
//         );
//       }
//     );
//   }
//   return _client;
// }

// /* ================= Utils ================= */
// function slugify(text: string): string {
//   return (text || "")
//     .toLowerCase()
//     .normalize("NFKD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// }

// function labelFromEntity(entity: any): string {
//   if (!entity) return "(unknown)";
//   if (entity.attributes) {
//     const a = entity.attributes;
//     return (
//       a.title ||
//       a.label ||
//       a.name ||
//       a.slug ||
//       String(entity.id ?? entity.documentId ?? "")
//     );
//   }
//   return (
//     entity.title ||
//     entity.label ||
//     entity.name ||
//     entity.slug ||
//     String(entity.id ?? entity.documentId ?? "")
//   );
// }

// function getFileUrl(file: any): string | null {
//   if (!file?.url) return null;
//   return file.url.startsWith("http") ? file.url : `${API_URL}${file.url}`;
// }

// /* ================= Animations / Theme (unchanged) ================= */
// const BRAND = "#07518a";
// const BRAND_TINT = "#0a6ab8";
// const ACCENT = "#ff6b35";
// const SUCCESS = "#52c41a";

// const riseIn = (delay = 0) => ({
//   initial: { opacity: 0, y: 40 },
//   whileInView: { opacity: 1, y: 0 },
//   viewport: { once: true, amount: 0.3, margin: "-10% 0px -10% 0px" },
//   transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
// });

// const cardVariants = {
//   hidden: { opacity: 0, y: 36, scale: 0.95 },
//   show: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: {
//       duration: 0.5,
//       ease: [0.16, 1, 0.3, 1],
//       delay: Math.min(i * 0.08, 0.4),
//     },
//   }),
//   hover: {
//     y: -8,
//     scale: 1.02,
//     boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
//     transition: { duration: 0.3 },
//   },
// };

// const floatingVariants = {
//   animate: {
//     y: [0, -10, 0],
//     transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
//   },
// };
// const pulseVariants = {
//   animate: {
//     scale: [1, 1.05, 1],
//     transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
//   },
// };
// const spotlightVariants = {
//   hidden: { opacity: 0, scale: 0.95, rotateX: -10 },
//   show: {
//     opacity: 1,
//     scale: 1,
//     rotateX: 0,
//     transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
//   },
// };

// const useInteractiveFlags = () => {
//   const [bookmarked, setBookmarked] = useState(false);
//   const [viewCount, setViewCount] = useState(
//     Math.floor(Math.random() * 1000) + 100
//   );
//   const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);
//   const [autoplay, setAutoplay] = useState(true);
//   return {
//     bookmarked,
//     setBookmarked,
//     viewCount,
//     setViewCount,
//     likes,
//     setLikes,
//     autoplay,
//     setAutoplay,
//   };
// };

// /* ================= Normalizers ================= */
// function normOne(raw: any) {
//   if (!raw) return null;
//   if (raw.attributes) {
//     const a = raw.attributes;
//     return { id: raw.id, documentId: raw.documentId || a.documentId, ...a };
//   }
//   return raw;
// }
// function normMany(resData: any) {
//   if (!resData) return [];
//   const d = resData.data;
//   if (Array.isArray(d)) return d.map(normOne).filter(Boolean);
//   const one = normOne(d);
//   return one ? [one] : [];
// }

// /* ================= API calls ================= */
// async function getFamilyBySlug(slug: string) {
//   const res = await api().get(
//     `/api/catalog-families?filters[slug][$eq]=${encodeURIComponent(slug)}`
//   );
//   return normMany(res.data)[0] || null;
// }
// async function getTypeBySlug(slug: string) {
//   const res = await api().get(
//     `/api/catalog-types?filters[slug][$eq]=${encodeURIComponent(slug)}`
//   );
//   return normMany(res.data)[0] || null;
// }
// async function getItemBySlug(slug: string) {
//   const res = await api().get(
//     `/api/catalog-items?populate=*&filters[slug][$eq]=${encodeURIComponent(
//       slug
//     )}`
//   );
//   return normMany(res.data)[0] || null;
// }
// // Series = items that share same family+type (if both exist). Fallbacks included.
// async function listSeries(
//   familyId?: number | string,
//   typeId?: number | string
// ) {
//   let qs = `?populate=*&sort=createdAt:asc`;
//   if (familyId) qs += `&filters[catalog_family][id][$eq]=${familyId}`;
//   if (typeId) qs += `&filters[catalog_type][id][$eq]=${typeId}`;
//   const res = await api().get(`/api/catalog-items${qs}`);
//   return normMany(res.data);
// }

// /* ================= Page ================= */
// export default function InteractiveItemDetailPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // route parts → treat as family/type/item slugs
//   const familySlug = (params?.category as string) || "";
//   const typeSlug = (params?.subcategory as string) || "";
//   const itemSlug = (params?.item as string) || "";
//   const name = searchParams.get("name") || "";

//   const [loading, setLoading] = useState(true);
//   const [family, setFamily] = useState<any | null>(null);
//   const [type, setType] = useState<any | null>(null);
//   const [item, setItem] = useState<any | null>(null);
//   const [series, setSeries] = useState<any[]>([]);
//   const [currentIndex, setCurrentIndex] = useState<number>(-1);
//   const [badges, setBadges] = useState<string[]>([]);
//   const [rating, setRating] = useState<number>(4.8);
//   const [groupTitle, setGroupTitle] = useState<string>("");

//   // Fetch everything from Strapi
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setLoading(true);
//         const [fam, typ, itm] = await Promise.all([
//           familySlug ? getFamilyBySlug(familySlug) : null,
//           typeSlug ? getTypeBySlug(typeSlug) : null,
//           itemSlug ? getItemBySlug(itemSlug) : null,
//         ]);

//         if (!mounted) return;
//         setFamily(fam);
//         setType(typ);
//         setItem(itm);

//         // group title (what you showed under small uppercase)
//         setGroupTitle(typ?.title || fam?.title || "Catalog");

//         // series = siblings in same family+type when possible; fallbacks:
//         let siblings: any[] = [];
//         if (fam?.id || typ?.id) {
//           siblings = await listSeries(fam?.id, typ?.id);
//         } else {
//           // if no relations found, fallback to all items (small page size)
//           const res = await api().get(
//             `/api/catalog-items?populate=*&pagination[pageSize]=24&sort=createdAt:asc`
//           );
//           siblings = normMany(res.data);
//         }
//         if (!mounted) return;
//         setSeries(siblings);

//         // figure current index
//         const idx =
//           siblings.findIndex(
//             (s) => (s.slug || "").toLowerCase() === itemSlug.toLowerCase()
//           ) ?? -1;
//         setCurrentIndex(idx);

//         // optional badges & rating stored on item (if exists)
//         const b = itm?.badges;
//         setBadges(Array.isArray(b) ? b.filter(Boolean) : []);
//         setRating(Number(itm?.rating ?? 4.8));
//       } catch (e: any) {
//         antdMsg.error(`Load failed: ${e.message}`);
//         setItem(null);
//       } finally {
//         setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, [familySlug, typeSlug, itemSlug]);

//   // Images from Strapi item: heroImage + (optional) gallery field if you add it later
//   const images: string[] = useMemo(() => {
//     if (!item) return [];
//     const arr: string[] = [];
//     const hero = item?.heroImage?.data || item?.heroImage; // v4/v5
//     if (hero) {
//       const f = hero.attributes ? { ...hero.attributes } : hero;
//       const url = getFileUrl(f);
//       if (url) arr.push(url);
//     }
//     // Optional: if you later add "gallery" (media multiple)
//     const gArr = item?.gallery?.data || item?.gallery;
//     if (Array.isArray(gArr)) {
//       gArr.forEach((g: any) => {
//         const f = g.attributes ? { ...g.attributes } : g;
//         const url = getFileUrl(f);
//         if (url) arr.push(url);
//       });
//     }
//     // Ensure at least 1 placeholder if empty
//     return arr.length ? arr : ["/placeholder.png"];
//   }, [item]);

//   // Features from Strapi repeatable component
//   const features = useMemo<string[]>(() => {
//     const feats = Array.isArray(item?.features) ? item.features : [];
//     return feats.map((f: any) => f?.name || "").filter(Boolean);
//   }, [item]);

//   const featureIcons: string[] = useMemo(() => {
//     const feats = Array.isArray(item?.features) ? item.features : [];
//     return feats.map((f: any) => {
//       const icon = f?.icon?.data || f?.icon;
//       const file = icon?.attributes ? icon.attributes : icon;
//       return getFileUrl(file) || "";
//     });
//   }, [item]);

//   // Move to sibling by index
//   const routerPushTo = (target: any) => {
//     const famSlug = slugify(labelFromEntity(target?.catalog_family));
//     const typSlug = slugify(labelFromEntity(target?.catalog_type));
//     const itSlug = target.slug || slugify(target.label || "");
//     const href =
//       `/${famSlug}/${typSlug}/${itSlug}` +
//       (name ? `?name=${encodeURIComponent(name)}` : "");
//     router.push(href);
//   };
//   const gotoSibling = (offset: number) => {
//     if (!series?.length || currentIndex < 0) return;
//     const nextIndex = (currentIndex + offset + series.length) % series.length;
//     routerPushTo(series[nextIndex]);
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto p-8">
//         <Skeleton active paragraph={{ rows: 8 }} />
//       </div>
//     );
//   }

//   if (!item || !family || !type) {
//     return (
//       <div className="container mx-auto p-8 min-h-screen flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//             <Search className="w-12 h-12 text-gray-400" />
//           </div>
//           <h1 className="text-3xl font-bold mb-4 text-gray-900">
//             Item not found
//           </h1>
//           <p className="text-gray-600 mb-6 max-w-md">
//             The item you’re looking for doesn’t exist or may have been moved.
//           </p>
//           <Button
//             type="primary"
//             size="large"
//             onClick={() => router.back()}
//             className="rounded-full"
//           >
//             Go Back
//           </Button>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <ConfigProvider theme={{ token: { colorPrimary: BRAND } }}>
//       <EnhancedInteractiveItemDetail
//         label={item.label || item.title || item.slug}
//         description={item.description || ""}
//         features={features}
//         featureIcons={featureIcons}
//         images={images}
//         onPrev={() => gotoSibling(-1)}
//         onNext={() => gotoSibling(1)}
//         groupTitle={groupTitle}
//         badges={badges}
//         rating={rating}
//         specsUrl={item?.specsUrl}
//         series={series}
//         currentIndex={Math.max(currentIndex, 0)}
//       />
//     </ConfigProvider>
//   );
// }

// /* ================= View (your UI kept intact) ================= */
// function EnhancedInteractiveItemDetail({
//   label,
//   description,
//   features,
//   featureIcons,
//   images,
//   onPrev,
//   onNext,
//   groupTitle,
//   badges = [],
//   rating = 4.8,
//   specsUrl,
//   series = [],
//   currentIndex = 0,
// }: {
//   label: string;
//   description: string;
//   features: string[];
//   featureIcons: string[]; // aligned to features
//   images: string[];
//   onPrev: () => void;
//   onNext: () => void;
//   groupTitle: string;
//   badges?: string[];
//   rating?: number;
//   specsUrl?: string;
//   series?: any[];
//   currentIndex?: number;
// }) {
//   const prefersReduced = useReducedMotion();
//   const featuresRef = useRef<HTMLDivElement | null>(null);
//   const imgWrapRef = useRef<HTMLDivElement | null>(null);
//   const ctaRef = useRef<HTMLDivElement | null>(null);

//   const [liked, setLiked] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [lightboxIndex, setLightboxIndex] = useState(0);
//   const [activeIdx, setActiveIdx] = useState(0);
//   const [imgLoaded, setImgLoaded] = useState<boolean[]>(
//     images.map(() => false)
//   );
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [spotlightFeature, setSpotlightFeature] = useState<string | null>(null);
//   const [shareModalOpen, setShareModalOpen] = useState(false);
//   const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [fullscreenMode, setFullscreenMode] = useState(false);

//   const flags = useInteractiveFlags();
//   const isInView = useInView(imgWrapRef, { amount: 0.1 });

//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);
//   const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
//   const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

//   const scrollToFeatures = () =>
//     featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

//   const { scrollYProgress } = useScroll({
//     target: imgWrapRef,
//     offset: ["start end", "end start"],
//   });
//   const imgScale = useTransform(
//     scrollYProgress,
//     [0, 1],
//     [1, prefersReduced ? 1 : 1.08]
//   );
//   const imgRotate = useTransform(
//     scrollYProgress,
//     [0, 1],
//     [0, prefersReduced ? 0 : 2]
//   );

//   const { scrollYProgress: featProgress } = useScroll({
//     target: featuresRef,
//     offset: ["start 80%", "end 20%"],
//   });
//   const featWidth = useTransform(featProgress, [0, 1], ["0%", "100%"]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       flags.setViewCount((prev) => prev + 1);
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [flags]);

//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "ArrowLeft") onPrev();
//       if (e.key === "ArrowRight") onNext();
//       if (e.key === "Escape") {
//         if (lightboxOpen) setLightboxOpen(false);
//         if (detailsDrawerOpen) setDetailsDrawerOpen(false);
//         if (shareModalOpen) setShareModalOpen(false);
//       }
//       if (e.key === "+" && lightboxOpen)
//         setZoomLevel((z) => Math.min(z + 0.2, 3));
//       if (e.key === "-" && lightboxOpen)
//         setZoomLevel((z) => Math.max(z - 0.2, 0.5));
//       if (e.key === "f" && lightboxOpen) setFullscreenMode((f) => !f);
//       if (e.key === " " && lightboxOpen) {
//         e.preventDefault();
//         flags.setAutoplay(!flags.autoplay);
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [onPrev, onNext, lightboxOpen, detailsDrawerOpen, shareModalOpen, flags]);

//   const handleMouseMove = useCallback(
//     (e: React.MouseEvent) => {
//       const rect = e.currentTarget.getBoundingClientRect();
//       const centerX = rect.left + rect.width / 2;
//       const centerY = rect.top + rect.height / 2;
//       mouseX.set(e.clientX - centerX);
//       mouseY.set(e.clientY - centerY);
//     },
//     [mouseX, mouseY]
//   );

//   const openLightboxAt = (idx: number) => {
//     setLightboxIndex(idx);
//     setLightboxOpen(true);
//     setZoomLevel(1);
//   };

//   const onCopyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(window.location.href);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//       antdMsg.success("Link copied to clipboard!");
//     } catch {
//       antdMsg.error("Could not copy link");
//     }
//   };

//   const onToggleLike = () => {
//     setLiked((v) => !v);
//     if (!liked) {
//       flags.setLikes((prev) => prev + 1);
//       antdMsg.success("Added to favorites!");
//     } else {
//       flags.setLikes((prev) => Math.max(prev - 1, 0));
//     }
//   };

//   const onToggleBookmark = () => {
//     flags.setBookmarked(!flags.bookmarked);
//     antdMsg.success(
//       flags.bookmarked ? "Removed from bookmarks" : "Added to bookmarks!"
//     );
//   };

//   return (
//     <div className="w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
//       {/* ===== Hero (unchanged UI) ===== */}
//       <motion.section
//         className="relative min-h-screen w-full overflow-hidden"
//         initial="initial"
//         whileInView="animate"
//         viewport={{ amount: 0.2 }}
//       >
//         {/* background blobs */}
//         <div className="pointer-events-none absolute inset-0 -z-10">
//           <motion.div
//             aria-hidden
//             variants={floatingVariants}
//             animate="animate"
//             className="absolute top-[-15%] left-[-15%] h-[45rem] w-[45rem] rounded-full blur-3xl opacity-60"
//             style={{
//               background: `radial-gradient(600px circle at 30% 30%, ${BRAND}25, ${BRAND_TINT}15, transparent)`,
//             }}
//           />
//           <motion.div
//             aria-hidden
//             variants={floatingVariants}
//             animate="animate"
//             className="absolute bottom-[-15%] right-[-15%] h-[40rem] w-[40rem] rounded-full blur-3xl opacity-50"
//             style={{
//               background: `radial-gradient(600px circle at 70% 70%, ${ACCENT}20, ${BRAND_TINT}10, transparent)`,
//             }}
//           />
//           <motion.div
//             aria-hidden
//             variants={pulseVariants}
//             animate="animate"
//             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-30"
//             style={{
//               background: `radial-gradient(400px circle, ${SUCCESS}15, transparent)`,
//             }}
//           />
//         </div>

//         <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
//           {/* Left */}
//           <div className="relative bg-white/95 backdrop-blur-sm flex items-center border-r border-gray-100/50">
//             <div className="px-8 sm:px-12 md:px-16 lg:px-20 py-16">
//               <motion.div
//                 {...riseIn(0)}
//                 className="flex items-center justify-between mb-4"
//               >
//                 <div className="flex items-center gap-3">
//                   <Text className="text-xs uppercase tracking-widest text-gray-400">
//                     {groupTitle}
//                   </Text>
//                   <Badge count={series.length} color={BRAND} />
//                 </div>
//                 <div className="flex items-center gap-4 text-sm text-gray-500">
//                   <span className="flex items-center gap-1">
//                     <Eye className="h-4 w-4" />
//                     {flags.viewCount.toLocaleString()}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Zap className="h-4 w-4" />
//                     {flags.likes}
//                   </span>
//                 </div>
//               </motion.div>

//               <motion.div
//                 {...riseIn(0.05)}
//                 onMouseMove={handleMouseMove}
//                 style={{ rotateX, rotateY, transformPerspective: 1000 }}
//                 className="relative inline-block mb-6"
//               >
//                 <Title
//                   level={1}
//                   className="!mb-0 !text-4xl sm:!text-5xl md:!text-6xl lg:!text-7xl font-black tracking-tight"
//                   style={{ color: BRAND, lineHeight: 1.1 }}
//                 >
//                   {label}
//                 </Title>
//                 <motion.span
//                   aria-hidden
//                   className="absolute -bottom-3 left-0 h-[12px] w-full rounded-full"
//                   style={{
//                     background: `linear-gradient(90deg, ${BRAND}40, ${BRAND_TINT}60, ${ACCENT}30)`,
//                     filter: "blur(3px)",
//                   }}
//                   animate={{ scaleX: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
//                   transition={{
//                     duration: 3,
//                     repeat: Infinity,
//                     ease: "easeInOut",
//                   }}
//                 />
//               </motion.div>

//               <motion.div
//                 {...riseIn(0.08)}
//                 className="flex flex-wrap items-center gap-3 mb-6"
//               >
//                 {badges.slice(0, 4).map((badge, i) => (
//                   <motion.div
//                     key={i}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Tag
//                       color="blue"
//                       className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium hover:shadow-md transition-all duration-300"
//                       onClick={() => antdMsg.info(`Exploring: ${badge}`)}
//                     >
//                       {badge}
//                     </Tag>
//                   </motion.div>
//                 ))}
//                 <div className="flex items-center gap-2 ml-2">
//                   <Rate
//                     disabled
//                     defaultValue={rating}
//                     allowHalf
//                     className="text-sm"
//                   />
//                   <Text className="text-sm text-gray-500 font-medium">
//                     {Number(rating).toFixed(1)} / 5.0
//                   </Text>
//                 </div>
//               </motion.div>

//               <motion.div {...riseIn(0.1)}>
//                 <Paragraph
//                   className="!text-lg sm:!text-xl md:!text-2xl !leading-relaxed text-gray-700 !mb-8"
//                   style={{ maxWidth: "600px" }}
//                 >
//                   {description}
//                 </Paragraph>
//               </motion.div>

//               <motion.div
//                 {...riseIn(0.16)}
//                 className="flex flex-wrap items-center gap-4 mb-8"
//               >
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <Button
//                     size="large"
//                     onClick={() =>
//                       featuresRef.current?.scrollIntoView({
//                         behavior: "smooth",
//                         block: "start",
//                       })
//                     }
//                     className="group relative rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
//                   >
//                     <span className="relative z-10 flex items-center gap-2 font-semibold">
//                       Explore Features
//                       <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
//                     </span>
//                     <span
//                       className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
//                       style={{
//                         background: `linear-gradient(120deg, transparent, ${BRAND}08, transparent)`,
//                       }}
//                     />
//                   </Button>
//                 </motion.div>

//                 {!!specsUrl && (
//                   <motion.div
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <Button
//                       type="primary"
//                       size="large"
//                       href={specsUrl}
//                       target="_blank"
//                       className="rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl font-semibold"
//                       style={{ backgroundColor: BRAND, borderColor: BRAND }}
//                     >
//                       <Maximize2 className="h-5 w-5 mr-2" />
//                       Download Specs
//                     </Button>
//                   </motion.div>
//                 )}

//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <Button
//                     size="large"
//                     onClick={() => setDetailsDrawerOpen(true)}
//                     className="rounded-2xl px-8 py-4 border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl font-semibold"
//                   >
//                     <Info className="h-5 w-5 mr-2" />
//                     More Details
//                   </Button>
//                 </motion.div>
//               </motion.div>

//               <motion.div
//                 {...riseIn(0.2)}
//                 className="flex items-center justify-between"
//               >
//                 <div className="flex items-center gap-3">
//                   <Tooltip
//                     title={liked ? "Remove from favorites" : "Add to favorites"}
//                   >
//                     <motion.div
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <Button
//                         shape="circle"
//                         size="large"
//                         onClick={() => {
//                           setLiked((v) => !v);
//                           if (!liked) {
//                             flags.setLikes((prev) => prev + 1);
//                             antdMsg.success("Added to favorites!");
//                           } else {
//                             flags.setLikes((prev) => Math.max(prev - 1, 0));
//                           }
//                         }}
//                         className={`border-2 shadow-lg ${
//                           liked
//                             ? "border-red-200 bg-red-50 text-red-500"
//                             : "border-gray-200 bg-white text-gray-600"
//                         }`}
//                       >
//                         <Heart
//                           className={`h-5 w-5 ${liked ? "fill-current" : ""}`}
//                         />
//                       </Button>
//                     </motion.div>
//                   </Tooltip>

//                   <Tooltip
//                     title={
//                       flags.bookmarked ? "Remove bookmark" : "Add bookmark"
//                     }
//                   >
//                     <motion.div
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <Button
//                         shape="circle"
//                         size="large"
//                         onClick={() => {
//                           flags.setBookmarked(!flags.bookmarked);
//                           antdMsg.success(
//                             flags.bookmarked
//                               ? "Removed from bookmarks"
//                               : "Added to bookmarks!"
//                           );
//                         }}
//                         className={`border-2 shadow-lg ${
//                           flags.bookmarked
//                             ? "border-blue-200 bg-blue-50 text-blue-500"
//                             : "border-gray-200 bg-white text-gray-600"
//                         }`}
//                       >
//                         <Bookmark
//                           className={`h-5 w-5 ${
//                             flags.bookmarked ? "fill-current" : ""
//                           }`}
//                         />
//                       </Button>
//                     </motion.div>
//                   </Tooltip>

//                   <Tooltip title="Share this item">
//                     <motion.div
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.9 }}
//                     >
//                       <Button
//                         shape="circle"
//                         size="large"
//                         onClick={() => setShareModalOpen(true)}
//                         className="border-2 border-gray-200 bg-white text-gray-600 shadow-lg"
//                       >
//                         <Share2 className="h-5 w-5" />
//                       </Button>
//                     </motion.div>
//                   </Tooltip>
//                 </div>

//                 <div className="flex items-center rounded-2xl border-2 border-gray-200 bg-white/95 shadow-lg backdrop-blur px-2">
//                   <Tooltip title="Previous item">
//                     <motion.div
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       <Button
//                         type="text"
//                         size="large"
//                         onClick={onPrev}
//                         className="rounded-xl p-4 hover:bg-gray-50"
//                       >
//                         <ChevronLeft className="h-6 w-6" />
//                       </Button>
//                     </motion.div>
//                   </Tooltip>

//                   <Divider type="vertical" className="h-8 mx-1" />

//                   <Text className="px-3 text-sm font-medium text-gray-600">
//                     {Math.min(currentIndex + 1, series.length)} /{" "}
//                     {series.length}
//                   </Text>

//                   <Divider type="vertical" className="h-8 mx-1" />

//                   <Tooltip title="Next item">
//                     <motion.div
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       <Button
//                         type="text"
//                         size="large"
//                         onClick={onNext}
//                         className="rounded-xl p-4 hover:bg-gray-50"
//                       >
//                         <ChevronRight className="h-6 w-6" />
//                       </Button>
//                     </motion.div>
//                   </Tooltip>
//                 </div>
//               </motion.div>
//             </div>
//           </div>

//           {/* Right: Gallery */}
//           <Gallery
//             images={images}
//             label={label}
//             flags={flags}
//             openLightboxAt={(i) => setLightboxOpen(true) || setLightboxIndex(i)}
//             activeIdx={activeIdx}
//             setActiveIdx={setActiveIdx}
//             imgLoaded={imgLoaded}
//             setImgLoaded={setImgLoaded}
//             imgWrapRef={imgWrapRef}
//           />
//         </div>

//         {/* Floating CTA */}
//         <FloatingCTA isInView={isInView} ctaRef={ctaRef} />
//       </motion.section>

//       {/* Lightbox */}
//       <Lightbox
//         open={lightboxOpen}
//         onClose={() => setLightboxOpen(false)}
//         images={images}
//         zoomLevel={zoomLevel}
//         setZoomLevel={setZoomLevel}
//         lightboxIndex={lightboxIndex}
//         setLightboxIndex={setLightboxIndex}
//         label={label}
//       />

//       {/* Share Modal */}
//       <ShareModal
//         open={shareModalOpen}
//         onClose={() => setShareModalOpen(false)}
//         label={label}
//         description={description}
//       />

//       {/* Details Drawer */}
//       <DetailsDrawer
//         open={detailsDrawerOpen}
//         onClose={() => setDetailsDrawerOpen(false)}
//         description={description}
//         badges={badges}
//         rating={rating}
//         features={features}
//         featureIcons={featureIcons}
//         series={series}
//       />

//       {/* ===== Features Section (unchanged UI, fed by Strapi data) ===== */}
//       <FeaturesSection
//         featuresRef={featuresRef}
//         features={features}
//         featureIcons={featureIcons}
//         setSpotlightFeature={(val) => setSpotlightFeature(val)}
//       />

//       {/* Feature Spotlight Modal */}
//       <SpotlightModal
//         feature={spotlightFeature}
//         onClose={() => setSpotlightFeature(null)}
//         featureIcons={featureIcons}
//         features={features}
//       />
//     </div>
//   );
// }

// /* ===== split a few big chunks to keep it readable (UI only, no data changes) ===== */
// function Gallery({
//   images,
//   label,
//   flags,
//   openLightboxAt,
//   activeIdx,
//   setActiveIdx,
//   imgLoaded,
//   setImgLoaded,
//   imgWrapRef,
// }: any) {
//   const prefersReduced = useReducedMotion();
//   const { scrollYProgress } = useScroll({
//     target: imgWrapRef,
//     offset: ["start end", "end start"],
//   });
//   const imgScale = useTransform(
//     scrollYProgress,
//     [0, 1],
//     [1, prefersReduced ? 1 : 1.08]
//   );
//   const imgRotate = useTransform(
//     scrollYProgress,
//     [0, 1],
//     [0, prefersReduced ? 0 : 2]
//   );

//   return (
//     <div className="relative h-[40vh] lg:h-auto min-h-[40vh]">
//       <motion.div
//         ref={imgWrapRef}
//         className="absolute inset-0"
//         style={{ scale: imgScale as any, rotate: imgRotate as any }}
//         initial={{ opacity: 0, y: 60 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, amount: 0.3 }}
//         transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
//       >
//         <motion.div
//           className="absolute -inset-[3px] rounded-none lg:rounded-3xl"
//           aria-hidden
//           animate={{
//             background: [
//               `conic-gradient(from 0deg at 50% 50%, ${BRAND}40, ${BRAND_TINT}50, ${ACCENT}30, ${BRAND}40)`,
//               `conic-gradient(from 360deg at 50% 50%, ${BRAND}40, ${BRAND_TINT}50, ${ACCENT}30, ${BRAND}40)`,
//             ],
//           }}
//           transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
//           style={{ filter: "blur(12px)" }}
//         />

//         <div className="relative h-full w-full overflow-hidden rounded-none lg:rounded-3xl bg-white shadow-2xl">
//           {images.length > 1 ? (
//             <Carousel
//               autoplay={flags.autoplay}
//               effect="fade"
//               className="h-full"
//               beforeChange={(_, next) => setActiveIdx(next)}
//               dots
//             >
//               {images.map((src: string, idx: number) => (
//                 <div key={idx} className="h-full">
//                   <motion.button
//                     onClick={() => openLightboxAt(idx)}
//                     className="group relative block h-full w-full overflow-hidden"
//                     whileHover={{ scale: 1.02 }}
//                     transition={{ duration: 0.4 }}
//                   >
//                     {!imgLoaded[idx] && (
//                       <div className="absolute inset-0 z-10">
//                         <Skeleton.Image
//                           active
//                           style={{ width: "100%", height: "100%" }}
//                         />
//                       </div>
//                     )}
//                     <motion.img
//                       src={src}
//                       alt={`${label} - Image ${idx + 1}`}
//                       className={`h-full w-full object-cover transition-all duration-700 ${
//                         imgLoaded[idx] ? "opacity-100" : "opacity-0"
//                       }`}
//                       loading={idx === 0 ? "eager" : "lazy"}
//                       onLoad={() =>
//                         setImgLoaded((prev: boolean[]) =>
//                           prev.map((v, i) => (i === idx ? true : v))
//                         )
//                       }
//                       whileHover={{ scale: 1.05 }}
//                       transition={{ duration: 0.6 }}
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                     <motion.div
//                       className="absolute bottom-6 right-6 flex items-center gap-2 rounded-xl bg-black/60 backdrop-blur px-4 py-2 text-white opacity-0 group-hover:opacity-100"
//                       initial={{ y: 20 }}
//                       whileHover={{ y: 0 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <Maximize2 className="h-4 w-4" />
//                       <span className="text-sm font-medium">Full View</span>
//                     </motion.div>
//                   </motion.button>
//                 </div>
//               ))}
//             </Carousel>
//           ) : (
//             <motion.button
//               onClick={() => openLightboxAt(0)}
//               className="group relative block h-full w-full overflow-hidden"
//               whileHover={{ scale: 1.02 }}
//               transition={{ duration: 0.4 }}
//             >
//               {!imgLoaded[0] && (
//                 <div className="absolute inset-0 z-10">
//                   <Skeleton.Image
//                     active
//                     style={{ width: "100%", height: "100%" }}
//                   />
//                 </div>
//               )}
//               <motion.img
//                 src={images[0]}
//                 alt={`${label} - Main Image`}
//                 className={`h-full w-full object-cover transition-all duration-700 ${
//                   imgLoaded[0] ? "opacity-100" : "opacity-0"
//                 }`}
//                 loading="eager"
//                 onLoad={() => setImgLoaded([true])}
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ duration: 0.6 }}
//               />
//             </motion.button>
//           )}

//           {images.length > 1 && (
//             <motion.div
//               className="absolute left-1/2 bottom-6 -translate-x-1/2 flex gap-3 bg-black/40 backdrop-blur-md px-4 py-3 rounded-2xl"
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.5 }}
//             >
//               {images.slice(0, 6).map((src: string, i: number) => (
//                 <motion.button
//                   key={i}
//                   onClick={() => openLightboxAt(i)}
//                   className={`h-12 w-16 overflow-hidden rounded-lg border-2 transition-all duration-300 ${
//                     i === activeIdx
//                       ? "border-white shadow-lg scale-110"
//                       : "border-white/30 hover:border-white/60"
//                   }`}
//                   whileHover={{ scale: i === activeIdx ? 1.1 : 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <img
//                     src={src}
//                     alt={`Thumbnail ${i + 1}`}
//                     className="h-full w-full object-cover"
//                   />
//                 </motion.button>
//               ))}

//               <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/30">
//                 <Tooltip
//                   title={flags.autoplay ? "Pause slideshow" : "Play slideshow"}
//                 >
//                   <motion.button
//                     onClick={() => flags.setAutoplay(!flags.autoplay)}
//                     className="p-2 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     {flags.autoplay ? (
//                       <Pause className="h-4 w-4" />
//                     ) : (
//                       <Play className="h-4 w-4" />
//                     )}
//                   </motion.button>
//                 </Tooltip>

//                 <Tooltip title="Zoom in">
//                   <motion.button
//                     onClick={() => openLightboxAt(activeIdx)}
//                     className="p-2 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     <ZoomIn className="h-4 w-4" />
//                   </motion.button>
//                 </Tooltip>
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>

//       <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/5 via-transparent to-transparent" />
//     </div>
//   );
// }

// function FloatingCTA({ isInView, ctaRef }: any) {
//   return (
//     <AnimatePresence>
//       {!isInView && (
//         <motion.div
//           ref={ctaRef}
//           className="fixed bottom-8 right-8 z-50"
//           initial={{ opacity: 0, scale: 0.8, y: 100 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.8, y: 100 }}
//           transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
//         >
//           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//             <Button
//               type="primary"
//               size="large"
//               className="rounded-full shadow-2xl border-0 px-8 py-6 text-lg font-semibold"
//               onClick={() => antdMsg.info("Contact initiated!")}
//               style={{ backgroundColor: BRAND }}
//             >
//               <MessageCircle className="h-5 w-5 mr-2" />
//               Get Quote
//             </Button>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// function Lightbox({
//   open,
//   onClose,
//   images,
//   zoomLevel,
//   setZoomLevel,
//   lightboxIndex,
//   setLightboxIndex,
//   label,
// }: any) {
//   return (
//     <Modal
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       width="95vw"
//       centered
//       bodyStyle={{ padding: 0, height: "80vh" }}
//       className="lightbox-modal"
//     >
//       <div className="relative h-full bg-black">
//         <Carousel
//           initialSlide={lightboxIndex}
//           dots={false}
//           arrows
//           className="h-full"
//           afterChange={(i) => setLightboxIndex(i)}
//         >
//           {images.map((src: string, i: number) => (
//             <div key={i} className="relative h-full">
//               <motion.img
//                 src={src}
//                 alt={`${label} - Full view ${i + 1}`}
//                 className="w-full h-full object-contain"
//                 style={{ scale: zoomLevel }}
//                 transition={{ duration: 0.3 }}
//                 drag={zoomLevel > 1}
//                 dragConstraints={{
//                   left: -100,
//                   right: 100,
//                   top: -100,
//                   bottom: 100,
//                 }}
//               />
//             </div>
//           ))}
//         </Carousel>

//         <div className="absolute top-6 right-6 flex gap-3">
//           <Tooltip title="Zoom out">
//             <Button
//               onClick={() =>
//                 setZoomLevel((z: number) => Math.max(z - 0.2, 0.5))
//               }
//               className="!border-none !bg-black/50 !text-white hover:!bg-black/70"
//               icon={<ZoomOut className="h-5 w-5" />}
//             />
//           </Tooltip>
//           <Tooltip title="Reset zoom">
//             <Button
//               onClick={() => setZoomLevel(1)}
//               className="!border-none !bg-black/50 !text-white hover:!bg-black/70"
//             >
//               1:1
//             </Button>
//           </Tooltip>
//           <Tooltip title="Zoom in">
//             <Button
//               onClick={() => setZoomLevel((z: number) => Math.min(z + 0.2, 3))}
//               className="!border-none !bg-black/50 !text-white hover:!bg-black/70"
//               icon={<ZoomIn className="h-5 w-5" />}
//             />
//           </Tooltip>
//         </div>

//         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
//           {lightboxIndex + 1} / {images.length}
//         </div>
//       </div>
//     </Modal>
//   );
// }

// function ShareModal({ open, onClose, label, description }: any) {
//   const [copied, setCopied] = useState(false);
//   const onCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(window.location.href);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//       antdMsg.success;
//       antdMsg.success("Link copied to clipboard!");
//     } catch {
//       antdMsg.error("Could not copy link");
//     }
//   };

//   return (
//     <Modal
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       title={
//         <div className="flex items-center gap-3">
//           <Share2 className="h-5 w-5 text-blue-500" />
//           <span>Share "{label}"</span>
//         </div>
//       }
//       centered
//       width={500}
//     >
//       <div className="p-6">
//         <Paragraph className="text-gray-600 mb-6">
//           Share this product with your network and help others discover it too!
//         </Paragraph>

//         <Space direction="vertical" size="large" className="w-full">
//           <Button
//             size="large"
//             block
//             icon={copied ? <Check className="text-green-500" /> : <Copy />}
//             onClick={onCopy}
//             className={`${copied ? "border-green-200 bg-green-50" : ""}`}
//           >
//             {copied ? "Link Copied!" : "Copy Link"}
//           </Button>

//           <Button
//             size="large"
//             block
//             icon={<Share2 />}
//             onClick={() => {
//               if (navigator.share) {
//                 navigator.share({
//                   title,
//                   text: description,
//                   url: window.location.href,
//                 });
//               } else {
//                 antdMsg.info("System share is not available in this browser.");
//               }
//             }}
//           >
//             Share via System
//           </Button>
//         </Space>
//       </div>
//     </Modal>
//   );
// }

// /* ================= Details Drawer ================= */
// function DetailsDrawer({
//   open,
//   onClose,
//   description,
//   badges = [],
//   rating = 4.8,
//   features = [],
//   featureIcons = [],
//   series = [],
// }: {
//   open: boolean;
//   onClose: () => void;
//   description: string;
//   badges?: string[];
//   rating?: number;
//   features: string[];
//   featureIcons: string[];
//   series: any[];
// }) {
//   const [activeTab, setActiveTab] = useState("overview");

//   return (
//     <Drawer
//       open={open}
//       onClose={onClose}
//       title={
//         <div className="flex items-center gap-3">
//           <Info className="h-5 w-5 text-blue-500" />
//           <span>Product Details</span>
//         </div>
//       }
//       width={600}
//       placement="right"
//     >
//       <Tabs
//         activeKey={activeTab}
//         onChange={setActiveTab}
//         items={[
//           {
//             key: "overview",
//             label: "Overview",
//             children: (
//               <div className="space-y-6">
//                 <div>
//                   <Title level={4}>Description</Title>
//                   <Paragraph>{description || "—"}</Paragraph>
//                 </div>

//                 {!!badges?.length && (
//                   <div>
//                     <Title level={4}>Highlights</Title>
//                     <List
//                       size="small"
//                       dataSource={badges}
//                       renderItem={(it) => (
//                         <List.Item>
//                           <Text strong>{it}</Text>
//                         </List.Item>
//                       )}
//                     />
//                   </div>
//                 )}

//                 <div>
//                   <Title level={4}>Rating</Title>
//                   <div className="flex items-center gap-3">
//                     <Rate disabled defaultValue={Number(rating)} allowHalf />
//                     <Text>{Number(rating).toFixed(1)} out of 5</Text>
//                   </div>
//                 </div>
//               </div>
//             ),
//           },
//           {
//             key: "features",
//             label: "Features",
//             children: (
//               <div className="space-y-4">
//                 {features.length === 0 ? (
//                   <Empty description="No features listed" />
//                 ) : (
//                   features.map((feature, i) => (
//                     <Card
//                       key={i}
//                       size="small"
//                       className="border-l-4 border-l-blue-500"
//                     >
//                       <div className="flex items-start gap-12">
//                         <div className="mt-1">
//                           {featureIcons?.[i] ? (
//                             <img
//                               src={featureIcons[i]}
//                               alt={`${feature} icon`}
//                               style={{
//                                 width: 48,
//                                 height: 48,
//                                 objectFit: "contain",
//                               }}
//                             />
//                           ) : (
//                             <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
//                               <Shield className="h-6 w-6" />
//                             </div>
//                           )}
//                         </div>
//                         <div>
//                           <Text strong>{feature}</Text>
//                           <br />
//                           <Text type="secondary" className="text-sm">
//                             Advanced capability that enhances your experience.
//                           </Text>
//                         </div>
//                       </div>
//                     </Card>
//                   ))
//                 )}
//               </div>
//             ),
//           },
//           {
//             key: "related",
//             label: "Related Items",
//             children: (
//               <div className="space-y-4">
//                 {series.length === 0 ? (
//                   <Empty description="No related items" />
//                 ) : (
//                   series.slice(0, 8).map((rel: any, i: number) => {
//                     // small avatar from hero image if present
//                     let avatarUrl: string | undefined;
//                     const hero = rel?.heroImage?.data || rel?.heroImage;
//                     if (hero) {
//                       const file = hero.attributes ? hero.attributes : hero;
//                       if (file?.url) {
//                         avatarUrl = file.url.startsWith("http")
//                           ? file.url
//                           : `${API_URL}${file.url}`;
//                       }
//                     }
//                     return (
//                       <Card
//                         key={i}
//                         size="small"
//                         hoverable
//                         className="cursor-default"
//                       >
//                         <div className="flex items-center gap-3">
//                           <Avatar
//                             src={avatarUrl}
//                             size={48}
//                             className="flex-shrink-0"
//                           >
//                             {rel?.label?.[0]?.toUpperCase() ||
//                               rel?.slug?.[0]?.toUpperCase() ||
//                               "R"}
//                           </Avatar>
//                           <div className="flex-1 min-w-0">
//                             <Text strong className="block truncate">
//                               {rel.label || rel.title || rel.slug}
//                             </Text>
//                             <Text
//                               type="secondary"
//                               className="text-sm block truncate"
//                             >
//                               {rel.description || "—"}
//                             </Text>
//                           </div>
//                         </div>
//                       </Card>
//                     );
//                   })
//                 )}
//               </div>
//             ),
//           },
//         ]}
//       />
//     </Drawer>
//   );
// }

// /* ================= Features Section ================= */
// function FeaturesSection({
//   featuresRef,
//   features,
//   featureIcons,
//   setSpotlightFeature,
// }: {
//   featuresRef: React.RefObject<HTMLDivElement>;
//   features: string[];
//   featureIcons: string[];
//   setSpotlightFeature: (v: string | null) => void;
// }) {
//   const { scrollYProgress } = useScroll({
//     target: featuresRef,
//     offset: ["start 80%", "end 20%"],
//   });
//   const featWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

//   return (
//     <section
//       ref={featuresRef}
//       className="relative min-h-screen w-full bg-gradient-to-b from-white to-gray-50"
//     >
//       {/* Progress bar */}
//       <div className="sticky top-0 z-20 h-2 w-full bg-gray-100 shadow-sm">
//         <motion.div
//           className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
//           style={{ width: featWidth }}
//         />
//       </div>

//       <div className="relative mx-auto max-w-7xl px-6 py-20">
//         <motion.div {...riseIn(0)} className="text-center mb-16">
//           <Title level={2} className="!text-4xl md:!text-5xl !mb-4">
//             Powerful Features
//           </Title>
//           <Paragraph className="!text-xl text-gray-600 max-w-3xl mx-auto">
//             Discover the capabilities that make this product exceptional
//           </Paragraph>
//         </motion.div>

//         {/* Spotlight (first feature) */}
//         {features.length > 0 && (
//           <motion.div
//             className="mb-16 p-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-xl border border-gray-100"
//             variants={spotlightVariants}
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true, amount: 0.5 }}
//           >
//             <div className="flex items-start gap-6">
//               <motion.div className="flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-white ring-1 ring-gray-100 flex items-center justify-center">
//                 {featureIcons?.[0] ? (
//                   <img
//                     src={featureIcons[0]}
//                     alt={`${features[0]} icon`}
//                     className="w-14 h-14 object-contain"
//                   />
//                 ) : (
//                   <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
//                     <Award className="h-8 w-8" />
//                   </div>
//                 )}
//               </motion.div>
//               <div className="flex-1">
//                 <Title level={3} className="!mb-3">
//                   Featured: {features[0]}
//                 </Title>
//                 <Paragraph className="!text-lg text-gray-600 !mb-4">
//                   This standout feature delivers exceptional value and
//                   performance that sets this product apart.
//                 </Paragraph>
//                 <Button
//                   type="primary"
//                   size="large"
//                   onClick={() => setSpotlightFeature(features[0])}
//                   className="rounded-full"
//                 >
//                   Explore Feature
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {/* Features Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature, i) => (
//             <motion.div
//               key={i}
//               variants={cardVariants}
//               custom={i}
//               initial="hidden"
//               whileInView="show"
//               viewport={{
//                 once: false,
//                 amount: 0.35,
//                 margin: "-12% 0px -12% 0px",
//               }}
//               whileHover="hover"
//               className="focus-visible:outline-none cursor-pointer"
//               onClick={() => setSpotlightFeature(feature)}
//             >
//               <Card
//                 bordered={false}
//                 className="h-full rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border border-gray-100"
//                 styles={{ body: { padding: 32 } }}
//               >
//                 <div className="text-center">
//                   <motion.div
//                     className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-6 overflow-hidden ring-1 ring-gray-100 bg-white"
//                     whileHover={{ scale: 1.08, rotate: 2 }}
//                   >
//                     {featureIcons?.[i] ? (
//                       <img
//                         src={featureIcons[i]}
//                         alt={`${feature} icon`}
//                         className="h-14 w-14 object-contain"
//                       />
//                     ) : (
//                       <div className="h-16 w-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded-2xl">
//                         <Shield className="h-7 w-7" />
//                       </div>
//                     )}
//                   </motion.div>

//                   <Title level={4} className="!mb-4">
//                     {feature}
//                   </Title>
//                 </div>
//               </Card>
//             </motion.div>
//           ))}
//         </div>

//         {/* Bottom CTA */}
//         <motion.div {...riseIn(0.3)} className="mt-20 text-center">
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
//             <Title level={2} className="!text-white !mb-6">
//               Ready to Experience Excellence?
//             </Title>
//             <Paragraph className="!text-xl !text-blue-100 !mb-8 max-w-2xl mx-auto">
//               Join thousands who transformed their workflow with our solutions.
//             </Paragraph>
//             <Space size="large">
//               <Button
//                 type="primary"
//                 size="large"
//                 className="rounded-full px-8 py-6 text-lg font-semibold bg-white text-blue-600 border-0 hover:bg-gray-100"
//                 onClick={() => antdMsg.success("Request submitted!")}
//               >
//                 Get Started Today
//               </Button>
//               <Button
//                 size="large"
//                 className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-600"
//                 onClick={() => antdMsg.info("Opening details…")}
//               >
//                 Learn More
//               </Button>
//             </Space>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// /* ================= Spotlight Modal ================= */
// function SpotlightModal({
//   feature,
//   onClose,
//   featureIcons,
//   features,
// }: {
//   feature: string | null;
//   onClose: () => void;
//   featureIcons: string[];
//   features: string[];
// }) {
//   const idx = Math.max(
//     0,
//     features.findIndex((f) => f === feature)
//   );
//   const icon = feature ? featureIcons?.[idx] : undefined;

//   return (
//     <Modal
//       open={!!feature}
//       onCancel={onClose}
//       footer={null}
//       title={
//         <div className="flex items-center gap-3">
//           <Sparkles className="h-6 w-6 text-yellow-500" />
//           <span className="text-xl">Feature Spotlight</span>
//         </div>
//       }
//       centered
//       width={700}
//     >
//       <div className="p-6">
//         <div className="text-center mb-8">
//           <motion.div
//             className="inline-flex h-20 w-20 items-center justify-center rounded-3xl mb-6 overflow-hidden ring-1 ring-gray-100 bg-white"
//             animate={{ rotate: [0, 3, -3, 0] }}
//             transition={{ duration: 2, repeat: Infinity }}
//           >
//             {icon ? (
//               <img
//                 src={icon}
//                 alt="feature icon"
//                 className="h-16 w-16 object-contain"
//               />
//             ) : (
//               <Award className="h-10 w-10 text-blue-600" />
//             )}
//           </motion.div>

//           <Title level={3} className="!mb-4">
//             {feature}
//           </Title>
//         </div>

//         <Collapse
//           items={[
//             {
//               key: "1",
//               label: "Key Benefits",
//               children: (
//                 <List
//                   dataSource={[
//                     "Enhanced productivity and efficiency",
//                     "Seamless integration with existing workflows",
//                     "Advanced security and reliability features",
//                     "Scalable solution for growing businesses",
//                   ]}
//                   renderItem={(it) => (
//                     <List.Item>
//                       <div className="flex items-center gap-3">
//                         <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
//                         <Text>{it}</Text>
//                       </div>
//                     </List.Item>
//                   )}
//                 />
//               ),
//             },
//             {
//               key: "2",
//               label: "Technical Specifications",
//               children: (
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <Text strong>Performance</Text>
//                     <br />
//                     <Text type="secondary">Enterprise Grade</Text>
//                   </div>
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <Text strong>Compatibility</Text>
//                     <br />
//                     <Text type="secondary">Universal</Text>
//                   </div>
//                 </div>
//               ),
//             },
//           ]}
//         />

//         <div className="mt-8 flex justify-center gap-4">
//           <Button
//             type="primary"
//             size="large"
//             className="rounded-full px-8"
//             onClick={() => {
//               onClose();
//               antdMsg.success("Demo request submitted!");
//             }}
//           >
//             Request Demo
//           </Button>
//           <Button size="large" className="rounded-full px-8" onClick={onClose}>
//             Close
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// }
