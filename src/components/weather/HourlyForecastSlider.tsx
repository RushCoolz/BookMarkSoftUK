import React, { useState, useRef } from 'react';
import { 
  CloudRain, 
  Wind, 
  Sun, 
  Droplets, 
  Navigation,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { HourlyForecastItem, TempUnit, SpeedUnit } from '../../types/weather';
import { formatTemp, decodeWmoCode } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface HourlyForecastSliderProps {
  hourly: HourlyForecastItem[];
  unit: TempUnit;
  speedUnit: SpeedUnit;
  selectedHourTime?: string;
  onSelectHour?: (hourItem: HourlyForecastItem) => void;
}

export function HourlyForecastSlider({
  hourly,
  unit,
  speedUnit,
  selectedHourTime,
  onSelectHour
}: HourlyForecastSliderProps) {
  const { theme } = useWeatherTheme();
  const [metricView, setMetricView] = useState<'all' | 'rain' | 'wind' | 'uv'>('all');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const distance = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth'
    });
  };

  const next24 = hourly.slice(0, 36);

  return (
    <div className={`relative w-full rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 space-y-4 overflow-hidden transition-all duration-300`}>
      
      {/* Wrapped Thematic Scenic Artwork & Corner Filigrees */}
      <ThemeCardArtWrapper theme={theme} variant="hourly" />

      {/* Top Iridescent Specular Glass Rim */}
      <div 
        aria-hidden="true" 
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} 
      />

      {/* Header and View Controls */}
      <div className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${theme.ui.dividerBorder} pb-3.5`}>
        <div>
          <h2 className={`text-base font-black ${theme.ui.primaryText} flex items-center gap-2`}>
            <span className={`p-1.5 rounded-xl ${theme.ui.badgeBg} ${theme.ui.accentText} border ${theme.ui.badgeBorder}`}>
              <Sun className="w-4 h-4" />
            </span>
            <span>Hourly Forecast &amp; Rain Tracker</span>
            <span className={`text-xs font-black ${theme.ui.subheadingText}`}>· 36 Hours</span>
          </h2>
          <p className={`text-xs font-semibold ${theme.ui.secondaryText} mt-0.5`}>
            Tap any hour to explore temperature shifts, rain chances, and outdoor timing
          </p>
        </div>

        {/* Segmented View Mode Tabs & Scroll Chevrons */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 p-1.5 ${theme.ui.controlTrack} rounded-2xl text-xs font-bold shadow-sm`}>
            <button
              type="button"
              onClick={() => setMetricView('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                metricView === 'all'
                  ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-sm font-black scale-102`
                  : `${theme.ui.inactivePillText}`
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setMetricView('rain')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                metricView === 'rain'
                  ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-sm font-black scale-102`
                  : `${theme.ui.inactivePillText}`
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Rain %</span>
            </button>
            <button
              type="button"
              onClick={() => setMetricView('wind')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                metricView === 'wind'
                  ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-sm font-black scale-102`
                  : `${theme.ui.inactivePillText}`
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Wind</span>
            </button>
            <button
              type="button"
              onClick={() => setMetricView('uv')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                metricView === 'uv'
                  ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-sm font-black scale-102`
                  : `${theme.ui.inactivePillText}`
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>UV</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => scroll('left')}
              className={`p-2.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} ${theme.ui.primaryText} cursor-pointer transition-transform active:scale-90 shadow-sm`}
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className={`p-2.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} ${theme.ui.primaryText} cursor-pointer transition-transform active:scale-90 shadow-sm`}
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrubbable Horizontal Timeline Cards (Each slot is a custom illustrated miniature vignette) */}
      <div 
        ref={scrollContainerRef}
        className="relative z-10 flex items-stretch gap-3 overflow-x-auto pb-4 pt-1.5 scrollbar-thin"
      >
        {next24.map((item, idx) => {
          const dateObj = new Date(item.time);
          const hourLabel = idx === 0 ? 'Now' : dateObj.toLocaleTimeString([], { hour: 'numeric' });
          const isSelected = selectedHourTime === item.time;
          const wmo = decodeWmoCode(item.weatherCode);

          return (
            <div
              key={item.time}
              role="button"
              tabIndex={0}
              onClick={() => onSelectHour && onSelectHour(item)}
              className={`group relative overflow-hidden flex flex-col items-center justify-between min-w-[92px] sm:min-w-[98px] p-3.5 rounded-[26px] transition-all cursor-pointer select-none ${
                isSelected
                  ? `${theme.ui.tileActiveSurface} ${theme.ui.tileActiveBorder} ${theme.ui.activePillText} shadow-xl scale-105 -translate-y-1`
                  : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} hover:-translate-y-0.5 shadow-md`
              }`}
            >
              {/* Miniature Thematic Illustration Vignette */}
              <ThemeTileArt theme={theme} variant="pill" index={idx} active={isSelected} />

              {/* Hour time */}
              <div className="relative z-10 text-center">
                <span className={`text-xs font-black block ${
                  isSelected ? 'text-amber-100' : idx === 0 ? theme.ui.accentText : theme.ui.primaryText
                }`}>
                  {hourLabel}
                </span>
                <span className={`text-[10px] ${isSelected ? 'text-amber-100/90' : theme.ui.secondaryText} block font-mono font-bold`}>
                  {dateObj.toLocaleDateString([], { weekday: 'short' })}
                </span>
              </div>

              {/* Temperature & Condition */}
              <div className="relative z-10 my-2 text-center">
                <span className={`text-lg font-black ${isSelected ? 'text-amber-50' : theme.ui.primaryText} font-mono tabular-nums block drop-shadow-xs`}>
                  {formatTemp(item.temperature, unit)}
                </span>
                <span className={`block text-[10px] ${isSelected ? 'text-amber-100' : theme.ui.secondaryText} font-bold truncate max-w-[82px]`} title={wmo.description}>
                  {wmo.description}
                </span>
              </div>

              {/* Dynamic View-Dependent Metric Slot */}
              {metricView === 'rain' || (metricView === 'all' && item.precipitationProbability > 15) ? (
                /* Rain Column Bar */
                <div className="relative z-10 w-full flex flex-col items-center gap-1">
                  <div className={`w-full ${theme.ui.controlTrack} h-10 rounded-xl overflow-hidden flex flex-col justify-end p-0.5 shadow-inner`}>
                    <div 
                      className="w-full bg-gradient-to-t from-sky-400 via-cyan-400 to-blue-500 rounded-lg transition-all duration-300 shadow-sm"
                      style={{ height: `${Math.max(12, item.precipitationProbability)}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-black ${isSelected ? 'text-amber-50' : theme.ui.accentText} font-mono`}>
                    {item.precipitationProbability}%
                  </span>
                </div>
              ) : metricView === 'wind' ? (
                /* Wind Vector Slot */
                <div className="relative z-10 w-full flex flex-col items-center gap-1 pt-1">
                  <Navigation 
                    className={`w-4 h-4 ${isSelected ? 'text-amber-100' : theme.ui.accentText} transition-transform drop-shadow`}
                    style={{ transform: `rotate(${item.windDirection}deg)` }}
                  />
                  <span className={`text-[10px] font-black ${isSelected ? 'text-amber-50' : theme.ui.primaryText} font-mono`}>
                    {Math.round(item.windSpeed)}
                  </span>
                </div>
              ) : metricView === 'uv' ? (
                /* UV Index Slot */
                <div className="relative z-10 w-full flex flex-col items-center gap-1">
                  <div className={`text-xs font-black font-mono ${item.uvIndex >= 6 ? 'text-rose-500' : item.uvIndex >= 3 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {item.uvIndex.toFixed(0)} UV
                  </div>
                  <span className={`text-[9px] ${isSelected ? 'text-amber-100' : theme.ui.secondaryText} font-black`}>
                    {item.uvIndex >= 6 ? 'High' : item.uvIndex >= 3 ? 'Mod' : 'Low'}
                  </span>
                </div>
              ) : (
                /* Overview Slot: Humidity & Wind */
                <div className={`relative z-10 flex flex-col items-center gap-1 pt-1 text-[10px] ${isSelected ? 'text-amber-50' : theme.ui.primaryText}`}>
                  <div className="flex items-center gap-0.5">
                    <Droplets className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-200' : theme.ui.accentText}`} />
                    <span className="font-mono font-black">{item.relativeHumidity}%</span>
                  </div>
                  <span className={`font-mono text-[9px] font-bold ${isSelected ? 'text-amber-100' : theme.ui.secondaryText}`}>
                    {Math.round(item.windSpeed)} km/h
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
