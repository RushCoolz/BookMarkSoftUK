import React from "react";
import { X, Scale, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-of-service-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/50 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="terms-of-service-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Terms of Service &amp; Fair Use Policy
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                BookMarkSoft UK • Last Updated: October 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Terms of Service"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-xs sm:text-sm leading-relaxed">
          {/* Section 1: Agreement to Terms */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              By accessing or using BookMarkSoft UK (<code className="font-mono text-blue-600 dark:text-blue-400">bookmarksoft.uk</code>), 
              its tools, calculators, ATS scanner, and candidate wildcard subdomains, you agree to be bound by these 
              Terms of Service and our Privacy Policy. If you do not agree, you must discontinue use immediately.
            </p>
          </div>

          {/* Section 2: Informational Disclaimer (Tax & Career) */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Important Financial &amp; Legal Disclaimer</span>
            </div>
            <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
              All tools, including the <strong>Take-Home Pay Calculator, Self-Employed Tax Estimator, Stamp Duty Calculator, 
              Student Loan Payoff Simulator, Ofgem Energy Estimator, and ATS Scanner</strong>, are provided strictly for 
              <strong> informational and educational purposes</strong>. Estimates are modeled on public UK statutory figures 
              (HMRC rates, GOV.UK, ONS, SLC). They do not constitute formal chartered accountancy, legal, financial, or tax advice. 
              Always consult HMRC or a qualified IFA before making financial commitments.
            </p>
          </div>

          {/* Section 3: Permitted & Fair Use */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              2. Fair Use &amp; Anti-Abuse Rules
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              You agree to use our services solely for lawful personal and business career applications. You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1">
              <li>Use the Web Dossier subdomain builder to host phishing, malicious links, malware, or deceptive financial schemes.</li>
              <li>Attempt to scrape, reverse-engineer, or execute automated denial-of-service traffic against the platform.</li>
              <li>Impersonate living individuals, companies, or public figures without authorization.</li>
              <li>Inject malicious scripts, SQL injections, or unverified external iframes into public profile text.</li>
            </ul>
          </div>

          {/* Section 4: Web Dossier Subdomains & Anti-Phishing Guard */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              3. Wildcard Subdomains &amp; Content Moderation
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              BookMarkSoft UK employs automated <strong>Anti-Phishing Guard</strong> screening on all candidate text and outbound links. 
              We reserve the right to suspend, terminate, or remove any candidate profile or subdomain URL that violates UK law, 
              attempts identity deception, or promotes fraudulent employment credentials.
            </p>
          </div>

          {/* Section 5: Third-Party Advertising & AdSense Compliance */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              4. Advertising &amp; Third-Party Links
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Our website may contain third-party advertisements served via Google AdSense and links to external resources 
              (e.g., GOV.UK, National Rail, National Grid ESO). We do not control, endorse, or assume responsibility for the content, 
              privacy policies, or practices of third-party websites or advertisers.
            </p>
          </div>

          {/* Section 6: Intellectual Property */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              5. Intellectual Property
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              The BookMarkSoft UK portal interface, proprietary ATS parsing algorithms, and styling architectures are 
              protected under UK copyright law. You retain full 100% intellectual property ownership of the personal career 
              information, resumes, and project achievements you generate using our tools.
            </p>
          </div>

          {/* Section 7: Limitation of Liability */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              6. Limitation of Liability
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              To the fullest extent permitted by English law, BookMarkSoft UK shall not be liable for any indirect, incidental, 
              or consequential damages resulting from your use of or inability to use our tools, including job application 
              outcomes or tax filing discrepancies.
            </p>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end text-xs">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xs cursor-pointer"
          >
            I Agree &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
