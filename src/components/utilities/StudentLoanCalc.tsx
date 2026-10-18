import React, { useState } from "react";
import { 
  GraduationCap, 
  PoundSterling, 
  HelpCircle, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  TrendingDown 
} from "lucide-react";
import { UK_TAX_CONFIG } from "../../config/ukTaxRates";
import { UkDisclaimer } from "../common/UkDisclaimer";

export function StudentLoanCalc() {
  const [salary, setSalary] = useState(48000);
  const [loanBalance, setLoanBalance] = useState(42000);
  const [plan, setPlan] = useState<'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgraduate'>('plan2');

  const getPlanInfo = () => {
    switch (plan) {
      case 'plan1':
        return {
          title: "Plan 1 (Pre-2012 / NI)",
          threshold: UK_TAX_CONFIG.studentLoans.plan1.threshold,
          rate: 0.09,
          writeOffYears: 25,
          desc: "9% of earnings over £24,990. Cancelled at age 65 or 25 years after graduation.",
        };
      case 'plan2':
        return {
          title: "Plan 2 (2012 - 2023 Starters, England/Wales)",
          threshold: UK_TAX_CONFIG.studentLoans.plan2.threshold,
          rate: 0.09,
          writeOffYears: 30,
          desc: "9% of earnings over £27,295. Cancelled after 30 years regardless of balance remaining.",
        };
      case 'plan4':
        return {
          title: "Plan 4 (Scottish Students)",
          threshold: UK_TAX_CONFIG.studentLoans.plan4.threshold,
          rate: 0.09,
          writeOffYears: 30,
          desc: "9% of earnings over £31,395. Scottish repayment scheme.",
        };
      case 'plan5':
        return {
          title: "Plan 5 (Aug 2023+ Starters)",
          threshold: UK_TAX_CONFIG.studentLoans.plan5.threshold,
          rate: 0.09,
          writeOffYears: 40,
          desc: "9% of earnings over £25,000. Extended 40-year write-off window.",
        };
      case 'postgraduate':
        return {
          title: "Postgraduate Loan (Master's / Doctoral)",
          threshold: UK_TAX_CONFIG.studentLoans.postgraduate.threshold,
          rate: 0.06,
          writeOffYears: 30,
          desc: "6% of earnings over £21,000 (paid in addition to undergraduate plans).",
        };
    }
  };

  const info = getPlanInfo();
  const annualDeduction = salary > info.threshold ? (salary - info.threshold) * info.rate : 0;
  const monthlyDeduction = annualDeduction / 12;

  // Approximate payoff simulation
  const yearsToPayoff = annualDeduction > 0 ? (loanBalance / annualDeduction) : Infinity;
  const willBeWrittenOff = yearsToPayoff > info.writeOffYears;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            SLC Repayment Simulator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            UK Student Loan Repayment &amp; Write-Off Simulator
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            In the UK, student loans function as a graduate payroll tax. Discover your exact monthly deduction across 
            <strong>Plan 1, Plan 2, Plan 4, Plan 5, and Postgraduate</strong> loans, and simulate whether your loan will ever 
            be cleared before the statutory 30 or 40-year cancellation date.
          </p>
        </div>
      </div>

      <UkDisclaimer 
        customSourceUrl="https://www.gov.uk/repaying-your-student-loan"
        customSourceLabel="Student Loans Company (SLC) Guidance"
        notes="Student loans in the UK are cancelled after the statutory period with zero residual debt or credit file impact."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Your Loan Parameters
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Your Plan Type
            </label>
            <div className="space-y-2 text-xs">
              {[
                { id: 'plan2', label: 'Plan 2 (2012-2023 Starters, Eng/Wales)' },
                { id: 'plan5', label: 'Plan 5 (Aug 2023+ Starters, 40-yr cancel)' },
                { id: 'plan1', label: 'Plan 1 (Pre-2012 / Northern Ireland)' },
                { id: 'plan4', label: 'Plan 4 (Scottish Students)' },
                { id: 'postgraduate', label: 'Postgraduate Master’s / Doctoral' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id as any)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                    plan === p.id
                      ? "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Gross Annual Salary
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">£</span>
              <input
                type="number"
                step="1000"
                min="0"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Outstanding Balance
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">£</span>
              <input
                type="number"
                step="1000"
                min="0"
                value={loanBalance}
                onChange={(e) => setLoanBalance(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              Monthly Salary Deduction
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight">
              £{Math.round(monthlyDeduction).toLocaleString()}
              <span className="text-sm font-normal text-blue-100"> / month</span>
            </div>
            <div className="pt-2 border-t border-blue-500/40 text-xs text-blue-100 flex justify-between">
              <span>Annual Deduction:</span>
              <span className="font-bold">£{Math.round(annualDeduction).toLocaleString()}</span>
            </div>
          </div>

          {/* Write-off Reality Verdict */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Lifetime Write-Off Forecast
            </h4>

            {willBeWrittenOff ? (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-100">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Loan Will Likely Be Cancelled Under Statutory Rules
                </span>
                <p className="leading-relaxed">
                  At this salary, your annual payments (£{Math.round(annualDeduction).toLocaleString()}) will not clear the £{loanBalance.toLocaleString()} balance 
                  before the <strong>{info.writeOffYears}-year write-off window</strong> closes. 
                  Any remaining debt is cancelled by the UK government with no penalties. Overpaying early is rarely financially optimal for most graduates.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-900 dark:text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  On Course for Full Repayment
                </span>
                <p className="leading-relaxed">
                  At current salary, your loan could be fully cleared in approximately <strong>{Math.ceil(yearsToPayoff)} years</strong>.
                </p>
              </div>
            )}

            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              Threshold for {info.title}: <strong>£{info.threshold.toLocaleString()}</strong> ({info.rate * 100}% marginal rate on income above threshold).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
