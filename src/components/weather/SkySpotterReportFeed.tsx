import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CloudRain,
  Wind,
  Sparkles,
  AlertTriangle,
  Sun,
  ThumbsUp,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';
import { WeatherData, SkySpotterReport } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface SkySpotterReportFeedProps {
  weather: WeatherData;
}

const REPORT_TYPES: {
  id: SkySpotterReport['type'];
  label: string;
  defaultTitle: string;
  icon: React.ElementType;
  badgeColor: string;
}[] = [
  {
    id: 'rain-hail',
    label: 'Precip / Hail',
    defaultTitle: 'Passing Rain Band / Graupel',
    icon: CloudRain,
    badgeColor: 'text-sky-300 bg-sky-500/20'
  },
  {
    id: 'wind-gust',
    label: 'Squall / Gusts',
    defaultTitle: 'Strong Street-Level Wind Gusts',
    icon: Wind,
    badgeColor: 'text-amber-300 bg-amber-500/20'
  },
  {
    id: 'sky-optic',
    label: 'Rainbow / Halo / Aurora',
    defaultTitle: '22° Solar Halo / Vivid Sky Optics',
    icon: Sparkles,
    badgeColor: 'text-fuchsia-300 bg-fuchsia-500/20'
  },
  {
    id: 'road-hazard',
    label: 'Standing Water / Ice',
    defaultTitle: 'Localized Surface Water on Arterial Road',
    icon: AlertTriangle,
    badgeColor: 'text-rose-300 bg-rose-500/20'
  },
  {
    id: 'clear-sky',
    label: 'Clear Break',
    defaultTitle: 'Crisp Visibility & Cloud Break Overhead',
    icon: Sun,
    badgeColor: 'text-emerald-300 bg-emerald-500/20'
  }
];

export function SkySpotterReportFeed({ weather }: SkySpotterReportFeedProps) {
  const { theme } = useWeatherTheme();
  const storageKey = `aether_spotter_${weather.location.name.toLowerCase()}`;

  const buildSeedReports = (): SkySpotterReport[] => {
    const isRaining = weather.current.precipitation > 0;
    return [
      {
        id: 'seed-1',
        type: isRaining ? 'rain-hail' : 'clear-sky',
        title: isRaining
          ? 'Active Rain Band Moving East Across Sector'
          : 'High Horizon Visibility & Crisp Air Mass',
        note: isRaining
          ? `Measured ~${weather.current.precipitation.toFixed(1)} mm/h intensity with wet pavement sheen.`
          : `Cloud cover holding near ${weather.current.cloudCover}% with steady ${Math.round(
              weather.current.windSpeed
            )} km/h breeze.`,
        reporter: 'Station Observer #402',
        timestamp: '12 mins ago',
        lat: Math.round((weather.location.latitude + 0.032) * 1000) / 1000,
        lon: Math.round((weather.location.longitude - 0.041) * 1000) / 1000,
        verifiedCount: 14
      },
      {
        id: 'seed-2',
        type: 'wind-gust',
        title: `Brisk ${Math.round(weather.current.windGusts)} km/h Gusts on Elevated Crossings`,
        note: 'Noticeable crosswind buffeting along open riverfront and bridge approaches.',
        reporter: 'Met Spotter UK-North',
        timestamp: '28 mins ago',
        lat: Math.round((weather.location.latitude - 0.025) * 1000) / 1000,
        lon: Math.round((weather.location.longitude + 0.038) * 1000) / 1000,
        verifiedCount: 9
      },
      {
        id: 'seed-3',
        type: 'sky-optic',
        title: 'Crepuscular Rays & High Cirrus Iridescence',
        note: 'Sharp light shafts breaking through mid-level altocumulus deck toward the western horizon.',
        reporter: 'SkyWatch Photometry',
        timestamp: '54 mins ago',
        lat: Math.round((weather.location.latitude + 0.018) * 1000) / 1000,
        lon: Math.round((weather.location.longitude + 0.022) * 1000) / 1000,
        verifiedCount: 21
      }
    ];
  };

  const [reports, setReports] = useState<SkySpotterReport[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return buildSeedReports();
  });

  const [selectedType, setSelectedType] = useState<SkySpotterReport['type']>('sky-optic');
  const [customNote, setCustomNote] = useState<string>('');
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setReports(JSON.parse(saved));
      } else {
        setReports(buildSeedReports());
      }
    } catch {
      setReports(buildSeedReports());
    }
  }, [storageKey, weather.location.latitude, weather.location.longitude]);

  const handleDropPinReport = (e: React.FormEvent) => {
    e.preventDefault();
    const typeMeta = REPORT_TYPES.find((t) => t.id === selectedType) || REPORT_TYPES[0];
    const newReport: SkySpotterReport = {
      id: `spot-${Date.now()}`,
      type: selectedType,
      title: typeMeta.defaultTitle,
      note:
        customNote.trim() ||
        `Live ground observation pinned at ${weather.current.temperature.toFixed(1)}°C, wind ${Math.round(
          weather.current.windSpeed
        )} km/h.`,
      reporter: 'Local Sky-Spotter (You)',
      timestamp: 'Just now',
      lat:
        Math.round((weather.location.latitude + (Math.random() - 0.5) * 0.04) * 1000) / 1000,
      lon:
        Math.round((weather.location.longitude + (Math.random() - 0.5) * 0.04) * 1000) / 1000,
      verifiedCount: 1
    };

    const next = [newReport, ...reports.slice(0, 8)];
    setReports(next);
    setCustomNote('');
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 3000);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };

  const handleUpvote = (id: string) => {
    const next = reports.map((r) =>
      r.id === id ? { ...r, verifiedCount: r.verifiedCount + 1 } : r
    );
    setReports(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
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
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md shrink-0`}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black ${theme.ui.primaryText}`}>
              Sky-Spotter Ground Reports &amp; Geotagged Map Pins
            </h2>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              Crowd-verified surface weather observations, optical phenomena, and road hazards around {weather.location.name}
            </p>
          </div>
        </div>

        <span className={`text-xs font-mono font-bold ${theme.ui.subheadingText}`}>
          {reports.length} Active Ground Pins
        </span>
      </div>

      {/* Submit Ground Observation Bar */}
      <form
        onSubmit={handleDropPinReport}
        className={`relative z-10 p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-3`}
      >
        <ThemeTileArt theme={theme} variant="banner" index={3} />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
          <span className={`text-xs font-black ${theme.ui.primaryText}`}>
            Pin a Live Ground Observation at Your Coordinates:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {REPORT_TYPES.map((rt) => {
              const Icon = rt.icon;
              const active = selectedType === rt.id;
              return (
                <button
                  key={rt.id}
                  type="button"
                  onClick={() => setSelectedType(rt.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                    active
                      ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                      : `${theme.ui.cardSurface} ${theme.ui.primaryText}`
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{rt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Describe local sky, road, or precipitation conditions (optional)..."
            className={`flex-1 px-3.5 py-2 rounded-xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} text-xs font-semibold ${theme.ui.primaryText} placeholder:opacity-60 focus:outline-none`}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-xl text-xs font-black ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-transform shrink-0`}
          >
            {justSubmitted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Pin Dropped!</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Drop Weather Pin</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Geotagged Report Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.slice(0, 6).map((rep, idx) => {
          const typeMeta =
            REPORT_TYPES.find((t) => t.id === rep.type) || REPORT_TYPES[0];
          const Icon = typeMeta.icon;
          return (
            <div
              key={rep.id}
              className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex flex-col justify-between gap-3`}
            >
              <ThemeTileArt theme={theme} variant="metric" index={idx} />
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 ${typeMeta.badgeColor}`}
                  >
                    <Icon className="w-3 h-3" />
                    {typeMeta.label}
                  </span>
                  <span className={`text-[10px] font-mono ${theme.ui.secondaryText}`}>
                    {rep.timestamp}
                  </span>
                </div>
                <h3 className={`text-sm font-black ${theme.ui.primaryText}`}>
                  {rep.title}
                </h3>
                <p className={`text-xs font-semibold ${theme.ui.secondaryText} leading-relaxed`}>
                  {rep.note}
                </p>
              </div>

              <div className="relative z-10 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                <div className="font-mono">
                  <span className={`font-bold ${theme.ui.primaryText} block`}>
                    {rep.reporter}
                  </span>
                  <span className={`text-[10px] ${theme.ui.secondaryText}`}>
                    {rep.lat.toFixed(3)}°N, {rep.lon.toFixed(3)}°E
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleUpvote(rep.id)}
                  className={`px-2.5 py-1 rounded-lg ${theme.ui.cardSurface} ${theme.ui.primaryText} font-mono font-black text-xs flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform`}
                  title="Confirm this ground observation"
                >
                  <ThumbsUp className="w-3 h-3 text-emerald-400" />
                  <span>{rep.verifiedCount}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
