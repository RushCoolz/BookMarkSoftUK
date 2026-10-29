import React, { createContext, useContext, useState } from 'react';
import { WeatherThemeConfig, WeatherThemeId } from '../types/weatherTheme';
import { WEATHER_THEMES, DEFAULT_WEATHER_THEME_ID, getWeatherTheme } from '../config/weatherThemes';

export interface AutoThemeWeatherInput {
  weatherCode: number;
  temperatureC: number;
  isDay: number;
  currentTimeIso?: string;
  sunriseIso?: string;
  sunsetIso?: string;
  latitude?: number;
}

/**
 * Computes the ideal illustrated world theme for a city's real-time local sky,
 * solar twilight window, temperature, and WMO weather code.
 */
export function computeAutoThemeForWeather(input: AutoThemeWeatherInput): WeatherThemeId {
  const { weatherCode, temperatureC, isDay, currentTimeIso, sunriseIso, sunsetIso, latitude = 45 } = input;

  // 1. Freezing / Snow / Sub-zero conditions -> Alpine Frost
  const isSnowCode = [71, 73, 75, 77, 85, 86, 56, 57, 66, 67].includes(weatherCode);
  if (isSnowCode || temperatureC <= 2) {
    return 'alpine-frost';
  }

  // 2. Check if within Golden Hour window (±70 mins of sunrise or sunset)
  if (currentTimeIso && sunriseIso && sunsetIso) {
    const parseMinutes = (iso: string) => {
      const timePart = iso.includes('T') ? iso.split('T')[1] : iso;
      const [h, m] = timePart.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) return h * 60 + m;
      return null;
    };
    const currMin = parseMinutes(currentTimeIso);
    const riseMin = parseMinutes(sunriseIso);
    const setMin = parseMinutes(sunsetIso);

    if (currMin !== null && riseMin !== null && setMin !== null) {
      const distSunrise = Math.abs(currMin - riseMin);
      const distSunset = Math.abs(currMin - setMin);
      if (distSunrise <= 65 || distSunset <= 75) {
        return 'golden-hour';
      }
    }
  }

  // 3. Rain, Drizzle, or Overcast Twilight -> Shinkai Twilight
  const isRainOrFog = [45, 48, 51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode);
  if (isRainOrFog) {
    return 'shinkai';
  }

  // 4. Thunderstorms or High-Latitude Night -> Cyber Aurora
  const isStorm = [95, 96, 99].includes(weatherCode);
  if (isStorm || (!isDay && Math.abs(latitude) >= 55)) {
    return 'cyber-aurora';
  }

  // 5. Nighttime -> Celestial Noir (clear/partly cloudy) or Shinkai Twilight (cloudy)
  if (!isDay) {
    return weatherCode >= 3 ? 'shinkai' : 'celestial-noir';
  }

  // 6. Daytime -> Ghibli Meadow on clear/partly cloudy, or Shinkai if overcast
  if (weatherCode <= 2) {
    return 'ghibli';
  }

  return 'shinkai';
}

interface WeatherThemeContextType {
  currentThemeId: WeatherThemeId;
  theme: WeatherThemeConfig;
  setThemeId: (id: WeatherThemeId, disableAuto?: boolean) => void;
  availableThemes: WeatherThemeConfig[];
  isThemePickerOpen: boolean;
  openThemePicker: () => void;
  closeThemePicker: () => void;
  isAutoThemeSync: boolean;
  setAutoThemeSync: (enabled: boolean) => void;
  syncThemeWithWeather: (input: AutoThemeWeatherInput) => void;
}

const WeatherThemeContext = createContext<WeatherThemeContextType | undefined>(undefined);

export function WeatherThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeId, setCurrentThemeIdState] = useState<WeatherThemeId>(() => {
    try {
      const saved = localStorage.getItem('aether_weather_theme');
      if (saved && saved in WEATHER_THEMES) {
        return saved as WeatherThemeId;
      }
    } catch {}
    return DEFAULT_WEATHER_THEME_ID;
  });

  const [isAutoThemeSync, setIsAutoThemeSyncState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aether_auto_theme_sync');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  const setThemeId = (id: WeatherThemeId, disableAuto = true) => {
    if (id in WEATHER_THEMES) {
      setCurrentThemeIdState(id);
      if (disableAuto && isAutoThemeSync) {
        setIsAutoThemeSyncState(false);
        try {
          localStorage.setItem('aether_auto_theme_sync', 'false');
        } catch {}
      }
      try {
        localStorage.setItem('aether_weather_theme', id);
      } catch {}
    }
  };

  const setAutoThemeSync = (enabled: boolean) => {
    setIsAutoThemeSyncState(enabled);
    try {
      localStorage.setItem('aether_auto_theme_sync', String(enabled));
    } catch {}
  };

  const syncThemeWithWeather = (input: AutoThemeWeatherInput) => {
    const computedId = computeAutoThemeForWeather(input);
    if (computedId !== currentThemeId) {
      setCurrentThemeIdState(computedId);
      try {
        localStorage.setItem('aether_weather_theme', computedId);
      } catch {}
    }
  };

  const theme = getWeatherTheme(currentThemeId);
  const availableThemes = Object.values(WEATHER_THEMES);

  return (
    <WeatherThemeContext.Provider
      value={{
        currentThemeId,
        theme,
        setThemeId,
        availableThemes,
        isThemePickerOpen,
        openThemePicker: () => setIsThemePickerOpen(true),
        closeThemePicker: () => setIsThemePickerOpen(false),
        isAutoThemeSync,
        setAutoThemeSync,
        syncThemeWithWeather,
      }}
    >
      {children}
    </WeatherThemeContext.Provider>
  );
}

export function useWeatherTheme() {
  const context = useContext(WeatherThemeContext);
  if (!context) {
    return {
      currentThemeId: DEFAULT_WEATHER_THEME_ID,
      theme: WEATHER_THEMES[DEFAULT_WEATHER_THEME_ID],
      setThemeId: () => {},
      availableThemes: Object.values(WEATHER_THEMES),
      isThemePickerOpen: false,
      openThemePicker: () => {},
      closeThemePicker: () => {},
      isAutoThemeSync: false,
      setAutoThemeSync: () => {},
      syncThemeWithWeather: () => {},
    };
  }
  return context;
}
