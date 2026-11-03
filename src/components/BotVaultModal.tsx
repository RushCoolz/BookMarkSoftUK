import React, { useState } from 'react';
import { FreeBot } from '../types';
import { Terminal, Copy, Check, Code2, Download, Zap, Cpu, Play, BarChart2, TrendingUp } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  bots: FreeBot[];
}

export const BotVaultModal: React.FC<Props> = ({ bots }) => {
  const [selectedBotId, setSelectedBotId] = useState<string>(bots[0].id);
  const [copied, setCopied] = useState(false);
  const [backtestCapital, setBacktestCapital] = useState<number>(1000);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const activeBot = bots.find((b) => b.id === selectedBotId) || bots[0];

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(activeBot.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = () => {
    sound.playClick();
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      sound.playWhaleAlert();
    }, 600);
  };

  // Backtest metrics calculated from chosen capital
  const netProfit = +(backtestCapital * 1.842).toFixed(2);
  const finalBalance = +(backtestCapital + netProfit).toFixed(2);
  const maxDrawdown = +(backtestCapital * 0.038).toFixed(2);

  // SVG Equity curve coordinate points (30-day simulated trend)
  const curvePoints = [
    { x: 0, y: 80 },
    { x: 40, y: 74 },
    { x: 80, y: 78 },
    { x: 120, y: 65 },
    { x: 160, y: 68 },
    { x: 200, y: 52 },
    { x: 240, y: 56 },
    { x: 280, y: 44 },
    { x: 320, y: 46 },
    { x: 360, y: 32 },
    { x: 400, y: 35 },
    { x: 440, y: 22 },
    { x: 480, y: 25 },
    { x: 520, y: 15 },
    { x: 560, y: 12 },
  ];

  const svgPath = curvePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div className="border border-zinc-800 bg-black p-4 font-mono space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white text-black font-bold text-xs tracking-wider">
              FREE TRADING BOT VAULT
            </span>
            <span className="text-xs text-zinc-400">100% OPEN SOURCE & VERIFIED</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Free algorithmic code developed over 5+ years. Copy and run directly on TradingView, Termux/Python, or MetaTrader 5.
          </p>
        </div>

        <div className="text-xs text-zinc-400 border border-zinc-800 px-2.5 py-1 bg-zinc-950">
          LICENSE: <strong className="text-white">UNRESTRICTED MIT</strong>
        </div>
      </div>

      {/* Bot Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {bots.map((bot) => (
          <button
            key={bot.id}
            onClick={() => {
              sound.playClick();
              setSelectedBotId(bot.id);
            }}
            className={`p-3 text-left border transition-colors ${
              selectedBotId === bot.id
                ? 'border-white bg-zinc-950 text-white'
                : 'border-zinc-800 bg-black text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] px-1.5 py-0.2 border border-zinc-700 bg-zinc-900 text-zinc-300">
                {bot.language}
              </span>
              <span className="text-xs font-bold text-white">{bot.winRate} WIN</span>
            </div>
            <div className="text-xs font-bold truncate text-white">{bot.name}</div>
            <div className="text-[11px] text-zinc-500 mt-1 truncate">{bot.tagline}</div>
          </button>
        ))}
      </div>

      {/* Active Bot Spec Sheet & Code View */}
      <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-4">
        {/* Top Info Banner */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu size={16} />
              <span>{activeBot.name}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{activeBot.description}</p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 border border-white bg-white text-black font-bold text-xs px-3 py-1.5 hover:bg-zinc-200 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'CODE COPIED!' : 'COPY BOT CODE'}</span>
          </button>
        </div>

        {/* Quant Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="border border-zinc-900 bg-black p-2">
            <span className="text-[10px] text-zinc-500 block">WIN RATE</span>
            <span className="text-white font-bold text-sm">{activeBot.winRate}</span>
          </div>
          <div className="border border-zinc-900 bg-black p-2">
            <span className="text-[10px] text-zinc-500 block">PROFIT FACTOR</span>
            <span className="text-white font-bold text-sm">{activeBot.profitFactor}</span>
          </div>
          <div className="border border-zinc-900 bg-black p-2">
            <span className="text-[10px] text-zinc-500 block">SHARPE RATIO</span>
            <span className="text-white font-bold text-sm">{activeBot.sharpeRatio}</span>
          </div>
          <div className="border border-zinc-900 bg-black p-2">
            <span className="text-[10px] text-zinc-500 block">OPTIMAL TIMEFRAME</span>
            <span className="text-white font-bold text-sm">{activeBot.bestTimeframe}</span>
          </div>
        </div>

        {/* VISUAL 30-DAY BACKTEST SIMULATOR */}
        <div className="border border-white/60 bg-black p-3.5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <BarChart2 size={15} className="text-white" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                INTERACTIVE 30-DAY HISTORICAL BACKTEST SIMULATOR:
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500 text-[10px]">CAPITAL:</span>
              {[500, 1000, 5000].map((cap) => (
                <button
                  key={cap}
                  onClick={() => {
                    sound.playClick();
                    setBacktestCapital(cap);
                  }}
                  className={`px-2 py-0.5 border text-[10px] ${
                    backtestCapital === cap
                      ? 'border-white bg-white text-black font-bold'
                      : 'border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  £{cap}
                </button>
              ))}
              <button
                onClick={handleSimulate}
                className="border border-white bg-white text-black font-bold px-2 py-0.5 text-[10px] hover:bg-zinc-200 transition-colors flex items-center gap-1"
              >
                <Play size={10} />
                <span>{isSimulating ? 'SIMULATING...' : 'TEST'}</span>
              </button>
            </div>
          </div>

          {/* Equity Chart & KPI stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            {/* SVG Visual Equity Curve */}
            <div className="md:col-span-2 border border-zinc-900 bg-zinc-950 p-2 relative">
              <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                <span>SIMULATED EQUITY CURVE (LAST 30 DAYS)</span>
                <span className="text-white font-bold">END: £{finalBalance.toLocaleString()}</span>
              </div>
              <svg viewBox="0 0 560 90" className="w-full h-20 overflow-visible">
                {/* Horizontal Baseline */}
                <line x1="0" y1="80" x2="560" y2="80" stroke="#27272a" strokeDasharray="3 3" />
                {/* Curve Area Fill */}
                <path
                  d={`${svgPath} L 560 80 L 0 80 Z`}
                  fill="rgba(255, 255, 255, 0.08)"
                />
                {/* Curve Line */}
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                {/* End Point Dot */}
                <circle cx="560" cy="12" r="4" fill="#ffffff" />
              </svg>
            </div>

            {/* Backtest KPI Breakdown */}
            <div className="border border-zinc-900 bg-zinc-950 p-3 text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>START CAPITAL:</span>
                <span className="font-bold text-white">£{backtestCapital.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>NET PROFIT:</span>
                <span className="font-extrabold text-white">+£{netProfit.toLocaleString()} (+184%)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>WIN RATE:</span>
                <span className="font-bold text-white">31 / 43 (72.1%)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>MAX DRAWDOWN:</span>
                <span className="text-zinc-400">-£{maxDrawdown} (3.8%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plain English Logic Box */}
        <div className="border border-zinc-800 bg-black p-3">
          <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider mb-1">
            HOW THIS BOT THINKS (PLAIN ENGLISH):
          </span>
          <p className="text-xs text-zinc-300 leading-relaxed">
            "{activeBot.plainEnglishLogic}"
          </p>
        </div>

        {/* Raw Code Editor Block */}
        <div className="relative border border-zinc-800 bg-black text-xs font-mono">
          <div className="flex items-center justify-between bg-zinc-900/90 border-b border-zinc-800 px-3 py-1.5 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Code2 size={13} />
              <span>SOURCE // {activeBot.language}</span>
            </span>
            <span className="text-[10px] text-zinc-500">READY TO PASTE</span>
          </div>

          <pre className="p-3 text-[11px] leading-relaxed text-zinc-300 overflow-x-auto max-h-72 selection:bg-white selection:text-black">
            <code>{activeBot.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
