export type ThemeMode = 'light' | 'dark';

export type DesignCategory =
  | 'Website UI'
  | 'Homepage'
  | 'Landing Page'
  | 'Dashboard'
  | 'App UI'
  | 'Graphic Design'
  | 'Other';

export const DESIGN_CATEGORIES: DesignCategory[] = [
  'Website UI',
  'Homepage',
  'Landing Page',
  'Dashboard',
  'App UI',
  'Graphic Design',
  'Other',
];

export type SkillCategory =
  | 'Frontend Development'
  | 'Backend Development'
  | 'Database'
  | 'UI/UX Design'
  | 'AI Tools'
  | 'Deployment & Hosting';

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Frontend Development',
  'Backend Development',
  'Database',
  'UI/UX Design',
  'AI Tools',
  'Deployment & Hosting',
];

export type MessageStatus = 'unread' | 'read' | 'archived';

export const VALIDATION_LIMITS = {
  ID_REGEX: /^[a-zA-Z0-9_-]+$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MAX: 120,
  TITLE_MAX: 140,
  DESC_MAX: 2000,
  MESSAGE_DESC_MAX: 3000,
  URL_MAX: 600,
} as const;

export interface SiteProfile {
  fullName: string;
  brandName: string;
  professionalTitle: string;
  founderOf?: string;
  location: string;
  tagline: string;
  shortIntro: string;
  profilePhotoUrl: string;
  updatedAt?: unknown;
}

export interface SiteAbout {
  personalIntroduction: string;
  myJourney: string;
  webDevBackground: string;
  entrepreneurship: string;
  education: string;
  professionalGoals: string;
  updatedAt?: unknown;
}

export interface SiteSettings {
  contactEmail: string;
  whatsappNumber: string;
  githubUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  threadsUrl?: string;
  behanceUrl?: string;
  dribbbleUrl?: string;
  pinterestUrl?: string;
  telegramUrl?: string;
  copyrightNotice: string;
  cvUrl?: string;
  cvFileName?: string;
  cvPublic: boolean;
  seoTitle: string;
  seoDescription: string;
  seoShareImageUrl?: string;
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
  updatedAt?: unknown;
}

export interface DesignItem {
  id: string;
  title: string;
  description: string;
  category: DesignCategory;
  imageUrl: string;
  altText: string;
  externalLink?: string;
  creationDate: string;
  published: boolean;
  featured: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  technologies: string[];
  screenshotUrls: string[];
  liveDemoUrl?: string;
  githubUrl?: string;
  status: string;
  featured: boolean;
  published: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  proficiency?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  kind: 'experience' | 'education';
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  description: string;
  certificateUrl?: string;
  imageUrl?: string;
  published: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  startingPrice?: string;
  imageUrl?: string;
  published: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  whatsapp?: string;
  projectType: string;
  budgetRange?: string;
  description: string;
  status: MessageStatus;
  submittedAt?: unknown;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

export type AiChatMode = 'auto' | 'balanced' | 'deep' | 'fast';
export type AiChatPersona = 'concierge' | 'strategist' | 'researcher';

export interface AiGroundSource {
  title: string;
  uri: string;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
  modelUsed?: string;
  grounded?: boolean;
  searchQueries?: string[];
  sources?: AiGroundSource[];
}

export interface AiChatThread {
  id: string;
  title: string;
  persona: AiChatPersona;
  mode: AiChatMode;
  useSearch: boolean;
  messages: AiChatMessage[];
  updatedAt: string;
}
