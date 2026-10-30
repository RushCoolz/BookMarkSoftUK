import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Sun,
  Camera,
  Activity,
  Compass,
  Clock,
  Eye
} from 'lucide-react';
import { WeatherData, SpaceWeatherTelemetry } from '../../types/weather';
import { fetchSpaceWeatherTelemetry } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface AuroraSpaceWeatherProps {
  weather: WeatherData;
}

function addMins(timeStr: string, mins: number): string {
  const part = timeStr.includes('T') ? timeStr.split('T')[1] : timeStr;
  const [h, m] = part.split(':').map((n) => parseInt(n, 10));
  if (isNaN(h) || isNaN(m)) return '06:00';
  const total = (((h * 60 + m + mins) % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function AuroraSpaceWeather({ weather }: AuroraSpaceWeatherProps) {
  const { theme } = useWeatherTheme();
  const [spaceWx, setSpaceWx] = useState<SpaceWeatherTelemetry | null>(null);
  const [subjectHeightM, setSubjectHeightM] = useState<number>(1.75);
  const [solarElevSlider, setSolarElevSlider] = useState<number>(18);

  useEffect(() => {
    let mounted = true;
    fetchSpaceWeatherTelemetry(
      weather.location.latitude,
      weather.current.cloudCover
    ).then((res) => {
      if (mounted) setSpaceWx(res);
    });
    return () => {
      mounted = false;
    };
  }, [weather.location.latitude, weather.current.cloudCover]);

  const today = weather.daily[0];
  const sunriseStr = today?.sunrise ? today.sunrise.split('T')[1]?.slice(0, 5) || '06:30' : '06:30';
  const sunsetStr = today?.sunset ? today.sunset.split('T')[1]?.slice(0, 5) || '18:30' : '18:30';

  // Precision Twilight Windows
  const astroDawn = addMins(sunriseStr, -92);
  const nauticalDawn = addMins(sunriseStr, -60);
  const civilDawn = addMins(sunriseStr, -28);
  const civilDusk = addMins(sunsetStr, 28);
  const nauticalDusk = addMins(sunsetStr, 60);
  const astroDusk = addMins(sunsetStr, 92);

  // Cloud-Layer Sunset Vividness Score (High cirrus catches afterglow; thick low stratus blocks horizon)
  const curHour = weather.hourly[0];
  const lowCloud = curHour?.cloudCoverLow ?? Math.round(weather.current.cloudCover * 0.5);
  const midCloud = curHour?.cloudCoverMid ?? Math.round(weather.current.cloudCover * 0.4);
  const highCloud = curHour?.cloudCoverHigh ?? Math.round(weather.current.cloudCover * 0.35);

  const highBonus = highCloud >= 20 && highCloud <= 65 ? 28 : highCloud > 65 ? 12 : 8;
  const midBonus = midCloud >= 15 && midCloud <= 50 ? 18 : 6;
  const lowPenalty = lowCloud * 0.52;
  const sunsetVividnessScore = Math.max(
    12,
    Math.min(98, Math.round(58 + highBonus + midBonus - lowPenalty))
  );

  const vividnessLabel =
    sunsetVividnessScore >= 78
      ? 'Epic Crimson & Magenta Afterglow'
      : sunsetVividnessScore >= 55
      ? 'Warm Golden-Amber Horizon'
      : 'Muted Pastel / Diffused Twilight';

  // Shadow Length & Color Temperature from Solar Elevation Angle
  const radElev = (Math.max(2, solarElevSlider) * Math.PI) / 180;
  const shadowLengthM = Math.round((subjectHeightM / Math.tan(radElev)) * 100) / 100;
  const kelvinTemp =
    solarElevSlider <= 4
      ? 2400
      : solarElevSlider <= 12
      ? 3200
      : solarElevSlider <= 25
      ? 4500
      : 5600;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT 6 COLS: NOAA SWPC Aurora & Geomagnetic Space Weather Watch */}
      <div
        className={`lg:col-span-6 relative rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden flex flex-col justify-between gap-5`}
      >
        <ThemeCardArtWrapper theme={theme} variant="standard" />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`}
        />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 text-slate-950 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-black ${theme.ui.primaryText}`}>
                Aurora &amp; NOAA Space Weather Watch
              </h2>
              <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                Planetary Kp-index, solar wind speed, and IMF Bz magnetic orientation
              </p>
            </div>
          </div>
          {spaceWx && (
            <span className={`text-xs font-mono font-black ${theme.ui.accentText}`}>
              {spaceWx.kpScale}
            </span>
          )}
        </div>

        {spaceWx && (
          <>
            {/* Kp Gauge + Solar Wind Telemetry Tiles */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
                  Planetary Kp
                </span>
                <span className="text-xl font-black font-mono tabular-nums text-emerald-400">
                  Kp {spaceWx.kpIndex.toFixed(1)}
                </span>
                <span className={`text-[10px] font-semibold ${theme.ui.secondaryText} block`}>
                  0–9 Scale
                </span>
              </div>

              <div className={`p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
                  Solar Wind
                </span>
                <span className={`text-xl font-black font-mono tabular-nums ${theme.ui.primaryText}`}>
                  {spaceWx.solarWindSpeedKms}
                </span>
                <span className={`text-[10px] font-semibold ${theme.ui.secondaryText} block`}>
                  km/s ({spaceWx.solarWindDensity} p/cm³)
                </span>
              </div>

              <div className={`p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
                  IMF Bz Tilt
                </span>
                <span
                  className={`text-xl font-black font-mono tabular-nums ${
                    spaceWx.bzNt < 0 ? 'text-emerald-400' : 'text-amber-300'
                  }`}
                >
                  {spaceWx.bzNt > 0 ? `+${spaceWx.bzNt}` : spaceWx.bzNt} nT
                </span>
                <span className={`text-[10px] font-semibold ${theme.ui.secondaryText} block`}>
                  {spaceWx.bzNt < 0 ? 'Southward (Auroral)' : 'Northward Shield'}
                </span>
              </div>

              <div className={`p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
                  Local Aurora Odds
                </span>
                <span className="text-xl font-black font-mono tabular-nums text-cyan-300">
                  {spaceWx.localVisibilityPct}%
                </span>
                <span className={`text-[10px] font-semibold ${theme.ui.secondaryText} block`}>
                  Oval &ge; {spaceWx.auroraLatitudeThreshold}° Lat
                </span>
              </div>
            </div>

            {/* 24-Hour Kp Geomagnetic Bar Chart */}
            <div
              className={`relative z-10 p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-2`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className={`font-black ${theme.ui.primaryText} flex items-center gap-1.5`}>
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  3-Hourly Planetary Kp-Index Telemetry
                </span>
                <span className={`font-mono text-[10px] ${theme.ui.secondaryText}`}>
                  Your Lat: {Math.abs(weather.location.latitude).toFixed(1)}°
                  {weather.location.latitude >= 0 ? 'N' : 'S'}
                </span>
              </div>

              <div className="h-24 flex items-end justify-between gap-2 pt-2">
                {spaceWx.forecast24h.map((bar, idx) => {
                  const pct = Math.max(15, Math.min(100, (bar.kp / 9) * 100));
                  const barColor =
                    bar.kp >= 5
                      ? 'from-rose-500 to-amber-400'
                      : bar.kp >= 4
                      ? 'from-amber-400 to-emerald-400'
                      : 'from-emerald-500 to-cyan-400';
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-emerald-300">
                        {bar.kp.toFixed(1)}
                      </span>
                      <div
                        className={`w-full rounded-t-lg bg-gradient-to-t ${barColor} transition-all`}
                        style={{ height: `${pct}%` }}
                      />
                      <span className={`text-[9px] font-mono ${theme.ui.secondaryText}`}>
                        {bar.timeLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT 6 COLS: Golden Hour, Twilight Phases & Photography Shadow Calculator */}
      <div
        className={`lg:col-span-6 relative rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden flex flex-col justify-between gap-5`}
      >
        <ThemeCardArtWrapper theme={theme} variant="standard" />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`}
        />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-amber-50 flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-black ${theme.ui.primaryText}`}>
                Golden Hour &amp; Photography Light Calculator
              </h2>
              <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                Cloud-deck sunset vividness scoring, twilight phases, and shadow length geometry
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-black text-amber-400">
            Vividness: {sunsetVividnessScore}/100
          </span>
        </div>

        {/* Sunset Vividness & Cloud-Layer Breakdown */}
        <div
          className={`relative z-10 p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-2.5`}
        >
          <ThemeTileArt theme={theme} variant="banner" index={2} />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className={`text-xs font-black ${theme.ui.primaryText} block`}>
                {vividnessLabel}
              </span>
              <span className={`text-[11px] font-semibold ${theme.ui.secondaryText}`}>
                High Cirrus: {highCloud}% · Mid Altocumulus: {midCloud}% · Low Stratus: {lowCloud}%
              </span>
            </div>
            <span className="text-lg font-black font-mono text-amber-300">
              {sunsetVividnessScore}%
            </span>
          </div>
          <div className="relative z-10 h-2 w-full rounded-full bg-slate-900/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
              style={{ width: `${sunsetVividnessScore}%` }}
            />
          </div>
        </div>

        {/* Civil, Nautical & Astronomical Twilight Table */}
        <div className="relative z-10 grid grid-cols-3 gap-2.5 text-center">
          <div className={`p-3 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
            <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
              Civil Twilight (-6°)
            </span>
            <span className={`text-xs font-black font-mono ${theme.ui.primaryText} mt-0.5 block`}>
              {civilDawn} / {civilDusk}
            </span>
          </div>
          <div className={`p-3 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
            <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
              Nautical (-12°)
            </span>
            <span className={`text-xs font-black font-mono ${theme.ui.primaryText} mt-0.5 block`}>
              {nauticalDawn} / {nauticalDusk}
            </span>
          </div>
          <div className={`p-3 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
            <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
              Astronomical (-18°)
            </span>
            <span className={`text-xs font-black font-mono ${theme.ui.primaryText} mt-0.5 block`}>
              {astroDawn} / {astroDusk}
            </span>
          </div>
        </div>

        {/* Interactive Shadow Length & Color Temp Simulator */}
        <div
          className={`relative z-10 p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-3`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className={`font-black ${theme.ui.primaryText} flex items-center gap-1.5`}>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Solar Angle Shadow &amp; Color Temperature Explorer
            </span>
            <span className="font-mono font-bold text-amber-300">{kelvinTemp}K Light</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className={theme.ui.secondaryText}>Solar Elevation: {solarElevSlider}°</span>
                <span className={theme.ui.secondaryText}>Subject: {subjectHeightM}m</span>
              </div>
              <input
                type="range"
                min="3"
                max="65"
                value={solarElevSlider}
                onChange={(e) => setSolarElevSlider(parseInt(e.target.value, 10))}
                className="w-full h-2 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-950/40 border border-white/10">
              <div>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
                  Cast Shadow Length
                </span>
                <span className="text-base font-black font-mono tabular-nums text-amber-300">
                  {shadowLengthM} m
                </span>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
                  Shadow Ratio
                </span>
                <span className={`text-xs font-black font-mono ${theme.ui.primaryText}`}>
                  {(shadowLengthM / subjectHeightM).toFixed(1)}x height
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
