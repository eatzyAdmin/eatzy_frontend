import { motion } from '@repo/ui/motion';
import { useEffect, useState, useRef } from 'react';
import { MagazineLayout8Shimmer } from '@repo/ui';
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
}

export default function RecommendedSection({ results, onBackToHome }: Props) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isLoading && !timerRef.current) {
          timerRef.current = setTimeout(() => setIsLoading(false), 1500);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isLoading]);

  // Handle scroll-up to return home
  useEffect(() => {
    let processing = false;
    const handleWheel = (e: WheelEvent) => {
      // If we are at the top and scrolling UP
      if (window.scrollY <= 0 && e.deltaY < -30 && onBackToHome) {
        if (processing) return;
        processing = true;
        onBackToHome();
        setTimeout(() => { processing = false; }, 1000);
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [onBackToHome]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Only trigger header hide if we have scrolled past a certain point
          // In this context, the recommended section starts after the folded home page.
          // However, to match the "Search Result" behavior "exactly", we might want the header to react
          // to scroll delta regardless of absolute position, OR only after we fully entered this view.
          // Since the user said "layout state ... updated exactly like search result page",
          // and Search Result page has sticky header logic, we'll keep it.

          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsHeaderVisible(false);
          } else if (currentScrollY < lastScrollY.current) {
            setIsHeaderVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Notify parent about scroll state - reusing the same event as SearchResults
  useEffect(() => {
    // Dispatch custom event for header visibility
    // This allows the Layout to react even though we are not technically in ?q= search mode
    // We might need to ensure Layout listens to this event even if !isSearchMode, OR we handle it via the recommended mode flag.
    window.dispatchEvent(new CustomEvent('searchHeaderVisibility', {
      detail: { visible: isHeaderVisible }
    }));
  }, [isHeaderVisible]);

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
      className="min-h-screen bg-white pt-32 pb-20 px-6 magazine-scroll"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Dining Recommendations
          </h1>
          <p className="text-xl text-gray-600">
            Curated selections <span className="font-bold text-amber-600">near you</span>
          </p>
        </motion.div>

        {/* Results */}
        <div>
          {isLoading ? (
            <>
              <MagazineLayout8Shimmer />
              <MagazineLayout8Shimmer />
            </>
          ) : (
            results.map((item) => renderLayout(item))
          )}
        </div>
      </div>
      <style jsx>{`
        .magazine-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .magazine-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 9999px; }
        .magazine-scroll { scrollbar-width: thin; }
      `}</style>
    </motion.div>
  );
}
