import React, { useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  UserCheck, 
  Building, 
  Mail, 
  Calendar, 
  Award,
  X,
  FileBadge
} from "lucide-react";
import { VouchClaim } from "../../types/career";
import { SAMPLE_VOUCHES } from "../../data/sampleCareerData";

export function VouchVerification() {
  const [vouches, setVouches] = useState<VouchClaim[]>(SAMPLE_VOUCHES);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [activeRefereeToken, setActiveRefereeToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Form states
  const [refereeName, setRefereeName] = useState("");
  const [refereeEmail, setRefereeEmail] = useState("");
  const [refereeRole, setRefereeRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [employmentPeriod, setEmploymentPeriod] = useState("");
  const [skillsClaimed, setSkillsClaimed] = useState("");

  // Referee Portal simulation state
  const [refereeQuote, setRefereeQuote] = useState("");

  const handleCreateVouchRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refereeName || !refereeEmail || !companyName) return;

    const token = `v-${Math.floor(10000 + Math.random() * 90000)}`;
    const newVouch: VouchClaim = {
      id: `vouch-${Date.now()}`,
      candidateName: "Alex Turner",
      roleTitle,
      companyName,
      employmentPeriod,
      refereeName,
      refereeEmail,
      refereeRole,
      skillsClaimed: skillsClaimed.split(',').map(s => s.trim()).filter(Boolean),
      status: "pending",
      token,
    };

    setVouches([newVouch, ...vouches]);
    setShowRequestModal(false);
    resetForm();
  };

  const resetForm = () => {
    setRefereeName("");
    setRefereeEmail("");
    setRefereeRole("");
    setCompanyName("");
    setRoleTitle("");
    setEmploymentPeriod("");
    setSkillsClaimed("");
  };

  const copyVouchLink = (token: string) => {
    const link = `https://bookmarksoft.uk/vouch/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const simulateRefereeVerification = (token: string) => {
    setVouches(vouches.map(v => {
      if (v.token !== token) return v;
      return {
        ...v,
        status: "verified",
        verifiedAt: new Date().toISOString(),
        refereeQuote: refereeQuote || "Verified all stated responsibilities, dates, and core technical contributions.",
        auditHash: `SHA256:${Math.random().toString(36).substring(2, 15)}`,
      };
    }));
    setActiveRefereeToken(null);
    setRefereeQuote("");
  };

  const activeVouchForPortal = vouches.find(v => v.token === activeRefereeToken);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Candidate-Driven Verification • 100% Free
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Vouch: Verified References &amp; Experience Claims
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Corporate background check firms (HireRight, Sterling) charge employers hundreds of pounds per hire. 
            <strong>Vouch</strong> flips the script: past managers confirm your role, dates, and core skills in one click via a secure link. 
            Your CV dossier then displays cryptographic-style green <span className="text-emerald-400 font-bold">Verified By</span> badges that instantly establish trust.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Request New Vouch
            </button>
            <span className="text-xs text-slate-400">
              Zero referee sign-up required • One-click confirmation
            </span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {vouches.filter(v => v.status === 'verified').length} Verified
            </div>
            <span className="text-xs text-slate-500">Live on your CV dossier</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {vouches.filter(v => v.status === 'pending').length} Pending
            </div>
            <span className="text-xs text-slate-500">Awaiting referee response</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              £0 Cost
            </div>
            <span className="text-xs text-slate-500">Saves £350+ background fees</span>
          </div>
        </div>
      </div>

      {/* Vouches List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 dark:text-white text-base">
            Your Reference Claims &amp; Badges
          </span>
          <button
            onClick={() => setShowRequestModal(true)}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Reference Claim
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {vouches.map((vouch) => {
            const isVerified = vouch.status === 'verified';

            return (
              <div 
                key={vouch.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isVerified
                    ? "bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800/80 shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-90"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {vouch.roleTitle}
                      </h4>
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <Clock className="w-3 h-3" />
                          PENDING
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {vouch.companyName} • {vouch.employmentPeriod}
                    </p>
                  </div>

                  {!isVerified && (
                    <button
                      onClick={() => setActiveRefereeToken(vouch.token)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800"
                    >
                      Test Referee Portal
                    </button>
                  )}
                </div>

                {/* Referee details */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Referee: {vouch.refereeName}
                    </span>
                    <span className="text-[11px] text-slate-400">{vouch.refereeRole}</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Corporate Email: <code className="text-slate-700 dark:text-slate-300">{vouch.refereeEmail}</code>
                  </div>
                  {vouch.refereeQuote && (
                    <p className="pt-1.5 text-slate-700 dark:text-slate-300 italic border-t border-slate-200/60 dark:border-slate-800">
                      "{vouch.refereeQuote}"
                    </p>
                  )}
                </div>

                {/* Verified Skills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {vouch.skillsClaimed.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {isVerified ? "✓ " : ""}{skill}
                    </span>
                  ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    {vouch.auditHash ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{vouch.auditHash}</span>
                    ) : (
                      <span>Token: {vouch.token}</span>
                    )}
                  </div>
                  <button
                    onClick={() => copyVouchLink(vouch.token)}
                    className="text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-600 flex items-center gap-1"
                  >
                    {copiedToken === vouch.token ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedToken === vouch.token ? "Copied Referee Link" : "Copy Referee Link"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Request New Vouch */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Request Candidate-Driven Vouch
              </h3>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVouchRequest} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monzo, BBC, Deliveroo"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Employment Dates</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. March 2022 - Present or 2020 - 2023"
                  value={employmentPeriod}
                  onChange={(e) => setEmploymentPeriod(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Past Manager / Referee Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Sterling"
                    value={refereeName}
                    onChange={(e) => setRefereeName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Referee Role at Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VP of Engineering"
                    value={refereeRole}
                    onChange={(e) => setRefereeRole(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Referee Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="m.sterling@company.co.uk"
                  value={refereeEmail}
                  onChange={(e) => setRefereeEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Skills to Verify (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. TypeScript, Distributed Systems, Team Leadership"
                  value={skillsClaimed}
                  onChange={(e) => setSkillsClaimed(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Generate 1-Click Verification Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Referee Verification Portal Simulator */}
      {activeVouchForPortal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Referee 1-Click Verification Portal
                </h3>
              </div>
              <button onClick={() => setActiveRefereeToken(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Hi <strong>{activeVouchForPortal.refereeName}</strong>, 
                Alex Turner is requesting your confirmation of their past employment at <strong>{activeVouchForPortal.companyName}</strong>.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono">
                <div>Role: <span className="font-bold text-slate-900 dark:text-white">{activeVouchForPortal.roleTitle}</span></div>
                <div>Dates: <span className="font-bold text-slate-900 dark:text-white">{activeVouchForPortal.employmentPeriod}</span></div>
                <div>Skills: {activeVouchForPortal.skillsClaimed.join(", ")}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Recommendation Quote (1-2 sentences)
                </label>
                <textarea
                  value={refereeQuote}
                  onChange={(e) => setRefereeQuote(e.target.value)}
                  placeholder="e.g. Alex was an indispensable lead on our high-throughput payment services."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveRefereeToken(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={() => simulateRefereeVerification(activeVouchForPortal.token)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm &amp; Vouch (1 Click)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
