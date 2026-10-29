import React from 'react';
import { WeatherThemeConfig, WeatherThemeId } from '../../types/weatherTheme';

export type CardArtVariant = 'hero' | 'standard' | 'hourly' | 'chart' | 'daily' | 'launcher' | 'compact';
export type TileArtVariant = 'pill' | 'row' | 'metric' | 'gauge' | 'banner';

interface ThemeCardArtWrapperProps {
  theme: WeatherThemeConfig;
  variant?: CardArtVariant;
  showCornerFiligrees?: boolean;
  className?: string;
}

interface ThemeTileArtProps {
  theme: WeatherThemeConfig;
  variant?: TileArtVariant;
  index?: number;
  active?: boolean;
  className?: string;
}

/**
 * ThemeCardArtWrapper
 * Renders rich, full-color, multi-layered illustrated scenes across main cards
 * with ZERO white or grey scrims. Every card is a vibrant painted canvas
 * customized to the active theme and card role.
 */
export function ThemeCardArtWrapper({
  theme,
  variant = 'standard',
  showCornerFiligrees = true,
  className = ''
}: ThemeCardArtWrapperProps) {
  const themeId = theme.id;

  // Theme-native colorful atmospheric depth glow (Zero white, zero slate/grey)
  const themeVignetteByTheme: Record<WeatherThemeId, string> = {
    shinkai: 'from-[#ff9ec7]/45 via-[#ffc4ad]/20 to-[#818cf8]/30 dark:from-[#1b0b38]/70 dark:via-[#421047]/35 dark:to-[#1e1b4b]/50',
    ghibli: 'from-[#6ee7b7]/45 via-[#bae6fd]/20 to-[#fef08a]/35 dark:from-[#04261e]/70 dark:via-[#083d30]/35 dark:to-[#072a36]/50',
    'golden-hour': 'from-[#fbbf24]/45 via-[#fda4af]/25 to-[#fed7aa]/35 dark:from-[#2b0c05]/70 dark:via-[#4a141f]/35 dark:to-[#240a1f]/50',
    'cyber-aurora': 'from-[#67e8f9]/40 via-[#c4b5fd]/25 to-[#6ee7b7]/35 dark:from-[#081136]/70 dark:via-[#1e104a]/35 dark:to-[#062936]/50',
    'alpine-frost': 'from-[#7dd3fc]/45 via-[#c7d2fe]/25 to-[#fbcfe8]/35 dark:from-[#061836]/70 dark:via-[#0d2b59]/35 dark:to-[#19174f]/50',
    'celestial-noir': 'from-[#c084fc]/45 via-[#f5d0fe]/25 to-[#fde68a]/35 dark:from-[#140529]/75 dark:via-[#2b0a4a]/40 dark:to-[#120733]/55'
  };

  return (
    <div 
      aria-hidden="true" 
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] z-0 select-none ${className}`}
    >
      {/* 1. Full-Color Theme-Specific Scenic Vector Artwork */}
      {themeId === 'shinkai' && <ShinkaiSkyArtwork variant={variant} />}
      {themeId === 'ghibli' && <GhibliMeadowArtwork variant={variant} />}
      {themeId === 'golden-hour' && <GoldenHourArtwork variant={variant} />}
      {themeId === 'cyber-aurora' && <CyberAuroraArtwork variant={variant} />}
      {themeId === 'alpine-frost' && <AlpineFrostArtwork variant={variant} />}
      {themeId === 'celestial-noir' && <CelestialNoirArtwork variant={variant} />}

      {/* 2. Rich Theme-Tinted Color Depth Wash (Zero white, zero grey) */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t ${themeVignetteByTheme[themeId]}`}
      />

      {/* 3. Luminous Top & Bottom Inner Color Aura */}
      <div 
        className="absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow: `inset 0 1px 24px ${theme.accentColors.glow}, inset 0 -12px 32px ${theme.accentColors.glow}`
        }}
      />

      {/* 4. Bespoke Thematic Corner Filigrees */}
      {showCornerFiligrees && (
        <ArtisanCornerFiligrees 
          themeId={themeId} 
          primaryColor={theme.accentColors.primary} 
          secondaryColor={theme.accentColors.secondary} 
        />
      )}
    </div>
  );
}

/**
 * ThemeTileArt
 * Renders custom miniature thematic illustrations, scenic horizon motifs,
 * and rich jewel/pastel washes inside every small inner tile (hourly slots,
 * daily rows, wind/pressure gauges, AQI metrics, transit & wardrobe tiles).
 */
export function ThemeTileArt({
  theme,
  variant = 'metric',
  index = 0,
  active = false,
  className = ''
}: ThemeTileArtProps) {
  const themeId = theme.id;
  const flipX = index % 2 === 1;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] z-0 select-none ${className}`}
    >
      <svg
        viewBox="0 0 240 140"
        preserveAspectRatio="none"
        className={`w-full h-full transition-transform duration-500 ${flipX ? 'scale-x-[-1]' : ''} ${active ? 'opacity-95' : 'opacity-80 group-hover:opacity-95'}`}
      >
        {themeId === 'shinkai' && (
          <>
            <defs>
              <linearGradient id={`shinkaiTileSky-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.28" />
                <stop offset="50%" stopColor="#fb923c" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.32" />
              </linearGradient>
              <linearGradient id={`shinkaiTileCloud-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffe4e6" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#fda4af" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <rect width="240" height="140" fill={`url(#shinkaiTileSky-${index})`} />
            {/* Diagonal golden-pink sunbeam */}
            <polygon points="150,0 210,0 130,140 70,140" fill="#fde047" opacity="0.18" />
            {/* Painted anime cloud crest along base */}
            <circle cx="45" cy="122" r="32" fill={`url(#shinkaiTileCloud-${index})`} />
            <circle cx="95" cy="128" r="28" fill={`url(#shinkaiTileCloud-${index})`} />
            <circle cx="195" cy="118" r="36" fill={`url(#shinkaiTileCloud-${index})`} />
            <path d="M 0,115 Q 60,92 125,112 T 240,104 L 240,140 L 0,140 Z" fill="#9d174d" opacity="0.22" />
            {/* Floating sakura petals */}
            <path d="M 28,24 C 33,18 42,24 36,31 C 30,37 22,30 28,24 Z" fill="#fb7185" opacity="0.65" />
            <path d="M 198,28 C 202,22 210,28 205,34 C 200,39 193,33 198,28 Z" fill="#fda4af" opacity="0.7" />
            <path d="M 155,48 C 158,44 164,48 160,53 C 156,57 151,52 155,48 Z" fill="#fde047" opacity="0.55" />
            {/* 4-point twilight star glint */}
            <path d="M 212,18 Q 212,24 218,24 Q 212,24 212,30 Q 212,24 206,24 Q 212,24 212,18 Z" fill="#fef08a" opacity="0.8" />
          </>
        )}

        {themeId === 'ghibli' && (
          <>
            <defs>
              <linearGradient id={`ghibliTileSky-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.26" />
                <stop offset="55%" stopColor="#34d399" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#fde047" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <rect width="240" height="140" fill={`url(#ghibliTileSky-${index})`} />
            {/* Sunlit orb glow */}
            <circle cx="205" cy="26" r="24" fill="#fef08a" opacity="0.45" />
            {/* Fluffy cumulus puff */}
            <circle cx="52" cy="36" r="18" fill="#fef9c3" opacity="0.4" />
            <circle cx="72" cy="32" r="22" fill="#fef9c3" opacity="0.45" />
            {/* Rolling emerald meadow hills at bottom */}
            <path d="M 0,106 Q 65,82 140,104 T 240,94 L 240,140 L 0,140 Z" fill="#10b981" opacity="0.32" />
            <path d="M 0,118 Q 85,100 175,116 T 240,108 L 240,140 L 0,140 Z" fill="#059669" opacity="0.35" />
            {/* Dandelion fluff seeds */}
            <circle cx="38" cy="32" r="2.5" fill="#fef08a" opacity="0.85" />
            <line x1="38" y1="32" x2="43" y2="39" stroke="#fef08a" strokeWidth="1.2" opacity="0.75" />
            <circle cx="168" cy="44" r="2.5" fill="#fef08a" opacity="0.85" />
            <line x1="168" y1="44" x2="173" y2="51" stroke="#fef08a" strokeWidth="1.2" opacity="0.75" />
          </>
        )}

        {themeId === 'golden-hour' && (
          <>
            <defs>
              <linearGradient id={`goldenTileSky-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.32" />
                <stop offset="55%" stopColor="#f97316" stopOpacity="0.26" />
                <stop offset="100%" stopColor="#e11d48" stopOpacity="0.28" />
              </linearGradient>
            </defs>
            <rect width="240" height="140" fill={`url(#goldenTileSky-${index})`} />
            {/* Warm golden sun halo & rays */}
            <circle cx="195" cy="32" r="34" fill="#fde047" opacity="0.35" />
            <circle cx="195" cy="32" r="16" fill="#fef08a" opacity="0.55" />
            <polygon points="195,32 90,0 130,0" fill="#fef08a" opacity="0.2" />
            <polygon points="195,32 0,60 0,95" fill="#fed7aa" opacity="0.18" />
            {/* Warm amber ridge waves */}
            <path d="M 0,104 Q 70,84 150,102 T 240,92 L 240,140 L 0,140 Z" fill="#d97706" opacity="0.32" />
            <path d="M 0,118 Q 95,102 180,118 T 240,110 L 240,140 L 0,140 Z" fill="#9a3412" opacity="0.34" />
            {/* Floating gold dust motes */}
            <circle cx="48" cy="28" r="2.5" fill="#fef08a" opacity="0.8" />
            <circle cx="115" cy="42" r="2" fill="#fde047" opacity="0.75" />
            <circle cx="148" cy="22" r="3" fill="#fef08a" opacity="0.8" />
          </>
        )}

        {themeId === 'cyber-aurora' && (
          <>
            <defs>
              <linearGradient id={`cyberTileSky-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.28" />
              </linearGradient>
              <linearGradient id={`cyberRibbon-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.45" />
              </linearGradient>
            </defs>
            <rect width="240" height="140" fill={`url(#cyberTileSky-${index})`} />
            {/* Sweeping boreal ribbon */}
            <path d="M 0,28 Q 75,4 150,32 T 240,20 L 240,56 Q 150,68 75,42 T 0,58 Z" fill={`url(#cyberRibbon-${index})`} />
            {/* Faceted arctic ridge */}
            <polygon points="0,140 0,110 55,88 115,114 175,84 240,108 240,140" fill="#311068" opacity="0.35" />
            <polyline points="0,110 55,88 115,114 175,84 240,108" fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.55" />
            {/* Starlight glints */}
            <circle cx="34" cy="20" r="1.8" fill="#a5f3fc" opacity="0.9" />
            <circle cx="196" cy="18" r="2.2" fill="#6ee7b7" opacity="0.9" />
          </>
        )}

        {themeId === 'alpine-frost' && (
          <>
            <defs>
              <linearGradient id={`alpineTileSky-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="55%" stopColor="#818cf8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f472b6" stopOpacity="0.28" />
              </linearGradient>
            </defs>
            <rect width="240" height="140" fill={`url(#alpineTileSky-${index})`} />
            {/* Soaring crystalline mountain peaks */}
            <polygon points="10,140 75,72 140,140" fill="#7dd3fc" opacity="0.4" />
            <polygon points="95,140 170,64 235,140" fill="#38bdf8" opacity="0.38" />
            <polygon points="-10,140 40,92 95,140" fill="#6366f1" opacity="0.3" />
            {/* Snowflake crystal motif */}
            <g transform="translate(204, 28)" stroke="#bae6fd" strokeWidth="1.4" opacity="0.8">
              <line x1="-7" y1="0" x2="7" y2="0" />
              <line x1="0" y1="-7" x2="0" y2="7" />
              <line x1="-5" y1="-5" x2="5" y2="5" />
              <line x1="-5" y1="5" x2="5" y2="-5" />
            </g>
            <circle cx="48" cy="26" r="2" fill="#e0f2fe" opacity="0.85" />
          </>
        )}

        {themeId === 'celestial-noir' && (
          <>
            <defs>
              <linearGradient id={`noirTileSky-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.32" />
                <stop offset="55%" stopColor="#ec4899" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.28" />
              </linearGradient>
            </defs>
            <rect width="240" height="140" fill={`url(#noirTileSky-${index})`} />
            {/* Golden astrolabe orbital arcs */}
            <circle cx="200" cy="30" r="48" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.45" />
            <circle cx="200" cy="30" r="28" fill="none" stroke="#f472b6" strokeWidth="1" opacity="0.4" />
            {/* Cosmic nebula horizon wave */}
            <path d="M 0,108 Q 80,86 160,108 T 240,96 L 240,140 L 0,140 Z" fill="#7e22ce" opacity="0.32" />
            {/* 4-point supernova stars */}
            <path d="M 200,20 Q 200,30 210,30 Q 200,30 200,40 Q 200,30 190,30 Q 200,30 200,20 Z" fill="#fde047" opacity="0.85" />
            <path d="M 42,24 Q 42,30 48,30 Q 42,30 42,36 Q 42,30 36,30 Q 42,30 42,24 Z" fill="#f5d0fe" opacity="0.8" />
          </>
        )}
      </svg>

      {/* Subtle Top Specular Highlight Bar */}
      <div className={`absolute inset-x-0 top-0 h-[1px] ${theme.ui.cardHighlight} opacity-75`} />
    </div>
  );
}

/**
 * 1. Shinkai Twilight: Towering Anime Cumulonimbus, Burning Sunset Horizon, Sakura Petals
 */
function ShinkaiSkyArtwork({ variant }: { variant: CardArtVariant }) {
  const isHero = variant === 'hero';
  return (
    <div className="absolute inset-0 opacity-85 dark:opacity-85">
      <svg 
        viewBox="0 0 1200 600" 
        preserveAspectRatio="xMidYMid slice" 
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="shinkaiSky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338ca" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#ec4899" stopOpacity="0.55" />
            <stop offset="75%" stopColor="#fb7185" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe4e6" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#fbcfe8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#fda4af" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#e11d48" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* Rich Sky Wash */}
        <rect width="1200" height="600" fill="url(#shinkaiSky)" />

        {/* Glowing Twilight Sun & Comet Trail */}
        <circle cx={isHero ? "920" : "980"} cy="140" r="95" fill="#fde047" opacity="0.45" filter="blur(12px)" />
        <circle cx={isHero ? "920" : "980"} cy="140" r="48" fill="#fef08a" opacity="0.75" />
        <line x1="180" y1="40" x2="540" y2="190" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
        <circle cx="540" cy="190" r="5" fill="#fef08a" opacity="0.9" />

        {/* Diagonal anime sunbeam flares */}
        <g opacity="0.35">
          <polygon points="600,0 680,600 790,600 630,0" fill="#fef08a" />
          <polygon points="480,0 320,600 430,600 520,0" fill="#fed7aa" />
          <polygon points="760,0 960,600 1050,600 810,0" fill="#fbcfe8" />
        </g>

        {/* Towering painted cumulonimbus anime cloud formation */}
        <g fill="url(#cloudGrad1)">
          <circle cx="850" cy="210" r="115" />
          <circle cx="960" cy="240" r="135" />
          <circle cx="750" cy="260" r="98" />
          <circle cx="1070" cy="290" r="115" />
          <path d="M 650,330 Q 850,230 1020,310 T 1200,340 L 1200,600 L 620,600 Z" />
        </g>

        {/* Second cloud cluster on left */}
        <g fill="url(#cloudGrad2)">
          <circle cx="210" cy="220" r="95" />
          <circle cx="310" cy="245" r="110" />
          <circle cx="120" cy="265" r="85" />
          <path d="M 40,320 Q 220,250 390,330 L 440,600 L 0,600 Z" />
        </g>

        {/* Distant violet-magenta mountain ridge silhouette */}
        <path 
          d="M 0,450 L 180,380 L 340,435 L 520,360 L 710,425 L 920,350 L 1080,415 L 1200,370 L 1200,600 L 0,600 Z" 
          fill="#6d28d9" 
          opacity="0.45" 
        />
        <path 
          d="M 0,500 L 140,450 L 310,490 L 490,440 L 680,495 L 890,445 L 1050,480 L 1200,440 L 1200,600 L 0,600 Z" 
          fill="#831843" 
          opacity="0.45" 
        />

        {/* Drifting Sakura Blossoms / Petals */}
        <g fill="#fb7185" opacity="0.85">
          <path d="M 240,120 C 248,112 262,122 254,132 C 246,142 232,130 240,120 Z" transform="rotate(15 240 120)" />
          <path d="M 480,90 C 488,82 502,92 494,102 C 486,112 472,100 480,90 Z" transform="rotate(-25 480 90)" />
          <path d="M 720,150 C 728,142 742,152 734,162 C 726,172 712,160 720,150 Z" transform="rotate(40 720 150)" />
          <path d="M 380,260 C 388,252 402,262 394,272 C 386,282 372,270 380,260 Z" transform="rotate(-10 380 260)" />
          <path d="M 880,110 C 888,102 902,112 894,122 C 886,132 872,120 880,110 Z" transform="rotate(20 880 110)" />
          <path d="M 1040,180 C 1048,172 1062,182 1054,192 C 1046,202 1032,190 1040,180 Z" transform="rotate(-35 1040 180)" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 2. Ghibli Meadow: Rolling Mint Grass Hills, Sunlit Cumulus Clouds, Buttercup Sun
 */
function GhibliMeadowArtwork({ variant }: { variant: CardArtVariant }) {
  return (
    <div className="absolute inset-0 opacity-85 dark:opacity-85">
      <svg 
        viewBox="0 0 1200 600" 
        preserveAspectRatio="xMidYMid slice" 
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="ghibliSky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0.55" />
          </linearGradient>

          <linearGradient id="ghibliHillFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.55" />
          </linearGradient>

          <linearGradient id="ghibliHillNear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Sky wash */}
        <rect width="1200" height="600" fill="url(#ghibliSky)" />

        {/* Golden sun orb & warm rays */}
        <circle cx="960" cy="120" r="85" fill="#fde047" opacity="0.55" filter="blur(8px)" />
        <circle cx="960" cy="120" r="46" fill="#fef08a" opacity="0.85" />

        {/* Sunlit Cream Ghibli Cloud Puffs */}
        <g fill="#fef9c3" opacity="0.75">
          <circle cx="320" cy="170" r="65" />
          <circle cx="400" cy="145" r="85" />
          <circle cx="490" cy="165" r="68" />
          <circle cx="770" cy="195" r="55" />
          <circle cx="830" cy="175" r="68" />
          <circle cx="900" cy="195" r="52" />
        </g>

        {/* Far rolling pastoral hill */}
        <path 
          d="M 0,370 Q 280,295 620,350 T 1200,310 L 1200,600 L 0,600 Z" 
          fill="url(#ghibliHillFar)" 
        />

        {/* Mid rolling pastoral hill */}
        <path 
          d="M 0,435 Q 360,360 750,425 T 1200,380 L 1200,600 L 0,600 Z" 
          fill="url(#ghibliHillNear)" 
        />

        {/* Foreground meadow crest with sunlit wildflowers */}
        <path 
          d="M 0,505 Q 420,445 880,505 T 1200,465 L 1200,600 L 0,600 Z" 
          fill="#065f46" 
          opacity="0.5"
        />

        {/* Dandelion fluff & buttercup blossoms */}
        <g stroke="#fef08a" strokeWidth="1.8" opacity="0.85">
          <circle cx="210" cy="130" r="5" fill="#fef08a" />
          <line x1="210" y1="130" x2="218" y2="142" />
          <circle cx="490" cy="220" r="4.5" fill="#fef08a" />
          <line x1="490" y1="220" x2="497" y2="231" />
          <circle cx="730" cy="110" r="5" fill="#fef08a" />
          <line x1="730" y1="110" x2="739" y2="124" />
          <circle cx="910" cy="260" r="4.5" fill="#fef08a" />
          <line x1="910" y1="260" x2="916" y2="271" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 3. Golden Hour Bliss: Honey Amber Sun Rays, Silhouetted Horizons, Floating Gold Dust
 */
function GoldenHourArtwork({ variant }: { variant: CardArtVariant }) {
  return (
    <div className="absolute inset-0 opacity-85 dark:opacity-85">
      <svg 
        viewBox="0 0 1200 600" 
        preserveAspectRatio="xMidYMid slice" 
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="goldenSky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#fb7185" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0.6" />
          </linearGradient>

          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.7" />
            <stop offset="75%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky wash */}
        <rect width="1200" height="600" fill="url(#goldenSky)" />

        {/* Giant Setting Sun */}
        <circle cx="650" cy="300" r="210" fill="url(#sunGlow)" />
        <circle cx="650" cy="300" r="78" fill="#fef08a" opacity="0.85" />

        {/* Wide radiating golden sun god rays */}
        <g opacity="0.35" fill="#fef08a">
          <polygon points="650,300 0,0 220,0" />
          <polygon points="650,300 380,0 540,0" />
          <polygon points="650,300 720,0 880,0" />
          <polygon points="650,300 1000,0 1200,0" />
          <polygon points="650,300 1200,160 1200,260" />
          <polygon points="650,300 0,160 0,260" />
        </g>

        {/* Warm amber horizontal cloud bands */}
        <path d="M 0,250 Q 300,225 600,245 T 1200,220 L 1200,275 Q 750,295 0,275 Z" fill="#fde68a" opacity="0.55" />
        <path d="M 80,305 Q 500,285 900,295 T 1200,285 L 1200,325 Q 650,335 80,325 Z" fill="#fdba74" opacity="0.6" />

        {/* Distant warm ridge silhouette */}
        <path 
          d="M 0,385 Q 320,325 650,365 T 1200,335 L 1200,600 L 0,600 Z" 
          fill="#d97706" 
          opacity="0.55" 
        />
        <path 
          d="M 0,455 Q 400,405 820,445 T 1200,415 L 1200,600 L 0,600 Z" 
          fill="#9a3412" 
          opacity="0.6" 
        />

        {/* Floating stardust motes */}
        <g fill="#fef08a" opacity="0.9">
          <circle cx="320" cy="180" r="3.5" />
          <circle cx="410" cy="240" r="4" />
          <circle cx="530" cy="140" r="3" />
          <circle cx="680" cy="190" r="4.5" />
          <circle cx="790" cy="160" r="3" />
          <circle cx="890" cy="230" r="4" />
          <circle cx="980" cy="170" r="3.5" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 4. Cyber Aurora: Bioluminescent Neon Ribbons, Starry Sky, Arctic Reflections
 */
function CyberAuroraArtwork({ variant }: { variant: CardArtVariant }) {
  return (
    <div className="absolute inset-0 opacity-85 dark:opacity-85">
      <svg 
        viewBox="0 0 1200 600" 
        preserveAspectRatio="xMidYMid slice" 
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="cyberSky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="auroraGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
            <stop offset="25%" stopColor="#22d3ee" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#a855f7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="auroraGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
            <stop offset="35%" stopColor="#c084fc" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <rect width="1200" height="600" fill="url(#cyberSky)" />

        {/* Starfield */}
        <g fill="#a5f3fc" opacity="0.85">
          <circle cx="120" cy="80" r="2.5" />
          <circle cx="280" cy="45" r="2.5" />
          <circle cx="390" cy="110" r="3" />
          <circle cx="510" cy="60" r="2" />
          <circle cx="680" cy="75" r="2.5" />
          <circle cx="820" cy="50" r="3" />
          <circle cx="940" cy="95" r="2" />
          <circle cx="1060" cy="65" r="2.5" />
        </g>

        {/* Waving luminous Aurora Ribbon 1 */}
        <path 
          d="M -50,130 Q 250,40 550,150 T 1250,110 L 1250,280 Q 850,210 550,270 T -50,230 Z" 
          fill="url(#auroraGrad1)" 
          filter="blur(6px)" 
        />

        {/* Secondary Aurora Ribbon 2 */}
        <path 
          d="M -50,175 Q 350,85 700,205 T 1250,155 L 1250,325 Q 800,255 400,305 T -50,265 Z" 
          fill="url(#auroraGrad2)" 
          filter="blur(8px)" 
        />

        {/* Vivid Indigo/Teal Jagged Glacier Mountains */}
        <path 
          d="M 0,410 L 150,330 L 290,395 L 460,320 L 610,375 L 780,300 L 960,385 L 1120,315 L 1200,365 L 1200,600 L 0,600 Z" 
          fill="#311068" 
          opacity="0.55" 
        />
        <path 
          d="M 0,410 L 150,330 L 290,395 L 460,320 L 610,375 L 780,300 L 960,385 L 1120,315 L 1200,365" 
          fill="none" 
          stroke="#22d3ee" 
          strokeWidth="2.5" 
          opacity="0.7" 
        />
      </svg>
    </div>
  );
}

/**
 * 5. Alpine Frost: Glacial Ice Peaks, Sapphire Mist, Alpenglow Rose & Falling Snowflakes
 */
function AlpineFrostArtwork({ variant }: { variant: CardArtVariant }) {
  return (
    <div className="absolute inset-0 opacity-85 dark:opacity-85">
      <svg 
        viewBox="0 0 1200 600" 
        preserveAspectRatio="xMidYMid slice" 
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="alpineSky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="snowPeakFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="snowPeakNear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.65" />
          </linearGradient>
        </defs>

        <rect width="1200" height="600" fill="url(#alpineSky)" />

        {/* Distant soaring alpine mountain peaks */}
        <polygon points="100,600 320,220 540,600" fill="url(#snowPeakFar)" opacity="0.75" />
        <polygon points="450,600 680,170 910,600" fill="url(#snowPeakFar)" opacity="0.85" />
        <polygon points="800,600 1020,240 1240,600" fill="url(#snowPeakFar)" opacity="0.75" />

        {/* Foreground sharp icy ridges */}
        <polygon points="-20,600 180,295 390,600" fill="url(#snowPeakNear)" opacity="0.8" />
        <polygon points="330,600 560,265 790,600" fill="url(#snowPeakNear)" opacity="0.85" />
        <polygon points="710,600 940,305 1170,600" fill="url(#snowPeakNear)" opacity="0.8" />

        {/* Crystalline snowflakes */}
        <g stroke="#e0f2fe" strokeWidth="2" opacity="0.85">
          <g transform="translate(180, 140)">
            <line x1="-10" y1="0" x2="10" y2="0" />
            <line x1="0" y1="-10" x2="0" y2="10" />
            <line x1="-7" y1="-7" x2="7" y2="7" />
            <line x1="-7" y1="7" x2="7" y2="-7" />
          </g>
          <g transform="translate(540, 100)">
            <line x1="-12" y1="0" x2="12" y2="0" />
            <line x1="0" y1="-12" x2="0" y2="12" />
            <line x1="-8" y1="-8" x2="8" y2="8" />
            <line x1="-8" y1="8" x2="8" y2="-8" />
          </g>
          <g transform="translate(860, 150)">
            <line x1="-10" y1="0" x2="10" y2="0" />
            <line x1="0" y1="-10" x2="0" y2="10" />
            <line x1="-7" y1="-7" x2="7" y2="7" />
            <line x1="-7" y1="7" x2="7" y2="-7" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * 6. Celestial Noir: Royal Amethyst Nebula, Golden Astrolabe Rings, 4-Pointed Supernova Stars
 */
function CelestialNoirArtwork({ variant }: { variant: CardArtVariant }) {
  return (
    <div className="absolute inset-0 opacity-85 dark:opacity-85">
      <svg 
        viewBox="0 0 1200 600" 
        preserveAspectRatio="xMidYMid slice" 
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="noirSky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#be185d" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.5" />
          </linearGradient>

          <radialGradient id="nebulaViolet" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e879f9" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#9333ea" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3b0764" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nebulaGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b0764" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1200" height="600" fill="url(#noirSky)" />

        {/* Swirling cosmic nebulas */}
        <circle cx="850" cy="220" r="280" fill="url(#nebulaViolet)" filter="blur(16px)" />
        <circle cx="320" cy="280" r="240" fill="url(#nebulaGold)" filter="blur(16px)" />

        {/* Astrolabe Observatory Orbit Coordinates */}
        <g fill="none" stroke="#fde047" strokeWidth="1.5" opacity="0.45">
          <circle cx="600" cy="300" r="250" strokeDasharray="6 6" />
          <circle cx="600" cy="300" r="185" />
          <circle cx="600" cy="300" r="120" strokeDasharray="3 5" />
          <line x1="600" y1="20" x2="600" y2="580" strokeDasharray="4 4" />
          <line x1="300" y1="300" x2="900" y2="300" strokeDasharray="4 4" />
        </g>

        {/* Sparkling 4-point supernova stars */}
        <g fill="#fef08a" opacity="0.9">
          <path d="M 380,115 Q 380,135 400,135 Q 380,135 380,155 Q 380,135 360,135 Q 380,135 380,115 Z" />
          <path d="M 840,135 Q 840,158 863,158 Q 840,158 840,181 Q 840,158 817,158 Q 840,158 840,135 Z" />
          <path d="M 680,255 Q 680,270 695,270 Q 680,270 680,285 Q 680,270 665,270 Q 680,270 680,255 Z" />
          <path d="M 180,235 Q 180,248 193,248 Q 180,248 180,261 Q 180,248 167,248 Q 180,248 180,235 Z" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Artisan Corner Filigrees / Brackets
 * Intricately crafted corners that frame every card as a fine work of art.
 */
function ArtisanCornerFiligrees({
  themeId,
  primaryColor,
  secondaryColor
}: {
  themeId: WeatherThemeId;
  primaryColor: string;
  secondaryColor: string;
}) {
  return (
    <>
      {/* Top Left Corner */}
      <div className="absolute top-3 left-3 w-7 h-7 pointer-events-none opacity-75">
        <svg viewBox="0 0 28 28" fill="none" stroke={primaryColor} strokeWidth="2.2" className="w-full h-full">
          <path d="M 2,18 L 2,7 Q 2,2 7,2 L 18,2" />
          <circle cx="7" cy="7" r="2" fill={secondaryColor} stroke="none" />
          <circle cx="13" cy="2" r="1.2" fill={primaryColor} stroke="none" />
          <circle cx="2" cy="13" r="1.2" fill={primaryColor} stroke="none" />
        </svg>
      </div>

      {/* Top Right Corner */}
      <div className="absolute top-3 right-3 w-7 h-7 pointer-events-none opacity-75">
        <svg viewBox="0 0 28 28" fill="none" stroke={primaryColor} strokeWidth="2.2" className="w-full h-full">
          <path d="M 10,2 L 21,2 Q 26,2 26,7 L 26,18" />
          <circle cx="21" cy="7" r="2" fill={secondaryColor} stroke="none" />
          <circle cx="15" cy="2" r="1.2" fill={primaryColor} stroke="none" />
          <circle cx="26" cy="13" r="1.2" fill={primaryColor} stroke="none" />
        </svg>
      </div>

      {/* Bottom Left Corner */}
      <div className="absolute bottom-3 left-3 w-7 h-7 pointer-events-none opacity-75">
        <svg viewBox="0 0 28 28" fill="none" stroke={primaryColor} strokeWidth="2.2" className="w-full h-full">
          <path d="M 2,10 L 2,21 Q 2,26 7,26 L 18,26" />
          <circle cx="7" cy="21" r="2" fill={secondaryColor} stroke="none" />
          <circle cx="13" cy="26" r="1.2" fill={primaryColor} stroke="none" />
          <circle cx="2" cy="15" r="1.2" fill={primaryColor} stroke="none" />
        </svg>
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-3 right-3 w-7 h-7 pointer-events-none opacity-75">
        <svg viewBox="0 0 28 28" fill="none" stroke={primaryColor} strokeWidth="2.2" className="w-full h-full">
          <path d="M 10,26 L 21,26 Q 26,26 26,21 L 26,10" />
          <circle cx="21" cy="21" r="2" fill={secondaryColor} stroke="none" />
          <circle cx="15" cy="26" r="1.2" fill={primaryColor} stroke="none" />
          <circle cx="26" cy="15" r="1.2" fill={primaryColor} stroke="none" />
        </svg>
      </div>
    </>
  );
}
