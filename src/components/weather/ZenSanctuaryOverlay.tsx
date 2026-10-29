import React, { useState, useEffect } from 'react';
import { 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Palette, 
  Sliders, 
  Sparkles,
  MapPin,
  Wind,
  Droplets
} from 'lucide-react';
import { WeatherData, TempUnit } from '../../types/weather';
import { formatTempWithUnit, decodeWmoCode } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface ZenSanctuaryOverlayProps {
  isOpen: boolean;
  onExit: () => void;
  weather: WeatherData;
  unit: TempUnit;
  isSoundPlaying: boolean;
  onToggleSound: () => void;
  onOpenSoundMixer: () => void;
  showConstellationPatterns?: boolean;
  onToggleConstellations?: () => void;
}

export function ZenSanctuaryOverlay({
  isOpen,
  onExit,
  weather,
  unit,
  isSoundPlaying,
  onToggleSound,
  onOpenSoundMixer,
  showConstellationPatterns = true,
  onToggleConstellations
}: ZenSanctuaryOverlayProps) {
  const { theme, openThemePicker } = useWeatherTheme();
  const [clockStr, setClockStr] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    const updateClock = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: weather.timezone || undefined
        }).format(now);
        setClockStr(formatted);
      } catch {
        setClockStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    };
    updateClock();
    const id = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(id);
  }, [isOpen, weather.timezone]);

  if (!isOpen) return null;

  const wmo = decodeWmoCode(weather.current.weatherCode, weather.current.isDay);

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-between p-6 sm:p-10 pointer-events-none select-none animate-fadeIn">
      {/* Full-Viewport Illustrated Scenic Frame */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <ThemeCardArtWrapper theme={theme} variant="hero" className="opacity-85 scale-105" />
      </div>

      {/* Top Floating Sanctuary Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
        <div className={`relative overflow-hidden px-5 py-3 rounded-3xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} flex items-center gap-3`}>
          <ThemeTileArt theme={theme} variant="pill" index={0} />
          <Sparkles className={`relative z-10 w-4 h-4 ${theme.ui.accentText}`} />
          <div className="relative z-10">
            <span className={`text-xs font-black uppercase tracking-widest ${theme.ui.primaryText} block`}>
              Zen Sanctuary Window · {theme.name}
            </span>
            <span className={`text-[11px] font-semibold ${theme.ui.secondaryText} block`}>
              {theme.tagline} — Live Atmospheric &amp; Celestial Immersion
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onToggleConstellations && (
            <button
              type="button"
              onClick={onToggleConstellations}
              className={`relative overflow-hidden px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
                showConstellationPatterns
                  ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                  : `${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.primaryText}`
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{showConstellationPatterns ? 'Sky Star Patterns: ON' : 'Sky Star Patterns: OFF'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleSound}
            className={`relative overflow-hidden px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
              isSoundPlaying
                ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                : `${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.primaryText}`
            }`}
          >
            {isSoundPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span>{isSoundPlaying ? 'Soundscape Active' : 'Play Soundscape'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenSoundMixer}
            className={`relative overflow-hidden px-4 py-2.5 rounded-2xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.primaryText} text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg`}
          >
            <ThemeTileArt theme={theme} variant="pill" index={1} />
            <Sliders className="relative z-10 w-4 h-4" />
            <span className="relative z-10 hidden sm:inline">5-Ch Mixer</span>
          </button>

          <button
            type="button"
            onClick={openThemePicker}
            className={`relative overflow-hidden px-4 py-2.5 rounded-2xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.primaryText} text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg`}
          >
            <ThemeTileArt theme={theme} variant="pill" index={2} />
            <Palette className="relative z-10 w-4 h-4" />
            <span className="relative z-10 hidden sm:inline">Switch World</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            className={`px-4 py-2.5 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-95`}
          >
            <Minimize2 className="w-4 h-4" />
            <span>Return to Observatory</span>
          </button>
        </div>
      </div>

      {/* Bottom Poetic Telemetry & Local Clock Sanctuary Card */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pointer-events-auto">
        <div className={`relative overflow-hidden p-6 sm:p-8 rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} max-w-xl space-y-3`}>
          <ThemeCardArtWrapper theme={theme} variant="compact" />
          <div className="relative z-10 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <MapPin className={`w-4 h-4 ${theme.ui.accentText}`} />
            <span className={theme.ui.primaryText}>
              {weather.location.name}, {weather.location.country}
            </span>
            <span aria-hidden="true" className={theme.ui.secondaryText}>·</span>
            <span className={`font-mono ${theme.ui.subheadingText}`}>
              {clockStr} Local Time
            </span>
          </div>

          <div className="relative z-10 flex items-baseline gap-4">
            <span className={`text-6xl sm:text-7xl font-black font-mono tracking-tighter bg-gradient-to-br ${theme.ui.headingGradient} bg-clip-text text-transparent`}>
              {formatTempWithUnit(weather.current.temperature, unit)}
            </span>
            <div>
              <span className={`text-xl font-black ${theme.ui.primaryText} block`}>
                {wmo.description}
              </span>
              <span className={`text-xs font-semibold ${theme.ui.secondaryText} block`}>
                Feels like {formatTempWithUnit(weather.current.apparentTemperature, unit)}
              </span>
            </div>
          </div>

          <div className={`relative z-10 pt-3 border-t ${theme.ui.dividerBorder} flex flex-wrap items-center gap-4 text-xs font-bold ${theme.ui.secondaryText}`}>
            <span className="flex items-center gap-1.5">
              <Wind className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              Wind {Math.round(weather.current.windSpeed)} km/h
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Droplets className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              Humidity {weather.current.relativeHumidity}%
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Cloud Cover {weather.current.cloudCover}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
