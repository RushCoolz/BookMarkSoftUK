import React, { useEffect, useState } from 'react';
import {
  Navigation,
  MapPin,
  Clock,
  Wind,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
  Search,
  ArrowRight,
  Loader2
} from 'lucide-react';
import {
  LocationData,
  RouteWaypointWeather,
  TempUnit,
  SpeedUnit
} from '../../types/weather';
import {
  POPULAR_LOCATIONS,
  fetchRouteWeatherWaypoints,
  searchLocations,
  formatTempWithUnit,
  formatSpeed,
  decodeWmoCode
} from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface RouteWeatherPlannerProps {
  originLocation: LocationData;
  unit: TempUnit;
  speedUnit: SpeedUnit;
}

export function RouteWeatherPlanner({
  originLocation,
  unit,
  speedUnit
}: RouteWeatherPlannerProps) {
  const { theme } = useWeatherTheme();

  const defaultDest =
    POPULAR_LOCATIONS.find(
      (loc) => loc.name.toLowerCase() !== originLocation.name.toLowerCase()
    ) || POPULAR_LOCATIONS[1];

  const [destination, setDestination] = useState<LocationData>(defaultDest);
  const [departureOffsetHours, setDepartureOffsetHours] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [routeData, setRouteData] = useState<{
    totalDistanceKm: number;
    durationHours: number;
    waypoints: RouteWaypointWeather[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchRouteWeatherWaypoints(originLocation, destination, departureOffsetHours).then((res) => {
      if (!active) return;
      setRouteData(res);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [originLocation, destination, departureOffsetHours]);

  const handleSearchDest = async (q: string) => {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const results = await searchLocations(q);
    setSearchResults(results.slice(0, 5));
    setIsSearching(false);
  };

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
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-lg font-black ${theme.ui.primaryText} tracking-tight`}>
              Road-Trip &amp; Commute Route Weather Planner
            </h2>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              5-waypoint corridor telemetry with headwind/crosswind vector math and departure time scrubbing
            </p>
          </div>
        </div>

        {/* Preset Destination Selector + Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}
            >
              <Search className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchDest(e.target.value)}
                placeholder="Search destination city..."
                className={`bg-transparent text-xs font-bold ${theme.ui.primaryText} placeholder:opacity-60 focus:outline-none w-40 sm:w-48`}
              />
              {isSearching && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            </div>

            {searchResults.length > 0 && (
              <div
                className={`absolute right-0 mt-1 w-64 rounded-2xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} shadow-2xl z-30 p-1.5 space-y-1`}
              >
                {searchResults.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      setDestination(loc);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold ${theme.ui.primaryText} hover:${theme.ui.tileSurface} flex items-center justify-between cursor-pointer`}
                  >
                    <span className="truncate">{loc.name}</span>
                    <span className={`text-[10px] ${theme.ui.secondaryText} ml-2 shrink-0`}>
                      {loc.countryCode || loc.country}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {POPULAR_LOCATIONS.filter(
            (l) => l.name.toLowerCase() !== originLocation.name.toLowerCase()
          )
            .slice(0, 4)
            .map((city) => {
              const isSelected = destination.name === city.name;
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => setDestination(city)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isSelected
                      ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-sm`
                      : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
                  }`}
                >
                  &rarr; {city.name}
                </button>
              );
            })}
        </div>
      </div>

      {/* Origin -> Destination Corridor Banner & Departure Time Scrubber */}
      <div
        className={`relative z-10 p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex flex-col md:flex-row items-center justify-between gap-4`}
      >
        <ThemeTileArt theme={theme} variant="banner" index={1} />
        <div className="relative z-10 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin className={`w-4 h-4 ${theme.ui.accentText}`} />
            <span className={`text-sm font-black ${theme.ui.primaryText}`}>
              {originLocation.name}
            </span>
          </div>
          <ArrowRight className={`w-4 h-4 ${theme.ui.secondaryText}`} />
          <div className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span className={`text-sm font-black ${theme.ui.primaryText}`}>
              {destination.name}
            </span>
          </div>
          {routeData && (
            <span className={`text-xs font-mono font-bold ${theme.ui.secondaryText}`}>
              · ~{routeData.totalDistanceKm} km · Est. {routeData.durationHours}h transit
            </span>
          )}
        </div>

        {/* Departure Offset Scrubber */}
        <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
          <Clock className={`w-4 h-4 ${theme.ui.accentText} shrink-0`} />
          <span className={`text-xs font-bold ${theme.ui.secondaryText} shrink-0`}>
            Depart:
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { label: 'Now', hrs: 0 },
              { label: '+2h', hrs: 2 },
              { label: '+6h', hrs: 6 },
              { label: '+12h', hrs: 12 },
              { label: 'Tomorrow', hrs: 24 }
            ].map((opt) => (
              <button
                key={opt.hrs}
                type="button"
                onClick={() => setDepartureOffsetHours(opt.hrs)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black font-mono cursor-pointer transition-all ${
                  departureOffsetHours === opt.hrs
                    ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                    : `${theme.ui.cardSurface} ${theme.ui.primaryText}`
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5-Waypoint Route Timeline Grid */}
      {isLoading ? (
        <div className="relative z-10 py-12 flex items-center justify-center gap-2">
          <Loader2 className={`w-5 h-5 animate-spin ${theme.ui.accentText}`} />
          <span className={`text-xs font-black ${theme.ui.primaryText}`}>
            Computing Waypoint Atmospheric Corridor &amp; Crosswind Vectors...
          </span>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {routeData?.waypoints.map((wp, idx) => {
            const wmo = decodeWmoCode(wp.weatherCode, 1);
            const isHazard = wp.hazardLevel === 'Hazardous';
            const isCaution = wp.hazardLevel === 'Caution';
            return (
              <div
                key={wp.id}
                className={`relative overflow-hidden rounded-2xl p-4 ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex flex-col justify-between gap-3`}
              >
                <ThemeTileArt theme={theme} variant="metric" index={idx} />
                <div className="relative z-10 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-mono font-black ${theme.ui.subheadingText}`}>
                      ETA {wp.etaFormatted}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        isHazard
                          ? 'bg-rose-500/20 text-rose-300'
                          : isCaution
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {wp.hazardLevel}
                    </span>
                  </div>
                  <h3 className={`text-sm font-black ${theme.ui.primaryText} truncate`}>
                    {wp.label}
                  </h3>
                  <p className={`text-[11px] font-semibold ${theme.ui.secondaryText}`}>
                    {wmo.description}
                  </p>
                </div>

                <div className="relative z-10 pt-2 border-t border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className={theme.ui.secondaryText}>Temp</span>
                    <span className={`font-black ${theme.ui.primaryText}`}>
                      {formatTempWithUnit(wp.temperatureC, unit)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className={`${theme.ui.secondaryText} flex items-center gap-1`}>
                      <CloudRain className="w-3 h-3 text-sky-400" />
                      Rain
                    </span>
                    <span className={`font-bold ${theme.ui.primaryText}`}>
                      {wp.precipProb}% ({wp.precipitationMm.toFixed(1)}mm)
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className={`${theme.ui.secondaryText} flex items-center gap-1`}>
                      <Wind className="w-3 h-3 text-amber-400" />
                      Crosswind
                    </span>
                    <span className={`font-bold ${theme.ui.primaryText}`}>
                      {formatSpeed(wp.crosswindKmh, speedUnit)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className={theme.ui.secondaryText}>
                      {wp.headwindKmh >= 0 ? 'Headwind' : 'Tailwind'}
                    </span>
                    <span
                      className={
                        wp.headwindKmh > 15 ? 'text-amber-300 font-bold' : 'text-emerald-300 font-bold'
                      }
                    >
                      {formatSpeed(Math.abs(wp.headwindKmh), speedUnit)}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-1 text-[10px] font-semibold">
                  {isHazard ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span className={theme.ui.secondaryText}>
                    {Math.round(wp.distanceRatio * (routeData?.totalDistanceKm || 100))} km mark
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
