import React, { useState, useEffect } from 'react';
import { Asset, UserProfile } from '../types';
import { Terminal, Activity, Search, X, ChevronRight, Volume2, VolumeX, User, Lock } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  allAssets: Asset[];
  selectedAsset: Asset;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onSelectAsset: (asset: Asset) => void;
  onOpenInstruments: () => void;
}

export const TerminalHeader: React.FC<Props> = ({
  allAssets,
  selectedAsset,
  user,
  onOpenAuth,
  onSelectAsset,
  onOpenInstruments,
}) => {
  const [time, setTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  const toggleAudio = () => {
    sound.enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) sound.playClick();
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick live search matching across all 42 assets
  const searchResults = searchQuery.trim()
    ? allAssets.filter(
        (a) =>
          a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const isPos = selectedAsset.change24h >= 0;

  return (
    <header className="border-b border-zinc-800 bg-black font-mono select-none">
      {/* Level 1: System Status & Clock */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-zinc-900 text-[11px] text-zinc-400 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <Terminal size={14} />
            <span>ARROW QUANT PROTOCOL // LONDON REGION (UK)</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-zinc-300">FEED: L2 DIRECT</span>
          </div>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">NODE: LONDON_L2_UK</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <button
            onClick={() => {
              sound.playClick();
              onOpenAuth();
            }}
            className="flex items-center gap-1.5 border border-zinc-700 bg-zinc-950 px-2.5 py-0.5 text-xs text-zinc-300 hover:text-white hover:border-white transition-colors"
          >
            <User size={12} className={user ? 'text-white' : 'text-zinc-500'} />
            <span className="font-bold">
              {user ? `${user.username} [${user.plan}]` : 'LOG IN / DEMO'}
            </span>
          </button>
          <span className="text-zinc-600">|</span>
          <button
            onClick={toggleAudio}
            className="flex items-center gap-1 hover:text-white transition-colors"
            title="Toggle terminal sound feedback"
          >
            {audioEnabled ? <Volume2 size={12} className="text-white" /> : <VolumeX size={12} />}
            <span>AUDIO: {audioEnabled ? 'ON' : 'MUTED'}</span>
          </button>
          <span className="text-zinc-600">|</span>
          <span>LATENCY: <strong className="text-white">1.8ms</strong></span>
          <span className="text-zinc-600">|</span>
          <span className="text-white font-bold">{time}</span>
        </div>
      </div>

      {/* Level 2: UNIFIED WIDE SEARCH BAR & ACTIVE ASSET PILL */}
      <div className="px-4 py-2.5 bg-zinc-950 flex flex-wrap items-center justify-between gap-3">
        {/* Wide Search Command Bar */}
        <div className="relative flex-1 min-w-[280px]">
          <div
            className={`flex items-center border-2 transition-all bg-black px-3 py-1.5 ${
              searchFocused || searchQuery
                ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                : 'border-zinc-800 hover:border-zinc-600'
            }`}
          >
            <Search size={16} className="text-white mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH ALL 42 INSTRUMENTS (e.g. Gold, GBP, BTC, FTSE, Oil, NVDA, EUR)..."
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-white placeholder-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 py-0.5 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white text-[10px] ml-2 flex items-center gap-1"
              >
                <X size={11} />
                <span>CLEAR</span>
              </button>
            )}
            <div className="hidden md:flex items-center gap-1 text-[10px] text-zinc-500 ml-3 pl-3 border-l border-zinc-800 flex-shrink-0">
              <span className="border border-zinc-700 px-1.5 py-0.2 text-zinc-300 font-bold">42 ASSETS</span>
            </div>
          </div>

          {/* Expanded Search Results Dropdown Overlay */}
          {searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-black border-2 border-white z-50 max-h-80 overflow-y-auto shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
              <div className="p-2 border-b border-zinc-800 text-[10px] text-zinc-400 flex justify-between bg-zinc-950">
                <span>FOUND {searchResults.length} MATCHING INSTRUMENTS</span>
                <span>CLICK TO SELECT & LOAD</span>
              </div>
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-zinc-500 text-xs">
                  No instruments matching "{searchQuery}".
                </div>
              ) : (
                <div className="divide-y divide-zinc-900">
                  {searchResults.map((asset) => {
                    const isSelected = selectedAsset.id === asset.id;
                    const isBull = asset.change24h >= 0;
                    return (
                      <button
                        key={asset.id}
                        onMouseDown={() => {
                          onSelectAsset(asset);
                          setSearchQuery('');
                        }}
                        className={`w-full text-left p-2.5 flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-zinc-900 text-white font-bold'
                            : 'hover:bg-zinc-900/60 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white text-xs">{asset.symbol}</span>
                          <span className="text-[11px] text-zinc-400">{asset.name}</span>
                          <span className="text-[9px] border border-zinc-800 bg-zinc-950 px-1.5 py-0.2 text-zinc-500 uppercase">
                            {asset.category.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-bold text-white">
                            ${asset.price.toLocaleString(undefined, {
                              minimumFractionDigits: asset.price < 10 ? 3 : 2,
                            })}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 ${
                              isBull ? 'bg-white text-black font-bold' : 'border border-zinc-700 text-zinc-400'
                            }`}
                          >
                            {isBull ? '▲ +' : '▼ '}
                            {Math.abs(asset.change24h)}%
                          </span>
                          <span className="text-zinc-500 text-[10px]">{asset.volume24h}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Instrument Status Card */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="border border-zinc-800 bg-black px-3 py-1.5 flex items-center gap-2.5 text-xs">
            <span className="text-[10px] text-zinc-500 font-bold uppercase">LOADED:</span>
            <span className="font-extrabold text-white">{selectedAsset.symbol}</span>
            <span className="text-zinc-300 font-mono font-bold">
              ${selectedAsset.price.toLocaleString(undefined, {
                minimumFractionDigits: selectedAsset.price < 10 ? 3 : 2,
                maximumFractionDigits: selectedAsset.price < 10 ? 3 : 2,
              })}
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.2 font-bold ${
                isPos ? 'bg-white text-black' : 'border border-zinc-700 text-zinc-400'
              }`}
            >
              {isPos ? '▲ +' : '▼ '}{Math.abs(selectedAsset.change24h)}%
            </span>
          </div>

          <button
            onClick={onOpenInstruments}
            className="border border-zinc-800 hover:border-white bg-black hover:bg-zinc-900 text-zinc-300 hover:text-white px-2.5 py-1.5 text-xs transition-colors flex items-center gap-1"
          >
            <span>ALL LIST ({allAssets.length})</span>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </header>
  );
};
