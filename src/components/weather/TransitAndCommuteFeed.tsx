import React from 'react';
import { 
  Car, 
  Train, 
  Plane, 
  Gauge, 
  Wind, 
  Clock
} from 'lucide-react';
import { CommuterTransitImpact } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface TransitAndCommuteFeedProps {
  transit: CommuterTransitImpact;
  locationName: string;
}

export function TransitAndCommuteFeed({ transit, locationName }: TransitAndCommuteFeedProps) {
  const { theme } = useWeatherTheme();
  const isHighRisk = transit.overallRisk === 'High' || transit.overallRisk === 'Severe';

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
              <Car className="w-4 h-4" />
            </span>
            <span>Commuter &amp; Transit Impact Intelligence</span>
          </h2>
          <p className={`text-xs font-semibold ${theme.ui.secondaryText} mt-0.5`}>
            Real-time weather impact on motorways, rail lines, bridges, and morning/evening commutes in {locationName}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className={`font-bold ${theme.ui.secondaryText}`}>Regional Highway Status:</span>
          <span className={`px-3 py-1 rounded-full font-black uppercase text-[11px] border ${
            isHighRisk 
              ? 'bg-rose-500/25 text-rose-950 dark:text-rose-100 border-rose-500/45' 
              : transit.overallRisk === 'Moderate'
              ? 'bg-amber-500/25 text-amber-950 dark:text-amber-100 border-amber-500/45'
              : 'bg-emerald-500/25 text-emerald-950 dark:text-emerald-100 border-emerald-500/45'
          }`}>
            {transit.overallRisk} Weather Delay Risk
          </span>
        </div>
      </div>

      {/* Rush Hour Viability Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Morning Rush Hour */}
        <div className={`group relative overflow-hidden p-5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-3 shadow-md`}>
          <ThemeTileArt theme={theme} variant="row" index={0} />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className={`font-black text-sm ${theme.ui.primaryText}`}>
                Morning Commute (07:00 - 09:30)
              </span>
            </div>
            <span className={`text-xs font-mono font-black ${theme.ui.accentText}`}>
              {transit.morningRushViability.delayEstimate}
            </span>
          </div>

          <div className={`relative z-10 text-xs font-bold ${theme.ui.primaryText} flex items-center gap-1.5`}>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs" />
            <span>{transit.morningRushViability.rating}</span>
          </div>

          <p className={`relative z-10 text-xs ${theme.ui.secondaryText} font-semibold leading-relaxed p-3 rounded-xl ${theme.ui.badgeBg} border ${theme.ui.badgeBorder}`}>
            {transit.morningRushViability.advice}
          </p>
        </div>

        {/* Evening Rush Hour */}
        <div className={`group relative overflow-hidden p-5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-3 shadow-md`}>
          <ThemeTileArt theme={theme} variant="row" index={1} />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${theme.ui.accentText}`} />
              <span className={`font-black text-sm ${theme.ui.primaryText}`}>
                Evening Rush (16:30 - 19:00)
              </span>
            </div>
            <span className={`text-xs font-mono font-black ${theme.ui.accentText}`}>
              {transit.eveningRushViability.delayEstimate}
            </span>
          </div>

          <div className={`relative z-10 text-xs font-bold ${theme.ui.primaryText} flex items-center gap-1.5`}>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-xs" />
            <span>{transit.eveningRushViability.rating}</span>
          </div>

          <p className={`relative z-10 text-xs ${theme.ui.secondaryText} font-semibold leading-relaxed p-3 rounded-xl ${theme.ui.badgeBg} border ${theme.ui.badgeBorder}`}>
            {transit.eveningRushViability.advice}
          </p>
        </div>
      </div>

      {/* Multi-Modal Telemetry Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Aquaplaning & Surface Water */}
        <div className={`group relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5 shadow-md`}>
          <ThemeTileArt theme={theme} variant="metric" index={0} />
          <div className={`relative z-10 flex items-center justify-between text-xs font-bold ${theme.ui.secondaryText}`}>
            <span className="flex items-center gap-1">
              <Gauge className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              Surface Water Risk
            </span>
            <span className={`text-[10px] font-black uppercase ${
              transit.aquaplaningRisk === 'Severe' ? 'text-rose-500' : transit.aquaplaningRisk === 'Elevated' ? 'text-amber-500' : 'text-emerald-500'
            }`}>
              {transit.aquaplaningRisk}
            </span>
          </div>
          <div className={`relative z-10 text-lg font-black ${theme.ui.primaryText} font-mono tabular-nums`}>
            {transit.brakingDistanceMultiplier > 1.0 ? `+${Math.round((transit.brakingDistanceMultiplier - 1) * 100)}%` : 'Nominal'}
          </div>
          <div className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
            Braking distance multiplier on wet tarmac
          </div>
        </div>

        {/* High-Sided Vehicles & Bridge Gales */}
        <div className={`group relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5 shadow-md`}>
          <ThemeTileArt theme={theme} variant="metric" index={1} />
          <div className={`relative z-10 flex items-center justify-between text-xs font-bold ${theme.ui.secondaryText}`}>
            <span className="flex items-center gap-1">
              <Wind className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              Bridge Wind Advisory
            </span>
            <span className={`text-[10px] font-black uppercase ${
              transit.highSidedVehicleRisk === 'High Alert' ? 'text-rose-500' : transit.highSidedVehicleRisk === 'Caution' ? 'text-amber-500' : 'text-emerald-500'
            }`}>
              {transit.highSidedVehicleRisk}
            </span>
          </div>
          <div className={`relative z-10 text-lg font-black ${theme.ui.primaryText} font-mono`}>
            {transit.bridgeGaleWarning ? 'Gale Caution' : 'Normal Flow'}
          </div>
          <div className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
            Crosswind buffeting across open viaducts
          </div>
        </div>

        {/* Rail Adhesion & Track Status */}
        <div className={`group relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5 shadow-md`}>
          <ThemeTileArt theme={theme} variant="metric" index={2} />
          <div className={`relative z-10 flex items-center justify-between text-xs font-bold ${theme.ui.secondaryText}`}>
            <span className="flex items-center gap-1">
              <Train className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              Rail Adhesion Status
            </span>
          </div>
          <div className={`relative z-10 text-base font-black ${theme.ui.primaryText} truncate`}>
            {transit.railTrackRisk}
          </div>
          <div className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
            Network Rail automated track condition
          </div>
        </div>

        {/* Aviation & Visibility */}
        <div className={`group relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5 shadow-md`}>
          <ThemeTileArt theme={theme} variant="metric" index={3} />
          <div className={`relative z-10 flex items-center justify-between text-xs font-bold ${theme.ui.secondaryText}`}>
            <span className="flex items-center gap-1">
              <Plane className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              Aviation Ceiling
            </span>
          </div>
          <div className={`relative z-10 text-base font-black ${theme.ui.primaryText} truncate`}>
            {transit.airportVisibilityStatus}
          </div>
          <div className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
            Runway approach visibility index
          </div>
        </div>
      </div>
    </div>
  );
}
