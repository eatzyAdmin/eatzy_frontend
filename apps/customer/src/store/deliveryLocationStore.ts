import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ======== Types ========

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  address: string;
  placeName?: string;
}

interface DeliveryLocationState {
  // Current selected delivery location
  selectedLocation: DeliveryLocation | null;

  // Whether user has manually selected a location
  isManuallySelected: boolean;

  // Actions
  setSelectedLocation: (location: DeliveryLocation) => void;
  clearSelectedLocation: () => void;
  updateAddress: (address: string, placeName?: string) => void;
}

// ======== Store ========

/**
 * Global store for delivery location
 * Used across Home, Search, Checkout pages
 * Persisted to localStorage so location survives page refreshes
 */
export const useDeliveryLocationStore = create<DeliveryLocationState>()(
  persist(
    (set) => ({
      selectedLocation: null,
      isManuallySelected: false,

      setSelectedLocation: (location) =>
        set({
          selectedLocation: location,
          isManuallySelected: true,
        }),

      clearSelectedLocation: () =>
        set({
          selectedLocation: null,
          isManuallySelected: false,
        }),

      updateAddress: (address, placeName) =>
        set((state) => ({
          selectedLocation: state.selectedLocation
            ? { ...state.selectedLocation, address, placeName }
            : null,
        })),
    }),
    {
      name: 'eatzy-delivery-location',
    }
  )
);

// ======== Selectors ========

export const selectDeliveryLocation = (state: DeliveryLocationState) => state.selectedLocation;
export const selectIsManuallySelected = (state: DeliveryLocationState) => state.isManuallySelected;
export const selectDeliveryAddress = (state: DeliveryLocationState) => state.selectedLocation?.address || '';
