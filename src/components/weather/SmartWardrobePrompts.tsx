import React, { useState } from 'react';
import { 
  Shirt, 
  Check, 
  ShoppingBag, 
  CheckCircle2 
} from 'lucide-react';
import { WardrobeRecommendation } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface SmartWardrobePromptsProps {
  wardrobe: WardrobeRecommendation;
  apparentTempC: number;
}

export function SmartWardrobePrompts({ wardrobe, apparentTempC }: SmartWardrobePromptsProps) {
  const { theme } = useWeatherTheme();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  return (
    <div className={`relative w-full rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 space-y-6 overflow-hidden transition-all duration-300`}>
      {/* Bespoke Scenic Artwork & Filigrees */}
      <ThemeCardArtWrapper theme={theme} variant="standard" />

      <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

      {/* Header */}
      <div className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${theme.ui.dividerBorder} pb-4`}>
        <div>
          <h2 className={`text-base font-black ${theme.ui.primaryText} flex items-center gap-2`}>
            <span className={`p-1.5 rounded-xl ${theme.ui.badgeBg} ${theme.ui.accentText} border ${theme.ui.badgeBorder}`}>
              <Shirt className="w-4 h-4" />
            </span>
            <span>Smart Wardrobe &amp; Gear Weather Advisor</span>
          </h2>
          <p className={`text-xs font-semibold ${theme.ui.secondaryText} mt-0.5`}>
            Tailored clothing layers and retail gear recommendations based on wind chill and precipitation
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className={`font-bold ${theme.ui.secondaryText}`}>Thermal Feel:</span>
          <span className={`px-3 py-1 rounded-full font-black uppercase text-[11px] ${theme.ui.badgeBg} ${theme.ui.badgeBorder} ${theme.ui.badgeText} border`}>
            {wardrobe.tempDescription}
          </span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Layer-by-Layer Outfit Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {wardrobe.layers.map((layer, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} space-y-2 transition-all flex flex-col justify-between shadow-md`}
            >
              <ThemeTileArt theme={theme} variant="metric" index={idx} />
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${theme.ui.accentText} font-mono`}>
                    {layer.category}
                  </span>
                  {layer.isEssential && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/25 text-rose-950 dark:text-rose-100 border border-rose-500/45">
                      Essential
                    </span>
                  )}
                </div>

                <div className={`font-black text-sm ${theme.ui.primaryText} leading-snug`}>
                  {layer.item}
                </div>

                <p className={`text-xs ${theme.ui.secondaryText} leading-relaxed font-semibold`}>
                  {layer.reason}
                </p>
              </div>

              <div className={`relative z-10 pt-2 border-t ${theme.ui.dividerBorder} flex items-center justify-between text-[11px] font-bold ${theme.ui.subheadingText}`}>
                <span>Climate optimized</span>
                <span className="text-emerald-600 dark:text-emerald-300 flex items-center gap-1 font-black">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Recommended
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Essentials Checklist Card */}
        <div className={`relative overflow-hidden p-5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-4 shadow-md`}>
          <ThemeTileArt theme={theme} variant="gauge" index={5} />
          <div className="relative z-10 space-y-1">
            <span className={`text-xs font-black uppercase tracking-wider ${theme.ui.subheadingText} flex items-center gap-1.5`}>
              <ShoppingBag className="w-3.5 h-3.5" />
              Before Leaving Home Checklist
            </span>
            <p className={`text-xs ${theme.ui.secondaryText} font-semibold`}>
              Tick items off as you pack your bag for today&apos;s forecast:
            </p>
          </div>

          <div className="relative z-10 space-y-2">
            {wardrobe.essentialsChecklist.length > 0 ? (
              wardrobe.essentialsChecklist.map((item, idx) => {
                const isChecked = Boolean(checkedItems[item]);
                return (
                  <div
                    key={item}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleCheck(item)}
                    className={`group relative overflow-hidden p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isChecked
                        ? `${theme.ui.activePill} ${theme.ui.activePillText} border-transparent shadow-sm`
                        : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} ${theme.ui.primaryText}`
                    }`}
                  >
                    {!isChecked && <ThemeTileArt theme={theme} variant="pill" index={idx} />}
                    <span className={`relative z-10 text-xs font-black ${isChecked ? 'line-through opacity-90' : ''}`}>
                      {item}
                    </span>
                    <div className={`relative z-10 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-amber-100 text-rose-900 border-amber-200' : `${theme.ui.badgeBorder} ${theme.ui.badgeBg}`
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`relative z-10 p-4 rounded-xl ${theme.ui.badgeBg} border ${theme.ui.badgeBorder} text-xs font-bold ${theme.ui.secondaryText} text-center`}>
                Mild weather: No specialized wet-weather or thermal gear required today.
              </div>
            )}
          </div>

          <div className={`relative z-10 pt-2 border-t ${theme.ui.dividerBorder} text-[11px] font-bold ${theme.ui.secondaryText} leading-relaxed font-mono`}>
            Outfits auto-calculate against wind chill ({Math.round(apparentTempC)}°C feels-like) and active precipitation probability.
          </div>
        </div>
      </div>
    </div>
  );
}
