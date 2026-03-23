import { create } from 'zustand';

interface UIState {
  isCartOpen: boolean;
  isOrdersDrawerOpen: boolean;
  isLocationPickerOpen: boolean;
  isSavedAddressesOpen: boolean;
  isMenuOpen: boolean;
  isRecommendedMode: boolean;
  isSearchOpen: boolean;
  
  setCartOpen: (open: boolean) => void;
  setOrdersDrawerOpen: (open: boolean) => void;
  setLocationPickerOpen: (open: boolean) => void;
  setSavedAddressesOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  setRecommendedMode: (active: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isOrdersDrawerOpen: false,
  isLocationPickerOpen: false,
  isSavedAddressesOpen: false,
  isMenuOpen: false,
  isRecommendedMode: false,
  isSearchOpen: false,

  setCartOpen: (open) => set({ isCartOpen: open }),
  setOrdersDrawerOpen: (open) => set({ isOrdersDrawerOpen: open }),
  setLocationPickerOpen: (open) => set({ isLocationPickerOpen: open }),
  setSavedAddressesOpen: (open) => set({ isSavedAddressesOpen: open }),
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  setRecommendedMode: (active) => set({ isRecommendedMode: active }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
