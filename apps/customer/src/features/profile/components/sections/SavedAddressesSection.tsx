import { useState } from "react";
import { motion } from "@repo/ui/motion";
import { MapPin, Plus, Trash2, Home, Briefcase, Map, ChevronRight, Check, Edit3 } from "@repo/ui/icons";
import { useCustomerAddresses } from "../../hooks/useCustomerAddresses";
import { SavedAddressesShimmer, useSwipeConfirmation } from "@repo/ui";
import { IAddress } from "@repo/types";
import AddressFormModal from "../modals/AddressFormModal";

export default function SavedAddressesSection() {
  const { addresses, isLoading, createAddress, updateAddress, deleteAddress, isCreating, isUpdating, isDeleting } = useCustomerAddresses();
  const { confirm } = useSwipeConfirmation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);

  if (isLoading) return <SavedAddressesShimmer />;

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: IAddress) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleDelete = (addr: IAddress) => {
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

  const handleConfirm = (data: IAddress) => {
    if (editingAddress) {
      updateAddress(data, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createAddress(data, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("nhà") || l.includes("home")) return Home;
    if (l.includes("công ty") || l.includes("work") || l.includes("văn phòng")) return Briefcase;
    return Map;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="hidden md:flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                <MapPin size={12} />
                Địa chỉ giao hàng
              </span>
            </div>
            <h2 className="text-4xl md:text-[56px] font-bold leading-none text-[#1A1A1A] uppercase" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
              ADDRESSES
            </h2>
            <p className="text-gray-500 font-medium">Lưu trữ địa chỉ giúp bạn đặt hàng nhanh chóng hơn</p>
          </div>

          {/* Desktop Version - Only visible on md+ screens */}
          <div className="hidden md:block relative z-50">
            <button
              onClick={handleOpenAdd}
              className="px-8 py-4 bg-[#1A1A1A] text-white font-anton text-sm uppercase tracking-wider rounded-[24px] hover:bg-lime-500 hover:text-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 w-fit"
            >
              <Plus size={18} />
              Thêm địa chỉ mới
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {addresses.length === 0 ? (
            <div className="py-20 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center text-gray-400 bg-slate-50/30">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <MapPin size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest mb-1">Chưa có địa chỉ nào</p>
              <p className="text-xs">Hãy thêm địa chỉ giao hàng đầu tiên của bạn</p>
            </div>
          ) : (
            addresses.map((addr) => {
              const Icon = getIcon(addr.label);
              return (
                <motion.div
                  key={addr.id}
                  onClick={() => handleOpenEdit(addr)}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-[#F8F9FA] border-2 border-transparent hover:bg-slate-100/70 p-5 rounded-[32px] transition-all duration-300 hover:shadow-md cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center gap-6">
                    {/* Left: Icon Box */}
                    <div className="w-14 h-14 rounded-[20px] bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <Icon className="w-7 h-7 text-lime-600" />
                    </div>

                    {/* Middle: Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1 tracking-tight group-hover:text-lime-600 transition-colors">
                        {addr.label}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <p className="text-gray-500 font-medium text-sm truncate pr-8">
                          {addr.address_line || addr.addressLine}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions (Hidden until hover) */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500 pr-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(addr);
                        }}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm hover:shadow-lg hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all duration-300"
                      >
                        <Edit3 size={18} style={{ strokeWidth: 2.5 }} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(addr);
                        }}
                        disabled={isDeleting}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-red-500 shadow-sm hover:shadow-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
                      >
                        <Trash2 size={18} style={{ strokeWidth: 2.5 }} />
                      </button>
                      <div className="w-px h-8 bg-gray-100 mx-1" />
                      <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-lime-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>

                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Mobile Version - Outside of motion.div to prevent jump from transform */}
      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 z-50">
          <button
            onClick={handleOpenAdd}
            className="px-8 py-4 bg-[#1A1A1A] text-white font-anton text-sm uppercase tracking-wider rounded-[24px] hover:bg-lime-500 hover:text-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 w-full"
          >
            <Plus size={18} />
            Thêm địa chỉ mới
          </button>
        </div>
      </div>

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        initialData={editingAddress}
        isProcessing={isCreating || isUpdating}
      />
    </>
  );
}
