import React, { useState } from "react";
import { 
  PiggyBank, 
  PoundSterling, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp 
} from "lucide-react";
import { UK_TAX_CONFIG } from "../../config/ukTaxRates";
import { UkDisclaimer } from "../common/UkDisclaimer";

export function IsaSavingsTracker() {
  const [cashIsa, setCashIsa] = useState(8000);
  const [stocksAndSharesIsa, setStocksAndSharesIsa] = useState(6000);
  const [lisaAmount, setLisaAmount] = useState(4000);
  const [taxBand, setTaxBand] = useState<'basic' | 'higher' | 'additional'>('basic');
  const [nonIsaSavingsInterest, setNonIsaSavingsInterest] = useState(650);

  const totalIsaInvested = cashIsa + stocksAndSharesIsa + lisaAmount;
  const remainingAllowance = Math.max(0, UK_TAX_CONFIG.savings.annualIsaAllowance - totalIsaInvested);
  const lisaBonus = Math.min(lisaAmount, UK_TAX_CONFIG.savings.lifetimeIsaAnnualMax) * 0.25;

  // Personal Savings Allowance
  const psaLimit = taxBand === 'basic' 
    ? UK_TAX_CONFIG.savings.psaBasicRate 
    : taxBand === 'higher' 
    ? UK_TAX_CONFIG.savings.psaHigherRate 
    : UK_TAX_CONFIG.savings.psaAdditionalRate;

  const taxableInterest = Math.max(0, nonIsaSavingsInterest - psaLimit);
  const taxOnInterest = taxBand === 'basic' ? taxableInterest * 0.20 : taxBand === 'higher' ? taxableInterest * 0.40 : taxableInterest * 0.45;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <PiggyBank className="w-3.5 h-3.5" />
            Tax-Free Savings &amp; Investment Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            UK ISA Allowance &amp; Personal Savings Allowance (PSA)
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Monitor your annual <code className="text-emerald-300">£20,000</code> tax-free ISA limit across Cash, Stocks &amp; Shares, 
            and Lifetime ISA accounts (including the 25% free government bonus up to £1,000/year). 
            Track non-ISA bank interest against your Personal Savings Allowance.
          </p>
        </div>
      </div>

      <UkDisclaimer 
        customSourceUrl="https://www.gov.uk/individual-savings-accounts"
        customSourceLabel="GOV.UK Individual Savings Accounts (ISAs)"
        notes="ISA gains and dividends are 100% exempt from UK Capital Gains Tax and Income Tax."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Current Tax Year ISA Contributions
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cash ISA Deposited (£)
            </label>
            <input
              type="number"
              step="500"
              min="0"
              max="20000"
              value={cashIsa}
              onChange={(e) => setCashIsa(Number(e.target.value) || 0)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Stocks &amp; Shares ISA (£)
            </label>
            <input
              type="number"
              step="500"
              min="0"
              max="20000"
              value={stocksAndSharesIsa}
              onChange={(e) => setStocksAndSharesIsa(Number(e.target.value) || 0)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Lifetime ISA (LISA) (£, Max £4,000)
            </label>
            <input
              type="number"
              step="500"
              min="0"
              max="4000"
              value={lisaAmount}
              onChange={(e) => setLisaAmount(Math.min(4000, Number(e.target.value) || 0))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold text-xs"
            />
            {lisaBonus > 0 && (
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                +£{lisaBonus.toLocaleString()} 25% Government Bonus added for first home / retirement
              </span>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Your UK Income Tax Band
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setTaxBand('basic')}
                className={`p-2 rounded-xl border text-center font-medium ${
                  taxBand === 'basic' ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-bold" : "border-slate-200 text-slate-600"
                }`}
              >
                Basic (20%)
              </button>
              <button
                type="button"
                onClick={() => setTaxBand('higher')}
                className={`p-2 rounded-xl border text-center font-medium ${
                  taxBand === 'higher' ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-bold" : "border-slate-200 text-slate-600"
                }`}
              >
                Higher (40%)
              </button>
              <button
                type="button"
                onClick={() => setTaxBand('additional')}
                className={`p-2 rounded-xl border text-center font-medium ${
                  taxBand === 'additional' ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-bold" : "border-slate-200 text-slate-600"
                }`}
              >
                Top (45%)
              </button>
            </div>
          </div>
        </div>

        {/* Right Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-lg space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              Remaining Annual ISA Allowance
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight">
              £{remainingAllowance.toLocaleString()}
            </div>
            <div className="w-full h-2 rounded-full bg-emerald-800 overflow-hidden mt-3">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalIsaInvested / 20000) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-emerald-100 font-mono">
              <span>£{totalIsaInvested.toLocaleString()} contributed</span>
              <span>£20,000 cap</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
              Personal Savings Allowance (PSA) for Non-ISA Bank Interest
            </h4>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Your Annual Tax-Free Allowance</span>
              <span className="font-mono font-bold text-emerald-600">£{psaLimit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Non-ISA Interest Earned</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">£{nonIsaSavingsInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-slate-200 dark:border-slate-800 font-bold">
              <span>Tax Owed on Excess Interest</span>
              <span className="font-mono text-rose-600">£{Math.round(taxOnInterest).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
