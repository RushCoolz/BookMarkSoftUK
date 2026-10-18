import React, { useState } from "react";
import { 
  Ghost, 
  Clock, 
  Send, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Plus, 
  HeartHandshake, 
  Sparkles, 
  PieChart, 
  Calendar,
  X
} from "lucide-react";
import { GhostTrackerApp, ApplicationStage } from "../../types/career";
import { SAMPLE_GHOST_TRACKER_APPS } from "../../data/sampleCareerData";

export function GhostTracker() {
  const [apps, setApps] = useState<GhostTrackerApp[]>(SAMPLE_GHOST_TRACKER_APPS);
  const [selectedApp, setSelectedApp] = useState<GhostTrackerApp | null>(apps[1]); // Revolut (7 days silent)
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [followUpTone, setFollowUpTone] = useState<'gentle_nudge' | 'project_update' | 'graceful_closure'>('gentle_nudge');

  // Stats
  const totalApps = apps.length;
  const ghostedCount = apps.filter(a => a.daysSilent >= 14 || a.currentStage === 'ghosted').length;
  const ghostRate = totalApps > 0 ? Math.round((ghostedCount / totalApps) * 100) : 0;
  const activeCount = apps.filter(a => a.currentStage !== 'ghosted' && a.currentStage !== 'rejected').length;

  const getStageLabel = (stage: ApplicationStage) => {
    switch (stage) {
      case 'applied': return 'Applied';
      case 'opened': return 'CV Opened';
      case 'phone_screen': return 'Phone Screen';
      case 'tech_interview': return 'Technical';
      case 'final_round': return 'Final Round';
      case 'offer': return '🎉 Offer Received';
      case 'ghosted': return '👻 Ghosted (14+ Days)';
      case 'rejected': return 'Rejected';
    }
  };

  const getStageColor = (stage: ApplicationStage) => {
    switch (stage) {
      case 'offer': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'tech_interview':
      case 'final_round': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300';
      case 'opened': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'ghosted': return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
    }
  };

  // Generate UK corporate etiquette follow-up email
  const generateFollowUpEmail = () => {
    if (!selectedApp) return "";

    const name = selectedApp.contactPerson || "Hiring Team";
    const company = selectedApp.companyName;
    const role = selectedApp.roleTitle;

    if (followUpTone === 'gentle_nudge') {
      return `Subject: Following up on application: ${role} - Alex Turner

Dear ${name},

I hope this finds you well.

I am writing to check in regarding my recent application for the ${role} position at ${company}. Having reviewed ${company}'s recent technical initiatives, I remain very enthusiastic about the opportunity to contribute to your engineering team.

I appreciate you are likely coordinating multiple candidate schedules. If there are any additional work samples, references, or details required from my side, please don't hesitate to let me know.

Thank you for your time and consideration, and I look forward to hearing from you.

Kind regards,
Alex Turner
+44 7700 900123
https://bookmarksoft.uk/cv/alex-turner/${selectedApp.tailoredLinkSlug}`;
    }

    if (followUpTone === 'project_update') {
      return `Subject: Application update & quick check-in: ${role} - Alex Turner

Dear ${name},

I hope you are having a productive week.

I wanted to touch base regarding the ${role} opening at ${company}. Since submitting my application, I recently completed verified deployment milestones on our UK payment gateway project and updated my candidate dossier.

Given the alignment with ${company}'s stack, I would welcome a brief conversation to explore how my experience fits your current quarterly targets.

Best regards,
Alex Turner
+44 7700 900123`;
    }

    return `Subject: Following up & status check: ${role} - Alex Turner

Dear ${name},

I hope you are well.

As I haven't heard back regarding my application for the ${role} role at ${company}, I am checking in to confirm whether the position has now been filled or if you are progressing with other candidates.

I am currently in discussions with other UK engineering teams, but ${company} remains a primary choice. If the role remains open, I would be delighted to connect; otherwise, I wish the team every continued success.

Kind regards,
Alex Turner`;
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(generateFollowUpEmail());
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Ghost className="w-3.5 h-3.5" />
            Emotional Resilience &amp; Silence Radar
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ghost Tracker &amp; Polite UK Follow-Up Pipeline
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            In today's UK job market, silence is the default. The Ghost Tracker notices when a company stops replying, 
            calculates your honest response rate, and crafts polite UK etiquette follow-up emails so you take back control 
            without feeling awkward.
          </p>
        </div>
      </div>

      {/* Market Reality KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Pipeline</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {activeCount} applications
          </div>
          <span className="text-[11px] text-slate-400">In motion</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ghost Rate</span>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {ghostRate}%
          </div>
          <span className="text-[11px] text-slate-400">{ghostedCount} silent &gt;14 days</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Real Response Rate</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {100 - ghostRate}%
          </div>
          <span className="text-[11px] text-slate-400">UK market avg: 15-25%</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Follow-Up Readiness</span>
          <div className="text-2xl font-extrabold text-amber-500 mt-1">
            {apps.filter(a => a.daysSilent >= 7 && a.daysSilent < 14).length} Ready
          </div>
          <span className="text-[11px] text-slate-400">7-day silence window</span>
        </div>
      </div>

      {/* Mental Health Support Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-3">
        <HeartHandshake className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <span className="font-bold text-indigo-900 dark:text-indigo-100">
            A Crucial Reminder in a Brutal Market
          </span>
          <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed">
            Recruiting silence is an organizational failure of internal HR bandwidth and software automation — it is never an indictment of your talent, capability, or value as a professional. You are operating in one of the most compressed hiring environments in decades. Keep applying, keep your signal strong, and let data remove the emotional sting.
          </p>
        </div>
      </div>

      {/* Pipeline Board & Follow-Up Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applications Tracker (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            Active Applications &amp; Silence Counter
          </span>

          <div className="space-y-2.5">
            {apps.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              const isSilentAlert = app.daysSilent >= 7;

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-400 shadow-sm ring-1 ring-rose-400/30"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {app.companyName}
                      </h4>
                      <p className="text-xs text-slate-500 truncate max-w-[210px]">
                        {app.roleTitle}
                      </p>
                      {app.salaryOfferedRange && (
                        <span className="text-[11px] font-mono text-emerald-600 font-medium">
                          {app.salaryOfferedRange}
                        </span>
                      )}
                    </div>

                    <div className="text-right space-y-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStageColor(app.currentStage)}`}>
                        {getStageLabel(app.currentStage)}
                      </span>
                      <div className="flex items-center justify-end gap-1 text-[11px]">
                        <Clock className={`w-3 h-3 ${isSilentAlert ? "text-rose-500" : "text-slate-400"}`} />
                        <span className={`font-mono font-bold ${isSilentAlert ? "text-rose-600 dark:text-rose-400" : "text-slate-500"}`}>
                          {app.daysSilent}d silent
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Applied: {app.appliedDate}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      Select to draft follow-up →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Tailored Follow-Up Email Drafter (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedApp ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Draft Polite Follow-Up: {selectedApp.companyName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Contact: {selectedApp.contactPerson || "Hiring Team"} • Silence: {selectedApp.daysSilent} days
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setFollowUpTone('gentle_nudge')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      followUpTone === 'gentle_nudge' ? "bg-white dark:bg-slate-900 text-blue-600 shadow-xs" : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Gentle (7-10d)
                  </button>
                  <button
                    onClick={() => setFollowUpTone('project_update')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      followUpTone === 'project_update' ? "bg-white dark:bg-slate-900 text-blue-600 shadow-xs" : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Value Add
                  </button>
                  <button
                    onClick={() => setFollowUpTone('graceful_closure')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      followUpTone === 'graceful_closure' ? "bg-white dark:bg-slate-900 text-blue-600 shadow-xs" : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Closure (21d+)
                  </button>
                </div>
              </div>

              {/* Email Content Box */}
              <div className="relative">
                <textarea
                  readOnly
                  rows={13}
                  value={generateFollowUpEmail()}
                  className="w-full text-xs font-mono p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none"
                />
                <button
                  onClick={copyEmail}
                  className="absolute right-3 bottom-3 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedEmail ? "Copied Email" : "Copy Email"}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
                💡 <strong>UK Recruitment Etiquette Tip:</strong> Send emails between Tuesday and Thursday at 10:15 AM. Avoid Monday mornings (inbox triage chaos) and Friday afternoons.
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Select an application to generate a personalized follow-up email.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
