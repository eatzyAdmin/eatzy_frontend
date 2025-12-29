"use client";

import { motion } from "@repo/ui/motion";
import { X, SlidersHorizontal, Flame, Star, MapPin, Sparkles, Tag } from "@repo/ui/icons";
import { useState, useRef, useEffect, useCallback } from "react";

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
  { id: 'bestseller', label: 'Bán chạy nhất', icon: Flame },
  { id: 'nearest', label: 'Gần nhất', icon: MapPin },
  { id: 'rating', label: 'Đánh giá tốt', icon: Star },
];

const HISTOGRAM_DATA = [10, 25, 15, 30, 45, 60, 80, 50, 40, 70, 65, 55, 45, 35, 25, 15, 10, 20, 30, 40, 50, 45, 35, 25, 15];
const CATEGORIES = ["Cơm", "Trà sữa/Cà phê", "Bún/Phở", "Tráng miệng", "Ăn vặt", "Đồ uống", "Pizza/Burger"];

export default function FilterModal({ open, onClose, layoutId, filters, onApply }: FilterModalProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([filters.minPrice || 0, filters.maxPrice || MAX_PRICE]);
  const [sort, setSort] = useState(filters.sort || 'recommended');
  const [category, setCategory] = useState<string | null>(filters.category);

  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<'min' | 'max' | null>(null);

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

  if (!open) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
      />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          layoutId={layoutId}
          className="bg-white w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]"
          transition={{
            type: "spring",
            damping: 17,
            stiffness: 100,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold flex items-center gap-2 uppercase tracking-wide">
              <SlidersHorizontal className="w-5 h-5" />
              Bộ lọc
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 space-y-10 custom-scrollbar">

            {/* Price Range */}
            <section>
              <h3 className="text-xl font-bold mb-2">Khoảng giá</h3>
              <p className="text-gray-500 text-sm mb-6">Giá món ăn/đồ uống (VND)</p>

              <div className="mb-8 select-none">
                {/* Histogram */}
                <div className="flex items-end h-24 gap-1 mb-2 px-4">
                  {HISTOGRAM_DATA.map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-pink-500/20"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                {/* Range Slider Visualization */}
                <div className="relative h-6 mb-8" ref={trackRef}>
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full -translate-y-1/2"></div>
                  <div
                    className="absolute top-1/2 h-1 bg-[var(--primary)] rounded-full -translate-y-1/2"
                    style={{
                      left: `${getPercentage(priceRange[0])}%`,
                      right: `${100 - getPercentage(priceRange[1])}%`
                    }}
                  ></div>

                  {/* Thumbs */}
                  <div
                    className="absolute top-1/2 w-8 h-8 bg-white border border-gray-200 shadow-lg rounded-full -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 flex items-center justify-center"
                    style={{ left: `${getPercentage(priceRange[0])}%` }}
                    onMouseDown={handleMouseDown('min')}
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                  <div
                    className="absolute top-1/2 w-8 h-8 bg-white border border-gray-200 shadow-lg rounded-full -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 flex items-center justify-center"
                    style={{ left: `${getPercentage(priceRange[1])}%` }}
                    onMouseDown={handleMouseDown('max')}
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                </div>

                {/* Price Inputs */}
                <div className="flex items-center justify-between gap-4">
                  {/* Min Input */}
                  <div className="border border-gray-200 rounded-2xl px-4 py-3 flex-1 flex flex-col focus-within:border-[var(--primary)] transition-colors relative">
                    <label className="text-xs text-gray-500 mb-1">Tối thiểu</label>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-1">₫</span>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceInputChange(0, e.target.value)}
                        className="w-full font-semibold text-lg outline-none text-gray-900 bg-transparent placeholder-gray-300"
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="h-[1px] w-8 bg-gray-300"></div>

                  {/* Max Input */}
                  <div className="border border-gray-200 rounded-2xl px-4 py-3 flex-1 flex flex-col focus-within:border-[var(--primary)] transition-colors relative">
                    <label className="text-xs text-gray-500 mb-1">Tối đa</label>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-1">₫</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceInputChange(1, e.target.value)}
                        className="w-full font-semibold text-lg outline-none text-gray-900 bg-transparent placeholder-gray-300"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sort Options */}
            <section>
              <h3 className="text-xl font-bold mb-6">Sắp xếp theo</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SORT_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const isActive = sort === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSort(opt.id)}
                      className={`
                        aspect-square rounded-3xl p-4 flex flex-col items-center justify-center gap-3 text-center transition-all border-2
                        ${isActive
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50'}
                      `}
                    >
                      <Icon className={`w-8 h-8 ${isActive ? 'text-[var(--primary)]' : 'text-gray-500'}`} />
                      <span className={`text-sm font-medium ${isActive ? 'text-[var(--primary)]' : 'text-gray-700'}`}>
                        {opt.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Categories */}
            <section>
              <h3 className="text-xl font-bold mb-4">Danh mục món ăn</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => {
                  const isActive = category === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(isActive ? null : cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                        ? 'bg-[var(--primary)] text-[#1A1A1A] shadow-md shadow-[var(--primary)]/20'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-white flex items-center justify-between">
            <button
              onClick={() => { setPriceRange([0, MAX_PRICE]); setSort('recommended'); setCategory(null); }}
              className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Xóa tất cả
            </button>
            <button
              onClick={() => onApply({ minPrice: priceRange[0], maxPrice: priceRange[1], sort, category })}
              className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-xl hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/30"
            >
              Áp dụng
            </button>
          </div>

        </motion.div>
      </div>
    </>
  );
}
