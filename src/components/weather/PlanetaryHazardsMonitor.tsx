import React, { useEffect, useState } from 'react';
import {
  Globe,
  Activity,
  Flame,
  AlertTriangle,
  Mountain,
  CloudLightning
} from 'lucide-react';
import {
  WeatherData,
  EarthquakeEvent,
  NasaEonetEvent
} from '../../types/weather';
import { fetchPlanetaryHazards } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface PlanetaryHazardsMonitorProps {
  weather: WeatherData;
}

export function PlanetaryHazardsMonitor({ weather }: PlanetaryHazardsMonitorProps) {
  const { theme } = useWeatherTheme();
  const [earthquakes, setEarthquakes] = useState<EarthquakeEvent[]>([]);
  const [eonetEvents, setEonetEvents] = useState<NasaEonetEvent[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'seismic' | 'eonet'>('all');

  useEffect(() => {
    let active = true;
    fetchPlanetaryHazards(
      weather.location.latitude,
      weather.location.longitude
    ).then((res) => {
      if (!active) return;
      setEarthquakes(res.earthquakes);
      setEonetEvents(res.eonetEvents);
    });
    return () => {
      active = false;
    };
  }, [weather.location.latitude, weather.location.longitude]);

  return (
    <div
      className={`relative w-full rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden space-y-6`}
    >
      <ThemeCardArtWrapper theme={theme} variant="standard" />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`}
      />

      {/* Header & Filter Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black ${theme.ui.primaryText}`}>
              USGS Seismic Earthquakes &amp; NASA EONET Planetary Hazards
            </h2>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              Real-time tectonic seismic events (M2.5+) and satellite wildfire, volcano, and storm tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { id: 'all' as const, label: 'All Planetary Feeds' },
            { id: 'seismic' as const, label: `USGS Seismic (${earthquakes.length})` },
            { id: 'eonet' as const, label: `NASA EONET (${eonetEvents.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterMode(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                filterMode === tab.id
                  ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                  : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: USGS Earthquakes */}
        {(filterMode === 'all' || filterMode === 'seismic') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-black ${theme.ui.primaryText} flex items-center gap-1.5`}>
                <Activity className="w-4 h-4 text-rose-400" />
                Live USGS Seismic Tectonic Feed
              </span>
              <span className={`font-mono text-[11px] ${theme.ui.secondaryText}`}>
                Sorted by Recency &amp; Magnitude
              </span>
            </div>

            <div className="space-y-2.5">
              {earthquakes.slice(0, 5).map((eq, idx) => {
                const isStrong = eq.magnitude >= 5.0;
                const timeStr = new Date(eq.timeMs).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                return (
                  <div
                    key={eq.id}
                    className={`relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex items-center justify-between gap-3`}
                  >
                    <ThemeTileArt theme={theme} variant="metric" index={idx} />
                    <div className="relative z-10 flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl font-mono font-black text-sm flex items-center justify-center shrink-0 ${
                          isStrong
                            ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        M{eq.magnitude.toFixed(1)}
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-xs font-black ${theme.ui.primaryText} truncate`}>
                          {eq.place}
                        </h3>
                        <p className={`text-[11px] font-mono ${theme.ui.secondaryText}`}>
                          Depth: {eq.depthKm} km · {timeStr} · {eq.distanceKm.toLocaleString()} km away
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Column: NASA EONET Active Events */}
        {(filterMode === 'all' || filterMode === 'eonet') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-black ${theme.ui.primaryText} flex items-center gap-1.5`}>
                <Flame className="w-4 h-4 text-amber-400" />
                NASA Earth Observatory (EONET) Active Events
              </span>
              <span className={`font-mono text-[11px] ${theme.ui.secondaryText}`}>
                Satellite Thermal &amp; Storm Anomalies
              </span>
            </div>

            <div className="space-y-2.5">
              {eonetEvents.slice(0, 5).map((ev, idx) => {
                const CatIcon =
                  ev.category === 'Wildfires'
                    ? Flame
                    : ev.category === 'Volcanoes'
                    ? Mountain
                    : ev.category === 'Severe Storms'
                    ? CloudLightning
                    : AlertTriangle;

                return (
                  <div
                    key={ev.id}
                    className={`relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex items-center justify-between gap-3`}
                  >
                    <ThemeTileArt theme={theme} variant="metric" index={idx + 2} />
                    <div className="relative z-10 flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-black text-amber-300">
                            {ev.category}
                          </span>
                          <span className={`text-[10px] font-mono ${theme.ui.secondaryText}`}>
                            · {ev.distanceKm.toLocaleString()} km from hub
                          </span>
                        </div>
                        <h3 className={`text-xs font-black ${theme.ui.primaryText} truncate`}>
                          {ev.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
