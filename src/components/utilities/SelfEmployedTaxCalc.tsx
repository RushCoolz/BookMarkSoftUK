import React, { useState } from "react";
import { 
  Briefcase, 
  PoundSterling, 
  HelpCircle, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  PiggyBank 
} from "lucide-react";
import { UK_TAX_CONFIG } from "../../config/ukTaxRates";
import { UkDisclaimer } from "../common/UkDisclaimer";

export function SelfEmployedTaxCalc() {
  const [turnover, setTurnover] = useState(55000);
  const [allowableExpenses, setAllowableExpenses] = useState(7500);

  const netProfit = Math.max(0, turnover - allowableExpenses);

  // Income Tax on Profit
  let allowance = UK_TAX_CONFIG.personalAllowance;
  if (netProfit > UK_TAX_CONFIG.personalAllowanceTaperThreshold) {
    const reduction = (netProfit - UK_TAX_CONFIG.personalAllowanceTaperThreshold) / 2;
    allowance = Math.max(0, allowance - reduction);
  }

  const taxableProfit = Math.max(0, netProfit - allowance);

  let incomeTax = 0;
  const basicLimit = UK_TAX_CONFIG.englandBands.basic.max - UK_TAX_CONFIG.personalAllowance;
  const higherLimit = UK_TAX_CONFIG.englandBands.higher.max - UK_TAX_CONFIG.personalAllowance;

  const b1 = Math.min(taxableProfit, basicLimit);
  if (b1 > 0) incomeTax += b1 * 0.20;

  const b2 = Math.max(0, Math.min(taxableProfit, higherLimit) - b1);
  if (b2 > 0) incomeTax += b2 * 0.40;

  const b3 = Math.max(0, taxableProfit - higherLimit);
  if (b3 > 0) incomeTax += b3 * 0.45;

  // Class 4 National Insurance (Self-Employed: 6% between £12,570 and £50,270, 2% above)
  let class4NI = 0;
  if (netProfit > UK_TAX_CONFIG.selfEmployedNI.lowerProfitsLimit) {
    const mainBand = Math.min(netProfit, UK_TAX_CONFIG.selfEmployedNI.upperProfitsLimit) - UK_TAX_CONFIG.selfEmployedNI.lowerProfitsLimit;
    class4NI += mainBand * UK_TAX_CONFIG.selfEmployedNI.class4MainRate;

    if (netProfit > UK_TAX_CONFIG.selfEmployedNI.upperProfitsLimit) {
      class4NI += (netProfit - UK_TAX_CONFIG.selfEmployedNI.upperProfitsLimit) * UK_TAX_CONFIG.selfEmployedNI.class4UpperRate;
    }
  }

  const totalTaxAndNI = incomeTax + class4NI;
  const takeHomeAnnual = netProfit - totalTaxAndNI;
  const takeHomeMonthly = takeHomeAnnual / 12;

  // Payments on account (50% due 31 January, 50% due 31 July if tax > £1,000)
  const paymentsOnAccountAnnual = totalTaxAndNI > 1000 ? totalTaxAndNI : 0;
  const paymentOnAccountInstallment = paymentsOnAccountAnnual / 2;

  // Recommended "Set Aside" Percentage
  const recommendedSetAsidePercent = turnover > 0 ? Math.ceil((totalTaxAndNI / turnover) * 100) + 3 : 25; // 3% safety buffer

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Briefcase className="w-3.5 h-3.5" />
            Sole Trader &amp; Freelance Tax Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            UK Self-Employed Tax &amp; Payments on Account
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Calculate your Income Tax, Class 4 National Insurance (6%), HMRC Payments on Account 
            (January &amp; July installments), and discover the exact percentage of every invoice you should set aside into a tax reserve account.
          </p>
        </div>
      </div>

      <UkDisclaimer 
        customSourceUrl="https://www.gov.uk/self-assessment-tax-returns"
        customSourceLabel="GOV.UK Self Assessment Guidance"
        notes="Class 4 NI rate of 6% applies following the reduction from 9%. Class 2 flat-rate NI is abolished for profits above £6,725."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Business Income &amp; Expenses
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Annual Invoiced Turnover (Gross Revenue)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">£</span>
              <input
                type="number"
                step="500"
                min="0"
                value={turnover}
                onChange={(e) => setTurnover(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Allowable Business Expenses (Software, Travel, Home Office)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">£</span>
              <input
                type="number"
                step="250"
                min="0"
                value={allowableExpenses}
                onChange={(e) => setAllowableExpenses(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Net Taxable Profit: <strong className="text-slate-700 dark:text-slate-300 font-mono">£{netProfit.toLocaleString()}</strong>
            </span>
          </div>

          {/* Set Aside Recommendation Box */}
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-2">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span className="font-bold text-xs text-teal-950 dark:text-teal-200">
                Recommended Tax Reserve "Set Aside"
              </span>
            </div>
            <div className="text-3xl font-black text-teal-700 dark:text-teal-300">
              {recommendedSetAsidePercent}%
            </div>
            <p className="text-[11px] text-teal-900 dark:text-teal-300/90 leading-relaxed">
              Transfer <strong>{recommendedSetAsidePercent}%</strong> of every invoice immediately into a high-interest savings pot to guarantee you are never caught out by January Self-Assessment bills.
            </p>
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-br from-teal-600 to-emerald-700 text-white rounded-2xl p-6 shadow-lg space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
              Estimated Monthly Retained Earnings
            </span>
            <div className="text-4xl font-black tracking-tight">
              £{Math.round(takeHomeMonthly).toLocaleString()}
              <span className="text-sm font-normal text-teal-100"> / month</span>
            </div>
            <div className="pt-2 border-t border-teal-500/40 text-xs text-teal-100 flex justify-between">
              <span>Annual Retained Take-Home:</span>
              <span className="font-bold">£{Math.round(takeHomeAnnual).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
              Tax &amp; National Insurance Liability
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Gross Turnover</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">£{turnover.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-500">
                <span>Allowable Business Expenses</span>
                <span className="font-mono">-£{allowableExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-2">
                <span>Net Taxable Business Profit</span>
                <span className="font-mono">£{netProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-rose-600">
                <span>Income Tax</span>
                <span className="font-mono font-bold">-£{Math.round(incomeTax).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-rose-600">
                <span>Class 4 National Insurance (6% / 2%)</span>
                <span className="font-mono font-bold">-£{Math.round(class4NI).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-slate-200 dark:border-slate-800 font-extrabold text-sm">
                <span className="text-slate-900 dark:text-white">Total Self-Assessment Bill</span>
                <span className="font-mono text-rose-600">£{Math.round(totalTaxAndNI).toLocaleString()}</span>
              </div>
            </div>

            {/* Payments on Account Callout */}
            {totalTaxAndNI > 1000 && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  HMRC Payments on Account Deadlines
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block font-sans">31 January Installment</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">£{Math.round(paymentOnAccountInstallment).toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block font-sans">31 July Installment</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">£{Math.round(paymentOnAccountInstallment).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
