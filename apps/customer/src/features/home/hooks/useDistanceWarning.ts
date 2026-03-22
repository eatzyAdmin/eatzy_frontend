import { useState, useEffect, useMemo } from 'react';
import { useUserLocation } from '@repo/hooks';
import { getRouteDistance } from '@/features/location/utils';

// MAPBOX TOKEN (Base64 decoded)
const _X_T = "cGsuZXlKMUlqb2libWRvYjJGdVoyaHBaVzRpTENKaElqb2lZMjFwWkcwNGNtTnhNRGczWXpKdWNURnZkemd5WXpWNVppSjkuYWRKRjY5QnpMVGttWlp5c01YZ1Vodw==";
const MAPBOX_TOKEN = typeof window !== 'undefined' ? atob(_X_T) : Buffer.from(_X_T, 'base64').toString();

interface UseDistanceWarningProps {
  isSearchMode: boolean;
  showRecommended: boolean;
  deliveryLocation: { latitude: number; longitude: number } | null;
}

export function useDistanceWarning({
  isSearchMode,
  showRecommended,
  deliveryLocation
}: UseDistanceWarningProps) {
  const [showDistanceWarning, setShowDistanceWarning] = useState(false);
  const [lastCheckedLocation, setLastCheckedLocation] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // Get current GPS location
  const { location: gpsLocation } = useUserLocation({ useFallback: false });

  useEffect(() => {
    if (!gpsLocation || !deliveryLocation || isSearchMode || showRecommended) {
      if (showDistanceWarning && (isSearchMode || showRecommended)) {
        setShowDistanceWarning(false);
      }
      return;
    }

    // Create a key for the current delivery location to avoid repeated warnings for the same address
    const locationKey = `${deliveryLocation.latitude},${deliveryLocation.longitude}`;
    if (locationKey === lastCheckedLocation) return;

    const checkDistance = async () => {
      try {
        const routeDistance = await getRouteDistance(
          { lat: gpsLocation.latitude, lng: gpsLocation.longitude },
          { lat: deliveryLocation.latitude, lng: deliveryLocation.longitude },
          MAPBOX_TOKEN
        );

        if (routeDistance && routeDistance > 400) {
          setDistance(routeDistance);
          // Delay it slightly for a smoother feeling
          setTimeout(() => {
            setShowDistanceWarning(true);
          }, 1000);
        }

        setLastCheckedLocation(locationKey);
      } catch (error) {
        console.error("Error checking distance:", error);
      }
    };

    checkDistance();
  }, [gpsLocation, deliveryLocation, lastCheckedLocation, isSearchMode, showRecommended, showDistanceWarning]);

  // Handle explicit closing or mode changes
  useEffect(() => {
    if (isSearchMode || showRecommended) {
      setShowDistanceWarning(false);
    }
  }, [isSearchMode, showRecommended]);

  return {
    showDistanceWarning,
    setShowDistanceWarning,
    distance
  };
}
