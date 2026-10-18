import React, { useState } from "react";
import { 
  Percent, 
  PoundSterling, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRightLeft 
} from "lucide-react";
import { UkDisclaimer } from "../common/UkDisclaimer";

export function VatCalculator() {
  const [amount, setAmount] = useState(120);
  const [calculationMode, setCalculationMode] = useState<'add_vat' | 'remove_vat'>('remove_vat');
  const [vatRatePercent, setVatRatePercent] = useState<number>(20);

  // If removing VAT (amount is Gross): Net = Gross / (1 + rate)
  // If adding VAT (amount is Net): Gross = Net * (1 + rate)
  const rateFraction = vatRatePercent / 100;

  let netAmount = 0;
  let vatAmount = 0;
  let grossAmount = 0;

  if (calculationMode === 'remove_vat') {
    grossAmount = amount;
    netAmount = grossAmount / (1 + rateFraction);
    vatAmount = grossAmount - netAmount;
  } else {
    netAmount = amount;
    vatAmount = netAmount * rateFraction;
    grossAmount = netAmount + vatAmount;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Percent className="w-3.5 h-3.5" />
            UK HMRC VAT Rules
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            UK VAT Calculator (Gross to Net &amp; Net to Gross)
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Quickly add or reverse UK Value Added Tax at standard <code className="text-teal-300">20%</code>, 
            reduced <code className="text-teal-300">5%</code> (domestic fuel/energy), or zero rate <code className="text-teal-300">0%</code>.
          </p>
        </div>
      </div>

      <UkDisclaimer 
        customSourceUrl="https://www.gov.uk/vat-rates"
        customSourceLabel="GOV.UK VAT Rates"
        notes="Standard UK VAT registration threshold is £90,000 annual taxable turnover."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            VAT Calculation Mode
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setCalculationMode('remove_vat')}
              className={`p-3 rounded-xl border text-center transition-all ${
                calculationMode === 'remove_vat'
                  ? "border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-200 font-bold"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              Remove VAT (Gross → Net)
            </button>
            <button
              type="button"
              onClick={() => setCalculationMode('add_vat')}
              className={`p-3 rounded-xl border text-center transition-all ${
                calculationMode === 'add_vat'
                  ? "border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-200 font-bold"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              Add VAT (Net → Gross)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {calculationMode === 'remove_vat' ? "Enter Gross Amount (Including VAT)" : "Enter Net Amount (Excluding VAT)"}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">£</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Applicable UK VAT Rate
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { rate: 20, label: "20% Standard" },
                { rate: 5, label: "5% Reduced" },
                { rate: 0, label: "0% Zero Rate" },
              ].map((r) => (
                <button
                  key={r.rate}
                  type="button"
                  onClick={() => setVatRatePercent(r.rate)}
                  className={`p-2 rounded-xl border text-center font-mono ${
                    vatRatePercent === r.rate ? "border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-200 font-bold" : "border-slate-200 dark:border-slate-800 text-slate-600"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-br from-teal-600 to-emerald-700 text-white rounded-2xl p-6 shadow-lg space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
              VAT Portion ({vatRatePercent}%)
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight">
              £{vatAmount.toFixed(2)}
            </div>
            <span className="text-xs text-teal-100 block">
              {calculationMode === 'remove_vat' ? "Extracted from gross receipt." : "Added onto net invoice."}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
              Summary Receipt
            </h4>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Net Amount (Pre-Tax)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">£{netAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-teal-600 font-semibold">
              <span>VAT ({vatRatePercent}%)</span>
              <span className="font-mono">+£{vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-slate-200 dark:border-slate-800 font-extrabold text-sm">
              <span className="text-slate-900 dark:text-white">Gross Amount (Total Paid)</span>
              <span className="font-mono text-teal-700 dark:text-teal-300">£{grossAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
