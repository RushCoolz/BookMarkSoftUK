export type WeatherThemeId = 
  | 'shinkai'       // Makoto Shinkai: Radiant Azure & Apricot Sunset with Sakura Blossom Petals
  | 'ghibli'        // Studio Ghibli: Rolling Emerald Meadow, Buttercup Sun, Dandelion Fluff
  | 'golden-hour'   // Honey Bliss: Warm Honey Amber, Peach Silk, Golden Floating Dust
  | 'cyber-aurora'  // Nordic Aurora: Electric Violet, Boreal Emerald & Cyan, Starlight Dust
  | 'alpine-frost'  // Alpine Winter: Frosted Sapphire, Crystalline Ice, Shimmering Snowflakes
  | 'celestial-noir';// Deep Space Observatory: Velvet Obsidian, Prismatic Halos, Star Glints

export type ParticleType = 
  | 'sakura' 
  | 'dandelion' 
  | 'golden-mote' 
  | 'aurora-dust' 
  | 'snowflake' 
  | 'starlight';

export interface WeatherThemeConfig {
  id: WeatherThemeId;
  name: string;
  tagline: string;
  description: string;
  particleType: ParticleType;
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    glow: string;
  };
  previewColors: [string, string, string]; // 3-stop gradient for theme preview swatches
  skyPalette: {
    dayTop: string;
    dayMid: string;
    dayBottom: string;
    sunsetTop: string;
    sunsetMid: string;
    sunsetBottom: string;
    nightTop: string;
    nightMid: string;
    nightBottom: string;
    sunBeam: string;
    cloudTop: string;
    cloudMid: string;
    cloudShadow: string;
    hillFar: string;
    hillNear: string;
    particleColors: string[];
  };
  ui: {
    pageBg: string;
    heroGradient: string;
    cardGradient: string;
    cardSurface: string;
    cardBorder: string;
    cardHighlight: string;
    tileSurface: string;
    tileBorder: string;
    tileHover: string;
    tileActiveSurface: string;
    tileActiveBorder: string;
    controlTrack: string;
    dividerBorder: string;
    headerSurface: string;
    headerBorder: string;
    dockSurface: string;
    dockBorder: string;
    activePill: string;
    activePillText: string;
    inactivePillText: string;
    accentPill: string;
    accentText: string;
    headingGradient: string;
    primaryText: string;
    secondaryText: string;
    subheadingText: string;
    mutedText: string;
    bodyText: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    glowShadow: string;
    borderHighlight: string;
    chartLineStroke: string;
    chartLineGrad: [string, string, string];
    chartAreaGrad: [string, string];
    gaugeRingColor: string;
    gaugeTrackColor: string;
  };
}
