import React from 'react';
import {
  Gauge,
  Activity,
  TrendingDown,
  TrendingUp,
  Minus,
  ShieldAlert,
  HeartPulse
} from 'lucide-react';
import { WeatherData } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface BarometricPhysiologyTrackerProps {
  weather: WeatherData;
}

export function BarometricPhysiologyTracker({ weather }: BarometricPhysiologyTrackerProps) {
  const { theme } = useWeatherTheme();

  const currentPressure = weather.current.pressureMsl || 1013.2;
  const hourlySlice = weather.hourly.slice(0, 24);
  const pressures = hourlySlice.map((h, idx) =>
    typeof h.pressureMsl === 'number'
      ? h.pressureMsl
      : Math.round((currentPressure + Math.sin(idx * 0.35) * 3.2) * 10) / 10
  );

  const p0 = pressures[0] ?? currentPressure;
  const p3 = pressures[3] ?? currentPressure;
  const p12 = pressures[12] ?? currentPressure;
  const delta3h = Math.round((p3 - p0) * 10) / 10;
  const delta12h = Math.round((p12 - p0) * 10) / 10;
  const maxAbsDelta = Math.max(Math.abs(delta3h), Math.abs(delta12h) * 0.5);

  const tendencyLabel =
    delta3h <= -2.5
      ? 'Rapid Barometric Drop'
      : delta3h < -0.6
      ? 'Falling Pressure'
      : delta3h >= 2.5
      ? 'Rapid Pressure Surge'
      : delta3h > 0.6
      ? 'Rising High Pressure'
      : 'Steady Isobaric Field';

  // Physiological Comfort Scores
  const migraineRisk =
    maxAbsDelta >= 3.0 || currentPressure < 998
      ? { level: 'Elevated Trigger', color: 'text-rose-400', detail: 'Rapid barometric gradient may trigger vascular pressure headaches.' }
      : maxAbsDelta >= 1.4
      ? { level: 'Moderate Sensitivity', color: 'text-amber-300', detail: 'Mild atmospheric pressure shift; stay hydrated.' }
      : { level: 'Low / Stable', color: 'text-emerald-400', detail: 'Stable isobaric conditions with minimal barometric stress.' };

  const sinusStatus =
    Math.abs(delta12h) >= 4.0 || weather.current.relativeHumidity > 85
      ? { level: 'Sinus Pressure Noticeable', color: 'text-amber-300', detail: 'Sinus cavity equalization may feel congested during frontal shift.' }
      : { level: 'Comfortable Equilibrium', color: 'text-emerald-400', detail: 'Balanced ambient air pressure and humidity.' };

  const jointComfort =
    currentPressure < 1004 || (delta3h < -1.2 && weather.current.temperature < 10)
      ? { level: 'Heightened Joint Stiffness', color: 'text-amber-300', detail: 'Low pressure + cool damp air can increase joint tissue expansion.' }
      : { level: 'Optimal Mobility', color: 'text-emerald-400', detail: 'Favorable barometric pressure for joint and muscle comfort.' };

  const minP = Math.min(...pressures) - 1;
  const maxP = Math.max(...pressures) + 1;
  const spanP = Math.max(4, maxP - minP);

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
          <div
            className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md`}
          >
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black ${theme.ui.primaryText}`}>
              Barometric Pressure Tendency &amp; Migraine / Sinus Forecast
            </h2>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              24-hour hPa isobaric curve tracking rapid pressure drops and physiological comfort
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3.5 py-2 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} text-right`}>
            <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
              Mean Sea-Level Pressure
            </span>
            <span className={`text-lg font-black font-mono tabular-nums ${theme.ui.primaryText}`}>
              {currentPressure.toFixed(1)} hPa
            </span>
          </div>
          <div className={`px-3.5 py-2 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} text-right`}>
            <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
              3-Hour Delta
            </span>
            <span
              className={`text-lg font-black font-mono tabular-nums flex items-center gap-1 ${
                delta3h < -1 ? 'text-amber-300' : delta3h > 1 ? 'text-cyan-300' : 'text-emerald-400'
              }`}
            >
              {delta3h < -0.3 ? (
                <TrendingDown className="w-4 h-4" />
              ) : delta3h > 0.3 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              {delta3h > 0 ? `+${delta3h}` : delta3h} hPa
            </span>
          </div>
        </div>
      </div>

      {/* 3 Physiological Comfort Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5`}>
          <ThemeTileArt theme={theme} variant="metric" index={0} />
          <div className="relative z-10 flex items-center justify-between">
            <span className={`text-xs font-black ${theme.ui.primaryText} flex items-center gap-1.5`}>
              <HeartPulse className="w-4 h-4 text-rose-400" />
              Migraine &amp; Vascular
            </span>
            <span className={`text-xs font-mono font-black ${migraineRisk.color}`}>
              {migraineRisk.level}
            </span>
          </div>
          <p className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
            {migraineRisk.detail}
          </p>
        </div>

        <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5`}>
          <ThemeTileArt theme={theme} variant="metric" index={1} />
          <div className="relative z-10 flex items-center justify-between">
            <span className={`text-xs font-black ${theme.ui.primaryText} flex items-center gap-1.5`}>
              <Activity className="w-4 h-4 text-cyan-400" />
              Sinus &amp; Inner Ear
            </span>
            <span className={`text-xs font-mono font-black ${sinusStatus.color}`}>
              {sinusStatus.level}
            </span>
          </div>
          <p className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
            {sinusStatus.detail}
          </p>
        </div>

        <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5`}>
          <ThemeTileArt theme={theme} variant="metric" index={2} />
          <div className="relative z-10 flex items-center justify-between">
            <span className={`text-xs font-black ${theme.ui.primaryText} flex items-center gap-1.5`}>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Joint &amp; Barometric
            </span>
            <span className={`text-xs font-mono font-black ${jointComfort.color}`}>
              {jointComfort.level}
            </span>
          </div>
          <p className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
            {jointComfort.detail}
          </p>
        </div>
      </div>

      {/* 24-Hour Barometric Pressure Spark-Bar Timeline */}
      <div
        className={`relative z-10 p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-2.5`}
      >
        <div className="flex items-center justify-between text-xs">
          <span className={`font-black ${theme.ui.primaryText}`}>
            24-Hour Surface Barometer Progression ({tendencyLabel})
          </span>
          <span className={`font-mono text-[11px] ${theme.ui.secondaryText}`}>
            12h Shift: {delta12h > 0 ? `+${delta12h}` : delta12h} hPa · Standard: 1013.2 hPa
          </span>
        </div>

        <div className="h-20 flex items-end justify-between gap-1.5 pt-2">
          {pressures.slice(0, 16).map((p, idx) => {
            const pct = Math.max(18, Math.min(100, ((p - minP) / spanP) * 100));
            const hrTime = hourlySlice[idx]?.time?.split('T')[1]?.slice(0, 5) || `+${idx}h`;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                {idx % 3 === 0 && (
                  <span className={`text-[9px] font-mono font-bold ${theme.ui.primaryText}`}>
                    {Math.round(p)}
                  </span>
                )}
                <div
                  className={`w-full rounded-t-md ${
                    p < 1005
                      ? 'bg-gradient-to-t from-amber-500 to-rose-400'
                      : 'bg-gradient-to-t from-cyan-500 to-emerald-400'
                  }`}
                  style={{ height: `${pct}%` }}
                />
                {idx % 2 === 0 && (
                  <span className={`text-[8px] font-mono ${theme.ui.secondaryText}`}>
                    {hrTime}
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
