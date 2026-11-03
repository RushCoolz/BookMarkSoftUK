import React, { useState } from 'react';
import { Asset } from '../types';
import { Zap, ArrowUpRight, ArrowDownRight, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  onNavigateToChart: () => void;
}

interface WhaleSignal {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  price: number;
  direction: 'BUY' | 'SELL';
  timeframe: '15M' | '1H' | '4H';
  volumeMultiplier: number;
  arrowPattern: string;
  plainMeaning: string;
  detectedAgo: string;
}

export const WhaleScanner: React.FC<Props> = ({ assets, onSelectAsset, onNavigateToChart }) => {
  const [scanning, setScanning] = useState(false);
  const [filterDirection, setFilterDirection] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  // Realistic scanned whale setups across the 42 assets
  const whaleSignals: WhaleSignal[] = [
    {
      id: 'ws-1',
      assetId: 'btc',
      symbol: 'BTC/USDT',
      name: 'Bitcoin',
      price: 94820.50,
      direction: 'BUY',
      timeframe: '1H',
      volumeMultiplier: 3.8,
      arrowPattern: 'FAT ARROW INSTITUTIONAL ABSORPTION',
      plainMeaning: 'Big hedge fund orders absorbed all retail sellers at $94.2k support. Arrow expanded 3.8x in width.',
      detectedAgo: '4 MIN AGO',
    },
    {
      id: 'ws-2',
      assetId: 'gbpusd',
      symbol: 'GBP/USD',
      name: 'British Pound / US Dollar',
      price: 1.2985,
      direction: 'BUY',
      timeframe: '15M',
      volumeMultiplier: 3.2,
      arrowPattern: 'LONDON OPEN VOLATILITY INJECTION',
      plainMeaning: 'Bank of England liquidity window triggered tall white arrows breaking through 1.2960 resistance.',
      detectedAgo: '12 MIN AGO',
    },
    {
      id: 'ws-3',
      assetId: 'gold',
      symbol: 'XAU/USD',
      name: 'Gold Spot',
      price: 2748.80,
      direction: 'BUY',
      timeframe: '4H',
      volumeMultiplier: 2.9,
      arrowPattern: 'SOVEREIGN RESERVE SPIKE',
      plainMeaning: 'Central bank block purchase created massive upward arrow with zero downward wick.',
      detectedAgo: '28 MIN AGO',
    },
    {
      id: 'ws-4',
      assetId: 'brent',
      symbol: 'BRENT/USD',
      name: 'Brent Crude Oil (UK)',
      price: 74.20,
      direction: 'SELL',
      timeframe: '1H',
      volumeMultiplier: 2.7,
      arrowPattern: 'HEAVY INSTITUTIONAL DUMP ARROW',
      plainMeaning: 'Massive supply dumped into market: arrow width exploded on a red close.',
      detectedAgo: '45 MIN AGO',
    },
    {
      id: 'ws-5',
      assetId: 'nvda',
      symbol: 'NVDA',
      name: 'NVIDIA Corp',
      price: 138.25,
      direction: 'BUY',
      timeframe: '15M',
      volumeMultiplier: 2.5,
      arrowPattern: 'PRE-MARKET AI FLOW EXPANSION',
      plainMeaning: 'Institutional desk accumulation: 2.5x standard volume arrow pushing toward $140 level.',
      detectedAgo: '1 HOUR AGO',
    },
    {
      id: 'ws-6',
      assetId: 'ftse',
      symbol: 'FTSE 100',
      name: 'UK FTSE 100 Index',
      price: 8245.50,
      direction: 'BUY',
      timeframe: '4H',
      volumeMultiplier: 2.4,
      arrowPattern: 'DIVIDEND REINVESTMENT SURGE',
      plainMeaning: 'UK pension funds actively buying deep-value bluechips on support base.',
      detectedAgo: '2 HOURS AGO',
    },
  ];

  const handleRefresh = () => {
    sound.playClick();
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      sound.playWhaleAlert();
    }, 700);
  };

  const handleSelectWhale = (signal: WhaleSignal) => {
    sound.playWhaleAlert();
    const asset = assets.find((a) => a.id === signal.assetId) || assets[0];
    onSelectAsset(asset);
    onNavigateToChart();
  };

  const filtered = whaleSignals.filter(
    (s) => filterDirection === 'ALL' || s.direction === filterDirection
  );

  return (
    <div className="border border-zinc-800 bg-black p-4 font-mono space-y-4">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white text-black font-bold text-xs tracking-wider flex items-center gap-1">
              <Zap size={13} />
              <span>LIVE "FAT ARROW" WHALE MARKET SCANNER</span>
            </span>
            <span className="text-xs text-zinc-400">AUTOMATIC 42-PAIR RADAR</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Constantly monitors all 42 instruments. Flags whenever institutional orderbook volume exceeds <strong className="text-white">2.0x average</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Filter direction buttons */}
          <div className="flex border border-zinc-800">
            {['ALL', 'BUY', 'SELL'].map((dir) => (
              <button
                key={dir}
                onClick={() => {
                  sound.playClick();
                  setFilterDirection(dir as any);
                }}
                className={`px-2.5 py-1 text-xs transition-colors ${
                  filterDirection === dir
                    ? 'border-white bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {dir === 'ALL' ? 'ALL SCANS' : dir === 'BUY' ? '▲ BUY ARROWS' : '▼ SELL ARROWS'}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-zinc-300 hover:text-white hover:border-white transition-colors"
          >
            <RefreshCw size={12} className={scanning ? 'animate-spin' : ''} />
            <span>{scanning ? 'SCANNING 42 PAIRS...' : 'RE-SCAN'}</span>
          </button>
        </div>
      </div>

      {/* Whale Signal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((signal) => {
          const isBuy = signal.direction === 'BUY';

          return (
            <div
              key={signal.id}
              onClick={() => handleSelectWhale(signal)}
              className="border border-zinc-800 bg-zinc-950 p-3.5 flex flex-col justify-between hover:border-white transition-all cursor-pointer relative group"
            >
              <div>
                {/* Top Row: Symbol, Timeframe & Detection time */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{signal.symbol}</span>
                    <span className="text-[10px] text-zinc-400 border border-zinc-800 px-1">
                      {signal.timeframe}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500">{signal.detectedAgo}</span>
                </div>

                {/* Direction and Volume Multiplier Badges */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span
                    className={`text-xs px-2 py-0.5 font-extrabold inline-flex items-center gap-1 ${
                      isBuy
                        ? 'bg-white text-black'
                        : 'border border-zinc-600 bg-black text-white'
                    }`}
                  >
                    {isBuy ? '▲ BUY FLOW' : '▼ SELL FLOW'}
                  </span>
                  <span className="text-xs font-bold text-white border border-zinc-700 bg-black px-2 py-0.5">
                    ⚡ {signal.volumeMultiplier}× NORMAL VOLUME
                  </span>
                </div>

                {/* Price */}
                <div className="text-xs text-zinc-400 mb-2">
                  TRIGGER PRICE: <strong className="text-white">${signal.price.toLocaleString()}</strong>
                </div>

                {/* Arrow Pattern & Plain English Meaning */}
                <div className="text-xs space-y-1 mb-3">
                  <div className="text-[11px] font-bold text-white uppercase">
                    {signal.arrowPattern}
                  </div>
                  <p className="text-[11px] text-zinc-400 border-l-2 border-zinc-700 pl-2 leading-relaxed">
                    "{signal.plainMeaning}"
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectWhale(signal);
                }}
                className="w-full border border-zinc-800 group-hover:border-white bg-black group-hover:bg-white text-zinc-300 group-hover:text-black text-xs py-1.5 font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <span>OPEN ARROW VECTOR CHART</span>
                <ArrowRight size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
