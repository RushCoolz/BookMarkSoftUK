import React from 'react';
import { decodeWmoCode } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';

interface WeatherOrb3DProps {
  weatherCode: number;
  isDay?: number;
  className?: string;
}

export function WeatherOrb3D({ weatherCode, isDay = 1, className = '' }: WeatherOrb3DProps) {
  const wmo = decodeWmoCode(weatherCode, isDay);
  const category = wmo.category;
  const { theme } = useWeatherTheme();

  const currentHour = new Date().getHours();
  const isSunset = currentHour >= 16 && currentHour <= 20;

  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      
      {/* Dynamic Theme Atmospheric Ambient Halo */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 rounded-full blur-3xl opacity-80 animate-pulse-halo"
        style={{
          background: category === 'clear' 
            ? isDay 
              ? isSunset 
                ? `radial-gradient(circle, ${theme.accentColors.secondary} 0%, ${theme.accentColors.primary} 45%, rgba(216,180,254,0.3) 70%, transparent 90%)`
                : `radial-gradient(circle, ${theme.skyPalette.dayBottom} 0%, ${theme.accentColors.secondary} 45%, ${theme.skyPalette.dayMid} 75%, transparent 90%)`
              : `radial-gradient(circle, ${theme.skyPalette.nightBottom} 0%, ${theme.accentColors.primary} 50%, rgba(15,23,42,0.8) 85%, transparent 95%)`
            : category === 'rain' || category === 'thunderstorm'
            ? `radial-gradient(circle, ${theme.skyPalette.dayMid} 0%, ${theme.accentColors.primary} 50%, transparent 85%)`
            : `radial-gradient(circle, ${theme.skyPalette.sunsetMid} 0%, ${theme.accentColors.secondary} 50%, transparent 85%)`
        }}
      />

      {/* Exquisite Celestial Astrolabe & Pure Geometric Relic SVG (No Letters or Text) */}
      <svg 
        viewBox="0 0 260 260" 
        className="w-48 h-48 sm:w-56 sm:h-56 drop-shadow-[0_20px_45px_rgba(251,146,60,0.35)] relative z-10"
      >
        <defs>
          {/* Tactile 3D Soft Clay / Glass Specular Filter */}
          <filter id="celestialSpecular3D" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4.5" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="6.5" specularConstant="1.8" specularExponent="22" lightingColor="#ffffff" result="specular">
              <fePointLight x="-50" y="-80" z="260" />
            </feSpecularLighting>
            <feComposite in="specular" in2="SourceAlpha" operator="in" result="specular" />
            <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>

          {/* Golden Astrolabe Ring Gradient */}
          <linearGradient id="orbGoldAstrolabe" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor={theme.accentColors.secondary} />
            <stop offset="100%" stopColor={theme.accentColors.primary} />
          </linearGradient>

          {/* Sun Sphere Gradient */}
          <radialGradient id="orbSunGrad" cx="32%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="58%" stopColor={theme.accentColors.secondary} />
            <stop offset="85%" stopColor={theme.accentColors.primary} />
            <stop offset="100%" stopColor="#ea580c" />
          </radialGradient>

          {/* Sunset Horizon Gradient */}
          <radialGradient id="orbSunsetGrad" cx="30%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="25%" stopColor="#fda4af" />
            <stop offset="58%" stopColor="#fb923c" />
            <stop offset="88%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#7c3aed" />
          </radialGradient>

          {/* Volumetric Layered Cloud Gradient */}
          <radialGradient id="orbCloudGrad" cx="35%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fdf4ff" />
            <stop offset="80%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </radialGradient>

          {/* Rain Pearl Gradient */}
          <radialGradient id="orbWaterPearlGrad" cx="32%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#bae6fd" />
            <stop offset="75%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </radialGradient>

          {/* Floating Petal Gradient */}
          <linearGradient id="orbPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#fbcfe8" />
            <stop offset="85%" stopColor={theme.accentColors.primary} />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>

          {/* Moon Gradient */}
          <radialGradient id="orbMoonGrad" cx="30%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#fef9c3" />
            <stop offset="68%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
        </defs>

        {/* ========================================================= */}
        {/* LAYER 1: OUTER ROTATING CELESTIAL ASTROLABE RINGS (NO TEXT) */}
        {/* ========================================================= */}
        <g className="animate-[spin_45s_linear_infinite] origin-center opacity-75">
          {/* Outer astronomical compass ring */}
          <circle cx="130" cy="130" r="118" fill="none" stroke="url(#orbGoldAstrolabe)" strokeWidth="1.6" strokeDasharray="6 4 18 4" />
          <circle cx="130" cy="130" r="112" fill="none" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" />
          
          {/* Pure Celestial Geometric Markers (Replacing any words/letters) */}
          <polygon points="130,12 133,18 130,24 127,18" fill="url(#orbGoldAstrolabe)" />
          <polygon points="248,130 242,133 236,130 242,127" fill="url(#orbGoldAstrolabe)" />
          <polygon points="130,248 133,242 130,236 127,242" fill="url(#orbGoldAstrolabe)" />
          <polygon points="12,130 18,133 24,130 18,127" fill="url(#orbGoldAstrolabe)" />
        </g>

        {/* Counter-rotating Inner Astronomical Degree Ring */}
        <g className="animate-[spin_32s_linear_infinite_reverse] origin-center opacity-60">
          <circle cx="130" cy="130" r="98" fill="none" stroke="url(#orbGoldAstrolabe)" strokeWidth="1.2" strokeDasharray="3 8" />
          <circle cx="130" cy="130" r="94" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
          {/* Astronomical Cardinal Nodes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <circle 
              key={i} 
              cx={130 + 96 * Math.cos((deg * Math.PI) / 180)} 
              cy={130 + 96 * Math.sin((deg * Math.PI) / 180)} 
              r={i % 2 === 0 ? "2.6" : "1.8"} 
              fill="#fde047" 
            />
          ))}
        </g>

        {/* Anamorphic Horizontal Lens Flare Streaks */}
        <ellipse cx="130" cy="130" rx="122" ry="3.5" fill="url(#orbGoldAstrolabe)" opacity="0.45" filter="blur(1px)" />

        {/* ========================================================= */}
        {/* LAYER 2: SCENARIO-SPECIFIC WEATHER TALISMAN SCULPTURE     */}
        {/* ========================================================= */}
        
        {/* 1. SCENARIO: SUNNY / CLEAR DAY - Radiant Sun with Petal Rays */}
        {category === 'clear' && isDay && (
          <g className="animate-float-soft">
            {/* Sun Rays - Radiant Petal Beams */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <g key={i} transform={`rotate(${angle} 130 130)`}>
                <ellipse 
                  cx="130" 
                  cy="54" 
                  rx={i % 2 === 0 ? 10 : 6} 
                  ry={i % 2 === 0 ? 22 : 14} 
                  fill={isSunset ? "#fb7185" : "#fde047"} 
                  filter="url(#celestialSpecular3D)"
                  opacity={i % 2 === 0 ? 0.95 : 0.75}
                />
              </g>
            ))}

            {/* Radiant Sun Core Sphere */}
            <circle 
              cx="130" 
              cy="130" 
              r="54" 
              fill={isSunset ? "url(#orbSunsetGrad)" : "url(#orbSunGrad)"} 
              filter="url(#celestialSpecular3D)"
            />

            {/* Glowing Corona Rim */}
            <circle cx="130" cy="130" r="54" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.65" />

            {/* Rosy Cheeks */}
            <circle cx="108" cy="142" r="7" fill="#f43f5e" opacity="0.4" filter="blur(2.5px)" />
            <circle cx="152" cy="142" r="7" fill="#f43f5e" opacity="0.4" filter="blur(2.5px)" />

            {/* Sparkle Glints (High-contrast reflections) */}
            <circle cx="112" cy="110" r="6" fill="#ffffff" opacity="0.95" />
            <circle cx="122" cy="102" r="3" fill="#ffffff" opacity="0.85" />
          </g>
        )}

        {/* 2. SCENARIO: CLEAR NIGHT - Crescent Moon with Starlight Glints */}
        {category === 'clear' && !isDay && (
          <g className="animate-float-soft">
            <path 
              d="M 160 55 A 66 66 0 1 0 160 205 A 54 54 0 1 1 160 55 Z" 
              fill="url(#orbMoonGrad)"
              filter="url(#celestialSpecular3D)"
            />
            <circle cx="104" cy="136" r="8" fill="#fb7185" opacity="0.35" filter="blur(3px)" />

            {/* Orbiting Starlight Crystals */}
            <polygon points="180,80 184,92 196,94 186,102 188,114 180,107 172,114 174,102 164,94 176,92" fill="#fef08a" filter="url(#celestialSpecular3D)" />
            <polygon points="76,74 79,82 87,83 81,89 83,97 76,92 69,97 71,89 65,83 73,82" fill="#e9d5ff" filter="url(#celestialSpecular3D)" />
            <polygon points="186,158 189,165 197,166 191,172 193,180 186,175 179,180 181,172 175,166 183,165" fill="#bae6fd" filter="url(#celestialSpecular3D)" />
          </g>
        )}

        {/* 3. SCENARIO: PARTLY CLOUDY / OVERCAST - Towering Cumulonimbus */}
        {(category === 'partly-cloudy' || category === 'cloudy') && (
          <g className="animate-float-soft">
            <circle cx="170" cy="94" r="42" fill={isSunset ? "url(#orbSunsetGrad)" : "url(#orbSunGrad)"} filter="url(#celestialSpecular3D)" />
            <circle cx="82" cy="154" r="40" fill="url(#orbCloudGrad)" filter="url(#celestialSpecular3D)" />
            <circle cx="126" cy="122" r="48" fill="url(#orbCloudGrad)" filter="url(#celestialSpecular3D)" />
            <circle cx="172" cy="148" r="42" fill="url(#orbCloudGrad)" filter="url(#celestialSpecular3D)" />
            <circle cx="132" cy="166" r="38" fill="url(#orbCloudGrad)" filter="url(#celestialSpecular3D)" />

            <circle cx="96" cy="160" r="7" fill="#f43f5e" opacity="0.3" filter="blur(2.5px)" />
            <circle cx="156" cy="160" r="7" fill="#f43f5e" opacity="0.3" filter="blur(2.5px)" />
          </g>
        )}

        {/* 4. SCENARIO: RAIN / DRIZZLE / THUNDERSTORM - Water Pearls & Lightning */}
        {(category === 'rain' || category === 'drizzle' || category === 'thunderstorm') && (
          <g className="animate-float-soft">
            <circle cx="82" cy="114" r="38" fill="url(#orbCloudGrad)" filter="url(#celestialSpecular3D)" />
            <circle cx="126" cy="86" r="48" fill="url(#orbCloudGrad)" filter="url(#celestialSpecular3D)" />
            <circle cx="172" cy="110" r="42" fill="url(#orbCloudGrad)" filter="url(#celestialSpecular3D)" />
            <circle cx="132" cy="130" r="38" fill="url(#orbCloudGrad)" filter="url(#celestialSpecular3D)" />

            {/* Luminous Crystalline Water Pearls */}
            <g transform="translate(80, 168)">
              <path d="M 0 -15 C 8 -4 10 5 0 13 C -10 5 -8 -4 0 -15 Z" fill="url(#orbWaterPearlGrad)" filter="url(#celestialSpecular3D)" />
            </g>
            <g transform="translate(130, 178)">
              <path d="M 0 -15 C 8 -4 10 5 0 13 C -10 5 -8 -4 0 -15 Z" fill="url(#orbWaterPearlGrad)" filter="url(#celestialSpecular3D)" />
            </g>
            <g transform="translate(180, 168)">
              <path d="M 0 -15 C 8 -4 10 5 0 13 C -10 5 -8 -4 0 -15 Z" fill="url(#orbWaterPearlGrad)" filter="url(#celestialSpecular3D)" />
            </g>

            {category === 'thunderstorm' && (
              <polygon 
                points="126,140 114,166 128,166 116,196 144,160 130,160" 
                fill="#fde047" 
                filter="url(#celestialSpecular3D)" 
              />
            )}
          </g>
        )}

        {/* 5. SCENARIO: SNOW - Crystalline Snow Gems */}
        {category === 'snow' && (
          <g className="animate-float-soft">
            <circle cx="82" cy="116" r="38" fill="url(#orbCloudGrad)" filter="url(#celestialSpecular3D)" />
            <circle cx="126" cy="88" r="48" fill="url(#orbCloudGrad)" filter="url(#celestialSpecular3D)" />
            <circle cx="172" cy="112" r="42" fill="url(#orbCloudGrad)" filter="url(#celestialSpecular3D)" />

            <circle cx="88" cy="172" r="9" fill="#ffffff" filter="url(#celestialSpecular3D)" />
            <circle cx="130" cy="182" r="11" fill="#ffffff" filter="url(#celestialSpecular3D)" />
            <circle cx="172" cy="172" r="9" fill="#ffffff" filter="url(#celestialSpecular3D)" />
          </g>
        )}

        {/* ========================================================= */}
        {/* LAYER 3: FLOATING SAKURA PETALS & PRISMATIC 4-POINT STARS */}
        {/* ========================================================= */}
        <g transform="translate(48, 86) rotate(-24)">
          <path d="M 0 0 C -6 -10 6 -16 12 -6 C 14 2 6 8 0 0 Z" fill="url(#orbPetalGrad)" opacity="0.95" />
        </g>
        <g transform="translate(204, 180) rotate(36)">
          <path d="M 0 0 C -6 -10 6 -16 12 -6 C 14 2 6 8 0 0 Z" fill="url(#orbPetalGrad)" opacity="0.9" />
        </g>

        {/* Prismatic 4-Point Sparkle Stars (✨) */}
        <g transform="translate(46, 175) scale(0.85)">
          <path d="M 0 -12 Q 0 0 12 0 Q 0 0 0 12 Q 0 0 -12 0 Q 0 0 0 -12 Z" fill="#ffffff" />
          <circle cx="0" cy="0" r="3" fill="#fef08a" />
        </g>
        <g transform="translate(206, 68) scale(0.95)">
          <path d="M 0 -12 Q 0 0 12 0 Q 0 0 0 12 Q 0 0 -12 0 Q 0 0 0 -12 Z" fill="#ffffff" />
          <circle cx="0" cy="0" r="3.5" fill="#bae6fd" />
        </g>
      </svg>
    </div>
  );
}
