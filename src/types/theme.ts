export type DossierThemeId = 
  | 'sapphire' 
  | 'emerald' 
  | 'obsidian' 
  | 'crimson' 
  | 'amber' 
  | 'cyberpunk'
  | 'amethyst'
  | 'nordic'
  | 'sunset'
  | 'matrix'
  | 'executive'
  | 'forest';

export type DossierFontStyle = 'sans' | 'mono' | 'serif';

export interface DossierThemeConfig {
  id: DossierThemeId;
  name: string;
  badge: string;
  description: string;
  accentHex: string;
  secondaryHex: string;
  accentClass: string;
  textAccentClass: string;
  borderAccentClass: string;
  bgSubtleClass: string;
  badgeClass: string;
  cardHighlightClass: string;
  ringClass: string;
}

export const DOSSIER_THEMES: Record<DossierThemeId, DossierThemeConfig> = {
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire Modern',
    badge: 'FinTech & Core',
    description: 'Clean British FinTech & modern systems engineering',
    accentHex: '#2563eb',
    secondaryHex: '#6366f1',
    accentClass: 'bg-blue-600 hover:bg-blue-500 text-white',
    textAccentClass: 'text-blue-600 dark:text-blue-400',
    borderAccentClass: 'border-blue-300 dark:border-blue-800',
    bgSubtleClass: 'bg-blue-50/50 dark:bg-blue-950/20',
    badgeClass: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    cardHighlightClass: 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800',
    ringClass: 'ring-blue-500/20',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Hacker',
    badge: 'DevOps & Cloud',
    description: 'High-scale infrastructure, security & cloud engineering',
    accentHex: '#059669',
    secondaryHex: '#0d9488',
    accentClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    textAccentClass: 'text-emerald-600 dark:text-emerald-400',
    borderAccentClass: 'border-emerald-300 dark:border-emerald-800',
    bgSubtleClass: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    cardHighlightClass: 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800',
    ringClass: 'ring-emerald-500/20',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Minimal',
    badge: 'Monochrome',
    description: 'Ultra-clean Staff+ architect & minimalist monochrome aesthetic',
    accentHex: '#334155',
    secondaryHex: '#64748b',
    accentClass: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white',
    textAccentClass: 'text-slate-900 dark:text-slate-100',
    borderAccentClass: 'border-slate-400 dark:border-slate-700',
    bgSubtleClass: 'bg-slate-100/70 dark:bg-slate-900/60',
    badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
    cardHighlightClass: 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-400 dark:border-slate-700',
    ringClass: 'ring-slate-500/20',
  },
  amethyst: {
    id: 'amethyst',
    name: 'Amethyst Royal',
    badge: 'Web3 & Security',
    description: 'Deep cryptographic systems, cybersecurity & blockchain tech',
    accentHex: '#7c3aed',
    secondaryHex: '#a855f7',
    accentClass: 'bg-purple-600 hover:bg-purple-500 text-white',
    textAccentClass: 'text-purple-600 dark:text-purple-400',
    borderAccentClass: 'border-purple-300 dark:border-purple-800',
    bgSubtleClass: 'bg-purple-50/50 dark:bg-purple-950/20',
    badgeClass: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    cardHighlightClass: 'bg-purple-50/40 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800',
    ringClass: 'ring-purple-500/20',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Coral',
    badge: 'Product & Design',
    description: 'High-impact product engineering, consumer tech & interfaces',
    accentHex: '#e11d48',
    secondaryHex: '#f43f5e',
    accentClass: 'bg-rose-600 hover:bg-rose-500 text-white',
    textAccentClass: 'text-rose-600 dark:text-rose-400',
    borderAccentClass: 'border-rose-300 dark:border-rose-800',
    bgSubtleClass: 'bg-rose-50/50 dark:bg-rose-950/20',
    badgeClass: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    cardHighlightClass: 'bg-rose-50/40 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800',
    ringClass: 'ring-rose-500/20',
  },
  amber: {
    id: 'amber',
    name: 'Sunset Solar',
    badge: 'Founder & Growth',
    description: 'Venture startup founder, high energy & product growth',
    accentHex: '#d97706',
    secondaryHex: '#ea580c',
    accentClass: 'bg-amber-600 hover:bg-amber-500 text-white',
    textAccentClass: 'text-amber-600 dark:text-amber-400',
    borderAccentClass: 'border-amber-300 dark:border-amber-800',
    bgSubtleClass: 'bg-amber-50/50 dark:bg-amber-950/20',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    cardHighlightClass: 'bg-amber-50/40 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800',
    ringClass: 'ring-amber-500/20',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    badge: 'Matrix & AI',
    description: 'Distributed realtime streaming, machine learning & Web3',
    accentHex: '#0891b2',
    secondaryHex: '#8b5cf6',
    accentClass: 'bg-cyan-600 hover:bg-cyan-500 text-white',
    textAccentClass: 'text-cyan-600 dark:text-cyan-400',
    borderAccentClass: 'border-cyan-300 dark:border-cyan-800',
    bgSubtleClass: 'bg-cyan-50/50 dark:bg-cyan-950/20',
    badgeClass: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    cardHighlightClass: 'bg-cyan-50/40 dark:bg-cyan-950/30 border-cyan-300 dark:border-cyan-800',
    ringClass: 'ring-cyan-500/20',
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Frost',
    badge: 'Clean Scandinavian',
    description: 'Crisp arctic sky blue, focused typography & clear calm aesthetic',
    accentHex: '#0284c7',
    secondaryHex: '#38bdf8',
    accentClass: 'bg-sky-600 hover:bg-sky-500 text-white',
    textAccentClass: 'text-sky-600 dark:text-sky-400',
    borderAccentClass: 'border-sky-300 dark:border-sky-800',
    bgSubtleClass: 'bg-sky-50/50 dark:bg-sky-950/20',
    badgeClass: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    cardHighlightClass: 'bg-sky-50/40 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800',
    ringClass: 'ring-sky-500/20',
  },
  sunset: {
    id: 'sunset',
    name: 'Rose Gold Sunset',
    badge: 'Creative & Frontend',
    description: 'Warm sunset coral & rose gold for design-forward technologists',
    accentHex: '#f43f5e',
    secondaryHex: '#fb923c',
    accentClass: 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white',
    textAccentClass: 'text-rose-600 dark:text-rose-400',
    borderAccentClass: 'border-rose-300 dark:border-rose-800',
    bgSubtleClass: 'bg-rose-50/50 dark:bg-rose-950/20',
    badgeClass: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    cardHighlightClass: 'bg-rose-50/40 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800',
    ringClass: 'ring-rose-500/20',
  },
  matrix: {
    id: 'matrix',
    name: 'Terminal Matrix',
    badge: 'Kernel & Systems',
    description: 'Ultra-contrast green phosphor on true dark background',
    accentHex: '#10b981',
    secondaryHex: '#22c55e',
    accentClass: 'bg-emerald-600 hover:bg-emerald-500 text-black font-mono',
    textAccentClass: 'text-emerald-500 dark:text-emerald-400 font-mono',
    borderAccentClass: 'border-emerald-500/40 dark:border-emerald-500/40',
    bgSubtleClass: 'bg-emerald-950/20 dark:bg-emerald-950/40',
    badgeClass: 'bg-emerald-950/30 text-emerald-400 border-emerald-800/80 font-mono',
    cardHighlightClass: 'bg-emerald-950/20 border-emerald-500/30',
    ringClass: 'ring-emerald-500/30',
  },
  executive: {
    id: 'executive',
    name: 'Executive Navy',
    badge: 'Staff+ & Director',
    description: 'Oxford deep navy with warm champagne gold accent for senior leadership',
    accentHex: '#1e3a8a',
    secondaryHex: '#d97706',
    accentClass: 'bg-blue-900 hover:bg-blue-800 text-amber-200 border border-amber-500/30',
    textAccentClass: 'text-blue-900 dark:text-blue-300',
    borderAccentClass: 'border-slate-300 dark:border-blue-900',
    bgSubtleClass: 'bg-blue-50/60 dark:bg-blue-950/40',
    badgeClass: 'bg-blue-900/10 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-800',
    cardHighlightClass: 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800',
    ringClass: 'ring-blue-900/20',
  },
  forest: {
    id: 'forest',
    name: 'British Forest',
    badge: 'HealthTech & Green',
    description: 'Earthy British forest green and sage for health, energy & ESG platforms',
    accentHex: '#166534',
    secondaryHex: '#15803d',
    accentClass: 'bg-green-800 hover:bg-green-700 text-white',
    textAccentClass: 'text-green-800 dark:text-green-400',
    borderAccentClass: 'border-green-300 dark:border-green-800',
    bgSubtleClass: 'bg-green-50/50 dark:bg-green-950/20',
    badgeClass: 'bg-green-50 dark:bg-green-950/60 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
    cardHighlightClass: 'bg-green-50/40 dark:bg-green-950/30 border-green-300 dark:border-green-800',
    ringClass: 'ring-green-600/20',
  },
};

export type AtsSkinId = 'workday' | 'taleo' | 'greenhouse' | 'amber_crt' | 'lever' | 'bamboohr';

export interface AtsSkinConfig {
  id: AtsSkinId;
  name: string;
  badge: string;
  description: string;
  containerClass: string;
  headerClass: string;
  textClass: string;
  accentTextClass: string;
  borderClass: string;
  statusSafeClass: string;
  statusWarnClass: string;
}

export const ATS_SKINS: Record<AtsSkinId, AtsSkinConfig> = {
  workday: {
    id: 'workday',
    name: 'Workday Matrix',
    badge: 'Enterprise Terminal',
    description: 'Workday automated parse ingest engine (high-volume FTSE 100)',
    containerClass: 'bg-slate-950 text-emerald-300 border-emerald-900/40',
    headerClass: 'bg-slate-900 border-emerald-900/60 text-emerald-400',
    textClass: 'text-emerald-400',
    accentTextClass: 'text-emerald-300',
    borderClass: 'border-emerald-900/50',
    statusSafeClass: 'bg-slate-900/80 border-slate-800 text-slate-300',
    statusWarnClass: 'bg-rose-950/50 border-rose-700/60 text-rose-200',
  },
  taleo: {
    id: 'taleo',
    name: 'Taleo Enterprise',
    badge: 'Oracle Monospace',
    description: 'Oracle Taleo legacy parser with strict linear bounding lines',
    containerClass: 'bg-slate-900 text-slate-200 border-slate-700',
    headerClass: 'bg-slate-950 border-slate-800 text-blue-400',
    textClass: 'text-slate-200',
    accentTextClass: 'text-blue-300',
    borderClass: 'border-slate-800',
    statusSafeClass: 'bg-slate-950/60 border-slate-800 text-slate-300',
    statusWarnClass: 'bg-rose-950/40 border-rose-800 text-rose-200',
  },
  greenhouse: {
    id: 'greenhouse',
    name: 'Greenhouse Modern',
    badge: 'Tech Scaleup',
    description: 'Modern scaleup ATS reading structural Markdown tokens',
    containerClass: 'bg-teal-950/90 text-teal-200 border-teal-800/60',
    headerClass: 'bg-slate-950 border-teal-800 text-teal-400',
    textClass: 'text-teal-300',
    accentTextClass: 'text-teal-200',
    borderClass: 'border-teal-900/60',
    statusSafeClass: 'bg-teal-900/30 border-teal-800/40 text-teal-200',
    statusWarnClass: 'bg-rose-950/50 border-rose-700/60 text-rose-200',
  },
  amber_crt: {
    id: 'amber_crt',
    name: 'Amber Phosphor CRT',
    badge: 'Vintage VT100',
    description: 'Raw character stream VT100 terminal simulator',
    containerClass: 'bg-stone-950 text-amber-300 border-amber-900/50',
    headerClass: 'bg-neutral-900 border-amber-900/60 text-amber-400',
    textClass: 'text-amber-400',
    accentTextClass: 'text-amber-300',
    borderClass: 'border-amber-900/50',
    statusSafeClass: 'bg-stone-900/60 border-stone-800 text-stone-300',
    statusWarnClass: 'bg-rose-950/50 border-rose-700/60 text-rose-200',
  },
  lever: {
    id: 'lever',
    name: 'Lever Parser',
    badge: 'High-Growth Tech',
    description: 'Silicon Roundabout / US tech scaleup resume ingestion',
    containerClass: 'bg-indigo-950/90 text-indigo-200 border-indigo-800/50',
    headerClass: 'bg-slate-950 border-indigo-800 text-indigo-400',
    textClass: 'text-indigo-300',
    accentTextClass: 'text-indigo-200',
    borderClass: 'border-indigo-900/60',
    statusSafeClass: 'bg-indigo-900/30 border-indigo-800/40 text-indigo-200',
    statusWarnClass: 'bg-rose-950/50 border-rose-700/60 text-rose-200',
  },
  bamboohr: {
    id: 'bamboohr',
    name: 'BambooHR Clean',
    badge: 'SME & People Ops',
    description: 'Clean sequential parser for UK agencies & mid-market firms',
    containerClass: 'bg-stone-900 text-stone-200 border-stone-700',
    headerClass: 'bg-stone-950 border-stone-800 text-emerald-400',
    textClass: 'text-stone-300',
    accentTextClass: 'text-emerald-300',
    borderClass: 'border-stone-800',
    statusSafeClass: 'bg-stone-950/60 border-stone-800 text-stone-300',
    statusWarnClass: 'bg-rose-950/40 border-rose-800 text-rose-200',
  },
};

export type AtsDocumentThemeId = 'navy' | 'slate' | 'forest' | 'burgundy' | 'royal' | 'charcoal';

export interface AtsDocumentThemeConfig {
  id: AtsDocumentThemeId;
  name: string;
  badge: string;
  hex: string;
  textClass: string;
  borderClass: string;
  bgSubtleClass: string;
}

export const ATS_DOCUMENT_THEMES: Record<AtsDocumentThemeId, AtsDocumentThemeConfig> = {
  navy: {
    id: 'navy',
    name: 'Oxford Navy',
    badge: 'Executive',
    hex: '#1e3a8a',
    textClass: 'text-blue-900 dark:text-blue-400',
    borderClass: 'border-blue-900 dark:border-blue-700',
    bgSubtleClass: 'bg-blue-50/60 dark:bg-blue-950/40',
  },
  slate: {
    id: 'slate',
    name: 'Corporate Slate',
    badge: 'Classic Staff+',
    hex: '#334155',
    textClass: 'text-slate-800 dark:text-slate-300',
    borderClass: 'border-slate-700 dark:border-slate-600',
    bgSubtleClass: 'bg-slate-100/60 dark:bg-slate-900/40',
  },
  forest: {
    id: 'forest',
    name: 'British Forest',
    badge: 'Green / Health',
    hex: '#065f46',
    textClass: 'text-emerald-800 dark:text-emerald-400',
    borderClass: 'border-emerald-800 dark:border-emerald-700',
    bgSubtleClass: 'bg-emerald-50/60 dark:bg-emerald-950/40',
  },
  burgundy: {
    id: 'burgundy',
    name: 'Cambridge Crimson',
    badge: 'Distinguished',
    hex: '#881337',
    textClass: 'text-rose-900 dark:text-rose-400',
    borderClass: 'border-rose-900 dark:border-rose-700',
    bgSubtleClass: 'bg-rose-50/60 dark:bg-rose-950/40',
  },
  royal: {
    id: 'royal',
    name: 'Tech Royal Blue',
    badge: 'Modern Tech',
    hex: '#2563eb',
    textClass: 'text-blue-600 dark:text-blue-400',
    borderClass: 'border-blue-600 dark:border-blue-500',
    bgSubtleClass: 'bg-blue-50/60 dark:bg-blue-950/40',
  },
  charcoal: {
    id: 'charcoal',
    name: 'Monochrome Noir',
    badge: '100% Pure Minimal',
    hex: '#18181b',
    textClass: 'text-zinc-900 dark:text-zinc-100',
    borderClass: 'border-zinc-900 dark:border-zinc-700',
    bgSubtleClass: 'bg-zinc-100/60 dark:bg-zinc-900/40',
  },
};
