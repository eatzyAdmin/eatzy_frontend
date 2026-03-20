"use client";
import { AnimatePresence, motion } from "@repo/ui/motion";
import { Search, X, Filter, Home, ShoppingCart, SlidersHorizontal } from "@repo/ui/icons";
import { useState, useEffect, KeyboardEvent } from "react";
import FilterModal from "./FilterModal";
import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useCart } from "@/features/cart/hooks/useCart";
import { useRouter } from "next/navigation";

interface SearchFilters {
  minPrice: number;
  maxPrice: number;
  sort: string;
  category: string | null;
}

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSearch?: (query: string, filters?: Partial<SearchFilters>) => void;
  isSearchMode?: boolean;
  isSearchBarCompact?: boolean;
  isSearching?: boolean;
  searchQuery?: string;
  activeFilters?: SearchFilters;
}



const quickSearchTags = ["Cơm", "Phở/Bún", "Trà sữa", "Cà phê", "Ăn vặt", "Healthy"];

export default function SearchOverlay({
  open,
  onClose,
  onSearch,
  isSearchMode = false,
  isSearchBarCompact = false,
  isSearching = false,
  searchQuery = "",
  activeFilters,
}: SearchOverlayProps) {
  useMobileBackHandler(open, onClose);
  const isMobile = useIsMobile();
  const router = useRouter();
  const { totalItems } = useCart();

  const handleReturnHome = () => {
    onClose();
    if (window.clearHomeSearch) window.clearHomeSearch();
    window.dispatchEvent(new CustomEvent('recommendedModeChange', { detail: { active: false } }));
    router.replace('/home');
  };
  const [query, setQuery] = useState(searchQuery);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(activeFilters || {
    minPrice: 0,
    maxPrice: 500000,
    sort: 'recommended',
    category: null
  });

  useEffect(() => {
    if (activeFilters) {
      setFilters(activeFilters);
    }
  }, [activeFilters]);

  const handleSearch = () => {
    if ((query.trim() || filters.category) && onSearch) {
      onSearch(query.trim(), filters);
    }
  };

  const handleApplyFilter = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setFilterOpen(false);
    if (onSearch) {
      onSearch(query.trim(), newFilters);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuickSearch = (tag: string) => {
    setQuery(tag);
    if (onSearch) {
      onSearch(tag);
    }
  };

  useEffect(() => {
    if (!open && !isSearchMode) {
      setQuery("");
      setFilters({
        minPrice: 0,
        maxPrice: 500000,
        sort: 'recommended',
        category: null
      });
    }
  }, [open, isSearchMode]);

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  return (
    <>
      <AnimatePresence>
        {open && !isSearchMode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-md"
              onClick={onClose}
            />
            <motion.div
              layoutId="search-bar"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: 0.2,
                layout: {
                  type: "spring",
                  damping: 18,
                  stiffness: 150,
                },
              }}
              className="fixed z-[70] inset-x-4 md:inset-x-60 top-[16vh] md:-translate-x-1/2 max-w-full md:max-w-[92vw]"
            >
              <div className="relative flex items-center gap-3 px-5 h-16 md:h-20 text-lg md:text-xl rounded-[36px] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl overflow-hidden">
                {isSearching && (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  />
                )}
                <Search className="w-6 h-6 md:w-8 md:h-8" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tìm món, nhà hàng..."
                  className="flex-1 bg-transparent text-white font-medium placeholder:text-white/60 focus:outline-none min-w-0"
                />
                <button
                  onClick={onClose}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </motion.div>

            {/* Quick search tags */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="fixed inset-x-0 top-[28vh] md:top-[32vh] flex flex-wrap gap-2 md:gap-3 justify-center z-[70] max-w-full md:max-w-2xl px-4 mx-auto [overscroll-behavior:contain]"
            >
              {quickSearchTags.map((tag, index) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.15 + index * 0.05,
                    type: "spring",
                    stiffness: 150,
                    damping: 12,
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickSearch(tag)}
                  className="px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-colors shadow-lg"
                >
                  {tag}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Compact search bar + Filter Button */}
      <AnimatePresence>
        {isSearchMode && (
          isMobile ? (
            /* MOBILE VERSION: 100% Match Favorites Page Style */
            <>
              <motion.div
                layoutId="search-bar"
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: isSearchBarCompact ? -100 : 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                className="fixed z-[50] inset-x-0 top-0 bg-[#F7F7F7]/95 backdrop-blur-md px-2 pt-3 pb-4 flex items-center justify-between gap-3 border-b border-gray-200/50 shadow-sm [mask-image:linear-gradient(to_bottom,black_90%,transparent)]"
              >
                <div className="relative w-full flex-shrink-0 group bg-slate-50 rounded-3xl border-2 border-white focus-within:border-[var(--primary)]/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.09)] overflow-hidden transition-all">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors pointer-events-none z-20" />

                  {/* Shimmer Loading */}
                  <div className="absolute inset-0 pointer-events-none z-10">
                    {isSearching && (
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gray-400/25 to-transparent"
                      />
                    )}
                  </div>

                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search dishes, restaurants..."
                    className="w-full bg-transparent py-4 pl-14 pr-12 text-lg font-bold font-anton text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 transition-all relative z-20"
                  />

                  {query && (
                    <button
                      onClick={() => {
                        setQuery("");
                        if (onSearch) onSearch("");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-200/50 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-all z-20"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Bottom Fixed Navigation Bar (Mobile Only) */}
              <div className="fixed bottom-2 left-2 right-2 z-[50] flex justify-center pointer-events-none">
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: isSearchBarCompact ? 200 : 0, opacity: isSearchBarCompact ? 0 : 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                  className="pointer-events-auto backdrop-blur-xl text-black rounded-[32px] border border-white/40 px-3 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center gap-3"
                >
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 180, damping: 10 }}
                    onClick={() => setFilterOpen(true)}
                    className="flex flex-col items-center justify-center w-[72px] h-14 rounded-2xl text-gray-500 gap-1 outline-none"
                  >
                    <Filter className="w-[22px] h-[22px]" strokeWidth={2.5} />
                    <span className="text-[11px] font-bold">Bộ lọc</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 180, damping: 10 }}
                    onClick={handleReturnHome}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-black text-white hover:scale-105 shadow-xl mx-1 outline-none"
                  >
                    <Home className="w-6 h-6" strokeWidth={2.5} />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 180, damping: 10 }}
                    onClick={() => window.dispatchEvent(new CustomEvent('openCart'))}
                    className="flex flex-col items-center justify-center w-[72px] h-14 rounded-2xl text-gray-500 gap-1 relative outline-none"
                  >
                    <div className="relative">
                      <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={2.5} />
                      {totalItems > 0 && (
                        <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--primary)] text-[9px] leading-[16px] text-black font-bold border border-white flex items-center justify-center shadow-sm">
                          {totalItems}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold">Giỏ hàng</span>
                  </motion.button>
                </motion.div>
              </div>
            </>
          ) : (
            /* DESKTOP VERSION: Order History Style */
            <motion.div
              layoutId="search-bar"
              initial={{ scale: 0.85, y: 0 }}
              animate={{
                scale: 0.85,
                y: isSearchBarCompact ? -120 : 0,
              }}
              exit={{ scale: 1, y: 0 }}
              transition={{
                duration: 0.4,
                spring: {
                  damping: 18,
                  stiffness: 150,
                }
              }}
              className="fixed z-[50] left-48 right-48 top-1.5 flex items-center justify-center gap-3"
            >
              <div className="relative flex-1 max-w-3xl group h-20">
                {/* Search Icon + Vertical Divider */}
                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 z-20 pointer-events-none">
                  <Search className="w-6 h-6 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />
                  <div className="w-px h-5 bg-gray-200" />
                </div>

                {/* Shimmer Loading */}
                <div className="absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none z-10">
                  {isSearching && (
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gray-400/20 to-transparent"
                    />
                  )}
                </div>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search dishes, restaurants..."
                  className="w-full h-full bg-slate-50 border-2 border-white focus:border-[var(--primary)]/20 rounded-[32px] pl-16 pr-14 text-xl font-bold font-anton text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.09),0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]"
                />

                {query && (
                  <button
                    onClick={() => {
                      setQuery("");
                      if (onSearch) onSearch("");
                    }}
                    className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gray-200/50 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors z-20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {!filterOpen && (
                  <motion.button
                    layoutId="filter-modal"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: "spring",
                      damping: 18,
                      stiffness: 100,
                    }}
                    onClick={() => setFilterOpen(true)}
                    className="h-20 px-8 bg-slate-50 border-2 border-white rounded-[32px] shadow-[inset_0_0_20px_rgba(0,0,0,0.08),0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] text-gray-900 font-bold font-anton text-xl hover:bg-gray-100 transition-colors whitespace-nowrap flex items-center gap-2"
                  >
                    <Filter className="w-6 h-6 text-[var(--primary)]" strokeWidth={2.5} />
                    <span>FILTER</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )
        )}
      </AnimatePresence>

      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        layoutId="filter-modal"
        filters={filters}
        onApply={handleApplyFilter}
      />
    </>
  );
}