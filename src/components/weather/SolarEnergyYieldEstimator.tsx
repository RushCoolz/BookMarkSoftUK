import React, { useState } from 'react';
import {
  Sun,
  Zap,
  BatteryCharging,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { WeatherData } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface SolarEnergyYieldEstimatorProps {
  weather: WeatherData;
}

export function SolarEnergyYieldEstimator({ weather }: SolarEnergyYieldEstimatorProps) {
  const { theme } = useWeatherTheme();
  const [systemSizeKwp, setSystemSizeKwp] = useState<number>(4.8);
  const [electricityRatePerKwh, setElectricityRatePerKwh] = useState<number>(0.28);

  const hourly24 = weather.hourly.slice(0, 24);

  // Compute hourly solar irradiance (W/m²) and PV kW generation
  const hourlyYields = hourly24.map((h) => {
    const hourNum = parseInt(h.time.split('T')[1]?.slice(0, 2) || '12', 10);
    const isDaylight = hourNum >= 6 && hourNum <= 19;
    const rawIrradiance =
      typeof h.shortwaveRadiation === 'number' && h.shortwaveRadiation > 0
        ? h.shortwaveRadiation
        : isDaylight
        ? Math.max(
            0,
            Math.sin(((hourNum - 6) / 13) * Math.PI) *
              760 *
              (1 - (h.cloudCover / 100) * 0.68)
          )
        : 0;

    // Temp coefficient penalty above 25°C (-0.38% per °C)
    const tempDerate = h.temperature > 25 ? 1 - (h.temperature - 25) * 0.0038 : 1;
    const systemLosses = 0.84;
    const kwOutput =
      Math.round(
        ((rawIrradiance / 1000) * systemSizeKwp * systemLosses * tempDerate) * 100
      ) / 100;

    return {
      timeLabel: h.time.split('T')[1]?.slice(0, 5) || `${String(hourNum).padStart(2, '0')}:00`,
      irradianceWm2: Math.round(rawIrradiance),
      kwOutput
    };
  });

  const currentIrradiance = hourlyYields[0]?.irradianceWm2 ?? 0;
  const currentKw = hourlyYields[0]?.kwOutput ?? 0;
  const dailyTotalKwh =
    Math.round(hourlyYields.reduce((acc, item) => acc + item.kwOutput, 0) * 10) / 10;
  const peakSlot = hourlyYields.reduce(
    (best, cur) => (cur.kwOutput > best.kwOutput ? cur : best),
    hourlyYields[0] || { timeLabel: '13:00', irradianceWm2: 500, kwOutput: 2.5 }
  );

  const estimatedDailySavings = (dailyTotalKwh * electricityRatePerKwh).toFixed(2);
  const co2OffsetKg = (dailyTotalKwh * 0.21).toFixed(1);

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
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-md shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black ${theme.ui.primaryText}`}>
              Solar Rooftop PV &amp; Home Energy Yield Estimator
            </h2>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              Live shortwave solar irradiance (W/m²), rooftop kWh generation, and green appliance dispatch window
            </p>
          </div>
        </div>

        {/* Array Size kWp Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-bold ${theme.ui.secondaryText}`}>Array Size:</span>
          {[3.6, 4.8, 6.4, 8.0].map((kwp) => (
            <button
              key={kwp}
              type="button"
              onClick={() => setSystemSizeKwp(kwp)}
              className={`px-3 py-1 rounded-xl text-xs font-black font-mono cursor-pointer transition-all ${
                systemSizeKwp === kwp
                  ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                  : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
              }`}
            >
              {kwp} kWp
            </button>
          ))}
        </div>
      </div>

      {/* 4 Telemetry Readout Tiles */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={0} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} block`}>
            Live Solar Irradiance
          </span>
          <span className="relative z-10 text-xl font-black font-mono tabular-nums text-amber-400">
            {currentIrradiance} W/m²
          </span>
          <span className={`relative z-10 text-[11px] font-mono ${theme.ui.secondaryText} block`}>
            Live Output: {currentKw.toFixed(2)} kW
          </span>
        </div>

        <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={1} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} block`}>
            24h Rooftop Yield
          </span>
          <span className="relative z-10 text-xl font-black font-mono tabular-nums text-emerald-400">
            {dailyTotalKwh} kWh
          </span>
          <span className={`relative z-10 text-[11px] font-mono ${theme.ui.secondaryText} block`}>
            Peak: {peakSlot.kwOutput.toFixed(2)} kW at {peakSlot.timeLabel}
          </span>
        </div>

        <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={2} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} block`}>
            Est. Grid Bill Offset
          </span>
          <span className={`relative z-10 text-xl font-black font-mono tabular-nums ${theme.ui.primaryText}`}>
            £{estimatedDailySavings} / day
          </span>
          <span className={`relative z-10 text-[11px] font-mono ${theme.ui.secondaryText} block`}>
            Carbon Saved: {co2OffsetKg} kg CO₂
          </span>
        </div>

        <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
          <ThemeTileArt theme={theme} variant="metric" index={3} />
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} flex items-center gap-1`}>
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            Best Appliance Window
          </span>
          <span className="relative z-10 text-base font-black font-mono text-emerald-300 mt-0.5 block">
            {peakSlot.timeLabel} – 15:00
          </span>
          <span className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText} block`}>
            Run EV Charger / Washer / Dishwasher
          </span>
        </div>
      </div>

      {/* Daylight Solar Generation Bar Curve */}
      <div
        className={`relative z-10 p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-2.5`}
      >
        <div className="flex items-center justify-between text-xs">
          <span className={`font-black ${theme.ui.primaryText} flex items-center gap-1.5`}>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Hourly Solar PV Generation Profile (kW)
          </span>
          <span className={`font-mono text-[11px] ${theme.ui.secondaryText} flex items-center gap-1`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Cloud Cover Factor: {weather.current.cloudCover}%
          </span>
        </div>

        <div className="h-24 flex items-end justify-between gap-1.5 pt-3">
          {hourlyYields.slice(0, 16).map((slot, idx) => {
            const pct = Math.max(8, Math.min(100, (slot.kwOutput / Math.max(1, systemSizeKwp)) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                {slot.kwOutput > 0.2 && idx % 2 === 0 && (
                  <span className="text-[9px] font-mono font-bold text-amber-300">
                    {slot.kwOutput.toFixed(1)}
                  </span>
                )}
                <div
                  className={`w-full rounded-t-md ${
                    slot.kwOutput > 0.1
                      ? 'bg-gradient-to-t from-amber-500 via-yellow-400 to-emerald-300'
                      : 'bg-slate-700/40'
                  }`}
                  style={{ height: `${pct}%` }}
                />
                {idx % 2 === 0 && (
                  <span className={`text-[8px] font-mono ${theme.ui.secondaryText}`}>
                    {slot.timeLabel}
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
