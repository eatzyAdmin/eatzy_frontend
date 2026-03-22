"use client";

import { AnimatePresence, motion } from "@repo/ui/motion";
import { X, SlidersHorizontal, Flame, Star, MapPin, Sparkles, Tag, Check, List, Banknote } from "@repo/ui/icons";
import { useState, useRef, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PremiumPriceRangeFilter } from "@repo/ui";
import { useRestaurantTypes } from "@/features/restaurant/hooks/useRestaurantTypes";
import { sileo } from "@/components/DynamicIslandToast";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  layoutId: string;
  filters: {
    minPrice: number;
    maxPrice: number;
    sort: string;
    category: string | null;
  };
  onApply: (filters: {
    minPrice: number;
    maxPrice: number;
    sort: string;
    category: string | null;
  }) => void;
}

const MIN_PRICE = 0;
const MAX_PRICE = 500000; // 500k for food app
const SORT_OPTIONS = [
  { id: 'recommended', label: 'Đề xuất', icon: Sparkles },
  { id: 'cheapest', label: 'Giá rẻ nhất', icon: Tag },
  { id: 'bestseller', label: 'Bán chạy', icon: Flame },
  { id: 'nearest', label: 'Gần nhất', icon: MapPin },
  { id: 'rating', label: 'Đánh giá tốt', icon: Star },
];

const HISTOGRAM_DATA = [10, 25, 15, 30, 45, 60, 80, 50, 40, 70, 65, 55, 45, 35, 25, 15, 10, 20, 30, 40, 50, 45, 35, 25, 15];

export default function FilterModal({ open, onClose, layoutId, filters, onApply }: FilterModalProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([filters.minPrice || 0, filters.maxPrice || MAX_PRICE]);
  const [sort, setSort] = useState(filters.sort || 'recommended');
  const [category, setCategory] = useState<string | null>(filters.category);
  const isMobile = useIsMobile();

  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<'min' | 'max' | null>(null);

  // Fetch categories using shared hook
  const { data: categoriesData } = useRestaurantTypes();

  const CATEGORIES = categoriesData || [];

  useEffect(() => {
    if (open) {
      setPriceRange([filters.minPrice || 0, filters.maxPrice || MAX_PRICE]);
      setSort(filters.sort || 'recommended');
      setCategory(filters.category);
    }
  }, [open, filters]);

  const handlePriceInputChange = (index: 0 | 1, value: string) => {
    const numVal = parseInt(value, 10);
    if (isNaN(numVal)) return;

    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = numVal;
      if (index === 0 && numVal > newRange[1]) newRange[1] = numVal;
      if (index === 1 && numVal < newRange[0]) newRange[0] = numVal;
      return newRange;
    });
  };

  const getPercentage = (value: number) => {
    return Math.min(100, Math.max(0, ((value - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100));
  };

  const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
    isDragging.current = type;
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const value = Math.round(MIN_PRICE + (percent / 100) * (MAX_PRICE - MIN_PRICE));

    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      if (isDragging.current === 'min') {
        newRange[0] = Math.min(value, prev[1]);
      } else {
        newRange[1] = Math.max(value, prev[0]);
      }
      return newRange;
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = null;
  }, []);

  useEffect(() => {
    if (open) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [open, handleMouseMove, handleMouseUp]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <div className={`fixed inset-0 z-[70] flex pointer-events-none ${isMobile ? 'items-end' : 'items-center justify-center p-4'}`}>
            <motion.div
              layoutId={isMobile ? undefined : layoutId}
              initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.9 }}
              animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1 }}
              exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.9 }}
              className={`bg-white w-full max-h-[92vh] pointer-events-auto flex flex-col shadow-2xl ${isMobile
                ? 'rounded-t-[32px]'
                : 'max-w-xl rounded-[36px] overflow-hidden'
                }`}
              transition={isMobile ? {
                type: "spring",
                stiffness: 100,
                damping: 18,
              } : {
                type: "spring",
                damping: 17,
                stiffness: 100,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-xl md:text-2xl font-bold font-anton flex items-center gap-2 uppercase tracking-wide">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-6 md:space-y-10 custom-scrollbar">

                {/* Price Range */}
                <section>
                  <h3 className="text-xl font-bold mb-2">Khoảng giá</h3>
                  <p className="text-gray-500 text-sm mb-6">Giá món ăn/đồ uống (VND)</p>

                  {/* Container that overrides bounded box of PremiumPriceRangeFilter */}
                  <div className="[&>div]:bg-transparent [&>div]:p-0 [&>div]:border-none [&>div]:shadow-none">

                    <PremiumPriceRangeFilter
                      min={MIN_PRICE}
                      max={MAX_PRICE}
                      step={10000}
                      value={{ min: priceRange[0], max: priceRange[1] }}
                      onChange={(range) => setPriceRange([range.min, range.max])}
                      activeColor="lime"
                    />
                  </div>
                </section>

                {/* Sort Options */}
                <section>
                  <h3 className="text-xl font-bold mb-6">Sắp xếp theo</h3>

                  <div className="grid grid-cols-2 gap-1 md:gap-3">
                    {SORT_OPTIONS.map(opt => {
                      const Icon = opt.icon;
                      const active = sort === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSort(opt.id)}
                          className={`
                                relative w-full text-left p-2 md:p-2.5 rounded-[20px] md:rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-2 md:gap-4
                                ${active
                              ? "bg-lime-50 border-lime-100 shadow-sm"
                              : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50/30"
                            }
                              `}
                        >
                          {/* Icon Box */}
                          <div className={`
                                w-8 h-8 md:w-11 md:h-11 rounded-[12px] md:rounded-[18px] flex items-center justify-center flex-shrink-0 transition-all duration-300
                                ${active
                              ? 'bg-lime-200 text-lime-700'
                              : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                            }
                              `}>
                            <Icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                          </div>

                          {/* Label */}
                          <span className={`flex-1 text-[14px] md:text-[15px] leading-tight font-bold tracking-tight transition-all whitespace-nowrap ${active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                            {opt.label}
                          </span>

                          {/* Checkmark Circle at the end */}
                          <div className={`
                                w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                                ${active
                              ? "bg-lime-500 text-white scale-100"
                              : "bg-gray-100 text-transparent scale-90"
                            }
                              `}>
                            <Check className={`w-3 h-3 md:w-4 md:h-4 ${active ? "opacity-100" : "opacity-0"}`} strokeWidth={4} />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </section>

                {/* Categories */}
                <section>
                  <h3 className="text-xl font-bold mb-4">Danh mục món ăn</h3>

                  <div className="flex flex-wrap gap-2.5">
                    {CATEGORIES.map(cat => {
                      const active = category === String(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setCategory(active ? null : String(cat.id))}
                          className={`
                            px-5 py-2.5 rounded-2xl text-[14px] font-bold transition-all border duration-300
                            ${active
                              ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-[0_8px_20px_rgba(132,204,22,0.3)] shadow-[var(--primary)]/20 -translate-y-0.5'
                              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                            }
                          `}
                        >
                          {cat.name}
                        </button>
                      )
                    })}
                  </div>
                </section>

              </div>

              <div className="p-4 md:p-6 border-t border-gray-100 bg-white flex items-center justify-between">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const isDefault = priceRange[0] === 0 &&
                      priceRange[1] === MAX_PRICE &&
                      sort === 'recommended' &&
                      category === null;
                    if (isDefault) {
                      sileo.info({ title: 'Bộ lọc mặc định', description: 'Bộ lọc hiện đã ở trạng thái ban đầu.' });
                    } else {
                      setPriceRange([0, MAX_PRICE]);
                      setSort('recommended');
                      setCategory(null);
                    }
                  }}
                  className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Xóa bộ lọc
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const isChanged = priceRange[0] !== (filters.minPrice || 0) ||
                      priceRange[1] !== (filters.maxPrice || MAX_PRICE) ||
                      sort !== (filters.sort || 'recommended') ||
                      category !== filters.category;
                    if (!isChanged) {
                      sileo.info({ title: 'Bộ lọc không có gì thay đổi', description: 'Các tiêu chí lọc vẫn đang được giữ nguyên.' });
                      onClose();
                    } else {
                      onApply({ minPrice: priceRange[0], maxPrice: priceRange[1], sort, category });
                    }
                  }}
                  className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-2xl hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/30"
                >
                  Áp dụng
                </motion.button>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
