import React, { useEffect, useState } from 'react';
import {
  Columns,
  Search,
  Wind,
  Droplets,
  Sun,
  Gauge,
  ArrowLeftRight,
  Loader2
} from 'lucide-react';
import {
  WeatherData,
  LocationData,
  TempUnit,
  SpeedUnit
} from '../../types/weather';
import {
  POPULAR_LOCATIONS,
  fetchFullWeather,
  searchLocations,
  formatTempWithUnit,
  formatSpeed,
  decodeWmoCode
} from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface DualCitySplitCompareProps {
  primaryWeather: WeatherData;
  unit: TempUnit;
  speedUnit: SpeedUnit;
  scrubIndex?: number;
}

export function DualCitySplitCompare({
  primaryWeather,
  unit,
  speedUnit,
  scrubIndex = 0
}: DualCitySplitCompareProps) {
  const { theme } = useWeatherTheme();

  const initialSecondCity =
    POPULAR_LOCATIONS.find(
      (l) => l.name.toLowerCase() !== primaryWeather.location.name.toLowerCase()
    ) || POPULAR_LOCATIONS[4];

  const [compareLocation, setCompareLocation] = useState<LocationData>(initialSecondCity);
  const [compareWeather, setCompareWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<LocationData[]>([]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchFullWeather(compareLocation)
      .then((data) => {
        if (active) {
          setCompareWeather(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [compareLocation]);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.trim().length < 2) {
      setResults([]);
      return;
    }
    const found = await searchLocations(val);
    setResults(found.slice(0, 5));
  };

  const hourOffset = Math.min(23, Math.max(0, scrubIndex));
  const leftHour = primaryWeather.hourly[hourOffset] || primaryWeather.current;
  const rightHour = compareWeather?.hourly[hourOffset] || compareWeather?.current;

  const tempDeltaC = rightHour
    ? Math.round((rightHour.temperature - leftHour.temperature) * 10) / 10
    : 0;

  return (
    <div
      className={`relative w-full rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden space-y-6`}
    >
      <ThemeCardArtWrapper theme={theme} variant="standard" />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`}
      />

      {/* Top Header & Second City Picker */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md shrink-0`}
          >
            <Columns className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black ${theme.ui.primaryText}`}>
              Split-Screen Dual-City Climate &amp; Telemetry Compare
            </h2>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              Side-by-side atmospheric comparison synchronized with your 24-hour time scrubber
            </p>
          </div>
        </div>

        {/* City Search & Quick Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}
            >
              <Search className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Compare with city..."
                className={`bg-transparent text-xs font-bold ${theme.ui.primaryText} placeholder:opacity-60 focus:outline-none w-36 sm:w-44`}
              />
            </div>
            {results.length > 0 && (
              <div
                className={`absolute right-0 mt-1 w-60 rounded-2xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} shadow-2xl z-30 p-1.5 space-y-1`}
              >
                {results.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      setCompareLocation(loc);
                      setQuery('');
                      setResults([]);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold ${theme.ui.primaryText} hover:${theme.ui.tileSurface} flex items-center justify-between cursor-pointer`}
                  >
                    <span className="truncate">{loc.name}</span>
                    <span className={`text-[10px] ${theme.ui.secondaryText}`}>
                      {loc.countryCode || loc.country}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {POPULAR_LOCATIONS.filter(
            (l) => l.name.toLowerCase() !== primaryWeather.location.name.toLowerCase()
          )
            .slice(0, 4)
            .map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setCompareLocation(loc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  compareLocation.name === loc.name
                    ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                    : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
                }`}
              >
                vs. {loc.name}
              </button>
            ))}
        </div>
      </div>

      {/* Split-Screen Comparison Grid */}
      {isLoading || !compareWeather || !rightHour ? (
        <div className="relative z-10 py-12 flex items-center justify-center gap-2">
          <Loader2 className={`w-5 h-5 animate-spin ${theme.ui.accentText}`} />
          <span className={`text-xs font-black ${theme.ui.primaryText}`}>
            Synchronizing Dual-City Telemetry for {compareLocation.name}...
          </span>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-11 gap-4 items-stretch">
          {/* City A: Primary Hub */}
          <div
            className={`lg:col-span-5 relative overflow-hidden p-5 rounded-3xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-4`}
          >
            <ThemeTileArt theme={theme} variant="metric" index={0} />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className={`text-[10px] font-mono font-bold ${theme.ui.subheadingText} block`}>
                  PRIMARY OBSERVATION HUB
                </span>
                <h3 className={`text-xl font-black ${theme.ui.primaryText}`}>
                  {primaryWeather.location.name}
                </h3>
                <span className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                  {decodeWmoCode(leftHour.weatherCode, 1).description}
                </span>
              </div>
              <div className="text-right">
                <span className={`text-3xl font-black font-mono tabular-nums ${theme.ui.primaryText}`}>
                  {formatTempWithUnit(leftHour.temperature, unit)}
                </span>
                <span className={`text-[11px] font-mono ${theme.ui.secondaryText} block`}>
                  Feels {formatTempWithUnit(leftHour.apparentTemperature, unit)}
                </span>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className={`${theme.ui.secondaryText} flex items-center gap-1`}>
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  Wind
                </span>
                <span className={`font-bold ${theme.ui.primaryText}`}>
                  {formatSpeed(leftHour.windSpeed, speedUnit)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${theme.ui.secondaryText} flex items-center gap-1`}>
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  Humidity
                </span>
                <span className={`font-bold ${theme.ui.primaryText}`}>
                  {leftHour.relativeHumidity}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${theme.ui.secondaryText} flex items-center gap-1`}>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  UV Index
                </span>
                <span className={`font-bold ${theme.ui.primaryText}`}>
                  {leftHour.uvIndex}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${theme.ui.secondaryText} flex items-center gap-1`}>
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  Clouds
                </span>
                <span className={`font-bold ${theme.ui.primaryText}`}>
                  {leftHour.cloudCover}%
                </span>
              </div>
            </div>
          </div>

          {/* Center Delta Column */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center gap-2 py-2">
            <div
              className={`w-10 h-10 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md`}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div className="text-center font-mono">
              <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
                Δ Temp
              </span>
              <span
                className={`text-xs font-black ${
                  tempDeltaC > 0 ? 'text-amber-300' : tempDeltaC < 0 ? 'text-cyan-300' : theme.ui.primaryText
                }`}
              >
                {tempDeltaC > 0 ? `+${tempDeltaC}°C` : `${tempDeltaC}°C`}
              </span>
            </div>
          </div>

          {/* City B: Comparison City */}
          <div
            className={`lg:col-span-5 relative overflow-hidden p-5 rounded-3xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-4`}
          >
            <ThemeTileArt theme={theme} variant="metric" index={2} />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className={`text-[10px] font-mono font-bold ${theme.ui.subheadingText} block`}>
                  COMPARISON DESTINATION
                </span>
                <h3 className={`text-xl font-black ${theme.ui.primaryText}`}>
                  {compareWeather.location.name}
                </h3>
                <span className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                  {decodeWmoCode(rightHour.weatherCode, 1).description}
                </span>
              </div>
              <div className="text-right">
                <span className={`text-3xl font-black font-mono tabular-nums ${theme.ui.primaryText}`}>
                  {formatTempWithUnit(rightHour.temperature, unit)}
                </span>
                <span className={`text-[11px] font-mono ${theme.ui.secondaryText} block`}>
                  Feels {formatTempWithUnit(rightHour.apparentTemperature, unit)}
                </span>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className={`${theme.ui.secondaryText} flex items-center gap-1`}>
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  Wind
                </span>
                <span className={`font-bold ${theme.ui.primaryText}`}>
                  {formatSpeed(rightHour.windSpeed, speedUnit)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${theme.ui.secondaryText} flex items-center gap-1`}>
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  Humidity
                </span>
                <span className={`font-bold ${theme.ui.primaryText}`}>
                  {rightHour.relativeHumidity}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${theme.ui.secondaryText} flex items-center gap-1`}>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  UV Index
                </span>
                <span className={`font-bold ${theme.ui.primaryText}`}>
                  {rightHour.uvIndex}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${theme.ui.secondaryText} flex items-center gap-1`}>
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  Clouds
                </span>
                <span className={`font-bold ${theme.ui.primaryText}`}>
                  {rightHour.cloudCover}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
