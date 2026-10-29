import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  CloudRain,
  MapPin,
  Loader2
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationData, RadarMetadata, RadarScan } from '../../types/weather';
import { fetchRadarMetadata } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface LiveRadarMapProps {
  location: LocationData;
  isDarkMode?: boolean;
}

export function LiveRadarMap({ location, isDarkMode = true }: LiveRadarMapProps) {
  const { theme } = useWeatherTheme();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const radarTileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [radarMeta, setRadarMeta] = useState<RadarMetadata | null>(null);
  const [frames, setFrames] = useState<RadarScan[]>([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<number>(0.85);
  const [colorScheme] = useState<number>(2); // 2 = Universal radar color
  const [smoothRadar] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(600); // ms per frame
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      // Add zoom control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // CartoDB Positron / Dark Matter basemap
      const basemapUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(basemapUrl, {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      // Pulse location marker
      const customIcon = L.divIcon({
        className: 'custom-weather-marker',
        html: `
          <div style="position:relative; width:24px; height:24px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:22px; height:22px; border-radius:50%; background:${theme.accentColors.glow}; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:12px; height:12px; border-radius:50%; background:${theme.accentColors.primary}; border:2px solid #fef08a; box-shadow:0 0 10px ${theme.accentColors.glow};"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([location.latitude, location.longitude], { icon: customIcon }).addTo(map);
      marker.bindTooltip(`<b>${location.name}</b><br/>Weather Observation Station`, {
        permanent: false,
        direction: 'top',
        className: 'leaflet-tooltip-dark'
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([location.latitude, location.longitude], 7);
      if (markerRef.current) {
        markerRef.current.setLatLng([location.latitude, location.longitude]);
      }
    }
  }, [location, isDarkMode, theme.accentColors]);

  // 2. Fetch RainViewer radar scans
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchRadarMetadata().then((data) => {
      if (!isMounted) return;
      setIsLoading(false);
      if (data) {
        setRadarMeta(data);
        const combined = [...data.past, ...data.nowcast];
        setFrames(combined);
        setCurrentFrameIdx(Math.max(0, data.past.length - 1));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Update Radar Tile Layer when frame, opacity, or colorScheme changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !radarMeta || !frames.length) return;

    const frame = frames[currentFrameIdx];
    if (!frame) return;

    const smoothFlag = smoothRadar ? '1_1' : '0_0';
    const radarUrl = `${radarMeta.host}${frame.path}/256/{z}/{x}/{y}/${colorScheme}/${smoothFlag}.png`;

    if (radarTileLayerRef.current) {
      map.removeLayer(radarTileLayerRef.current);
    }

    const tileLayer = L.tileLayer(radarUrl, {
      opacity,
      maxZoom: 14,
      tileSize: 256
    });

    tileLayer.addTo(map);
    radarTileLayerRef.current = tileLayer;
  }, [radarMeta, frames, currentFrameIdx, opacity, colorScheme, smoothRadar]);

  // 4. Playback Animation Timer
  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrameIdx((prev) => (prev + 1) % frames.length);
    }, playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, frames.length, playbackSpeed]);

  const activeFrame = frames[currentFrameIdx];
  const activeTimeLabel = activeFrame
    ? new Date(activeFrame.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  const isNowcast = radarMeta && currentFrameIdx >= radarMeta.past.length;

  return (
    <div className={`w-full rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} overflow-hidden transition-all ${isFullscreen ? 'fixed inset-4 z-50 rounded-2xl flex flex-col' : 'relative'}`}>
      {/* Bespoke Scenic Artwork & Filigrees */}
      <ThemeCardArtWrapper theme={theme} variant="standard" />
      <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`} />

      {/* Radar Map Header Bar */}
      <div className={`relative z-10 p-4 sm:p-5 border-b ${theme.ui.dividerBorder} flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${theme.ui.badgeBg} ${theme.ui.accentText} border ${theme.ui.badgeBorder}`}>
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base font-black ${theme.ui.primaryText} flex items-center gap-2`}>
              <span>Dynamic Doppler Radar &amp; Cloud Tracking</span>
              {isNowcast ? (
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${theme.ui.badgeBg} ${theme.ui.badgeText} border ${theme.ui.badgeBorder}`}>
                  Nowcast Forecast (+10m)
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-950 dark:text-emerald-100 border border-emerald-500/45">
                  Live Satellite Scan
                </span>
              )}
            </h2>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText}`}>
              High-resolution precipitation echoes centered over {location.name}
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Opacity Selector */}
          <div className={`relative overflow-hidden hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} text-xs`}>
            <ThemeTileArt theme={theme} variant="pill" index={0} />
            <Sliders className={`relative z-10 w-3.5 h-3.5 ${theme.ui.accentText}`} />
            <span className={`relative z-10 text-[11px] font-bold ${theme.ui.secondaryText}`}>Opacity:</span>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="relative z-10 w-16 h-1.5 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`relative overflow-hidden p-2 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.tileHover} ${theme.ui.primaryText} text-xs font-black cursor-pointer transition-colors`}
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen Radar'}
          >
            <ThemeTileArt theme={theme} variant="pill" index={1} />
            {isFullscreen ? <Minimize2 className="relative z-10 w-4 h-4" /> : <Maximize2 className="relative z-10 w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Canvas Viewport */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1' : 'h-[440px] sm:h-[500px]'}`}>
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {isLoading && (
          <div className={`absolute inset-0 ${theme.ui.cardSurface} flex items-center justify-center z-20 ${theme.ui.primaryText} gap-2`}>
            <Loader2 className={`w-5 h-5 animate-spin ${theme.ui.accentText}`} />
            <span className="text-xs font-black">Fetching High-Resolution Radar Frames...</span>
          </div>
        )}

        {/* Color Intensity Scale Legend */}
        <div className={`absolute bottom-16 sm:bottom-6 right-4 z-20 overflow-hidden p-3 rounded-2xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} shadow-xl text-[10px] space-y-1.5 max-w-[210px]`}>
          <ThemeTileArt theme={theme} variant="pill" index={2} />
          <div className={`relative z-10 font-black flex items-center justify-between ${theme.ui.primaryText}`}>
            <span>Precipitation Intensity</span>
            <span className={`font-mono text-[9px] ${theme.ui.subheadingText}`}>mm/h</span>
          </div>
          <div className="relative z-10 h-2 w-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 via-amber-400 to-rose-500" />
          <div className={`relative z-10 flex justify-between font-mono font-bold text-[9px] ${theme.ui.secondaryText}`}>
            <span>0.2 Light</span>
            <span>2.5 Mod</span>
            <span>10+ Heavy</span>
          </div>
        </div>

        {/* Floating Quick Location Focus Pill */}
        <div className={`absolute top-4 left-4 z-20 overflow-hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.primaryText} text-xs shadow-lg`}>
          <ThemeTileArt theme={theme} variant="pill" index={3} />
          <MapPin className={`relative z-10 w-3.5 h-3.5 ${theme.ui.accentText}`} />
          <span className="relative z-10 font-black">{location.name}</span>
          <span className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} font-mono`}>
            {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
          </span>
        </div>
      </div>

      {/* Scrubbable Playback Control Bar */}
      <div className={`relative z-10 overflow-hidden p-4 sm:p-5 border-t ${theme.ui.dividerBorder} flex flex-col sm:flex-row items-center justify-between gap-4 ${theme.ui.tileSurface}`}>
        <ThemeTileArt theme={theme} variant="banner" index={4} />
        {/* Play/Pause & Frame Stepper */}
        <div className="relative z-10 flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2.5 rounded-xl ${theme.ui.activePill} ${theme.ui.activePillText} shadow-md transition-transform active:scale-95 cursor-pointer shrink-0`}
            title={isPlaying ? 'Pause Animation' : 'Play Radar Loop'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setCurrentFrameIdx(0)}
            className={`p-2 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText} transition-colors cursor-pointer shrink-0`}
            title="Jump to Start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Timestamp Indicator */}
          <div className="min-w-[120px]">
            <span className={`text-sm font-black ${theme.ui.primaryText} font-mono tabular-nums block`}>
              {activeTimeLabel}
            </span>
            <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block font-mono`}>
              Scan {currentFrameIdx + 1} of {frames.length || 1}
            </span>
          </div>
        </div>

        {/* Timeline Range Scrubber */}
        <div className="relative z-10 flex-1 w-full max-w-xl flex items-center gap-3">
          <span className={`text-[10px] font-mono font-bold ${theme.ui.secondaryText} shrink-0`}>Past</span>
          <input
            type="range"
            min="0"
            max={Math.max(0, frames.length - 1)}
            value={currentFrameIdx}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentFrameIdx(parseInt(e.target.value, 10));
            }}
            className={`w-full h-2.5 rounded-lg ${theme.ui.controlTrack} accent-amber-500 cursor-pointer`}
          />
          <span className={`text-[10px] font-mono font-black ${theme.ui.accentText} shrink-0`}>Nowcast</span>
        </div>

        {/* Speed Controls */}
        <div className="relative z-10 flex items-center gap-1.5 shrink-0">
          <span className={`text-[11px] font-bold ${theme.ui.secondaryText} mr-1`}>Speed:</span>
          {[
            { label: '0.5x', speed: 900 },
            { label: '1x', speed: 600 },
            { label: '2x', speed: 300 }
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setPlaybackSpeed(item.speed)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono transition-all cursor-pointer ${
                playbackSpeed === item.speed
                  ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                  : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
