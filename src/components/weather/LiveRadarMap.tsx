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
  Loader2,
  Layers,
  Satellite,
  Radio,
  Palette,
  Snowflake,
  Compass,
  Droplets,
  AlertTriangle
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  LocationData,
  RadarMetadata,
  RadarScan,
  KeylessRadarLayerId,
  RadarGridNode
} from '../../types/weather';
import {
  fetchRadarMetadata,
  fetchRadarSurroundingTelemetry
} from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';
import { ThemeCardArtWrapper, ThemeTileArt } from './ThemeCardArtWrapper';

interface LiveRadarMapProps {
  location: LocationData;
  isDarkMode?: boolean;
}

interface RadarLayerConfig {
  id: KeylessRadarLayerId;
  label: string;
  shortLabel: string;
  providerBadge: string;
  description: string;
  unitLabel: string;
  legendGradient: string;
  legendStops: [string, string, string];
}

const KEYLESS_RADAR_LAYERS: RadarLayerConfig[] = [
  {
    id: 'rainviewer-doppler',
    label: 'Global Doppler + 30m Nowcast',
    shortLabel: 'Doppler + Nowcast',
    providerBadge: 'RainViewer API (No Key)',
    description: 'Animated 2-hour past composite Doppler radar + 30-minute AI/extrapolated future nowcast.',
    unitLabel: 'mm/h',
    legendGradient: 'from-cyan-400 via-emerald-400 via-amber-400 to-rose-500',
    legendStops: ['0.2 Light', '2.5 Mod', '10+ Heavy']
  },
  {
    id: 'rainviewer-infrared',
    label: 'Global Infrared Cloud Satellite',
    shortLabel: 'IR Satellite Clouds',
    providerBadge: 'RainViewer IR (No Key)',
    description: 'Global infrared thermal cloud-top temperature imagery tracking deep convective cloud shields.',
    unitLabel: 'Cloud Top °C',
    legendGradient: 'from-slate-400 via-sky-300 via-indigo-400 to-fuchsia-500',
    legendStops: ['-10° Low', '-40° Mid', '-70° High']
  },
  {
    id: 'iem-nexrad',
    label: 'NEXRAD Level-III Base Reflectivity',
    shortLabel: 'NEXRAD HD Radar',
    providerBadge: 'IEM OpenGeo + RainViewer',
    description: 'High-resolution NEXRAD N0Q base reflectivity (dBZ) merged with global composite Doppler.',
    unitLabel: 'dBZ',
    legendGradient: 'from-sky-400 via-lime-400 via-amber-500 to-fuchsia-600',
    legendStops: ['15 dBZ', '35 dBZ', '55+ dBZ']
  },
  {
    id: 'iem-water-vapor',
    label: 'Atmospheric Water Vapor & Moisture',
    shortLabel: 'Water Vapor (WV)',
    providerBadge: 'GOES WV + Global IR',
    description: 'Mid-tropospheric moisture transport and jet-stream dry-slot dynamics.',
    unitLabel: 'WV Index',
    legendGradient: 'from-amber-700 via-teal-400 via-cyan-300 to-indigo-500',
    legendStops: ['Dry Slot', 'Moist Plume', 'Saturated']
  },
  {
    id: 'iem-precip-1h',
    label: '1-Hour Multi-Sensor Accumulation',
    shortLabel: '1-Hr Precip Total',
    providerBadge: 'IEM Q2 + RainViewer',
    description: 'Quantitative 1-hour surface rainfall & gauge-corrected radar accumulation.',
    unitLabel: 'mm / 1h',
    legendGradient: 'from-emerald-300 via-teal-400 via-blue-500 to-purple-600',
    legendStops: ['1 mm', '12 mm', '25+ mm']
  }
];

const RADAR_COLOR_SCHEMES = [
  { id: 2, name: 'Universal Blue', swatch: 'from-cyan-400 via-emerald-400 to-rose-500' },
  { id: 6, name: 'NEXRAD Level-III', swatch: 'from-lime-400 via-amber-400 to-fuchsia-500' },
  { id: 3, name: 'TITAN Storm', swatch: 'from-sky-400 via-orange-400 to-red-600' },
  { id: 4, name: 'Weather Channel', swatch: 'from-emerald-400 via-yellow-400 to-red-500' },
  { id: 8, name: 'Dark Sky Contrast', swatch: 'from-indigo-300 via-cyan-300 to-amber-300' }
];

export function LiveRadarMap({ location, isDarkMode = true }: LiveRadarMapProps) {
  const { theme } = useWeatherTheme();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const primaryTileLayerRef = useRef<L.TileLayer | null>(null);
  const secondaryTileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const telemetryLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [radarMeta, setRadarMeta] = useState<RadarMetadata | null>(null);
  const [activeLayerId, setActiveLayerId] = useState<KeylessRadarLayerId>('rainviewer-doppler');
  const [currentFrameIdx, setCurrentFrameIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<number>(0.85);
  const [colorScheme, setColorScheme] = useState<number>(2);
  const [showSnowMask, setShowSnowMask] = useState<boolean>(true);
  const [showTelemetryNodes, setShowTelemetryNodes] = useState<boolean>(true);
  const [telemetryNodes, setTelemetryNodes] = useState<RadarGridNode[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(600);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const activeLayerConfig =
    KEYLESS_RADAR_LAYERS.find((l) => l.id === activeLayerId) || KEYLESS_RADAR_LAYERS[0];

  // Determine the active frames list based on selected keyless API layer
  const frames: RadarScan[] = React.useMemo(() => {
    if (!radarMeta) return [];
    if (activeLayerId === 'rainviewer-infrared' || activeLayerId === 'iem-water-vapor') {
      return radarMeta.infrared.length > 0
        ? radarMeta.infrared
        : [...radarMeta.past, ...radarMeta.nowcast];
    }
    return [...radarMeta.past, ...radarMeta.nowcast];
  }, [radarMeta, activeLayerId]);

  // 1. Initialize Leaflet Map & Center Marker
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      const basemapUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(basemapUrl, {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      const telemetryGroup = L.layerGroup().addTo(map);
      telemetryLayerGroupRef.current = telemetryGroup;

      const customIcon = L.divIcon({
        className: 'custom-weather-marker',
        html: `
          <div style="position:relative; width:28px; height:28px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:26px; height:26px; border-radius:50%; background:${theme.accentColors.glow}; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="width:13px; height:13px; border-radius:50%; background:${theme.accentColors.primary}; border:2.5px solid #fef08a; box-shadow:0 0 12px ${theme.accentColors.glow};"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([location.latitude, location.longitude], { icon: customIcon }).addTo(map);
      marker.bindTooltip(`<b>${location.name}</b><br/>Primary Doppler Observation Hub`, {
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

  // 2. Fetch Keyless RainViewer Radar & Infrared Satellite Metadata
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchRadarMetadata().then((data) => {
      if (!isMounted) return;
      setIsLoading(false);
      if (data) {
        setRadarMeta(data);
        setCurrentFrameIdx(Math.max(0, data.past.length - 1));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Fetch Keyless Surrounding Sector Wind & Storm Cell Telemetry (Open-Meteo Multi-Point API)
  useEffect(() => {
    let isMounted = true;
    fetchRadarSurroundingTelemetry(location.latitude, location.longitude).then((nodes) => {
      if (!isMounted) return;
      setTelemetryNodes(nodes);
    });
    return () => {
      isMounted = false;
    };
  }, [location.latitude, location.longitude]);

  // Reset frame index safely when switching between Radar and Infrared frame sets
  useEffect(() => {
    if (frames.length > 0 && currentFrameIdx >= frames.length) {
      setCurrentFrameIdx(frames.length - 1);
    }
  }, [frames.length, currentFrameIdx]);

  // 4. Render Surrounding Telemetry Markers on Leaflet Map
  useEffect(() => {
    const group = telemetryLayerGroupRef.current;
    if (!group) return;

    group.clearLayers();
    if (!showTelemetryNodes || telemetryNodes.length === 0) return;

    telemetryNodes.forEach((node) => {
      const borderCol = node.isStormCell
        ? '#f43f5e'
        : node.precipitation > 0
        ? '#38bdf8'
        : theme.accentColors.primary;
      const badgeBg = node.isStormCell
        ? 'rgba(136, 19, 55, 0.88)'
        : node.precipitation > 0
        ? 'rgba(12, 74, 110, 0.86)'
        : 'rgba(15, 23, 42, 0.82)';

      const icon = L.divIcon({
        className: 'radar-sector-node',
        html: `
          <div style="
            display:flex;
            align-items:center;
            gap:4px;
            padding:3px 7px;
            border-radius:999px;
            background:${badgeBg};
            border:1.5px solid ${borderCol};
            color:#f8fafc;
            font-family:ui-monospace, monospace;
            font-size:10px;
            font-weight:800;
            white-space:nowrap;
            box-shadow:0 4px 12px rgba(0,0,0,0.45);
          ">
            <span style="display:inline-block; transform:rotate(${node.windDirection}deg); color:#fcd34d; font-size:11px;">↑</span>
            <span>${Math.round(node.temp)}°</span>
            <span style="color:${node.precipitation > 0 ? '#7dd3fc' : '#cbd5e1'};">
              ${node.precipitation > 0 ? `${node.precipitation.toFixed(1)}mm` : `${Math.round(node.windSpeed)}km/h`}
            </span>
          </div>
        `,
        iconSize: [86, 24],
        iconAnchor: [43, 12]
      });

      const nodeMarker = L.marker([node.lat, node.lon], { icon });
      nodeMarker.bindTooltip(
        `<div style="font-size:11px; line-height:1.4;">
          <b>${node.label} (${node.id})</b><br/>
          Temp: <b>${node.temp.toFixed(1)}°C</b> | Rain Prob: <b>${node.rainProb}%</b><br/>
          Precip Rate: <b>${node.precipitation.toFixed(1)} mm/h</b><br/>
          Wind: <b>${Math.round(node.windSpeed)} km/h (${node.windDirection}°)</b>
          ${node.isStormCell ? '<br/><b style="color:#fb7185;">⚡ Active Convective Cell</b>' : ''}
        </div>`,
        { direction: 'top' }
      );
      nodeMarker.addTo(group);
    });
  }, [telemetryNodes, showTelemetryNodes, theme.accentColors.primary]);

  // 5. Update Keyless Radar & Satellite Tile Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (primaryTileLayerRef.current) {
      map.removeLayer(primaryTileLayerRef.current);
      primaryTileLayerRef.current = null;
    }
    if (secondaryTileLayerRef.current) {
      map.removeLayer(secondaryTileLayerRef.current);
      secondaryTileLayerRef.current = null;
    }

    const frame = frames[currentFrameIdx] || frames[frames.length - 1];
    const smoothSnowFlag = showSnowMask ? '1_1' : '1_0';

    if (activeLayerId === 'rainviewer-doppler' && radarMeta && frame) {
      const url = `${radarMeta.host}${frame.path}/256/{z}/{x}/{y}/${colorScheme}/${smoothSnowFlag}.png`;
      const layer = L.tileLayer(url, { opacity, maxZoom: 14, tileSize: 256 });
      layer.addTo(map);
      primaryTileLayerRef.current = layer;
    } else if (activeLayerId === 'rainviewer-infrared' && radarMeta && frame) {
      // RainViewer Infrared satellite uses color scheme 0 and options 0_0
      const isIrPath = frame.path.includes('satellite');
      const url = isIrPath
        ? `${radarMeta.host}${frame.path}/256/{z}/{x}/{y}/0/0_0.png`
        : `${radarMeta.host}${frame.path}/256/{z}/{x}/{y}/${colorScheme}/${smoothSnowFlag}.png`;
      const layer = L.tileLayer(url, { opacity, maxZoom: 14, tileSize: 256 });
      layer.addTo(map);
      primaryTileLayerRef.current = layer;
    } else if (activeLayerId === 'iem-nexrad') {
      // Base Global Composite + High-Res IEM NEXRAD N0Q Keyless Tiles
      if (radarMeta && frame) {
        const globalFallbackUrl = `${radarMeta.host}${frame.path}/256/{z}/{x}/{y}/6/${smoothSnowFlag}.png`;
        const baseLayer = L.tileLayer(globalFallbackUrl, {
          opacity: opacity * 0.75,
          maxZoom: 14,
          tileSize: 256
        });
        baseLayer.addTo(map);
        secondaryTileLayerRef.current = baseLayer;
      }
      const iemNexradUrl =
        'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png';
      const nexradLayer = L.tileLayer(iemNexradUrl, {
        opacity,
        maxZoom: 14,
        tileSize: 256
      });
      nexradLayer.addTo(map);
      primaryTileLayerRef.current = nexradLayer;
    } else if (activeLayerId === 'iem-water-vapor') {
      if (radarMeta && frame) {
        const isIrPath = frame.path.includes('satellite');
        const irUrl = isIrPath
          ? `${radarMeta.host}${frame.path}/256/{z}/{x}/{y}/0/0_0.png`
          : `${radarMeta.host}${frame.path}/256/{z}/{x}/{y}/2/1_0.png`;
        const baseIrLayer = L.tileLayer(irUrl, {
          opacity: opacity * 0.7,
          maxZoom: 14,
          tileSize: 256
        });
        baseIrLayer.addTo(map);
        secondaryTileLayerRef.current = baseIrLayer;
      }
      const iemWvUrl =
        'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-wv-4km-900913/{z}/{x}/{y}.png';
      const wvLayer = L.tileLayer(iemWvUrl, {
        opacity,
        maxZoom: 14,
        tileSize: 256
      });
      wvLayer.addTo(map);
      primaryTileLayerRef.current = wvLayer;
    } else if (activeLayerId === 'iem-precip-1h') {
      if (radarMeta && frame) {
        const dopplerUrl = `${radarMeta.host}${frame.path}/256/{z}/{x}/{y}/4/${smoothSnowFlag}.png`;
        const baseDoppler = L.tileLayer(dopplerUrl, {
          opacity: opacity * 0.8,
          maxZoom: 14,
          tileSize: 256
        });
        baseDoppler.addTo(map);
        secondaryTileLayerRef.current = baseDoppler;
      }
      const iemQ2Url =
        'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/q2-n1p-900913/{z}/{x}/{y}.png';
      const q2Layer = L.tileLayer(iemQ2Url, {
        opacity,
        maxZoom: 14,
        tileSize: 256
      });
      q2Layer.addTo(map);
      primaryTileLayerRef.current = q2Layer;
    }
  }, [radarMeta, frames, currentFrameIdx, opacity, colorScheme, showSnowMask, activeLayerId]);

  // 6. Playback Animation Timer
  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrameIdx((prev) => (prev + 1) % frames.length);
    }, playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, frames.length, playbackSpeed]);

  // Resize map smoothly on fullscreen toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  const activeFrame = frames[currentFrameIdx];
  const activeTimeLabel = activeFrame
    ? new Date(activeFrame.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  const isNowcast =
    radarMeta &&
    activeLayerId !== 'rainviewer-infrared' &&
    activeLayerId !== 'iem-water-vapor' &&
    currentFrameIdx >= radarMeta.past.length;

  const activeStormCellCount = telemetryNodes.filter((n) => n.isStormCell || n.precipitation > 0).length;

  return (
    <div
      className={`w-full rounded-[36px] ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.glowShadow} overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl flex flex-col' : 'relative'
      }`}
    >
      {/* Bespoke Scenic Artwork & Filigrees */}
      <ThemeCardArtWrapper theme={theme} variant="standard" />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${theme.ui.cardHighlight}`}
      />

      {/* Radar Map Header Bar */}
      <div
        className={`relative z-10 p-4 sm:p-5 border-b ${theme.ui.dividerBorder} flex flex-wrap items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${theme.ui.badgeBg} ${theme.ui.accentText} border ${theme.ui.badgeBorder}`}
          >
            {activeLayerId === 'rainviewer-infrared' || activeLayerId === 'iem-water-vapor' ? (
              <Satellite className="w-5 h-5" />
            ) : (
              <CloudRain className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className={`text-base font-black ${theme.ui.primaryText}`}>
                {activeLayerConfig.label}
              </h2>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${theme.ui.badgeBg} ${theme.ui.badgeText} border ${theme.ui.badgeBorder}`}
              >
                {activeLayerConfig.providerBadge}
              </span>
              {isNowcast ? (
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-950 dark:text-amber-100 border border-amber-500/45">
                  Nowcast Forecast (+30m)
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-950 dark:text-emerald-100 border border-emerald-500/45">
                  Live Keyless Feed
                </span>
              )}
            </div>
            <p className={`text-xs font-semibold ${theme.ui.secondaryText} mt-0.5`}>
              {activeLayerConfig.description}
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Snow Mask Toggle */}
          <button
            type="button"
            onClick={() => setShowSnowMask(!showSnowMask)}
            className={`relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              showSnowMask
                ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
            }`}
            title="Toggle Snow / Ice Reflectivity Mask"
          >
            {!showSnowMask && <ThemeTileArt theme={theme} variant="pill" index={0} />}
            <Snowflake className="relative z-10 w-3.5 h-3.5" />
            <span className="relative z-10 hidden md:inline">Snow Mask</span>
          </button>

          {/* Sector Telemetry Vectors Toggle */}
          <button
            type="button"
            onClick={() => setShowTelemetryNodes(!showTelemetryNodes)}
            className={`relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              showTelemetryNodes
                ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
            }`}
            title="Toggle Live 8-Sector Wind & Rain Telemetry Nodes"
          >
            {!showTelemetryNodes && <ThemeTileArt theme={theme} variant="pill" index={1} />}
            <Compass className="relative z-10 w-3.5 h-3.5" />
            <span className="relative z-10">Sector Vectors</span>
          </button>

          {/* Opacity Selector */}
          <div
            className={`relative overflow-hidden hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder} text-xs`}
          >
            <ThemeTileArt theme={theme} variant="pill" index={2} />
            <Sliders className={`relative z-10 w-3.5 h-3.5 ${theme.ui.accentText}`} />
            <span className={`relative z-10 text-[11px] font-bold ${theme.ui.secondaryText}`}>
              Opacity:
            </span>
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
            <ThemeTileArt theme={theme} variant="pill" index={3} />
            {isFullscreen ? (
              <Minimize2 className="relative z-10 w-4 h-4" />
            ) : (
              <Maximize2 className="relative z-10 w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Multi-Layer Keyless Radar & Color Palette Switcher Bar */}
      <div
        className={`relative z-10 px-4 sm:px-5 py-3 border-b ${theme.ui.dividerBorder} flex flex-wrap items-center justify-between gap-3`}
      >
        {/* 5 Keyless Radar Layer Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`text-[11px] font-black uppercase tracking-wider ${theme.ui.subheadingText} flex items-center gap-1 mr-1`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Keyless Feeds:</span>
          </span>
          {KEYLESS_RADAR_LAYERS.map((layer, idx) => {
            const isActive = activeLayerId === layer.id;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayerId(layer.id)}
                className={`relative overflow-hidden px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? `${theme.ui.activePill} ${theme.ui.activePillText} shadow-md`
                    : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText} ${theme.ui.tileHover}`
                }`}
              >
                {!isActive && <ThemeTileArt theme={theme} variant="pill" index={idx} />}
                <Radio className="relative z-10 w-3 h-3" />
                <span className="relative z-10">{layer.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Color Scheme Swatches (When using Doppler radar layers) */}
        {activeLayerId !== 'rainviewer-infrared' && activeLayerId !== 'iem-water-vapor' && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`text-[11px] font-black uppercase tracking-wider ${theme.ui.subheadingText} flex items-center gap-1 mr-1`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Palette:</span>
            </span>
            {RADAR_COLOR_SCHEMES.map((scheme, idx) => {
              const isSelected = colorScheme === scheme.id;
              return (
                <button
                  key={scheme.id}
                  type="button"
                  onClick={() => setColorScheme(scheme.id)}
                  className={`relative overflow-hidden px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                      : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
                  }`}
                  title={`Switch to ${scheme.name} radar palette`}
                >
                  {!isSelected && <ThemeTileArt theme={theme} variant="pill" index={idx + 2} />}
                  <span
                    className={`relative z-10 w-2.5 h-2.5 rounded-full bg-gradient-to-r ${scheme.swatch}`}
                  />
                  <span className="relative z-10 hidden xl:inline">{scheme.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Map Canvas Viewport */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1' : 'h-[450px] sm:h-[520px]'}`}>
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {isLoading && (
          <div
            className={`absolute inset-0 ${theme.ui.cardSurface} flex items-center justify-center z-20 ${theme.ui.primaryText} gap-2`}
          >
            <Loader2 className={`w-5 h-5 animate-spin ${theme.ui.accentText}`} />
            <span className="text-xs font-black">
              Connecting to Free Public Doppler &amp; Satellite Tile Servers...
            </span>
          </div>
        )}

        {/* Floating Quick Location & Telemetry Status Pill */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[85%]">
          <div
            className={`relative overflow-hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.primaryText} text-xs shadow-lg`}
          >
            <ThemeTileArt theme={theme} variant="pill" index={3} />
            <MapPin className={`relative z-10 w-3.5 h-3.5 ${theme.ui.accentText}`} />
            <span className="relative z-10 font-black">{location.name}</span>
            <span
              className={`relative z-10 text-[10px] font-bold ${theme.ui.secondaryText} font-mono`}
            >
              {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
            </span>
          </div>

          <div
            className={`relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.primaryText} text-[11px] font-black shadow-lg`}
          >
            <ThemeTileArt theme={theme} variant="pill" index={4} />
            {activeStormCellCount > 0 ? (
              <>
                <AlertTriangle className="relative z-10 w-3.5 h-3.5 text-amber-400" />
                <span className="relative z-10">
                  {activeStormCellCount} Active Precip/Storm Sector
                  {activeStormCellCount > 1 ? 's' : ''} Nearby
                </span>
              </>
            ) : (
              <>
                <Droplets className={`relative z-10 w-3.5 h-3.5 ${theme.ui.accentText}`} />
                <span className="relative z-10">8 Surrounding Sectors Clear</span>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Layer Intensity Scale Legend */}
        <div
          className={`absolute bottom-16 sm:bottom-6 right-4 z-20 overflow-hidden p-3 rounded-2xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} shadow-xl text-[10px] space-y-1.5 min-w-[205px] max-w-[235px]`}
        >
          <ThemeTileArt theme={theme} variant="pill" index={2} />
          <div
            className={`relative z-10 font-black flex items-center justify-between gap-2 ${theme.ui.primaryText}`}
          >
            <span>{activeLayerConfig.shortLabel}</span>
            <span className={`font-mono text-[9px] ${theme.ui.subheadingText}`}>
              {activeLayerConfig.unitLabel}
            </span>
          </div>
          <div
            className={`relative z-10 h-2 w-full rounded-full bg-gradient-to-r ${activeLayerConfig.legendGradient}`}
          />
          <div
            className={`relative z-10 flex justify-between font-mono font-bold text-[9px] ${theme.ui.secondaryText}`}
          >
            <span>{activeLayerConfig.legendStops[0]}</span>
            <span>{activeLayerConfig.legendStops[1]}</span>
            <span>{activeLayerConfig.legendStops[2]}</span>
          </div>
        </div>
      </div>

      {/* Scrubbable Playback Control Bar */}
      <div
        className={`relative z-10 overflow-hidden p-4 sm:p-5 border-t ${theme.ui.dividerBorder} flex flex-col sm:flex-row items-center justify-between gap-4 ${theme.ui.tileSurface}`}
      >
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
          <div className="min-w-[125px]">
            <span
              className={`text-sm font-black ${theme.ui.primaryText} font-mono tabular-nums block`}
            >
              {activeTimeLabel}
            </span>
            <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block font-mono`}>
              Frame {Math.min(currentFrameIdx + 1, Math.max(1, frames.length))} of{' '}
              {frames.length || 1}
            </span>
          </div>
        </div>

        {/* Timeline Range Scrubber */}
        <div className="relative z-10 flex-1 w-full max-w-xl flex items-center gap-3">
          <span className={`text-[10px] font-mono font-bold ${theme.ui.secondaryText} shrink-0`}>
            -2h Past
          </span>
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
          <span className={`text-[10px] font-mono font-black ${theme.ui.accentText} shrink-0`}>
            {activeLayerId === 'rainviewer-infrared' || activeLayerId === 'iem-water-vapor'
              ? 'Latest IR'
              : '+30m Nowcast'}
          </span>
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
