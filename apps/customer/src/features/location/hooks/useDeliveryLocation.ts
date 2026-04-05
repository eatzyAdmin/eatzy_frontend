import { useEffect } from 'react';
import { useDeliveryLocationStore } from '@/store/deliveryLocationStore';
import { useUserLocation, DEFAULT_LOCATION_HCMC } from '@repo/hooks';
import type { UserLocation } from '@repo/hooks';
import { sileo } from '@/components/DynamicIslandToast';

const _X_T = "cGsuZXlKMUlqb2libWRvYjJGdVoyaHBaVzRpTENKaElqb2lZMjFwWkcwNGNtTnhNRGczWXpKdWNURnZkemd5WXpWNVppSjkuYWRKRjY5QnpMVGttWlp5c01YZ1Vodw==";
const MAPBOX_TOKEN = typeof window !== 'undefined' ? atob(_X_T) : Buffer.from(_X_T, 'base64').toString();

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
  const { selectedLocation, isManuallySelected, setAutoLocation, updateAddress } = useDeliveryLocationStore();

  // Get user's GPS location as fallback
  const { location: userLocation, isLoading: isUserLocationLoading } = useUserLocation();

  // Auto-set initial location and fetch real address if not set
  useEffect(() => {
    const fetchAddress = async (lat: number, lng: number) => {
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi,address,place&limit=1&language=vi&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(url);
        const json = await res.json();

        const address = json.features?.[0]?.place_name || "Vị trí hiện tại";
        const placeName = json.features?.[0]?.text || undefined;

        updateAddress(address, placeName);
      } catch (error) {
        console.error("Geocoding failed:", error);
      }
    };

    if (isUserLocationLoading) return;

    // Use GPS location or fall back to HCMC
    const coords = userLocation || DEFAULT_LOCATION_HCMC;

    // Case 1: No location at all - Init with placeholder
    if (!selectedLocation) {
      setAutoLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: "Vị trí hiện tại",
      });
      return;
    }

    // Case 2: Handled by geocoding - If the current address is just the placeholder, fetch the real address
    // We do this regardless of isManuallySelected because "Vị trí hiện tại" is a dummy value.
    if (selectedLocation.address === "Vị trí hiện tại") {
      fetchAddress(coords.latitude, coords.longitude);
    }
  }, [userLocation, isUserLocationLoading, selectedLocation, isManuallySelected, setAutoLocation, updateAddress]);

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
