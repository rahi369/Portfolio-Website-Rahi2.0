import {
  ExperienceItem,
  ProjectItem,
  ServiceItem,
  SiteAbout,
  SiteProfile,
  SiteSettings,
  SkillItem,
} from '../types';

// Real portrait uploaded by Md. Humaun Husen Rahi
export const REAL_PROFILE_PHOTO =
  '/assets/aistudio/file_0000000078d082119ff34435498d89ca_c2719d2b.png';

export const DEFAULT_PROFILE: SiteProfile = {
  fullName: 'Md. Humaun Husen Rahi',
  brandName: 'Vexora Studio',
  professionalTitle: 'Freelancer | Web Developer | Entrepreneur',
  founderOf: "SAMIA'S CLOSET",
  location: 'Rajnagar, Moulvibazar, Bangladesh',
  tagline: 'Building Digital Experiences That Grow Businesses.',
  shortIntro:
    "I am Md. Humaun Husen Rahi, owner of Vexora Studio and founder of SAMIA'S CLOSET based in Rajnagar, Moulvibazar, Bangladesh. I design and build modern, responsive websites, AI-powered interfaces, and digital storefronts that help brands grow online.",
  profilePhotoUrl: REAL_PROFILE_PHOTO,
};

export const DEFAULT_ABOUT: SiteAbout = {
  personalIntroduction:
    "Hello, I am Md. Humaun Husen Rahi (RAHI), a freelance web developer, designer, and entrepreneur from Rajnagar, Moulvibazar, Bangladesh. I focus on crafting fast, accessible, and conversion-ready web platforms tailored to real business needs.",
  myJourney:
    'My path began with a curiosity for how modern websites turn ideas into thriving digital storefronts and brands. Over time I moved from experimenting with layouts and visual design to architecting full-stack web applications powered by React and Firebase.',
  webDevBackground:
    'I specialize in building clean, responsive user interfaces with React, Vite, and Tailwind CSS backed by Firebase Authentication and Cloud Firestore. Every project is built with clear information hierarchy, mobile-first responsiveness, and maintainable code.',
  entrepreneurship:
    "As the founder of SAMIA'S CLOSET, I experience firsthand what business owners need from technology—clear product presentation, trustworthy branding, reliable performance on mobile devices, and frictionless customer communication.",
  education:
    'Add your academic institutions, degrees, and coursework directly from the Admin Panel under Experience & Education.',
  professionalGoals:
    'To partner with ambitious founders, local brands, and international clients to deliver reliable web software, intuitive UI/UX design systems, and measurable digital growth.',
};

export const DEFAULT_SETTINGS: SiteSettings = {
  contactEmail: 'rahihumaun369@gmail.com',
  whatsappNumber: '',
  githubUrl: '',
  linkedinUrl: '',
  facebookUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  tiktokUrl: '',
  threadsUrl: '',
  behanceUrl: '',
  dribbbleUrl: '',
  pinterestUrl: '',
  telegramUrl: '',
  copyrightNotice: '© 2026 Vexora Studio · Owner: Md. Humaun Husen Rahi. All rights reserved.',
  cvUrl: '',
  cvFileName: '',
  cvPublic: false,
  seoTitle: 'Vexora Studio — Md. Humaun Husen Rahi | Web Developer & Entrepreneur',
  seoDescription:
    "Official portfolio of Vexora Studio, owned by Md. Humaun Husen Rahi (Rahi) — Freelancer, Web Developer & Founder of SAMIA'S CLOSET.",
  seoShareImageUrl: REAL_PROFILE_PHOTO,
  cloudinaryCloudName: '',
  cloudinaryUploadPreset: '',
};

// Strictly confirmed real projects only — no invented URLs or completion stats
export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'samias-closet',
    title: "SAMIA'S CLOSET",
    description:
      "Brand & digital presence for SAMIA'S CLOSET, founded by Md. Humaun Husen Rahi to deliver curated apparel with a clean mobile-first shopping experience.",
    problem:
      'Needed a cohesive, trustworthy digital brand identity and structured catalog experience tailored for mobile shoppers.',
    solution:
      'Designed and structured a responsive web storefront focused on clear visual hierarchy, intuitive browsing, and direct customer inquiry channels.',
    technologies: ['React', 'Tailwind CSS', 'Firebase'],
    screenshotUrls: [],
    liveDemoUrl: '',
    githubUrl: '',
    status: 'Founder & Ongoing',
    featured: true,
    published: true,
  },
  {
    id: 'ai-studio-selling-website',
    title: 'AI Studio Selling Website',
    description:
      'Commercial web application crafted to showcase and sell digital products and services with streamlined navigation and modern responsive UI.',
    problem:
      'Required an organized online platform to present offerings clearly across desktop and Android mobile screens.',
    solution:
      'Built a clean component-driven frontend with structured product/service presentation and responsive layout architecture.',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Firebase'],
    screenshotUrls: [],
    liveDemoUrl: '',
    githubUrl: '',
    status: 'Active Project',
    featured: true,
    published: true,
  },
  {
    id: 'rahi-portfolio',
    title: 'RAHI Personal Portfolio Platform',
    description:
      'Full-stack personal branding platform, dynamic Design Gallery, project showcase, client contact system, and private Admin CMS built for Md. Humaun Husen Rahi.',
    problem:
      'Needed a unified personal portfolio where visitors can inspect real design work and send inquiries while every section remains editable via a private backend-secured Admin Panel.',
    solution:
      'Engineered with React, TypeScript, Tailwind CSS, Cloud Firestore, Firebase Auth, and authenticated asset uploads with role-enforced Firestore security rules.',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Firebase', 'Express'],
    screenshotUrls: [],
    liveDemoUrl: '',
    githubUrl: '',
    status: 'In Production',
    featured: true,
    published: true,
  },
];

// Strictly confirmed stack skills — optional proficiency left blank unless set in Admin
export const DEFAULT_SKILLS: SkillItem[] = [
  {
    id: 'skill-react',
    name: 'React & TypeScript',
    category: 'Frontend Development',
    description: 'Building modular, accessible single-page applications with clean state architecture.',
    proficiency: '',
  },
  {
    id: 'skill-tailwind',
    name: 'Tailwind CSS & Modern CSS',
    category: 'Frontend Development',
    description: 'Crafting responsive mobile-first layouts, editorial typography, and light/dark design systems.',
    proficiency: '',
  },
  {
    id: 'skill-vite',
    name: 'Vite',
    category: 'Frontend Development',
    description: 'Fast modern frontend bundling, asset optimization, and production builds.',
    proficiency: '',
  },
  {
    id: 'skill-express',
    name: 'Node.js & Express',
    category: 'Backend Development',
    description: 'Server-side endpoints for SEO sitemaps, security headers, and authenticated file uploads.',
    proficiency: '',
  },
  {
    id: 'skill-firebase-auth',
    name: 'Firebase Authentication',
    category: 'Backend Development',
    description: 'Secure Google Sign-In and Email/Password authentication flows.',
    proficiency: '',
  },
  {
    id: 'skill-firestore',
    name: 'Cloud Firestore & Security Rules',
    category: 'Database',
    description: 'Real-time NoSQL data modeling backed by strict schema and role-based security rules.',
    proficiency: '',
  },
  {
    id: 'skill-uiux',
    name: 'UI/UX & Web Interface Design',
    category: 'UI/UX Design',
    description: 'Designing websites, homepages, landing pages, dashboards, and mobile app interfaces.',
    proficiency: '',
  },
  {
    id: 'skill-ai-tools',
    name: 'AI Development Workflows',
    category: 'AI Tools',
    description: 'Leveraging modern AI tools for rapid prototyping, content structuring, and engineering productivity.',
    proficiency: '',
  },
  {
    id: 'skill-vercel-github',
    name: 'GitHub & Vercel Deployment',
    category: 'Deployment & Hosting',
    description: 'Version control workflows and production deployment pipelines.',
    proficiency: '',
  },
];

// Strictly confirmed roles only — no invented past companies or dates
export const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp-samias-closet',
    title: 'Founder',
    organization: "SAMIA'S CLOSET",
    kind: 'experience',
    description:
      "Leading brand direction, digital storefront strategy, and customer experience for SAMIA'S CLOSET.",
    startDate: 'Present',
    endDate: '',
    isCurrent: true,
  },
  {
    id: 'exp-freelance-dev',
    title: 'Freelance Web Developer & UI/UX Designer',
    organization: 'Independent (RAHI)',
    kind: 'experience',
    description:
      'Designing and developing business websites, personal portfolios, landing pages, and custom web applications for clients.',
    startDate: 'Present',
    endDate: '',
    isCurrent: true,
  },
];

// Optional starting prices left blank — never invent prices
export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'svc-business-website',
    title: 'Business Website Development',
    description:
      'Complete company websites built to establish credibility, explain your services clearly, and convert visitors into inquiries.',
    features: [
      'Mobile-first responsive layout',
      'SEO metadata, sitemap, and fast load performance',
      'Direct contact form and WhatsApp integration',
    ],
    startingPrice: '',
    imageUrl: '',
    published: true,
  },
  {
    id: 'svc-portfolio',
    title: 'Personal Portfolio Development',
    description:
      'Editorial personal branding sites for founders, creators, and professionals with custom admin content controls.',
    features: [
      'Custom visual identity and typography',
      'Project case studies and image gallery',
      'Private Admin Panel for easy updates',
    ],
    startingPrice: '',
    imageUrl: '',
    published: true,
  },
  {
    id: 'svc-ecommerce',
    title: 'E-commerce Website Development',
    description:
      'Online storefronts engineered for smooth product discovery, clear merchandising, and reliable mobile shopping.',
    features: [
      'Catalog filtering and clean product views',
      'Order management and customer workflows',
      'Performance-tuned media loading',
    ],
    startingPrice: '',
    imageUrl: '',
    published: true,
  },
  {
    id: 'svc-landing-page',
    title: 'Landing Page Design',
    description:
      'Focused single-page campaign sites designed around clear messaging and high-intent call-to-action flows.',
    features: [
      'Conversion-oriented visual hierarchy',
      'Custom responsive sections',
      'Lead capture validation',
    ],
    startingPrice: '',
    imageUrl: '',
    published: true,
  },
  {
    id: 'svc-redesign',
    title: 'Website Redesign',
    description:
      'Modernizing outdated websites with cleaner typography, improved mobile usability, and stronger brand presentation.',
    features: [
      'UX audit and layout restructuring',
      'Modern component architecture',
      'Accessibility and contrast improvements',
    ],
    startingPrice: '',
    imageUrl: '',
    published: true,
  },
  {
    id: 'svc-maintenance',
    title: 'Website Maintenance',
    description:
      'Ongoing content updates, security rule reviews, performance checks, and bug fixes to keep your site dependable.',
    features: [
      'Regular updates and troubleshooting',
      'Security and dependency checks',
      'Responsive UI refinements',
    ],
    startingPrice: '',
    imageUrl: '',
    published: true,
  },
  {
    id: 'svc-custom-apps',
    title: 'Custom Web Applications',
    description:
      'Tailored React and Firebase web applications with authentication, role-protected dashboards, and real-time databases.',
    features: [
      'Firebase Auth and Firestore security rules',
      'Custom Admin dashboards and workflows',
      'Clean maintainable TypeScript codebase',
    ],
    startingPrice: '',
    imageUrl: '',
    published: true,
  },
];
