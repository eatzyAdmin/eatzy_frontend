"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import type { DriverOrderOffer, PaymentMethod } from "@repo/types";
import { CreditCard, Banknote, MapPin, DollarSign } from "@repo/ui/icons";

export default function OrderOfferModal({ offer, countdown, onAccept, onReject }: { offer: DriverOrderOffer | null; countdown: number; onAccept: () => void; onReject: () => void }) {
  const payIcon = (pm: PaymentMethod) => pm === "CASH" ? <Banknote size={18} /> : <CreditCard size={18} />;

  return (
    <AnimatePresence>
      {offer && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="relative w-full max-w-[500px] h-[90vh] bg-[#F7F7F7] rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            {/* Header with title */}
            <div className="bg-white px-8 py-6 border-b border-gray-200">
              <div className="text-2xl font-anton font-bold text-[#1A1A1A] tracking-tight" style={{ fontStretch: "condensed" }}>
                ĐỀ XUẤT ĐƠN HÀNG
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-8 py-6" style={{ scrollbarWidth: "none" }}>
              {/* Earnings Card */}
              <div className="mb-16">
                <div className="flex items-baseline justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-sm text-[#777] mb-1">Thu nhập ròng</div>
                    <div className="text-5xl font-anton font-bold text-[var(--primary)]">
                      {Intl.NumberFormat('vi-VN').format(offer.netEarning)}
                      <span className="text-2xl ml-1">đ</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-[#555]">
                    {payIcon(offer.paymentMethod)}
                    <span className="text-sm font-semibold">{offer.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Thẻ/Ví'}</span>
                  </div>
                </div>

                {/* Order Info Row */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-[#777]">
                    <DollarSign size={16} className="text-[var(--primary)]" />
                    <span>Giá trị:</span>
                    <span className="font-semibold text-[#1A1A1A]">{Intl.NumberFormat('vi-VN').format(offer.orderValue)}đ</span>
                  </div>
                  <div className="h-4 w-px bg-gray-200" />
                  <div className="flex items-center gap-2 text-[#777]">
                    <MapPin size={16} className="text-[var(--primary)]" />
                    <span>Cách bạn:</span>
                    <span className="font-semibold text-[#1A1A1A]">{offer.distanceKm.toFixed(2)} km</span>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-3">
                {/* Pickup */}
                <motion.div
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <motion.div
                      className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-md"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </motion.div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide mb-1">
                      Điểm lấy hàng
                    </div>
                    <div className="font-bold text-[#1A1A1A] text-lg mb-0.5">{offer.pickup.name}</div>
                    <div className="text-sm text-[#777] line-clamp-2">{offer.pickup.address}</div>
                  </div>
                </motion.div>

                {/* Connection Line */}
                <div className="ml-4 h-6 w-0.5 bg-gradient-to-b from-[var(--primary)] to-red-500" />

                {/* Dropoff */}
                <motion.div
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <motion.div
                      className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-md"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    >
                      <MapPin size={16} className="text-white" />
                    </motion.div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">
                      Điểm giao hàng
                    </div>
                    <div className="font-bold text-[#1A1A1A] text-lg mb-0.5">Điểm giao</div>
                    <div className="text-sm text-[#777] line-clamp-2">{offer.dropoff.address}</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-white px-8 py-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={onReject}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 h-14 rounded-xl bg-white border-2 border-gray-200 text-[#555] font-semibold text-base flex items-center justify-center gap-2 hover:border-gray-300 transition-colors"
                >
                  <span>Từ chối</span>
                  <motion.span
                    className={`text-sm font-mono px-2 py-0.5 rounded-full ${countdown <= 5 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
                    animate={countdown <= 5 ? {
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{
                      repeat: countdown <= 5 ? Infinity : 0,
                      duration: 0.6,
                    }}
                  >
                    {countdown}s
                  </motion.span>
                </motion.button>
                <motion.button
                  onClick={onAccept}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 h-14 rounded-xl bg-[var(--primary)] text-white font-anton font-semibold text-xl tracking-tight shadow-md"
                  style={{ fontStretch: "condensed" }}
                  animate={countdown <= 5 ? {
                    boxShadow: [
                      '0 4px 16px rgba(120,200,65,0.3)',
                      '0 8px 24px rgba(120,200,65,0.5)',
                      '0 4px 16px rgba(120,200,65,0.3)'
                    ],
                  } : {}}
                  transition={{
                    repeat: countdown <= 5 ? Infinity : 0,
                    duration: 0.8,
                  }}
                >
                  Chấp nhận
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
