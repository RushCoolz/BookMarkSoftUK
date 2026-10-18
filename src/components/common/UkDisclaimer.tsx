import React from "react";
import { Info, ExternalLink, ShieldAlert } from "lucide-react";
import { UK_TAX_CONFIG } from "../../config/ukTaxRates";

interface UkDisclaimerProps {
  customSourceUrl?: string;
  customSourceLabel?: string;
  notes?: string;
  className?: string;
}

export function UkDisclaimer({
  customSourceUrl,
  customSourceLabel,
  notes,
  className = "",
}: UkDisclaimerProps) {
  const url = customSourceUrl || UK_TAX_CONFIG.sourceUrl;
  const label = customSourceLabel || UK_TAX_CONFIG.sourceLabel;

  return (
    <div className={`rounded-xl border border-amber-200/80 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20 p-3.5 text-xs text-amber-900 dark:text-amber-200/90 ${className}`}>
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-amber-950 dark:text-amber-100">
              UK Regulatory Notice: For Estimation &amp; Planning Only
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200">
              Tax Year: {UK_TAX_CONFIG.taxYear} (Audited: {UK_TAX_CONFIG.lastChecked})
            </span>
          </div>
          <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
            {notes || "Calculations are based on prevailing HMRC and UK statutory guidelines. This tool provides illustrative estimates and does not constitute formal tax, legal, or financial advice."}
          </p>
          <div className="pt-1 flex items-center gap-1.5 text-[11px]">
            <span>Official Government Source:</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2"
            >
              {label}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
