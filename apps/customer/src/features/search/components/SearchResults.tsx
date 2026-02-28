import { motion } from '@repo/ui/motion';
import { useMemo, useCallback } from 'react';
import type { RestaurantWithMenu } from '../hooks/useSearch';
import { useBottomNav } from '@/features/navigation/context/BottomNavContext';
import { MagazineLayout8Shimmer, InfiniteScrollContainer } from '@repo/ui';
import { useInfiniteScroll, useScrollVisibility } from '@repo/hooks';
import MagazineLayout1 from './layouts/MagazineLayout1';
import MagazineLayout2 from './layouts/MagazineLayout2';
import MagazineLayout3 from './layouts/MagazineLayout3';
import MagazineLayout4 from './layouts/MagazineLayout4';
import MagazineLayout5 from './layouts/MagazineLayout5';
import MagazineLayout6 from './layouts/MagazineLayout6';
import MagazineLayout7 from './layouts/MagazineLayout7';
import MagazineLayout8 from './layouts/MagazineLayout8';
import MagazineLayout9 from './layouts/MagazineLayout9';
import MagazineLayout10 from './layouts/MagazineLayout10';
import MagazineLayout11 from './layouts/MagazineLayout11';

interface Props {
  results: RestaurantWithMenu[];
  searchQuery: string;
  isLoading?: boolean;
  filters?: {
    minPrice: number;
    maxPrice: number;
    sort: string;
    category: string | null;
  };
  // Pagination props
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  totalResults?: number;
}

export default function SearchResults({
  results,
  searchQuery,
  isLoading = false,
  filters,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  totalResults,
}: Props) {
  const { setIsVisible } = useBottomNav();

  // Use reusable infinite scroll hook
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoadingMore,
    isLoading,
    onLoadMore: onLoadMore || (() => { }),
    rootMargin: '400px',
    enabled: !!onLoadMore,
  });

  // Use reusable scroll visibility hook
  useScrollVisibility({
    hideThreshold: 100,
    onVisibilityChange: (visible) => {
      setIsVisible(visible);
      // Dispatch event for other components (like header)
      window.dispatchEvent(new CustomEvent('searchHeaderVisibility', {
        detail: { visible }
      }));
    },
  });

  // Client-side filtering logic
  const filteredResults = useMemo(() => {
    return results.filter(item => {
      // Category Filter
      if (filters?.category) {
        const restCats = item.restaurant.categories || [];
        const menuCats = item.menuCategories?.map(c => c.name) || [];
        const allCats = [...restCats, ...menuCats];
        const match = allCats.some(c =>
          typeof c === 'string' && c.toLowerCase().includes(filters.category!.split("/")[0].toLowerCase())
        );
        if (!match) return false;
      }

      // Price Filter
      if (filters && (filters.minPrice > 0 || filters.maxPrice < 500000)) {
        const min = filters.minPrice || 0;
        const max = filters.maxPrice || Infinity;
        const dishes = item.dishes || [];
        if (dishes.length === 0) return true;
        const hasDishInRange = dishes.some(d => d.price >= min && d.price <= max);
        if (!hasDishInRange) return false;
      }

      return true;
    }).sort((a, b) => {
      const sortBy = filters?.sort || 'recommended';
      switch (sortBy) {
        case 'rating':
          return (b.restaurant.rating || 0) - (a.restaurant.rating || 0);
        case 'cheapest':
          const minA = a.dishes?.length ? Math.min(...a.dishes.map(d => d.price)) : 999999;
          const minB = b.dishes?.length ? Math.min(...b.dishes.map(d => d.price)) : 999999;
          return minA - minB;
        case 'bestseller':
          return (b.restaurant.totalOrders || 0) - (a.restaurant.totalOrders || 0);
        case 'nearest':
          return (a.distance || 999) - (b.distance || 999);
        default: return 0;
      }
    });
  }, [results, filters]);

  const renderLayout = useCallback((item: RestaurantWithMenu) => {
    const { restaurant, dishes, menuCategories, layoutType, distance } = item;
    const props = { restaurant, dishes, menuCategories, distance };

    switch (layoutType) {
      case 1: return <MagazineLayout1 key={restaurant.id} {...props} />;
      case 2: return <MagazineLayout2 key={restaurant.id} {...props} />;
      case 3: return <MagazineLayout3 key={restaurant.id} {...props} />;
      case 4: return <MagazineLayout4 key={restaurant.id} {...props} />;
      case 5: return <MagazineLayout5 key={restaurant.id} {...props} />;
      case 6: return <MagazineLayout6 key={restaurant.id} {...props} />;
      case 7: return <MagazineLayout7 key={restaurant.id} {...props} />;
      case 8: return <MagazineLayout8 key={restaurant.id} {...props} />;
      case 9: return <MagazineLayout9 key={restaurant.id} {...props} />;
      case 10: return <MagazineLayout10 key={restaurant.id} {...props} />;
      case 11: return <MagazineLayout11 key={restaurant.id} {...props} />;
      default: return <MagazineLayout1 key={restaurant.id} {...props} />;
    }
  }, []);

  const displayCount = totalResults || filteredResults.length;

  // Empty state component
  const EmptyState = (
    <div className="bg-[#fafafa] rounded-[40px] border border-gray-100 p-8 md:p-20 overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-black" />
            <span className="text-[10px] font-anton font-bold text-amber-600 uppercase tracking-[0.4em]">Search Advisory</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-anton font-bold text-black uppercase tracking-tighter leading-[0.85] mb-8">
            NO RESULTS<br />FOUND
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-medium italic leading-relaxed">
            We couldn&apos;t match your inquiry. <br />
            Explore our curated suggestions or refine your terms.
          </p>
        </div>
        <div className="bg-black text-white p-10 rounded-[40px] shadow-2xl transform group-hover:scale-[1.02] transition-transform">
          <div className="text-[10px] font-anton font-bold text-amber-400 uppercase tracking-[0.4em] mb-6">
            Pro Tip
          </div>
          <p className="text-lg font-medium leading-relaxed italic text-gray-300">
            Consider exploring trending cuisines or seasonal specialties for an alternative dining experience.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="min-h-screen bg-white pt-28 md:pt-32 pb-20 px-4 md:px-6 magazine-scroll"
    >
      <div className="max-w-7xl mx-auto">
        {/* Search header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 md:mb-20"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-black" />
            <span className="text-[10px] font-anton font-bold text-amber-600 uppercase tracking-[0.4em]">Dispatch Selection</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-anton font-bold text-black mb-4 uppercase tracking-tighter leading-[0.85]">
            CURATED<br />DISCOVERIES
          </h1>
          {!isLoading ? (
            <p className="text-xl md:text-2xl text-gray-500 font-medium italic">
              Found <span className="font-anton text-black not-italic px-2 bg-amber-400 rounded-lg">{displayCount}</span> venues
              matching <span className="text-black font-bold">&quot;{searchQuery}&quot;</span>
            </p>
          ) : (
            <p className="text-xl md:text-2xl text-gray-500 font-medium italic">
              Locating matches for <span className="text-black font-bold animate-pulse">&quot;{searchQuery}&quot;</span>...
            </p>
          )}
        </motion.div>

        {/* Results with Infinite Scroll Container */}
        <InfiniteScrollContainer
          sentinelRef={sentinelRef}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          isEmpty={!isLoading && filteredResults.length === 0}
          totalResults={displayCount}
          ShimmerComponent={MagazineLayout8Shimmer}
          initialShimmerCount={3}
          loadMoreShimmerCount={2}
          endMessage={`Đã hiển thị tất cả ${displayCount} kết quả`}
          EmptyComponent={EmptyState}
        >
          {filteredResults.map((item) => renderLayout(item))}
        </InfiniteScrollContainer>
      </div>

      <style jsx>{`
        .magazine-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .magazine-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 9999px; }
        .magazine-scroll { scrollbar-width: thin; }
      `}</style>
    </motion.div>
  );
}
