"use client";
import { useEffect, useRef, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Hand, LocateFixed } from "@repo/ui/icons";

type Coords = { lng: number; lat: number };
type Place = { id: string; text: string; place_name: string; center: [number, number] };
// lightweight structural type to avoid importing MapRef
type MapFly = { flyTo: (opts: { center: [number, number]; zoom?: number; duration?: number }) => void };
type MapLike = { getMap: () => MapFly };
type MapClickEvent = { lngLat: { lng: number; lat: number } };
type LngLatLike = { lng: number; lat: number };
type MapDragEvent = { lngLat?: LngLatLike; target?: { getLngLat?: () => LngLatLike } };

export default function MapView({
  pickupPos,
  onPickupChange,
  onPlacesChange,
  flyVersion,
}: {
  pickupPos?: Coords;
  onPickupChange?: (pos: Coords) => void;
  onPlacesChange?: (places: Place[]) => void;
  flyVersion?: number;
}) {
  const token = "pk.eyJ1Ijoibmdob2FuZ2hpZW4iLCJhIjoiY21pZG04cmNxMDg3YzJucTFvdzgyYzV5ZiJ9.adJF69BzLTkmZZysMXgUhw";
  const mapRef = useRef<unknown>(null);
  const [userPos, setUserPos] = useState<Coords | null>(null);
  const [pickupPosState, setPickupPosState] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const toCoords = (ev: MapDragEvent): Coords | null => {
    const ll = ev?.lngLat ?? ev?.target?.getLngLat?.();
    if (!ll) return null;
    const lng = Array.isArray(ll) ? ll[0] : ll.lng;
    const lat = Array.isArray(ll) ? ll[1] : ll.lat;
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
    return { lng, lat };
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị");
      // Fallback to default Ho Chi Minh City location
      const defaultPos = { lng: 106.6927, lat: 10.7769 };
      setUserPos(defaultPos);
      setPickupPosState(defaultPos);
      return;
    }

    // Try to get current position first (one-time)
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const next = { lng: p.coords.longitude, lat: p.coords.latitude };
        setUserPos(next);
        setPickupPosState((prev) => prev ?? next);
        setError(null);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setError("Không lấy được vị trí - dùng vị trí mặc định");
        // Fallback to default Ho Chi Minh City location
        const defaultPos = { lng: 106.6927, lat: 10.7769 };
        setUserPos(defaultPos);
        setPickupPosState(defaultPos);
      },
      {
        enableHighAccuracy: false, // Faster but less accurate
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      if (!token || !pickupPosState) return;
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${pickupPosState.lng},${pickupPosState.lat}.json?types=poi,address&limit=6&language=vi&access_token=${token}`;
        const res = await fetch(url);
        const json = (await res.json()) as { features: Array<{ id: string; text: string; place_name: string; center: [number, number] }> };
        const items = (json.features ?? []).map((f) => ({ id: f.id, text: f.text, place_name: f.place_name, center: f.center }));
        onPlacesChange?.(items);
      } catch {
        // tránh spam lỗi nền
      }
    };
    fetchNearbyPlaces();
  }, [pickupPosState, token, onPlacesChange]);

  // Nhận pickupPos từ parent và animate tới đó (không tự fly camera)
  useEffect(() => {
    if (pickupPos && !isDragging) {
      const start = pickupPosState ?? pickupPos;
      animatePickup(start, pickupPos, 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupPos?.lng, pickupPos?.lat, isDragging]);

  // Khi parent yêu cầu focus thì mới fly camera
  useEffect(() => {
    if (!pickupPos || flyVersion === undefined) return;
    const inst = mapRef.current as MapLike | null;
    inst?.getMap()?.flyTo({ center: [pickupPos.lng, pickupPos.lat], zoom: 16, duration: 700 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyVersion]);

  if (!token) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="text-sm text-gray-600">Chưa cấu hình Mapbox token</div>
      </div>
    );
  }

  const initialView = userPos ? { longitude: userPos.lng, latitude: userPos.lat, zoom: 14 } : { longitude: 106.66, latitude: 10.76, zoom: 12 };

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

  const movePickupToUser = () => {
    if (!userPos || !pickupPosState) return;
    animatePickup(pickupPosState, userPos);
    const inst = mapRef.current as MapLike | null;
    inst?.getMap()?.flyTo({ center: [userPos.lng, userPos.lat], zoom: 16, duration: 900 });
  };


  return (
    <div className="w-full h-full">
      <Map
        ref={(ref) => {
          // assign via function ref to avoid type conflicts
          (mapRef.current as unknown) = ref as unknown;
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={token}
        initialViewState={initialView}
        style={{ width: "100%", height: "100%" }}
        onClick={(e: MapClickEvent) => {
          const c = toCoords(e);
          if (!c) return;
          animatePickup(pickupPosState ?? c, c, 400);
        }}
      >
        {userPos && (
          <Marker longitude={userPos.lng} latitude={userPos.lat} anchor="center">
            <div className="relative">
              <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
            </div>
          </Marker>
        )}
        {pickupPosState && (
          <Marker
            longitude={pickupPosState.lng}
            latitude={pickupPosState.lat}
            anchor="bottom"
            draggable
            onDragStart={() => {
              setIsDragging(true);
            }}
            onDrag={(e: MapDragEvent) => {
              const c = toCoords(e);
              if (!c) return;
              setPickupPosState(c);
              onPickupChange?.(c);
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
              <div className="w-10 h-10 rounded-full bg-[var(--primary)] border-2 border-white shadow-lg flex items-center justify-center">
                <Hand className="w-5 h-5 text-white" />
              </div>
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1" />
            </div>
          </Marker>
        )}

        <button
          onClick={movePickupToUser}
          className="absolute bottom-6 right-4 bg-white shadow-xl w-12 h-12 rounded-full flex items-center justify-center border border-gray-200"
        >
          <LocateFixed className="w-6 h-6 text-[#1A1A1A]" />
        </button>

        {/* Panel địa chỉ đã chuyển ra ngoài RightSidebar */}

        {error && (
          <div className="absolute left-2 bottom-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-xs text-gray-700 px-2 py-1 rounded">
            {error}
          </div>
        )}
      </Map>
    </div>
  );
}
