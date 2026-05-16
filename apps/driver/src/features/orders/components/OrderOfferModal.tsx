"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { SwipeToConfirm } from "@repo/ui";
import type { DriverOrderOffer, PaymentMethod } from "@repo/types";
import { CreditCard, Banknote, MapPin, DollarSign, Timer, Navigation, Package, Phone, Wallet, Receipt } from "@repo/ui/icons";

export default function OrderOfferModal({ offer, countdown, onAccept, onReject }: { offer: DriverOrderOffer | null; countdown: number; onAccept: () => void; onReject: () => void }) {
  const paymentMethodLabel = (pm: PaymentMethod) => pm === 'CASH' ? 'Tiền mặt' : 'Ví Eatzy';
  const payIcon = (pm: PaymentMethod) => pm === "CASH" ? <Banknote size={16} strokeWidth={2.5} /> : <Wallet size={16} strokeWidth={2.5} />;

  const formatVnd = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "---";
    return Intl.NumberFormat('vi-VN').format(val);
  };

  return (
    <AnimatePresence>
      {offer && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Main Modal - Matches CurrentOrderPanel Container */}
          <motion.div
            className="relative w-full max-w-[420px] bg-white rounded-[44px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40 flex flex-col overflow-hidden"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Handle Bar - Visual parity with Drawer */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-4 mb-2" />

            {/* Content Area */}
            <div className="px-6 pb-10 pt-2">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Gợi ý đơn hàng</span>
                  <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight uppercase">CƠ HỘI MỚI</h2>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Thời gian</span>
                  <div className="flex items-center gap-1.5 text-[#A3E635] font-bold">
                    <Timer size={14} className={countdown <= 5 ? "text-red-500 animate-pulse" : ""} />
                    <span className={`text-sm ${countdown <= 5 ? "text-red-500" : ""}`}>{countdown}s</span>
                  </div>
                </div>
              </div>

              {/* Main Summary Card - Matches CurrentOrderPanel Breakdown style exactly */}
              <div className="bg-gray-200/50 rounded-[32px] p-5 space-y-1.5 mb-8 mx-1">
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-gray-400 font-medium tracking-tight">Giá trị đơn hàng:</span>
                  <span className="text-[#1A1A1A] font-bold tracking-tight">{formatVnd(offer.orderValue)}đ</span>
                </div>
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-gray-400 font-medium tracking-tight">Thanh toán:</span>
                  <span className="text-[#1A1A1A] font-bold tracking-tight">{paymentMethodLabel(offer.paymentMethod)}</span>
                </div>
                <div className="h-px bg-gray-300/30 my-1" />
                <div className="flex justify-between items-end pt-1">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Thu nhập dự kiến</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#1A1A1A] tracking-tighter">
                        {formatVnd(offer.netEarning)}
                      </span>
                      <span className="text-sm font-bold text-[#A3E635]">đ</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter mb-1">Cự ly</span>
                    <span className="text-sm font-extrabold text-[#555]">{offer.distanceKm.toFixed(1)} km</span>
                  </div>
                </div>
              </div>

              {/* Location Route - Identical to CurrentOrderPanel */}
              <div className="flex flex-col mb-8 px-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#A3E635] flex items-center justify-center shadow-md flex-shrink-0 z-10">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                    <div
                      className="w-1 flex-grow mt-1.5 opacity-60"
                      style={{ backgroundImage: `radial-gradient(circle, #cbd5e1 2px, transparent 2px)`, backgroundSize: '100% 9px', backgroundRepeat: 'repeat-y', backgroundPosition: 'center' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5 pb-3">
                    <div className="font-bold text-[#1A1A1A] text-base leading-tight tracking-tight">{offer.pickup.name}</div>
                    <div className="font-medium text-sm text-gray-400 mt-0.5 leading-snug tracking-tight line-clamp-3">{offer.pickup.address}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-1 h-2.5 mb-1.5 opacity-60"
                      style={{ backgroundImage: `radial-gradient(circle, #cbd5e1 2px, transparent 2px)`, backgroundSize: '100% 9px', backgroundRepeat: 'repeat-y', backgroundPosition: 'center' }}
                    />
                    <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md flex-shrink-0 z-10">
                      <MapPin size={14} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="font-bold text-[#1A1A1A] text-base leading-tight tracking-tight">Điểm giao</div>
                    <div className="font-medium text-sm text-gray-400 mt-0.5 leading-snug tracking-tight line-clamp-3">{offer.dropoff.address}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-full px-1 items-center">
                <SwipeToConfirm
                  text="Vuốt để Nhận đơn"
                  onComplete={onAccept}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onReject}
                  className="w-full max-w-80 h-14 rounded-[28px] bg-gray-200/50 text-gray-400 font-bold text-[15px] hover:bg-gray-200/80 transition-colors"
                >
                  Bỏ qua
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
