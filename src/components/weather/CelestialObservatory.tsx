import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Sparkles, 
  Camera, 
  Compass, 
  Eye, 
  Telescope,
  Sunrise,
  Sunset,
  Orbit,
  Star,
  Flame
} from 'lucide-react';
import { WeatherData } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';
import { SolarSystemOrrery } from './SolarSystemOrrery';
import { StarPatternSkyDome } from './StarPatternSkyDome';
import { METEOR_SHOWERS } from '../../services/astronomyEngine';

interface CelestialObservatoryProps {
  weather: WeatherData;
  ambientSkyConstellations?: boolean;
  onToggleAmbientSkyConstellations?: () => void;
}

type CelestialSubView = 'all' | 'solar-system' | 'star-dome' | 'lunar-light';

interface LunarTelemetry {
  ageDays: number;
  phaseRatio: number; // 0..1
  illuminationPct: number;
  phaseName: string;
  daysToFull: number;
  daysToNew: number;
  zodiacSign: string;
}

function computeLunarTelemetry(date = new Date()): LunarTelemetry {
  const SYNODIC_MONTH = 29.530588853;
  // Reference New Moon: Jan 6, 2000 18:14 UTC
  const refNewMoonMs = Date.UTC(2000, 0, 6, 18, 14, 0);
  const diffDays = (date.getTime() - refNewMoonMs) / (1000 * 60 * 60 * 24);
  const ageDays = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const phaseRatio = ageDays / SYNODIC_MONTH;
  const phaseAngle = phaseRatio * 2 * Math.PI;
  const illuminationPct = Math.round(((1 - Math.cos(phaseAngle)) / 2) * 100);

  let phaseName = 'Waxing Crescent';
  if (phaseRatio < 0.03 || phaseRatio > 0.97) phaseName = 'New Moon';
  else if (phaseRatio < 0.22) phaseName = 'Waxing Crescent';
  else if (phaseRatio < 0.28) phaseName = 'First Quarter';
  else if (phaseRatio < 0.47) phaseName = 'Waxing Gibbous';
  else if (phaseRatio < 0.53) phaseName = 'Full Moon';
  else if (phaseRatio < 0.72) phaseName = 'Waning Gibbous';
  else if (phaseRatio < 0.78) phaseName = 'Last Quarter';
  else phaseName = 'Waning Crescent';

  const fullAge = SYNODIC_MONTH / 2;
  const daysToFull =
    ageDays <= fullAge
      ? Math.round((fullAge - ageDays) * 10) / 10
      : Math.round((SYNODIC_MONTH - ageDays + fullAge) * 10) / 10;
  const daysToNew = Math.round((SYNODIC_MONTH - ageDays) * 10) / 10;

  const eclipticSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  const signIdx = Math.floor((phaseRatio * 12 + (date.getUTCMonth() + 1)) % 12);

  return {
    ageDays: Math.round(ageDays * 10) / 10,
    phaseRatio,
    illuminationPct,
    phaseName,
    daysToFull,
    daysToNew,
    zodiacSign: eclipticSigns[signIdx] || 'Taurus',
  };
}

function addMinutesToTimeStr(isoOrTime: string, deltaMinutes: number): string {
  const timePart = isoOrTime.includes('T') ? isoOrTime.split('T')[1] : isoOrTime;
  const [hStr, mStr] = timePart.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return timePart;
  const total = ((h * 60 + m + deltaMinutes) % 1440 + 1440) % 1440;
  const nh = String(Math.floor(total / 60)).padStart(2, '0');
  const nm = String(total % 60).padStart(2, '0');
  return `${nh}:${nm}`;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function CelestialObservatory({
  weather,
  ambientSkyConstellations = true,
  onToggleAmbientSkyConstellations
}: CelestialObservatoryProps) {
  const { theme } = useWeatherTheme();
  const [subView, setSubView] = useState<CelestialSubView>('all');
  const lunar = computeLunarTelemetry(new Date());

  const today = weather.daily[0];
  const sunriseStr = today?.sunrise ? today.sunrise.split('T')[1]?.slice(0, 5) || '06:45' : '06:45';
  const sunsetStr = today?.sunset ? today.sunset.split('T')[1]?.slice(0, 5) || '18:15' : '18:15';

  // Golden Hour & Blue Hour Windows
  const morningBlueHour = `${addMinutesToTimeStr(sunriseStr, -40)} – ${addMinutesToTimeStr(sunriseStr, -12)}`;
  const morningGoldenHour = `${addMinutesToTimeStr(sunriseStr, -12)} – ${addMinutesToTimeStr(sunriseStr, 48)}`;
  const eveningGoldenHour = `${addMinutesToTimeStr(sunsetStr, -50)} – ${addMinutesToTimeStr(sunsetStr, 12)}`;
  const eveningBlueHour = `${addMinutesToTimeStr(sunsetStr, 12)} – ${addMinutesToTimeStr(sunsetStr, 42)}`;

  // Solar peak elevation angle approximation from latitude and day of year
  const dayOfYear = Math.floor(
    (Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);
  const maxSolarElevation = Math.max(
    5,
    Math.min(90, Math.round(90 - Math.abs(weather.location.latitude - declination)))
  );

  // Night-sky Stargazing Clarity Index (0–100)
  const cloudPenalty = weather.current.cloudCover * 0.68;
  const humidityPenalty = Math.max(0, (weather.current.relativeHumidity - 65) * 0.35);
  const moonGlarePenalty = lunar.illuminationPct * 0.16;
  const stargazingScore = Math.max(
    8,
    Math.min(99, Math.round(100 - cloudPenalty - humidityPenalty - moonGlarePenalty))
  );

  const stargazingRating =
    stargazingScore >= 80
      ? 'Pristine Deep-Sky Seeing'
      : stargazingScore >= 60
      ? 'Good Constellation Visibility'
      : stargazingScore >= 38
      ? 'Moderate Haze / Partial Clouds'
      : 'Obscured Sky Dome';

  // High-latitude Aurora Potential
  const absLat = Math.abs(weather.location.latitude);
  const auroraOdds =
    absLat >= 62
      ? Math.max(15, Math.round((100 - weather.current.cloudCover) * 0.85))
      : absLat >= 54
      ? Math.max(8, Math.round((100 - weather.current.cloudCover) * 0.42))
      : Math.max(2, Math.round((100 - weather.current.cloudCover) * 0.08));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Celestial Observatory Sub-Navigation & Sky Star Pattern Toggle Bar */}
      <div className={`relative rounded-[28px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-4 sm:p-5 overflow-hidden flex flex-wrap items-center justify-between gap-4`}>
        <ThemeCardArtWrapper theme={theme} variant="compact" />
        <div className="relative z-10 flex flex-wrap items-center gap-2">
          {[
            { id: 'all' as CelestialSubView, label: 'Full Celestial Sanctuary', icon: Telescope },
            { id: 'solar-system' as CelestialSubView, label: 'Live Solar System Orrery', icon: Orbit },
            { id: 'star-dome' as CelestialSubView, label: 'Star Patterns & Sky Dome', icon: Star },
            { id: 'lunar-light' as CelestialSubView, label: 'Lunar & Golden Hours', icon: Moon }
          ].map((tab, idx) => {
            const Icon = tab.icon;
            const active = subView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubView(tab.id)}
                className={`relative overflow-hidden px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                  active
                    ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-md scale-[1.02]`
                    : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
                }`}
              >
                {!active && <ThemeTileArt theme={theme} variant="pill" index={idx} />}
                <Icon className="relative z-10 w-3.5 h-3.5" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {onToggleAmbientSkyConstellations && (
          <button
            type="button"
            onClick={onToggleAmbientSkyConstellations}
            className={`relative z-10 overflow-hidden px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all shadow-md ${
              ambientSkyConstellations
                ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {ambientSkyConstellations
                ? 'Ambient Sky Star Patterns: Active'
                : 'Enable Star Patterns in Sky'}
            </span>
          </button>
        )}
      </div>

      {/* SECTION 1: LIVE INTERACTIVE SOLAR SYSTEM ORRERY */}
      {(subView === 'all' || subView === 'solar-system') && (
        <SolarSystemOrrery weather={weather} />
      )}

      {/* SECTION 2: LIVE STAR PATTERNS & CONSTELLATION SKY DOME (PLANETARIUM) */}
      {(subView === 'all' || subView === 'star-dome') && (
        <StarPatternSkyDome
          weather={weather}
          ambientSkyConstellations={ambientSkyConstellations}
          onToggleAmbientSkyConstellations={onToggleAmbientSkyConstellations}
        />
      )}

      {/* SECTION 3: LUNAR PHASE DIAL, STARGAZING CLARITY & GOLDEN/BLUE HOURS */}
      {(subView === 'all' || subView === 'lunar-light') && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Illustrated Lunar Phase Sanctuary */}
            <div className={`lg:col-span-5 relative rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden flex flex-col justify-between gap-6`}>
              <ThemeCardArtWrapper theme={theme} variant="hero" />
              <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md`}>
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-base font-black ${theme.ui.primaryText} tracking-tight`}>
                      Lunar Phase &amp; Orbital Dial
                    </h2>
                    <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                      Synodic Cycle Day {lunar.ageDays} of 29.5
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-mono font-black ${theme.ui.subheadingText}`}>
                  {lunar.illuminationPct}% Lit
                </span>
              </div>

              {/* Custom Illustrated Lunar Disc with Crater & Shadow Geometry */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 py-2">
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-[0_0_28px_rgba(251,191,36,0.35)]">
                    <defs>
                      <radialGradient id="lunar-surface-grad" cx="38%" cy="35%" r="68%">
                        <stop offset="0%" stopColor="#FEF9C3" />
                        <stop offset="55%" stopColor="#FDE047" />
                        <stop offset="100%" stopColor="#CA8A04" />
                      </radialGradient>
                    </defs>
                    <circle
                      cx="80"
                      cy="80"
                      r="74"
                      fill="none"
                      stroke={theme.accentColors.tertiary}
                      strokeOpacity="0.35"
                      strokeDasharray="3 5"
                      strokeWidth="1.5"
                    />
                    <circle cx="80" cy="80" r="58" fill="#1E1B4B" stroke={theme.accentColors.primary} strokeWidth="2" />
                    <circle
                      cx="80"
                      cy="80"
                      r="56"
                      fill="url(#lunar-surface-grad)"
                      opacity={Math.max(0.18, lunar.illuminationPct / 100)}
                    />
                    <circle cx="62" cy="58" r="14" fill="#A16207" opacity="0.26" />
                    <circle cx="96" cy="70" r="18" fill="#A16207" opacity="0.22" />
                    <circle cx="72" cy="98" r="11" fill="#A16207" opacity="0.25" />
                    <circle cx="102" cy="100" r="7" fill="#FEF08A" opacity="0.45" />
                    {lunar.illuminationPct < 96 && (
                      <ellipse
                        cx={lunar.phaseRatio <= 0.5 ? 52 : 108}
                        cy="80"
                        rx={Math.max(6, Math.abs(50 - lunar.illuminationPct) * 1.1)}
                        ry="56"
                        fill="#0F0722"
                        opacity="0.76"
                      />
                    )}
                  </svg>
                </div>

                <div className="space-y-3 text-center sm:text-left flex-1">
                  <div>
                    <span className={`text-xs font-mono font-black uppercase tracking-widest ${theme.ui.subheadingText} block`}>
                      Current Lunar Phase
                    </span>
                    <h3 className={`text-2xl font-black ${theme.ui.primaryText} tracking-tight`}>
                      {lunar.phaseName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className={`relative overflow-hidden p-3 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                      <ThemeTileArt theme={theme} variant="pill" index={0} />
                      <span className={`relative z-10 text-[10px] font-bold uppercase ${theme.ui.secondaryText} block`}>
                        Next Full Moon
                      </span>
                      <span className={`relative z-10 text-sm font-black font-mono ${theme.ui.primaryText}`}>
                        In {lunar.daysToFull} days
                      </span>
                    </div>
                    <div className={`relative overflow-hidden p-3 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                      <ThemeTileArt theme={theme} variant="pill" index={1} />
                      <span className={`relative z-10 text-[10px] font-bold uppercase ${theme.ui.secondaryText} block`}>
                        Next New Moon
                      </span>
                      <span className={`relative z-10 text-sm font-black font-mono ${theme.ui.primaryText}`}>
                        In {lunar.daysToNew} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`relative z-10 pt-3 border-t ${theme.ui.dividerBorder} flex items-center justify-between text-xs font-bold ${theme.ui.secondaryText}`}>
                <span>Ecliptic Transit: <strong className={theme.ui.primaryText}>{lunar.zodiacSign}</strong></span>
                <span>Moonlight Glare: <strong className={theme.ui.primaryText}>{lunar.illuminationPct > 65 ? 'High' : lunar.illuminationPct > 30 ? 'Moderate' : 'Minimal'}</strong></span>
              </div>
            </div>

            {/* Right 7 Cols: Stargazing & Deep-Sky Clarity Sanctuary */}
            <div className={`lg:col-span-7 relative rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden flex flex-col justify-between gap-6`}>
              <ThemeCardArtWrapper theme={theme} variant="hero" />
              <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md`}>
                    <Telescope className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-base font-black ${theme.ui.primaryText} tracking-tight`}>
                      Stargazing &amp; Deep-Sky Observatory Index
                    </h2>
                    <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                      Optical atmospheric seeing, cloud dome transparency, and aurora borealis probability
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-3xl font-black font-mono bg-gradient-to-br ${theme.ui.headingGradient} bg-clip-text text-transparent`}>
                    {stargazingScore}/100
                  </span>
                  <span className={`text-[11px] font-black ${theme.ui.subheadingText} block`}>
                    {stargazingRating}
                  </span>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1`}>
                  <ThemeTileArt theme={theme} variant="gauge" index={0} />
                  <div className="relative z-10 flex items-center justify-between text-xs font-bold">
                    <span className={theme.ui.secondaryText}>Cloud Dome Cover</span>
                    <Eye className={`w-4 h-4 ${theme.ui.accentText}`} />
                  </div>
                  <p className={`relative z-10 text-xl font-black font-mono ${theme.ui.primaryText}`}>
                    {weather.current.cloudCover}% Obscured
                  </p>
                  <p className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
                    {weather.current.cloudCover < 25
                      ? 'Wide-open zenith window for Milky Way & nebula observation'
                      : weather.current.cloudCover < 60
                      ? 'Intermittent sucker-holes suitable for bright planets'
                      : 'Dense cloud deck blocking faint deep-sky magnitudes'}
                  </p>
                </div>

                <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1`}>
                  <ThemeTileArt theme={theme} variant="gauge" index={1} />
                  <div className="relative z-10 flex items-center justify-between text-xs font-bold">
                    <span className={theme.ui.secondaryText}>Aurora Geomagnetic Odds</span>
                    <Sparkles className={`w-4 h-4 ${theme.ui.accentText}`} />
                  </div>
                  <p className={`relative z-10 text-xl font-black font-mono ${theme.ui.primaryText}`}>
                    {auroraOdds}% Visibility
                  </p>
                  <p className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
                    Latitude {weather.location.latitude.toFixed(1)}° · {absLat >= 54 ? 'High-latitude auroral oval reach' : 'Requires G3+ solar storm for mid-latitudes'}
                  </p>
                </div>

                <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1`}>
                  <ThemeTileArt theme={theme} variant="gauge" index={2} />
                  <div className="relative z-10 flex items-center justify-between text-xs font-bold">
                    <span className={theme.ui.secondaryText}>Atmospheric Moisture Haze</span>
                    <Compass className={`w-4 h-4 ${theme.ui.accentText}`} />
                  </div>
                  <p className={`relative z-10 text-xl font-black font-mono ${theme.ui.primaryText}`}>
                    {weather.current.relativeHumidity}% RH
                  </p>
                  <p className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
                    {weather.current.relativeHumidity < 65
                      ? 'Crisp, low-scatter air column with sharp starlight points'
                      : 'Elevated water vapour causing mild halo diffusion around bright stars'}
                  </p>
                </div>

                <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1`}>
                  <ThemeTileArt theme={theme} variant="gauge" index={3} />
                  <div className="relative z-10 flex items-center justify-between text-xs font-bold">
                    <span className={theme.ui.secondaryText}>Solar Zenith Elevation</span>
                    <Sun className={`w-4 h-4 ${theme.ui.accentText}`} />
                  </div>
                  <p className={`relative z-10 text-xl font-black font-mono ${theme.ui.primaryText}`}>
                    {maxSolarElevation}° Peak Arc
                  </p>
                  <p className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
                    Maximum sun angle above horizon at local solar meridian
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Annual Meteor Shower & Comet Debris Stream Almanac */}
          <div className={`relative rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden space-y-5`}>
            <ThemeCardArtWrapper theme={theme} variant="standard" />
            <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md`}>
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h2 className={`text-base font-black ${theme.ui.primaryText} tracking-tight`}>
                    Cometary Meteor Shower &amp; Radiant Almanac
                  </h2>
                  <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                    Major annual meteor streams, parent comets, radiant constellations, and Zenithal Hourly Rates (ZHR)
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {METEOR_SHOWERS.slice(0, 4).map((ms, idx) => (
                <div
                  key={ms.id}
                  className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5`}
                >
                  <ThemeTileArt theme={theme} variant="metric" index={idx} />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className={`text-sm font-black ${theme.ui.primaryText}`}>
                      {ms.name}
                    </span>
                    <span className={`text-xs font-mono font-black ${theme.ui.accentText}`}>
                      {ms.zhr}/hr ZHR
                    </span>
                  </div>
                  <p className={`relative z-10 text-xs font-mono font-bold ${theme.ui.subheadingText}`}>
                    Peak: {MONTH_NAMES[ms.peakMonth - 1]} {ms.peakDay} · {ms.radiantConstellation}
                  </p>
                  <p className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
                    {ms.description}
                  </p>
                  <p className={`relative z-10 text-[10px] font-mono ${theme.ui.secondaryText} pt-1 border-t ${theme.ui.dividerBorder}`}>
                    Origin: {ms.parentBody} · {ms.velocityKms} km/s
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Golden Hour & Blue Hour Cinema Light Tracker */}
          <div className={`relative rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-7 overflow-hidden space-y-5`}>
            <ThemeCardArtWrapper theme={theme} variant="standard" />
            <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-md`}>
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h2 className={`text-base font-black ${theme.ui.primaryText} tracking-tight`}>
                    Golden Hour &amp; Blue Hour Natural Light Windows
                  </h2>
                  <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
                    Calculated from {weather.location.name}&apos;s exact sunrise ({sunriseStr}) and sunset ({sunsetStr}) horizon angles
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5`}>
                <ThemeTileArt theme={theme} variant="metric" index={0} />
                <div className="relative z-10 flex items-center gap-1.5 text-xs font-black">
                  <Sunrise className="w-4 h-4 text-sky-300" />
                  <span className={theme.ui.primaryText}>Morning Blue Hour</span>
                </div>
                <p className={`relative z-10 text-lg font-black font-mono ${theme.ui.subheadingText}`}>
                  {morningBlueHour}
                </p>
                <p className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
                  Deep cobalt civil twilight before first direct solar rays
                </p>
              </div>

              <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5`}>
                <ThemeTileArt theme={theme} variant="metric" index={1} />
                <div className="relative z-10 flex items-center gap-1.5 text-xs font-black">
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span className={theme.ui.primaryText}>Morning Golden Hour</span>
                </div>
                <p className={`relative z-10 text-lg font-black font-mono ${theme.ui.subheadingText}`}>
                  {morningGoldenHour}
                </p>
                <p className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
                  Warm directional peach &amp; gold low-angle light
                </p>
              </div>

              <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5`}>
                <ThemeTileArt theme={theme} variant="metric" index={2} />
                <div className="relative z-10 flex items-center gap-1.5 text-xs font-black">
                  <Sunset className="w-4 h-4 text-amber-400" />
                  <span className={theme.ui.primaryText}>Evening Golden Hour</span>
                </div>
                <p className={`relative z-10 text-lg font-black font-mono ${theme.ui.subheadingText}`}>
                  {eveningGoldenHour}
                </p>
                <p className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
                  Cinematic long-shadow amber glow prior to sunset
                </p>
              </div>

              <div className={`relative overflow-hidden p-4 rounded-2xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} space-y-1.5`}>
                <ThemeTileArt theme={theme} variant="metric" index={3} />
                <div className="relative z-10 flex items-center gap-1.5 text-xs font-black">
                  <Moon className="w-4 h-4 text-indigo-300" />
                  <span className={theme.ui.primaryText}>Evening Blue Hour</span>
                </div>
                <p className={`relative z-10 text-lg font-black font-mono ${theme.ui.subheadingText}`}>
                  {eveningBlueHour}
                </p>
                <p className={`relative z-10 text-[11px] font-semibold ${theme.ui.secondaryText}`}>
                  Velvet indigo dusk where city lights balance the sky dome
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
