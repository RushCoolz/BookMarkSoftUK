import React from 'react';
import { Compass, Gauge } from 'lucide-react';
import { CurrentWeather, SpeedUnit } from '../../types/weather';
import { formatSpeed, getWindCompassDirection } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeTileArt } from './ThemeCardArtWrapper';

interface AerospaceGaugesProps {
  current: CurrentWeather;
  speedUnit: SpeedUnit;
}

export function AerospaceGauges({ current, speedUnit }: AerospaceGaugesProps) {
  const { theme } = useWeatherTheme();
  const windDir = current.windDirection || 0;
  const windDirName = getWindCompassDirection(windDir);
  const pressure = current.pressureMsl || 1013;

  // Pressure needle angle: 970 hPa -> -120deg, 1050 hPa -> +120deg
  const pressureClamped = Math.max(970, Math.min(1050, pressure));
  const pressureAngle = ((pressureClamped - 970) / 80) * 240 - 120;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      
      {/* 1. Circular Aerospace Wind Compass */}
      <div className={`group relative overflow-hidden p-4 rounded-[28px] ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} flex items-center gap-4 shadow-md transition-all`}>
        <ThemeTileArt theme={theme} variant="gauge" index={0} />

        <div className="relative z-10 w-24 h-24 shrink-0 flex items-center justify-center">
          {/* Compass Bezel */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            <circle cx="50" cy="50" r="46" fill="none" stroke={theme.ui.gaugeTrackColor} strokeWidth="3" />
            <circle cx="50" cy="50" r="41" fill="none" stroke={theme.accentColors.secondary} strokeWidth="1.2" strokeDasharray="2 3" opacity="0.7" />
            
            {/* Cardinal Tick Marks */}
            <text x="50" y="14" textAnchor="middle" className="text-[9px] font-mono font-black" fill={theme.accentColors.primary}>N</text>
            <text x="88" y="53" textAnchor="middle" className="text-[8px] font-mono font-bold" fill={theme.accentColors.secondary}>E</text>
            <text x="50" y="92" textAnchor="middle" className="text-[8px] font-mono font-bold" fill={theme.accentColors.secondary}>S</text>
            <text x="12" y="53" textAnchor="middle" className="text-[8px] font-mono font-bold" fill={theme.accentColors.secondary}>W</text>
            
            {/* 360 Rotating Arrow Needle */}
            <g transform={`rotate(${windDir} 50 50)`} className="transition-transform duration-700 ease-out">
              {/* North Arrow (Theme primary accent) */}
              <polygon points="50,20 44,50 56,50" fill={theme.accentColors.primary} />
              {/* South Counter (Theme tertiary accent) */}
              <polygon points="50,80 44,50 56,50" fill={theme.accentColors.tertiary} opacity="0.85" />
              <circle cx="50" cy="50" r="5" fill={theme.accentColors.secondary} />
            </g>
          </svg>
        </div>

        <div className="relative z-10 space-y-1 min-w-0">
          <div className={`flex items-center gap-1.5 text-xs font-black ${theme.ui.subheadingText}`}>
            <Compass className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
            <span>Aerospace Wind Vector</span>
          </div>
          <div className={`text-lg font-black ${theme.ui.primaryText} font-mono tabular-nums leading-tight`}>
            {formatSpeed(current.windSpeed, speedUnit)}
          </div>
          <div className={`text-xs font-mono ${theme.ui.secondaryText} font-bold`}>
            Bearing <strong>{windDir}° ({windDirName})</strong>
          </div>
          <div className={`text-[11px] font-semibold ${theme.ui.mutedText} truncate`}>
            Gust envelope to {formatSpeed(current.windGusts, speedUnit)}
          </div>
        </div>
      </div>

      {/* 2. Precision Barometric Pressure & Telemetry Arc */}
      <div className={`group relative overflow-hidden p-4 rounded-[28px] ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} flex items-center gap-4 shadow-md transition-all`}>
        <ThemeTileArt theme={theme} variant="gauge" index={1} />

        <div className="relative z-10 w-24 h-24 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            {/* Gauge Track */}
            <path 
              d="M 20 80 A 42 42 0 1 1 80 80" 
              fill="none" 
              stroke={theme.ui.gaugeTrackColor}
              strokeWidth="5.5" 
              strokeLinecap="round" 
            />
            {/* Active Pressure Segment */}
            <path 
              d="M 20 80 A 42 42 0 0 1 50 8" 
              fill="none" 
              stroke={theme.accentColors.secondary} 
              strokeWidth="5.5" 
              strokeLinecap="round" 
              opacity="0.9"
            />
            <path 
              d="M 50 8 A 42 42 0 0 1 80 80" 
              fill="none" 
              stroke={theme.accentColors.primary} 
              strokeWidth="5.5" 
              strokeLinecap="round" 
              opacity="0.9"
            />

            {/* Rotating Gauge Needle */}
            <g transform={`rotate(${pressureAngle} 50 50)`} className="transition-transform duration-700 ease-out">
              <line x1="50" y1="50" x2="50" y2="16" stroke={theme.accentColors.primary} strokeWidth="3.2" strokeLinecap="round" />
              <circle cx="50" cy="50" r="5" fill={theme.accentColors.secondary} />
            </g>

            {/* Baseline Center text */}
            <text x="50" y="70" textAnchor="middle" className="text-[9px] font-mono font-black" fill={theme.accentColors.primary}>hPa</text>
          </svg>
        </div>

        <div className="relative z-10 space-y-1 min-w-0">
          <div className={`flex items-center gap-1.5 text-xs font-black ${theme.ui.subheadingText}`}>
            <Gauge className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
            <span>Atmospheric Pressure</span>
          </div>
          <div className={`text-lg font-black ${theme.ui.primaryText} font-mono tabular-nums leading-tight`}>
            {Math.round(pressure)} <span className="text-xs font-bold font-sans">hPa</span>
          </div>
          <div className={`text-xs font-bold ${theme.ui.secondaryText}`}>
            {pressure >= 1013 ? 'High Barometric Ridge' : 'Low Depression Basin'}
          </div>
          <div className={`text-[11px] font-semibold ${theme.ui.mutedText} truncate`}>
            Baseline MSL 1013.25 hPa
          </div>
        </div>
      </div>

    </div>
  );
}
