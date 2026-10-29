import React, { useState } from 'react';
import { 
  CloudRain, 
  Wind, 
  Sun, 
  ChevronDown, 
  ChevronUp, 
  Sunrise, 
  Sunset,
  Calendar
} from 'lucide-react';
import { DailyForecastItem, TempUnit } from '../../types/weather';
import { formatTemp, decodeWmoCode } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface DailyForecastOutlookProps {
  daily: DailyForecastItem[];
  unit: TempUnit;
}

export function DailyForecastOutlook({ daily, unit }: DailyForecastOutlookProps) {
  const { theme } = useWeatherTheme();
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Calculate global min and max temperature across all days for proportional range bar
  const globalMin = Math.min(...daily.map(d => d.temperatureMin));
  const globalMax = Math.max(...daily.map(d => d.temperatureMax));
  const tempRange = Math.max(1, globalMax - globalMin);

  const toggleExpand = (date: string) => {
    setExpandedDate(prev => (prev === date ? null : date));
  };

  return (
    <div className={`relative w-full rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 space-y-4 overflow-hidden transition-all duration-300`}>
      
      {/* Wrapped Thematic Scenic Artwork & Corner Filigrees */}
      <ThemeCardArtWrapper theme={theme} variant="daily" />

      {/* Top Iridescent Specular Glass Rim */}
      <div 
        aria-hidden="true" 
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} 
      />

      <div className={`relative z-10 flex items-center justify-between border-b ${theme.ui.dividerBorder} pb-3.5`}>
        <div>
          <h2 className={`text-base font-black ${theme.ui.primaryText} flex items-center gap-2`}>
            <span className={`p-1.5 rounded-xl ${theme.ui.badgeBg} ${theme.ui.accentText} border ${theme.ui.badgeBorder}`}>
              <Calendar className="w-4 h-4" />
            </span>
            <span>10-Day Extended Meteorological Outlook</span>
          </h2>
          <p className={`text-xs font-semibold ${theme.ui.secondaryText} mt-0.5`}>
            Synoptic trend, precipitation probability, and diurnal thermal bounds
          </p>
        </div>
        <span className={`text-xs font-mono font-black px-3 py-1 rounded-full ${theme.ui.badgeBg} ${theme.ui.badgeBorder} ${theme.ui.badgeText} border`}>
          {daily.length} Days
        </span>
      </div>

      <div className="relative z-10 space-y-2.5">
        {daily.map((day, idx) => {
          const dateObj = new Date(day.date);
          const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dateObj.toLocaleDateString([], { weekday: 'long' });
          const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
          const wmo = decodeWmoCode(day.weatherCode);
          const isExpanded = expandedDate === day.date;

          // Bar math
          const leftPercent = ((day.temperatureMin - globalMin) / tempRange) * 100;
          const widthPercent = Math.max(8, ((day.temperatureMax - day.temperatureMin) / tempRange) * 100);

          return (
            <div 
              key={day.date}
              className={`group relative overflow-hidden rounded-[26px] transition-all duration-200 ${
                isExpanded 
                  ? `${theme.ui.tileSurface} ${theme.ui.cardBorder} ring-2 ring-amber-400/50 shadow-lg` 
                  : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} shadow-md`
              }`}
            >
              {/* Miniature Thematic Illustration Vignette for every Daily Row */}
              <ThemeTileArt theme={theme} variant="row" index={idx} active={isExpanded} />

              {/* Row Summary */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleExpand(day.date)}
                className="relative z-10 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                {/* Day name & weather description */}
                <div className="flex items-center gap-3 sm:w-52 shrink-0">
                  <div className="min-w-0">
                    <span className={`font-black text-sm ${theme.ui.primaryText} block`}>
                      {dayName}
                    </span>
                    <span className={`text-[11px] ${theme.ui.secondaryText} font-mono font-bold block truncate`}>
                      {formattedDate} · {wmo.description}
                    </span>
                  </div>
                </div>

                {/* Rain probability chip */}
                <div className="flex items-center gap-1.5 sm:w-28 shrink-0 text-xs">
                  {day.precipitationProbabilityMax > 10 ? (
                    <span className={`flex items-center gap-1 ${theme.ui.accentText} font-black font-mono`}>
                      <CloudRain className="w-3.5 h-3.5" />
                      <span>{day.precipitationProbabilityMax}%</span>
                      {day.precipitationSum > 0 && (
                        <span className={`text-[10px] ${theme.ui.secondaryText} font-bold`}>
                          ({day.precipitationSum.toFixed(1)}mm)
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className={`${theme.ui.subheadingText} text-[11px] font-mono font-black`}>
                      Dry (&lt;10%)
                    </span>
                  )}
                </div>

                {/* Relative Temperature Range Bar */}
                <div className="flex-1 flex items-center gap-3 min-w-[140px]">
                  <span className={`text-xs font-mono font-bold ${theme.ui.secondaryText} w-8 text-right tabular-nums`}>
                    {formatTemp(day.temperatureMin, unit)}
                  </span>
                  
                  <div className={`flex-1 h-3 rounded-full ${theme.ui.controlTrack} overflow-hidden relative shadow-inner`}>
                    <div 
                      className={`h-full rounded-full ${theme.ui.activePill} absolute shadow-sm`}
                      style={{
                        left: `${Math.max(0, leftPercent)}%`,
                        width: `${Math.min(100 - leftPercent, widthPercent)}%`
                      }}
                    />
                  </div>

                  <span className={`text-xs font-mono font-black ${theme.ui.primaryText} w-8 tabular-nums`}>
                    {formatTemp(day.temperatureMax, unit)}
                  </span>
                </div>

                {/* Expand Toggle */}
                <div className={`hidden sm:flex items-center justify-end w-6 ${theme.ui.accentText}`}>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded Breakdown */}
              {isExpanded && (
                <div className={`relative z-10 px-4 pb-4 pt-3 border-t ${theme.ui.dividerBorder} grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-fadeIn`}>
                  <div className={`relative overflow-hidden p-3 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1 shadow-md`}>
                    <ThemeTileArt theme={theme} variant="metric" index={0} />
                    <span className={`relative z-10 text-[10px] uppercase font-mono ${theme.ui.subheadingText} flex items-center gap-1 font-black`}>
                      <Wind className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
                      Max Wind Gust
                    </span>
                    <span className={`relative z-10 font-black text-sm ${theme.ui.primaryText} font-mono block`}>
                      {Math.round(day.windGustsMax)} km/h
                    </span>
                    <span className={`relative z-10 text-[10px] font-semibold ${theme.ui.secondaryText} block`}>
                      Sustained {Math.round(day.windSpeedMax)} km/h
                    </span>
                  </div>

                  <div className={`relative overflow-hidden p-3 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1 shadow-md`}>
                    <ThemeTileArt theme={theme} variant="metric" index={1} />
                    <span className={`relative z-10 text-[10px] uppercase font-mono ${theme.ui.subheadingText} flex items-center gap-1 font-black`}>
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      UV Peak
                    </span>
                    <span className={`relative z-10 font-black text-sm ${theme.ui.primaryText} font-mono block`}>
                      Index {day.uvIndexMax.toFixed(1)}
                    </span>
                    <span className={`relative z-10 text-[10px] font-semibold ${theme.ui.secondaryText} block`}>
                      {day.uvIndexMax >= 6 ? 'Sun protection advised' : 'Gentle sunshine'}
                    </span>
                  </div>

                  <div className={`relative overflow-hidden p-3 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1 shadow-md`}>
                    <ThemeTileArt theme={theme} variant="metric" index={2} />
                    <span className={`relative z-10 text-[10px] uppercase font-mono ${theme.ui.subheadingText} flex items-center gap-1 font-black`}>
                      <Sunrise className="w-3.5 h-3.5 text-amber-500" />
                      Morning Light
                    </span>
                    <span className={`relative z-10 font-black text-sm ${theme.ui.primaryText} font-mono block`}>
                      {new Date(day.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`relative z-10 text-[10px] font-semibold ${theme.ui.secondaryText} block`}>
                      Early sunrise
                    </span>
                  </div>

                  <div className={`relative overflow-hidden p-3 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1 shadow-md`}>
                    <ThemeTileArt theme={theme} variant="metric" index={3} />
                    <span className={`relative z-10 text-[10px] uppercase font-mono ${theme.ui.subheadingText} flex items-center gap-1 font-black`}>
                      <Sunset className="w-3.5 h-3.5 text-rose-500" />
                      Golden Hour
                    </span>
                    <span className={`relative z-10 font-black text-sm ${theme.ui.primaryText} font-mono block`}>
                      {new Date(day.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`relative z-10 text-[10px] font-semibold ${theme.ui.secondaryText} block`}>
                      Sunset bliss
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
