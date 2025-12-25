"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "@repo/ui/motion";
import { MapPin, Hand, useSwipeConfirmation, useNotification, useLoading } from "@repo/ui";
const MapView = dynamic(() => import("@/features/checkout/components/MapView"), { ssr: false });
import { formatVnd } from "@repo/lib";

export default function RightSidebar({
  restaurantName,
  totalPayable,
  onAddressChange,
  children,
}: {
  restaurantName?: string;
  totalPayable: number;
  onAddressChange?: (addr: string) => void;
  children?: React.ReactNode;
}) {
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();
  const { show: showLoading } = useLoading();

  useEffect(() => {
    const el = rightColRef.current;
    if (!el) return;
  }, []);

  const handleCompleteOrder = () => {
    confirm({
      title: "Xác nhận đặt hàng",
      description: `Bạn có chắc chắn muốn đặt đơn hàng với tổng tiền ${formatVnd(totalPayable)}?`,
      confirmText: "Đặt hàng",
      type: "success",
      processingDuration: 1500,
      onConfirm: async () => {
        showLoading("Đang xử lý đơn hàng...");

        // Navigate to home first
        router.push('/home');

        // Show notification after navigation
        setTimeout(() => {
          showNotification({
            type: "success",
            message: "Đặt hàng thành công",
            format: `Đơn hàng của bạn đã được đặt thành công. Đang tìm tài xế...`,
          });
        }, 800);
      }
    });
  };

  return (
    <div ref={rightColRef} className="relative overflow-y-auto no-scrollbar pl-2">
      <div className="mb-6">
        <div className="text-[28px] font-bold uppercase tracking-wide" style={{
          fontStretch: "condensed",
          letterSpacing: "-0.01em",
          fontFamily: "var(--font-anton), var(--font-sans)",
        }}>Last Step - Checkout</div>
        {restaurantName && (
          <div className="text-[14px] text-[#555] mt-1">{restaurantName}</div>
        )}
      </div>

      <SidebarMapWithPlaces onAddressChange={onAddressChange}>
        {children}
      </SidebarMapWithPlaces>



      <div className="sticky bottom-0 pb-4 bg-[#F7F7F7]">
        <div className="pb-0 pt-2 p-6 border-t-2 border-gray-300">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-600">Tổng số tiền</div>
            <div className="text-xl font-semibold text-[var(--primary)]">{formatVnd(totalPayable)}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleCompleteOrder}
            className="mt-3 w-full h-16 rounded-2xl bg-[var(--primary)] text-white text-2xl uppercase font-anton font-semibold shadow-sm"
          >
            Complete Order
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function SidebarMapWithPlaces({ children, onAddressChange }: { children?: React.ReactNode; onAddressChange?: (addr: string) => void }) {
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
      <div className="relative mb-3">
        <div className="relative aspect-[16/9] rounded-[24px] overflow-hidden shadow-md bg-white border border-gray-200">
          <MapView
            pickupPos={pickupPos}
            onPickupChange={(p) => setPickupPos(p)}
            onPlacesChange={(ps) => setPlaces(ps)}
            flyVersion={flyVersion}
          />
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-300">
        <div className="p-4">
          <div className="font-semibold mb-2 text-[15px]">Chọn điểm đón</div>
          <motion.div layout>
            {places.length === 0 && (
              <div className="text-gray-500 text-sm">Đang tìm địa điểm gần bạn...</div>
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
                  className={`relative p-3 border-b last:border-b-0 rounded-md cursor-pointer ${selected ? 'bg-[var(--secondary)]/15' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${selected ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {selected ? <Hand className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                    </div>
                    <div className="text-[14px] font-medium">{p.text}</div>
                  </div>
                  {selected && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ml-9 text-gray-500 text-[12px] mt-1">
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
