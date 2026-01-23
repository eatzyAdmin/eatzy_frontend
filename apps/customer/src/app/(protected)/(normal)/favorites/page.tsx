"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ArrowLeft, Heart, Search, X, Store } from "@repo/ui/icons";
import { useLoading, useNotification, RestaurantCardShimmer } from "@repo/ui";
import type { Restaurant, FavoriteResponse } from "@repo/types";
import FavoriteRestaurantCard from "@/features/favorites/components/FavoriteRestaurantCard";
import { useBottomNav } from "@/features/navigation/context/BottomNavContext";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";

export default function FavoritesPage() {
  const router = useRouter();
  const { hide, show } = useLoading();
  const { showNotification } = useNotification();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [actualSearchQuery, setActualSearchQuery] = useState("");
  const { favorites, isLoading: isFavoritesLoading, toggleFavorite, isRestaurantMutating } = useFavorites();

  const { setIsVisible } = useBottomNav();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Hide global loading when page mounted
  useEffect(() => {
    hide();
  }, [hide]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';

      if (direction === 'down' && currentScrollY > 20) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [setIsVisible]);

  // Map API response to Restaurant type used by UI
  const favoriteRestaurants = useMemo(() => {
    return favorites.map((f: FavoriteResponse): Restaurant => ({
      id: String(f.restaurant.id),
      name: f.restaurant.name,
      address: f.restaurant.address,
      description: f.restaurant.description,
      rating: f.restaurant.averageRating,
      slug: f.restaurant.slug,
      imageUrl: f.restaurant.imageUrl,
      status: 'OPEN',
      categories: f.restaurant.restaurantTypes?.map(t => ({ id: String(t.id), name: t.name })) || [],
    }));
  }, [favorites]);

  // Filter by search query
  const filteredRestaurants = useMemo(() => {
    if (!actualSearchQuery) return favoriteRestaurants;

    const query = actualSearchQuery.toLowerCase();
    return favoriteRestaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.description?.toLowerCase().includes(query)
    );
  }, [favoriteRestaurants, actualSearchQuery]);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    show("Đang tải thông tin quán ăn...");
    router.push(`/restaurants/${restaurant.slug || restaurant.id}`);
  };

  const handleRemoveFavorite = (restaurantId: string) => {
    toggleFavorite(Number(restaurantId));
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActualSearchQuery(searchInputValue);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] pt-0 md:pt-20">
      {/* Header */}
      <div className="sticky top-0 md:top-20 z-40 bg-[#F7F7F7] border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 pt-4 py-4 md:pt-2 md:py-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center group flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
              </button>
              <div>
                <h1
                  className="text-[28px] md:text-[48px] font-bold leading-tight text-[#1A1A1A]"
                  style={{
                    fontStretch: "condensed",
                    letterSpacing: "-0.01em",
                    fontFamily: "var(--font-anton), var(--font-sans)",
                  }}
                >
                  FAVORITES RESTAURANT
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Your saved restaurants
                </p>
              </div>
            </div>

            {favoriteRestaurants.length > 0 && (
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search favorites... (Nhấn Enter)"
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    onKeyDown={handleSearch}
                    className="pl-10 pr-10 py-3 w-full md:w-72 rounded-2xl bg-white border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all shadow-sm"
                  />
                  {searchInputValue && (
                    <button
                      onClick={() => setSearchInputValue("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all"
                    >
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-4 py-4 md:px-8 md:py-8">
          {isFavoritesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              <RestaurantCardShimmer cardCount={6} />
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredRestaurants.map((restaurant, index) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    <FavoriteRestaurantCard
                      restaurant={restaurant}
                      onClick={() => handleRestaurantClick(restaurant)}
                      onRemove={() => handleRemoveFavorite(restaurant.id)}
                      isLoading={isRestaurantMutating(Number(restaurant.id))}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : favoriteRestaurants.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-24 h-24 rounded-3xl bg-red-50 flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Start adding restaurants to your favorites by clicking the heart icon
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/home')}
                className="px-6 py-3 bg-[var(--primary)] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Explore Restaurants
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
                <Store className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                No matches found
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                Try searching with different keywords
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
