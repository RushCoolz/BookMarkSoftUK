import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { HourlyForecastItem, TempUnit } from '../../types/weather';
import { formatTemp, decodeWmoCode } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface HourlyCurveChartProps {
  hourly: HourlyForecastItem[];
  unit: TempUnit;
}

export function HourlyCurveChart({ hourly, unit }: HourlyCurveChartProps) {
  const { theme } = useWeatherTheme();
  const items = hourly.slice(0, 24);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  const temps = items.map(h => h.temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = Math.max(1, maxTemp - minTemp);

  // SVG Geometry Dimensions
  const svgWidth = 800;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingTop = 30;
  const paddingBottom = 35;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate coordinates for each point
  const points = items.map((item, idx) => {
    const x = paddingX + (idx / (items.length - 1)) * graphWidth;
    const y = paddingTop + graphHeight - ((item.temperature - minTemp) / range) * graphHeight;
    return { x, y, item, idx };
  });

  // Build smooth cubic bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX = (p0.x + p1.x) / 2;
    pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  // Area path for gradient fill under the curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - 10} L ${points[0].x} ${svgHeight - 10} Z`;

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[0];
  const activeWmo = decodeWmoCode(activePoint.item.weatherCode);

  return (
    <div className={`relative w-full rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 space-y-4 overflow-hidden transition-all duration-300`}>
      
      {/* Wrapped Thematic Scenic Artwork & Corner Filigrees */}
      <ThemeCardArtWrapper theme={theme} variant="chart" />

      {/* Top Iridescent Specular Glass Rim */}
      <div 
        aria-hidden="true" 
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} 
      />

      {/* Header with Active Scrubber Readout */}
      <div className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${theme.ui.dividerBorder} pb-3.5`}>
        <div>
          <h3 className={`text-base font-black ${theme.ui.primaryText} flex items-center gap-2`}>
            <span className={`p-1.5 rounded-xl ${theme.ui.badgeBg} ${theme.ui.accentText} border ${theme.ui.badgeBorder}`}>
              <Sparkles className="w-4 h-4" />
            </span>
            <span>Diurnal Thermal Bezier Wave</span>
            <span className={`text-xs font-black ${theme.ui.subheadingText}`}>· 24-Hour Spline</span>
          </h3>
          <p className={`text-xs font-semibold ${theme.ui.secondaryText} mt-0.5`}>
            Hover along the spline to preview temperature curves and precipitation dynamics
          </p>
        </div>

        {/* Dynamic Scrubber readout badge with ThemeTileArt */}
        <div className={`relative overflow-hidden flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} shadow-md`}>
          <ThemeTileArt theme={theme} variant="pill" index={2} />
          <span className={`relative z-10 text-xs font-black ${theme.ui.primaryText} font-mono`}>
            {new Date(activePoint.item.time).toLocaleTimeString([], { hour: 'numeric' })}:
          </span>
          <span className={`relative z-10 text-sm font-black ${theme.ui.accentText} font-mono tabular-nums`}>
            {formatTemp(activePoint.item.temperature, unit)}
          </span>
          <span className={`relative z-10 text-xs ${theme.ui.secondaryText} font-bold`}>
            · {activeWmo.description}
          </span>
          {activePoint.item.precipitationProbability > 0 && (
            <span className={`relative z-10 text-xs font-black ${theme.ui.accentText} font-mono`}>
              ({activePoint.item.precipitationProbability}% rain)
            </span>
          )}
        </div>
      </div>

      {/* Interactive SVG Spline Canvas */}
      <div className="relative z-10 w-full overflow-x-auto scrollbar-none">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-44 min-w-[580px] overflow-visible"
        >
          <defs>
            {/* Luminous Curve Gradient Fill adapted from active theme */}
            <linearGradient id={`curveAreaGrad-${theme.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.ui.chartAreaGrad[0]} stopOpacity="0.55" />
              <stop offset="65%" stopColor={theme.ui.chartAreaGrad[1]} stopOpacity="0.25" />
              <stop offset="100%" stopColor={theme.ui.chartAreaGrad[1]} stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing Stroke Gradient adapted from active theme */}
            <linearGradient id={`neonStrokeGrad-${theme.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.ui.chartLineGrad[0]} />
              <stop offset="50%" stopColor={theme.ui.chartLineGrad[1]} />
              <stop offset="100%" stopColor={theme.ui.chartLineGrad[2]} />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill={`url(#curveAreaGrad-${theme.id})`} />

          {/* Continuous Glowing Bezier Line */}
          <path 
            d={pathD} 
            fill="none" 
            stroke={`url(#neonStrokeGrad-${theme.id})`} 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          />

          {/* Timeline Points & Time Labels */}
          {points.map((pt, i) => {
            const isHovered = hoverIndex === i;
            const hourLabel = new Date(pt.item.time).toLocaleTimeString([], { hour: 'numeric' });
            const showLabel = i % 3 === 0 || i === 0;

            return (
              <g 
                key={i} 
                onMouseEnter={() => setHoverIndex(i)}
                className="cursor-pointer"
              >
                {/* Invisible Hover target column */}
                <rect 
                  x={pt.x - 12} 
                  y={0} 
                  width={24} 
                  height={svgHeight} 
                  fill="transparent" 
                />

                {/* Vertical Scrubber Guide on active */}
                {isHovered && (
                  <line 
                    x1={pt.x} 
                    y1={pt.y} 
                    x2={pt.x} 
                    y2={svgHeight - 20} 
                    stroke={theme.ui.chartLineStroke} 
                    strokeDasharray="3 3" 
                    strokeWidth="2"
                    strokeOpacity="0.8"
                  />
                )}

                {/* Point Halo */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={isHovered ? 6.5 : 3.5} 
                  fill={isHovered ? theme.accentColors.secondary : theme.accentColors.primary} 
                  stroke="#fef08a" 
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="transition-all duration-200"
                />

                {/* Temperature label above peaks on hover or sample intervals */}
                {(isHovered || showLabel) && (
                  <text 
                    x={pt.x} 
                    y={pt.y - 10} 
                    textAnchor="middle" 
                    className={`text-[11px] font-mono font-black fill-current ${theme.ui.primaryText}`}
                  >
                    {formatTemp(pt.item.temperature, unit)}
                  </text>
                )}

                {/* Time label on axis */}
                {showLabel && (
                  <text 
                    x={pt.x} 
                    y={svgHeight - 5} 
                    textAnchor="middle" 
                    className={`text-[10px] font-mono font-bold fill-current ${theme.ui.secondaryText}`}
                  >
                    {hourLabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
