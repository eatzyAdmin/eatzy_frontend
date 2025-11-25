'use client';

import { motion, AnimatePresence } from '@repo/ui/motion';
import CategoryScroller from '@/features/home/components/CategoryScroller';
import dynamic from 'next/dynamic';
const RestaurantSlider = dynamic(() => import('@/features/home/components/RestaurantSlider'), { ssr: false });
import BackgroundTransition from '@/features/home/components/BackgroundTransition';
import { useHomePage } from '@/features/home/hooks/useHomePage';
import { useState, useEffect } from 'react';
import { List } from '@repo/ui/icons';
import { useSearch } from '@/features/search/hooks/useSearch';
import SearchResults from '@/features/search/components/SearchResults';
declare global {
  interface Window {
    clearHomeSearch?: () => void;
  }
}

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
  } = useHomePage();
  
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const {
    searchResults,
    isSearching,
    isSearchMode,
    clearSearch,
    searchQuery,
  } = useSearch();

  // Expose clearSearch to window for menu navigation
  useEffect(() => {
    window.clearHomeSearch = clearSearch;
    return () => {
      delete window.clearHomeSearch;
    };
  }, [clearSearch]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Animated Food Background - slides up when in search mode */}
      <AnimatePresence>
        {!isSearchMode && (
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
              slideUp={isSearchMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Categories Button - hides when in search mode */}
      <AnimatePresence>
        {!isSearchMode && (
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
            className="fixed z-50 right-6 top-[18vh] flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
          >
            <List className="w-5 h-5" />
            <span className="text-sm font-medium">All categories</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Content Layout - hides when in search mode */}
      <AnimatePresence>
        {!isSearchMode && (
          <motion.main
            initial={{ opacity: 1, y: 0 }}
            exit={{ y: '100vh', transition: { delay: 0.15, duration: 0.8, ease: [0.33, 1, 0.68, 1] } }}
            className="relative z-10 flex flex-col h-screen pt-20 overflow-hidden"
          >
            {/* Category Scroller Section */}
            <motion.section
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex items-center justify-center"
              style={{ height: "42vh" }}
            >
              <CategoryScroller
                categories={categories}
                activeIndex={activeCategoryIndex}
                onCategoryChange={handleCategoryChange}
              />
            </motion.section>

            {/* Restaurant Slider Section */}
            <motion.section
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex-1 flex items-start justify-center"
            >
              <AnimatePresence mode="wait">
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
                  />
                </motion.div>
              </AnimatePresence>
            </motion.section>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Search Results - always render when in search mode, pre-rendered behind */}
      <AnimatePresence>
        {isSearchMode && (
          <SearchResults 
            results={searchResults} 
            searchQuery={searchQuery}
            isLoading={isSearching}
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
              className="fixed z-50 right-6 top-[18vh] w-[380px] max-w-[92vw] rounded-2xl bg-white/8 backdrop-blur-xl border border-white/20 overflow-hidden"
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
