import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Compass,
  CornerUpRight,
  Maximize2,
  Sparkles,
} from 'lucide-react';

interface NYCTaxiMapProps {
  pickup: [number, number]; // [lat, lon]
  dropoff: [number, number]; // [lat, lon]
  distanceMiles: number;
  bearingDegrees: number;
  onCoordinatesChange: (pickup: [number, number], dropoff: [number, number]) => void;
}

const LANDMARK_BUTTONS = [
  { name: 'Times Square', coords: [40.7580, -73.9855] as [number, number], borough: 'Manhattan' },
  { name: 'Wall Street', coords: [40.7070, -74.0090] as [number, number], borough: 'Manhattan' },
  { name: 'JFK Airport', coords: [40.6413, -73.7781] as [number, number], borough: 'Queens' },
  { name: 'LaGuardia (LGA)', coords: [40.7769, -73.8740] as [number, number], borough: 'Queens' },
  { name: 'Newark (EWR)', coords: [40.6895, -74.1745] as [number, number], borough: 'New Jersey' },
  { name: 'Brooklyn DUMBO', coords: [40.7020, -73.9930] as [number, number], borough: 'Brooklyn' },
  { name: 'Central Park', coords: [40.7660, -73.9765] as [number, number], borough: 'Manhattan' },
  { name: 'Williamsburg', coords: [40.7140, -73.9570] as [number, number], borough: 'Brooklyn' },
];

export const NYCTaxiMap: React.FC<NYCTaxiMapProps> = ({
  pickup,
  dropoff,
  distanceMiles,
  bearingDegrees,
  onCoordinatesChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const dropoffMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [activePinTarget, setActivePinTarget] = useState<'pickup' | 'dropoff'>('dropoff');

  // Custom DivIcon HTML markers
  const createMarkerIcon = (color: string, label: string) => {
    return L.divIcon({
      className: 'custom-taxi-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: grab;">
          <div style="background-color: ${color}; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff;"></div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255,255,255,0.2); color: #ffffff; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px; margin-top: 2px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
            ${label}
          </div>
        </div>
      `,
      iconSize: [30, 48],
      iconAnchor: [15, 24],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: [40.735, -73.935],
        zoom: 11,
        zoomControl: true,
      });

      // Dark CartoDB map tiles for sleek theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Create Markers
      const pMarker = L.marker(pickup, {
        draggable: true,
        icon: createMarkerIcon('#22c55e', 'Pickup'),
      }).addTo(map);

      const dMarker = L.marker(dropoff, {
        draggable: true,
        icon: createMarkerIcon('#ef4444', 'Dropoff'),
      }).addTo(map);

      // Create Route Line
      const routeLine = L.polyline([pickup, dropoff], {
        color: '#facc15',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.9,
      }).addTo(map);

      // Drag events
      pMarker.on('dragend', () => {
        const pos = pMarker.getLatLng();
        onCoordinatesChange([pos.lat, pos.lng], dropoff);
      });

      dMarker.on('dragend', () => {
        const pos = dMarker.getLatLng();
        onCoordinatesChange(pickup, [pos.lat, pos.lng]);
      });

      // Map click handler: moves active pin target
      map.on('click', (e: L.LeafletMouseEvent) => {
        const clickedPos: [number, number] = [e.latlng.lat, e.latlng.lng];
        if (activePinTarget === 'pickup') {
          onCoordinatesChange(clickedPos, dropoff);
          setActivePinTarget('dropoff');
        } else {
          onCoordinatesChange(pickup, clickedPos);
          setActivePinTarget('pickup');
        }
      });

      mapRef.current = map;
      pickupMarkerRef.current = pMarker;
      dropoffMarkerRef.current = dMarker;
      polylineRef.current = routeLine;
    }

    return () => {
      // Keep map instance persistent
    };
  }, []);

  // Update positions when props change
  useEffect(() => {
    if (pickupMarkerRef.current && dropoffMarkerRef.current && polylineRef.current) {
      pickupMarkerRef.current.setLatLng(pickup);
      dropoffMarkerRef.current.setLatLng(dropoff);
      polylineRef.current.setLatLngs([pickup, dropoff]);
    }
  }, [pickup, dropoff]);

  const fitBounds = () => {
    if (mapRef.current) {
      mapRef.current.fitBounds([pickup, dropoff], { padding: [50, 50] });
    }
  };

  const handleLandmarkClick = (coords: [number, number]) => {
    if (activePinTarget === 'pickup') {
      onCoordinatesChange(coords, dropoff);
      setActivePinTarget('dropoff');
    } else {
      onCoordinatesChange(pickup, coords);
      setActivePinTarget('pickup');
    }
  };

  return (
    <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-4 space-y-3 shadow-2xl flex flex-col">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Pickup:</span>
            <span className="font-mono text-slate-400">{pickup[0].toFixed(4)}, {pickup[1].toFixed(4)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">Dropoff:</span>
            <span className="font-mono text-slate-400">{dropoff[0].toFixed(4)}, {dropoff[1].toFixed(4)}</span>
          </div>
        </div>

        {/* Dynamic Route Telemetry */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-300">
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <span>{distanceMiles} miles</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>{bearingDegrees}°</span>
          </div>

          <button
            onClick={fitBounds}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            title="Fit Map to Route Bounds"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Map Surface */}
      <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-slate-800/80 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Instruction Overlay */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-[11px] text-slate-300 shadow-lg">
          📍 Drag pins or click map to move <strong className={activePinTarget === 'pickup' ? 'text-emerald-400' : 'text-rose-400'}>{activePinTarget.toUpperCase()}</strong>
        </div>

        {/* Pin Target Toggle Switch */}
        <div className="absolute bottom-3 right-3 z-20 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 flex gap-1 text-xs">
          <button
            onClick={() => setActivePinTarget('pickup')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              activePinTarget === 'pickup' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🟢 Set Pickup
          </button>
          <button
            onClick={() => setActivePinTarget('dropoff')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              activePinTarget === 'dropoff' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔴 Set Dropoff
          </button>
        </div>
      </div>

      {/* Quick NYC Landmarks Hotspots */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Quick Landmark Presets (Click to place active pin):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LANDMARK_BUTTONS.map((lm) => (
            <button
              key={lm.name}
              onClick={() => handleLandmarkClick(lm.coords)}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg text-xs transition-colors flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{lm.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
