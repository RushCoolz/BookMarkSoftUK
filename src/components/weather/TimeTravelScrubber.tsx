import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Sun, 
  Moon, 
  SunMoon,
  Droplets,
  Wind
} from 'lucide-react';
import { WeatherData, HourlyForecastItem, TempUnit } from '../../types/weather';
import { formatTempWithUnit, decodeWmoCode } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface TimeTravelScrubberProps {
  weather: WeatherData;
  unit: TempUnit;
  scrubIndex: number; // 0 = Live Now, 1..23 = future hours
  onScrubChange: (index: number) => void;
}

export function TimeTravelScrubber({
  weather,
  unit,
  scrubIndex,
  onScrubChange
}: TimeTravelScrubberProps) {
  const { theme, isAutoThemeSync, setAutoThemeSync } = useWeatherTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract 24 hours starting from the current hour
  const next24Hours: HourlyForecastItem[] = React.useMemo(() => {
    if (!weather.hourly || weather.hourly.length === 0) return [];
    const currentIsoPrefix = weather.current.time.slice(0, 13);
    const startIdx = Math.max(
      0,
      weather.hourly.findIndex((h) => h.time.startsWith(currentIsoPrefix))
    );
    return weather.hourly.slice(startIdx, startIdx + 24);
  }, [weather.hourly, weather.current.time]);

  // Auto-advance time-lapse loop when playing
  useEffect(() => {
    if (!isPlaying || next24Hours.length === 0) return;
    const timer = window.setInterval(() => {
      onScrubChange((scrubIndex + 1) % next24Hours.length);
    }, 1100);
    return () => window.clearInterval(timer);
  }, [isPlaying, scrubIndex, next24Hours.length, onScrubChange]);

  if (next24Hours.length === 0) return null;

  const activeHour = next24Hours[Math.min(scrubIndex, next24Hours.length - 1)];
  const hourStr = activeHour.time.includes('T') ? activeHour.time.split('T')[1].slice(0, 5) : activeHour.time;
  const hourNum = parseInt(hourStr.split(':')[0], 10) || 12;
  const isDayHour = hourNum >= 6 && hourNum < 20 ? 1 : 0;
  const wmo = decodeWmoCode(activeHour.weatherCode, isDayHour);

  // Calculate normalized solar/lunar elevation along the 24h curve
  const progress = scrubIndex / Math.max(1, next24Hours.length - 1);
  const orbX = 40 + progress * 520;
  // Sine wave peaking around 13:00 and troughing around 01:00
  const solarAngle = ((hourNum - 6) / 24) * Math.PI * 2;
  const orbY = 48 - Math.sin(solarAngle) * 28;

  return (
    <div className={`relative w-full rounded-[32px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-5 sm:p-6 overflow-hidden transition-all duration-300`}>
      <ThemeCardArtWrapper theme={theme} variant="compact" />
      <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

      <div className="relative z-10 space-y-4">
        {/* Top Row: Title + Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-black ${theme.ui.primaryText} tracking-tight`}>
                  24-Hour Atmospheric Time-Scrubber
                </h2>
                <span className={`text-[11px] font-mono font-black ${theme.ui.subheadingText}`}>
                  · {scrubIndex === 0 ? 'LIVE NOW' : `+${scrubIndex}h Preview (${hourStr})`}
                </span>
              </div>
              <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                Scrub across the day to preview future sky particles, temperatures, and solar twilight transitions
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Living Sky Auto-Theme Toggle */}
            <button
              type="button"
              onClick={() => setAutoThemeSync(!isAutoThemeSync)}
              className={`relative overflow-hidden px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isAutoThemeSync
                  ? `${theme.ui.activePill} ${theme.ui.activePillText} ring-2 ring-amber-300`
                  : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
              }`}
              title="Automatically shift illustrated world theme as you scrub through dawn, noon, sunset, and night"
            >
              {!isAutoThemeSync && <ThemeTileArt theme={theme} variant="pill" index={0} />}
              <SunMoon className="relative z-10 w-3.5 h-3.5" />
              <span className="relative z-10">
                {isAutoThemeSync ? 'Living Sky Sync: ON' : 'Auto-Shift World'}
              </span>
            </button>

            {/* Play / Pause 24h Time-Lapse */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3.5 py-2 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} text-xs font-black flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-md`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Time-Lapse' : 'Play 24h Sky'}</span>
            </button>

            {/* Reset to Live Now */}
            {scrubIndex > 0 && (
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  onScrubChange(0);
                }}
                className={`relative overflow-hidden px-3 py-2 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText} text-xs font-black flex items-center gap-1 cursor-pointer shadow-sm`}
              >
                <ThemeTileArt theme={theme} variant="pill" index={2} />
                <RotateCcw className="relative z-10 w-3.5 h-3.5" />
                <span className="relative z-10">Live Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Illustrated Solar & Lunar Horizon Trajectory Canvas + Snapshot */}
        <div className={`relative overflow-hidden rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} p-4 space-y-3`}>
          <ThemeTileArt theme={theme} variant="gauge" index={1} />

          {/* SVG Horizon Arc */}
          <div className="relative z-10 w-full h-16">
            <svg viewBox="0 0 600 84" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="scrubber-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={theme.accentColors.primary} stopOpacity="0.4" />
                  <stop offset="50%" stopColor={theme.accentColors.tertiary} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={theme.accentColors.secondary} stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* Horizon Baseline */}
              <line
                x1="20"
                y1="48"
                x2="580"
                y2="48"
                stroke={theme.accentColors.tertiary}
                strokeOpacity="0.3"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <text x="24" y="43" fill={theme.accentColors.tertiary} fontSize="9" fontWeight="bold" opacity="0.75">
                HORIZON
              </text>

              {/* Active Celestial Orb */}
              <circle
                cx={orbX}
                cy={orbY}
                r="14"
                fill={isDayHour ? '#FBBF24' : '#818CF8'}
                opacity="0.3"
              />
              <circle
                cx={orbX}
                cy={orbY}
                r="7.5"
                fill={isDayHour ? '#FDE047' : '#E0E7FF'}
                stroke={theme.accentColors.primary}
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Interactive Range Slider */}
          <div className="relative z-10 space-y-1.5">
            <input
              type="range"
              min={0}
              max={Math.max(1, next24Hours.length - 1)}
              step={1}
              value={scrubIndex}
              onChange={(e) => {
                setIsPlaying(false);
                onScrubChange(parseInt(e.target.value, 10));
              }}
              aria-label="Scrub 24-hour forecast timeline"
              className="w-full accent-amber-400 cursor-pointer h-2.5 rounded-lg"
            />

            {/* Hour Tick Labels & Live Scrubbed Telemetry Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-2 font-black">
                {isDayHour ? (
                  <Sun className="w-4 h-4 text-amber-300" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-200" />
                )}
                <span className={`font-mono ${theme.ui.primaryText}`}>
                  {hourStr} ({scrubIndex === 0 ? 'Now' : `+${scrubIndex}h`})
                </span>
                <span aria-hidden="true" className={theme.ui.secondaryText}>·</span>
                <span className={theme.ui.subheadingText}>
                  {formatTempWithUnit(activeHour.temperature, unit)}
                </span>
                <span aria-hidden="true" className={theme.ui.secondaryText}>·</span>
                <span className={theme.ui.primaryText}>{wmo.description}</span>
              </div>

              <div className={`flex items-center gap-3 font-mono text-[11px] font-bold ${theme.ui.secondaryText}`}>
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" />
                  Rain {activeHour.precipitationProbability}%
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5" />
                  Wind {Math.round(activeHour.windSpeed)} km/h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
