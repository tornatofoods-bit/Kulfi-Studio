export interface FlavorProfile {
  id: string;
  name: string;
  subname: string;
  baseColor: string;
  secondaryColor: string;
  accentColor: string;
  toppingName: string;
  toppingColor: string;
  roughness: number;
  description: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  flavorTitle: string;
  flavorNote: string;
  badgeColor: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  techStack: string[];
  startingPrice: string;
  turnaround: string;
}

export interface MetricItem {
  value: string;
  label: string;
  context: string;
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  client: string;
  flavorTag: string;
  category: 'web' | 'mobile' | 'ai' | 'ecommerce';
  categoryLabel: string;
  summary: string;
  problem: string;
  solution: string;
  impactMetrics: MetricItem[];
  technologies: string[];
  duration: string;
  accentGradient: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  dessertMetaphor: string;
  shortDesc: string;
  deepDive: string;
  deliverable: string;
  duration: string;
}

export interface PricingTier {
  id: string;
  name: string;
  scoopTitle: string;
  tagline: string;
  priceProject: string;
  priceMonthlyRetainer: string;
  popular?: boolean;
  idealFor: string;
  features: string[];
  deliveryEstimate: string;
}

export interface TestimonialReceipt {
  id: string;
  receiptNumber: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  flavorOrdered: string;
  rating: number;
  reviewText: string;
  dateServed: string;
  verifiedOrder: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  readTime: string;
  category: string;
  summary: string;
  content: string[];
}

export interface BriefFormData {
  fullName: string;
  email: string;
  companyName: string;
  serviceType: string;
  budgetRange: string;
  timeline: string;
  projectVision: string;
}
