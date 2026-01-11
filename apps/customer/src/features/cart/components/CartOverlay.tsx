"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, Trash, CheckCircle2, Store } from "@repo/ui/icons";
import { useCartStore, CartItem } from "@repo/store";
import { useEffect, useMemo, useState } from "react";
import { ImageWithFallback } from "@repo/ui";
import { formatVnd } from "@repo/lib";
import { getRestaurantById } from "@/features/search/data/mockSearchData";
import { useRouter } from "next/navigation";
import { useLoading, CartOverlayShimmer } from "@repo/ui";

export default function CartOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, addItem, removeItemsByRestaurant, setActiveRestaurant } = useCartStore();
  const router = useRouter();
  const { show } = useLoading();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRestIds, setSelectedRestIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Dummy data initialization
  useEffect(() => {
    if (open && items.length === 0) {
      // Add items for Rest 2
      addItem({ id: "dish-001", name: "Traditional Sushi", price: 85000, imageUrl: "https://images.unsplash.com/photo-1540317584754-5079b12b2743?w=400&q=60", restaurantId: "rest-2", quantity: 1 });
      // Add items for Rest 1 (to demo multiple)
      addItem({ id: "dish-1-1", name: "Phở Bò Tái", price: 65000, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400", restaurantId: "rest-1", quantity: 2 });
    }
  }, [open, items.length, addItem]);

  // Group items by restaurant
  const carts = useMemo(() => {
    const groups: Record<string, { count: number; subtotal: number; items: CartItem[] }> = {};
    items.forEach(item => {
      if (!groups[item.restaurantId]) {
        groups[item.restaurantId] = { count: 0, subtotal: 0, items: [] };
      }
      groups[item.restaurantId].count += item.quantity;
      groups[item.restaurantId].subtotal += item.price * item.quantity;
      groups[item.restaurantId].items.push(item);
    });
    return Object.entries(groups).map(([rId, data]) => ({
      restaurantId: rId,
      ...data,
      info: getRestaurantById(rId)
    }));
  }, [items]);

  const toggleSelection = (rId: string) => {
    const next = new Set(selectedRestIds);
    if (next.has(rId)) next.delete(rId);
    else next.add(rId);
    setSelectedRestIds(next);
  };

  const handleBulkDelete = () => {
    selectedRestIds.forEach(id => removeItemsByRestaurant(id));
    setSelectedRestIds(new Set());
    setIsEditMode(false);
  };

  const handleCardClick = (rId: string) => {
    if (isEditMode) {
      toggleSelection(rId);
    } else {
      show("Đang chuyển đến Checkout...");
      setActiveRestaurant(rId);
      onClose();
      // Use setTimeout to allow overlay to close smoothly and loading to appear
      setTimeout(() => {
        router.push("/checkout");
      }, 300);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            key="cart-panel"
            initial={{ x: 480, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 480, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed z-[70] inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 w-full md:w-[460px] md:max-w-[96vw] bg-[#F7F7F7] border-l-0 md:border-l border-gray-200 overflow-hidden rounded-none md:rounded-l-[40px] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-8 border-b border-gray-200 text-[#1A1A1A] bg-white/60 flex-shrink-0">
              <div className="flex flex-col">
                <div className="text-3xl font-anton font-semibold uppercase">Giỏ hàng</div>
                <div className="text-sm text-gray-500 font-medium">
                  {carts.length} quán ăn đang chờ
                </div>
              </div>
              <div className="flex items-center gap-3">
                {carts.length > 0 && (
                  <button
                    onClick={() => {
                      setIsEditMode(!isEditMode);
                      setSelectedRestIds(new Set());
                    }}
                    className="px-6 py-3 rounded-2xl bg-gray-100 text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {isEditMode ? "Xong" : "Sửa"}
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-4 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors ml-1"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {isLoading ? (
                <>
                  <CartOverlayShimmer />
                  <CartOverlayShimmer />
                </>
              ) : carts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                    <Trash className="w-8 h-8 opacity-20" />
                  </div>
                  <p>Giỏ hàng trống</p>
                </div>
              ) : (
                carts.map(({ restaurantId, info, count, subtotal, items }) => {
                  const isSelected = selectedRestIds.has(restaurantId);
                  return (
                    <motion.div
                      key={restaurantId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: isEditMode ? 1 : 1.02 }}
                      onClick={() => handleCardClick(restaurantId)}
                      className={`relative bg-white rounded-3xl p-4 shadow-sm border-4 transition-all cursor-pointer group ${isEditMode && isSelected
                        ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                        : "border-gray-100 hover:border-gray-300 hover:shadow-md"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Checkbox for Edit Mode */}
                        <AnimatePresence initial={false}>
                          {isEditMode && (
                            <motion.div
                              initial={{ width: 0, opacity: 0, marginRight: 0 }}
                              animate={{ width: 32, opacity: 1, marginRight: 0 }}
                              exit={{ width: 0, opacity: 0, marginRight: 0 }}
                              className="overflow-hidden flex items-center"
                            >
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                                ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                                : "border-gray-300 bg-white"
                                }`}>
                                {isSelected && <CheckCircle2 className="w-4 h-4" />}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Restaurant Image */}
                        <div className="relative flex-shrink-0">
                          <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-gray-100 border-4 border-gray-200">
                            <ImageWithFallback
                              src={info?.imageUrl || ""}
                              alt={info?.name || "Restaurant"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute -top-4 -left-2 z-20 bg-white p-2 rounded-2xl shadow-lg border-2 border-gray-100 transform">
                            <Store className="w-5 h-5 text-[var(--primary)]" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 py-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-bold text-[#1A1A1A] text-lg truncate pr-2">
                              {info?.name || "Unknown Restaurant"}
                            </h3>
                            {/* Trash Icon (Visible in Normal Mode) */}
                            {!isEditMode && (
                              <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "#FEE2E2" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItemsByRestaurant(restaurantId);
                                }}
                                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>

                          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5 mb-2 pr-8">
                            {items.map(i => i.name).join(", ")}
                          </div>
                          <div className="flex items-end justify-between">
                            <div className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg font-medium whitespace-nowrap">
                              {count} món
                            </div>
                            <div className="text-lg font-bold text-[var(--primary)] whitespace-nowrap">
                              {formatVnd(subtotal)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions */}
            <AnimatePresence>
              {isEditMode && selectedRestIds.size > 0 && (
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  className="absolute bottom-8 left-8 right-8"
                >
                  <button
                    onClick={handleBulkDelete}
                    className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Trash className="w-5 h-5" />
                    <span>Xóa ({selectedRestIds.size}) quán đã chọn</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
