import React from 'react';
import { 
  ChevronRight, 
  ArrowLeft, 
  MapPin, 
  Layers, 
  Wind, 
  Car, 
  Trophy, 
  Shirt, 
  CloudSun,
  Telescope,
  Sprout
} from 'lucide-react';
import { LocationData, CurrentWeather, TempUnit } from '../../types/weather';
import { formatTempWithUnit, decodeWmoCode } from '../../services/weatherService';
import { WeatherSectionTab } from './WeatherHeader';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface PageNavigationBannerProps {
  activeTab: WeatherSectionTab;
  onNavigate: (tab: WeatherSectionTab) => void;
  location: LocationData;
  current: CurrentWeather;
  unit: TempUnit;
}

export function PageNavigationBanner({
  activeTab,
  onNavigate,
  location,
  current,
  unit
}: PageNavigationBannerProps) {
  const { theme } = useWeatherTheme();
  if (activeTab === 'overview') return null;

  const pageMeta: Record<WeatherSectionTab, { title: string; subtitle: string; icon: React.ElementType }> = {
    overview: {
      title: 'Forecast Hub',
      subtitle: 'Complete 10-day outlook and current conditions',
      icon: CloudSun
    },
    radar: {
      title: 'Live Doppler Radar & Cloud Progression',
      subtitle: 'High-resolution animated precipitation scans and nowcasts',
      icon: Layers
    },
    celestial: {
      title: 'Celestial & Stargazing Observatory',
      subtitle: 'Lunar synodic phase dial, Golden Hour & Blue Hour light windows, and deep-sky clarity index',
      icon: Telescope
    },
    microclimate: {
      title: 'Botanical, Pet & Home Micro-Climate Studio',
      subtitle: 'Garden evapotranspiration soil balance, window dew-point condensation, laundry drying timer, and paw safety',
      icon: Sprout
    },
    'air-pollen': {
      title: 'Pollen Sanctuary & Air Quality Index',
      subtitle: 'Allergen concentrations, particulate pollution, and solar UV burn timers',
      icon: Wind
    },
    commute: {
      title: 'Commute & Highway Transit Risk',
      subtitle: 'Aquaplaning thresholds, braking distance multipliers, and bridge gale warnings',
      icon: Car
    },
    outdoor: {
      title: 'Outdoor Activity & Event Planner',
      subtitle: 'Curated 0–100 suitability scores for sports, sailing, occasions, and astronomy',
      icon: Trophy
    },
    wardrobe: {
      title: 'Smart Wardrobe & Packing Advisor',
      subtitle: 'Layer-by-layer clothing recommendations and daily essentials checklist',
      icon: Shirt
    }
  };

  const meta = pageMeta[activeTab] || pageMeta.overview;
  const Icon = meta.icon;
  const wmo = decodeWmoCode(current.weatherCode, current.isDay);

  return (
    <div className={`relative w-full rounded-[32px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-5 sm:p-6 overflow-hidden transition-all duration-300`}>
      
      {/* Wrapped Thematic Scenic Artwork & Corner Filigrees */}
      <ThemeCardArtWrapper theme={theme} variant="compact" />

      {/* Top Iridescent Specular Glass Rim */}
      <div 
        aria-hidden="true" 
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} 
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Breadcrumbs & Page Title */}
        <div className="space-y-2">
          {/* Breadcrumbs */}
          <div className={`flex items-center gap-2 text-xs font-bold ${theme.ui.secondaryText}`}>
            <button
              onClick={() => onNavigate('overview')}
              className={`flex items-center gap-1 hover:${theme.ui.accentText} transition-colors cursor-pointer font-black`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Forecast Hub</span>
            </button>
            <ChevronRight className={`w-3 h-3 ${theme.ui.accentText}`} />
            <span className={`font-black ${theme.ui.subheadingText}`}>
              {meta.title.split('&')[0].trim()}
            </span>
          </div>

          {/* Page Heading with Icon */}
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} p-0.5 shadow-md shrink-0 flex items-center justify-center ${theme.ui.activePillText}`}>
              <Icon className="w-5 h-5 drop-shadow" />
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${theme.ui.primaryText}`}>
                {meta.title}
              </h1>
              <p className={`text-xs ${theme.ui.secondaryText} font-semibold`}>
                {meta.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Location Snapshot & Quick Action */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          {/* Location Badge with ThemeTileArt */}
          <div className={`relative overflow-hidden px-4 py-2 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex items-center gap-2.5 shadow-md`}>
            <ThemeTileArt theme={theme} variant="pill" index={0} />
            <MapPin className={`relative z-10 w-3.5 h-3.5 ${theme.ui.accentText} shrink-0`} />
            <div className="relative z-10 text-left">
              <span className={`text-xs font-black ${theme.ui.primaryText} block leading-tight`}>
                {location.name}
              </span>
              <span className={`text-[10px] ${theme.ui.secondaryText} font-mono font-bold block`}>
                {formatTempWithUnit(current.temperature, unit)} · {wmo.description}
              </span>
            </div>
          </div>

          {/* Quick Back to Forecast Button */}
          <button
            onClick={() => onNavigate('overview')}
            className={`clay-button px-4 py-2.5 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} text-xs font-black transition-all shadow-md cursor-pointer whitespace-nowrap active:scale-95`}
          >
            All Forecasts &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
