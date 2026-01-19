import { useState, useEffect, useCallback } from 'react';

// ======== Types ========

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface UseUserLocationResult {
  location: UserLocation | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseUserLocationOptions {
  /** Use default location as fallback when geolocation fails (default: true) */
  useFallback?: boolean;
  /** Custom default location (default: HCMC center) */
  defaultLocation?: UserLocation;
  /** Enable high accuracy GPS (default: true) */
  enableHighAccuracy?: boolean;
  /** Timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Maximum age of cached position in milliseconds (default: 5 minutes) */
  maximumAge?: number;
}

// ======== Constants ========

/** Default location: Ho Chi Minh City center (Ben Thanh Market area) */
export const DEFAULT_LOCATION_HCMC: UserLocation = {
  latitude: 10.7726,
  longitude: 106.6981,
};

/** Default location: Hanoi center (Hoan Kiem Lake area) */
export const DEFAULT_LOCATION_HANOI: UserLocation = {
  latitude: 21.0285,
  longitude: 105.8542,
};

// ======== Hook ========

/**
 * Hook to get user's current location using browser Geolocation API
 * Falls back to default location (HCMC) if geolocation is not available or denied
 * 
 * @param options Configuration options
 * @returns UserLocation with latitude/longitude, loading state, and error
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { location, isLoading, error } = useUserLocation();
 * 
 * // Custom options
 * const { location } = useUserLocation({
 *   useFallback: true,
 *   defaultLocation: DEFAULT_LOCATION_HANOI,
 *   timeout: 5000,
 * });
 * 
 * if (location) {
 *   console.log(`User at: ${location.latitude}, ${location.longitude}`);
 * }
 * ```
 */
export function useUserLocation(options: UseUserLocationOptions = {}): UseUserLocationResult {
  const {
    useFallback = true,
    defaultLocation = DEFAULT_LOCATION_HCMC,
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    // Check if running in browser
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      setError('Not running in browser environment');
      if (useFallback) {
        setLocation(defaultLocation);
      }
      setIsLoading(false);
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ định vị');
      if (useFallback) {
        setLocation(defaultLocation);
      }
      setIsLoading(false);
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
        setError(null);
      },
      (geoError) => {
        let errorMessage = 'Không thể lấy vị trí của bạn';

        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = 'Bạn đã từ chối quyền truy cập vị trí';
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = 'Không thể xác định vị trí của bạn';
            break;
          case geoError.TIMEOUT:
            errorMessage = 'Quá thời gian lấy vị trí';
            break;
        }

        setError(errorMessage);

        if (useFallback) {
          setLocation(defaultLocation);
        }

        setIsLoading(false);
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [useFallback, defaultLocation, enableHighAccuracy, timeout, maximumAge]);

  // Fetch on mount
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    location,
    isLoading,
    error,
    refetch: fetchLocation,
  };
}
