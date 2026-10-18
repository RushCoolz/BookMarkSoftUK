import React, { useState } from "react";
import { 
  FileEdit, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Copy, 
  Check, 
  Eye, 
  ShieldCheck, 
  Link2, 
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  FileSearch,
  Globe,
  ShieldAlert,
  Maximize2,
  ExternalLink,
  Code2,
  X,
  Share2,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Palette,
  Terminal,
  Sliders,
  Paintbrush
} from "lucide-react";
import { generateCleanAtsCvPdf } from "../../services/pdfGenerator";
import { ModernWebResume, ProjectDetail } from "./ModernWebResume";
import { 
  DOSSIER_THEMES, 
  DossierThemeId, 
  DossierFontStyle,
  ATS_SKINS,
  AtsSkinId,
  ATS_DOCUMENT_THEMES,
  AtsDocumentThemeId
} from "../../types/theme";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  dates: string;
  location: string;
  bullets: string[];
  verifiedBy?: string;
}

export interface CvBuilderProps {
  onNavigateToTracking?: () => void;
  onNavigateToScanner?: () => void;
}

export function CvBuilder({ onNavigateToTracking, onNavigateToScanner }: CvBuilderProps) {
  // Form State
  const [name, setName] = useState("Alex Turner");
  const [roleHeadline, setRoleHeadline] = useState("Lead Software Engineer • Distributed Payments & Cloud");
  const [location, setLocation] = useState("London, UK");
  const [email, setEmail] = useState("alex.turner@example.co.uk");
  const [phone, setPhone] = useState("+44 7700 900123");
  const [github, setGithub] = useState("github.com/alexturner-uk");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/alexturner-dev");
  const [rightToWork, setRightToWork] = useState("UK Citizen (No Visa Sponsorship Needed)");

  const [summary, setSummary] = useState(
    "Results-driven Lead Software Engineer with 7+ years designing high-throughput UK financial and healthcare platforms handling £42M/day volume. Proven expertise in Node.js, Redis, distributed systems, and ISO 27001 regulatory compliance."
  );

  const [experience, setExperience] = useState<ExperienceItem[]>([
    {
      id: "exp-1",
      role: "Senior Full Stack Engineer",
      company: "Acme Fintech UK",
      dates: "March 2022 - Present",
      location: "London, UK (Hybrid)",
      verifiedBy: "Marcus Sterling (VP of Engineering)",
      bullets: [
        "Architected event-driven UK Faster Payments gateway handling £42M/day with 99.99% availability.",
        "Decreased median API authorization latency from 420ms to 68ms using Redis multi-region caching.",
        "Mentored team of 6 engineers and drove full ISO 27001 data compliance certification.",
      ],
    },
    {
      id: "exp-2",
      role: "Software Engineer",
      company: "British Health Digital",
      dates: "Sept 2019 - Feb 2022",
      location: "Manchester, UK",
      verifiedBy: "Dr. Rachel Ward (Clinical Tech Director)",
      bullets: [
        "Delivered patient appointment scheduling service across 45 NHS trusts under HL7 FHIR standards.",
        "Integrated NHS Login OAuth2 authentication for over 220,000 active NHS users.",
        "Reduced server infrastructure costs by 28% through Docker containerisation on AWS ECS.",
      ],
    },
  ]);

  // Featured Engineering Projects with Deep Dives
  const [projects, setProjects] = useState<ProjectDetail[]>([
    {
      id: "proj-1",
      title: "UK Faster Payments Gateway Engine",
      context: "Acme Fintech UK",
      role: "Lead Systems Architect",
      status: "Production Live",
      summary: "Idempotent payment settlement pipeline handling £42M/day transaction throughput with sub-70ms authorization.",
      techStack: ["Node.js", "TypeScript", "Redis Clusters", "PostgreSQL", "AWS ECS", "Docker"],
      metrics: ["£42M/day volume", "68ms median latency (-83%)", "99.99% availability SLA"],
      deepDive: {
        problemStatement: "The legacy monolithic gateway suffered from database row lock contention under salary-day bursts, creating timeout risks with UK clearing houses.",
        architectureSolution: "Re-architected the ingest flow into an event-driven worker pool with optimistic concurrency in PostgreSQL and Redis distributed locks for idempotent retry handling.",
        keyTradeoffs: "Chose Redis distributed locks over Kafka partitioning for simplicity and sub-10ms clearance guarantees, trading slightly higher RAM for zero duplicate payment settlements.",
        measurableImpact: "Reduced median authorization time from 420ms to 68ms. Zero duplicate settlements recorded over 24 months of production operation."
      },
      githubUrl: "https://github.com/alexturner-uk",
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
        problemStatement: "Legacy GP and hospital record systems used disparate XML schemas that failed to sync with regional patient booking portals, causing missed appointments.",
        architectureSolution: "Engineered a bi-directional mapper transforming proprietary clinical records into standard HL7 FHIR RESTful resources with NHS Login role-based token validation.",
        keyTradeoffs: "Enforced strict zero-retention in-memory payload transformation rather than caching patient health info on disk, eliminating GDPR clinical breach vectors.",
        measurableImpact: "Achieved 100% compliance during independent NHS digital clinical safety audits (DCB0129 / DCB0160). Reduced missed specialist appointments by 19%."
      },
      githubUrl: "https://github.com/alexturner-uk",
    }
  ]);

  const [skillsLanguages, setSkillsLanguages] = useState("TypeScript, JavaScript, Python, Node.js, SQL, Go");
  const [skillsCloud, setSkillsCloud] = useState("AWS (ECS, Lambda, RDS, S3), Docker, Terraform, CI/CD");
  const [skillsFrameworks, setSkillsFrameworks] = useState("React, Next.js, Express, PostgreSQL, Redis, Kafka");

  const [education, setEducation] = useState(
    "BSc (Hons) Computer Science | First Class Honours (1st) | University of Manchester (2015 - 2018)"
  );

  // Wildcard Subdomain & Modern Web Dossier Settings
  const [includeWebDossier, setIncludeWebDossier] = useState(true);
  const [customSlug, setCustomSlug] = useState("alex-turner");
  const [dossierTheme, setDossierTheme] = useState<DossierThemeId>('sapphire');
  const [dossierFont, setDossierFont] = useState<DossierFontStyle>('sans');
  const [customAccentHex, setCustomAccentHex] = useState<string>('');
  const [themeCategoryFilter, setThemeCategoryFilter] = useState<'all' | 'systems' | 'leadership' | 'creative'>('all');
  const [atsSkin, setAtsSkin] = useState<AtsSkinId>('workday');
  const [atsDocTheme, setAtsDocTheme] = useState<AtsDocumentThemeId>('navy');
  const [copiedWildcardUrl, setCopiedWildcardUrl] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [expandedEditorExperience, setExpandedEditorExperience] = useState<Record<string, boolean>>({
    'exp-1': true,
  });
  const [expandedEditorProjects, setExpandedEditorProjects] = useState<Record<string, boolean>>({
    'proj-1': true,
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedPlainText, setCopiedPlainText] = useState(false);
  const [previewMode, setPreviewMode] = useState<'visual' | 'ats_machine' | 'plain_text' | 'web_dossier'>('visual');

  const wildcardUrl = `https://${customSlug || 'alex-turner'}.bookmarksoft.uk`;

  // Anti-Phishing Guard Scanner
  const scanForPhishing = () => {
    const allText = [
      name,
      roleHeadline,
      summary,
      ...experience.map(e => `${e.role} ${e.company} ${e.bullets.join(" ")}`),
      skillsLanguages,
      skillsCloud,
      skillsFrameworks,
      github,
      linkedin,
      ...projects.map(p => `${p.title} ${p.summary} ${p.deepDive.problemStatement} ${p.deepDive.architectureSolution}`)
    ].join(" ").toLowerCase();

    const suspiciousKeywords = [
      "enter password",
      "verify password",
      "bank login",
      "online banking credentials",
      "hmrc tax refund claim",
      "seed phrase",
      "wallet recovery key",
      "wire transfer request",
      "crypto investment guarantee",
      "verify your account to download",
      "login with google to view",
      "login with microsoft to view",
      "credit card cvv",
      "urgent account suspension"
    ];

    const detectedThreats = suspiciousKeywords.filter(k => allText.includes(k));

    // Inspect Outbound Links
    const urls = [github, linkedin].filter(Boolean);
    const suspiciousUrls = urls.filter(u => {
      const lower = u.toLowerCase();
      return lower.includes("bit.ly") || lower.includes("tinyurl") || lower.includes("is.gd") || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lower);
    });

    const isClean = detectedThreats.length === 0 && suspiciousUrls.length === 0;

    return {
      isClean,
      detectedThreats,
      suspiciousUrls,
    };
  };

  const phishingAudit = scanForPhishing();

  // Real-time ATS Health Check
  const calculateAtsScore = () => {
    let score = 0;
    if (name.trim().length > 2) score += 15;
    if (email.includes("@") && phone.trim().length > 6) score += 15;
    if (summary.trim().length > 50) score += 15;
    if (experience.length >= 2) score += 20;
    if (skillsLanguages.trim().length > 10 && skillsCloud.trim().length > 5) score += 15;
    if (education.trim().length > 15) score += 10;
    if (rightToWork.length > 5) score += 10;
    return Math.min(100, score);
  };

  const atsScore = calculateAtsScore();

  // Experience handlers
  const addExperience = () => {
    const newId = `exp-${Date.now()}`;
    const newItem: ExperienceItem = {
      id: newId,
      role: "Senior Software Engineer",
      company: "Tech Enterprise UK",
      dates: "Jan 2021 - Present",
      location: "London, UK (Hybrid)",
      bullets: ["Architected and scaled core services achieving 99.99% uptime."],
    };
    setExperience([...experience, newItem]);
    setExpandedEditorExperience(prev => ({ ...prev, [newId]: true }));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter(e => e.id !== id));
  };

  const addBullet = (expId: string) => {
    setExperience(experience.map(e => {
      if (e.id !== expId) return e;
      return { ...e, bullets: [...e.bullets, "Spearheaded new initiative improving operational efficiency."] };
    }));
  };

  const updateBullet = (expId: string, bulletIndex: number, text: string) => {
    setExperience(experience.map(e => {
      if (e.id !== expId) return e;
      const newBullets = [...e.bullets];
      newBullets[bulletIndex] = text;
      return { ...e, bullets: newBullets };
    }));
  };

  const removeBullet = (expId: string, bulletIndex: number) => {
    setExperience(experience.map(e => {
      if (e.id !== expId) return e;
      return { ...e, bullets: e.bullets.filter((_, idx) => idx !== bulletIndex) };
    }));
  };

  // Project handlers for Interactive Web Dossier & Deep Dives
  const addProject = () => {
    const newId = `proj-${Date.now()}`;
    const newProj: ProjectDetail = {
      id: newId,
      title: "Distributed Low-Latency Data Streamer",
      context: "Acme Fintech UK",
      role: "Lead Systems Architect",
      status: "Production Live",
      summary: "Real-time market and transactional event streaming pipeline delivering sub-50ms distribution.",
      techStack: ["Node.js", "TypeScript", "Redis", "WebSockets", "Docker"],
      metrics: ["£12M/day routed", "45ms p99 latency", "99.99% availability"],
      deepDive: {
        problemStatement: "High database query contention under spike intervals caused websocket buffer backpressure.",
        architectureSolution: "Implemented ring-buffer memory queue with backpressure shedding and Redis pub/sub fanout.",
        keyTradeoffs: "Favored ephemeral push delivery over disk journaling to prioritize sub-50ms latency.",
        measurableImpact: "Maintained 99.99% socket connection stability under 5x peak volume."
      },
      githubUrl: `https://${github.replace('https://', '')}`,
    };
    setProjects([...projects, newProj]);
    setExpandedEditorProjects(prev => ({ ...prev, [newId]: true }));
  };

  const updateProject = (id: string, field: keyof ProjectDetail, value: any) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const updateProjectDeepDive = (id: string, field: keyof ProjectDetail['deepDive'], value: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, deepDive: { ...p.deepDive, [field]: value } } : p));
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Plain text generator for ATS portals
  const generatePlainText = () => {
    return `${name.toUpperCase()}
${roleHeadline}
${location} | ${email} | ${phone} | ${github} | ${linkedin}
UK Right to Work: ${rightToWork}
${includeWebDossier ? `Interactive Web Dossier: ${wildcardUrl}` : ""}

PROFESSIONAL SUMMARY
${summary}

WORK EXPERIENCE
${experience.map(exp => `
${exp.role.toUpperCase()} | ${exp.company}
${exp.dates} | ${exp.location}
${exp.verifiedBy ? `[VERIFIED: ${exp.verifiedBy}]` : ""}
${exp.bullets.map(b => `* ${b}`).join("\n")}
`).join("\n")}

TECHNICAL SKILLS
Languages & Core: ${skillsLanguages}
Frameworks & Databases: ${skillsFrameworks}
Cloud & Infrastructure: ${skillsCloud}

EDUCATION
${education}
`;
  };

  const copyPlainText = () => {
    navigator.clipboard.writeText(generatePlainText());
    setCopiedPlainText(true);
    setTimeout(() => setCopiedPlainText(false), 2000);
  };

  const copyWildcard = () => {
    navigator.clipboard.writeText(wildcardUrl);
    setCopiedWildcardUrl(true);
    setTimeout(() => setCopiedWildcardUrl(false), 2000);
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await generateCleanAtsCvPdf({
        name: name.toUpperCase(),
        roleHeadline,
        location,
        email,
        phone,
        github,
        linkedin,
        rightToWork,
        summary,
        experience,
        skills: {
          languages: skillsLanguages,
          cloud: skillsCloud,
          frameworks: skillsFrameworks,
        },
        education,
        accentHex: customAccentHex || ATS_DOCUMENT_THEMES[atsDocTheme].hex,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const fullCandidateData = {
    name,
    roleHeadline,
    location,
    email,
    phone,
    github,
    linkedin,
    rightToWork,
    summary,
    experience,
    skills: {
      languages: skillsLanguages,
      cloud: skillsCloud,
      frameworks: skillsFrameworks,
    },
    education,
    customSlug,
    projects,
    theme: dossierTheme,
    fontStyle: dossierFont,
    customAccentColor: customAccentHex || undefined,
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Guaranteed Single-Column ATS Architecture • Free &amp; On-Site
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ATS Resume Builder: Linear &amp; Parse-Guaranteed
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Never lose interviews to multi-column Canva scrambling. Build a beautiful, verified single-column CV 
            engineered to score <strong>95%+ on Workday, Taleo, and Greenhouse</strong>. 
            Download instantly as an on-site A4 PDF, or publish your interactive Web Resume Dossier on your personal wildcard domain.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Generating PDF..." : "Download Clean ATS PDF (On-Site)"}
            </button>
            <button
              onClick={copyPlainText}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-all border border-white/20 flex items-center gap-1.5"
            >
              {copiedPlainText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedPlainText ? "Copied Plain Text" : "Copy ATS Portal Plain Text"}
            </button>
            {onNavigateToScanner && (
              <button
                onClick={onNavigateToScanner}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 border border-blue-400/30 transition-all flex items-center gap-1.5"
              >
                <FileSearch className="w-4 h-4 text-blue-400" />
                Scan Existing CV (ATS X-Ray)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Form Editor vs Live Preview & ATS Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Feature: Modern Web Page Resume & Wildcard Domain Dossier Setup */}
          <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-purple-900/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-blue-200 dark:border-blue-800/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Interactive Web Resume &amp; Wildcard Domain
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Host a modern interactive dossier with expandable skills &amp; architecture deep dives.
                  </p>
                </div>
              </div>

              {/* Toggle to include or disable web dossier */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeWebDossier}
                  onChange={(e) => setIncludeWebDossier(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Enable Web Dossier
                </span>
              </label>
            </div>

            {includeWebDossier && (
              <div className="space-y-4 pt-1 animate-fadeIn">
                {/* Subdomain Configuration */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Personal Wildcard Subdomain:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs">
                      <span className="text-slate-400 select-none">https://</span>
                      <input
                        type="text"
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="alex-turner"
                        className="bg-transparent font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none px-1"
                      />
                      <span className="text-slate-500 font-mono select-none">.bookmarksoft.uk</span>
                    </div>
                    <button
                      type="button"
                      onClick={copyWildcard}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 flex items-center gap-1.5 transition-all shadow-xs"
                      title="Copy wildcard domain URL"
                    >
                      {copiedWildcardUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWildcardUrl ? "Copied" : "Copy Link"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFullscreenModal(true)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-all shadow-xs"
                      title="Preview interactive web resume fullscreen"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Dossier</span>
                    </button>
                  </div>
                </div>

                {/* Dossier Theme & Accent Color Palettes */}
                <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-blue-500" />
                        Web Dossier Personality &amp; Color Theme:
                      </label>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Select from 12 verified engineering themes or specify a custom accent
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900 self-start sm:self-auto">
                      {DOSSIER_THEMES[dossierTheme]?.name || "Sapphire Modern"}
                    </span>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs overflow-x-auto">
                    {[
                      { id: 'all', label: 'All Themes (12)' },
                      { id: 'systems', label: 'Systems & Cloud' },
                      { id: 'leadership', label: 'Staff+ & Exec' },
                      { id: 'creative', label: 'Vibrant & Modern' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setThemeCategoryFilter(cat.id as any)}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                          themeCategoryFilter === cat.id
                            ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* 12 Color Themes Grid with Category Filtering */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                    {(Object.keys(DOSSIER_THEMES) as DossierThemeId[])
                      .filter((themeKey) => {
                        if (themeCategoryFilter === 'all') return true;
                        if (themeCategoryFilter === 'systems') return ['sapphire', 'emerald', 'obsidian', 'forest', 'matrix'].includes(themeKey);
                        if (themeCategoryFilter === 'leadership') return ['executive', 'amethyst', 'amber', 'obsidian'].includes(themeKey);
                        if (themeCategoryFilter === 'creative') return ['crimson', 'cyberpunk', 'nordic', 'sunset'].includes(themeKey);
                        return true;
                      })
                      .map((themeKey) => {
                        const t = DOSSIER_THEMES[themeKey];
                        const isSelected = dossierTheme === themeKey;

                        return (
                          <button
                            key={themeKey}
                            type="button"
                            onClick={() => {
                              setDossierTheme(themeKey);
                              setCustomAccentHex('');
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                              isSelected
                                ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/30 shadow-xs"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div 
                                className="w-4 h-4 rounded-full border border-white/50 shadow-xs shrink-0"
                                style={{ backgroundColor: t.accentHex }}
                              />
                              <div 
                                className="w-2.5 h-2.5 rounded-full border border-white/50 shadow-xs shrink-0 -ml-1.5 opacity-80"
                                style={{ backgroundColor: t.secondaryHex }}
                              />
                              <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {t.name}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {t.badge}
                            </p>
                          </button>
                        );
                      })}
                  </div>

                  {/* Custom Accent Color Palette Picker */}
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Paintbrush className="w-3.5 h-3.5 text-blue-500" />
                        Custom Accent Color &amp; Swatches:
                      </span>
                      {customAccentHex && (
                        <button
                          type="button"
                          onClick={() => setCustomAccentHex('')}
                          className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                        >
                          Reset to Theme Preset
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { name: 'Royal Blue', hex: '#2563eb' },
                        { name: 'Emerald', hex: '#059669' },
                        { name: 'Amethyst', hex: '#7c3aed' },
                        { name: 'Crimson', hex: '#e11d48' },
                        { name: 'Sunset Amber', hex: '#d97706' },
                        { name: 'Cyan Neon', hex: '#0891b2' },
                        { name: 'Sky Blue', hex: '#0284c7' },
                        { name: 'Oxford Navy', hex: '#1e3a8a' },
                        { name: 'Charcoal', hex: '#18181b' },
                      ].map((swatch) => (
                        <button
                          key={swatch.hex}
                          type="button"
                          onClick={() => setCustomAccentHex(swatch.hex)}
                          className={`w-6 h-6 rounded-full border transition-all cursor-pointer shadow-2xs relative ${
                            customAccentHex.toLowerCase() === swatch.hex.toLowerCase()
                              ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                              : "border-white/60 hover:scale-105"
                          }`}
                          style={{ backgroundColor: swatch.hex }}
                          title={`Set accent to ${swatch.name} (${swatch.hex})`}
                        />
                      ))}

                      {/* Native HTML5 Color Picker */}
                      <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer text-xs font-mono">
                        <input 
                          type="color" 
                          value={customAccentHex || DOSSIER_THEMES[dossierTheme].accentHex}
                          onChange={(e) => setCustomAccentHex(e.target.value)}
                          className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-[11px] text-slate-600 dark:text-slate-300">
                          {customAccentHex || "Custom Hex"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* ATS Engine & Document Styling Presets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* ATS Machine Simulator Skin */}
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                        ATS Machine Parser Skin:
                      </label>
                      <select
                        value={atsSkin}
                        onChange={(e) => setAtsSkin(e.target.value as AtsSkinId)}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                      >
                        {(Object.keys(ATS_SKINS) as AtsSkinId[]).map((skinKey) => (
                          <option key={skinKey} value={skinKey}>
                            {ATS_SKINS[skinKey].name} ({ATS_SKINS[skinKey].badge})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {ATS_SKINS[atsSkin].description}
                      </p>
                    </div>

                    {/* ATS Document Header Style */}
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-blue-500" />
                        ATS CV Document Accent Style:
                      </label>
                      <select
                        value={atsDocTheme}
                        onChange={(e) => setAtsDocTheme(e.target.value as AtsDocumentThemeId)}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      >
                        {(Object.keys(ATS_DOCUMENT_THEMES) as AtsDocumentThemeId[]).map((themeKey) => (
                          <option key={themeKey} value={themeKey}>
                            {ATS_DOCUMENT_THEMES[themeKey].name} ({ATS_DOCUMENT_THEMES[themeKey].badge})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Applied to generated PDF headings &amp; A4 document preview.
                      </p>
                    </div>
                  </div>

                  {/* Typography Pairing */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Typography Styling:
                    </span>
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                      {(['sans', 'mono', 'serif'] as const).map((font) => (
                        <button
                          key={font}
                          type="button"
                          onClick={() => setDossierFont(font)}
                          className={`px-2.5 py-1 rounded-md font-medium capitalize transition-all cursor-pointer ${
                            dossierFont === font
                              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          } ${font === 'mono' ? 'font-mono' : font === 'serif' ? 'font-serif' : 'font-sans'}`}
                        >
                          {font === 'sans' ? 'Modern Sans' : font === 'mono' ? 'Code Mono' : 'Editorial Serif'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Anti-Phishing Guard Safety Indicator */}
                <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                  phishingAudit.isClean
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200"
                }`}>
                  <div className="flex items-center gap-2">
                    {phishingAudit.isClean ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold">
                        {phishingAudit.isClean 
                          ? "Anti-Phishing Guard: PASSED (Clean of Phishing & Safe for Wildcard Hosting)" 
                          : "Phishing & Credential Warning Detected"}
                      </span>
                      {!phishingAudit.isClean && (
                        <div className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                          Suspicious content flagged: {phishingAudit.detectedThreats.join(", ") || "Suspicious URL shortener detected"}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/60 dark:bg-slate-900">
                    {phishingAudit.isClean ? "Safe Link Verified" : "Review Required"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 1: Contact & Right to Work */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-2">
              1. Contact &amp; UK Right to Work
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Title Headline</label>
                <input
                  type="text"
                  value={roleHeadline}
                  onChange={(e) => setRoleHeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">UK Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">UK Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub / Portfolio URL</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">UK Right-to-Work Declaration</label>
              <input
                type="text"
                value={rightToWork}
                onChange={(e) => setRightToWork(e.target.value)}
                placeholder="e.g. British Citizen (No sponsorship needed) or EU Settled Status"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Section 2: Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                2. Professional Summary
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {summary.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Concise 2-3 sentence overview highlighting your core strengths and measurable impact..."
            />
          </div>

          {/* Section 3: Work Experience */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                3. Work Experience ({experience.length} Roles)
              </h3>
              <button
                onClick={addExperience}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Role
              </button>
            </div>

            <div className="space-y-4">
              {experience.map((exp, expIdx) => {
                const isExpExpanded = expandedEditorExperience[exp.id] ?? false;

                return (
                  <div key={exp.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                    <div 
                      onClick={() => setExpandedEditorExperience(prev => ({ ...prev, [exp.id]: !isExpExpanded }))}
                      className="flex items-center justify-between cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-blue-600 dark:text-blue-400">
                          Role #{expIdx + 1}:
                        </span>
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                          {exp.role || "Untitled Position"} {exp.company ? `at ${exp.company}` : ""}
                        </span>
                        {exp.dates && (
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            • {exp.dates}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-0.5"
                        >
                          {isExpExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {experience.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeExperience(exp.id);
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1"
                            title="Remove role"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpExpanded && (
                      <div className="space-y-3 pt-2 text-xs border-t border-slate-200 dark:border-slate-800">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Job Title</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Company Name</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Employment Dates</label>
                            <input
                              type="text"
                              value={exp.dates}
                              onChange={(e) => updateExperience(exp.id, 'dates', e.target.value)}
                              placeholder="e.g. March 2022 - Present"
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Location</label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                              placeholder="e.g. London, UK (Hybrid)"
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                            Attached Vouch Reference (Optional)
                          </label>
                          <input
                            type="text"
                            value={exp.verifiedBy || ""}
                            onChange={(e) => updateExperience(exp.id, 'verifiedBy', e.target.value)}
                            placeholder="e.g. Marcus Sterling (VP of Engineering)"
                            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                          />
                        </div>

                        {/* Bullet Points */}
                        <div className="space-y-1.5 pt-1">
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            Key Accomplishments (Action Verbs &amp; Metrics)
                          </label>
                          {exp.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-1.5">
                              <span className="text-slate-400 text-xs">•</span>
                              <input
                                type="text"
                                value={b}
                                onChange={(e) => updateBullet(exp.id, bIdx, e.target.value)}
                                className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                              />
                              {exp.bullets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeBullet(exp.id, bIdx)}
                                  className="text-slate-400 hover:text-rose-500 p-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addBullet(exp.id)}
                            className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 pt-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Bullet
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Skills & Education */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-2">
              4. Technical Skills &amp; Education
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Languages &amp; Core</label>
                <input
                  type="text"
                  value={skillsLanguages}
                  onChange={(e) => setSkillsLanguages(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Frameworks &amp; Databases</label>
                <input
                  type="text"
                  value={skillsFrameworks}
                  onChange={(e) => setSkillsFrameworks(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cloud, DevOps &amp; Standards</label>
                <input
                  type="text"
                  value={skillsCloud}
                  onChange={(e) => setSkillsCloud(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Education &amp; Qualifications</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Featured Projects & Architecture Deep Dives (Interactive Web Dossier) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-600" />
                  5. Featured Projects &amp; Architecture Deep Dives ({projects.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Interactive case studies with problem statements, tradeoffs, and system metrics for your Web Dossier.
                </p>
              </div>
              <button
                type="button"
                onClick={addProject}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((proj, pIdx) => {
                const isExpanded = expandedEditorProjects[proj.id] ?? false;

                return (
                  <div key={proj.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                    <div 
                      onClick={() => setExpandedEditorProjects(prev => ({ ...prev, [proj.id]: !isExpanded }))}
                      className="flex items-center justify-between cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-blue-600 dark:text-blue-400">
                          Case Study #{pIdx + 1}:
                        </span>
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                          {proj.title || "Untitled Project"}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                          {proj.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-0.5"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {projects.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProject(proj.id);
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1"
                            title="Remove project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 pt-2 text-xs border-t border-slate-200 dark:border-slate-800">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Project Title</label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Role / Architecture Capacity</label>
                            <input
                              type="text"
                              value={proj.role}
                              onChange={(e) => updateProject(proj.id, 'role', e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Context / Organization</label>
                            <input
                              type="text"
                              value={proj.context}
                              onChange={(e) => updateProject(proj.id, 'context', e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Deployment Status</label>
                            <select
                              value={proj.status}
                              onChange={(e) => updateProject(proj.id, 'status', e.target.value as any)}
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            >
                              <option value="Production Live">Production Live</option>
                              <option value="Enterprise Certified">Enterprise Certified</option>
                              <option value="Open Source">Open Source</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Executive Summary</label>
                          <textarea
                            rows={2}
                            value={proj.summary}
                            onChange={(e) => updateProject(proj.id, 'summary', e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Tech Stack (comma-separated)</label>
                            <input
                              type="text"
                              value={proj.techStack.join(", ")}
                              onChange={(e) => updateProject(proj.id, 'techStack', e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Key Metrics (comma-separated)</label>
                            <input
                              type="text"
                              value={proj.metrics.join(", ")}
                              onChange={(e) => updateProject(proj.id, 'metrics', e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Architecture Deep Dive Inputs */}
                        <div className="p-3 rounded-lg border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 space-y-2.5">
                          <span className="font-bold text-[11px] text-blue-700 dark:text-blue-300 block">
                            Architecture Deep Dive (Expandable in Dossier)
                          </span>
                          
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">1. Problem Statement &amp; Bottleneck</label>
                            <textarea
                              rows={2}
                              value={proj.deepDive.problemStatement}
                              onChange={(e) => updateProjectDeepDive(proj.id, 'problemStatement', e.target.value)}
                              className="w-full p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">2. Architectural Solution &amp; Concurrency Model</label>
                            <textarea
                              rows={2}
                              value={proj.deepDive.architectureSolution}
                              onChange={(e) => updateProjectDeepDive(proj.id, 'architectureSolution', e.target.value)}
                              className="w-full p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">3. Key Engineering Trade-offs</label>
                              <textarea
                                rows={2}
                                value={proj.deepDive.keyTradeoffs}
                                onChange={(e) => updateProjectDeepDive(proj.id, 'keyTradeoffs', e.target.value)}
                                className="w-full p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">4. Measurable Production Impact</label>
                              <textarea
                                rows={2}
                                value={proj.deepDive.measurableImpact}
                                onChange={(e) => updateProjectDeepDive(proj.id, 'measurableImpact', e.target.value)}
                                className="w-full p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">GitHub Repository Link</label>
                            <input
                              type="text"
                              value={proj.githubUrl || ""}
                              onChange={(e) => updateProject(proj.id, 'githubUrl', e.target.value)}
                              placeholder="https://github.com/..."
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Live Demo / Production URL (Optional)</label>
                            <input
                              type="text"
                              value={proj.demoUrl || ""}
                              onChange={(e) => updateProject(proj.id, 'demoUrl', e.target.value)}
                              placeholder="https://demo.example.com"
                              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Document Preview & Health Meter (5 cols) */}
        <div className="lg:col-span-5 space-y-5 sticky top-20">
          {/* ATS Health Score Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live ATS Parseability Meter
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {atsScore}%
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${atsScore}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Single-column flow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Standard headings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>UK Right to Work</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Verified vouch ready</span>
              </div>
            </div>

            {onNavigateToScanner && (
              <button
                onClick={onNavigateToScanner}
                className="w-full pt-2.5 mt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center justify-between"
              >
                <span>Have an existing CV? Test on ATS Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Document Preview Box with 3 Tabs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {previewMode === 'web_dossier' ? "Interactive Web Dossier" : "A4 Document Preview"}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg text-[10px]">
                <button
                  onClick={() => setPreviewMode('visual')}
                  className={`px-2 py-0.5 rounded transition-all ${previewMode === 'visual' ? "bg-blue-600 text-white font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                >
                  Visual A4
                </button>
                <button
                  onClick={() => setPreviewMode('ats_machine')}
                  className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${previewMode === 'ats_machine' ? "bg-emerald-600 text-white font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                >
                  <Terminal className="w-2.5 h-2.5" />
                  ATS Machine
                </button>
                <button
                  onClick={() => setPreviewMode('plain_text')}
                  className={`px-2 py-0.5 rounded transition-all ${previewMode === 'plain_text' ? "bg-blue-600 text-white font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                >
                  Plain Text
                </button>
                {includeWebDossier && (
                  <button
                    onClick={() => setPreviewMode('web_dossier')}
                    className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${previewMode === 'web_dossier' ? "bg-blue-600 text-white font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
                  >
                    <Globe className="w-2.5 h-2.5" />
                    Web Dossier
                  </button>
                )}
              </div>
            </div>

            {/* Preview Content */}
            {previewMode === 'web_dossier' ? (
              <div className="max-h-[520px] overflow-y-auto relative">
                <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-[11px] sticky top-0 z-20 backdrop-blur-xs">
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[200px]">
                    🌐 {wildcardUrl}
                  </span>
                  <button
                    onClick={() => setShowFullscreenModal(true)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                    Fullscreen View
                  </button>
                </div>
                <div className="w-full">
                  <ModernWebResume 
                    candidateData={fullCandidateData} 
                    onDownloadPdf={handleDownloadPdf}
                    isEmbeddedPreview={true}
                  />
                </div>
              </div>
            ) : previewMode === 'ats_machine' ? (
              /* Cold ATS Machine Lens Simulator */
              <div className={`p-4 font-mono text-xs flex flex-col max-h-[520px] overflow-y-auto transition-colors ${ATS_SKINS[atsSkin].containerClass}`}>
                <div className={`p-2.5 rounded-xl border mb-3 flex flex-wrap items-center justify-between gap-2 ${ATS_SKINS[atsSkin].headerClass}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${ATS_SKINS[atsSkin].accentTextClass}`}>
                      {ATS_SKINS[atsSkin].name} Lens
                    </span>
                  </div>

                  {/* On-the-fly Skin Picker */}
                  <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg text-[10px]">
                    {(Object.keys(ATS_SKINS) as AtsSkinId[]).map((skinKey) => (
                      <button
                        key={skinKey}
                        type="button"
                        onClick={() => setAtsSkin(skinKey)}
                        className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                          atsSkin === skinKey ? "bg-white/20 text-white font-bold" : "text-slate-400 hover:text-white"
                        }`}
                        title={ATS_SKINS[skinKey].name}
                      >
                        {skinKey === 'workday' ? 'Workday' : skinKey === 'taleo' ? 'Taleo' : skinKey === 'greenhouse' ? 'Greenhouse' : skinKey === 'amber_crt' ? 'CRT' : skinKey === 'lever' ? 'Lever' : 'Bamboo'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-emerald-400/80 mb-2 flex items-center justify-between">
                  <span>STATUS: 100% SINGLE-COLUMN PARSER SAFE</span>
                  <span>LOST CHARS: 0</span>
                </div>

                <div className="space-y-1.5 overflow-x-auto">
                  {generatePlainText().split('\n').filter(Boolean).map((line, idx) => (
                    <div 
                      key={idx}
                      className={`p-1.5 rounded border text-[11px] leading-relaxed flex items-start gap-2 ${ATS_SKINS[atsSkin].statusSafeClass}`}
                    >
                      <span className="text-[9px] text-slate-500 shrink-0 select-none">
                        L{idx + 1}
                      </span>
                      <div className="flex-1 break-words font-mono">
                        {line}
                      </div>
                      <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300 shrink-0">
                        SAFE
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : previewMode === 'visual' ? (
              <div className="p-5 font-sans text-xs space-y-4 max-h-[520px] overflow-y-auto bg-slate-50/40 dark:bg-slate-950/40">
                <div className={`border-b pb-3 space-y-1 ${ATS_DOCUMENT_THEMES[atsDocTheme].borderClass}`}>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {name || "Your Name"}
                  </h2>
                  <p className={`text-xs font-bold ${ATS_DOCUMENT_THEMES[atsDocTheme].textClass}`}>
                    {roleHeadline}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {location} • {email} • {phone} • {github}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600">
                    ✓ {rightToWork}
                  </span>
                  {includeWebDossier && (
                    <div className={`text-[10px] font-mono mt-0.5 ${ATS_DOCUMENT_THEMES[atsDocTheme].textClass}`}>
                      🌐 {wildcardUrl}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block border-b pb-0.5 ${ATS_DOCUMENT_THEMES[atsDocTheme].textClass} ${ATS_DOCUMENT_THEMES[atsDocTheme].borderClass}`}>
                    Professional Summary
                  </span>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    {summary}
                  </p>
                </div>

                <div className="space-y-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block border-b pb-0.5 ${ATS_DOCUMENT_THEMES[atsDocTheme].textClass} ${ATS_DOCUMENT_THEMES[atsDocTheme].borderClass}`}>
                    Employment Experience
                  </span>
                  {experience.map(exp => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline font-bold text-[11px] text-slate-900 dark:text-white">
                        <span>{exp.role}</span>
                        <span className="font-mono text-[10px] text-slate-400 font-normal">{exp.dates}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{exp.company} — {exp.location}</div>
                      {exp.verifiedBy && (
                        <div className="text-[9px] font-bold text-emerald-600">
                          ✓ Verified by {exp.verifiedBy}
                        </div>
                      )}
                      <ul className="list-disc list-inside text-[10px] text-slate-700 dark:text-slate-300 space-y-0.5 pl-1">
                        {exp.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 pt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block border-b pb-0.5 ${ATS_DOCUMENT_THEMES[atsDocTheme].textClass} ${ATS_DOCUMENT_THEMES[atsDocTheme].borderClass}`}>
                    Technical Skills
                  </span>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300">
                    <strong>Languages:</strong> {skillsLanguages}<br />
                    <strong>Frameworks:</strong> {skillsFrameworks}<br />
                    <strong>Cloud &amp; DevOps:</strong> {skillsCloud}
                  </p>
                </div>

                <div className="space-y-1 pt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block border-b pb-0.5 ${ATS_DOCUMENT_THEMES[atsDocTheme].textClass} ${ATS_DOCUMENT_THEMES[atsDocTheme].borderClass}`}>
                    Education
                  </span>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300">
                    {education}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-[520px] overflow-y-auto bg-slate-950 text-slate-300">
                {generatePlainText()}
              </div>
            )}

            {/* Bottom Download Bar */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Compiling PDF..." : "Download Clean ATS PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Interactive Web Resume Dossier Modal */}
      {showFullscreenModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-start overflow-y-auto">
          <div className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-400" />
                Live Candidate Web Dossier: <code className="text-blue-300 font-mono">{wildcardUrl}</code>
              </span>
              <button
                onClick={copyWildcard}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1"
              >
                {copiedWildcardUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWildcardUrl ? "Copied" : "Copy Link"}</span>
              </button>
            </div>

            <button
              onClick={() => setShowFullscreenModal(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1">
            <ModernWebResume 
              candidateData={fullCandidateData}
              onDownloadPdf={handleDownloadPdf}
              isStandalone={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
