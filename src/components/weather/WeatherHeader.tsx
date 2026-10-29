import React, { useState } from 'react';
import { 
  CloudSun, 
  Sun, 
  Moon, 
  RefreshCw, 
  Layers, 
  Wind, 
  Car, 
  Trophy, 
  Shirt, 
  AlertTriangle,
  Menu,
  X,
  Volume2,
  VolumeX,
  Palette,
  Telescope,
  Sprout,
  Sliders,
  Maximize2
} from 'lucide-react';
import { TempUnit, SpeedUnit } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

export type WeatherSectionTab = 
  | 'overview' 
  | 'radar' 
  | 'air-pollen' 
  | 'commute' 
  | 'outdoor' 
  | 'wardrobe'
  | 'celestial'
  | 'microclimate';

interface WeatherHeaderProps {
  activeTab: WeatherSectionTab;
  onSelectTab: (tab: WeatherSectionTab) => void;
  tempUnit: TempUnit;
  onToggleTempUnit: () => void;
  speedUnit: SpeedUnit;
  onToggleSpeedUnit: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  alertCount?: number;
  onOpenAlerts?: () => void;
  isSoundPlaying?: boolean;
  onToggleSound?: () => void;
  soundLevels?: number[];
  onOpenSoundMixer?: () => void;
  onEnterZenMode?: () => void;
}

export function WeatherHeader({
  activeTab,
  onSelectTab,
  tempUnit,
  onToggleTempUnit,
  speedUnit,
  onToggleSpeedUnit,
  isDarkMode,
  onToggleDarkMode,
  onRefresh,
  isRefreshing = false,
  alertCount = 0,
  onOpenAlerts,
  isSoundPlaying = false,
  onToggleSound,
  soundLevels = [0.2, 0.4, 0.3, 0.5],
  onOpenSoundMixer,
  onEnterZenMode
}: WeatherHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openThemePicker, theme, isAutoThemeSync } = useWeatherTheme();

  const tabs: { id: WeatherSectionTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Forecast', icon: CloudSun },
    { id: 'radar', label: 'Radar', icon: Layers },
    { id: 'celestial', label: 'Celestial', icon: Telescope },
    { id: 'microclimate', label: 'Botanical & Home', icon: Sprout },
    { id: 'air-pollen', label: 'Pollen', icon: Wind },
    { id: 'commute', label: 'Transit', icon: Car },
    { id: 'outdoor', label: 'Outdoor', icon: Trophy },
    { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full relative overflow-hidden ${theme.ui.headerSurface} border-b-2 ${theme.ui.headerBorder} shadow-[0_8px_32px_rgba(0,0,0,0.14)] transition-all duration-300`}>
      {/* Subtle Thematic Illustrated Header Ribbon */}
      <ThemeCardArtWrapper theme={theme} variant="compact" showCornerFiligrees={false} className="opacity-55" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className={`w-10 h-10 rounded-2xl ${theme.ui.activePill} p-0.5 shadow-md flex items-center justify-center ${theme.ui.activePillText}`}>
              <CloudSun className="w-6 h-6 drop-shadow" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={`font-black text-base tracking-tight ${theme.ui.primaryText}`}>
                  AETHER
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${theme.ui.subheadingText} font-mono`}>
                  · {isAutoThemeSync ? 'LIVING SKY' : 'OBSERVATORY'}
                </span>
              </div>
              <span className={`text-[10px] ${theme.ui.secondaryText} font-bold`}>
                {theme.name} World
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Desktop XL) */}
          <nav className={`hidden xl:flex items-center gap-1 ${theme.ui.controlTrack} p-1.5 rounded-2xl shadow-sm`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-sm font-black scale-102`
                      : `${theme.ui.inactivePillText}`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Trailing Utility Actions */}
          <div className="flex items-center gap-1.5">
            
            {/* Severe Weather Alert Badge if active */}
            {alertCount > 0 && onOpenAlerts && (
              <button
                onClick={onOpenAlerts}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/30 text-amber-950 dark:text-amber-200 border border-amber-400/60 text-xs font-black animate-pulse hover:bg-amber-500/40 transition-all cursor-pointer shadow-sm"
                title={`${alertCount} active severe weather advisory`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
                <span>{alertCount}</span>
              </button>
            )}

            {/* Atmospheric Soundscape Equalizer Toggle + Mixer Button */}
            {onToggleSound && (
              <div className="flex items-center gap-1">
                <button
                  onClick={onToggleSound}
                  className={`relative overflow-hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-sm ${
                    isSoundPlaying
                      ? `${theme.ui.activePill} ${theme.ui.activePillText} font-black`
                      : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} ${theme.ui.primaryText}`
                  }`}
                  title={isSoundPlaying ? 'Mute Atmospheric Soundscape' : 'Play Ambient Soundscape'}
                  aria-label="Toggle atmospheric soundscape"
                >
                  {!isSoundPlaying && <ThemeTileArt theme={theme} variant="pill" index={0} />}
                  {isSoundPlaying ? <Volume2 className="relative z-10 w-4 h-4 text-amber-50 animate-pulse" /> : <VolumeX className="relative z-10 w-4 h-4" />}
                  <div className="relative z-10 flex items-end gap-0.5 h-3.5 w-3.5 pb-0.5">
                    {soundLevels.slice(0, 4).map((lvl, idx) => (
                      <div
                        key={idx}
                        className={`w-0.5 rounded-full transition-all duration-100 ${
                          isSoundPlaying ? 'bg-amber-50' : 'bg-current opacity-60'
                        }`}
                        style={{
                          height: isSoundPlaying ? `${Math.max(20, lvl * 100)}%` : '25%'
                        }}
                      />
                    ))}
                  </div>
                </button>

                {onOpenSoundMixer && (
                  <button
                    onClick={onOpenSoundMixer}
                    className={`relative overflow-hidden p-2 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} ${theme.ui.primaryText} transition-all cursor-pointer shadow-sm active:scale-95`}
                    title="Open 5-Channel Soundscape Mixer"
                    aria-label="Open soundscape mixer"
                  >
                    <ThemeTileArt theme={theme} variant="pill" index={1} />
                    <Sliders className="relative z-10 w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Zen Sanctuary Fullscreen Window Button */}
            {onEnterZenMode && (
              <button
                onClick={onEnterZenMode}
                className={`relative overflow-hidden hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} ${theme.ui.primaryText} text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95`}
                title="Enter Fullscreen Zen Window ('Look Outside')"
                aria-label="Enter Zen Window Mode"
              >
                <ThemeTileArt theme={theme} variant="pill" index={2} />
                <Maximize2 className="relative z-10 w-3.5 h-3.5" />
                <span className="relative z-10 hidden md:inline text-[11px]">Zen View</span>
              </button>
            )}

            {/* Modular Theme Selector Button */}
            <button
              onClick={openThemePicker}
              className={`relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${theme.ui.activePill} ${theme.ui.activePillText} text-xs font-black transition-all cursor-pointer shadow-md active:scale-95 group`}
              title={`Active Atmosphere: ${theme.name}. Click to switch theme or toggle Auto-Sync.`}
              aria-label="Change visual theme"
            >
              <Palette className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline font-mono text-[11px] font-black">{theme.name}</span>
              <span className="sm:hidden font-mono text-[11px]">Theme</span>
            </button>

            {/* Temp Unit Switcher (°C / °F) */}
            <button
              onClick={onToggleTempUnit}
              className={`relative overflow-hidden px-2.5 py-1.5 rounded-xl text-xs font-mono font-black ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} ${theme.ui.primaryText} transition-all cursor-pointer shadow-sm active:scale-95`}
              title="Toggle Celsius / Fahrenheit"
            >
              <ThemeTileArt theme={theme} variant="pill" index={3} />
              <span className="relative z-10">{tempUnit === 'celsius' ? '°C' : '°F'}</span>
            </button>

            {/* Speed Unit Switcher (mph / km/h) */}
            <button
              onClick={onToggleSpeedUnit}
              className={`relative overflow-hidden hidden md:inline-flex px-2.5 py-1.5 rounded-xl text-xs font-mono font-black ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} ${theme.ui.primaryText} transition-all cursor-pointer shadow-sm active:scale-95`}
              title="Toggle Wind Speed Unit"
            >
              <ThemeTileArt theme={theme} variant="pill" index={4} />
              <span className="relative z-10">{speedUnit.toUpperCase()}</span>
            </button>

            {/* Data Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`relative overflow-hidden p-2 rounded-xl ${theme.ui.primaryText} ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} transition-transform shadow-sm cursor-pointer ${
                isRefreshing ? 'animate-spin' : 'hover:scale-105 active:scale-95'
              }`}
              title="Refresh live atmospheric data"
              aria-label="Refresh data"
            >
              <ThemeTileArt theme={theme} variant="pill" index={5} />
              <RefreshCw className="relative z-10 w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`relative overflow-hidden p-2 rounded-xl ${theme.ui.primaryText} ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} transition-transform hover:scale-105 active:scale-95 cursor-pointer`}
              title="Toggle dark / light mode"
              aria-label="Toggle theme"
            >
              <ThemeTileArt theme={theme} variant="pill" index={0} />
              {isDarkMode ? <Sun className="relative z-10 w-4 h-4 text-amber-400" /> : <Moon className={`relative z-10 w-4 h-4 ${theme.ui.accentText}`} />}
            </button>

            {/* Mobile/Tablet Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`relative overflow-hidden xl:hidden p-2 rounded-xl ${theme.ui.primaryText} ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}
              aria-label="Toggle mobile menu"
            >
              <ThemeTileArt theme={theme} variant="pill" index={1} />
              {mobileMenuOpen ? <X className="relative z-10 w-4 h-4" /> : <Menu className="relative z-10 w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className={`xl:hidden py-3 border-t ${theme.ui.dividerBorder} grid grid-cols-2 sm:grid-cols-4 gap-1.5 pb-4 animate-fade-in`}>
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onSelectTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`relative overflow-hidden flex items-center gap-2 p-2.5 rounded-xl text-xs font-black transition-all ${
                    isActive
                      ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                      : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
                  }`}
                >
                  {!isActive && <ThemeTileArt theme={theme} variant="pill" index={idx} />}
                  <Icon className="relative z-10 w-4 h-4 shrink-0" />
                  <span className="relative z-10 truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
