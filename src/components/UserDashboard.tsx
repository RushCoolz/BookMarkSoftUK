import React, { useState } from 'react';
import { UserProfile, HistoricalSignal, Asset } from '../types';
import { User, ShieldCheck, CheckCircle2, TrendingUp, Filter, ArrowUpRight, ArrowDownRight, ArrowRight, History, Calendar, BookmarkPlus } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  user: UserProfile | null;
  historicalSignals: HistoricalSignal[];
  onOpenAuth: () => void;
  onSelectAsset: (asset: Asset) => void;
  onNavigateToJournal: () => void;
  onNavigateToChart: () => void;
  assets: Asset[];
}

export const UserDashboard: React.FC<Props> = ({
  user,
  historicalSignals,
  onOpenAuth,
  onSelectAsset,
  onNavigateToJournal,
  onNavigateToChart,
  assets,
}) => {
  const [filterResult, setFilterResult] = useState<string>('ALL');

  const filteredSignals = historicalSignals.filter((s) => {
    if (filterResult === 'ALL') return true;
    if (filterResult === 'WINNERS') return s.result === 'TP1_HIT' || s.result === 'TP2_HIT';
    if (filterResult === 'LOSSES') return s.result === 'SL_HIT';
    if (filterResult === 'BREAKEVEN') return s.result === 'BREAKEVEN';
    return true;
  });

  // Calculate desk stats
  const total = historicalSignals.length;
  const wins = historicalSignals.filter((s) => s.result === 'TP1_HIT' || s.result === 'TP2_HIT').length;
  const deskWinRate = ((wins / total) * 100).toFixed(1);

  return (
    <div className="border border-zinc-800 bg-black p-4 font-mono space-y-6">
      {/* Top Profile Summary Header */}
      <div className="border-b border-zinc-800 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white text-black font-bold text-xs tracking-wider flex items-center gap-1">
              <User size={13} />
              <span>TRADER CONTROL DASHBOARD</span>
            </span>
            <span className="text-xs text-zinc-400">DESK SIGNALS ARCHIVE</span>
          </div>
          <h2 className="text-base font-extrabold text-white mt-1">
            ACCOUNT PROFILE & HISTORICAL DESK SIGNALS
          </h2>
        </div>

        {user ? (
          <div className="flex items-center gap-3 text-xs">
            <div className="border border-zinc-800 bg-zinc-950 px-3 py-1 text-right">
              <span className="text-[10px] text-zinc-500 block">AUTHENTICATED TRADER</span>
              <span className="text-white font-bold">{user.username}</span>
            </div>
            <span className="border border-white bg-white text-black font-extrabold px-2.5 py-1 text-xs">
              {user.plan}
            </span>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="border-2 border-white bg-white text-black font-extrabold px-3 py-1.5 text-xs hover:bg-zinc-200 transition-colors shadow-[0_0_12px_rgba(255,255,255,0.2)]"
          >
            LOG IN / CREATE ACCOUNT →
          </button>
        )}
      </div>

      {/* Account & Desk Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="border border-zinc-900 bg-zinc-950 p-3">
          <span className="text-[10px] text-zinc-500 block">DESK WIN RATE (HISTORICAL)</span>
          <span className="text-white font-extrabold text-base">{deskWinRate}% Verified</span>
        </div>
        <div className="border border-zinc-900 bg-zinc-950 p-3">
          <span className="text-[10px] text-zinc-500 block">AVERAGE RISK/REWARD</span>
          <span className="text-white font-extrabold text-base">1 : 3.12 R:R</span>
        </div>
        <div className="border border-zinc-900 bg-zinc-950 p-3">
          <span className="text-[10px] text-zinc-500 block">DELIVERY CHANNEL</span>
          <span className="text-white font-extrabold text-base">WhatsApp & SMS Direct</span>
        </div>
        <div className="border border-zinc-900 bg-zinc-950 p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 block">PERSONAL JOURNAL</span>
          <button
            onClick={onNavigateToJournal}
            className="text-left font-bold text-white hover:underline flex items-center gap-1 text-xs"
          >
            <span>OPEN MY JOURNAL →</span>
          </button>
        </div>
      </div>

      {/* HISTORICAL SIGNALS ARCHIVE TABLE */}
      <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <History size={14} className="text-white" />
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                TRANSPARENT DESK SIGNALS ARCHIVE ({historicalSignals.length} AUDITED TRADES)
              </h3>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Every alert published to our WhatsApp and SMS subscribers is permanently archived here with zero deletion or altered records.
            </p>
          </div>

          {/* Outcome Filter */}
          <div className="flex border border-zinc-800 bg-black text-xs">
            {[
              { id: 'ALL', label: 'ALL SIGNALS' },
              { id: 'WINNERS', label: '✔ TARGETS HIT' },
              { id: 'BREAKEVEN', label: '0.0R BREAKEVEN' },
              { id: 'LOSSES', label: '✖ STOPPED OUT' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sound.playClick();
                  setFilterResult(f.id);
                }}
                className={`px-2.5 py-1 text-[11px] transition-colors ${
                  filterResult === f.id
                    ? 'border-white bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Signals Table */}
        <div className="overflow-x-auto border border-zinc-900">
          <table className="w-full text-xs text-left border-collapse min-w-[780px]">
            <thead>
              <tr className="border-b border-zinc-800 bg-black text-[10px] text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">DATE / TIME</th>
                <th className="py-2.5 px-3">INSTRUMENT</th>
                <th className="py-2.5 px-2">SIDE</th>
                <th className="py-2.5 px-3">ENTRY ➔ EXIT</th>
                <th className="py-2.5 px-3">RESULT</th>
                <th className="py-2.5 px-3">GAIN / LOSS</th>
                <th className="py-2.5 px-4 min-w-[260px]">ARROW SETUP REASONING</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredSignals.map((signal) => {
                const isTp2 = signal.result === 'TP2_HIT';
                const isTp1 = signal.result === 'TP1_HIT';
                const isSL = signal.result === 'SL_HIT';
                const isBE = signal.result === 'BREAKEVEN';

                return (
                  <tr key={signal.id} className="hover:bg-black/60 transition-colors">
                    {/* Date / Time */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-white">{signal.date}</div>
                      <div className="text-[10px] text-zinc-500">{signal.timeUTC}</div>
                    </td>

                    {/* Symbol */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-extrabold text-white text-xs">{signal.symbol}</span>
                      <span className="text-[10px] text-zinc-400 block border border-zinc-800 px-1 mt-0.5 inline-block">
                        {signal.timeframe}
                      </span>
                    </td>

                    {/* Side */}
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 font-bold ${
                          signal.direction === 'BUY'
                            ? 'bg-white text-black'
                            : 'border border-zinc-700 text-white'
                        }`}
                      >
                        {signal.direction}
                      </span>
                    </td>

                    {/* Entry to Exit */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-zinc-300">
                      ${signal.entryPrice} ➔ ${signal.exitPrice}
                    </td>

                    {/* Result Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] px-2 py-0.5 font-bold border tracking-wider uppercase ${
                          isTp2 || isTp1
                            ? 'border-white bg-white text-black'
                            : isBE
                            ? 'border-zinc-500 text-zinc-300 bg-zinc-900'
                            : 'border-zinc-700 text-zinc-400 bg-black'
                        }`}
                      >
                        {signal.result.replace('_', ' ')}
                      </span>
                    </td>

                    {/* PnL R */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`font-bold text-xs ${
                          isTp2 || isTp1
                            ? 'text-white'
                            : isSL
                            ? 'text-zinc-500'
                            : 'text-zinc-400'
                        }`}
                      >
                        {signal.pnlR} ({signal.returnPct})
                      </span>
                    </td>

                    {/* Setup Reasoning */}
                    <td className="py-3 px-4 text-xs leading-relaxed">
                      <div className="font-bold text-white text-[11px] mb-0.5">
                        {signal.arrowPattern}
                      </div>
                      <p className="text-zinc-400 text-[11px]">
                        "{signal.plainSummary}"
                      </p>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          sound.playClick();
                          const found = assets.find((a) => a.symbol === signal.symbol) || assets[0];
                          onSelectAsset(found);
                          onNavigateToChart();
                        }}
                        className="border border-zinc-800 hover:border-white px-2 py-1 text-[10px] font-bold text-zinc-300 hover:text-white transition-colors inline-flex items-center gap-1"
                      >
                        <span>CHART</span>
                        <ArrowRight size={10} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
