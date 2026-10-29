import React from 'react';
import { 
  Layers, 
  Wind, 
  Car, 
  Trophy, 
  Shirt, 
  Sparkles, 
  ArrowRight,
  Telescope,
  Sprout
} from 'lucide-react';
import { WeatherData, CommuterTransitImpact, WardrobeRecommendation, ActivitySuitability } from '../../types/weather';
import { WeatherSectionTab } from './WeatherHeader';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface PageLaunchersGridProps {
  weather: WeatherData;
  transit: CommuterTransitImpact | null;
  wardrobe: WardrobeRecommendation | null;
  activities: ActivitySuitability[];
  onNavigate: (tab: WeatherSectionTab) => void;
}

export function PageLaunchersGrid({
  weather,
  transit,
  wardrobe,
  activities,
  onNavigate
}: PageLaunchersGridProps) {
  const { theme } = useWeatherTheme();
  const aqiVal = weather.airQuality?.europeanAqi ?? 26;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-base font-black ${theme.ui.primaryText} flex items-center gap-2`}>
            <span className={`p-1.5 rounded-xl ${theme.ui.badgeBg} ${theme.ui.accentText} border ${theme.ui.badgeBorder}`}>
              <Sparkles className="w-4 h-4" />
            </span>
            <span>Specialized Meteorological Intelligence Worlds</span>
          </h2>
          <p className={`text-xs font-semibold ${theme.ui.secondaryText} mt-0.5`}>
            Dedicated multi-page sanctuaries for astronomy, botanical micro-climate, Doppler radar, air quality, transit, sports, and wardrobe
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Page Launcher: Celestial & Stargazing Observatory */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('celestial')}
          className={`group relative rounded-[32px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} hover:-translate-y-1 p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden`}
        >
          <ThemeCardArtWrapper theme={theme} variant="launcher" />
          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />
          
          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-2xl ${theme.ui.activePill} p-0.5 shadow-md flex items-center justify-center ${theme.ui.activePillText}`}>
                <Telescope className="w-6 h-6 drop-shadow" />
              </div>
              <span className={`text-[11px] font-black font-mono ${theme.ui.subheadingText}`}>
                Solar System &amp; Star Dome
              </span>
            </div>
            <div>
              <h3 className={`font-black text-lg ${theme.ui.primaryText} group-hover:${theme.ui.accentText} transition-colors`}>
                Solar System Orrery &amp; Star Patterns
              </h3>
              <p className={`text-xs ${theme.ui.secondaryText} mt-1 leading-relaxed font-semibold`}>
                Live 8-planet heliocentric J2000 orrery, interactive zenith constellation star dome, lunar phase dial, and meteor shower almanac.
              </p>
            </div>
          </div>

          <div className={`relative z-10 pt-4 mt-3 border-t ${theme.ui.dividerBorder} flex items-center justify-between text-xs font-black ${theme.ui.accentText}`}>
            <span>Launch Orrery &amp; Planetarium</span>
            <div className={`relative overflow-hidden w-7 h-7 rounded-full ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex items-center justify-center group-hover:translate-x-1 transition-transform`}>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </div>
          </div>
        </div>

        {/* Page Launcher: Botanical, Pet & Home Micro-Climate */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('microclimate')}
          className={`group relative rounded-[32px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} hover:-translate-y-1 p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden`}
        >
          <ThemeCardArtWrapper theme={theme} variant="launcher" />
          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />
          
          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-0.5 shadow-md flex items-center justify-center text-amber-50">
                <Sprout className="w-6 h-6 drop-shadow" />
              </div>
              <span className={`text-[11px] font-black font-mono ${theme.ui.subheadingText}`}>
                Garden &amp; Home
              </span>
            </div>
            <div>
              <h3 className={`font-black text-lg ${theme.ui.primaryText} group-hover:${theme.ui.accentText} transition-colors`}>
                Botanical, Pet &amp; Home Micro-Climate
              </h3>
              <p className={`text-xs ${theme.ui.secondaryText} mt-1 leading-relaxed font-semibold`}>
                Plant soil watering calculator, home window dew-point ventilation, outdoor laundry drying timer, and pet paw safety.
              </p>
            </div>
          </div>

          <div className={`relative z-10 pt-4 mt-3 border-t ${theme.ui.dividerBorder} flex items-center justify-between text-xs font-black ${theme.ui.accentText}`}>
            <span>Open Micro-Climate Studio</span>
            <div className={`relative overflow-hidden w-7 h-7 rounded-full ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex items-center justify-center group-hover:translate-x-1 transition-transform`}>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </div>
          </div>
        </div>

        {/* Page 1 Launcher: Live Doppler Radar */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('radar')}
          className={`group relative rounded-[32px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} hover:-translate-y-1 p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden`}
        >
          <ThemeCardArtWrapper theme={theme} variant="launcher" />
          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />
          
          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-2xl ${theme.ui.activePill} p-0.5 shadow-md flex items-center justify-center ${theme.ui.activePillText}`}>
                <Layers className="w-6 h-6 drop-shadow" />
              </div>
              <span className={`text-[11px] font-black font-mono ${theme.ui.subheadingText}`}>
                Live Scan
              </span>
            </div>
            <div>
              <h3 className={`font-black text-lg ${theme.ui.primaryText} group-hover:${theme.ui.accentText} transition-colors`}>
                Doppler Radar &amp; Cloud Tracking
              </h3>
              <p className={`text-xs ${theme.ui.secondaryText} mt-1 leading-relaxed font-semibold`}>
                Full-screen animated radar sweeps tracking precipitation frontal boundaries and 30-minute nowcasts.
              </p>
            </div>
          </div>

          <div className={`relative z-10 pt-4 mt-3 border-t ${theme.ui.dividerBorder} flex items-center justify-between text-xs font-black ${theme.ui.accentText}`}>
            <span>Explore Radar World</span>
            <div className={`relative overflow-hidden w-7 h-7 rounded-full ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex items-center justify-center group-hover:translate-x-1 transition-transform`}>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </div>
          </div>
        </div>

        {/* Page 2 Launcher: Pollen & Air Quality */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('air-pollen')}
          className={`group relative rounded-[32px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} hover:-translate-y-1 p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden`}
        >
          <ThemeCardArtWrapper theme={theme} variant="launcher" />
          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />
          
          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center text-amber-50">
                <Wind className="w-6 h-6 drop-shadow" />
              </div>
              <span className={`text-[11px] font-black font-mono ${theme.ui.subheadingText}`}>
                AQI {aqiVal} · Good
              </span>
            </div>
            <div>
              <h3 className={`font-black text-lg ${theme.ui.primaryText} group-hover:${theme.ui.accentText} transition-colors`}>
                Allergen &amp; Air Quality Health
              </h3>
              <p className={`text-xs ${theme.ui.secondaryText} mt-1 leading-relaxed font-semibold`}>
                Tree, grass, and weed pollen grains/m³ alongside Fitzpatrick skin-type UV burn countdown timers.
              </p>
            </div>
          </div>

          <div className={`relative z-10 pt-4 mt-3 border-t ${theme.ui.dividerBorder} flex items-center justify-between text-xs font-black ${theme.ui.accentText}`}>
            <span>View Bio-Aerosol Reports</span>
            <div className={`relative overflow-hidden w-7 h-7 rounded-full ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex items-center justify-center group-hover:translate-x-1 transition-transform`}>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </div>
          </div>
        </div>

        {/* Page 3 Launcher: Commute & Transit Feed */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('commute')}
          className={`group relative rounded-[32px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} hover:-translate-y-1 p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden`}
        >
          <ThemeCardArtWrapper theme={theme} variant="launcher" />
          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />
          
          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-md flex items-center justify-center text-amber-50">
                <Car className="w-6 h-6 drop-shadow" />
              </div>
              <span className={`text-[11px] font-black font-mono ${theme.ui.subheadingText}`}>
                {transit?.overallRisk || 'Low'} Risk
              </span>
            </div>
            <div>
              <h3 className={`font-black text-lg ${theme.ui.primaryText} group-hover:${theme.ui.accentText} transition-colors`}>
                Road, Bridge &amp; Rail Transit Risk
              </h3>
              <p className={`text-xs ${theme.ui.secondaryText} mt-1 leading-relaxed font-semibold`}>
                Hydroplaning potential, vehicle braking multipliers ({transit?.brakingDistanceMultiplier || 1.0}x), and rush-hour delay forecasts.
              </p>
            </div>
          </div>

          <div className={`relative z-10 pt-4 mt-3 border-t ${theme.ui.dividerBorder} flex items-center justify-between text-xs font-black ${theme.ui.accentText}`}>
            <span>Inspect Commute Status</span>
            <div className={`relative overflow-hidden w-7 h-7 rounded-full ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex items-center justify-center group-hover:translate-x-1 transition-transform`}>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </div>
          </div>
        </div>

        {/* Page 4 Launcher: Outdoor Activity Planner */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('outdoor')}
          className={`group relative rounded-[32px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} hover:-translate-y-1 p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden`}
        >
          <ThemeCardArtWrapper theme={theme} variant="launcher" />
          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />
          
          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 shadow-md flex items-center justify-center text-amber-50">
                <Trophy className="w-6 h-6 drop-shadow" />
              </div>
              <span className={`text-[11px] font-black font-mono ${theme.ui.subheadingText}`}>
                {activities.length} Activities Rated
              </span>
            </div>
            <div>
              <h3 className={`font-black text-lg ${theme.ui.primaryText} group-hover:${theme.ui.accentText} transition-colors`}>
                Outdoor &amp; Event Planner
              </h3>
              <p className={`text-xs ${theme.ui.secondaryText} mt-1 leading-relaxed font-semibold`}>
                Suitability scores (0–100) for Golf, Running, Sailing, Weddings, Stargazing, and UAV flight.
              </p>
            </div>
          </div>

          <div className={`relative z-10 pt-4 mt-3 border-t ${theme.ui.dividerBorder} flex items-center justify-between text-xs font-black ${theme.ui.accentText}`}>
            <span>Explore Activity Scores</span>
            <div className={`relative overflow-hidden w-7 h-7 rounded-full ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex items-center justify-center group-hover:translate-x-1 transition-transform`}>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </div>
          </div>
        </div>

        {/* Page 5 Launcher: Smart Wardrobe */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('wardrobe')}
          className={`group relative rounded-[32px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} hover:-translate-y-1 p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden md:col-span-2 lg:col-span-3`}
        >
          <ThemeCardArtWrapper theme={theme} variant="launcher" />
          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />
          
          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shadow-md flex items-center justify-center text-amber-50">
                <Shirt className="w-6 h-6 drop-shadow" />
              </div>
              <span className={`text-[11px] font-black font-mono ${theme.ui.subheadingText}`}>
                {wardrobe?.overallStyle || 'Layering Guide'}
              </span>
            </div>
            <div>
              <h3 className={`font-black text-lg ${theme.ui.primaryText} group-hover:${theme.ui.accentText} transition-colors`}>
                What to Wear &amp; Daily Packing Checklist
              </h3>
              <p className={`text-xs ${theme.ui.secondaryText} mt-1 leading-relaxed font-semibold`}>
                Intelligent layer-by-layer outfit selection and weather-proof checklist based on ambient wind-chill and rain certainty.
              </p>
            </div>
            {wardrobe && (
              <div className="flex flex-wrap gap-2 pt-1">
                {wardrobe.essentialsChecklist.slice(0, 4).map((item, idx) => (
                  <span key={idx} className={`relative overflow-hidden text-[11px] font-black px-3.5 py-1.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText} shadow-sm`}>
                    <ThemeTileArt theme={theme} variant="pill" index={idx} />
                    <span className="relative z-10">{item}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={`relative z-10 pt-4 mt-3 border-t ${theme.ui.dividerBorder} flex items-center justify-between text-xs font-black ${theme.ui.accentText}`}>
            <span>Open Wardrobe Advisor</span>
            <div className={`relative overflow-hidden w-7 h-7 rounded-full ${theme.ui.tileSurface} ${theme.ui.tileBorder} flex items-center justify-center group-hover:translate-x-1 transition-transform`}>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
