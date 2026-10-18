import React, { useState } from "react";
import { 
  Link2, 
  Eye, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  Layers, 
  UserCheck, 
  Activity, 
  Flame, 
  BarChart3, 
  SlidersHorizontal,
  ChevronRight,
  Send,
  Calendar,
  Lock,
  X,
  Download
} from "lucide-react";
import { ApplicationLink } from "../../types/career";
import { SAMPLE_APPLICATION_LINKS } from "../../data/sampleCareerData";
import { generateCleanAtsCvPdf } from "../../services/pdfGenerator";

export function ApplicationTracking() {
  const [links, setLinks] = useState<ApplicationLink[]>(SAMPLE_APPLICATION_LINKS);
  const [selectedLink, setSelectedLink] = useState<ApplicationLink | null>(links[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  
  // New link form state
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  // Dossier viewer state
  const [skimMode, setSkimMode] = useState(false);
  const [blindMode, setBlindMode] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await generateCleanAtsCvPdf();
      if (selectedLink) {
        setLinks(prev => prev.map(l => {
          if (l.id !== selectedLink.id) return l;
          return {
            ...l,
            recentActivities: [
              {
                id: `act-${Date.now()}`,
                timestamp: "Just now",
                location: "London, UK",
                action: "Recruiter downloaded clean ATS PDF (Generated On-Site)",
                durationSeconds: 5,
              },
              ...l.recentActivities,
            ],
          };
        }));
      }
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const copySlug = (slug: string, id: string) => {
    const fullUrl = `https://bookmarksoft.uk/cv/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !jobRole) return;

    const slug = `alex-turner/${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${jobRole.toLowerCase().slice(0, 15).replace(/[^a-z0-9]/g, '-')}`;
    const newLink: ApplicationLink = {
      id: `link-${Date.now()}`,
      companyName,
      jobRole,
      recipientName: recipientName || "Hiring Team",
      customSlug: slug,
      cvVersionVariant: variant,
      createdAt: new Date().toISOString(),
      status: "active",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      totalViews: 0,
      uniqueOpenCount: 0,
      dwellTimeSeconds: 0,
      sectionEngagement: {
        summary: 0,
        experience: 0,
        skills: 0,
        projects: 0,
        vouches: 0,
      },
      recentActivities: [],
      notes: "Newly created application link.",
    };

    setLinks([newLink, ...links]);
    setSelectedLink(newLink);
    setShowCreateModal(false);
    setCompanyName("");
    setJobRole("");
    setRecipientName("");
  };

  const simulateOpenFromRecruiter = (linkId: string) => {
    setLinks(links.map(l => {
      if (l.id !== linkId) return l;
      const additionalTime = 45;
      const newOpenCount = l.uniqueOpenCount + 1;
      const newTotalViews = l.totalViews + 1;
      return {
        ...l,
        uniqueOpenCount: newOpenCount,
        totalViews: newTotalViews,
        lastOpenedAt: new Date().toISOString(),
        dwellTimeSeconds: l.dwellTimeSeconds + additionalTime,
        sectionEngagement: {
          summary: l.sectionEngagement.summary + 8,
          experience: l.sectionEngagement.experience + 24,
          skills: l.sectionEngagement.skills + 6,
          projects: l.sectionEngagement.projects + 5,
          vouches: l.sectionEngagement.vouches + 2,
        },
        recentActivities: [
          {
            id: `act-${Date.now()}`,
            timestamp: "Just now",
            location: "London, UK",
            action: "Recruiter clicked tailored link (Desktop Chrome)",
            durationSeconds: additionalTime,
          },
          ...l.recentActivities,
        ],
      };
    }));
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Candidate Intelligence • Free Forever
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            “Did They Read It?” Application Tracking
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Stop firing job applications into a black hole. Generate unique, privacy-first links for every company 
            (<code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300">alex.../monzo</code>). See exactly when hiring managers open your CV, 
            which sections held their attention, and get smart timing prompts on when to follow up.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Create Tailored Link
            </button>
            <button
              onClick={() => setShowDossierModal(true)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-all border border-white/20 flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              Preview Interactive Candidate Dossier
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Application List + Live Engagement Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Application Links (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              Active Application Links ({links.length})
            </span>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              New Link
            </button>
          </div>

          <div className="space-y-2.5">
            {links.map((link) => {
              const isSelected = selectedLink?.id === link.id;
              const hasEngagement = link.uniqueOpenCount > 0;

              return (
                <div
                  key={link.id}
                  onClick={() => setSelectedLink(link)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-1 ring-blue-500/30"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {link.companyName}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Var {link.cvVersionVariant}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                        {link.jobRole}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Eye className={`w-3.5 h-3.5 ${hasEngagement ? "text-emerald-500" : "text-slate-400"}`} />
                        <span className={`text-xs font-bold ${hasEngagement ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                          {link.totalViews} views
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {link.lastOpenedAt ? `Read ${link.lastOpenedAt.slice(11, 16)}` : "Not opened yet"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono text-[11px] truncate max-w-[190px] text-blue-600 dark:text-blue-400">
                      /{link.customSlug}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copySlug(link.customSlug, link.id);
                      }}
                      className="text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1"
                    >
                      {copiedId === link.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedId === link.id ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Engagement & Follow-up Prompting (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedLink ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                      {selectedLink.companyName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Active Link
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Target: {selectedLink.recipientName} ({selectedLink.jobRole})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => simulateOpenFromRecruiter(selectedLink.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition-all flex items-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Simulate Recruiter Open
                  </button>
                  <button
                    onClick={() => setShowDossierModal(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Dossier
                  </button>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Read Time</span>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedLink.dwellTimeSeconds}s
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {selectedLink.dwellTimeSeconds > 60 ? "Deep read (>60s)" : selectedLink.dwellTimeSeconds > 0 ? "Skimmed" : "Unopened"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Unique Opens</span>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {selectedLink.uniqueOpenCount}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    From {selectedLink.totalViews} total views
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Follow-Up Window</span>
                  <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-2">
                    {selectedLink.uniqueOpenCount > 0 ? "🔥 Hot (Next 24h)" : "Wait for open"}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {selectedLink.uniqueOpenCount > 0 ? "Top of mind right now" : "Do not double-message"}
                  </span>
                </div>
              </div>

              {/* Section Heatmap */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Dossier Attention Heatmap (Time Spent per Section)
                  </span>
                  <span className="text-[11px] text-slate-400">Attention distribution</span>
                </div>

                <div className="space-y-2">
                  {[
                    { label: "Work Experience", seconds: selectedLink.sectionEngagement.experience, color: "bg-blue-600" },
                    { label: "Proof-of-Work Projects", seconds: selectedLink.sectionEngagement.projects, color: "bg-indigo-600" },
                    { label: "Technical Skills", seconds: selectedLink.sectionEngagement.skills, color: "bg-emerald-600" },
                    { label: "Vouch References", seconds: selectedLink.sectionEngagement.vouches, color: "bg-purple-600" },
                    { label: "Headline Summary", seconds: selectedLink.sectionEngagement.summary, color: "bg-amber-600" },
                  ].map((sec, idx) => {
                    const total = Math.max(1, selectedLink.dwellTimeSeconds);
                    const pct = Math.round((sec.seconds / total) * 100);

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">{sec.label}</span>
                          <span className="font-mono text-slate-500">{sec.seconds}s ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full ${sec.color} rounded-full transition-all duration-500`} 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Smart Follow-up Recommendation Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/40 space-y-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-blue-950 dark:text-blue-200">
                    Actionable UK Follow-Up Recommendation
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedLink.uniqueOpenCount > 0 ? (
                    <>
                      The candidate link was read for <strong>{selectedLink.dwellTimeSeconds}s</strong> with sustained focus on your <em>Work Experience</em> and <em>Vouch References</em>. 
                      Standard UK recruitment etiquette dictates sending a short, polite note <strong>tomorrow morning at 10:15 AM</strong> referencing your application.
                    </>
                  ) : (
                    <>
                      This link has not been opened yet. Do not send follow-up emails before the recipient has had time to review, as premature follow-ups increase rejection rates.
                    </>
                  )}
                </p>
              </div>

              {/* Activity Log */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Recent Access Timeline
                </span>
                {selectedLink.recentActivities.length > 0 ? (
                  <div className="space-y-2">
                    {selectedLink.recentActivities.map((act) => (
                      <div key={act.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-800 dark:text-slate-200">{act.action}</div>
                          <span className="text-[10px] text-slate-400">{act.location} • {act.timestamp}</span>
                        </div>
                        {act.durationSeconds && (
                          <span className="font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                            {act.durationSeconds}s
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-950">
                    No opens recorded yet.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Select an application link to view live engagement analytics.
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Create Tailored Link */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Create Tailored Candidate Link
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLink} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starling Bank, BBC, Wise"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Engineer"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Recipient / Hiring Lead (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Rachel Adams (Engineering Lead)"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">CV Lab Variant</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVariant('A')}
                    className={`p-2 rounded-xl text-xs font-medium border ${variant === 'A' ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "border-slate-200 dark:border-slate-800"}`}
                  >
                    Variant A (Impact &amp; Metrics)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVariant('B')}
                    className={`p-2 rounded-xl text-xs font-medium border ${variant === 'B' ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "border-slate-200 dark:border-slate-800"}`}
                  >
                    Variant B (Architecture &amp; Scale)
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Interactive Candidate Dossier Viewer */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Dossier Header Bar */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-mono font-bold tracking-wider text-slate-300">
                  CANDIDATE DOSSIER: alex-turner/monzo-backend
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSkimMode(!skimMode)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    skimMode ? "bg-amber-500 text-slate-950 shadow-sm" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {skimMode ? "⚡ 30-Sec Skim Mode (Active)" : "30-Sec Skim Mode"}
                </button>
                <button
                  onClick={() => setBlindMode(!blindMode)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    blindMode ? "bg-purple-600 text-white shadow-sm" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {blindMode ? "🔒 Blind Mode (Redacted)" : "Blind Mode"}
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs flex items-center gap-1.5"
                  title="Generate and download ATS-compliant PDF directly in your browser without external storage"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isDownloadingPdf ? "Generating..." : "Download Clean ATS PDF (On-Site)"}
                </button>
                <button onClick={() => setShowDossierModal(false)} className="text-slate-400 hover:text-white ml-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dossier Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header Profile */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {blindMode ? "[Candidate #4819 - Name Redacted]" : "Alex Turner"}
                    </h2>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Lead Software Engineer • Distributed Payments &amp; Cloud Infrastructure
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                      ✓ UK Citizen (No Visa Sponsorship Required)
                    </span>
                  </div>
                </div>

                {!blindMode && (
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>📍 London, UK</span>
                    <span>✉️ alex.turner@example.co.uk</span>
                    <span>🔗 github.com/alexturner-uk</span>
                    <span>⭐ 2 Verified Vouches</span>
                  </div>
                )}
              </div>

              {/* 30-Second Skim Highlight Bar */}
              {skimMode && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    ⚡ Recruiter 30-Second Skim Executive Digest
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900">
                      <div className="text-[10px] text-slate-400 uppercase">Experience</div>
                      <div className="font-bold">7+ Years UK FinTech</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900">
                      <div className="text-[10px] text-slate-400 uppercase">Core Stack</div>
                      <div className="font-bold">TS, Node, Redis, AWS</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900">
                      <div className="text-[10px] text-slate-400 uppercase">Scale Peak</div>
                      <div className="font-bold">£42M/day Payments</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900">
                      <div className="text-[10px] text-slate-400 uppercase">Verification</div>
                      <div className="font-bold text-emerald-600">VP Eng Verified</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Work Experience */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Verified Employment History
                </h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-base">Senior Full Stack Engineer</span>
                        <span className="text-slate-500 text-xs sm:ml-2">@ Acme Fintech UK (London)</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500">March 2022 - Present</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified by Marcus Sterling (VP of Engineering, Acme Fintech)
                    </div>

                    <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1 pt-1 leading-relaxed">
                      <li>Architected event-driven UK Faster Payments gateway handling £42M/day volume with 99.99% availability.</li>
                      <li>Decreased median API latency from 420ms to 68ms using Redis multi-region caching and query optimization.</li>
                      <li>Mentored a team of 6 engineers and drove full ISO 27001 data compliance certification.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-base">Software Engineer</span>
                        <span className="text-slate-500 text-xs sm:ml-2">@ British Health Digital (Manchester)</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500">Sept 2019 - Feb 2022</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified by Dr. Rachel Ward (Clinical Tech Director)
                    </div>

                    <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1 pt-1 leading-relaxed">
                      <li>Delivered patient appointment scheduling service across 45 NHS trusts in compliance with HL7 FHIR standards.</li>
                      <li>Integrated NHS Login OAuth2 authentication for over 220,000 active NHS users.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Proof-of-Work Blocks */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Proof-of-Work Architecture Artifacts
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">UK Faster Payments Gateway</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">Production</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      High-throughput settlement service built on Node.js, Redis, and PostgreSQL with idempotent queue processing.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">Open Banking FHIR Bridge</span>
                      <span className="text-[10px] font-mono text-blue-600 font-bold">Open Source</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      TypeScript SDK bridging NHS Login identity tokens with HL7 FHIR clinical endpoints.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
