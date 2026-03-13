"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "@repo/ui/motion";
import {
  MapPin, Plus, Trash2, Home, Briefcase, Map,
  ChevronRight, Edit3, X, CheckCircle2
} from "@repo/ui/icons";
import { useCustomerAddresses } from "../../hooks/useCustomerAddresses";
import { SavedAddressesShimmer, useSwipeConfirmation } from "@repo/ui";
import { IAddress } from "@repo/types";
import AddressFormModal from "./AddressFormModal";
import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";

interface SavedAddressesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (address: IAddress) => void;
}

export default function SavedAddressesModal({
  isOpen,
  onClose,
  onSelect,
}: SavedAddressesModalProps) {
  const [mounted, setMounted] = useState(false);
  const {
    addresses,
    isLoading,
    createAddress,
    updateAddress,
    deleteAddress,
    isCreating,
    isUpdating,
    isDeleting
  } = useCustomerAddresses();
  const { confirm } = useSwipeConfirmation();
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useMobileBackHandler(isOpen, onClose);

  const handleOpenAdd = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingAddress(null);
    setIsAddressFormOpen(true);
  };

  const handleOpenEdit = (addr: IAddress, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddress(addr);
    setIsAddressFormOpen(true);
  };

  const handleDelete = (addr: IAddress, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!addr.id) return;

    confirm({
      title: "Xóa địa chỉ",
      description: `Bạn có chắc chắn muốn xóa "${addr.label}"? Hành động này không thể hoàn tác.`,
      confirmText: "Trượt để xóa",
      type: "danger",
      onConfirm: async () => {
        deleteAddress(addr.id!);
      }
    });
  };

  const handleConfirmAddress = (data: IAddress) => {
    if (editingAddress) {
      updateAddress(data, {
        onSuccess: () => setIsAddressFormOpen(false)
      });
    } else {
      createAddress(data, {
        onSuccess: () => setIsAddressFormOpen(false)
      });
    }
  };

  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("nhà") || l.includes("home")) return Home;
    if (l.includes("công ty") || l.includes("work") || l.includes("văn phòng")) return Briefcase;
    return Map;
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90]"
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[91]"
            />

            {/* Modal Container */}
            <div
              className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-6 z-[92]"
              onClick={onClose}
            >
              {/* Modal Content */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 100, damping: 18 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-[#F8F9FA] w-full max-w-full md:max-w-2xl h-[85vh] md:h-[90vh] max-h-full md:max-h-[800px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-white/20 rounded-t-[40px]"
              >
                {/* Header */}
                <div className="bg-white px-4 md:px-8 py-4 md:py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20 shadow-sm/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-lime-50 border border-lime-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-lime-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl pb-1 md:text-[32px] font-anton font-bold text-[#1A1A1A] uppercase leading-none tracking-tight">
                        Saved Addresses
                      </h3>
                      <div className="text-xs font-medium text-gray-500 mt-0.5">
                        Chọn từ danh sách địa chỉ đã lưu của bạn
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Addresses List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-4">
                  {isLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                      <SavedAddressesShimmer cardCount={4} />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="py-20 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center text-gray-400 bg-slate-50/30">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                        <MapPin size={24} className="text-gray-300" />
                      </div>
                      <p className="text-sm font-bold uppercase tracking-widest mb-1">Chưa có địa chỉ nào</p>
                      <p className="text-xs">Hãy thêm địa chỉ giao hàng đầu tiên của bạn</p>
                      <button
                        onClick={handleOpenAdd}
                        className="mt-6 px-6 py-3 bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-black transition-all active:scale-95"
                      >
                        Thêm địa chỉ ngay
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 md:pb-0">
                      {addresses.map((addr) => {
                        const Icon = getIcon(addr.label);
                        return (
                          <motion.div
                            key={addr.id}
                            onClick={() => onSelect?.(addr)}
                            whileTap={{ scale: 0.98 }}
                            className="group relative w-full h-[120px] md:h-[120px] flex flex-row overflow-hidden rounded-[36px] md:rounded-[40px] cursor-pointer transition-all duration-500 bg-white md:bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] md:shadow-[0_0_25px_rgba(0,0,0,0.10)] hover:bg-gray-50/50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                          >
                            {/* Visual Identity Section (Left) */}
                            <div className="relative w-28 md:w-32 h-full flex-shrink-0 bg-slate-50 flex items-center justify-center border-r border-gray-100 overflow-hidden">
                              <div className="absolute inset-0 bg-lime-50/30 md:group-hover:bg-lime-50/50 transition-colors duration-500" />
                              <Icon className="w-8 h-8 md:w-10 md:h-10 text-lime-600 relative z-10 transition-transform duration-500 md:group-hover:scale-110" />

                              {/* Decorative Badge */}
                              <div className="absolute top-3 left-3 z-10">
                                <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm pl-1 pr-2 py-0.5 rounded-full shadow-md border border-lime-500/10">
                                  <div className="w-4 h-4 rounded-full bg-lime-500/10 flex items-center justify-center">
                                    <MapPin className="w-2.5 h-2.5 text-lime-600" strokeWidth={3} />
                                  </div>
                                  <span className="text-[8px] font-black font-anton uppercase text-lime-600 tracking-wide">
                                    SAVED
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Info Section (Right) */}
                            <div className="flex-1 p-3.5 md:p-5 flex flex-col justify-between min-w-0 pr-12 md:pr-14">
                              <div className="space-y-0.5">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 mb-1.5 md:mb-1 text-gray-400">
                                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Vị trí</span>
                                  </div>
                                  <h4 className="font-bold text-[#1A1A1A] text-base md:text-lg tracking-tight leading-tight truncate md:group-hover:text-lime-600 transition-colors">
                                    {addr.label}
                                  </h4>
                                </div>

                                <p className="text-[11px] md:text-[13px] text-gray-500 font-medium line-clamp-3 md:line-clamp-1 opacity-80 mt-1">
                                  {addr.address_line || addr.addressLine}
                                </p>
                              </div>
                            </div>

                            {/* Desktop Only Static Chevron - Bottom Right */}
                            <div className="hidden md:flex absolute bottom-4 right-4 z-20 items-center justify-center pointer-events-none">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:text-lime-600 transition-colors">
                                <ChevronRight className="w-4 h-4" strokeWidth={3} />
                              </div>
                            </div>

                            {/* Actions Header */}
                            <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20 flex items-center gap-1.5">
                              <button
                                onClick={(e) => handleOpenEdit(addr, e)}
                                className="flex w-8 h-8 md:w-9 md:h-9 rounded-2xl bg-gray-50 md:bg-gray-100/80 items-center justify-center text-gray-400 shadow-sm transition-all hover:bg-[#1A1A1A] hover:text-white hover:shadow-lg active:scale-90"
                              >
                                <Edit3 size={14} className="md:w-4 md:h-4" strokeWidth={2.5} />
                              </button>

                              <button
                                onClick={(e) => handleDelete(addr, e)}
                                disabled={isDeleting}
                                className="w-8 h-8 md:w-9 md:h-9 rounded-2xl bg-red-50 md:bg-gray-100/80 flex items-center justify-center text-red-500 md:text-gray-400 shadow-sm transition-all md:hover:bg-red-500 md:hover:text-white md:hover:shadow-lg active:scale-90"
                              >
                                <Trash2 size={14} className="md:w-4 md:h-4" strokeWidth={2.5} />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom Sticky Add Button on Mobile */}
                <div className="md:hidden sticky bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 z-30">
                  <button
                    onClick={handleOpenAdd}
                    className="w-full h-12 bg-[#1A1A1A] text-white font-bold text-sm rounded-[20px] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-black/10"
                  >
                    <Plus size={18} strokeWidth={3} />
                    Thêm địa chỉ mới
                  </button>
                </div>

                {/* Desktop Only Bottom Hint */}
                <div className="hidden md:flex p-6 border-t border-gray-50 bg-gray-50/30 items-center justify-between">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {addresses.length} địa chỉ đã lưu
                  </p>
                  <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 text-lime-600 font-bold text-xs hover:text-lime-700 transition-colors"
                  >
                    <Plus size={14} strokeWidth={3} />
                    THÊM ĐỊA CHỈ MỚI
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <AddressFormModal
        isOpen={isAddressFormOpen}
        onClose={() => setIsAddressFormOpen(false)}
        onConfirm={handleConfirmAddress}
        initialData={editingAddress}
        isProcessing={isCreating || isUpdating}
      />
    </div>,
    document.body
  );
}

