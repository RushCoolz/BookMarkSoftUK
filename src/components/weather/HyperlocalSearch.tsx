import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Clock, X, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { LocationData } from '../../types/weather';
import { searchLocations, reverseGeocode, POPULAR_LOCATIONS } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface HyperlocalSearchProps {
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  className?: string;
}

export function HyperlocalSearch({ currentLocation, onSelectLocation, className = '' }: HyperlocalSearchProps) {
  const { theme } = useWeatherTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<LocationData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aether_recent_searches');
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch {}
  }, []);

  const saveRecent = (loc: LocationData) => {
    try {
      const filtered = recentSearches.filter(s => s.id !== loc.id).slice(0, 4);
      const updated = [loc, ...filtered];
      setRecentSearches(updated);
      localStorage.setItem('aether_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchLocations(query);
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (loc: LocationData) => {
    saveRecent(loc);
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
    setGeoNotice(null);
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser environment.');
      return;
    }

    setIsLocating(true);
    setGeoNotice(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          handleSelect(loc);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        setGeoNotice('Could not obtain GPS lock. Try typing your town or UK postcode.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    const totalItems = results.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full space-y-2.5 ${className}`}>
      {/* Search Input Box wrapped in rich thematic illustration */}
      <div className={`relative flex items-center rounded-[28px] overflow-hidden ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow}`}>
        <ThemeCardArtWrapper theme={theme} variant="compact" showCornerFiligrees={false} />
        <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[1.5px] ${theme.ui.cardHighlight}`} />

        <div className={`relative z-10 pl-4 pointer-events-none ${theme.ui.accentText}`}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search town, city, UK postcode (e.g. SW1A 1AA, Edinburgh, Zurich)..."
          className={`relative z-10 w-full pl-3 pr-32 py-3.5 bg-transparent ${theme.ui.primaryText} placeholder:opacity-70 text-sm font-bold focus:outline-none transition-all`}
          aria-label="Hyperlocal weather search"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className={`relative z-10 mr-28 p-1.5 rounded-full ${theme.ui.secondaryText} hover:${theme.ui.primaryText} cursor-pointer`}
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* GPS Location Button */}
        <button
          type="button"
          onClick={handleUseGeolocation}
          disabled={isLocating}
          className={`clay-button absolute right-2.5 z-10 px-3.5 py-2 rounded-2xl ${theme.ui.activePill} ${theme.ui.activePillText} text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-md active:scale-95`}
          title="Use device GPS location"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>{isLocating ? 'Locating...' : 'My GPS'}</span>
        </button>
      </div>

      {/* Geolocation Notice Toast if applicable */}
      {geoNotice && (
        <div className={`relative overflow-hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl ${theme.ui.badgeBg} ${theme.ui.badgeBorder} border text-xs ${theme.ui.primaryText} shadow-sm font-bold`}>
          <AlertCircle className={`w-4 h-4 shrink-0 ${theme.ui.accentText}`} />
          <span>{geoNotice}</span>
          <button onClick={() => setGeoNotice(null)} className="ml-auto font-black hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Popular Met Hub Quick Chips (Each chip has custom ThemeTileArt) */}
      <div className={`flex flex-wrap items-center gap-1.5 pt-1 text-xs ${theme.ui.secondaryText}`}>
        <span className={`font-black ${theme.ui.primaryText} text-[11px] shrink-0 mr-1 flex items-center gap-1`}>
          <Sparkles className={`w-3.5 h-3.5 ${theme.ui.accentText}`} />
          Popular Sanctuaries:
        </span>
        {POPULAR_LOCATIONS.slice(0, 6).map((hub, idx) => {
          const isCurrent = currentLocation.name === hub.name;
          return (
            <button
              key={hub.id}
              type="button"
              onClick={() => handleSelect(hub)}
              className={`group relative overflow-hidden px-3.5 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                isCurrent
                  ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-md scale-102`
                  : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} ${theme.ui.primaryText} shadow-sm`
              }`}
            >
              {!isCurrent && <ThemeTileArt theme={theme} variant="pill" index={idx} />}
              <span className="relative z-10">{hub.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dropdown Results / Recent Searches */}
      {isOpen && (results.length > 0 || (query.trim().length >= 2 && !isLoading) || (recentSearches.length > 0 && query.trim().length < 2)) && (
        <div className={`absolute left-0 right-0 top-full mt-2 z-50 ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} rounded-[28px] overflow-hidden max-h-80 overflow-y-auto`}>
          <ThemeCardArtWrapper theme={theme} variant="compact" />
          <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />
          
          {/* Active Search Results */}
          {results.length > 0 && (
            <div className="relative z-10 py-2.5">
              <div className={`px-5 py-1 text-[11px] font-black uppercase tracking-wider ${theme.ui.subheadingText}`}>
                Matching Locations
              </div>
              {results.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`px-5 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedIndex === index
                      ? `${theme.ui.activePill} ${theme.ui.activePillText} font-black`
                      : `hover:${theme.ui.tileSurface} ${theme.ui.primaryText}`
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MapPin className={`w-4 h-4 ${theme.ui.accentText} shrink-0`} />
                    <div className="truncate">
                      <span className="font-black text-sm block truncate">
                        {item.name}
                      </span>
                      <span className={`text-xs ${theme.ui.secondaryText} truncate block font-semibold`}>
                        {[item.region, item.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </div>
                  {item.countryCode && (
                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-lg ${theme.ui.badgeBg} ${theme.ui.badgeText} border ${theme.ui.badgeBorder}`}>
                      {item.countryCode}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {query.trim().length >= 2 && !isLoading && results.length === 0 && (
            <div className={`relative z-10 p-6 text-center text-xs font-bold ${theme.ui.secondaryText}`}>
              No matching meteorological stations found for &ldquo;{query}&rdquo;. Check spelling or try a UK postcode (e.g. EC1A, SW1A 1AA).
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && query.trim().length < 2 && (
            <div className="relative z-10 py-2">
              <div className={`px-4 py-1 flex items-center justify-between text-[11px] font-black uppercase tracking-wider ${theme.ui.subheadingText}`}>
                <span>Recent Inquiries</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRecentSearches([]);
                    localStorage.removeItem('aether_recent_searches');
                  }}
                  className="hover:text-rose-500 lowercase text-[10px] cursor-pointer"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`px-4 py-2.5 flex items-center justify-between hover:${theme.ui.tileSurface} ${theme.ui.primaryText} cursor-pointer`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Clock className={`w-3.5 h-3.5 ${theme.ui.accentText} shrink-0`} />
                    <span className="text-xs font-black truncate">{item.name}</span>
                    <span className={`text-[11px] font-semibold ${theme.ui.secondaryText} truncate`}>{item.country}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
