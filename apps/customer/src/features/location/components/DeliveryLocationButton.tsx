"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { MapPin, ChevronDown, Navigation, Loader2 } from "@repo/ui/icons";
import { useDeliveryLocationStore } from "@/store/deliveryLocationStore";
import { useUserLocation, DEFAULT_LOCATION_HCMC } from "@repo/hooks";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with modal
const LocationPickerModal = dynamic(
  () => import("./LocationPickerModal"),
  { ssr: false }
);

const SavedAddressesModal = dynamic(
  () => import("../../profile/components/modals/SavedAddressesModal"),
  { ssr: false }
);

// ======== Types ========

interface DeliveryLocationButtonProps {
  variant?: "home" | "header" | "compact" | "mini" | "listener";
  className?: string;
}

// ======== Constants ========

const _X_T = "cGsuZXlKMUlqb2libWRvYjJGdVoyaHBaVzRpTENKaElqb2lZMjFwWkcwNGNtTnhNRGczWXpKdWNURnZkemd5WXpWNVppSjkuYWRKRjY5QnpMVGttWlp5c01YZ1Vodw==";
const MAPBOX_TOKEN = typeof window !== 'undefined' ? atob(_X_T) : Buffer.from(_X_T, 'base64').toString();

// ======== Component ========

export default function DeliveryLocationButton({
  variant = "home",
  className = "",
}: DeliveryLocationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavedAddressesModalOpen, setIsSavedAddressesModalOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Store
  const {
    selectedLocation,
    setSelectedLocation,
    isManuallySelected,
    lastSelectedAt,
    clearSelectedLocation
  } = useDeliveryLocationStore();

  // Get user's current location as fallback
  const { location: userLocation, isLoading: isLocationLoading } = useUserLocation();

  // Initialize location on first load
  useEffect(() => {
    const initLocation = async () => {
      const { selectedLocation, isManuallySelected, lastSelectedAt, clearSelectedLocation } = useDeliveryLocationStore.getState();

      // Check if manual selection has expired (1.5 hours = 5400000ms)
      const isExpired = lastSelectedAt && (Date.now() - lastSelectedAt > 1.5 * 60 * 60 * 1000);

      if (isManuallySelected && isExpired) {
        clearSelectedLocation();
        // Force re-fetch from GPS
      } else if (selectedLocation) {
        setIsInitializing(false);
        return;
      }

      // Wait for user location
      if (isLocationLoading) return;

      const coords = userLocation || DEFAULT_LOCATION_HCMC;

      // Reverse geocode to get address
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?types=poi,address,place&limit=1&language=vi&access_token=${MAPBOX_TOKEN}`;
        const res = await fetch(url);
        const json = await res.json();

        const address = json.features?.[0]?.place_name || "Vị trí hiện tại";
        const placeName = json.features?.[0]?.text || undefined;

        setSelectedLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          address,
          placeName,
        });
      } catch {
        setSelectedLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          address: "Vị trí hiện tại",
        });
      }

      setIsInitializing(false);
    };

    initLocation();
  }, [userLocation, isLocationLoading, selectedLocation, setSelectedLocation]);

  // Global event listener to open modal from anywhere
  useEffect(() => {
    // Only the 'listener' variant should handle global events to avoid duplicates
    if (variant !== "listener") return;

    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener('openLocationPicker', handleOpen);
    return () => window.removeEventListener('openLocationPicker', handleOpen);
  }, [variant]);

  // Handle location selection from modal
  const handleSelectLocation = (location: {
    latitude: number;
    longitude: number;
    address: string;
    placeName?: string;
  }) => {
    setSelectedLocation(location);
  };

  // Determine display text
  const displayAddress = selectedLocation?.address || "Đang xác định...";

  // Format address similarly to DistanceWarningModal: 3 parts, no purely numeric parts
  const formattedAddress = useMemo(() => {
    if (!selectedLocation?.address) return "Đang xác định...";
    const parts = selectedLocation.address.split(',').map(s => s.trim());
    // Filter out postal codes or pure numbers
    const filteredParts = parts.filter(s => !/^\d{5}$/.test(s) && !/^\d+$/.test(s));
    // Take first 3 valid segments
    return filteredParts.slice(0, 3).join(', ');
  }, [selectedLocation?.address]);

  const isLoading = isInitializing || isLocationLoading;
  const displayName = isLoading ? "Đang tải..." : formattedAddress;

  // ======== Render Variants ========

  const renderButton = () => {
    if (variant === "listener") return null;

    if (variant === "compact") {
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-2xl md:rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all ${className}`}
        >
          <MapPin className="w-4 h-4 text-lime-400" />
          <span className="text-sm font-bold text-white truncate w-full md:max-w-[260px]">
            {isLoading ? "Đang tải..." : displayName}
          </span>
          <ChevronDown className="w-4 h-4 text-white/60" />
        </motion.button>
      );
    }

    if (variant === "header") {
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-all ${className}`}
        >
          <MapPin className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
            {isLoading ? "Đang tải..." : displayName}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.button>
      );
    }

    if (variant === "mini") {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className={`w-10 h-10 rounded-xl bg-lime-500/90 flex items-center justify-center transition-all ${className}`}
        >
          <MapPin className="w-5 h-5 text-white" />
        </motion.button>
      );
    }

    // Default: "home" variant
    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsModalOpen(true)}
        className={`w-full max-w-md mx-auto ${className}`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-lime-500/10 via-transparent to-lime-500/10 pointer-events-none" />
          <div className="relative px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2 py-0.5 rounded-md bg-lime-500/20 border border-lime-500/30">
                <span className="text-[10px] font-bold text-lime-300 uppercase tracking-wider">
                  Giao đến
                </span>
              </div>
              {isManuallySelected && (
                <span className="text-[10px] text-white/40">• Đã chọn</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-lime-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-lime-500/30">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5 text-white" />
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="text-white font-semibold text-base truncate">
                  {isLoading ? "Đang xác định vị trí..." : displayName}
                </div>
                {!isLoading && selectedLocation?.address && displayName !== selectedLocation.address && (
                  <div className="text-white/50 text-xs truncate mt-0.5">
                    {selectedLocation.address}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">
                <span className="text-xs font-medium text-white/80">Thay đổi</span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </div>
            </div>
          </div>
        </div>
      </motion.button>
    );
  };

  return (
    <>
      {renderButton()}

      <LocationPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLocation={handleSelectLocation}
        initialLocation={selectedLocation ? {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        } : undefined}
        initialAddress={selectedLocation?.address}
        onOpenSaved={() => setIsSavedAddressesModalOpen(true)}
      />

      <SavedAddressesModal
        isOpen={isSavedAddressesModalOpen}
        onClose={() => setIsSavedAddressesModalOpen(false)}
        onSelect={(addr) => {
          const selectedAddr = addr.address_line || addr.addressLine || "";
          setSelectedLocation({
            latitude: addr.latitude || 0,
            longitude: addr.longitude || 0,
            address: selectedAddr,
            placeName: addr.label
          });
          setIsSavedAddressesModalOpen(false);
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
