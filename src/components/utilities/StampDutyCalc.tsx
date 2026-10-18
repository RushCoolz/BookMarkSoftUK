import React, { useState } from "react";
import { 
  Home, 
  PoundSterling, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  Building, 
  Info 
} from "lucide-react";
import { UK_TAX_CONFIG } from "../../config/ukTaxRates";
import { UkDisclaimer } from "../common/UkDisclaimer";

export function StampDutyCalc() {
  const [propertyPrice, setPropertyPrice] = useState(450000);
  const [buyerType, setBuyerType] = useState<'standard' | 'first_time' | 'additional_home'>('first_time');
  const [country, setCountry] = useState<'england_ni' | 'scotland' | 'wales'>('england_ni');

  // SDLT England & NI
  const calculateSDLT = () => {
    let tax = 0;

    if (buyerType === 'first_time') {
      if (propertyPrice <= UK_TAX_CONFIG.sdlt.firstTimeBuyerMaxPrice) {
        // First time buyer relief: 0% up to £425,000, 5% on £425,001 to £625,000
        const taxablePortion = Math.max(0, propertyPrice - UK_TAX_CONFIG.sdlt.firstTimeBuyerNilBand);
        tax = taxablePortion * 0.05;
        return Math.round(tax);
      }
      // If above £625k, first-time buyer relief is lost completely, standard rates apply
    }

    // Standard Residential SDLT
    // 0% up to £250,000
    // 5% £250,001 to £925,000
    // 10% £925,001 to £1,500,000
    // 12% over £1,500,000
    if (propertyPrice > 250000) {
      const band1 = Math.min(propertyPrice, 925000) - 250000;
      tax += band1 * 0.05;
    }
    if (propertyPrice > 925000) {
      const band2 = Math.min(propertyPrice, 1500000) - 925000;
      tax += band2 * 0.10;
    }
    if (propertyPrice > 1500000) {
      const band3 = propertyPrice - 1500000;
      tax += band3 * 0.12;
    }

    // Additional Property Surcharge (+5%)
    if (buyerType === 'additional_home') {
      tax += propertyPrice * UK_TAX_CONFIG.sdlt.additionalPropertySurcharge;
    }

    return Math.round(tax);
  };

  const calculatedTax = calculateSDLT();
  const effectiveRate = propertyPrice > 0 ? (calculatedTax / propertyPrice) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Home className="w-3.5 h-3.5" />
            UK Property Taxation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Stamp Duty Land Tax (SDLT) Calculator
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Calculate your exact Stamp Duty in England &amp; Northern Ireland (SDLT), including First-Time Buyer relief 
            (0% up to £425,000 on homes up to £625,000) and the 5% Additional Property / Second Home surcharge.
          </p>
        </div>
      </div>

      <UkDisclaimer 
        customSourceUrl="https://www.gov.uk/stamp-duty-land-tax"
        customSourceLabel="GOV.UK Stamp Duty Land Tax Guidance"
        notes="Calculates tiered residential SDLT rates for England and Northern Ireland. Scottish LBTT and Welsh LTT thresholds are distinct."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Property Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Agreed Purchase Price
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">£</span>
              <input
                type="number"
                step="5000"
                min="0"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold text-base"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[250000, 350000, 450000, 600000, 850000].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPropertyPrice(p)}
                  className="px-2 py-1 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  £{(p / 1000)}k
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Buyer Category
            </label>
            <div className="space-y-2 text-xs">
              {[
                { id: 'first_time', title: 'First-Time Buyer', desc: '0% up to £425k if property is ≤£625,000' },
                { id: 'standard', title: 'Moving Home / Next Primary Residence', desc: 'Standard residential SDLT rates apply' },
                { id: 'additional_home', title: 'Second Home / Buy-to-Let', desc: '+5% surcharge across all price tiers' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBuyerType(opt.id as any)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    buyerType === opt.id
                      ? "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="font-bold text-slate-900 dark:text-white">{opt.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">
              Total Stamp Duty Due
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight">
              £{calculatedTax.toLocaleString()}
            </div>
            <div className="pt-2 border-t border-indigo-500/40 text-xs text-indigo-100 flex justify-between">
              <span>Effective Stamp Duty Rate:</span>
              <span className="font-bold font-mono">{effectiveRate.toFixed(2)}%</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
              Transaction Breakdown
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Agreed Property Value</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">£{propertyPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-500">
                <span>Relief Applied</span>
                <span className="font-medium text-emerald-600">
                  {buyerType === 'first_time' && propertyPrice <= 625000 ? "First-Time Buyer Relief (0% up to £425k)" : "None"}
                </span>
              </div>
              <div className="flex justify-between py-1 text-rose-600">
                <span>Stamp Duty (SDLT)</span>
                <span className="font-mono font-bold">£{calculatedTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-slate-200 dark:border-slate-800 font-extrabold text-sm">
                <span className="text-slate-900 dark:text-white">Total Required for Purchase</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  £{(propertyPrice + calculatedTax).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
