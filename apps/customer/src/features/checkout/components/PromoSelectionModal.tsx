"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, Tag, Truck, Loader2, CheckCircle } from "@repo/ui/icons";
import type { Voucher } from "@repo/types";
import PromoVoucherCard from "./PromoVoucherCard";
import PromoVoucherCardShimmer, { PromoVoucherCardShimmerList } from "./PromoVoucherCardShimmer";
import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";
import { PullToRefresh } from "@repo/ui";

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
  currentOrderValue?: number;
  restaurant?: any;
  onRefresh?: () => Promise<void>;
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
  currentOrderValue,
  restaurant,
  onRefresh,
}: PromoSelectionModalProps) {
  useMobileBackHandler(isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="fixed inset-0 z-[201] flex items-end md:items-center justify-center will-change-transform pointer-events-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-lg h-[90vh] md:h-auto md:max-h-[90vh] rounded-t-[40px] md:rounded-[40px] overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-20">
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex w-12 h-12 rounded-2xl bg-[#1A1A1A] text-white items-center justify-center shadow-lg shadow-black/10">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-anton text-[#1A1A1A] uppercase leading-none">VOUCHER SYSTEM</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase mt-2">
                      Select Offers
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-4 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-hidden">
                <PullToRefresh
                  onRefresh={onRefresh || (async () => { })}
                  className="h-full px-4 md:px-6 py-4 custom-scrollbar"
                  pullText="Kéo để cập nhật voucher"
                  releaseText="Thả để làm mới ngay"
                  refreshingText="Đang tìm ưu đãi..."
                  usePortal={false}
                >
                  <div className="space-y-10 pb-6">
                    {isLoadingVouchers ? (
                      <PromoVoucherCardShimmerList count={3} />
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
                                      currentOrderValue={currentOrderValue}
                                      restaurantSlug={restaurant?.slug}
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
                                      currentOrderValue={currentOrderValue}
                                      restaurantSlug={restaurant?.slug}
                                    />
                                  );
                                })
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </PullToRefresh>
              </div>

              {/* Footer */}
              <div className="p-3 md:p-4 bg-gray-50/30">
                <button
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full h-14 rounded-[20px] md:rounded-[24px] bg-[#1A1A1A] text-white font-bold text-lg hover:bg-black transition-all shadow-lg shadow-black/10"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Done</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
