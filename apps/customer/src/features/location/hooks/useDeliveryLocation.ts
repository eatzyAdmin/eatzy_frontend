import { useEffect } from 'react';
import { useDeliveryLocationStore } from '@/store/deliveryLocationStore';
import { useUserLocation, DEFAULT_LOCATION_HCMC } from '@repo/hooks';
import type { UserLocation } from '@repo/hooks';

// ======== Types ========

export interface DeliveryLocationResult {
  /** The currently selected delivery location coordinates */
  location: UserLocation;
  /** The full address string */
  address: string;
  /** Short place name if available */
  placeName?: string;
  /** Whether location is being determined */
  isLoading: boolean;
  /** Whether user has manually selected a location */
  isManuallySelected: boolean;
  /** Open the location picker modal */
  openLocationPicker: () => void;
}

// ======== Hook ========

/**
 * Hook to get the current delivery location
 * Prioritizes manually selected location, falls back to user's GPS location
 * 
 * Use this hook instead of useUserLocation when you need the delivery destination
 * (e.g., for searching nearby restaurants, calculating delivery distance)
 * 
 * @example
 * ```tsx
 * const { location, address, isLoading } = useDeliveryLocation();
 * 
 * // Use for API calls
 * const { restaurants } = useSearchRestaurants({
 *   latitude: location.latitude,
 *   longitude: location.longitude,
 * });
 * ```
 */
export function useDeliveryLocation(): DeliveryLocationResult {
  // Get selected location from store
  const { selectedLocation, isManuallySelected, setSelectedLocation } = useDeliveryLocationStore();

  // Get user's GPS location as fallback
  const { location: userLocation, isLoading: isUserLocationLoading } = useUserLocation();

  // Auto-set initial location if not set
  useEffect(() => {
    if (selectedLocation || isUserLocationLoading) return;

    // Set initial location from GPS
    const coords = userLocation || DEFAULT_LOCATION_HCMC;

    // We'll set basic location now, address will be fetched by DeliveryLocationButton
    setSelectedLocation({
      latitude: coords.latitude,
      longitude: coords.longitude,
      address: "Vị trí hiện tại",
    });
  }, [selectedLocation, userLocation, isUserLocationLoading, setSelectedLocation]);

  // Determine effective location
  const effectiveLocation: UserLocation = selectedLocation
    ? { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }
    : userLocation || DEFAULT_LOCATION_HCMC;

  const isLoading = !selectedLocation && isUserLocationLoading;

  return {
    location: effectiveLocation,
    address: selectedLocation?.address || "Đang xác định...",
    placeName: selectedLocation?.placeName,
    isLoading,
    isManuallySelected,
    openLocationPicker: () => {
      // This will be called from components that need to open the picker
      // The actual modal opening is handled by DeliveryLocationButton
      window.dispatchEvent(new CustomEvent('openLocationPicker'));
    },
  };
}
