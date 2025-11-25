"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, Trash, Plus, Minus } from "@repo/ui/icons";
import { useCartStore } from "@repo/store";
import { useEffect } from "react";
import { ImageWithFallback } from "@repo/ui";
import { formatVnd } from "@repo/lib";
import { getRestaurantById } from "@/features/search/data/mockSearchData";
import { useRouter } from "next/navigation";
import { useLoading } from "@repo/ui";

export default function CartOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, addItem, removeItem, setQuantity, total, activeRestaurantId } = useCartStore();
  const router = useRouter();
  const { show } = useLoading();
  useEffect(() => {
    if (open && items.length === 0) {
      addItem({ id: "dish-001", name: "Traditional Sushi", price: 85000, imageUrl: "https://images.unsplash.com/photo-1540317584754-5079b12b2743?w=400&q=60", restaurantId: "rest-2", quantity: 1 });
      addItem({ id: "dish-002", name: "Prawn Cocktail", price: 65000, imageUrl: "https://images.unsplash.com/photo-1604908176997-88661f2a2c7e?w=400&q=60", restaurantId: "rest-2", quantity: 1 });
      addItem({ id: "dish-003", name: "Seaweed Salad", price: 45000, imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=60", restaurantId: "rest-2", quantity: 1 });
    }
  }, [open, items.length, addItem]);
  const restaurantName = activeRestaurantId ? (getRestaurantById(activeRestaurantId)?.name ?? "") : "";
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: 480, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 480, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed z-[70] right-0 top-0 bottom-0 w-[460px] max-w-[96vw] bg-[#F7F7F7] border-l border-gray-200 overflow-hidden rounded-l-[40px] shadow-2xl"
          >
            <div className="flex items-center justify-between p-8 border-b border-gray-200 text-[#1A1A1A] bg-white/60">
              <div className="flex flex-col">
                {restaurantName && (
                  <div className="text-3xl font-anton font-semibold uppercase">{restaurantName}</div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-6 text-[#555]">Chưa có món nào</div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {items.map((it) => (
                    <li key={it.id} className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                          <ImageWithFallback src={it.imageUrl ?? ""} alt={it.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="text-[#1A1A1A] font-medium">{it.name}</div>
                            <motion.button
                              whileHover={{ scale: 1.06 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => setQuantity(it.id, 0)}
                              className="w-7 h-7 rounded-lg bg-gray-300 mx-2 flex items-center justify-center"
                            >
                              <Trash className="w-4 h-4 text-gray-700" />
                            </motion.button>
                          </div>
                          {Array.isArray(it.options?.groups) && it.options!.groups.length > 0 ? (
                            <div className="space-y-0.5">
                              {[...it.options!.groups]
                                .sort((a, b) => {
                                  const ap = String(a.title || "").toLowerCase().startsWith("variant") ? 0 : 1;
                                  const bp = String(b.title || "").toLowerCase().startsWith("variant") ? 0 : 1;
                                  return ap - bp;
                                })
                                .map((g) => (
                                  <div key={g.id} className="text-[#555] text-xs">
                                    {String(g.title || "").toLowerCase().startsWith("variant") ? "Phân loại" : g.title}: {g.options.map((o) => o.name).join(", ")}
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <>
                              {it.options?.variant?.name && (
                                <div className="text-[#555] text-xs">Phân loại: {it.options.variant.name}</div>
                              )}
                              {it.options?.addons && it.options.addons.length > 0 && (
                                <div className="text-[#555] text-xs">Topping: {it.options.addons.map((a) => a.name).join(", ")}</div>
                              )}
                            </>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-[#1A1A1A] font-semibold">{formatVnd(it.price)}</div>
                            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-2 py-1">
                              <motion.button
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => removeItem(it.id)}
                                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#1A1A1A]"
                              >
                                <Minus className="w-4 h-4" />
                              </motion.button>
                              <AnimatePresence mode="wait">
                                <motion.span
                                  key={it.quantity}
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -6 }}
                                  transition={{ duration: 0.18 }}
                                  className="w-8 text-center font-bold text-[#1A1A1A] text-sm"
                                >
                                  {it.quantity}
                                </motion.span>
                              </AnimatePresence>
                              <motion.button
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.92 }}
                                onClick={() =>
                                  addItem({
                                    id: it.id,
                                    name: it.name,
                                    price: it.price,
                                    imageUrl: it.imageUrl,
                                    restaurantId: it.restaurantId,
                                    quantity: 1,
                                  })
                                }
                                className="w-7 h-7 rounded-lg bg-[var(--primary)] text-white border border-[var(--primary)] flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 bg-white/60">
              <div className="flex items-center justify-between">
                <div className="text-sm">Tổng số tiền</div>
                <div className="text-lg font-semibold text-[var(--primary)]">{formatVnd(total())}</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  show("Đang chuyển đến Checkout...");
                  onClose();
                  router.push("/checkout");
                }}
                className="mt-3 w-full h-12 rounded-2xl bg-[var(--primary)] text-white font-semibold shadow-md"
              >
                Xem đơn hàng
              </motion.button>
              <div className="mt-2 text-xs text-[#555]">Xem phí áp dụng và dùng mã khuyến mại ở bước tiếp theo</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
