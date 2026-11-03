import React, { useState } from 'react';
import { Asset } from '../types';
import { Calculator, ShieldCheck, AlertCircle, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  selectedAsset: Asset;
}

export const RiskCalculator: React.FC<Props> = ({ selectedAsset }) => {
  const [balance, setBalance] = useState<number>(1000);
  const [riskPercent, setRiskPercent] = useState<number>(2); // 2% risk
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY');

  // Realistic SL and TP distance based on asset volatility
  const stopLossDistance = selectedAsset.price * 0.008; // 0.8% typical stop
  const tp1Distance = stopLossDistance * 2; // 1:2
  const tp2Distance = stopLossDistance * 3; // 1:3

  const entryPrice = selectedAsset.price;
  const stopLossPrice = direction === 'BUY' ? entryPrice - stopLossDistance : entryPrice + stopLossDistance;
  const tp1Price = direction === 'BUY' ? entryPrice + tp1Distance : entryPrice - tp1Distance;
  const tp2Price = direction === 'BUY' ? entryPrice + tp2Distance : entryPrice - tp2Distance;

  // Max cash loss allowed
  const cashRisk = (balance * riskPercent) / 100;

  // Position sizing math
  // For FX/Commodities/Crypto: Position Units = CashRisk / StopLossDistance
  const units = cashRisk / (stopLossDistance || 1);
  const lots = +(units / 100000).toFixed(2); // standard forex lot is 100,000 units

  // Potential profit
  const tp1Profit = cashRisk * 2;
  const tp2Profit = cashRisk * 3;

  // Consecutive losses to blow up
  const consecutiveLosses = Math.floor(balance / (cashRisk || 1));

  return (
    <div className="border border-zinc-800 bg-black p-4 font-mono space-y-4">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white text-black font-bold text-xs tracking-wider flex items-center gap-1">
              <Calculator size={13} />
              <span>PLAIN-ENGLISH "NEVER BLOW UP" CALCULATOR</span>
            </span>
            <span className="text-xs text-zinc-400">MONEY MANAGEMENT</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Never guess your position size again. Tell us your account balance and how much you can afford to lose; we tell you the exact lot size.
          </p>
        </div>

        <div className="text-xs text-zinc-300 border border-zinc-800 bg-zinc-950 px-3 py-1 flex items-center gap-2">
          <span className="text-zinc-500">ASSET:</span>
          <strong className="text-white">{selectedAsset.symbol}</strong>
          <span className="text-zinc-400">(${selectedAsset.price.toLocaleString()})</span>
        </div>
      </div>

      {/* Two-Column Layout: Inputs & Plain English Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Simple Inputs */}
        <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-4">
          <span className="text-xs font-bold text-white block uppercase tracking-wider">
            STEP 1: ENTER YOUR NUMBERS
          </span>

          {/* Account Balance */}
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">
              YOUR TOTAL ACCOUNT BALANCE (£):
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2 text-zinc-400 font-bold">£</span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={balance}
                  onChange={(e) => setBalance(Math.max(10, +e.target.value))}
                  className="w-full bg-black border border-zinc-700 pl-7 pr-3 py-1.5 text-sm font-bold text-white focus:border-white focus:outline-none"
                />
              </div>
              <div className="flex gap-1">
                {[500, 1000, 2500, 10000].map((quickB) => (
                  <button
                    key={quickB}
                    onClick={() => {
                      sound.playClick();
                      setBalance(quickB);
                    }}
                    className={`px-2 py-1 text-[10px] border transition-colors ${
                      balance === quickB ? 'border-white bg-white text-black font-bold' : 'border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    £{quickB >= 1000 ? `${quickB / 1000}k` : quickB}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Max Risk Percentage */}
          <div>
            <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
              <span>MAX LOSS IF TRADE IS WRONG:</span>
              <strong className="text-white">£{cashRisk.toFixed(2)} ({riskPercent}%)</strong>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { pct: 1, label: '1% (Ultra Safe)' },
                { pct: 2, label: '2% (Recommended)' },
                { pct: 3, label: '3% (Aggressive)' },
                { pct: 5, label: '5% (High Risk)' },
              ].map((r) => (
                <button
                  key={r.pct}
                  onClick={() => {
                    sound.playClick();
                    setRiskPercent(r.pct);
                  }}
                  className={`p-2 text-center border text-xs transition-colors ${
                    riskPercent === r.pct
                      ? 'border-white bg-white text-black font-extrabold shadow-[0_0_8px_rgba(255,255,255,0.2)]'
                      : 'border-zinc-800 bg-black text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{r.pct}%</div>
                  <div className="text-[9px] truncate opacity-75">{r.label.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Trade Direction */}
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">TRADE DIRECTION:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setDirection('BUY');
                }}
                className={`py-2 px-3 border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  direction === 'BUY'
                    ? 'border-white bg-white text-black shadow-[0_0_8px_rgba(255,255,255,0.2)]'
                    : 'border-zinc-800 bg-black text-zinc-400 hover:text-white'
                }`}
              >
                <ArrowUpRight size={14} />
                <span>BUY / LONG</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setDirection('SELL');
                }}
                className={`py-2 px-3 border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  direction === 'SELL'
                    ? 'border-white bg-white text-black shadow-[0_0_8px_rgba(255,255,255,0.2)]'
                    : 'border-zinc-800 bg-black text-zinc-400 hover:text-white'
                }`}
              >
                <ArrowDownRight size={14} />
                <span>SELL / SHORT</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Plain English Results */}
        <div className="border border-white bg-zinc-950 p-4 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-white" />
                <span>STEP 2: EXACT ORDER EXECUTION</span>
              </span>
              <span className="text-[10px] bg-white text-black px-1.5 py-0.2 font-bold">
                100% MATHEMATICAL SAFETY
              </span>
            </div>

            {/* Exact Recommended Lot Size Box */}
            <div className="border border-zinc-800 bg-black p-3 mb-3 text-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                ENTER THIS EXACT LOT SIZE IN METATRADER / BROKER:
              </span>
              <div className="text-3xl font-extrabold text-white my-1 font-mono tracking-wider">
                {lots < 0.01 ? '0.01 (Micro)' : `${lots} Lots`}
              </div>
              <span className="text-[11px] text-zinc-400">
                (Equivalent to {Math.round(units).toLocaleString()} base units of {selectedAsset.symbol})
              </span>
            </div>

            {/* Plain English Outcome Scenarios */}
            <div className="space-y-2 text-xs">
              {/* Worst Case (Stop Loss) */}
              <div className="border-l-2 border-zinc-500 bg-black p-2.5">
                <div className="flex justify-between font-bold text-white mb-0.5">
                  <span>IF STOP LOSS IS HIT @ ${stopLossPrice.toFixed(selectedAsset.price < 10 ? 4 : 2)}:</span>
                  <span className="text-zinc-300">-£{cashRisk.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  You lose exactly <strong>£{cashRisk.toFixed(2)}</strong>. You will still have <strong>£{(balance - cashRisk).toFixed(2)}</strong> left in your bank.
                </p>
              </div>

              {/* Best Case 1 (TP1) */}
              <div className="border-l-2 border-white bg-black p-2.5">
                <div className="flex justify-between font-bold text-white mb-0.5">
                  <span>IF TARGET 1 IS HIT @ ${tp1Price.toFixed(selectedAsset.price < 10 ? 4 : 2)} (1:2 R:R):</span>
                  <span className="text-white">+£{tp1Profit.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  You pocket <strong>+£{tp1Profit.toFixed(2)} pure profit</strong>.
                </p>
              </div>

              {/* Best Case 2 (TP2) */}
              <div className="border-l-2 border-white bg-black p-2.5">
                <div className="flex justify-between font-bold text-white mb-0.5">
                  <span>IF TARGET 2 IS HIT @ ${tp2Price.toFixed(selectedAsset.price < 10 ? 4 : 2)} (1:3 R:R):</span>
                  <span className="text-white">+£{tp2Profit.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  You pocket <strong>+£{tp2Profit.toFixed(2)} pure profit</strong> (triples your risk).
                </p>
              </div>
            </div>
          </div>

          {/* Bankruptcy Shield Golden Rule */}
          <div className="border border-zinc-800 bg-black p-2.5 text-[11px] text-zinc-300 flex items-center gap-2">
            <ShieldCheck size={16} className="text-white flex-shrink-0" />
            <span>
              <strong>Bankruptcy Protection:</strong> With this exact size, you would have to lose <strong className="text-white">{consecutiveLosses} trades consecutively</strong> to lose your account.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
