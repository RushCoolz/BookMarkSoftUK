/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CloudSun, 
  AlertTriangle,
  Loader2
} from 'lucide-react';

import { 
  WeatherData, 
  LocationData, 
  TempUnit, 
  SpeedUnit, 
  SevereAlert,
  HourlyForecastItem 
} from './types/weather';
import { 
  DEFAULT_LOCATION, 
  fetchFullWeather, 
  deriveSevereAlerts, 
  deriveActivitySuitabilities, 
  deriveTransitImpact, 
  deriveWardrobeRecommendations,
  decodeWmoCode
} from './services/weatherService';
import { soundscape } from './services/soundscapeService';

// Weather Components
import { WeatherHeader, WeatherSectionTab } from './components/weather/WeatherHeader';
import { AtmosphericCanvas } from './components/weather/AtmosphericCanvas';
import { HyperlocalSearch } from './components/weather/HyperlocalSearch';
import { CurrentHero } from './components/weather/CurrentHero';
import { HourlyForecastSlider } from './components/weather/HourlyForecastSlider';
import { HourlyCurveChart } from './components/weather/HourlyCurveChart';
import { DailyForecastOutlook } from './components/weather/DailyForecastOutlook';
import { LiveRadarMap } from './components/weather/LiveRadarMap';
import { PollenAndAirQuality } from './components/weather/PollenAndAirQuality';
import { TransitAndCommuteFeed } from './components/weather/TransitAndCommuteFeed';
import { OutdoorActivityPlanner } from './components/weather/OutdoorActivityPlanner';
import { SmartWardrobePrompts } from './components/weather/SmartWardrobePrompts';
import { SevereWeatherAlertsModal } from './components/weather/SevereWeatherAlertsModal';
import { PageNavigationBanner } from './components/weather/PageNavigationBanner';
import { PageLaunchersGrid } from './components/weather/PageLaunchersGrid';
import { FloatingPageDock } from './components/weather/FloatingPageDock';
import { WeatherThemeProvider, useWeatherTheme } from './context/WeatherThemeContext';
import { ThemeSelectorModal } from './components/weather/ThemeSelectorModal';
import { ThemeCardArtWrapper } from './components/weather/ThemeCardArtWrapper';
import { WorldPostcardDeck } from './components/weather/WorldPostcardDeck';
import { TimeTravelScrubber } from './components/weather/TimeTravelScrubber';
import { CelestialObservatory } from './components/weather/CelestialObservatory';
import { MicroClimateStudio } from './components/weather/MicroClimateStudio';
import { SoundscapeMixerModal } from './components/weather/SoundscapeMixerModal';
import { ZenSanctuaryOverlay } from './components/weather/ZenSanctuaryOverlay';

function WeatherAppContent() {
  const [currentLocation, setCurrentLocation] = useState<LocationData>(() => {
    try {
      const saved = localStorage.getItem('aether_saved_loc');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_LOCATION;
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 24-Hour Time-Travel Scrubber Index (0 = Live Now, 1..23 = future hours)
  const [scrubIndex, setScrubIndex] = useState<number>(0);

  // Zen Sanctuary Fullscreen Mode & Soundscape Mixer Modal
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isSoundMixerOpen, setIsSoundMixerOpen] = useState<boolean>(false);

  // Preference Settings
  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    try {
      return (localStorage.getItem('aether_temp_unit') as TempUnit) || 'celsius';
    } catch {
      return 'celsius';
    }
  });

  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>(() => {
    try {
      return (localStorage.getItem('aether_speed_unit') as SpeedUnit) || 'mph';
    } catch {
      return 'mph';
    }
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // URL Hash Based Multi-Page Navigation
  const getTabFromHash = (): WeatherSectionTab => {
    if (typeof window === 'undefined') return 'overview';
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'radar') return 'radar';
    if (hash === 'celestial' || hash === 'astronomy') return 'celestial';
    if (hash === 'microclimate' || hash === 'botanical') return 'microclimate';
    if (hash === 'air-pollen' || hash === 'pollen') return 'air-pollen';
    if (hash === 'commute' || hash === 'transit') return 'commute';
    if (hash === 'outdoor' || hash === 'activities') return 'outdoor';
    if (hash === 'wardrobe' || hash === 'clothing') return 'wardrobe';
    return 'overview';
  };

  const [activeTab, setActiveTabState] = useState<WeatherSectionTab>(getTabFromHash);

  const navigateToPage = (tab: WeatherSectionTab) => {
    setActiveTabState(tab);
    const hash = tab === 'overview' ? 'forecast' : tab;
    if (window.location.hash !== `#${hash}`) {
      window.location.hash = hash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTabState(getTabFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Selected hour for interactive timeline exploration
  const [selectedHour, setSelectedHour] = useState<HourlyForecastItem | undefined>(undefined);

  // Severe Alert Dialog
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  // Atmospheric Soundscape State
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);
  const [soundLevels, setSoundLevels] = useState<number[]>([0.2, 0.4, 0.3, 0.5]);

  useEffect(() => {
    soundscape.setVisualizerCallback((levels) => {
      setSoundLevels(levels);
    });
  }, []);

  // Compute Effective Weather when user scrubs the 24-Hour Time-Travel Scrubber
  const effectiveWeather: WeatherData | null = useMemo(() => {
    if (!weather) return null;
    if (scrubIndex === 0 || !weather.hourly || weather.hourly.length === 0) {
      return weather;
    }
    const currentIsoPrefix = weather.current.time.slice(0, 13);
    const startIdx = Math.max(
      0,
      weather.hourly.findIndex((h) => h.time.startsWith(currentIsoPrefix))
    );
    const targetHour = weather.hourly[Math.min(weather.hourly.length - 1, startIdx + scrubIndex)];
    if (!targetHour) return weather;

    const hourPart = targetHour.time.includes('T') ? targetHour.time.split('T')[1] : targetHour.time;
    const hourNum = parseInt(hourPart.split(':')[0], 10) || 12;
    const isDayScrubbed = hourNum >= 6 && hourNum < 20 ? 1 : 0;

    return {
      ...weather,
      current: {
        ...weather.current,
        time: targetHour.time,
        temperature: targetHour.temperature,
        apparentTemperature: targetHour.apparentTemperature,
        relativeHumidity: targetHour.relativeHumidity,
        precipitation: targetHour.precipitation,
        weatherCode: targetHour.weatherCode,
        cloudCover: targetHour.cloudCover,
        windSpeed: targetHour.windSpeed,
        windDirection: targetHour.windDirection,
        windGusts: targetHour.windGusts,
        uvIndex: targetHour.uvIndex,
        isDay: isDayScrubbed,
      },
    };
  }, [weather, scrubIndex]);

  const { theme, isAutoThemeSync, syncThemeWithWeather } = useWeatherTheme();

  // Living Sky Auto-Theme Sync effect when weather or time-scrubber changes
  useEffect(() => {
    if (!effectiveWeather || !isAutoThemeSync) return;
    syncThemeWithWeather({
      weatherCode: effectiveWeather.current.weatherCode,
      temperatureC: effectiveWeather.current.temperature,
      isDay: effectiveWeather.current.isDay,
      currentTimeIso: effectiveWeather.current.time,
      sunriseIso: effectiveWeather.daily[0]?.sunrise,
      sunsetIso: effectiveWeather.daily[0]?.sunset,
      latitude: effectiveWeather.location.latitude,
    });
  }, [effectiveWeather, isAutoThemeSync, syncThemeWithWeather]);

  const handleToggleSound = () => {
    if (!effectiveWeather) return;
    const wmo = decodeWmoCode(effectiveWeather.current.weatherCode, effectiveWeather.current.isDay);
    const active = soundscape.toggle(
      wmo.category,
      effectiveWeather.current.precipitation,
      effectiveWeather.current.windSpeed
    );
    setIsSoundPlaying(active);
  };

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Load weather data
  const loadWeatherData = useCallback(async (loc: LocationData, isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setLoadError(null);

    try {
      const data = await fetchFullWeather(loc);
      setWeather(data);
      setSelectedHour(undefined);
      setScrubIndex(0);
      try {
        localStorage.setItem('aether_saved_loc', JSON.stringify(loc));
      } catch {}
    } catch (err: any) {
      console.error('Weather load error:', err);
      setLoadError(err?.message || 'Unable to load atmospheric data. Please check your internet connection.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeatherData(currentLocation);
  }, [currentLocation, loadWeatherData]);

  // Toggle Units
  const toggleTempUnit = () => {
    const next = tempUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTempUnit(next);
    localStorage.setItem('aether_temp_unit', next);
  };

  const toggleSpeedUnit = () => {
    const next = speedUnit === 'mph' ? 'kmh' : 'mph';
    setSpeedUnit(next);
    localStorage.setItem('aether_speed_unit', next);
  };

  // Derived Intelligence Modules (use effectiveWeather so time-scrubbing updates insights too!)
  const alerts: SevereAlert[] = effectiveWeather ? deriveSevereAlerts(effectiveWeather) : [];
  const activities = effectiveWeather ? deriveActivitySuitabilities(effectiveWeather) : [];
  const transit = effectiveWeather ? deriveTransitImpact(effectiveWeather) : null;
  const wardrobe = effectiveWeather ? deriveWardrobeRecommendations(effectiveWeather) : null;

  return (
    <div className={`relative min-h-screen w-full flex flex-col ${theme.ui.pageBg} ${theme.ui.primaryText} font-sans selection:bg-rose-500 selection:text-amber-50 transition-colors pb-20`}>
      
      {/* Dynamic Atmospheric Particle Canvas (Volumetric Clouds, Sun Rays, Rain, Stardust Motes) */}
      {effectiveWeather && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <AtmosphericCanvas weather={effectiveWeather} className="w-full h-full opacity-90 dark:opacity-95" />
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              backgroundImage: `radial-gradient(circle at 50% 18%, ${theme.accentColors.glow} 0%, transparent 65%)`
            }}
          />
        </div>
      )}

      {/* Fullscreen Zen Sanctuary Overlay ("Look Outside") */}
      {effectiveWeather && (
        <ZenSanctuaryOverlay
          isOpen={isZenMode}
          onExit={() => setIsZenMode(false)}
          weather={effectiveWeather}
          unit={tempUnit}
          isSoundPlaying={isSoundPlaying}
          onToggleSound={handleToggleSound}
          onOpenSoundMixer={() => setIsSoundMixerOpen(true)}
        />
      )}

      {/* Standard Observatory Interface (hidden when in Fullscreen Zen Window Mode) */}
      {!isZenMode && (
        <>
          {/* Global Sticky Navigation Header */}
          <WeatherHeader 
            activeTab={activeTab}
            onSelectTab={navigateToPage}
            tempUnit={tempUnit}
            onToggleTempUnit={toggleTempUnit}
            speedUnit={speedUnit}
            onToggleSpeedUnit={toggleSpeedUnit}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onRefresh={() => loadWeatherData(currentLocation, true)}
            isRefreshing={isRefreshing}
            alertCount={alerts.length}
            onOpenAlerts={() => setShowAlertModal(true)}
            isSoundPlaying={isSoundPlaying}
            onToggleSound={handleToggleSound}
            soundLevels={soundLevels}
            onOpenSoundMixer={() => setIsSoundMixerOpen(true)}
            onEnterZenMode={() => setIsZenMode(true)}
          />

          {/* Main Content Area */}
          <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Dedicated Page Breadcrumbs & Snapshot (for subpages) */}
            {effectiveWeather && (
              <PageNavigationBanner 
                activeTab={activeTab}
                onNavigate={navigateToPage}
                location={effectiveWeather.location}
                current={effectiveWeather.current}
                unit={tempUnit}
              />
            )}

            {/* Hyperlocal Search & Location Bar */}
            <div className="w-full">
              <HyperlocalSearch 
                currentLocation={currentLocation}
                onSelectLocation={(loc) => setCurrentLocation(loc)}
              />
            </div>

            {/* Collectible Illustrated World Postcard Deck (Multi-City Comparison) */}
            {activeTab === 'overview' && (
              <WorldPostcardDeck
                currentLocation={currentLocation}
                currentTempC={effectiveWeather?.current.temperature}
                unit={tempUnit}
                onSelectLocation={(loc) => setCurrentLocation(loc)}
              />
            )}

            {/* Loading State Skeleton */}
            {isLoading && !effectiveWeather && (
              <div className={`relative w-full py-24 rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} overflow-hidden flex flex-col items-center justify-center space-y-4`}>
                <ThemeCardArtWrapper theme={theme} variant="hero" />
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-3xl ${theme.ui.activePill} flex items-center justify-center ${theme.ui.activePillText} shadow-lg`}>
                    <CloudSun className="w-8 h-8 animate-pulse" />
                  </div>
                  <Loader2 className={`w-6 h-6 ${theme.ui.accentText} animate-spin absolute -top-1 -right-1`} />
                </div>
                <div className="relative z-10 text-center space-y-1">
                  <p className={`text-sm font-black ${theme.ui.primaryText}`}>
                    Gathering Atmospheric Radar &amp; Telemetry
                  </p>
                  <p className={`text-xs font-medium ${theme.ui.secondaryText}`}>
                    Contacting high-resolution meteorological satellites for {currentLocation.name}...
                  </p>
                </div>
              </div>
            )}

            {/* Load Error Fallback */}
            {loadError && (
              <div className={`relative w-full p-6 rounded-3xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} flex items-center justify-between gap-4 overflow-hidden`}>
                <ThemeCardArtWrapper theme={theme} variant="compact" />
                <div className="relative z-10 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
                  <div>
                    <p className={`text-sm font-black ${theme.ui.primaryText}`}>
                      Forecast Telemetry Interrupted
                    </p>
                    <p className={`text-xs ${theme.ui.secondaryText}`}>
                      {loadError}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => loadWeatherData(currentLocation)}
                  className={`relative z-10 px-4 py-2 rounded-xl text-xs font-black ${theme.ui.activePill} ${theme.ui.activePillText} shrink-0 transition-transform active:scale-95 cursor-pointer`}
                >
                  Retry Sync
                </button>
              </div>
            )}

            {/* DEDICATED MULTI-PAGE VIEWS */}
            {effectiveWeather && (
              <>
                {/* ==================================================== */}
                {/* PAGE 1: FORECAST HUB                                 */}
                {/* ==================================================== */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-fade-in">
                    <CurrentHero 
                      weather={effectiveWeather}
                      unit={tempUnit}
                      speedUnit={speedUnit}
                      alerts={alerts}
                      onOpenAlerts={() => setShowAlertModal(true)}
                      onOpenRadar={() => navigateToPage('radar')}
                    />

                    {/* Interactive 24-Hour Time-Travel Scrubber */}
                    <TimeTravelScrubber
                      weather={effectiveWeather}
                      unit={tempUnit}
                      scrubIndex={scrubIndex}
                      onScrubChange={setScrubIndex}
                    />

                    <HourlyCurveChart 
                      hourly={effectiveWeather.hourly}
                      unit={tempUnit}
                    />

                    <HourlyForecastSlider 
                      hourly={effectiveWeather.hourly}
                      unit={tempUnit}
                      speedUnit={speedUnit}
                      selectedHourTime={selectedHour?.time}
                      onSelectHour={(hour) => setSelectedHour(hour)}
                    />

                    <DailyForecastOutlook 
                      daily={effectiveWeather.daily}
                      unit={tempUnit}
                    />

                    <PageLaunchersGrid 
                      weather={effectiveWeather}
                      transit={transit}
                      wardrobe={wardrobe}
                      activities={activities}
                      onNavigate={navigateToPage}
                    />
                  </div>
                )}

                {/* ==================================================== */}
                {/* PAGE 2: LIVE DOPPLER RADAR                           */}
                {/* ==================================================== */}
                {activeTab === 'radar' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="h-[680px] rounded-3xl overflow-hidden shadow-2xl">
                      <LiveRadarMap location={effectiveWeather.location} isDarkMode={isDarkMode} />
                    </div>
                  </div>
                )}

                {/* ==================================================== */}
                {/* PAGE 3: CELESTIAL & STARGAZING OBSERVATORY           */}
                {/* ==================================================== */}
                {activeTab === 'celestial' && (
                  <CelestialObservatory weather={effectiveWeather} />
                )}

                {/* ==================================================== */}
                {/* PAGE 4: BOTANICAL, PET & HOME MICRO-CLIMATE STUDIO   */}
                {/* ==================================================== */}
                {activeTab === 'microclimate' && (
                  <MicroClimateStudio weather={effectiveWeather} unit={tempUnit} />
                )}

                {/* ==================================================== */}
                {/* PAGE 5: AIR QUALITY & POLLEN SANCTUARY               */}
                {/* ==================================================== */}
                {activeTab === 'air-pollen' && (
                  <div className="space-y-6 animate-fade-in">
                    <PollenAndAirQuality 
                      airQuality={effectiveWeather.airQuality}
                      current={effectiveWeather.current}
                    />
                  </div>
                )}

                {/* ==================================================== */}
                {/* PAGE 6: COMMUTE & TRANSIT INTELLIGENCE               */}
                {/* ==================================================== */}
                {activeTab === 'commute' && transit && (
                  <div className="space-y-6 animate-fade-in">
                    <TransitAndCommuteFeed 
                      transit={transit}
                      locationName={effectiveWeather.location.name}
                    />
                  </div>
                )}

                {/* ==================================================== */}
                {/* PAGE 7: OUTDOOR & EVENT PLANNER                      */}
                {/* ==================================================== */}
                {activeTab === 'outdoor' && (
                  <div className="space-y-6 animate-fade-in">
                    <OutdoorActivityPlanner 
                      activities={activities}
                      locationName={effectiveWeather.location.name}
                    />
                  </div>
                )}

                {/* ==================================================== */}
                {/* PAGE 8: SMART WARDROBE ADVISOR                       */}
                {/* ==================================================== */}
                {activeTab === 'wardrobe' && wardrobe && (
                  <div className="space-y-6 animate-fade-in">
                    <SmartWardrobePrompts 
                      wardrobe={wardrobe}
                      apparentTempC={effectiveWeather.current.apparentTemperature}
                    />
                  </div>
                )}
              </>
            )}
          </main>

          {/* Floating 1-Tap Page Dock */}
          <FloatingPageDock 
            activeTab={activeTab}
            onSelectTab={navigateToPage}
          />

          {/* Atmospheric Footer */}
          <footer className={`relative z-10 mt-16 border-t ${theme.ui.headerBorder} ${theme.ui.headerSurface} py-8 text-xs ${theme.ui.secondaryText} transition-all overflow-hidden`}>
            <ThemeCardArtWrapper theme={theme} variant="compact" showCornerFiligrees={false} />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-xl ${theme.ui.activePill} flex items-center justify-center ${theme.ui.activePillText} font-black text-xs shadow-sm`}>
                    A
                  </div>
                  <span className={`font-black ${theme.ui.primaryText} text-sm`}>
                    AETHER ATMOS
                  </span>
                  <span className={`text-[11px] font-bold ${theme.ui.subheadingText}`}>
                    — Planetary Meteorological Sanctuary · {theme.name}
                  </span>
                </div>

                <div className={`flex flex-wrap items-center justify-center gap-4 text-xs font-bold ${theme.ui.primaryText}`}>
                  <button onClick={() => navigateToPage('overview')} className={`hover:${theme.ui.accentText} transition-colors cursor-pointer`}>
                    10-Day Outlook
                  </button>
                  <button onClick={() => navigateToPage('celestial')} className={`hover:${theme.ui.accentText} transition-colors cursor-pointer`}>
                    Celestial &amp; Lunar
                  </button>
                  <button onClick={() => navigateToPage('microclimate')} className={`hover:${theme.ui.accentText} transition-colors cursor-pointer`}>
                    Botanical &amp; Home
                  </button>
                  <button onClick={() => navigateToPage('radar')} className={`hover:${theme.ui.accentText} transition-colors cursor-pointer`}>
                    Live Doppler Radar
                  </button>
                  <button onClick={() => navigateToPage('air-pollen')} className={`hover:${theme.ui.accentText} transition-colors cursor-pointer`}>
                    Allergen &amp; UV
                  </button>
                  <button onClick={() => navigateToPage('commute')} className={`hover:${theme.ui.accentText} transition-colors cursor-pointer`}>
                    Commute Impact
                  </button>
                  <button onClick={() => navigateToPage('outdoor')} className={`hover:${theme.ui.accentText} transition-colors cursor-pointer`}>
                    Event Suitability
                  </button>
                  <button onClick={() => navigateToPage('wardrobe')} className={`hover:${theme.ui.accentText} transition-colors cursor-pointer`}>
                    Wardrobe Layering
                  </button>
                </div>
              </div>

              <div className={`pt-4 border-t ${theme.ui.dividerBorder} flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-medium ${theme.ui.secondaryText}`}>
                <p>
                  Telemetry powered by Open-Meteo High-Resolution NWP Models, RainViewer Doppler radar arrays, Copernicus Atmosphere Monitoring Service, and postcodes.io.
                </p>
                <p className="shrink-0 font-mono text-[10px] font-bold">
                  &copy; {new Date().getFullYear()} AETHER ATMOS • {theme.name} World
                </p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Modular Atmospheric Theme Selector Modal */}
      <ThemeSelectorModal />

      {/* 5-Channel Soundscape Mixer Modal */}
      <SoundscapeMixerModal
        isOpen={isSoundMixerOpen}
        onClose={() => setIsSoundMixerOpen(false)}
        weather={effectiveWeather}
        isSoundPlaying={isSoundPlaying}
        onToggleSound={handleToggleSound}
        onEnterZenMode={() => setIsZenMode(true)}
      />

      {/* Severe Weather Alerts Modal */}
      {effectiveWeather && (
        <SevereWeatherAlertsModal 
          isOpen={showAlertModal}
          onClose={() => setShowAlertModal(false)}
          alerts={alerts}
          locationName={effectiveWeather.location.name}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <WeatherThemeProvider>
      <WeatherAppContent />
    </WeatherThemeProvider>
  );
}
