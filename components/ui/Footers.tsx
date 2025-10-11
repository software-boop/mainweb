// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { motion, useReducedMotion } from "framer-motion";
// import {
//   Facebook,
//   Instagram,
//   Linkedin,
//   Youtube,
//   ChevronDown,
//   ArrowUp,
// } from "lucide-react";
// import { Button } from "./button";

// // ====== MENU DATA ======
// import type { MenuCategory } from "@/app/data/menuData";
// import { MENU_DATA } from "@/app/data/menuData";

// /* =================================
//    Types
//    ================================= */
// interface FooterLink {
//   title: string;
//   href: string;
//   icon?: React.ComponentType<{ className?: string }>;
// }
// type StickyFooterProps = React.ComponentProps<"footer"> & {
//   /** Brand color used for accents (hex/rgb). */
//   brand?: string;
// };

// /* =================================
//    Helpers
//    ================================= */
// function slugify(text: string): string {
//   return text
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// }

// function buildLinksFromMenu(
//   categoryKey: "products" | "solutions",
//   max?: number
// ): FooterLink[] {
//   const cats: MenuCategory[] = MENU_DATA[categoryKey] || [];
//   const links = cats.flatMap((cat) =>
//     cat.items.map((item) => ({
//       title: item.label,
//       href: `/${categoryKey}/${slugify(cat.title)}/${slugify(item.label)}`,
//     }))
//   );
//   return typeof max === "number" ? links.slice(0, max) : links;
// }

// /* =================================
//    Static data
//    ================================= */
// const socialLinks: FooterLink[] = [
//   { title: "Facebook", href: "https://facebook.com/yourpage", icon: Facebook },
//   {
//     title: "Instagram",
//     href: "https://instagram.com/yourpage",
//     icon: Instagram,
//   },
//   { title: "YouTube", href: "https://youtube.com/@yourpage", icon: Youtube },
//   {
//     title: "LinkedIn",
//     href: "https://linkedin.com/company/yourpage",
//     icon: Linkedin,
//   },
// ];

// const resourceLinks: FooterLink[] = [
//   { title: "Blog", href: "#" },
//   { title: "Case Studies", href: "#" },
//   { title: "Documentation", href: "#" },
//   { title: "API Reference", href: "#" },
//   { title: "Developer Tools", href: "#" },
//   { title: "Guides & Tutorials", href: "#" },
//   { title: "Whitepapers", href: "#" },
//   { title: "Reports & Research", href: "#" },
//   { title: "Events & Webinars", href: "#" },
//   { title: "E-books", href: "#" },
//   { title: "Community Forum", href: "#" },
//   { title: "Release Notes", href: "#" },
//   { title: "System Status", href: "#" },
// ];

// const companyQuickLinks: FooterLink[] = [
//   { title: "About Us", href: "/company/about-us" },
//   { title: "Leadership", href: "/company/leadership" },
//   { title: "Careers", href: "/company/careers" },
// ];

// /* =================================
//    Component
//    ================================= */
// export function StickyFooter({
//   className,
//   brand = "#07518a",
//   ...props
// }: StickyFooterProps) {
//   const [showTop, setShowTop] = React.useState(false);

//   // Dynamic links from MENU_DATA
//   const productLinks = React.useMemo(() => buildLinksFromMenu("products"), []);
//   const solutionLinks = React.useMemo(
//     () => buildLinksFromMenu("solutions"),
//     []
//   );

//   React.useEffect(() => {
//     const onScroll = () => setShowTop(window.scrollY > 320);
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <footer
//       className={cn(
//         "m-0 p-0 w-full bg-zinc-700 text-white relative pl-12 pt-32",
//         className
//       )}
//       style={{ ["--brand" as any]: brand } as React.CSSProperties}
//       {...props}
//     >
//       {/* subtle top sheen */}
//       <div
//         aria-hidden
//         className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
//       />

//       <div className="w-full">
//         {/* ===== Desktop (4 cols) ===== */}
//         <div className="hidden md:grid grid-cols-4 gap-6">
//           {/* Col 1: Brand + newsletter + socials */}
//           <AnimatedContainer delay={0.05} className="space-y-4">
//             <div className="flex flex-col items-start gap-2">
//               <img
//                 src="/highbtlogo white- tm.png"
//                 alt="Brihaspathi Technologies logo"
//                 className="h-16 w-auto object-contain"
//               />
//               <div className="text-xl font-semibold tracking-tight">
//                 Brihaspathi Technologies Limited
//               </div>
//             </div>

//             <p className="text-sm text-white/85">
//               Innovative fintech empowering businesses with seamless payments,
//               lending, and financial infrastructure worldwide.
//             </p>

//             <div className="space-y-2">
//               <SectionTitle size="md">Stay in the loop</SectionTitle>
//               <p className="text-sm text-white/90">
//                 Subscribe for product updates, case studies, and industry
//                 insights.
//               </p>
//               <form
//                 className="flex w-full max-w-sm items-center gap-2"
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                 }}
//               >
//                 <input
//                   type="email"
//                   required
//                   placeholder="your@email.com"
//                   className="h-11 w-full flex-1 rounded-lg border border-white/30 bg-white/90 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-white/60"
//                   aria-label="Email address"
//                 />
//                 <Button className="h-11 rounded-lg px-4 bg-[var(--brand)] text-white hover:opacity-90">
//                   Subscribe
//                 </Button>
//               </form>
//               <p className="text-xs text-white/70">
//                 By subscribing, you agree to our{" "}
//                 <Link
//                   href="/privacy"
//                   className="underline underline-offset-2 text-white hover:text-white"
//                 >
//                   Privacy Policy
//                 </Link>
//                 .
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {socialLinks.map((link) => (
//                 <Button
//                   key={link.title}
//                   size="icon"
//                   variant="outline"
//                   className="size-9 rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60"
//                   asChild
//                   title={link.title}
//                 >
//                   <Link href={link.href} aria-label={link.title}>
//                     {link.icon ? <link.icon className="size-4" /> : null}
//                   </Link>
//                 </Button>
//               ))}
//             </div>
//           </AnimatedContainer>

//           {/* Col 2: Product */}
//           <AnimatedContainer delay={0.08}>
//             <FooterGroupDark title="Product" links={productLinks} />
//           </AnimatedContainer>

//           {/* Col 3: Solutions (Company moved away from here) */}
//           <AnimatedContainer delay={0.11}>
//             <FooterGroupDark title="Solutions" links={solutionLinks} />
//           </AnimatedContainer>

//           {/* Col 4: Resources + Company (moved under Resources) */}
//           <AnimatedContainer delay={0.14} className="space-y-8">
//             <FooterGroupDark title="Resources" links={resourceLinks} />
//             <div className="border-t border-white/15" />
//             <FooterGroupDark title="Company" links={companyQuickLinks} />
//           </AnimatedContainer>
//         </div>

//         {/* ===== Mobile (brand/newsletter + accordions) ===== */}
//         <div className="md:hidden">
//           <div className="space-y-4">
//             <div className="flex flex-col items-start gap-2">
//               <img
//                 src="/highbtlogo white- tm.png"
//                 alt="Brihaspathi Technologies logo"
//                 className="h-14 w-auto object-contain"
//               />
//               <span className="text-lg font-semibold tracking-tight">
//                 Brihaspathi Technologies Limited
//               </span>
//             </div>

//             <p className="text-sm text-white/85">
//               Innovation-driven Solutions for Modern Technology Demands
//             </p>

//             <div className="space-y-2">
//               <SectionTitle size="md">Stay in the loop</SectionTitle>
//               <p className="text-sm text-white/90">
//                 Subscribe for product updates, case studies, and industry
//                 insights.
//               </p>
//               <form
//                 className="flex w-full items-center gap-2"
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                 }}
//               >
//                 <input
//                   type="email"
//                   required
//                   placeholder="your@email.com"
//                   className="h-11 w-full flex-1 rounded-lg border border-white/30 bg-white/90 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-white/60"
//                   aria-label="Email address"
//                 />
//                 <Button className="h-11 rounded-lg px-4 bg-[var(--brand)] text-white hover:opacity-90">
//                   Subscribe
//                 </Button>
//               </form>
//               <p className="text-xs text-white/70">
//                 By subscribing, you agree to our{" "}
//                 <Link
//                   href="/privacy"
//                   className="underline underline-offset-2 text-white hover:text-white"
//                 >
//                   Privacy Policy
//                 </Link>
//                 .
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {socialLinks.map((link) => (
//                 <Button
//                   key={link.title}
//                   size="icon"
//                   variant="outline"
//                   className="size-9 rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60"
//                   asChild
//                   title={link.title}
//                 >
//                   <Link href={link.href} aria-label={link.title}>
//                     {link.icon ? <link.icon className="size-4" /> : null}
//                   </Link>
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {/* Accordions (Company lives inside the Resources accordion) */}
//           <div className="mt-4 divide-y divide-white/15 rounded-none">
//             <AccordionGroup
//               label="Product"
//               links={productLinks}
//               defaultOpen
//               brand={brand}
//             />
//             <AccordionGroup
//               label="Solutions"
//               links={solutionLinks}
//               brand={brand}
//             />

//             {/* Resources + Company combined */}
//             <details
//               className="group rounded-lg border border-transparent transition"
//               style={{ ["--brand" as any]: brand }}
//             >
//               <summary
//                 className="
//                   relative flex cursor-pointer list-none items-center justify-between
//                   px-3 py-3 text-base font-semibold
//                   text-[var(--brand)]
//                   rounded-lg hover:opacity-90
//                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/35
//                 "
//               >
//                 <span className="tracking-wide">Resources</span>
//                 <ChevronDown className="size-5 text-[var(--brand)] transition-transform duration-300 ease-out group-open:rotate-180" />
//               </summary>

//               <div
//                 className="
//                   grid overflow-hidden px-3
//                   grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out
//                   group-open:grid-rows-[1fr]
//                 "
//               >
//                 <div className="min-h-0 overflow-hidden pb-3">
//                   <ul className="space-y-2">
//                     {resourceLinks.map((link, idx) => (
//                       <li key={`Resources-${idx}`}>
//                         <Link
//                           href={link.href}
//                           className="group/link inline-flex items-center gap-2 py-2 text-sm text-white/90 hover:text-white transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/30"
//                         >
//                           <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]/70 group-hover/link:bg-[var(--brand)]" />
//                           <span className="underline decoration-transparent underline-offset-4 transition-[text-decoration-color] group-hover/link:decoration-white/60">
//                             {link.title}
//                           </span>
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>

//                   {/* Company under Resources */}
//                   <div className="my-3 border-t border-white/15" />
//                   <span className="inline-block mt-2 mb-1 rounded-md bg-[var(--brand)] px-2.5 py-1 text-sm font-semibold uppercase tracking-wide text-white">
//                     Company
//                   </span>
//                   <ul className="space-y-2">
//                     {companyQuickLinks.map((link, idx) => (
//                       <li key={`Company-${idx}`}>
//                         <Link
//                           href={link.href}
//                           className="group/link inline-flex items-center gap-2 py-2 text-sm text-white/90 hover:text-white transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/30"
//                         >
//                           <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]/70 group-hover/link:bg-[var(--brand)]" />
//                           <span className="underline decoration-transparent underline-offset-4 transition-[text-decoration-color] group-hover/link:decoration-white/60">
//                             {link.title}
//                           </span>
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </details>
//           </div>
//         </div>

//         {/* Bottom bar */}
//         <div className="border-t border-white/15">
//           <div className="flex flex-col items-center justify-between gap-3 text-sm text-white/85 md:flex-row">
//             <p>© 2025 Cognition, Inc. All rights reserved.</p>
//             <div className="flex items-center gap-4">
//               <Link href="/privacy" className="hover:text-white">
//                 Privacy
//               </Link>
//               <Link href="/terms" className="hover:text-white">
//                 Terms
//               </Link>
//               <Link href="/security" className="hover:text-white">
//                 Security
//               </Link>
//               <span className="text-white/40">|</span>
//               <p>asme inc.</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Back to top FAB */}
//     </footer>
//   );
// }

// /* =================================
//    Reusable pieces
//    ================================= */
// function SectionTitle({
//   children,
//   size = "sm",
// }: {
//   children: React.ReactNode;
//   size?: "sm" | "md" | "lg";
// }) {
//   const sz =
//     size === "lg"
//       ? "text-base md:text-lg"
//       : size === "md"
//       ? "text-sm md:text-base"
//       : "text-xs md:text-sm";
//   return (
//     <span
//       className={cn(
//         "inline-block rounded-md bg-[var(--brand)] px-2.5 py-1 font-semibold uppercase tracking-wide text-white",
//         sz
//       )}
//     >
//       {children}
//     </span>
//   );
// }

// function FooterGroupDark({
//   title,
//   links,
// }: {
//   title: string;
//   links: FooterLink[];
// }) {
//   return (
//     <div className="min-w-0">
//       <SectionTitle size="lg">{title}</SectionTitle>
//       <ul className="mt-4 space-y-2 text-sm">
//         {links.map((link, li) => (
//           <motion.li
//             key={`${title}-${li}`}
//             initial={{ opacity: 0, y: 4 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ duration: 0.25 }}
//             className="min-w-0"
//           >
//             <Link
//               href={link.href}
//               className="inline-flex items-center text-white/90 hover:text-white"
//             >
//               {link.icon ? <link.icon className="mr-2 size-4" /> : null}
//               <span className="truncate underline decoration-transparent underline-offset-4 transition-all hover:decoration-white/60">
//                 {link.title}
//               </span>
//             </Link>
//           </motion.li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function AccordionGroup({
//   label,
//   links,
//   defaultOpen = false,
//   brand = "#07518a",
// }: {
//   label: string;
//   links: FooterLink[];
//   defaultOpen?: boolean;
//   brand?: string;
// }) {
//   return (
//     <details
//       className="group rounded-lg border border-transparent transition"
//       open={defaultOpen}
//       style={{ ["--brand" as any]: brand }}
//     >
//       <summary
//         className="
//           relative flex cursor-pointer list-none items-center justify-between
//           px-3 py-3 text-base font-semibold
//           text-[var(--brand)]
//           rounded-lg hover:opacity-90
//           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/35
//         "
//       >
//         <span className="tracking-wide">{label}</span>
//         <ChevronDown className="size-5 text-[var(--brand)] transition-transform duration-300 ease-out group-open:rotate-180" />
//       </summary>

//       <div
//         className="
//           grid overflow-hidden px-3
//           grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out
//           group-open:grid-rows-[1fr]
//         "
//       >
//         <ul className="min-h-0 overflow-hidden pb-3">
//           {links.map((link, idx) => (
//             <li key={`${label}-${idx}`}>
//               <Link
//                 href={link.href}
//                 className="
//                   group/link inline-flex items-center gap-2 py-2 text-sm
//                   text-white/90 hover:text-white transition
//                   rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/30
//                 "
//               >
//                 <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]/70 group-hover/link:bg-[var(--brand)]" />
//                 {link.icon ? <link.icon className="size-4 opacity-90" /> : null}
//                 <span className="underline decoration-transparent underline-offset-4 transition-[text-decoration-color] group-hover/link:decoration-white/60">
//                   {link.title}
//                 </span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </details>
//   );
// }

// /* =================================
//    Animated container
//    ================================= */
// type AnimatedContainerProps = React.ComponentProps<typeof motion.div> & {
//   children?: React.ReactNode;
//   delay?: number;
// };

// function AnimatedContainer({
//   delay = 0.08,
//   children,
//   ...props
// }: AnimatedContainerProps) {
//   const reduce = useReducedMotion();
//   if (reduce) return <div {...props}>{children}</div>;
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
//       whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//       viewport={{ once: true, amount: 0.4 }}
//       transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
//       {...props}
//     >
//       {children}
//     </motion.div>
//   );
// }

// import {
//   Dribbble,
//   Facebook,
//   Github,
//   Instagram,
//   Mail,
//   MapPin,
//   Linkedin,
//   Phone,
//   Twitter,
// } from "lucide-react";
// import Link from "next/link";

// const data = {
//   facebookLink: "https://www.facebook.com/BrihaspathiTechnology",
//   instaLink: "https://www.instagram.com/brihaspathitechnologieslimited/",
//   twitterLink: "https://x.com/brihaspathitec",
//   linkdin:
//     "https://www.linkedin.com/company/brihaspathi-technologies?originalSubdomain=in",
//   dribbbleLink: "https://www.brihaspathi.com/",
//   services: {
//     webdev: "/web-development",
//     webdesign: "/web-design",
//     marketing: "/marketing",
//     googleads: "/google-ads",
//   },
//   about: {
//     history: "/company-history",
//     team: "/meet-the-team",
//     handbook: "/employee-handbook",
//     careers: "/careers",
//   },
//   help: {
//     faqs: "/faqs",
//     support: "/support",
//     livechat: "/live-chat",
//   },
//   contact: {
//     email: "info@brihaspathi.com",
//     phone: "+91 98858 88835",
//     tollFree: "1800 296 8899",
//     addresses: {
//       registeredOffice:
//         "5th Floor, Sahithi Arcade, SR Nagar, Hyderabad - 500038",
//       corporateOffice:
//         "501, 508-510, Shangrila Plaza, Road No. 2, Park View Enclave, Banjara Hills, Hyderabad, Telangana - 500034",
//     },
//   },
//   company: {
//     name: "Brihaspathi Technologies Limited",
//     description:
//       "Building beautiful and functional web experiences with modern technologies. We help startups and businesses create their digital presence.",
//     logo: "/highbtlogo white- tm.png",
//   },
// };
// const logo = "/highbtlogo white- tm.png";

// const socialLinks = [
//   { icon: Facebook, label: "Facebook", href: data.facebookLink },
//   { icon: Instagram, label: "Instagram", href: data.instaLink },
//   { icon: Twitter, label: "Twitter", href: data.twitterLink },
//   { icon: Linkedin, label: "GitHub", href: data.linkdin },
//   { icon: Dribbble, label: "Dribbble", href: data.dribbbleLink },
// ];

// const aboutLinks = [
//   { text: "Company History", href: data.about.history },
//   { text: "Meet the Team", href: data.about.team },
//   { text: "Employee Handbook", href: data.about.handbook },
//   { text: "Careers", href: data.about.careers },
// ];

// const serviceLinks = [
//   { text: "Web Development", href: data.services.webdev },
//   { text: "Web Design", href: data.services.webdesign },
//   { text: "Marketing", href: data.services.marketing },
//   { text: "Google Ads", href: data.services.googleads },
// ];

// const helpfulLinks = [
//   { text: "FAQs", href: data.help.faqs },
//   { text: "Support", href: data.help.support },
//   { text: "Live Chat", href: data.help.livechat, hasIndicator: true },
// ];

// const contactInfo = [
//   { icon: Mail, text: data.contact.email },
//   { icon: Phone, text: data.contact.phone },
//   { icon: MapPin, text: data.contact.address, isAddress: true },
// ];

// export default function Footer4Col() {
//   return (
//     <footer className="bg-secondary dark:bg-secondary/20 mt-16 w-full place-self-end rounded-t-xl bg-gray-600 text-white">
//       <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
//           <div>
//             <div className="text-primary ">
//               <img src={logo} alt="logo" className="h-10 w-32 " />
//               <p className=" font-semibold">{data.company.name}</p>
//             </div>

//             <p className="text-foreground/50 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
//               {data.company.description}
//             </p>

//             <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
//               {socialLinks.map(({ icon: Icon, label, href }) => (
//                 <li key={label}>
//                   <Link
//                     href={href}
//                     className="text-primary hover:text-primary/80 transition"
//                   >
//                     <span className="sr-only">{label}</span>
//                     <Icon className="size-6" />
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
//             <div className="text-center sm:text-left">
//               <p className="text-lg font-medium">About Us</p>
//               <ul className="mt-8 space-y-4 text-sm">
//                 {aboutLinks.map(({ text, href }) => (
//                   <li key={text}>
//                     <a
//                       className="text-secondary-foreground/70 transition"
//                       href={href}
//                     >
//                       {text}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="text-center sm:text-left">
//               <p className="text-lg font-medium">Our Services</p>
//               <ul className="mt-8 space-y-4 text-sm">
//                 {serviceLinks.map(({ text, href }) => (
//                   <li key={text}>
//                     <a
//                       className="text-secondary-foreground/70 transition"
//                       href={href}
//                     >
//                       {text}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="text-center sm:text-left">
//               <p className="text-lg font-medium">Helpful Links</p>
//               <ul className="mt-8 space-y-4 text-sm">
//                 {helpfulLinks.map(({ text, href, hasIndicator }) => (
//                   <li key={text}>
//                     <a
//                       href={href}
//                       className={`${
//                         hasIndicator
//                           ? "group flex justify-center gap-1.5 sm:justify-start"
//                           : "text-secondary-foreground/70 transition"
//                       }`}
//                     >
//                       <span className="text-secondary-foreground/70 transition">
//                         {text}
//                       </span>
//                       {hasIndicator && (
//                         <span className="relative flex size-2">
//                           <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
//                           <span className="bg-primary relative inline-flex size-2 rounded-full" />
//                         </span>
//                       )}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//          <div className="text-center sm:text-left">
//   <p className="text-lg font-medium">Contact Us</p>
//   <ul className="mt-8 space-y-4 text-sm">
//     {contactInfo.map(({ icon: Icon, text, isAddress }: any) => (
//       <li key={text}>
//         <div className="flex items-center justify-center gap-1.5 sm:justify-start">
//           <Icon className="text-primary size-5 shrink-0 shadow-sm" />
//           {isAddress ? (
//             <address className="text-secondary-foreground/70 -mt-0.5 flex-1 not-italic transition">
//               {text}
//             </address>
//           ) : (
//             <span className="text-secondary-foreground/70 flex-1 transition">
//               {text}
//             </span>
//           )}
//         </div>
//       </li>
//     ))}
//   </ul>
// </div>

//               <p className="text-lg font-medium">Contact Us</p>
//               <ul className="mt-8 space-y-4 text-sm">
//                 {contactInfo.map(({ icon: Icon, text, isAddress }) => {
//                   const href = text.includes("@")
//                     ? `mailto:${text}`
//                     : /^\+?\d[\d\s-]+$/.test(text)
//                     ? `tel:${text.replace(/[^+\d]/g, "")}`
//                     : undefined;

//                   const Wrapper: React.ElementType = href ? "a" : "div";
//                   const wrapperProps = href
//                     ? {
//                         href,
//                         className:
//                           "flex items-center justify-center gap-1.5 sm:justify-start",
//                       }
//                     : {
//                         className:
//                           "flex items-center justify-center gap-1.5 sm:justify-start",
//                       };

//                   return (
//                     <li key={text}>
//                       <Wrapper {...wrapperProps}>
//                         <Icon className="text-primary size-5 shrink-0 shadow-sm" />
//                         {isAddress ? (
//                           <address className="text-secondary-foreground/70 -mt-0.5 flex-1 not-italic transition">
//                             {text}
//                           </address>
//                         ) : (
//                           <span className="text-secondary-foreground/70 flex-1 transition">
//                             {text}
//                           </span>
//                         )}
//                       </Wrapper>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="mt-12 border-t pt-6">
//           <div className="text-center sm:flex sm:justify-between sm:text-left">
//             <p className="text-sm">
//               <span className="block sm:inline">All rights reserved.</span>
//             </p>

//             <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">
//               &copy; 2025 {data.company.name}
//             </p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
// import {
//   Dribbble,
//   Facebook,
//   Instagram,
//   Mail,
//   MapPin,
//   Linkedin,
//   Phone,
//   Twitter,
// } from "lucide-react";
// import Link from "next/link";
// import React from "react";

// type SocialLink = {
//   icon: React.ComponentType<{ className?: string }>;
//   label: string;
//   href: string;
// };

// type NavLink = { text: string; href: string; hasIndicator?: boolean };

// type ContactInfoItem = {
//   icon: React.ComponentType<{ className?: string }>;
//   text: string;
//   isAddress?: boolean;
// };

// const data = {
//   facebookLink: "https://www.facebook.com/BrihaspathiTechnology",
//   instaLink: "https://www.instagram.com/brihaspathitechnologieslimited/",
//   twitterLink: "https://x.com/brihaspathitec",
//   linkdin:
//     "https://www.linkedin.com/company/brihaspathi-technologies?originalSubdomain=in",
//   dribbbleLink: "https://www.brihaspathi.com/",
//   services: {
//     webdev: "/web-development",
//     webdesign: "/web-design",
//     marketing: "/marketing",
//     googleads: "/google-ads",
//   },
//   about: {
//     history: "/company-history",
//     team: "/meet-the-team",
//     handbook: "/employee-handbook",
//     careers: "/careers",
//   },
//   help: {
//     faqs: "/faqs",
//     support: "/support",
//     livechat: "/live-chat",
//   },
//   contact: {
//     email: "info@brihaspathi.com",
//     phone: "+91 98858 88835",
//     tollFree: "1800 296 8899",
//     addresses: {
//       registeredOffice:
//         "5th Floor, Sahithi Arcade, SR Nagar, Hyderabad - 500038",
//       corporateOffice:
//         "501, 508-510, Shangrila Plaza, Road No. 2, Park View Enclave, Banjara Hills, Hyderabad, Telangana - 500034",
//     },
//   },
//   company: {
//     name: "Brihaspathi Technologies Limited",
//     description:
//       "Trusted surveillance, ELV, and smart technology partner for forward-thinking Business.",
//     logo: "/highbtlogo white- tm.png",
//   },
// };

// const logo = data.company.logo;

// const socialLinks: SocialLink[] = [
//   { icon: Facebook, label: "Facebook", href: data.facebookLink },
//   { icon: Instagram, label: "Instagram", href: data.instaLink },
//   { icon: Twitter, label: "Twitter", href: data.twitterLink },
//   { icon: Linkedin, label: "LinkedIn", href: data.linkdin },
//   { icon: Dribbble, label: "Website", href: data.dribbbleLink },
// ];

// const aboutLinks: NavLink[] = [
//   { text: "Company History", href: data.about.history },
//   { text: "Meet the Team", href: data.about.team },
//   { text: "life at brihaspathi", href: data.about.handbook },
//   { text: "Careers", href: data.about.careers },
// ];

// const serviceLinks: NavLink[] = [
//   { text: "E communications", href: data.services.webdev },
//   { text: "software Services", href: data.services.webdesign },
//   { text: "it and telecom services", href: data.services.marketing },
//   { text: "security services", href: data.services.googleads },
// ];

// const helpfulLinks: NavLink[] = [
//   { text: "FAQs", href: data.help.faqs },
//   { text: "Support", href: data.help.support },
//   { text: "Live Chat", href: data.help.livechat, hasIndicator: true },
// ];

// const contactInfo: ContactInfoItem[] = [
//   { icon: Mail, text: data.contact.email },
//   {
//     icon: Phone,
//     text: `${data.contact.phone} • Toll-free: ${data.contact.tollFree}`,
//   },
//   {
//     icon: MapPin,
//     text: `Registered Office: ${data.contact.addresses.registeredOffice}`,
//     isAddress: true,
//   },
//   {
//     icon: MapPin,
//     text: `Corporate Office: ${data.contact.addresses.corporateOffice}`,
//     isAddress: true,
//   },
// ];

// export default function Footer4Col() {
//   return (
//     <footer className="bg-secondary dark:bg-secondary/20 mt-16 w-full place-self-end rounded-t-xl bg-gray-600 text-white">
//       <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
//           {/* Brand + Social */}
//           <div>
//             <div className="text-primary">
//               <img src={logo} alt="Brihaspathi logo" className="h-10 w-32" />
//               <p className="font-semibold">{data.company.name}</p>
//             </div>

//             <p className=" mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left text-white">
//               {data.company.description}
//             </p>

//             <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
//               {socialLinks.map(({ icon: Icon, label, href }) => (
//                 <li key={label}>
//                   <Link
//                     href={href}
//                     className="text-primary hover:text-primary/80 transition"
//                     aria-label={label}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Icon className="size-6" />
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Link Columns */}
//           <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
//             <div className="text-center sm:text-left">
//               <p className="text-lg font-medium">About Us</p>
//               <ul className="mt-8 space-y-4 text-sm">
//                 {aboutLinks.map(({ text, href }) => (
//                   <li key={text}>
//                     <a
//                       className="text-secondary-foreground/70 transition hover:text-white/90"
//                       href={href}
//                     >
//                       {text}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="text-center sm:text-left">
//               <p className="text-lg font-medium">Our Services</p>
//               <ul className="mt-8 space-y-4 text-sm">
//                 {serviceLinks.map(({ text, href }) => (
//                   <li key={text}>
//                     <a
//                       className="text-secondary-foreground/70 transition hover:text-white/90"
//                       href={href}
//                     >
//                       {text}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="text-center sm:text-left">
//               <p className="text-lg font-medium">Helpful Links</p>
//               <ul className="mt-8 space-y-4 text-sm">
//                 {helpfulLinks.map(({ text, href, hasIndicator }) => (
//                   <li key={text}>
//                     <a
//                       href={href}
//                       className={
//                         hasIndicator
//                           ? "group flex justify-center gap-1.5 sm:justify-start"
//                           : "text-secondary-foreground/70 transition hover:text-white/90"
//                       }
//                     >
//                       <span className="text-secondary-foreground/70 transition group-hover:text-white/90">
//                         {text}
//                       </span>
//                       {hasIndicator && (
//                         <span className="relative ml-1 flex size-2">
//                           <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
//                           <span className="bg-primary relative inline-flex size-2 rounded-full" />
//                         </span>
//                       )}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Contact Us (div-only wrapper; no mailto/tel to avoid runtime errors) */}
//             <div className="text-center sm:text-left">
//               <p className="text-lg font-medium">Contact Us</p>
//               <ul className="mt-8 space-y-4 text-sm">
//                 {contactInfo.map(({ icon: Icon, text, isAddress }) => (
//                   <li key={text}>
//                     <div className="flex items-center justify-center gap-1.5 sm:justify-start">
//                       <Icon className="text-primary size-5 shrink-0 shadow-sm" />
//                       {isAddress ? (
//                         <address className="text-secondary-foreground/70 -mt-0.5 flex-1 not-italic transition">
//                           {text}
//                         </address>
//                       ) : (
//                         <span className="text-secondary-foreground/70 flex-1 transition">
//                           {text}
//                         </span>
//                       )}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Footer Bottom */}
//         <div className="mt-12 border-t pt-6">
//           <div className="text-center sm:flex sm:justify-between sm:text-left">
//             <p className="text-sm">
//               <span className="block sm:inline">All rights reserved.</span>
//             </p>

//             <p className="text-secondary-foreground/70 mt-4 text-sm transition sm:order-first sm:mt-0">
//               &copy; 2025 {data.company.name}
//             </p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  Dribbble,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

/* =============================================
   Data (edit paths / text to match your site)
============================================= */
const data = {
  facebookLink: "https://www.facebook.com/BrihaspathiTechnology",
  instaLink: "https://www.instagram.com/brihaspathitechnologieslimited/",
  twitterLink: "https://x.com/brihaspathitec",
  linkdin:
    "https://www.linkedin.com/company/brihaspathi-technologies?originalSubdomain=in",
  dribbbleLink: "https://www.brihaspathi.com/",

  contact: {
    email: "info@brihaspathi.com",
    phone: "+91 98858 88835",
    tollFree: "1800 296 8899",
    addresses: {
      registeredOffice:
        "5th Floor, Sahithi Arcade, SR Nagar, Hyderabad - 500038",
      corporateOffice:
        "501, 508-510, Shangrila Plaza, Road No. 2, Park View Enclave, Banjara Hills, Hyderabad, Telangana - 500034",
    },
  },
  company: {
    name: "Brihaspathi Technologies Limited",
    description:
      "Trusted surveillance, ELV, and smart technology partner for forward-thinking business.",
    logo: "/highbtlogo white- tm.png",
  },
};

const logo = data.company.logo;

/* ---------- Links (grouped for the 4 columns) ---------- */
const aboutLinks = [
  { text: "Our History", href: "/about/our-story" },
  { text: "Founder-Managing Director", href: "/about/founder" },
  { text: "Board of Directors", href: "/about/boardofdirectors" },
  { text: "Our team", href: "/about/ourteam" },
  // { text: "Awards", href: "/Resources/awards" },
];

const careersLinks = [
  { text: "Working at Brihaspathi", href: "/life-at-brihaspathi" },
];

const businessLinks = [
  {
    text: "AI – Surveillance",
    href: "/solutions/video-analytics",
  },
  { text: "Access control", href: "/solutions/access-control" },
  { text: "Smart retail", href: "/solutions/smart-retail" },
  { text: "Smart Bus", href: "/solutions/smart-bus" },
];

const newsMediaLinks = [
  { text: "Resource Centre", href: "/resource-centre" },
  { text: "Events", href: "/events" },
];

const servicesLinks = [
  { text: "E-Communication", href: "/services/e-communication" },
  { text: "Software Services", href: "/services/software-services" },
  { text: "IT & Telecom Services", href: "/services/it-telecom-services" },
  { text: "Security Services", href: "/services/security-services" },
  { text: "Sector Solutions", href: "/services/sector-solutions" },
  { text: "Smart City Solutions", href: "/services/smart-city-solutions" },
  { text: "Enterprise Solutions", href: "/services/enterprise-solutions" },
  { text: "Industrial Solutions", href: "/services/industrial-solutions" },
];

const quickLinks = [
  { text: "Industrial Solutions", href: "/services/industrial-solutions" },
  { text: "Security Services", href: "/services/security-services" },
  { text: "Smart City Solutions", href: "/services/smart-city-solutions" },
  { text: "Software Services", href: "/services/software-services" },
  { text: "Contact Us", href: "/contact" },
  { text: "FAQs", href: "/faq" },
  { text: "Support", href: "/support" },
  { text: "Live Chat", href: "/live-chat" },
];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: data.facebookLink },
  { icon: Instagram, label: "Instagram", href: data.instaLink },
  { icon: Twitter, label: "Twitter", href: data.twitterLink },
  { icon: Linkedin, label: "LinkedIn", href: data.linkdin },
  { icon: Dribbble, label: "Website", href: data.dribbbleLink },
];

/* =============================================
   Footer Component (Top Brand+Social → Links Grid → Contact Band)
============================================= */
export default function Footer4Col() {
  return (
    <footer
      role="contentinfo"
      className="mt-16 w-full rounded-t-xl bg-gray-700 text-white"
    >
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-20">
        {/* Brand + Social Row (TOP) */}
        <div className="mb-12 flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-left">
            <Image
              src={logo}
              alt="Brihaspathi logo"
              width={128}
              height={40}
              className="h-10 w-auto"
              priority
            />
            {/* <div>
              <p className="font-semibold leading-tight">{data.company.name}</p>
              <p className="max-w-2xl text-sm text-white/80">
                {data.company.description}
              </p>
            </div> */}
          </div>

          {/* Social icons (lucide-react) */}
          <ul
            className="flex justify-center gap-3"
            aria-label="Follow Brihaspathi"
          >
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 transition hover:border-white/40 hover:bg-white/10"
                >
                  <Icon className="size-5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Grid (4 columns) */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: About + Careers */}
          <div className="space-y-8">
            <FooterGroup title="About Us" links={aboutLinks} />
            <FooterGroup title="Careers" links={careersLinks} />
          </div>

          {/* Col 2: Businesses + News */}
          <div className="space-y-8">
            <FooterGroup title="Our Businesses" links={businessLinks} />
            <FooterGroup title="News & Media" links={newsMediaLinks} />
          </div>

          {/* Col 3: Services */}
          <FooterGroup title="Our Services" links={servicesLinks} />

          {/* Col 4: Quick Links */}
          <FooterGroup title="Quick Links" links={quickLinks} />
        </div>

        {/* Contact Band (3-column layout fills the visual gap under Careers + News) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Phones & Email */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h3 className="mb-3 text-base font-semibold">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-5" />
                <span>
                  {data.contact.phone}
                  <br />
                  Toll-free: {data.contact.tollFree}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-5" />
                <span>{data.contact.email}</span>
              </li>
            </ul>
          </div>

          {/* Registered Office */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h3 className="mb-3 text-base font-semibold">Registered Office</h3>
            <p className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-5" />
              <address className="not-italic">
                {data.contact.addresses.registeredOffice}
              </address>
            </p>
          </div>

          {/* Corporate Office */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h3 className="mb-3 text-base font-semibold">Corporate Office</h3>
            <p className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-5" />
              <address className="not-italic">
                {data.contact.addresses.corporateOffice}
              </address>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/15 pt-6 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
          <p className="text-sm text-white/80">
            © {new Date().getFullYear()} {data.company.name}. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            {" "}
            <p className="mt-3 text-xs text-white/60 sm:mt-0 hover:text-blue-500">
              Privacy Policy
            </p>
            <p className="mt-3 text-xs text-white/60 sm:mt-0  hover:text-blue-500">
              Legal Notice
            </p>
            <p className="mt-3 text-xs text-white/60 sm:mt-0  hover:text-blue-500">
              Report Security Issue
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Small helper ---------- */
function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: { text: string; href: string; hasIndicator?: boolean }[];
}) {
  const id = `footer-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <nav aria-labelledby={id} className="text-center sm:text-left">
      <h3 id={id} className="text-lg font-medium">
        {title}
      </h3>
      <ul className="mt-6 space-y-3 text-sm">
        {links.map(({ text, href, hasIndicator }) => (
          <li key={`${title}-${text}`}>
            <Link
              href={href}
              className={
                hasIndicator
                  ? "group inline-flex items-center gap-2 text-white/80 transition hover:text-white"
                  : "text-white/80 transition hover:text-white"
              }
            >
              <span>{text}</span>
              {hasIndicator && (
                <span className="relative ml-1 inline-flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-white" />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
