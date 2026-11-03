import React from 'react';
import { BookOpen, ArrowUp, BarChart3, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  return (
    <div className="border border-zinc-800 bg-black p-6 font-mono space-y-8 max-w-5xl mx-auto">
      {/* Doc Header */}
      <div className="border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-white text-black font-bold text-xs tracking-wider">
            TECHNICAL MANUAL & SYSTEM ARCHITECTURE
          </span>
          <span className="text-xs text-zinc-400">UK QUANT PROTOCOL</span>
        </div>
        <h1 className="text-xl font-extrabold text-white mt-2">
          THE ARROW PRICE-HEIGHT & VOLUME-WIDTH PARADIGM
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Standard Japanese candlesticks were invented in 18th-century Japan for rice trading. They have one fatal flaw: they conceal volume inside identical-width boxes. Here is how our modern vector engine replaces them.
        </p>
      </div>

      {/* Chapter 1: The Core Formula */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <span className="px-1.5 py-0.2 bg-zinc-800 text-white text-xs">01</span>
          <h3>THE TWO-AXIS VECTOR FORMULA</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-white font-bold flex items-center gap-2 mb-2">
              <span className="text-xl">▲</span>
              <span>1. ARROW HEIGHT = PRICE TRAVEL (ΔP)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              The vertical distance from the arrow base to the arrowhead exactly maps the net distance buyers or sellers drove the asset.
            </p>
            <div className="border border-zinc-900 bg-black p-2.5 text-[11px] text-zinc-300">
              <code>Height = (|Close - Open| / Base Volatility) × Scaling Factor</code>
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-white font-bold flex items-center gap-2 mb-2">
              <span className="text-xl">━</span>
              <span>2. ARROW WIDTH = ORDERBOOK VOLUME (V)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              The stem thickness and arrowhead width grow dynamically when institutional whales, hedge funds, or banks flood the market.
            </p>
            <div className="border border-zinc-900 bg-black p-2.5 text-[11px] text-zinc-300">
              <code>Width = (Bar Volume / 20-Period Volume EMA) × 8px</code>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: Visual Comparison Table */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <span className="px-1.5 py-0.2 bg-zinc-800 text-white text-xs">02</span>
          <h3>HOW TO READ ARROWS IN REAL TIME</h3>
        </div>

        <div className="border border-zinc-800 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950 text-[10px] text-zinc-500 uppercase">
                <th className="py-2.5 px-3">ARROW APPEARANCE</th>
                <th className="py-2.5 px-3">MARKET MEANING</th>
                <th className="py-2.5 px-3">INSTITUTIONAL ACTION</th>
                <th className="py-2.5 px-3">RECOMMENDED STRATEGY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              <tr>
                <td className="py-3 px-3 font-bold text-white">Thin & Tall Arrow</td>
                <td className="py-3 px-3 text-zinc-300">Large price jump with low volume (Vacuum move)</td>
                <td className="py-3 px-3 text-zinc-400">Retail FOMO or stop-hunt run</td>
                <td className="py-3 px-3 text-white font-semibold">Do not chase; expect mean-reversion</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-white">FAT & Tall White Arrow (▲)</td>
                <td className="py-3 px-3 text-zinc-300">Massive price jump backed by billions in cash</td>
                <td className="py-3 px-3 text-white">Aggressive Institutional Breakout</td>
                <td className="py-3 px-3 text-white font-bold">BUY / Follow Trend with tight SL</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-white">FAT Downward Hollow Arrow (▼)</td>
                <td className="py-3 px-3 text-zinc-300">Violent institutional selloff / liquidation</td>
                <td className="py-3 px-3 text-zinc-300">Whale Distribution & Capitulation</td>
                <td className="py-3 px-3 text-white font-bold">SELL / SHORT or step aside</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-white">⚡ Lightning Badge Spike</td>
                <td className="py-3 px-3 text-zinc-300">Volume &gt; 2.5× the 20-period moving average</td>
                <td className="py-3 px-3 text-white">Block order / dark pool trade executed</td>
                <td className="py-3 px-3 text-white font-bold">Signals instant market direction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Chapter 3: Plain English Fundamentals */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <span className="px-1.5 py-0.2 bg-zinc-800 text-white text-xs">03</span>
          <h3>THE JARGON-FREE FUNDAMENTALS ENGINE</h3>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Traditional finance analysts deliberately confuse retail investors with terms like "Discounted Cash Flow", "EBITDA margin", and "MVRV Z-Score". Our algorithms automatically translate these into 4 elementary questions:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="border border-zinc-900 bg-zinc-950 p-3">
            <span className="text-white font-bold block mb-1">1. Can they go broke? (Debt Safety)</span>
            <p className="text-zinc-400">
              Computes total liquid cash against all debts due in 12 months. If cash &gt; debt, bankruptcy risk is near 0%.
            </p>
          </div>
          <div className="border border-zinc-900 bg-zinc-950 p-3">
            <span className="text-white font-bold block mb-1">2. Am I buying cheap? (Bargain Rating)</span>
            <p className="text-zinc-400">
              Compares today’s price against the 5-year median mathematical cost curve to give a clean "ON SALE" or "OVERPRICED" rating.
            </p>
          </div>
          <div className="border border-zinc-900 bg-zinc-950 p-3">
            <span className="text-white font-bold block mb-1">3. How fast are they expanding? (Growth Speed)</span>
            <p className="text-zinc-400">
              Measures real user growth, hashrate, or annual net sales acceleration.
            </p>
          </div>
          <div className="border border-zinc-900 bg-zinc-950 p-3">
            <span className="text-white font-bold block mb-1">4. Crisis Shield Rating (Defense)</span>
            <p className="text-zinc-400">
              Measures how well the asset protects your purchasing power during inflation spikes or geopolitical tensions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
