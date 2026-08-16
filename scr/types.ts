export type PlanType = 'gratis' | 'basico' | 'pro' | 'pro_annual' | 'pro_plus' | 'premium';

export const isProUser = (plan?: PlanType): boolean => {
  return plan === 'pro' || plan === 'pro_annual' || plan === 'pro_plus' || plan === 'premium';
};

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  ebooksCreatedCount: number;
  monthlyLimit: number; // 3 for basico, 10 for pro, 20 for pro_annual
  maxPagesPerEbook: number; // 12 for basico, 18 for pro/pro_annual
  subscriptionDate: string;
  planExpiryDate?: string; // 30 days for basico/pro, 365 days for pro_annual
  lastResetDate?: string;
  nextMonthlyResetDate?: string;
  isLoggedIn?: boolean;
  hasActiveSubscription?: boolean;
}

export type EbookGenre =
  | 'negocios'
  | 'culinaria'
  | 'desenvolvimento'
  | 'tecnologia'
  | 'saude'
  | 'infantil'
  | 'ficcao'
  | 'educacao'
  | 'financas'
  | 'outro';

export type EbookTone =
  | 'profissional'
  | 'descontraido'
  | 'educativo'
  | 'inspirador'
  | 'tecnico';

export type LayoutTemplate =
  | 'editorial'
  | 'minimalist'
  | 'creative'
  | 'corporate'
  | 'warm'
  | 'pastel'
  | 'pro_luxury'
  | 'pro_editorial_gold'
  | 'pro_tech_dark'
  | 'pro_nordic'
  | 'pro_magazine'
  | 'pro_royal_navy';

export interface EbookInput {
  title: string;
  subtitle: string;
  author: string;
  genre: EbookGenre;
  customGenre?: string;
  targetAudience: string;
  tone: EbookTone;
  description: string;
  pageCount: number;
  template: LayoutTemplate;
  fontHeading: string;
  fontBody: string;
  primaryColor: string;
  accentColor: string;
  headingColor?: string;
  bodyColor?: string;
  coverImageUrl?: string;
  contentDepth?: 'standard' | 'deep';
  language?: string;
  useAiIllustrations?: boolean;
  useNativeCharts?: boolean;
  use3070Layout?: boolean;
  aspectRatio?: 'A4' | '16:9' | '4:5';
}

export type BlockType =
  | 'heading'
  | 'subheading'
  | 'paragraph'
  | 'bullet_list'
  | 'quote'
  | 'callout'
  | 'image'
  | 'key_takeaways'
  | 'checklist'
  | 'stat_grid'
  | 'chart_bars'
  | 'comparison_table'
  | 'kpi_trending'
  | 'circle_metrics'
  | 'process_timeline'
  | 'badge_features';

export interface StatItem {
  label: string;
  value: string;
  desc?: string;
}

export interface ChartBarItem {
  label: string;
  percentage: number;
  valueStr?: string;
}

export interface TableContent {
  headers: string[];
  rows: string[][];
}

export interface EbookPageBlock {
  id: string;
  type: BlockType;
  content: string | string[];
  icon?: string;
  imageUrl?: string;
  imageAlt?: string;
  stats?: StatItem[];
  chartItems?: ChartBarItem[];
  tableData?: TableContent;
}

export type PageType = 'cover' | 'toc' | 'intro' | 'chapter' | 'summary' | 'back_cover';

export type LayoutVariant = 'standard' | 'split' | 'hero-top' | 'quote-centered' | 'grid-cards';

export interface EbookPage {
  pageNumber: number;
  title: string;
  type: PageType;
  blocks: EbookPageBlock[];
  layoutVariant?: LayoutVariant;
  headerIcon?: string;
  imageKeyword?: string;
}

export interface Ebook {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  genre: string;
  tone: string;
  template: LayoutTemplate;
  fontHeading: string;
  fontBody: string;
  primaryColor: string;
  accentColor: string;
  headingColor?: string;
  bodyColor?: string;
  coverImageUrl?: string;
  pages: EbookPage[];
  createdAt: string;
  language: string;
  titleTransform?: 'uppercase' | 'normal';
  subtitleTransform?: 'uppercase' | 'normal';
  aspectRatio?: 'A4' | '16:9' | '4:5';
}

export interface UnsplashImage {
  id: string;
  url: string;
  thumb: string;
  alt: string;
  author: string;
}
