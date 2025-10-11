export const MENU_DATA: { services: MenuCategory[] } = {
  services: [
    {
      title: "AI Products",
      items: [
        {
          label: "FaceEntry — Visitor Management",
          description:
            "AI-powered visitor management with face recognition, real-time watchlist checks, and seamless badge printing.",
          features: [
            "Face recognition (on-prem/cloud)",
            "Watchlist & VIP alerts",
            "Kiosk & tablet modes",
            "Gate/turnstile integration",
            "Audit trails & analytics",
          ],
        },
        {
          label: "Distracted Driver Detection",
          description:
            "In-cabin vision that detects drowsiness, yawning, phone use and seatbelt compliance for fleet safety.",
          features: [
            "Drowsiness & yawning alerts",
            "Seatbelt/phone detection",
            "Edge deployment (Jetson/CPU)",
            "RTSP/USB camera support",
            "REST/MQTT event hooks",
          ],
        },
        {
          label: "Violence & Anomaly Detection",
          description:
            "Real-time incident detection in public spaces—fights, crowding, and unusual motion patterns.",
          features: [
            "Person & pose analytics",
            "Zone/line rules & alerts",
            "Works with existing CCTV",
            "Low-latency pipeline",
            "Forensic search & clips",
          ],
        },
        {
          label: "Retail Vision Analytics",
          description:
            "People counting, dwell time and heatmaps to improve store layouts and marketing effectiveness.",
          features: [
            "Footfall & occupancy",
            "Queue length alerts",
            "Heatmaps & dwell time",
            "Multi-camera stitching",
            "Privacy-safe processing",
          ],
        },
        {
          label: "Invoice & Document OCR",
          description:
            "High-accuracy OCR with field-level extraction for invoices, KYC, and forms—export to ERP/CRM.",
          features: [
            "Templates & template-less",
            "Line-item extraction",
            "Confidence scoring",
            "Human-in-the-loop QA",
            "CSV/API export",
          ],
        },
        {
          label: "Lab Hardware Recommender (AI)",
          description:
            "LLM-assisted hardware selector for lab workflows—maps procedures to the right instruments.",
          features: [
            "Procedure → device mapping",
            "Strict allow-list outputs",
            "Explainable selections",
            "JSON/CSV export",
            "Web & API access",
          ],
        },
        {
          label: "RAG Knowledge Assistant",
          description:
            "Private document Q&A with citations—faq, policy, and SOP search without hallucinations.",
          features: [
            "PDF/Doc ingestion",
            "Secure vector search",
            "Citations & sources",
            "Role-based access",
            "Multi-lingual support",
          ],
        },
        {
          label: "Virtual Try-On Studio",
          description:
            "Generate on-model product visuals and colorways from plain images—e-commerce ready.",
          features: [
            "Garment segmentation",
            "Pose & size consistency",
            "Batch processing",
            "Background cleanup",
            "CDN/Shop sync",
          ],
        },
      ],
    },

    {
      title: "ERP Systems",
      items: [
        {
          label: "Inventory & Warehouse (WMS)",
          description:
            "Real-time stock, locations, and movements with barcode/RFID and cycle counts.",
          features: [
            "Multi-warehouse",
            "GRN, putaway, picks",
            "Batches/serials",
            "Reorder & min/max",
            "Mobile scanner app",
          ],
        },
        {
          label: "Procurement & Vendor",
          description:
            "Complete P2P: requisitions to PO, vendor scorecards, and 3-way matching.",
          features: [
            "RFQ & approval flows",
            "3-way match (PO/GRN/Invoice)",
            "Contract terms & SLAs",
            "Spend analytics",
            "Vendor rating",
          ],
        },
        {
          label: "Sales & Quotation",
          description:
            "Configure quotes, orders, and dispatches with price lists and taxes.",
          features: [
            "Quote→SO→Invoice",
            "Price lists & discounts",
            "GST/VAT ready",
            "e-Invoicing hooks",
            "Courier integrations",
          ],
        },
        {
          label: "CRM & Marketing",
          description:
            "Lead-to-cash visibility with campaigns, pipelines, and customer 360.",
          features: [
            "Leads & deals",
            "Email/SMS campaigns",
            "Tasks & reminders",
            "Notes & files",
            "Reports & KPIs",
          ],
        },
        {
          label: "HRMS & Payroll",
          description:
            "Core HR, attendance, leaves and compliant payroll processing.",
          features: [
            "Onboarding & docs",
            "Shifts & attendance",
            "Leave & OT rules",
            "Payroll & payslips",
            "Statutory compliance",
          ],
        },
        {
          label: "Manufacturing & MRP",
          description:
            "Plan materials and capacity with BOMs, routings and shop orders.",
          features: [
            "BOM & multi-level BOM",
            "MRP suggestions",
            "Work orders",
            "Scrap & rework",
            "OEE dashboards",
          ],
        },
        {
          label: "Finance & Accounting",
          description:
            "Ledgers, AR/AP, bank reconciliation and financial statements.",
          features: [
            "Multi-currency",
            "GST/VAT returns",
            "Bank feeds/recon",
            "Aging & dunning",
            "P&L/BS/Cashflow",
          ],
        },
        {
          label: "Projects & Timesheets",
          description:
            "Plan, track and bill projects—tasks, milestones and costs.",
          features: [
            "Gantt & Kanban",
            "Timesheets & rates",
            "Budgets & EVM",
            "Fixed/time-&-materials",
            "Client portals",
          ],
        },
        {
          label: "Asset & Maintenance (CMMS)",
          description:
            "Asset lifecycle with preventive maintenance and spares.",
          features: [
            "Asset registry",
            "PM schedules",
            "Breakdown tickets",
            "Spares & costs",
            "QR code tagging",
          ],
        },
        {
          label: "Quality & Compliance",
          description:
            "QA plans, inspections, NC/CAPA and audit trails (GxP-friendly).",
          features: [
            "Checklists & sampling",
            "Non-conformance",
            "CAPA workflows",
            "Docs & versioning",
            "Traceability",
          ],
        },
        {
          label: "POS & Omnichannel",
          description:
            "Retail POS with inventory sync and e-commerce integrations.",
          features: [
            "Offline-first POS",
            "Barcode/discounts",
            "Loyalty & coupons",
            "E-com connectors",
            "Realtime stock",
          ],
        },
      ],
    },

    {
      title: "Services We Provide",
      items: [
        {
          label: "AI/ML Consulting & Prototyping",
          description:
            "Discovery to PoC—problem framing, model baselining, and value validation.",
          features: [
            "Use-case discovery",
            "Rapid PoCs",
            "TCO/ROI modeling",
            "Roadmaps & governance",
            "Build-vs-buy advice",
          ],
        },
        {
          label: "Computer Vision Solutions",
          description:
            "Detection, tracking, pose and video analytics across safety, retail and ops.",
          features: [
            "RTSP pipelines",
            "Edge inference",
            "Custom training",
            "Model compression",
            "Realtime dashboards",
          ],
        },
        {
          label: "NLP & Chatbots (RAG/LLMs)",
          description:
            "Private knowledge assistants with citations and policy-safe outputs.",
          features: [
            "RAG with citations",
            "Guardrails & PII redaction",
            "Multi-lingual",
            "Search connectors",
            "Analytics & feedback",
          ],
        },
        {
          label: "Data Engineering & Analytics",
          description:
            "Pipelines, lakes and BI with reliable, cost-efficient ELT/ETL.",
          features: [
            "Batch & streaming",
            "Quality checks",
            "Dim models & marts",
            "DBT/airflow",
            "PowerBI/Looker",
          ],
        },
        {
          label: "MLOps & LLMOps",
          description:
            "From experiment tracking to CI/CD, monitoring and model governance.",
          features: [
            "CI/CD for models",
            "Feature & model stores",
            "Drift/quality monitors",
            "Canary/AB deploys",
            "Audit & lineage",
          ],
        },
        {
          label: "Cloud & DevOps",
          description:
            "Secure, scalable infra on AWS/Azure/GCP with IaC and observability.",
          features: [
            "Kubernetes & serverless",
            "IaC (Bicep/Terraform)",
            "Cost optimization",
            "SRE & SLOs",
            "Backups/DR",
          ],
        },
        {
          label: "Web & Mobile Development",
          description:
            "Modern apps with Next.js/React, Strapi/Node and robust APIs.",
          features: [
            "SEO & performance",
            "Design systems",
            "Headless CMS",
            "REST/GraphQL",
            "Testing & QA",
          ],
        },
        {
          label: "IoT & Edge AI",
          description:
            "Sensor-to-cloud solutions with local inference and secure updates.",
          features: [
            "Gateway & device mgmt",
            "OTA updates",
            "Streaming analytics",
            "Rules/alerts",
            "Digital twins",
          ],
        },
        {
          label: "Robotics & Reinforcement Learning",
          description:
            "Sim-to-real workflows, policy training and task automation.",
          features: [
            "Isaac Sim/Lab flows",
            "Policy training (SB3)",
            "Grasp & insert tasks",
            "Trajectory opt.",
            "Evaluation harness",
          ],
        },
        {
          label: "Cybersecurity & Compliance",
          description:
            "Secure by design with access control, auditability and standards alignment.",
          features: [
            "IAM & RBAC",
            "VAPT & hardening",
            "SOC2/ISO guidance",
            "Data privacy",
            "Secure SDLC",
          ],
        },
        {
          label: "Training & Upskilling",
          description:
            "Hands-on programs in Python, CV/NLP, MLOps and cloud for teams.",
          features: [
            "Curriculum design",
            "Workshops & labs",
            "Mentored projects",
            "Assessments",
            "Certificates",
          ],
        },
        {
          label: "Managed Services & Support",
          description:
            "SLAs for production systems—monitoring, upgrades and helpdesk.",
          features: [
            "24×7 monitoring",
            "Patch management",
            "SLO reporting",
            "Capacity planning",
            "Tiered SLAs",
          ],
        },
      ],
    },
  ],
};
