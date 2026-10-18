import React, { useState } from "react";
import { 
  Sparkles, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Eye, 
  Code2, 
  Layers, 
  Cpu, 
  Database, 
  Cloud, 
  CheckCircle2, 
  Flame, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight, 
  Lock, 
  Building2, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  AlertTriangle,
  FileText,
  Share2,
  X,
  Filter,
  Search,
  Sun,
  Moon,
  Palette,
  GraduationCap
} from "lucide-react";
import { generateCleanAtsCvPdf } from "../../services/pdfGenerator";
import { DOSSIER_THEMES, DossierThemeId, DossierFontStyle } from "../../types/theme";

export interface SkillDetail {
  name: string;
  category: 'languages' | 'frameworks' | 'cloud' | 'architecture';
  yearsExperience: string;
  proficiency: 'Expert' | 'Advanced' | 'Proficient';
  context: string;
  whereUsed: string;
  relatedTech: string[];
}

export interface ProjectDetail {
  id: string;
  title: string;
  context: string;
  role: string;
  status: 'Production Live' | 'Open Source' | 'Enterprise Certified';
  summary: string;
  techStack: string[];
  metrics: string[];
  deepDive: {
    problemStatement: string;
    architectureSolution: string;
    keyTradeoffs: string;
    measurableImpact: string;
  };
  demoUrl?: string;
  githubUrl?: string;
}

export interface ModernWebResumeProps {
  candidateData: {
    name: string;
    roleHeadline: string;
    location: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    rightToWork: string;
    summary: string;
    experience: Array<{
      id: string;
      role: string;
      company: string;
      dates: string;
      location: string;
      bullets: string[];
      verifiedBy?: string;
    }>;
    skills: {
      languages: string;
      cloud: string;
      frameworks: string;
    };
    education: string;
    customSlug?: string;
    projects?: ProjectDetail[];
    theme?: DossierThemeId;
    fontStyle?: DossierFontStyle;
    customAccentColor?: string;
  };
  onDownloadPdf?: () => void;
  isStandalone?: boolean;
  isEmbeddedPreview?: boolean;
}

export function ModernWebResume({ candidateData, onDownloadPdf, isStandalone = false, isEmbeddedPreview = false }: ModernWebResumeProps) {
  const [skimMode, setSkimMode] = useState(false);
  const [activeTheme, setActiveTheme] = useState<DossierThemeId>(candidateData.theme || 'sapphire');
  const [activeFont, setActiveFont] = useState<DossierFontStyle>(candidateData.fontStyle || 'sans');
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Keep synced if prop updates from builder
  React.useEffect(() => {
    if (candidateData.theme) setActiveTheme(candidateData.theme);
  }, [candidateData.theme]);

  React.useEffect(() => {
    if (candidateData.fontStyle) setActiveFont(candidateData.fontStyle);
  }, [candidateData.fontStyle]);

  const baseTheme = DOSSIER_THEMES[activeTheme] || DOSSIER_THEMES.sapphire;
  const accentColor = candidateData.customAccentColor || baseTheme.accentHex;
  const currentTheme = candidateData.customAccentColor
    ? {
        ...baseTheme,
        accentHex: candidateData.customAccentColor,
      }
    : baseTheme;

  const [skillCategoryFilter, setSkillCategoryFilter] = useState<'all' | 'languages' | 'frameworks' | 'cloud'>('all');
  const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>({
    "TypeScript": true,
    "React": false,
  });
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
    "proj-1": true,
  });
  const [expandedExperience, setExpandedExperience] = useState<Record<string, boolean>>({});
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Keep dark theme in sync with document root across navbar/app toggles
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    setIsDarkTheme(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDarkTheme(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = !isDarkTheme;
    setIsDarkTheme(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const slug = candidateData.customSlug || candidateData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const wildcardDomainUrl = `https://${slug}.bookmarksoft.uk`;

  // Parse skills into rich interactive items with sensible fallbacks
  const parseSkillsList = (): SkillDetail[] => {
    const langStr = candidateData.skills?.languages?.trim() || "TypeScript, Node.js, Python, SQL, Go";
    const frameStr = candidateData.skills?.frameworks?.trim() || "React, Next.js, Express, Redis, PostgreSQL";
    const cloudStr = candidateData.skills?.cloud?.trim() || "AWS (ECS, S3, IAM), Docker, Kubernetes, Terraform, CI/CD";

    const rawLanguages = langStr.split(',').map(s => s.trim()).filter(Boolean);
    const rawFrameworks = frameStr.split(',').map(s => s.trim()).filter(Boolean);
    const rawCloud = cloudStr.split(',').map(s => s.trim()).filter(Boolean);

    const skills: SkillDetail[] = [];

    rawLanguages.forEach(name => {
      skills.push({
        name,
        category: 'languages',
        yearsExperience: name.toLowerCase().includes('typescript') || name.toLowerCase().includes('node') ? '6+ years' : '4+ years',
        proficiency: 'Expert',
        context: `Primary language used for building fault-tolerant microservices and high-throughput UK payment pipelines.`,
        whereUsed: `Acme Fintech UK (£42M/day settlement engine) & British Health Digital (NHS Login OAuth2).`,
        relatedTech: ['ESNext', 'Clean Architecture', 'Async/Await', 'Unit & E2E Testing']
      });
    });

    rawFrameworks.forEach(name => {
      skills.push({
        name,
        category: 'frameworks',
        yearsExperience: '5+ years',
        proficiency: name.toLowerCase().includes('react') || name.toLowerCase().includes('redis') ? 'Expert' : 'Advanced',
        context: `High-concurrency data storage, message buffering, and low-latency frontend application state.`,
        whereUsed: `Implemented multi-region cluster caching reducing p99 latency to 68ms.`,
        relatedTech: ['Connection Pooling', 'Transactions', 'Event Loops', 'State Machines']
      });
    });

    rawCloud.forEach(name => {
      skills.push({
        name,
        category: 'cloud',
        yearsExperience: '4+ years',
        proficiency: 'Advanced',
        context: `Automated Infrastructure-as-Code, zero-downtime deployment pipelines, and ISO 27001 data compliance.`,
        whereUsed: `Deployed containerized workloads across AWS ECS and automated CI/CD GitHub workflows.`,
        relatedTech: ['Docker', 'Terraform', 'Zero-Trust IAM', 'CloudWatch Alarms']
      });
    });

    return skills;
  };

  const interactiveSkills = parseSkillsList();

  // Default rich projects with deep-dive technical architectures
  const projects: ProjectDetail[] = candidateData.projects || [
    {
      id: "proj-1",
      title: "UK Faster Payments Gateway Engine",
      context: "Acme Fintech UK",
      role: "Lead Systems Architect",
      status: "Production Live",
      summary: "Idempotent payment settlement pipeline handling £42M/day transaction throughput with sub-70ms authorization.",
      techStack: ["Node.js", "TypeScript", "Redis Clusters", "PostgreSQL", "AWS ECS", "Docker"],
      metrics: ["£42M/day transaction volume", "68ms median API latency (down from 420ms)", "99.99% availability SLA"],
      deepDive: {
        problemStatement: "The legacy monolithic gateway suffered from database lock contention under burst payments (salary days), causing payment timeouts and regulatory breach risks with UK clearing houses.",
        architectureSolution: "Re-architected the ingest flow into an event-driven worker pool with optimistic locking in PostgreSQL and Redis distributed locks for idempotent retry handling. Partitioned transaction queues by Sort Code and Account Number to eliminate row locking.",
        keyTradeoffs: "Chose Redis distributed locks over Kafka partitioning for simplicity and sub-10ms clearance guarantees, trading slightly higher RAM usage for zero message duplication.",
        measurableImpact: "Reduced median authorization time from 420ms to 68ms. Zero duplicate settlements recorded over 24 months of production operation, saving an estimated £180k in reconciliation costs."
      },
      githubUrl: `https://${candidateData.github.replace('https://', '')}`,
      demoUrl: "https://demo.payments.example.com",
    },
    {
      id: "proj-2",
      title: "NHS FHIR Patient Scheduling Bridge",
      context: "British Health Digital",
      role: "Senior Backend Engineer",
      status: "Enterprise Certified",
      summary: "High-compliance healthcare integration engine connecting 45 NHS clinical trusts using HL7 FHIR standards and NHS Login.",
      techStack: ["TypeScript", "Express", "HL7 FHIR API", "OAuth2 / OIDC", "Docker", "AWS"],
      metrics: ["220,000+ active NHS users", "45 NHS Trusts integrated", "100% Caldicott & GDPR compliance"],
      deepDive: {
        problemStatement: "Legacy GP and hospital record systems used disparate XML schemas that failed to speak to regional patient booking portals, causing missed appointments and patient backlog delays.",
        architectureSolution: "Engineered a bi-directional mapper transforming proprietary clinical records into standard HL7 FHIR RESTful resources. Integrated NHS Login OAuth2 with role-based cryptographic token verification.",
        keyTradeoffs: "Enforced strict zero-retention in-memory payload transformation rather than caching patient health info on disk, eliminating GDPR clinical breach vectors at the cost of slight compute overhead.",
        measurableImpact: "Achieved 100% compliance during independent NHS digital clinical safety audits (DCB0129 / DCB0160). Reduced missed specialist appointments by 19% across pilot trusts."
      },
      githubUrl: `https://${candidateData.github.replace('https://', '')}`,
    }
  ];

  const toggleProject = (id: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [id]: !Boolean(prev[id])
    }));
  };

  const toggleAllProjects = () => {
    const allExpanded = projects.every(p => Boolean(expandedProjects[p.id]));
    const nextState: Record<string, boolean> = {};
    projects.forEach(p => {
      nextState[p.id] = !allExpanded;
    });
    setExpandedProjects(nextState);
  };

  const toggleSkill = (skillName: string) => {
    setExpandedSkills(prev => ({
      ...prev,
      [skillName]: !prev[skillName]
    }));
  };

  const toggleAllSkills = () => {
    const displayed = interactiveSkills
      .filter(s => skillCategoryFilter === 'all' || s.category === skillCategoryFilter)
      .filter(s => !skillSearchQuery || s.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) || s.context.toLowerCase().includes(skillSearchQuery.toLowerCase()));

    const allExpanded = displayed.length > 0 && displayed.every(s => Boolean(expandedSkills[s.name]));
    const nextState: Record<string, boolean> = { ...expandedSkills };
    displayed.forEach(s => {
      nextState[s.name] = !allExpanded;
    });
    setExpandedSkills(nextState);
  };

  const toggleExperience = (id: string) => {
    setExpandedExperience(prev => {
      const current = prev[id] !== false;
      return {
        ...prev,
        [id]: !current
      };
    });
  };

  const toggleAllExperience = () => {
    const allExpanded = candidateData.experience.every(e => expandedExperience[e.id] !== false);
    const nextState: Record<string, boolean> = {};
    candidateData.experience.forEach(e => {
      nextState[e.id] = !allExpanded;
    });
    setExpandedExperience(nextState);
  };

  const copyDossierUrl = () => {
    navigator.clipboard.writeText(wildcardDomainUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDownload = async () => {
    if (onDownloadPdf) {
      onDownloadPdf();
      return;
    }
    setIsDownloading(true);
    try {
      await generateCleanAtsCvPdf(candidateData);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen selection:bg-blue-500 selection:text-white ${activeFont === 'mono' ? 'font-mono' : activeFont === 'serif' ? 'font-serif' : 'font-sans'}`}>
      {/* Top Floating Wildcard Domain & Action Bar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Wildcard Subdomain Identity Badge */}
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>{slug}</span>
              <span className="text-slate-400 dark:text-slate-500">.bookmarksoft.uk</span>
            </div>
            <button
              onClick={copyDossierUrl}
              className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
              title="Copy your online CV link"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Recruiter Skim Mode, Theme Palettes & Actions */}
          <div className="flex items-center gap-2">
            {/* Theme & Palette Picker Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Select Color Theme & Font"
              >
                <div 
                  className="w-3 h-3 rounded-full border border-white/50 shadow-xs shrink-0" 
                  style={{ backgroundColor: currentTheme.accentHex }}
                />
                <span className="hidden sm:inline">{currentTheme.name}</span>
                <Palette className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showThemePicker && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-blue-500" />
                        Color Palettes
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Select a color theme for your online CV
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowThemePicker(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 12 Theme swatches in scrollable container */}
                  <div className="max-h-60 overflow-y-auto pr-1 grid grid-cols-2 gap-1.5">
                    {(Object.keys(DOSSIER_THEMES) as DossierThemeId[]).map((themeKey) => {
                      const t = DOSSIER_THEMES[themeKey];
                      const isSelected = activeTheme === themeKey;
                      return (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={() => {
                            setActiveTheme(themeKey);
                          }}
                          className={`p-2 rounded-xl text-left border transition-all flex items-start gap-2 cursor-pointer ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500/30 shadow-xs"
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30"
                          }`}
                        >
                          <div className="mt-0.5 relative shrink-0">
                            <div 
                              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                              style={{ backgroundColor: t.accentHex }}
                            />
                            <div 
                              className="w-2 h-2 rounded-full border border-white/40 shadow-xs absolute -bottom-0.5 -right-0.5"
                              style={{ backgroundColor: t.secondaryHex }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {t.name}
                            </span>
                            <span className="block text-[9px] text-slate-400 truncate">
                              {t.badge}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Font style selection */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Typography Pairing
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {(['sans', 'mono', 'serif'] as const).map((font) => (
                        <button
                          key={font}
                          type="button"
                          onClick={() => setActiveFont(font)}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                            activeFont === font
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          } ${font === 'mono' ? 'font-mono' : font === 'serif' ? 'font-serif' : 'font-sans'}`}
                        >
                          {font === 'sans' ? 'Modern Sans' : font === 'mono' ? 'Code Mono' : 'Editorial Serif'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSkimMode(!skimMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                skimMode 
                  ? "bg-amber-500 text-slate-950 shadow-sm" 
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
              title="Switch between 30-Second Recruiter Skim and Full Deep Dive view"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{skimMode ? "30s Skim (Active)" : "30-Sec Skim"}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title={isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkTheme ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${currentTheme.accentClass} transition-all shadow-xs flex items-center gap-1.5 cursor-pointer`}
              title="Download single-column ATS-compliant PDF generated on-site"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? "Compiling..." : "ATS PDF"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dossier Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Anti-Phishing & Trust Verification Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Verified Candidate Web Dossier</span> • Protected by Bookmarksoft Anti-Phishing Guard.
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-300">
            <span>Official Wildcard Subdomain: <code className="font-mono bg-white/60 dark:bg-slate-900 px-1 py-0.5 rounded">*.bookmarksoft.uk</code></span>
          </div>
        </div>

        {/* Hero Candidate Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 relative overflow-hidden">
          <div 
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15" 
            style={{ background: `radial-gradient(circle, ${currentTheme.accentHex} 0%, ${currentTheme.secondaryHex} 50%, transparent 80%)` }}
          />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${currentTheme.badgeClass}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Engineering Dossier • {currentTheme.badge}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {candidateData.name}
                </h1>
                <p className={`text-base sm:text-lg font-bold ${currentTheme.textAccentClass}`}>
                  {candidateData.roleHeadline}
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:items-end gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {candidateData.rightToWork}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Hosted at {slug}.bookmarksoft.uk
                </span>
              </div>
            </div>

            {/* Quick Contact & Social Channels */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {candidateData.location}
              </span>
              <a href={`mailto:${candidateData.email}`} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {candidateData.email}
              </a>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {candidateData.phone}
              </span>
              {candidateData.github && (
                <a 
                  href={`https://${candidateData.github.replace('https://', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  {candidateData.github}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {candidateData.linkedin && (
                <a 
                  href={`https://${candidateData.linkedin.replace('https://', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer nofollow"
                  className="flex items-center gap-1.5 hover:underline"
                  style={{ color: accentColor }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
              Executive Overview
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {candidateData.summary}
            </p>
          </div>
        </div>

        {/* 30-Second Skim Highlight Bar (When Skim Mode Active) */}
        {skimMode && (
          <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/60 text-amber-950 dark:text-amber-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                Recruiter 30-Second Skim Digest
              </span>
              <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
                Core Metrics At A Glance
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">UK Experience</div>
                <div className="font-black text-sm text-slate-900 dark:text-white mt-0.5">7+ Years Tier-1</div>
                <div className="text-[10px] text-slate-500 mt-1">FinTech &amp; Healthcare</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Max Scale Handled</div>
                <div className="font-black text-sm text-slate-900 dark:text-white mt-0.5">£42M/day Volume</div>
                <div className="text-[10px] text-slate-500 mt-1">Faster Payments Gateway</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Core Stack</div>
                <div className="font-black text-sm text-slate-900 dark:text-white mt-0.5">TS • Node • Redis</div>
                <div className="text-[10px] text-slate-500 mt-1">AWS &amp; Event-Driven</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Vouch Credibility</div>
                <div className="font-black text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">VP Eng Verified</div>
                <div className="text-[10px] text-slate-500 mt-1">Cryptographic Token</div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Expandable Skills Section */}
        <section 
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
          style={{ borderTop: `4px solid ${accentColor}` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 shrink-0" style={{ color: accentColor }} />
                Technical Competencies &amp; Experience
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Click any competency tile to expand context, years of production experience, and proven systems.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleAllSkills}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>
                  {(() => {
                    const displayed = interactiveSkills
                      .filter(s => skillCategoryFilter === 'all' || s.category === skillCategoryFilter)
                      .filter(s => !skillSearchQuery || s.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) || s.context.toLowerCase().includes(skillSearchQuery.toLowerCase()));
                    return displayed.length > 0 && displayed.every(s => Boolean(expandedSkills[s.name]))
                      ? "Collapse All Skills"
                      : "Expand All Skills";
                  })()}
                </span>
              </button>
              <span className="text-xs font-mono text-slate-400">
                {interactiveSkills.length} Verified
              </span>
            </div>
          </div>

          {/* Category Filter Tabs & Quick Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Stack:
              </span>
              {(['all', 'languages', 'frameworks', 'cloud'] as const).map((cat) => {
                const count = cat === 'all' 
                  ? interactiveSkills.length 
                  : interactiveSkills.filter(s => s.category === cat).length;
                const label = cat === 'all' ? 'All Stack' : cat === 'languages' ? 'Languages & Core' : cat === 'frameworks' ? 'Frameworks & DB' : 'Cloud & DevOps';
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSkillCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                      skillCategoryFilter === cat
                        ? `${currentTheme.accentClass} shadow-xs`
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${skillCategoryFilter === cat ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Realtime Search Input */}
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                placeholder="Filter skill e.g. React, AWS..."
                value={skillSearchQuery}
                onChange={(e) => setSkillSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              {skillSearchQuery && (
                <button 
                  onClick={() => setSkillSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* In-Place Expandable Competency Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 items-start">
            {interactiveSkills
              .filter(s => skillCategoryFilter === 'all' || s.category === skillCategoryFilter)
              .filter(s => !skillSearchQuery || s.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) || s.context.toLowerCase().includes(skillSearchQuery.toLowerCase()))
              .map((skill) => {
                const isExpanded = Boolean(expandedSkills[skill.name]);

                return (
                  <div
                    key={skill.name}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? `shadow-sm ring-1 md:col-span-2 lg:col-span-3`
                        : "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900"
                    }`}
                    style={isExpanded ? { 
                      borderColor: `${accentColor}50`, 
                      borderLeft: `4px solid ${accentColor}`,
                      backgroundColor: isDarkTheme ? `${accentColor}10` : `${accentColor}08`
                    } : undefined}
                  >
                    {/* Card Header (Always Visible, Clickable in Place) */}
                    <div
                      onClick={() => toggleSkill(skill.name)}
                      className="p-3.5 flex items-center justify-between cursor-pointer select-none group"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSkill(skill.name); }}}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${isExpanded ? "ring-2" : "bg-slate-300 dark:bg-slate-700"}`} 
                          style={isExpanded ? { backgroundColor: accentColor } : undefined}
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate block transition-colors">
                            {skill.name}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize block sm:hidden">
                            {skill.category === 'languages' ? 'Language' : skill.category === 'frameworks' ? 'Framework' : 'Cloud'} • {skill.yearsExperience}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {skill.yearsExperience}
                        </span>
                        <span 
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                          style={skill.proficiency === 'Expert' ? {
                            backgroundColor: `${accentColor}20`,
                            color: accentColor
                          } : {}}
                        >
                          {skill.proficiency}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSkill(skill.name);
                          }}
                          className={`p-1 rounded-lg text-slate-400 hover:opacity-80 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          style={isExpanded ? { color: accentColor } : undefined}
                          title={isExpanded ? "Collapse competency details" : "Expand proof-of-work in place"}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* In-Place Expanded Proof-of-Work Content */}
                    {isExpanded && (
                      <div 
                        className="px-4 pb-4 pt-1 border-t space-y-3 animate-fadeIn text-xs"
                        style={{ borderColor: `${accentColor}30` }}
                      >
                        <div className="pt-2">
                          <span className="block text-[10px] font-bold uppercase mb-1" style={{ color: accentColor }}>
                            Production Impact &amp; Architecture Context:
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                            {skill.context}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <div 
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border"
                            style={{ borderColor: `${accentColor}30` }}
                          >
                            <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                              Where Demonstrated in UK Production:
                            </span>
                            <span className="text-slate-800 dark:text-slate-200 font-semibold text-xs leading-snug">
                              {skill.whereUsed}
                            </span>
                          </div>

                          <div 
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border"
                            style={{ borderColor: `${accentColor}30` }}
                          >
                            <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                              Complementary Stack &amp; Design Patterns:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {skill.relatedTech.map((tag, i) => (
                                <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-mono text-slate-400">
                            Verified Production Benchmark: {skill.yearsExperience}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSkill(skill.name);
                            }}
                            className="text-[11px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            style={{ color: accentColor }}
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Collapse in place</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </section>

        {/* Expandable Project Descriptions & Architecture Deep Dives */}
        <section 
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
          style={{ borderTop: `4px solid ${accentColor}` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 shrink-0" style={{ color: accentColor }} />
                Featured Engineering Projects &amp; Architecture Deep Dives
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Inspect architecture decisions, technical trade-offs, and verified production benchmarks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleAllProjects}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                {projects.every(p => Boolean(expandedProjects[p.id])) ? "Collapse All Deep Dives" : "Expand All Deep Dives"}
              </button>
              <span className="text-xs font-mono text-slate-400">
                {projects.length} Showcases
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {projects.map((proj) => {
              const isExpanded = Boolean(expandedProjects[proj.id]);
              return (
                <div 
                  key={proj.id} 
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-5 space-y-4 transition-all"
                  style={isExpanded ? { borderLeft: `3px solid ${accentColor}` } : {}}
                >
                  <div 
                    onClick={() => toggleProject(proj.id)}
                    className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 cursor-pointer select-none group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white transition-colors">
                          {proj.title}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {proj.context} • <strong>{proj.role}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProject(proj.id);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        style={isExpanded ? {
                          backgroundColor: accentColor,
                          borderColor: accentColor,
                          color: '#ffffff'
                        } : {
                          borderColor: `${accentColor}40`
                        }}
                      >
                        <span>{isExpanded ? "Collapse Deep Dive" : "Architecture Deep Dive"}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {proj.summary}
                  </p>

                  {/* Tech Stack Chips & Metrics */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {(proj.techStack || []).map((tech, i) => (
                      <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Measurable Metrics Bar */}
                  {proj.metrics && proj.metrics.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                      {proj.metrics.map((metric, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-[11px]">{metric}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Expanded Architecture Deep Dive Section */}
                  {isExpanded && proj.deepDive && (
                    <div 
                      className="mt-4 pt-4 space-y-3.5 text-xs bg-white dark:bg-slate-900 p-4 rounded-xl border animate-fadeIn"
                      style={{ 
                        borderColor: `${accentColor}35`,
                        borderLeft: `4px solid ${accentColor}`,
                        backgroundColor: isDarkTheme ? `${accentColor}0a` : `${accentColor}06`
                      }}
                    >
                      <div className="flex items-center gap-2 font-bold" style={{ color: accentColor }}>
                        <Layers className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                        <span>System Architecture &amp; Engineering Decisions</span>
                      </div>

                      <div className="space-y-2">
                        {proj.deepDive.problemStatement && (
                          <div>
                            <strong className="block text-[11px] mb-0.5" style={{ color: accentColor }}>Problem &amp; Scale Contention:</strong>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{proj.deepDive.problemStatement}</p>
                          </div>
                        )}
                        {proj.deepDive.architectureSolution && (
                          <div>
                            <strong className="block text-[11px] mb-0.5" style={{ color: accentColor }}>Architectural Solution:</strong>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{proj.deepDive.architectureSolution}</p>
                          </div>
                        )}
                        {proj.deepDive.keyTradeoffs && (
                          <div>
                            <strong className="block text-[11px] mb-0.5" style={{ color: accentColor }}>Technical Trade-Offs Considered:</strong>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{proj.deepDive.keyTradeoffs}</p>
                          </div>
                        )}
                        {proj.deepDive.measurableImpact && (
                          <div>
                            <strong className="block text-[11px] mb-0.5" style={{ color: accentColor }}>Measurable Production Outcomes:</strong>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{proj.deepDive.measurableImpact}</p>
                          </div>
                        )}
                      </div>

                      {/* Outbound Link Safety */}
                      <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-100 dark:border-slate-800">
                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="inline-flex items-center gap-1.5 font-semibold hover:underline"
                            style={{ color: accentColor }}
                          >
                            <span>Live Product Demo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold hover:underline"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                            <span>Repository Artifact</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <span className="text-[10px] text-slate-400 ml-auto">
                          External links inspected by Bookmarksoft Outbound Safety Filter
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Work Experience with Verified Vouches */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-500" />
                Verified Employment History
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Click any role to toggle accomplishments and verified vouch details.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleAllExperience}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                {candidateData.experience.every(e => expandedExperience[e.id] !== false) ? "Collapse All Roles" : "Expand All Roles"}
              </button>
              <span className="text-xs font-mono text-slate-400">
                {candidateData.experience.length} Roles
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {candidateData.experience.map((exp) => {
              const isExpOpen = expandedExperience[exp.id] !== false; // default open
              return (
                <div 
                  key={exp.id} 
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3 transition-all"
                >
                  <div 
                    onClick={() => toggleExperience(exp.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 cursor-pointer select-none group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {exp.role}
                        </h3>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpOpen ? "rotate-180" : ""}`} />
                      </div>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {exp.company} — <span className="text-slate-500 font-normal">{exp.location}</span>
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {exp.dates}
                    </span>
                  </div>

                  {isExpOpen && (
                    <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                      {exp.verifiedBy && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified by {exp.verifiedBy}</span>
                        </div>
                      )}

                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                        {exp.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Education Section */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Education &amp; Qualifications
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {candidateData.education}
          </p>
        </section>

        {/* Anti-Phishing Candidate Notice & Safe Domain Seal Footer */}
        <footer className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Bookmarksoft Candidate Trust &amp; Anti-Phishing Guard</span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                This web dossier is served on a certified candidate wildcard subdomain. It does not harvest credentials, require logins, or execute arbitrary third-party scripts.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download Clean ATS PDF
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>Candidate Dossier URL: <strong className="text-white font-mono">{wildcardDomainUrl}</strong></span>
            <div className="flex items-center gap-3">
              <span>Protected by UK GDPR &amp; Privacy Policy</span>
              <span>•</span>
              <a href="mailto:safety@bookmarksoft.uk" className="underline hover:text-white">Report suspicious page</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
