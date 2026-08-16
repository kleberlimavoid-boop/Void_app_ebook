import { LayoutTemplate } from '../types';

export interface TemplateConfig {
  id: LayoutTemplate;
  name: string;
  tagline: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  bgTone: string;
  cardBg: string;
  borderStyle: string;
  fontHeading: string;
  fontBody: string;
  previewBg: string;
  badgeText: string;
  tier?: 'basico' | 'pro';
}

export const DIAGRAMATION_TEMPLATES: TemplateConfig[] = [
  {
    id: 'editorial',
    name: 'Editorial Moderno',
    tagline: 'Elegante, equilibrado e profissional',
    description: 'Perfeito para livros de negócios, guias e conteúdos corporativos de alto nível.',
    primaryColor: '#2563EB', // Blue 600
    accentColor: '#F59E0B', // Amber 500
    bgTone: '#FAFAFA',
    cardBg: '#FFFFFF',
    borderStyle: 'border-slate-200',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Inter',
    previewBg: 'bg-gradient-to-br from-blue-50 to-amber-50',
    badgeText: 'Mais Popular',
    tier: 'basico',
  },
  {
    id: 'minimalist',
    name: 'Minimalista Clean',
    tagline: 'Foco total na leitura e clareza',
    description: 'Espaçoso, sem distrações, ideal para ensaios, literatura e desenvolvimento pessoal.',
    primaryColor: '#18181B', // Zinc 900
    accentColor: '#71717A', // Zinc 500
    bgTone: '#FFFFFF',
    cardBg: '#F4F4F5',
    borderStyle: 'border-zinc-200',
    fontHeading: 'Playfair Display',
    fontBody: 'Lora',
    previewBg: 'bg-zinc-50',
    badgeText: 'Leitura Fluida',
    tier: 'basico',
  },
  {
    id: 'creative',
    name: 'Criativo & Vibrante',
    tagline: 'Moderno com destaques dinâmicos',
    description: 'Ótimo para cursos, receitas, livros infantis e conteúdos visuais e cativantes.',
    primaryColor: '#7C3AED', // Violet 600
    accentColor: '#EC4899', // Pink 500
    bgTone: '#FAF5FF',
    cardBg: '#FFFFFF',
    borderStyle: 'border-purple-200',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Inter',
    previewBg: 'bg-gradient-to-br from-purple-50 to-pink-50',
    badgeText: 'Expressivo',
    tier: 'basico',
  },
  {
    id: 'corporate',
    name: 'Executivo Corporativo',
    tagline: 'Sério, confiável e bem estruturado',
    description: 'Indicado para relatórios, whitepapers, métodos e e-books de vendas B2B.',
    primaryColor: '#0F172A', // Slate 900
    accentColor: '#0284C7', // Sky 600
    bgTone: '#F8FAFC',
    cardBg: '#FFFFFF',
    borderStyle: 'border-slate-200',
    fontHeading: 'Space Grotesk',
    fontBody: 'Inter',
    previewBg: 'bg-gradient-to-br from-slate-100 to-sky-50',
    badgeText: 'Executivo',
    tier: 'basico',
  },
  {
    id: 'warm',
    name: 'Sereno & Natural',
    tagline: 'Tons terrosos e atmosfera acolhedora',
    description: 'Ideal para bem-estar, saúde, gastronomia, yoga e estilo de vida.',
    primaryColor: '#059669', // Emerald 600
    accentColor: '#D97706', // Amber 600
    bgTone: '#FDFBF7',
    cardBg: '#FFFFFF',
    borderStyle: 'border-amber-100',
    fontHeading: 'Merriweather',
    fontBody: 'Lora',
    previewBg: 'bg-gradient-to-br from-emerald-50 to-amber-50',
    badgeText: 'Harmônico',
    tier: 'basico',
  },
  {
    id: 'pastel',
    name: 'Soft Pastel',
    tagline: 'Suave, amigável e contemporâneo',
    description: 'Excelente para educação, autoajuda, finanças pessoais e manuais passo a passo.',
    primaryColor: '#0D9488', // Teal 600
    accentColor: '#F43F5E', // Rose 500
    bgTone: '#F0FDFA',
    cardBg: '#FFFFFF',
    borderStyle: 'border-teal-100',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Inter',
    previewBg: 'bg-gradient-to-br from-teal-50 to-rose-50',
    badgeText: 'Suave',
    tier: 'basico',
  },

  // --- 6 PRO PRESETS ---
  {
    id: 'pro_luxury',
    name: 'Noir Luxury & Ouro',
    tagline: 'Opulência, contraste escuro e detalhes dourados',
    description: 'Design de altíssimo luxo para e-books VIP, finanças, gastronomia gourmet e marcas de alto valor.',
    primaryColor: '#0F172A', // Slate 900
    accentColor: '#D97706', // Amber Gold 600
    bgTone: '#090D16',
    cardBg: '#1E293B',
    borderStyle: 'border-amber-500/30',
    fontHeading: 'Playfair Display',
    fontBody: 'Lora',
    previewBg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950',
    badgeText: 'PRO Ultra Luxo',
    tier: 'pro',
  },
  {
    id: 'pro_editorial_gold',
    name: 'Vogue & Editorial Ouro',
    tagline: 'Tipografia alta cultura com refinamento parisiense',
    description: 'Diagramação inspirada em revistas de luxo internacionais, moda, arte e arquitetura.',
    primaryColor: '#18181B', // Zinc 900
    accentColor: '#B45309', // Amber 700
    bgTone: '#FAFAF9',
    cardBg: '#FFFFFF',
    borderStyle: 'border-amber-900/20',
    fontHeading: 'Playfair Display',
    fontBody: 'Merriweather',
    previewBg: 'bg-gradient-to-br from-amber-50/70 via-stone-100 to-amber-100/50',
    badgeText: 'PRO Vogue',
    tier: 'pro',
  },
  {
    id: 'pro_tech_dark',
    name: 'Cyber Tech & Neon',
    tagline: 'Futurista, vibrante e focado em inovação',
    description: 'Perfeito para inteligência artificial, programação, cripto, startups e futuro dos negócios.',
    primaryColor: '#0284C7', // Sky 600
    accentColor: '#10B981', // Emerald 500
    bgTone: '#030712', // Zinc 950
    cardBg: '#111827',
    borderStyle: 'border-cyan-500/30',
    fontHeading: 'Space Grotesk',
    fontBody: 'Plus Jakarta Sans',
    previewBg: 'bg-gradient-to-br from-slate-950 via-cyan-950 to-blue-950',
    badgeText: 'PRO Cyber',
    tier: 'pro',
  },
  {
    id: 'pro_nordic',
    name: 'Nordic Zen & Sage',
    tagline: 'Estética escandinava, sálvia e tons orgânicos',
    description: 'Tranquilidade e clareza visual para livros de produtividade, mentalidade, saúde e desaceleração.',
    primaryColor: '#166534', // Green 800
    accentColor: '#059669', // Emerald 600
    bgTone: '#F0FDF4',
    cardBg: '#FFFFFF',
    borderStyle: 'border-emerald-200/80',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Lora',
    previewBg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-100',
    badgeText: 'PRO Zen Orgânico',
    tier: 'pro',
  },
  {
    id: 'pro_magazine',
    name: 'Revista Contemporânea',
    tagline: 'Mídia moderna, contrastes fortes e quadros visuais',
    description: 'Layout extremamente dinâmico com caixas de destaque arrojadas para lançamentos e métodos.',
    primaryColor: '#DC2626', // Red 600
    accentColor: '#F97316', // Orange 500
    bgTone: '#FEF2F2',
    cardBg: '#FFFFFF',
    borderStyle: 'border-red-200',
    fontHeading: 'Space Grotesk',
    fontBody: 'Inter',
    previewBg: 'bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50',
    badgeText: 'PRO Mídia Impacto',
    tier: 'pro',
  },
  {
    id: 'pro_royal_navy',
    name: 'Royal Navy & Champagne',
    tagline: 'Azul imperial com detalhes champanhe e autoridade',
    description: 'O ápice da autoridade corporativa para consultores, executivos, mentorias e e-books de vendas.',
    primaryColor: '#1E3A8A', // Blue 900
    accentColor: '#D97706', // Amber 600
    bgTone: '#EFF6FF',
    cardBg: '#FFFFFF',
    borderStyle: 'border-blue-200',
    fontHeading: 'Playfair Display',
    fontBody: 'Plus Jakarta Sans',
    previewBg: 'bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900',
    badgeText: 'PRO Autoridade',
    tier: 'pro',
  },
];

export const FONT_OPTIONS = [
  { name: 'Plus Jakarta Sans', category: 'Sans-Serif', value: 'Plus Jakarta Sans' },
  { name: 'Inter', category: 'Sans-Serif', value: 'Inter' },
  { name: 'Playfair Display', category: 'Serif Elegante', value: 'Playfair Display' },
  { name: 'Merriweather', category: 'Serif Tradicional', value: 'Merriweather' },
  { name: 'Lora', category: 'Serif Leitura', value: 'Lora' },
  { name: 'Space Grotesk', category: 'Display Moderno', value: 'Space Grotesk' },
];

export const COLOR_PALETTES = [
  { name: 'Azul Real & Âmbar', primary: '#2563EB', accent: '#F59E0B' },
  { name: 'Esmeralda & Ouro', primary: '#059669', accent: '#D97706' },
  { name: 'Violeta & Rosa', primary: '#7C3AED', accent: '#EC4899' },
  { name: 'Grafite & Ciano', primary: '#1E293B', accent: '#0284C7' },
  { name: 'Coral & Telha', primary: '#E11D48', accent: '#F97316' },
  { name: 'Menta & Turquesa', primary: '#0D9488', accent: '#06B6D4' },
];

export const GENRE_PRESETS = [
  { id: 'negocios', label: 'Negócios & Marketing', icon: 'Briefcase' },
  { id: 'culinaria', label: 'Culinária & Receitas', icon: 'Utensils' },
  { id: 'desenvolvimento', label: 'Desenvolvimento Pessoal', icon: 'Sparkles' },
  { id: 'tecnologia', label: 'Tecnologia & IA', icon: 'Cpu' },
  { id: 'saude', label: 'Saúde & Bem-Estar', icon: 'Heart' },
  { id: 'infantil', label: 'Infantil & Histórias', icon: 'Smile' },
  { id: 'ficcao', label: 'Ficção & Romance', icon: 'BookOpen' },
  { id: 'educacao', label: 'Educação & Cursos', icon: 'GraduationCap' },
  { id: 'financas', label: 'Finanças & Investimentos', icon: 'DollarSign' },
  { id: 'outro', label: 'Outro Tópico', icon: 'MoreHorizontal' },
];

export const AVAILABLE_ICONS = [
  'BookOpen',
  'Sparkles',
  'Lightbulb',
  'Target',
  'CheckCircle2',
  'Heart',
  'Award',
  'Feather',
  'Flame',
  'Compass',
  'Star',
  'Rocket',
  'Shield',
  'Layers',
  'Zap',
  'Coffee',
];
