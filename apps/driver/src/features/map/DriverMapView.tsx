"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { DriverActiveOrder } from "@repo/types";
import DriverOrderMapView from "./DriverOrderMapView";

type Coords = { lng: number; lat: number };
type MapFly = { flyTo: (opts: { center: [number, number]; zoom?: number; duration?: number }) => void };
type MapLike = { getMap: () => MapFly };

export default function DriverMapView({ locateVersion = 0, activeOrder }: { locateVersion?: number; activeOrder?: DriverActiveOrder | null }) {
  const token = "pk.eyJ1Ijoibmdob2FuZ2hpZW4iLCJhIjoiY21pZG04cmNxMDg3YzJucTFvdzgyYzV5ZiJ9.adJF69BzLTkmZZysMXgUhw";
  const mapRef = useRef<unknown>(null);
  const [userPos, setUserPos] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pulseAt, setPulseAt] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => {
        if (cancelled) return;
        setUserPos({ lng: p.coords.longitude, lat: p.coords.latitude });
      },
      (err) => {
        if (cancelled) return;
        setError(err.message || "Không thể lấy vị trí");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
    return () => {
      cancelled = true;
      if (typeof id === "number") navigator.geolocation.clearWatch(id);
    };
  }, []);

  // Helper to validate coordinates (same as Customer app)
  const isValidCoordinate = (lat: any, lng: any) => {
    if (lat === undefined || lat === null || lng === undefined || lng === null) return false;
    const nLat = Number(lat);
    const nLng = Number(lng);
    if (nLat === 0 && nLng === 0) return false;
    return nLat >= -90 && nLat <= 90 && nLng >= -180 && nLng <= 180;
  };

  const initialView = isValidCoordinate(userPos?.lat, userPos?.lng)
    ? { longitude: userPos!.lng, latitude: userPos!.lat, zoom: 14 }
    : { longitude: 106.66, latitude: 10.76, zoom: 12 };

  const flyToUser = useCallback(() => {
    if (!isValidCoordinate(userPos?.lat, userPos?.lng)) return;
    const inst = mapRef.current as MapLike | null;
    inst?.getMap()?.flyTo({ center: [userPos!.lng, userPos!.lat], zoom: 16, duration: 900 });
  }, [userPos]);

  useEffect(() => {
    flyToUser();
    setPulseAt(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locateVersion]);

  if (!token) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="text-sm text-gray-600">Chưa cấu hình Mapbox token</div>
      </div>
    );
  }

  // If there's an active order, show the order map view
  if (activeOrder) {
    return (
      <div className="w-full h-full">
        <DriverOrderMapView order={activeOrder} />
      </div>
    );
  }

  // Otherwise show normal driver location tracking
  return (
    <div className="w-full h-full">
      <Map
        ref={(ref) => { (mapRef.current as unknown) = ref as unknown; }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={token}
        initialViewState={initialView}
        style={{ width: "100%", height: "100%" }}
      >
        {userPos && (
          <Marker longitude={userPos.lng} latitude={userPos.lat} anchor="center">
            <div className="relative">
              <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
              {pulseAt > 0 && Date.now() - pulseAt < 900 && (
                <div className="absolute -inset-3 rounded-full border-2 border-blue-400/60 animate-ping" />
              )}
            </div>
          </Marker>
        )}

        {error && (
          <div className="absolute left-2 bottom-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-xs text-gray-700 px-2 py-1 rounded">
            {error}
          </div>
        )}
      </Map>
    </div>
  );
}
