"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { motion } from "@repo/ui/motion";
import { MapPin, Hand, Maximize2, Loader2 } from "@repo/ui/icons";
import { useDeliveryLocationStore } from "@/store/deliveryLocationStore";

const MapView = dynamic(() => import("@/features/checkout/components/MapView"), { ssr: false });

export default function CheckoutMapSection({
  children,
  onAddressChange,
  onOpenLocationPicker
}: {
  children?: React.ReactNode;
  onAddressChange?: (addr: string) => void;
  onOpenLocationPicker?: () => void;
}) {
  // Get delivery location from store
  const { selectedLocation, setSelectedLocation } = useDeliveryLocationStore();

  // Initialize position from store
  const [pickupPos, setPickupPos] = useState<{ lng: number; lat: number } | undefined>(
    selectedLocation ? { lng: selectedLocation.longitude, lat: selectedLocation.latitude } : undefined
  );
  const [places, setPlaces] = useState<Array<{ id: string; text: string; place_name: string; center: [number, number] }>>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flyVersion, setFlyVersion] = useState(0);
  const initializedRef = useRef(false);
  const lastStoreLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const manualSelectionRef = useRef<string | null>(null);

  // Sync position from store (External update)
  useEffect(() => {
    if (!selectedLocation) return;

    const storePos = { lat: selectedLocation.latitude, lng: selectedLocation.longitude };
    const isMeaningfulChange = !lastStoreLocationRef.current ||
      Math.abs(lastStoreLocationRef.current.lat - storePos.lat) > 0.0001 ||
      Math.abs(lastStoreLocationRef.current.lng - storePos.lng) > 0.0001;

    if (isMeaningfulChange) {
      lastStoreLocationRef.current = storePos;
      setPickupPos({ lng: storePos.lng, lat: storePos.lat });
      setFlyVersion((v) => v + 1);
      // Clear manual selection when store changes externally
      manualSelectionRef.current = null;
    }
  }, [selectedLocation]);

  // Handle selection state based on places matching current location
  useEffect(() => {
    if (selectedLocation && places.length > 0) {
      // If we have a manual selection that's still in the current places list, keep it
      if (manualSelectionRef.current && places.some(p => p.id === manualSelectionRef.current)) {
        setSelectedIndex(places.findIndex(p => p.id === manualSelectionRef.current));
        setSelectedId(manualSelectionRef.current);
        return;
      }

      // Otherwise, fallback to finding by coordinate distance
      const idx = places.findIndex(p =>
        Math.abs(p.center[0] - selectedLocation.longitude) < 0.0001 &&
        Math.abs(p.center[1] - selectedLocation.latitude) < 0.0001
      );

      if (idx !== -1) {
        setSelectedIndex(idx);
        setSelectedId(places[idx].id);
      }
    }
  }, [places, selectedLocation]);

  // Always keep selected item at the top for the "moving to top" effect
  const sortedPlaces = (places || []).slice().sort((a, b) => {
    if (a.id === selectedId) return -1;
    if (b.id === selectedId) return 1;
    return 0;
  });

  const handleSelectPlace = (idx: number, place: { id: string; text: string; place_name: string; center: [number, number] }) => {
    const [lng, lat] = place.center;

    // 1. Immediately update local selection UI for responsiveness
    setSelectedIndex(idx);
    setSelectedId(place.id);
    manualSelectionRef.current = place.id;
    onAddressChange?.(place.place_name);

    // 2. Determine if we need to fly the map (if clicked a place far from current center)
    const isFar = !pickupPos ||
      Math.abs(lng - pickupPos.lng) > 0.0001 ||
      Math.abs(lat - pickupPos.lat) > 0.0001;

    if (isFar) {
      setPickupPos({ lng, lat });
      setFlyVersion((v) => v + 1);
    }

    // 3. Update the "last known" ref to match what we're about to set in the store
    lastStoreLocationRef.current = { lat, lng };

    // 4. Update core store
    setSelectedLocation({
      latitude: lat,
      longitude: lng,
      address: place.place_name,
      placeName: place.text,
    });
  };

  return (
    <>
      <div className="w-full flex-1 flex flex-col min-h-0 relative transition-all duration-500 rounded-[28px] md:rounded-[32px] shadow-md bg-white overflow-hidden">
        {/* Map Section - The Main Card (Full rounded corners restored) */}
        <div className="relative z-10 aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/9] shrink-0 rounded-[28px] overflow-hidden bg-white border-b border-gray-100/80 transition-all">
          <button
            onClick={onOpenLocationPicker}
            className="absolute top-4 left-4 z-20 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 active:scale-95 transition-all group"
            title="Mở rộng bản đồ"
          >
            <Maximize2 className="w-5 h-5 group-hover:text-[var(--primary)] transition-colors" />
          </button>
          <MapView
            pickupPos={pickupPos}
            onPickupChange={(p) => setPickupPos(p)}
            onPlacesChange={(ps) => setPlaces(ps)}
            flyVersion={flyVersion}
          />
        </div>

        {/* Pickup Points - Filling remaining height with internal scroll */}
        <div className="relative z-10 flex-1 min-h-0">
          <div className="h-full overflow-y-auto no-scrollbar scroll-smooth px-4 pt-2 pb-4">
            <motion.div layout className="flex flex-col gap-2">
              {sortedPlaces.length === 0 && (
                <div className="py-10 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin opacity-50" />
                  <span className="text-[10px] font-medium uppercase tracking-widest text-[#1A1A1A]/30">Searching nearby...</span>
                </div>
              )}
              {sortedPlaces.map((p, idx) => {
                const selected = p.id === selectedId;
                return (
                  <motion.div
                    key={p.id}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      scale: selected ? 1.02 : 1,
                      zIndex: selected ? 10 : 0
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                      mass: 0.8,
                      opacity: { duration: 0.2 }
                    }}
                    onClick={() => handleSelectPlace(idx, p)}
                    className={`
                    relative p-4 rounded-[24px] cursor-pointer border transition-colors duration-300 group
                    ${selected
                        ? 'bg-lime-50 border-lime-300 shadow-[0_8px_20px_rgba(0,0,0,0.06)]'
                        : 'bg-white border-gray-100/80 hover:border-gray-200 hover:bg-gray-50'
                      }
                  `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${selected ? 'bg-lime-100 text-lime-700' : 'bg-gray-100 text-gray-500'}`}>
                        {selected ? <Hand className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[14px] font-bold truncate ${selected ? 'text-[#1A1A1A]' : 'text-gray-600'}`}>{p.text}</div>
                      </div>
                    </div>
                    {selected && (
                      <motion.div layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ml-11 text-gray-500 text-[12px] font-medium line-clamp-2 mt-0.5">
                        {p.place_name}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {children}
    </>
  );
}
