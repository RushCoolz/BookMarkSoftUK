import React, { useState } from "react";
import { 
  FileCode, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  ArrowRight 
} from "lucide-react";
import { UkDisclaimer } from "../common/UkDisclaimer";

export function TaxCodeChecker() {
  const [taxCodeInput, setTaxCodeInput] = useState("1257L");

  const decodeTaxCode = (code: string) => {
    const clean = code.trim().toUpperCase().replace(/\s+/g, '');
    if (!clean) return null;

    let region = "England, Wales or Northern Ireland";
    let isEmergency = clean.includes("W1") || clean.includes("M1") || clean.includes("X");
    let baseCode = clean.replace(/W1|M1|X/g, '');

    if (baseCode.startsWith('S')) {
      region = "Scotland (Scottish Income Tax Bands apply)";
      baseCode = baseCode.slice(1);
    } else if (baseCode.startsWith('C')) {
      region = "Wales (Welsh Rates of Income Tax apply)";
      baseCode = baseCode.slice(1);
    }

    if (baseCode === "BR") {
      return {
        code: clean,
        region,
        personalAllowance: "£0 (Zero Allowance)",
        meaning: "Basic Rate (20% flat tax on all income from this job). Usually used for a second job or pension when your Personal Allowance is already used elsewhere.",
        isEmergency,
        severity: "warning",
      };
    }

    if (baseCode === "D0") {
      return {
        code: clean,
        region,
        personalAllowance: "£0 (Zero Allowance)",
        meaning: "Higher Rate (40% flat tax on all income from this job). Common for high-earning second jobs.",
        isEmergency,
        severity: "warning",
      };
    }

    if (baseCode === "D1") {
      return {
        code: clean,
        region,
        personalAllowance: "£0 (Zero Allowance)",
        meaning: "Additional Rate (45% flat tax on all income from this job).",
        isEmergency,
        severity: "warning",
      };
    }

    if (baseCode === "0T") {
      return {
        code: clean,
        region,
        personalAllowance: "£0 (Zero Allowance)",
        meaning: "Your Personal Allowance has been completely used up, or you started a new job without submitting a P45 / starter checklist.",
        isEmergency,
        severity: "warning",
      };
    }

    if (baseCode.startsWith("K")) {
      const numPart = parseInt(baseCode.slice(1), 10);
      const untaxedAmount = !isNaN(numPart) ? numPart * 10 : 0;
      return {
        code: clean,
        region,
        personalAllowance: "Negative Allowance",
        meaning: `You have untaxed income or company benefits (e.g. company car, private medical) worth approximately £${untaxedAmount.toLocaleString()} that exceeds your personal allowance. Tax is added to your pay.`,
        isEmergency,
        severity: "warning",
      };
    }

    if (baseCode.endsWith("L")) {
      const numPart = parseInt(baseCode.slice(0, -1), 10);
      const allowance = !isNaN(numPart) ? numPart * 10 : 12570;
      return {
        code: clean,
        region,
        personalAllowance: `£${allowance.toLocaleString()}`,
        meaning: `Standard tax code entitling you to £${allowance.toLocaleString()} in tax-free Personal Allowance for the tax year.`,
        isEmergency,
        severity: "safe",
      };
    }

    if (baseCode.endsWith("M")) {
      return {
        code: clean,
        region,
        personalAllowance: "Standard + Marriage Allowance (+10%)",
        meaning: "Marriage Allowance recipient: you received 10% of your partner's tax-free allowance (£1,260 extra).",
        isEmergency,
        severity: "safe",
      };
    }

    if (baseCode.endsWith("N")) {
      return {
        code: clean,
        region,
        personalAllowance: "Standard - Marriage Allowance (-10%)",
        meaning: "Marriage Allowance transferor: you transferred 10% of your allowance to your spouse or civil partner.",
        isEmergency,
        severity: "safe",
      };
    }

    return {
      code: clean,
      region,
      personalAllowance: "Custom HMRC Code",
      meaning: "Specialist or adjusted tax code. Check your personal HMRC tax account online.",
      isEmergency,
      severity: "info",
    };
  };

  const decoded = decodeTaxCode(taxCodeInput);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <FileCode className="w-3.5 h-3.5" />
            HMRC PAYE Decoder
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            UK Tax Code Checker &amp; Decoder
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Wondering why your payslip shows <code className="text-indigo-300 font-mono">1257L</code>, <code className="text-indigo-300 font-mono">BR</code>, or <code className="text-indigo-300 font-mono">K497</code>? 
            Decode any HMRC tax code to understand your personal allowance, emergency tax status, and Scottish/Welsh regional prefixes.
          </p>
        </div>
      </div>

      <UkDisclaimer 
        customSourceUrl="https://www.gov.uk/tax-codes"
        customSourceLabel="GOV.UK Tax Codes Guidance"
        notes="Tax codes are issued directly by HM Revenue & Customs based on your employment records."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Enter Tax Code from your Payslip or P60
          </label>
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={taxCodeInput}
              onChange={(e) => setTaxCodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. 1257L, BR, S1257L, 0T"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold text-sm tracking-widest uppercase"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {["1257L (Standard)", "BR (Second Job)", "0T (No Allowance)", "S1257L (Scotland)", "K500 (Company Benefits)", "1257L W1 (Emergency)"].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setTaxCodeInput(sample.split(' ')[0])}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {decoded && (
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {decoded.code}
                </span>
                {decoded.isEmergency && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    Emergency Tax Active (W1/M1)
                  </span>
                )}
              </div>
              <span className="text-xs font-mono font-bold text-blue-600">
                Personal Allowance: {decoded.personalAllowance}
              </span>
            </div>

            <div className="space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div>
                <strong>Jurisdiction:</strong> {decoded.region}
              </div>
              <div>
                <strong>Meaning &amp; Implication:</strong> {decoded.meaning}
              </div>
            </div>

            {decoded.isEmergency && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <strong>Emergency Tax Notice:</strong> Your tax is calculated on each pay period in isolation without cumulative previous allowances. Provide your P45 to your employer to revert to standard cumulative tax.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
