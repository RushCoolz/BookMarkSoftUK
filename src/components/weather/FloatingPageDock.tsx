import React from 'react';
import { 
  CloudSun, 
  Layers, 
  Wind, 
  Car, 
  Trophy, 
  Shirt,
  Palette,
  Telescope,
  Sprout
} from 'lucide-react';
import { WeatherSectionTab } from './WeatherHeader';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface FloatingPageDockProps {
  activeTab: WeatherSectionTab;
  onSelectTab: (tab: WeatherSectionTab) => void;
}

export function FloatingPageDock({ activeTab, onSelectTab }: FloatingPageDockProps) {
  const { openThemePicker, theme } = useWeatherTheme();

  const pages: { id: WeatherSectionTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Forecast', icon: CloudSun },
    { id: 'radar', label: 'Radar', icon: Layers },
    { id: 'celestial', label: 'Celestial', icon: Telescope },
    { id: 'microclimate', label: 'Botanical', icon: Sprout },
    { id: 'air-pollen', label: 'Pollen', icon: Wind },
    { id: 'commute', label: 'Transit', icon: Car },
    { id: 'outdoor', label: 'Outdoor', icon: Trophy },
    { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[96vw] pointer-events-auto animate-fadeIn">
      <div className={`relative overflow-hidden flex items-center gap-1 p-1.5 sm:p-2 rounded-full ${theme.ui.dockSurface} ${theme.ui.dockBorder} ${theme.ui.glowShadow} backdrop-blur-2xl transition-all duration-300 overflow-x-auto scrollbar-none`}>
        <ThemeCardArtWrapper theme={theme} variant="compact" showCornerFiligrees={false} />
        {pages.map((p) => {
          const Icon = p.icon;
          const isActive = activeTab === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectTab(p.id)}
              className={`relative z-10 overflow-hidden flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-full text-xs font-black transition-all duration-200 cursor-pointer select-none active:scale-95 shrink-0 ${
                isActive
                  ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-md scale-105 ring-2 ring-amber-300/60`
                  : `${theme.ui.inactivePillText} hover:${theme.ui.tileSurface}`
              }`}
              title={p.label}
              aria-label={`Navigate to ${p.label} page`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className={`${isActive ? 'inline' : 'hidden md:inline'} text-[11px] font-black`}>
                {p.label}
              </span>
            </button>
          );
        })}

        {/* Theme Picker Icon Button */}
        <div className={`relative z-10 w-[1px] h-5 ${theme.ui.dividerBorder} border-l mx-0.5 shrink-0`} />
        <button
          type="button"
          onClick={openThemePicker}
          className={`relative z-10 overflow-hidden p-2 sm:px-3 sm:py-2 rounded-full ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText} transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm shrink-0`}
          title={`Switch Visual Theme Atmosphere (Current: ${theme.name})`}
          aria-label="Open Theme Selector"
        >
          <ThemeTileArt theme={theme} variant="pill" index={5} />
          <Palette className={`relative z-10 w-4 h-4 ${theme.ui.accentText}`} />
          <span className="relative z-10 hidden lg:inline text-[10px] font-black font-mono">Theme</span>
        </button>
      </div>
    </div>
  );
}
