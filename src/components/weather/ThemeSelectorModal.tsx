import React from 'react';
import { Palette, Check, X, Sparkles, Wand2, SunMoon } from 'lucide-react';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

export function ThemeSelectorModal() {
  const { 
    currentThemeId, 
    setThemeId, 
    availableThemes, 
    isThemePickerOpen, 
    closeThemePicker, 
    theme,
    isAutoThemeSync,
    setAutoThemeSync
  } = useWeatherTheme();

  if (!isThemePickerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#120626]/75 backdrop-blur-md animate-fadeIn">
      <div 
        className={`relative w-full max-w-2xl rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-8 space-y-5 overflow-hidden max-h-[92vh] flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-modal-title"
      >
        {/* Wrapped Thematic Scenic Artwork */}
        <ThemeCardArtWrapper theme={theme} variant="hero" />

        {/* Top Iridescent Specular Glass Rim */}
        <div 
          aria-hidden="true" 
          className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} 
        />

        {/* Modal Header */}
        <div className={`relative z-10 flex items-center justify-between pb-3.5 border-b ${theme.ui.dividerBorder}`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} p-0.5 shadow-md flex items-center justify-center ${theme.ui.activePillText}`}>
              <Palette className="w-5 h-5 drop-shadow" />
            </div>
            <div>
              <h2 id="theme-modal-title" className={`text-xl font-black ${theme.ui.primaryText} tracking-tight`}>
                Atmospheric Visual Worlds
              </h2>
              <p className={`text-xs ${theme.ui.secondaryText} font-semibold`}>
                Switch bespoke painted scenes, sky gradients, particle physics, and lighting atmospheres
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeThemePicker}
            className={`relative overflow-hidden p-2 rounded-full ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText} transition-transform active:scale-95 cursor-pointer`}
            aria-label="Close theme selector"
          >
            <ThemeTileArt theme={theme} variant="pill" index={0} />
            <X className="relative z-10 w-5 h-5" />
          </button>
        </div>

        {/* Living Sky Auto-Theme Sync Banner */}
        <div 
          onClick={() => setAutoThemeSync(!isAutoThemeSync)}
          role="button"
          tabIndex={0}
          className={`relative z-10 overflow-hidden p-4 rounded-3xl transition-all cursor-pointer flex items-center justify-between gap-4 shadow-md ${
            isAutoThemeSync
              ? `${theme.ui.activePill} ${theme.ui.activePillText} ring-2 ring-amber-300`
              : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
          }`}
        >
          {!isAutoThemeSync && <ThemeTileArt theme={theme} variant="row" index={1} />}
          <div className="relative z-10 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              isAutoThemeSync ? 'bg-amber-400/30 text-amber-50' : `${theme.ui.activePill} ${theme.ui.activePillText}`
            }`}>
              <SunMoon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight">
                  Living Sky Auto-Theme Sync
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider font-black opacity-90">
                  · {isAutoThemeSync ? 'Active — Reactive to Local Sky' : 'Manual World Lock'}
                </span>
              </div>
              <p className="text-xs opacity-90 font-semibold mt-0.5">
                Automatically shifts between Meadow, Golden Hour, Twilight, Frost, Aurora &amp; Noir based on the city&apos;s real solar time &amp; weather
              </p>
            </div>
          </div>

          <div className={`relative z-10 px-3.5 py-1.5 rounded-xl text-xs font-black font-mono shrink-0 transition-all shadow-sm ${
            isAutoThemeSync
              ? 'bg-amber-300 text-slate-950'
              : `${theme.ui.activePill} ${theme.ui.activePillText}`
          }`}>
            {isAutoThemeSync ? 'AUTO ON' : 'ENABLE AUTO'}
          </div>
        </div>

        {/* Modular Themes Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-1 py-1 scrollbar-thin">
          {availableThemes.map((t) => {
            const isSelected = currentThemeId === t.id;
            return (
              <div
                key={t.id}
                role="button"
                tabIndex={0}
                onClick={() => setThemeId(t.id, true)}
                className={`group relative p-4.5 rounded-[28px] transition-all cursor-pointer select-none text-left flex flex-col justify-between gap-3 overflow-hidden ${
                  isSelected
                    ? `${t.ui.cardSurface} ${t.ui.cardBorder} ring-3 ring-amber-400 shadow-xl scale-[1.02]`
                    : `${t.ui.cardSurface} ${t.ui.tileBorder} ${t.ui.tileHover} shadow-md hover:scale-[1.01]`
                }`}
              >
                {/* Embedded Full-Color Theme Scenic Artwork */}
                <ThemeCardArtWrapper theme={t} variant="launcher" />

                {/* Theme Swatch Pill */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 p-1 rounded-full ${t.ui.controlTrack} shadow-sm`}>
                    <span 
                      className="w-4 h-4 rounded-full shadow-xs" 
                      style={{ backgroundColor: t.previewColors[0] }} 
                    />
                    <span 
                      className="w-4 h-4 rounded-full shadow-xs" 
                      style={{ backgroundColor: t.previewColors[1] }} 
                    />
                    <span 
                      className="w-4 h-4 rounded-full shadow-xs" 
                      style={{ backgroundColor: t.previewColors[2] }} 
                    />
                  </div>

                  {isSelected && (
                    <span className={`flex items-center gap-1 text-[11px] font-black ${t.ui.activePill} ${t.ui.activePillText} px-3 py-0.5 rounded-full shadow-sm`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                      {isAutoThemeSync ? 'Auto-Synced' : 'Active World'}
                    </span>
                  )}
                </div>

                {/* Theme Details */}
                <div className="relative z-10">
                  <h3 className={`font-black text-base ${t.ui.primaryText} group-hover:${t.ui.accentText} transition-colors`}>
                    {t.name}
                  </h3>
                  <div className={`text-[11px] font-black ${t.ui.subheadingText} font-mono mt-0.5`}>
                    {t.tagline}
                  </div>
                  <p className={`text-xs ${t.ui.secondaryText} font-semibold mt-1.5 line-clamp-2 leading-relaxed`}>
                    {t.description}
                  </p>
                </div>

                {/* Particle Type Footer */}
                <div className={`relative z-10 pt-2 border-t ${t.ui.dividerBorder} flex items-center justify-between text-[10px] font-mono font-bold ${t.ui.secondaryText}`}>
                  <span>Particle: <strong className={`${t.ui.primaryText} uppercase`}>{t.particleType}</strong></span>
                  <span className="flex items-center gap-1 font-black">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Illustrated Scene
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className={`relative z-10 pt-3 border-t ${theme.ui.dividerBorder} flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold ${theme.ui.secondaryText}`}>
          <div className="flex items-center gap-1.5">
            <Wand2 className={`w-4 h-4 ${theme.ui.accentText} shrink-0`} />
            <span>Every theme transforms all cards, inner tiles, sky particles, and charts into a living world.</span>
          </div>
          <button
            type="button"
            onClick={closeThemePicker}
            className={`clay-button px-5 py-2 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} font-black transition-all cursor-pointer shadow-md active:scale-95`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
