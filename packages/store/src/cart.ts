import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  restaurantId: string;
  options?: {
    variant?: { id: string; name: string; price: number };
    addons?: { id: string; name: string; price: number }[];
    groups?: { id: string; title: string; options: { id: string; name: string; price: number }[] }[];
  };
}

export interface CartState {
  activeRestaurantId: string | null;
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  setActiveRestaurant: (restaurantId: string) => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      activeRestaurantId: null,
      items: [],
      addItem: (item) => {
        const qty = item.quantity ?? 1;
        const currentRestaurant = get().activeRestaurantId;
        if (currentRestaurant && currentRestaurant !== item.restaurantId) {
          set({ items: [], activeRestaurantId: item.restaurantId });
        }
        if (!currentRestaurant) {
          set({ activeRestaurantId: item.restaurantId });
        }
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: qty }] });
        }
      },
      removeItem: (id) => {
        const target = get().items.find((i) => i.id === id);
        if (!target) return;
        if (target.quantity > 1) {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          });
        } else {
          set({ items: get().items.filter((i) => i.id !== id) });
        }
      },
      setQuantity: (id, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) });
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      setActiveRestaurant: (restaurantId) => {
        const current = get().activeRestaurantId;
        if (current !== restaurantId) set({ items: [], activeRestaurantId: restaurantId });
      },
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "eatzy-cart" }
  )
);
