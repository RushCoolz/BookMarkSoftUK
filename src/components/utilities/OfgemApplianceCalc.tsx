import React, { useState } from "react";
import { 
  Zap, 
  PoundSterling, 
  HelpCircle, 
  Sparkles, 
  Clock, 
  Flame, 
  Layers, 
  Tv, 
  Coffee 
} from "lucide-react";
import { UK_TAX_CONFIG } from "../../config/ukTaxRates";
import { UkDisclaimer } from "../common/UkDisclaimer";

interface Appliance {
  name: string;
  category: string;
  powerWatts: number;
  typicalUsage: string;
  defaultHoursPerDay: number;
}

const APPLIANCES: Appliance[] = [
  { name: "Kettle (Rapid Boil)", category: "Kitchen", powerWatts: 3000, typicalUsage: "10 mins/day", defaultHoursPerDay: 0.17 },
  { name: "Air Fryer", category: "Kitchen", powerWatts: 1800, typicalUsage: "30 mins/day", defaultHoursPerDay: 0.5 },
  { name: "Electric Oven", category: "Kitchen", powerWatts: 2200, typicalUsage: "1 hour/day", defaultHoursPerDay: 1 },
  { name: "Washing Machine (60°C)", category: "Laundry", powerWatts: 2000, typicalUsage: "1 cycle/day", defaultHoursPerDay: 1 },
  { name: "Tumble Dryer (Vented)", category: "Laundry", powerWatts: 2500, typicalUsage: "1 hour/day", defaultHoursPerDay: 1 },
  { name: "Dishwasher (Eco Mode)", category: "Kitchen", powerWatts: 1400, typicalUsage: "2 hours/cycle", defaultHoursPerDay: 2 },
  { name: "Heat Pump (Air Source)", category: "Heating", powerWatts: 2800, typicalUsage: "5 hours/day winter", defaultHoursPerDay: 5 },
  { name: "Electric Shower (9kW)", category: "Bathroom", powerWatts: 9000, typicalUsage: "10 mins/shower", defaultHoursPerDay: 0.17 },
  { name: "EV Home Charger (7kW)", category: "Transport", powerWatts: 7000, typicalUsage: "4 hours overnight", defaultHoursPerDay: 4 },
  { name: "Fridge Freezer (24/7)", category: "Kitchen", powerWatts: 150, typicalUsage: "Continuous compressor", defaultHoursPerDay: 24 },
  { name: "Smart TV (55 inch 4K)", category: "Entertainment", powerWatts: 110, typicalUsage: "4 hours/day", defaultHoursPerDay: 4 },
  { name: "Desktop Gaming PC", category: "Computing", powerWatts: 450, typicalUsage: "3 hours/day", defaultHoursPerDay: 3 },
];

export function OfgemApplianceCalc() {
  const [electricityPence, setElectricityPence] = useState(UK_TAX_CONFIG.ofgemPriceCap.electricityUnitRatePence);
  const [standingChargePence, setStandingChargePence] = useState(UK_TAX_CONFIG.ofgemPriceCap.electricityStandingChargePence);

  const calculateCost = (watts: number, hours: number) => {
    const kwh = (watts * hours) / 1000;
    const costPence = kwh * electricityPence;
    return {
      kwh,
      dailyCostPence: costPence,
      dailyCostPounds: costPence / 100,
      monthlyCostPounds: (costPence * 30) / 100,
      annualCostPounds: (costPence * 365) / 100,
    };
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Zap className="w-3.5 h-3.5" />
            Official Ofgem Price Cap
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ofgem Energy Price Cap &amp; Appliance Running Costs
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Track current UK energy regulator price caps (<code className="text-amber-300">24.5p/kWh</code> electricity, <code className="text-amber-300">6.24p/kWh</code> gas) 
            and see exactly what each household appliance costs per cycle, per month, and per year.
          </p>
        </div>
      </div>

      <UkDisclaimer 
        customSourceUrl="https://www.ofgem.gov.uk/energy-price-cap"
        customSourceLabel="Ofgem Energy Price Cap Statutory Tariff"
        notes="Based on standard default variable tariff rates set under the Domestic Gas and Electricity (Tariff Cap) Act."
      />

      {/* Ofgem Cap Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Electricity Unit Rate</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {electricityPence.toFixed(2)}p <span className="text-xs text-slate-400 font-normal">/ kWh</span>
          </div>
          <span className="text-[11px] text-slate-400">Ofgem SVT Cap</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Standing Charge</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {standingChargePence.toFixed(2)}p <span className="text-xs text-slate-400 font-normal">/ day</span>
          </div>
          <span className="text-[11px] text-slate-400">£{(standingChargePence * 3.65).toFixed(0)}/year fixed cost</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Annual Dual Fuel</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            £{UK_TAX_CONFIG.ofgemPriceCap.annualDualFuelAverage.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Typical domestic consumption (TDCV)</span>
        </div>
      </div>

      {/* Appliance Running Costs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Appliance Running Cost Breakdown (Ranked by Power)
          </h3>
          <span className="text-xs text-slate-500">
            Computed at {electricityPence}p / kWh
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {APPLIANCES.map((app, idx) => {
            const cost = calculateCost(app.powerWatts, app.defaultHoursPerDay);

            return (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      {app.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {app.powerWatts}W • {app.typicalUsage}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {app.category}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-800 text-center font-mono">
                  <div className="p-1 rounded bg-white dark:bg-slate-900">
                    <span className="text-[9px] text-slate-400 block font-sans">Per Use</span>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {cost.dailyCostPounds < 0.10 ? `${cost.dailyCostPence.toFixed(1)}p` : `£${cost.dailyCostPounds.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="p-1 rounded bg-white dark:bg-slate-900">
                    <span className="text-[9px] text-slate-400 block font-sans">Monthly</span>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      £{cost.monthlyCostPounds.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-1 rounded bg-white dark:bg-slate-900">
                    <span className="text-[9px] text-slate-400 block font-sans">Yearly</span>
                    <span className="font-bold text-xs text-amber-600 dark:text-amber-400">
                      £{Math.round(cost.annualCostPounds).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
