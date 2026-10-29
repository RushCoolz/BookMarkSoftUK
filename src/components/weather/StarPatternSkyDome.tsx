import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Star,
  Layers,
  Telescope
} from 'lucide-react';
import { WeatherData } from '../../types/weather';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';
import {
  computeConstellationsForSky,
  computeSolarSystemState,
  computeEclipticDomePath,
  computeLocalSiderealTimeDeg,
  ProjectedConstellation
} from '../../services/astronomyEngine';

interface StarPatternSkyDomeProps {
  weather: WeatherData;
  ambientSkyConstellations?: boolean;
  onToggleAmbientSkyConstellations?: () => void;
}

export function StarPatternSkyDome({
  weather,
  ambientSkyConstellations = true,
  onToggleAmbientSkyConstellations
}: StarPatternSkyDomeProps) {
  const { theme } = useWeatherTheme();

  // Sidereal time offset in hours (-12 to +12)
  const [hourOffset, setHourOffset] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Layer toggles
  const [showStickLines, setShowStickLines] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showPlanetsAndEcliptic, setShowPlanetsAndEcliptic] = useState<boolean>(true);

  const [selectedConstellationId, setSelectedConstellationId] = useState<string>('orion');

  // Sidereal sky rotation playback
  useEffect(() => {
    if (!isRotating) return;
    let lastTime = performance.now();
    let frameId: number;

    const animate = (now: number) => {
      const dtSec = (now - lastTime) / 1000;
      lastTime = now;
      setHourOffset((prev) => {
        const next = prev + dtSec * 1.2; // 1.2 hours per second
        return next > 12 ? -12 : next;
      });
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isRotating]);

  const effectiveDate = useMemo(() => {
    const baseMs = weather.current.time ? new Date(weather.current.time).getTime() : Date.now();
    const safeBase = isNaN(baseMs) ? Date.now() : baseMs;
    return new Date(safeBase + hourOffset * 3600000);
  }, [weather.current.time, hourOffset]);

  const lstDeg = useMemo(
    () => computeLocalSiderealTimeDeg(effectiveDate, weather.location.longitude),
    [effectiveDate, weather.location.longitude]
  );

  const lstFormatted = useMemo(() => {
    const totalHours = lstDeg / 15;
    const h = Math.floor(totalHours);
    const m = Math.floor((totalHours - h) * 60);
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
  }, [lstDeg]);

  const constellations = useMemo(
    () =>
      computeConstellationsForSky(
        effectiveDate,
        weather.location.latitude,
        weather.location.longitude
      ),
    [effectiveDate, weather.location.latitude, weather.location.longitude]
  );

  const planets = useMemo(
    () =>
      computeSolarSystemState(
        effectiveDate,
        weather.location.latitude,
        weather.location.longitude
      ).filter((p) => p.id !== 'earth'),
    [effectiveDate, weather.location.latitude, weather.location.longitude]
  );

  const eclipticPts = useMemo(
    () =>
      computeEclipticDomePath(
        effectiveDate,
        weather.location.latitude,
        weather.location.longitude
      ),
    [effectiveDate, weather.location.latitude, weather.location.longitude]
  );

  const selectedConstellation: ProjectedConstellation = useMemo(
    () =>
      constellations.find((c) => c.id === selectedConstellationId) || constellations[0],
    [constellations, selectedConstellationId]
  );

  const visibleConstellationsCount = useMemo(
    () => constellations.filter((c) => c.isVisibleAboveHorizon).length,
    [constellations]
  );

  // Convert stereographic (domeX, domeY) where r=1 is horizon (0° alt) into SVG dome coords (cx=260, cy=260, horizonR=218)
  const DOME_CX = 260;
  const DOME_CY = 260;
  const HORIZON_R = 216;

  const toDomeSvg = (domeX: number, domeY: number) => ({
    x: DOME_CX + domeX * HORIZON_R,
    y: DOME_CY + domeY * HORIZON_R
  });

  // Compute isolated Constellation Pattern Blueprint SVG coordinates for the right-side inspector
  const blueprintCoords = useMemo(() => {
    const stars = selectedConstellation.stars;
    if (stars.length === 0) return [];
    // Normalize RA/Dec for the selected constellation
    const ras = stars.map((s) => s.raHours);
    const decs = stars.map((s) => s.decDeg);
    const minRa = Math.min(...ras);
    const maxRa = Math.max(...ras);
    const minDec = Math.min(...decs);
    const maxDec = Math.max(...decs);
    const spanRa = Math.max(0.4, maxRa - minRa);
    const spanDec = Math.max(6, maxDec - minDec);

    return stars.map((s) => {
      const nx = (s.raHours - minRa) / spanRa;
      const ny = (s.decDeg - minDec) / spanDec;
      return {
        ...s,
        bx: 34 + (1 - nx) * 152,
        by: 28 + (1 - ny) * 104
      };
    });
  }, [selectedConstellation]);

  return (
    <div className={`relative rounded-[34px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} p-6 sm:p-8 overflow-hidden space-y-6`}>
      <ThemeCardArtWrapper theme={theme} variant="hero" />
      <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

      {/* Header Row */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} flex items-center justify-center shadow-lg`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-lg font-black ${theme.ui.primaryText} tracking-tight`}>
                Live Star Patterns &amp; Zenith Constellation Dome
              </h2>
              <span className={`text-xs font-mono font-bold ${theme.ui.subheadingText}`}>
                · LST {lstFormatted} · {visibleConstellationsCount}/{constellations.length} Constellations Above Horizon
              </span>
            </div>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              Stereographic planetarium projection for {weather.location.name} ({weather.location.latitude.toFixed(2)}°N, {weather.location.longitude.toFixed(2)}°E)
            </p>
          </div>
        </div>

        {/* Layer & Ambient Sky Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowStickLines(!showStickLines)}
            className={`relative overflow-hidden px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              showStickLines
                ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-sm`
                : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pattern Lines</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLabels(!showLabels)}
            className={`relative overflow-hidden px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              showLabels
                ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-sm`
                : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Star Names</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPlanetsAndEcliptic(!showPlanetsAndEcliptic)}
            className={`relative overflow-hidden px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              showPlanetsAndEcliptic
                ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-sm`
                : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Ecliptic &amp; Planets</span>
          </button>

          {onToggleAmbientSkyConstellations && (
            <button
              type="button"
              onClick={onToggleAmbientSkyConstellations}
              className={`relative overflow-hidden px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                ambientSkyConstellations
                  ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-md`
                  : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
              }`}
              title="Project glowing constellation patterns onto the main background sky canvas"
            >
              <Telescope className="w-3.5 h-3.5" />
              <span>{ambientSkyConstellations ? 'Sky Overlay: ON' : 'Sky Overlay: OFF'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left 7 Cols Stereographic Sky Dome + Right 5 Cols Constellation Pattern Blueprint & Lore */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left 7 Cols: Stereographic Zenith Sky Dome */}
        <div className={`lg:col-span-7 relative rounded-3xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} p-4 sm:p-5 flex flex-col justify-between overflow-hidden`}>
          <ThemeTileArt theme={theme} variant="gauge" index={1} />

          {/* Top Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
            <span className={theme.ui.primaryText}>
              Local Sidereal Sky Dome · Zenith Centered (90° Overhead)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRotating(!isRotating)}
                className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer ${
                  isRotating
                    ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                    : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
                }`}
              >
                {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isRotating ? 'Pause Sky' : 'Rotate Sky'}</span>
              </button>
              {hourOffset !== 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setIsRotating(false);
                    setHourOffset(0);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive SVG Sky Dome */}
          <div className="relative z-10 my-2 flex items-center justify-center">
            <svg
              viewBox="0 0 520 520"
              className="w-full max-w-[460px] aspect-square select-none drop-shadow-[0_0_34px_rgba(99,102,241,0.22)]"
            >
              <defs>
                <radialGradient id="zenith-dome-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="65%" stopColor="#090d24" />
                  <stop offset="100%" stopColor="#020617" />
                </radialGradient>
                <linearGradient id="milky-way-band" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.02" />
                  <stop offset="50%" stopColor="#818cf8" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.02" />
                </linearGradient>
                <clipPath id="horizon-dome-clip">
                  <circle cx={DOME_CX} cy={DOME_CY} r={HORIZON_R} />
                </clipPath>
              </defs>

              {/* Outer Compass Bezel */}
              <circle
                cx={DOME_CX}
                cy={DOME_CY}
                r={HORIZON_R + 18}
                fill="#020617"
                fillOpacity="0.7"
                stroke={theme.accentColors.primary}
                strokeOpacity="0.4"
                strokeWidth="1.5"
              />

              {/* Main Sky Dome Circle */}
              <circle
                cx={DOME_CX}
                cy={DOME_CY}
                r={HORIZON_R}
                fill="url(#zenith-dome-grad)"
                stroke="#38bdf8"
                strokeOpacity="0.6"
                strokeWidth="2"
              />

              {/* Clipped Celestial Interior */}
              <g clipPath="url(#horizon-dome-clip)">
                {/* Milky Way Luminous Band */}
                <ellipse
                  cx={DOME_CX}
                  cy={DOME_CY}
                  rx={HORIZON_R * 1.15}
                  ry={HORIZON_R * 0.34}
                  fill="url(#milky-way-band)"
                  transform={`rotate(${(lstDeg * 0.65) % 360} ${DOME_CX} ${DOME_CY})`}
                />

                {/* Altitude Elevation Rings: 30° and 60° above horizon */}
                <circle
                  cx={DOME_CX}
                  cy={DOME_CY}
                  r={HORIZON_R * Math.tan(((90 - 30) * Math.PI) / 360)}
                  fill="none"
                  stroke="#64748b"
                  strokeOpacity="0.24"
                  strokeDasharray="3 5"
                  strokeWidth="1"
                />
                <circle
                  cx={DOME_CX}
                  cy={DOME_CY}
                  r={HORIZON_R * Math.tan(((90 - 60) * Math.PI) / 360)}
                  fill="none"
                  stroke="#64748b"
                  strokeOpacity="0.24"
                  strokeDasharray="3 5"
                  strokeWidth="1"
                />

                {/* Cardinal Meridian Crosshairs */}
                <line
                  x1={DOME_CX}
                  y1={DOME_CY - HORIZON_R}
                  x2={DOME_CX}
                  y2={DOME_CY + HORIZON_R}
                  stroke="#64748b"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                />
                <line
                  x1={DOME_CX - HORIZON_R}
                  y1={DOME_CY}
                  x2={DOME_CX + HORIZON_R}
                  y2={DOME_CY}
                  stroke="#64748b"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                />

                {/* Ecliptic Plane Curve */}
                {showPlanetsAndEcliptic && (
                  <path
                    d={eclipticPts
                      .filter((pt) => pt.altitudeDeg > -12)
                      .map((pt, i) => {
                        const p = toDomeSvg(pt.domeX, pt.domeY);
                        return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#facc15"
                    strokeOpacity="0.38"
                    strokeDasharray="5 4"
                    strokeWidth="1.5"
                  />
                )}

                {/* Constellations: Stick Lines, Stars & Labels */}
                {constellations.map((constellation) => {
                  const isSelected = constellation.id === selectedConstellation.id;
                  const centerPt = toDomeSvg(
                    constellation.centerDomeX,
                    constellation.centerDomeY
                  );

                  return (
                    <g
                      key={constellation.id}
                      onClick={() => setSelectedConstellationId(constellation.id)}
                      className="cursor-pointer"
                    >
                      {/* Constellation Stick-Figure Lines */}
                      {showStickLines &&
                        constellation.lines.map(([iA, iB], lineIdx) => {
                          const stA = constellation.stars[iA];
                          const stB = constellation.stars[iB];
                          if (!stA || !stB) return null;
                          const ptA = toDomeSvg(stA.domeX, stA.domeY);
                          const ptB = toDomeSvg(stB.domeX, stB.domeY);
                          return (
                            <line
                              key={lineIdx}
                              x1={ptA.x}
                              y1={ptA.y}
                              x2={ptB.x}
                              y2={ptB.y}
                              stroke={isSelected ? '#fde047' : '#38bdf8'}
                              strokeOpacity={isSelected ? 0.92 : 0.48}
                              strokeWidth={isSelected ? 2.1 : 1.15}
                            />
                          );
                        })}

                      {/* Constellation Stars */}
                      {constellation.stars.map((star) => {
                        const pt = toDomeSvg(star.domeX, star.domeY);
                        const r = Math.max(1.8, 4.6 - star.mag * 0.75);
                        return (
                          <g key={star.id}>
                            {star.mag < 1.6 && (
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={r * 2.1}
                                fill={star.spectralColor}
                                opacity={isSelected ? 0.38 : 0.22}
                              />
                            )}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isSelected ? r + 0.7 : r}
                              fill={star.spectralColor}
                              stroke="#ffffff"
                              strokeWidth={isSelected ? 0.8 : 0.3}
                            />
                            {showLabels && (isSelected || star.mag < 1.35) && (
                              <text
                                x={pt.x + r + 3}
                                y={pt.y + 3}
                                fill="#e2e8f0"
                                fontSize="7.8"
                                fontFamily="monospace"
                                opacity={isSelected ? 0.95 : 0.7}
                              >
                                {star.name}
                              </text>
                            )}
                          </g>
                        );
                      })}

                      {/* Constellation Name Label */}
                      {showLabels && (
                        <text
                          x={centerPt.x}
                          y={centerPt.y - 10}
                          fill={isSelected ? '#fde047' : '#93c5fd'}
                          fontSize={isSelected ? '10.5' : '8.8'}
                          fontWeight="900"
                          textAnchor="middle"
                          letterSpacing="0.06em"
                        >
                          {constellation.name.toUpperCase()}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Live Planets Plotted on Sky Dome */}
                {showPlanetsAndEcliptic &&
                  planets
                    .filter((p) => p.altitudeDeg > -5)
                    .map((planet) => {
                      const pt = toDomeSvg(planet.domeX, planet.domeY);
                      return (
                        <g key={`dome-planet-${planet.id}`}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="6.5"
                            fill={planet.color}
                            opacity="0.28"
                          />
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="3.8"
                            fill={planet.color}
                            stroke="#0f172a"
                            strokeWidth="1.2"
                          />
                          <text
                            x={pt.x}
                            y={pt.y - 7}
                            fill={planet.color}
                            fontSize="8.5"
                            fontWeight="bold"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {planet.symbol} {planet.name}
                          </text>
                        </g>
                      );
                    })}

                {/* Zenith Crosshair Marker */}
                <circle
                  cx={DOME_CX}
                  cy={DOME_CY}
                  r="3"
                  fill="none"
                  stroke="#f8fafc"
                  strokeOpacity="0.45"
                  strokeWidth="1"
                />
              </g>

              {/* Cardinal Horizon Compass Labels */}
              <text x={DOME_CX} y={DOME_CY - HORIZON_R - 5} fill="#fde047" fontSize="11" fontWeight="900" textAnchor="middle">
                N · 0°
              </text>
              <text x={DOME_CX + HORIZON_R + 10} y={DOME_CY + 4} fill="#cbd5e1" fontSize="10" fontWeight="800" textAnchor="middle">
                E
              </text>
              <text x={DOME_CX} y={DOME_CY + HORIZON_R + 14} fill="#38bdf8" fontSize="11" fontWeight="900" textAnchor="middle">
                S · 180°
              </text>
              <text x={DOME_CX - HORIZON_R - 10} y={DOME_CY + 4} fill="#cbd5e1" fontSize="10" fontWeight="800" textAnchor="middle">
                W
              </text>
            </svg>
          </div>

          {/* Sidereal Time Scrubber (-12h to +12h) */}
          <div className="relative z-10 pt-3 border-t border-white/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className={theme.ui.secondaryText}>
                Sidereal Sky Rotation Scrubber (-12h to +12h)
              </span>
              <span className={`font-mono ${theme.ui.subheadingText}`}>
                {hourOffset === 0
                  ? 'Live Local Sky'
                  : `${hourOffset > 0 ? '+' : ''}${hourOffset.toFixed(1)}h Sidereal Shift`}
              </span>
            </div>
            <input
              type="range"
              min={-12}
              max={12}
              step={0.25}
              value={hourOffset}
              onChange={(e) => {
                setIsRotating(false);
                setHourOffset(Number(e.target.value));
              }}
              aria-label="Sidereal Sky Rotation Scrubber"
              className="w-full accent-sky-400 cursor-pointer h-2 rounded-lg"
            />
          </div>
        </div>

        {/* Right 5 Cols: Constellation Pattern Blueprint & Star Catalog Inspector */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          
          {/* 12-Constellation Selector Grid */}
          <div className="grid grid-cols-3 gap-2">
            {constellations.map((c, idx) => {
              const active = c.id === selectedConstellation.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedConstellationId(c.id)}
                  className={`relative overflow-hidden px-2.5 py-2 rounded-2xl text-left transition-all cursor-pointer ${
                    active
                      ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-md scale-[1.02]`
                      : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
                  }`}
                >
                  {!active && <ThemeTileArt theme={theme} variant="pill" index={idx % 6} />}
                  <span className="relative z-10 text-xs font-black truncate block">
                    {c.name}
                  </span>
                  <span className="relative z-10 text-[10px] font-mono opacity-80 block">
                    {c.isVisibleAboveHorizon
                      ? `Alt ${Math.max(1, Math.round(c.centerAltitudeDeg))}° ${c.compassDir}`
                      : 'Below Horz'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Constellation Blueprint & Deep-Sky Lore Card */}
          <div className={`relative flex-1 rounded-3xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} p-5 overflow-hidden flex flex-col justify-between gap-4`}>
            <ThemeTileArt theme={theme} variant="gauge" index={3} />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div>
                <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${theme.ui.subheadingText} block`}>
                  {selectedConstellation.season} · {selectedConstellation.isVisibleAboveHorizon ? `Above ${weather.location.name} Horizon` : 'Currently Below Horizon'}
                </span>
                <h3 className={`text-xl font-black ${theme.ui.primaryText} tracking-tight`}>
                  {selectedConstellation.name} — {selectedConstellation.title}
                </h3>
              </div>
              <span className={`text-xs font-mono font-black ${theme.ui.accentText} shrink-0`}>
                {selectedConstellation.compassDir} · {selectedConstellation.centerAltitudeDeg}°
              </span>
            </div>

            {/* Close-Up Star Pattern Blueprint SVG */}
            <div className="relative z-10 rounded-2xl bg-slate-950/85 border border-sky-400/30 p-3 flex items-center justify-center">
              <svg viewBox="0 0 220 160" className="w-full h-36 select-none">
                {/* Subtle Blueprint Grid Lines */}
                <line x1="0" y1="80" x2="220" y2="80" stroke="#38bdf8" strokeOpacity="0.12" strokeDasharray="2 4" />
                <line x1="110" y1="0" x2="110" y2="160" stroke="#38bdf8" strokeOpacity="0.12" strokeDasharray="2 4" />

                {/* Stick Lines */}
                {selectedConstellation.lines.map(([iA, iB], idx) => {
                  const a = blueprintCoords[iA];
                  const b = blueprintCoords[iB];
                  if (!a || !b) return null;
                  return (
                    <line
                      key={idx}
                      x1={a.bx}
                      y1={a.by}
                      x2={b.bx}
                      y2={b.by}
                      stroke="#38bdf8"
                      strokeWidth="1.8"
                      strokeOpacity="0.85"
                    />
                  );
                })}

                {/* Stars & Bayer Names */}
                {blueprintCoords.map((st) => {
                  const r = Math.max(2.6, 5.5 - st.mag * 0.8);
                  return (
                    <g key={st.id}>
                      <circle cx={st.bx} cy={st.by} r={r * 2.2} fill={st.spectralColor} opacity="0.28" />
                      <circle cx={st.bx} cy={st.by} r={r} fill={st.spectralColor} stroke="#ffffff" strokeWidth="0.8" />
                      <text
                        x={st.bx}
                        y={st.by - r - 4}
                        fill="#f8fafc"
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {st.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Mythology & Deep-Sky Object */}
            <div className="relative z-10 space-y-2 text-xs">
              <p className={`font-medium leading-relaxed ${theme.ui.secondaryText}`}>
                {selectedConstellation.mythology}
              </p>
              <div className={`p-3 rounded-2xl border ${theme.ui.dividerBorder} flex items-center gap-2.5`}>
                <Eye className={`w-4 h-4 ${theme.ui.accentText} shrink-0`} />
                <div>
                  <span className={`text-[10px] font-bold uppercase ${theme.ui.secondaryText} block`}>
                    Signature Deep-Sky Object
                  </span>
                  <span className={`text-xs font-black ${theme.ui.primaryText}`}>
                    {selectedConstellation.deepSkyObject}
                  </span>
                </div>
              </div>
            </div>

            {/* Principal Stars Table */}
            <div className="relative z-10 space-y-1.5">
              <span className={`text-[10px] font-mono font-black uppercase tracking-wider ${theme.ui.subheadingText} block`}>
                Primary Stars &amp; Spectral Telemetry
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {selectedConstellation.stars.slice(0, 4).map((st) => (
                  <div
                    key={st.id}
                    className={`px-2.5 py-1.5 rounded-xl border ${theme.ui.dividerBorder} flex items-center justify-between text-[11px]`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: st.spectralColor }}
                      />
                      <span className={`font-black truncate ${theme.ui.primaryText}`}>
                        {st.name}
                      </span>
                    </div>
                    <span className={`font-mono text-[10px] ${theme.ui.secondaryText} shrink-0`}>
                      {st.Bayer} · m{st.mag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
