"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ArrowLeft, Heart, Search, X, Store } from "@repo/ui/icons";
import { useLoading, RestaurantCardShimmer } from "@repo/ui";
import type { Restaurant, FavoriteResponse } from "@repo/types";
import FavoriteRestaurantCard from "@/features/favorites/components/FavoriteRestaurantCard";
import { useBottomNav } from "@/features/navigation/context/BottomNavContext";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";

export default function FavoritesPage() {
  const router = useRouter();
  const { hide, show } = useLoading();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [actualSearchQuery, setActualSearchQuery] = useState("");
  const { favorites, isLoading: isFavoritesLoading, toggleFavorite, isRestaurantMutating } = useFavorites();

  const { setIsVisible } = useBottomNav();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [isTopHeaderVisible, setIsTopHeaderVisible] = useState(true);

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
      const isDesktop = window.innerWidth >= 768;

      if (direction === 'down' && currentScrollY > 20) {
        setIsVisible(false);
        if (isDesktop) {
          setIsTopHeaderVisible(false);
          window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: false } }));
        }
      } else {
        setIsVisible(true);
        if (isDesktop) {
          setIsTopHeaderVisible(true);
          window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: true } }));
        }
      }
      lastScrollY.current = currentScrollY;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      // Reset header visibility when leaving page
      window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: true } }));
    };
  }, [setIsVisible]);

  // Map API response to Restaurant type used by UI
  const favoriteRestaurants = useMemo(() => {
    return favorites.map((f: FavoriteResponse): Restaurant => ({
      id: f.restaurant.id,
      name: f.restaurant.name,
      address: f.restaurant.address,
      description: f.restaurant.description,
      rating: f.restaurant.averageRating,
      averageRating: f.restaurant.averageRating,
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

  const handleRemoveFavorite = (restaurantId: number) => {
    toggleFavorite(restaurantId);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActualSearchQuery(searchInputValue);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] overflow-hidden">
      {/* Scrollable Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-3 md:px-8">
          {/* Page Title & Back Button (Scrollable) */}
          <div className="flex items-center gap-4 py-3 pb-0 md:pt-20">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center group flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
            </button>
            <div>
              <h1
                className="text-[32px] md:text-[56px] font-bold leading-tight text-[#1A1A1A]"
                style={{
                  fontStretch: "condensed",
                  letterSpacing: "-0.01em",
                  fontFamily: "var(--font-anton), var(--font-sans)",
                }}
              >
                FAVORITES RESTAURANT
              </h1>
              <p className="text-sm font-medium md:text-base text-gray-500 mt-1">
                Your saved restaurants
              </p>
            </div>
          </div>

          {/* Sticky Toolbar (Search) */}
          <div
            className={`sticky z-40 bg-[#F7F7F7]/95 backdrop-blur-md -mx-4 px-4 md:-mx-8 md:px-8 py-4 mb-2 md:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-300 ease-in-out ${isTopHeaderVisible ? 'top-0 md:top-[80px]' : 'top-0'
              }`}
          >
            <div className="flex-1 max-w-lg relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />
                <div className="w-px h-4 bg-gray-200" />
              </div>

              <input
                type="text"
                placeholder="Search favourite restaurants..."
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-slate-50 border-2 border-white focus:border-[var(--primary)]/20 rounded-3xl py-4 pl-14 pr-12 text-lg font-bold font-anton text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.09)]"
              />

              {searchInputValue && (
                <button
                  onClick={() => {
                    setSearchInputValue("");
                    setActualSearchQuery("");
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all group/close"
                >
                  <X className="w-4 h-4 text-gray-600 group-hover/close:rotate-90 transition-transform duration-300" />
                </button>
              )}
            </div>

            <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] hidden md:block">
              {filteredRestaurants.length} saved venues
            </div>
          </div>

          {/* Grid Content */}
          <div className="pb-24">
            {isFavoritesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 relative">
                <RestaurantCardShimmer cardCount={6} />
              </div>
            ) : filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 relative">
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
                        isLoading={isRestaurantMutating(restaurant.id)}
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
    </div>
  );
}
