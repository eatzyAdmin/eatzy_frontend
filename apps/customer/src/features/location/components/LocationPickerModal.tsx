"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, MapPin, Search, LocateFixed, Navigation, Check, Loader2, Hand, Store, ChevronRight } from "@repo/ui/icons";
import dynamic from "next/dynamic";
import { ImageWithFallback } from "@repo/ui";

// Dynamic import MapView to avoid SSR issues
const MapViewForPicker = dynamic(
  () => import("@/features/location/components/MapViewForPicker"),
  { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" /> }
);

// ======== Types ========

interface PlaceSuggestion {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: {
    latitude: number;
    longitude: number;
    address: string;
    placeName?: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  initialAddress?: string;
  onOpenSaved?: () => void;
}

// ======== Constants ========

const _X_T = "cGsuZXlKMUlqb2libWRvYjJGdVoyaHBaVzRpTENKaElqb2lZMjFwWkcwNGNtTnhNRGczWXpKdWNURnZkemd5WXpWNVppSjkuYWRKRjY5QnpMVGttWlp5c01YZ1Vodw==";
const MAPBOX_TOKEN = typeof window !== 'undefined' ? atob(_X_T) : Buffer.from(_X_T, 'base64').toString();

import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";

// ======== Component ========

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialLocation,
  initialAddress,
  onOpenSaved,
}: LocationPickerModalProps) {
  useMobileBackHandler(isOpen, onClose);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.touchAction = 'none';
    } else {
      // Small delay to prevent sudden transition if another modal opens or to ensure clean exit
      const timer = setTimeout(() => {
        // Fix: Use correct CSS selector escaping for Tailwind brackets
        const otherModals = document.querySelector('.fixed[class*="z-[70]"]');
        if (!otherModals) {
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.height = '';
          document.body.style.touchAction = '';
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null);
  const [mapPosition, setMapPosition] = useState<{ lng: number; lat: number } | undefined>(
    initialLocation ? { lng: initialLocation.longitude, lat: initialLocation.latitude } : undefined
  );
  const [currentAddress, setCurrentAddress] = useState(initialAddress || "");
  const [isLocating, setIsLocating] = useState(false);
  const [flyVersion, setFlyVersion] = useState(0);
  const [nearbyPlaces, setNearbyPlaces] = useState<PlaceSuggestion[]>([]);
  const [selectedNearbyIndex, setSelectedNearbyIndex] = useState<number | null>(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref to track if a suggestion was just selected
  const justSelectedSuggestionRef = useRef(false);

  const [isMapVisible, setIsMapVisible] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSuggestions([]);
      setSelectedPlace(null);
      if (initialLocation) {
        setMapPosition({ lng: initialLocation.longitude, lat: initialLocation.latitude });
      }
      if (initialAddress) {
        setCurrentAddress(initialAddress);
      }

      const timer = setTimeout(() => setIsMapVisible(true), 600);
      return () => clearTimeout(timer);
    } else {
      setIsMapVisible(false);
    }
  }, [isOpen, initialLocation, initialAddress]);

  // Search for places using Mapbox Geocoding API
  const searchPlaces = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?country=vn&types=poi,address,place&limit=6&language=vi&access_token=${MAPBOX_TOKEN}`;

      const res = await fetch(url);
      const json = await res.json();

      const items: PlaceSuggestion[] = (json.features || []).map((f: { id: string; text: string; place_name: string; center: [number, number] }) => ({
        id: f.id,
        text: f.text,
        place_name: f.place_name,
        center: f.center,
      }));

      setSuggestions(items);
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 300);
  };

  // Handle Enter key to select first suggestion
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[0]);
    }
  };

  // Reverse geocode to get address from coordinates
  const reverseGeocode = useCallback(async (lng: number, lat: number) => {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi,address,place&limit=1&language=vi&access_token=${MAPBOX_TOKEN}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.features && json.features.length > 0) {
        return json.features[0].place_name;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }, []);

  // Handle selecting a suggestion
  const handleSelectSuggestion = (place: PlaceSuggestion) => {
    setSelectedPlace(place);
    setSearchQuery(place.text);
    setSuggestions([]);
    setCurrentAddress(place.place_name);

    const [lng, lat] = place.center;
    setMapPosition({ lng, lat });
    setFlyVersion((v) => v + 1);

    justSelectedSuggestionRef.current = true;
    setTimeout(() => {
      justSelectedSuggestionRef.current = false;
    }, 1000);
  };

  // Handle map position change (drag marker or click)
  const handleMapPositionChange = async (pos: { lng: number; lat: number }) => {
    setMapPosition(pos);

    // Only reverseGeocode if not just selected from suggestion
    if (!justSelectedSuggestionRef.current) {
      const address = await reverseGeocode(pos.lng, pos.lat);
      setCurrentAddress(address);
      setSelectedPlace(null);
    }
  };

  // Handle nearby places from map
  const handleNearbyPlacesChange = (places: PlaceSuggestion[]) => {
    setNearbyPlaces(places);
    // If no address yet and we got places, use the first one
    if (!currentAddress && places.length > 0) {
      setCurrentAddress(places[0].place_name);
    }
  };

  const handleSelectNearbyPlace = (idx: number, place: PlaceSuggestion) => {
    setSelectedNearbyIndex(idx);
    setCurrentAddress(place.place_name);
    setSelectedPlace(place);

    const [lng, lat] = place.center;
    setMapPosition({ lng, lat });
    setFlyVersion((v) => v + 1);

    justSelectedSuggestionRef.current = true;
    setTimeout(() => {
      justSelectedSuggestionRef.current = false;
    }, 1000);
  }

  // Handle locate user button
  const handleLocateUser = () => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { longitude: lng, latitude: lat } = position.coords;
        setMapPosition({ lng, lat });
        setFlyVersion((v) => v + 1);
        setIsLocating(false);

        const address = await reverseGeocode(lng, lat);
        setCurrentAddress(address);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle confirm selection
  const handleConfirm = () => {
    if (!mapPosition) return;

    // Blur active element to ensure keyboard closes (important for mobile)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    onSelectLocation({
      latitude: mapPosition.lat,
      longitude: mapPosition.lng,
      address: currentAddress,
      placeName: selectedPlace?.text || nearbyPlaces[selectedNearbyIndex || 0]?.text,
    });

    onClose();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    searchInputRef.current?.focus();
  };

  return (
    <div
      className="fixed inset-0 z-[80] overflow-hidden"
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="location-picker-presence-wrapper"
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[80]"
          >
            {/* Backdrop */}
            <motion.div
              key="location-picker-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
            />

            {/* Modal Container */}
            <div
              className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-6 z-[81] pointer-events-none"
            >
              {/* Desktop Modal Content - Original Structure */}
              <motion.div
                key="location-picker-content-desktop"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "110%" }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                  mass: 0.8
                }}
                onClick={(e) => e.stopPropagation()}
                className="hidden md:flex relative pointer-events-auto bg-[#F8F9FA] w-full max-w-full md:max-w-6xl h-screen md:h-[90vh] max-h-full md:max-h-[800px] md:rounded-[40px] shadow-2xl overflow-hidden flex-col border border-white/20 will-change-transform"
              >
                {/* Header - EXACT from code cũ */}
                <div className="bg-white px-4 md:px-8 py-4 md:py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-50 shadow-sm/50">
                  <div>
                    <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] uppercase">BẠN MUỐN GIAO ĐẾN ĐÂU?</h3>
                    <div className="text-xs md:text-sm font-medium text-gray-500 mt-1">
                      Kéo thả ghim hoặc tìm kiếm địa chỉ của bạn
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {onOpenSaved && (
                      <button
                        onClick={() => {
                          onOpenSaved();
                          onClose();
                        }}
                        className="hidden md:flex group relative items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-lime-500 text-white shadow-lg hover:bg-lime-600 active:scale-95 transition-all w-fit overflow-hidden mr-2"
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                        <div className="w-8 h-8 rounded-xl bg-white/25 flex items-center justify-center shrink-0 relative z-10 transition-colors group-hover:bg-white/40">
                          <MapPin size={16} strokeWidth={2.5} className="text-white" />
                        </div>
                        <p className="text-[14px] font-bold tracking-tight text-white relative z-10">Địa chỉ đã lưu</p>
                        <ChevronRight size={14} strokeWidth={3} className="text-white/60 group-hover:text-white transition-colors relative z-10" />
                      </button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Body Layout */}
                <div className="flex-1 overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-[60%_40%] pl-3 md:pl-8 pt-1 md:py-4 pb-0 md:pb-8 pr-3 md:pr-14 gap-2 md:gap-6">
                  {/* Left Column: Search & Map */}
                  <div className="flex flex-col flex-1 md:h-full min-h-0 space-y-2 md:space-y-5">
                    <div className="relative z-50">
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                          {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        </div>
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          onKeyDown={handleSearchKeyDown}
                          placeholder="Search address, building, street..."
                          className="w-full h-14 pl-14 pr-12 rounded-[22px] bg-slate-50 border-2 border-white focus:border-[var(--primary)]/20 focus:ring-4 focus:ring-[var(--primary)]/5 outline-none transition-all text-lg font-bold font-anton text-gray-900 placeholder:text-gray-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.06)]"
                        />
                        {searchQuery && (
                          <button
                            onClick={handleClearSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all group/close"
                          >
                            <X className="w-4 h-4 text-gray-600 group-hover/close:rotate-90 transition-transform duration-300" />
                          </button>
                        )}
                        <AnimatePresence>
                          {suggestions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.98 }}
                              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[300px] overflow-y-auto"
                            >
                              <div className="p-2 space-y-1">
                                {suggestions.map((place) => (
                                  <button
                                    key={place.id}
                                    onClick={() => handleSelectSuggestion(place)}
                                    className="w-full px-4 py-3 flex items-start gap-4 hover:bg-gray-50 rounded-[16px] transition-colors text-left group"
                                  >
                                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-lime-50 group-hover:text-lime-600 transition-colors">
                                      <MapPin className="w-4 h-4 text-gray-500 group-hover:text-lime-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-[#1A1A1A] truncate">{place.text}</div>
                                      <div className="text-xs text-gray-500 line-clamp-1">{place.place_name}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex flex-1 relative rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 bg-gray-50 items-center justify-center">
                      {isMapVisible ? (
                        <MapViewForPicker
                          pickupPos={mapPosition}
                          onPickupChange={handleMapPositionChange}
                          onPlacesChange={handleNearbyPlacesChange}
                          flyVersion={flyVersion}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-6 h-6 animate-spin text-gray-400 opacity-40" />
                          <span className="text-xs font-medium text-gray-300">Loading Map...</span>
                        </div>
                      )}
                      <button
                        onClick={handleLocateUser}
                        disabled={isLocating}
                        className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isLocating ? <Loader2 className="w-5 h-5 text-gray-600 animate-spin" /> : <LocateFixed className="w-5 h-5 text-gray-700" />}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Desktop Nearby & Selection */}
                  <div className="flex flex-col h-full min-h-0 space-y-5">
                    <div className="flex-1 min-h-0 bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col">
                      <div className="px-6 py-4 pb-0 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30 shrink-0">
                        <Store className="w-5 h-5 text-gray-400" />
                        <h4 className="font-bold text-[#1A1A1A] text-base">Địa điểm gần đây</h4>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pr-3">
                        {nearbyPlaces.length > 0 ? (
                          <div className="space-y-2">
                            {nearbyPlaces.map((p, idx) => {
                              const selected = selectedPlace?.id === p.id;
                              return (
                                <div
                                  key={p.id}
                                  onClick={() => handleSelectNearbyPlace(idx, p)}
                                  className={`relative p-4 rounded-[20px] cursor-pointer border transition-all duration-200 group ${selected ? 'bg-lime-50 border-lime-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${selected ? 'bg-lime-100 text-lime-700' : 'bg-gray-100 text-gray-500'}`}>
                                      {selected ? <Check className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className={`text-sm font-bold truncate ${selected ? 'text-[#1A1A1A]' : 'text-gray-600'}`}>{p.text}</div>
                                      <div className="text-xs text-gray-400 font-medium line-clamp-1 mt-0.5">{p.place_name}</div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
                            <Loader2 className="w-6 h-6 animate-spin opacity-50" />
                            <div className="text-xs font-medium">Đang tìm địa điểm gần đó...</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col gap-4 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-lime-50 border border-lime-100 flex items-center justify-center flex-shrink-0">
                          <Navigation className="w-5 h-5 text-lime-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ĐỊA CHỈ ĐANG CHỌN</h4>
                          <div className="font-bold text-[#1A1A1A] text-sm leading-snug line-clamp-2 mt-0.5">
                            {currentAddress || "Đang tải vị trí..."}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleConfirm}
                        disabled={!mapPosition || !currentAddress}
                        className="w-full h-12 rounded-[16px] bg-[#1A1A1A] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-black/10"
                      >
                        <Check className="w-5 h-5" />
                        Xác nhận địa điểm
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mobile Modal Content - Layered Drawers over Background Map */}
              <motion.div
                key="location-picker-content-mobile"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "110%" }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                  mass: 0.8
                }}
                className="md:hidden relative pointer-events-auto w-full h-full bg-white overflow-hidden flex flex-col"
              >
                {/* Background Map - Full Screen with loading state exactly from code cũ */}
                <div className="absolute inset-0 z-0">
                  {isMapVisible ? (
                    <MapViewForPicker
                      pickupPos={mapPosition}
                      onPickupChange={handleMapPositionChange}
                      onPlacesChange={handleNearbyPlacesChange}
                      flyVersion={flyVersion}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400 opacity-40" />
                        <span className="text-[10px] font-medium text-gray-300">Loading Map...</span>
                      </div>
                    </div>
                  )}
                  {/* Map Controls */}
                  <div className="absolute bottom-[240px] right-4">
                    <button
                      onClick={handleLocateUser}
                      disabled={isLocating}
                      className="w-12 h-12 rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl flex items-center justify-center active:scale-90 transition-transform disabled:opacity-70"
                    >
                      {isLocating ? <Loader2 className="w-5 h-5 text-gray-600 animate-spin" /> : <LocateFixed className="w-5 h-5 text-gray-700" />}
                    </button>
                  </div>
                </div>

                {/* Top Drawer - Header & Original Search */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute top-0 inset-x-0 z-20"
                >
                  <div className="bg-[#F7F7F7] rounded-b-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex flex-col">
                    {/* Header */}
                    <div className="px-3 pt-3 pb-0 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-anton font-bold text-[#1A1A1A] uppercase">BẠN MUỐN GIAO ĐẾN ĐÂU?</h3>
                        <div className="text-[12px] font-medium text-gray-400 mt-0.5">
                          Kéo thả ghim hoặc tìm kiếm địa chỉ của bạn
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-90 transition-transform"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Search Bar - Taking properties from "code cũ" */}
                    <div className="p-3 px-2 pb-2 relative">
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                          {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        </div>
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          onKeyDown={handleSearchKeyDown}
                          placeholder="Search address, building, street..."
                          className="w-full h-14 pl-14 pr-12 rounded-[22px] bg-slate-50 border-2 border-white focus:border-[var(--primary)]/20 focus:ring-4 focus:ring-[var(--primary)]/5 outline-none transition-all text-lg font-bold font-anton text-gray-900 placeholder:text-gray-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.06)]"
                        />
                        {searchQuery && (
                          <button
                            onClick={handleClearSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all group/close"
                          >
                            <X className="w-4 h-4 text-gray-600 group-hover/close:rotate-90 transition-transform duration-300" />
                          </button>
                        )}
                        <AnimatePresence>
                          {suggestions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.98 }}
                              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[30px] shadow-2xl border border-gray-100 overflow-hidden z-20 max-h-[30vh] overflow-y-auto"
                            >
                              <div className="p-1.5 space-y-0">
                                {suggestions.map((place) => (
                                  <button
                                    key={place.id}
                                    onClick={() => handleSelectSuggestion(place)}
                                    className="w-full px-3 py-2 flex items-start gap-3 hover:bg-gray-50 rounded-[16px] transition-colors text-left"
                                  >
                                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-lime-50 group-hover:text-lime-600 transition-colors">
                                      <MapPin className="w-4 h-4 text-gray-500 group-hover:text-lime-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-[#1A1A1A] truncate">{place.text}</div>
                                      <div className="text-xs text-gray-500 line-clamp-1">{place.place_name}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Drawer - EXACT 100% Mobile Footer from code cũ */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute bottom-0 left-0 right-0 z-20"
                >
                  <div className="bg-white/70 backdrop-blur-sm rounded-t-[36px] p-3 pb-0 flex flex-col gap-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    <button
                      onClick={() => {
                        onOpenSaved?.();
                      }}
                      className="flex items-center justify-center gap-1.5 px-2 pb-1 group active:opacity-60 transition-opacity"
                    >
                      <span className="text-[13px] font-bold text-lime-600 tracking-tight border-b border-dotted border-lime-600 pb-px">
                        Dùng địa chỉ đã lưu
                      </span>
                      <ChevronRight size={14} className="text-lime-600 mb-[-1px]" strokeWidth={2.8} />
                    </button>

                    <div className="flex items-center gap-3 rounded-[20px]">
                      <div className="w-9 h-9 rounded-xl bg-lime-50 border border-lime-100 flex items-center justify-center flex-shrink-0">
                        <Navigation className="w-4 h-4 text-lime-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-[#1A1A1A] text-[13px] leading-tight line-clamp-2">
                          {currentAddress || "Đang tải vị trí..."}
                        </div>
                      </div>
                    </div>

                    <div className="pb-2">
                      <button
                        onClick={handleConfirm}
                        disabled={!mapPosition || !currentAddress}
                        className="w-full h-12 rounded-[20px] bg-[#1A1A1A] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        Xác nhận địa điểm
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
