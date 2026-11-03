import React from 'react';
import { FundamentalGauge, Asset } from '../types';
import { ShieldCheck, TrendingUp, AlertTriangle, HelpCircle } from 'lucide-react';

interface Props {
  gauges: FundamentalGauge[];
  selectedAsset: Asset;
}

export const SimpleFundamentals: React.FC<Props> = ({ gauges, selectedAsset }) => {
  return (
    <div className="border border-zinc-800 bg-black p-4 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white text-black font-bold text-xs tracking-wider">
              PLAIN-ENGLISH FUNDAMENTALS
            </span>
            <span className="text-xs text-zinc-400">NO FINANCE DEGREE NEEDED</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            We stripped out confusing Wall Street math. Here is the raw truth about <strong className="text-white">{selectedAsset.name} ({selectedAsset.symbol})</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">OVERALL STATUS:</span>
          <span className="border border-white px-2 py-0.5 font-bold text-white tracking-widest bg-zinc-900">
            {selectedAsset.simpleValuation}
          </span>
        </div>
      </div>

      {/* Visual Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {gauges.map((gauge) => {
          // Circular SVG Gauge values
          const radius = 38;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (gauge.score / 100) * circumference;

          return (
            <div
              key={gauge.id}
              className="border border-zinc-800 bg-zinc-950/60 p-3.5 flex flex-col justify-between hover:border-zinc-600 transition-colors"
            >
              <div>
                {/* Metric Title and Plain Label */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">
                      {gauge.category}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {gauge.simpleTitle}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 border font-bold uppercase tracking-wider ${
                      gauge.status === 'VERY SAFE' || gauge.status === 'ON SALE'
                        ? 'border-white text-white bg-zinc-900'
                        : gauge.status === 'FAIR'
                        ? 'border-zinc-500 text-zinc-300'
                        : 'border-zinc-700 text-zinc-400 bg-zinc-950'
                    }`}
                  >
                    {gauge.status}
                  </span>
                </div>

                {/* Circular Gauge and Score */}
                <div className="flex items-center gap-4 my-3">
                  <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      {/* Background Ring */}
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="#27272a"
                        strokeWidth="7"
                        fill="transparent"
                      />
                      {/* Active Progress Ring */}
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="#ffffff"
                        strokeWidth="7"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="square"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-base font-extrabold text-white">{gauge.score}</span>
                      <span className="text-[9px] text-zinc-400">/ 100</span>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="text-xs text-zinc-300 border-l border-zinc-800 pl-3 leading-snug">
                    <p className="font-medium text-white mb-1">
                      {gauge.simpleSummary}
                    </p>
                    <span className="text-[10px] text-zinc-500 italic block">
                      (Wall St calls this: "{gauge.jargonEquivalent}")
                    </span>
                  </div>
                </div>
              </div>

              {/* Mini breakdown table */}
              <div className="mt-3 pt-2 border-t border-zinc-900 text-[11px] space-y-1">
                {gauge.ratioBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-zinc-400">
                    <span>{item.label}:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{item.value}</span>
                      <span className="text-[10px] text-zinc-500">[{item.safeBench}]</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Plain Language Master Comparison Table */}
      <div className="border border-zinc-800 bg-zinc-950 p-3">
        <div className="text-xs font-bold text-white mb-2 flex items-center gap-2">
          <span>[ELEMENTARY SUMMARY CHEATSHEET]</span>
          <span className="text-[10px] text-zinc-500 font-normal">What you should tell your grandmother</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 uppercase">
                <th className="py-1.5 px-2">QUESTION</th>
                <th className="py-1.5 px-2">EASY ANSWER</th>
                <th className="py-1.5 px-2">VERDICT</th>
                <th className="py-1.5 px-2">SAFETY SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              <tr>
                <td className="py-2 px-2 text-zinc-400 font-semibold">Can they go bankrupt tomorrow?</td>
                <td className="py-2 px-2 text-white">No. Zero debt leverage and mountain of unencumbered reserves.</td>
                <td className="py-2 px-2">
                  <span className="text-white border border-white px-1.5 py-0.5 text-[10px]">BULLETPROOF</span>
                </td>
                <td className="py-2 px-2 font-bold text-white">99% Safe</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-zinc-400 font-semibold">Am I buying cheap or overpaying?</td>
                <td className="py-2 px-2 text-white">Trading roughly 25% below mathematical fair cost curve.</td>
                <td className="py-2 px-2">
                  <span className="text-white border border-zinc-400 px-1.5 py-0.5 text-[10px]">BARGAIN</span>
                </td>
                <td className="py-2 px-2 font-bold text-white">82% Value</td>
              </tr>
              <tr>
                <td className="py-2 px-2 text-zinc-400 font-semibold">Are big institutions saving or dumping?</td>
                <td className="py-2 px-2 text-white">ETFs and pension funds are absorbing over $600M net each week.</td>
                <td className="py-2 px-2">
                  <span className="text-white border border-white px-1.5 py-0.5 text-[10px]">ACCUMULATION</span>
                </td>
                <td className="py-2 px-2 font-bold text-white">91% Inflow</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
