"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "@repo/ui/motion";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Store, Bike, MapPin } from "@repo/ui/icons";
import { useDriverLocation } from "@/features/socket/hooks/useDriverLocation";

type LatLng = { lat: number; lng: number };
type MapFly = { fitBounds: (bounds: [[number, number], [number, number]], opts?: { padding?: number; duration?: number }) => void };
type MapLike = { getMap: () => MapFly };

interface OrderMapViewProps {
  restaurantLocation?: LatLng;
  deliveryLocation?: LatLng;
  driverLocation?: LatLng;
  orderStatus?: string;
  fullWidth?: boolean;
}

export default function OrderMapView({
  restaurantLocation,
  deliveryLocation,
  driverLocation,
  orderStatus,
  fullWidth = false,
}: OrderMapViewProps) {
  const _X_T = "cGsuZXlKMUlqb2libWRvYjJGdVoyaHBaVzRpTENKaElqb2lZMjFwWkcwNGNtTnhNRGczWXpKdWNURnZkemd5WXpWNVppSjkuYWRKRjY5QnpMVGttWlp5c01YZ1Vodw==";
  const token = typeof window !== 'undefined' ? atob(_X_T) : Buffer.from(_X_T, 'base64').toString();
  const mapRef = useRef<unknown>(null);
  const [driverRoute, setDriverRoute] = useState<{ geometry?: { coordinates: [number, number][] }; distance?: number; duration?: number } | null>(null);
  const [deliveryRoute, setDeliveryRoute] = useState<{ geometry?: { coordinates: [number, number][] }; distance?: number; duration?: number } | null>(null);
  const [progressA, setProgressA] = useState(0);
  const [progressB, setProgressB] = useState(0);

  // WebSocket for real-time tracking (Cleaned up: logic moved to hook)
  const currentDriverLocation = useDriverLocation(driverLocation);

  const hasRestaurant = restaurantLocation && Number.isFinite(restaurantLocation.lat) && Number.isFinite(restaurantLocation.lng);
  const hasDelivery = deliveryLocation && Number.isFinite(deliveryLocation.lat) && Number.isFinite(deliveryLocation.lng);
  const hasDriver = currentDriverLocation && Number.isFinite(currentDriverLocation.lat) && Number.isFinite(currentDriverLocation.lng);

  const isPending = orderStatus === "PENDING" || orderStatus === "PLACED";

  // Determine which leg is active
  const activeLeg = useMemo(() => {
    if (!orderStatus) return "TO_PICKUP";
    if (["PICKED_UP", "ARRIVED"].includes(orderStatus)) return "TO_DROPOFF";
    return "TO_PICKUP";
  }, [orderStatus]);

  const lastLegRef = useRef<string | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!hasRestaurant || !hasDelivery) return;

    // Skip route fetching for PENDING orders (no driver yet)
    if (isPending || !hasDriver) {
      setDriverRoute(null);
      setDeliveryRoute(null);
      const inst = mapRef.current as MapLike | null;
      inst?.getMap()?.fitBounds(
        [
          [restaurantLocation!.lng - 0.01, restaurantLocation!.lat - 0.01],
          [deliveryLocation!.lng + 0.01, deliveryLocation!.lat + 0.01],
        ],
        { padding: 60, duration: 900 }
      );
      return;
    }

    const fetchRoute = async (start: LatLng, end: LatLng) => {
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
      // Leg 1: Driver -> Restaurant
      const a = hasDriver ? await fetchRoute(currentDriverLocation!, restaurantLocation!) : null;
      
      // Leg 2: 
      // - If heading to customer: Driver -> Delivery
      // - If heading to pickup: Restaurant -> Delivery
      const b = (activeLeg === "TO_DROPOFF" && hasDriver)
        ? await fetchRoute(currentDriverLocation!, deliveryLocation!)
        : await fetchRoute(restaurantLocation!, deliveryLocation!);

      setDriverRoute(a);
      setDeliveryRoute(b);

      const inst = mapRef.current as MapLike | null;
      const coords = [
        ...(a?.geometry?.coordinates ?? []),
        ...(b?.geometry?.coordinates ?? []),
        [currentDriverLocation!.lng, currentDriverLocation!.lat],
        [restaurantLocation!.lng, restaurantLocation!.lat],
        [deliveryLocation!.lng, deliveryLocation!.lat],
      ];
      const lngs = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      if (isFirstLoad.current || lastLegRef.current !== activeLeg) {
        inst?.getMap()?.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          { padding: 60, duration: 900 }
        );
      }

      if (isFirstLoad.current || lastLegRef.current !== activeLeg) {
        const startTime = performance.now();
        const animate = (time: number) => {
          const t = Math.min((time - startTime) / 900, 1);
          setProgressA(t);
          setProgressB(t);
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      } else {
        setProgressA(1);
        setProgressB(1);
      }

      lastLegRef.current = activeLeg;
      isFirstLoad.current = false;
    })();
  }, [restaurantLocation, deliveryLocation, currentDriverLocation, token, isPending, hasRestaurant, hasDelivery, hasDriver, activeLeg]);

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
    if (!hasRestaurant) return null;
    const restLng = restaurantLocation!.lng;
    const restLat = restaurantLocation!.lat;
    const drvLng = hasDriver ? currentDriverLocation!.lng : restLng;
    const drvLat = hasDriver ? currentDriverLocation!.lat : restLat;

    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates:
          driverRoute?.geometry?.coordinates && driverRoute?.geometry?.coordinates.length > 1
            ? (() => {
              const p = partial(driverRoute.geometry.coordinates, progressA);
              return p.length > 1 ? p : [[drvLng, drvLat], [restLng, restLat]];
            })()
            : [[drvLng, drvLat], [restLng, restLat]],
      },
      properties: { legId: "driver-to-restaurant" },
    };
  }, [driverRoute, progressA, restaurantLocation, currentDriverLocation, hasRestaurant, hasDriver]);

  const deliveryFeature = useMemo(() => {
    if (!hasRestaurant || !hasDelivery) return null;
    const restLng = restaurantLocation!.lng;
    const restLat = restaurantLocation!.lat;
    const delLng = deliveryLocation!.lng;
    const delLat = deliveryLocation!.lat;

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
                      [activeLeg === "TO_DROPOFF" && hasDriver ? currentDriverLocation!.lng : restLng, activeLeg === "TO_DROPOFF" && hasDriver ? currentDriverLocation!.lat : restLat],
                      [delLng, delLat],
                    ];
              })()
            : [
                [activeLeg === "TO_DROPOFF" && hasDriver ? currentDriverLocation!.lng : restLng, activeLeg === "TO_DROPOFF" && hasDriver ? currentDriverLocation!.lat : restLat],
                [delLng, delLat],
              ],
      },
      properties: { legId: "restaurant-to-delivery" },
    };
  }, [deliveryRoute, progressB, restaurantLocation, deliveryLocation, hasRestaurant, hasDelivery, activeLeg, hasDriver, currentDriverLocation]);

  const lines = useMemo(() => ({
    type: "FeatureCollection",
    features: [driverFeature, deliveryFeature].filter(Boolean),
  }), [driverFeature, deliveryFeature]);

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

  // If no valid locations, show placeholder
  if (!hasRestaurant && !hasDelivery) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-400">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Không có dữ liệu vị trí</p>
        </div>
      </div>
    );
  }

  const centerLat = hasRestaurant ? restaurantLocation!.lat : (hasDelivery ? deliveryLocation!.lat : 10.7769);
  const centerLng = hasRestaurant ? restaurantLocation!.lng : (hasDelivery ? deliveryLocation!.lng : 106.7009);

  const initialView = { longitude: centerLng, latitude: centerLat, zoom: 13 };

  return (
    <div className={`h-full ${fullWidth ? "p-0 bg-transparent" : "p-4 bg-white"}`}>
      <div className={`h-full relative overflow-hidden ${fullWidth ? "" : "rounded-[36px] shadow-md border border-gray-100"}`}>
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
            {/* 1. Inactive Leg Casing (Subtle Darker Sky for border) */}
            <Layer 
              id="inactive-leg-casing" 
              type="line" 
              filter={["!=", "legId", activeLeg === "TO_PICKUP" ? "driver-to-restaurant" : "restaurant-to-delivery"]}
              layout={{ "line-cap": "round", "line-join": "round" }} 
              paint={{ "line-color": "#0ea5e9", "line-width": 10, "line-opacity": 0.15 }} 
            />

            {/* 2. Inactive Leg Core (Very Light Sky Blue) */}
            <Layer 
              id="inactive-leg" 
              type="line" 
              filter={["!=", "legId", activeLeg === "TO_PICKUP" ? "driver-to-restaurant" : "restaurant-to-delivery"]}
              layout={{ "line-cap": "round", "line-join": "round" }} 
              paint={{ "line-color": "#bae6fd", "line-width": 6, "line-opacity": 0.9 }} 
            />

            {/* 3. Active Leg Casing (Dark Blue) */}
            <Layer 
              id="active-leg-casing" 
              type="line" 
              filter={["==", "legId", activeLeg === "TO_PICKUP" ? "driver-to-restaurant" : "restaurant-to-delivery"]}
              layout={{ "line-cap": "round", "line-join": "round" }} 
              paint={{ "line-color": "#1e40af", "line-width": 10, "line-opacity": 0.3 }} 
            />

            {/* 4. Active Leg Core (Dark Blue) */}
            <Layer 
              id="active-leg" 
              type="line" 
              filter={["==", "legId", activeLeg === "TO_PICKUP" ? "driver-to-restaurant" : "restaurant-to-delivery"]}
              layout={{ "line-cap": "round", "line-join": "round" }} 
              paint={{ "line-color": "#2563eb", "line-width": 6, "line-opacity": 1 }} 
            />
          </Source>

          {hasDelivery && (
            <Marker longitude={deliveryLocation!.lng} latitude={deliveryLocation!.lat} anchor="bottom">
              <div className="flex flex-col items-center">
                <div className="bg-red-500 p-2 rounded-full shadow-lg border-2 border-white">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="w-1.5 h-2 bg-red-500" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
              </div>
            </Marker>
          )}

          {hasRestaurant && (
            <Marker longitude={restaurantLocation!.lng} latitude={restaurantLocation!.lat} anchor="bottom">
              <div className="flex flex-col items-center">
                <div className="bg-[#A3E635] p-2 rounded-full shadow-lg border-2 border-white">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div className="w-1.5 h-2 bg-[#A3E635]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
              </div>
            </Marker>
          )}

          {!isPending && hasDriver && (
            <Marker longitude={currentDriverLocation!.lng} latitude={currentDriverLocation!.lat} anchor="center">
              <div className="relative">
                <motion.span
                  className="absolute -inset-2 rounded-full border-2 border-blue-500/40"
                  animate={{ scale: [1, 2], opacity: [0.7, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <div className="w-9 h-9 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center relative z-10">
                  <Bike className="w-5 h-5 text-white" />
                </div>
              </div>
            </Marker>
          )}

          {etaText && (
            <div className="absolute left-3 top-3 bg-white/90 backdrop-blur-sm border border-gray-200 text-xs text-[#1A1A1A] px-2 py-1 rounded shadow-sm">
              {etaText}
            </div>
          )}
        </Map>
      </div>
    </div>
  );
}
