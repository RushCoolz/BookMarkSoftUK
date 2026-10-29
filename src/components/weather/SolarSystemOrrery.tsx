import React, { useState, useEffect, useMemo } from 'react';
import {
  Orbit,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Sparkles,
  Eye,
  ZoomIn,
  ZoomOut,
  Calendar
} from 'lucide-react';
import { WeatherData } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';
import {
  computeSolarSystemState,
  ComputedPlanetState
} from '../../services/astronomyEngine';

interface SolarSystemOrreryProps {
  weather: WeatherData;
}

/**
 * Maps heliocentric (x, y) in AU to SVG coordinates (cx=260, cy=260)
 * using either a power/logarithmic scale (so all 8 planets from 0.39 AU to 30.1 AU fit cleanly)
 * or an inner-system linear zoom (Mercury to Mars).
 */
function projectHelioToOrrery(
  xAU: number,
  yAU: number,
  innerZoom: boolean
): { svgX: number; svgY: number; rPx: number } {
  const rAU = Math.sqrt(xAU * xAU + yAU * yAU);
  if (rAU < 1e-5) return { svgX: 260, svgY: 260, rPx: 0 };

  const maxRadiusPx = 224;
  let rPx = 0;

  if (innerZoom) {
    // Inner system: Mars is ~1.67 AU max aphelion
    rPx = Math.min(maxRadiusPx, (rAU / 1.78) * maxRadiusPx);
  } else {
    // Non-linear power scale so inner rocky worlds and outer ice giants are all clearly separated
    rPx = Math.min(maxRadiusPx, 28 + Math.pow(rAU, 0.51) * 34.5);
  }

  const angle = Math.atan2(yAU, xAU);
  return {
    svgX: 260 + rPx * Math.cos(angle),
    svgY: 260 - rPx * Math.sin(angle),
    rPx
  };
}

export function SolarSystemOrrery({ weather }: SolarSystemOrreryProps) {
  const { theme } = useWeatherTheme();

  // Orbital Time Offset in days from current time (-365 to +365)
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedDaysPerSec, setSpeedDaysPerSec] = useState<number>(15);
  const [innerZoom, setInnerZoom] = useState<boolean>(false);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('jupiter');

  // Orbital playback loop
  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const dtSec = (now - lastTime) / 1000;
      lastTime = now;
      setDayOffset((prev) => {
        const next = prev + dtSec * speedDaysPerSec;
        return next > 365 ? -365 : next;
      });
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, speedDaysPerSec]);

  const effectiveDate = useMemo(() => {
    const baseMs = weather.current.time ? new Date(weather.current.time).getTime() : Date.now();
    const safeBase = isNaN(baseMs) ? Date.now() : baseMs;
    return new Date(safeBase + dayOffset * 86400000);
  }, [weather.current.time, dayOffset]);

  const planets = useMemo(() => {
    return computeSolarSystemState(
      effectiveDate,
      weather.location.latitude,
      weather.location.longitude
    );
  }, [effectiveDate, weather.location.latitude, weather.location.longitude]);

  const earthState = useMemo(
    () => planets.find((p) => p.id === 'earth') || planets[2],
    [planets]
  );

  const selectedPlanet: ComputedPlanetState = useMemo(
    () => planets.find((p) => p.id === selectedPlanetId) || planets[4],
    [planets, selectedPlanetId]
  );

  const earthSvg = useMemo(
    () => projectHelioToOrrery(earthState.helioX, earthState.helioY, innerZoom),
    [earthState, innerZoom]
  );

  const selectedSvg = useMemo(
    () => projectHelioToOrrery(selectedPlanet.helioX, selectedPlanet.helioY, innerZoom),
    [selectedPlanet, innerZoom]
  );

  // Asteroid belt particles (around 2.7 AU)
  const asteroidBeltDots = useMemo(() => {
    const dots: Array<{ angle: number; rAU: number; size: number; alpha: number }> = [];
    for (let i = 0; i < 64; i++) {
      dots.push({
        angle: (i / 64) * Math.PI * 2 + (i % 3) * 0.04,
        rAU: 2.35 + ((i * 17) % 10) * 0.075,
        size: i % 4 === 0 ? 1.7 : 1.1,
        alpha: 0.25 + ((i * 7) % 10) * 0.04
      });
    }
    return dots;
  }, []);

  const formattedEphemerisDate = useMemo(() => {
    try {
      return effectiveDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return effectiveDate.toISOString().slice(0, 10);
    }
  }, [effectiveDate]);

  const visiblePlanetsCount = useMemo(
    () => planets.filter((p) => p.id !== 'earth' && p.isAboveHorizon && p.elongationDeg >= 14).length,
    [planets]
  );

  return (
    <div className={`relative rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-8 overflow-hidden space-y-6`}>
      <ThemeCardArtWrapper theme={theme} variant="hero" />
      <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

      {/* Header Row */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-lg`}>
            <Orbit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-lg font-black ${theme.ui.primaryText} tracking-tight`}>
                Live Heliocentric Solar System Orrery
              </h2>
              <span className={`text-xs font-mono font-bold ${theme.ui.subheadingText}`}>
                · J2000 Keplerian Ephemeris · {visiblePlanetsCount} Planets Above {weather.location.name} Horizon
              </span>
            </div>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              Real-time planetary orbits, Earth-to-planet sightline vectors, and local horizon visibility
            </p>
          </div>
        </div>

        {/* Scale & Playback Quick Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setInnerZoom(!innerZoom)}
            className={`relative overflow-hidden px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-sm ${
              innerZoom
                ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
            }`}
          >
            {!innerZoom && <ThemeTileArt theme={theme} variant="pill" index={0} />}
            {innerZoom ? <ZoomOut className="relative z-10 w-3.5 h-3.5" /> : <ZoomIn className="relative z-10 w-3.5 h-3.5" />}
            <span className="relative z-10">{innerZoom ? 'Show All 8 Orbits' : 'Zoom Inner Planets'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`relative overflow-hidden px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-sm ${
              isPlaying
                ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
            }`}
          >
            {!isPlaying && <ThemeTileArt theme={theme} variant="pill" index={1} />}
            {isPlaying ? <Pause className="relative z-10 w-3.5 h-3.5" /> : <Play className="relative z-10 w-3.5 h-3.5" />}
            <span className="relative z-10">{isPlaying ? 'Pause Orbits' : 'Animate Orbits'}</span>
          </button>

          {dayOffset !== 0 && (
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setDayOffset(0);
              }}
              className={`relative overflow-hidden px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`}
              title="Reset to Live Timestamp"
            >
              <ThemeTileArt theme={theme} variant="pill" index={2} />
              <RotateCcw className="relative z-10 w-3.5 h-3.5" />
              <span className="relative z-10">Live Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Orrery Grid: Left 7 Cols Interactive Orbital Map + Right 5 Cols Planet Telemetry Inspector */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left 7 Cols: Interactive SVG Orrery */}
        <div className={`lg:col-span-7 relative rounded-3xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} p-4 sm:p-5 flex flex-col justify-between overflow-hidden`}>
          <ThemeTileArt theme={theme} variant="gauge" index={0} />

          {/* Top Ephemeris Timestamp Bar inside Orrery */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
            <span className={`flex items-center gap-1.5 ${theme.ui.primaryText}`}>
              <Calendar className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
              <span>Ephemeris Date: <strong className="font-mono">{formattedEphemerisDate}</strong></span>
              <span aria-hidden="true" className={theme.ui.secondaryText}>·</span>
              <span className={`font-mono ${theme.ui.subheadingText}`}>
                {dayOffset === 0
                  ? 'LIVE TELEMETRY'
                  : `${dayOffset > 0 ? '+' : ''}${Math.round(dayOffset)}d Offset`}
              </span>
            </span>

            <span className={`font-mono text-[11px] ${theme.ui.secondaryText}`}>
              Click any planet orbit to lock sightline
            </span>
          </div>

          {/* Interactive SVG Heliocentric Plane */}
          <div className="relative z-10 my-2 flex items-center justify-center">
            <svg
              viewBox="0 0 520 520"
              className="w-full max-w-[460px] aspect-square select-none drop-shadow-[0_0_32px_rgba(14,165,233,0.18)]"
            >
              <defs>
                <radialGradient id="orrery-deep-space" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.92" />
                  <stop offset="68%" stopColor="#090d1f" stopOpacity="0.96" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
                </radialGradient>
                <radialGradient id="solar-corona" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="35%" stopColor="#fde047" />
                  <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Celestial Ecliptic Disc Backdrop */}
              <circle
                cx="260"
                cy="260"
                r="248"
                fill="url(#orrery-deep-space)"
                stroke={theme.accentColors.primary}
                strokeOpacity="0.45"
                strokeWidth="1.5"
              />

              {/* Subtle Ecliptic Longitude Sector Lines (every 30° Zodiac house) */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const x2 = 260 + 244 * Math.cos(rad);
                const y2 = 260 - 244 * Math.sin(rad);
                return (
                  <line
                    key={deg}
                    x1="260"
                    y1="260"
                    x2={x2}
                    y2={y2}
                    stroke="#94a3b8"
                    strokeOpacity="0.11"
                    strokeDasharray="2 5"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Vernal Equinox 0° Aries Reference Axis */}
              <text x="488" y="256" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="end" opacity="0.65">
                0° ♈︎
              </text>
              <text x="260" y="24" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.65">
                90° ♋︎
              </text>
              <text x="32" y="256" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="start" opacity="0.65">
                180° ♎︎
              </text>
              <text x="260" y="502" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.65">
                270° ♑︎
              </text>

              {/* Asteroid Belt Ring (between Mars & Jupiter) */}
              {!innerZoom &&
                asteroidBeltDots.map((dot, idx) => {
                  const xAU = dot.rAU * Math.cos(dot.angle);
                  const yAU = dot.rAU * Math.sin(dot.angle);
                  const pt = projectHelioToOrrery(xAU, yAU, false);
                  return (
                    <circle
                      key={idx}
                      cx={pt.svgX}
                      cy={pt.svgY}
                      r={dot.size}
                      fill="#cbd5e1"
                      opacity={dot.alpha}
                    />
                  );
                })}

              {/* Planetary Orbital Paths */}
              {planets.map((planet) => {
                if (innerZoom && ['jupiter', 'saturn', 'uranus', 'neptune'].includes(planet.id)) {
                  return null;
                }
                const isSelected = planet.id === selectedPlanet.id;
                const pathD = planet.orbitTrail
                  .map((pt, i) => {
                    const p = projectHelioToOrrery(pt.x, pt.y, innerZoom);
                    return `${i === 0 ? 'M' : 'L'} ${p.svgX.toFixed(1)} ${p.svgY.toFixed(1)}`;
                  })
                  .join(' ') + ' Z';

                return (
                  <path
                    key={`orbit-${planet.id}`}
                    d={pathD}
                    fill="none"
                    stroke={isSelected ? planet.color : '#64748b'}
                    strokeOpacity={isSelected ? 0.75 : 0.28}
                    strokeWidth={isSelected ? 1.8 : 1.0}
                    strokeDasharray={planet.id === 'earth' ? 'none' : '3 3'}
                  />
                );
              })}

              {/* Earth-to-Selected-Planet Sightline Vector */}
              {selectedPlanet.id !== 'earth' &&
                (!innerZoom || !['jupiter', 'saturn', 'uranus', 'neptune'].includes(selectedPlanet.id)) && (
                  <g>
                    <line
                      x1={earthSvg.svgX}
                      y1={earthSvg.svgY}
                      x2={selectedSvg.svgX}
                      y2={selectedSvg.svgY}
                      stroke={selectedPlanet.color}
                      strokeWidth="1.6"
                      strokeDasharray="4 4"
                      strokeOpacity="0.85"
                    />
                    {/* Midpoint Distance Readout Tag */}
                    <text
                      x={(earthSvg.svgX + selectedSvg.svgX) / 2}
                      y={(earthSvg.svgY + selectedSvg.svgY) / 2 - 7}
                      fill={selectedPlanet.color}
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {selectedPlanet.geoDistAU.toFixed(2)} AU
                    </text>
                  </g>
                )}

              {/* Central Sun & Corona */}
              <circle cx="260" cy="260" r="24" fill="url(#solar-corona)" />
              <circle cx="260" cy="260" r="9.5" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />

              {/* Planet Nodes */}
              {planets.map((planet) => {
                if (innerZoom && ['jupiter', 'saturn', 'uranus', 'neptune'].includes(planet.id)) {
                  return null;
                }
                const pos = projectHelioToOrrery(planet.helioX, planet.helioY, innerZoom);
                const isSelected = planet.id === selectedPlanet.id;
                const nodeRadius =
                  planet.id === 'jupiter' || planet.id === 'saturn'
                    ? 7.5
                    : planet.id === 'uranus' || planet.id === 'neptune'
                    ? 6.2
                    : planet.id === 'earth' || planet.id === 'venus'
                    ? 5.8
                    : 4.8;

                return (
                  <g
                    key={planet.id}
                    onClick={() => setSelectedPlanetId(planet.id)}
                    className="cursor-pointer group"
                  >
                    {/* Selection Pulse Halo */}
                    {isSelected && (
                      <circle
                        cx={pos.svgX}
                        cy={pos.svgY}
                        r={nodeRadius + 7}
                        fill="none"
                        stroke={planet.color}
                        strokeWidth="1.8"
                        strokeOpacity="0.9"
                      />
                    )}

                    {/* Saturn's Rings in Orrery */}
                    {planet.hasRings && (
                      <ellipse
                        cx={pos.svgX}
                        cy={pos.svgY}
                        rx={nodeRadius + 6}
                        ry={nodeRadius * 0.48}
                        fill="none"
                        stroke="#fde047"
                        strokeWidth="1.8"
                        transform={`rotate(-24 ${pos.svgX} ${pos.svgY})`}
                      />
                    )}

                    {/* Earth's Orbiting Moon Indicator */}
                    {planet.id === 'earth' && (
                      <circle
                        cx={pos.svgX + Math.cos(dayOffset * 0.23) * 11}
                        cy={pos.svgY - Math.sin(dayOffset * 0.23) * 11}
                        r="2.1"
                        fill="#fef9c3"
                      />
                    )}

                    {/* Planet Body */}
                    <circle
                      cx={pos.svgX}
                      cy={pos.svgY}
                      r={nodeRadius}
                      fill={planet.color}
                      stroke="#0f172a"
                      strokeWidth="1.4"
                    />

                    {/* Planet Label */}
                    <text
                      x={pos.svgX}
                      y={pos.svgY - nodeRadius - 5}
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize={isSelected ? '10.5' : '9'}
                      fontWeight={isSelected ? '900' : '700'}
                      textAnchor="middle"
                    >
                      {planet.symbol} {planet.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Orbital Time-Travel Scrubber */}
          <div className="relative z-10 pt-3 border-t border-white/15 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className={theme.ui.secondaryText}>
                Orbital Time Scrubber (-1 Year to +1 Year)
              </span>
              <div className="flex items-center gap-1.5 font-mono">
                {[7, 30, 90].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setSpeedDaysPerSec(spd)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black cursor-pointer transition-colors ${
                      speedDaysPerSec === spd
                        ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                        : `${theme.ui.secondaryText} hover:${theme.ui.primaryText}`
                    }`}
                  >
                    {spd}d/s
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min={-365}
              max={365}
              step={1}
              value={Math.round(dayOffset)}
              onChange={(e) => {
                setIsPlaying(false);
                setDayOffset(Number(e.target.value));
              }}
              aria-label="Orbital Time Scrubber in Days"
              className="w-full accent-amber-400 cursor-pointer h-2 rounded-lg"
            />

            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
              <button
                type="button"
                onClick={() => setDayOffset((d) => Math.max(-365, d - 30))}
                className={`cursor-pointer hover:${theme.ui.accentText} ${theme.ui.secondaryText}`}
              >
                ← -30 Days
              </button>
              <span className={theme.ui.subheadingText}>
                Solar Longitude {selectedPlanet.helioLonDeg}° · Zodiac {selectedPlanet.zodiacConstellation}
              </span>
              <button
                type="button"
                onClick={() => setDayOffset((d) => Math.min(365, d + 30))}
                className={`cursor-pointer hover:${theme.ui.accentText} ${theme.ui.secondaryText}`}
              >
                +30 Days →
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Selected Planet Deep-Sky Telemetry & Horizon Inspector */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          
          {/* Planet Selection Strip */}
          <div className="grid grid-cols-4 gap-2">
            {planets.map((p, idx) => {
              const active = p.id === selectedPlanet.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlanetId(p.id)}
                  className={`relative overflow-hidden px-2.5 py-2 rounded-2xl text-left transition-all cursor-pointer ${
                    active
                      ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-md scale-[1.02]`
                      : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
                  }`}
                >
                  {!active && <ThemeTileArt theme={theme} variant="pill" index={idx} />}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-black truncate">{p.name}</span>
                    <span className="text-xs font-mono opacity-85">{p.symbol}</span>
                  </div>
                  <span className="relative z-10 text-[10px] font-mono block opacity-85">
                    {p.id === 'earth'
                      ? '1.00 AU'
                      : p.isAboveHorizon
                      ? `Alt ${Math.round(p.altitudeDeg)}°`
                      : 'Below Horz'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Illustrated Planet Inspector Card */}
          <div className={`relative flex-1 rounded-3xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} p-5 overflow-hidden flex flex-col justify-between gap-4`}>
            <ThemeTileArt theme={theme} variant="gauge" index={2} />

            <div className="relative z-10 flex items-center gap-4">
              {/* Custom Illustrated Planet Globe */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke={selectedPlanet.color}
                    strokeOpacity="0.35"
                    strokeDasharray="2 4"
                    strokeWidth="1.5"
                  />
                  {selectedPlanet.hasRings && (
                    <ellipse
                      cx="50"
                      cy="50"
                      rx="46"
                      ry="16"
                      fill="none"
                      stroke="#fde047"
                      strokeWidth="4"
                      strokeOpacity="0.85"
                      transform="rotate(-22 50 50)"
                    />
                  )}
                  <circle
                    cx="50"
                    cy="50"
                    r="28"
                    fill={selectedPlanet.color}
                    stroke={selectedPlanet.accentColor}
                    strokeWidth="2"
                  />
                  {/* Surface Atmospheric Bands / Crater Detail */}
                  <path
                    d="M 24 42 Q 50 48 76 42"
                    fill="none"
                    stroke={selectedPlanet.accentColor}
                    strokeWidth="3"
                    opacity="0.55"
                  />
                  <path
                    d="M 23 56 Q 50 62 77 56"
                    fill="none"
                    stroke={selectedPlanet.accentColor}
                    strokeWidth="2.5"
                    opacity="0.45"
                  />
                </svg>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-black uppercase tracking-widest ${theme.ui.subheadingText}`}>
                    {selectedPlanet.symbol} {selectedPlanet.zodiacConstellation} Transit
                  </span>
                </div>
                <h3 className={`text-2xl font-black ${theme.ui.primaryText} tracking-tight`}>
                  {selectedPlanet.name}
                </h3>
                <p className={`text-xs font-bold ${theme.ui.accentText}`}>
                  {selectedPlanet.visibilityLabel}
                </p>
              </div>
            </div>

            <p className={`relative z-10 text-xs font-medium leading-relaxed ${theme.ui.secondaryText}`}>
              {selectedPlanet.lore}
            </p>

            {/* 4 Live Ephemeris Metric Readouts */}
            <div className="relative z-10 grid grid-cols-2 gap-2.5">
              <div className={`p-3 rounded-2xl border ${theme.ui.dividerBorder} space-y-0.5`}>
                <span className={`text-[10px] font-bold uppercase ${theme.ui.secondaryText} block`}>
                  Distance from Earth
                </span>
                <span className={`text-sm font-black font-mono ${theme.ui.primaryText} block`}>
                  {selectedPlanet.id === 'earth'
                    ? '0.000 AU (Origin)'
                    : `${selectedPlanet.geoDistAU} AU`}
                </span>
                <span className={`text-[10px] font-mono ${theme.ui.subheadingText} block`}>
                  {selectedPlanet.id === 'earth'
                    ? '1.000 AU from Sun'
                    : `${selectedPlanet.geoDistMillionKm}M km · Sun ${selectedPlanet.helioDistAU} AU`}
                </span>
              </div>

              <div className={`p-3 rounded-2xl border ${theme.ui.dividerBorder} space-y-0.5`}>
                <span className={`text-[10px] font-bold uppercase ${theme.ui.secondaryText} block`}>
                  Local Sky Position
                </span>
                <span className={`text-sm font-black font-mono ${theme.ui.primaryText} block`}>
                  Alt {selectedPlanet.altitudeDeg}° · {selectedPlanet.compassDir}
                </span>
                <span className={`text-[10px] font-mono ${theme.ui.subheadingText} block`}>
                  Azimuth {selectedPlanet.azimuthDeg}° in {weather.location.name}
                </span>
              </div>

              <div className={`p-3 rounded-2xl border ${theme.ui.dividerBorder} space-y-0.5`}>
                <span className={`text-[10px] font-bold uppercase ${theme.ui.secondaryText} block`}>
                  Brightness &amp; Elongation
                </span>
                <span className={`text-sm font-black font-mono ${theme.ui.primaryText} block`}>
                  Mag {selectedPlanet.apparentMag > 0 ? `+${selectedPlanet.apparentMag}` : selectedPlanet.apparentMag}
                </span>
                <span className={`text-[10px] font-mono ${theme.ui.subheadingText} block`}>
                  Solar Elongation {selectedPlanet.elongationDeg}°
                </span>
              </div>

              <div className={`p-3 rounded-2xl border ${theme.ui.dividerBorder} space-y-0.5`}>
                <span className={`text-[10px] font-bold uppercase ${theme.ui.secondaryText} block`}>
                  Orbital Kinematics
                </span>
                <span className={`text-sm font-black font-mono ${theme.ui.primaryText} block`}>
                  {selectedPlanet.orbitalSpeedKms} km/s
                </span>
                <span className={`text-[10px] font-mono ${theme.ui.subheadingText} block`}>
                  Year: {Math.round(selectedPlanet.orbitalPeriodDays)} Earth days
                </span>
              </div>
            </div>

            {/* Stargazer Observation Tip */}
            <div className={`relative z-10 pt-3 border-t ${theme.ui.dividerBorder} flex items-start gap-2.5 text-xs`}>
              <Eye className={`w-4 h-4 ${theme.ui.accentText} shrink-0 mt-0.5`} />
              <p className={`font-semibold ${theme.ui.primaryText}`}>
                {selectedPlanet.observationTip}{' '}
                <span className={theme.ui.secondaryText}>
                  (Local cloud cover: {weather.current.cloudCover}%)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
