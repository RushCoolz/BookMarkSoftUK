import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  ExternalLink, 
  EyeOff, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Brain,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { UK_TAX_CONFIG } from "../../config/ukTaxRates";
import { UkDisclaimer } from "../common/UkDisclaimer";

export function RightToWorkBlock() {
  const [statusType, setStatusType] = useState<'citizen' | 'settled' | 'skilled_worker' | 'graduate'>('citizen');
  const [sponsorshipRequired, setSponsorshipRequired] = useState(false);
  const [blindRecruitmentActive, setBlindRecruitmentActive] = useState(false);
  const [neurodivergentFriendly, setNeurodivergentFriendly] = useState(true);
  const [linkExpiryDate, setLinkExpiryDate] = useState("2026-11-30");

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            UK Compliance &amp; Inclusive Hiring
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            UK Right-to-Work, Visa Thresholds &amp; Privacy Controls
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Eliminate wasted interview cycles. Clearly declare your UK Right-to-Work status and sponsorship requirements 
            with links to live Home Office thresholds (<code className="text-indigo-300">£38,700</code> Skilled Worker minimum). 
            Enable Blind Recruitment mode to redact unconscious bias identifiers, or activate neurodivergent-friendly layouts.
          </p>
        </div>
      </div>

      <UkDisclaimer 
        customSourceUrl={UK_TAX_CONFIG.visaThresholds.sourceUrl}
        customSourceLabel="GOV.UK Skilled Worker Visa & Eligibility Guidance"
        notes="Home Office salary thresholds and eligible occupation codes (SOC) are linked to official UK immigration guidance."
      />

      {/* Main Grid: Status Selector & Dossier Block Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configuration Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Configure Your Dossier Block
          </h3>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select Your UK Right to Work Status
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'citizen', label: 'British or Irish Citizen', sponsor: false },
                { id: 'settled', label: 'EU Settled / Pre-Settled', sponsor: false },
                { id: 'graduate', label: 'Graduate Route Visa', sponsor: false },
                { id: 'skilled_worker', label: 'Skilled Worker (Needs Sponsor)', sponsor: true },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setStatusType(opt.id as any);
                    setSponsorshipRequired(opt.sponsor);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    statusType === opt.id
                      ? "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Layout Toggles */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-purple-600" />
                  Blind Recruitment Mode
                </span>
                <p className="text-[11px] text-slate-500">
                  Hides candidate name, photo, age indicators, and graduation years.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBlindRecruitmentActive(!blindRecruitmentActive)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  blindRecruitmentActive ? "bg-purple-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-emerald-600" />
                  Context-First (Neurodivergent &amp; Career Break) Layout
                </span>
                <p className="text-[11px] text-slate-500">
                  Highlights core competency impact blocks rather than standard chronological penalties.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNeurodivergentFriendly(!neurodivergentFriendly)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  neurodivergentFriendly ? "bg-emerald-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Preview on the Dossier */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Live Dossier Badge Preview
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              Recruiter-Facing
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {blindRecruitmentActive ? "[Candidate #4819 - Identity Redacted for Blind Hiring]" : "Alex Turner"}
                </h4>
                <p className="text-xs text-slate-500">Lead Software Engineer • London, UK</p>
              </div>

              <div className="p-2 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Status Highlight Banner */}
            <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
              sponsorshipRequired
                ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 text-amber-950 dark:text-amber-200"
                : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-950 dark:text-emerald-200"
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                {statusType === 'citizen' && "British Citizen: Full, Unrestricted Right to Work in the UK"}
                {statusType === 'settled' && "EU Settled Status: Permanent Right to Work in the UK"}
                {statusType === 'graduate' && "UK Graduate Route: Valid Full-Time Work Authorization"}
                {statusType === 'skilled_worker' && "Skilled Worker Visa: Tier 2 General Sponsorship Required"}
              </div>
              <p className="text-[11px] leading-relaxed">
                {sponsorshipRequired ? (
                  <>
                    Candidate meets the <strong>£{UK_TAX_CONFIG.visaThresholds.skilledWorkerGeneralThreshold.toLocaleString()}</strong> general salary threshold for UK Skilled Worker sponsorship.
                  </>
                ) : (
                  "Zero sponsorship cost, zero administrative delay. Ready for immediate UK start."
                )}
              </p>
            </div>

            {neurodivergentFriendly && (
              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200">
                <span className="font-bold flex items-center gap-1 mb-1">
                  <Brain className="w-3.5 h-3.5" />
                  Inclusive Context Note
                </span>
                Candidate presents work in objective impact blocks. Evaluation should focus on verified delivery metrics rather than continuous uninterrupted timelines.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
