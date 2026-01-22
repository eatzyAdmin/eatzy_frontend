import { motion } from '@repo/ui/motion';
import { useEffect, useState, useRef } from 'react';
import { MagazineLayout8Shimmer, InfiniteScrollContainer } from '@repo/ui';
import { useInfiniteScroll } from '@repo/hooks';
import { useBottomNav } from '@/features/navigation/context/BottomNavContext';
import type { RestaurantWithMenu } from '@/features/search/hooks/useSearch';
import MagazineLayout1 from '@/features/search/components/layouts/MagazineLayout1';
import MagazineLayout2 from '@/features/search/components/layouts/MagazineLayout2';
import MagazineLayout3 from '@/features/search/components/layouts/MagazineLayout3';
import MagazineLayout4 from '@/features/search/components/layouts/MagazineLayout4';
import MagazineLayout5 from '@/features/search/components/layouts/MagazineLayout5';
import MagazineLayout6 from '@/features/search/components/layouts/MagazineLayout6';
import MagazineLayout7 from '@/features/search/components/layouts/MagazineLayout7';
import MagazineLayout8 from '@/features/search/components/layouts/MagazineLayout8';
import MagazineLayout9 from '@/features/search/components/layouts/MagazineLayout9';
import MagazineLayout10 from '@/features/search/components/layouts/MagazineLayout10';

interface Props {
  results: RestaurantWithMenu[];
  onBackToHome?: () => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export default function RecommendedSection({
  results,
  onBackToHome,
  isLoading = false,
  hasNextPage = false,
  onLoadMore,
  isLoadingMore = false
}: Props) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { setIsVisible } = useBottomNav();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal loading state with prop if needed, or just use prop
  // Here we keep the initial fake loading effect if prop isLoading is true,
  // or we can remove the fake loading and rely on real data.
  // Given we are switching to real API, let's respect the isLoading prop primarily,
  // but we can keep the "entrance animation" effect.

  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => setIsInitialLoading(false), 500);
      return () => clearTimeout(timer);
    } else {
      setIsInitialLoading(true);
    }
  }, [isLoading]);

  // Handle scroll-up to return home
  useEffect(() => {
    let accumulatedDelta = 0;
    let lastTime = Date.now();

    const handleWheel = (e: WheelEvent) => {
      const container = containerRef.current?.parentElement;
      if (!container) return;

      // If we are at the top of the SCROLLABLE CONTAINER and scrolling UP
      if (container.scrollTop <= 0 && e.deltaY < 0 && onBackToHome) {
        const now = Date.now();
        if (now - lastTime > 1000) {
          accumulatedDelta = 0;
        }
        
        accumulatedDelta += Math.abs(e.deltaY);
        lastTime = now;

        // Require a significant cumulative scroll up to go back (e.g., 200 units for more "deliberate" feel)
        if (accumulatedDelta > 200) {
          onBackToHome();
          accumulatedDelta = 0;
        }
      } else {
        accumulatedDelta = 0;
      }
    };

    const container = containerRef.current?.parentElement;
    if (container) {
      container.addEventListener('wheel', handleWheel);
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [onBackToHome]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const container = containerRef.current?.parentElement;
      if (!container) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = container.scrollTop;

          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsHeaderVisible(false);
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY.current) {
            setIsHeaderVisible(true);
            setIsVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    const container = containerRef.current?.parentElement;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Notify parent about scroll state - reusing the same event as SearchResults
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('searchHeaderVisibility', {
      detail: { visible: isHeaderVisible }
    }));
  }, [isHeaderVisible]);

  // Use reusable infinite scroll hook
  const { sentinelRef } = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoadingMore,
    isLoading,
    onLoadMore: onLoadMore || (() => { }),
    rootMargin: '400px',
    enabled: !!onLoadMore,
  });

  const renderLayout = (item: RestaurantWithMenu) => {
    const { restaurant, dishes, menuCategories, layoutType } = item;
    const props = { restaurant, dishes, menuCategories };

    switch (layoutType) {
      case 1:
        return <MagazineLayout1 key={restaurant.id} {...props} />;
      case 2:
        return <MagazineLayout2 key={restaurant.id} {...props} />;
      case 3:
        return <MagazineLayout3 key={restaurant.id} {...props} />;
      case 4:
        return <MagazineLayout4 key={restaurant.id} {...props} />;
      case 5:
        return <MagazineLayout5 key={restaurant.id} {...props} />;
      case 6:
        return <MagazineLayout6 key={restaurant.id} {...props} />;
      case 7:
        return <MagazineLayout7 key={restaurant.id} {...props} />;
      case 8:
        return <MagazineLayout8 key={restaurant.id} {...props} />;
      case 9:
        return <MagazineLayout9 key={restaurant.id} {...props} />;
      case 10:
        return <MagazineLayout10 key={restaurant.id} {...props} />;
      default:
        return <MagazineLayout1 key={restaurant.id} {...props} />;
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      className="min-h-screen bg-white pt-24 pb-20 px-4 md:pt-32 md:px-6 magazine-scroll"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-3">
            Dining Recommendations
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Curated selections <span className="font-bold text-amber-600">near you</span>
          </p>
        </motion.div>

        {/* Results with Infinite Scroll Container */}
        <InfiniteScrollContainer
          sentinelRef={sentinelRef}
          isLoading={isInitialLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasNextPage}
          isEmpty={!isLoading && results.length === 0}
          totalResults={results.length}
          ShimmerComponent={MagazineLayout8Shimmer}
          initialShimmerCount={2}
          loadMoreShimmerCount={1}
          endMessage="Bạn đã xem hết các gợi ý gần đây"
          EmptyComponent={
            <div className="py-12 text-center text-gray-500">
              Không tìm thấy nhà hàng nào quanh khu vực của bạn.
            </div>
          }
        >
          {results.map((item) => renderLayout(item))}
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
