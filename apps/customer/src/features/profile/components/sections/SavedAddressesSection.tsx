import { useState } from "react";
import { motion } from "@repo/ui/motion";
import { MapPin, Plus, Trash2, Home, Briefcase, Map, ChevronRight, Check, Edit3 } from "@repo/ui/icons";
import { useCustomerAddresses } from "../../hooks/useCustomerAddresses";
import { SavedAddressesShimmer, useSwipeConfirmation } from "@repo/ui";
import { IAddress } from "@repo/types";
import AddressFormModal from "../modals/AddressFormModal";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SavedAddressesSection() {
  const { addresses, isLoading, createAddress, updateAddress, deleteAddress, isCreating, isUpdating, isDeleting } = useCustomerAddresses();
  const { confirm } = useSwipeConfirmation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);

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
      title: "Delete Address",
      description: `Are you sure you want to delete "${addr.label}"? This action cannot be undone.`,
      confirmText: "Swipe to delete",
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
    if (l.includes("home")) return Home;
    if (l.includes("work") || l.includes("office")) return Briefcase;
    return Map;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:space-y-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="hidden md:flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                <MapPin size={12} />
                Delivery Addresses
              </span>
            </div>
            <h2 className="text-4xl md:text-[56px] font-bold leading-none text-[#1A1A1A] uppercase" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
              ADDRESSES
            </h2>
            <p className="text-gray-500 font-medium">Storing addresses helps you order faster</p>
          </div>

          {/* Desktop Version - Only visible on md+ screens */}
          <div className="hidden md:block relative z-50">
            <button
              onClick={handleOpenAdd}
              className="px-8 py-4 bg-[#1A1A1A] text-white font-anton text-sm uppercase tracking-wider rounded-[24px] hover:bg-lime-500 hover:text-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 w-fit"
            >
              <Plus size={18} />
              Add New Address
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 md:gap-4">
          {isLoading ? (
            <SavedAddressesShimmer cardCount={3} />
          ) : addresses.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No addresses yet"
              description="Add your delivery address to order faster!"
              className="py-12"
            />
          ) : (
            addresses.map((addr) => {
              const Icon = getIcon(addr.label);
              return (
                <motion.div
                  key={addr.id}
                  onClick={() => handleOpenEdit(addr)}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full h-[120px] md:h-[120px] flex flex-row overflow-hidden rounded-[36px] md:rounded-[40px] cursor-pointer transition-all duration-500 bg-white md:bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] md:shadow-[0_0_25px_rgba(0,0,0,0.10)] hover:bg-gray-50/50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                >
                  {/* Visual Identity Section (Left) - Similar to CartItemCard */}
                  <div className="relative w-28 md:w-32 h-full flex-shrink-0 bg-slate-50 flex items-center justify-center border-r border-gray-100 overflow-hidden">
                    <div className="absolute inset-0 bg-lime-50/30 md:group-hover:bg-lime-50/50 transition-colors duration-500" />
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-lime-600 relative z-10 transition-transform duration-500 md:group-hover:scale-110" />

                    {/* Decorative Badge - Like ChefHat in CartItemCard */}
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
                          <span className="text-[8px] font-black uppercase tracking-widest leading-none">Location</span>
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

                  {/* Actions Header - Positioned Top Right */}
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20 flex md:flex-row-reverse items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr);
                      }}
                      disabled={isDeleting}
                      className="w-9 h-9 rounded-2xl bg-red-50 md:bg-gray-100/80 flex items-center justify-center text-red-500 md:text-gray-400 shadow-sm transition-all md:hover:bg-red-500 md:hover:text-white md:hover:shadow-lg active:scale-90"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(addr);
                      }}
                      className="hidden md:flex w-9 h-9 rounded-2xl bg-gray-100/80 items-center justify-center text-gray-400 shadow-sm transition-all hover:bg-[#1A1A1A] hover:text-white hover:shadow-lg active:scale-90"
                    >
                      <Edit3 size={16} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Desktop Only Chevron Link - Bottom Right */}
                  <div className="hidden md:flex absolute bottom-4 right-4 z-20 items-center gap-2 overflow-hidden pointer-events-none md:group-hover:pointer-events-auto">
                    <span className="text-[10px] font-black text-lime-600 uppercase tracking-widest translate-x-10 opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-500 ease-out">
                      Update
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center md:group-hover:bg-lime-500 md:group-hover:text-black transition-all duration-300">
                      <ChevronRight className="w-4 h-4 transition-transform md:group-hover:translate-x-1" strokeWidth={3} />
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
            className="px-8 py-4 bg-[#1A1A1A] text-white font-bold text-sm rounded-[24px] hover:bg-lime-500 hover:text-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 w-full"
          >
            <Plus size={18} strokeWidth={3} />
            Add New Address
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
