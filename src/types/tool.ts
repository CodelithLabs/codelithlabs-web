// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/types/tool.ts
// Tool type definitions for the 199+ tools platform
// ═══════════════════════════════════════════════════════════════════════════

export interface ToolMeta {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  icon?: string;
  processingType: 'client' | 'server'; // Client-side saves RAM
  implementationStatus?: 'planned' | 'in-progress' | 'ready';
  indexingStatus?: 'index' | 'noindex';
}

export type ToolCategory =
  | 'text'
  | 'image'
  | 'developer'
  | 'converter'
  | 'calculator'
  | 'generator'
  | 'formatter'
  | 'encoder'
  | 'security'
  | 'seo'
  | 'ai'
  | 'finance'
  | 'geo'
  | 'ai-repurpose'
  | 'fintech'
  | 'local-seo'
  | 'niche-calculator';

export interface ToolCategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const TOOL_CATEGORIES: Record<ToolCategory, ToolCategoryInfo> = {
  text: {
    id: 'text',
    name: 'Text Tools',
    description: 'Text manipulation, formatting, and analysis utilities',
    icon: 'Type',
    color: '#3B82F6'
  },
  image: {
    id: 'image',
    name: 'Image Tools',
    description: 'Image conversion, compression, and editing',
    icon: 'Image',
    color: '#10B981'
  },
  developer: {
    id: 'developer',
    name: 'Developer Tools',
    description: 'JSON, Base64, regex, and coding utilities',
    icon: 'Code',
    color: '#8B5CF6'
  },
  converter: {
    id: 'converter',
    name: 'Converters',
    description: 'File format and unit converters',
    icon: 'ArrowLeftRight',
    color: '#F59E0B'
  },
  calculator: {
    id: 'calculator',
    name: 'Calculators',
    description: 'Math, finance, and scientific calculators',
    icon: 'Calculator',
    color: '#EF4444'
  },
  generator: {
    id: 'generator',
    name: 'Generators',
    description: 'Password, UUID, lorem ipsum generators',
    icon: 'Sparkles',
    color: '#EC4899'
  },
  formatter: {
    id: 'formatter',
    name: 'Formatters',
    description: 'Code and data formatting tools',
    icon: 'AlignLeft',
    color: '#06B6D4'
  },
  encoder: {
    id: 'encoder',
    name: 'Encoders/Decoders',
    description: 'Base64, URL, HTML encoding utilities',
    icon: 'Lock',
    color: '#84CC16'
  },
  security: {
    id: 'security',
    name: 'Security Tools',
    description: 'Hash generators, password checkers',
    icon: 'Shield',
    color: '#F97316'
  },
  seo: {
    id: 'seo',
    name: 'SEO Tools',
    description: 'Meta tag generators, analyzers',
    icon: 'Search',
    color: '#6366F1'
  },
  ai: {
    id: 'ai',
    name: 'AI Tools',
    description: 'AI-powered text analysis, sentiment, and generation',
    icon: 'Brain',
    color: '#A855F7'
  },
  finance: {
    id: 'finance',
    name: 'Finance Tools',
    description: 'Currency converters, mortgage calculators, crypto tools',
    icon: 'DollarSign',
    color: '#22C55E'
  },
  geo: {
    id: 'geo',
    name: 'Geographic Tools',
    description: 'Timezone converters, distance calculators, location tools',
    icon: 'Globe',
    color: '#3B82F6'
  },
  'ai-repurpose': {
    id: 'ai-repurpose',
    name: 'AI Content Repurposing',
    description: 'Transform content between formats using client-side NLP and rule-based AI',
    icon: 'Repeat2',
    color: '#F472B6'
  },
  'fintech': {
    id: 'fintech',
    name: 'Fintech & Compliance',
    description: 'Tax calculators, GST tools, and financial compliance utilities',
    icon: 'Landmark',
    color: '#34D399'
  },
  'local-seo': {
    id: 'local-seo',
    name: 'Local SEO Tools',
    description: 'Schema generators, citation formatters, and local search optimization',
    icon: 'MapPin',
    color: '#FB923C'
  },
  'niche-calculator': {
    id: 'niche-calculator',
    name: 'Niche Calculators',
    description: 'Specialized calculators for home, lifestyle, and planning needs',
    icon: 'Ruler',
    color: '#A78BFA'
  }
};
