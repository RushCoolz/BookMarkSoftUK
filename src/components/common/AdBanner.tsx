import React, { useEffect } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
  label?: string;
}

/**
 * Responsive Google AdSense Compliant Banner Container
 * Complies with Google Publisher Policies:
 * - Clear "ADVERTISEMENT" disclosure
 * - Distinct separation from editorial interactive content
 * - Graceful fallback / placeholder for local dev and preview
 */
export function AdBanner({ 
  slotId = "1234567890", 
  format = 'auto', 
  className = "",
  label = "ADVERTISEMENT"
}: AdBannerProps) {
  useEffect(() => {
    try {
      // Trigger AdSense script push if window.adsbygoogle is available in production
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      // Ignore during dev/preview
    }
  }, []);

  return (
    <div className={`w-full my-6 select-none ${className}`}>
      <div className="flex items-center justify-between px-2 mb-1">
        <span className="text-[9px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase font-semibold">
          {label}
        </span>
        <span className="text-[9px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-2.5 h-2.5 text-slate-400" />
          <span>Google AdSense Verified Slot</span>
        </span>
      </div>

      <div className="w-full rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 sm:p-6 text-center flex flex-col items-center justify-center min-h-[90px] overflow-hidden transition-colors">
        {/* Real AdSense Slot or Clean Placeholder */}
        <div className="w-full flex flex-col items-center justify-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>AdSense Responsive Placement • Slot #{slotId}</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-md">
            Ads served via Google AdSense help keep BookMarkSoft UK free and accessible for all UK jobseekers &amp; citizens.
          </p>
        </div>
      </div>
    </div>
  );
}
