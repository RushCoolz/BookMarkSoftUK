import React from "react";
import { X, Info, Mail, MapPin, Building, ShieldCheck, HeartHandshake, FileCheck } from "lucide-react";

interface AboutAndContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
}

export function AboutAndContactModal({ isOpen, onClose, onOpenPrivacyPolicy, onOpenTerms }: AboutAndContactModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-contact-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/50 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 id="about-contact-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                About BookMarkSoft UK &amp; Editorial Transparency
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Independent UK Citizen Tools &amp; Career Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close About Us dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-xs sm:text-sm leading-relaxed">
          {/* Mission */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-blue-600" />
              <span>Our Mission</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              BookMarkSoft UK was founded with a singular purpose: to provide British jobseekers, contractors, and citizens with 
              <strong> 100% free, honest, high-fidelity digital utilities</strong>. 
              We solve the modern pain points of corporate Applicant Tracking Systems (which discard multi-column Canva CVs) 
              and clarify opaque UK government formulas (tax bands, 60% marginal tax traps, Ofgem price caps, and Scottish vs English tax codes).
            </p>
          </div>

          {/* Editorial & Data Standards */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Editorial Guidelines &amp; Official Data Sources</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              All calculations and live feeds are verified against official statutory UK government publications:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                <span className="font-bold text-slate-900 dark:text-white block">HMRC Statutory Rates:</span>
                <span className="text-slate-500">Income Tax bands, Class 4 NI 6%, emergency tax codes (1257L, BR, D0).</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                <span className="font-bold text-slate-900 dark:text-white block">National Grid ESO:</span>
                <span className="text-slate-500">Live regional carbon intensity (gCO2/kWh) and grid fuel mix feeds.</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                <span className="font-bold text-slate-900 dark:text-white block">GOV.UK &amp; ONS:</span>
                <span className="text-slate-500">Official statutory bank holidays and ONS postcode constituency data.</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                <span className="font-bold text-slate-900 dark:text-white block">Ofgem Energy Cap:</span>
                <span className="text-slate-500">Statutory Standard Variable Tariff (SVT) appliance cost benchmarks.</span>
              </div>
            </div>
          </div>

          {/* Advertising & AdSense Transparency */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>How We Fund Our Free Services</span>
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              We never charge users subscription fees or gate-keep PDF downloads. 
              Our hosting and ongoing data maintenance are supported by non-intrusive advertisements served through 
              <strong> Google AdSense</strong>. We strictly adhere to Google Publisher Policies, ensuring ads are clearly labeled 
              and do not compromise user experience.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Contact &amp; Inquiries
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Email Inquiries</span>
                </div>
                <p className="text-slate-500">
                  General &amp; Support: <code className="text-blue-600 dark:text-blue-400 font-mono">support@bookmarksoft.uk</code>
                  <br />
                  Privacy &amp; Data: <code className="text-blue-600 dark:text-blue-400 font-mono">privacy@bookmarksoft.uk</code>
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Registered Address</span>
                </div>
                <p className="text-slate-500">
                  BookMarkSoft UK Ltd.<br />
                  71-75 Shelton Street, Covent Garden<br />
                  London, WC2H 9JQ, United Kingdom
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-500">
            <button 
              type="button" 
              onClick={() => { onClose(); onOpenPrivacyPolicy(); }}
              className="hover:underline text-blue-600 dark:text-blue-400 cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => { onClose(); onOpenTerms(); }}
              className="hover:underline text-blue-600 dark:text-blue-400 cursor-pointer"
            >
              Terms of Service
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
