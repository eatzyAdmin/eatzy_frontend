"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ArrowLeft, Heart, Search, X, Store } from "@repo/ui/icons";
import { useLoading, useNotification, RestaurantCardShimmer } from "@repo/ui";
import type { Restaurant } from "@repo/types";
import { getFavoriteIds } from "@/features/favorites/data/mockFavorites";
import { mockSearchRestaurants } from "@/features/search/data/mockSearchData";
import FavoriteRestaurantCard from "@/features/favorites/components/FavoriteRestaurantCard";

export default function FavoritesPage() {
  const router = useRouter();
  const { hide, show } = useLoading();
  const { showNotification } = useNotification();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [actualSearchQuery, setActualSearchQuery] = useState("");
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [hide]);

  // Get favorite restaurants
  const favoriteRestaurants = useMemo(() => {
    const favoriteIds = getFavoriteIds();
    return mockSearchRestaurants.filter((restaurant) =>
      favoriteIds.includes(restaurant.id) && !removedIds.includes(restaurant.id)
    );
  }, [removedIds]);

  // Filter by search query
  const filteredRestaurants = useMemo(() => {
    if (!actualSearchQuery) return favoriteRestaurants;

    const query = actualSearchQuery.toLowerCase();
    return favoriteRestaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.description?.toLowerCase().includes(query) ||
      restaurant.categories.some((cat) => cat.name.toLowerCase().includes(query))
    );
  }, [favoriteRestaurants, actualSearchQuery]);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    show("Đang tải thông tin quán ăn...");
    router.push(`/restaurants/${restaurant.slug}`);
  };

  const handleRemoveFavorite = (id: string, name: string) => {
    setRemovedIds((prev) => [...prev, id]);
    showNotification({
      type: "success",
      message: "Đã xóa khỏi danh sách yêu thích",
      format: `Đã xóa ${name} khỏi danh sách yêu thích của bạn`,
    });
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActualSearchQuery(searchInputValue);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1400);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] pt-0 md:pt-20">
      {/* Header */}
      <div className="sticky top-0 md:top-20 z-40 bg-[#F7F7F7] border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 pt-16 py-4 md:pt-2 md:py-6 md:px-8">
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
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-4 py-4 md:px-8 md:py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RestaurantCardShimmer cardCount={6} />
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      onRemove={() => handleRemoveFavorite(restaurant.id, restaurant.name)}
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
