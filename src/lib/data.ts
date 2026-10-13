import {
  Brain,
  Facebook,
  Github,
  Leaf,
  Linkedin,
  Mail,
  Phone,
  ScanSearch,
  ShoppingBag,
  Tent,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import type { VisualKey } from "@/components/project-visuals";

// Source of truth: public/Resume.pdf (CV Moktada Zaidi, 2026).

export const profile = {
  name: "Moktada Zaidi",
  title: "Full-Stack Developer",
  tagline: "Management software & web applications",
  location: "Tunis, Tunisia",
  email: "moktadazaidi@gmail.com",
  phone: "+216 96 685 112",
  website: "https://www.moktadazaidi.me",
  github: "https://github.com/mo9tada",
  roles: ["Full-Stack Developer", "Management Software", "Web Applications", "Applied AI · RAG · YOLO"],
  summary:
    "Full-stack developer with a bachelor's degree in computer science and hands-on experience with financial applications and Tunisian regulatory compliance (Vermeg), as well as SaaS management platforms. Autonomous from requirements analysis through to production, I build fast applications that are simple to use for clients and their teams alike.",
};

export type Experience = {
  company: string;
  sector?: string;
  role: string;
  type: string;
  period: string;
  current?: boolean;
  /** A pitch or proposal rather than a role — not counted as a position. */
  proposal?: boolean;
  project?: string;
  points: string[];
  stack?: string[];
};

export const experiences: Experience[] = [
  {
    company: "Tamezrate",
    sector: "Agri-food",
    role: "Technical Lead",
    type: "Freelance, then 4-month fixed-term contract",
    period: "Jun 2026 – Sep 2026",
    points: [
      "Designed, developed and deployed the company's web application.",
      "Chose and set up the production infrastructure: VPS, Cloudflare DNS, business email, backups and transactional emails.",
    ],
    stack: ["Next.js", "Node.js", "MySQL"],
  },
  {
    company: "VamiSec",
    role: "UI/UX Proposal",
    type: "Design proposal",
    proposal: true,
    period: "Jul 2026 – Aug 2026",
    project: "VamiGRC — multi-tenant SaaS for governance, risk & compliance",
    points: ["Proposed UI/UX improvement ideas for the platform and presented them to the team and the CEO."],
  },
  {
    company: "Vermeg",
    sector: "Banking & Insurance",
    role: "Final-Year Intern",
    type: "End-of-studies internship",
    period: "Feb 2026 – Jun 2026",
    project: "SmartFinance Advisor — financial analysis platform for analysts",
    points: [
      "Medallion-architecture data pipeline: automated stock-market data collection and KPI computation.",
      "Forecasting module (Prophet) and Power BI decision dashboards.",
      "AI assistant (RAG) giving compliance answers grounded in Tunisian financial legislation.",
    ],
    stack: ["Angular", "TypeScript", "Python", "PostgreSQL", "Power BI"],
  },
  {
    company: "Architectural Plan Detection",
    role: "Freelance Developer",
    type: "Freelance",
    period: "Sep 2025 – Feb 2026",
    project: "Web app for viewing and analysing architectural plans",
    points: [
      "High-resolution plan viewer (OpenSeadragon) with automatic component detection.",
      "Python pipeline: template matching and non-maximum suppression, with YOLOv11 as a fallback.",
    ],
    stack: ["Next.js", "TypeScript", "Python"],
  },
  {
    company: "ScoutsMT",
    sector: "Scouts of Menzel Temime",
    role: "Head of Development",
    type: "Volunteer",
    period: "Jun 2025 – Present",
    current: true,
    project: "Group management platform",
    points: ["Platform with a subscription system and admin dashboards."],
    stack: ["Next.js", "TypeScript"],
  },
  {
    company: "Postery",
    role: "Founder & Developer",
    type: "Personal venture",
    period: "Jun 2025 – Sep 2025",
    project: "Personal e-commerce store",
    points: ["Created, developed and ran my own online store."],
    stack: ["Next.js", "TypeScript"],
  },
];

export type ProjectCategory = "AI & Data" | "Management" | "Web & E-commerce";

export type Project = {
  name: string;
  context: string;
  category: ProjectCategory;
  blurb: string;
  tags: string[];
  icon: LucideIcon;
  hue: string;
  visual: VisualKey;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "SmartFinance Advisor",
    context: "Vermeg · 2026",
    category: "AI & Data",
    blurb: "Financial analysis platform: Medallion data pipeline, Prophet forecasting, Power BI dashboards and a RAG assistant for Tunisian compliance.",
    tags: ["Angular", "Python", "PostgreSQL", "Power BI", "RAG"],
    icon: Brain,
    hue: "#6366F1",
    visual: "finance",
    featured: true,
  },
  {
    name: "Plan Component Detection",
    context: "Freelance · 2025–26",
    category: "AI & Data",
    blurb: "High-resolution architectural plan viewer with automatic component detection via template matching, NMS and a YOLOv11 fallback.",
    tags: ["Next.js", "TypeScript", "Python", "YOLOv11"],
    icon: ScanSearch,
    hue: "#0EA5E9",
    visual: "blueprint",
    featured: true,
  },
  {
    name: "ScoutsMT Platform",
    context: "Scouts of Menzel Temime · 2025–now",
    category: "Management",
    blurb: "Management platform for the scout group, with subscriptions and administration dashboards.",
    tags: ["Next.js", "TypeScript"],
    icon: Tent,
    hue: "#10B981",
    visual: "dashboard",
    featured: true,
  },
  {
    name: "Tamezrate Web App",
    context: "Tamezrate · 2026",
    category: "Web & E-commerce",
    blurb: "The company's web application, plus its full production stack: VPS, Cloudflare DNS, email, backups and transactional mail.",
    tags: ["Next.js", "Node.js", "MySQL", "VPS"],
    icon: Leaf,
    hue: "#84CC16",
    visual: "infra",
  },
  {
    name: "Club MC27",
    context: "Side project",
    category: "Management",
    blurb: "Venue management platform with bookings, a promotional prize wheel and an administration back office.",
    tags: ["Bookings", "Back office"],
    icon: Ticket,
    hue: "#F59E0B",
    visual: "wheel",
  },
  {
    name: "Postery",
    context: "Founder · 2025",
    category: "Web & E-commerce",
    blurb: "My own online store — designed, built and operated end to end.",
    tags: ["Next.js", "TypeScript", "E-commerce"],
    icon: ShoppingBag,
    hue: "#EC4899",
    visual: "posters",
  },
];

export const skillGroups = [
  { label: "Frontend", items: ["React", "Next.js", "Angular", "TypeScript", "JavaScript", "HTML5", "CSS3"] },
  { label: "Backend & Data", items: ["Node.js", "PHP", "Python", "PostgreSQL", "MySQL", "Supabase", "Power BI"] },
  { label: "Mobile", items: ["Flutter", "Dart", "React Native"] },
  { label: "Other", items: ["Java", "C/C++", "RAG", "YOLO", "VPS hosting"] },
];

export const allSkills = skillGroups.flatMap((g) => g.items);

export const qualities = ["Autonomy", "Sense of responsibility", "Time & stress management", "Leadership (scouting)", "Creativity"];

export const education = {
  degree: "Bachelor's in Computer Science",
  school: "Higher Institute of Computer Science of Mahdia (ISIMa)",
  university: "University of Monastir",
  period: "Sep 2023 – Jun 2026",
};

export const spokenLanguages = [
  { name: "Arabic", level: "Fluent", value: 3 },
  { name: "French", level: "Fluent", value: 3 },
  { name: "English", level: "Fluent", value: 3 },
  { name: "German", level: "Basic", value: 1 },
];

export const certifications = [
  { name: "Fundamentals of AI", issuer: "NVIDIA" },
  { name: "AI in Business", issuer: "NMTC 2023" },
  { name: "COVID-19 Volunteering", issuer: "Tunisian Scouts" },
];

export type SocialLink = {
  label: string;
  handle: string;
  href: string;
  icon: LucideIcon;
};

export const socials: SocialLink[] = [
  { label: "Email", handle: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: "Phone", handle: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}`, icon: Phone },
  { label: "LinkedIn", handle: "in/moktada-zaidi", href: "https://www.linkedin.com/in/moktada-zaidi-677b94313/", icon: Linkedin },
  { label: "GitHub", handle: "github.com/mo9tada", href: profile.github, icon: Github },
  { label: "Facebook", handle: "Moktada Zaidi", href: "https://www.facebook.com/moktada.zaidi/", icon: Facebook },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/Biography", label: "About" },
  { href: "/Experience", label: "Experience" },
  { href: "/Projects", label: "Projects" },
  { href: "/Contact", label: "Contact" },
];
