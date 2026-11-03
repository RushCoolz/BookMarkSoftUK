import React from 'react';
import { NewsForecastItem } from '../types';
import { Calendar, BellRing, ChevronRight, Zap } from 'lucide-react';

interface Props {
  news: NewsForecastItem[];
}

export const NewsForecastTable: React.FC<Props> = ({ news }) => {
  return (
    <div className="border border-zinc-800 bg-black p-4 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white text-black font-bold text-xs tracking-wider">
              ECONOMIC NEWS FORECAST & IMPACT RADAR
            </span>
            <span className="text-xs text-zinc-400">INSTANT TAKEAWAYS</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            White stars (<span className="text-white font-bold">★ ★ ★</span>) show how wildly the price will swing when the report drops.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            <span className="text-white font-bold">★</span>
            <span className="text-[11px] text-zinc-400">Mild</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white font-bold">★★</span>
            <span className="text-[11px] text-zinc-400">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white font-bold">★★★</span>
            <span className="text-[11px] text-zinc-200 font-bold">Market Volcano</span>
          </div>
        </div>
      </div>

      {/* Pre-News High-Impact "IF / THEN" Quick Decision Card */}
      <div className="border-2 border-white bg-zinc-950 p-3.5 mb-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-white text-black font-extrabold px-1.5 py-0.5 uppercase tracking-wider">
              NEXT HIGH-IMPACT RELEASE
            </span>
            <span className="font-bold text-white text-xs">
              UK / BANK OF ENGLAND MONETARY POLICY DECISION
            </span>
          </div>
          <span className="text-xs text-white border border-zinc-700 bg-black px-2 py-0.5 font-bold">
            COUNTDOWN: 1H 45M
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          <div className="border border-zinc-800 bg-black p-2.5">
            <div className="flex items-center gap-1.5 text-white font-bold mb-1">
              <span>▲ IF RATE CUT DELAYED (RATES HIGHER / 4.75%+)</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              <strong className="text-white">ACTION:</strong> BUY British Pound (GBP/USD), SELL FTSE 100 blue chips. Money flows into high-yielding UK gilts.
            </p>
          </div>
          <div className="border border-zinc-800 bg-black p-2.5">
            <div className="flex items-center gap-1.5 text-zinc-300 font-bold mb-1">
              <span>▼ IF RATE CUT ACCELERATES (RATES LOWER / &lt; 4.75%)</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              <strong className="text-white">ACTION:</strong> BUY FTSE 100 stocks & Gold, SELL US Dollar. Cheap liquidity propels risk assets.
            </p>
          </div>
        </div>
      </div>

      {/* News Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 uppercase tracking-wider">
              <th className="py-2 px-3">TIME</th>
              <th className="py-2 px-2">CURRENCY</th>
              <th className="py-2 px-2">IMPACT</th>
              <th className="py-2 px-3">EVENT NAME</th>
              <th className="py-2 px-3 min-w-[190px]">VISUAL FORECAST VS ACTUAL</th>
              <th className="py-2 px-3">PLAIN-ENGLISH CHEAT RULE</th>
              <th className="py-2 px-2 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {news.map((item) => {
              // Stars string
              const starsStr = Array(item.stars).fill('★').join(' ');
              const isUpcoming = item.status === 'UPCOMING';

              return (
                <tr key={item.id} className="hover:bg-zinc-950/80 transition-colors">
                  {/* Time */}
                  <td className="py-3 px-3 text-white whitespace-nowrap font-medium">
                    {item.time}
                  </td>

                  {/* Currency */}
                  <td className="py-3 px-2">
                    <span className="border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-200">
                      {item.currency}
                    </span>
                  </td>

                  {/* Stars */}
                  <td className="py-3 px-2 whitespace-nowrap">
                    <span className="text-white text-sm font-bold tracking-widest drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]">
                      {starsStr}
                    </span>
                  </td>

                  {/* Event Name */}
                  <td className="py-3 px-3 font-bold text-white max-w-[220px]">
                    {item.eventName}
                  </td>

                  {/* Visual Percentage Comparison Bars */}
                  <td className="py-3 px-3">
                    <div className="space-y-1.5">
                      {/* Previous Bar */}
                      <div>
                        <div className="flex justify-between text-[10px] text-zinc-400 mb-0.5">
                          <span>PREV: {item.previous}</span>
                          <span>{item.previousPct}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 border border-zinc-800">
                          <div
                            className="bg-zinc-500 h-full"
                            style={{ width: `${Math.min(100, item.previousPct)}%` }}
                          />
                        </div>
                      </div>

                      {/* Forecast Bar */}
                      <div>
                        <div className="flex justify-between text-[10px] text-zinc-300 mb-0.5">
                          <span className="font-semibold text-white">FORECAST: {item.forecast}</span>
                          <span>{item.forecastPct}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-2 border border-zinc-700">
                          <div
                            className="bg-white h-full"
                            style={{ width: `${Math.min(100, item.forecastPct)}%` }}
                          />
                        </div>
                      </div>

                      {/* Actual Bar (if available) */}
                      {item.actual && (
                        <div>
                          <div className="flex justify-between text-[10px] font-bold text-white mb-0.5">
                            <span>ACTUAL: {item.actual}</span>
                            <span>{item.actualPct}%</span>
                          </div>
                          <div className="w-full bg-zinc-900 h-2.5 border border-white">
                            <div
                              className="bg-white h-full relative"
                              style={{ width: `${Math.min(100, item.actualPct || 0)}%` }}
                            >
                              <div className="absolute right-0 top-0 bottom-0 w-1 bg-black"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Plain English Impact Rule */}
                  <td className="py-3 px-3 text-xs text-zinc-300 leading-relaxed max-w-[280px]">
                    <div className="border-l-2 border-white pl-2">
                      <span className="font-semibold text-white block text-[11px] mb-0.5">
                        WHAT THIS MEANS:
                      </span>
                      {item.plainImpact}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-2 text-right whitespace-nowrap">
                    {isUpcoming ? (
                      <span className="border border-zinc-700 bg-zinc-950 text-zinc-400 text-[10px] px-2 py-0.5 font-bold uppercase">
                        PENDING
                      </span>
                    ) : item.status === 'RELEASED_BEAT' ? (
                      <span className="border border-white bg-white text-black text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">
                        BEAT FORECAST
                      </span>
                    ) : (
                      <span className="border border-zinc-500 bg-zinc-900 text-zinc-300 text-[10px] px-2 py-0.5 font-bold uppercase">
                        MISSED
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Alert notice */}
      <div className="mt-4 pt-3 border-t border-zinc-900 flex flex-wrap items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-white" />
          <span>
            PRO TIP: 5 minutes before <strong className="text-white">★★★ 3-Star News</strong>, arrow widths typically drop to zero (market freezes) before violently detonating.
          </span>
        </div>
        <div className="text-[11px] text-zinc-500">
          AUTOMATIC SYNC // TIMEZONE LOCALIZED
        </div>
      </div>
    </div>
  );
};
