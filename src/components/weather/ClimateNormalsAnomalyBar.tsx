import React, { useEffect, useState } from 'react';
import {
  History,
  Flame,
  Snowflake,
  TrendingUp,
  TrendingDown,
  Calendar
} from 'lucide-react';
import {
  WeatherData,
  ClimateNormalAnomalyData,
  TempUnit
} from '../../types/weather';
import {
  fetchClimateNormalsAnomaly,
  formatTempWithUnit
} from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface ClimateNormalsAnomalyBarProps {
  weather: WeatherData;
  unit: TempUnit;
}

export function ClimateNormalsAnomalyBar({
  weather,
  unit
}: ClimateNormalsAnomalyBarProps) {
  const { theme } = useWeatherTheme();
  const [anomaly, setAnomaly] = useState<ClimateNormalAnomalyData | null>(null);

  const todayMaxC = weather.daily[0]?.temperatureMax ?? weather.current.temperature;
  const todayMinC = weather.daily[0]?.temperatureMin ?? weather.current.temperature - 5;
  const todayPrecipMm = weather.daily[0]?.precipitationSum ?? weather.current.precipitation;

  useEffect(() => {
    let active = true;
    fetchClimateNormalsAnomaly(
      weather.location.latitude,
      weather.location.longitude,
      todayMaxC,
      todayMinC,
      todayPrecipMm
    ).then((res) => {
      if (active) setAnomaly(res);
    });
    return () => {
      active = false;
    };
  }, [
    weather.location.latitude,
    weather.location.longitude,
    todayMaxC,
    todayMinC,
    todayPrecipMm
  ]);

  if (!anomaly) return null;

  const isWarmAnomaly = anomaly.tempAnomalyC >= 0;
  const sign = isWarmAnomaly ? '+' : '';
  const displayAnomaly =
    unit === 'fahrenheit'
      ? `${sign}${Math.round(anomaly.tempAnomalyC * 1.8 * 10) / 10}°F`
      : `${sign}${anomaly.tempAnomalyC.toFixed(1)}°C`;

  // Normalize position on -8°C to +8°C scale (50% = 0.0°C baseline)
  const markerLeftPct = Math.max(
    6,
    Math.min(94, 50 + (anomaly.tempAnomalyC / 8) * 44)
  );

  return (
    <div
      className={`relative w-full rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden space-y-5`}
    >
      <ThemeCardArtWrapper theme={theme} variant="compact" />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`}
      />

      {/* Top Row: Title & Live Anomaly Readout */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md shrink-0`}
          >
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base sm:text-lg font-black ${theme.ui.primaryText}`}>
                Climate Normals &amp; &ldquo;This Day in History&rdquo; ({anomaly.dateLabel})
              </h2>
              <span className={`text-xs font-mono font-bold ${theme.ui.secondaryText}`}>
                · ERA5 Reanalysis Archive
              </span>
            </div>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              Comparing today&apos;s high ({formatTempWithUnit(todayMaxC, unit)}) against the historical baseline normal ({formatTempWithUnit(anomaly.normalMaxC, unit)})
            </p>
          </div>
        </div>

        {/* Anomaly Deviation Badge */}
        <div
          className={`px-4 py-2 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex items-center gap-2.5 self-start md:self-auto`}
        >
          {isWarmAnomaly ? (
            <TrendingUp className="w-4 h-4 text-amber-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-cyan-400" />
          )}
          <div>
            <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
              Departure from Normal
            </span>
            <span
              className={`text-base font-black font-mono tabular-nums ${
                Math.abs(anomaly.tempAnomalyC) < 0.8
                  ? 'text-emerald-400'
                  : isWarmAnomaly
                  ? 'text-amber-300'
                  : 'text-cyan-300'
              }`}
            >
              {displayAnomaly} {isWarmAnomaly ? 'Above Normal' : 'Below Normal'}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Climate Anomaly Spectrum Bar */}
      <div
        className={`relative z-10 p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-2.5`}
      >
        <ThemeTileArt theme={theme} variant="banner" index={0} />
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono font-bold">
          <span className="text-cyan-300 flex items-center gap-1">
            <Snowflake className="w-3.5 h-3.5" />
            Record Low: {formatTempWithUnit(anomaly.recordMinC, unit)} ({anomaly.recordMinYear})
          </span>
          <span className={theme.ui.primaryText}>
            30-Yr Baseline Avg: {formatTempWithUnit(anomaly.normalMaxC, unit)} /{' '}
            {formatTempWithUnit(anomaly.normalMinC, unit)}
          </span>
          <span className="text-rose-300 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            Record High: {formatTempWithUnit(anomaly.recordMaxC, unit)} ({anomaly.recordMaxYear})
          </span>
        </div>

        <div className="relative z-10 h-3.5 w-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-rose-500 p-0.5">
          {/* Center 0.0°C Normal Tick */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/80" />
          {/* Today's Anomaly Marker */}
          <div
            className="absolute -top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-900 shadow-lg transition-all duration-500"
            style={{ left: `calc(${markerLeftPct}% - 10px)` }}
            title={`Today: ${displayAnomaly} vs normal`}
          />
        </div>
      </div>

      {/* Historical Archive Year-by-Year Comparison Strip */}
      {anomaly.eraSeries.length > 0 && (
        <div className="relative z-10 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          {anomaly.eraSeries.slice(-12).map((yrItem) => {
            const diff = yrItem.maxTempC - anomaly.normalMaxC;
            return (
              <div
                key={yrItem.year}
                className={`p-2 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} text-center`}
              >
                <span className={`text-[10px] font-mono font-bold ${theme.ui.secondaryText} flex items-center justify-center gap-0.5`}>
                  <Calendar className="w-2.5 h-2.5" />
                  {yrItem.year}
                </span>
                <span
                  className={`text-xs font-black font-mono tabular-nums block mt-0.5 ${
                    diff > 1.5
                      ? 'text-amber-300'
                      : diff < -1.5
                      ? 'text-cyan-300'
                      : theme.ui.primaryText
                  }`}
                >
                  {formatTempWithUnit(yrItem.maxTempC, unit)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
