import React from "react";
import { X, Shield, Lock, Globe, Eye, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCookieSettings?: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose, onOpenCookieSettings }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-policy-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/50 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 id="privacy-policy-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Privacy Policy &amp; Cookie Disclosure
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                UK GDPR &amp; Google AdSense Compliant • Last Updated: October 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Privacy Policy"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-xs sm:text-sm leading-relaxed">
          {/* Key Summary Callout */}
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-bold text-xs uppercase tracking-wide">
              <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Core Privacy Commitment (Zero Sneaky Storage)</span>
            </div>
            <p className="text-xs text-blue-950 dark:text-blue-200">
              BookMarkSoft UK is architected with a <strong>privacy-first, client-side paradigm</strong>. 
              Your CV text, salary inputs, tax calculations, and employment data are computed directly in your browser. 
              We do not sell, rent, or monetize your resume text, salary calculations, or identity records.
            </p>
          </div>

          {/* Section 1: Introduction */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>1. Introduction &amp; Data Controller</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              BookMarkSoft UK (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the website 
              <code className="text-blue-600 dark:text-blue-400 font-mono ml-1">bookmarksoft.uk</code> and its subdomains. 
              We are committed to protecting the privacy of our visitors in compliance with the 
              <strong> UK General Data Protection Regulation (UK GDPR)</strong>, the <strong>Data Protection Act 2018 (DPA 2018)</strong>, 
              and the <strong>Privacy and Electronic Communications Regulations (PECR)</strong>.
            </p>
          </div>

          {/* Section 2: Google AdSense & Third-Party Advertising (Critical AdSense Requirement) */}
          <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
              <Globe className="w-4 h-4 text-amber-600" />
              <span>2. Google AdSense &amp; Third-Party Advertising Partners</span>
            </div>
            <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
              To keep our tools, calculators, and ATS optimization platforms 100% free for British jobseekers and citizens, 
              we display third-party advertisements served by <strong>Google AdSense</strong>. 
              In accordance with Google&rsquo;s publisher policy requirements:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-900 dark:text-amber-200 pl-1">
              <li>
                <strong>Third-Party Vendor Cookies:</strong> Third-party vendors, including Google, use cookies 
                to serve ads based on a user&rsquo;s prior visits to this website or other websites on the Internet.
              </li>
              <li>
                <strong>Advertising Cookies:</strong> Google&rsquo;s use of advertising cookies enables it and its 
                partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
              </li>
              <li>
                <strong>Personalized Advertising Opt-Out:</strong> Users may opt out of personalized advertising by visiting{" "}
                <a 
                  href="https://www.google.com/settings/ads" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold underline text-amber-800 dark:text-amber-300 hover:text-blue-600"
                >
                  Google Ads Settings (https://www.google.com/settings/ads)
                </a>.
              </li>
              <li>
                <strong>Network Advertising Initiative (NAI):</strong> Alternatively, you can opt out of a third-party vendor&rsquo;s 
                use of cookies for personalized advertising by visiting{" "}
                <a 
                  href="https://www.aboutads.info/choices/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold underline text-amber-800 dark:text-amber-300 hover:text-blue-600"
                >
                  www.aboutads.info
                </a> or the{" "}
                <a 
                  href="https://www.youronlinechoices.com/uk/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold underline text-amber-800 dark:text-amber-300 hover:text-blue-600"
                >
                  Your Online Choices UK Guide
                </a>.
              </li>
            </ul>
          </div>

          {/* Section 3: Information We Collect */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              3. Information We Collect &amp; How It Is Handled
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <p>
                <strong>A. Client-Side Resume &amp; Utility Inputs:</strong> Text typed into the ATS CV Builder, 
                ATS X-Ray Scanner, Take-Home Pay Calculator, or Student Loan Simulator is processed in your local browser runtime. 
                PDF document generation executes using client-side WebAssembly/JavaScript without sending your raw resume text to a remote database.
              </p>
              <p>
                <strong>B. Anonymous Analytics &amp; Performance:</strong> We may collect non-identifiable, aggregated technical 
                data such as browser type, operating system, referring URL, and page response times to monitor system uptime and reliability.
              </p>
              <p>
                <strong>C. Cookies &amp; Local Storage:</strong> We use browser <code>localStorage</code> solely to remember your chosen theme 
                (dark vs light mode, dossier palette, font choices) and your cookie consent preference.
              </p>
            </div>
          </div>

          {/* Section 4: Cookie Policy Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              4. Cookie Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">1. Strictly Necessary</span>
                <p className="text-slate-500 dark:text-slate-400">
                  Essential for basic site navigation, dark mode preference, and saving your cookie choices. Cannot be turned off.
                </p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">2. Performance &amp; Analytics</span>
                <p className="text-slate-500 dark:text-slate-400">
                  Measures which calculators and tools are most helpful to prioritize improvements. Completely anonymized.
                </p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">3. Advertising &amp; Google</span>
                <p className="text-slate-500 dark:text-slate-400">
                  Used by Google AdSense to deliver relevant ads and prevent fraud. Controlled via your consent settings.
                </p>
              </div>
            </div>

            {onOpenCookieSettings && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCookieSettings();
                }}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Click here to review or change your Cookie Consent Preferences</span>
              </button>
            )}
          </div>

          {/* Section 5: Your Rights Under UK GDPR */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              5. Your Legal Rights Under UK GDPR
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Under UK data protection law, you have the right to access, rectify, or request erasure of any personal data, 
              as well as the right to object to processing and the right to lodge a complaint with the UK Information 
              Commissioner&rsquo;s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="underline font-bold text-blue-600">ico.org.uk</a>.
            </p>
          </div>

          {/* Section 6: Contact Us */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              6. Contact Us Regarding Privacy
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              For any questions, data subject requests, or questions regarding this Privacy Policy, please contact our data team at:
              <br />
              <strong className="text-slate-900 dark:text-white">Email:</strong> <code className="text-blue-600 dark:text-blue-400 font-mono">privacy@bookmarksoft.uk</code>
              <br />
              <strong className="text-slate-900 dark:text-white">Address:</strong> BookMarkSoft UK Data Privacy Officer, 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.
            </p>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            Compliant with Google AdSense Publisher Terms &amp; UK ICO Guidelines.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs cursor-pointer"
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
