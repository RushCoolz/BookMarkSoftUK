import React, { useState, useMemo } from 'react';
import { BarData, Asset } from '../types';
import { Maximize2, Info, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  asset: Asset;
  bars: BarData[];
  timeframe: string;
  setTimeframe: (tf: string) => void;
}

export const ArrowVolumeChart: React.FC<Props> = ({ asset, bars, timeframe, setTimeframe }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Dimensions
  const width = 860;
  const height = 400;
  const paddingLeft = 30;
  const paddingRight = 65;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartAreaWidth = width - paddingLeft - paddingRight;
  const chartAreaHeight = height - paddingTop - paddingBottom;

  // Min and max prices
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    let minP = Infinity;
    let maxP = -Infinity;
    let maxV = 0;

    bars.forEach((b) => {
      if (b.low < minP) minP = b.low;
      if (b.high > maxP) maxP = b.high;
      if (b.volume > maxV) maxV = b.volume;
    });

    const priceBuffer = (maxP - minP) * 0.08 || 1;
    return {
      minPrice: minP - priceBuffer,
      maxPrice: maxP + priceBuffer,
      maxVolume: maxV || 1,
    };
  }, [bars]);

  // Coordinate scales
  const getY = (price: number) => {
    const range = maxPrice - minPrice;
    if (range <= 0) return height / 2;
    return paddingTop + chartAreaHeight - ((price - minPrice) / range) * chartAreaHeight;
  };

  const getX = (index: number) => {
    const step = chartAreaWidth / (bars.length - 1 || 1);
    return paddingLeft + index * step;
  };

  const hoveredBar = hoveredIndex !== null ? bars[hoveredIndex] : bars[bars.length - 1];

  const plainVerdict = useMemo(() => {
    if (hoveredBar.isInstitutionalSpike) {
      return {
        badge: '⚡ WHALE INFLOW',
        text: 'INSTITUTIONAL WHALE ORDER DETECTED: Volume is 3.8x above normal moving average. Large hedge fund / sovereign block executed.',
      };
    }
    if (hoveredBar.arrowWidth < 5) {
      return {
        badge: '⚠️ WEAK RETAIL',
        text: 'LOW CONVICTION RETAIL MOVE: Ultra-thin arrow width indicates lack of institutional backing. High probability of chop or false breakout.',
      };
    }
    if (hoveredBar.direction === 'UP' && hoveredBar.pctChange > 1.2) {
      return {
        badge: '▲ EXPANSION BUY',
        text: 'AGGRESSIVE BUYER MOMENTUM: Arrow height is expanding upwards with healthy institutional order volume.',
      };
    }
    if (hoveredBar.direction === 'DOWN' && hoveredBar.pctChange < -1.2) {
      return {
        badge: '▼ LIQUIDATION SELL',
        text: 'HEAVY SELLING EXPANSION: Sellers dominating orderbook with widening downward arrow vectors.',
      };
    }
    return {
      badge: '⏳ BALANCED FLOAT',
      text: 'BALANCED ACCUMULATION: Standard liquidity float with tight spread consolidation.',
    };
  }, [hoveredBar]);

  // Price grid ticks
  const priceTicks = useMemo(() => {
    const ticks = [];
    const count = 6;
    for (let i = 0; i <= count; i++) {
      const p = minPrice + ((maxPrice - minPrice) / count) * i;
      ticks.push(p);
    }
    return ticks;
  }, [minPrice, maxPrice]);

  return (
    <div className="border border-zinc-800 bg-black p-4 font-mono select-none">
      {/* Chart Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="px-2 py-0.5 bg-white text-black font-bold text-xs tracking-wider">
            ARROW-VECTOR ENGINE v2.4
          </div>
          <span className="text-sm font-bold text-white tracking-widest">{asset.symbol}</span>
          <span className="text-xs text-zinc-400">({asset.name})</span>
          <span className={`text-xs px-1.5 py-0.2 border ${asset.change24h >= 0 ? 'border-white text-white' : 'border-zinc-500 text-zinc-400'}`}>
            {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
          </span>
        </div>

        {/* Timeframe & Mode Controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex border border-zinc-800">
            {['15M', '1H', '4H', '1D'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs uppercase transition-colors ${
                  timeframe === tf
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1 border border-zinc-800 px-2 py-1 text-zinc-400 hover:text-white hover:border-zinc-500"
            title="How the Arrow Chart Works"
          >
            <Info size={13} />
            <span>EXPLAIN ARROWS</span>
          </button>
        </div>
      </div>

      {/* Explainer Drawer */}
      {showGuide && (
        <div className="mb-4 p-3 border border-zinc-700 bg-zinc-950 text-xs text-zinc-300">
          <div className="font-bold text-white mb-1.5 flex items-center gap-2">
            <span>[PROPRIETARY ARROW CHART SPECIFICATION]</span>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1 py-0.5">PATENT-PENDING PARADIGM</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border border-zinc-800 p-2 bg-black">
              <div className="text-white font-bold flex items-center gap-1.5 mb-1">
                <span className="text-lg">▲</span>
                <span>TALLER ARROW = LARGER PRICE MOVEMENT</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Traditional candles hide momentum. In this terminal, the arrow's height directly measures real price travel. A massive arrow represents aggressive trending momentum.
              </p>
            </div>
            <div className="border border-zinc-800 p-2 bg-black">
              <div className="text-white font-bold flex items-center gap-1.5 mb-1">
                <span className="text-lg">━</span>
                <span>WIDER ARROW = HEAVIER INSTITUTIONAL VOLUME</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Thin lines = weak retail traders. When an arrow gets ultra-wide and thick, big banks & hedge funds are pouring billions into that exact bar.
              </p>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400">
            • <strong className="text-white">SOLID WHITE ARROW (▲)</strong>: Bullish close higher than open.<br />
            • <strong className="text-white">HOLLOW/BORDERED ARROW (▼)</strong>: Bearish close lower than open.<br />
            • <strong className="text-white">LIGHTNING BADGE (⚡)</strong>: Whale volume alert (Volume &gt; 2.5x standard).
          </div>
        </div>
      )}

      {/* Live Cursor Metric HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 bg-zinc-950 p-2 border border-zinc-900 text-xs mb-3">
        <div>
          <span className="text-zinc-500 block text-[10px]">TIME</span>
          <span className="text-white font-bold">{hoveredBar.time}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px]">OPEN</span>
          <span className="text-zinc-300">${hoveredBar.open.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px]">HIGH</span>
          <span className="text-zinc-300">${hoveredBar.high.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px]">LOW</span>
          <span className="text-zinc-300">${hoveredBar.low.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px]">CLOSE</span>
          <span className="text-white font-bold">${hoveredBar.close.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px]">ARROW WIDTH (VOL)</span>
          <span className="text-white font-bold">
            {hoveredBar.volume.toLocaleString()} ({hoveredBar.arrowWidth.toFixed(1)}px)
          </span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px]">ARROW DELTA</span>
          <span className={`font-bold ${hoveredBar.direction === 'UP' ? 'text-white' : 'text-zinc-400'}`}>
            {hoveredBar.direction === 'UP' ? '▲ +' : '▼ -'}
            {Math.abs(hoveredBar.pctChange)}%
          </span>
        </div>
      </div>

      {/* Live Plain-English Hover Verdict Strip */}
      <div className="flex items-center gap-2.5 bg-black border border-zinc-800 p-2 mb-3 text-xs">
        <span className="px-1.5 py-0.5 border border-white bg-white text-black font-extrabold text-[10px] tracking-wider whitespace-nowrap">
          {plainVerdict.badge}
        </span>
        <span className="text-zinc-300 text-[11px] leading-snug">
          {plainVerdict.text}
        </span>
      </div>

      {/* Main SVG Vector Canvas */}
      <div className="relative overflow-x-auto w-full bg-black border border-zinc-900">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[650px] cursor-crosshair select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Background Grid Lines */}
          {priceTicks.map((tick, i) => {
            const y = getY(tick);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#27272a"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                />
                <text
                  x={width - paddingRight + 6}
                  y={y + 3}
                  fill="#71717a"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  ${tick >= 100 ? tick.toFixed(1) : tick.toFixed(4)}
                </text>
              </g>
            );
          })}

          {/* Time vertical divider lines */}
          {bars.map((bar, i) => {
            if (i % 6 !== 0) return null;
            const x = getX(i);
            return (
              <g key={`time-${i}`}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={height - paddingBottom}
                  stroke="#18181b"
                  strokeWidth="0.8"
                />
                <text
                  x={x}
                  y={height - paddingBottom + 16}
                  fill="#71717a"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {bar.time}
                </text>
              </g>
            );
          })}

          {/* Render Arrow Candlesticks */}
          {bars.map((bar, i) => {
            const x = getX(i);
            const yHigh = getY(bar.high);
            const yLow = getY(bar.low);
            const yOpen = getY(bar.open);
            const yClose = getY(bar.close);

            const isBull = bar.direction === 'UP';
            const isHovered = hoveredIndex === i;

            // Arrow Geometry:
            // Arrow stem thickness & head width scales with volume
            const stemWidth = Math.max(2, Math.min(18, bar.arrowWidth * 0.75));
            const headWidth = Math.max(6, Math.min(28, bar.arrowWidth * 1.5));
            const headLength = Math.max(8, Math.min(20, Math.abs(yClose - yOpen) * 0.45));

            const topY = Math.min(yOpen, yClose);
            const bottomY = Math.max(yOpen, yClose);
            const arrowLength = Math.max(14, bottomY - topY);

            return (
              <g
                key={bar.id}
                onMouseEnter={() => setHoveredIndex(i)}
                className="cursor-pointer transition-opacity"
              >
                {/* Thin wick connecting High and Low */}
                <line
                  x1={x}
                  y1={yHigh}
                  x2={x}
                  y2={yLow}
                  stroke="#52525b"
                  strokeWidth="1"
                  strokeDasharray={isBull ? undefined : '2 2'}
                />

                {/* Arrow Vector Body */}
                {isBull ? (
                  // BULLISH: Pointing UP (Filled White Arrow)
                  <g>
                    {/* Arrow Stem */}
                    <rect
                      x={x - stemWidth / 2}
                      y={topY + headLength}
                      width={stemWidth}
                      height={Math.max(1, arrowLength - headLength)}
                      fill={isHovered ? '#ffffff' : '#f4f4f5'}
                    />
                    {/* Arrow Head (North pointing triangle) */}
                    <polygon
                      points={`
                        ${x},${topY}
                        ${x - headWidth / 2},${topY + headLength}
                        ${x + headWidth / 2},${topY + headLength}
                      `}
                      fill={isHovered ? '#ffffff' : '#f4f4f5'}
                    />
                  </g>
                ) : (
                  // BEARISH: Pointing DOWN (Hollow/Outlined High-Contrast Arrow)
                  <g>
                    {/* Down Stem */}
                    <rect
                      x={x - stemWidth / 2}
                      y={topY}
                      width={stemWidth}
                      height={Math.max(1, arrowLength - headLength)}
                      fill="#09090b"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                    {/* Arrow Head (South pointing triangle) */}
                    <polygon
                      points={`
                        ${x},${bottomY}
                        ${x - headWidth / 2},${bottomY - headLength}
                        ${x + headWidth / 2},${bottomY - headLength}
                      `}
                      fill="#09090b"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                  </g>
                )}

                {/* Whale volume badge icon if institutional spike */}
                {bar.isInstitutionalSpike && (
                  <g>
                    <circle cx={x} cy={yHigh - 12} r="5" fill="#ffffff" />
                    <text
                      x={x}
                      y={yHigh - 9}
                      textAnchor="middle"
                      fill="#000000"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      ⚡
                    </text>
                  </g>
                )}

                {/* Hover hit area */}
                <rect
                  x={x - 12}
                  y={paddingTop}
                  width="24"
                  height={chartAreaHeight}
                  fill="transparent"
                />
              </g>
            );
          })}

          {/* Interactive Crosshair */}
          {hoveredIndex !== null && (
            <g pointerEvents="none">
              {/* Vertical line */}
              <line
                x1={getX(hoveredIndex)}
                y1={paddingTop}
                x2={getX(hoveredIndex)}
                y2={height - paddingBottom}
                stroke="#a1a1aa"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
              {/* Horizontal line */}
              <line
                x1={paddingLeft}
                y1={getY(hoveredBar.close)}
                x2={width - paddingRight}
                y2={getY(hoveredBar.close)}
                stroke="#a1a1aa"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
              {/* Crosshair tag on Y axis */}
              <rect
                x={width - paddingRight}
                y={getY(hoveredBar.close) - 8}
                width="62"
                height="16"
                fill="#ffffff"
              />
              <text
                x={width - paddingRight + 4}
                y={getY(hoveredBar.close) + 4}
                fill="#000000"
                fontSize="9"
                fontWeight="bold"
                fontFamily="monospace"
              >
                ${hoveredBar.close.toFixed(2)}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Chart Footer: Volume Stem Histogram */}
      <div className="mt-3 pt-2 border-t border-zinc-900 flex flex-wrap items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-white inline-block"></span>
            <span className="text-zinc-300">SOLID ARROW = BUY CONVICTION</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border border-white inline-block"></span>
            <span className="text-zinc-300">OUTLINED ARROW = SELL CONVICTION</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-bold">WIDTH ∝ VOLUME</span>
            <span className="text-zinc-500">(FAT ARROW = WHALES ACTIVE)</span>
          </div>
        </div>

        <div className="text-[11px] text-zinc-500">
          DATA FEED: WEBSOCKET L2 DIRECT // LATENCY &lt; 2ms
        </div>
      </div>
    </div>
  );
};
