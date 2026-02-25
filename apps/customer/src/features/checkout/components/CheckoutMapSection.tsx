"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { motion } from "@repo/ui/motion";
import { MapPin, Hand } from "@repo/ui/icons";
import { useDeliveryLocationStore } from "@/store/deliveryLocationStore";

const MapView = dynamic(() => import("@/features/checkout/components/MapView"), { ssr: false });

export default function CheckoutMapSection({ children, onAddressChange }: { children?: React.ReactNode; onAddressChange?: (addr: string) => void }) {
  // Get delivery location from store
  const { selectedLocation, setSelectedLocation } = useDeliveryLocationStore();

  // Initialize position from store
  const [pickupPos, setPickupPos] = useState<{ lng: number; lat: number } | undefined>(
    selectedLocation ? { lng: selectedLocation.longitude, lat: selectedLocation.latitude } : undefined
  );
  const [places, setPlaces] = useState<Array<{ id: string; text: string; place_name: string; center: [number, number] }>>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [flyVersion, setFlyVersion] = useState(0);
  const initializedRef = useRef(false);

  // Sync initial position from store
  useEffect(() => {
    if (selectedLocation && !pickupPos) {
      setPickupPos({ lng: selectedLocation.longitude, lat: selectedLocation.latitude });
    }
  }, [selectedLocation, pickupPos]);

  useEffect(() => {
    if (places.length === 0) return;
    if (!initializedRef.current) {
      initializedRef.current = true;
      setSelectedIndex(0);
      onAddressChange?.(places[0].place_name);
    }
  }, [places, onAddressChange]);

  const handleSelectPlace = (idx: number, place: { id: string; text: string; place_name: string; center: [number, number] }) => {
    setSelectedIndex(idx);
    const addr = place.place_name;
    onAddressChange?.(addr);

    const [lng, lat] = place.center;
    setPickupPos({ lng, lat });
    setFlyVersion((v) => v + 1);

    // Update the global delivery location store
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
            <motion.div layout>
              {places.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-10 font-medium uppercase tracking-widest text-[10px]">Searching nearby...</div>
              )}
              {places.map((p, idx) => {
                const selected = selectedIndex === idx;
                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleSelectPlace(idx, p)}
                    className={`
                    relative p-4 mb-2 last:mb-0 rounded-[24px] cursor-pointer border transition-all duration-200 group
                    ${selected
                        ? 'bg-lime-50 border-lime-200 shadow-sm'
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
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
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ml-11 text-gray-500 text-[12px] font-medium line-clamp-2 mt-0.5">
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
