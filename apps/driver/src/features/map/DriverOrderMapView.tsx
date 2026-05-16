"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "@repo/ui/motion";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { DriverActiveOrder } from "@repo/types";
import { Store, MapPin, User, Bike } from "@repo/ui/icons";

type MapFly = { fitBounds: (bounds: [[number, number], [number, number]], opts?: { padding?: number; duration?: number }) => void };
type MapLike = { getMap: () => MapFly };

export default function DriverOrderMapView({ 
  order, 
  locateVersion = 0,
  currentDriverPos 
}: { 
  order: DriverActiveOrder; 
  locateVersion?: number;
  currentDriverPos?: { lat: number; lng: number } | null;
}) {
  const _X_T = "cGsuZXlKMUlqb2libWRvYjJGdVoyaHBaVzRpTENKaElqb2lZMjFwWkcwNGNtTnhNRGczWXpKdWNURnZkemd5WXpWNVppSjkuYWRKRjY5QnpMVGttWlp5c01YZ1Vodw==";
  const token = typeof window !== 'undefined' ? atob(_X_T) : Buffer.from(_X_T, 'base64').toString();
  const mapRef = useRef<unknown>(null);
  const [driverRoute, setDriverRoute] = useState<{ geometry?: { coordinates: [number, number][] }; distance?: number; duration?: number } | null>(null);
  const [deliveryRoute, setDeliveryRoute] = useState<{ geometry?: { coordinates: [number, number][] }; distance?: number; duration?: number } | null>(null);
  const [progressA, setProgressA] = useState(0);
  const [progressB, setProgressB] = useState(0);

  // Helper to validate coordinates (same as Customer app)
  const isValidCoordinate = (lat: any, lng: any) => {
    if (lat === undefined || lat === null || lng === undefined || lng === null) return false;
    const nLat = Number(lat);
    const nLng = Number(lng);
    if (nLat === 0 && nLng === 0) return false;
    return nLat >= -90 && nLat <= 90 && nLng >= -180 && nLng <= 180;
  };

  // Use real-time position if available, otherwise fallback to order data
  const effectiveDriverPos = useMemo(() => {
    if (isValidCoordinate(currentDriverPos?.lat, currentDriverPos?.lng)) return currentDriverPos!;
    return order.driverLocation;
  }, [currentDriverPos, order.driverLocation]);

  const hasDriver = isValidCoordinate(effectiveDriverPos.lat, effectiveDriverPos.lng);
  const hasPickup = isValidCoordinate(order.pickup.lat, order.pickup.lng);
  const hasDropoff = isValidCoordinate(order.dropoff.lat, order.dropoff.lng);

  // Determine which leg the driver is currently on
  const activeLeg = useMemo(() => {
    const status = order.orderStatus || "";
    // Driver is going to customer
    if (["PICKED_UP", "ARRIVED"].includes(status)) return "TO_DROPOFF";
    // Otherwise, assume driver is going to restaurant (assigned/ready/preparing)
    return "TO_PICKUP";
  }, [order.orderStatus]);

  useEffect(() => {
    if (!hasPickup || !hasDropoff) return;

    const fetchRoute = async (start: { lng: number; lat: number }, end: { lng: number; lat: number }) => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&steps=true&overview=full&language=vi&access_token=${token}`;
        const res = await fetch(url);
        const json = await res.json();
        const r = (json?.routes?.[0] ?? null) as { geometry?: { coordinates: [number, number][] }; distance?: number; duration?: number } | null;
        return r;
      } catch {
        return null;
      }
    };

    (async () => {
      // Leg 1: Always Driver -> Pickup (Used when heading to restaurant)
      const a = hasDriver ? await fetchRoute(effectiveDriverPos, order.pickup) : null;
      
      // Leg 2: 
      // - If heading to customer: Driver -> Dropoff (Active)
      // - If heading to pickup: Restaurant -> Customer (Inactive/Grey)
      const b = (activeLeg === 'TO_DROPOFF') 
        ? await fetchRoute(effectiveDriverPos, order.dropoff)
        : await fetchRoute(order.pickup, order.dropoff);

      setDriverRoute(a);
      setDeliveryRoute(b);

      const inst = mapRef.current as MapLike | null;
      const coords: [number, number][] = [
        ...(a?.geometry?.coordinates ?? []),
        ...(b?.geometry?.coordinates ?? []),
        ...(hasDriver ? [[effectiveDriverPos.lng, effectiveDriverPos.lat] as [number, number]] : []),
        [order.pickup.lng, order.pickup.lat],
        [order.dropoff.lng, order.dropoff.lat],
      ];
      const lngs = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      inst?.getMap()?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 80, duration: 900 }
      );

      const startTime = performance.now();
      const animate = (time: number) => {
        const t = Math.min((time - startTime) / 900, 1);
        setProgressA(t);
        setProgressB(t);
        if (t < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    })();
  }, [order, token, effectiveDriverPos, hasDriver, hasPickup, hasDropoff]);

  // Refit bounds when locateVersion changes
  useEffect(() => {
    if (locateVersion > 0) {
      const inst = mapRef.current as MapLike | null;
      const coords: [number, number][] = [
        [order.pickup.lng, order.pickup.lat],
        [order.dropoff.lng, order.dropoff.lat],
      ];
      if (hasDriver) coords.push([effectiveDriverPos.lng, effectiveDriverPos.lat]);

      const lngs = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      inst?.getMap()?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 80, duration: 900 }
      );
    }
  }, [locateVersion, order, hasDriver, effectiveDriverPos]);

  const partial = (coords: [number, number][], t: number) => {
    const safe = Array.isArray(coords)
      ? coords.filter((c) => Array.isArray(c) && Number.isFinite(c[0]) && Number.isFinite(c[1]))
      : [];
    const n = safe.length;
    if (n === 0) return [];
    if (n === 1) return [safe[0]];
    const tt = Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : 0;
    const total = n - 1;
    const exact = tt * total;
    const idx = Math.floor(exact);
    const frac = exact - idx;
    const sliced = safe.slice(0, Math.max(1, Math.min(n, idx + 1)));
    if (idx < total) {
      const a = safe[idx];
      const b = safe[idx + 1];
      if (a && b) {
        const x = a[0] + (b[0] - a[0]) * frac;
        const y = a[1] + (b[1] - a[1]) * frac;
        sliced.push([x, y]);
      }
    }
    return sliced;
  };

  const driverFeature = useMemo(() => {
    if (!hasDriver || !hasPickup) return null;
    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates:
          driverRoute?.geometry?.coordinates && driverRoute?.geometry?.coordinates.length > 1
            ? (() => {
              const p = partial(driverRoute.geometry.coordinates, progressA);
              return p.length > 1
                ? p
                : [
                  [effectiveDriverPos.lng, effectiveDriverPos.lat],
                  [order.pickup.lng, order.pickup.lat],
                ];
            })()
            : [
              [effectiveDriverPos.lng, effectiveDriverPos.lat],
              [order.pickup.lng, order.pickup.lat],
            ],
      },
      properties: { legId: "driver-to-pickup" },
    };
  }, [driverRoute, progressA, effectiveDriverPos.lng, effectiveDriverPos.lat, order.pickup.lng, order.pickup.lat, hasDriver, hasPickup]);

  const deliveryFeature = useMemo(() => {
    if (!hasPickup || !hasDropoff) return null;
    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates:
          deliveryRoute?.geometry?.coordinates && deliveryRoute?.geometry?.coordinates.length > 1
            ? (() => {
              const p = partial(deliveryRoute.geometry.coordinates, progressB);
              return p.length > 1
                ? p
                : [
                  [activeLeg === 'TO_DROPOFF' ? effectiveDriverPos.lng : order.pickup.lng, activeLeg === 'TO_DROPOFF' ? effectiveDriverPos.lat : order.pickup.lat],
                  [order.dropoff.lng, order.dropoff.lat],
                ];
            })()
            : [
              [activeLeg === 'TO_DROPOFF' ? effectiveDriverPos.lng : order.pickup.lng, activeLeg === 'TO_DROPOFF' ? effectiveDriverPos.lat : order.pickup.lat],
              [order.dropoff.lng, order.dropoff.lat],
            ],
      },
      properties: { legId: "pickup-to-dropoff" },
    };
  }, [deliveryRoute, progressB, order.pickup.lng, order.pickup.lat, order.dropoff.lng, order.dropoff.lat, hasPickup, hasDropoff, activeLeg, effectiveDriverPos.lng, effectiveDriverPos.lat]);

  const lines = useMemo(() => ({ type: "FeatureCollection", features: [driverFeature, deliveryFeature] }), [driverFeature, deliveryFeature]);

  const etaText = useMemo(() => {
    const d1 = Number(driverRoute?.distance ?? 0);
    const d2 = Number(deliveryRoute?.distance ?? 0);
    const dur1 = Number(driverRoute?.duration ?? 0);
    const dur2 = Number(deliveryRoute?.duration ?? 0);
    const km = (d1 + d2) / 1000;
    const min = (dur1 + dur2) / 60;
    if (km <= 0 || min <= 0) return "";
    const kmStr = `${km.toFixed(1)} km`;
    const minStr = `${Math.round(min)} phút`;
    return `${minStr} · ${kmStr}`;
  }, [driverRoute, deliveryRoute]);

  const initialView = { longitude: order.pickup.lng, latitude: order.pickup.lat, zoom: 13 };

  return (
    <Map
      ref={(ref) => {
        (mapRef.current as unknown) = ref as unknown;
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={token}
      initialViewState={initialView}
      style={{ width: "100%", height: "100%" }}
    >
      <Source id="order-lines" type="geojson" data={lines as unknown as never}>
        {/* 1. Inactive Leg (Rendered first, at the bottom) */}
        <Layer 
          id="inactive-leg" 
          type="line" 
          filter={["!=", "legId", activeLeg === 'TO_PICKUP' ? "driver-to-pickup" : "pickup-to-dropoff"]}
          layout={{ "line-cap": "round", "line-join": "round" }} 
          paint={{ 
            "line-color": "#cbd5e1", 
            "line-width": 4,
            "line-opacity": 1
          }} 
        />

        {/* 2. Active Leg Casing (The shadow/outline for the active path) */}
        <Layer 
          id="active-leg-casing" 
          type="line" 
          filter={["==", "legId", activeLeg === 'TO_PICKUP' ? "driver-to-pickup" : "pickup-to-dropoff"]}
          layout={{ "line-cap": "round", "line-join": "round" }} 
          paint={{ 
            "line-color": "#1e40af", 
            "line-width": 10,
            "line-opacity": 0.3 
          }} 
        />

        {/* 3. Active Leg (Rendered last, on the very top) */}
        <Layer 
          id="active-leg" 
          type="line" 
          filter={["==", "legId", activeLeg === 'TO_PICKUP' ? "driver-to-pickup" : "pickup-to-dropoff"]}
          layout={{ "line-cap": "round", "line-join": "round" }} 
          paint={{ 
            "line-color": "#2563eb", 
            "line-width": 6,
            "line-opacity": 1 
          }} 
        />
      </Source>

      {/* 2. Markers */}
      {hasPickup && (
        <Marker longitude={order.pickup.lng} latitude={order.pickup.lat} anchor="bottom">
          <div className="flex flex-col items-center">
            <div className="bg-[#A3E635] p-2 rounded-full shadow-lg border-2 border-white">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="w-1.5 h-2 bg-[#A3E635]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
          </div>
        </Marker>
      )}

      {hasDropoff && (
        <Marker longitude={order.dropoff.lng} latitude={order.dropoff.lat} anchor="bottom">
          <div className="flex flex-col items-center">
            <div className="bg-red-500 p-2 rounded-full shadow-lg border-2 border-white">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="w-1.5 h-2 bg-red-500" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
          </div>
        </Marker>
      )}

      {hasDriver && (
        <Marker longitude={effectiveDriverPos.lng} latitude={effectiveDriverPos.lat} anchor="center">
          <div className="relative">
            <motion.span
              className="absolute -inset-2 rounded-full border-2 border-blue-500/40"
              animate={{ scale: [1, 2], opacity: [0.7, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center relative z-10" />
          </div>
        </Marker>
      )}


    </Map>
  );
}
