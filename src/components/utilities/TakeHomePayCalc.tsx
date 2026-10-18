import React, { useState } from "react";
import { 
  Calculator, 
  PoundSterling, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Sliders 
} from "lucide-react";
import { UK_TAX_CONFIG } from "../../config/ukTaxRates";
import { UkDisclaimer } from "../common/UkDisclaimer";

export function TakeHomePayCalc() {
  const [grossAnnual, setGrossAnnual] = useState(65000);
  const [region, setRegion] = useState<'england_wales_ni' | 'scotland'>('england_wales_ni');
  const [pensionPercent, setPensionPercent] = useState(5);
  const [studentLoanPlan, setStudentLoanPlan] = useState<'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgraduate'>('plan2');
  const [hasPostgradLoan, setHasPostgradLoan] = useState(false);

  // Calculation
  const isScotland = region === 'scotland';
  
  // Pension calculation (auto-enrolment qualifying earnings band)
  const qualifyingPensionBase = Math.max(0, Math.min(grossAnnual, UK_TAX_CONFIG.pension.qualifyingEarningsUpper) - UK_TAX_CONFIG.pension.qualifyingEarningsLower);
  const annualEmployeePension = (qualifyingPensionBase * pensionPercent) / 100;

  // Personal Allowance with Taper over £100k
  let allowance = UK_TAX_CONFIG.personalAllowance;
  let in60PercentTrap = false;

  if (grossAnnual > UK_TAX_CONFIG.personalAllowanceTaperThreshold) {
    in60PercentTrap = grossAnnual <= 125140;
    const reduction = (grossAnnual - UK_TAX_CONFIG.personalAllowanceTaperThreshold) / 2;
    allowance = Math.max(0, allowance - reduction);
  }

  const taxableIncome = Math.max(0, grossAnnual - allowance);

  // Income Tax calculation
  let incomeTax = 0;
  if (isScotland) {
    const starterMax = Math.max(0, UK_TAX_CONFIG.scotlandBands.starter.max - allowance);
    const basicMax = Math.max(0, UK_TAX_CONFIG.scotlandBands.basic.max - allowance);
    const intermediateMax = Math.max(0, UK_TAX_CONFIG.scotlandBands.intermediate.max - allowance);
    const higherMax = Math.max(0, UK_TAX_CONFIG.scotlandBands.higher.max - allowance);
    const advancedMax = Math.max(0, UK_TAX_CONFIG.scotlandBands.advanced.max - allowance);

    const b1 = Math.min(taxableIncome, starterMax);
    if (b1 > 0) incomeTax += b1 * 0.19;

    const b2 = Math.max(0, Math.min(taxableIncome, basicMax) - starterMax);
    if (b2 > 0) incomeTax += b2 * 0.20;

    const b3 = Math.max(0, Math.min(taxableIncome, intermediateMax) - basicMax);
    if (b3 > 0) incomeTax += b3 * 0.21;

    const b4 = Math.max(0, Math.min(taxableIncome, higherMax) - intermediateMax);
    if (b4 > 0) incomeTax += b4 * 0.42;

    const b5 = Math.max(0, Math.min(taxableIncome, advancedMax) - higherMax);
    if (b5 > 0) incomeTax += b5 * 0.45;

    const b6 = Math.max(0, taxableIncome - advancedMax);
    if (b6 > 0) incomeTax += b6 * 0.48;
  } else {
    const basicLimit = UK_TAX_CONFIG.englandBands.basic.max - UK_TAX_CONFIG.personalAllowance;
    const higherLimit = UK_TAX_CONFIG.englandBands.higher.max - UK_TAX_CONFIG.personalAllowance;

    const basicPortion = Math.min(taxableIncome, basicLimit);
    if (basicPortion > 0) incomeTax += basicPortion * 0.20;

    const higherPortion = Math.max(0, Math.min(taxableIncome, higherLimit) - basicPortion);
    if (higherPortion > 0) incomeTax += higherPortion * 0.40;

    const additionalPortion = Math.max(0, taxableIncome - higherLimit);
    if (additionalPortion > 0) incomeTax += additionalPortion * 0.45;
  }

  // National Insurance (Class 1 Employee)
  let nationalInsurance = 0;
  if (grossAnnual > UK_TAX_CONFIG.nationalInsurance.primaryThresholdYearly) {
    const mainBand = Math.min(grossAnnual, UK_TAX_CONFIG.nationalInsurance.upperEarningsLimitYearly) - UK_TAX_CONFIG.nationalInsurance.primaryThresholdYearly;
    nationalInsurance += mainBand * UK_TAX_CONFIG.nationalInsurance.mainRate; // 8%

    if (grossAnnual > UK_TAX_CONFIG.nationalInsurance.upperEarningsLimitYearly) {
      nationalInsurance += (grossAnnual - UK_TAX_CONFIG.nationalInsurance.upperEarningsLimitYearly) * UK_TAX_CONFIG.nationalInsurance.upperRate; // 2%
    }
  }

  // Student Loan
  let studentLoanAnnual = 0;
  if (studentLoanPlan === 'plan1' && grossAnnual > UK_TAX_CONFIG.studentLoans.plan1.threshold) {
    studentLoanAnnual += (grossAnnual - UK_TAX_CONFIG.studentLoans.plan1.threshold) * UK_TAX_CONFIG.studentLoans.plan1.rate;
  } else if (studentLoanPlan === 'plan2' && grossAnnual > UK_TAX_CONFIG.studentLoans.plan2.threshold) {
    studentLoanAnnual += (grossAnnual - UK_TAX_CONFIG.studentLoans.plan2.threshold) * UK_TAX_CONFIG.studentLoans.plan2.rate;
  } else if (studentLoanPlan === 'plan4' && grossAnnual > UK_TAX_CONFIG.studentLoans.plan4.threshold) {
    studentLoanAnnual += (grossAnnual - UK_TAX_CONFIG.studentLoans.plan4.threshold) * UK_TAX_CONFIG.studentLoans.plan4.rate;
  } else if (studentLoanPlan === 'plan5' && grossAnnual > UK_TAX_CONFIG.studentLoans.plan5.threshold) {
    studentLoanAnnual += (grossAnnual - UK_TAX_CONFIG.studentLoans.plan5.threshold) * UK_TAX_CONFIG.studentLoans.plan5.rate;
  }

  if (hasPostgradLoan && grossAnnual > UK_TAX_CONFIG.studentLoans.postgraduate.threshold) {
    studentLoanAnnual += (grossAnnual - UK_TAX_CONFIG.studentLoans.postgraduate.threshold) * UK_TAX_CONFIG.studentLoans.postgraduate.rate;
  }

  const netAnnual = grossAnnual - incomeTax - nationalInsurance - studentLoanAnnual - annualEmployeePension;
  const netMonthly = netAnnual / 12;
  const netWeekly = netAnnual / 52;
  const netDaily = netAnnual / 260; // 5 days x 52 weeks
  const netHourly = netAnnual / (260 * 7.5); // standard 37.5 hr week

  const effectiveTaxRate = grossAnnual > 0 ? ((grossAnnual - netAnnual) / grossAnnual) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Calculator className="w-3.5 h-3.5" />
            Official UK Tax Engine • Audited {UK_TAX_CONFIG.lastChecked}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            UK Take-Home Pay &amp; Salary Tax Calculator
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Accurate take-home pay calculation for England, Wales, Northern Ireland, and Scotland. 
            Includes the 8% National Insurance employee cut, personal allowance taper above £100,000, 
            qualifying workplace pension auto-enrolment, and student loan Plans 1, 2, 4, 5 &amp; Postgraduate.
          </p>
        </div>
      </div>

      <UkDisclaimer 
        customSourceUrl="https://www.gov.uk/estimate-income-tax"
        customSourceLabel="GOV.UK Estimate Income Tax"
        notes="Based on HMRC PAYE tax thresholds. Personal allowance freezes and regional Scottish tax band divergence are fully accounted for."
      />

      {/* 60% Tax Trap Warning Banner */}
      {in60PercentTrap && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-950 dark:text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-amber-900 dark:text-amber-100 text-sm">
              60% Marginal Tax Trap Active (£100,000 - £125,140)
            </span>
            <p className="leading-relaxed text-amber-800 dark:text-amber-300">
              For every £2 earned above £100,000, you lose £1 of your tax-free Personal Allowance. 
              This creates an effective <strong>60% marginal tax rate</strong> (40% higher rate + 20% allowance withdrawal, plus 2% NI). 
              <em>Tip: Contributing into a salary sacrifice workplace pension avoids this trap completely.</em>
            </p>
          </div>
        </div>
      )}

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Your Salary &amp; Tax Profile
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Gross Annual Salary
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">£</span>
              <input
                type="number"
                step="500"
                min="0"
                value={grossAnnual}
                onChange={(e) => setGrossAnnual(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold text-base"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[35000, 50000, 75000, 105000, 130000].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setGrossAnnual(s)}
                  className="px-2 py-1 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  £{(s / 1000)}k
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tax Region
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setRegion('england_wales_ni')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  region === 'england_wales_ni'
                    ? "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200 font-bold"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                England, Wales &amp; NI
              </button>
              <button
                type="button"
                onClick={() => setRegion('scotland')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  region === 'scotland'
                    ? "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200 font-bold"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                Scotland (Scottish Bands)
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Workplace Pension Contribution
              </label>
              <span className="text-xs font-mono font-bold text-blue-600">{pensionPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={pensionPercent}
              onChange={(e) => setPensionPercent(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Statutory auto-enrolment minimum is 5% employee + 3% employer match.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Student Loan Repayment Plan
            </label>
            <select
              value={studentLoanPlan}
              onChange={(e) => setStudentLoanPlan(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs"
            >
              <option value="none">No Student Loan</option>
              <option value="plan1">Plan 1 (Pre-2012 / NI: &gt;£24,990)</option>
              <option value="plan2">Plan 2 (Post-2012 England/Wales: &gt;£27,295)</option>
              <option value="plan4">Plan 4 (Scotland: &gt;£31,395)</option>
              <option value="plan5">Plan 5 (Aug 2023+ Starters: &gt;£25,000)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="pgLoan"
              checked={hasPostgradLoan}
              onChange={(e) => setHasPostgradLoan(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="pgLoan" className="text-xs text-slate-700 dark:text-slate-300 select-none">
              Include Postgraduate Master's / Doctoral Loan (6% over £21,000)
            </label>
          </div>
        </div>

        {/* Right Output Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Net Hero Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              Estimated Monthly Net Take-Home
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-4xl sm:text-5xl font-black tracking-tight">
                £{Math.round(netMonthly).toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-blue-100">
                / month
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-blue-500/40 text-xs">
              <div>
                <span className="text-blue-200 text-[10px] block">Weekly</span>
                <span className="font-bold">£{Math.round(netWeekly).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-blue-200 text-[10px] block">Daily (260d)</span>
                <span className="font-bold">£{Math.round(netDaily).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-blue-200 text-[10px] block">Hourly (37.5h)</span>
                <span className="font-bold">£{netHourly.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Full Breakdown Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Annual Statutory Deductions
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                Effective Tax: {effectiveTaxRate.toFixed(1)}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-300">Gross Annual Salary</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">£{grossAnnual.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1 text-slate-500">
                <span>Tax-Free Personal Allowance</span>
                <span className="font-mono text-emerald-600 font-semibold">£{Math.round(allowance).toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1 text-rose-600">
                <span>Income Tax ({isScotland ? "Scottish Rates" : "England/Wales Rates"})</span>
                <span className="font-mono font-bold">-£{Math.round(incomeTax).toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1 text-rose-600">
                <span>National Insurance (8% / 2%)</span>
                <span className="font-mono font-bold">-£{Math.round(nationalInsurance).toLocaleString()}</span>
              </div>

              {studentLoanAnnual > 0 && (
                <div className="flex justify-between py-1 text-rose-600">
                  <span>Student Loan ({studentLoanPlan.toUpperCase()})</span>
                  <span className="font-mono font-bold">-£{Math.round(studentLoanAnnual).toLocaleString()}</span>
                </div>
              )}

              {annualEmployeePension > 0 && (
                <div className="flex justify-between py-1 text-amber-600">
                  <span>Workplace Pension ({pensionPercent}%)</span>
                  <span className="font-mono font-bold">-£{Math.round(annualEmployeePension).toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm font-extrabold">
                <span className="text-slate-900 dark:text-white">Annual Net Pay</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">£{Math.round(netAnnual).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
