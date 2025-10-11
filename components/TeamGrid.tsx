// app/components/LeadershipTeamWithPreview.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Row, Col, Image, Typography, Tag, Space } from "antd";
import { Linkedin, Users, MapPin } from "lucide-react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";

const { Title, Paragraph, Text } = Typography;

const LinkedIn = "/social.png";

/** Brand + sizing */
const BRAND = "#07518a";
const IMAGE_HEIGHT = 300; // image height
const PANEL_HEIGHT = 400; // details panel height
const CARD_RADIUS = 12;
const CARD_SHADOW = "0 8px 24px rgba(0,0,0,0.06)";
const GRID_GUTTER: [number, number] = [32, 40]; // [horizontal, vertical] gap

/* =========================
   Types
========================= */
export type Person = {
  id: number;
  name: string;
  designation: string;
  department?: string;
  location?: string;
  bio?: string;
  photo?: string; // optional; uses initials avatar if missing
  linkedin?: string;
};

export type OrgGroup = {
  id: string;
  title: string;
  people: Person[];
};

/* helper: fallback avatar (SVG) generated from initials */
export const initialsAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name
  )}&backgroundType=gradientLinear&fontFamily=Arial&fontWeight=700`;

/* =========================
   Data
========================= */
export const ORG_GROUPS: OrgGroup[] = [
  // {
  //   id: "top-management",
  //   title: "Board of Directors",
  //   people: [
  //     {
  //       id: 1,
  //       name: "Rajasekhar Papolu",
  //       designation: "Management",
  //       bio: "With a Computer Science Engineering background and 18 years’ experience, Managing Director Rajasekhar Papolu drives vision and growth. He integrates AI, advances software development, strengthening presence in India. His sales-and-services expands opportunities in software and security systems. Skilled in sales, business development, and project management, he champions innovation and excellence.",
  //       linkedin: "https://www.linkedin.com/in/rajas2121/",
  //       photo: "/team/MD'S Corporate Head shot..png",
  //     },
  //     {
  //       id: 2,
  //       name: "Hymavathi Papolu",
  //       bio: "Hymavathi Papolu, Director of Administration, is a seasoned leader in organizational management. She blends expertise in accounting, finance, and operations to streamline processes and boost efficiency. By applying strategic financial practices and disciplined resource management, she ensures smooth Finance and Accounts performance, driving operational excellence, accountability, and sustainable, ongoing growth.",

  //       designation: "Director – Administration",
  //       linkedin: "https://www.linkedin.com/in/hyma-p-464b65145/",
  //       photo: "/team/HYMAVATHI.jpg",
  //     },
  //     {
  //       id: 3,
  //       name: "Murali Krishna Arasala",
  //       bio: "Since 2009, Murali Krishna has leveraged his MCA to excel as Chief Administration Officer, orchestrating daily operations and cross-department coordination. He oversees facilities, resources, and compliance, and leads tendering, documentation, and bid management across e-procurement platforms. Meticulous with Tender/RFP/EOI norms and tools like Tender Tiger, he drives reliable, efficient execution.",
  //       designation: "Executive Director",
  //       linkedin: "https://www.linkedin.com/in/murali-krishna-b66564365/",
  //       photo: "/team/Murali.jpg",
  //     },
  //   ],
  // },
  {
    id: "our-team",
    title: "Our Team",
    people: [
      // C-Level Executives
      {
        id: 4,
        name: "Madhu Kuppani",
        bio: "Chief Operating Officer – Retail Sales with 25+ years in banking. Commerce graduate and decade-long contributor driving retail growth through project, financial, and risk management. Renowned communicator and negotiator, he builds high-performance teams, mentors sales talent, and champions customer-centric execution that strengthens client relationships, accelerates revenue, and sustains scalable excellence.",
        designation: "Chief Operating Officer – Retail Sales",
        linkedin: "https://www.linkedin.com/in/madhu-kuppani-13161535b/",
        photo: "/team/WhatsApp Image 2025-10-07 at 12.17.36 PM.jpeg",
      },
      {
        id: 5,
        name: "Saketh Addepalli",
        bio: "Chief Sales Officer – Institutional Sales with 9+ years in B2B, government, and key accounts. Delivered 100%+ YoY growth for three consecutive years, leading teams across trade and modern trade. PGDM (IIM Ranchi) and former student council president; blends strategy, execution, and relationship leadership to expand markets and elevate enterprise revenue outcomes.",
        designation: "Chief Sales Officer – Institutional Sales",
        linkedin: "https://www.linkedin.com/in/sakethaddepalli/",
        photo: "/team/Saketh.jpg",
      },

      // Vice Presidents
      {
        id: 6,
        name: "Mayuram Barooah, PMP\u00AE",
        designation: "Vice President",
        bio: "Vice President – Sales & Marketing and PMP® with 23+ years in government and corporate programs. Leads complex, multi-stakeholder initiatives in India and abroad, strengthening partnerships, planning, and governance. BE (Electronics), Nagpur University. PMI-certified. Trusted for high-impact delivery, strategic account growth, and disciplined execution across public and private sectors.",
        linkedin: "https://www.linkedin.com/in/mayuram-barooah-1b040a31/",
        photo: "/team/Mayuram%20Barooah.png",
      },
      {
        id: 7,
        name: "Venu Gopal",
        designation: "Vice President",
        bio: "Vice President – Sales & Marketing focused on enterprise growth and customer success. Builds pipelines, coaches teams, and aligns marketing with field execution. Strengths include solution selling, territory expansion, and partner enablement. Known for clear communication, accountability, and results-oriented leadership that converts opportunities into sustainable revenue and referenceable client relationships.",
        linkedin: "https://www.linkedin.com/in/venugopal-gonuguntla-37a20a58/",
        photo: "/team/Venu%20Gopal.png",
      },
      {
        id: 8,
        name: "Sandheep Kumar Akula",
        bio: "Vice President – Government Bodies. Passionate, results-driven, and highly organized leader with strong analytical and communication skills. Experienced in project coordination, client relations, and team management. Values integrity and adaptability. Excels at planning, execution, and cross-functional collaboration, embracing new technologies to deliver quality outcomes aligned with organizational goals.",
        designation: "Vice President – Government Bodies",
        photo: "/team/Sandeep.jpg",
      },

      // Assistant Vice Presidents
      {
        id: 9,
        name: "Rajendra Patil",
        designation: "Assistant Vice President",
        bio: "Assistant Vice President – Institutional Sales with 28+ years across sales and marketing. Leads West Region sales for Brihaspathi Technologies. Trusted for account development, channel stewardship, and consistent delivery against targets. Builds relationships, resolves challenges quickly, and advances customer value with practical execution and commitment to long-term partnerships.",
        linkedin: "https://www.linkedin.com/in/rajendra-patil-9ba11716/",
        photo: "/team/Rajendra%20Photo.jpg",
      },
      {
        id: 10,
        name: "Sagar Ambadas",
        designation: "Assistant Vice President – Projects",
        bio: "Assistant Vice President – Projects with 20 years in planning and delivery. Crafts schedules, monitors milestones, and allocates manpower to ensure smooth implementation. Champions client coordination, progress reviews, and needs discovery. Mentors teams, boosts productivity, and drives operational excellence through process optimization, risk awareness, and proactive problem-solving.",
        linkedin: "https://www.linkedin.com/in/ambadas-sagar-b890a8175/",
        photo: "/team/Sagar%20Ambadas.png",
      },
      {
        id: 11,
        name: "Arvind Durgam",
        designation: "Assistant Vice President – Sales",
        bio: "Assistant Vice President – Sales with 25 years in CCTV and electronic security, including a decade across Smart & Safe City programs—ANPR and traffic-enforcement analytics. Blends solution expertise with field execution, supporting bids, deployments, and service quality. Committed to stakeholder alignment and dependable lifecycle performance.",
        linkedin: "https://www.linkedin.com/in/durgam-aravind-kumar-22229744/",
        photo: "/team/ARVIND%20DURGAM.png",
      },

      // General Managers
      {
        id: 12,
        name: "Ramasastrulu T",
        designation: "General Manager",
        bio: "General Manager with 13+ years in solar energy. Specializes in tendering, operations, procurement, and government coordination. Leads installations with quality, compliance, and on-time delivery. Applies technical depth and project discipline to scale renewable initiatives, optimize costs, and sustain performance—strengthening the company’s clean-energy role and operational excellence.",
        linkedin: "https://www.linkedin.com/in/ramu-tata-55157782/",
        photo: "/team/Ramu.png",
      },
      {
        id: 13,
        name: "S. V. Ganeswaraswamy Gunisetti",
        designation: "General Manager – Projects",
        bio: "General Manager – Projects leading Software and New Product Innovations. With 12+ years across AI video analytics, IoT, smart infrastructure, and solar systems, he drives R&D from concept to scale. Partners with public safety, defense, education, and transport, turning ideas into practical technologies for safer, smarter communities.",
        photo: "/team/Ganesh Headshot.png",
        linkedin:
          "https://www.linkedin.com/in/s-v-ganeswara-swamy-gunisetty-74453816a/",
      },
      {
        id: 14,
        name: "Karella Kota Naga Satya Prasad (KKNS Prasad)",
        designation: "General Manager – Projects",
        bio: "General Manager – Projects with 10+ years managing large, multi-disciplinary deliveries. Aligns scope, schedule, and cost to strategic objectives while fostering collaboration and continuous improvement. Prioritizes innovation, sustainability, and risk control. Builds strong client relationships, ensuring transparent governance and dependable, quality outcomes with long-term value.",
        linkedin: "https://www.linkedin.com/in/kkns-prasad-617016102/",
        photo: "/team/Prasad%20-%20General%20Manager.jpg",
      },
      {
        id: 15,
        name: "Kiran Sanaboina",
        designation: "General Manager – Technical Support",
        linkedin: "https://www.linkedin.com/in/kiransanaboina/",
        bio: "General Manager – Technical Support with 15+ years designing, deploying, and managing integrated electronic security. Expertise covers CCTV, access control, intrusion, fire alarms, and AI-enabled platforms. Leads cross-functional teams through full lifecycles, emphasizing scalability, reliability, and compliance to create safer, smarter environments for enterprises and critical facilities.",
        photo: "/team/Kiran%20-%20General%20Manager.jpg",
      },
      {
        id: 16,
        name: "Ponugoti Moses Babu",
        designation: "General Manager – Sales",
        bio: "General Manager – Sales with eight years advancing ELV and Solar growth. Expands market reach, shapes go-to-market, and aligns sales and marketing with client goals. Recognized for relationship building, sustainable solutions, and predictable execution that converts demand into long-term partnerships across technology and energy sectors.",
        linkedin: "https://www.linkedin.com/in/moses-ponugoti-575666190/",
        photo: "/team/WhatsApp Image 2025-10-07 at 11.44.22 AM (1).jpeg",
      },

      // Functional Heads / Controllers
      {
        id: 17,
        name: "Sasank",
        designation: "Financial Controller",
        bio: "Financial Controller and Chartered Accountant with 12+ years across FP&A, audit, taxation, risk, and corporate finance. Optimizes cash flow, strengthens controls, and improves profitability through data-driven decisions. Ensures compliance while guiding planning, budgeting, and governance—enabling sustainable growth, transparency, and disciplined financial stewardship company-wide.",
        linkedin: "https://www.linkedin.com/in/ca-sasank-battu/",
        photo: "/team/Sasank.jpg",
      },
      {
        id: 18,
        name: "Reshal Melkar",
        designation: "HR Manager (HR & Admin)",
        bio: "HR leader with 10+ years managing end-to-end HR operations. Streamlines processes, strengthens compliance, and champions engagement. Aligns people strategy with business priorities to support growth and culture. Skilled across talent, performance, and HRMS, fostering trust, clarity, and continuous improvement to empower teams and improve outcomes.",
        linkedin: "https://www.linkedin.com/in/reshal-melkar-89257a128/",
        photo: "/team/Reshal%20-%20Hr%20manager.jpg",
      },

      // Managers
      {
        id: 19,
        name: "Vikranth Singh",
        designation: "Brand Manager",
        bio: "Brand Manager focused on positioning, storytelling, and consistent identity. Aligns brand strategy with business goals, enabling sales and demand creation. Partners with product and revenue teams to launch campaigns, elevate perception, and measure impact. Advocates clarity, creativity, and disciplined execution that builds preference and market presence.",
        linkedin: "https://www.linkedin.com/in/vikrant-singh-parihar/",
        photo: "/team/Vikranth%20-%20Brand%20Manager.jpg",
      },
      {
        id: 20,
        name: "K. Sukesh",
        designation: "Accounts Manager",
        bio: "Accounts Manager with 14+ years in accounting and financial management. Leads teams, payroll, compliance, reporting, and audits. Skilled in Tally, SAP Business One, and Office 365. Known for analysis, reconciliation, and process optimization—ensuring regulatory accuracy and operational excellence to support growth with reliable, timely financial operations.",
        photo: "/team/Sukesh%20-%20Accounts%20Manager.jpg",
      },
      {
        id: 21,
        name: "Budida Rambabu",
        designation: "Accounts Manager",
        bio: "Accounts Manager with 12+ years in general accounting and financial management, MBA (Finance). Experienced in reporting, budgeting, and compliance. Streamlines operations, improves accuracy, and supports audits. Builds collaborative stakeholder relationships, delivering timely, transparent information that informs decisions and strengthens governance and fiscal performance.",
        linkedin: "https://www.linkedin.com/in/ram-babu-44a57a72/",
        photo: "/team/Accounts%20team%20photo%20Rambabu.png",
      },
      {
        id: 22,
        name: "Ashish Bandabuche",
        designation: "Senior Purchase Manager",
        bio: "Senior Purchase Manager optimizing procurement strategy, sourcing, and vendor performance. Negotiates value, quality, and timelines while managing risk and compliance. Collaborates with engineering and finance to balance cost, availability, and specifications. Implements process discipline and analytics that improve continuity, reduce total cost, and support reliable project delivery.",
        photo: "/team/Ashish%20Bandabuche%20-%20Sr.%20Purchase%20Manager.png",
      },

      // Key Accounts Managers
      {
        id: 23,
        name: "Dikkala Srija",
        photo: "/team/WhatsApp Image 2025-10-07 at 11.44.22 AM (2).jpeg",
        designation: "Key Accounts Manager",
        bio: "Key Accounts Manager energized by meeting people and learning diverse perspectives. Turns challenges into opportunities, bringing creativity and momentum to deliver value. Builds relationships, coordinates solutions, and follows through with care—focused on positive impact, dependable execution, and growth aligned with client success.",
        linkedin: "https://www.linkedin.com/in/srija-dikkala-623a2b19b/",
      },
      {
        id: 24,
        name: "Majjari Hemanth",
        designation: "Key Accounts Manager",
        bio: "Key Accounts Manager leading institutional sales and government partnerships. Combines IIM Ranchi training with operational rigor to manage lifecycles, negotiations, and stakeholder alignment. Thrives in high-pressure environments, translating complex requirements into successful deployments and measurable outcomes.",
        linkedin: "https://www.linkedin.com/in/majjari-hemanth-015901183/",
        photo: "/team/Hemanth-Key Account Manager.png",
      },
      {
        id: 25,
        name: "Hazekaiah Graham Laloo",
        designation: "Key Accounts Manager",
        bio: "Key Accounts Manager overseeing key relationships, operations, and administration. MBA (Marketing), IIM Ranchi. Applies strategy, data-driven insight, and cross-functional leadership to optimize execution. Skilled in stakeholder engagement, process improvement, and financial analysis—delivering effective solutions and long-term business performance.",
        photo: "/team/Jack-Key Account Manager.jpg",
        linkedin: "https://www.linkedin.com/in/hazekaiah-laloo-782218200/",
      },
      {
        id: 26,
        name: "Arvind Kumar Dongre",
        photo: "/team/WhatsApp Image 2025-10-07 at 11.44.22 AM.jpeg",
        designation: "Key Accounts Manager",
        bio: "Key Accounts Manager with interests spanning marketing, strategy, information technology, public speaking, and literature. JRF awardee; MA in Public Administration and B.Com. Applies structured thinking and communication to align stakeholders, clarify value, and support execution—converting opportunity into measurable impact and durable relationships.",
        linkedin: "https://www.linkedin.com/in/arvind-kumar-dongre-88bb6a187/",
      },
      {
        id: 27,
        name: "Praveen Malothu",
        designation: "Key Accounts Manager",
        bio: "Key Accounts Manager leading institutional sales and long-term partnerships. Experienced across sales, distribution, and execution in FMCG and technology. Solves pragmatically, collaborates with stakeholders, and tailors solutions to client needs. Committed to growth, trust, and efficiency—turning interactions into learning that strengthens outcomes and organizational success.",
        linkedin:
          "https://www.linkedin.com/in/praveen-malothu-bb380b1bb/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
        photo: "/team/Praveen.jpg",
      },
    ],
  },
];

/* =========================
   Scroll direction hook
========================= */
function useScrollDirection() {
  const [dir, setDir] = useState<"down" | "up">("down");
  const lastY = useRef(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || 0;
          setDir((prev) =>
            y > lastY.current ? "down" : y < lastY.current ? "up" : prev
          );
          lastY.current = y;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return dir;
}

/* =========================
   Card (image static, details panel with bio)
========================= */
function TeamCard({ p }: { p: Person }) {
  const coverSrc = p.photo || initialsAvatar(p.name);
  return (
    <div>
      <div
        className="team-card"
        style={{
          borderRadius: CARD_RADIUS,
          overflow: "hidden",
          height: IMAGE_HEIGHT + PANEL_HEIGHT,
          width: 300,
          display: "flex",
          flexDirection: "column",
          boxShadow: CARD_SHADOW,
          background: "#fff",
        }}
      >
        {/* Image */}
        <Image
          src={coverSrc}
          alt={p.name}
          preview={{ mask: "View photo" }}
          style={{
            width: "200%",
            height: 300,
            objectFit: "cover",
            display: "block",
            background: "#f6f8fa",
            borderRadius: 12,
          }}
        />

        {/* Details */}
        <div
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            height: PANEL_HEIGHT,
            background: "#fff",
            borderTop: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          {/* Name + LinkedIn */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              {p.name}
            </Title>

            {p.linkedin && (
              <a
                href={p.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`LinkedIn profile of ${p.name}`}
                className="lnk"
              >
                <Linkedin size={18} color="#ffffff" strokeWidth={2.5} />
              </a>
            )}
          </div>

          {/* Designation */}
          <Text
            type="secondary"
            style={{ display: "block", marginTop: 8, fontSize: 16 }}
          >
            {p.designation}
          </Text>

          {/* Department & Location (optional) */}
          {(p.department || p.location) && (
            <Space
              size={8}
              style={{
                marginTop: 10,
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {p.department && (
                <Tag className="chip">
                  <Users size={14} color={BRAND} />
                  {p.department}
                </Tag>
              )}
              {p.location && (
                <Tag className="chip">
                  <MapPin size={14} color={BRAND} />
                  {p.location}
                </Tag>
              )}
            </Space>
          )}

          {/* Bio */}
          <Paragraph
            style={{
              marginTop: 12,
              marginBottom: 0,
              color: "rgba(0,0,0,0.85)",
              lineHeight: 1.7,
              display: "-webkit-box",
              WebkitLineClamp: 6,
              WebkitBoxOrient: "vertical" as any,
              overflow: "hidden",
            }}
          >
            {p.bio || "Bio coming soon."}
          </Paragraph>

          {/* Styles */}
          <style jsx>{`
            .lnk {
              width: 34px;
              height: 34px;
              border-radius: 8px;
              background-color: ${BRAND};
              display: inline-flex;
              align-items: center;
              justify-content: center;
              flex: 0 0 auto;
              transition: transform 0.15s ease;
            }
            .lnk:hover {
              transform: translateY(-1px) scale(1.03);
            }
            .chip {
              background: rgba(7, 81, 138, 0.06);
              border: none;
              color: ${BRAND};
              display: inline-flex;
              align-items: center;
              gap: 6px;
            }
            .team-card {
              transform: translateZ(0);
              transition: transform 0.2s ease, box-shadow 0.2s ease;
              will-change: transform;
            }
            .team-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Motion helpers per-column
========================= */
function useColumnVariants() {
  const dir = useScrollDirection();
  // slide up on downward scroll; slide down on upward scroll
  return useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: dir === "down" ? 24 : -24,
        filter: "blur(6px)",
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 26,
          mass: 0.6,
        },
      },
      exit: {
        opacity: 0,
        y: dir === "down" ? -16 : 16,
        filter: "blur(6px)",
        transition: { duration: 0.2 },
      },
    }),
    [dir]
  );
}

/* =========================
   Section (4 columns on lg) + buttery scroll anims
========================= */
export default function LeadershipTeamWithPreview({
  groups,
}: {
  groups?: OrgGroup[];
}) {
  const data = groups || ORG_GROUPS;
  const prefersReduced = useReducedMotion();
  const variants = useColumnVariants();

  return (
    <MotionConfig
      reducedMotion={prefersReduced ? "always" : "never"}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <section
        style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px" }}
      >
        {data.map((group) => (
          <div key={group.id} style={{ marginBottom: 56 }}>
            <Title level={2} style={{ marginBottom: 24, color: BRAND }}>
              {group.title}
            </Title>

            <Image.PreviewGroup>
              <Row gutter={GRID_GUTTER as any}>
                {group.people.map((p, idx) => (
                  <Col key={p.id} xs={24} sm={12} md={12} lg={6}>
                    <motion.div
                      variants={variants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false, amount: 0.2 }}
                      // soft per-item stagger based on index within the grid
                      transition={{
                        ...variants.visible.transition,
                        delay: (idx % 8) * 0.04, // repeat pattern every 8 items
                      }}
                      style={{ willChange: "transform, opacity, filter" }}
                    >
                      <TeamCard p={p} />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Image.PreviewGroup>
          </div>
        ))}
      </section>
    </MotionConfig>
  );
}
