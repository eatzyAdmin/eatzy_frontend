'use client';

import { motion, AnimatePresence } from '@repo/ui/motion';
import CategoryScroller from '@/features/home/components/CategoryScroller';
import CategoryScrollerShimmer from '@/features/home/components/CategoryScrollerShimmer';
import dynamic from 'next/dynamic';
const RestaurantSlider = dynamic(() => import('@/features/home/components/RestaurantSlider'), { ssr: false });
import BackgroundTransition from '@/features/home/components/BackgroundTransition';
import { useHomePage } from '@/features/home/hooks/useHomePage';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { List, Loader2, RefreshCcw, Store, MapPin } from '@repo/ui/icons';
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
import { useMobileBackHandler } from '@/hooks/useMobileBackHandler';

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
    isCategoriesError,
    refetchCategories,
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

  useMobileBackHandler(showRecommended, () => setShowRecommended(false));
  useMobileBackHandler(showAllCategories, () => setShowAllCategories(false));
  // Use delivery location for API calls (selected by user or GPS fallback)
  const { location: deliveryLocation, isLoading: isLocationLoading } = useDeliveryLocation();
  const locationCoords = deliveryLocation;

  const {
    restaurants: apiRestaurants,
    isLoading: isRestaurantsLoading,
    hasNextPage: recommendedHasNextPage,
    fetchNextPage: recommendedFetchNextPage,
    isFetchingNextPage: recommendedIsFetchingNextPage,
    totalCount: recommendedTotalCount,
  } = useSearchRestaurants(
    showRecommended ? {
      latitude: locationCoords.latitude,
      longitude: locationCoords.longitude,
    } : null,
    {
      enabled: showRecommended && !isLocationLoading,
    }
  );

  // Create a stable random seed for this session/mount
  const sessionSeed = useMemo(() => Math.floor(Math.random() * 1000000), []);

  const recommendedResults = useMemo(() => {
    return apiRestaurants.map((magazine, index) =>
      mapMagazineToRestaurantWithMenu(magazine, index, sessionSeed)
    );
  }, [apiRestaurants, sessionSeed]);

  // Handle global loading state (transition from Login)
  const { hide } = useLoading();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 1500);
    return () => clearTimeout(timer);
  }, [hide]);

  useEffect(() => {
    if (searchParams.get('recommend') === 'true') {
      setShowRecommended(true);
      // Optional: Clear the param after showing to avoid re-triggering on manual home clicks
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

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
      // Prevent triggering if any modal is open (tagged by layout's useEffect)
      if (document.body.classList.contains('modal-open')) return;

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

    // Listen for external reset (e.g. from logo click in layout)
    const handleExternalReset = (e: Event) => {
      const customEvent = e as CustomEvent<{ active: boolean }>;
      if (customEvent.detail.active === false) {
        setShowRecommended(false);
      }
    };
    window.addEventListener('recommendedModeChange', handleExternalReset);
    return () => window.removeEventListener('recommendedModeChange', handleExternalReset);
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
            className="fixed z-50 left-3 right-3 md:hidden top-[9vh]"
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
            className="fixed z-30 right-3 md:right-6 top-[15vh] md:top-[18vh] flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
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
            {(!isCategoriesLoading && (isCategoriesError || categories.length === 0)) ? (
              <motion.section
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[30px] bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/5 shadow-inner">
                    <Store className="w-8 h-8 md:w-10 md:h-10 text-white/30" strokeWidth={1.2} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-[#1A1A1A]">
                    <RefreshCcw className={`w-4 h-4 text-white/40 ${isCategoriesLoading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="max-w-md space-y-2 mb-8">
                  <h3 className="text-md md:text-xl font-bold md:font-extrabold text-white tracking-tight">
                    {isCategoriesError ? "Lỗi tải dữ liệu" : "Chưa có danh mục nào"}
                  </h3>
                  <p className="text-[13px] md:text-[14px] text-gray-400 font-medium leading-relaxed max-w-[280px] md:max-w-none mx-auto">
                    {isCategoriesError
                      ? "Đã có lỗi xảy ra khi tải danh mục quán ăn, vui lòng thử lại."
                      : "Trang web đang trong quá trình cập nhật danh mục mới, quay lại sau nhé!"}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => refetchCategories()}
                  disabled={isCategoriesLoading}
                  className="group relative flex items-center gap-2.5 px-8 py-3 bg-primary/60 border-2 border-white/20 backdrop-blur-sm rounded-full text-white/90 font-semibold font-anton text-lg md:text-xl uppercase shadow-lg shadow-black/10 transition-all hover:bg-white hover:text-[#1A1A1A] disabled:opacity-50"
                >
                  <RefreshCcw className={`w-4 h-4 ${isCategoriesLoading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                  Tải lại ngay
                </motion.button>
              </motion.section>
            ) : (
              <>
                {/* Category Scroller Section */}
                <motion.section
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="flex items-center justify-center h-[28vh] md:h-[42vh]"
                >
                  {isCategoriesLoading ? (
                    <CategoryScrollerShimmer />
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
                    {(isHomeRestaurantsLoading || isCategoriesLoading) ? (
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
              </>
            )}

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
            className="fixed inset-0 z-[40] overflow-y-auto bg-[#F7F7F7] magazine-scroll"
          >
            <RecommendedSection
              results={recommendedResults}
              onBackToHome={() => setShowRecommended(false)}
              isLoading={isRestaurantsLoading}
              hasNextPage={recommendedHasNextPage}
              onLoadMore={recommendedFetchNextPage}
              isLoadingMore={recommendedIsFetchingNextPage}
              totalResults={recommendedTotalCount}
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
            onShowRecommendations={() => {
              clearSearch();
              setShowRecommended(true);
            }}
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
              className="fixed z-50 right-6 top-[18vh] w-[280px] md:w-[340px] max-w-[92vw] rounded-2xl bg-white/8 backdrop-blur-xl border border-white/20 overflow-hidden"            >
              <div className="p-4 border-b border-white/10 flex items-center gap-2 text-white/90">
                <List className="w-5 h-5" />
                <span className="text-sm font-semibold">Categories</span>
              </div>
              <div className="max-h-[calc(100vh-22vh)] overflow-y-auto p-2 [overscroll-behavior:contain]">
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

