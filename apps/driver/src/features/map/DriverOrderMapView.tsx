"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "@repo/ui/motion";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { DriverActiveOrder } from "@repo/types";
import { Store, MapPin } from "@repo/ui/icons";

type MapFly = { fitBounds: (bounds: [[number, number], [number, number]], opts?: { padding?: number; duration?: number }) => void };
type MapLike = { getMap: () => MapFly };

export default function DriverOrderMapView({ order }: { order: DriverActiveOrder }) {
  const token = "pk.eyJ1Ijoibmdob2FuZ2hpZW4iLCJhIjoiY21pZG04cmNxMDg3YzJucTFvdzgyYzV5ZiJ9.adJF69BzLTkmZZysMXgUhw";
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

  const hasDriver = isValidCoordinate(order.driverLocation.lat, order.driverLocation.lng);
  const hasPickup = isValidCoordinate(order.pickup.lat, order.pickup.lng);
  const hasDropoff = isValidCoordinate(order.dropoff.lat, order.dropoff.lng);

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
      // Only fetch driver route if driver location is valid
      const a = hasDriver ? await fetchRoute(order.driverLocation, order.pickup) : null;
      const b = await fetchRoute(order.pickup, order.dropoff);
      setDriverRoute(a);
      setDeliveryRoute(b);

      const inst = mapRef.current as MapLike | null;
      const coords: [number, number][] = [
        ...(a?.geometry?.coordinates ?? []),
        ...(b?.geometry?.coordinates ?? []),
        ...(hasDriver ? [[order.driverLocation.lng, order.driverLocation.lat] as [number, number]] : []),
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
  }, [order, token]);

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
                  [order.driverLocation.lng, order.driverLocation.lat],
                  [order.pickup.lng, order.pickup.lat],
                ];
            })()
            : [
              [order.driverLocation.lng, order.driverLocation.lat],
              [order.pickup.lng, order.pickup.lat],
            ],
      },
      properties: {},
    };
  }, [driverRoute, progressA, order.driverLocation.lng, order.driverLocation.lat, order.pickup.lng, order.pickup.lat, hasDriver, hasPickup]);

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
                  [order.pickup.lng, order.pickup.lat],
                  [order.dropoff.lng, order.dropoff.lat],
                ];
            })()
            : [
              [order.pickup.lng, order.pickup.lat],
              [order.dropoff.lng, order.dropoff.lat],
            ],
      },
      properties: {},
    };
  }, [deliveryRoute, progressB, order.pickup.lng, order.pickup.lat, order.dropoff.lng, order.dropoff.lat, hasPickup, hasDropoff]);

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
        <Layer id="driver-to-pickup" type="line" layout={{ "line-cap": "round", "line-join": "round" }} paint={{ "line-color": "#78C841", "line-width": 5, "line-opacity": 0.95 }} />
        <Layer id="pickup-to-dropoff" type="line" layout={{ "line-cap": "round", "line-join": "round" }} paint={{ "line-color": "#78C841", "line-width": 5, "line-opacity": 0.95 }} />
      </Source>

      {/* 2. Markers */}
      {hasPickup && (
        <Marker longitude={order.pickup.lng} latitude={order.pickup.lat} anchor="bottom">
          <div className="flex flex-col items-center">
            <div className="bg-white p-1.5 rounded-full shadow-lg border-2 border-emerald-500">
              <Store className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="w-1 h-2 bg-emerald-500" />
          </div>
        </Marker>
      )}

      {hasDropoff && (
        <Marker longitude={order.dropoff.lng} latitude={order.dropoff.lat} anchor="bottom">
          <div className="flex flex-col items-center">
            <div className="bg-white p-1.5 rounded-full shadow-lg border-2 border-red-500">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <div className="w-1 h-2 bg-red-500" />
          </div>
        </Marker>
      )}

      {hasDriver && (
        <Marker longitude={order.driverLocation.lng} latitude={order.driverLocation.lat} anchor="center">
          <div className="relative">
            <motion.span
              className="absolute -inset-2 rounded-full border-2 border-blue-500/40"
              animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
          </div>
        </Marker>
      )}

      {etaText && (
        <div className="absolute left-3 top-3 bg-white/90 backdrop-blur-sm border border-gray-200 text-xs text-[#1A1A1A] px-2 py-1 rounded shadow-sm font-semibold">
          {etaText}
        </div>
      )}
    </Map>
  );
}
