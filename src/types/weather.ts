export type TempUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kmh' | 'mph' | 'ms';

export interface LocationData {
  id: string | number;
  name: string;
  region?: string;
  country: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  timezone?: string;
  postcode?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  isDay: number;
  uvIndex: number;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  dewPoint: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  cloudCover: number;
  cloudCoverLow?: number;
  cloudCoverMid?: number;
  cloudCoverHigh?: number;
  visibility: number;
  uvIndex: number;
  pressureMsl?: number;
  shortwaveRadiation?: number;
  directRadiation?: number;
  diffuseRadiation?: number;
  freezingLevelHeight?: number;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface AirQualityData {
  time: string;
  europeanAqi: number;
  usAqi: number;
  pm10: number;
  pm25: number;
  nitrogenDioxide: number;
  ozone: number;
  alderPollen?: number;
  birchPollen?: number;
  grassPollen?: number;
  ragweedPollen?: number;
  mugwortPollen?: number;
  olivePollen?: number;
}

export interface WeatherData {
  location: LocationData;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQualityData;
  timezone: string;
  lastUpdated: string;
}

export interface RadarScan {
  time: number;
  path: string;
}

export interface RadarMetadata {
  host: string;
  past: RadarScan[];
  nowcast: RadarScan[];
  infrared: RadarScan[];
}

export type KeylessRadarLayerId =
  | 'openmeteo-doppler'
  | 'openmeteo-infrared'
  | 'iem-nexrad'
  | 'iem-water-vapor'
  | 'iem-precip-1h';

export interface RadarGridNode {
  id: string;
  label: string;
  lat: number;
  lon: number;
  temp: number;
  precipitation: number;
  rainProb: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  cloudCover: number;
  isStormCell: boolean;
}

export interface TerrainPointProfile {
  lat: number;
  lon: number;
  elevationM: number;
  temperatureC: number;
  windChillC: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  freezingLevelM: number;
  snowLineM: number;
  pressureHpa: number;
  transect: { distanceKm: number; elevationM: number; tempC: number }[];
}

export interface RouteWaypointWeather {
  id: string;
  label: string;
  lat: number;
  lon: number;
  distanceRatio: number;
  etaTimeIso: string;
  etaFormatted: string;
  temperatureC: number;
  precipitationMm: number;
  precipProb: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  weatherCode: number;
  headwindKmh: number;
  crosswindKmh: number;
  hazardLevel: 'Clear' | 'Caution' | 'Hazardous';
}

export interface SpaceWeatherTelemetry {
  kpIndex: number;
  kpScale: string;
  solarWindSpeedKms: number;
  solarWindDensity: number;
  bzNt: number;
  auroraLatitudeThreshold: number;
  localVisibilityPct: number;
  updatedAt: string;
  forecast24h: { timeLabel: string; kp: number }[];
}

export interface MarineTelemetryData {
  isCoastalOrMarine: boolean;
  waveHeightM: number;
  waveDirectionDeg: number;
  wavePeriodS: number;
  swellHeightM: number;
  swellDirectionDeg: number;
  swellPeriodS: number;
  seaSurfaceTempC: number;
  surfRating: 'Flat / Calm' | 'Clean Ankle-Waist' | 'Fun Chest-Head' | 'Heavy / Expert Only';
  hourlyWaves: {
    time: string;
    waveHeightM: number;
    swellHeightM: number;
    tideHeightM: number;
  }[];
  nextHighTide: string;
  nextLowTide: string;
}

export interface ClimateNormalAnomalyData {
  dateLabel: string;
  normalMaxC: number;
  normalMinC: number;
  normalPrecipMm: number;
  recordMaxC: number;
  recordMaxYear: number;
  recordMinC: number;
  recordMinYear: number;
  tempAnomalyC: number;
  precipAnomalyMm: number;
  historicalYearsSampled: number;
  eraSeries: { year: number; maxTempC: number; minTempC: number }[];
}

export interface ActivitySuitability {
  id: string;
  name: string;
  category: 'sports' | 'leisure' | 'events' | 'specialist';
  score: number; // 0 - 100
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  summary: string;
  bestWindow: string;
  factors: {
    name: string;
    status: 'optimal' | 'moderate' | 'adverse';
    detail: string;
  }[];
}

export interface CommuterTransitImpact {
  overallRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  aquaplaningRisk: 'Minimal' | 'Moderate' | 'Elevated' | 'Severe';
  brakingDistanceMultiplier: number; // e.g. 1.0, 1.5, 2.0
  bridgeGaleWarning: boolean;
  highSidedVehicleRisk: 'Normal' | 'Caution' | 'High Alert';
  railTrackRisk: 'Nominal' | 'Leaf Slip / Wet Rails' | 'Heat Expansion Risk' | 'Icing Delay Risk';
  airportVisibilityStatus: 'Clear' | 'Marginal VFR' | 'Low Fog Delay Risk';
  morningRushViability: {
    rating: string;
    delayEstimate: string;
    advice: string;
  };
  eveningRushViability: {
    rating: string;
    delayEstimate: string;
    advice: string;
  };
}

export interface WardrobeRecommendation {
  overallStyle: string;
  tempDescription: string;
  layers: {
    category: 'Outerwear' | 'Top & Mid-Layer' | 'Bottoms' | 'Footwear' | 'Accessories';
    item: string;
    reason: string;
    isEssential: boolean;
  }[];
  essentialsChecklist: string[];
}

export interface SevereAlert {
  id: string;
  title: string;
  severity: 'Advisory' | 'Watch' | 'Warning';
  urgency: 'Immediate' | 'Expected' | 'Future';
  headline: string;
  description: string;
  issuedTime: string;
  validUntil: string;
  recommendedAction: string;
}

export interface UpperAirLevel {
  pressureHpa: number;
  altitudeM: number;
  altitudeFt: number;
  layerName: string;
  temperatureC: number;
  dewPointC: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
}

export interface AtmosphericSoundingData {
  capeJkg: number;
  liftedIndex: number;
  convectiveRisk: 'Stable' | 'Marginal Instability' | 'Moderate Convective' | 'Severe Supercell Risk';
  tropopauseTempC: number;
  maxJetStreamKmh: number;
  levels: UpperAirLevel[];
}

export interface EarthquakeEvent {
  id: string;
  magnitude: number;
  place: string;
  timeMs: number;
  depthKm: number;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

export interface NasaEonetEvent {
  id: string;
  title: string;
  category: 'Wildfires' | 'Volcanoes' | 'Severe Storms' | 'Sea and Lake Ice' | 'Other';
  dateIso: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

export interface SkySpotterReport {
  id: string;
  type: 'rain-hail' | 'wind-gust' | 'sky-optic' | 'road-hazard' | 'clear-sky';
  title: string;
  note: string;
  reporter: string;
  timestamp: string;
  lat: number;
  lon: number;
  verifiedCount: number;
}

export interface CustomWeatherRule {
  id: string;
  name: string;
  metric: 'temperature' | 'windSpeed' | 'precipitation' | 'cloudCover' | 'uvIndex';
  operator: '<' | '>' | '<=' | '>=';
  threshold: number;
  unitLabel: string;
  enabled: boolean;
}


