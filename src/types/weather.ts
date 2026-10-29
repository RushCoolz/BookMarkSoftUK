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
  visibility: number;
  uvIndex: number;
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
  | 'rainviewer-doppler'
  | 'rainviewer-infrared'
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
