import React, { useState } from "react";
import { 
  FlaskConical, 
  BarChart2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  TrendingUp,
  Sliders,
  ChevronRight,
  Info
} from "lucide-react";
import { CVLabExperiment } from "../../types/career";
import { SAMPLE_CV_LAB_EXPERIMENT } from "../../data/sampleCareerData";

export function CvLab() {
  const [experiment, setExperiment] = useState<CVLabExperiment>(SAMPLE_CV_LAB_EXPERIMENT);

  // Conversion calculations
  const totalSample = experiment.variantA.views + experiment.variantB.views;
  const replyRateA = experiment.variantA.views > 0 
    ? Math.round((experiment.variantA.replies / experiment.variantA.views) * 100) 
    : 0;
  const replyRateB = experiment.variantB.views > 0 
    ? Math.round((experiment.variantB.replies / experiment.variantB.views) * 100) 
    : 0;

  const interviewRateA = experiment.variantA.views > 0 
    ? Math.round((experiment.variantA.interviews / experiment.variantA.views) * 100) 
    : 0;
  const interviewRateB = experiment.variantB.views > 0 
    ? Math.round((experiment.variantB.interviews / experiment.variantB.views) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <FlaskConical className="w-3.5 h-3.5" />
            Empirical Career Science • 100% Free
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CV Lab: A/B Test Your Wording &amp; Positioning
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Stop guessing whether recruiters prefer commercial metric headlines (£42M revenue throughput) or deep architecture deep dives. 
            Send Variant A to half your applications and Variant B to the other half. Track opens, deep reads, replies, and interviews with 
            unflinching transparency.
          </p>
        </div>
      </div>

      {/* Honest Statistical Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-amber-950 dark:text-amber-200 text-sm">
            Statistical Honesty: Signal, Not Proof
          </span>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
            Total sample size across both variants is <strong>N={totalSample}</strong> applications. In recruitment, sample sizes are inherently small. 
            Treat these metrics as a strong comparative signal and trend indicator rather than mathematical certainty. 
            Company hiring appetite, job budget, and seniority tiers also influence outcomes.
          </p>
        </div>
      </div>

      {/* Side-by-Side Variant Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Variant A */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Active Test Variant
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {experiment.variantA.name}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Var A
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            "{experiment.variantA.focus}"
          </p>

          {/* Funnel Metrics */}
          <div className="space-y-3">
            {[
              { label: "Total Views", value: experiment.variantA.views, total: experiment.variantA.views },
              { label: "Skimmed (>15s)", value: experiment.variantA.skimmed, total: experiment.variantA.views },
              { label: "Deep Reads (>60s)", value: experiment.variantA.deepReads, total: experiment.variantA.views },
              { label: "Recruiter Replies", value: experiment.variantA.replies, total: experiment.variantA.views, highlight: true },
              { label: "Interviews Booked", value: experiment.variantA.interviews, total: experiment.variantA.views, success: true },
            ].map((step, idx) => {
              const pct = step.total > 0 ? Math.round((step.value / step.total) * 100) : 0;

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${step.success ? "text-emerald-600 font-bold" : "text-slate-600 dark:text-slate-300"}`}>
                      {step.label}
                    </span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {step.value} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        step.success ? "bg-emerald-500" : step.highlight ? "bg-blue-600" : "bg-slate-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200">
            <span className="font-bold">Conversion: </span> 
            {replyRateA}% recruiter response rate ({interviewRateA}% interview rate)
          </div>
        </div>

        {/* Variant B */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Active Test Variant
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {experiment.variantB.name}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Var B
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            "{experiment.variantB.focus}"
          </p>

          {/* Funnel Metrics */}
          <div className="space-y-3">
            {[
              { label: "Total Views", value: experiment.variantB.views, total: experiment.variantB.views },
              { label: "Skimmed (>15s)", value: experiment.variantB.skimmed, total: experiment.variantB.views },
              { label: "Deep Reads (>60s)", value: experiment.variantB.deepReads, total: experiment.variantB.views },
              { label: "Recruiter Replies", value: experiment.variantB.replies, total: experiment.variantB.views, highlight: true },
              { label: "Interviews Booked", value: experiment.variantB.interviews, total: experiment.variantB.views, success: true },
            ].map((step, idx) => {
              const pct = step.total > 0 ? Math.round((step.value / step.total) * 100) : 0;

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${step.success ? "text-emerald-600 font-bold" : "text-slate-600 dark:text-slate-300"}`}>
                      {step.label}
                    </span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {step.value} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        step.success ? "bg-emerald-500" : step.highlight ? "bg-purple-600" : "bg-slate-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-xs text-purple-950 dark:text-purple-200">
            <span className="font-bold">Conversion: </span> 
            {replyRateB}% recruiter response rate ({interviewRateB}% interview rate)
          </div>
        </div>
      </div>

      {/* Synthesis & Insights */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            Current Empirical Finding
          </h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {experiment.notes}
        </p>
      </div>
    </div>
  );
}
