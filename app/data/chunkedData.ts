// data.ts
export interface TeamMember {
  name: string;
  role: string;
  experience: string;
  contribution: string;
}

export interface Achievement {
  title: string;
  description: string;
}

export interface Service {
  category: string;
  details: string[];
}

export interface ContactInfo {
  officeType: string;
  address: string;
  phoneNumbers?: string[];
  emails?: string[];
  tollFree?: string;
  website?: string;
}

export interface ChunkedData {
  companyOverview: {
    name: string;
    founded: string;
    mission: string;
    vision: string;
    teamSize: string;
    clients: string;
    camerasInstalled: string;
  };
  mentors: TeamMember[];
  team: TeamMember[];
  achievements: Achievement[];
  services: Service[];
  contact: ContactInfo[];
  globalFootprint: string[];
  indianFootprint: string[];
}

export const chunkedData: ChunkedData = {
  companyOverview: {
    name: "Brihaspathi Technologies Limited",
    founded: "2006",
    mission:
      "To design and deliver state-of-the-art security and surveillance solutions that address today’s challenges, strengthen national safety, and contribute to a peaceful and secure future through advanced public-eye surveillance.",
    vision:
      "To lead the surveillance industry by providing tailor-made, innovative, and integrated security solutions at competitive prices. We are committed to upholding the highest standards of integrity, fostering long-term partnerships with our clients, employees, and stakeholders.",
    teamSize: "300+ professionals",
    clients: "12,000+ satisfied clients",
    camerasInstalled: "2 million+ cameras nationwide",
  },
  mentors: [
    {
      name: "Rajasekhar Papolu",
      role: "Managing Director",
      experience: "Over 20 years",
      contribution:
        "Combines deep industry knowledge with a passion for transformative technology. His leadership has been instrumental in growing Brihaspathi from a small dream into a tech powerhouse, inspiring the team to achieve excellence.",
    },
    {
      name: "Hyma Rajasekhar",
      role: "Director, Administration",
      experience: "15+ years in corporate finance",
      contribution:
        "Known for meticulous planning and resource optimization. Her expertise in balancing risk and opportunity has played a pivotal role in the company’s success.",
    },
    {
      name: "Madhu Kuppani",
      role: "Chief Operating Officer (Retail Sales)",
      experience: "Not specified",
      contribution:
        "Excels in building high-performance teams and nurturing top-tier sales talent. Drives retail success and strengthens client relationships.",
    },
    {
      name: "Murali Krishna",
      role: "Executive Director",
      experience: "Extensive experience in administrative operations",
      contribution:
        "Ensures smooth coordination across departments, overseeing facilities management, resource allocation, and compliance. Expert in tendering, documentation, and bid management.",
    },
    {
      name: "Saketh Addepalli",
      role: "Chief Sales Officer (Institutional Sales)",
      experience: "Not specified",
      contribution:
        "Focuses on strategic account management and growth opportunities. Develops comprehensive account plans to drive revenue and ensure client satisfaction.",
    },
    {
      name: "Mayuram Barooah",
      role: "Senior Vice President",
      experience: "Not specified",
      contribution:
        "Brings strategic insight to documentation, digitization, and cash flow optimization as VP of Corporate & Legal. Strengthens operational efficiency.",
    },
    {
      name: "Sandeep Kumar",
      role: "VP - Government Bodies",
      experience: "Over 15 years in tech sales",
      contribution:
        "Expert in identifying business opportunities and nurturing long-term client relationships. His strategic approach unlocks new business avenues.",
    },
    {
      name: "Sunil Upadhyay",
      role: "VP, Institutional Sales",
      experience: "Over 15 years in institutional sales",
      contribution:
        "Seasoned strategist known for identifying emerging market trends. Critical in expanding Brihaspathi’s reach across industries.",
    },
  ],
  team: [
    {
      name: "KVS Vamsi Krishna",
      role: "Sr. Project Manager",
      experience: "Over 17 years in project management",
      contribution:
        "Excels at turning complex visions into reality. Manages resources and motivates teams to deliver innovative solutions.",
    },
    {
      name: "Suryakanth",
      role: "Sr. Project Manager",
      experience: "Over 17 years in project management",
      contribution:
        "Excels at turning complex visions into reality. Manages resources and motivates teams to deliver innovative solutions.",
    },
    {
      name: "Ashish",
      role: "Sr. Purchase Manager",
      experience: "Over 17 years in project management",
      contribution:
        "Excels at turning complex visions into reality. Manages resources and motivates teams to deliver innovative solutions.",
    },
    {
      name: "Moses P",
      role: "Sr. Sales Manager",
      experience: "A decade in tech sales",
      contribution:
        "Expert in identifying market opportunities and delivering results. Expands the company’s client base with a strategic mindset.",
    },
    {
      name: "KKNS Prasad",
      role: "General Manager",
      experience: "Over 14 years in network management",
      contribution:
        "Designs and maintains secure, high-performance network systems, ensuring resilient and scalable infrastructure.",
    },
    {
      name: "Ganeshwar",
      role: "General Manager",
      experience: "12 years",
      contribution:
        "Technical understanding and meticulous problem-solving result in efficient and reliable software tools.",
    },
    {
      name: "Kiran Sanaboina",
      role: "General Manager",
      experience: "Over 10 years in customer support",
      contribution:
        "Resolves technical challenges and fosters strong client relationships, maintaining Brihaspathi’s reputation for reliable service.",
    },
    {
      name: "Ramasastrulu",
      role: "General Manager",
      experience: "Over 12 years in sales",
      contribution:
        "Dynamic leader identifying market trends and building long-term partnerships to expand the client base.",
    },
    {
      name: "Reshal Melkar",
      role: "HR Manager",
      experience: "9+ years in HR operations",
      contribution:
        "Manages end-to-end HR activities, including talent acquisition, employee engagement, and strategy execution.",
    },
    {
      name: "Anuradha",
      role: "Purchase Manager",
      experience: "Over 17 years in project management",
      contribution:
        "Excels at turning complex visions into reality. Manages resources and motivates teams to deliver innovative solutions.",
    },
    {
      name: "Debi Prakash Pattanaik",
      role: "Digital Marketing Manager",
      experience: "Over 8 years in digital marketing",
      contribution:
        "Creative visionary excelling in SEO, SMO, content marketing, and brand promotion to drive traffic and leads.",
    },
    {
      name: "Praveen",
      role: "Key Accounts Manager",
      experience: "Over 7 years in procurement",
      contribution:
        "Negotiates deals and manages vendor relationships to maintain high-quality standards while optimizing costs.",
    },
    {
      name: "Majjari Hemanth",
      role: "Key Accounts Manager",
      experience: "Over 7 years in procurement",
      contribution:
        "Negotiates deals and manages vendor relationships to maintain high-quality standards while optimizing costs.",
    },
    {
      name: "Srija",
      role: "Key Accounts Manager",
      experience: "Over 7 years in procurement",
      contribution:
        "Negotiates deals and manages vendor relationships to maintain high-quality standards while optimizing costs.",
    },
    {
      name: "Hazekaiah Graham",
      role: "Key Accounts Manager",
      experience: "Over 7 years in procurement",
      contribution:
        "Negotiates deals and manages vendor relationships to maintain high-quality standards while optimizing costs.",
    },
    {
      name: "Arvind Kumar",
      role: "Key Accounts Manager",
      experience: "Over 7 years in procurement",
      contribution:
        "Negotiates deals and manages vendor relationships to maintain high-quality standards while optimizing costs.",
    },
    {
      name: "Sukesh",
      role: "Accounts Manager",
      experience: "Not specified",
      contribution:
        "Ensures financial health with a meticulous eye for detail and expertise in accounting.",
    },
    {
      name: "Ram Babu",
      role: "Accounts Manager",
      experience: "Not specified",
      contribution:
        "Ensures financial health with a meticulous eye for detail and expertise in accounting.",
    },
    {
      name: "Navnath",
      role: "Operation Manager",
      experience: "Rich background in supply chain management",
      contribution:
        "Optimizes costs while maintaining high standards, ensuring seamless operations.",
    },
    {
      name: "Bala Maruthi",
      role: "E-Communication Manager",
      experience: "A decade in e-communication",
      contribution:
        "Crafts compelling campaigns to enhance visibility and client outreach via digital platforms.",
    },
    {
      name: "Sai Kumar",
      role: "Assistant Manager, Purchase",
      experience: "Over 7 years in procurement",
      contribution:
        "Negotiates deals and manages vendor relationships to maintain high-quality standards while optimizing costs.",
    },
    {
      name: "Renuka",
      role: "Senior Project Executive",
      experience: "Over a decade in project management",
      contribution:
        "Aligns teams, manages resources, and delivers projects exceeding client expectations.",
    },
    {
      name: "Jeevan",
      role: "Technical Lead",
      experience: "Over 7 years in procurement",
      contribution:
        "Negotiates deals and manages vendor relationships to maintain high-quality standards while optimizing costs.",
    },
  ],
  achievements: [
    {
      title: "Maharashtra State Road Transport Corporation",
      description:
        "Awarded a prestigious project for the supply, installation, and maintenance of an IP-based Video Surveillance Solution and an Integrated Command Control Center (ICCC) for MSRTC.",
    },
    {
      title: "Kolkata Metro Railway",
      description:
        "Awarded a project for the supply, installation, and maintenance of an IP-based centralized Surveillance System for Kolkata Metro.",
    },
    {
      title: "PwDs Welfare Department - Maharashtra",
      description:
        "Implemented an Integrated Aadhaar-Based Facial Recognition Biometric Attendance System across 932 schools and workshops.",
    },
    {
      title: "General Elections of 2024",
      description:
        "Installed over 100,000+ cameras across India, with advanced Command Control Centres for monitoring remote, critical, and isolated polling stations.",
    },
    {
      title: "Telangana State Board of Intermediate Education",
      description:
        "Installed 8,500+ CCTV cameras for IPE 2025 exams with a centralized Command Control Center for real-time monitoring.",
    },
    {
      title: "NTA - NEET 2025",
      description:
        "Installed 65,000+ CCTV cameras across India for NEET 2025 examinations with a centralized Command Control Center for real-time monitoring.",
    },
    {
      title: "MHCET - 2025",
      description:
        "Installed 4,500+ CCTV cameras across Maharashtra for MHCET 2025, covering 1.3 million students with real-time monitoring.",
    },
    {
      title: "Border Security Force",
      description:
        "Installed 674 PTZ and bullet cameras along international borders of Rajasthan (Pakistan) and Bangladesh.",
    },
    {
      title: "Highcourt - AP & TG",
      description:
        "Installed 110 PTZ and IP Dome Cameras, along with an Under Vehicle Scanning System, and 105 PTZ and IP Dome Cameras with a video management system.",
    },
    {
      title: "Kaziranga National Park - Assam",
      description:
        "Commissioned 72 IP thermal-based and ANPR cameras without disturbing the eco-environment.",
    },
    {
      title: "Singareni Collieries Company Limited",
      description:
        "Set to install over 2,000 advanced surveillance cameras for enhanced security and monitoring.",
    },
    {
      title: "Tata Power Project",
      description:
        "Installed 200+ PTZ & Bullet Cameras with video analytics for security and monitoring.",
    },
    {
      title: "NTTPS",
      description:
        "Installed and commissioned 120 cameras at Dr. Narla Tatarao Thermal Power Station.",
    },
    {
      title: "Indian Oil Corporation Limited",
      description:
        "Installed over 300 PTZ, bullet, and flame-proof cameras at IOCL plants.",
    },
    {
      title: "CSIR - CCMB, Hyderabad",
      description:
        "Installed 350+ CCTV cameras across staff facilities, laboratories, and head office.",
    },
    {
      title: "Atomic Minerals Directorate",
      description:
        "Installed 60 IP cameras with PA systems at Hyderabad AMD and 55 IP cameras at Bengaluru AMD.",
    },
    {
      title: "Aarogyasri - AP",
      description:
        "Installed 1,500 cameras across Andhra Pradesh, including remote locations, within a week.",
    },
    {
      title: "Agricultural Market Committee",
      description:
        "Installed and commissioned 3,000 cameras across AP Market Yards.",
    },
    {
      title: "MP And MLA Colony - Hyderabad",
      description:
        "Commissioned 225 cameras, including 18 ANPR cameras, to monitor vehicle movements.",
    },
    {
      title: "Temples",
      description:
        "Installed 200 cameras at Srisaila Devasthanam, 150 cameras at Sri Kalahasti Temple, and 120 cameras at Kondagattu Anjaneya Swamy Devasthanam.",
    },
    {
      title: "IT Companies",
      description:
        "Installed 600 CCTV cameras for IVY Comptech and 64 IP-based high-definition dome cameras for Dazn Software Pvt. Ltd.",
    },
    {
      title: "AP Beverages Corporation Limited",
      description:
        "Developed Android-based vehicle tracking software for real-time monitoring.",
    },
  ],
  services: [
    {
      category: "Software Products & Services",
      details: [
        "Web Design & Development",
        "Domain & Hosting",
        "IoT Applications",
        "App Development",
        "E-Communication (SMS, WhatsApp, RCS, IVR, Toll-Free Services, AI Chatbots)",
        "BIZ TRACK - ERP (CRM, Sales, Procurement, Marketing, Accounting, Services, Human Resource, Manufacturing)",
      ],
    },
    {
      category: "Security Products",
      details: [
        "CCTV Surveillance",
        "Biometric Time & Attendance / Access Control",
        "Entry Gate Solutions",
        "Home Automation",
        "IP PBX / EPABX",
        "Servers & Networking",
        "Fire Alarm / Intrusion Alarm / Burglar Alarm System",
        "VTS / GPS Tracking",
      ],
    },
    {
      category: "Renewable Energy Solutions",
      details: [
        "Solar rooftop solutions for residential and commercial applications",
        "Solar Smart Pole (Solar Panel, CCTV, WIFI, Ad Display, LED Light, PA System, Intercom, Charging Point)",
        "5MW Solar Project by REIL - Rajasthan",
        "MEDA solar project for 272 Zilla Parishad schools in Maharashtra",
        "990kW Solar Project by TGSRTC - Telangana",
      ],
    },
    {
      category: "IT & Telecommunication",
      details: [
        "Fiber Optic Cables",
        "Servers & Switches",
        "Routers",
        "High-speed internet, cloud computing, mobile networks, 5G, virtualization, and automation",
      ],
    },
    {
      category: "Sector-Wise CCTV Surveillance",
      details: [
        "Government: Solutions for ECI, DRDO, IOCL, etc.",
        "Banks: CCTV, burglar alarms, real-time monitoring for Union Bank, Karur Vysya Bank, etc.",
        "Defence: Real-time surveillance for situational awareness",
        "Commercial: AI-powered CCTV for malls, retail, and corporate buildings",
        "Industrial / Warehouse: Blast-proof cameras, thermal imaging",
        "Residential: Smart surveillance for gated communities and homes",
      ],
    },
    {
      category: "Video Management System (VMS)",
      details: [
        "Upload & Manage Videos",
        "Content Moderation & Approval",
        "Video Streaming & Playback",
        "Security & Access Control",
        "Video Analytics: Real-Time Object Detection, ANPR, Face Recognition, Intrusion Detection, Monitoring Free Physical Space, Fall Detection",
      ],
    },
    {
      category: "Smart Bus Solutions",
      details: [
        "AI CCTV Surveillance",
        "Public Address System",
        "Foam Fire Suppression System",
        "BSD Camera (Blind Spot Pedestrian Detection)",
        "Rear View and Passenger Cameras",
        "Passenger Counter",
        "Wi-Fi Hotspot",
        "Route Information Screens",
        "Breath Analyzer System",
        "LED Display for Advertisements",
        "GPS Tracking",
        "Big Data Analytics",
        "Smart Ticketing (Future)",
      ],
    },
    {
      category: "Law Enforcement – In-Car Surveillance",
      details: [
        "AI-powered in-car surveillance with real-time video monitoring",
        "Facial Recognition",
        "License Plate Reading",
        "Driver Behavior Monitoring",
        "Evidence Playback & Export",
        "Weapon Detection",
        "Applications: Law Enforcement, Election Duty, Prisoner Transport, Border Security",
      ],
    },
    {
      category: "AI Biometric with Aadhaar Authentication",
      details: [
        "Aadhaar-based facial recognition for attendance",
        "AI Facial Recognition with anti-spoofing",
        "Smart Dashboard for real-time insights",
        "WhatsApp & SMS Alerts",
        "Battery Backup & GPS Tracking",
        "Cloud Storage",
        "Use Cases: Educational Institutions, Government Departments",
      ],
    },
    {
      category: "ANWI Products",
      details: [
        "ZENO Series Laptops & All-in-One Systems",
        "Servers, Tower Servers, Switches",
      ],
    },
    {
      category: "TrinAI Products",
      details: [
        "CCTV cameras with AI-powered analytics, night vision, motion detection, remote access",
        "Smart GPU with TrinAI Camera",
      ],
    },
    {
      category: "TechnoRack Products",
      details: [
        "Networking Racks and Enclosures",
        "Pedestal Curved Facia, Pedestal Flat Facia",
        "Inverter / UPS Trolley",
        "Display Kiosk",
      ],
    },
  ],
  contact: [
    {
      officeType: "Corporate Office",
      address:
        "#501, #508-510, Shangrila Plaza, Road No. 2, Park View Enclave, Banjara Hills, Hyderabad, Telangana-500034",
      phoneNumbers: ["988-588-8835", "958-123-4499"],
      emails: ["seo@brihaspathi.com", "info@brihaspathi.com"],
      tollFree: "1800 296 8899",
    },
    {
      officeType: "Registered Office",
      address:
        "7-1-621/259, 5th Floor, Sahithi Arcade, SR Nagar, Hyderabad-500038",
      website: "www.brihaspathi.com",
    },
    {
      officeType: "Manufacturing Unit",
      address:
        "Sy No. 340, Plot No.198/2, 201, 202, 203 & 204, Tuniki Bollaram, Siddipet, TS-502279",
    },
    {
      officeType: "Representative Office",
      address: "Dubai & US",
    },
  ],
  globalFootprint: ["India", "USA", "Dubai"],
  indianFootprint: [
    "Himachal Pradesh",
    "Delhi",
    "Rajasthan",
    "Madhya Pradesh",
    "Maharashtra",
    "Telangana",
    "Uttar Pradesh",
    "Bihar",
    "Assam",
    "Jharkhand",
    "West Bengal",
    "Chhattisgarh",
    "Andhra Pradesh",
    "Karnataka",
    "Tamil Nadu",
  ],
};
