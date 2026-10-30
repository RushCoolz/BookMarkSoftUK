import React, { useEffect, useState } from 'react';
import {
  Layers,
  Wind,
  Zap,
  Thermometer
} from 'lucide-react';
import {
  WeatherData,
  AtmosphericSoundingData,
  TempUnit,
  SpeedUnit
} from '../../types/weather';
import {
  fetchUpperAirSounding,
  formatTempWithUnit,
  formatSpeed,
  getWindCompassDirection
} from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper } from './ThemeCardArtWrapper';

interface AtmosphericSoundingProfileProps {
  weather: WeatherData;
  unit: TempUnit;
  speedUnit: SpeedUnit;
}

export function AtmosphericSoundingProfile({
  weather,
  unit,
  speedUnit
}: AtmosphericSoundingProfileProps) {
  const { theme } = useWeatherTheme();
  const [sounding, setSounding] = useState<AtmosphericSoundingData | null>(null);

  useEffect(() => {
    let active = true;
    const dewPoint = weather.hourly[0]?.dewPoint ?? weather.current.temperature - 4;
    fetchUpperAirSounding(
      weather.location.latitude,
      weather.location.longitude,
      weather.current.temperature,
      dewPoint,
      weather.current.windSpeed,
      weather.current.windDirection
    ).then((res) => {
      if (active) setSounding(res);
    });
    return () => {
      active = false;
    };
  }, [
    weather.location.latitude,
    weather.location.longitude,
    weather.current.temperature,
    weather.current.windSpeed,
    weather.current.windDirection,
    weather.hourly
  ]);

  if (!sounding) return null;

  // Reverse so 250 hPa (top of troposphere) renders at top of sounding table
  const levelsTopDown = [...sounding.levels].reverse();

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
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md shrink-0`}
          >
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black ${theme.ui.primaryText}`}>
              Upper-Air Radiosonde Sounding Profile (1000 hPa &rarr; 250 hPa)
            </h2>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              Vertical tropospheric lapse rate, CAPE convective storm energy, and Jet Stream wind shear up to 34,000 ft
            </p>
          </div>
        </div>

        {/* CAPE & Jet Stream Summary Badges */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          <div className={`px-3 py-1.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
            <span className={`text-[10px] ${theme.ui.secondaryText} block`}>
              CAPE Instability
            </span>
            <span className={`font-black ${theme.ui.primaryText} flex items-center gap-1`}>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              {sounding.capeJkg} J/kg ({sounding.convectiveRisk})
            </span>
          </div>

          <div className={`px-3 py-1.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
            <span className={`text-[10px] ${theme.ui.secondaryText} block`}>
              250 hPa Jet Core
            </span>
            <span className="font-black text-cyan-300 flex items-center gap-1">
              <Wind className="w-3.5 h-3.5" />
              {formatSpeed(sounding.maxJetStreamKmh, speedUnit)}
            </span>
          </div>
        </div>
      </div>

      {/* Vertical Pressure-Altitude Column Rows */}
      <div className="relative z-10 space-y-2">
        {levelsTopDown.map((lvl) => {
          const windPct = Math.max(12, Math.min(100, (lvl.windSpeedKmh / 160) * 100));
          const isFreezing = lvl.temperatureC <= 0;
          return (
            <div
              key={lvl.pressureHpa}
              className={`p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} grid grid-cols-1 md:grid-cols-12 items-center gap-3`}
            >
              {/* Pressure & Altitude */}
              <div className="md:col-span-4 flex items-center justify-between md:justify-start gap-3">
                <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-slate-950/50 text-sky-300 shrink-0">
                  {lvl.altitudeM.toLocaleString()}m ({lvl.altitudeFt.toLocaleString()}ft)
                </span>
                <span className={`text-xs font-black ${theme.ui.primaryText} truncate`}>
                  {lvl.layerName}
                </span>
              </div>

              {/* Temperature & Dewpoint */}
              <div className="md:col-span-3 flex items-center gap-3 font-mono text-xs">
                <span
                  className={`font-black flex items-center gap-1 ${
                    isFreezing ? 'text-cyan-300' : 'text-amber-300'
                  }`}
                >
                  <Thermometer className="w-3.5 h-3.5" />
                  Temp: {formatTempWithUnit(lvl.temperatureC, unit)}
                </span>
                <span className={`text-[11px] ${theme.ui.secondaryText}`}>
                  Dew: {formatTempWithUnit(lvl.dewPointC, unit)}
                </span>
              </div>

              {/* Upper-Level Wind Bar */}
              <div className="md:col-span-5 flex items-center gap-3">
                <div className="flex-1 h-2.5 rounded-full bg-slate-950/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400"
                    style={{ width: `${windPct}%` }}
                  />
                </div>
                <span className={`text-xs font-mono font-black ${theme.ui.primaryText} w-28 text-right shrink-0`}>
                  {formatSpeed(lvl.windSpeedKmh, speedUnit)}{' '}
                  <span className={`text-[10px] ${theme.ui.secondaryText}`}>
                    {getWindCompassDirection(lvl.windDirectionDeg)}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
