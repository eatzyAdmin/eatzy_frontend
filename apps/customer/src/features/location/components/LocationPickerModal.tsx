"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, MapPin, Search, LocateFixed, Navigation, Check, Loader2, Hand, Store } from "@repo/ui/icons";
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
}

// ======== Constants ========

const MAPBOX_TOKEN = "pk.eyJ1Ijoibmdob2FuZ2hpZW4iLCJhIjoiY21pZG04cmNxMDg3YzJucTFvdzgyYzV5ZiJ9.adJF69BzLTkmZZysMXgUhw";

// ======== Component ========

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialLocation,
  initialAddress,
}: LocationPickerModalProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
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
    // Auto select first nearby place if we aren't explicitly searching
    if (places.length > 0 && !justSelectedSuggestionRef.current) {
      // Optional: logic to sync selected index
      // setSelectedNearbyIndex(0);
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

        const address = await reverseGeocode(lng, lat);
        setCurrentAddress(address);
        setIsLocating(false);
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

    onSelectLocation({
      latitude: mapPosition.lat,
      longitude: mapPosition.lng,
      address: currentAddress,
      placeName: selectedPlace?.text || nearbyPlaces[selectedNearbyIndex || 0]?.text,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200]"
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <div
              onClick={onClose}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#F8F9FA] w-full max-w-full md:max-w-6xl h-[100vh] md:h-[90vh] max-h-full md:max-h-[800px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-white/20"
            >
              {/* Header */}
              <div className="bg-white px-4 md:px-8 py-4 md:py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm/50">
                <div>
                  <h3 className="text-2xl font-anton font-bold text-[#1A1A1A]">BAN MUỐN GIAO ĐẾN ĐÂU?</h3>
                  <div className="text-sm font-medium text-gray-500 mt-1">
                    Kéo thả ghim hoặc tìm kiếm địa chỉ của bạn
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Layout */}
              <div className="flex-1 overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-[60%_40%] pl-4 md:pl-8 py-4 md:pb-8 pr-4 md:pr-14 gap-4 md:gap-6">

                {/* Left Column: Search & Map */}
                <div className="flex flex-col h-full min-h-0 space-y-5">
                  {/* Search Bar */}
                  <div className="relative z-20">
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                        {isSearching ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Search className="w-5 h-5" />
                        )}
                      </div>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Tìm kiếm địa điểm, tòa nhà, đường..."
                        className="w-full h-14 pl-14 pr-4 rounded-[24px] bg-white border border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10 outline-none transition-all text-[#1A1A1A] font-medium placeholder:text-gray-400 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                      />
                      {/* Suggestions Dropdown */}
                      <AnimatePresence>
                        {suggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden z-30 max-h-[300px] overflow-y-auto"
                          >
                            <div className="p-2 space-y-1">
                              {suggestions.map((place) => (
                                <button
                                  key={place.id}
                                  onClick={() => handleSelectSuggestion(place)}
                                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 rounded-[16px] transition-colors text-left group"
                                >
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-lime-50 group-hover:text-lime-600 transition-colors">
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

                  {/* Map */}
                  <div className="w-full h-64 md:h-auto md:flex-1 relative rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 bg-gray-50">
                    <MapViewForPicker
                      pickupPos={mapPosition}
                      onPickupChange={handleMapPositionChange}
                      onPlacesChange={handleNearbyPlacesChange}
                      flyVersion={flyVersion}
                    />

                    {/* Locate Button */}
                    <button
                      onClick={handleLocateUser}
                      disabled={isLocating}
                      className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 z-10"
                    >
                      {isLocating ? (
                        <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                      ) : (
                        <LocateFixed className="w-5 h-5 text-gray-700" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Column: Nearby Places & Confirm (Swapped) */}
                <div className="flex flex-col h-full min-h-0 space-y-5">
                  {/* Nearby Places List (Now First) */}
                  <div className="flex-1 min-h-[250px] md:min-h-0 bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col order-1 md:order-none">
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
                              <motion.div
                                key={p.id}
                                layout
                                onClick={() => handleSelectNearbyPlace(idx, p)}
                                className={`
                                                    relative p-4 rounded-[20px] cursor-pointer border transition-all duration-200 group
                                                    ${selected
                                    ? 'bg-lime-50 border-lime-200 shadow-sm'
                                    : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                  }
                                                `}
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
                              </motion.div>
                            )
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

                  {/* Current Selection Card (Now Second) */}
                  <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col gap-4 shrink-0 order-2 md:order-none">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-lime-50 border border-lime-100 flex items-center justify-center flex-shrink-0">
                        <Navigation className="w-5 h-5 text-lime-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">ĐỊA CHỈ ĐANG CHỌN</h4>
                        <div className="font-bold text-[#1A1A1A] text-sm leading-snug line-clamp-2 mt-0.5">
                          {currentAddress || "Đang tải vị trí..."}
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full" />

                    <button
                      onClick={handleConfirm}
                      disabled={!mapPosition || !currentAddress}
                      className="w-full h-12 rounded-[16px] bg-[#1A1A1A] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
                    >
                      <Check className="w-5 h-5" />
                      Xác nhận địa điểm
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
