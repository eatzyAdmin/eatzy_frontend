import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Search, Star, Sparkles, CheckCircle2, MessageSquare, Map, Tag, ChefHat, ChevronDown, Loader2, ArrowLeft, AlertCircle, ShoppingBag } from "@repo/ui/icons";
import { ImageWithFallback, ReviewItemShimmer } from "@repo/ui";
import { motion, AnimatePresence } from "@repo/ui/motion";
import type { Restaurant } from "@repo/types";
import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";
import { useRestaurantReviews } from "../hooks/useRestaurantReviews";
import { EmptyState } from "@/components/ui/EmptyState";

interface ReviewsModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewsModal = ({ restaurant, isOpen, onClose }: ReviewsModalProps) => {
  useMobileBackHandler(isOpen, onClose);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortOpen]);

  // Fetch reviews from API with filters
  const { reviews, isFetching, isError, error } = useRestaurantReviews(restaurant.name || null, {
    search: activeSearch,
    rating: selectedRating,
    sort: sortBy
  }, {
    enabled: isOpen
  });

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveSearch(searchQuery);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use restaurant.averageRating or fallback to rating
  const rating = restaurant.averageRating || restaurant.rating || 0;
  const totalReviewsCount = useMemo(() => {
    if (restaurant.reviewCount !== undefined) return restaurant.reviewCount;
    return (restaurant.fiveStarCount || 0) +
      (restaurant.fourStarCount || 0) +
      (restaurant.threeStarCount || 0) +
      (restaurant.twoStarCount || 0) +
      (restaurant.oneStarCount || 0);
  }, [restaurant]);

  const ratingDistribution = useMemo(() => {
    // If we have detailed counts from the restaurant object, use them
    if (restaurant.fiveStarCount !== undefined &&
      restaurant.fourStarCount !== undefined &&
      restaurant.threeStarCount !== undefined &&
      restaurant.twoStarCount !== undefined &&
      restaurant.oneStarCount !== undefined) {
      const total = totalReviewsCount || 1;
      return [
        { stars: 5, count: restaurant.fiveStarCount, percentage: (restaurant.fiveStarCount / total) * 100 },
        { stars: 4, count: restaurant.fourStarCount, percentage: (restaurant.fourStarCount / total) * 100 },
        { stars: 3, count: restaurant.threeStarCount, percentage: (restaurant.threeStarCount / total) * 100 },
        { stars: 2, count: restaurant.twoStarCount, percentage: (restaurant.twoStarCount / total) * 100 },
        { stars: 1, count: restaurant.oneStarCount, percentage: (restaurant.oneStarCount / total) * 100 },
      ];
    }

    return [
      { stars: 5, count: 0, percentage: 0 },
      { stars: 4, count: 0, percentage: 0 },
      { stars: 3, count: 0, percentage: 0 },
      { stars: 2, count: 0, percentage: 0 },
      { stars: 1, count: 0, percentage: 0 },
    ];
  }, [restaurant]);

  // We use reviews directly from the hook now
  const displayReviews = reviews;

  const sortOptions = [
    { value: 'relevant', label: 'Phù hợp nhất' },
    { value: 'recent', label: 'Gần đây nhất' },
    { value: 'highest', label: 'Đánh giá cao nhất' },
    { value: 'lowest', label: 'Đánh giá thấp nhất' },
  ];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full Screen Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container - Centered with max-width */}
          <div
            onClick={onClose}
            className="fixed inset-0 z-[101] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-8"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="w-full max-w-[1050px] h-[100dvh] md:h-[90vh] bg-[#F7F7F7] md:bg-white md:rounded-[36px] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Desktop Header - CurrentOrdersDrawer Style (Kept as before) */}
              <div className="hidden md:flex bg-white px-8 py-6 border-b border-gray-100 items-center justify-between shadow-sm/50 shrink-0 z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-lime-50 border border-lime-100 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-lime-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] uppercase">Restaurant Reviews</h3>
                    <div className="text-sm font-medium text-gray-500 mt-0.5">
                      {restaurant.name}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>


              {/* Two Column Layout with Independent Scrolling */}

              {/* Two Column Layout with Independent Scrolling */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* Left Column - Scrollable Stats - Hidden on Mobile */}
                <div className="hidden md:block w-[380px] flex-shrink-0 border-r border-gray-200 bg-white h-full overflow-y-auto custom-scrollbar">
                  <div className="p-6 md:p-8 space-y-8">

                    {/* Hero Rating - Premium Design - Desktop only */}
                    <div className="hidden md:block text-center bg-gray-50 rounded-[28px] p-6 border border-gray-100">
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <span className="text-3xl md:text-4xl drop-shadow-md">🏆</span>
                        <div className="text-[44px] md:text-[80px] leading-none font-anton font-bold text-[#1A1A1A] tracking-tighter drop-shadow-sm">
                          {rating > 0 ? rating.toFixed(1).replace('.', ',') : "0,0"}
                        </div>
                        <span className="text-3xl md:text-4xl drop-shadow-md">🏆</span>
                      </div>
                      {rating > 4.0 && (
                        <h3 className="text-lg md:text-xl font-anton font-bold text-[#1A1A1A] uppercase tracking-wide mb-2">Được khách yêu thích</h3>
                      )}
                      <p className="text-gray-600 text-sm leading-relaxed px-2">
                        Based on {totalReviewsCount} customer reviews.
                      </p>
                    </div>

                    {/* Rating Distribution - Improved Design - Desktop only */}
                    <div className="hidden md:block space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-anton font-bold text-[#1A1A1A] uppercase text-lg">Rating Breakdown</h4>
                        {selectedRating !== null && (
                          <button
                            onClick={() => setSelectedRating(null)}
                            className="text-[10px] md:text-xs text-[var(--primary)] font-bold hover:underline bg-lime-50 px-2 py-1 rounded-lg uppercase"
                          >
                            Clear Filter
                          </button>
                        )}
                      </div>

                      {ratingDistribution.map((item) => (
                        <div
                          key={item.stars}
                          onClick={() => setSelectedRating(selectedRating === item.stars ? null : item.stars)}
                          className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-all ${selectedRating === item.stars ? 'bg-gray-100 ring-2 ring-[var(--primary)]/20' : 'hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex items-center gap-1 w-8 justify-center">
                            <span className={`text-base font-anton ${selectedRating === item.stars ? 'text-[#1A1A1A]' : 'text-gray-500'}`}>
                              {item.stars}
                            </span>
                            <Star size={12} className={`${selectedRating === item.stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                          </div>

                          <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${selectedRating === item.stars ? 'bg-white' : 'bg-gray-100'}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className={`h-full rounded-full ${selectedRating === item.stars ? 'bg-[var(--primary)]' : 'bg-[#1A1A1A]'}`}
                            />
                          </div>

                          <span className="text-[10px] font-bold text-gray-400 w-10 text-right uppercase">{item.count} lượt</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Scrollable Reviews */}
                <div className="flex-1 overflow-y-auto px-3 md:pr-12 md:pl-8 py-0 md:py-6 relative bg-[#F7F7F7] md:bg-white no-scrollbar">
                  {/* Mobile Header - Profile Sub-header Style - Moved inside to enable blur/mask effects */}
                  <div className="md:hidden sticky top-0 z-50 bg-[#F7F7F7]/85 backdrop-blur-md py-3 mb-2 -mx-3 px-3 flex items-center justify-between shrink-0 max-md:[mask-image:linear-gradient(to_bottom,black_85%,transparent)]">
                    <div className="flex items-center gap-4 pl-1">
                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group flex-shrink-0"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
                      </motion.button>
                      <div>
                        <h1 className="text-[28px] font-bold leading-tight text-[#1A1A1A] font-anton uppercase tracking-tight">
                          REVIEWS
                        </h1>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5 line-clamp-1">
                          {restaurant.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3.5 h-9 bg-[var(--primary)] rounded-full shadow-sm flex-shrink-0">
                      <span className="text-base font-anton font-bold text-[#1A1A1A] leading-none">
                        {rating > 0 ? rating.toFixed(1).replace('.', ',') : "0,0"}
                      </span>
                      <Star className="w-4 h-4 fill-[#1A1A1A] text-[#1A1A1A]" />
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-0 px-1 md:px-0">
                    {/* Mobile Rating Filter Badges - Visible only on mobile */}
                    <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
                      <button
                        onClick={() => setSelectedRating(null)}
                        className={`flex-shrink-0 flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl text-[10px] font-anton tracking-wider transition-all border-2 ${selectedRating === null
                          ? 'bg-[var(--primary)] border-[var(--primary)] text-[#1A1A1A] shadow-md shadow-primary/10'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                          }`}
                      >
                        <span className="uppercase font-semibold">Tất cả</span>
                        <span className="opacity-40 text-[9px] leading-tight mt-0.5">{totalReviewsCount} Reviews</span>
                      </button>
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = ratingDistribution.find(d => d.stars === stars)?.count || 0;
                        return (
                          <button
                            key={stars}
                            onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
                            className={`flex-shrink-0 flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl text-[10px] font-anton tracking-wider transition-all border-2 ${selectedRating === stars
                              ? 'bg-[var(--primary)] border-[var(--primary)] text-[#1A1A1A] shadow-md shadow-primary/10'
                              : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                              }`}
                          >
                            <div className="flex items-center gap-1">
                              <span>{stars}</span>
                              <Star className={`w-2.5 h-2.5 ${selectedRating === stars ? 'fill-[#1A1A1A] text-[#1A1A1A]' : 'text-gray-400'}`} />
                            </div>
                            <span className="opacity-40 text-[9px] leading-tight mt-0.5">{count} Reviews</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      {/* Header */}
                      <div className="flex items-center justify-between pl-2 md:pl-0">
                        <h2 className="text-sm md:text-xl font-bold text-gray-900">
                          {displayReviews.length} lượt đánh giá
                        </h2>

                        <div className="relative" ref={sortRef}>
                          <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="group flex items-center gap-2 md:gap-3 px-4 py-2.5 md:px-6 md:py-4 bg-slate-50 border-2 border-white rounded-[20px] md:rounded-[24px] text-xs md:text-base font-bold hover:border-[var(--primary)]/20 transition-all text-[#1A1A1A] min-w-[140px] md:min-w-[200px] justify-between shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] focus:ring-4 focus:ring-[var(--primary)]/5"
                          >
                            <div className="flex items-center gap-2 md:gap-3">
                              <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180 text-[var(--primary)]' : ''}`} />
                              <div className="w-px h-3 md:h-4 bg-gray-200" />
                              <span className="tracking-tight">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isSortOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2, type: "spring", damping: 20, stiffness: 300 }}
                                className="absolute right-0 top-full mt-3 w-64 bg-white rounded-[28px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-white p-3 z-30 overflow-hidden"
                              >
                                {sortOptions.map(option => (
                                  <button
                                    key={option.value}
                                    onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                                    className={`w-full text-left px-5 py-4 text-sm rounded-2xl transition-all flex items-center justify-between mb-1 last:mb-0 ${sortBy === option.value
                                      ? 'text-[var(--primary)] font-bold bg-primary/10'
                                      : 'text-gray-700 hover:bg-slate-50 font-medium'
                                      }`}
                                  >
                                    <span className={sortBy === option.value ? 'font-bold px-1' : 'font-medium'}>
                                      {option.label}
                                    </span>
                                    {sortBy === option.value && <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_10px_rgba(255,190,0,0.5)]" />}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Search Bar - Matches Favorites Page Design */}
                      <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
                          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />
                        </div>

                        <input
                          type="text"
                          placeholder="Search reviews by content..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleSearchKeyDown}
                          className="w-full bg-slate-50 border-2 border-white focus:border-[var(--primary)]/20 rounded-3xl py-4 pl-14 pr-12 text-lg font-bold font-anton text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]"
                        />

                        {searchQuery && (
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setActiveSearch("");
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all group/close"
                          >
                            <X className="w-4 h-4 text-gray-600 group-hover/close:rotate-90 transition-transform duration-300" />
                          </button>
                        )}
                      </div>

                      {/* Content Section: Shimmer, Error, or List */}
                      {isFetching ? (
                        <div className="pt-2 px-2 md:px-0">
                          <ReviewItemShimmer count={3} />
                        </div>
                      ) : isError ? (
                        <EmptyState
                          icon={AlertCircle}
                          title="Đã có lỗi xảy ra"
                          description={error?.message || "Không thể tải danh sách đánh giá từ máy chủ."}
                          className="py-12"
                        />
                      ) : (
                        <div className="space-y-6 pt-2 px-2">
                          {displayReviews.length === 0 ? (
                            <EmptyState
                              icon={activeSearch ? Search : MessageSquare}
                              title={activeSearch ? "Không tìm thấy kết quả" : "Chưa có đánh giá nào"}
                              description={activeSearch
                                ? `Không tìm thấy đánh giá nào khớp với từ khóa "${activeSearch}"`
                                : `Nhà hàng "${restaurant.name}" hiện chưa có lượt đánh giá nào từ khách hàng.`
                              }
                              className="py-12"
                            />
                          ) : (
                            <>
                              {displayReviews.map((review, index) => {
                                const isLast = index === displayReviews.length - 1;
                                return (
                                  <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`space-y-2 md:space-y-3 pb-4 md:pb-6 border-b border-gray-200/90 ${isLast ? 'border-b-0' : ''}`}
                                  >
                                    {/* Author Info */}
                                    <div className="flex items-start gap-3">
                                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                        <ImageWithFallback
                                          src={review.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.authorName}`}
                                          alt={review.authorName}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-bold text-gray-900 text-sm">{review.authorName}</div>
                                        <div className="text-xs text-gray-500 font-medium">Khách hàng Eatzy</div>
                                      </div>
                                    </div>

                                    {/* Rating & Date */}
                                    <div className="flex items-center gap-2 text-xs">
                                      <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-gray-300">·</span>
                                      <span className="text-gray-500 font-medium">{review.date}</span>
                                    </div>

                                    {/* Review Content */}
                                    <p className="text-gray-700 leading-relaxed text-[15px] font-medium">
                                      {review.content}
                                    </p>

                                    {/* Admin Reply */}
                                    {review.reply && (
                                      <div className="mt-4 p-4 bg-gray-50 rounded-2xl border-l-4 border-[var(--primary)] space-y-0">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                                          <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center text-white">
                                            <ChefHat size={12} />
                                          </div>
                                          Phản hồi từ quán
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed italic">
                                          "{review.reply}"
                                        </p>
                                      </div>
                                    )}
                                  </motion.div>
                                );
                              })}

                              {/* End of List Label - Always show if >= 3 items */}
                              {displayReviews.length >= 3 && (
                                <div className="py-8 flex items-center justify-center gap-4 opacity-30 flex">
                                  <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent w-16" />
                                  <div className="flex flex-col items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-gray-400" />
                                    <span className="text-[11px] font-bold text-gray-400 uppercase font-anton tracking-widest text-center max-w-[180px]">
                                      End of list
                                    </span>
                                  </div>
                                  <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent w-16" />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence >,
    document.body
  );
};
