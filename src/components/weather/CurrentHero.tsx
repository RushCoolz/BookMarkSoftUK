import React from 'react';
import { 
  Wind, 
  Droplets, 
  Gauge, 
  Sun, 
  Eye, 
  CloudRain, 
  Sunrise, 
  Sunset, 
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { WeatherData, TempUnit, SpeedUnit, SevereAlert } from '../../types/weather';
import { 
  formatTemp, 
  formatTempWithUnit, 
  formatSpeed, 
  decodeWmoCode, 
  getWindCompassDirection 
} from '../../services/weatherService';
import { WeatherOrb3D } from './WeatherOrb3D';
import { AerospaceGauges } from './AerospaceGauges';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface CurrentHeroProps {
  weather: WeatherData;
  unit: TempUnit;
  speedUnit: SpeedUnit;
  alerts: SevereAlert[];
  onOpenAlerts: () => void;
  onOpenRadar: () => void;
}

export function CurrentHero({ 
  weather, 
  unit, 
  speedUnit, 
  alerts, 
  onOpenAlerts, 
  onOpenRadar 
}: CurrentHeroProps) {
  const { theme } = useWeatherTheme();
  const { current, daily, location } = weather;
  const wmo = decodeWmoCode(current.weatherCode, current.isDay);
  const todayDaily = daily[0];

  const windDirName = getWindCompassDirection(current.windDirection);

  // Calculate sun position progress (0 to 100%)
  const calculateSunProgress = () => {
    if (!todayDaily?.sunrise || !todayDaily?.sunset) return 50;
    const now = new Date().getTime();
    const rise = new Date(todayDaily.sunrise).getTime();
    const set = new Date(todayDaily.sunset).getTime();
    if (now < rise) return 0;
    if (now > set) return 100;
    return Math.round(((now - rise) / (set - rise)) * 100);
  };

  const sunProgress = calculateSunProgress();

  // UV risk description
  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-600 dark:text-emerald-300' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-600 dark:text-amber-300' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-600 dark:text-orange-300' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-600 dark:text-rose-300' };
    return { text: 'Extreme', color: 'text-purple-600 dark:text-purple-300' };
  };

  const uvInfo = getUvLevel(current.uvIndex);
  const pressureTrend = current.pressureMsl >= 1013 ? 'High Pressure' : 'Low Pressure System';

  // Determine current atmospheric mood glow
  const currentHour = new Date().getHours();
  const isSunset = currentHour >= 16 && currentHour <= 20;

  return (
    <div className={`relative w-full rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} overflow-hidden p-6 sm:p-9 space-y-6 transition-all duration-300`}>
      
      {/* Wrapped Full-Color Scenic Artwork & Corner Filigrees */}
      <ThemeCardArtWrapper theme={theme} variant="hero" />

      {/* Top Iridescent Specular Glass Rim */}
      <div 
        aria-hidden="true" 
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} 
      />

      {/* 3D Atmospheric Ambient Glow Halos */}
      <div 
        aria-hidden="true" 
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-45 dark:opacity-35 ${
          isSunset ? 'bg-gradient-to-br from-rose-400/50 via-amber-400/40 to-violet-500/40' : 'bg-gradient-to-br from-amber-300/50 via-sky-300/40 to-pink-300/40'
        }`}
      />
      <div 
        aria-hidden="true" 
        className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-35 dark:opacity-30 bg-gradient-to-tr from-pink-300/40 via-amber-300/40 to-indigo-300/40"
      />

      {/* Active Severe Weather Warning Banner */}
      {alerts.length > 0 && (
        <div 
          onClick={onOpenAlerts}
          role="button"
          tabIndex={0}
          className="relative z-10 overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-amber-500/35 via-orange-500/30 to-rose-500/35 border-2 border-amber-400/60 backdrop-blur-md flex items-center justify-between gap-3 cursor-pointer hover:scale-[1.01] transition-all group shadow-md"
        >
          <ThemeTileArt theme={theme} variant="banner" index={9} />
          <div className="relative z-10 flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-amber-500/35 text-amber-800 dark:text-amber-200 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div className="truncate">
              <div className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-200">
                {alerts[0].title}
              </div>
              <div className={`text-xs sm:text-sm font-bold ${theme.ui.primaryText} truncate`}>
                {alerts[0].headline}
              </div>
            </div>
          </div>
          <div className="relative z-10 text-xs font-black text-amber-900 dark:text-amber-200 group-hover:translate-x-1 transition-transform shrink-0">
            Read Advice &rarr;
          </div>
        </div>
      )}

      {/* Main Hero Summary & Temperature */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          
          {/* Celestial Meteorological Observatory Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3.5 py-1 rounded-full ${theme.ui.badgeBg} ${theme.ui.badgeBorder} ${theme.ui.badgeText} text-[10px] font-black tracking-widest uppercase font-mono shadow-sm border`}>
              ✦ CELESTIAL ATMOSPHERE · {theme.name.toUpperCase()} ✦
            </span>
          </div>

          {/* Location details */}
          <div className={`flex items-center gap-2 text-xs font-bold ${theme.ui.secondaryText}`}>
            <span className={`font-black ${theme.ui.primaryText} text-lg tracking-tight drop-shadow-xs`}>
              {location.name}
            </span>
            {location.region && (
              <>
                <span aria-hidden="true" className={theme.ui.accentText}>·</span>
                <span>{location.region}</span>
              </>
            )}
            <span aria-hidden="true" className={theme.ui.accentText}>·</span>
            <span>{location.country}</span>
          </div>

          {/* Majestic Condition Heading */}
          <div className="flex flex-col">
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${theme.ui.headingGradient} leading-tight drop-shadow-sm`}>
              {wmo.description}
            </h1>
            <span className={`text-[11px] font-mono font-black tracking-widest ${theme.ui.subheadingText} uppercase mt-0.5`}>
              METEOROLOGICAL TELEMETRY SANCTUARY
            </span>
          </div>

          <div className={`flex flex-wrap items-center gap-3 text-sm ${theme.ui.secondaryText} font-bold`}>
            <span>Feels like <strong className={`font-black ${theme.ui.primaryText}`}>{formatTempWithUnit(current.apparentTemperature, unit)}</strong></span>
            <span aria-hidden="true" className={theme.ui.accentText}>·</span>
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <ArrowUp className="w-3.5 h-3.5 text-rose-500" />
              <span>High {todayDaily ? formatTemp(todayDaily.temperatureMax, unit) : '--'}</span>
            </span>
            <span aria-hidden="true" className={theme.ui.accentText}>·</span>
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <ArrowDown className="w-3.5 h-3.5 text-sky-500" />
              <span>Low {todayDaily ? formatTemp(todayDaily.temperatureMin, unit) : '--'}</span>
            </span>
          </div>
        </div>

        {/* Centerpiece 3D Astrolabe Artwork */}
        <WeatherOrb3D 
          weatherCode={current.weatherCode} 
          isDay={current.isDay} 
          className="hidden md:flex shrink-0 my-[-15px]" 
        />

        {/* Massive Luminous Temperature & Radar Console */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className={`text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter ${theme.ui.primaryText} font-mono tabular-nums leading-none drop-shadow-[0_10px_28px_rgba(244,63,94,0.28)]`}>
              {formatTemp(current.temperature, unit)}
            </div>
            <div className={`text-[11px] ${theme.ui.subheadingText} uppercase tracking-widest font-mono mt-1 font-black`}>
              Updated {new Date(weather.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenRadar}
            className={`clay-button relative overflow-hidden hidden sm:flex flex-col items-center justify-center p-4 rounded-3xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} ${theme.ui.primaryText} shadow-lg transition-all cursor-pointer group hover:scale-105 active:scale-95`}
            title="Launch Dynamic Live Doppler Radar"
          >
            <ThemeTileArt theme={theme} variant="pill" index={0} />
            <CloudRain className={`relative z-10 w-6 h-6 mb-1 ${theme.ui.accentText} group-hover:scale-115 transition-transform drop-shadow`} />
            <span className="relative z-10 text-[10px] font-black uppercase tracking-wider font-mono">Live Radar</span>
            <span className={`relative z-10 text-[8px] font-black ${theme.ui.subheadingText} font-mono tracking-wider`}>DOPPLER SCAN</span>
          </button>
        </div>
      </div>

      {/* Primary Atmospheric Metrics Grid (Each tile has custom ThemeTileArt illustration) */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        
        {/* 1. Wind Speed & Direction */}
        <div className={`group relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} space-y-1 transition-all shadow-md`}>
          <ThemeTileArt theme={theme} variant="metric" index={0} />
          <div className={`relative z-10 flex items-center justify-between text-xs font-bold ${theme.ui.secondaryText}`}>
            <span className="flex items-center gap-1">
              <Wind className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              Wind
            </span>
            <span className={`font-mono text-[11px] font-black ${theme.ui.primaryText}`}>{windDirName}</span>
          </div>
          <div className={`relative z-10 text-lg font-black ${theme.ui.primaryText} font-mono tabular-nums`}>
            {formatSpeed(current.windSpeed, speedUnit)}
          </div>
          <div className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText} truncate`}>
            Gusts {formatSpeed(current.windGusts, speedUnit)}
          </div>
        </div>

        {/* 2. Precipitation Rate & Probability */}
        <div className={`group relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} space-y-1 transition-all shadow-md`}>
          <ThemeTileArt theme={theme} variant="metric" index={1} />
          <div className={`relative z-10 flex items-center justify-between text-xs font-bold ${theme.ui.secondaryText}`}>
            <span className="flex items-center gap-1">
              <CloudRain className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              Precipitation
            </span>
            <span className={`font-mono text-[11px] font-black ${theme.ui.accentText}`}>{todayDaily?.precipitationProbabilityMax || 0}%</span>
          </div>
          <div className={`relative z-10 text-lg font-black ${theme.ui.primaryText} font-mono tabular-nums`}>
            {current.precipitation.toFixed(1)} <span className="text-xs font-bold">mm/h</span>
          </div>
          <div className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText} truncate`}>
            {todayDaily?.precipitationSum ? `${todayDaily.precipitationSum.toFixed(1)}mm expected` : 'Dry conditions'}
          </div>
        </div>

        {/* 3. Humidity & Dew Point */}
        <div className={`group relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} space-y-1 transition-all shadow-md`}>
          <ThemeTileArt theme={theme} variant="metric" index={2} />
          <div className={`relative z-10 flex items-center justify-between text-xs font-bold ${theme.ui.secondaryText}`}>
            <span className="flex items-center gap-1">
              <Droplets className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              Humidity
            </span>
          </div>
          <div className={`relative z-10 text-lg font-black ${theme.ui.primaryText} font-mono tabular-nums`}>
            {current.relativeHumidity}%
          </div>
          <div className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText} truncate`}>
            Dew point {formatTempWithUnit(weather.hourly[0]?.dewPoint || 8, unit)}
          </div>
        </div>

        {/* 4. Barometric Pressure */}
        <div className={`group relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} space-y-1 transition-all shadow-md`}>
          <ThemeTileArt theme={theme} variant="metric" index={3} />
          <div className={`relative z-10 flex items-center justify-between text-xs font-bold ${theme.ui.secondaryText}`}>
            <span className="flex items-center gap-1">
              <Gauge className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              Pressure
            </span>
          </div>
          <div className={`relative z-10 text-lg font-black ${theme.ui.primaryText} font-mono tabular-nums`}>
            {Math.round(current.pressureMsl)} <span className="text-xs font-bold">hPa</span>
          </div>
          <div className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText} truncate`}>
            {pressureTrend}
          </div>
        </div>

        {/* 5. Solar UV Index */}
        <div className={`group relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} space-y-1 transition-all shadow-md`}>
          <ThemeTileArt theme={theme} variant="metric" index={4} />
          <div className={`relative z-10 flex items-center justify-between text-xs font-bold ${theme.ui.secondaryText}`}>
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              UV Index
            </span>
            <span className={`text-[11px] font-black ${uvInfo.color}`}>
              {uvInfo.text}
            </span>
          </div>
          <div className={`relative z-10 text-lg font-black ${theme.ui.primaryText} font-mono tabular-nums`}>
            {current.uvIndex.toFixed(1)} <span className="text-xs font-bold font-sans">/ 11</span>
          </div>
          <div className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText} truncate`}>
            Peak UV {todayDaily ? todayDaily.uvIndexMax.toFixed(1) : '--'}
          </div>
        </div>

        {/* 6. Cloud Cover & Visibility */}
        <div className={`group relative overflow-hidden p-3.5 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} space-y-1 transition-all shadow-md`}>
          <ThemeTileArt theme={theme} variant="metric" index={5} />
          <div className={`relative z-10 flex items-center justify-between text-xs font-bold ${theme.ui.secondaryText}`}>
            <span className="flex items-center gap-1">
              <Eye className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              Visibility
            </span>
          </div>
          <div className={`relative z-10 text-lg font-black ${theme.ui.primaryText} font-mono tabular-nums`}>
            {weather.hourly[0]?.visibility ? `${Math.round(weather.hourly[0].visibility)} km` : '> 10 km'}
          </div>
          <div className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText} truncate`}>
            {current.cloudCover}% cloud ceiling
          </div>
        </div>
      </div>

      {/* Circular Aerospace Wind Compass & Pressure Telemetry */}
      <div className="relative z-10 pt-1">
        <AerospaceGauges current={current} speedUnit={speedUnit} />
      </div>

      {/* Solar Arc: Sunrise & Sunset Progression */}
      {todayDaily?.sunrise && todayDaily?.sunset && (
        <div className={`relative z-10 pt-3 border-t ${theme.ui.dividerBorder} flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${theme.ui.secondaryText}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-bold">
              <Sunrise className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Sunrise: <strong className={`font-black ${theme.ui.primaryText}`}>{new Date(todayDaily.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <Sunset className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Sunset: <strong className={`font-black ${theme.ui.primaryText}`}>{new Date(todayDaily.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
            </div>
          </div>

          {/* Daylight arc bar */}
          <div className="flex items-center gap-2 sm:w-64">
            <span className={`text-[10px] uppercase font-mono font-black ${theme.ui.subheadingText}`}>Solar Cycle</span>
            <div className={`flex-1 h-2.5 rounded-full ${theme.ui.controlTrack} overflow-hidden relative p-0.5`}>
              <div 
                className={`h-full ${theme.ui.activePill} rounded-full transition-all duration-700 shadow-sm`}
                style={{ width: `${Math.min(100, Math.max(0, sunProgress))}%` }}
              />
            </div>
            <span className={`text-[11px] font-mono tabular-nums font-black ${theme.ui.primaryText}`}>
              {sunProgress}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
