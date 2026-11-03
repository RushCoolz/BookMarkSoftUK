import React, { useState, useMemo } from 'react';
import { Asset } from '../types';
import { Search, ArrowRight, X } from 'lucide-react';

interface Props {
  assets: Asset[];
  selectedAsset: Asset;
  onSelectAsset: (asset: Asset) => void;
  onNavigateToChart: () => void;
}

export const InstrumentsExplorer: React.FC<Props> = ({
  assets,
  selectedAsset,
  onSelectAsset,
  onNavigateToChart,
}) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change24h' | 'volume24h'>('change24h');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        return (
          asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
          asset.name.toLowerCase().includes(search.toLowerCase()) ||
          asset.category.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => {
        let valA: any = a[sortBy];
        let valB: any = b[sortBy];

        if (sortBy === 'price' || sortBy === 'change24h') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }

        return sortOrder === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [assets, search, sortBy, sortOrder]);

  const handleSelect = (asset: Asset) => {
    onSelectAsset(asset);
    onNavigateToChart();
  };

  const handleSort = (col: 'symbol' | 'price' | 'change24h' | 'volume24h') => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('desc');
    }
  };

  return (
    <div className="border border-zinc-800 bg-black p-4 font-mono space-y-4">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-white text-black font-bold text-xs tracking-wider">
            ALL MARKET INSTRUMENTS ({assets.length})
          </span>
          <span className="text-xs text-zinc-400">INSTITUTIONAL LIQUIDITY FEED</span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Search any symbol or company name. Click any instrument to immediately open its Arrow Vector Chart.
        </p>
      </div>

      {/* FULL-WIDTH PROMINENT SEARCH BAR */}
      <div className="space-y-1.5">
        <div className="relative w-full">
          <div className="flex items-center border-2 border-white bg-zinc-950 p-3 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Search size={20} className="text-white mr-3 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH ALL INSTRUMENTS (e.g. Gold, GBP, BTC, FTSE, Oil, NVDA, EUR)..."
              className="w-full bg-transparent text-sm sm:text-base font-bold text-white placeholder-zinc-500 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="px-2.5 py-1 border border-zinc-600 hover:border-white bg-zinc-900 text-white text-xs ml-2 flex items-center gap-1 font-bold"
              >
                <X size={12} />
                <span>CLEAR</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
          <span>SHOWING <strong className="text-white">{filteredAssets.length}</strong> OF {assets.length} TOTAL PAIRS</span>
          <span className="text-zinc-500">SORT BY COLUMN HEADER</span>
        </div>
      </div>

      {/* Instruments Table */}
      <div className="overflow-x-auto border border-zinc-900">
        <table className="w-full text-xs text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950 text-[10px] text-zinc-500 uppercase tracking-wider">
              <th
                onClick={() => handleSort('symbol')}
                className="py-2.5 px-3 cursor-pointer hover:text-white"
              >
                INSTRUMENT {sortBy === 'symbol' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-2.5 px-2">CLASS</th>
              <th
                onClick={() => handleSort('price')}
                className="py-2.5 px-3 cursor-pointer hover:text-white"
              >
                PRICE {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('change24h')}
                className="py-2.5 px-3 cursor-pointer hover:text-white"
              >
                24H CHANGE {sortBy === 'change24h' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-2.5 px-3">24H VOLUME</th>
              <th className="py-2.5 px-3">ARROW VECTOR PATTERN</th>
              <th className="py-2.5 px-3">VALUATION</th>
              <th className="py-2.5 px-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-500 text-xs">
                  No instruments found matching "{search}".
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => {
                const isSelected = selectedAsset.id === asset.id;
                const isBull = asset.change24h >= 0;

                return (
                  <tr
                    key={asset.id}
                    onClick={() => handleSelect(asset)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-zinc-900/90 text-white font-semibold'
                        : 'hover:bg-zinc-950/80 text-zinc-300'
                    }`}
                  >
                    {/* Symbol & Name */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{asset.symbol}</span>
                        <span className="text-[11px] text-zinc-500">{asset.name}</span>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <span className="text-[9px] border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 text-zinc-400 uppercase">
                        {asset.category.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">
                      ${asset.price.toLocaleString(undefined, {
                        minimumFractionDigits: asset.price < 10 ? 4 : 2,
                        maximumFractionDigits: asset.price < 10 ? 4 : 2,
                      })}
                    </td>

                    {/* 24h Change */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-xs px-1.5 py-0.5 font-bold inline-flex items-center gap-1 ${
                          isBull
                            ? 'bg-white text-black'
                            : 'border border-zinc-700 text-zinc-300 bg-zinc-950'
                        }`}
                      >
                        {isBull ? '▲ +' : '▼ '}
                        {Math.abs(asset.change24h)}%
                      </span>
                    </td>

                    {/* Volume */}
                    <td className="py-2.5 px-3 text-zinc-300 whitespace-nowrap">
                      {asset.volume24h}
                    </td>

                    {/* Arrow Trend Pattern */}
                    <td className="py-2.5 px-3 text-xs whitespace-nowrap">
                      <span className="text-zinc-400 text-[11px]">
                        {asset.arrowTrendSummary}
                      </span>
                    </td>

                    {/* Valuation Status */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 border ${
                          asset.simpleValuation === 'BARGAIN / ON SALE'
                            ? 'border-white text-white font-bold bg-zinc-900'
                            : asset.simpleValuation === 'FAIR VALUE'
                            ? 'border-zinc-700 text-zinc-400'
                            : 'border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {asset.simpleValuation}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(asset);
                        }}
                        className="border border-zinc-800 hover:border-white px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white hover:text-black transition-colors inline-flex items-center gap-1"
                      >
                        <span>CHART</span>
                        <ArrowRight size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
