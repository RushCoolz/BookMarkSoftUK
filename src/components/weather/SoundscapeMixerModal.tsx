import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  CloudRain, 
  CloudLightning, 
  Sparkles, 
  Wind, 
  Music, 
  X, 
  Maximize2,
  Sliders
} from 'lucide-react';
import { soundscape, SoundscapeChannelMix, SoundscapePresetId } from '../../services/soundscapeService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';
import { WeatherData } from '../../types/weather';
import { decodeWmoCode } from '../../services/weatherService';

interface SoundscapeMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherData | null;
  isSoundPlaying: boolean;
  onToggleSound: () => void;
  onEnterZenMode: () => void;
}

export function SoundscapeMixerModal({
  isOpen,
  onClose,
  weather,
  isSoundPlaying,
  onToggleSound,
  onEnterZenMode
}: SoundscapeMixerModalProps) {
  const { theme } = useWeatherTheme();
  const [mix, setMix] = useState<SoundscapeChannelMix>(() => soundscape.getMix());
  const [activePreset, setActivePreset] = useState<SoundscapePresetId>(() => soundscape.getActivePreset());

  useEffect(() => {
    soundscape.setMixChangeCallback((newMix, newPreset) => {
      setMix(newMix);
      setActivePreset(newPreset);
    });
  }, []);

  if (!isOpen) return null;

  const handleSliderChange = (channel: keyof SoundscapeChannelMix, value: number) => {
    setMix((prev) => ({ ...prev, [channel]: value }));
    soundscape.setChannelLevel(channel, value);
  };

  const handleSelectPreset = (presetId: SoundscapePresetId) => {
    const wmo = weather ? decodeWmoCode(weather.current.weatherCode, weather.current.isDay) : { category: 'clear' };
    soundscape.applyPreset(
      presetId,
      wmo.category,
      weather?.current.precipitation ?? 0,
      weather?.current.windSpeed ?? 12
    );
    setActivePreset(presetId);
    setMix(soundscape.getMix());
  };

  const presets: { id: SoundscapePresetId; label: string; subtitle: string }[] = [
    { id: 'auto-weather', label: 'Live Sky Sync', subtitle: 'Matches current city rain & wind' },
    { id: 'shinkai-rain', label: 'Twilight Rainstorm', subtitle: 'Warm rain on glass & distant thunder' },
    { id: 'ghibli-meadow', label: 'Summer Meadow', subtitle: 'Crystalline wind chimes & breeze' },
    { id: 'aurora-zen', label: 'Aurora Meditations', subtitle: 'Lush harmonic drone & starlight bells' },
    { id: 'alpine-gale', label: 'Alpine Peak', subtitle: 'High-altitude resonant wind gusts' },
  ];

  const channels: {
    key: keyof SoundscapeChannelMix;
    label: string;
    detail: string;
    icon: React.ElementType;
  }[] = [
    { key: 'rain', label: 'Rain on Glass', detail: 'Bandpass droplet synthesis', icon: CloudRain },
    { key: 'thunder', label: 'Distant Thunder', detail: 'Low-frequency rolling acoustics', icon: CloudLightning },
    { key: 'chimes', label: 'Meadow Wind Chimes', detail: 'Pentatonic crystalline bells', icon: Sparkles },
    { key: 'wind', label: 'Alpine Breeze', detail: 'LFO-swept pink noise gusts', icon: Wind },
    { key: 'chords', label: 'Warm Analog Chords', detail: 'Fmaj9 harmonic sanctuary pad', icon: Music },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#120626]/75 backdrop-blur-md animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="soundscape-mixer-title"
        className={`relative w-full max-w-2xl rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-8 space-y-6 overflow-hidden max-h-[92vh] flex flex-col`}
      >
        <ThemeCardArtWrapper theme={theme} variant="hero" />
        <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

        {/* Header */}
        <div className={`relative z-10 flex items-center justify-between pb-4 border-b ${theme.ui.dividerBorder}`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} p-0.5 shadow-md flex items-center justify-center ${theme.ui.activePillText}`}>
              <Sliders className="w-5 h-5 drop-shadow" />
            </div>
            <div>
              <h2 id="soundscape-mixer-title" className={`text-xl font-black ${theme.ui.primaryText} tracking-tight`}>
                Atmospheric Soundscape Studio
              </h2>
              <p className={`text-xs ${theme.ui.secondaryText} font-semibold`}>
                5-Channel procedural Web Audio synthesis · Zero external audio loops
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSound}
              className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 ${
                isSoundPlaying
                  ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                  : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
              }`}
            >
              {isSoundPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span>{isSoundPlaying ? 'Playing Live' : 'Start Audio'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`relative overflow-hidden p-2 rounded-full ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText} transition-transform active:scale-95 cursor-pointer`}
              aria-label="Close soundscape mixer"
            >
              <ThemeTileArt theme={theme} variant="pill" index={0} />
              <X className="relative z-10 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="relative z-10 space-y-5 overflow-y-auto pr-1 scrollbar-thin">
          {/* Acoustic Presets Row */}
          <div className="space-y-2">
            <span className={`text-xs font-black uppercase tracking-wider ${theme.ui.subheadingText} block`}>
              Acoustic Atmosphere Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {presets.map((p, idx) => {
                const isSelected = activePreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p.id)}
                    className={`relative overflow-hidden p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                      isSelected
                        ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-md ring-2 ring-amber-300/70`
                        : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} ${theme.ui.primaryText}`
                    }`}
                  >
                    {!isSelected && <ThemeTileArt theme={theme} variant="pill" index={idx} />}
                    <span className="relative z-10 text-xs font-black leading-tight block">
                      {p.label}
                    </span>
                    <span className="relative z-10 text-[10px] font-semibold opacity-85 leading-snug block">
                      {p.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5 Individual Channel Sliders */}
          <div className="space-y-2.5">
            <span className={`text-xs font-black uppercase tracking-wider ${theme.ui.subheadingText} block`}>
              Individual Synthesis Channels
            </span>
            <div className="space-y-2.5">
              {channels.map((ch, idx) => {
                const Icon = ch.icon;
                const val = mix[ch.key];
                const pct = Math.round(val * 100);
                return (
                  <div
                    key={ch.key}
                    className={`relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm`}
                  >
                    <ThemeTileArt theme={theme} variant="row" index={idx} />
                    <div className="relative z-10 flex items-center gap-3 min-w-[200px]">
                      <div className={`w-9 h-9 rounded-xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shrink-0 shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`text-xs font-black ${theme.ui.primaryText} block`}>
                          {ch.label}
                        </span>
                        <span className={`text-[10px] font-semibold ${theme.ui.secondaryText} block`}>
                          {ch.detail}
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-3 flex-1 max-w-xs">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.02}
                        value={val}
                        onChange={(e) => handleSliderChange(ch.key, parseFloat(e.target.value))}
                        aria-label={`${ch.label} volume`}
                        className="w-full accent-amber-400 cursor-pointer h-2 rounded-lg"
                      />
                      <span className={`text-xs font-mono font-black ${theme.ui.primaryText} w-10 text-right`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer: Launch Zen Window Mode */}
        <div className={`relative z-10 pt-4 border-t ${theme.ui.dividerBorder} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEnterZenMode();
            }}
            className={`px-4 py-2.5 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95`}
          >
            <Maximize2 className="w-4 h-4" />
            <span>Enter Fullscreen Zen Window (&ldquo;Look Outside&rdquo;)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`relative overflow-hidden px-5 py-2.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText} text-xs font-black cursor-pointer`}
          >
            <ThemeTileArt theme={theme} variant="pill" index={4} />
            <span className="relative z-10">Close Mixer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
