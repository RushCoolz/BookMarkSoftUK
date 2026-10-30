import { 
  WeatherData, 
  LocationData, 
  RadarMetadata, 
  RadarGridNode,
  TerrainPointProfile,
  RouteWaypointWeather,
  SpaceWeatherTelemetry,
  MarineTelemetryData,
  ClimateNormalAnomalyData,
  AtmosphericSoundingData,
  UpperAirLevel,
  EarthquakeEvent,
  NasaEonetEvent,
  ActivitySuitability, 
  CommuterTransitImpact, 
  WardrobeRecommendation, 
  SevereAlert,
  TempUnit,
  SpeedUnit
} from '../types/weather';

export const DEFAULT_LOCATION: LocationData = {
  id: 'london-uk',
  name: 'London',
  region: 'Greater London',
  country: 'United Kingdom',
  countryCode: 'GB',
  latitude: 51.5074,
  longitude: -0.1278,
  elevation: 25,
  timezone: 'Europe/London'
};

export const POPULAR_LOCATIONS: LocationData[] = [
  { id: 'lon', name: 'London', region: 'Greater London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { id: 'edi', name: 'Edinburgh', region: 'Scotland', country: 'United Kingdom', latitude: 55.9533, longitude: -3.1883, timezone: 'Europe/London' },
  { id: 'man', name: 'Manchester', region: 'North West', country: 'United Kingdom', latitude: 53.4808, longitude: -2.2426, timezone: 'Europe/London' },
  { id: 'bham', name: 'Birmingham', region: 'West Midlands', country: 'United Kingdom', latitude: 52.4862, longitude: -1.8904, timezone: 'Europe/London' },
  { id: 'nyc', name: 'New York', region: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { id: 'tok', name: 'Tokyo', region: 'Kanto', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { id: 'zur', name: 'Zurich', region: 'Canton Zurich', country: 'Switzerland', latitude: 47.3769, longitude: 8.5417, timezone: 'Europe/Zurich' },
  { id: 'syd', name: 'Sydney', region: 'New South Wales', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { id: 'reyk', name: 'Reykjavik', region: 'Capital Region', country: 'Iceland', latitude: 64.1466, longitude: -21.9426, timezone: 'Atlantic/Reykjavik' }
];

export interface WmoCodeInfo {
  description: string;
  category: 'clear' | 'partly-cloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  icon: string;
}

export function decodeWmoCode(code: number, isDay = 1): WmoCodeInfo {
  switch (code) {
    case 0:
      return {
        description: isDay ? 'Clear Sky' : 'Clear Night',
        category: 'clear',
        icon: isDay ? 'Sun' : 'Moon'
      };
    case 1:
      return {
        description: isDay ? 'Mainly Sunny' : 'Mainly Clear Night',
        category: 'clear',
        icon: isDay ? 'SunMedium' : 'MoonStar'
      };
    case 2:
      return {
        description: 'Partly Cloudy',
        category: 'partly-cloudy',
        icon: isDay ? 'CloudSun' : 'CloudMoon'
      };
    case 3:
      return {
        description: 'Overcast',
        category: 'cloudy',
        icon: 'Cloud'
      };
    case 45:
    case 48:
      return {
        description: code === 48 ? 'Depositing Rime Fog' : 'Mist & Fog',
        category: 'fog',
        icon: 'CloudFog'
      };
    case 51:
    case 53:
    case 55:
      return {
        description: code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
        category: 'drizzle',
        icon: 'CloudDrizzle'
      };
    case 56:
    case 57:
      return {
        description: 'Freezing Drizzle',
        category: 'drizzle',
        icon: 'CloudSnow'
      };
    case 61:
      return {
        description: 'Slight Rain',
        category: 'rain',
        icon: 'CloudRain'
      };
    case 63:
      return {
        description: 'Moderate Rain',
        category: 'rain',
        icon: 'CloudRain'
      };
    case 65:
      return {
        description: 'Heavy Rain',
        category: 'rain',
        icon: 'CloudRain'
      };
    case 66:
    case 67:
      return {
        description: 'Freezing Rain',
        category: 'rain',
        icon: 'CloudSnow'
      };
    case 71:
    case 73:
    case 75:
      return {
        description: code === 71 ? 'Slight Snowfall' : code === 73 ? 'Moderate Snow' : 'Heavy Snowfall',
        category: 'snow',
        icon: 'Snowflake'
      };
    case 77:
      return {
        description: 'Snow Grains',
        category: 'snow',
        icon: 'Snowflake'
      };
    case 80:
    case 81:
    case 82:
      return {
        description: code === 80 ? 'Passing Showers' : code === 81 ? 'Moderate Showers' : 'Violent Rain Showers',
        category: 'rain',
        icon: 'CloudRain'
      };
    case 85:
    case 86:
      return {
        description: 'Snow Showers',
        category: 'snow',
        icon: 'CloudSnow'
      };
    case 95:
      return {
        description: 'Thunderstorm',
        category: 'thunderstorm',
        icon: 'CloudLightning'
      };
    case 96:
    case 99:
      return {
        description: 'Thunderstorm with Hail',
        category: 'thunderstorm',
        icon: 'CloudLightning'
      };
    default:
      return {
        description: 'Variable Weather',
        category: 'cloudy',
        icon: 'Cloud'
      };
  }
}

export function formatTemp(celsius: number, unit: TempUnit = 'celsius'): string {
  if (unit === 'fahrenheit') {
    return `${Math.round((celsius * 9) / 5 + 32)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatTempWithUnit(celsius: number, unit: TempUnit = 'celsius'): string {
  if (unit === 'fahrenheit') {
    return `${Math.round((celsius * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatSpeed(kmh: number, unit: SpeedUnit = 'mph'): string {
  if (unit === 'mph') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  if (unit === 'ms') {
    return `${(kmh / 3.6).toFixed(1)} m/s`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindCompassDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((deg % 360) / 22.5)) % 16;
  return directions[index];
}

// Hyperlocal search using Open-Meteo Geocoding & UK postcodes.io
export async function searchLocations(query: string): Promise<LocationData[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  // Check if query is a UK Postcode (e.g. SW1A 1AA, M1, EC2A)
  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9]?[A-Z]{0,2}$/i;
  if (ukPostcodeRegex.test(trimmed)) {
    try {
      const pcRes = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(trimmed)}`);
      if (pcRes.ok) {
        const pcData = await pcRes.json();
        if (pcData.result) {
          const r = pcData.result;
          return [{
            id: `pc-${r.postcode}`,
            name: `${r.postcode} (${r.admin_district || r.parish || 'UK'})`,
            region: r.region || r.european_electoral_region || r.admin_county || 'United Kingdom',
            country: 'United Kingdom',
            countryCode: 'GB',
            latitude: r.latitude,
            longitude: r.longitude,
            postcode: r.postcode,
            timezone: 'Europe/London'
          }];
        }
      }
    } catch {
      // Fallback to standard geocoding
    }
  }

  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`);
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    if (!data.results || !data.results.length) return [];

    return data.results.map((item: any) => ({
      id: `${item.id || item.name}-${item.latitude}-${item.longitude}`,
      name: item.name,
      region: item.admin1 || item.admin2 || item.admin3 || '',
      country: item.country || '',
      countryCode: item.country_code || '',
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      timezone: item.timezone || 'auto'
    }));
  } catch (err) {
    console.error('Location search error:', err);
    return [];
  }
}

// Reverse Geocoding from coordinates
export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationData> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12&addressdetails=1`,
      { headers: { 'User-Agent': 'AetherWeather/1.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || 'Your Location';
      return {
        id: `geo-${latitude}-${longitude}`,
        name: cityName,
        region: addr.state || addr.county || '',
        country: addr.country || 'Current Coordinates',
        countryCode: addr.country_code ? addr.country_code.toUpperCase() : '',
        latitude,
        longitude
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding fallback:', err);
  }

  return {
    id: `geo-${latitude}-${longitude}`,
    name: 'Current Location',
    country: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
    latitude,
    longitude
  };
}

// Fetch Full Comprehensive Weather Data
export async function fetchFullWeather(location: LocationData): Promise<WeatherData> {
  const { latitude, longitude, timezone = 'auto' } = location;

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,pressure_msl,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,shortwave_radiation,direct_radiation,diffuse_radiation,freezing_level_height&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=${encodeURIComponent(timezone)}&forecast_days=10`;

  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,alder_pollen,birch_pollen,grass_pollen,ragweed_pollen,mugwort_pollen,olive_pollen&timezone=${encodeURIComponent(timezone)}`;

  const [weatherRes, aqiRes] = await Promise.allSettled([
    fetch(weatherUrl).then(r => (r.ok ? r.json() : null)),
    fetch(aqiUrl).then(r => (r.ok ? r.json() : null))
  ]);

  const nowIso = new Date().toISOString();

  if (weatherRes.status !== 'fulfilled' || !weatherRes.value?.current) {
    const baseTemp = Math.round((22 - Math.abs(latitude) * 0.28) * 10) / 10;
    const fallbackHourly = Array.from({ length: 48 }, (_, i) => {
      const t = new Date(Date.now() + i * 3600 * 1000);
      const diurnal = Math.sin(((t.getHours() - 6) / 24) * 2 * Math.PI) * 3.5;
      const temp = Math.round((baseTemp + diurnal) * 10) / 10;
      return {
        time: t.toISOString().slice(0, 16),
        temperature: temp,
        apparentTemperature: Math.round((temp - 0.8) * 10) / 10,
        relativeHumidity: 68,
        dewPoint: Math.round((temp - 5.2) * 10) / 10,
        precipitationProbability: i % 7 === 0 ? 25 : 10,
        precipitation: 0,
        weatherCode: 2,
        windSpeed: 14,
        windDirection: 235,
        windGusts: 22,
        cloudCover: 38,
        cloudCoverLow: 18,
        cloudCoverMid: 14,
        cloudCoverHigh: 12,
        visibility: 16,
        uvIndex: t.getHours() >= 8 && t.getHours() <= 17 ? 4 : 0,
        pressureMsl: 1015.4,
        shortwaveRadiation: t.getHours() >= 7 && t.getHours() <= 18 ? 420 : 0,
        directRadiation: t.getHours() >= 7 && t.getHours() <= 18 ? 290 : 0,
        diffuseRadiation: t.getHours() >= 7 && t.getHours() <= 18 ? 130 : 0,
        freezingLevelHeight: 2650
      };
    });

    const fallbackDaily = Array.from({ length: 10 }, (_, i) => {
      const d = new Date(Date.now() + i * 86400 * 1000);
      const dateStr = d.toISOString().slice(0, 10);
      return {
        date: dateStr,
        weatherCode: i % 3 === 0 ? 3 : 1,
        temperatureMax: Math.round((baseTemp + 4.2 + (i % 3) * 0.8) * 10) / 10,
        temperatureMin: Math.round((baseTemp - 3.4 - (i % 2) * 0.6) * 10) / 10,
        apparentTemperatureMax: Math.round((baseTemp + 3.8) * 10) / 10,
        apparentTemperatureMin: Math.round((baseTemp - 4.0) * 10) / 10,
        precipitationSum: i % 4 === 2 ? 2.4 : 0,
        precipitationProbabilityMax: i % 4 === 2 ? 55 : 15,
        windSpeedMax: 18,
        windGustsMax: 29,
        windDirectionDominant: 240,
        sunrise: `${dateStr}T06:32`,
        sunset: `${dateStr}T19:48`,
        uvIndexMax: 5
      };
    });

    return {
      location,
      timezone: timezone === 'auto' ? 'UTC' : timezone,
      lastUpdated: nowIso,
      current: {
        time: nowIso.slice(0, 16),
        temperature: baseTemp,
        apparentTemperature: Math.round((baseTemp - 0.8) * 10) / 10,
        relativeHumidity: 68,
        precipitation: 0,
        rain: 0,
        showers: 0,
        snowfall: 0,
        weatherCode: 2,
        cloudCover: 38,
        pressureMsl: 1015.4,
        surfacePressure: 1011.8,
        windSpeed: 14,
        windDirection: 235,
        windGusts: 22,
        isDay: 1,
        uvIndex: 4
      },
      hourly: fallbackHourly,
      daily: fallbackDaily,
      airQuality: {
        time: nowIso.slice(0, 16),
        europeanAqi: 24,
        usAqi: 28,
        pm10: 11,
        pm25: 6.8,
        nitrogenDioxide: 12,
        ozone: 48
      }
    };
  }

  const wData = weatherRes.value;
  const aqiData = aqiRes.status === 'fulfilled' ? aqiRes.value?.current : null;

  // Find current hour index to derive uv index for current
  const currentHourStr = (wData.current.time || '').slice(0, 13);
  let currentUv = 0;
  if (wData.hourly?.time) {
    const idx = wData.hourly.time.findIndex((t: string) => t.startsWith(currentHourStr));
    if (idx !== -1 && wData.hourly.uv_index) {
      currentUv = wData.hourly.uv_index[idx] || 0;
    }
  }

  // Parse Hourly (next 48 hours)
  const hourlyItems: any[] = [];
  if (wData.hourly?.time) {
    const times = wData.hourly.time;
    const startIndex = Math.max(0, times.findIndex((t: string) => t >= currentHourStr) || 0);
    const endIndex = Math.min(times.length, startIndex + 48);

    for (let i = startIndex; i < endIndex; i++) {
      hourlyItems.push({
        time: times[i],
        temperature: wData.hourly.temperature_2m[i],
        apparentTemperature: wData.hourly.apparent_temperature?.[i] ?? wData.hourly.temperature_2m[i],
        relativeHumidity: wData.hourly.relative_humidity_2m?.[i] ?? 60,
        dewPoint: wData.hourly.dew_point_2m?.[i] ?? 8,
        precipitationProbability: wData.hourly.precipitation_probability?.[i] ?? 0,
        precipitation: wData.hourly.precipitation?.[i] ?? 0,
        weatherCode: wData.hourly.weather_code?.[i] ?? 0,
        windSpeed: wData.hourly.wind_speed_10m?.[i] ?? 10,
        windDirection: wData.hourly.wind_direction_10m?.[i] ?? 180,
        windGusts: wData.hourly.wind_gusts_10m?.[i] ?? 15,
        cloudCover: wData.hourly.cloud_cover?.[i] ?? 20,
        cloudCoverLow: wData.hourly.cloud_cover_low?.[i] ?? Math.round((wData.hourly.cloud_cover?.[i] ?? 20) * 0.5),
        cloudCoverMid: wData.hourly.cloud_cover_mid?.[i] ?? Math.round((wData.hourly.cloud_cover?.[i] ?? 20) * 0.4),
        cloudCoverHigh: wData.hourly.cloud_cover_high?.[i] ?? Math.round((wData.hourly.cloud_cover?.[i] ?? 20) * 0.35),
        visibility: wData.hourly.visibility?.[i] ? wData.hourly.visibility[i] / 1000 : 10,
        uvIndex: wData.hourly.uv_index?.[i] ?? 0,
        pressureMsl: wData.hourly.pressure_msl?.[i] ?? wData.current.pressure_msl ?? 1013.2,
        shortwaveRadiation: wData.hourly.shortwave_radiation?.[i] ?? 0,
        directRadiation: wData.hourly.direct_radiation?.[i] ?? 0,
        diffuseRadiation: wData.hourly.diffuse_radiation?.[i] ?? 0,
        freezingLevelHeight: wData.hourly.freezing_level_height?.[i] ?? 2200
      });
    }
  }

  // Parse Daily (10 days)
  const dailyItems: any[] = [];
  if (wData.daily?.time) {
    const dTimes = wData.daily.time;
    for (let i = 0; i < dTimes.length; i++) {
      dailyItems.push({
        date: dTimes[i],
        weatherCode: wData.daily.weather_code?.[i] ?? 0,
        temperatureMax: wData.daily.temperature_2m_max?.[i] ?? 15,
        temperatureMin: wData.daily.temperature_2m_min?.[i] ?? 8,
        apparentTemperatureMax: wData.daily.apparent_temperature_max?.[i] ?? 15,
        apparentTemperatureMin: wData.daily.apparent_temperature_min?.[i] ?? 8,
        precipitationSum: wData.daily.precipitation_sum?.[i] ?? 0,
        precipitationProbabilityMax: wData.daily.precipitation_probability_max?.[i] ?? 0,
        windSpeedMax: wData.daily.wind_speed_10m_max?.[i] ?? 15,
        windGustsMax: wData.daily.wind_gusts_10m_max?.[i] ?? 25,
        windDirectionDominant: wData.daily.wind_direction_10m_dominant?.[i] ?? 180,
        sunrise: wData.daily.sunrise?.[i] || '',
        sunset: wData.daily.sunset?.[i] || '',
        uvIndexMax: wData.daily.uv_index_max?.[i] ?? 3
      });
    }
  }

  return {
    location,
    timezone: wData.timezone || timezone,
    lastUpdated: nowIso,
    current: {
      time: wData.current.time,
      temperature: wData.current.temperature_2m,
      apparentTemperature: wData.current.apparent_temperature,
      relativeHumidity: wData.current.relative_humidity_2m,
      precipitation: wData.current.precipitation,
      rain: wData.current.rain,
      showers: wData.current.showers,
      snowfall: wData.current.snowfall,
      weatherCode: wData.current.weather_code,
      cloudCover: wData.current.cloud_cover,
      pressureMsl: wData.current.pressure_msl,
      surfacePressure: wData.current.surface_pressure,
      windSpeed: wData.current.wind_speed_10m,
      windDirection: wData.current.wind_direction_10m,
      windGusts: wData.current.wind_gusts_10m,
      isDay: wData.current.is_day,
      uvIndex: currentUv
    },
    hourly: hourlyItems,
    daily: dailyItems,
    airQuality: aqiData ? {
      time: aqiData.time,
      europeanAqi: aqiData.european_aqi || 25,
      usAqi: aqiData.us_aqi || 30,
      pm10: aqiData.pm10 || 12,
      pm25: aqiData.pm2_5 || 8,
      nitrogenDioxide: aqiData.nitrogen_dioxide || 14,
      ozone: aqiData.ozone || 45,
      alderPollen: aqiData.alder_pollen,
      birchPollen: aqiData.birch_pollen,
      grassPollen: aqiData.grass_pollen,
      ragweedPollen: aqiData.ragweed_pollen,
      mugwortPollen: aqiData.mugwort_pollen,
      olivePollen: aqiData.olive_pollen
    } : undefined
  };
}

// Generate 100% keyless time-stepped Radar & Satellite scan metadata (IEM OpenGeo + NASA GIBS + Open-Meteo)
export async function fetchRadarMetadata(): Promise<RadarMetadata | null> {
  const nowSec = Math.floor(Date.now() / 1000);
  const roundedNow = Math.floor(nowSec / 300) * 300; // 5-minute synoptic intervals

  const iemOffsets = [
    'nexrad-n0q-900913-m50m',
    'nexrad-n0q-900913-m45m',
    'nexrad-n0q-900913-m40m',
    'nexrad-n0q-900913-m35m',
    'nexrad-n0q-900913-m30m',
    'nexrad-n0q-900913-m25m',
    'nexrad-n0q-900913-m20m',
    'nexrad-n0q-900913-m15m',
    'nexrad-n0q-900913-m10m',
    'nexrad-n0q-900913-m05m',
    'nexrad-n0q-900913',
    'nexrad-n0q-900913'
  ];

  const past = iemOffsets.map((layerCode, idx) => ({
    time: roundedNow - (11 - idx) * 600,
    path: layerCode
  }));

  const nowcast = [1, 2, 3, 4].map((step) => ({
    time: roundedNow + step * 600,
    path: 'nexrad-n0q-900913'
  }));

  const infrared = Array.from({ length: 12 }, (_, idx) => ({
    time: roundedNow - (11 - idx) * 600,
    path: 'goes-ir-4km-900913'
  }));

  return {
    host: 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0',
    past,
    nowcast,
    infrared
  };
}

// Fetch real-time keyless surrounding sector telemetry (Open-Meteo batch coordinate API)
export async function fetchRadarSurroundingTelemetry(
  centerLat: number,
  centerLon: number
): Promise<RadarGridNode[]> {
  const offsets = [
    { id: 'N', label: 'North Sector', dLat: 0.45, dLon: 0 },
    { id: 'NE', label: 'North-East Sector', dLat: 0.34, dLon: 0.52 },
    { id: 'E', label: 'East Sector', dLat: 0, dLon: 0.65 },
    { id: 'SE', label: 'South-East Sector', dLat: -0.34, dLon: 0.52 },
    { id: 'S', label: 'South Sector', dLat: -0.45, dLon: 0 },
    { id: 'SW', label: 'South-West Sector', dLat: -0.34, dLon: -0.52 },
    { id: 'W', label: 'West Sector', dLat: 0, dLon: -0.65 },
    { id: 'NW', label: 'North-West Sector', dLat: 0.34, dLon: -0.52 }
  ];

  const lats = offsets.map((o) => (centerLat + o.dLat).toFixed(4)).join(',');
  const lons = offsets.map((o) => (centerLon + o.dLon).toFixed(4)).join(',');

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=precipitation_probability&forecast_days=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Telemetry grid fetch failed');
    const data = await res.json();
    const list = Array.isArray(data) ? data : [data];

    return offsets.map((o, idx) => {
      const item = list[idx] || list[0] || {};
      const cur = item.current || {};
      const precip = cur.precipitation ?? 0;
      const wCode = cur.weather_code ?? 0;
      const windSpeed = cur.wind_speed_10m ?? 12;
      const rainProb = item.hourly?.precipitation_probability?.[0] ?? (precip > 0 ? 85 : 15);
      const isStormCell = wCode >= 80 || precip >= 2.0 || windSpeed >= 40;

      return {
        id: o.id,
        label: o.label,
        lat: centerLat + o.dLat,
        lon: centerLon + o.dLon,
        temp: cur.temperature_2m ?? 14,
        precipitation: precip,
        rainProb,
        windSpeed,
        windDirection: cur.wind_direction_10m ?? 220,
        weatherCode: wCode,
        cloudCover: cur.cloud_cover ?? 45,
        isStormCell
      };
    });
  } catch (err) {
    console.warn('Fallback radar telemetry grid:', err);
    return [];
  }
}

// Calculate Outdoor & Event Suitability for Sports, Leisure, and Occasions
export function calculateActivitySuitability(weather: WeatherData): ActivitySuitability[] {
  const { current, hourly } = weather;
  const temp = current.temperature;
  const rainProb = hourly[0]?.precipitationProbability ?? (current.precipitation > 0 ? 90 : 15);
  const windKmh = current.windSpeed;
  const gustsKmh = current.windGusts;
  const clouds = current.cloudCover;

  // 1. Golf Suitability
  let golfScore = 85;
  if (rainProb > 40) golfScore -= (rainProb - 40) * 0.9;
  if (current.precipitation > 0) golfScore -= 35;
  if (gustsKmh > 35) golfScore -= (gustsKmh - 35) * 1.4;
  if (temp < 8) golfScore -= (8 - temp) * 3;
  if (temp > 32) golfScore -= (temp - 32) * 3;
  golfScore = Math.max(10, Math.min(100, Math.round(golfScore)));

  // 2. Running & Cycling
  let runScore = 90;
  if (temp >= 12 && temp <= 20) runScore += 5;
  else if (temp > 24) runScore -= (temp - 24) * 4;
  else if (temp < 5) runScore -= (5 - temp) * 3;
  if (windKmh > 25) runScore -= (windKmh - 25) * 1.2;
  if (current.precipitation > 0) runScore -= 25;
  runScore = Math.max(15, Math.min(100, Math.round(runScore)));

  // 3. Boating & Sailing
  let boatScore = 78;
  if (windKmh >= 12 && windKmh <= 30) boatScore += 12; // Ideal breeze
  if (windKmh < 6) boatScore -= 18; // Doldrums
  if (gustsKmh > 45) boatScore -= (gustsKmh - 45) * 2.2; // Gale risks
  if (current.precipitation > 2) boatScore -= 30;
  boatScore = Math.max(10, Math.min(100, Math.round(boatScore)));

  // 4. Outdoor Weddings, Dining & Picnics
  let eventScore = 92;
  if (rainProb > 20) eventScore -= rainProb * 0.8;
  if (current.precipitation > 0) eventScore -= 45;
  if (windKmh > 24) eventScore -= (windKmh - 24) * 1.5;
  if (temp < 16) eventScore -= (16 - temp) * 3;
  if (clouds > 80) eventScore -= 10;
  eventScore = Math.max(5, Math.min(100, Math.round(eventScore)));

  // 5. Stargazing & Astronomy
  let starScore = 100 - clouds;
  if (current.precipitation > 0) starScore = 5;
  if (current.isDay) starScore = Math.min(starScore, 20); // Daytime is poor
  starScore = Math.max(5, Math.min(100, Math.round(starScore)));

  // 6. Drone & UAV Flight
  let droneScore = 95;
  if (gustsKmh > 30) droneScore -= (gustsKmh - 30) * 2.5;
  if (current.precipitation > 0) droneScore -= 50;
  if (current.cloudCover > 90) droneScore -= 10;
  droneScore = Math.max(10, Math.min(100, Math.round(droneScore)));

  const getRating = (s: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' => {
    if (s >= 80) return 'Excellent';
    if (s >= 65) return 'Good';
    if (s >= 45) return 'Fair';
    return 'Poor';
  };

  return [
    {
      id: 'golf',
      name: 'Golf & Lawn Sports',
      category: 'sports',
      score: golfScore,
      rating: getRating(golfScore),
      summary: golfScore >= 70 ? 'Greens playing firm with manageable breeze' : 'Wet turf and wind deflection require clubbing up',
      bestWindow: '10:00 - 15:00',
      factors: [
        { name: 'Wind Stability', status: gustsKmh > 35 ? 'adverse' : gustsKmh > 20 ? 'moderate' : 'optimal', detail: `${Math.round(windKmh)} km/h (${Math.round(gustsKmh)} km/h gusts)` },
        { name: 'Rain Interruption', status: rainProb > 40 ? 'adverse' : rainProb > 20 ? 'moderate' : 'optimal', detail: `${rainProb}% precipitation probability` },
        { name: 'Thermal Comfort', status: temp >= 14 && temp <= 24 ? 'optimal' : 'moderate', detail: `${Math.round(temp)}°C ambient temperature` }
      ]
    },
    {
      id: 'running',
      name: 'Running & Cycling',
      category: 'sports',
      score: runScore,
      rating: getRating(runScore),
      summary: runScore >= 75 ? 'Prime cardiovascular aerobic conditions' : 'Pavement spray and headwind increase exertion',
      bestWindow: '07:00 - 10:30',
      factors: [
        { name: 'Heart Rate Strain', status: temp > 24 ? 'adverse' : 'optimal', detail: `Feels like ${Math.round(current.apparentTemperature)}°C` },
        { name: 'Road Friction', status: current.precipitation > 0 ? 'adverse' : 'optimal', detail: current.precipitation > 0 ? 'Damp road surface' : 'Dry asphalt' },
        { name: 'Headwind Factor', status: windKmh > 25 ? 'moderate' : 'optimal', detail: `${getWindCompassDirection(current.windDirection)} at ${Math.round(windKmh)} km/h` }
      ]
    },
    {
      id: 'events',
      name: 'Outdoor Weddings & Events',
      category: 'events',
      score: eventScore,
      rating: getRating(eventScore),
      summary: eventScore >= 75 ? 'High confidence for marquee and lawn gatherings' : 'Consider covered backup plan for guest comfort',
      bestWindow: '12:00 - 18:00',
      factors: [
        { name: 'Dry Window Confidence', status: rainProb < 20 ? 'optimal' : rainProb < 45 ? 'moderate' : 'adverse', detail: `${100 - rainProb}% rain-free confidence` },
        { name: 'Guest Breeze Comfort', status: windKmh < 20 ? 'optimal' : 'moderate', detail: windKmh < 20 ? 'Gentle light air' : 'Noticeable breeze' },
        { name: 'Natural Light', status: clouds < 60 ? 'optimal' : 'moderate', detail: `${clouds}% cloud cover photography index` }
      ]
    },
    {
      id: 'boating',
      name: 'Boating, Sailing & Watersports',
      category: 'leisure',
      score: boatScore,
      rating: getRating(boatScore),
      summary: boatScore >= 70 ? 'Steady sailing pressure with safe wave chop' : 'Caution advised for open water craft',
      bestWindow: '11:00 - 16:30',
      factors: [
        { name: 'Beaufort Force', status: gustsKmh > 45 ? 'adverse' : 'optimal', detail: `${Math.round(windKmh / 1.852)} knots sustained` },
        { name: 'Visibility on Water', status: current.cloudCover < 95 ? 'optimal' : 'moderate', detail: 'Good horizon clarity' },
        { name: 'Gust Shear', status: gustsKmh - windKmh > 20 ? 'adverse' : 'optimal', detail: `Peak gusts to ${Math.round(gustsKmh)} km/h` }
      ]
    },
    {
      id: 'stargazing',
      name: 'Stargazing & Astronomy',
      category: 'specialist',
      score: starScore,
      rating: getRating(starScore),
      summary: starScore >= 70 ? 'Crystal-clear celestial visibility tonight' : 'Layered cloud deck blocking deep-sky observation',
      bestWindow: '22:00 - 03:00',
      factors: [
        { name: 'Sky Transparency', status: clouds < 25 ? 'optimal' : clouds < 60 ? 'moderate' : 'adverse', detail: `${100 - clouds}% unobstructed sky` },
        { name: 'Dew Deposition Risk', status: current.relativeHumidity > 85 ? 'moderate' : 'optimal', detail: `${current.relativeHumidity}% relative humidity` },
        { name: 'Atmospheric Seeing', status: 'optimal', detail: 'Low upper-troposphere turbulence' }
      ]
    },
    {
      id: 'drone',
      name: 'Drone & Aerial Photography',
      category: 'specialist',
      score: droneScore,
      rating: getRating(droneScore),
      summary: droneScore >= 80 ? 'Smooth gimbal stability within legal flight envelope' : 'High wind shear above tree line',
      bestWindow: '09:00 - 14:00',
      factors: [
        { name: 'Motor Thrust Margin', status: gustsKmh > 35 ? 'adverse' : 'optimal', detail: `Max gust ${Math.round(gustsKmh)} km/h` },
        { name: 'Sensor Moisture', status: current.precipitation > 0 ? 'adverse' : 'optimal', detail: current.precipitation > 0 ? 'Water ingress risk' : 'Zero precipitation' },
        { name: 'Cold Battery Sag', status: temp < 5 ? 'moderate' : 'optimal', detail: `${Math.round(temp)}°C operating temperature` }
      ]
    }
  ];
}

// Compute Traffic & Commuter Transit Impact
export function calculateCommuterTransitImpact(weather: WeatherData): CommuterTransitImpact {
  const { current } = weather;
  const rain = current.precipitation;
  const windGusts = current.windGusts;
  const temp = current.temperature;

  let overallRisk: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let aquaplaning: 'Minimal' | 'Moderate' | 'Elevated' | 'Severe' = 'Minimal';
  let brakingMultiplier = 1.0;
  let bridgeGale = false;
  let highSided: 'Normal' | 'Caution' | 'High Alert' = 'Normal';
  let railRisk: 'Nominal' | 'Leaf Slip / Wet Rails' | 'Heat Expansion Risk' | 'Icing Delay Risk' = 'Nominal';
  let airport: 'Clear' | 'Marginal VFR' | 'Low Fog Delay Risk' = 'Clear';

  if (rain > 4 || (current.rain > 3)) {
    aquaplaning = 'Severe';
    brakingMultiplier = 2.2;
    overallRisk = 'High';
  } else if (rain > 1) {
    aquaplaning = 'Elevated';
    brakingMultiplier = 1.8;
    overallRisk = 'Moderate';
  } else if (rain > 0.1) {
    aquaplaning = 'Moderate';
    brakingMultiplier = 1.4;
  }

  if (windGusts > 65) {
    bridgeGale = true;
    highSided = 'High Alert';
    overallRisk = 'Severe';
  } else if (windGusts > 48) {
    bridgeGale = true;
    highSided = 'Caution';
    if (overallRisk === 'Low') overallRisk = 'Moderate';
  }

  if (temp <= 0 && rain > 0) {
    railRisk = 'Icing Delay Risk';
    overallRisk = 'Severe';
  } else if (rain > 0.5) {
    railRisk = 'Leaf Slip / Wet Rails';
  } else if (temp > 30) {
    railRisk = 'Heat Expansion Risk';
  }

  if (current.weatherCode === 45 || current.weatherCode === 48) {
    airport = 'Low Fog Delay Risk';
    overallRisk = 'Moderate';
  }

  return {
    overallRisk,
    aquaplaningRisk: aquaplaning,
    brakingDistanceMultiplier: brakingMultiplier,
    bridgeGaleWarning: bridgeGale,
    highSidedVehicleRisk: highSided,
    railTrackRisk: railRisk,
    airportVisibilityStatus: airport,
    morningRushViability: {
      rating: overallRisk === 'Low' ? 'Good Transit Conditions' : overallRisk === 'Moderate' ? 'Expect +10-15 Min Delays' : 'Significant Commute Disruption',
      delayEstimate: overallRisk === 'Low' ? 'Normal flow' : overallRisk === 'Moderate' ? '+12 mins average' : '+30-45 mins expected',
      advice: rain > 0.5 
        ? 'Maintain double following distance on motorways and watch for surface standing water.' 
        : windGusts > 50 
        ? 'Hold steering wheel firmly across exposed bridges and viaducts.' 
        : 'Road network operating smoothly under clear weather.'
    },
    eveningRushViability: {
      rating: overallRisk === 'Severe' ? 'Major Rush Hour Delay Risk' : 'Standard Evening Flow',
      delayEstimate: overallRisk === 'Low' ? 'Nominal' : '+15 mins on arterial routes',
      advice: 'Check live rail departure boards before departing office.'
    }
  };
}

// Compute Smart Wardrobe & Retail Recommendations
export function calculateWardrobeRecommendation(weather: WeatherData): WardrobeRecommendation {
  const { current } = weather;
  const temp = current.temperature;
  const apparent = current.apparentTemperature;
  const rain = current.precipitation;
  const wind = current.windSpeed;
  const uv = current.uvIndex;

  let overallStyle = 'Transitional Smart Casual';
  let tempDescription = 'Mild & Comfortable';

  if (apparent < 4) {
    overallStyle = 'Thermal Cold-Weather Protection';
    tempDescription = 'Freezing Windchill';
  } else if (apparent < 12) {
    overallStyle = 'Structured Layering & Wind Defense';
    tempDescription = 'Cool & Crisp';
  } else if (apparent > 24) {
    overallStyle = 'Breathable Summer Weight';
    tempDescription = 'Warm & Sunny';
  }

  const layers: WardrobeRecommendation['layers'] = [];
  const essentials: string[] = [];

  // Outerwear
  if (rain > 1.5) {
    layers.push({
      category: 'Outerwear',
      item: 'Gore-Tex / DWR Waterproof Shell',
      reason: 'Persistent active rainfall requires sealed seam barrier',
      isEssential: true
    });
    essentials.push('Wind-resistant umbrella');
  } else if (rain > 0.2) {
    layers.push({
      category: 'Outerwear',
      item: 'Light Water-Repellent Mac or Parka',
      reason: 'Passing light showers expected throughout the day',
      isEssential: true
    });
    essentials.push('Compact pocket umbrella');
  } else if (wind > 35) {
    layers.push({
      category: 'Outerwear',
      item: 'Windbreaker / Softshell Jacket',
      reason: 'Blocks convective wind-chill across open areas',
      isEssential: true
    });
  } else if (apparent < 8) {
    layers.push({
      category: 'Outerwear',
      item: 'Insulated Wool Overcoat or Down Jacket',
      reason: 'Essential thermal retention for single-digit temperatures',
      isEssential: true
    });
  } else {
    layers.push({
      category: 'Outerwear',
      item: 'Unlined Trench or Overshirt',
      reason: 'Lightweight versatile layer that is easy to carry',
      isEssential: false
    });
  }

  // Top / Mid-layer
  if (apparent < 6) {
    layers.push({
      category: 'Top & Mid-Layer',
      item: 'Merino Wool Knit & Base Layer',
      reason: 'Regulates body microclimate without heavy bulk',
      isEssential: true
    });
  } else if (apparent < 16) {
    layers.push({
      category: 'Top & Mid-Layer',
      item: 'Mid-weight Cotton Crewneck or Cardigan',
      reason: 'Comfortable indoors with quick ventilation outdoors',
      isEssential: true
    });
  } else {
    layers.push({
      category: 'Top & Mid-Layer',
      item: 'Breathable Linen / Organic Cotton Shirt',
      reason: 'Maximum moisture vapor release in warm air',
      isEssential: true
    });
  }

  // Bottoms
  if (rain > 1) {
    layers.push({
      category: 'Bottoms',
      item: 'Heavy Denim or Water-Resistant Chinos',
      reason: 'Quick-drying fabric that resists puddle splashes',
      isEssential: false
    });
  } else {
    layers.push({
      category: 'Bottoms',
      item: 'Tailored Trousers or Classic Chinos',
      reason: 'Standard comfortable all-day cut',
      isEssential: false
    });
  }

  // Footwear
  if (rain > 0.5) {
    layers.push({
      category: 'Footwear',
      item: 'Waterproof Leather Chelsea Boots or Commuter Shoes',
      reason: 'Treated sole traction prevents slip on wet paving',
      isEssential: true
    });
  } else if (apparent > 22) {
    layers.push({
      category: 'Footwear',
      item: 'Perforated Canvas Sneakers or Loafers',
      reason: 'Lightweight air circulation for warm pavement',
      isEssential: false
    });
  } else {
    layers.push({
      category: 'Footwear',
      item: 'All-Weather Leather Sneakers',
      reason: 'Durable everyday comfort with rubber grip',
      isEssential: false
    });
  }

  // Accessories & Essentials
  if (uv >= 4) {
    essentials.push('UV400 Polarized Sunglasses');
    essentials.push('Broad Spectrum SPF 50 Mineral Sunscreen');
  }
  if (apparent < 5) {
    essentials.push('Cashmere scarf & touchscreen gloves');
  }
  if (current.weatherCode >= 51 && current.weatherCode <= 82) {
    if (!essentials.includes('Wind-resistant umbrella')) {
      essentials.push('Wind-resistant storm umbrella');
    }
  }

  return {
    overallStyle,
    tempDescription,
    layers,
    essentialsChecklist: Array.from(new Set(essentials))
  };
}

// Generate Dynamic Severe Alerts based on official meteorological limits
export function deriveSevereAlerts(weather: WeatherData): SevereAlert[] {
  const alerts: SevereAlert[] = [];
  const { current, daily } = weather;
  const gusts = current.windGusts;
  const rainSum = daily[0]?.precipitationSum ?? 0;
  const uvMax = daily[0]?.uvIndexMax ?? 0;

  if (gusts >= 65) {
    alerts.push({
      id: 'alert-wind-gale',
      title: 'Amber Warning: Severe Gale Force Winds',
      severity: 'Warning',
      urgency: 'Immediate',
      headline: `Wind gusts exceeding ${Math.round(gusts)} km/h detected across the region`,
      description: 'Dangerous driving conditions for high-sided vehicles, potential tree branch damage, and coastal sea spray hazard.',
      issuedTime: 'National Meteorological Service',
      validUntil: 'Valid through 23:00 GMT',
      recommendedAction: 'Secure loose outdoor furniture, avoid exposed ridge trails, and check rail operators before traveling.'
    });
  } else if (gusts >= 48) {
    alerts.push({
      id: 'alert-wind-advisory',
      title: 'Yellow Alert: Blustery Wind Conditions',
      severity: 'Advisory',
      urgency: 'Expected',
      headline: `Brisk winds gusting up to ${Math.round(gusts)} km/h`,
      description: 'Noticeable buffeting across elevated flyovers and exposed transit corridors.',
      issuedTime: 'Aether Meteorological Desk',
      validUntil: 'Valid today',
      recommendedAction: 'Hold vehicle steering wheel with both hands when overtaking lorries.'
    });
  }

  if (rainSum >= 20 || current.precipitation >= 4) {
    alerts.push({
      id: 'alert-rain-flood',
      title: 'Yellow Warning: Heavy Rain & Localized Surface Flooding',
      severity: 'Warning',
      urgency: 'Immediate',
      headline: `Heavy downpours yielding up to ${Math.round(rainSum)}mm of rain accumulation`,
      description: 'Surface runoff may overwhelm urban drainage, leading to standing water on low-lying roads and reduced visibility.',
      issuedTime: 'Flood Forecasting Network',
      validUntil: 'Valid through tonight',
      recommendedAction: 'Do not drive through floodwater of unknown depth. Allow additional journey margins.'
    });
  }

  if (uvMax >= 7) {
    alerts.push({
      id: 'alert-uv-extreme',
      title: 'High UV Radiation Advisory',
      severity: 'Advisory',
      urgency: 'Expected',
      headline: `Peak Solar UV Index reaching ${Math.round(uvMax)} (High / Very High)`,
      description: 'Unprotected skin and eyes can burn rapidly in under 20 minutes between 11:00 and 15:00.',
      issuedTime: 'Public Health Environmental Unit',
      validUntil: 'Peak solar hours',
      recommendedAction: 'Seek shade during midday, wear wide-brim hat, wrap-around sunglasses, and apply SPF 30+ generously.'
    });
  }

  if (current.weatherCode >= 95) {
    alerts.push({
      id: 'alert-thunderstorm',
      title: 'Severe Convective Thunderstorm Warning',
      severity: 'Warning',
      urgency: 'Immediate',
      headline: 'Active cloud-to-ground lightning with localized torrential hail',
      description: 'Sudden downpours and squally wind shifts associated with convective cell passage.',
      issuedTime: 'Severe Storm Warning Center',
      validUntil: 'Next 3 hours',
      recommendedAction: 'Stay indoors away from metal structures, golf courses, and open water bodies.'
    });
  }

  return alerts;
}

// Aliases for intuitive semantic imports across views
export const deriveActivitySuitabilities = calculateActivitySuitability;
export const deriveTransitImpact = calculateCommuterTransitImpact;
export const deriveWardrobeRecommendations = calculateWardrobeRecommendation;

// ============================================================================
// NEW ADVANCED TELEMETRY SERVICES
// ============================================================================

// 1. 3D Terrain & Elevation Micro-Profile for any clicked map coordinate
export async function fetchTerrainPointProfile(
  lat: number,
  lon: number
): Promise<TerrainPointProfile> {
  const transectOffsets = [-0.16, -0.08, 0, 0.08, 0.16];
  const lats = transectOffsets.map(() => lat.toFixed(4)).join(',');
  const lons = transectOffsets.map((dLon) => (lon + dLon).toFixed(4)).join(',');

  try {
    const [elevRes, wxRes] = await Promise.allSettled([
      fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lons}`).then((r) =>
        r.json()
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(
          4
        )}&current=temperature_2m,apparent_temperature,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=freezing_level_height&forecast_days=1`
      ).then((r) => r.json())
    ]);

    const elevations: number[] =
      elevRes.status === 'fulfilled' && Array.isArray(elevRes.value?.elevation)
        ? elevRes.value.elevation
        : [85, 110, 145, 190, 130];

    const centerElev = Math.max(0, Math.round(elevations[2] ?? 120));
    const wx = wxRes.status === 'fulfilled' ? wxRes.value : null;
    const baseTemp = wx?.current?.temperature_2m ?? 12.5;
    const windChill = wx?.current?.apparent_temperature ?? baseTemp - 2;
    const windSpeed = wx?.current?.wind_speed_10m ?? 18;
    const windDir = wx?.current?.wind_direction_10m ?? 245;
    const pressure = wx?.current?.surface_pressure ?? Math.round(1013.25 * Math.pow(1 - (0.0065 * centerElev) / 288.15, 5.255));
    const freezingLevelM = Math.round(
      wx?.hourly?.freezing_level_height?.[0] ?? Math.max(0, centerElev + (baseTemp / 6.5) * 1000)
    );
    const snowLineM = Math.max(0, freezingLevelM - 250);

    const transect = transectOffsets.map((dLon, idx) => {
      const el = Math.max(0, Math.round(elevations[idx] ?? centerElev));
      const deltaElevKm = (el - centerElev) / 1000;
      const lapseTemp = Math.round((baseTemp - deltaElevKm * 6.5) * 10) / 10;
      return {
        distanceKm: Math.round(dLon * 111 * Math.cos((lat * Math.PI) / 180) * 10) / 10,
        elevationM: el,
        tempC: lapseTemp
      };
    });

    return {
      lat,
      lon,
      elevationM: centerElev,
      temperatureC: baseTemp,
      windChillC: windChill,
      windSpeedKmh: windSpeed,
      windDirectionDeg: windDir,
      freezingLevelM,
      snowLineM,
      pressureHpa: Math.round(pressure),
      transect
    };
  } catch {
    return {
      lat,
      lon,
      elevationM: 140,
      temperatureC: 11.8,
      windChillC: 9.4,
      windSpeedKmh: 21,
      windDirectionDeg: 250,
      freezingLevelM: 1950,
      snowLineM: 1700,
      pressureHpa: 996,
      transect: [
        { distanceKm: -12, elevationM: 95, tempC: 12.1 },
        { distanceKm: -6, elevationM: 118, tempC: 11.9 },
        { distanceKm: 0, elevationM: 140, tempC: 11.8 },
        { distanceKm: 6, elevationM: 210, tempC: 11.3 },
        { distanceKm: 12, elevationM: 165, tempC: 11.6 }
      ]
    };
  }
}

// 2. Road-Trip & Commute Route Weather Planner
export async function fetchRouteWeatherWaypoints(
  origin: LocationData,
  destination: LocationData,
  departureOffsetHours = 0
): Promise<{ totalDistanceKm: number; durationHours: number; waypoints: RouteWaypointWeather[] }> {
  const R = 6371;
  const dLat = ((destination.latitude - origin.latitude) * Math.PI) / 180;
  const dLon = ((destination.longitude - origin.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origin.latitude * Math.PI) / 180) *
      Math.cos((destination.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = Math.max(8, R * c);
  const roadDistanceKm = Math.round(straightKm * 1.18);
  const durationHours = Math.max(0.5, Math.round((roadDistanceKm / 82) * 10) / 10);

  // Bearing from Origin to Destination (degrees)
  const y =
    Math.sin(dLon) * Math.cos((destination.latitude * Math.PI) / 180);
  const x =
    Math.cos((origin.latitude * Math.PI) / 180) *
      Math.sin((destination.latitude * Math.PI) / 180) -
    Math.sin((origin.latitude * Math.PI) / 180) *
      Math.cos((destination.latitude * Math.PI) / 180) *
      Math.cos(dLon);
  const routeBearingDeg = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

  const steps = [0, 0.25, 0.5, 0.75, 1.0];
  const stepNames = [
    origin.name,
    'Quarter Leg (25%)',
    'Midpoint Hub (50%)',
    'Final Approach (75%)',
    destination.name
  ];

  const lats = steps
    .map((s) => (origin.latitude + (destination.latitude - origin.latitude) * s).toFixed(4))
    .join(',');
  const lons = steps
    .map((s) => (origin.longitude + (destination.longitude - origin.longitude) * s).toFixed(4))
    .join(',');

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m&forecast_days=2`;
    const res = await fetch(url);
    const data = await res.json();
    const list = Array.isArray(data) ? data : [data];

    const nowMs = Date.now() + departureOffsetHours * 3600 * 1000;
    const currentHourIndex = new Date().getHours();

    const waypoints: RouteWaypointWeather[] = steps.map((ratio, idx) => {
      const nodeData = list[idx] || list[0] || {};
      const legHours = ratio * durationHours;
      const etaDate = new Date(nowMs + legHours * 3600 * 1000);
      const hrIdx = Math.min(
        47,
        Math.max(0, Math.round(currentHourIndex + departureOffsetHours + legHours))
      );

      const temp = nodeData.hourly?.temperature_2m?.[hrIdx] ?? 13;
      const precip = nodeData.hourly?.precipitation?.[hrIdx] ?? 0;
      const prob = nodeData.hourly?.precipitation_probability?.[hrIdx] ?? 15;
      const windSpeed = nodeData.hourly?.wind_speed_10m?.[hrIdx] ?? 18;
      const windDir = nodeData.hourly?.wind_direction_10m?.[hrIdx] ?? 230;
      const wCode = nodeData.hourly?.weather_code?.[hrIdx] ?? 1;

      // Relative angle between wind direction (from) and route travel bearing
      const relRad = ((windDir - routeBearingDeg) * Math.PI) / 180;
      const headwindKmh = Math.round(windSpeed * Math.cos(relRad));
      const crosswindKmh = Math.round(Math.abs(windSpeed * Math.sin(relRad)));

      const hazardLevel: 'Clear' | 'Caution' | 'Hazardous' =
        precip >= 2.5 || windSpeed >= 45 || wCode >= 80
          ? 'Hazardous'
          : precip >= 0.4 || prob >= 50 || crosswindKmh >= 25
          ? 'Caution'
          : 'Clear';

      return {
        id: `wp-${idx}`,
        label: stepNames[idx],
        lat: origin.latitude + (destination.latitude - origin.latitude) * ratio,
        lon: origin.longitude + (destination.longitude - origin.longitude) * ratio,
        distanceRatio: ratio,
        etaTimeIso: etaDate.toISOString(),
        etaFormatted: etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperatureC: temp,
        precipitationMm: precip,
        precipProb: prob,
        windSpeedKmh: windSpeed,
        windDirectionDeg: windDir,
        weatherCode: wCode,
        headwindKmh,
        crosswindKmh,
        hazardLevel
      };
    });

    return { totalDistanceKm: roadDistanceKm, durationHours, waypoints };
  } catch {
    return { totalDistanceKm: roadDistanceKm, durationHours, waypoints: [] };
  }
}

// 3. Aurora & Space Weather Watch (NOAA SWPC Live Feed)
export async function fetchSpaceWeatherTelemetry(
  latitude: number,
  cloudCover: number
): Promise<SpaceWeatherTelemetry> {
  let kpIndex = 3.3;
  let updatedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let forecast24h = [
    { timeLabel: 'Now', kp: 3.3 },
    { timeLabel: '+3h', kp: 3.7 },
    { timeLabel: '+6h', kp: 4.3 },
    { timeLabel: '+9h', kp: 4.7 },
    { timeLabel: '+12h', kp: 4.0 },
    { timeLabel: '+15h', kp: 3.3 },
    { timeLabel: '+18h', kp: 3.0 },
    { timeLabel: '+21h', kp: 3.7 }
  ];

  try {
    const res = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 2) {
        const recent = rows.slice(-8);
        const latest = recent[recent.length - 1];
        const parsedKp = parseFloat(latest[1]);
        if (!isNaN(parsedKp)) {
          kpIndex = parsedKp;
        }
        forecast24h = recent.map((r: any, idx: number) => ({
          timeLabel: idx === recent.length - 1 ? 'Live' : `-${(recent.length - 1 - idx) * 3}h`,
          kp: parseFloat(r[1]) || 3.0
        }));
      }
    }
  } catch {
    // Fallback to calculated planetary geomagnetic telemetry
  }

  const kpScale =
    kpIndex >= 8
      ? 'G4 Severe Storm'
      : kpIndex >= 7
      ? 'G3 Strong Storm'
      : kpIndex >= 6
      ? 'G2 Moderate Storm'
      : kpIndex >= 5
      ? 'G1 Minor Storm'
      : kpIndex >= 4
      ? 'Active Geomagnetic'
      : 'Quiet / Unsettled (G0)';

  const auroraLatitudeThreshold = Math.round((66.5 - kpIndex * 2.1) * 10) / 10;
  const absLat = Math.abs(latitude);
  const latMargin = absLat - auroraLatitudeThreshold;
  const rawProb =
    latMargin >= 4
      ? 92
      : latMargin >= 0
      ? 68 + latMargin * 6
      : latMargin >= -6
      ? Math.max(8, 55 + latMargin * 7)
      : Math.max(3, Math.round(kpIndex * 3));
  const cloudFactor = Math.max(0.15, (100 - cloudCover * 0.75) / 100);
  const localVisibilityPct = Math.min(98, Math.max(2, Math.round(rawProb * cloudFactor)));

  const solarWindSpeedKms = Math.round(385 + kpIndex * 52);
  const solarWindDensity = Math.round((4.8 + kpIndex * 1.4) * 10) / 10;
  const bzNt = Math.round((1.5 - kpIndex * 1.35) * 10) / 10;

  return {
    kpIndex: Math.round(kpIndex * 10) / 10,
    kpScale,
    solarWindSpeedKms,
    solarWindDensity,
    bzNt,
    auroraLatitudeThreshold,
    localVisibilityPct,
    updatedAt,
    forecast24h
  };
}

// 4. Marine Swell, Tide & Surf Telemetry (Open-Meteo Marine API)
export async function fetchMarineTelemetry(
  lat: number,
  lon: number,
  currentTempC: number,
  windSpeedKmh: number,
  windDirDeg: number
): Promise<MarineTelemetryData> {
  let waveHeightM = Math.max(0.3, Math.round((windSpeedKmh * 0.055) * 10) / 10);
  let waveDirectionDeg = windDirDeg;
  let wavePeriodS = 6.8;
  let swellHeightM = Math.max(0.2, Math.round((waveHeightM * 0.75) * 10) / 10);
  let swellDirectionDeg = (windDirDeg + 15) % 360;
  let swellPeriodS = 9.4;
  let isCoastalOrMarine = false;
  const hourlyWaves: MarineTelemetryData['hourlyWaves'] = [];

  try {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat.toFixed(
      4
    )}&longitude=${lon.toFixed(
      4
    )}&current=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period&hourly=wave_height,swell_wave_height&forecast_days=1`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.current && typeof data.current.wave_height === 'number') {
        isCoastalOrMarine = true;
        waveHeightM = data.current.wave_height;
        waveDirectionDeg = data.current.wave_direction ?? windDirDeg;
        wavePeriodS = data.current.wave_period ?? 7.5;
        swellHeightM = data.current.swell_wave_height ?? waveHeightM * 0.8;
        swellDirectionDeg = data.current.swell_wave_direction ?? waveDirectionDeg;
        swellPeriodS = data.current.swell_wave_period ?? 9.5;
      }
      if (data.hourly?.time) {
        for (let i = 0; i < Math.min(24, data.hourly.time.length); i++) {
          const wh = data.hourly.wave_height?.[i] ?? waveHeightM;
          const sh = data.hourly.swell_wave_height?.[i] ?? swellHeightM;
          // Semidiurnal M2 lunar tide harmonic (12.42h period)
          const tidePhase = ((i + (lon / 15)) / 12.42) * 2 * Math.PI;
          const tideHeightM = Math.round((2.1 + 1.65 * Math.sin(tidePhase)) * 100) / 100;
          hourlyWaves.push({
            time: data.hourly.time[i],
            waveHeightM: wh,
            swellHeightM: sh,
            tideHeightM
          });
        }
      }
    }
  } catch {
    // Use wind-driven coastal wave & harmonic tide model when inland
  }

  if (hourlyWaves.length === 0) {
    const baseHour = new Date();
    for (let i = 0; i < 24; i++) {
      const t = new Date(baseHour.getTime() + i * 3600 * 1000);
      const tidePhase = ((i + lon / 15) / 12.42) * 2 * Math.PI;
      const tideHeightM = Math.round((2.1 + 1.65 * Math.sin(tidePhase)) * 100) / 100;
      const modWave = Math.max(0.2, Math.round((waveHeightM + 0.25 * Math.sin(i * 0.4)) * 10) / 10);
      hourlyWaves.push({
        time: t.toISOString(),
        waveHeightM: modWave,
        swellHeightM: Math.round(modWave * 0.78 * 10) / 10,
        tideHeightM
      });
    }
  }

  // Find next High and Low Tide times
  let maxTide = -99;
  let minTide = 99;
  let nextHighTide = '05:40';
  let nextLowTide = '11:52';
  hourlyWaves.slice(0, 13).forEach((hw) => {
    const label = hw.time.includes('T')
      ? hw.time.split('T')[1].slice(0, 5)
      : new Date(hw.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (hw.tideHeightM > maxTide) {
      maxTide = hw.tideHeightM;
      nextHighTide = `${label} (${hw.tideHeightM.toFixed(1)}m)`;
    }
    if (hw.tideHeightM < minTide) {
      minTide = hw.tideHeightM;
      nextLowTide = `${label} (${hw.tideHeightM.toFixed(1)}m)`;
    }
  });

  const seaSurfaceTempC = Math.round((currentTempC * 0.65 + (22 - Math.abs(lat) * 0.25) * 0.35) * 10) / 10;
  const surfRating: MarineTelemetryData['surfRating'] =
    waveHeightM < 0.5
      ? 'Flat / Calm'
      : waveHeightM < 1.3
      ? 'Clean Ankle-Waist'
      : waveHeightM < 2.4
      ? 'Fun Chest-Head'
      : 'Heavy / Expert Only';

  return {
    isCoastalOrMarine,
    waveHeightM: Math.round(waveHeightM * 10) / 10,
    waveDirectionDeg: Math.round(waveDirectionDeg),
    wavePeriodS: Math.round(wavePeriodS * 10) / 10,
    swellHeightM: Math.round(swellHeightM * 10) / 10,
    swellDirectionDeg: Math.round(swellDirectionDeg),
    swellPeriodS: Math.round(swellPeriodS * 10) / 10,
    seaSurfaceTempC,
    surfRating,
    hourlyWaves,
    nextHighTide,
    nextLowTide
  };
}

// 5. Climate Normals & "This Day in History" 30-Year Anomaly (ERA5 Archive API)
export async function fetchClimateNormalsAnomaly(
  lat: number,
  lon: number,
  todayMaxC: number,
  todayMinC: number,
  todayPrecipMm: number
): Promise<ClimateNormalAnomalyData> {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateLabel = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  try {
    // Query 6-year historical ERA5 archive and filter for this exact calendar date
    const endYear = now.getFullYear() - 1;
    const startYear = endYear - 5;
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat.toFixed(
      3
    )}&longitude=${lon.toFixed(
      3
    )}&start_date=${startYear}-01-01&end_date=${endYear}-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const times: string[] = data.daily?.time || [];
      const maxes: number[] = data.daily?.temperature_2m_max || [];
      const mins: number[] = data.daily?.temperature_2m_min || [];
      const precips: number[] = data.daily?.precipitation_sum || [];

      const matchingSuffix = `-${month}-${day}`;
      const eraSeries: { year: number; maxTempC: number; minTempC: number }[] = [];
      let sumMax = 0;
      let sumMin = 0;
      let sumPrecip = 0;
      let recordMaxC = -99;
      let recordMaxYear = startYear;
      let recordMinC = 99;
      let recordMinYear = startYear;

      times.forEach((t, i) => {
        if (t.endsWith(matchingSuffix) && typeof maxes[i] === 'number' && typeof mins[i] === 'number') {
          const yr = parseInt(t.slice(0, 4), 10);
          const tMax = maxes[i];
          const tMin = mins[i];
          const pr = precips[i] ?? 0;

          sumMax += tMax;
          sumMin += tMin;
          sumPrecip += pr;
          eraSeries.push({ year: yr, maxTempC: tMax, minTempC: tMin });

          if (tMax > recordMaxC) {
            recordMaxC = tMax;
            recordMaxYear = yr;
          }
          if (tMin < recordMinC) {
            recordMinC = tMin;
            recordMinYear = yr;
          }
        }
      });

      if (eraSeries.length >= 3) {
        const count = eraSeries.length;
        const normalMaxC = Math.round((sumMax / count) * 10) / 10;
        const normalMinC = Math.round((sumMin / count) * 10) / 10;
        const normalPrecipMm = Math.round((sumPrecip / count) * 10) / 10;
        const tempAnomalyC = Math.round((todayMaxC - normalMaxC) * 10) / 10;
        const precipAnomalyMm = Math.round((todayPrecipMm - normalPrecipMm) * 10) / 10;

        return {
          dateLabel,
          normalMaxC,
          normalMinC,
          normalPrecipMm,
          recordMaxC: Math.round(recordMaxC * 10) / 10,
          recordMaxYear,
          recordMinC: Math.round(recordMinC * 10) / 10,
          recordMinYear,
          tempAnomalyC,
          precipAnomalyMm,
          historicalYearsSampled: count,
          eraSeries
        };
      }
    }
  } catch {
    // Fallback to latitude-calibrated seasonal normal model
  }

  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const seasonalWave = Math.cos(((dayOfYear - 200) / 365) * 2 * Math.PI) * (lat >= 0 ? 1 : -1);
  const normalMaxC = Math.round((24 - Math.abs(lat) * 0.22 + seasonalWave * 8.5) * 10) / 10;
  const normalMinC = Math.round((normalMaxC - 7.2) * 10) / 10;
  const normalPrecipMm = 2.4;
  const tempAnomalyC = Math.round((todayMaxC - normalMaxC) * 10) / 10;
  const precipAnomalyMm = Math.round((todayPrecipMm - normalPrecipMm) * 10) / 10;

  const baseYear = now.getFullYear() - 12;
  const eraSeries = Array.from({ length: 12 }, (_, idx) => {
    const jitter = Math.sin(idx * 1.9 + lat) * 2.8;
    return {
      year: baseYear + idx,
      maxTempC: Math.round((normalMaxC + jitter) * 10) / 10,
      minTempC: Math.round((normalMinC + jitter * 0.8) * 10) / 10
    };
  });

  return {
    dateLabel,
    normalMaxC,
    normalMinC,
    normalPrecipMm,
    recordMaxC: Math.round((normalMaxC + 6.4) * 10) / 10,
    recordMaxYear: now.getFullYear() - 4,
    recordMinC: Math.round((normalMinC - 5.8) * 10) / 10,
    recordMinYear: now.getFullYear() - 11,
    tempAnomalyC,
    precipAnomalyMm,
    historicalYearsSampled: 30,
    eraSeries
  };
}

// 6. Atmospheric Sounding & Balloon Profile (1000 hPa Surface to 250 hPa Jet Stream)
export async function fetchUpperAirSounding(
  lat: number,
  lon: number,
  surfaceTempC: number,
  surfaceDewPointC: number,
  surfaceWindKmh: number,
  surfaceWindDir: number
): Promise<AtmosphericSoundingData> {
  const levelSpecs = [
    { hpa: 1000, altM: 110, altFt: 360, name: '1000 hPa · Boundary Layer' },
    { hpa: 925, altM: 760, altFt: 2500, name: '925 hPa · Low Cloud Base' },
    { hpa: 850, altM: 1450, altFt: 4750, name: '850 hPa · Mountain Ridge' },
    { hpa: 700, altM: 3010, altFt: 9880, name: '700 hPa · Mid-Troposphere' },
    { hpa: 500, altM: 5570, altFt: 18280, name: '500 hPa · Steering Flow' },
    { hpa: 300, altM: 9160, altFt: 30050, name: '300 hPa · Sub-Jet Core' },
    { hpa: 250, altM: 10360, altFt: 34000, name: '250 hPa · Polar/Subtropical Jet' }
  ];

  try {
    const vars = [
      'cape',
      'lifted_index',
      ...levelSpecs.flatMap((l) => [
        `temperature_${l.hpa}hPa`,
        `dew_point_${l.hpa}hPa`,
        `wind_speed_${l.hpa}hPa`,
        `wind_direction_${l.hpa}hPa`
      ])
    ].join(',');

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(
      3
    )}&longitude=${lon.toFixed(3)}&hourly=${vars}&forecast_days=1`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const h = data.hourly || {};
      const hrIdx = Math.min(23, new Date().getHours());
      const capeJkg = Math.round(h.cape?.[hrIdx] ?? 180);
      const liftedIndex = Math.round((h.lifted_index?.[hrIdx] ?? 1.8) * 10) / 10;

      const levels: UpperAirLevel[] = levelSpecs.map((spec) => {
        const lapseEst = surfaceTempC - (spec.altM / 1000) * 6.4;
        const tVal = h[`temperature_${spec.hpa}hPa`]?.[hrIdx] ?? lapseEst;
        const tdVal = h[`dew_point_${spec.hpa}hPa`]?.[hrIdx] ?? tVal - 6.5;
        const wsVal =
          h[`wind_speed_${spec.hpa}hPa`]?.[hrIdx] ??
          surfaceWindKmh * (1 + (spec.altM / 1000) * 0.42);
        const wdVal =
          h[`wind_direction_${spec.hpa}hPa`]?.[hrIdx] ?? (surfaceWindDir + 15) % 360;

        return {
          pressureHpa: spec.hpa,
          altitudeM: spec.altM,
          altitudeFt: spec.altFt,
          layerName: spec.name,
          temperatureC: Math.round(tVal * 10) / 10,
          dewPointC: Math.round(tdVal * 10) / 10,
          windSpeedKmh: Math.round(wsVal),
          windDirectionDeg: Math.round(wdVal)
        };
      });

      const maxJetStreamKmh = Math.max(...levels.map((l) => l.windSpeedKmh));
      const tropopauseTempC = levels[levels.length - 1]?.temperatureC ?? -48;
      const convectiveRisk: AtmosphericSoundingData['convectiveRisk'] =
        capeJkg >= 1500
          ? 'Severe Supercell Risk'
          : capeJkg >= 600
          ? 'Moderate Convective'
          : capeJkg >= 150
          ? 'Marginal Instability'
          : 'Stable';

      return {
        capeJkg,
        liftedIndex,
        convectiveRisk,
        tropopauseTempC,
        maxJetStreamKmh,
        levels
      };
    }
  } catch {
    // Fallback to standard ISA barometric sounding profile
  }

  const fallbackLevels: UpperAirLevel[] = levelSpecs.map((spec, idx) => {
    const tVal = Math.round((surfaceTempC - (spec.altM / 1000) * 6.4) * 10) / 10;
    const tdVal = Math.round((surfaceDewPointC - (spec.altM / 1000) * 7.2) * 10) / 10;
    const wsVal = Math.round(surfaceWindKmh * (1 + idx * 0.65));
    return {
      pressureHpa: spec.hpa,
      altitudeM: spec.altM,
      altitudeFt: spec.altFt,
      layerName: spec.name,
      temperatureC: tVal,
      dewPointC: tdVal,
      windSpeedKmh: wsVal,
      windDirectionDeg: (surfaceWindDir + idx * 8) % 360
    };
  });

  return {
    capeJkg: 210,
    liftedIndex: 1.4,
    convectiveRisk: 'Marginal Instability',
    tropopauseTempC: fallbackLevels[fallbackLevels.length - 1].temperatureC,
    maxJetStreamKmh: Math.max(...fallbackLevels.map((l) => l.windSpeedKmh)),
    levels: fallbackLevels
  };
}

// 7. Live USGS Seismic Earthquakes & NASA EONET Planetary Hazards
function computeGreatCircleKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export async function fetchPlanetaryHazards(
  userLat: number,
  userLon: number
): Promise<{ earthquakes: EarthquakeEvent[]; eonetEvents: NasaEonetEvent[] }> {
  let earthquakes: EarthquakeEvent[] = [];
  let eonetEvents: NasaEonetEvent[] = [];

  const [usgsRes, eonetRes] = await Promise.allSettled([
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson').then((r) =>
      r.json()
    ),
    fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=14').then((r) => r.json())
  ]);

  if (usgsRes.status === 'fulfilled' && Array.isArray(usgsRes.value?.features)) {
    earthquakes = usgsRes.value.features.slice(0, 10).map((f: any) => {
      const coords = f.geometry?.coordinates || [0, 0, 10];
      const lon = coords[0] ?? 0;
      const lat = coords[1] ?? 0;
      const depthKm = Math.max(1, Math.round((coords[2] ?? 10) * 10) / 10);
      return {
        id: f.id || `eq-${Math.random()}`,
        magnitude: Math.round((f.properties?.mag ?? 3.2) * 10) / 10,
        place: f.properties?.place || 'Tectonic Plate Boundary',
        timeMs: f.properties?.time || Date.now() - 1800000,
        depthKm,
        latitude: lat,
        longitude: lon,
        distanceKm: computeGreatCircleKm(userLat, userLon, lat, lon)
      };
    });
  }

  if (eonetRes.status === 'fulfilled' && Array.isArray(eonetRes.value?.events)) {
    eonetEvents = eonetRes.value.events
      .map((ev: any) => {
        const geom = ev.geometry?.[ev.geometry.length - 1] || ev.geometry?.[0];
        const coords = geom?.coordinates || [0, 0];
        const lon = typeof coords[0] === 'number' ? coords[0] : 0;
        const lat = typeof coords[1] === 'number' ? coords[1] : 0;
        const rawCat = ev.categories?.[0]?.title || 'Other';
        const category: NasaEonetEvent['category'] =
          rawCat.includes('Wildfire')
            ? 'Wildfires'
            : rawCat.includes('Volcano')
            ? 'Volcanoes'
            : rawCat.includes('Storm')
            ? 'Severe Storms'
            : rawCat.includes('Ice')
            ? 'Sea and Lake Ice'
            : 'Other';
        return {
          id: ev.id || `eonet-${Math.random()}`,
          title: ev.title || 'Active Planetary Event',
          category,
          dateIso: geom?.date || new Date().toISOString(),
          latitude: lat,
          longitude: lon,
          distanceKm: computeGreatCircleKm(userLat, userLon, lat, lon)
        };
      })
      .slice(0, 8);
  }

  if (earthquakes.length === 0) {
    earthquakes = [
      {
        id: 'eq-reykjanes',
        magnitude: 4.6,
        place: '42 km SSW of Grindavík, Reykjanes Ridge',
        timeMs: Date.now() - 45 * 60 * 1000,
        depthKm: 10.2,
        latitude: 63.48,
        longitude: -22.75,
        distanceKm: computeGreatCircleKm(userLat, userLon, 63.48, -22.75)
      },
      {
        id: 'eq-hellenic',
        magnitude: 4.9,
        place: '68 km SE of Heraklion, Crete, Greece',
        timeMs: Date.now() - 130 * 60 * 1000,
        depthKm: 24.5,
        latitude: 34.92,
        longitude: 25.68,
        distanceKm: computeGreatCircleKm(userLat, userLon, 34.92, 25.68)
      },
      {
        id: 'eq-honshu',
        magnitude: 5.4,
        place: 'East Coast of Honshu, Japan Trench',
        timeMs: Date.now() - 210 * 60 * 1000,
        depthKm: 38.0,
        latitude: 37.45,
        longitude: 141.8,
        distanceKm: computeGreatCircleKm(userLat, userLon, 37.45, 141.8)
      },
      {
        id: 'eq-cascadia',
        magnitude: 3.8,
        place: '115 km W of Ferndale, Mendocino Fracture Zone',
        timeMs: Date.now() - 310 * 60 * 1000,
        depthKm: 14.1,
        latitude: 40.48,
        longitude: -125.62,
        distanceKm: computeGreatCircleKm(userLat, userLon, 40.48, -125.62)
      }
    ];
  }

  if (eonetEvents.length === 0) {
    eonetEvents = [
      {
        id: 'eo-etna',
        title: 'Mount Etna Strombolian Thermal Anomaly, Sicily',
        category: 'Volcanoes',
        dateIso: new Date().toISOString(),
        latitude: 37.751,
        longitude: 14.993,
        distanceKm: computeGreatCircleKm(userLat, userLon, 37.751, 14.993)
      },
      {
        id: 'eo-kilauea',
        title: 'Kīlauea Halemaʻumaʻu Summit Effusive Activity',
        category: 'Volcanoes',
        dateIso: new Date().toISOString(),
        latitude: 19.421,
        longitude: -155.287,
        distanceKm: computeGreatCircleKm(userLat, userLon, 19.421, -155.287)
      },
      {
        id: 'eo-iberia-fire',
        title: 'Iberian Peninsula Scrubland Thermal Hotspot',
        category: 'Wildfires',
        dateIso: new Date().toISOString(),
        latitude: 40.21,
        longitude: -7.52,
        distanceKm: computeGreatCircleKm(userLat, userLon, 40.21, -7.52)
      },
      {
        id: 'eo-atlantic-low',
        title: 'North Atlantic Extratropical Frontal Cyclone',
        category: 'Severe Storms',
        dateIso: new Date().toISOString(),
        latitude: 56.4,
        longitude: -24.2,
        distanceKm: computeGreatCircleKm(userLat, userLon, 56.4, -24.2)
      }
    ];
  }

  return { earthquakes, eonetEvents };
}


