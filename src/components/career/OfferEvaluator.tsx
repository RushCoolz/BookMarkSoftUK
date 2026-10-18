import React, { useState } from "react";
import { 
  Scale, 
  CheckCircle2, 
  Plus, 
  HelpCircle, 
  Sparkles, 
  Building2, 
  Train, 
  Shield, 
  CalendarDays, 
  TrendingUp,
  ArrowRight,
  ExternalLink 
} from "lucide-react";
import { OfferComparison } from "../../types/career";
import { SAMPLE_OFFER_COMPARISONS } from "../../data/sampleCareerData";
import { UK_TAX_CONFIG } from "../../config/ukTaxRates";
import { UkDisclaimer } from "../common/UkDisclaimer";

export function OfferEvaluator() {
  const [offers, setOffers] = useState<OfferComparison[]>(SAMPLE_OFFER_COMPARISONS);

  // Exact UK take home pay calculation
  const calculateTakeHome = (offer: OfferComparison) => {
    const gross = offer.baseSalary + offer.bonusExpected;
    
    // Pension contribution (auto-enrolment qualifying earnings)
    const pensionBase = Math.max(0, Math.min(gross, UK_TAX_CONFIG.pension.qualifyingEarningsUpper) - UK_TAX_CONFIG.pension.qualifyingEarningsLower);
    const employeePension = (pensionBase * offer.pensionEmployeePercent) / 100;
    const employerPension = (pensionBase * offer.pensionEmployerPercent) / 100;

    // Personal Allowance with Taper over £100k
    let allowance = UK_TAX_CONFIG.personalAllowance;
    if (gross > UK_TAX_CONFIG.personalAllowanceTaperThreshold) {
      const reduction = (gross - UK_TAX_CONFIG.personalAllowanceTaperThreshold) / 2;
      allowance = Math.max(0, allowance - reduction);
    }

    const taxableIncome = Math.max(0, gross - allowance);

    // Income tax (England vs Scotland)
    let incomeTax = 0;
    if (offer.isScottishTax) {
      // Scotland Bands
      const b1 = Math.min(taxableIncome, UK_TAX_CONFIG.scotlandBands.starter.max - allowance);
      if (b1 > 0) incomeTax += b1 * 0.19;

      const b2 = Math.max(0, Math.min(taxableIncome, UK_TAX_CONFIG.scotlandBands.basic.max - allowance) - (UK_TAX_CONFIG.scotlandBands.starter.max - allowance));
      if (b2 > 0) incomeTax += b2 * 0.20;

      const b3 = Math.max(0, Math.min(taxableIncome, UK_TAX_CONFIG.scotlandBands.intermediate.max - allowance) - (UK_TAX_CONFIG.scotlandBands.basic.max - allowance));
      if (b3 > 0) incomeTax += b3 * 0.21;

      const b4 = Math.max(0, Math.min(taxableIncome, UK_TAX_CONFIG.scotlandBands.higher.max - allowance) - (UK_TAX_CONFIG.scotlandBands.intermediate.max - allowance));
      if (b4 > 0) incomeTax += b4 * 0.42;

      const b5 = Math.max(0, Math.min(taxableIncome, UK_TAX_CONFIG.scotlandBands.advanced.max - allowance) - (UK_TAX_CONFIG.scotlandBands.higher.max - allowance));
      if (b5 > 0) incomeTax += b5 * 0.45;

      const b6 = Math.max(0, taxableIncome - (UK_TAX_CONFIG.scotlandBands.advanced.max - allowance));
      if (b6 > 0) incomeTax += b6 * 0.48;
    } else {
      // England, Wales, NI Bands
      const basicBand = Math.min(taxableIncome, UK_TAX_CONFIG.englandBands.basic.max - UK_TAX_CONFIG.personalAllowance);
      if (basicBand > 0) incomeTax += basicBand * 0.20;

      const higherBand = Math.max(0, Math.min(taxableIncome, UK_TAX_CONFIG.englandBands.higher.max - UK_TAX_CONFIG.personalAllowance) - basicBand);
      if (higherBand > 0) incomeTax += higherBand * 0.40;

      const additionalBand = Math.max(0, taxableIncome - (UK_TAX_CONFIG.englandBands.higher.max - UK_TAX_CONFIG.personalAllowance));
      if (additionalBand > 0) incomeTax += additionalBand * 0.45;
    }

    // National Insurance (Class 1 Employee - 8% main, 2% upper)
    let ni = 0;
    if (gross > UK_TAX_CONFIG.nationalInsurance.primaryThresholdYearly) {
      const mainBand = Math.min(gross, UK_TAX_CONFIG.nationalInsurance.upperEarningsLimitYearly) - UK_TAX_CONFIG.nationalInsurance.primaryThresholdYearly;
      ni += mainBand * UK_TAX_CONFIG.nationalInsurance.mainRate;

      if (gross > UK_TAX_CONFIG.nationalInsurance.upperEarningsLimitYearly) {
        ni += (gross - UK_TAX_CONFIG.nationalInsurance.upperEarningsLimitYearly) * UK_TAX_CONFIG.nationalInsurance.upperRate;
      }
    }

    // Student loan
    let studentLoan = 0;
    if (offer.studentLoanPlan === 'plan2' && gross > UK_TAX_CONFIG.studentLoans.plan2.threshold) {
      studentLoan = (gross - UK_TAX_CONFIG.studentLoans.plan2.threshold) * UK_TAX_CONFIG.studentLoans.plan2.rate;
    } else if (offer.studentLoanPlan === 'plan1' && gross > UK_TAX_CONFIG.studentLoans.plan1.threshold) {
      studentLoan = (gross - UK_TAX_CONFIG.studentLoans.plan1.threshold) * UK_TAX_CONFIG.studentLoans.plan1.rate;
    } else if (offer.studentLoanPlan === 'plan4' && gross > UK_TAX_CONFIG.studentLoans.plan4.threshold) {
      studentLoan = (gross - UK_TAX_CONFIG.studentLoans.plan4.threshold) * UK_TAX_CONFIG.studentLoans.plan4.rate;
    } else if (offer.studentLoanPlan === 'plan5' && gross > UK_TAX_CONFIG.studentLoans.plan5.threshold) {
      studentLoan = (gross - UK_TAX_CONFIG.studentLoans.plan5.threshold) * UK_TAX_CONFIG.studentLoans.plan5.rate;
    }

    // Net take-home after statutory and pension deductions
    const netAnnual = gross - incomeTax - ni - studentLoan - employeePension;
    // Net real cash in bank after annual commute
    const realDiscretionaryAnnual = netAnnual - offer.annualCommuteCost;

    return {
      gross,
      incomeTax: Math.round(incomeTax),
      ni: Math.round(ni),
      studentLoan: Math.round(studentLoan),
      employeePension: Math.round(employeePension),
      employerPension: Math.round(employerPension),
      totalPensionPotAnnual: Math.round(employeePension + employerPension),
      netAnnual: Math.round(netAnnual),
      netMonthly: Math.round(netAnnual / 12),
      realDiscretionaryMonthly: Math.round(realDiscretionaryAnnual / 12),
    };
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Scale className="w-3.5 h-3.5" />
            Connected UK Utility Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Offer Evaluator: Real Take-Home &amp; Total Reward
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Never judge a job offer by gross headline salary alone. In the UK, high marginal tax brackets 
            (such as the 60% effective tax trap between £100k and £125k), commute costs (TfL vs hybrid), employer pension matches, 
            and student loan deductions drastically alter what lands in your bank account every month.
          </p>
        </div>
      </div>

      <UkDisclaimer 
        customSourceLabel="GOV.UK Income Tax and National Insurance Rates"
        notes="All tax, NI, pension auto-enrolment thresholds, and student loan deductions are computed live using UK statutory rates for the 2025/2026 tax year."
      />

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer, idx) => {
          const calc = calculateTakeHome(offer);

          return (
            <div 
              key={offer.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between ${
                idx === 0 ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                      {offer.companyName}
                    </h3>
                    <p className="text-xs text-slate-500">{offer.jobTitle}</p>
                  </div>
                  {idx === 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Top Pick
                    </span>
                  )}
                </div>

                {/* Net Monthly Take-Home (Highlight) */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Actual Net Monthly Pay
                  </span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    £{calc.netMonthly.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                    £{calc.realDiscretionaryMonthly.toLocaleString()}/mo after commute
                  </span>
                </div>

                {/* Financial Breakdown Table */}
                <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gross Headline Salary</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">£{offer.baseSalary.toLocaleString()}</span>
                  </div>
                  {offer.bonusExpected > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expected Annual Bonus</span>
                      <span className="font-mono text-blue-600 font-semibold">+£{offer.bonusExpected.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-rose-600">
                    <span>Income Tax</span>
                    <span className="font-mono">-£{calc.incomeTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>National Insurance (8%)</span>
                    <span className="font-mono">-£{calc.ni.toLocaleString()}</span>
                  </div>
                  {calc.studentLoan > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Student Loan ({offer.studentLoanPlan.toUpperCase()})</span>
                      <span className="font-mono">-£{calc.studentLoan.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-amber-600">
                    <span>Your Pension ({offer.pensionEmployeePercent}%)</span>
                    <span className="font-mono">-£{calc.employeePension.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Annual Commute Cost</span>
                    <span className="font-mono">£{offer.annualCommuteCost.toLocaleString()}</span>
                  </div>
                </div>

                {/* Workplace Pension & Benefits */}
                <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Employer Pension Match</span>
                    <span className="font-mono font-bold text-emerald-600">{offer.pensionEmployerPercent}% (+£{calc.employerPension.toLocaleString()})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Annual Pension Added</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">£{calc.totalPensionPotAnnual.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paid Annual Leave</span>
                    <span className="font-bold text-slate-900 dark:text-white">{offer.annualHolidayDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Notice Period</span>
                    <span className="font-bold text-slate-900 dark:text-white">{offer.noticePeriodWeeks} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Working Model</span>
                    <span className="font-medium text-blue-600 capitalize">{offer.remotePolicy.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                Notice: {offer.noticePeriodWeeks} weeks contractual notice period applies.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
