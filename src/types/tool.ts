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
  | 'seo';

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
  }
};
