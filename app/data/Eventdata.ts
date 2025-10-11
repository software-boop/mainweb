export type ImageAsset = {
  src: string; // public path or URL
  alt: string; // accessible alt text
  caption?: string; // optional small description shown under image
};

export type EventItem = {
  title: string;
  slug: string;
  date: string; // ISO: YYYY-MM-DD
  endDate?: string; // ISO (optional, for multi-day events)
  description: string;

  // New fields
  heroImage: ImageAsset; // one primary image
  gallery: ImageAsset[]; // multiple supporting images
};

export const EVENTS: EventItem[] = [
  {
    title: "Fathersday",
    slug: "fathersday",
    date: "2025-05-11",
    description:
      "Make this Father’s Day unforgettable! Discover thoughtful gifts, personalized surprises, and heartfelt ideas to show Dad how much he means to you. From unique gadgets and accessories to memorable experiences, find the perfect way to express your love and appreciation.",
    heroImage: {
      src: "/events/fathersday/hero.jpg",
      alt: "Father and child celebrating Father’s Day",
      caption: "Celebrate Dad with thoughtful moments.",
    },
    gallery: [
      {
        src: "/events/fathersday/1.jpg",
        alt: "Personalized gift box",
        caption: "Custom gifts that speak from the heart",
      },
      {
        src: "/events/fathersday/2.jpg",
        alt: "Family brunch setup",
        caption: "Make it a family brunch",
      },
      {
        src: "/events/fathersday/3.jpg",
        alt: "Gadget gift ideas",
        caption: "Smart gadgets for smart dads",
      },
    ],
  },
  {
    title: "independenceday",
    slug: "independenceday",
    date: "2025-08-15",
    description:
      "Bring the spirit of freedom to your office with our exciting Independence Day games! Engage your team in fun challenges, quizzes, and activities that spark creativity, teamwork, and patriotic cheer. Make this celebration memorable while boosting morale and strengthening bonds at work.",
    heroImage: {
      src: "/events/independenceday/hero.jpg",
      alt: "Tricolor decorations for Independence Day",
      caption: "Patriotic vibes at the workplace.",
    },
    gallery: [
      {
        src: "/events/independenceday/1.jpg",
        alt: "Team quiz session",
        caption: "Knowledge + fun = team spirit",
      },
      {
        src: "/events/independenceday/2.jpg",
        alt: "Flag-themed decor",
        caption: "Deck your office in tricolor",
      },
      {
        src: "/events/independenceday/3.jpg",
        alt: "Mini games area",
        caption: "Engaging games for everyone",
      },
    ],
  },
  {
    title: "Janmashtami",
    slug: "janmashtami",
    date: "2025-08-16",
    description:
      "Enjoy traditional dances, devotional songs, and exciting activities that bring the community together to honor Lord Krishna’s birth. From colorful decorations to fun games and cultural performances, make this celebration memorable for all ages.",
    heroImage: {
      src: "/events/janmashtami/hero.jpg",
      alt: "Janmashtami celebration with Krishna decorations",
      caption: "Festive colors and devotion.",
    },
    gallery: [
      {
        src: "/events/janmashtami/1.jpg",
        alt: "Dahi-handi setup",
        caption: "Exciting dahi-handi moments",
      },
      {
        src: "/events/janmashtami/2.jpg",
        alt: "Classical dance performance",
        caption: "Cultural performances for all",
      },
      {
        src: "/events/janmashtami/3.jpg",
        alt: "Flower decorations",
        caption: "Vibrant floral decor",
      },
    ],
  },
  {
    title: "Mothers Day",
    slug: "mothers-day",
    date: "2025-05-11",
    description:
      "Show your mom how much she means to you! Discover thoughtful gifts, personalized surprises, and heartfelt ideas to make her day truly special. From beautiful keepsakes to memorable experiences, make this Mother’s Day unforgettable.",
    heroImage: {
      src: "/events/mothers-day/hero.jpg",
      alt: "Mother and child smiling on Mother’s Day",
      caption: "Because she deserves the world.",
    },
    gallery: [
      {
        src: "/events/mothers-day/1.jpg",
        alt: "Flowers and handmade card",
        caption: "Simple gestures, big smiles",
      },
      {
        src: "/events/mothers-day/2.jpg",
        alt: "Spa voucher gift",
        caption: "Treat her to relaxation",
      },
      {
        src: "/events/mothers-day/3.jpg",
        alt: "Family photo frame",
        caption: "Memories she’ll treasure",
      },
    ],
  },
  {
    title: "Womens day",
    slug: "womens-day",
    date: "2025-03-08",
    description:
      "Honor the incredible women in your life! Celebrate their achievements, strength, and spirit with thoughtful gifts, inspiring stories, and engaging activities. Make this day memorable by showing appreciation and spreading empowerment.",
    heroImage: {
      src: "/events/womens-day/hero.jpg",
      alt: "Women’s Day celebration with coworkers",
      caption: "Celebrate strength and achievements.",
    },
    gallery: [
      {
        src: "/events/womens-day/1.jpg",
        alt: "Awards ceremony",
        caption: "Recognizing contributions",
      },
      {
        src: "/events/womens-day/2.jpg",
        alt: "Panel discussion",
        caption: "Inspiring conversations",
      },
      {
        src: "/events/womens-day/3.jpg",
        alt: "Team photo",
        caption: "Together we rise",
      },
    ],
  },
  {
    title: "Ganesh Chaturthi",
    slug: "ganesh-chaturthi",
    date: "2025-08-27",
    description:
      "Experience the spirit of devotion with vibrant decorations, traditional rituals, and festive activities that bring families and communities together. From eco-friendly Ganesh idols to cultural events, make this festival a memorable and heartwarming occasion.",
    heroImage: {
      src: "/events/ganesh-chaturthi/hero.jpg",
      alt: "Ganesh idol with eco-friendly decor",
      caption: "Eco-friendly devotion.",
    },
    gallery: [
      {
        src: "/events/ganesh-chaturthi/1.jpg",
        alt: "Clay idol workshop",
        caption: "Make your own eco idol",
      },
      {
        src: "/events/ganesh-chaturthi/2.jpg",
        alt: "Aarti ceremony",
        caption: "Tradition and togetherness",
      },
      {
        src: "/events/ganesh-chaturthi/3.jpg",
        alt: "Community prasad",
        caption: "Sharing and gratitude",
      },
    ],
  },
  {
    title: "Tree plantation",
    slug: "tree-plantation",
    date: "2025-04-12",
    description:
      "We planted 600 trees and are committed to making a greener, healthier planet! Join us in our mission to nurture nature, reduce carbon footprints, and create sustainable spaces for future generations. Together, small steps can make a big impact.",
    heroImage: {
      src: "/events/tree-plantation/hero.jpg",
      alt: "Volunteers planting trees",
      caption: "600 saplings, countless futures.",
    },
    gallery: [
      {
        src: "/events/tree-plantation/1.jpg",
        alt: "Team holding saplings",
        caption: "Community in action",
      },
      {
        src: "/events/tree-plantation/2.jpg",
        alt: "Young plants in rows",
        caption: "Greener spaces ahead",
      },
      {
        src: "/events/tree-plantation/3.jpg",
        alt: "Watering newly planted trees",
        caption: "Care that sustains",
      },
    ],
  },
  {
    title: "Health Campign",
    slug: "health-campign",
    date: "2025-07-24",
    description:
      "Your health matters. Participate in our health campaign for free check-ups, wellness tips, and awareness sessions. Together, let’s promote a healthier lifestyle, prevent diseases, and empower communities to take charge of their well-being.",
    heroImage: {
      src: "/events/health-campign/hero.jpg",
      alt: "Health check-up camp",
      caption: "Wellness, awareness, prevention.",
    },
    gallery: [
      {
        src: "/events/health-campign/1.jpg",
        alt: "Blood pressure check",
        caption: "Free screenings",
      },
      {
        src: "/events/health-campign/2.jpg",
        alt: "Doctor consultation desk",
        caption: "Expert guidance",
      },
      {
        src: "/events/health-campign/3.jpg",
        alt: "Nutrition awareness board",
        caption: "Tips for daily wellness",
      },
    ],
  },
  {
    title: "Bathukamma",
    slug: "bathukamma",
    date: "2025-09-19",
    description:
      "the floral festival of Telangana! Experience the joy of beautifully stacked flower arrangements, traditional songs, and lively dances that honor nature and femininity. Celebrate togetherness, culture, and the colors of life.",
    heroImage: {
      src: "/events/bathukamma/hero.jpg",
      alt: "Women celebrating Bathukamma with floral stacks",
      caption: "Colors, culture, and community.",
    },
    gallery: [
      {
        src: "/events/bathukamma/1.jpg",
        alt: "Bathukamma floral arrangement",
        caption: "Stunning floral stacks",
      },
      {
        src: "/events/bathukamma/2.jpg",
        alt: "Traditional songs circle",
        caption: "Songs of celebration",
      },
      {
        src: "/events/bathukamma/3.jpg",
        alt: "Dance performance",
        caption: "Lively rhythmic dances",
      },
    ],
  },
  {
    title: "Delhi expo",
    slug: "delhi-expo",
    date: "2025-07-31",
    endDate: "2025-08-01",
    description:
      "Experience high-definition cameras, smart monitoring systems, and innovative security solutions designed to protect homes, offices, and industries. See how our CCTV technology combines reliability, clarity, and smart features for complete peace of mind.",
    heroImage: {
      src: "/events/delhi-expo/hero.jpg",
      alt: "Delhi Expo booth showcasing security tech",
      caption: "Security that scales.",
    },
    gallery: [
      {
        src: "/events/delhi-expo/1.jpg",
        alt: "CCTV wall display",
        caption: "Crystal-clear surveillance",
      },
      {
        src: "/events/delhi-expo/2.jpg",
        alt: "Smart monitoring demo",
        caption: "Live demos & walkthroughs",
      },
      {
        src: "/events/delhi-expo/3.jpg",
        alt: "Visitors at the booth",
        caption: "Great conversations, great insights",
      },
    ],
  },
  {
    title: "Credai Expo",
    slug: "credai-expo",
    date: "2025-08-15",
    endDate: "2025-08-17",
    description:
      "Credai Expo to explore cutting-edge solar solutions and advanced CCTV technology. From energy-efficient solar panels to smart surveillance systems, experience products designed for sustainability, security, and smart living. Connect with experts, witness live demonstrations, and take your home or business to the next level.",
    heroImage: {
      src: "/events/credai-expo/hero.jpg",
      alt: "Credai Expo stall with solar and CCTV solutions",
      caption: "Sustainability meets security.",
    },
    gallery: [
      {
        src: "/events/credai-expo/1.jpg",
        alt: "Solar panel showcase",
        caption: "Energy-efficient solutions",
      },
      {
        src: "/events/credai-expo/2.jpg",
        alt: "Smart camera lineup",
        caption: "Smarter surveillance",
      },
      {
        src: "/events/credai-expo/3.jpg",
        alt: "Live product demo",
        caption: "Hands-on demonstrations",
      },
    ],
  },
  {
    title: "Solar Campign",
    slug: "solar-campign",
    date: "2025-08-24",
    description:
      "Harness the power of the sun and embrace sustainable living! Our solar campaign promotes clean energy solutions, eco-friendly practices, and cost-saving opportunities for homes and businesses. Together, let’s reduce carbon footprints and build a greener, brighter future.",
    heroImage: {
      src: "/events/solar-campign/hero.jpg",
      alt: "Solar panels installed on rooftop",
      caption: "Clean energy, bright future.",
    },
    gallery: [
      {
        src: "/events/solar-campign/1.jpg",
        alt: "Rooftop solar installation",
        caption: "Scale from home to industry",
      },
      {
        src: "/events/solar-campign/2.jpg",
        alt: "Inverter and monitoring app",
        caption: "Track your savings",
      },
      {
        src: "/events/solar-campign/3.jpg",
        alt: "Team installing panels",
        caption: "Certified installers at work",
      },
    ],
  },
];
