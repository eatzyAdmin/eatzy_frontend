"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ArrowLeft, Heart, Search, X, Store, CheckCircle2, Compass } from "@repo/ui/icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLoading, RestaurantCardShimmer } from "@repo/ui";
import type { Restaurant, FavoriteResponse, RestaurantStatus } from "@repo/types";
import FavoriteRestaurantCard from "@/features/favorites/components/FavoriteRestaurantCard";
import { useBottomNav } from "@/features/navigation/context/BottomNavContext";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { PullToRefresh } from "@repo/ui";

export default function FavoritesPage() {
  const router = useRouter();
  const { hide, show } = useLoading();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [actualSearchQuery, setActualSearchQuery] = useState("");
  const { favorites, isLoading: isFavoritesLoading, toggleFavorite, isRestaurantMutating, refresh } = useFavorites();

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
      status: (f.restaurant.status as RestaurantStatus) || 'OPEN',
      categories: f.restaurant.restaurantTypes?.map(t => ({ id: String(t.id), name: t.name })) || [],
    }));
  }, [favorites]);

  // Filter by search query
  const filteredRestaurants = useMemo(() => {
    let result = favoriteRestaurants;
    if (actualSearchQuery) {
      const query = actualSearchQuery.toLowerCase();
      result = favoriteRestaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.description?.toLowerCase().includes(query)
      );
    }

    // Sort closed to the end
    return [...result].sort((a, b) => {
      const isAClosed = a.status !== 'OPEN';
      const isBClosed = b.status !== 'OPEN';
      if (isAClosed === isBClosed) return 0;
      return isAClosed ? 1 : -1;
    });
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
      <PullToRefresh
        ref={scrollContainerRef}
        onRefresh={refresh}
        className="flex-1 no-scrollbar"
        pullText="Kéo để cập nhật yêu thích"
        releaseText="Thả tay để cập nhật"
        refreshingText="Đang cập nhật..."
      >
        <div className="max-w-[1400px] mx-auto px-3 md:px-8">
          {/* Page Title & Back Button (Scrollable) */}
          <div className="flex items-center gap-4 py-3 pb-0 md:pt-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.back()}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center group flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
            </motion.button>
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
            className={`sticky z-40 bg-[#F7F7F7]/95 backdrop-blur-md -mx-4 px-4 md:-mx-8 md:px-8 py-4 mb-2 md:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-300 ease-in-out [mask-image:linear-gradient(to_bottom,black_90%,transparent)] ${isTopHeaderVisible ? 'top-0 md:top-[80px]' : 'top-0 border-b border-gray-200/50 shadow-sm'
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
                    {filteredRestaurants.map((restaurant, index) => {
                      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
                      return (
                        <motion.div
                          key={restaurant.id}
                          initial={isDesktop ? { opacity: 0, y: 20 } : false}
                          animate={isDesktop ? { opacity: 1, y: 0 } : false}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={isDesktop ? { duration: 0.3, delay: index * 0.05 } : { duration: 0 }}
                          layout
                        >
                          <FavoriteRestaurantCard
                            restaurant={restaurant}
                            onClick={() => handleRestaurantClick(restaurant)}
                            onRemove={() => toggleFavorite(restaurant.id, restaurant.name)}
                            isLoading={isRestaurantMutating(restaurant.id)}
                          />
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>
            ) : favoriteRestaurants.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No favorites yet"
                description="Start adding restaurants to your favorites by clicking the heart icon"
                buttonText="Explore Restaurants"
                buttonIcon={Compass}
                onButtonClick={() => router.push('/home?recommend=true')}
                className="py-20"
              />
            ) : (
              <EmptyState
                icon={Store}
                title="No matches found"
                description="Try searching with different keywords"
                className="py-20"
              />
            )}

            {!isFavoritesLoading && filteredRestaurants.length >= 5 && (
              <div className="py-12 flex items-center justify-center gap-4 opacity-30">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent w-24" />
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gray-400" />
                  <span className="text-[14px] font-bold text-gray-400 uppercase font-anton tracking-wider">End of list</span>
                </div>
                <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent w-24" />
              </div>
            )}
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
}
