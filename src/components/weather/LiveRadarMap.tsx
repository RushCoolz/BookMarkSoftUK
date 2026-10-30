import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  AlertTriangle,
  Map as MapIcon,
  Wind,
  Zap,
  Mountain,
  Clock
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  LocationData,
  RadarMetadata,
  RadarScan,
  KeylessRadarLayerId,
  RadarGridNode,
  TerrainPointProfile
} from '../../types/weather';
import {
  fetchRadarMetadata,
  fetchRadarSurroundingTelemetry,
  fetchTerrainPointProfile
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
    id: 'openmeteo-doppler',
    label: 'Global Doppler + 30m Nowcast',
    shortLabel: 'Doppler + Nowcast',
    providerBadge: 'Leaflet HD + Open-Meteo Array',
    description:
      'Animated 2-hour past composite Doppler reflectivity + 30-minute wind-advected nowcast over Retina vector & satellite cartography.',
    unitLabel: 'mm/h',
    legendGradient: 'from-cyan-400 via-emerald-400 via-amber-400 to-rose-500',
    legendStops: ['0.2 Light', '2.5 Mod', '10+ Heavy']
  },
  {
    id: 'openmeteo-infrared',
    label: 'Global Infrared Cloud Satellite',
    shortLabel: 'IR Satellite Clouds',
    providerBadge: 'Leaflet + GOES/Open-Meteo IR',
    description:
      'Global infrared thermal cloud-top temperature imagery tracking deep convective cloud shields and upper-tropospheric anvil plumes.',
    unitLabel: 'Cloud Top °C',
    legendGradient: 'from-slate-400 via-sky-300 via-indigo-400 to-fuchsia-500',
    legendStops: ['-10° Low', '-40° Mid', '-70° High']
  },
  {
    id: 'iem-nexrad',
    label: 'NEXRAD Level-III Base Reflectivity',
    shortLabel: 'NEXRAD HD Radar',
    providerBadge: 'IEM Mesonet + Multi-Sector dBZ',
    description:
      'High-resolution 5-minute time-stepped base reflectivity (dBZ) with iso-reflectivity contour rings and convective storm cell tracking.',
    unitLabel: 'dBZ',
    legendGradient: 'from-sky-400 via-lime-400 via-amber-500 to-fuchsia-600',
    legendStops: ['15 dBZ', '35 dBZ', '55+ dBZ']
  },
  {
    id: 'iem-water-vapor',
    label: 'Atmospheric Water Vapor & Moisture',
    shortLabel: 'Water Vapor (WV)',
    providerBadge: 'Tropospheric Moisture Plumes',
    description:
      'Mid-tropospheric moisture transport plumes, relative humidity corridors, and animated wind-streamline dynamics.',
    unitLabel: 'WV Index',
    legendGradient: 'from-amber-700 via-teal-400 via-cyan-300 to-indigo-500',
    legendStops: ['Dry Slot', 'Moist Plume', 'Saturated']
  },
  {
    id: 'iem-precip-1h',
    label: '1-Hour Multi-Sensor Accumulation',
    shortLabel: '1-Hr Precip Total',
    providerBadge: 'Quantitative Precip Estimate',
    description:
      'Quantitative 1-hour surface rainfall & multi-sector gauge-corrected radar accumulation contours.',
    unitLabel: 'mm / 1h',
    legendGradient: 'from-emerald-300 via-teal-400 via-blue-500 to-purple-600',
    legendStops: ['1 mm', '12 mm', '25+ mm']
  }
];

type BasemapStyleId = 'street' | 'auto' | 'jawg' | 'topo' | 'vector';

interface BasemapStyleOption {
  id: BasemapStyleId;
  label: string;
  providerName: string;
  isVectorGL: boolean;
  getVectorStyleUrl?: (isDark: boolean) => string;
  getUrl: (isDark: boolean) => string;
  getFallbackUrl: (isDark: boolean) => string;
  subdomains?: string;
}

const ENV_MAPTILER_KEY =
  (import.meta as any).env?.VITE_MAPTILER_API_KEY || 'g54IjvNQSeb0TOo2iPss';
const ENV_STADIA_KEY =
  (import.meta as any).env?.VITE_STADIA_API_KEY || '3fbb60d2-4b97-4cdb-9cd0-ce73298edbf8';
const ENV_JAWG_TOKEN =
  (import.meta as any).env?.VITE_JAWG_ACCESS_TOKEN ||
  'sHM42ixIk5PNI6TYEtNxVMx2FWQAbgRVRw1o2HNixP4cEamivjsoFoYJ6jk5bgHD';

const BASEMAP_STYLES: BasemapStyleOption[] = [
  {
    id: 'street',
    label: 'MapTiler HD',
    providerName: 'MapTiler Vector & @2x Retina',
    isVectorGL: true,
    getVectorStyleUrl: (isDark) =>
      `https://api.maptiler.com/maps/${isDark ? 'dataviz-dark' : 'streets-v2'}/style.json?key=${ENV_MAPTILER_KEY}`,
    getUrl: (isDark) =>
      `https://api.maptiler.com/maps/${isDark ? 'dataviz-dark' : 'streets-v2'}/256/{z}/{x}/{y}@2x.png?key=${ENV_MAPTILER_KEY}`,
    getFallbackUrl: (isDark) =>
      `https://tile.jawg.io/${isDark ? 'jawg-dark' : 'jawg-streets'}/{z}/{x}/{y}@2x.png?access-token=${ENV_JAWG_TOKEN}`
  },
  {
    id: 'jawg',
    label: 'Jawg HD',
    providerName: 'Jawg Maps @2x Retina',
    isVectorGL: true,
    getVectorStyleUrl: (isDark) =>
      `https://api.jawg.io/styles/${isDark ? 'jawg-dark' : 'jawg-streets'}.json?access-token=${ENV_JAWG_TOKEN}`,
    getUrl: (isDark) =>
      `https://tile.jawg.io/${isDark ? 'jawg-dark' : 'jawg-streets'}/{z}/{x}/{y}@2x.png?access-token=${ENV_JAWG_TOKEN}`,
    getFallbackUrl: (isDark) =>
      `https://api.maptiler.com/maps/${isDark ? 'dataviz-dark' : 'streets-v2'}/256/{z}/{x}/{y}@2x.png?key=${ENV_MAPTILER_KEY}`
  },
  {
    id: 'auto',
    label: 'Stadia HD',
    providerName: 'Stadia Alidade Smooth @2x',
    isVectorGL: true,
    getVectorStyleUrl: (isDark) =>
      `https://tiles.stadiamaps.com/styles/${isDark ? 'alidade_smooth_dark' : 'alidade_smooth'}.json?api_key=${ENV_STADIA_KEY}`,
    getUrl: (isDark) =>
      `https://tiles.stadiamaps.com/tiles/${
        isDark ? 'alidade_smooth_dark' : 'alidade_smooth'
      }/{z}/{x}/{y}@2x.png?api_key=${ENV_STADIA_KEY}`,
    getFallbackUrl: (isDark) =>
      `https://api.maptiler.com/maps/${isDark ? 'dataviz-dark' : 'dataviz-light'}/256/{z}/{x}/{y}@2x.png?key=${ENV_MAPTILER_KEY}`
  },
  {
    id: 'topo',
    label: 'Topo Outdoor HD',
    providerName: 'MapTiler Outdoor @2x + Jawg Terrain',
    isVectorGL: true,
    getVectorStyleUrl: () =>
      `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${ENV_MAPTILER_KEY}`,
    getUrl: () =>
      `https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}@2x.png?key=${ENV_MAPTILER_KEY}`,
    getFallbackUrl: () =>
      `https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}@2x.png?access-token=${ENV_JAWG_TOKEN}`
  },
  {
    id: 'vector',
    label: 'Hybrid Sat HD',
    providerName: 'MapTiler Satellite Hybrid @2x',
    isVectorGL: true,
    getVectorStyleUrl: () =>
      `https://api.maptiler.com/maps/hybrid/style.json?key=${ENV_MAPTILER_KEY}`,
    getUrl: () =>
      `https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}@2x.png?key=${ENV_MAPTILER_KEY}`,
    getFallbackUrl: () =>
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  }
];

interface PaletteColorStops {
  id: number;
  name: string;
  swatch: string;
  outerRgba: string;
  midRgba: string;
  coreRgba: string;
  intenseRgba: string;
  contourHex: string;
}

const RADAR_COLOR_SCHEMES: PaletteColorStops[] = [
  {
    id: 2,
    name: 'Universal Blue',
    swatch: 'from-cyan-400 via-emerald-400 to-rose-500',
    outerRgba: 'rgba(34, 211, 238, 0.22)',
    midRgba: 'rgba(16, 185, 129, 0.42)',
    coreRgba: 'rgba(245, 158, 11, 0.58)',
    intenseRgba: 'rgba(244, 63, 94, 0.74)',
    contourHex: '#34d399'
  },
  {
    id: 6,
    name: 'NEXRAD Level-III',
    swatch: 'from-lime-400 via-amber-400 to-fuchsia-500',
    outerRgba: 'rgba(56, 189, 248, 0.22)',
    midRgba: 'rgba(132, 204, 22, 0.44)',
    coreRgba: 'rgba(245, 158, 11, 0.60)',
    intenseRgba: 'rgba(217, 70, 239, 0.76)',
    contourHex: '#a3e635'
  },
  {
    id: 3,
    name: 'TITAN Storm',
    swatch: 'from-sky-400 via-orange-400 to-red-600',
    outerRgba: 'rgba(56, 189, 248, 0.22)',
    midRgba: 'rgba(251, 146, 60, 0.44)',
    coreRgba: 'rgba(239, 68, 68, 0.60)',
    intenseRgba: 'rgba(185, 28, 28, 0.76)',
    contourHex: '#fb923c'
  },
  {
    id: 4,
    name: 'Weather Channel',
    swatch: 'from-emerald-400 via-yellow-400 to-red-500',
    outerRgba: 'rgba(52, 211, 153, 0.22)',
    midRgba: 'rgba(16, 185, 129, 0.44)',
    coreRgba: 'rgba(250, 204, 21, 0.58)',
    intenseRgba: 'rgba(239, 68, 68, 0.74)',
    contourHex: '#facc15'
  },
  {
    id: 8,
    name: 'Dark Sky Contrast',
    swatch: 'from-indigo-300 via-cyan-300 to-amber-300',
    outerRgba: 'rgba(129, 140, 248, 0.24)',
    midRgba: 'rgba(34, 211, 238, 0.44)',
    coreRgba: 'rgba(252, 211, 77, 0.60)',
    intenseRgba: 'rgba(244, 114, 182, 0.76)',
    contourHex: '#22d3ee'
  }
];

export function LiveRadarMap({ location, isDarkMode = true }: LiveRadarMapProps) {
  const { theme } = useWeatherTheme();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const dopplerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const basemapLayerRef = useRef<L.TileLayer | null>(null);
  const labelOverlayRef = useRef<L.TileLayer | null>(null);
  const roadsOverlayRef = useRef<L.TileLayer | null>(null);
  const weatherTileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const telemetryLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [radarMeta, setRadarMeta] = useState<RadarMetadata | null>(null);
  const [activeLayerId, setActiveLayerId] = useState<KeylessRadarLayerId>('openmeteo-doppler');
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyleId>('street');
  const [currentFrameIdx, setCurrentFrameIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<number>(0.82);
  const [colorScheme, setColorScheme] = useState<number>(2);
  const [showSnowMask, setShowSnowMask] = useState<boolean>(true);
  const [showWindStreamlines, setShowWindStreamlines] = useState<boolean>(true);
  const [showStormVectors, setShowStormVectors] = useState<boolean>(true);
  const [showTelemetryNodes, setShowTelemetryNodes] = useState<boolean>(true);
  const [telemetryNodes, setTelemetryNodes] = useState<RadarGridNode[]>([]);
  const [terrainProfile, setTerrainProfile] = useState<TerrainPointProfile | null>(null);
  const [isLoadingTerrain, setIsLoadingTerrain] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(600);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mapViewRevision, setMapViewRevision] = useState<number>(0);
  const windParticlesRef = useRef<
    { x: number; y: number; age: number; maxAge: number; speedFactor: number }[]
  >([]);
  const inspectedMarkerRef = useRef<L.CircleMarker | null>(null);

  const activeLayerConfig =
    KEYLESS_RADAR_LAYERS.find((l) => l.id === activeLayerId) || KEYLESS_RADAR_LAYERS[0];

  const activePalette =
    RADAR_COLOR_SCHEMES.find((s) => s.id === colorScheme) || RADAR_COLOR_SCHEMES[0];

  // Determine the active frames list based on selected radar layer
  const frames: RadarScan[] = React.useMemo(() => {
    if (!radarMeta) return [];
    if (activeLayerId === 'openmeteo-infrared' || activeLayerId === 'iem-water-vapor') {
      return radarMeta.infrared.length > 0
        ? radarMeta.infrared
        : [...radarMeta.past, ...radarMeta.nowcast];
    }
    return [...radarMeta.past, ...radarMeta.nowcast];
  }, [radarMeta, activeLayerId]);

  // 1. Initialize Leaflet Geographic Map & Center Marker
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const selectedBasemap =
      BASEMAP_STYLES.find((b) => b.id === basemapStyle) || BASEMAP_STYLES[0];
    const basemapUrl = selectedBasemap.getUrl(isDarkMode);

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true
      });

      L.control.zoom({ position: 'topright' }).addTo(map);
      L.control.scale({ position: 'bottomleft', metric: true, imperial: true }).addTo(map);

      // 512px @2x High-DPI Retina Leaflet raster basemap (renders 512px images in 256px slots for true 2x sharpness)
      const baseLayer = L.tileLayer(basemapUrl, {
        tileSize: 256,
        maxZoom: 20,
        maxNativeZoom: 19,
        ...(selectedBasemap.subdomains ? { subdomains: selectedBasemap.subdomains } : {})
      }).addTo(map);

      let didFallback = false;
      baseLayer.on('tileerror', () => {
        if (!didFallback && basemapLayerRef.current) {
          didFallback = true;
          const activeOpt =
            BASEMAP_STYLES.find((b) => b.id === basemapStyle) || BASEMAP_STYLES[0];
          basemapLayerRef.current.setUrl(activeOpt.getFallbackUrl(isDarkMode));
        }
      });

      basemapLayerRef.current = baseLayer;

      // High-contrast transportation & place reference overlays when fallback satellite imagery is used
      const roadsUrl =
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}';
      const roadsLayer = L.tileLayer(roadsUrl, {
        maxZoom: 19,
        maxNativeZoom: 18,
        opacity: 0
      }).addTo(map);
      roadsOverlayRef.current = roadsLayer;

      const labelsUrl =
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
      const labelLayer = L.tileLayer(labelsUrl, {
        maxZoom: 19,
        maxNativeZoom: 18,
        opacity: 0
      }).addTo(map);
      labelOverlayRef.current = labelLayer;

      // Keyless Iowa Environmental Mesonet (IEM) Live NEXRAD & GOES IR Leaflet Tile Layer
      const weatherLayer = L.tileLayer(
        'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          maxNativeZoom: 12,
          opacity: opacity * 0.72,
          zIndex: 12
        }
      ).addTo(map);
      weatherTileLayerRef.current = weatherLayer;

      const telemetryGroup = L.layerGroup().addTo(map);
      telemetryLayerGroupRef.current = telemetryGroup;

      map.on('move zoom viewreset resize', () => {
        setMapViewRevision((r) => r + 1);
      });

      // Interactive Click-on-Map 3D Terrain & Elevation Micro-Profile Inspector
      map.on('click', (e: L.LeafletMouseEvent) => {
        const clickedLat = e.latlng.lat;
        const clickedLon = e.latlng.lng;
        if (inspectedMarkerRef.current) {
          inspectedMarkerRef.current.setLatLng([clickedLat, clickedLon]);
        } else {
          inspectedMarkerRef.current = L.circleMarker([clickedLat, clickedLon], {
            radius: 7,
            color: '#38bdf8',
            weight: 2.5,
            fillColor: '#0284c7',
            fillOpacity: 0.85
          }).addTo(map);
        }
        setIsLoadingTerrain(true);
        fetchTerrainPointProfile(clickedLat, clickedLon).then((profile) => {
          setTerrainProfile(profile);
          setIsLoadingTerrain(false);
        });
      });

      mapInstanceRef.current = map;

      // Ensure Leaflet calculates container dimensions accurately after mount
      setTimeout(() => {
        map.invalidateSize();
        setMapViewRevision((r) => r + 1);
      }, 80);
    } else {
      mapInstanceRef.current.setView([location.latitude, location.longitude], mapInstanceRef.current.getZoom() || 7);
    }

    const map = mapInstanceRef.current;
    const customIcon = L.divIcon({
      className: 'custom-weather-marker',
      html: `
        <div style="position:relative; width:30px; height:30px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:28px; height:28px; border-radius:50%; background:${theme.accentColors.glow}; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="width:14px; height:14px; border-radius:50%; background:${theme.accentColors.primary}; border:2.5px solid #fef08a; box-shadow:0 0 14px ${theme.accentColors.glow};"></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([location.latitude, location.longitude]);
      markerRef.current.setIcon(customIcon);
    } else if (map) {
      const marker = L.marker([location.latitude, location.longitude], { icon: customIcon }).addTo(map);
      markerRef.current = marker;
    }

    if (markerRef.current) {
      markerRef.current.unbindTooltip();
      markerRef.current.bindTooltip(`<b>${location.name}</b><br/>Primary Doppler Observation Hub`, {
        permanent: false,
        direction: 'top',
        className: 'leaflet-tooltip-dark'
      });
    }
  }, [location.latitude, location.longitude, location.name, isDarkMode, theme.accentColors]);

  // Update Leaflet @2x Retina TileLayer when basemapStyle or dark mode changes
  useEffect(() => {
    const selectedBasemap =
      BASEMAP_STYLES.find((b) => b.id === basemapStyle) || BASEMAP_STYLES[0];

    if (basemapLayerRef.current) {
      basemapLayerRef.current.off('tileerror');
      let didFallback = false;
      basemapLayerRef.current.on('tileerror', () => {
        if (!didFallback && basemapLayerRef.current) {
          didFallback = true;
          basemapLayerRef.current.setUrl(selectedBasemap.getFallbackUrl(isDarkMode));
        }
      });
      basemapLayerRef.current.setUrl(selectedBasemap.getUrl(isDarkMode));
    }

    if (roadsOverlayRef.current) {
      roadsOverlayRef.current.setOpacity(0);
    }
    if (labelOverlayRef.current) {
      labelOverlayRef.current.setOpacity(0);
    }
    setMapViewRevision((r) => r + 1);
  }, [basemapStyle, isDarkMode]);

  // Cleanly destroy Leaflet map instance on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // Ignore unmount cleanup error
        }
        mapInstanceRef.current = null;
        basemapLayerRef.current = null;
        labelOverlayRef.current = null;
        roadsOverlayRef.current = null;
        weatherTileLayerRef.current = null;
        markerRef.current = null;
        telemetryLayerGroupRef.current = null;
        inspectedMarkerRef.current = null;
      }
    };
  }, []);

  // Synchronize live IEM radar/satellite Leaflet tile layer with timeline frame & opacity
  useEffect(() => {
    const weatherLayer = weatherTileLayerRef.current;
    if (!weatherLayer || !radarMeta) return;
    const frame = frames[currentFrameIdx];
    const layerPath = frame?.path || 'nexrad-n0q-900913';
    weatherLayer.setUrl(`${radarMeta.host}/${layerPath}/{z}/{x}/{y}.png`);
    weatherLayer.setOpacity(opacity * 0.72);
  }, [radarMeta, frames, currentFrameIdx, opacity]);

  // Observe map container resize so Leaflet never renders a partial/blank viewport
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        setMapViewRevision((r) => r + 1);
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // 2. Fetch Time-Stepped Radar & Satellite Scan Metadata
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

  // 3. Fetch Live Surrounding Sector Wind & Storm Cell Telemetry + Initial Terrain Profile
  useEffect(() => {
    let isMounted = true;
    fetchRadarSurroundingTelemetry(location.latitude, location.longitude).then((nodes) => {
      if (!isMounted) return;
      setTelemetryNodes(nodes);
    });
    setIsLoadingTerrain(true);
    fetchTerrainPointProfile(location.latitude, location.longitude).then((profile) => {
      if (!isMounted) return;
      setTerrainProfile(profile);
      setIsLoadingTerrain(false);
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
        ? 'rgba(136, 19, 55, 0.90)'
        : node.precipitation > 0
        ? 'rgba(12, 74, 110, 0.88)'
        : 'rgba(15, 23, 42, 0.85)';

      const icon = L.divIcon({
        className: 'radar-sector-node',
        html: `
          <div style="
            display:flex;
            align-items:center;
            gap:4px;
            padding:3px 8px;
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
        iconSize: [88, 24],
        iconAnchor: [44, 12]
      });

      const nodeMarker = L.marker([node.lat, node.lon], { icon });
      nodeMarker.bindTooltip(
        `<div style="font-size:11px; line-height:1.45;">
          <b>${node.label} (${node.id})</b><br/>
          Temp: <b>${node.temp.toFixed(1)}°C</b> | Rain Prob: <b>${node.rainProb}%</b><br/>
          Precip Rate: <b>${node.precipitation.toFixed(1)} mm/h</b> | Cloud: <b>${node.cloudCover}%</b><br/>
          Wind: <b>${Math.round(node.windSpeed)} km/h (${node.windDirection}°)</b>
          ${node.isStormCell ? '<br/><b style="color:#fb7185;">⚡ Active Convective Cell</b>' : ''}
        </div>`,
        { direction: 'top' }
      );
      nodeMarker.addTo(group);
    });
  }, [telemetryNodes, showTelemetryNodes, theme.accentColors.primary]);

  // 5. Georeferenced Open-Meteo Live Doppler, Satellite & Cartographic Grid Canvas Renderer
  // Renders semi-transparent weather echoes above the street/terrain map so the map is ALWAYS visible.
  const renderDopplerFieldCanvas = useCallback(() => {
    const canvas = dopplerCanvasRef.current;
    const map = mapInstanceRef.current;
    if (!canvas || !map) return;

    const size = map.getSize();
    if (size.x <= 0 || size.y <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== size.x * dpr || canvas.height !== size.y * dpr) {
      canvas.width = size.x * dpr;
      canvas.height = size.y * dpr;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size.x, size.y);

    const centerPt = map.latLngToContainerPoint([location.latitude, location.longitude]);
    const edgePt = map.latLngToContainerPoint([location.latitude + 0.45, location.longitude]);
    const degPixelScale = Math.max(32, Math.abs(centerPt.y - edgePt.y));

    // Normalized timeline progress (-1.0 for -2h past -> 0.0 for live -> +0.35 for +30m nowcast)
    const totalFrames = Math.max(1, frames.length - 1);
    const normStep = (currentFrameIdx - 11) / Math.max(1, totalFrames);

    // A. Georeferenced Cartographic Lat/Lon Graticule & Doppler Range Rings
    ctx.save();
    const bounds = map.getBounds();
    const minLat = Math.floor(bounds.getSouth() * 2) / 2;
    const maxLat = Math.ceil(bounds.getNorth() * 2) / 2;
    const minLon = Math.floor(bounds.getWest() * 2) / 2;
    const maxLon = Math.ceil(bounds.getEast() * 2) / 2;

    ctx.strokeStyle =
      basemapStyle === 'vector'
        ? 'rgba(56, 189, 248, 0.22)'
        : isDarkMode
        ? 'rgba(148, 163, 184, 0.14)'
        : 'rgba(15, 23, 42, 0.12)';
    ctx.lineWidth = 1;
    ctx.font = '600 9px ui-monospace, monospace';
    ctx.fillStyle = isDarkMode ? 'rgba(148, 163, 184, 0.55)' : 'rgba(51, 65, 85, 0.65)';

    for (let lat = minLat; lat <= maxLat; lat += 0.5) {
      const py = map.latLngToContainerPoint([lat, location.longitude]).y;
      if (py >= 0 && py <= size.y) {
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(size.x, py);
        ctx.stroke();
        ctx.fillText(`${lat.toFixed(1)}°N`, 8, py - 3);
      }
    }

    for (let lon = minLon; lon <= maxLon; lon += 0.5) {
      const px = map.latLngToContainerPoint([location.latitude, lon]).x;
      if (px >= 0 && px <= size.x) {
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, size.y);
        ctx.stroke();
        ctx.fillText(`${lon.toFixed(1)}°E`, px + 4, size.y - 8);
      }
    }

    // Doppler Range Rings (25km, 50km, 100km, 150km)
    ctx.strokeStyle = isDarkMode ? 'rgba(56, 189, 248, 0.26)' : 'rgba(2, 132, 199, 0.28)';
    ctx.setLineDash([5, 6]);
    const ringScales = [
      { mult: 0.35, label: '25 km' },
      { mult: 0.7, label: '50 km' },
      { mult: 1.15, label: '100 km' },
      { mult: 1.65, label: '150 km' }
    ];
    ringScales.forEach(({ mult, label }) => {
      const r = degPixelScale * mult;
      ctx.beginPath();
      ctx.arc(centerPt.x, centerPt.y, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.setLineDash([]);
      ctx.fillStyle = isDarkMode ? 'rgba(125, 211, 252, 0.75)' : 'rgba(3, 105, 161, 0.85)';
      ctx.fillText(label, centerPt.x + 6, centerPt.y - r + 11);
      ctx.restore();
    });

    // Cardinal Crosshair Axes through Primary Hub
    ctx.beginPath();
    ctx.moveTo(centerPt.x - degPixelScale * 1.65, centerPt.y);
    ctx.lineTo(centerPt.x + degPixelScale * 1.65, centerPt.y);
    ctx.moveTo(centerPt.x, centerPt.y - degPixelScale * 1.65);
    ctx.lineTo(centerPt.x, centerPt.y + degPixelScale * 1.65);
    ctx.stroke();
    ctx.restore();

    // B. Render Atmospheric Doppler & Satellite Cells from Live Open-Meteo Telemetry Nodes
    ctx.save();
    ctx.globalAlpha = opacity;

    const nodesToRender: RadarGridNode[] =
      telemetryNodes.length > 0
        ? telemetryNodes
        : [
            {
              id: 'CENTER',
              label: location.name,
              lat: location.latitude,
              lon: location.longitude,
              temp: 12,
              precipitation: 1.2,
              rainProb: 55,
              windSpeed: 22,
              windDirection: 240,
              weatherCode: 61,
              cloudCover: 72,
              isStormCell: false
            }
          ];

    const isIrMode = activeLayerId === 'openmeteo-infrared';
    const isWvMode = activeLayerId === 'iem-water-vapor';
    const isAccumMode = activeLayerId === 'iem-precip-1h';
    const isNexradMode = activeLayerId === 'iem-nexrad';

    nodesToRender.forEach((node, idx) => {
      // Calculate wind-advected position for the current timeline frame
      const windRad = ((node.windDirection - 180) * Math.PI) / 180;
      const speedFactor = Math.max(0.15, Math.min(0.7, node.windSpeed / 50));
      const dLatAdvect = Math.cos(windRad) * speedFactor * normStep * 0.55;
      const dLonAdvect = Math.sin(windRad) * speedFactor * normStep * 0.75;

      const cellLat = node.lat + dLatAdvect;
      const cellLon = node.lon + dLonAdvect;
      const pt = map.latLngToContainerPoint([cellLat, cellLon]);

      const baseIntensity = isIrMode
        ? Math.max(0.28, node.cloudCover / 100)
        : isWvMode
        ? Math.max(0.3, (node.cloudCover * 0.6 + node.rainProb * 0.4) / 100)
        : Math.max(
            0.24,
            Math.min(
              1.0,
              node.precipitation * 0.3 +
                (node.rainProb / 100) * 0.55 +
                (node.cloudCover / 100) * 0.25
            )
          );

      const pulse = 1 + 0.08 * Math.sin(currentFrameIdx * 0.6 + idx * 1.3);
      const cellRadius = degPixelScale * (0.46 + baseIntensity * 0.55) * pulse;

      const grad = ctx.createRadialGradient(
        pt.x,
        pt.y,
        cellRadius * 0.05,
        pt.x,
        pt.y,
        cellRadius
      );

      if (isIrMode) {
        grad.addColorStop(0, 'rgba(217, 70, 239, 0.62)');
        grad.addColorStop(0.35, 'rgba(99, 102, 241, 0.44)');
        grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.24)');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      } else if (isWvMode) {
        grad.addColorStop(0, 'rgba(99, 102, 241, 0.60)');
        grad.addColorStop(0.4, 'rgba(34, 211, 238, 0.42)');
        grad.addColorStop(0.75, 'rgba(20, 184, 166, 0.22)');
        grad.addColorStop(1, 'rgba(180, 83, 9, 0)');
      } else if (isAccumMode) {
        grad.addColorStop(0, 'rgba(147, 51, 234, 0.66)');
        grad.addColorStop(0.35, 'rgba(59, 130, 246, 0.48)');
        grad.addColorStop(0.7, 'rgba(45, 212, 191, 0.26)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      } else {
        if (node.isStormCell || baseIntensity > 0.6) {
          grad.addColorStop(0, activePalette.intenseRgba);
          grad.addColorStop(0.32, activePalette.coreRgba);
          grad.addColorStop(0.68, activePalette.midRgba);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          grad.addColorStop(0, activePalette.coreRgba);
          grad.addColorStop(0.45, activePalette.midRgba);
          grad.addColorStop(0.82, activePalette.outerRgba);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, cellRadius, 0, Math.PI * 2);
      ctx.fill();

      // Secondary and tertiary echo lobes for authentic asymmetric radar band structure
      [0.36, -0.32].forEach((offsetFactor, lobeIdx) => {
        const subAngle = idx * 1.1 + currentFrameIdx * 0.16 + lobeIdx * 1.9;
        const subX = pt.x + Math.cos(subAngle) * (cellRadius * Math.abs(offsetFactor));
        const subY = pt.y + Math.sin(subAngle) * (cellRadius * Math.abs(offsetFactor));
        const subRadius = cellRadius * (lobeIdx === 0 ? 0.64 : 0.48);
        const subGrad = ctx.createRadialGradient(subX, subY, 2, subX, subY, subRadius);
        subGrad.addColorStop(0, isIrMode ? 'rgba(129, 140, 248, 0.42)' : activePalette.midRgba);
        subGrad.addColorStop(0.65, isIrMode ? 'rgba(56, 189, 248, 0.18)' : activePalette.outerRgba);
        subGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = subGrad;
        ctx.beginPath();
        ctx.arc(subX, subY, subRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Iso-Reflectivity / dBZ Contour Ring on NEXRAD & Doppler modes
      if (isNexradMode || node.isStormCell || baseIntensity > 0.45) {
        ctx.save();
        ctx.strokeStyle = node.isStormCell ? 'rgba(244, 63, 94, 0.72)' : activePalette.contourHex;
        ctx.globalAlpha = opacity * 0.55;
        ctx.lineWidth = isNexradMode ? 1.5 : 1;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, cellRadius * 0.42, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Snow / Ice Reflectivity Crystalline Ring when Snow Mask is enabled and temp <= 4°C
      if (showSnowMask && (node.temp <= 4 || node.weatherCode >= 71)) {
        ctx.save();
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.78)';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, cellRadius * 0.58, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // E. Storm Cell Motion Vector Cones (+15m, +30m, +60m) & Lightning Strike Tracker
      if (showStormVectors && (node.isStormCell || node.precipitation >= 0.4 || node.rainProb >= 45)) {
        ctx.save();
        const travelRad = ((node.windDirection - 180) * Math.PI) / 180;
        const coneLength = Math.max(42, Math.min(110, node.windSpeed * 2.4));
        const spreadAngle = 0.24; // ~14 deg cone half-angle

        const leftX = pt.x + Math.cos(travelRad - spreadAngle) * coneLength;
        const leftY = pt.y + Math.sin(travelRad - spreadAngle) * coneLength;
        const rightX = pt.x + Math.cos(travelRad + spreadAngle) * coneLength;
        const rightY = pt.y + Math.sin(travelRad + spreadAngle) * coneLength;

        const coneGrad = ctx.createLinearGradient(
          pt.x,
          pt.y,
          pt.x + Math.cos(travelRad) * coneLength,
          pt.y + Math.sin(travelRad) * coneLength
        );
        coneGrad.addColorStop(0, node.isStormCell ? 'rgba(244, 63, 94, 0.42)' : 'rgba(56, 189, 248, 0.34)');
        coneGrad.addColorStop(1, 'rgba(245, 158, 11, 0.04)');

        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(leftX, leftY);
        ctx.arc(pt.x, pt.y, coneLength, travelRad - spreadAngle, travelRad + spreadAngle);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = node.isStormCell ? 'rgba(251, 113, 133, 0.85)' : 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 1.25;
        ctx.setLineDash([3, 3]);
        ctx.stroke();

        // +15m, +30m, +60m Isochrone Arcs inside Motion Cone
        [
          { frac: 0.33, tag: '+15m' },
          { frac: 0.66, tag: '+30m' },
          { frac: 1.0, tag: '+60m' }
        ].forEach(({ frac, tag }) => {
          const rArc = coneLength * frac;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, rArc, travelRad - spreadAngle, travelRad + spreadAngle);
          ctx.stroke();

          if (frac === 1.0) {
            const labelX = pt.x + Math.cos(travelRad) * (rArc + 10);
            const labelY = pt.y + Math.sin(travelRad) * (rArc + 10);
            ctx.setLineDash([]);
            ctx.font = '800 9px ui-monospace, monospace';
            ctx.fillStyle = node.isStormCell ? '#fda4af' : '#7dd3fc';
            ctx.fillText(tag, labelX - 12, labelY + 3);
          }
        });

        // Lightning Strike Discharge Bolt on Convective Cells
        if (node.isStormCell || node.weatherCode >= 95 || node.precipitation >= 2.0) {
          const boltX = pt.x + Math.sin(currentFrameIdx * 1.7 + idx) * 8;
          const boltY = pt.y - 6;
          ctx.setLineDash([]);
          ctx.fillStyle = '#fde047';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(boltX + 2, boltY - 7);
          ctx.lineTo(boltX - 3, boltY);
          ctx.lineTo(boltX + 1, boltY);
          ctx.lineTo(boltX - 2, boltY + 7);
          ctx.lineTo(boltX + 4, boltY - 1);
          ctx.lineTo(boltX, boltY - 1);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }
    });

    // C. Continuous Windy.com-Style Animated Wind Particle Streamlines
    if (showWindStreamlines) {
      ctx.save();
      const particleCount = 135;
      if (windParticlesRef.current.length !== particleCount) {
        windParticlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
          x: ((i * 73) % Math.max(100, size.x)),
          y: ((i * 137) % Math.max(100, size.y)),
          age: (i * 19) % 85,
          maxAge: 75 + (i % 35),
          speedFactor: 0.75 + (i % 5) * 0.14
        }));
      }

      const domNode = nodesToRender[0] || { windDirection: 235, windSpeed: 20 };
      const baseFlowRad = ((domNode.windDirection - 180) * Math.PI) / 180;
      const baseVel = Math.max(1.2, Math.min(4.8, (domNode.windSpeed / 12)));

      windParticlesRef.current.forEach((p, idx) => {
        // Interpolate slight spatial curl from nearby sector nodes
        const waveCurl = Math.sin(p.x * 0.008 + p.y * 0.008 + currentFrameIdx * 0.15) * 0.28;
        const angle = baseFlowRad + waveCurl;
        const vx = Math.cos(angle) * baseVel * p.speedFactor;
        const vy = Math.sin(angle) * baseVel * p.speedFactor;

        const tailLen = Math.max(10, baseVel * 6.5 * p.speedFactor);
        const tailX = p.x - Math.cos(angle) * tailLen;
        const tailY = p.y - Math.sin(angle) * tailLen;

        const lifeAlpha = Math.sin((p.age / p.maxAge) * Math.PI) * 0.78;
        const strokeGrad = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
        const headColor =
          domNode.windSpeed >= 38
            ? `rgba(251, 113, 133, ${lifeAlpha})`
            : domNode.windSpeed >= 24
            ? `rgba(251, 191, 36, ${lifeAlpha})`
            : `rgba(56, 189, 248, ${lifeAlpha})`;
        strokeGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        strokeGrad.addColorStop(1, headColor);

        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = idx % 4 === 0 ? 2.1 : 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Advance particle for next render tick
        p.x += vx * 2.2;
        p.y += vy * 2.2;
        p.age += 1;

        if (p.age >= p.maxAge || p.x < -20 || p.x > size.x + 20 || p.y < -20 || p.y > size.y + 20) {
          p.x = Math.random() * size.x;
          p.y = Math.random() * size.y;
          p.age = 0;
        }
      });
      ctx.restore();
    }

    // D. Rotating 360° Doppler Sweep Beam with Phosphor Wake from Observation Hub
    const sweepAngle = ((currentFrameIdx * 28) % 360) * (Math.PI / 180);
    const sweepRadius = degPixelScale * 1.65;
    ctx.save();
    ctx.strokeStyle = theme.accentColors.primary;
    ctx.globalAlpha = opacity * 0.48;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(centerPt.x, centerPt.y);
    ctx.lineTo(
      centerPt.x + Math.cos(sweepAngle) * sweepRadius,
      centerPt.y + Math.sin(sweepAngle) * sweepRadius
    );
    ctx.stroke();
    ctx.restore();

    ctx.restore();
    ctx.restore();
  }, [
    activeLayerId,
    activePalette,
    basemapStyle,
    currentFrameIdx,
    frames.length,
    isDarkMode,
    location.latitude,
    location.longitude,
    location.name,
    opacity,
    showSnowMask,
    showStormVectors,
    showWindStreamlines,
    telemetryNodes,
    theme.accentColors.primary
  ]);

  useEffect(() => {
    renderDopplerFieldCanvas();
  }, [renderDopplerFieldCanvas, mapViewRevision]);

  // Smooth 30fps Wind Particle Streamline Animation Loop when Wind Flow is enabled
  useEffect(() => {
    if (!showWindStreamlines) return;
    const animInterval = setInterval(() => {
      renderDopplerFieldCanvas();
    }, 45);
    return () => clearInterval(animInterval);
  }, [showWindStreamlines, renderDopplerFieldCanvas]);

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
      setMapViewRevision((r) => r + 1);
    }, 150);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  const activeFrame = frames[currentFrameIdx];
  const activeTimeLabel = activeFrame
    ? new Date(activeFrame.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  const isNowcast =
    radarMeta &&
    activeLayerId !== 'openmeteo-infrared' &&
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
            {activeLayerId === 'openmeteo-infrared' || activeLayerId === 'iem-water-vapor' ? (
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
                  Live Telemetry Stream
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
          {/* Basemap Style Selector */}
          <div
            className={`flex flex-wrap items-center gap-1 p-1 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}
          >
            <MapIcon className={`w-3.5 h-3.5 ml-1.5 ${theme.ui.accentText}`} />
            {BASEMAP_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setBasemapStyle(style.id)}
                title={style.providerName}
                className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                  basemapStyle === style.id
                    ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                    : `${theme.ui.secondaryText} hover:${theme.ui.primaryText}`
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          {/* Wind Streamlines Toggle */}
          <button
            type="button"
            onClick={() => setShowWindStreamlines(!showWindStreamlines)}
            className={`relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              showWindStreamlines
                ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
            }`}
            title="Toggle Animated Wind Particle Streamlines"
          >
            {!showWindStreamlines && <ThemeTileArt theme={theme} variant="pill" index={0} />}
            <Wind className="relative z-10 w-3.5 h-3.5" />
            <span className="relative z-10 hidden md:inline">Wind Particles</span>
          </button>

          {/* Storm Cell Motion Vectors & Lightning Toggle */}
          <button
            type="button"
            onClick={() => setShowStormVectors(!showStormVectors)}
            className={`relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              showStormVectors
                ? `${theme.ui.activePill} ${theme.ui.activePillText}`
                : `${theme.ui.tileSurface} ${theme.ui.tileBorder} ${theme.ui.primaryText}`
            }`}
            title="Toggle Storm Cell Motion Cones (+15/+30/+60m) & Lightning Tracker"
          >
            {!showStormVectors && <ThemeTileArt theme={theme} variant="pill" index={2} />}
            <Zap className="relative z-10 w-3.5 h-3.5" />
            <span className="relative z-10 hidden md:inline">Storm Vectors</span>
          </button>

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
              Radar:
            </span>
            <input
              type="range"
              min="0.2"
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

      {/* Multi-Layer Radar Mode & Color Palette Switcher Bar */}
      <div
        className={`relative z-10 px-4 sm:px-5 py-3 border-b ${theme.ui.dividerBorder} flex flex-wrap items-center justify-between gap-3`}
      >
        {/* 5 Radar Layer Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`text-[11px] font-black uppercase tracking-wider ${theme.ui.subheadingText} flex items-center gap-1 mr-1`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Radar Mode:</span>
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
        {activeLayerId !== 'openmeteo-infrared' && activeLayerId !== 'iem-water-vapor' && (
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
      <div
        className={`relative w-full ${
          isFullscreen ? 'flex-1' : 'h-[480px] sm:h-[540px]'
        } bg-slate-900`}
      >
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Georeferenced Live Doppler & Satellite Synthesis Canvas Overlay */}
        <canvas
          ref={dopplerCanvasRef}
          className="pointer-events-none absolute inset-0 w-full h-full z-[15]"
        />

        {isLoading && (
          <div
            className={`absolute inset-0 ${theme.ui.cardSurface} flex items-center justify-center z-20 ${theme.ui.primaryText} gap-2`}
          >
            <Loader2 className={`w-5 h-5 animate-spin ${theme.ui.accentText}`} />
            <span className="text-xs font-black">
              Initializing Multi-Sector Doppler &amp; Satellite Array...
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
                <span className="relative z-10">8 Surrounding Sectors Monitored</span>
              </>
            )}
          </div>

          {/* Time-to-Arrival Storm / Precip Countdown Pill */}
          <div
            className={`relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full ${theme.ui.cardSurface} ${theme.ui.cardBorder} ${theme.ui.primaryText} text-[11px] font-black shadow-lg`}
          >
            <ThemeTileArt theme={theme} variant="pill" index={5} />
            <Clock className={`relative z-10 w-3.5 h-3.5 ${theme.ui.accentText}`} />
            <span className="relative z-10 font-mono">
              {activeStormCellCount > 0
                ? `Precip Arrival ETA: ~${Math.max(
                    12,
                    Math.round(
                      48 /
                        Math.max(
                          12,
                          telemetryNodes[0]?.windSpeed || 22
                        ) *
                        18
                    )
                  )} min`
                : 'No Precip Echoes Within 60m'}
            </span>
          </div>
        </div>

        {/* Dynamic Layer Intensity Scale Legend */}
        <div
          className={`absolute bottom-6 right-4 z-20 overflow-hidden p-3 rounded-2xl ${theme.ui.cardSurface} ${theme.ui.cardBorder} shadow-xl text-[10px] space-y-1.5 min-w-[205px] max-w-[235px]`}
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
            {activeLayerId === 'openmeteo-infrared' || activeLayerId === 'iem-water-vapor'
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

      {/* 3D Terrain & Elevation Micro-Profile Inspector (Click Anywhere on Map) */}
      {terrainProfile && (
        <div
          className={`relative z-10 p-4 sm:p-5 border-t ${theme.ui.dividerBorder} ${theme.ui.cardSurface}`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Mountain className={`w-4 h-4 ${theme.ui.accentText}`} />
                <span className={`text-xs font-black ${theme.ui.primaryText}`}>
                  3D Terrain &amp; Altitude Micro-Profile Inspector
                </span>
                <span className={`text-[11px] font-mono ${theme.ui.secondaryText}`}>
                  · {terrainProfile.lat.toFixed(3)}°N, {terrainProfile.lon.toFixed(3)}°E
                </span>
                {isLoadingTerrain && (
                  <Loader2 className={`w-3.5 h-3.5 animate-spin ${theme.ui.accentText}`} />
                )}
              </div>
              <p className={`text-[11px] font-semibold ${theme.ui.secondaryText}`}>
                Click any mountain, valley, or coastline on the map above to sample real-time elevation, lapse-rate temperature, and snow-line height.
              </p>
            </div>

            {/* Key Altitude Telemetry Readouts */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 shrink-0">
              <div className={`px-3 py-2 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
                  Surface Elevation
                </span>
                <span className={`text-sm font-black font-mono tabular-nums ${theme.ui.primaryText}`}>
                  {terrainProfile.elevationM} m
                </span>
              </div>
              <div className={`px-3 py-2 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
                  Altitude Temp
                </span>
                <span className={`text-sm font-black font-mono tabular-nums ${theme.ui.primaryText}`}>
                  {terrainProfile.temperatureC.toFixed(1)}°C
                </span>
              </div>
              <div className={`px-3 py-2 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
                  Wind Chill
                </span>
                <span className={`text-sm font-black font-mono tabular-nums ${theme.ui.primaryText}`}>
                  {terrainProfile.windChillC.toFixed(1)}°C
                </span>
              </div>
              <div className={`px-3 py-2 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
                  Freezing Level (0°C)
                </span>
                <span className="text-sm font-black font-mono tabular-nums text-cyan-400">
                  {terrainProfile.freezingLevelM} m
                </span>
              </div>
              <div className={`px-3 py-2 rounded-xl ${theme.ui.tileSurface} ${theme.ui.tileBorder}`}>
                <span className={`text-[10px] font-bold ${theme.ui.secondaryText} block`}>
                  Snow LineEst.
                </span>
                <span className="text-sm font-black font-mono tabular-nums text-sky-300">
                  {terrainProfile.snowLineM} m
                </span>
              </div>
            </div>
          </div>

          {/* 5-Point West-to-East Terrain Cross-Section SVG */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1.5">
              <span className={theme.ui.secondaryText}>West (-15 km)</span>
              <span className={theme.ui.subheadingText}>
                Barometric Pressure: {terrainProfile.pressureHpa} hPa · Lapse Rate: -6.5°C / 1000m
              </span>
              <span className={theme.ui.secondaryText}>East (+15 km)</span>
            </div>
            <div className="w-full h-16 rounded-xl bg-slate-950/45 border border-white/10 p-2 flex items-end justify-between gap-2">
              {terrainProfile.transect.map((pt, i) => {
                const maxEl = Math.max(
                  300,
                  ...terrainProfile.transect.map((t) => t.elevationM)
                );
                const heightPct = Math.max(18, Math.min(100, (pt.elevationM / maxEl) * 100));
                const isCenter = i === 2;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        isCenter
                          ? 'bg-gradient-to-t from-sky-500 to-cyan-300'
                          : 'bg-gradient-to-t from-slate-700 to-slate-500/80'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <div className="flex items-center gap-1 text-[9px] font-mono tabular-nums">
                      <span className="font-black text-slate-200">{pt.elevationM}m</span>
                      <span className="text-sky-300">({pt.tempC}°C)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
