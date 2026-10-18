import React, { useState } from "react";
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Lightbulb, 
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";
import { JobAdGapItem } from "../../types/career";
import { SAMPLE_JOB_GAP_ITEMS } from "../../data/sampleCareerData";

export function JobAdGapAnalysis() {
  const [jobAdText, setJobAdText] = useState(
    `We are seeking a Senior Full-Stack / Backend Engineer to join our London payments squad.
Key Requirements:
- Demonstrated experience designing high-throughput event streaming systems with Apache Kafka or AWS Kinesis.
- Hands-on experience with Kubernetes (EKS/GKE) and Helm charts in production environments.
- UK Right to Work: Must have valid permanent right to work in the UK without visa sponsorship.
- Familiarity with FCA regulatory compliance or Open Banking API specifications (PSD2/CDR).
- Strong track record mentoring junior and mid-level engineers.`
  );

  const [gapItems, setGapItems] = useState<JobAdGapItem[]>(SAMPLE_JOB_GAP_ITEMS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Search className="w-3.5 h-3.5" />
            Truth-Preserving Career AI
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Job-Ad Gap Analysis &amp; Honest Rewording
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Never invent experience you don't have. Paste any UK job specification to see exactly which requirements your CV already evidences, 
            which are missing or ambiguous, and receive honest, truth-preserving wording suggestions that pass ATS keyword filters without exaggerating.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            Job Specification Input
          </span>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
          >
            {isAnalyzing ? "Comparing..." : "Re-Analyze Gaps"}
          </button>
        </div>

        <textarea
          value={jobAdText}
          onChange={(e) => setJobAdText(e.target.value)}
          rows={5}
          className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Analysis Results Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 dark:text-white text-base">
            Evidenced Requirements vs. Gaps ({gapItems.length})
          </span>
          <span className="text-xs text-slate-500">
            Audit against Alex Turner's Verified CV
          </span>
        </div>

        <div className="space-y-3.5">
          {gapItems.map((item) => (
            <div 
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                item.evidenceInCv === 'strong'
                  ? "bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-900/60 shadow-xs"
                  : item.evidenceInCv === 'partial'
                  ? "bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-900/60 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-rose-300 dark:border-rose-900/60 shadow-xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.requirement}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.evidenceInCv === 'strong' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      Strong Evidence
                    </span>
                  )}
                  {item.evidenceInCv === 'partial' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      <AlertTriangle className="w-3 h-3" />
                      Partial / Ambiguous
                    </span>
                  )}
                  {item.evidenceInCv === 'missing' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      <XCircle className="w-3 h-3" />
                      Not Found in CV
                    </span>
                  )}
                </div>
              </div>

              {item.matchedSnippet && (
                <div className="mb-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                  <span className="text-[10px] text-slate-400 block font-sans">Current CV Evidence:</span>
                  "{item.matchedSnippet}"
                </div>
              )}

              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">Honest Rewording Advice: </span>
                  {item.honestRecommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
