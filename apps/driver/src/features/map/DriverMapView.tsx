"use client";
import { useEffect, useRef, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { LocateFixed } from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";

type Coords = { lng: number; lat: number };
type MapFly = { flyTo: (opts: { center: [number, number]; zoom?: number; duration?: number }) => void };
type MapLike = { getMap: () => MapFly };

export default function DriverMapView() {
  const token = "pk.eyJ1Ijoibmdob2FuZ2hpZW4iLCJhIjoiY21pZG04cmNxMDg3YzJucTFvdzgyYzV5ZiJ9.adJF69BzLTkmZZysMXgUhw";
  const mapRef = useRef<unknown>(null);
  const [userPos, setUserPos] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const initialView = userPos ? { longitude: userPos.lng, latitude: userPos.lat, zoom: 14 } : { longitude: 106.66, latitude: 10.76, zoom: 12 };

  const flyToUser = () => {
    if (!userPos) return;
    const inst = mapRef.current as MapLike | null;
    inst?.getMap()?.flyTo({ center: [userPos.lng, userPos.lat], zoom: 16, duration: 900 });
  };

  if (!token) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="text-sm text-gray-600">Chưa cấu hình Mapbox token</div>
      </div>
    );
  }

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
            </div>
          </Marker>
        )}

        <motion.button
          onClick={flyToUser}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-24 right-4 bg-white shadow-xl w-12 h-12 rounded-full flex items-center justify-center border border-gray-200"
        >
          <LocateFixed className="w-6 h-6 text-[#1A1A1A]" />
        </motion.button>

        {error && (
          <div className="absolute left-2 bottom-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-xs text-gray-700 px-2 py-1 rounded">
            {error}
          </div>
        )}
      </Map>
    </div>
  );
}
