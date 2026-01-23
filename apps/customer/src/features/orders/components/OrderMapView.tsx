"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "@repo/ui/motion";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Order } from "@repo/types";
import { Store, Bike } from "@repo/ui/icons";

type MapFly = { fitBounds: (bounds: [[number, number], [number, number]], opts?: { padding?: number; duration?: number }) => void };
type MapLike = { getMap: () => MapFly };

export default function OrderMapView({ order }: { order: Order }) {
  const token = "pk.eyJ1Ijoibmdob2FuZ2hpZW4iLCJhIjoiY21pZG04cmNxMDg3YzJucTFvdzgyYzV5ZiJ9.adJF69BzLTkmZZysMXgUhw";
  const mapRef = useRef<unknown>(null);
  const [driverRoute, setDriverRoute] = useState<{ geometry?: { coordinates: [number, number][] }; distance?: number; duration?: number } | null>(null);
  const [deliveryRoute, setDeliveryRoute] = useState<{ geometry?: { coordinates: [number, number][] }; distance?: number; duration?: number } | null>(null);
  const [progressA, setProgressA] = useState(0);
  const [progressB, setProgressB] = useState(0);

  const isPending = order.status === "PENDING";

  useEffect(() => {
    // Skip route fetching for PENDING orders (no driver yet)
    if (isPending) {
      setDriverRoute(null);
      setDeliveryRoute(null);
      const inst = mapRef.current as MapLike | null;
      inst?.getMap()?.fitBounds(
        [
          [order.restaurantLocation.lng - 0.01, order.restaurantLocation.lat - 0.01],
          [order.deliveryLocation.lng + 0.01, order.deliveryLocation.lat + 0.01],
        ],
        { padding: 60, duration: 900 }
      );
      return;
    }

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
      const a = await fetchRoute(order.driverLocation, order.restaurantLocation);
      const b = await fetchRoute(order.restaurantLocation, order.deliveryLocation);
      setDriverRoute(a);
      setDeliveryRoute(b);
      const inst = mapRef.current as MapLike | null;
      const coords = [
        ...(a?.geometry?.coordinates ?? []),
        ...(b?.geometry?.coordinates ?? []),
        [order.driverLocation.lng, order.driverLocation.lat],
        [order.restaurantLocation.lng, order.restaurantLocation.lat],
        [order.deliveryLocation.lng, order.deliveryLocation.lat],
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
        { padding: 60, duration: 900 }
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
  }, [order, token, isPending]);

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

  const driverFeature = useMemo(() => ({
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
                [order.restaurantLocation.lng, order.restaurantLocation.lat],
              ];
          })()
          : [
            [order.driverLocation.lng, order.driverLocation.lat],
            [order.restaurantLocation.lng, order.restaurantLocation.lat],
          ],
    },
    properties: {},
  }), [driverRoute, progressA, order.driverLocation.lng, order.driverLocation.lat, order.restaurantLocation.lng, order.restaurantLocation.lat]);

  const deliveryFeature = useMemo(() => ({
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
                [order.restaurantLocation.lng, order.restaurantLocation.lat],
                [order.deliveryLocation.lng, order.deliveryLocation.lat],
              ];
          })()
          : [
            [order.restaurantLocation.lng, order.restaurantLocation.lat],
            [order.deliveryLocation.lng, order.deliveryLocation.lat],
          ],
    },
    properties: {},
  }), [deliveryRoute, progressB, order.restaurantLocation.lng, order.restaurantLocation.lat, order.deliveryLocation.lng, order.deliveryLocation.lat]);

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

  const initialView = { longitude: order.restaurantLocation.lng, latitude: order.restaurantLocation.lat, zoom: 13 };

  return (
    <div className="w-full h-full relative overflow-hidden md:rounded-none">
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
          <Layer id="driver-to-restaurant" type="line" layout={{ "line-cap": "round", "line-join": "round" }} paint={{ "line-color": "#22c55e", "line-width": 6, "line-opacity": isPending ? 0 : 0.8 }} />
          <Layer id="restaurant-to-delivery" type="line" layout={{ "line-cap": "round", "line-join": "round" }} paint={{ "line-color": "#3b82f6", "line-width": 6, "line-opacity": isPending ? 0 : 0.8 }} />
        </Source>

        {/* Delivery Marker */}
        <Marker longitude={order.deliveryLocation.lng} latitude={order.deliveryLocation.lat} anchor="center">
          <div className="relative group">
            <motion.span
              className="absolute -inset-4 rounded-full border border-red-500/30"
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              className="absolute -inset-2 rounded-full border-2 border-red-500/50"
              animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
            />
            <div className="w-5 h-5 bg-red-500 rounded-full border-[3px] border-white shadow-xl relative z-10" />
          </div>
        </Marker>

        {/* Restaurant Marker */}
        <Marker longitude={order.restaurantLocation.lng} latitude={order.restaurantLocation.lat} anchor="bottom">
          <div className="flex flex-col items-center -translate-y-1">
            <div className="relative">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 blur-[2px] rounded-full" />
              <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center relative z-10">
                <Store className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <div className="w-3 h-3 bg-white rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-gray-100 z-0" />
            </div>
          </div>
        </Marker>

        {/* Driver Marker */}
        {!isPending && (
          <Marker longitude={order.driverLocation.lng} latitude={order.driverLocation.lat} anchor="center">
            <div className="relative">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="relative z-10"
              >
                <div className="w-10 h-10 bg-[#1A1A1A] rounded-full border-[3px] border-white shadow-2xl flex items-center justify-center">
                  <Bike className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full bg-black/10 z-0"
                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </Marker>
        )}

        {/* ETA Card - Floating */}
        {etaText && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-white/95 backdrop-blur-md pl-3 pr-4 py-2 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-[#1A1A1A]">{etaText}</span>
            </div>
          </div>
        )}
      </Map>
    </div>
  );
}
