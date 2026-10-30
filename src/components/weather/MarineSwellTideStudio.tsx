import React, { useEffect, useState } from 'react';
import {
  Waves,
  Compass,
  Thermometer,
  Clock,
  Anchor,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { WeatherData, MarineTelemetryData, TempUnit } from '../../types/weather';
import {
  fetchMarineTelemetry,
  formatTempWithUnit,
  getWindCompassDirection
} from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface MarineSwellTideStudioProps {
  weather: WeatherData;
  unit?: TempUnit;
}

export function MarineSwellTideStudio({
  weather,
  unit = 'celsius'
}: MarineSwellTideStudioProps) {
  const { theme } = useWeatherTheme();
  const [marine, setMarine] = useState<MarineTelemetryData | null>(null);

  useEffect(() => {
    let active = true;
    fetchMarineTelemetry(
      weather.location.latitude,
      weather.location.longitude,
      weather.current.temperature,
      weather.current.windSpeed,
      weather.current.windDirection
    ).then((res) => {
      if (active) setMarine(res);
    });
    return () => {
      active = false;
    };
  }, [
    weather.location.latitude,
    weather.location.longitude,
    weather.current.temperature,
    weather.current.windSpeed,
    weather.current.windDirection
  ]);

  if (!marine) return null;

  return (
    <div
      className={`relative w-full rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden space-y-6`}
    >
      <ThemeCardArtWrapper theme={theme} variant="standard" />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`}
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black ${theme.ui.primaryText}`}>
              Marine Swell, Harmonic Tide &amp; Surf Telemetry
            </h2>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              {marine.isCoastalOrMarine
                ? 'Live Open-Meteo Marine Buoy & Swell Model + M2 Lunar Tide Cycle'
                : 'Regional Coastal Wave & Semidiurnal M2 Harmonic Tide Reference'}
            </p>
          </div>
        </div>

        <div className={`px-3.5 py-1.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} text-xs font-black font-mono text-cyan-300`}>
          Surf Condition: {marine.surfRating}
        </div>
      </div>

      {/* Primary Marine & Tide Metrics */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className={`relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={0} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} block`}>
            Significant Wave
          </span>
          <span className={`relative z-10 text-lg font-black font-mono tabular-nums ${theme.ui.primaryText}`}>
            {marine.waveHeightM} m
          </span>
          <span className={`relative z-10 text-[10px] font-mono ${theme.ui.secondaryText} block`}>
            Period: {marine.wavePeriodS}s
          </span>
        </div>

        <div className={`relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={1} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} block`}>
            Primary Swell
          </span>
          <span className="relative z-10 text-lg font-black font-mono tabular-nums text-cyan-300">
            {marine.swellHeightM} m
          </span>
          <span className={`relative z-10 text-[10px] font-mono ${theme.ui.secondaryText} block`}>
            {marine.swellPeriodS}s · {getWindCompassDirection(marine.swellDirectionDeg)}
          </span>
        </div>

        <div className={`relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={2} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} block`}>
            Swell Bearing
          </span>
          <span className={`relative z-10 text-lg font-black font-mono tabular-nums ${theme.ui.primaryText} flex items-center gap-1`}>
            <Compass className="w-4 h-4 text-sky-400" />
            {marine.swellDirectionDeg}°
          </span>
          <span className={`relative z-10 text-[10px] font-mono ${theme.ui.secondaryText} block`}>
            {getWindCompassDirection(marine.swellDirectionDeg)} Swell Train
          </span>
        </div>

        <div className={`relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={3} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} block`}>
            Water Temp (SST)
          </span>
          <span className={`relative z-10 text-lg font-black font-mono tabular-nums ${theme.ui.primaryText} flex items-center gap-1`}>
            <Thermometer className="w-4 h-4 text-emerald-400" />
            {formatTempWithUnit(marine.seaSurfaceTempC, unit)}
          </span>
          <span className={`relative z-10 text-[10px] font-mono ${theme.ui.secondaryText} block`}>
            {marine.seaSurfaceTempC < 14 ? '3/2mm–4/3mm Wetsuit' : 'Spring Suit / Rashguard'}
          </span>
        </div>

        <div className={`relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={4} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} flex items-center gap-1`}>
            <ArrowUp className="w-3 h-3 text-cyan-400" />
            Next High Tide
          </span>
          <span className={`relative z-10 text-sm font-black font-mono tabular-nums ${theme.ui.primaryText} mt-1 block`}>
            {marine.nextHighTide}
          </span>
          <span className={`relative z-10 text-[10px] font-mono ${theme.ui.secondaryText} block`}>
            Semidiurnal Peak
          </span>
        </div>

        <div className={`relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={5} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} flex items-center gap-1`}>
            <ArrowDown className="w-3 h-3 text-amber-400" />
            Next Low Tide
          </span>
          <span className={`relative z-10 text-sm font-black font-mono tabular-nums ${theme.ui.primaryText} mt-1 block`}>
            {marine.nextLowTide}
          </span>
          <span className={`relative z-10 text-[10px] font-mono ${theme.ui.secondaryText} block`}>
            Tidal Trough
          </span>
        </div>
      </div>

      {/* 24-Hour Harmonic Tide & Swell Height Curve */}
      <div
        className={`relative z-10 p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-2.5`}
      >
        <div className="flex items-center justify-between text-xs">
          <span className={`font-black ${theme.ui.primaryText} flex items-center gap-1.5`}>
            <Anchor className="w-3.5 h-3.5 text-cyan-400" />
            24-Hour Harmonic Tide Level (m) &amp; Swell Energy
          </span>
          <span className={`font-mono text-[10px] ${theme.ui.secondaryText} flex items-center gap-1`}>
            <Clock className="w-3 h-3" />
            12h 25m Lunar Cycle
          </span>
        </div>

        <div className="h-24 flex items-end justify-between gap-1.5 pt-3">
          {marine.hourlyWaves.slice(0, 16).map((item, idx) => {
            const tidePct = Math.max(15, Math.min(100, (item.tideHeightM / 4.0) * 100));
            const timeStr = item.time.includes('T')
              ? item.time.split('T')[1].slice(0, 5)
              : `${String(idx).padStart(2, '0')}:00`;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                {idx % 2 === 0 && (
                  <span className="text-[9px] font-mono font-bold text-cyan-300">
                    {item.tideHeightM.toFixed(1)}m
                  </span>
                )}
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-blue-600/80 via-cyan-500/80 to-teal-300/90 transition-all"
                  style={{ height: `${tidePct}%` }}
                />
                {idx % 2 === 0 && (
                  <span className={`text-[8px] font-mono ${theme.ui.secondaryText}`}>
                    {timeStr}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
