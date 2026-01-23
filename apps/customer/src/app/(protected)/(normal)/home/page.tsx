'use client';

import { motion, AnimatePresence } from '@repo/ui/motion';
import CategoryScroller from '@/features/home/components/CategoryScroller';
import dynamic from 'next/dynamic';
const RestaurantSlider = dynamic(() => import('@/features/home/components/RestaurantSlider'), { ssr: false });
import BackgroundTransition from '@/features/home/components/BackgroundTransition';
import { useHomePage } from '@/features/home/hooks/useHomePage';
import { useState, useEffect, useMemo } from 'react';
import { List, Loader2 } from '@repo/ui/icons';
import { useLoading } from '@repo/ui';
import { useSearch } from '@/features/search/hooks/useSearch';
import SearchResults from '@/features/search/components/SearchResults';
declare global {
  interface Window {
    clearHomeSearch?: () => void;
  }
}

import FloatingScrollTrigger from '@/features/home/components/FloatingScrollTrigger';
import RecommendedSection from '@/features/home/components/RecommendedSection';
import { useSearchRestaurants } from '@/features/search/hooks/useSearchRestaurants';
import { mapMagazineToRestaurantWithMenu } from '@/features/search/utils/mappers';
import type { RestaurantWithMenu } from '@/features/search/hooks/useSearch';
import { DeliveryLocationButton, useDeliveryLocation } from '@/features/location';

export default function HomePage() {
  const {
    categories,
    activeCategoryIndex,
    activeCategory,
    restaurantsInCategory,
    activeRestaurantIndex,
    backgroundImage,
    handleCategoryChange,
    handleRestaurantChange,
    isCategoriesLoading,
    isRestaurantsLoading: isHomeRestaurantsLoading,
    // Infinite scroll
    goToNextRestaurant,
    goToPreviousRestaurant,
    isFetchingNextPage,
    hasNextPage,
  } = useHomePage();

  const [showAllCategories, setShowAllCategories] = useState(false);

  // Recommended Section Logic (API based)
  const [showRecommended, setShowRecommended] = useState(false);

  // Use delivery location for API calls (selected by user or GPS fallback)
  const { location: deliveryLocation, isLoading: isLocationLoading } = useDeliveryLocation();
  const locationCoords = deliveryLocation;

  const {
    restaurants: apiRestaurants,
    isLoading: isRestaurantsLoading,
    hasNextPage: recommendedHasNextPage,
    fetchNextPage: recommendedFetchNextPage,
    isFetchingNextPage: recommendedIsFetchingNextPage,
  } = useSearchRestaurants(
    showRecommended ? {
      latitude: locationCoords.latitude,
      longitude: locationCoords.longitude,
    } : null,
    {
      enabled: showRecommended && !isLocationLoading,
    }
  );

  const recommendedResults = useMemo(() => {
    return apiRestaurants.map((magazine, index) =>
      mapMagazineToRestaurantWithMenu(magazine, index)
    );
  }, [apiRestaurants]);

  // Handle global loading state (transition from Login)
  const { hide } = useLoading();
  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 1500);
    return () => clearTimeout(timer);
  }, [hide]);

  const {
    searchResults,
    isSearching,
    isSearchMode,
    clearSearch,
    searchQuery,
    filters,
    // Pagination
    isLoadingMore,
    hasMore,
    loadMore,
    totalResults,
  } = useSearch();

  // Expose clearSearch to window for menu navigation
  useEffect(() => {
    window.clearHomeSearch = clearSearch;
    return () => {
      delete window.clearHomeSearch;
    };
  }, [clearSearch]);

  // Handle Scroll/Wheel Trigger
  useEffect(() => {
    if (isSearchMode || showRecommended) return;

    let processing = false;
    const handleWheel = (e: WheelEvent) => {
      if (processing) return;
      if (e.deltaY > 50) { // Significant scroll down
        processing = true;
        setShowRecommended(true);
        // Add a small cooldown or rely on component unmount/state change
        setTimeout(() => { processing = false; }, 1000);
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isSearchMode, showRecommended]);

  // Sync Layout State
  useEffect(() => {
    // Return header to visible when entering recommended mode
    window.dispatchEvent(new CustomEvent('searchHeaderVisibility', {
      detail: { visible: true }
    }));

    window.dispatchEvent(new CustomEvent('recommendedModeChange', {
      detail: { active: showRecommended }
    }));
  }, [showRecommended]);

  // Reset recommended mode if search mode starts
  useEffect(() => {
    if (isSearchMode) {
      setShowRecommended(false);
    }
  }, [isSearchMode]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Animated Food Background - slides up when in search mode OR recommended mode */}
      <AnimatePresence>
        {!isSearchMode && !showRecommended && (
          <motion.div
            initial={{ y: 0 }}
            exit={{
              y: '-100vh',
              transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 0.1 }
            }}
          >
            <BackgroundTransition
              imageUrl={backgroundImage}
              categoryName={activeCategory?.name || ""}
              slideUp={isSearchMode || showRecommended}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Delivery Location - above All Categories */}
      <AnimatePresence>
        {!isSearchMode && !showRecommended && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100vh', transition: { delay: 0.15, duration: 0.8, ease: [0.33, 1, 0.68, 1] } }}
            transition={{ duration: 0.6 }}
            className="fixed z-50 left-3 right-3 md:hidden top-[12vh]"
          >
            <DeliveryLocationButton variant="compact" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Categories Button - hides when in search mode OR recommended mode */}
      <AnimatePresence>
        {!isSearchMode && !showRecommended && (
          <motion.button
            layoutId="all-categories"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100vh', transition: { delay: 0.15, duration: 0.8, ease: [0.33, 1, 0.68, 1] } }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              duration: 0.6,
              layout: {
                type: "spring",
                damping: 16,
                stiffness: 100,
              },
            }}
            onClick={() => setShowAllCategories(true)}
            className="fixed z-50 right-3 md:right-6 top-[18vh] md:top-[18vh] flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
          >
            <List className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm font-medium">All categories</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Content Layout - hides when in search mode OR recommended mode */}
      <AnimatePresence>
        {!isSearchMode && !showRecommended && (
          <motion.main
            initial={{ opacity: 1, y: 0 }}
            exit={{ y: '100vh', transition: { delay: 0.15, duration: 0.8, ease: [0.33, 1, 0.68, 1] } }}
            className="relative z-10 flex flex-col h-screen pt-20 pb-24 overflow-hidden"
          >
            {/* Category Scroller Section */}
            <motion.section
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex items-center justify-center h-[28vh] md:h-[42vh]"
            >
              {isCategoriesLoading ? (
                <div className="flex gap-8 overflow-hidden">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-32 h-12 bg-white/10 rounded-full animate-pulse" />
                  ))}
                </div>
              ) : (
                <CategoryScroller
                  categories={categories}
                  activeIndex={activeCategoryIndex}
                  onCategoryChange={handleCategoryChange}
                />
              )}
            </motion.section>

            {/* Restaurant Slider Section */}
            <motion.section
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex-1 flex items-start justify-center min-h-[400px]"
            >
              <AnimatePresence mode="wait">
                {isHomeRestaurantsLoading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full flex flex-col items-center justify-center gap-4 py-20"
                  >
                    <div className="relative">
                      <Loader2 className="w-12 h-12 text-white/40 animate-spin" />
                      <div className="absolute inset-0 blur-sm text-white/20 animate-spin">
                        <Loader2 className="w-12 h-12" />
                      </div>
                    </div>
                    <p className="text-white/40 text-sm font-medium animate-pulse tracking-widest uppercase">
                      Finding best tastes...
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeCategory?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.08, ease: [0.33, 1, 0.68, 1] }}
                    className="w-full"
                  >
                    <RestaurantSlider
                      restaurants={restaurantsInCategory}
                      activeIndex={activeRestaurantIndex}
                      onRestaurantChange={handleRestaurantChange}
                      onNext={goToNextRestaurant}
                      onPrevious={goToPreviousRestaurant}
                      isFetchingNextPage={isFetchingNextPage}
                      hasNextPage={hasNextPage}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Scroll Trigger */}
            <FloatingScrollTrigger onClick={() => setShowRecommended(true)} />

          </motion.main>
        )}
      </AnimatePresence>

      {/* Recommended Section (appears below/replaces home) */}
      <AnimatePresence>
        {showRecommended && !isSearchMode && (
          <motion.div
            initial={{ opacity: 0, y: '100vh' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100vh' }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="fixed inset-0 z-[40] overflow-y-auto bg-white magazine-scroll"
          >
            <RecommendedSection
              results={recommendedResults}
              onBackToHome={() => setShowRecommended(false)}
              isLoading={isRestaurantsLoading}
              hasNextPage={recommendedHasNextPage}
              onLoadMore={recommendedFetchNextPage}
              isLoadingMore={recommendedIsFetchingNextPage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results - always render when in search mode, pre-rendered behind */}
      <AnimatePresence>
        {isSearchMode && (
          <SearchResults
            results={searchResults}
            searchQuery={searchQuery}
            isLoading={isSearching}
            filters={filters}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
            totalResults={totalResults}
          />
        )}
      </AnimatePresence>

      {/* All Categories Modal */}
      <AnimatePresence>
        {showAllCategories && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setShowAllCategories(false)}
            />
            <motion.div
              layoutId="all-categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 150,
                damping: 18,
              }}
              className="fixed z-50 right-6 top-[18vh] w-[280px] md:w-[340px] max-w-[92vw] rounded-2xl bg-white/8 backdrop-blur-xl border border-white/20 overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center gap-2 text-white/90">
                <List className="w-5 h-5" />
                <span className="text-sm font-semibold">Categories</span>
              </div>
              <div className="max-h-[calc(100vh-22vh)] overflow-y-auto p-2">
                <ul className="divide-y divide-white/10">
                  {categories.map((c, idx) => (
                    <li key={c.id}>
                      <button
                        className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors"
                        onClick={() => {
                          handleCategoryChange(idx);
                          setShowAllCategories(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{c.name}</span>
                          {idx === activeCategoryIndex && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                              Active
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

