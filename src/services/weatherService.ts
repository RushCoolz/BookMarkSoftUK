import { 
  WeatherData, 
  LocationData, 
  RadarMetadata, 
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

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=${encodeURIComponent(timezone)}&forecast_days=10`;

  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,alder_pollen,birch_pollen,grass_pollen,ragweed_pollen,mugwort_pollen,olive_pollen&timezone=${encodeURIComponent(timezone)}`;

  const [weatherRes, aqiRes] = await Promise.allSettled([
    fetch(weatherUrl).then(r => r.json()),
    fetch(aqiUrl).then(r => r.json())
  ]);

  if (weatherRes.status !== 'fulfilled' || !weatherRes.value?.current) {
    throw new Error('Failed to retrieve forecast data.');
  }

  const wData = weatherRes.value;
  const aqiData = aqiRes.status === 'fulfilled' ? aqiRes.value?.current : null;

  const nowIso = new Date().toISOString();

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
        visibility: wData.hourly.visibility?.[i] ? wData.hourly.visibility[i] / 1000 : 10,
        uvIndex: wData.hourly.uv_index?.[i] ?? 0
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

// Fetch RainViewer Radar metadata for high-res animated precipitation tiles
export async function fetchRadarMetadata(): Promise<RadarMetadata | null> {
  try {
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
    if (!res.ok) throw new Error('Failed to load radar maps');
    const data = await res.json();
    return {
      host: data.host || 'https://tilecache.rainviewer.com',
      past: (data.radar?.past || []).slice(-8), // Last 8 scans (last 80 mins)
      nowcast: (data.radar?.nowcast || []).slice(0, 4) // Next 30 mins
    };
  } catch (err) {
    console.error('Radar metadata error:', err);
    return null;
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
