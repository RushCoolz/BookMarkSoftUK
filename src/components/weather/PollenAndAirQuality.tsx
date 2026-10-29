import React, { useState } from 'react';
import { 
  Sun, 
  Leaf, 
  Flower2, 
  Trees, 
  Activity, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { AirQualityData, CurrentWeather } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface PollenAndAirQualityProps {
  airQuality?: AirQualityData;
  current: CurrentWeather;
}

export function PollenAndAirQuality({ airQuality, current }: PollenAndAirQualityProps) {
  const { theme } = useWeatherTheme();
  const [skinType, setSkinType] = useState<1 | 2 | 3 | 4>(2); // 1 = Fair, 2 = Medium, 3 = Olive, 4 = Dark

  // Evaluate Pollen Levels (grains/m³)
  const getPollenStatus = (val?: number) => {
    if (val === undefined || val === null) return { level: 'Low', badge: 'Minimal Risk', color: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-500/20 border-emerald-500/40' };
    if (val > 50) return { level: 'Very High', badge: 'Severe Allergen Warning', color: 'text-rose-600 dark:text-rose-300', bg: 'bg-rose-500/20 border-rose-500/40' };
    if (val > 25) return { level: 'High', badge: 'Hayfever Alert', color: 'text-orange-600 dark:text-orange-300', bg: 'bg-orange-500/20 border-orange-500/40' };
    if (val > 10) return { level: 'Moderate', badge: 'Moderate Sensitivity', color: 'text-amber-600 dark:text-amber-300', bg: 'bg-amber-500/20 border-amber-500/40' };
    return { level: 'Low', badge: 'Minimal', color: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-500/20 border-emerald-500/40' };
  };

  const treePollen = getPollenStatus((airQuality?.birchPollen || 0) + (airQuality?.alderPollen || 0));
  const grassPollen = getPollenStatus(airQuality?.grassPollen);
  const weedPollen = getPollenStatus((airQuality?.ragweedPollen || 0) + (airQuality?.mugwortPollen || 0));

  // AQI Evaluation
  const aqiVal = airQuality?.europeanAqi ?? 28;
  const getAqiDescription = (val: number) => {
    if (val <= 20) return { text: 'Good', desc: 'Air quality is pristine with virtually zero risk.', color: 'text-emerald-700 dark:text-emerald-200', border: 'border-emerald-500/50' };
    if (val <= 40) return { text: 'Fair', desc: 'Clean air acceptable for all normal outdoor activities.', color: 'text-teal-700 dark:text-teal-200', border: 'border-teal-500/50' };
    if (val <= 60) return { text: 'Moderate', desc: 'Sensitive individuals may experience minor throat irritation.', color: 'text-amber-700 dark:text-amber-200', border: 'border-amber-500/50' };
    if (val <= 80) return { text: 'Poor', desc: 'Increased likelihood of respiratory symptoms in children and asthmatics.', color: 'text-orange-700 dark:text-orange-200', border: 'border-orange-500/50' };
    return { text: 'Very Poor', desc: 'Noticeable smog; general public should reduce prolonged strenuous outdoor exertion.', color: 'text-rose-700 dark:text-rose-200', border: 'border-rose-500/50' };
  };

  const aqiInfo = getAqiDescription(aqiVal);

  // Burn Time Estimation formula based on UV index and skin type
  const calculateBurnTime = () => {
    const uv = Math.max(0.1, current.uvIndex);
    const skinMultiplier = skinType === 1 ? 0.8 : skinType === 2 ? 1.0 : skinType === 3 ? 1.6 : 2.5;
    const minutes = Math.round((200 * skinMultiplier) / (uv * 3));
    return Math.max(10, Math.min(180, minutes));
  };

  const burnTimeMin = calculateBurnTime();

  return (
    <div className={`relative w-full rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 space-y-6 overflow-hidden transition-all duration-300`}>
      {/* Bespoke Scenic Artwork & Filigrees */}
      <ThemeCardArtWrapper theme={theme} variant="standard" />

      <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />
      
      <div className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${theme.ui.dividerBorder} pb-4`}>
        <div>
          <h2 className={`text-base font-black ${theme.ui.primaryText} flex items-center gap-2`}>
            <span className={`p-1.5 rounded-xl ${theme.ui.badgeBg} ${theme.ui.accentText} border ${theme.ui.badgeBorder}`}>
              <Leaf className="w-4 h-4" />
            </span>
            <span>Pollen, UV &amp; Environmental Health Intelligence</span>
          </h2>
          <p className={`text-xs font-semibold ${theme.ui.secondaryText} mt-0.5`}>
            Real-time bio-aerosol tracking for families, hay fever sufferers, and asthmatics
          </p>
        </div>
        <span className={`text-xs font-mono font-black px-3 py-1 rounded-full ${theme.ui.badgeBg} ${theme.ui.badgeBorder} ${theme.ui.badgeText} border`}>
          European EAQI &amp; WHO Standard
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 1: Pollen Trio Breakdown */}
        <div className="space-y-3">
          <div className={`text-xs font-black uppercase tracking-wider ${theme.ui.subheadingText} flex items-center gap-1.5`}>
            <Flower2 className="w-3.5 h-3.5" />
            Active Pollen Dispersion
          </div>

          <div className="space-y-2.5">
            {/* Tree Pollen */}
            <div className={`group relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} flex items-center justify-between gap-3 shadow-md transition-all`}>
              <ThemeTileArt theme={theme} variant="row" index={0} />
              <div className="relative z-10 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/25 text-emerald-700 dark:text-emerald-200 border border-emerald-400/40">
                  <Trees className="w-4 h-4" />
                </div>
                <div>
                  <span className={`font-black text-sm ${theme.ui.primaryText} block`}>
                    Tree Pollen
                  </span>
                  <span className={`text-[11px] font-bold ${theme.ui.secondaryText} block font-mono`}>
                    Birch &amp; Alder species
                  </span>
                </div>
              </div>
              <div className="relative z-10 text-right">
                <span className={`text-xs font-black uppercase block font-mono ${treePollen.color}`}>
                  {treePollen.level}
                </span>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} font-mono`}>
                  {airQuality?.birchPollen ? `${Math.round(airQuality.birchPollen)} gr/m³` : 'Calm'}
                </span>
              </div>
            </div>

            {/* Grass Pollen */}
            <div className={`group relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} flex items-center justify-between gap-3 shadow-md transition-all`}>
              <ThemeTileArt theme={theme} variant="row" index={1} />
              <div className="relative z-10 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/25 text-amber-700 dark:text-amber-200 border border-amber-400/40">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <span className={`font-black text-sm ${theme.ui.primaryText} block`}>
                    Grass Pollen
                  </span>
                  <span className={`text-[11px] font-bold ${theme.ui.secondaryText} block font-mono`}>
                    Primary allergen
                  </span>
                </div>
              </div>
              <div className="relative z-10 text-right">
                <span className={`text-xs font-black uppercase block font-mono ${grassPollen.color}`}>
                  {grassPollen.level}
                </span>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} font-mono`}>
                  {airQuality?.grassPollen ? `${Math.round(airQuality.grassPollen)} gr/m³` : 'Calm'}
                </span>
              </div>
            </div>

            {/* Weed Pollen */}
            <div className={`group relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} flex items-center justify-between gap-3 shadow-md transition-all`}>
              <ThemeTileArt theme={theme} variant="row" index={2} />
              <div className="relative z-10 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/25 text-purple-700 dark:text-purple-200 border border-purple-400/40">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className={`font-black text-sm ${theme.ui.primaryText} block`}>
                    Weed Pollen
                  </span>
                  <span className={`text-[11px] font-bold ${theme.ui.secondaryText} block font-mono`}>
                    Ragweed &amp; Mugwort
                  </span>
                </div>
              </div>
              <div className="relative z-10 text-right">
                <span className={`text-xs font-black uppercase block font-mono ${weedPollen.color}`}>
                  {weedPollen.level}
                </span>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} font-mono`}>
                  {airQuality?.ragweedPollen ? `${Math.round(airQuality.ragweedPollen)} gr/m³` : 'Calm'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Air Quality Index & Particulates */}
        <div className="space-y-3">
          <div className={`text-xs font-black uppercase tracking-wider ${theme.ui.subheadingText} flex items-center gap-1.5`}>
            <Activity className="w-3.5 h-3.5" />
            Air Quality Index (AQI)
          </div>

          <div className={`relative overflow-hidden p-5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-4 shadow-md`}>
            <ThemeTileArt theme={theme} variant="gauge" index={3} />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className={`text-3xl font-black ${theme.ui.primaryText} font-mono tabular-nums`}>
                  {aqiVal}
                </span>
                <span className={`text-xs ${theme.ui.subheadingText} uppercase font-mono font-black ml-1.5`}>EAQI</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${aqiInfo.color} ${aqiInfo.border} ${theme.ui.badgeBg}`}>
                {aqiInfo.text}
              </span>
            </div>

            <p className={`relative z-10 text-xs ${theme.ui.secondaryText} leading-relaxed font-semibold`}>
              {aqiInfo.desc}
            </p>

            {/* Pollutant meters */}
            <div className={`relative z-10 grid grid-cols-2 gap-2 pt-2 border-t ${theme.ui.dividerBorder} text-[11px]`}>
              <div className={`relative overflow-hidden p-2.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <ThemeTileArt theme={theme} variant="pill" index={0} />
                <span className={`relative z-10 text-[10px] font-bold ${theme.ui.subheadingText} block font-mono`}>Fine PM2.5</span>
                <span className={`relative z-10 font-black ${theme.ui.primaryText} font-mono`}>
                  {airQuality?.pm25 ?? 8} <span className="text-[9px] font-bold">μg/m³</span>
                </span>
              </div>
              <div className={`relative overflow-hidden p-2.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <ThemeTileArt theme={theme} variant="pill" index={1} />
                <span className={`relative z-10 text-[10px] font-bold ${theme.ui.subheadingText} block font-mono`}>Inhalable PM10</span>
                <span className={`relative z-10 font-black ${theme.ui.primaryText} font-mono`}>
                  {airQuality?.pm10 ?? 14} <span className="text-[9px] font-bold">μg/m³</span>
                </span>
              </div>
              <div className={`relative overflow-hidden p-2.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <ThemeTileArt theme={theme} variant="pill" index={2} />
                <span className={`relative z-10 text-[10px] font-bold ${theme.ui.subheadingText} block font-mono`}>Nitrogen NO₂</span>
                <span className={`relative z-10 font-black ${theme.ui.primaryText} font-mono`}>
                  {airQuality?.nitrogenDioxide ?? 16} <span className="text-[9px] font-bold">μg/m³</span>
                </span>
              </div>
              <div className={`relative overflow-hidden p-2.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <ThemeTileArt theme={theme} variant="pill" index={3} />
                <span className={`relative z-10 text-[10px] font-bold ${theme.ui.subheadingText} block font-mono`}>Ozone O₃</span>
                <span className={`relative z-10 font-black ${theme.ui.primaryText} font-mono`}>
                  {airQuality?.ozone ?? 42} <span className="text-[9px] font-bold">μg/m³</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Solar UV Index & Safe Sun Exposure */}
        <div className="space-y-3">
          <div className={`text-xs font-black uppercase tracking-wider ${theme.ui.subheadingText} flex items-center gap-1.5`}>
            <Sun className="w-3.5 h-3.5" />
            Solar UV Radiation &amp; Burn Timer
          </div>

          <div className={`relative overflow-hidden p-5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-4 shadow-md`}>
            <ThemeTileArt theme={theme} variant="gauge" index={4} />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className={`text-3xl font-black ${theme.ui.primaryText} font-mono tabular-nums`}>
                  {current.uvIndex.toFixed(1)}
                </span>
                <span className={`text-xs ${theme.ui.subheadingText} uppercase font-mono font-black ml-1.5`}>UV</span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${theme.ui.primaryText}`}>
                <Clock className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
                <span>Burn time: <strong>~{burnTimeMin} mins</strong></span>
              </div>
            </div>

            {/* Skin phototype selector */}
            <div className="relative z-10 space-y-1.5">
              <span className={`text-[11px] ${theme.ui.secondaryText} font-bold`}>Select Skin Sensitivity:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 1, label: 'Fair' },
                  { id: 2, label: 'Medium' },
                  { id: 3, label: 'Olive' },
                  { id: 4, label: 'Dark' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSkinType(s.id as any)}
                    className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      skinType === s.id
                        ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-sm scale-102`
                        : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`relative z-10 p-3.5 rounded-xl ${theme.ui.badgeBg} ${theme.ui.badgeBorder} border text-xs ${theme.ui.primaryText} leading-relaxed font-semibold`}>
              {current.uvIndex >= 6 ? (
                <span>High UV: Apply broad-spectrum SPF 50 sunscreen every 2 hours, wear UV400 sunglasses, and seek shade between 11:00-15:00.</span>
              ) : current.uvIndex >= 3 ? (
                <span>Moderate UV: Sun protection recommended if outdoors for more than 45 minutes.</span>
              ) : (
                <span>Low UV risk: No protective measures needed under ordinary exposure. Safe for unassisted vitamin D synthesis.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
