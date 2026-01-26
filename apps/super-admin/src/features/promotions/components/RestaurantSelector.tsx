'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Building2, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '@repo/ui';
import { useRestaurants } from '../hooks/useRestaurants';

interface RestaurantSelectorProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  onClear: () => void;
}

const RestaurantSkeleton = () => (
  <div className="animate-pulse bg-white p-6 rounded-[24px] flex items-center gap-4 border border-gray-50 shadow-sm/5">
    <div className="w-6 h-6 rounded-full bg-gray-100" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-100 rounded-md w-3/4" />
      <div className="h-2 bg-gray-100 rounded-md w-1/2" />
    </div>
  </div>
);

export default function RestaurantSelector({ selectedIds, onChange, onClear }: RestaurantSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useRestaurants(searchTerm);

  const restaurants = data?.pages.flatMap(page => page.items) || [];

  const toggleRestaurant = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(x => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors flex items-center justify-center w-6 h-6">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search restaurants by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-4 bg-[#F8F9FA] border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl py-4.5 pl-14 pr-6 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
        />
      </div>

      <div className="flex items-center justify-between mb-2 px-6">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {selectedIds.length} Selected
        </span>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClear}
            className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            Clear Selection
          </button>
        </div>
      </div>

      <div className="p-2 bg-[#F8F9FA] rounded-[40px] border border-gray-100 max-h-[350px] overflow-y-auto custom-scrollbar relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <RestaurantSkeleton key={i} />)
          ) : (
            <>
              {restaurants.map((r, index) => {
                const active = selectedIds.includes(r.id);
                return (
                  <button
                    key={`${r.id}-${index}`}
                    type="button"
                    onClick={() => toggleRestaurant(r.id)}
                    className={`
                      relative w-full text-left p-3 md:p-4 rounded-[24px] border transition-all duration-200 group
                      ${active
                        ? "bg-lime-50/60 border-lime-100 shadow-sm"
                        : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm hover:bg-gray-50/50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`
                        w-5 h-5 md:w-6 md:h-6 rounded-full border border-2 flex items-center justify-center flex-shrink-0 transition-all
                        ${active
                          ? "bg-primary border-primary text-white"
                          : "bg-transparent border-gray-200 group-hover:border-gray-300"
                        }
                      `}>
                        {active && <CheckCircle size={14} strokeWidth={3} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className={`text-[14px] md:text-[15px] font-bold truncate transition-colors ${active ? "text-primary" : "text-gray-700"}`}>
                          {r.name}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                          Partner Restaurant
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {isFetchingNextPage && (
                Array.from({ length: 4 }).map((_, i) => <RestaurantSkeleton key={`loading-${i}`} />)
              )}

              {restaurants.length === 0 && !isLoading && (
                <div className="col-span-2 py-12 text-center">
                  <Building2 size={32} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                    No restaurants found matching<br />your search term
                  </p>
                </div>
              )}

              {/* Observer Target */}
              <div ref={observerTarget} className="col-span-2 h-10 flex items-center justify-center" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
