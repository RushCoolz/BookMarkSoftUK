/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Real-Time Astronomical & Planetary Ephemeris Engine (J2000 Keplerian Elements)
 * Computes heliocentric & geocentric planetary positions, Local Sidereal Time (LST),
 * horizontal Altitude/Azimuth coordinates, stereographic sky-dome projections,
 * and constellation star patterns for any location and timestamp on Earth.
 */

export interface PlanetOrbitalElements {
  id: string;
  name: string;
  symbol: string;
  color: string;
  accentColor: string;
  radiusKm: number;
  hasRings?: boolean;
  // J2000 Keplerian Elements:
  a0: number; // Semi-major axis (AU)
  aDot: number; // Rate per century
  e0: number; // Eccentricity
  eDot: number;
  i0: number; // Inclination (deg)
  iDot: number;
  L0: number; // Mean longitude (deg)
  LDot: number;
  wBar0: number; // Longitude of perihelion (deg)
  wBarDot: number;
  node0: number; // Longitude of ascending node (deg)
  nodeDot: number;
  orbitalPeriodDays: number;
  orbitalSpeedKms: number;
  baseMag: number; // Absolute magnitude factor
  lore: string;
  observationTip: string;
}

export interface ComputedPlanetState {
  id: string;
  name: string;
  symbol: string;
  color: string;
  accentColor: string;
  hasRings?: boolean;
  // Heliocentric ecliptic coordinates (AU)
  helioX: number;
  helioY: number;
  helioZ: number;
  helioDistAU: number;
  helioLonDeg: number;
  // Geocentric coordinates
  geoDistAU: number;
  geoDistMillionKm: number;
  raDeg: number;
  raHours: number;
  decDeg: number;
  elongationDeg: number;
  apparentMag: number;
  zodiacConstellation: string;
  // Local observer horizontal coordinates
  altitudeDeg: number;
  azimuthDeg: number;
  compassDir: string;
  isAboveHorizon: boolean;
  visibilityLabel: string;
  // Stereographic sky dome coordinates (-1..1, where r=1 is horizon, r=0 is zenith)
  domeX: number;
  domeY: number;
  orbitalPeriodDays: number;
  orbitalSpeedKms: number;
  lore: string;
  observationTip: string;
  orbitTrail: Array<{ x: number; y: number }>;
}

export interface ConstellationStar {
  id: string;
  name: string;
  Bayer: string;
  raHours: number; // Right Ascension (0..24h)
  decDeg: number; // Declination (-90..+90 deg)
  mag: number; // Apparent visual magnitude
  spectralColor: string;
  spectralType: string;
}

export interface ConstellationDefinition {
  id: string;
  name: string;
  latinGenitive: string;
  title: string;
  season: string;
  deepSkyObject: string;
  mythology: string;
  stars: ConstellationStar[];
  // Pairs of star indices forming the stick-figure pattern
  lines: Array<[number, number]>;
}

export interface ProjectedStar extends ConstellationStar {
  altitudeDeg: number;
  azimuthDeg: number;
  isAboveHorizon: boolean;
  domeX: number;
  domeY: number;
}

export interface ProjectedConstellation {
  id: string;
  name: string;
  title: string;
  season: string;
  deepSkyObject: string;
  mythology: string;
  stars: ProjectedStar[];
  lines: Array<[number, number]>;
  centerAltitudeDeg: number;
  centerAzimuthDeg: number;
  compassDir: string;
  isVisibleAboveHorizon: boolean;
  centerDomeX: number;
  centerDomeY: number;
}

export interface MeteorShowerEvent {
  id: string;
  name: string;
  peakMonth: number; // 1-12
  peakDay: number;
  zhr: number; // Zenithal Hourly Rate
  parentBody: string;
  radiantConstellation: string;
  velocityKms: number;
  description: string;
}

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const OBLIQUITY_DEG = 23.43928;

export const PLANET_ELEMENTS: PlanetOrbitalElements[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    symbol: '☿',
    color: '#cbd5e1',
    accentColor: '#94a3b8',
    radiusKm: 2439.7,
    a0: 0.38709927,
    aDot: 0.00000037,
    e0: 0.20563593,
    eDot: 0.00001906,
    i0: 7.00497902,
    iDot: -0.00594749,
    L0: 252.2503235,
    LDot: 149472.67411175,
    wBar0: 77.45779628,
    wBarDot: 0.16047689,
    node0: 48.33076593,
    nodeDot: -0.12534081,
    orbitalPeriodDays: 87.97,
    orbitalSpeedKms: 47.36,
    baseMag: -0.42,
    lore: 'The swift innermost iron world, racing around the Sun every 88 days with extreme cratered terminator shadows.',
    observationTip: 'Best spotted low on the western horizon 45 minutes after sunset or eastern horizon before dawn during greatest elongation.'
  },
  {
    id: 'venus',
    name: 'Venus',
    symbol: '♀',
    color: '#fef08a',
    accentColor: '#facc15',
    radiusKm: 6051.8,
    a0: 0.72333566,
    aDot: 0.0000039,
    e0: 0.00677672,
    eDot: -0.00004107,
    i0: 3.39467605,
    iDot: -0.0007889,
    L0: 181.9790995,
    LDot: 58517.81538729,
    wBar0: 131.60246718,
    wBarDot: 0.00268329,
    node0: 76.67984255,
    nodeDot: -0.27769418,
    orbitalPeriodDays: 224.7,
    orbitalSpeedKms: 35.02,
    baseMag: -4.4,
    lore: 'The Morning and Evening Star—shrouded in highly reflective sulfuric acid clouds that outshine every star in the night sky.',
    observationTip: 'Unmistakable dazzling silver-gold beacon in twilight; small telescopes reveal crisp lunar-like crescent phases.'
  },
  {
    id: 'earth',
    name: 'Earth',
    symbol: '⊕',
    color: '#38bdf8',
    accentColor: '#0284c7',
    radiusKm: 6371.0,
    a0: 1.00000261,
    aDot: 0.00000562,
    e0: 0.01671123,
    eDot: -0.00004392,
    i0: -0.00001531,
    iDot: -0.01294668,
    L0: 100.46457166,
    LDot: 35999.37244981,
    wBar0: 102.93768193,
    wBarDot: 0.32327364,
    node0: 0.0,
    nodeDot: 0.0,
    orbitalPeriodDays: 365.256,
    orbitalSpeedKms: 29.78,
    baseMag: -3.9,
    lore: 'Our ocean-blue biosphere and reference observatory platform, tilted at 23.44° to weave the terrestrial seasons.',
    observationTip: 'Observer origin point for all geocentric right ascension, declination, and local horizon projections.'
  },
  {
    id: 'mars',
    name: 'Mars',
    symbol: '♂',
    color: '#fb7185',
    accentColor: '#e11d48',
    radiusKm: 3389.5,
    a0: 1.52371034,
    aDot: 0.00001847,
    e0: 0.0933941,
    eDot: 0.00007882,
    i0: 1.84969142,
    iDot: -0.00813131,
    L0: -4.55343205,
    LDot: 19140.30268499,
    wBar0: -23.94362959,
    wBarDot: 0.44441088,
    node0: 49.55953891,
    nodeDot: -0.29257343,
    orbitalPeriodDays: 686.98,
    orbitalSpeedKms: 24.07,
    baseMag: -1.52,
    lore: 'The Red Planet of iron-oxide deserts, Olympus Mons, and polar dry-ice caps, glowing with a steady ember hue.',
    observationTip: 'Shines with a distinct ochre-amber tint; brightest and largest in telescopes every 26 months near opposition.'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    symbol: '♃',
    color: '#fdba74',
    accentColor: '#f97316',
    radiusKm: 69911,
    a0: 5.202887,
    aDot: -0.00011607,
    e0: 0.04838624,
    eDot: -0.00013253,
    i0: 1.30439695,
    iDot: -0.00183714,
    L0: 34.39644051,
    LDot: 3034.74612775,
    wBar0: 14.72847983,
    wBarDot: 0.21252668,
    node0: 100.47390909,
    nodeDot: 0.20469106,
    orbitalPeriodDays: 4332.59,
    orbitalSpeedKms: 13.07,
    baseMag: -9.4,
    lore: 'Sovereign gas giant of the Solar System, sculpted by cyclonic ammonia cloud belts and four Galilean moons.',
    observationTip: 'Even 10x50 binoculars reveal Io, Europa, Ganymede, and Callisto aligned like tiny pearls beside the planet.'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    symbol: '♄',
    color: '#fde047',
    accentColor: '#ca8a04',
    radiusKm: 58232,
    hasRings: true,
    a0: 9.53667594,
    aDot: -0.0012506,
    e0: 0.05386179,
    eDot: -0.00050991,
    i0: 2.48599187,
    iDot: 0.00193609,
    L0: 49.95424423,
    LDot: 1222.49362201,
    wBar0: 92.59887831,
    wBarDot: -0.41897216,
    node0: 113.66242448,
    nodeDot: -0.28867794,
    orbitalPeriodDays: 10759.22,
    orbitalSpeedKms: 9.68,
    baseMag: -8.88,
    lore: 'The jewel of the cosmos, encircled by a 282,000 km crystalline water-ice ring system and giant hazy moon Titan.',
    observationTip: 'Steady golden-cream non-twinkling light; any telescope above 30x magnification resolves its iconic ring system.'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    symbol: '♅',
    color: '#67e8f9',
    accentColor: '#06b6d4',
    radiusKm: 25362,
    a0: 19.18916464,
    aDot: -0.00196176,
    e0: 0.04725744,
    eDot: -0.00004397,
    i0: 0.77263783,
    iDot: -0.00242939,
    L0: 313.23810451,
    LDot: 428.48202785,
    wBar0: 170.9542763,
    wBarDot: 0.40805281,
    node0: 74.01692503,
    nodeDot: 0.04240589,
    orbitalPeriodDays: 30688.5,
    orbitalSpeedKms: 6.8,
    baseMag: -7.19,
    lore: 'An aquamarine ice giant rolling on its side with an axial tilt of 97.8° through the deep outer solar frontier.',
    observationTip: 'At ~5.7 magnitude, just visible to the unaided eye under pristine dark skies and easily seen as a pale cyan disc in binoculars.'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    symbol: '♆',
    color: '#818cf8',
    accentColor: '#4f46e5',
    radiusKm: 24622,
    a0: 30.06992276,
    aDot: 0.00026291,
    e0: 0.00859048,
    eDot: 0.00005105,
    i0: 1.77004347,
    iDot: 0.00035372,
    L0: -55.12002969,
    LDot: 218.45945325,
    wBar0: 44.96476227,
    wBarDot: -0.32241464,
    node0: 131.78422574,
    nodeDot: -0.00508664,
    orbitalPeriodDays: 60182,
    orbitalSpeedKms: 5.43,
    baseMag: -6.87,
    lore: 'The outermost wind-swept sapphire ice world, orbiting 4.5 billion kilometers from the Sun once every 165 Earth years.',
    observationTip: 'Requires binoculars or a backyard telescope (mag ~7.8), appearing as a deep cobalt-blue star point.'
  }
];

export const CONSTELLATIONS: ConstellationDefinition[] = [
  {
    id: 'orion',
    name: 'Orion',
    latinGenitive: 'Orionis',
    title: 'The Celestial Hunter',
    season: 'Winter / Equatorial',
    deepSkyObject: 'M42 Great Orion Nebula (Stellar Nursery at 1,344 ly)',
    mythology: 'Striding across the celestial equator with his three-star jeweled belt (Alnitak, Alnilam, Mintaka), flanked by crimson supergiant Betelgeuse and sapphire-blue Rigel.',
    stars: [
      { id: 'betelgeuse', name: 'Betelgeuse', Bayer: 'α Ori', raHours: 5.9195, decDeg: 7.407, mag: 0.42, spectralColor: '#fca5a5', spectralType: 'M1-2 Ia-ab' },
      { id: 'rigel', name: 'Rigel', Bayer: 'β Ori', raHours: 5.2423, decDeg: -8.2016, mag: 0.13, spectralColor: '#93c5fd', spectralType: 'B8 Ia' },
      { id: 'bellatrix', name: 'Bellatrix', Bayer: 'γ Ori', raHours: 5.4188, decDeg: 6.3497, mag: 1.64, spectralColor: '#bae6fd', spectralType: 'B2 III' },
      { id: 'mintaka', name: 'Mintaka', Bayer: 'δ Ori', raHours: 5.5334, decDeg: -0.2991, mag: 2.23, spectralColor: '#bae6fd', spectralType: 'O9.5 II' },
      { id: 'alnilam', name: 'Alnilam', Bayer: 'ε Ori', raHours: 5.6036, decDeg: -1.2019, mag: 1.69, spectralColor: '#bae6fd', spectralType: 'B0 Ia' },
      { id: 'alnitak', name: 'Alnitak', Bayer: 'ζ Ori', raHours: 5.6793, decDeg: -1.9428, mag: 1.77, spectralColor: '#bae6fd', spectralType: 'O9.7 Ib' },
      { id: 'saiph', name: 'Saiph', Bayer: 'κ Ori', raHours: 5.7959, decDeg: -9.6696, mag: 2.09, spectralColor: '#93c5fd', spectralType: 'B0.5 Ia' }
    ],
    lines: [
      [0, 2], [0, 5], [2, 3], [3, 4], [4, 5], [5, 6], [3, 1], [6, 1]
    ]
  },
  {
    id: 'ursa-major',
    name: 'Ursa Major',
    latinGenitive: 'Ursae Majoris',
    title: 'The Great Bear & Big Dipper',
    season: 'Circumpolar North / Spring',
    deepSkyObject: 'M81 & M82 Bode’s & Cigar Galaxies (12 Million ly)',
    mythology: 'Ancient northern navigator’s compass. A line drawn through the two outer bowl stars, Merak and Dubhe, points directly to Polaris, the North Star.',
    stars: [
      { id: 'dubhe', name: 'Dubhe', Bayer: 'α UMa', raHours: 11.0621, decDeg: 61.751, mag: 1.79, spectralColor: '#fdba74', spectralType: 'K0 III' },
      { id: 'merak', name: 'Merak', Bayer: 'β UMa', raHours: 11.0307, decDeg: 56.3824, mag: 2.37, spectralColor: '#e0f2fe', spectralType: 'A1 V' },
      { id: 'phecda', name: 'Phecda', Bayer: 'γ UMa', raHours: 11.8972, decDeg: 53.6948, mag: 2.44, spectralColor: '#e0f2fe', spectralType: 'A0 Ve' },
      { id: 'megrez', name: 'Megrez', Bayer: 'δ UMa', raHours: 12.257, decDeg: 57.0326, mag: 3.31, spectralColor: '#f8fafc', spectralType: 'A3 V' },
      { id: 'alioth', name: 'Alioth', Bayer: 'ε UMa', raHours: 12.9005, decDeg: 55.9598, mag: 1.77, spectralColor: '#e0f2fe', spectralType: 'A1 III-IVp' },
      { id: 'mizar', name: 'Mizar & Alcor', Bayer: 'ζ UMa', raHours: 13.3987, decDeg: 54.9254, mag: 2.23, spectralColor: '#e0f2fe', spectralType: 'A2 V' },
      { id: 'alkaid', name: 'Alkaid', Bayer: 'η UMa', raHours: 13.7923, decDeg: 49.3133, mag: 1.86, spectralColor: '#93c5fd', spectralType: 'B3 V' }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]
    ]
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    latinGenitive: 'Cassiopeiae',
    title: 'The Enthroned Queen',
    season: 'Circumpolar North / Autumn',
    deepSkyObject: 'NGC 457 Owl Cluster & Cassiopeia A Supernova Remnant',
    mythology: 'Unmistakable celestial "W" or "M" asterism embedded directly in the glittering starfields of the northern Milky Way band.',
    stars: [
      { id: 'schedar', name: 'Schedar', Bayer: 'α Cas', raHours: 0.6751, decDeg: 56.5373, mag: 2.24, spectralColor: '#fdba74', spectralType: 'K0 IIIa' },
      { id: 'caph', name: 'Caph', Bayer: 'β Cas', raHours: 0.1529, decDeg: 59.1498, mag: 2.28, spectralColor: '#fef08a', spectralType: 'F2 III' },
      { id: 'gamma-cas', name: 'Tsih (Navi)', Bayer: 'γ Cas', raHours: 0.9451, decDeg: 60.7167, mag: 2.47, spectralColor: '#93c5fd', spectralType: 'B0.5 IVpe' },
      { id: 'ruchbah', name: 'Ruchbah', Bayer: 'δ Cas', raHours: 1.4303, decDeg: 60.2353, mag: 2.68, spectralColor: '#e0f2fe', spectralType: 'A5 IV' },
      { id: 'segin', name: 'Segin', Bayer: 'ε Cas', raHours: 1.9066, decDeg: 63.6701, mag: 3.37, spectralColor: '#93c5fd', spectralType: 'B3 III' }
    ],
    lines: [
      [1, 0], [0, 2], [2, 3], [3, 4]
    ]
  },
  {
    id: 'cygnus',
    name: 'Cygnus',
    latinGenitive: 'Cygni',
    title: 'The Northern Cross & Swan',
    season: 'Summer / Autumn',
    deepSkyObject: 'NGC 7000 North America Nebula & Veil Supernova Loop',
    mythology: 'Soaring down the central rift of the Milky Way, anchored by luminous supergiant Deneb (one vertex of the Summer Triangle) and golden-blue double star Albireo.',
    stars: [
      { id: 'deneb', name: 'Deneb', Bayer: 'α Cyg', raHours: 20.6905, decDeg: 45.2803, mag: 1.25, spectralColor: '#e0f2fe', spectralType: 'A2 Ia' },
      { id: 'sadr', name: 'Sadr', Bayer: 'γ Cyg', raHours: 20.3705, decDeg: 40.2567, mag: 2.23, spectralColor: '#fef08a', spectralType: 'F8 Ib' },
      { id: 'albireo', name: 'Albireo', Bayer: 'β Cyg', raHours: 19.512, decDeg: 27.9597, mag: 3.05, spectralColor: '#fdba74', spectralType: 'K3 II + B9.5 V' },
      { id: 'gienah-cyg', name: 'Gienah', Bayer: 'ε Cyg', raHours: 20.7702, decDeg: 33.9703, mag: 2.48, spectralColor: '#fdba74', spectralType: 'K0 III' },
      { id: 'fawaris', name: 'Fawaris', Bayer: 'δ Cyg', raHours: 19.7496, decDeg: 45.1308, mag: 2.87, spectralColor: '#bae6fd', spectralType: 'B9.5 III' }
    ],
    lines: [
      [0, 1], [1, 2], [4, 1], [1, 3]
    ]
  },
  {
    id: 'scorpius',
    name: 'Scorpius',
    latinGenitive: 'Scorpii',
    title: 'The Celestial Scorpion',
    season: 'Summer / Southern Ecliptic',
    deepSkyObject: 'M4 Globular Cluster & M6/M7 Butterfly & Ptolemy Clusters',
    mythology: 'Curving gracefully beside the galactic core, with ruby-red supergiant Antares ("Rival of Mars") beating at its heart.',
    stars: [
      { id: 'antares', name: 'Antares', Bayer: 'α Sco', raHours: 16.4901, decDeg: -26.432, mag: 1.06, spectralColor: '#fca5a5', spectralType: 'M1.5 Iab-Ib' },
      { id: 'dschubba', name: 'Dschubba', Bayer: 'δ Sco', raHours: 16.0056, decDeg: -22.6217, mag: 2.29, spectralColor: '#93c5fd', spectralType: 'B0.3 IV' },
      { id: 'acrab', name: 'Acrab', Bayer: 'β Sco', raHours: 16.0906, decDeg: -19.8054, mag: 2.56, spectralColor: '#93c5fd', spectralType: 'B1 V' },
      { id: 'sargas', name: 'Sargas', Bayer: 'θ Sco', raHours: 17.6219, decDeg: -42.9978, mag: 1.86, spectralColor: '#fef08a', spectralType: 'F1 II' },
      { id: 'shaula', name: 'Shaula', Bayer: 'λ Sco', raHours: 17.5601, decDeg: -37.1038, mag: 1.62, spectralColor: '#93c5fd', spectralType: 'B1.5 IV' }
    ],
    lines: [
      [2, 1], [1, 0], [0, 3], [3, 4]
    ]
  },
  {
    id: 'leo',
    name: 'Leo',
    latinGenitive: 'Leonis',
    title: 'The Royal Lion & Sickle',
    season: 'Spring / Ecliptic',
    deepSkyObject: 'Leo Triplet Spiral Galaxies (M65, M66, NGC 3628)',
    mythology: 'Heralds the arrival of spring in the northern hemisphere. Its backward question-mark "Sickle" asterism is anchored by blue-white Regulus right on the ecliptic plane.',
    stars: [
      { id: 'regulus', name: 'Regulus', Bayer: 'α Leo', raHours: 10.1395, decDeg: 11.9672, mag: 1.36, spectralColor: '#93c5fd', spectralType: 'B8 IVn' },
      { id: 'algieba', name: 'Algieba', Bayer: 'γ Leo', raHours: 10.3329, decDeg: 19.8415, mag: 2.01, spectralColor: '#fdba74', spectralType: 'K0 III' },
      { id: 'adhafara', name: 'Adhafera', Bayer: 'ζ Leo', raHours: 10.2782, decDeg: 23.4173, mag: 3.44, spectralColor: '#fef08a', spectralType: 'F0 III' },
      { id: 'zosma', name: 'Zosma', Bayer: 'δ Leo', raHours: 11.2351, decDeg: 20.5237, mag: 2.56, spectralColor: '#e0f2fe', spectralType: 'A4 V' },
      { id: 'denebola', name: 'Denebola', Bayer: 'β Leo', raHours: 11.8177, decDeg: 14.5721, mag: 2.14, spectralColor: '#e0f2fe', spectralType: 'A3 V' }
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [3, 4], [4, 0]
    ]
  },
  {
    id: 'taurus',
    name: 'Taurus',
    latinGenitive: 'Tauri',
    title: 'The Bull, Hyades & Pleiades',
    season: 'Winter / Ecliptic',
    deepSkyObject: 'M45 Pleiades (Seven Sisters) & M1 Crab Nebula',
    mythology: 'Home to fiery orange giant Aldebaran (the Bull’s Eye) and the glittering jewel-box open cluster of the Pleiades.',
    stars: [
      { id: 'aldebaran', name: 'Aldebaran', Bayer: 'α Tau', raHours: 4.5987, decDeg: 16.5093, mag: 0.87, spectralColor: '#fdba74', spectralType: 'K5 III' },
      { id: 'elnath', name: 'Elnath', Bayer: 'β Tau', raHours: 5.4382, decDeg: 28.6075, mag: 1.65, spectralColor: '#93c5fd', spectralType: 'B7 III' },
      { id: 'tianguan', name: 'Tianguan', Bayer: 'ζ Tau', raHours: 5.6274, decDeg: 21.1426, mag: 3.01, spectralColor: '#93c5fd', spectralType: 'B2 IIIpe' },
      { id: 'ain', name: 'Ain', Bayer: 'ε Tau', raHours: 4.4769, decDeg: 19.1804, mag: 3.53, spectralColor: '#fdba74', spectralType: 'K0 III' },
      { id: 'alcyone', name: 'Alcyone (Pleiades)', Bayer: 'η Tau', raHours: 3.7914, decDeg: 24.1051, mag: 2.87, spectralColor: '#93c5fd', spectralType: 'B7 IIIe' }
    ],
    lines: [
      [2, 0], [0, 3], [3, 1], [3, 4]
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    latinGenitive: 'Geminorum',
    title: 'The Celestial Twins',
    season: 'Winter / Spring Ecliptic',
    deepSkyObject: 'M35 Open Star Cluster & NGC 2392 Eskimo Nebula',
    mythology: 'Crowned by the bright fraternal twin stars Pollux (golden-orange giant) and Castor (sextuple blue-white star system), radiant home of the December Geminid meteors.',
    stars: [
      { id: 'pollux', name: 'Pollux', Bayer: 'β Gem', raHours: 7.7553, decDeg: 28.0262, mag: 1.14, spectralColor: '#fdba74', spectralType: 'K0 III' },
      { id: 'castor', name: 'Castor', Bayer: 'α Gem', raHours: 7.5767, decDeg: 31.8883, mag: 1.58, spectralColor: '#e0f2fe', spectralType: 'A1 V + A2 Vm' },
      { id: 'alhena', name: 'Alhena', Bayer: 'γ Gem', raHours: 6.6285, decDeg: 16.3993, mag: 1.93, spectralColor: '#e0f2fe', spectralType: 'A1.5 IV+' },
      { id: 'mebsuta', name: 'Mebsuta', Bayer: 'ε Gem', raHours: 6.7329, decDeg: 25.1311, mag: 3.06, spectralColor: '#fef08a', spectralType: 'G8 Ib' },
      { id: 'wasat', name: 'Wasat', Bayer: 'δ Gem', raHours: 7.3354, decDeg: 21.9823, mag: 3.53, spectralColor: '#fef08a', spectralType: 'F0 IV' }
    ],
    lines: [
      [1, 0], [1, 3], [0, 4], [4, 2]
    ]
  },
  {
    id: 'lyra',
    name: 'Lyra',
    latinGenitive: 'Lyrae',
    title: 'Orpheus’s Celestial Harp',
    season: 'Summer',
    deepSkyObject: 'M57 Ring Nebula & Epsilon Lyrae "Double-Double"',
    mythology: 'Anchored by dazzling zero-magnitude sapphire-white Vega—the fifth brightest star in Earth’s sky and our ancient/future pole star.',
    stars: [
      { id: 'vega', name: 'Vega', Bayer: 'α Lyr', raHours: 18.6156, decDeg: 38.7837, mag: 0.03, spectralColor: '#bae6fd', spectralType: 'A0 Va' },
      { id: 'sheliak', name: 'Sheliak', Bayer: 'β Lyr', raHours: 18.8347, decDeg: 33.3627, mag: 3.52, spectralColor: '#93c5fd', spectralType: 'B8.5 Ib-II' },
      { id: 'sulafat', name: 'Sulafat', Bayer: 'γ Lyr', raHours: 18.9823, decDeg: 32.6896, mag: 3.25, spectralColor: '#93c5fd', spectralType: 'B9 III' },
      { id: 'delta-lyr', name: 'Delta Lyrae', Bayer: 'δ² Lyr', raHours: 18.9083, decDeg: 36.8986, mag: 4.22, spectralColor: '#fca5a5', spectralType: 'M4 II' }
    ],
    lines: [
      [0, 3], [3, 2], [2, 1], [1, 3]
    ]
  },
  {
    id: 'pegasus',
    name: 'Pegasus & Andromeda',
    latinGenitive: 'Pegasi',
    title: 'The Great Square & Galaxy Bridge',
    season: 'Autumn',
    deepSkyObject: 'M31 Andromeda Galaxy (2.5 Million ly — Farthest Naked-Eye Object)',
    mythology: 'The Great Square of Pegasus forms a cosmic window into intergalactic space, trailing directly into the star-chain of Andromeda and our neighboring spiral galaxy M31.',
    stars: [
      { id: 'markab', name: 'Markab', Bayer: 'α Peg', raHours: 23.0793, decDeg: 15.2053, mag: 2.49, spectralColor: '#bae6fd', spectralType: 'B9 III' },
      { id: 'scheat', name: 'Scheat', Bayer: 'β Peg', raHours: 23.0629, decDeg: 28.0828, mag: 2.44, spectralColor: '#fca5a5', spectralType: 'M2.5 II-III' },
      { id: 'algenib', name: 'Algenib', Bayer: 'γ Peg', raHours: 0.2206, decDeg: 15.1836, mag: 2.84, spectralColor: '#93c5fd', spectralType: 'B2 IV' },
      { id: 'alpheratz', name: 'Alpheratz', Bayer: 'α And', raHours: 0.1398, decDeg: 29.0904, mag: 2.07, spectralColor: '#bae6fd', spectralType: 'B8 IVpMnHg' },
      { id: 'mirach', name: 'Mirach', Bayer: 'β And', raHours: 1.1622, decDeg: 35.6206, mag: 2.07, spectralColor: '#fca5a5', spectralType: 'M0 III' }
    ],
    lines: [
      [0, 1], [1, 3], [3, 2], [2, 0], [3, 4]
    ]
  },
  {
    id: 'canis-major',
    name: 'Canis Major',
    latinGenitive: 'Canis Majoris',
    title: 'The Great Dog & Sirius',
    season: 'Winter / Southern',
    deepSkyObject: 'M41 Little Beehive Open Cluster (4° South of Sirius)',
    mythology: 'Faithful companion to Orion, led by Sirius ("The Scorching One") at magnitude -1.46—the brightest star anywhere in Earth’s night sky, just 8.6 light-years away.',
    stars: [
      { id: 'sirius', name: 'Sirius (Dog Star)', Bayer: 'α CMa', raHours: 6.7525, decDeg: -16.7161, mag: -1.46, spectralColor: '#e0f2fe', spectralType: 'A0mA1 Va' },
      { id: 'mirzam', name: 'Mirzam', Bayer: 'β CMa', raHours: 6.3783, decDeg: -17.9559, mag: 1.98, spectralColor: '#93c5fd', spectralType: 'B1 II-III' },
      { id: 'wezen', name: 'Wezen', Bayer: 'δ CMa', raHours: 7.1399, decDeg: -26.3932, mag: 1.83, spectralColor: '#fef08a', spectralType: 'F8 Ia' },
      { id: 'adhara', name: 'Adhara', Bayer: 'ε CMa', raHours: 6.9771, decDeg: -28.9721, mag: 1.5, spectralColor: '#93c5fd', spectralType: 'B2 Iab' }
    ],
    lines: [
      [1, 0], [0, 2], [2, 3]
    ]
  },
  {
    id: 'crux',
    name: 'Crux',
    latinGenitive: 'Crucis',
    title: 'The Southern Cross',
    season: 'Southern Hemisphere',
    deepSkyObject: 'NGC 4755 Jewel Box Cluster & Coalsack Dark Nebula',
    mythology: 'The most iconic compact constellation of the southern skies, whose long axis points steadfastly toward the South Celestial Pole.',
    stars: [
      { id: 'acrux', name: 'Acrux', Bayer: 'α Cru', raHours: 12.4433, decDeg: -63.0991, mag: 0.76, spectralColor: '#93c5fd', spectralType: 'B0.5 IV' },
      { id: 'mimosa', name: 'Mimosa', Bayer: 'β Cru', raHours: 12.7953, decDeg: -59.6888, mag: 1.25, spectralColor: '#93c5fd', spectralType: 'B0.5 III' },
      { id: 'gacrux', name: 'Gacrux', Bayer: 'γ Cru', raHours: 12.5194, decDeg: -57.1132, mag: 1.64, spectralColor: '#fca5a5', spectralType: 'M3.5 III' },
      { id: 'imai', name: 'Imai', Bayer: 'δ Cru', raHours: 12.2524, decDeg: -58.7489, mag: 2.79, spectralColor: '#93c5fd', spectralType: 'B2 IV' }
    ],
    lines: [
      [2, 0], [1, 3]
    ]
  }
];

export const METEOR_SHOWERS: MeteorShowerEvent[] = [
  {
    id: 'quadrantids',
    name: 'Quadrantids',
    peakMonth: 1,
    peakDay: 4,
    zhr: 110,
    parentBody: 'Asteroid 2003 EH1',
    radiantConstellation: 'Boötes / Draco',
    velocityKms: 41,
    description: 'Sharp, intense blue-white fireball peak opening the astronomical year.'
  },
  {
    id: 'lyrids',
    name: 'Lyrids',
    peakMonth: 4,
    peakDay: 22,
    zhr: 20,
    parentBody: 'Comet C/1861 G1 Thatcher',
    radiantConstellation: 'Lyra (near Vega)',
    velocityKms: 49,
    description: 'One of the oldest recorded showers (observed for 2,700 years), producing luminous dust trails.'
  },
  {
    id: 'eta-aquariids',
    name: 'Eta Aquariids',
    peakMonth: 5,
    peakDay: 6,
    zhr: 50,
    parentBody: '1P/Halley (Halley’s Comet)',
    radiantConstellation: 'Aquarius',
    velocityKms: 66,
    description: 'Swift earth-grazing meteors forged from ancient debris shed by Halley’s Comet.'
  },
  {
    id: 'perseids',
    name: 'Perseids',
    peakMonth: 8,
    peakDay: 12,
    zhr: 100,
    parentBody: 'Comet 109P/Swift-Tuttle',
    radiantConstellation: 'Perseus / Cassiopeia',
    velocityKms: 59,
    description: 'Beloved warm-summer shower renowned for emerald-green fireballs and persistent ionized wakes.'
  },
  {
    id: 'orionids',
    name: 'Orionids',
    peakMonth: 10,
    peakDay: 21,
    zhr: 25,
    parentBody: '1P/Halley (Halley’s Comet)',
    radiantConstellation: 'Orion (near Betelgeuse)',
    velocityKms: 66,
    description: 'Fast autumn streaks radiating from the club of Orion the Hunter.'
  },
  {
    id: 'leonids',
    name: 'Leonids',
    peakMonth: 11,
    peakDay: 17,
    zhr: 15,
    parentBody: 'Comet 55P/Tempel-Tuttle',
    radiantConstellation: 'Leo (The Sickle)',
    velocityKms: 71,
    description: 'Fastest known meteor stream (71 km/s), famous for historic century-scale meteor storms.'
  },
  {
    id: 'geminids',
    name: 'Geminids',
    peakMonth: 12,
    peakDay: 14,
    zhr: 120,
    parentBody: 'Rock Comet 3200 Phaethon',
    radiantConstellation: 'Gemini (near Castor)',
    velocityKms: 35,
    description: 'Richest and most reliable annual meteor shower, featuring multi-colored golden, emerald, and white meteors.'
  }
];

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function solveKepler(Mdeg: number, e: number): number {
  const M = normalizeDeg(Mdeg) * DEG2RAD;
  let E = M + e * Math.sin(M);
  for (let iter = 0; iter < 8; iter++) {
    const dE = (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-7) break;
  }
  return E;
}

export function getJulianCenturiesJ2000(date: Date): number {
  const jd = date.getTime() / 86400000 + 2440587.5;
  return (jd - 2451545.0) / 36525.0;
}

export function computeLocalSiderealTimeDeg(date: Date, longitudeDeg: number): number {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0;
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;
  return normalizeDeg(gmst + longitudeDeg);
}

export function azimuthToCompass(azDeg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(normalizeDeg(azDeg) / 22.5) % 16;
  return dirs[idx];
}

export function eclipticLonToZodiac(lonDeg: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpius', 'Sagittarius', 'Capricornus', 'Aquarius', 'Pisces'
  ];
  const idx = Math.floor(normalizeDeg(lonDeg) / 30) % 12;
  return signs[idx];
}

/**
 * Converts equatorial (RA in degrees, Dec in degrees) to local observer (Altitude, Azimuth)
 * and stereographic zenith dome projection.
 */
export function equatorialToHorizontal(
  raDeg: number,
  decDeg: number,
  latDeg: number,
  lstDeg: number
): { altitudeDeg: number; azimuthDeg: number; domeX: number; domeY: number } {
  const haRad = normalizeDeg(lstDeg - raDeg) * DEG2RAD;
  const decRad = decDeg * DEG2RAD;
  const latRad = latDeg * DEG2RAD;

  const sinAlt =
    Math.sin(decRad) * Math.sin(latRad) +
    Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const altitudeDeg = altRad * RAD2DEG;

  const y = -Math.sin(haRad) * Math.cos(decRad);
  const x =
    Math.sin(decRad) * Math.cos(latRad) -
    Math.cos(decRad) * Math.sin(latRad) * Math.cos(haRad);
  const azimuthDeg = normalizeDeg(Math.atan2(y, x) * RAD2DEG);

  // Stereographic projection from Zenith (alt=90 -> r=0, alt=0 -> r=1, alt<0 -> r>1)
  const zenithAngleDeg = 90 - altitudeDeg;
  const r = Math.tan((zenithAngleDeg * DEG2RAD) / 2);
  // In sky charts looking UP at the zenith: North is top (y=-r), East is left (x=-r) or standard compass (East right).
  // We use compass orientation with North=Top, East=Right, South=Bottom, West=Left for intuitive geographic matching:
  const azRad = azimuthDeg * DEG2RAD;
  const domeX = r * Math.sin(azRad);
  const domeY = -r * Math.cos(azRad);

  return { altitudeDeg, azimuthDeg, domeX, domeY };
}

function computeHeliocentricCoords(el: PlanetOrbitalElements, T: number): {
  x: number;
  y: number;
  z: number;
  r: number;
  lonDeg: number;
} {
  const a = el.a0 + el.aDot * T;
  const e = el.e0 + el.eDot * T;
  const i = (el.i0 + el.iDot * T) * DEG2RAD;
  const L = normalizeDeg(el.L0 + el.LDot * T);
  const wBar = normalizeDeg(el.wBar0 + el.wBarDot * T);
  const node = normalizeDeg(el.node0 + el.nodeDot * T);

  const w = (wBar - node) * DEG2RAD;
  const nodeRad = node * DEG2RAD;
  const M = normalizeDeg(L - wBar);
  const E = solveKepler(M, e);

  const xOrb = a * (Math.cos(E) - e);
  const yOrb = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const cosW = Math.cos(w);
  const sinW = Math.sin(w);
  const cosNode = Math.cos(nodeRad);
  const sinNode = Math.sin(nodeRad);
  const cosI = Math.cos(i);
  const sinI = Math.sin(i);

  const x =
    (cosW * cosNode - sinW * sinNode * cosI) * xOrb +
    (-sinW * cosNode - cosW * sinNode * cosI) * yOrb;
  const y =
    (cosW * sinNode + sinW * cosNode * cosI) * xOrb +
    (-sinW * sinNode + cosW * cosNode * cosI) * yOrb;
  const z = sinW * sinI * xOrb + cosW * sinI * yOrb;

  const r = Math.sqrt(x * x + y * y + z * z);
  const lonDeg = normalizeDeg(Math.atan2(y, x) * RAD2DEG);

  return { x, y, z, r, lonDeg };
}

/**
 * Computes full real-time state for all 8 planets at the given date and observer coordinates.
 */
export function computeSolarSystemState(
  date: Date,
  latitudeDeg: number,
  longitudeDeg: number
): ComputedPlanetState[] {
  const T = getJulianCenturiesJ2000(date);
  const lstDeg = computeLocalSiderealTimeDeg(date, longitudeDeg);
  const eps = OBLIQUITY_DEG * DEG2RAD;

  const earthEl = PLANET_ELEMENTS.find((p) => p.id === 'earth')!;
  const earthHelio = computeHeliocentricCoords(earthEl, T);

  return PLANET_ELEMENTS.map((el) => {
    const helio = computeHeliocentricCoords(el, T);

    // Generate 72-point orbital trail in heliocentric XY plane
    const orbitTrail: Array<{ x: number; y: number }> = [];
    for (let step = 0; step <= 72; step++) {
      const frac = step / 72;
      const dtYears = (frac * el.orbitalPeriodDays) / 365.25;
      const trailT = T + dtYears / 100;
      const pt = computeHeliocentricCoords(el, trailT);
      orbitTrail.push({ x: pt.x, y: pt.y });
    }

    if (el.id === 'earth') {
      return {
        id: el.id,
        name: el.name,
        symbol: el.symbol,
        color: el.color,
        accentColor: el.accentColor,
        helioX: helio.x,
        helioY: helio.y,
        helioZ: helio.z,
        helioDistAU: Math.round(helio.r * 1000) / 1000,
        helioLonDeg: Math.round(helio.lonDeg * 10) / 10,
        geoDistAU: 0,
        geoDistMillionKm: 0,
        raDeg: 0,
        raHours: 0,
        decDeg: 0,
        elongationDeg: 0,
        apparentMag: -3.9,
        zodiacConstellation: eclipticLonToZodiac(helio.lonDeg),
        altitudeDeg: 90,
        azimuthDeg: 180,
        compassDir: 'Local Nadir / Observer',
        isAboveHorizon: true,
        visibilityLabel: 'Observer Biosphere Platform',
        domeX: 0,
        domeY: 0,
        orbitalPeriodDays: el.orbitalPeriodDays,
        orbitalSpeedKms: el.orbitalSpeedKms,
        lore: el.lore,
        observationTip: el.observationTip,
        orbitTrail
      };
    }

    // Geocentric ecliptic vector
    const dx = helio.x - earthHelio.x;
    const dy = helio.y - earthHelio.y;
    const dz = helio.z - earthHelio.z;
    const geoDistAU = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const geoDistMillionKm = Math.round(geoDistAU * 149.59787 * 10) / 10;

    // Rotate from ecliptic to equatorial (RA, Dec)
    const xEq = dx;
    const yEq = dy * Math.cos(eps) - dz * Math.sin(eps);
    const zEq = dy * Math.sin(eps) + dz * Math.cos(eps);

    const raDeg = normalizeDeg(Math.atan2(yEq, xEq) * RAD2DEG);
    const decDeg = Math.asin(Math.max(-1, Math.min(1, zEq / geoDistAU))) * RAD2DEG;
    const geoEclipticLon = normalizeDeg(Math.atan2(dy, dx) * RAD2DEG);
    const sunGeoLon = normalizeDeg(earthHelio.lonDeg + 180);
    let elongationDeg = Math.abs(geoEclipticLon - sunGeoLon);
    if (elongationDeg > 180) elongationDeg = 360 - elongationDeg;

    const apparentMag =
      Math.round((el.baseMag + 5 * Math.log10(helio.r * geoDistAU)) * 10) / 10;

    const horiz = equatorialToHorizontal(raDeg, decDeg, latitudeDeg, lstDeg);
    const isAboveHorizon = horiz.altitudeDeg > 0;

    let visibilityLabel = 'Below Local Horizon';
    if (elongationDeg < 14) {
      visibilityLabel = 'Lost in Solar Glare (Near Conjunction)';
    } else if (isAboveHorizon && horiz.altitudeDeg >= 15) {
      visibilityLabel = 'Prime Viewing Above Horizon';
    } else if (isAboveHorizon) {
      visibilityLabel = 'Low Above Horizon (Twilight/Atmospheric Grazing)';
    } else {
      visibilityLabel = 'Rises Later Tonight / Daytime Transit';
    }

    return {
      id: el.id,
      name: el.name,
      symbol: el.symbol,
      color: el.color,
      accentColor: el.accentColor,
      hasRings: el.hasRings,
      helioX: helio.x,
      helioY: helio.y,
      helioZ: helio.z,
      helioDistAU: Math.round(helio.r * 1000) / 1000,
      helioLonDeg: Math.round(helio.lonDeg * 10) / 10,
      geoDistAU: Math.round(geoDistAU * 1000) / 1000,
      geoDistMillionKm,
      raDeg: Math.round(raDeg * 100) / 100,
      raHours: Math.round((raDeg / 15) * 100) / 100,
      decDeg: Math.round(decDeg * 100) / 100,
      elongationDeg: Math.round(elongationDeg * 10) / 10,
      apparentMag,
      zodiacConstellation: eclipticLonToZodiac(geoEclipticLon),
      altitudeDeg: Math.round(horiz.altitudeDeg * 10) / 10,
      azimuthDeg: Math.round(horiz.azimuthDeg * 10) / 10,
      compassDir: azimuthToCompass(horiz.azimuthDeg),
      isAboveHorizon,
      visibilityLabel,
      domeX: horiz.domeX,
      domeY: horiz.domeY,
      orbitalPeriodDays: el.orbitalPeriodDays,
      orbitalSpeedKms: el.orbitalSpeedKms,
      lore: el.lore,
      observationTip: el.observationTip,
      orbitTrail
    };
  });
}

/**
 * Projects all 12 constellations and their stars into the observer's local sky dome
 * for the given date, latitude, and longitude.
 */
export function computeConstellationsForSky(
  date: Date,
  latitudeDeg: number,
  longitudeDeg: number
): ProjectedConstellation[] {
  const lstDeg = computeLocalSiderealTimeDeg(date, longitudeDeg);

  return CONSTELLATIONS.map((c) => {
    const projectedStars: ProjectedStar[] = c.stars.map((st) => {
      const raDeg = st.raHours * 15;
      const horiz = equatorialToHorizontal(raDeg, st.decDeg, latitudeDeg, lstDeg);
      return {
        ...st,
        altitudeDeg: Math.round(horiz.altitudeDeg * 10) / 10,
        azimuthDeg: Math.round(horiz.azimuthDeg * 10) / 10,
        isAboveHorizon: horiz.altitudeDeg > -2,
        domeX: horiz.domeX,
        domeY: horiz.domeY
      };
    });

    const avgAlt =
      projectedStars.reduce((acc, s) => acc + s.altitudeDeg, 0) / projectedStars.length;
    const avgDomeX =
      projectedStars.reduce((acc, s) => acc + s.domeX, 0) / projectedStars.length;
    const avgDomeY =
      projectedStars.reduce((acc, s) => acc + s.domeY, 0) / projectedStars.length;
    const centerAz = normalizeDeg(Math.atan2(avgDomeX, -avgDomeY) * RAD2DEG);

    return {
      id: c.id,
      name: c.name,
      title: c.title,
      season: c.season,
      deepSkyObject: c.deepSkyObject,
      mythology: c.mythology,
      stars: projectedStars,
      lines: c.lines,
      centerAltitudeDeg: Math.round(avgAlt * 10) / 10,
      centerAzimuthDeg: Math.round(centerAz * 10) / 10,
      compassDir: azimuthToCompass(centerAz),
      isVisibleAboveHorizon: projectedStars.some((s) => s.altitudeDeg > 0),
      centerDomeX: avgDomeX,
      centerDomeY: avgDomeY
    };
  });
}

/**
 * Computes the Ecliptic circle points projected onto the local sky dome.
 */
export function computeEclipticDomePath(
  date: Date,
  latitudeDeg: number,
  longitudeDeg: number
): Array<{ domeX: number; domeY: number; altitudeDeg: number }> {
  const lstDeg = computeLocalSiderealTimeDeg(date, longitudeDeg);
  const eps = OBLIQUITY_DEG * DEG2RAD;
  const pts: Array<{ domeX: number; domeY: number; altitudeDeg: number }> = [];

  for (let lon = 0; lon <= 360; lon += 10) {
    const lRad = lon * DEG2RAD;
    const raRad = Math.atan2(Math.sin(lRad) * Math.cos(eps), Math.cos(lRad));
    const decRad = Math.asin(Math.sin(lRad) * Math.sin(eps));
    const horiz = equatorialToHorizontal(
      normalizeDeg(raRad * RAD2DEG),
      decRad * RAD2DEG,
      latitudeDeg,
      lstDeg
    );
    pts.push({
      domeX: horiz.domeX,
      domeY: horiz.domeY,
      altitudeDeg: horiz.altitudeDeg
    });
  }
  return pts;
}
