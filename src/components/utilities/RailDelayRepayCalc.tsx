import React, { useState } from "react";
import { 
  Train, 
  Plane, 
  PoundSterling, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight 
} from "lucide-react";
import { UkDisclaimer } from "../common/UkDisclaimer";

export function RailDelayRepayCalc() {
  const [mode, setMode] = useState<'rail' | 'flight'>('rail');

  // Rail State
  const [ticketCost, setTicketCost] = useState(64.50);
  const [ticketType, setTicketType] = useState<'single' | 'return'>('return');
  const [delayMinutes, setDelayMinutes] = useState(45);

  // Flight State (UK261)
  const [flightDelayHours, setFlightDelayHours] = useState(3.5);
  const [flightDistanceKm, setFlightDistanceKm] = useState(1800);

  // Rail Delay Repay Calculation (National Rail Standards)
  const calculateRailCompensation = () => {
    let refundPercentage = 0;

    if (delayMinutes >= 120) {
      refundPercentage = 100; // 100% of single or return
    } else if (delayMinutes >= 60) {
      refundPercentage = ticketType === 'return' ? 50 : 100; // 100% of single or 50% of return (equivalent to full single leg)
    } else if (delayMinutes >= 30) {
      refundPercentage = ticketType === 'return' ? 25 : 50;
    } else if (delayMinutes >= 15) {
      refundPercentage = ticketType === 'return' ? 12.5 : 25; // Delay Repay 15
    }

    const payout = (ticketCost * refundPercentage) / 100;
    return { refundPercentage, payout };
  };

  // Flight UK261 Compensation
  const calculateFlightCompensation = () => {
    if (flightDelayHours < 3) return 0;
    if (flightDistanceKm <= 1500) return 220;
    if (flightDistanceKm <= 3500) return 350;
    return 520;
  };

  const railResult = calculateRailCompensation();
  const flightResult = calculateFlightCompensation();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <Train className="w-3.5 h-3.5" />
            Passenger Rights &amp; Statutory Compensation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Train Delay Repay &amp; UK261 Flight Delay Checker
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Don't leave passenger compensation on the table. Calculate your legal entitlement under 
            <strong>National Rail Delay Repay</strong> (15m, 30m, 60m, 120m+ tiers) and the <strong>UK261 Statutory Flight Delay</strong> framework 
            (up to £520 per passenger).
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => setMode('rail')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'rail' ? "bg-white text-slate-950 shadow-md" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              National Rail Delay Repay
            </button>
            <button
              onClick={() => setMode('flight')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'flight' ? "bg-white text-slate-950 shadow-md" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              UK261 Airline Delay (£220 - £520)
            </button>
          </div>
        </div>
      </div>

      <UkDisclaimer 
        customSourceUrl={mode === 'rail' ? "https://www.nationalrail.co.uk/compensation" : "https://www.caa.co.uk/passengers/resolving-travel-problems/delays-and-cancellations/"}
        customSourceLabel={mode === 'rail' ? "National Rail Conditions of Travel" : "Civil Aviation Authority (CAA) UK261 Guidance"}
        notes="Under UK law, train compensation must be claimed within 28 days of travel. Flight delays have a 6-year statutory limitation period."
      />

      {mode === 'rail' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Journey Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Ticket Price Paid
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">£</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={ticketCost}
                  onChange={(e) => setTicketCost(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Ticket Type
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTicketType('single')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    ticketType === 'single' ? "border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-200 font-bold" : "border-slate-200 dark:border-slate-800 text-slate-600"
                  }`}
                >
                  Single Journey
                </button>
                <button
                  type="button"
                  onClick={() => setTicketType('return')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    ticketType === 'return' ? "border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-200 font-bold" : "border-slate-200 dark:border-slate-800 text-slate-600"
                  }`}
                >
                  Return Journey
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Delay at Final Destination
                </label>
                <span className="text-xs font-mono font-bold text-sky-600">{delayMinutes} mins</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>15 mins</span>
                <span>30 mins</span>
                <span>60 mins</span>
                <span>120+ mins</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-gradient-to-br from-sky-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-100">
                Statutory Compensation Due
              </span>
              <div className="text-4xl sm:text-5xl font-black tracking-tight">
                £{railResult.payout.toFixed(2)}
              </div>
              <span className="text-xs text-sky-100 block">
                {railResult.refundPercentage}% refund of your {ticketType} ticket under Delay Repay rules.
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white">How to claim:</span>
              <p leading-relaxed>
                Submit your claim via your train operator's website (LNER, Avanti, GWR, Southern, Thameslink) within <strong>28 days</strong> of your journey. Keep your physical ticket or PDF e-ticket booking reference. Payment can be claimed directly to your bank account or debit card.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Flight Delay Details (UK261)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Delay at Destination Airport (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={flightDelayHours}
                onChange={(e) => setFlightDelayHours(Number(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold text-sm"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Must be at least 3 hours upon arrival gate opening.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Flight Distance
              </label>
              <select
                value={flightDistanceKm <= 1500 ? 1500 : flightDistanceKm <= 3500 ? 3500 : 4000}
                onChange={(e) => setFlightDistanceKm(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs"
              >
                <option value={1500}>Short Haul (&le; 1,500 km, e.g. London to Paris/Amsterdam)</option>
                <option value={3500}>Medium Haul (1,500 - 3,500 km, e.g. London to Athens/Canaries)</option>
                <option value={4000}>Long Haul (&gt; 3,500 km, e.g. London to New York/Dubai)</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">
                UK261 Statutory Compensation per Passenger
              </span>
              <div className="text-4xl sm:text-5xl font-black tracking-tight">
                £{flightResult}
              </div>
              <span className="text-xs text-indigo-100 block">
                {flightResult > 0 ? "Fixed statutory sum owed per ticket under UK law." : "No compensation due if delay is under 3 hours."}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white">UK261 Eligibility Rules:</span>
              <p leading-relaxed>
                Applies to any flight departing from a UK airport, or arriving into the UK on a UK or EU carrier. 
                Airlines cannot evade payout for ordinary technical faults or crew scheduling shortages. 
                Only genuine "extraordinary circumstances" (severe volcanic ash, ATC total airspace closure) exempt payout.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
