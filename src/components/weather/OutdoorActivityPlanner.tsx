import React, { useState } from 'react';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle
} from 'lucide-react';
import { ActivitySuitability } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface OutdoorActivityPlannerProps {
  activities: ActivitySuitability[];
  locationName: string;
}

export function OutdoorActivityPlanner({ activities, locationName }: OutdoorActivityPlannerProps) {
  const { theme } = useWeatherTheme();
  const [filter, setFilter] = useState<'all' | 'sports' | 'events' | 'leisure' | 'specialist'>('all');

  const filtered = activities.filter(a => filter === 'all' || a.category === filter);

  return (
    <div className={`relative w-full rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 space-y-6 overflow-hidden transition-all duration-300`}>
      {/* Bespoke Scenic Artwork & Filigrees */}
      <ThemeCardArtWrapper theme={theme} variant="standard" />

      <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

      {/* Header and Filter Bar */}
      <div className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${theme.ui.dividerBorder} pb-4`}>
        <div>
          <h2 className={`text-base font-black ${theme.ui.primaryText} flex items-center gap-2`}>
            <span className={`p-1.5 rounded-xl ${theme.ui.badgeBg} ${theme.ui.accentText} border ${theme.ui.badgeBorder}`}>
              <Trophy className="w-4 h-4" />
            </span>
            <span>Outdoor &amp; Event Activity Suitability Index</span>
          </h2>
          <p className={`text-xs font-semibold ${theme.ui.secondaryText} mt-0.5`}>
            Precision meteorological readiness scores for sports enthusiasts, sailing, and event planners in {locationName}
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className={`flex items-center gap-1 p-1.5 ${theme.ui.controlTrack} rounded-2xl text-xs font-bold shadow-sm`}>
          {(['all', 'sports', 'events', 'leisure', 'specialist'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all capitalize cursor-pointer ${
                filter === cat
                  ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-sm font-black`
                  : `${theme.ui.inactivePillText}`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, idx) => {
          const scoreColor = item.score >= 80 
            ? 'text-emerald-950 dark:text-emerald-100 border-emerald-500/45 bg-emerald-500/25'
            : item.score >= 65
            ? 'text-cyan-950 dark:text-cyan-100 border-cyan-500/45 bg-cyan-500/25'
            : item.score >= 45
            ? 'text-amber-950 dark:text-amber-100 border-amber-500/45 bg-amber-500/25'
            : 'text-rose-950 dark:text-rose-100 border-rose-500/45 bg-rose-500/25';

          return (
            <div
              key={item.id}
              className={`group relative overflow-hidden p-5 rounded-[26px] ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} space-y-4 transition-all flex flex-col justify-between shadow-md`}
            >
              <ThemeTileArt theme={theme} variant="metric" index={idx} />

              <div className="relative z-10 space-y-3">
                {/* Title & Score Pill */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`font-black text-base ${theme.ui.primaryText} block`}>
                      {item.name}
                    </span>
                    <span className={`text-[11px] font-mono font-bold ${theme.ui.subheadingText} uppercase tracking-wider block`}>
                      {item.category}
                    </span>
                  </div>

                  <div className={`px-2.5 py-1 rounded-xl border text-right shrink-0 ${scoreColor}`}>
                    <span className="text-xl font-black font-mono leading-none block">
                      {item.score}
                    </span>
                    <span className="text-[9px] uppercase font-black tracking-wider block">
                      {item.rating}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className={`text-xs ${theme.ui.secondaryText} leading-relaxed font-semibold`}>
                  {item.summary}
                </p>

                {/* Micro Factors */}
                <div className={`space-y-1.5 pt-2 border-t ${theme.ui.dividerBorder} text-[11px]`}>
                  {item.factors.map((f, i) => (
                    <div key={i} className={`flex items-center justify-between ${theme.ui.primaryText}`}>
                      <span className={`${theme.ui.secondaryText} flex items-center gap-1 font-bold`}>
                        {f.status === 'optimal' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : f.status === 'moderate' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        )}
                        <span>{f.name}</span>
                      </span>
                      <span className="font-mono text-[10px] text-right truncate max-w-[140px] font-black">
                        {f.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optimal Window */}
              <div className={`relative z-10 pt-2 border-t ${theme.ui.dividerBorder} flex items-center justify-between text-xs font-bold ${theme.ui.secondaryText}`}>
                <span className="flex items-center gap-1.5">
                  <Clock className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
                  Best Window:
                </span>
                <span className={`font-black ${theme.ui.primaryText} font-mono`}>
                  {item.bestWindow}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
