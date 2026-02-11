"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, Tag, Truck, Loader2 } from "@repo/ui/icons";
import type { Voucher } from "@repo/types";
import PromoVoucherCard from "./PromoVoucherCard";

interface PromoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  shippingVouchers: Voucher[];
  discountVouchers: Voucher[];
  isVoucherEligible: (v: Voucher) => boolean;
  selectedShippingVoucherId: number | null;
  setSelectedShippingVoucherId: (id: number | null) => void;
  selectedDiscountVoucherId: number | null;
  setSelectedDiscountVoucherId: (id: number | null) => void;
  bestVoucherIds: { shipping: number | null; discount: number | null };
  isLoadingVouchers?: boolean;
}

export default function PromoSelectionModal({
  isOpen,
  onClose,
  shippingVouchers,
  discountVouchers,
  isVoucherEligible,
  selectedShippingVoucherId,
  setSelectedShippingVoucherId,
  selectedDiscountVoucherId,
  setSelectedDiscountVoucherId,
  bestVoucherIds,
  isLoadingVouchers = false,
}: PromoSelectionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="relative bg-white w-full max-w-lg h-[90vh] md:h-auto md:max-h-[80vh] rounded-t-[40px] md:rounded-[32px] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-lg shadow-black/10">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-anton font-bold text-[#1A1A1A] tracking-tight uppercase">VOUCHER SYSTEM</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Select your best offers</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition-all active:scale-95"
              >
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-10 custom-scrollbar">
              {isLoadingVouchers ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
                  <div className="w-10 h-10 border-3 border-gray-100 border-t-lime-500 rounded-full animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Checking offers...</span>
                </div>
              ) : (
                <>
                  {/* Shipping Section */}
                  {shippingVouchers.length > 0 && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-1">
                        <div className="w-10 h-10 rounded-[18px] bg-blue-50 text-blue-600 flex items-center justify-center border border-lime-100 shadow-sm flex-shrink-0">
                          <Truck size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h4 className="text-[15px] font-bold text-[#1A1A1A] leading-none">Shipping Vouchers</h4>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[...shippingVouchers]
                          .sort((a, b) => a.id === bestVoucherIds.shipping ? -1 : b.id === bestVoucherIds.shipping ? 1 : 0)
                          .map((v) => {
                            const eligible = isVoucherEligible(v);
                            return (
                              <PromoVoucherCard
                                key={v.id}
                                voucher={v}
                                selected={selectedShippingVoucherId === v.id}
                                onSelect={() => setSelectedShippingVoucherId(selectedShippingVoucherId === v.id ? null : v.id)}
                                disabled={!eligible}
                                reason={!eligible ? 'Đơn hàng chưa đủ điều kiện' : undefined}
                                isBest={bestVoucherIds.shipping === v.id}
                              />
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Discount Section */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 px-1">
                      <div className="w-10 h-10 rounded-[18px] bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shadow-sm flex-shrink-0">
                        <Tag size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-[#1A1A1A] leading-none">Discount Vouchers</h4>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {discountVouchers.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">No vouchers available</p>
                        </div>
                      ) : (
                        [...discountVouchers]
                          .sort((a, b) => a.id === bestVoucherIds.discount ? -1 : b.id === bestVoucherIds.discount ? 1 : 0)
                          .map((v) => {
                            const eligible = isVoucherEligible(v);
                            return (
                              <PromoVoucherCard
                                key={v.id}
                                voucher={v}
                                selected={selectedDiscountVoucherId === v.id}
                                onSelect={() => setSelectedDiscountVoucherId(selectedDiscountVoucherId === v.id ? null : v.id)}
                                disabled={!eligible}
                                reason={!eligible ? 'Đơn hàng chưa đủ điều kiện' : undefined}
                                isBest={bestVoucherIds.discount === v.id}
                              />
                            );
                          })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-50 bg-gray-50/30">
              <button
                onClick={onClose}
                className="w-full h-14 rounded-[20px] bg-[#1A1A1A] text-white font-bold text-lg hover:bg-black transition-all shadow-lg shadow-black/10"
              >
                Xong
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
