import React, { useState } from 'react';
import {
  Plane,
  Compass,
  Wind,
  Eye,
  Cloud,
  Gauge,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { WeatherData } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface AviationMetarDeckProps {
  weather: WeatherData;
}

const RUNWAY_HEADINGS = [
  { id: '09', deg: 90, label: 'RWY 09 (090° E)' },
  { id: '18', deg: 180, label: 'RWY 18 (180° S)' },
  { id: '24', deg: 240, label: 'RWY 24 (240° WSW)' },
  { id: '27', deg: 270, label: 'RWY 27 (270° W)' },
  { id: '36', deg: 360, label: 'RWY 36 (360° N)' }
];

export function AviationMetarDeck({ weather }: AviationMetarDeckProps) {
  const { theme } = useWeatherTheme();
  const [selectedRwyDeg, setSelectedRwyDeg] = useState<number>(270);

  const cur = weather.current;
  const hr0 = weather.hourly[0];
  const dewPointC = hr0?.dewPoint ?? cur.temperature - 4;
  const visibilityKm = hr0?.visibility ?? 10;
  const visibilitySm = Math.round(visibilityKm * 0.621371 * 10) / 10;

  // Estimate Cloud Base / Ceiling Height in Feet AGL from Temp-DewPoint Spread (Espy's equation: Spread°C * 400 ft)
  const spreadC = Math.max(0.5, cur.temperature - dewPointC);
  const rawCloudBaseFt = Math.round((spreadC * 400) / 100) * 100;
  const ceilingFt =
    cur.cloudCover >= 55 ? Math.max(400, Math.min(12000, rawCloudBaseFt)) : 12000;

  // Flight Category (VFR / MVFR / IFR / LIFR)
  const flightCategory: 'VFR' | 'MVFR' | 'IFR' | 'LIFR' =
    ceilingFt < 500 || visibilitySm < 1
      ? 'LIFR'
      : ceilingFt < 1000 || visibilitySm < 3
      ? 'IFR'
      : ceilingFt <= 3000 || visibilitySm <= 5
      ? 'MVFR'
      : 'VFR';

  const catBadge = {
    VFR: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    MVFR: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    IFR: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    LIFR: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40'
  }[flightCategory];

  // Wind in Knots & Runway Crosswind/Headwind Vector Math
  const windKt = Math.round(cur.windSpeed * 0.539957);
  const gustKt = Math.round(cur.windGusts * 0.539957);
  const angleDiffRad = ((cur.windDirection - selectedRwyDeg) * Math.PI) / 180;
  const headwindKt = Math.round(windKt * Math.cos(angleDiffRad));
  const crosswindKt = Math.round(Math.abs(windKt * Math.sin(angleDiffRad)));
  const crosswindSide = Math.sin(angleDiffRad) >= 0 ? 'Right' : 'Left';

  // Density Altitude (ft) approximation
  const fieldElevFt = Math.round((weather.location.elevation || 35) * 3.28084);
  const isaTempC = 15 - (fieldElevFt / 1000) * 2;
  const densityAltitudeFt = Math.round(fieldElevFt + 120 * (cur.temperature - isaTempC));

  // Synthesize ICAO-style METAR string
  const stationCode = `E${weather.location.name
    .replace(/[^A-Za-z]/g, '')
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, 'X')}`;
  const dayHrMin = `${String(new Date().getUTCDate()).padStart(2, '0')}${String(
    new Date().getUTCHours()
  ).padStart(2, '0')}50Z`;
  const windDirStr = String(Math.round(cur.windDirection / 10) * 10).padStart(3, '0');
  const windKtStr = String(windKt).padStart(2, '0');
  const gustPart = gustKt - windKt >= 5 ? `G${String(gustKt).padStart(2, '0')}` : '';
  const visMeters = Math.min(9999, Math.round(visibilityKm * 1000));
  const cloudCode =
    cur.cloudCover < 15
      ? 'CAVOK'
      : `${cur.cloudCover >= 75 ? 'OVC' : cur.cloudCover >= 50 ? 'BKN' : 'SCT'}${String(
          Math.min(999, Math.round(rawCloudBaseFt / 100))
        ).padStart(3, '0')}`;
  const formatMetarTemp = (val: number) => {
    const r = Math.round(val);
    return r < 0 ? `M${String(Math.abs(r)).padStart(2, '0')}` : String(r).padStart(2, '0');
  };
  const qnhStr = `Q${Math.round(cur.pressureMsl || 1013)}`;
  const rawMetar = `${stationCode} ${dayHrMin} ${windDirStr}${windKtStr}${gustPart}KT ${visMeters} ${cloudCode} ${formatMetarTemp(
    cur.temperature
  )}/${formatMetarTemp(dewPointC)} ${qnhStr} NOSIG`;

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
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black ${theme.ui.primaryText}`}>
              Aviation METAR / TAF &amp; Runway Crosswind Deck
            </h2>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              Decoded aerodrome flight rules, cloud ceiling AGL, density altitude, and runway wind vector resolver
            </p>
          </div>
        </div>

        <span
          className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-black self-start sm:self-auto ${catBadge}`}
        >
          Flight Rules: {flightCategory}
        </span>
      </div>

      {/* Raw METAR Teletype Strip */}
      <div
        className={`relative z-10 p-4 rounded-2xl bg-slate-950/75 border border-sky-500/30 font-mono text-xs sm:text-sm text-sky-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2`}
      >
        <div>
          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
            LIVE SYNOPTIC METAR TELETYPE
          </span>
          <span className="font-black tracking-wide break-all">{rawMetar}</span>
        </div>
        <span className="text-[11px] text-emerald-400 font-bold shrink-0">
          Altimeter {(cur.pressureMsl * 0.02953).toFixed(2)} inHg
        </span>
      </div>

      {/* 4 Aviation Telemetry Cards */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={0} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} flex items-center gap-1`}>
            <Cloud className="w-3.5 h-3.5 text-sky-400" />
            Cloud Base / Ceiling
          </span>
          <span className={`relative z-10 text-xl font-black font-mono tabular-nums ${theme.ui.primaryText} mt-1 block`}>
            {rawCloudBaseFt.toLocaleString()} ft AGL
          </span>
          <span className={`relative z-10 text-[10px] font-mono ${theme.ui.secondaryText} block`}>
            Spread: {spreadC.toFixed(1)}°C ({cur.cloudCover}% Sky)
          </span>
        </div>

        <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={1} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} flex items-center gap-1`}>
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            Horizontal Visibility
          </span>
          <span className={`relative z-10 text-xl font-black font-mono tabular-nums ${theme.ui.primaryText} mt-1 block`}>
            {visibilitySm} SM ({visibilityKm.toFixed(0)} km)
          </span>
          <span className={`relative z-10 text-[10px] font-mono ${theme.ui.secondaryText} block`}>
            {visibilitySm >= 6 ? 'Unrestricted VFR' : 'Reduced Horizon Haze'}
          </span>
        </div>

        <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={2} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} flex items-center gap-1`}>
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            Density Altitude
          </span>
          <span className={`relative z-10 text-xl font-black font-mono tabular-nums ${theme.ui.primaryText} mt-1 block`}>
            {densityAltitudeFt.toLocaleString()} ft
          </span>
          <span className={`relative z-10 text-[10px] font-mono ${theme.ui.secondaryText} block`}>
            Field Elev: {fieldElevFt} ft MSL
          </span>
        </div>

        <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={3} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} flex items-center gap-1`}>
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            Surface Wind (Knots)
          </span>
          <span className={`relative z-10 text-xl font-black font-mono tabular-nums ${theme.ui.primaryText} mt-1 block`}>
            {windDirStr}° @ {windKt} kt
          </span>
          <span className={`relative z-10 text-[10px] font-mono ${theme.ui.secondaryText} block`}>
            Peak Gusts: {gustKt} kt
          </span>
        </div>
      </div>

      {/* Interactive Runway Crosswind Calculator */}
      <div
        className={`relative z-10 p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex flex-col lg:flex-row lg:items-center justify-between gap-4`}
      >
        <div className="space-y-1.5">
          <span className={`text-xs font-black ${theme.ui.primaryText} flex items-center gap-1.5`}>
            <Compass className="w-4 h-4 text-sky-400" />
            Interactive Runway Crosswind &amp; Headwind Component Calculator
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {RUNWAY_HEADINGS.map((rwy) => (
              <button
                key={rwy.id}
                type="button"
                onClick={() => setSelectedRwyDeg(rwy.deg)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-black cursor-pointer transition-all ${
                  selectedRwyDeg === rwy.deg
                    ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                    : `${theme.ui.cardSurface} ${theme.ui.primaryText}`
                }`}
              >
                {rwy.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-mono text-xs shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/45 border border-white/10">
            <span className={`text-[10px] ${theme.ui.secondaryText} block`}>
              {headwindKt >= 0 ? 'Headwind Component' : 'Tailwind Component'}
            </span>
            <span
              className={`text-sm font-black ${
                headwindKt >= 0 ? 'text-emerald-400' : 'text-amber-300'
              }`}
            >
              {Math.abs(headwindKt)} kt {headwindKt >= 0 ? '(Favorable)' : '(Tailwind)'}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-950/45 border border-white/10">
            <span className={`text-[10px] ${theme.ui.secondaryText} block`}>
              Crosswind ({crosswindSide})
            </span>
            <span
              className={`text-sm font-black flex items-center gap-1 ${
                crosswindKt >= 18 ? 'text-rose-400' : 'text-sky-300'
              }`}
            >
              {crosswindKt >= 18 ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              {crosswindKt} kt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
