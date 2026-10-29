import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Plus, 
  X, 
  Clock, 
  Sparkles, 
  ArrowUpRight,
  BookmarkCheck
} from 'lucide-react';
import { LocationData, TempUnit } from '../../types/weather';
import { POPULAR_LOCATIONS, formatTempWithUnit, decodeWmoCode } from '../../services/weatherService';
import { useWeatherTheme, computeAutoThemeForWeather } from '../../context/WeatherThemeContext';
import { getWeatherTheme } from '../../config/weatherThemes';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface PostcardWeatherSnapshot {
  location: LocationData;
  temperature: number;
  weatherCode: number;
  isDay: number;
  windSpeed: number;
  precipitation: number;
  timezone: string;
}

interface WorldPostcardDeckProps {
  currentLocation: LocationData;
  currentTempC?: number;
  unit: TempUnit;
  onSelectLocation: (loc: LocationData) => void;
}

const DEFAULT_PINNED_IDS = ['tok', 'reyk', 'zur', 'nyc'];

export function WorldPostcardDeck({
  currentLocation,
  currentTempC,
  unit,
  onSelectLocation
}: WorldPostcardDeckProps) {
  const { theme } = useWeatherTheme();

  const [pinnedLocations, setPinnedLocations] = useState<LocationData[]>(() => {
    try {
      const saved = localStorage.getItem('aether_pinned_postcards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return POPULAR_LOCATIONS.filter((loc) => DEFAULT_PINNED_IDS.includes(String(loc.id)));
  });

  const [snapshots, setSnapshots] = useState<Record<string, PostcardWeatherSnapshot>>({});
  const [nowTick, setNowTick] = useState<number>(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('aether_pinned_postcards', JSON.stringify(pinnedLocations));
    } catch {}
  }, [pinnedLocations]);

  // Fetch lightweight real-time snapshots for pinned cities from Open-Meteo
  useEffect(() => {
    let cancelled = false;
    async function fetchPostcards() {
      const results: Record<string, PostcardWeatherSnapshot> = {};
      await Promise.all(
        pinnedLocations.map(async (loc) => {
          const key = `${loc.latitude.toFixed(2)},${loc.longitude.toFixed(2)}`;
          try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,weather_code,is_day,wind_speed_10m,precipitation&timezone=auto`;
            const res = await fetch(url);
            if (!res.ok) return;
            const data = await res.json();
            if (data?.current) {
              results[key] = {
                location: loc,
                temperature: data.current.temperature_2m,
                weatherCode: data.current.weather_code,
                isDay: data.current.is_day,
                windSpeed: data.current.wind_speed_10m,
                precipitation: data.current.precipitation,
                timezone: data.timezone || loc.timezone || 'UTC',
              };
            }
          } catch {}
        })
      );
      if (!cancelled) {
        setSnapshots((prev) => ({ ...prev, ...results }));
      }
    }
    fetchPostcards();
    return () => {
      cancelled = true;
    };
  }, [pinnedLocations]);

  const isCurrentPinned = pinnedLocations.some(
    (p) =>
      Math.abs(p.latitude - currentLocation.latitude) < 0.05 &&
      Math.abs(p.longitude - currentLocation.longitude) < 0.05
  );

  const handlePinCurrent = () => {
    if (isCurrentPinned) return;
    setPinnedLocations((prev) => [currentLocation, ...prev.slice(0, 5)]);
  };

  const handleRemovePin = (e: React.MouseEvent, loc: LocationData) => {
    e.stopPropagation();
    setPinnedLocations((prev) =>
      prev.filter(
        (p) =>
          Math.abs(p.latitude - loc.latitude) >= 0.05 ||
          Math.abs(p.longitude - loc.longitude) >= 0.05
      )
    );
  };

  const formatCityTime = (tz?: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: tz || 'UTC',
      }).format(new Date(nowTick));
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-xs`}>
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-sm font-black ${theme.ui.primaryText} tracking-tight flex items-center gap-2`}>
              <span>Illustrated World Postcard Deck</span>
              <span className={`text-[10px] font-mono font-bold ${theme.ui.subheadingText}`}>
                · Each postcard renders its own live local sky theme
              </span>
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePinCurrent}
          disabled={isCurrentPinned}
          className={`relative overflow-hidden px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
            isCurrentPinned
              ? `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.secondaryText} opacity-80 cursor-default`
              : `${theme.ui.activePill} ${theme.ui.activePillText} active:scale-95`
          }`}
        >
          {isCurrentPinned ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{currentLocation.name} Pinned</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Pin {currentLocation.name} Postcard</span>
            </>
          )}
        </button>
      </div>

      {/* Postcards Horizontal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {pinnedLocations.map((loc, idx) => {
          const key = `${loc.latitude.toFixed(2)},${loc.longitude.toFixed(2)}`;
          const snap = snapshots[key];
          const isSelectedCity =
            Math.abs(loc.latitude - currentLocation.latitude) < 0.05 &&
            Math.abs(loc.longitude - currentLocation.longitude) < 0.05;

          // Compute this city's own local illustrated world theme!
          const cityThemeId = snap
            ? computeAutoThemeForWeather({
                weatherCode: snap.weatherCode,
                temperatureC: snap.temperature,
                isDay: snap.isDay,
                latitude: loc.latitude,
              })
            : theme.id;
          const cityTheme = getWeatherTheme(cityThemeId);
          const wmo = snap ? decodeWmoCode(snap.weatherCode, snap.isDay) : null;

          // Temperature difference compared to active city
          const tempDeltaC =
            snap && typeof currentTempC === 'number'
              ? Math.round(snap.temperature - currentTempC)
              : null;

          return (
            <div
              key={`${loc.name}-${idx}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelectLocation(loc)}
              className={`group relative rounded-[26px] ${cityTheme.ui.cardSurface} ${cityTheme.ui.cardBorder} p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between min-h-[144px] shadow-lg ${
                isSelectedCity ? 'ring-3 ring-amber-300' : ''
              }`}
            >
              {/* Each city postcard is wrapped in its own local sky artwork */}
              <ThemeCardArtWrapper theme={cityTheme} variant="launcher" />
              <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${cityTheme.ui.cardHighlight}`} />

              {/* Top Row: City Name + Local Time + Remove button */}
              <div className="relative z-10 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className={`text-sm font-black ${cityTheme.ui.primaryText} tracking-tight flex items-center gap-1`}>
                      <span>{loc.name}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-mono font-bold ${cityTheme.ui.secondaryText} mt-0.5`}>
                    <Clock className="w-3 h-3" />
                    <span>{formatCityTime(snap?.timezone || loc.timezone)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{loc.country}</span>
                  </div>
                </div>

                {/* Postage Stamp World Badge + Close */}
                <div className="flex items-center gap-1">
                  <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-dashed ${cityTheme.ui.badgeBg} ${cityTheme.ui.badgeBorder} ${cityTheme.ui.badgeText}`}>
                    {cityTheme.name.split(' ')[0]}
                  </span>
                  {pinnedLocations.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleRemovePin(e, loc)}
                      className={`p-1 rounded-full ${cityTheme.ui.tileSurface} ${cityTheme.ui.primaryText} opacity-70 hover:opacity-100 transition-opacity cursor-pointer`}
                      title={`Unpin ${loc.name}`}
                      aria-label={`Unpin ${loc.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Row: Temperature + Delta + Condition */}
              <div className="relative z-10 pt-3 mt-2 border-t border-amber-200/15 flex items-end justify-between gap-2">
                <div>
                  <span className={`text-2xl font-black font-mono tracking-tight ${cityTheme.ui.primaryText} block leading-none`}>
                    {snap ? formatTempWithUnit(snap.temperature, unit) : '—'}
                  </span>
                  <span className={`text-[11px] font-bold ${cityTheme.ui.secondaryText} block mt-1`}>
                    {wmo ? wmo.description : 'Syncing satellite...'}
                  </span>
                </div>

                <div className="text-right">
                  {tempDeltaC !== null && !isSelectedCity ? (
                    <span className={`text-[10px] font-mono font-black ${cityTheme.ui.subheadingText} block`}>
                      {tempDeltaC === 0
                        ? `Same temp`
                        : tempDeltaC > 0
                        ? `+${tempDeltaC}° warmer`
                        : `${tempDeltaC}° cooler`}
                    </span>
                  ) : isSelectedCity ? (
                    <span className={`text-[10px] font-mono font-black ${cityTheme.ui.subheadingText} flex items-center gap-1`}>
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      Active
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
