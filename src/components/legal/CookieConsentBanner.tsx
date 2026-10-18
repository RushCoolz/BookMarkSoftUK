import React, { useState, useEffect } from "react";
import { Cookie, ShieldCheck, Check, X, Settings2, ExternalLink } from "lucide-react";

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  timestamp: string;
}

interface CookieConsentBannerProps {
  onOpenPrivacyPolicy: () => void;
  forceOpen?: boolean;
  onCloseForceOpen?: () => void;
}

export function CookieConsentBanner({ onOpenPrivacyPolicy, forceOpen = false, onCloseForceOpen }: CookieConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [advertisingConsent, setAdvertisingConsent] = useState(true);

  useEffect(() => {
    if (forceOpen) {
      setShowBanner(true);
      setShowPreferences(true);
      return;
    }

    try {
      const saved = localStorage.getItem('bmk_cookie_consent');
      if (!saved) {
        // Show after a brief delay for smoother UX
        const timer = setTimeout(() => setShowBanner(true), 800);
        return () => clearTimeout(timer);
      } else {
        const parsed: CookiePreferences = JSON.parse(saved);
        setAnalyticsConsent(parsed.analytics);
        setAdvertisingConsent(parsed.advertising);
      }
    } catch {
      setShowBanner(true);
    }
  }, [forceOpen]);

  const saveConsent = (analytics: boolean, advertising: boolean) => {
    const pref: CookiePreferences = {
      essential: true,
      analytics,
      advertising,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem('bmk_cookie_consent', JSON.stringify(pref));
    } catch {}
    setShowBanner(false);
    setShowPreferences(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  const handleAcceptAll = () => {
    setAnalyticsConsent(true);
    setAdvertisingConsent(true);
    saveConsent(true, true);
  };

  const handleRejectNonEssential = () => {
    setAnalyticsConsent(false);
    setAdvertisingConsent(false);
    saveConsent(false, false);
  };

  const handleSaveCustom = () => {
    saveConsent(analyticsConsent, advertisingConsent);
  };

  if (!showBanner) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-50 animate-slideUp"
      role="region"
      aria-label="Cookie consent banner"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3.5 text-slate-800 dark:text-slate-200 ring-1 ring-black/5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                We Value Your Privacy &amp; Data Rights
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                UK GDPR &amp; Google AdSense Consent Management
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setShowBanner(false);
              if (onCloseForceOpen) onCloseForceOpen();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          BookMarkSoft UK uses strictly necessary cookies to ensure site functionality, as well as optional cookies 
          for analytics and third-party advertising partners (including <strong>Google AdSense</strong>) to deliver 
          relevant ads and keep our UK career &amp; citizen tools 100% free.
        </p>

        {/* Detailed Preferences Drawer */}
        {showPreferences && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs animate-fadeIn">
            {/* Essential */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-slate-900 dark:text-white block">Strictly Necessary Cookies</span>
                <span className="text-[11px] text-slate-500">Theme persistence, basic security, and consent management (Always Active).</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                Required
              </span>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-slate-900 dark:text-white block">Performance &amp; Analytics</span>
                <span className="text-[11px] text-slate-500">Helps us understand which calculators and tools need speed or tax rule updates.</span>
              </div>
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Advertising */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-slate-900 dark:text-white block">Google AdSense &amp; Advertising</span>
                <span className="text-[11px] text-slate-500">Permits Google and certified ad partners to display tailored ads and prevent fraud.</span>
              </div>
              <input
                type="checkbox"
                checked={advertisingConsent}
                onChange={(e) => setAdvertisingConsent(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreferences(!showPreferences)}
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{showPreferences ? "Hide Settings" : "Manage Choices"}</span>
            </button>
            <button
              type="button"
              onClick={onOpenPrivacyPolicy}
              className="text-slate-500 hover:underline"
            >
              Privacy Policy
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {showPreferences ? (
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs cursor-pointer text-center"
              >
                Save Preferences
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer text-center"
                >
                  Reject Non-Essential
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs cursor-pointer text-center"
                >
                  Accept All
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
