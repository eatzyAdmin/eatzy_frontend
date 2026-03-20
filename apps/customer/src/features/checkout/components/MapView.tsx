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
  const _X_T = "cGsuZXlKMUlqb2libWRvYjJGdVoyaHBaVzRpTENKaElqb2lZMjFwWkcwNGNtTnhNRGczWXpKdWNURnZkemd5WXpWNVppSjkuYWRKRjY5QnpMVGttWlp5c01YZ1Vodw==";
  const token = typeof window !== 'undefined' ? atob(_X_T) : Buffer.from(_X_T, 'base64').toString();
  const mapRef = useRef<unknown>(null);
  const animationRef = useRef<number | null>(null);
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
    let cancelled = false;
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => {
        if (cancelled) return;
        const next = { lng: p.coords.longitude, lat: p.coords.latitude };
        setUserPos(next);
        setPickupPosState((prev) => prev ?? next);
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

    const timeoutId = setTimeout(fetchNearbyPlaces, 300);
    return () => clearTimeout(timeoutId);
  }, [pickupPosState, token, onPlacesChange]);

  const animatePickup = (start: Coords, end: Coords, duration = 900, skipReport = false) => {
    if (!Number.isFinite(start.lng) || !Number.isFinite(start.lat) || !Number.isFinite(end.lng) || !Number.isFinite(end.lat)) {
      setPickupPosState(end);
      return;
    }

    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const startTime = performance.now();
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const frame = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeInOutCubic(t);

      const lng = start.lng + (end.lng - start.lng) * easedT;
      const lat = start.lat + (end.lat - start.lat) * easedT;
      const next = { lng, lat };

      setPickupPosState(next);
      if (!skipReport) onPickupChange?.(next);

      if (t < 1) {
        animationRef.current = requestAnimationFrame(frame);
      } else {
        animationRef.current = null;
      }
    };
    animationRef.current = requestAnimationFrame(frame);
  };

  // Sync pickupPos from parent and animate to it
  useEffect(() => {
    if (pickupPos && !isDragging) {
      // Avoid feedback loops: only animate if significantly different
      const start = pickupPosState ?? pickupPos;
      const dist = Math.sqrt(Math.pow(pickupPos.lng - start.lng, 2) + Math.pow(pickupPos.lat - start.lat, 2));

      if (!pickupPosState || dist > 0.00001) {
        animatePickup(start, pickupPos, 700, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupPos?.lng, pickupPos?.lat, isDragging]);

  // Handle fly version changes for forced focus
  useEffect(() => {
    if (!pickupPos || flyVersion === undefined) return;
    const inst = mapRef.current as MapLike | null;
    inst?.getMap()?.flyTo({ center: [pickupPos.lng, pickupPos.lat], zoom: 16, duration: 700 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyVersion]);

  const movePickupToUser = () => {
    if (!userPos) return;
    const start = pickupPosState ?? userPos;
    animatePickup(start, userPos, 900);
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

  const initialView = userPos
    ? { longitude: userPos.lng, latitude: userPos.lat, zoom: 14 }
    : { longitude: 106.66, latitude: 10.76, zoom: 12 };

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
