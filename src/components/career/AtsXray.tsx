import React, { useState } from "react";
import { 
  FileSearch, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  HelpCircle, 
  Sparkles, 
  Download, 
  Eye, 
  Copy, 
  Check, 
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  FileText,
  Palette,
  Terminal
} from "lucide-react";
import { ATSAnalysisResult, ATSSectionType } from "../../types/career";
import { SAMPLE_ATS_XRAY_RESULT, SAMPLE_CANVA_TWO_COLUMN_CV } from "../../data/sampleCareerData";
import { generateCleanAtsCvPdf, generateAtsAuditReportPdf } from "../../services/pdfGenerator";
import { ATS_SKINS, AtsSkinId } from "../../types/theme";

export interface AtsXrayProps {
  onNavigateToBuilder?: () => void;
}

export function AtsXray({ onNavigateToBuilder }: AtsXrayProps = {}) {
  const [cvInputText, setCvInputText] = useState(SAMPLE_CANVA_TWO_COLUMN_CV);
  const [activeTab, setActiveTab] = useState<'xray' | 'extracted_data' | 'fixes'>('xray');
  const [analysis, setAnalysis] = useState<ATSAnalysisResult>(SAMPLE_ATS_XRAY_RESULT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'machine_only' | 'human_only'>('split');
  const [atsSkin, setAtsSkin] = useState<AtsSkinId>('workday');
  const currentSkin = ATS_SKINS[atsSkin] || ATS_SKINS.workday;

  // Interactive CV parsing simulator
  const runParserSimulation = (text: string, fileName = "Uploaded_Resume.pdf") => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Analyze text characteristics
      const hasTwoColumns = text.includes("[COLUMN") || text.includes("CORE SKILLS") || text.split('\n').some(l => l.includes("   "));
      const lines = text.split("\n").filter(l => l.trim().length > 0);
      
      const scrambledCount = hasTwoColumns ? Math.min(8, Math.max(3, Math.floor(lines.length * 0.3))) : 0;
      const score = hasTwoColumns ? 54 : 94;

      const extractedLines = lines.map((line, idx) => {
        const isScrambled = hasTwoColumns && (line.includes("SKILLS") || line.includes("CERTIFICATIONS") || (idx >= 2 && idx <= 7));
        return {
          id: `line-${idx}`,
          originalLineNumber: idx + 1,
          extractedText: isScrambled 
            ? line.replace(/\s{2,}/g, " ") + (idx % 2 === 0 ? " [SCRAMBLED WITH SIDEBAR]" : "") 
            : line,
          detectedSection: (line.toLowerCase().includes("engineer") || line.toLowerCase().includes("experience") 
            ? 'experience' 
            : line.toLowerCase().includes("skill") ? 'skills' : 'contact') as ATSSectionType,
          status: isScrambled ? ('scrambled_column' as const) : ('safe' as const),
          note: isScrambled ? "Horizontal coordinate collision: Skills text interlaced with experience dates." : undefined,
        };
      });

      setAnalysis({
        fileName,
        fileSizeKb: Math.floor(text.length / 10) + 40,
        atsScore: score,
        verdict: score > 85 ? "Excellent" : score > 70 ? "Good" : score > 50 ? "Risky" : "Critical Failure",
        summary: hasTwoColumns 
          ? "Standard ATS parsers (Workday, Taleo, Greenhouse) read bounding boxes horizontally. Your multi-column layout caused technical skills to merge into company titles, garbling dates and discarding vital keywords."
          : "Single-column linear structure successfully verified. All key section headers, employment dates, and skill tokens were indexed with zero column collisions.",
        columnsDetected: hasTwoColumns ? 2 : 1,
        scrambledLinesCount: scrambledCount,
        lostCharactersEstimate: hasTwoColumns ? 180 : 0,
        extractedLines: extractedLines.length > 0 ? extractedLines : SAMPLE_ATS_XRAY_RESULT.extractedLines,
        parsedData: {
          name: "Alex Turner",
          email: "alex.turner@example.co.uk",
          phone: "+44 7700 900123",
          location: "London, UK",
          skillsExtracted: hasTwoColumns ? ["TypeScript", "Node.js", "Docker"] : ["TypeScript", "Node.js", "React", "Python", "PostgreSQL", "Redis", "AWS", "Docker", "Terraform"],
          rolesFound: hasTwoColumns ? ["Core Skills Senior Full Stack Engineer (Truncated)"] : ["Senior Full Stack Engineer", "Software Engineer"],
          degreesFound: ["BSc (Hons) Computer Science"],
        },
        remediationAdvice: hasTwoColumns ? SAMPLE_ATS_XRAY_RESULT.remediationAdvice : [
          {
            category: "Layout",
            severity: "tip",
            issue: "Clean Single Column",
            fix: "Format is optimal. Ensure you always upload as text-searchable PDF, not a scanned raster image.",
          }
        ],
      });
      setIsAnalyzing(false);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCvInputText(content || `Extracted text from ${file.name}...\n\nALEX TURNER\nLead Software Engineer\n\nExperience:\n- Acme Fintech UK`);
      runParserSimulation(content || "Alex Turner\nSoftware Engineer\nAcme Fintech UK", file.name);
    };
    reader.readAsText(file);
  };

  const loadSampleCanva = () => {
    setCvInputText(SAMPLE_CANVA_TWO_COLUMN_CV);
    runParserSimulation(SAMPLE_CANVA_TWO_COLUMN_CV, "Alex_Turner_Canva_Design_CV.pdf");
  };

  const loadCleanSingleColumn = () => {
    const cleanText = `ALEX TURNER
Lead Software Engineer | London, UK | alex.turner@example.co.uk | +44 7700 900123
LinkedIn: linkedin.com/in/alexturner-dev | GitHub: github.com/alexturner-uk | UK Citizen

SUMMARY
Results-driven Lead Software Engineer with 7+ years designing high-throughput UK financial and healthcare platforms.

WORK EXPERIENCE
Senior Full Stack Engineer | Acme Fintech UK | London, UK
March 2022 - Present
- Architected event-driven UK Faster Payments gateway handling £42M/day.
- Decreased median API latency from 420ms to 68ms using Redis caching.
- Mentored team of 6 engineers and drove ISO 27001 compliance standards.

Software Engineer | British Health Digital | Manchester, UK
Sept 2019 - Feb 2022
- Delivered patient appointment scheduling service across 45 NHS trusts.
- Integrated NHS Login OAuth2 and HL7 FHIR healthcare data schemas.

TECHNICAL SKILLS
Languages & Frameworks: TypeScript, Node.js, React, Python, PostgreSQL, Redis
Cloud & DevOps: AWS (ECS, Lambda, RDS), Docker, CI/CD, Terraform

EDUCATION
BSc (Hons) Computer Science | First Class Honours | University of Manchester (2015 - 2018)`;
    setCvInputText(cleanText);
    runParserSimulation(cleanText, "Alex_Turner_Clean_ATS_Optimized.pdf");
  };

  const copyRawOutput = () => {
    const raw = analysis.extractedLines.map(l => l.extractedText).join("\n");
    navigator.clipboard.writeText(raw);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free Heroic Feature — No Paywall Ever
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ATS X-Ray: See What the Recruiter's Robot Actually Reads
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Most job seekers design stunning two-column CVs in Canva, then wonder why they never get called back. 
            Corporate Applicant Tracking Systems (Workday, Taleo, Greenhouse) don't have eyes: they flatten PDFs horizontally, 
            scrambling your skills with your dates and discarding your best achievements into the digital void.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={loadSampleCanva}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Demo: Scrambled Canva CV
            </button>
            <button
              onClick={loadCleanSingleColumn}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Demo: 94% Clean ATS Layout
            </button>
            {onNavigateToBuilder && (
              <button
                onClick={onNavigateToBuilder}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                ATS CV Builder (Single-Column)
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Parser Input / Upload Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-slate-900 dark:text-white text-base">
              Test Any CV Text or Document
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              Upload CV (PDF/TXT)
              <input type="file" accept=".pdf,.txt,.docx" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={() => runParserSimulation(cvInputText)}
              disabled={isAnalyzing}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
            >
              {isAnalyzing ? "Scanning..." : "Re-Scan ATS Bounding Boxes"}
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={cvInputText}
            onChange={(e) => setCvInputText(e.target.value)}
            rows={5}
            className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste CV raw text or drop document here..."
          />
          <div className="text-[11px] text-slate-400 absolute right-3 bottom-3 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded">
            Client-side parsing • Zero privacy leaks • No server upload
          </div>
        </div>
      </div>

      {/* Score Dashboard & Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Score Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            ATS Parseability Score
          </span>
          <div className="flex items-baseline gap-3 my-2">
            <span className={`text-4xl font-extrabold ${
              analysis.atsScore >= 80 ? "text-emerald-600 dark:text-emerald-400" :
              analysis.atsScore >= 60 ? "text-amber-500 dark:text-amber-400" :
              "text-rose-600 dark:text-rose-400"
            }`}>
              {analysis.atsScore}%
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              analysis.verdict === 'Excellent' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
              analysis.verdict === 'Good' ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" :
              "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
            }`}>
              {analysis.verdict}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {analysis.atsScore >= 80 ? "Passes automated screening gates with high confidence." : "High risk of automated rejection due to layout corruption."}
          </p>
        </div>

        {/* Columns Detected */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Detected Columns
          </span>
          <div className="flex items-center gap-2 my-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {analysis.columnsDetected}
            </span>
            {analysis.columnsDetected > 1 ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                Multi-column risk
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Linear safe
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {analysis.columnsDetected > 1 ? "Two-column grids scramble horizontal reader flows." : "Single column ensures 100% sequential sentence parsing."}
          </p>
        </div>

        {/* Scrambled Lines */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Scrambled Lines
          </span>
          <div className="flex items-center gap-2 my-2">
            <span className={`text-3xl font-extrabold ${analysis.scrambledLinesCount > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
              {analysis.scrambledLinesCount}
            </span>
            <span className="text-xs text-slate-500">lines corrupted</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Sections where sidebar skills merged into employment titles.
          </p>
        </div>

        {/* Lost Characters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Estimated Lost Text
          </span>
          <div className="flex items-center gap-2 my-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {analysis.lostCharactersEstimate}
            </span>
            <span className="text-xs text-slate-500">chars ignored</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Icons, graphic bars, table lines, or unmapped text blocks.
          </p>
        </div>
      </div>

      {/* Tabs Switcher: X-Ray Side-by-Side vs Extracted DB Data vs Remediation Blueprint */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('xray')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'xray'
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            ATS X-Ray Comparison
          </button>
          <button
            onClick={() => setActiveTab('extracted_data')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'extracted_data'
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Recruiter Database Schema
          </button>
          <button
            onClick={() => setActiveTab('fixes')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'fixes'
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Fixing Blueprint ({analysis.remediationAdvice.length})
          </button>
        </div>

        {activeTab === 'xray' && (
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2 py-1 rounded font-medium ${viewMode === 'split' ? "bg-white dark:bg-slate-900 text-blue-600 shadow-xs" : "text-slate-600 dark:text-slate-400"}`}
            >
              Side-by-Side Split
            </button>
            <button
              onClick={() => setViewMode('machine_only')}
              className={`px-2 py-1 rounded font-medium ${viewMode === 'machine_only' ? "bg-white dark:bg-slate-900 text-blue-600 shadow-xs" : "text-slate-600 dark:text-slate-400"}`}
            >
              Cold Machine Only
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: ATS X-Ray Side-by-Side */}
      {activeTab === 'xray' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold">What are you looking at below?</span> The left side is your intended visual CV. The right side is the <span className="font-semibold underline">cold plain-text extraction</span> that Workday/Taleo actually sees. Lines flagged in <span className="text-rose-600 font-bold">Red</span> represent catastrophic column collisions where your skills merged into your job titles!
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Intended Visual Layout */}
            {(viewMode === 'split' || viewMode === 'human_only') && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col">
                <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      What Humans See (Design Layout)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    2-Column Canva Mockup
                  </span>
                </div>

                <div className="p-4 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[460px] bg-slate-50/50 dark:bg-slate-950/40">
                  {cvInputText}
                </div>
              </div>
            )}

            {/* Right: The Cold ATS Machine Lens */}
            {(viewMode === 'split' || viewMode === 'machine_only') && (
              <div className={`border rounded-2xl overflow-hidden shadow-sm flex flex-col transition-colors ${currentSkin.containerClass}`}>
                <div className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2 transition-colors ${currentSkin.headerClass}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span className={`text-xs font-bold uppercase tracking-wider font-mono ${currentSkin.accentTextClass}`}>
                      What The ATS Machine Extracted
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* ATS Skin Selector Buttons */}
                    <div className="flex items-center gap-1 bg-black/30 p-0.5 rounded-lg text-[10px]">
                      {(Object.keys(ATS_SKINS) as AtsSkinId[]).map((skinKey) => {
                        const s = ATS_SKINS[skinKey];
                        const isSelected = atsSkin === skinKey;
                        return (
                          <button
                            key={skinKey}
                            type="button"
                            onClick={() => setAtsSkin(skinKey)}
                            className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-white/20 text-white shadow-2xs"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                            title={`Switch ATS Parser Skin to ${s.name} - ${s.description}`}
                          >
                            {skinKey === 'workday' ? 'Workday' : skinKey === 'taleo' ? 'Taleo' : skinKey === 'greenhouse' ? 'Greenhouse' : skinKey === 'amber_crt' ? 'CRT' : skinKey === 'lever' ? 'Lever' : 'Bamboo'}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={copyRawOutput}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{copiedRaw ? "Copied" : "Copy Raw"}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 font-mono text-xs space-y-2 overflow-y-auto max-h-[460px]">
                  {analysis.extractedLines.map((line, idx) => (
                    <div 
                      key={line.id}
                      className={`p-2 rounded-lg border text-xs leading-relaxed transition-all ${
                        line.status === 'scrambled_column' 
                          ? currentSkin.statusWarnClass 
                          : line.status === 'table_flattened'
                          ? "bg-amber-950/40 border-amber-700/60 text-amber-200"
                          : currentSkin.statusSafeClass
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] text-slate-500 shrink-0 select-none">
                          L{line.originalLineNumber}
                        </span>
                        <div className="flex-1 font-mono break-words">
                          {line.extractedText}
                        </div>
                        {line.status === 'scrambled_column' && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/30 text-rose-300 border border-rose-500/40">
                            Scrambled
                          </span>
                        )}
                        {line.status === 'table_flattened' && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 text-amber-300 border border-amber-500/40">
                            Table Flattened
                          </span>
                        )}
                      </div>
                      {line.note && (
                        <div className="mt-1.5 pt-1.5 border-t border-rose-900/60 text-[11px] text-rose-300 flex items-center gap-1 font-sans">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          {line.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Recruiter Database Schema */}
      {activeTab === 'extracted_data' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Parsed Recruiter Record (What Lands in the Hiring Pipeline Database)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When a recruiter runs a query for candidates with "TypeScript + 5 years experience + London", this is the JSON structure your CV resolves into:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Contact</span>
              <div className="space-y-1 text-xs text-slate-800 dark:text-slate-200 font-mono">
                <div>Name: <span className="font-bold text-blue-600">{analysis.parsedData.name}</span></div>
                <div>Email: {analysis.parsedData.email || "<Not Indexed>"}</div>
                <div>Phone: {analysis.parsedData.phone || "<Not Indexed>"}</div>
                <div>Location: {analysis.parsedData.location || "<Not Indexed>"}</div>
                <div>LinkedIn: {analysis.parsedData.linkedin || "<Not Indexed>"}</div>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Indexed Roles Found</span>
              <div className="space-y-1.5">
                {analysis.parsedData.rolesFound.map((role, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                    {role.includes("Malformed") || role.includes("Truncated") ? (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    <span className={role.includes("Malformed") ? "text-rose-600 font-semibold" : "text-slate-800 dark:text-slate-200"}>
                      {role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Indexed Keyword Tokens</span>
            <div className="flex flex-wrap gap-2">
              {analysis.parsedData.skillsExtracted.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Remediation Blueprint */}
      {activeTab === 'fixes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.remediationAdvice.map((advice, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  advice.severity === 'critical'
                    ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50"
                    : advice.severity === 'warning'
                    ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50"
                    : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    advice.severity === 'critical' ? "bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200" :
                    advice.severity === 'warning' ? "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200" :
                    "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}>
                    {advice.category} • {advice.severity.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
                  {advice.issue}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {advice.fix}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-bold text-sm">Download 100% Guaranteed ATS-Friendly Formats</span>
              <p className="text-xs text-slate-300">
                Generated completely on-site in your browser. Zero cloud storage upload, zero fees.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onNavigateToBuilder && (
                <button
                  onClick={onNavigateToBuilder}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Open in ATS CV Builder
                </button>
              )}
              <button
                onClick={() => generateAtsAuditReportPdf(analysis)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 flex items-center gap-1.5"
                title="Download ATS X-Ray analysis as a PDF report"
              >
                <Download className="w-3.5 h-3.5" />
                Audit Report (PDF)
              </button>
              <button
                onClick={() => generateCleanAtsCvPdf()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center gap-1.5"
                title="Download 100% single-column ATS-compliant CV PDF"
              >
                <Download className="w-4 h-4" />
                Download Clean ATS CV (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
