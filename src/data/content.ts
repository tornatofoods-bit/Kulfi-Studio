import {
  FlavorProfile,
  ServiceItem,
  ProjectCaseStudy,
  ProcessStep,
  PricingTier,
  TestimonialReceipt,
  BlogPost
} from '../types';

export const FLAVORS: FlavorProfile[] = [
  {
    id: 'kesar-pista',
    name: 'Royal Kesar Pista',
    subname: 'Saffron & Roasted Pistachio',
    baseColor: '#F4A300',
    secondaryColor: '#FFF6E5',
    accentColor: '#84C57E',
    toppingName: 'Chopped Green Pistachio & Saffron Strands',
    toppingColor: '#4A7C3D',
    roughness: 0.35,
    description: 'Our signature blend: robust enterprise architecture infused with vibrant, reactive frontend aesthetics.'
  },
  {
    id: 'alphonso-mango',
    name: 'Alphonso Gold',
    subname: 'Ratnagiri Sun-Ripened Mango',
    baseColor: '#FFB347',
    secondaryColor: '#FFFDF8',
    accentColor: '#E67E22',
    toppingName: 'Mango Glaze & Golden Flakes',
    toppingColor: '#D35400',
    roughness: 0.28,
    description: 'High-speed, conversion-tuned web platforms built with Next.js and React 19 for unforgettable consumer engagement.'
  },
  {
    id: 'malai-rose',
    name: 'Velvet Malai Rose',
    subname: 'Rose Petal Infused Cream',
    baseColor: '#F7A8B8',
    secondaryColor: '#FFF6E5',
    accentColor: '#D81B60',
    toppingName: 'Dried Damask Rose Petals',
    toppingColor: '#880E4F',
    roughness: 0.42,
    description: 'Silky UI/UX design systems and micro-interactions that make enterprise software feel effortless to touch.'
  },
  {
    id: 'dark-cocoa',
    name: 'Belgian Cardamom Ganache',
    subname: 'Deep Chocolate with Crushed Spice',
    baseColor: '#3B2418',
    secondaryColor: '#5C3826',
    accentColor: '#F4A300',
    toppingName: 'Cocoa Nibs & Silver Leaf',
    toppingColor: '#A08060',
    roughness: 0.5,
    description: 'Heavyweight backend infrastructure, distributed event pipelines, and rock-solid database engineering.'
  },
  {
    id: 'mint-pistachio',
    name: 'Pistachio Mint Breeze',
    subname: 'Garden Mint with Crushed Nuts',
    baseColor: '#84C57E',
    secondaryColor: '#E8F5E9',
    accentColor: '#2E7D32',
    toppingName: 'Crushed Salted Pistachios',
    toppingColor: '#1B5E20',
    roughness: 0.32,
    description: 'Fluid cross-platform mobile experiences for iOS and Android with 60fps native feel.'
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'custom-web',
    name: 'High-Performance Web Platforms',
    flavorTitle: 'Alphonso Mango',
    flavorNote: 'Sub-second load times with crisp Next.js & React architecture',
    badgeColor: '#FFB347',
    shortDesc: 'Custom web applications built from scratch with zero boilerplate bloat. Fast, scalable, and conversion-engineered.',
    fullDesc: 'We build ultra-fast, search-dominant web platforms using modern React 19, Next.js, and edge networks. Designed to handle intense traffic spikes without breaking a sweat or slowing down your checkout pipeline.',
    deliverables: [
      'Tailored Next.js full-stack architecture',
      'Dynamic WebGL & fluid micro-interactions',
      'Lighthouse 95+ performance compliance',
      'Full SEO semantic schema & edge caching'
    ],
    techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Edge CDN'],
    startingPrice: '$4,800',
    turnaround: '3–5 weeks'
  },
  {
    id: 'custom-software',
    name: 'Bespoke Software & Cloud Systems',
    flavorTitle: 'Belgian Ganache',
    flavorNote: 'Deep, resilient backends with ironclad database integrity',
    badgeColor: '#3B2418',
    shortDesc: 'Scalable cloud backends, secure multi-tenant APIs, microservices, and automated internal operational software.',
    fullDesc: 'When off-the-shelf software falls short, we engineer custom business engines tailored to your precise operational rules. From high-throughput financial ledgers to multi-role inventory systems.',
    deliverables: [
      'Event-driven API & microservice architecture',
      'Relational PostgreSQL / Cloud SQL modeling',
      'Role-based access control (RBAC) & OAuth',
      'Real-time WebSocket & data sync pipelines'
    ],
    techStack: ['Node.js', 'PostgreSQL', 'Express', 'Redis', 'Docker', 'Google Cloud'],
    startingPrice: '$8,500',
    turnaround: '6–10 weeks'
  },
  {
    id: 'mobile-apps',
    name: 'Native & Cross-Platform Mobile',
    flavorTitle: 'Pistachio Mint',
    flavorNote: 'Buttery 120Hz gestures and instant offline data sync',
    badgeColor: '#84C57E',
    shortDesc: 'Mobile applications for iOS and Android that feel indistinguishable from hand-crafted native Swift/Kotlin code.',
    fullDesc: 'Engineered for smooth finger travel, offline-first reliability, biometric security, and push notifications. We publish cleanly to App Store and Google Play with complete continuous delivery setup.',
    deliverables: [
      'iOS & Android native deployment pipelines',
      'Biometric authentication (FaceID / TouchID)',
      'Offline SQLite / cache sync capabilities',
      'Integrated in-app purchases & analytics'
    ],
    techStack: ['React Native', 'TypeScript', 'Expo SDK', 'Swift', 'Kotlin', 'Firebase'],
    startingPrice: '$6,200',
    turnaround: '4–7 weeks'
  },
  {
    id: 'ui-ux-design',
    name: 'Artisanal UI/UX & Design Systems',
    flavorTitle: 'Velvet Malai Rose',
    flavorNote: 'Mouth-watering interfaces that users genuinely love to click',
    badgeColor: '#F7A8B8',
    shortDesc: 'Distinctive visual identities, design systems, interactive prototypes, and award-grade digital experiences.',
    fullDesc: 'We ban generic template aesthetics. Every component, typography hierarchy, and transition is custom-crafted to elevate your brand presence and guide prospects smoothly toward conversion.',
    deliverables: [
      'Figma atomic component design library',
      'Interactive tactile micro-animations',
      'High-fidelity user journey wireframes',
      'Complete accessibility (WCAG AA) audit'
    ],
    techStack: ['Figma', 'Framer', 'Three.js', 'Motion', 'Design Tokens'],
    startingPrice: '$3,800',
    turnaround: '2–4 weeks'
  },
  {
    id: 'ai-automation',
    name: 'AI Agents & Workflow Automations',
    flavorTitle: 'Royal Kesar Pista',
    flavorNote: 'Intelligent multi-agent systems and real-time LLM pipelines',
    badgeColor: '#F4A300',
    shortDesc: 'Autonomous workflow bots, vector search, document ingestion, and custom LLM integrations that replace repetitive labor.',
    fullDesc: 'Harness the Google Gemini API and bespoke neural workflows to analyze documents, automate client communication, trigger webhook actions, and unlock proprietary organizational knowledge.',
    deliverables: [
      'Gemini 2.5 / 2.0 Flash integration pipelines',
      'Multi-agent task orchestration & tool calling',
      'Semantic document retrieval & RAG systems',
      'Human-in-the-loop review dashboards'
    ],
    techStack: ['Gemini API', 'TypeScript', 'Python', 'LangChain', 'Vector DB'],
    startingPrice: '$5,500',
    turnaround: '3–6 weeks'
  },
  {
    id: 'seo-maintenance',
    name: 'SEO, Security & Chilled Care',
    flavorTitle: 'Cardamom Crisp',
    flavorNote: 'Proactive uptime monitoring and continuous speed tune-ups',
    badgeColor: '#9C8577',
    shortDesc: 'Continuous server care, automated dependency patching, technical search engine optimization, and SLA-backed support.',
    fullDesc: 'Software is a living organism. Our chilled maintenance retainers ensure your apps stay blazing fast, completely patched against zero-day threats, and permanently indexed at the top of search rankings.',
    deliverables: [
      '24/7 uptime monitoring & instant incident alerts',
      'Monthly security patching & vulnerability audits',
      'Technical SEO audits, schema tags & speed tuning',
      'Dedicated Slack/WhatsApp developer channel'
    ],
    techStack: ['Cloud Monitoring', 'Sentry', 'Search Console', 'GitHub Actions'],
    startingPrice: '$1,200/mo',
    turnaround: 'Continuous'
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Choosing the Flavour',
    dessertMetaphor: 'Flavour Consultation',
    shortDesc: 'We dissect your business goals, user personas, and technical constraints before writing a single line of code.',
    deepDive: 'Through collaborative strategy sessions, we map every core user flow, determine optimal cloud infrastructure, and outline an uncompromising product roadmap.',
    deliverable: 'Technical Architecture Blueprint & Scope Matrix',
    duration: 'Week 1'
  },
  {
    number: '02',
    title: 'Mixing the Batter',
    dessertMetaphor: 'Recipe Formulation',
    shortDesc: 'We craft high-fidelity wireframes, interactive prototypes, and component design tokens tailored to your brand.',
    deepDive: 'We refine the typography, colors, spatial balance, and interactive micro-delights. You test live clickable prototypes on your own devices before development begins.',
    deliverable: 'Interactive Figma Prototype & Design System',
    duration: 'Week 2'
  },
  {
    number: '03',
    title: 'Freezing & Shaping',
    dessertMetaphor: 'Moulding & Freezing',
    shortDesc: 'Our engineers build clean, type-safe code with modular architecture and rigorous test-driven discipline.',
    deepDive: 'From resilient database migrations to buttery 60fps frontend shaders, code is committed daily with automated test suites and preview branches for your review.',
    deliverable: 'Staging Environment with Live Preview Access',
    duration: 'Weeks 3–5'
  },
  {
    number: '04',
    title: 'Toppings & Chilling',
    dessertMetaphor: 'Artisanal Garnishing',
    shortDesc: 'We stress-test performance, accessibility, cross-browser compatibility, and search engine readiness.',
    deepDive: 'We tune every asset, run automated penetration tests, benchmark sub-50ms TTFB across edge regions, and verify full WCAG AA accessibility compliance.',
    deliverable: 'Lighthouse 95+ Audit & Security Clearance',
    duration: 'Week 6'
  },
  {
    number: '05',
    title: 'Served Fresh',
    dessertMetaphor: 'The Sweet Reveal',
    shortDesc: 'Zero-downtime deployment, DNS handover, team walkthroughs, and proactive telemetry monitoring.',
    deepDive: 'We switch production DNS seamlessly, configure automated backups and error alerts, and train your team. Your new digital engine is officially chilling out in the real world.',
    deliverable: 'Production Launch & Full Source Handover',
    duration: 'Day of Launch'
  }
];

export const CASE_STUDIES: ProjectCaseStudy[] = [
  {
    id: 'chaicart-global',
    title: 'ChaiCart Commerce',
    client: 'ChaiCart Global Brands',
    flavorTag: 'Alphonso Mango & Rose',
    category: 'ecommerce',
    categoryLabel: 'E-Commerce Platform',
    summary: 'Direct-to-consumer artisanal marketplace scaling to 1.8M monthly users with zero slowdowns during flash sales.',
    problem: 'Their legacy monolithic shop crashed under 10k concurrent users, took 4.2 seconds to load, and had an abandonment rate of 68%.',
    solution: 'Re-engineered the complete stack onto Next.js App Router, edge-cached Shopify storefront API, and a custom interactive brew customizer.',
    impactMetrics: [
      { value: '+240%', label: 'Checkout Conversion', context: 'Surged within 60 days of launch' },
      { value: '380ms', label: 'Global Page Load', context: 'Down from 4.2 seconds previously' },
      { value: '1.8M', label: 'Active Monthly Buyers', context: 'Handled with 99.99% edge uptime' }
    ],
    technologies: ['Next.js 15', 'Tailwind CSS', 'Shopify Storefront API', 'Redis Edge', 'Stripe'],
    duration: '7 weeks',
    accentGradient: 'from-[#FFB347] to-[#F7A8B8]'
  },
  {
    id: 'neuroflow-health',
    title: 'NeuroFlow Clinical AI',
    client: 'NeuroFlow Health Systems',
    flavorTag: 'Royal Kesar Pista',
    category: 'ai',
    categoryLabel: 'AI Healthcare Platform',
    summary: 'HIPAA-compliant clinical workflow app providing physician note summarization and real-time medical protocol search.',
    problem: 'Clinicians spent 3.5 hours every day transcribing consultations into rigid EHR systems, causing severe administrative burnout.',
    solution: 'Engineered an end-to-end voice transcription and structured extraction dashboard powered by Gemini Flash with strict data encryption.',
    impactMetrics: [
      { value: '62%', label: 'Time Saved per Shift', context: 'Average 2.1 hours recovered daily' },
      { value: '99.8%', label: 'Transcription Accuracy', context: 'Across 42 medical sub-specialties' },
      { value: '45,000+', label: 'Clinical Encounters', context: 'Processed securely every month' }
    ],
    technologies: ['Gemini API', 'TypeScript', 'FastAPI', 'PostgreSQL', 'WebSockets', 'HIPAA Cloud'],
    duration: '9 weeks',
    accentGradient: 'from-[#F4A300] to-[#84C57E]'
  },
  {
    id: 'zaffron-pay',
    title: 'ZaffronPay Mobile Wallet',
    client: 'Zaffron Financial Corp',
    flavorTag: 'Pistachio Mint Breeze',
    category: 'mobile',
    categoryLabel: 'Fintech Mobile App',
    summary: 'Next-generation cross-border remittances app facilitating frictionless payments with sub-second settlement.',
    problem: 'Traditional banking apps suffered from clunky KYC flows, multi-second screen freezing, and poor cross-platform consistency.',
    solution: 'Engineered a fluid React Native app with native Swift/Kotlin biometric bridges, offline balance storage, and micro-animations.',
    impactMetrics: [
      { value: '4.9 ★', label: 'App Store Rating', context: 'Across 14,000+ verified customer reviews' },
      { value: '18s', label: 'Average Onboarding', context: 'Cut from 6 minutes with AI KYC' },
      { value: '$120M+', label: 'Volume Transacted', context: 'Zero security breaches or data leaks' }
    ],
    technologies: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'Biometrics API', 'AWS KMS'],
    duration: '8 weeks',
    accentGradient: 'from-[#84C57E] to-[#FFF6E5]'
  },
  {
    id: 'artisan-loom',
    title: 'Artisan Loom 3D Studio',
    client: 'Loom & Heritage Atelier',
    flavorTag: 'Belgian Cardamom Ganache',
    category: 'web',
    categoryLabel: 'Interactive Web Platform',
    summary: 'Award-winning 3D spatial web application letting interior designers preview custom handwoven textiles in real time.',
    problem: 'Samples took 3 weeks to dye and ship, leading to 45% cancellation rates during the initial custom specification phase.',
    solution: 'Crafted a custom WebGL / Three.js fabric distortion shader allowing photorealistic weaving, thread sheen, and lighting adjustment.',
    impactMetrics: [
      { value: '3.8x', label: 'Dwell Time on Page', context: 'Average 5.2 minutes per session' },
      { value: '+185%', label: 'Commercial Sample Orders', context: 'Generated within initial quarter' },
      { value: 'Awwwards', label: 'Site of the Day', context: 'Recognized for WebGL innovation' }
    ],
    technologies: ['Three.js', 'React 19', 'WebGL GLSL', 'Tailwind CSS', 'Vercel Edge'],
    duration: '6 weeks',
    accentGradient: 'from-[#3B2418] to-[#F4A300]'
  }
];

export const COMPARISON_ITEMS = [
  {
    dimension: 'Code Architecture',
    staleWay: 'Bloated WordPress templates with 48 random plugins that break on every update.',
    kulfiWay: 'Artisanal, clean TypeScript & Next.js built strictly for your business rules.'
  },
  {
    dimension: 'Performance & Speed',
    staleWay: '3 to 6 second load times; red Lighthouse scores; painful mobile stutter.',
    kulfiWay: 'Sub-400ms global edge delivery; guaranteed 95+ Lighthouse performance score.'
  },
  {
    dimension: 'Communication & Rhythm',
    staleWay: 'Two weeks of radio silence followed by a surprise screenshot that misses the mark.',
    kulfiWay: 'Live interactive staging URLs updated continuously with direct WhatsApp/Slack access.'
  },
  {
    dimension: 'Security & Longevity',
    staleWay: 'Abandoned codebase; missing patches; vulnerable to basic automated bot exploits.',
    kulfiWay: 'Hardened headers, zero-dependency philosophy, automated weekly dependency scans.'
  },
  {
    dimension: 'Aesthetic Distinctiveness',
    staleWay: 'Generic AI purple gradients, cloned bootstrap cards, and uninspired stock photos.',
    kulfiWay: 'Custom tactile typography, fluid 3D shaders, and Awwwards-caliber brand presence.'
  }
];

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'single-scoop',
    name: 'Single Scoop',
    scoopTitle: 'The Launchpad / MVP',
    tagline: 'Ideal for early-stage startups and businesses launching a standout web presence.',
    priceProject: '$4,500',
    priceMonthlyRetainer: '$2,400',
    idealFor: 'High-converting landing sites, MVP web apps, rebrands',
    deliveryEstimate: '3–4 weeks delivery',
    features: [
      'Custom bespoke UI/UX design (No templates)',
      'Next.js 15 + React 19 high-performance build',
      'Mobile-first responsive architecture',
      'Lighthouse 95+ performance guarantee',
      'Semantic SEO & OpenGraph setup',
      'Contact lead capture form with instant alerts',
      '30 days post-launch warranty & bug fixes'
    ]
  },
  {
    id: 'double-scoop',
    name: 'Double Scoop',
    scoopTitle: 'The Full-Stack Artisan',
    tagline: 'Our most popular package for scaling companies needing custom applications and web tools.',
    priceProject: '$11,500',
    priceMonthlyRetainer: '$5,200',
    popular: true,
    idealFor: 'Full-stack web apps, e-commerce stores, client portals',
    deliveryEstimate: '5–8 weeks delivery',
    features: [
      'Everything in Single Scoop',
      'Custom database schema (PostgreSQL / Cloud SQL)',
      'Multi-role authentication & user dashboards',
      'Payment gateway (Stripe) & subscription billing',
      'Interactive WebGL 3D elements or animations',
      'Automated email notifications & PDF generation',
      'API integration with CRM & analytics tools',
      '60 days priority support with SLA guarantee'
    ]
  },
  {
    id: 'family-tub',
    name: 'Family Tub',
    scoopTitle: 'The Enterprise Feast',
    tagline: 'Complete digital transformation: mobile apps, custom AI automation, and dedicated team.',
    priceProject: '$24,000+',
    priceMonthlyRetainer: '$9,800',
    idealFor: 'Established brands, high-traffic SaaS, AI-driven operations',
    deliveryEstimate: '8–12 weeks delivery',
    features: [
      'Everything in Double Scoop',
      'Cross-platform iOS & Android mobile application',
      'Custom AI Agent pipeline with Gemini API integration',
      'High-throughput microservices & caching layer',
      'Zero-downtime CI/CD deployment pipelines',
      'Comprehensive SOC2/WCAG accessibility audit',
      'Dedicated lead architect & private Slack channel',
      '90 days 24/7 incident response SLA'
    ]
  }
];

export const TESTIMONIALS: TestimonialReceipt[] = [
  {
    id: 'rec-001',
    receiptNumber: '#KLF-2891',
    clientName: 'Aarav Mehta',
    clientRole: 'Co-founder & CEO',
    clientCompany: 'ChaiCart Brands',
    flavorOrdered: 'Alphonso Mango (Web App)',
    rating: 5,
    reviewText: 'Kulfi Studio completely cured our e-commerce performance headaches. Our mobile checkout conversion jumped 240% in two months. They work with the precision of Michelin-star pastry chefs.',
    dateServed: 'February 2026',
    verifiedOrder: true
  },
  {
    id: 'rec-002',
    receiptNumber: '#KLF-2844',
    clientName: 'Dr. Elena Rostova',
    clientRole: 'Chief of Medical Operations',
    clientCompany: 'NeuroFlow Health',
    flavorOrdered: 'Royal Kesar Pista (AI System)',
    rating: 5,
    reviewText: 'Finding an agency that understands both medical compliance and cutting-edge Gemini LLM latency optimization is almost impossible. Kulfi Studio delivered ahead of schedule and with zero bugs.',
    dateServed: 'January 2026',
    verifiedOrder: true
  },
  {
    id: 'rec-003',
    receiptNumber: '#KLF-2790',
    clientName: 'Marcus Vance',
    clientRole: 'Head of Product',
    clientCompany: 'ZaffronPay Global',
    flavorOrdered: 'Pistachio Mint (Mobile App)',
    rating: 5,
    reviewText: 'The buttery 120fps interactions in our wallet app get praised in nearly every 5-star App Store review. If you want software that feels delicious and bulletproof, hire these folks immediately.',
    dateServed: 'December 2025',
    verifiedOrder: true
  },
  {
    id: 'rec-004',
    receiptNumber: '#KLF-2735',
    clientName: 'Siddharth Roy',
    clientRole: 'Creative Director',
    clientCompany: 'Loom & Heritage',
    flavorOrdered: 'Belgian Cardamom (3D WebGL)',
    rating: 5,
    reviewText: 'Our previous agency spent 6 months building an unresponsive prototype. Kulfi Studio took over, wrote a custom Three.js shader from scratch in 3 weeks, and won us an Awwwards feature. Pure magic.',
    dateServed: 'November 2025',
    verifiedOrder: true
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Why Slow Websites Are Melting Your Inbound Pipeline',
    slug: 'why-slow-websites-melt-pipeline',
    date: 'March 24, 2026',
    readTime: '4 min read',
    category: 'Engineering',
    summary: 'Every 100ms delay costs enterprise brands 1% in conversion. Here is how we tune Next.js 15 and edge caching to keep user experiences sub-zero crisp.',
    content: [
      'In high-growth digital businesses, latency is not just a technical footnote—it is a direct tax on customer trust. When a potential enterprise client clicks an ad or referral link, their tolerance for a white loading spinner is measured in fractions of a second.',
      'By moving computing to edge workers, pre-compiling static page segments, and eliminating heavy third-party tracking scripts, our clients regularly see instantaneous page navigations that keep users engaged throughout the entire sales funnel.'
    ]
  },
  {
    id: 'blog-2',
    title: 'Beyond AI Slop: Crafting Tactile & Human Interfaces',
    slug: 'beyond-ai-slop-human-interfaces',
    date: 'March 12, 2026',
    readTime: '6 min read',
    category: 'Design Systems',
    summary: 'The internet is drowning in cloned purple cards and generic pills. We break down the mathematical principles of distinctive visual identity.',
    content: [
      'When every startup prompts the same model with the same generic instructions, the resulting software looks uniform: floating gradient orbs, rounded-2xl pills, and hollow copywriting.',
      'Distinctive design requires point of view. By introducing intentional typographic tension (like pairing Fraunces display serifs with crisp Plus Jakarta Sans), measured spatial padding, and purposeful physical metaphors, software feels memorable.'
    ]
  },
  {
    id: 'blog-3',
    title: 'Building Production-Grade AI Workflows with Gemini',
    slug: 'production-ai-workflows-gemini',
    date: 'February 28, 2026',
    readTime: '5 min read',
    category: 'Artificial Intelligence',
    summary: 'A practitioner guide to streaming responses, structured tool calling, and human-in-the-loop validation for enterprise software.',
    content: [
      'Moving from an interesting playground demo to a reliable enterprise tool requires strict schema validation, deterministic fallback logic, and sub-second token streaming.',
      'Using the Google Gen AI TypeScript SDK, we construct resilient pipelines where Gemini acts as an intelligent reasoning unit within a tightly governed data sandbox.'
    ]
  }
];

export const TECH_SPRINKLES = [
  { name: 'React 19', color: '#61DAFB', category: 'Frontend' },
  { name: 'Next.js 15', color: '#000000', category: 'Framework' },
  { name: 'TypeScript', color: '#3178C6', category: 'Language' },
  { name: 'Three.js / WebGL', color: '#F4A300', category: '3D & Graphics' },
  { name: 'Tailwind CSS v4', color: '#38BDF8', category: 'Styling' },
  { name: 'Node.js', color: '#539E43', category: 'Backend' },
  { name: 'PostgreSQL', color: '#4169E1', category: 'Database' },
  { name: 'Gemini AI', color: '#8E44AD', category: 'Intelligence' },
  { name: 'React Native', color: '#61DAFB', category: 'Mobile' },
  { name: 'Docker', color: '#2496ED', category: 'DevOps' },
  { name: 'Google Cloud', color: '#EA4335', category: 'Infrastructure' },
  { name: 'Redis Edge', color: '#DC382D', category: 'Caching' },
  { name: 'Motion', color: '#FF0055', category: 'Animation' },
  { name: 'GraphQL', color: '#E10098', category: 'API' }
];
