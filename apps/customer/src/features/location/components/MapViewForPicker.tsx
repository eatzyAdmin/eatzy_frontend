"use client";

import { useEffect, useRef, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Hand } from "@repo/ui/icons";

// ======== Types ========

type Coords = { lng: number; lat: number };
type Place = { id: string; text: string; place_name: string; center: [number, number] };
type MapFly = { flyTo: (opts: { center: [number, number]; zoom?: number; duration?: number }) => void };
type MapLike = { getMap: () => MapFly };
type MapClickEvent = { lngLat: { lng: number; lat: number } };
type LngLatLike = { lng: number; lat: number };
type MapDragEvent = { lngLat?: LngLatLike; target?: { getLngLat?: () => LngLatLike } };

interface MapViewForPickerProps {
  pickupPos?: Coords;
  onPickupChange?: (pos: Coords) => void;
  onPlacesChange?: (places: Place[]) => void;
  flyVersion?: number;
}

// ======== Constants ========

const MAPBOX_TOKEN = "pk.eyJ1Ijoibmdob2FuZ2hpZW4iLCJhIjoiY21pZG04cmNxMDg3YzJucTFvdzgyYzV5ZiJ9.adJF69BzLTkmZZysMXgUhw";

// ======== Component ========

/**
 * Map component specifically for the Location Picker Modal
 * Simplified version focusing on position picking with automatic location detection
 */
export default function MapViewForPicker({
  pickupPos,
  onPickupChange,
  onPlacesChange,
  flyVersion,
}: MapViewForPickerProps) {
  const mapRef = useRef<unknown>(null);
  const [userPos, setUserPos] = useState<Coords | null>(null);
  const [pickupPosState, setPickupPosState] = useState<Coords | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const toCoords = (ev: MapDragEvent): Coords | null => {
    const ll = ev?.lngLat ?? ev?.target?.getLngLat?.();
    if (!ll) return null;
    const lng = Array.isArray(ll) ? ll[0] : ll.lng;
    const lat = Array.isArray(ll) ? ll[1] : ll.lat;
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
    return { lng, lat };
  };

  // Get user's current location on mount
  useEffect(() => {
    let cancelled = false;

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (p) => {
        if (cancelled) return;
        const next = { lng: p.coords.longitude, lat: p.coords.latitude };
        setUserPos(next);

        // Only set pickup position if not provided from props
        if (!pickupPos) {
          setPickupPosState(next);
          onPickupChange?.(next);
        }
      },
      () => {
        // Fallback to HCMC center
        if (cancelled) return;
        const fallback = { lng: 106.6981, lat: 10.7726 };
        setUserPos(fallback);
        if (!pickupPos) {
          setPickupPosState(fallback);
          onPickupChange?.(fallback);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch nearby places when position changes
  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!pickupPosState) return;
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${pickupPosState.lng},${pickupPosState.lat}.json?types=poi,address&limit=6&language=vi&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(url);
        const json = await res.json();
        const items = (json.features ?? []).map((f: { id: string; text: string; place_name: string; center: [number, number] }) => ({
          id: f.id,
          text: f.text,
          place_name: f.place_name,
          center: f.center,
        }));
        onPlacesChange?.(items);
      } catch {
        // Ignore
      }
    };
    fetchNearbyPlaces();
  }, [pickupPosState, onPlacesChange]);

  // Sync external pickupPos from parent (e.g., when user selects a suggestion)
  useEffect(() => {
    if (!pickupPos || isDragging) return;

    // Always update pickupPosState to match pickupPos from parent
    // This ensures the marker is always at the correct position
    setPickupPosState(pickupPos);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupPos?.lng, pickupPos?.lat]);

  // Fly camera when flyVersion changes (triggered after selecting a suggestion)
  useEffect(() => {
    if (!pickupPos || flyVersion === undefined || !mapLoaded) return;

    // Also set pickupPosState here to ensure marker is at correct position
    setPickupPosState(pickupPos);

    const inst = mapRef.current as MapLike | null;
    inst?.getMap()?.flyTo({ center: [pickupPos.lng, pickupPos.lat], zoom: 16, duration: 700 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyVersion, mapLoaded]);

  const animatePickup = (start: Coords, end: Coords, duration = 900) => {
    if (!Number.isFinite(start.lng) || !Number.isFinite(start.lat) || !Number.isFinite(end.lng) || !Number.isFinite(end.lat)) {
      return;
    }
    const startTime = performance.now();
    const frame = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const lng = start.lng + (end.lng - start.lng) * progress;
      const lat = start.lat + (end.lat - start.lat) * progress;
      const next = { lng, lat };
      setPickupPosState(next);
      onPickupChange?.(next);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const initialView = userPos
    ? { longitude: userPos.lng, latitude: userPos.lat, zoom: 15 }
    : { longitude: 106.6981, latitude: 10.7726, zoom: 13 };

  return (
    <div className="w-full h-full">
      <Map
        ref={(ref) => {
          (mapRef.current as unknown) = ref as unknown;
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initialView}
        style={{ width: "100%", height: "100%" }}
        onLoad={() => setMapLoaded(true)}
        onClick={(e: MapClickEvent) => {
          const c = toCoords(e);
          if (!c) return;
          animatePickup(pickupPosState ?? c, c, 400);
        }}
      >
        {/* User's actual location - small blue dot */}
        {userPos && (
          <Marker longitude={userPos.lng} latitude={userPos.lat} anchor="center">
            <div className="relative">
              <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
              <div className="absolute inset-0 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75" />
            </div>
          </Marker>
        )}

        {/* Pickup/Delivery location marker - draggable */}
        {pickupPosState && (
          <Marker
            longitude={pickupPosState.lng}
            latitude={pickupPosState.lat}
            anchor="bottom"
            draggable
            onDragStart={() => setIsDragging(true)}
            onDrag={(e: MapDragEvent) => {
              const c = toCoords(e);
              if (!c) return;
              setPickupPosState(c);
            }}
            onDragEnd={(e: MapDragEvent) => {
              const c = toCoords(e);
              if (c) {
                setPickupPosState(c);
                onPickupChange?.(c);
              }
              setIsDragging(false);
            }}
          >
            <div className="flex flex-col items-center -translate-y-1">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br from-lime-400 to-lime-500 border-3 border-white shadow-xl flex items-center justify-center transition-transform ${isDragging ? 'scale-125' : 'scale-100'
                  }`}
              >
                <Hand className="w-6 h-6 text-white" />
              </div>
              {/* Pin shadow */}
              <div
                className={`w-3 h-3 rounded-full bg-black/20 mt-1 transition-all ${isDragging ? 'scale-150 opacity-50' : 'scale-100 opacity-100'
                  }`}
              />
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
}
