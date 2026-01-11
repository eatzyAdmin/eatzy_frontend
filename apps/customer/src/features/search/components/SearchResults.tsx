import { motion } from '@repo/ui/motion';
import { useEffect, useState, useRef, useMemo } from 'react';
import type { RestaurantWithMenu } from '../hooks/useSearch';
import { useBottomNav } from '@/features/navigation/context/BottomNavContext';
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
}

export default function SearchResults({ results, searchQuery, isLoading = false, filters }: Props) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const { setIsVisible } = useBottomNav();
  const lastScrollY = useRef(0);

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
        if (dishes.length === 0) return true; // Keep if no dishes loaded (fallback)
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
        default: return 0;
      }
    });
  }, [results, filters]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Notify parent about scroll state
  useEffect(() => {
    // Dispatch custom event for header visibility
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: 1.0 }}
      className="min-h-screen bg-white pt-28 md:pt-32 pb-20 px-4 md:px-6 magazine-scroll"
    >
      {!isLoading && (
        <div className="max-w-7xl mx-auto">
          {/* Search header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Search Results
            </h1>
            <p className="text-base md:text-xl text-gray-600">
              Found <span className="font-bold text-amber-600">{filteredResults.length}</span> restaurant
              {filteredResults.length !== 1 ? 's' : ''} matching{' '}
              <span className="font-bold text-gray-900">&quot;{searchQuery}&quot;</span>
            </p>
          </motion.div>

          {/* Results */}
          {filteredResults.length > 0 ? (
            <div>
              {filteredResults.map((item) => renderLayout(item))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow p-6 md:p-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="col-span-1 md:col-span-2">
                  <h2 className="text-3xl md:text-5xl font-black" style={{ fontFamily: 'serif' }}>No Matches Found</h2>
                  <p className="mt-4 text-gray-600">Try different keywords or explore curated selections below.</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-xl">
                  <div className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-3">Editor&apos;s Note</div>
                  <p className="text-sm text-gray-700 leading-relaxed">Discover our trending cuisines and seasonal specials.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
      <style jsx>{`
        .magazine-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .magazine-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 9999px; }
        .magazine-scroll { scrollbar-width: thin; }
      `}</style>
    </motion.div>
  );
}

