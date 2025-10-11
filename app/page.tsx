// // app/page.tsx
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   motion,
//   AnimatePresence,
//   useScroll,
//   useTransform,
// } from "framer-motion";
// import {
//   ArrowRight,
//   CheckCircle,
//   Play,
//   Camera,
//   Sun,
//   Monitor,
//   Phone,
//   Mail,
//   MapPin,
//   Award,
//   Menu,
//   X,
//   Star,
//   Users,
//   Globe,
//   ChevronDown,
//   Building,
//   GraduationCap,
//   Heart,
//   ShoppingBag,
//   Briefcase,
//   MessageCircle,
//   FileText,
//   Settings,
//   Fingerprint,
//   Home as HomeIcon,
//   Mic,
//   Network,
//   UserCheck,
//   Search,
//   Building2,
//   Shield,
//   Zap,
//   Volume2,
//   Sparkles,
// } from "lucide-react";

// /* ----------------------- Minimal UI (inline) ----------------------- */
// type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
//   variant?: "default" | "outline";
//   size?: "md" | "lg";
// };
// const Button = ({
//   className = "",
//   variant = "default",
//   size = "md",
//   ...props
// }: ButtonProps) => (
//   <button
//     {...props}
//     className={[
//       "inline-flex items-center justify-center rounded-md font-medium transition-colors",
//       size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm",
//       variant === "outline"
//         ? "border border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
//         : "bg-blue-600 text-white hover:bg-blue-700",
//       className,
//     ].join(" ")}
//   />
// );

// const Card = ({
//   className = "",
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => (
//   <div
//     className={[
//       "rounded-2xl border border-gray-100 bg-white shadow-lg",
//       className,
//     ].join(" ")}
//   >
//     {children}
//   </div>
// );
// const CardContent = ({
//   className = "",
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => <div className={["p-6", className].join(" ")}>{children}</div>;
// const Badge = ({
//   className = "",
//   children,
//   variant,
// }: {
//   className?: string;
//   children: React.ReactNode;
//   variant?: "outline";
// }) => (
//   <span
//     className={[
//       "inline-flex items-center px-3 py-1 rounded-full text-sm",
//       variant === "outline"
//         ? "border border-blue-200 text-blue-600 bg-white/80"
//         : "bg-blue-600 text-white",
//       className,
//     ].join(" ")}
//   >
//     {children}
//   </span>
// );

// /* ----------------------- Inline utilities ----------------------- */
// const fadeInUp = {
//   initial: { opacity: 0, y: 60 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.6, ease: "easeOut" },
// };
// const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

// /* ----------------------- Small components (inline) ----------------------- */

// // Scroll progress bar at top
// function ScrollIndicator() {
//   const { scrollYProgress } = useScroll();
//   return (
//     <motion.div
//       style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
//       className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 z-[60]"
//     />
//   );
// }

// // Command-palette style search modal
// function SearchModal({
//   isOpen,
//   onClose,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   const [query, setQuery] = useState("");
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [onClose]);

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 z-[70] flex items-start justify-center p-4 sm:p-8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//         >
//           <div className="absolute inset-0 bg-black/40" onClick={onClose} />
//           <motion.div
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -20, opacity: 0 }}
//             className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
//           >
//             <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b">
//               <Search className="h-5 w-5 text-gray-500" />
//               <input
//                 autoFocus
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search pages, products, help… (Esc to close)"
//                 className="w-full outline-none placeholder:text-gray-400"
//               />
//               <Button
//                 variant="outline"
//                 onClick={onClose}
//                 className="hidden sm:flex"
//               >
//                 Close
//               </Button>
//             </div>
//             <div className="max-h-[50vh] overflow-y-auto p-4 sm:p-6">
//               {query ? (
//                 <p className="text-sm text-gray-600">
//                   No results for “{query}” — hook this up to your search.
//                 </p>
//               ) : (
//                 <div className="grid sm:grid-cols-2 gap-3 text-sm">
//                   {[
//                     "CCTV",
//                     "Biometric",
//                     "Solar",
//                     "Automation",
//                     "Networking",
//                     "Audio",
//                   ].map((s) => (
//                     <div
//                       key={s}
//                       className="rounded-lg border p-3 flex items-center justify-between"
//                     >
//                       <span>{s}</span>
//                       <ArrowRight className="h-4 w-4 text-gray-400" />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// // Mega menu panel
// function MegaMenu({ isOpen, category }: { isOpen: boolean; category: string }) {
//   const sections = [
//     {
//       title: "Featured",
//       links: ["CCTV Surveillance", "Biometric Access", "Home Automation"],
//     },
//     {
//       title: "Platforms",
//       links: ["Cloud & AI", "Networking & IT", "Audio Systems"],
//     },
//     { title: "Resources", links: ["Case Studies", "Whitepapers", "Demos"] },
//   ];
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 8 }}
//           className="absolute top-full left-0 w-[720px] bg-white rounded-2xl shadow-2xl p-6 grid grid-cols-3 gap-6 z-50"
//         >
//           {sections.map((sec) => (
//             <div key={sec.title}>
//               <div className="text-xs uppercase tracking-wide text-gray-500 mb-3">
//                 {sec.title}
//               </div>
//               <ul className="space-y-2">
//                 {sec.links.map((l) => (
//                   <li key={l}>
//                     <Link
//                       href={`/${category}/${l
//                         .toLowerCase()
//                         .replace(/\s+/g, "-")}`}
//                       className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50"
//                     >
//                       <span className="text-gray-800">{l}</span>
//                       <ArrowRight className="h-4 w-4 text-gray-400" />
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//           <div className="col-span-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100">
//             <div className="flex items-center gap-3 text-sm">
//               <Sparkles className="h-4 w-4 text-blue-600" />
//               <span>Tip: connect this menu to your CMS to auto-populate.</span>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// // Right-side hero visual
// function AnimatedHeroImage() {
//   return (
//     <div className="relative">
//       <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-blue-200/50 to-indigo-200/40 blur-3xl" />
//       <Card className="relative border-0 bg-white/80 backdrop-blur-md rounded-[3rem] overflow-hidden shadow-2xl">
//         <div className="relative aspect-[4/3]">
//           <Image
//             src="/images/CCTV Surveillance 1.jpg"
//             alt="Hero"
//             fill
//             className="object-cover"
//             priority
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
//           <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
//             {[
//               { icon: Shield, label: "Security" },
//               { icon: HomeIcon, label: "Automation" },
//               { icon: Network, label: "Networking" },
//             ].map(({ icon: Icon, label }) => (
//               <div
//                 key={label}
//                 className="rounded-xl bg-white/90 backdrop-blur p-3 shadow flex items-center gap-2"
//               >
//                 <Icon className="h-5 w-5 text-blue-600" />
//                 <span className="text-sm font-medium">{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }

// /* ----------------------- Data (as in your file) ----------------------- */
// const menuItems = [
//   { name: "home", label: "Home", href: "/" },
//   { name: "about", label: "About Us", href: "/about" },
//   {
//     name: "products",
//     label: "Solutions",
//     href: "/products",
//     hasMegaMenu: true,
//   },
//   { name: "services", label: "Services", href: "/services", hasMegaMenu: true },
//   {
//     name: "industries",
//     label: "Industries",
//     href: "/industries",
//     submenu: [
//       { label: "Education", href: "/industries/education" },
//       { label: "Healthcare", href: "/industries/healthcare" },
//       { label: "Government", href: "/industries/government" },
//       { label: "Retail", href: "/industries/retail" },
//       { label: "Corporate", href: "/industries/corporate" },
//     ],
//   },
//   { name: "case-studies", label: "Case Studies", href: "/case-studies" },
//   { name: "contact", label: "Contact", href: "/contact" },
// ];

// const statsTop = [
//   { number: "2500+", label: "Projects Completed", icon: Award },
//   { number: "98%", label: "Client Satisfaction", icon: Star },
//   { number: "15+", label: "Years Experience", icon: Users },
//   { number: "24/7", label: "Support Available", icon: Globe },
// ];

// const industries = [
//   {
//     icon: GraduationCap,
//     title: "Education",
//     description:
//       "Comprehensive security and automation solutions for schools, colleges, and universities.",
//     projects: "150+ Projects",
//     gradientBox: "from-blue-600 to-indigo-600",
//     gradientBadge: "from-blue-100 to-indigo-100 text-blue-700",
//   },
//   {
//     icon: Heart,
//     title: "Healthcare",
//     description:
//       "Specialized solutions for hospitals, clinics, and healthcare facilities with compliance focus.",
//     projects: "80+ Projects",
//     gradientBox: "from-red-600 to-pink-600",
//     gradientBadge: "from-red-100 to-pink-100 text-pink-700",
//   },
//   {
//     icon: Building,
//     title: "Government",
//     description:
//       "High-security solutions for government buildings, offices, and public infrastructure.",
//     projects: "120+ Projects",
//     gradientBox: "from-green-600 to-emerald-600",
//     gradientBadge: "from-green-100 to-emerald-100 text-emerald-700",
//   },
//   {
//     icon: ShoppingBag,
//     title: "Retail",
//     description:
//       "Loss prevention, customer analytics, and automation solutions for retail environments.",
//     projects: "200+ Projects",
//     gradientBox: "from-purple-600 to-indigo-600",
//     gradientBadge: "from-purple-100 to-indigo-100 text-indigo-700",
//   },
//   {
//     icon: Briefcase,
//     title: "Corporate Offices",
//     description:
//       "Complete office automation, security, and IT infrastructure for corporate environments.",
//     projects: "300+ Projects",
//     gradientBox: "from-orange-600 to-yellow-600",
//     gradientBadge: "from-orange-100 to-yellow-100 text-yellow-700",
//   },
// ];

// const testimonials = [
//   {
//     name: "Rajesh Kumar",
//     position: "CEO, TechCorp Industries",
//     company: "Manufacturing",
//     rating: 5,
//     text: "Brihaspathi transformed our entire security infrastructure with their advanced CCTV systems. The AI-powered analytics have significantly improved our facility monitoring. Exceptional service and support!",
//     image: "/placeholder.svg?height=80&width=80&text=RK",
//     service: "CCTV Surveillance",
//   },
//   {
//     name: "Priya Sharma",
//     position: "Operations Manager",
//     company: "Green Energy Solutions",
//     rating: 5,
//     text: "The solar installation by Brihaspathi exceeded our expectations. Our energy costs have reduced by 70% and the smart monitoring system provides real-time insights. Highly recommended!",
//     image: "/placeholder.svg?height=80&width=80&text=PS",
//     service: "Solar Power Solutions",
//   },
//   {
//     name: "Dr. Amit Patel",
//     position: "Hospital Administrator",
//     company: "City General Hospital",
//     rating: 5,
//     text: "Their biometric access control system has enhanced our security significantly. The integration with our existing systems was seamless and the support team is outstanding!",
//     image: "/placeholder.svg?height=80&width=80&text=AP",
//     service: "Biometric & Access Control",
//   },
//   {
//     name: "Suresh Reddy",
//     position: "IT Director",
//     company: "Financial Services Ltd",
//     rating: 5,
//     text: "Brihaspathi's networking solutions are top-notch. Their structured cabling and WiFi implementation has improved our connectivity and productivity significantly. Professional team!",
//     image: "/placeholder.svg?height=80&width=80&text=SR",
//     service: "Networking & IT",
//   },
//   {
//     name: "Meera Joshi",
//     position: "Principal",
//     company: "Modern Public School",
//     rating: 5,
//     text: "The complete security and automation solution for our school has been excellent. Parents feel more secure and the management systems have streamlined our operations.",
//     image: "/placeholder.svg?height=80&width=80&text=MJ",
//     service: "Education Solutions",
//   },
//   {
//     name: "Vikram Singh",
//     position: "Facility Manager",
//     company: "Corporate Plaza",
//     rating: 5,
//     text: "Their visitor management system and home automation solutions have modernized our building. The integration is seamless and the user experience is fantastic!",
//     image: "/placeholder.svg?height=80&width=80&text=VS",
//     service: "Building Automation",
//   },
// ];

// const solutions = [
//   {
//     icon: Shield,
//     title: "CCTV Surveillance",
//     subtitle: "Advanced Security Monitoring",
//     description:
//       "AI-powered surveillance systems with 4K resolution, night vision, and intelligent analytics for comprehensive security coverage.",
//     features: [
//       "4K Ultra HD",
//       "AI Analytics",
//       "24/7 Monitoring",
//       "Mobile Access",
//     ],
//     image: "/images/CCTV Surveillance 1.jpg",
//     color: "from-blue-500 to-cyan-500",
//     bgColor: "from-blue-50 to-cyan-50",
//     popular: true,
//   },
//   {
//     icon: Users,
//     title: "Biometric Access Control",
//     subtitle: "Secure Identity Management",
//     description:
//       "Multi-modal biometric systems combining fingerprint, facial recognition, and card-based access for maximum security.",
//     features: [
//       "Face Recognition",
//       "Fingerprint",
//       "Card Access",
//       "Time Tracking",
//     ],
//     image: "/images/Biometric Access Control 2.jpg",
//     color: "from-purple-500 to-pink-500",
//     bgColor: "from-purple-50 to-pink-50",
//   },
//   {
//     icon: HomeIcon,
//     title: "Smart Home Automation",
//     subtitle: "Intelligent Living Solutions",
//     description:
//       "Complete home automation with voice control, mobile apps, and energy-efficient smart devices for modern living.",
//     features: [
//       "Voice Control",
//       "Smart Lighting",
//       "Climate Control",
//       "Energy Saving",
//     ],
//     image: "/images/Smart Home Automation 2.jpg",
//     color: "from-green-500 to-teal-500",
//     bgColor: "from-green-50 to-teal-50",
//   },
//   {
//     icon: Zap,
//     title: "Solar Power Systems",
//     subtitle: "Sustainable Energy Solutions",
//     description:
//       "High-efficiency solar installations with smart grid integration and battery storage for sustainable energy independence.",
//     features: [
//       "Grid Integration",
//       "Battery Storage",
//       "Smart Monitoring",
//       "ROI Tracking",
//     ],
//     image: "/images/solar 1.jpg",
//     color: "from-yellow-500 to-orange-500",
//     bgColor: "from-yellow-50 to-orange-50",
//   },
//   {
//     icon: Network,
//     title: "IT Infrastructure",
//     subtitle: "Enterprise Networking",
//     description:
//       "Robust networking solutions with fiber optic cabling, wireless systems, and cloud integration for seamless connectivity.",
//     features: ["Fiber Optic", "WiFi 6", "Cloud Integration", "24/7 Support"],
//     image: "/images/IT Infrastructure 1.jpg",
//     color: "from-indigo-500 to-purple-500",
//     bgColor: "from-indigo-50 to-purple-50",
//   },
//   {
//     icon: Volume2,
//     title: "PA & Audio Systems",
//     subtitle: "Professional Communication",
//     description:
//       "Crystal-clear audio systems for offices, schools, and public spaces with zone control and emergency broadcasting.",
//     features: [
//       "Zone Control",
//       "Emergency Alerts",
//       "Background Music",
//       "Remote Management",
//     ],
//     image: "/images/PA & Audio Systems 1.jpg",
//     color: "from-red-500 to-pink-500",
//     bgColor: "from-red-50 to-pink-50",
//   },
// ];

// /* ----------------------- Page ----------------------- */
// export default function Page() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState("home");
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const [scrolled, setScrolled] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);

//   const { scrollYProgress } = useScroll();
//   const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]); // (kept for parity)

//   useEffect(() => setIsVisible(true), []);
//   useEffect(() => {
//     const handleScroll = () => {
//       const sections = [
//         "home",
//         "products",
//         "about",
//         "solutions",
//         "testimonials",
//       ];
//       const scrollPosition = window.scrollY + 100;
//       setScrolled(scrollPosition > 50);
//       for (const section of sections) {
//         const el = document.getElementById(section);
//         if (el) {
//           const top = el.offsetTop,
//             h = el.offsetHeight;
//           if (scrollPosition >= top && scrollPosition < top + h) {
//             setActiveSection(section);
//             break;
//           }
//         }
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if ((e.metaKey || e.ctrlKey) && e.key === "k") {
//         e.preventDefault();
//         setIsSearchOpen(true);
//       }
//       if (e.key === "Escape") {
//         setIsSearchOpen(false);
//         setActiveDropdown(null);
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   return (
//     <div className="min-h-screen bg-white overflow-x-hidden">
//       <ScrollIndicator />
//       <SearchModal
//         isOpen={isSearchOpen}
//         onClose={() => setIsSearchOpen(false)}
//       />

//       {/* Nav */}
//       <motion.nav
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         className={`fixed top-0 w-full z-40 transition-all duration-300 ${
//           scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg" : "bg-transparent"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-20">
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="flex items-center"
//             >
//               <Link href="/" className="flex items-center">
//                 <Image
//                   src="/brihaspathi-logo.png"
//                   alt="Brihaspathi"
//                   width={220}
//                   height={50}
//                   className="h-10 w-auto"
//                 />
//               </Link>
//             </motion.div>

//             <div className="hidden xl:flex items-center space-x-1">
//               {menuItems.map((item) => (
//                 <div
//                   key={item.name}
//                   className="relative"
//                   onMouseEnter={() =>
//                     (item.submenu || item.hasMegaMenu) &&
//                     setActiveDropdown(item.name)
//                   }
//                   onMouseLeave={() => setActiveDropdown(null)}
//                 >
//                   <Link
//                     href={item.href}
//                     className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${
//                       activeSection === item.name
//                         ? "text-blue-600"
//                         : "text-gray-700 hover:text-blue-600"
//                     }`}
//                   >
//                     <span>{item.label}</span>
//                     {(item.submenu || item.hasMegaMenu) && (
//                       <ChevronDown
//                         className={`h-3 w-3 ml-1 transition-transform duration-300 ${
//                           activeDropdown === item.name ? "rotate-180" : ""
//                         }`}
//                       />
//                     )}
//                     {activeSection === item.name && (
//                       <motion.div
//                         layoutId="activeIndicator"
//                         className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
//                         transition={{
//                           type: "spring",
//                           bounce: 0.2,
//                           duration: 0.6,
//                         }}
//                       />
//                     )}
//                   </Link>

//                   {item.hasMegaMenu && (
//                     <MegaMenu
//                       isOpen={activeDropdown === item.name}
//                       category={item.name}
//                     />
//                   )}

//                   <AnimatePresence>
//                     {item.submenu && activeDropdown === item.name && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 10 }}
//                         transition={{ duration: 0.2 }}
//                         className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg py-2 z-50"
//                       >
//                         {item.submenu.map((sub, i) => (
//                           <motion.div
//                             key={sub.label}
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: i * 0.05 }}
//                           >
//                             <Link
//                               href={sub.href}
//                               className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//                             >
//                               {sub.label}
//                             </Link>
//                           </motion.div>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ))}
//             </div>

//             <div className="hidden xl:flex items-center space-x-3">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setIsSearchOpen(true)}
//                 className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <Search className="h-5 w-5" />
//               </motion.button>
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Button className="font-medium px-6 py-2 rounded-md">
//                   <MessageCircle className="h-4 w-4 mr-2" />
//                   Get Quote
//                 </Button>
//               </motion.div>
//             </div>

//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               className="xl:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200"
//               onClick={() => setIsMenuOpen((s) => !s)}
//             >
//               {isMenuOpen ? (
//                 <X className="h-6 w-6" />
//               ) : (
//                 <Menu className="h-6 w-6" />
//               )}
//             </motion.button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         <AnimatePresence>
//           {isMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="xl:hidden bg-white border-t border-gray-100 shadow-lg"
//             >
//               <div className="px-4 py-6 space-y-2 max-h-[80vh] overflow-y-auto">
//                 {menuItems.map((item, index) => (
//                   <motion.div
//                     key={item.name}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                   >
//                     <Link
//                       href={item.href}
//                       className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span>{item.label}</span>
//                         {(item.submenu || item.hasMegaMenu) && (
//                           <ChevronDown className="h-4 w-4" />
//                         )}
//                       </div>
//                     </Link>
//                     {item.submenu && (
//                       <div className="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-gray-100">
//                         {item.submenu.map((sub, i) => (
//                           <Link
//                             key={i}
//                             href={sub.href}
//                             className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
//                             onClick={() => setIsMenuOpen(false)}
//                           >
//                             {sub.label}
//                           </Link>
//                         ))}
//                       </div>
//                     )}
//                   </motion.div>
//                 ))}
//                 <div className="pt-4 border-t border-gray-200 space-y-3">
//                   <Button
//                     onClick={() => setIsSearchOpen(true)}
//                     variant="outline"
//                     className="w-full justify-start"
//                   >
//                     <Search className="h-4 w-4 mr-2" /> Search
//                   </Button>
//                   <Button className="w-full">
//                     <MessageCircle className="h-4 w-4 mr-2" /> Get Quote
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.nav>

//       {/* Hero */}
//       <section
//         id="home"
//         className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden"
//       >
//         {/* background pattern */}
//         <div className="absolute inset-0">
//           <div
//             className="absolute inset-0 opacity-[0.08]"
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle at 1px 1px, #1f2937 1px, transparent 0)",
//               backgroundSize: "24px 24px",
//             }}
//           />
//           <motion.div
//             animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
//             transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
//             className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"
//           />
//           <motion.div
//             animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
//             transition={{
//               duration: 15,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: 2,
//             }}
//             className="absolute -bottom-40 -left-20 w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-20"
//           />
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             {/* Left */}
//             <div
//               className={`space-y-8 ${
//                 isVisible ? "animate-slide-in-left" : ""
//               }`}
//             >
//               <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
//                 <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2" />
//                 Complete Technology Solutions Provider
//               </div>

//               <div className="space-y-4">
//                 <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
//                   Securing &<br />
//                   <span className="text-blue-600">Automating</span>
//                   <br />
//                   Your Future
//                 </h1>
//               </div>

//               <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
//                 From advanced CCTV surveillance to smart home automation, solar
//                 power solutions to complete IT infrastructure — we deliver
//                 cutting-edge technology that transforms businesses and secures
//                 your future.
//               </p>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Button
//                   size="lg"
//                   className="rounded-md flex items-center gap-2 group"
//                 >
//                   Explore Solutions
//                   <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="rounded-md flex items-center gap-2"
//                 >
//                   <Play className="h-5 w-5" />
//                   Watch Demo
//                 </Button>
//               </div>

//               <div className="grid grid-cols-4 gap-6 pt-2">
//                 {statsTop.map((stat, i) => (
//                   <div key={i} className="text-center">
//                     <div className="text-3xl font-bold text-blue-600">
//                       {stat.number}
//                     </div>
//                     <div className="text-sm text-gray-600">{stat.label}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className={`relative hidden lg:block ${
//                 isVisible ? "animate-slide-in-right" : ""
//               }`}
//             >
//               <AnimatedHeroImage />
//             </motion.div>
//           </div>
//         </div>

//         {/* scroll hint */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 2 }}
//           className="absolute bottom-8 left-1/2 -translate-x-1/2"
//         >
//           <motion.div
//             animate={{ y: [0, 10, 0] }}
//             transition={{ duration: 2, repeat: Infinity }}
//             className="flex flex-col items-center text-gray-400"
//           >
//             <span className="text-sm mb-2">Scroll to explore</span>
//             <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
//               <motion.div
//                 animate={{ y: [0, 12, 0] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//                 className="w-1 h-3 bg-gray-400 rounded-full mt-2"
//               />
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* wave divider */}
//         <div className="absolute bottom-0 left-0 right-0">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 1440 120"
//             className="w-full h-auto"
//           >
//             <path
//               fill="#ffffff"
//               d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
//             />
//           </svg>
//         </div>
//       </section>

//       {/* Solutions */}
//       <section
//         id="solutions"
//         className="py-20 bg-white relative overflow-hidden"
//       >
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-600/5 rounded-full blur-3xl" />
//           <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-600/5 rounded-full blur-3xl" />
//         </div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="text-center space-y-6 mb-16">
//             <Badge
//               variant="outline"
//               className="text-blue-600 border-blue-200 bg-white/80 backdrop-blur-sm rounded-full"
//             >
//               <Star className="w-3 h-3 mr-1" /> Our Expertise
//             </Badge>
//             <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
//               Technology Solutions That Transform
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Discover our comprehensive range designed to secure, automate, and
//               optimize your operations.
//             </p>
//           </div>

//           <div className="space-y-24">
//             {solutions.map((solution, index) => (
//               <div
//                 key={solution.title}
//                 className={`grid lg:grid-cols-2 gap-16 items-center ${
//                   index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
//                 }`}
//               >
//                 {/* Content */}
//                 <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
//                   <div className="space-y-6">
//                     {solution.popular && (
//                       <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 rounded-full">
//                         <Star className="w-3 h-3 mr-1" /> Most Popular
//                       </Badge>
//                     )}

//                     <div
//                       className={`inline-flex p-4 rounded-3xl bg-gradient-to-br ${solution.bgColor}`}
//                     >
//                       <div
//                         className={`w-16 h-16 bg-gradient-to-br ${solution.color} rounded-2xl flex items-center justify-center shadow-lg`}
//                       >
//                         <solution.icon className="h-8 w-8 text-white" />
//                       </div>
//                     </div>

//                     <div className="space-y-3">
//                       <p
//                         className={`text-sm font-medium bg-gradient-to-r ${solution.color} bg-clip-text text-transparent`}
//                       >
//                         {solution.subtitle}
//                       </p>
//                       <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
//                         {solution.title}
//                       </h3>
//                       <p className="text-lg text-gray-600">
//                         {solution.description}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       {solution.features.map((f) => (
//                         <div key={f} className="flex items-center space-x-3">
//                           <div
//                             className={`w-2 h-2 rounded-full bg-gradient-to-r ${solution.color}`}
//                           />
//                           <span className="text-gray-700 font-medium">{f}</span>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-4 pt-4">
//                       <Button
//                         size="lg"
//                         className={`bg-gradient-to-r ${solution.color} text-white border-0 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105`}
//                       >
//                         Learn More <ArrowRight className="ml-2 h-4 w-4" />
//                       </Button>
//                       <Button
//                         size="lg"
//                         variant="outline"
//                         className="border-2 border-gray-200 hover:border-gray-300 bg-transparent rounded-full hover:bg-gray-50 transition-all duration-300"
//                       >
//                         <Play className="mr-2 h-4 w-4" /> Watch Demo
//                       </Button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Image */}
//                 <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
//                   <div className="relative group">
//                     <div
//                       className={`absolute inset-0 bg-gradient-to-br ${solution.bgColor} rounded-[3rem] rotate-6 group-hover:rotate-3 transition-transform duration-500`}
//                     />
//                     <div
//                       className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-10 rounded-[3rem] -rotate-6 group-hover:-rotate-3 transition-transform duration-500`}
//                     />
//                     <Card className="relative border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-[3rem] overflow-hidden group-hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
//                       <div className="aspect-[4/3] relative">
//                         <Image
//                           src={solution.image}
//                           alt={solution.title}
//                           fill
//                           className="object-cover transition-transform duration-700 group-hover:scale-110"
//                           sizes="(max-width: 1024px) 100vw, 50vw"
//                           priority={index < 2}
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                       </div>
//                       <div className="absolute top-6 right-6">
//                         <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
//                           <div className="text-center">
//                             <div
//                               className={`text-2xl font-bold bg-gradient-to-r ${solution.color} bg-clip-text text-transparent`}
//                             >
//                               99%
//                             </div>
//                             <div className="text-xs text-gray-600">Uptime</div>
//                           </div>
//                         </div>
//                       </div>
//                     </Card>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Bottom CTA */}
//           <div className="text-center mt-24">
//             <div className="relative inline-block">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-[4rem] blur-xl" />
//               <Card className="relative border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-[4rem] overflow-hidden">
//                 <CardContent className="p-10 md:p-12">
//                   <div className="space-y-6">
//                     <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
//                       <Sparkles className="h-10 w-10 text-white" />
//                     </div>
//                     <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
//                       Need a Custom Solution?
//                     </h3>
//                     <p className="text-gray-600 max-w-xl mx-auto">
//                       Our experts will tailor a solution that fits your unique
//                       requirements and goals.
//                     </p>
//                     <Button
//                       className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-8"
//                       size="lg"
//                     >
//                       Discuss Your Requirements{" "}
//                       <ArrowRight className="ml-2 h-4 w-4" />
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>

//         {/* curve to next section */}
//         <div className="absolute bottom-0 left-0 w-full overflow-hidden">
//           <svg
//             className="relative block w-full h-20"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 1200 120"
//             preserveAspectRatio="none"
//           >
//             <path
//               d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
//               opacity=".25"
//               className="fill-gray-50"
//             />
//             <path
//               d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
//               opacity=".5"
//               className="fill-gray-50"
//             />
//             <path
//               d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
//               className="fill-gray-50"
//             />
//           </svg>
//         </div>
//       </section>

//       {/* Industries */}
//       <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div {...fadeInUp} className="text-center space-y-4 mb-16">
//             <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//               Industries We Serve
//             </Badge>
//             <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
//               Trusted Across Industries
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               We deliver solutions across diverse industries, meeting unique
//               requirements and compliance needs.
//             </p>
//           </motion.div>

//           <motion.div
//             variants={staggerContainer}
//             initial="initial"
//             whileInView="animate"
//             viewport={{ once: true }}
//             className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
//           >
//             {industries.map((industry) => (
//               <motion.div
//                 key={industry.title}
//                 variants={fadeInUp}
//                 whileHover={{ y: -10, scale: 1.05 }}
//               >
//                 <Card className="group h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
//                   <CardContent className="p-6 text-center">
//                     <div className="space-y-4">
//                       <div
//                         className={`w-16 h-16 bg-gradient-to-r ${industry.gradientBox} rounded-3xl flex items-center justify-center shadow-lg mx-auto`}
//                       >
//                         <industry.icon className="h-8 w-8 text-white" />
//                       </div>
//                       <div className="space-y-2">
//                         <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
//                           {industry.title}
//                         </h3>
//                         <p className="text-gray-600 text-sm leading-relaxed">
//                           {industry.description}
//                         </p>
//                       </div>
//                       <div className="pt-2">
//                         <Badge
//                           className={`bg-gradient-to-r ${industry.gradientBadge} text-xs`}
//                         >
//                           {industry.projects}
//                         </Badge>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section id="testimonials" className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div {...fadeInUp} className="text-center space-y-4 mb-16">
//             <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//               Client Testimonials
//             </Badge>
//             <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
//               What Our Clients Say
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Don’t just take our word for it — here’s what our clients say
//               about our products and services.
//             </p>
//           </motion.div>

//           <motion.div
//             variants={staggerContainer}
//             initial="initial"
//             whileInView="animate"
//             viewport={{ once: true }}
//             className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
//           >
//             {testimonials.map((t) => (
//               <motion.div
//                 key={t.name}
//                 variants={fadeInUp}
//                 whileHover={{ y: -10, scale: 1.02 }}
//               >
//                 <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white">
//                   <CardContent className="p-8">
//                     <div className="space-y-6">
//                       <div className="flex space-x-1">
//                         {[...Array(t.rating)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className="h-5 w-5 fill-yellow-400 text-yellow-400"
//                           />
//                         ))}
//                       </div>
//                       <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs">
//                         {t.service}
//                       </Badge>
//                       <blockquote className="text-gray-700 leading-relaxed italic">
//                         “{t.text}”
//                       </blockquote>
//                       <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
//                         <Image
//                           src={t.image}
//                           alt={t.name}
//                           width={48}
//                           height={48}
//                           className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
//                         />
//                         <div>
//                           <div className="font-semibold text-gray-900">
//                             {t.name}
//                           </div>
//                           <div className="text-sm text-gray-600">
//                             {t.position}
//                           </div>
//                           <div className="text-xs text-blue-600 font-medium">
//                             {t.company}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* Gradient CTA */}
//       <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
//         <motion.div
//           animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
//           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//           className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
//         />
//         <motion.div
//           animate={{ scale: [1, 1.3, 1], rotate: [360, 180, 0] }}
//           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//           className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
//         />
//         <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="space-y-8">
//             <h2 className="text-3xl md:text-5xl font-bold text-white">
//               Ready to Secure Your Future?
//             </h2>
//             <p className="text-xl text-blue-100 max-w-2xl mx-auto">
//               Join thousands of satisfied clients who’ve transformed their
//               security and automation with our solutions.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/contact">
//                 <Button
//                   size="lg"
//                   className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold rounded-md"
//                 >
//                   Get Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </Link>
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 bg-transparent font-semibold rounded-md"
//               >
//                 <Phone className="mr-2 h-5 w-5" /> Call: +91 90634 70190
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-4 gap-8">
//             <div className="space-y-4">
//               <Image
//                 src="/brihaspathi-logo.png"
//                 alt="Brihaspathi"
//                 width={200}
//                 height={45}
//                 className="h-10 w-auto brightness-0 invert"
//               />
//               <p className="text-gray-400 leading-relaxed">
//                 Leading technology solutions provider delivering world-class
//                 security, automation, and IT solutions across industries.
//               </p>
//               <div className="flex space-x-4">
//                 {["f", "in", "tw"].map((social) => (
//                   <div
//                     key={social}
//                     className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition"
//                   >
//                     <span className="text-xs font-bold">{social}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {[
//               {
//                 title: "Products & Solutions",
//                 links: [
//                   {
//                     href: "/products/cctv-surveillance",
//                     label: "CCTV Surveillance",
//                   },
//                   {
//                     href: "/products/biometric-access-control",
//                     label: "Biometric & Access Control",
//                   },
//                   {
//                     href: "/products/solar-power",
//                     label: "Solar Power Solutions",
//                   },
//                   {
//                     href: "/products/home-automation",
//                     label: "Home Automation",
//                   },
//                   { href: "/products/networking-it", label: "Networking & IT" },
//                 ],
//               },
//               {
//                 title: "Services",
//                 links: [
//                   { href: "/services/amc", label: "AMC & Support" },
//                   {
//                     href: "/services/installation",
//                     label: "Installation Services",
//                   },
//                   {
//                     href: "/services/software-development",
//                     label: "Software Development",
//                   },
//                   { href: "/services/cloud-ai", label: "Cloud & AI Solutions" },
//                   { href: "/services/consultation", label: "Consultation" },
//                 ],
//               },
//               {
//                 title: "Company",
//                 links: [
//                   { icon: Phone, text: "+91 90634 70190" },
//                   { icon: Mail, text: "info@brihaspathi.com" },
//                   { icon: MapPin, text: "Your Business Address" },
//                   { icon: FileText, text: "Privacy Policy" },
//                   { icon: Settings, text: "Terms & Conditions" },
//                 ],
//               },
//             ].map((section) => (
//               <div key={section.title} className="space-y-4">
//                 <h4 className="text-lg font-bold">{section.title}</h4>
//                 <ul className="space-y-2">
//                   {section.links.map((link: any, i: number) => (
//                     <li key={i}>
//                       {"href" in link ? (
//                         <Link
//                           href={link.href}
//                           className="text-gray-400 hover:text-white transition-colors"
//                         >
//                           {link.label}
//                         </Link>
//                       ) : (
//                         <div className="flex items-center text-gray-400">
//                           <link.icon className="h-4 w-4 mr-2" />
//                           {link.text}
//                         </div>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>

//           <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
//             <p>
//               &copy; 2025 Brihaspathi. All rights reserved. | Securing &
//               Automating Your Future
//             </p>
//           </div>
//         </div>
//       </footer>

//       {/* Scroll to top */}
//       <motion.button
//         initial={{ opacity: 0, scale: 0 }}
//         animate={{
//           opacity: scrollYProgress.get() > 0.2 ? 1 : 0,
//           scale: scrollYProgress.get() > 0.2 ? 1 : 0,
//         }}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//         className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg z-50"
//       >
//         <ChevronDown className="h-6 w-6 rotate-180" />
//       </motion.button>

//       {/* Live Chat */}
//       <motion.button
//         initial={{ opacity: 0, scale: 0 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ delay: 2 }}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         className="fixed bottom-8 left-8 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg z-50"
//       >
//         <MessageCircle className="h-6 w-6" />
//       </motion.button>
//     </div>
//   );
// }

// /* ----------------------- Tiny keyframe helpers ----------------------- */
// /* Add these classes in your globals.css if you want the slide-in effects:
// @keyframes slide-in-left { from { opacity:0; transform: translateX(-30px)} to {opacity:1; transform:none}}
// @keyframes slide-in-right{ from { opacity:0; transform: translateX(30px)}  to {opacity:1; transform:none}}
// .animate-slide-in-left{ animation: slide-in-left .6s ease-out both}
// .animate-slide-in-right{animation: slide-in-right .6s ease-out both}
// */
"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import Preloader from "@/components/ui/preloader";
// import CertificationsGallery, { certifications } from "@/components/ui/CertificationsGallery";
// Keep your exact imports as requested:
import HeroSection from "../components/Herosection";
import SolutionsSection from "@/components/SolutionsSection";
import Weserve from "@/components/Weserve";
import TestimonialsCarousel from "@/components/Testimonials";
import ChatPanel from "@/components/ChatPanel";
// import { StickyFooter } from "@/components/ui/Footers";
import WhyChooseBrihaspathi from "@/components/WhyChooseBrihaspathi";
import Featured_05 from "@/components/Globe-feature-section";
import { ClientPageRoot } from "next/dist/client/components/client-page";
import ClientsPage from "@/components/Client";
import ClientsRibbon from "@/components/Client";
import { News_Cycle } from "next/font/google";
// import Updates from "@/components/updates-with-gallery";

import CertificationsGrid from "@/components/CertificationsGrid";
import OrgTreeInteractive from "@/components/OrgTreeInteractive";

// import CatalogFamiliesPublicAxios from "@/components/CatalogFamiliesPublicAxios";
// import CatalogItemsManager from "@/components/CatalogItemsManager";
// import CatalogTypesManager from "@/components/CatalogTypesManager";
// import CatalogAdminForm from "@/components/CatalogAdminForm";
// import { NewsPressList, NEWS_PRESS_DATA } from "@/components/NewsPressList";
export default function DemoPage() {
  const [showPreloader, setShowPreloader] = useState(true);

  const handleComplete = useCallback(() => setShowPreloader(false), []);
  const handleReplay = useCallback(() => setShowPreloader(true), []);
  // const items = [...NEWS_PRESS_DATA]
  //   .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
  //   .slice(0, 6);
  return (
    <>
      {showPreloader && <Preloader onComplete={handleComplete} />}

      {/* Main content shows underneath; preloader overlays it */}
      <div className={showPreloader ? "pointer-events-none select-none" : ""}>
        <main id="main">
          <div className="relative">
            <HeroSection />

            {/* Pull Solutions up over the bottom of Hero */}
            <section className="-mt-24 relative z-20 md:-mt-32">
              <div>
                <div>
                  <SolutionsSection />
                  <TestimonialsCarousel />
                </div>
              </div>
            </section>
          </div>

          {/* {!showPreloader && (
            // <div className="flex w-full items-center justify-center py-8">
            //   <motion.button
            //     onClick={handleReplay}
            //     whileTap={{ scale: 0.96 }}
            //     whileHover={{ scale: 1.03 }}
            //     className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-base font-medium text-white shadow-md transition-colors hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            //   >
            //     Replay Preloader
            //   </motion.button>
            // </div>
          )} */}
        </main>
        {/* <Featured_05 /> */}
        <WhyChooseBrihaspathi />
        {/* <Weserve /> */}
        <ChatPanel />
        {/* <CatalogFamiliesPublicAxios />
        <CatalogItemsManager />
        <CatalogTypesManager /> */}
        <Featured_05 />
        <ClientsRibbon brandHex="#07518a" />
        {/* <div
          className="relative w-full overflow-hidden rounded-2xl"
          style={{
            // 16:9 responsive box (modern browsers)
            aspectRatio: "16 / 9",
            // Optional max width, center it
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <iframe
            src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7363153570633801732?compact=1&autoplay=1"
            title="LinkedIn post"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            // Fill the box; no scrollbars
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
              display: "block",
            }}
          />
        </div> */}
        {/* <Updates /> */}

        <div className="p-6  content-center">
          {" "}
          <h2 className="mb-4 text-lg font-semibold text-center">
            Certifications & Empanelments
          </h2>
          <CertificationsGrid
            marquee
            rows={2}
            pps={60}
            sizePx={80}
            gapPx={40}
          />
        </div>
      </div>
    </>
  );
}
