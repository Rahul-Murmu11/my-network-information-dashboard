import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { NetworkInfo } from '../types';
import { MapPin, Maximize, Layers, Compass } from 'lucide-react';

interface MapSectionProps {
  info: NetworkInfo | null;
  loading: boolean;
  isDarkMode: boolean;
}

export const MapSection: React.FC<MapSectionProps> = ({ info, loading, isDarkMode }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapTileStyle, setMapTileStyle] = useState<'dark' | 'standard'>('dark');

  // Sync state with prop if user toggles theme
  useEffect(() => {
    setMapTileStyle(isDarkMode ? 'dark' : 'standard');
  }, [isDarkMode]);

  useEffect(() => {
    if (!mapContainerRef.current || loading || !info) return;

    const lat = info.latitude || 37.422;
    const lng = info.longitude || -122.084;

    // Initialize Map if not created yet
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 12,
        zoomControl: true,
      });

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([lat, lng], 12);
    }

    const map = mapInstanceRef.current;

    // Update Tile Layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const darkTilesUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const standardTilesUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tileUrl = mapTileStyle === 'dark' ? darkTilesUrl : standardTilesUrl;
    const tileAttrib =
      mapTileStyle === 'dark'
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const newTileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: tileAttrib,
    });

    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;

    // Custom Icon with glowing cyber styling
    const customIcon = L.divIcon({
      className: 'custom-cyber-marker',
      html: `
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(6, 182, 212, 0.3);
            animation: pulse-ring 2s infinite;
          "></div>
          <div style="
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #06b6d4;
            border: 3px solid #ffffff;
            box-shadow: 0 0 15px #06b6d4;
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Update or Add Marker
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.setIcon(customIcon);
    } else {
      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      markerRef.current = marker;
    }

    // Custom Popup content
    const popupContent = `
      <div style="padding: 4px; font-family: 'Poppins', sans-serif;">
        <div style="font-weight: 700; font-size: 14px; color: #06b6d4; margin-bottom: 4px;">
          ${info.countryFlag} ${info.city}, ${info.country}
        </div>
        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 2px;">
          <b>IP Address:</b> <span style="color: #f8fafc; font-family: monospace;">${info.publicIp}</span>
        </div>
        <div style="font-size: 11px; color: #94a3b8; margin-bottom: 2px;">
          <b>ISP:</b> ${info.isp}
        </div>
        <div style="font-size: 11px; color: #94a3b8;">
          <b>Coordinates:</b> ${info.latitude.toFixed(4)}, ${info.longitude.toFixed(4)}
        </div>
      </div>
    `;

    markerRef.current.bindPopup(popupContent).openPopup();

    // Trigger map size invalidate on render
    setTimeout(() => {
      map.invalidateSize();
    }, 300);

  }, [info, loading, mapTileStyle]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && info) {
      mapInstanceRef.current.setView([info.latitude, info.longitude], 13, {
        animate: true,
      });
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }
  };

  return (
    <section className="glass-card rounded-3xl p-6 border border-cyan-500/20 shadow-2xl mb-8 relative">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <span>Interactive Geolocation Map</span>
            </h2>
            <p className="text-xs text-slate-400">
              Approximate location based on IP geolocation data via OpenStreetMap & Leaflet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tile Toggle */}
          <button
            onClick={() => setMapTileStyle((prev) => (prev === 'dark' ? 'standard' : 'dark'))}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 hover:border-cyan-500/40 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tile: {mapTileStyle === 'dark' ? 'Cyber Dark' : 'Standard'}</span>
          </button>

          {/* Recenter */}
          <button
            onClick={handleRecenter}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-400 border border-cyan-500/30 transition-colors active:scale-95"
          >
            <Maximize className="w-3.5 h-3.5" />
            <span>Recenter Map</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[380px] sm:h-[450px] rounded-2xl overflow-hidden border border-slate-800 shadow-inner z-10">
        {loading && (
          <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-cyan-400">
            <MapPin className="w-8 h-8 animate-bounce text-cyan-400" />
            <span className="text-sm font-semibold tracking-wider">Locating Map Coordinates...</span>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          Location Accuracy: City / ISP Node Level
        </span>
        {info && (
          <span className="font-mono text-cyan-300">
            Lat: {info.latitude.toFixed(4)}° | Lng: {info.longitude.toFixed(4)}°
          </span>
        )}
      </div>
    </section>
  );
};
