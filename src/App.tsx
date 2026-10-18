/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  FileSearch, 
  Eye, 
  ShieldCheck, 
  FlaskConical, 
  Ghost, 
  Search, 
  BookOpen, 
  Scale, 
  Shield, 
  Calculator, 
  Briefcase, 
  Home, 
  MapPin, 
  Leaf, 
  Zap, 
  Calendar, 
  GraduationCap, 
  FileCode, 
  Percent, 
  Train, 
  Wrench, 
  Sparkles,
  ExternalLink,
  Cloud,
  Database,
  Key,
  FileEdit
} from "lucide-react";

import { AppAuthProvider } from "./services/clerkProvider";
import { Navbar } from "./components/common/Navbar";
import { Logo } from "./components/common/Logo";

// Career Suite Components
import { AtsXray } from "./components/career/AtsXray";
import { CvBuilder } from "./components/career/CvBuilder";
import { ApplicationTracking } from "./components/career/ApplicationTracking";
import { VouchVerification } from "./components/career/VouchVerification";
import { CvLab } from "./components/career/CvLab";
import { GhostTracker } from "./components/career/GhostTracker";
import { JobAdGapAnalysis } from "./components/career/JobAdGapAnalysis";
import { InterviewKit } from "./components/career/InterviewKit";
import { OfferEvaluator } from "./components/career/OfferEvaluator";
import { RightToWorkBlock } from "./components/career/RightToWorkBlock";

// UK Utility Suite Components
import { TakeHomePayCalc } from "./components/utilities/TakeHomePayCalc";
import { SelfEmployedTaxCalc } from "./components/utilities/SelfEmployedTaxCalc";
import { StampDutyCalc } from "./components/utilities/StampDutyCalc";
import { PostcodeLookup } from "./components/utilities/PostcodeLookup";
import { CarbonIntensityLive } from "./components/utilities/CarbonIntensityLive";
import { OfgemApplianceCalc } from "./components/utilities/OfgemApplianceCalc";
import { BankHolidaysExplorer } from "./components/utilities/BankHolidaysExplorer";
import { StudentLoanCalc } from "./components/utilities/StudentLoanCalc";
import { TaxCodeChecker } from "./components/utilities/TaxCodeChecker";
import { VatCalculator } from "./components/utilities/VatCalculator";
import { RailDelayRepayCalc } from "./components/utilities/RailDelayRepayCalc";
import { TextAndSecurityTools } from "./components/utilities/TextAndSecurityTools";

// Legal & Google AdSense Compliance Components
import { PrivacyPolicyModal } from "./components/legal/PrivacyPolicyModal";
import { TermsOfServiceModal } from "./components/legal/TermsOfServiceModal";
import { CookieConsentBanner } from "./components/legal/CookieConsentBanner";
import { AboutAndContactModal } from "./components/legal/AboutAndContactModal";
import { AdBanner } from "./components/common/AdBanner";

// User Authentication & Profiles
import { AuthModal } from "./components/auth/AuthModal";
import { UserProfileModal } from "./components/auth/UserProfileModal";

export default function App() {
  const [activeSection, setActiveSection] = useState<'career' | 'utilities'>('career');
  const [activeToolId, setActiveToolId] = useState<string>('cv-builder');
  const [searchQuery, setSearchQuery] = useState("");
  
  // Legal & Consent Dialog States
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAboutContact, setShowAboutContact] = useState(false);
  const [forceOpenCookieSettings, setForceOpenCookieSettings] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html document and persist preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const careerTools = [
    { id: "cv-builder", name: "Job-Ready CV Builder", icon: FileEdit, badge: "Free PDF", desc: "Build a clean CV guaranteed to pass employer screening software" },
    { id: "ats-xray", name: "CV Scanner & Reviewer", icon: FileSearch, badge: "Checker", desc: "Check your existing CV for formatting errors and missing keywords" },
    { id: "tracking", name: "Application View Tracker", icon: Eye, badge: "Popular", desc: "See when recruiters open and read your CV" },
    { id: "vouch", name: "Manager Endorsements", icon: ShieldCheck, badge: "Verified", desc: "Ask former managers to confirm your experience with 1 click" },
    { id: "cv-lab", name: "CV Version Comparison", icon: FlaskConical, badge: "Tool", desc: "Compare two versions of your CV to see which sounds stronger" },
    { id: "ghost-tracker", name: "Follow-Up Tracker", icon: Ghost, badge: "Email", desc: "Track unanswered applications and get polite follow-up templates" },
    { id: "job-gap", name: "Job Match & Skills Checker", icon: Search, badge: "Review", desc: "Compare your CV against any job advert to spot missing requirements" },
    { id: "interview-kit", name: "Interview Prep Kit", icon: BookOpen, badge: "Guide", desc: "Practice common UK interview questions with structured answer examples" },
    { id: "offer-evaluator", name: "Job Offer & Pay Comparison", icon: Scale, badge: "Compare", desc: "Compare salary, commute costs, and pension contributions between offers" },
    { id: "right-to-work", name: "UK Work Eligibility Check", icon: Shield, badge: "Visa Info", desc: "Check UK right-to-work rules, visa requirements, and privacy options" },
  ];

  const utilityTools = [
    { id: "take-home-pay", name: "Take-Home Pay", icon: Calculator, badge: "HMRC", desc: "England/Wales vs Scotland bands, NI 8%, 60% trap" },
    { id: "self-employed", name: "Self-Employed Tax", icon: Briefcase, badge: "HMRC", desc: "Class 4 NI 6%, Payments on Account & Set-aside reserve" },
    { id: "stamp-duty", name: "Stamp Duty (SDLT)", icon: Home, badge: "Property", desc: "First-time buyer relief & 5% surcharge" },
    { id: "postcode", name: "Postcode Lookup", icon: MapPin, badge: "Live ONS", desc: "Live validation, constituency & NHS health authority" },
    { id: "carbon-grid", name: "Live Grid Carbon", icon: Leaf, badge: "National Grid", desc: "Live UK grid intensity & best time to run washing machine" },
    { id: "ofgem", name: "Ofgem Price Cap", icon: Zap, badge: "Energy", desc: "Appliance running cost calculator & statutory SVT cap" },
    { id: "bank-holidays", name: "Bank Holidays Feed", icon: Calendar, badge: "Live GOV.UK", desc: "Working days & statutory notice deadline counter" },
    { id: "student-loans", name: "Student Loan Payoff", icon: GraduationCap, badge: "SLC", desc: "Plans 1, 2, 4, 5 & Postgrad 30/40yr write-off simulator" },
    { id: "tax-codes", name: "Tax Code Checker", icon: FileCode, badge: "HMRC", desc: "Decode 1257L, BR, D0, K-codes, Scottish S & emergency W1" },
    { id: "vat", name: "VAT Calculator", icon: Percent, badge: "HMRC", desc: "20% Standard, 5% Reduced Gross ↔ Net conversions" },
    { id: "rail-delay", name: "Delay Repay & Flight", icon: Train, badge: "Transport", desc: "National Rail rules & UK261 £520 flight compensation" },
    { id: "text-tools", name: "Everyday Client Tools", icon: Wrench, badge: "Browser", desc: "Word counter, password generator & QR maker" },
  ];

  const currentToolList = activeSection === 'career' ? careerTools : utilityTools;

  const filteredTools = currentToolList.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppAuthProvider>
      <div className="w-full max-w-full min-h-screen flex flex-col overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Top Navbar */}
        <Navbar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          activeToolId={activeToolId}
          setActiveToolId={setActiveToolId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Main Container */}
        <main className="flex-1 w-full min-w-0 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Quick Tool Navigation Scroller */}
          <div className="w-full max-w-full min-w-0 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeToolId === tool.id;

              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveToolId(tool.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                    isActive
                      ? activeSection === 'career'
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : activeSection === 'career' ? "text-blue-500" : "text-emerald-500"}`} />
                  <span>{tool.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    {tool.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Tool Content Render */}
          <div className="transition-all">
            {/* Career Tools */}
            {activeToolId === 'cv-builder' && (
              <CvBuilder 
                onNavigateToTracking={() => {
                  setActiveSection('career');
                  setActiveToolId('tracking');
                }} 
                onNavigateToScanner={() => {
                  setActiveSection('career');
                  setActiveToolId('ats-xray');
                }}
              />
            )}
            {activeToolId === 'ats-xray' && (
              <AtsXray onNavigateToBuilder={() => {
                setActiveSection('career');
                setActiveToolId('cv-builder');
              }} />
            )}
            {activeToolId === 'tracking' && <ApplicationTracking />}
            {activeToolId === 'vouch' && <VouchVerification />}
            {activeToolId === 'cv-lab' && <CvLab />}
            {activeToolId === 'ghost-tracker' && <GhostTracker />}
            {activeToolId === 'job-gap' && <JobAdGapAnalysis />}
            {activeToolId === 'interview-kit' && <InterviewKit />}
            {activeToolId === 'offer-evaluator' && <OfferEvaluator />}
            {activeToolId === 'right-to-work' && <RightToWorkBlock />}

            {/* UK Utility Tools */}
            {activeToolId === 'take-home-pay' && <TakeHomePayCalc />}
            {activeToolId === 'self-employed' && <SelfEmployedTaxCalc />}
            {activeToolId === 'stamp-duty' && <StampDutyCalc />}
            {activeToolId === 'postcode' && <PostcodeLookup />}
            {activeToolId === 'carbon-grid' && <CarbonIntensityLive />}
            {activeToolId === 'ofgem' && <OfgemApplianceCalc />}
            {activeToolId === 'bank-holidays' && <BankHolidaysExplorer />}
            {activeToolId === 'student-loans' && <StudentLoanCalc />}
            {activeToolId === 'tax-codes' && <TaxCodeChecker />}
            {activeToolId === 'vat' && <VatCalculator />}
            {activeToolId === 'rail-delay' && <RailDelayRepayCalc />}
            {activeToolId === 'text-tools' && <TextAndSecurityTools />}
          </div>

          {/* AdSense Compliant Banner Placement */}
          <div className="mt-8">
            <AdBanner slotId="8472910382" label="SPONSORED BY GOOGLE ADSENSE" />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 text-xs text-slate-500 dark:text-slate-400">
          <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Logo className="w-6 h-6" showBadge={false} />
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  BookMarkSoft UK
                </span>
                <span>— The Free UK Career Intelligence &amp; Citizen Utilities Portal</span>
              </div>

              {/* Fast Tool Links */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
                <button onClick={() => { setActiveSection('career'); setActiveToolId('cv-builder'); }} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  ATS CV Builder
                </button>
                <button onClick={() => { setActiveSection('career'); setActiveToolId('ats-xray'); }} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  ATS X-Ray Scanner
                </button>
                <button onClick={() => { setActiveSection('career'); setActiveToolId('vouch'); }} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Vouch References
                </button>
                <button onClick={() => { setActiveSection('utilities'); setActiveToolId('take-home-pay'); }} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Take-Home Pay
                </button>
                <button onClick={() => { setActiveSection('utilities'); setActiveToolId('stamp-duty'); }} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  Stamp Duty
                </button>
                <button onClick={() => { setActiveSection('utilities'); setActiveToolId('carbon-grid'); }} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  National Grid ESO
                </button>
              </div>
            </div>

            {/* Legal, AdSense & Trust Navigation */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <button
                  type="button"
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                >
                  Privacy Policy (UK GDPR)
                </button>
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                >
                  Terms of Service
                </button>
                <button
                  type="button"
                  onClick={() => setForceOpenCookieSettings(true)}
                  className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                >
                  Cookie Preferences
                </button>
                <button
                  type="button"
                  onClick={() => setShowAboutContact(true)}
                  className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                >
                  About &amp; Editorial Transparency
                </button>
                <a
                  href="/ads.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer font-mono text-[11px]"
                >
                  ads.txt
                </a>
              </div>

              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                &copy; {new Date().getFullYear()} BookMarkSoft UK Ltd • All rights reserved
              </span>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed text-center sm:text-left">
              BookMarkSoft UK provides informational estimates based on public UK government data feeds (GOV.UK, HMRC, ONS, National Grid ESO, postcodes.io, Ofgem). 
              This site does not claim official government affiliation or provide formal tax, legal, or investment advice. Ads are served via Google AdSense in compliance with Google Publisher Policies and the UK Information Commissioner&rsquo;s Office (ICO).
            </p>
          </div>
        </footer>

        {/* Legal Modals & Cookie Banner */}
        <PrivacyPolicyModal 
          isOpen={showPrivacyPolicy} 
          onClose={() => setShowPrivacyPolicy(false)}
          onOpenCookieSettings={() => setForceOpenCookieSettings(true)}
        />
        <TermsOfServiceModal 
          isOpen={showTerms} 
          onClose={() => setShowTerms(false)} 
        />
        <AboutAndContactModal 
          isOpen={showAboutContact} 
          onClose={() => setShowAboutContact(false)}
          onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
          onOpenTerms={() => setShowTerms(true)}
        />
        <CookieConsentBanner 
          onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
          forceOpen={forceOpenCookieSettings}
          onCloseForceOpen={() => setForceOpenCookieSettings(false)}
        />

        {/* User Authentication & Profile Dialogs */}
        <AuthModal />
        <UserProfileModal 
          onNavigateToBuilder={() => {
            setActiveSection('career');
            setActiveToolId('cv-builder');
          }}
          onNavigateToTracking={() => {
            setActiveSection('career');
            setActiveToolId('tracking');
          }}
        />
      </div>
    </AppAuthProvider>
  );
}
