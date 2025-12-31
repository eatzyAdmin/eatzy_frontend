"use client";
import { useEffect, useState, useRef } from "react";
import Map, { Marker, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "@repo/ui/icons";

// Local types matching existing codebase patterns
type ViewStateChangeEvent = { viewState: { longitude: number; latitude: number; zoom: number } };
type MapDragEvent = { lngLat: { lng: number; lat: number } };

interface StoreLocationMapProps {
  coords: { lat: number; lng: number } | null;
  onCoordsChange?: (coords: { lat: number; lng: number }) => void;
  isEditing?: boolean;
}

export default function StoreLocationMap({ coords, onCoordsChange, isEditing = false }: StoreLocationMapProps) {
  const token = "pk.eyJ1Ijoibmdob2FuZ2hpZW4iLCJhIjoiY21pZG04cmNxMDg3YzJucTFvdzgyYzV5ZiJ9.adJF69BzLTkmZZysMXgUhw"; // Reusing token
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: coords?.lng || 106.700,
    latitude: coords?.lat || 10.776,
    zoom: 15
  });

  useEffect(() => {
    if (coords && mapRef.current) {
      mapRef.current.flyTo({
        center: [coords.lng, coords.lat],
        zoom: 15,
        duration: 1500, // Smooth fly animation
        essential: true
      });
    }
  }, [coords]);

  if (!token) return <div className="bg-gray-100 h-full w-full flex items-center justify-center">No Map Token</div>;

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={token}
        style={{ width: "100%", height: "100%" }}
      >
        {coords && (
          <Marker
            longitude={coords.lng}
            latitude={coords.lat}
            anchor="bottom"
            draggable={isEditing}
            onDragEnd={(e: MapDragEvent) => {
              if (onCoordsChange) {
                onCoordsChange({ lng: e.lngLat.lng, lat: e.lngLat.lat });
              }
            }}
          >
            <div className="relative -translate-y-1 group">
              <div className={`w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-all ${isEditing ? 'bg-blue-500 scale-110 animate-bounce' : 'bg-[var(--primary)]'}`}>
                <MapPin className="w-6 h-6 text-white" fill="currentColor" size={24} />
              </div>
              {isEditing && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Kéo để thay đổi
                </div>
              )}
            </div>
          </Marker>
        )}
      </Map>
      {!coords && <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">Chưa có vị trí</div>}
    </div>
  );
}
