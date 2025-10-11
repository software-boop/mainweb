// lib/Content/solutions.ts

export type Solution = {
  slug: string;
  title: string;
  summary?: string;
  image?: string; // path under /public
  tags?: string[];

  // Optional richer content if you expand the UI later
  features?: string[];
  useCases?: string[];
  outcomes?: string[];
  modules?: { title: string; items: string[] }[];
  integrations?: string[];
  metrics?: { label: string; value: string }[];
  cta?: { label: string; href: string };
};

export const solutions: Solution[] = [
  {
    slug: "video-analytics",
    title: "AI Video Analytics",
    summary:
      "Real-time, edge-accelerated analytics for surveillance feeds—detect, classify, and act on events as they happen.",
    image: "/sollution_images/3.jpg",
    tags: ["AI", "Edge", "Real-time", "CCTV"],
    features: [
      "Object & Person Detection",
      "Face Recognition & Watchlists",
      "ANPR / License Plate Reading",
      "Intrusion & Line-Crossing",
      "Loitering & Abandoned Object",
      "Crowd Counting & Heatmaps",
      "PPE Detection (Helmet, Vest, Mask)",
      "Fire/Smoke & Fall Detection",
      "Vehicle Classification & Speed Zones",
      "Parking Occupancy & Violations",
    ],
    useCases: [
      "City surveillance & smart intersections",
      "Campus security & perimeter protection",
      "Industrial safety compliance (PPE)",
      "Retail loss prevention & footfall insights",
      "Parking & traffic enforcement",
    ],
    outcomes: [
      "Faster incident response with proactive alerts",
      "Reduced manual monitoring costs",
      "Higher safety compliance & audit readiness",
      "Data-driven planning via heatmaps & trends",
    ],
    modules: [
      {
        title: "Core Models",
        items: [
          "Object, Vehicle, Person, PPE",
          "Face, ANPR, Loitering, Intrusion",
          "Abandoned/Removed Object, Fire/Smoke",
        ],
      },
      {
        title: "Ops & Orchestration",
        items: [
          "Edge-to-Cloud Pipeline",
          "Alert Rules & Schedules",
          "Case Timelines & Evidence Locker",
        ],
      },
    ],
    integrations: [
      "ONVIF Cameras & NVRs",
      "VMS (Milestone, Nx Witness, etc.)",
      "Webhooks / MQTT / REST APIs",
      "SMS/Email/WhatsApp Alerts",
    ],
    metrics: [
      { label: "Latency", value: "< 300 ms on edge GPU" },
      { label: "Throughput", value: "Up to 32 streams / node" },
      { label: "Accuracy", value: "mAP ≥ 0.8 (typical models)" },
    ],
    cta: {
      label: "Request a Live Demo",
      href: "/contact?topic=video-analytics",
    },
  },

  {
    slug: "access-control",
    title: "Access Control & Attendance",
    summary:
      "Unified access management with biometric, RFID, and mobile credentials—built for security, compliance, and scale.",
    image: "/sollution_images/4.jpg",
    tags: ["Security", "Biometrics", "Compliance"],
    features: [
      "Biometric (Fingerprint/Face) & RFID",
      "Mobile Credentials & QR Passes",
      "Aadhaar eKYC Option",
      "Role-Based Access & Zones",
      "Multi-Factor Authentication",
      "Time & Attendance (Shifts/Overtime)",
      "Anti-Passback & Tailgating Rules",
      "Visitor & Contractor Management",
      "Turnstiles, Boom Barriers, Elevators",
      "Muster Roll & Emergency Evacuation",
    ],
    useCases: [
      "Corporate campuses & co-working",
      "Factories & warehouse perimeters",
      "Data centers & restricted labs",
      "Residential communities",
      "Events & temporary sites",
    ],
    outcomes: [
      "Reduced unauthorized entries",
      "Automated payroll-ready attendance",
      "Streamlined visitor flow",
      "Improved auditability & compliance",
    ],
    modules: [
      {
        title: "Controllers & Devices",
        items: [
          "Door Controllers & Readers",
          "Turnstiles/Barriers/Elevator Control",
          "Edge Gateways with Failover",
        ],
      },
      {
        title: "Software Suite",
        items: [
          "Access Policies & Schedules",
          "Attendance & Leave Rules",
          "Reports, Exports & Webhooks",
        ],
      },
    ],
    integrations: [
      "HRMS/Payroll (API/CSV)",
      "CCTV/VMS for Access-Event Video",
      "SAML/OIDC for SSO",
      "Notifications: Email/SMS/WhatsApp",
    ],
    metrics: [
      { label: "Uptime", value: "99.9% (HA setup)" },
      { label: "Onboarding", value: "< 60s user enrollment" },
      { label: "Scale", value: "100k+ users / tenant" },
    ],
    cta: { label: "Talk to an Expert", href: "/contact?topic=access-control" },
  },

  {
    slug: "smart-retail",
    title: "Smart Retail Analytics",
    summary:
      "Computer vision insights for stores: footfall, dwell, queues, planogram & shelf health to boost conversion.",
    image: "/sollution_images/SMart retail.jpg",
    tags: ["Retail", "Vision AI", "Analytics"],
    features: [
      "Footfall & Demographic Insights",
      "Queue Length & Wait-Time Alerts",
      "Dwell Time & Heatmaps",
      "Planogram Compliance",
      "Shelf Stock-Out & Facing Detection",
      "Loss Prevention / Suspicious Behavior",
      "Campaign Lift Measurement",
      "Store/Zonal KPIs & Benchmarking",
    ],
    useCases: [
      "Supermarkets & Hypermarkets",
      "Fashion & Electronics",
      "Quick Commerce & Dark Stores",
      "Malls & Showrooms",
    ],
    outcomes: [
      "Higher conversion via staff reallocation",
      "Reduced queues & abandonment",
      "Fewer stock-outs, better on-shelf availability",
      "Accurate campaign ROI measurement",
    ],
    modules: [
      {
        title: "In-Store Vision",
        items: ["Heatmaps", "Queues", "Dwell", "Demographics"],
      },
      {
        title: "Merchandising",
        items: ["Planogram Compliance", "Shelf Health", "Stock-Out Alerts"],
      },
    ],
    integrations: [
      "POS & Billing Systems",
      "Retail ERP (Inventory/Orders)",
      "Digital Signage Triggers",
      "REST/Webhooks",
    ],
    metrics: [
      { label: "Queue Alert", value: "< 5s detection" },
      { label: "Shelf Scan", value: "Every 60–180s per lane" },
      { label: "Accuracy", value: "≥ 90% on defined SKUs" },
    ],
    cta: { label: "See Retail Demo", href: "/contact?topic=smart-retail" },
  },

  {
    slug: "smart-bus",
    title: "Smart Bus Solution",
    summary:
      "Safety-first transit with onboard AI CCTV, GPS/telemetry, PA, panic alerts, and passenger information systems.",
    image: "/sollution_images/smart bus solution.jpg",
    tags: ["Transportation", "Public Safety", "IoT"],
    features: [
      "Onboard AI Video (Driver/Passenger)",
      "GPS Tracking & Geofencing",
      "Panic Button & SOS Workflow",
      "Driver Monitoring (DMS)",
      "Passenger Information & PA System",
      "Wi-Fi Hotspot & Edge Caching",
      "Breath Analyzer Integration",
      "Fire Suppression Integrations",
      "Auto Upload of Incidents to Cloud",
    ],
    useCases: [
      "City buses & BRT systems",
      "School & corporate fleets",
      "Inter-city transport",
      "Tour & charter services",
    ],
    outcomes: [
      "Improved passenger safety & trust",
      "Lower incident response times",
      "Audit-ready video evidence",
      "Optimized routes & operations",
    ],
    modules: [
      {
        title: "Onboard Kit",
        items: [
          "Edge AI Unit + NVR",
          "Cameras (Cabin, Door, Road)",
          "Display/PA, SOS Buttons",
        ],
      },
      {
        title: "Command Center",
        items: [
          "Fleet Map & Health",
          "Incident Review & Export",
          "Alerts & Escalation Rules",
        ],
      },
    ],
    integrations: [
      "AVL/ITS Platforms",
      "Dispatch & Ticketing",
      "Emergency Services",
      "Messaging & Email",
    ],
    metrics: [
      { label: "Video Sync", value: "Edge buffered + cloud archive" },
      { label: "Latency", value: "< 1s GPS / < 300ms AI events" },
      { label: "Compliance", value: "Meets typical ITS specs" },
    ],
    cta: { label: "Pilot a Route", href: "/contact?topic=smart-bus" },
  },
];
