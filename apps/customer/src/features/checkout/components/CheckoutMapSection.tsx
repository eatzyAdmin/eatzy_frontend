"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { motion } from "@repo/ui/motion";
import { MapPin, Hand } from "@repo/ui/icons";
const MapView = dynamic(() => import("@/features/checkout/components/MapView"), { ssr: false });

export default function CheckoutMapSection({ children, onAddressChange }: { children?: React.ReactNode; onAddressChange?: (addr: string) => void }) {
  const [pickupPos, setPickupPos] = useState<{ lng: number; lat: number } | undefined>(undefined);
  const [places, setPlaces] = useState<Array<{ id: string; text: string; place_name: string; center: [number, number] }>>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [flyVersion, setFlyVersion] = useState(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (places.length === 0) return;
    if (!initializedRef.current) {
      initializedRef.current = true;
      setSelectedIndex(0);
      onAddressChange?.(places[0].place_name);
    }
  }, [places, onAddressChange]);

  return (
    <>
      <div className="relative mb-4">
        <div className="relative aspect-[16/9] rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-white border border-gray-100/50">
          <MapView
            pickupPos={pickupPos}
            onPickupChange={(p) => setPickupPos(p)}
            onPlacesChange={(ps) => setPlaces(ps)}
            flyVersion={flyVersion}
          />
        </div>
      </div>

      <div className="mb-6 bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
        <div className="px-6 py-5 pb-0 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
          <MapPin className="w-5 h-5 text-gray-400" />
          <h4 className="font-bold text-[#1A1A1A]">Select Pickup Point</h4>
        </div>
        <div className="p-4">
          <motion.div layout>
            {places.length === 0 && (
              <div className="text-gray-500 text-sm text-center py-4">Searching nearby places...</div>
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
                  onClick={() => {
                    setSelectedIndex(idx);
                    const addr = p.place_name;
                    onAddressChange?.(addr);
                    const [lng, lat] = p.center;
                    setPickupPos({ lng, lat });
                    setFlyVersion((v) => v + 1);
                  }}
                  className={`
                    relative p-4 mb-2 last:mb-0 rounded-[16px] cursor-pointer border transition-all duration-200 group
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
                      <div className={`text-[14px] font-semibold truncate ${selected ? 'text-[#1A1A1A]' : 'text-gray-600'}`}>{p.text}</div>
                    </div>
                  </div>
                  {selected && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ml-11 text-gray-500 text-[12px] font-medium line-clamp-2">
                      {p.place_name}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {children}
    </>
  );
}
