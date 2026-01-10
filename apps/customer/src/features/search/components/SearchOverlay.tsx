"use client";
import { AnimatePresence, motion } from "@repo/ui/motion";
import { Search, X, SlidersHorizontal } from "@repo/ui/icons";
import { useState, useEffect, KeyboardEvent } from "react";
import FilterModal from "./FilterModal";

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
}



const quickSearchTags = ["Cơm", "Phở/Bún", "Trà sữa", "Cà phê", "Ăn vặt", "Healthy"];

export default function SearchOverlay({
  open,
  onClose,
  onSearch,
  isSearchMode = false,
  isSearchBarCompact = false,
  isSearching = false,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: 0,
    maxPrice: 500000,
    sort: 'recommended',
    category: null
  });

  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query.trim(), filters);
    }
  };

  const handleApplyFilter = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setFilterOpen(false);
    if (query.trim() && onSearch) {
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
    if (!open) {
      setQuery("");
    }
  }, [open]);

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
              <div className="relative flex items-center gap-3 px-5 h-16 md:h-20 text-lg md:text-xl rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl overflow-hidden">
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
              className="fixed inset-x-0 top-[28vh] md:top-[32vh] flex flex-wrap gap-2 md:gap-3 justify-center z-[70] max-w-full md:max-w-2xl px-4 mx-auto"
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
          <motion.div
            layoutId="search-bar"
            initial={{ scale: 0.85, y: 0 }}
            animate={{
              scale: 0.85,
              y: isSearchBarCompact ? -100 : 0,
            }}
            exit={{ scale: 1, y: 0 }}
            transition={{
              duration: 0.4,
              spring: {
                damping: 18,
                stiffness: 150,
              }
            }}
            className="fixed z-[50] left-4 right-4 md:left-48 md:right-48 top-4 flex items-center justify-center gap-2 md:gap-3"
          >
            <div className="relative flex items-center gap-2 md:gap-3 px-3 md:px-5 h-14 md:h-20 text-base md:text-xl rounded-full bg-white shadow-2xl border border-gray-200 overflow-hidden flex-1 max-w-3xl">
              {isSearching && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                />
              )}
              <Search className="w-5 h-5 md:w-8 md:h-8 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tìm món, nhà hàng..."
                className="flex-1 bg-transparent text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none min-w-0"
              />
              <button
                onClick={() => handleSearch()}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:bg-[var(--primary)]/90 transition-colors flex-shrink-0"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>
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
                  className="h-14 md:h-20 px-4 md:px-8 bg-white rounded-[30px] shadow-2xl border border-gray-100 text-[var(--primary)] font-bold text-base md:text-xl hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="hidden md:inline">Filter</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {filterOpen && (
          <FilterModal
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            layoutId="filter-modal"
            filters={filters}
            onApply={handleApplyFilter}
          />
        )}
      </AnimatePresence>
    </>
  );
}