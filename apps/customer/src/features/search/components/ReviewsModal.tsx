import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Search, Star, Sparkles, CheckCircle2, MessageSquare, Map, Tag, ChefHat, ChevronDown } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import { motion, AnimatePresence } from "@repo/ui/motion";
import type { Restaurant } from "@repo/types";

interface ReviewsModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewsModal = ({ restaurant, isOpen, onClose }: ReviewsModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reviews = useMemo(() => restaurant.reviews || [], [restaurant.reviews]);
  // Use restaurant.rating if available, else calculate average
  const rating = restaurant.rating || (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1));

  const ratingDistribution = useMemo(() => {
    if (reviews.length === 0) {
      return [
        { stars: 5, count: 0, percentage: 0 },
        { stars: 4, count: 0, percentage: 0 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
      ];
    }
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const star = Math.floor(r.rating) as 1 | 2 | 3 | 4 | 5;
      if (counts[star] !== undefined) counts[star]++;
    });
    return [
      { stars: 5, count: counts[5], percentage: (counts[5] / reviews.length) * 100 },
      { stars: 4, count: counts[4], percentage: (counts[4] / reviews.length) * 100 },
      { stars: 3, count: counts[3], percentage: (counts[3] / reviews.length) * 100 },
      { stars: 2, count: counts[2], percentage: (counts[2] / reviews.length) * 100 },
      { stars: 1, count: counts[1], percentage: (counts[1] / reviews.length) * 100 },
    ];
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const result = reviews.filter(review =>
      (review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.authorName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedRating === null || Math.floor(review.rating) === selectedRating)
    );

    if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    }
    // For 'relevant' and 'recent', we keep default order for now as dates are not easily comparable strings

    return result;
  }, [reviews, searchQuery, sortBy, selectedRating]);

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
          <div className="fixed inset-0 z-[101] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-8">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="w-full max-w-[1050px] h-[100dvh] md:h-[90vh] bg-white md:rounded-[36px] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Fixed Header with Close Button */}
              <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                <button
                  onClick={onClose}
                  className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-900" />
                </button>
                <div className="flex-1" />
              </div>

              {/* Two Column Layout with Independent Scrolling */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* Left Column - Scrollable Stats */}
                <div className="w-full md:w-[400px] flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col md:block">
                  {/* Mobile Compact Header: Rating + Dist together */}
                  <div className="flex items-center gap-6 px-5 py-4 md:px-16 md:py-8 md:block md:space-y-8 no-scrollbar overflow-x-auto">

                    {/* Hero Rating - Compact on Mobile */}
                    <div className="text-center md:space-y-3 flex-shrink-0">
                      <div className="flex items-center justify-center gap-2 md:gap-4 md:mb-3">
                        <span className="text-2xl md:text-4xl hidden md:inline">🏆</span>
                        <div className="flex items-center gap-1">
                          <div className="text-[42px] md:text-[80px] leading-none font-bold text-[#1A1A1A]">
                            {rating.toFixed(1).replace('.', ',')}
                          </div>
                          <Star className="w-6 h-6 md:w-12 md:h-12 text-yellow-500 fill-yellow-500 mt-1 md:mt-2" />
                        </div>
                        <span className="text-2xl md:text-4xl hidden md:inline">🏆</span>
                      </div>
                      <h3 className="hidden md:block text-[18px] font-bold text-[#1A1A1A]">Được khách yêu thích</h3>
                      <p className="hidden md:block text-gray-600 text-[13px] leading-relaxed">
                        Top 10% quán ăn hàng đầu
                      </p>
                      {/* Mobile Only Label */}
                      <div className="md:hidden text-xs font-bold mt-1">Khách yêu thích</div>
                    </div>

                    {/* Rating Distribution - Compact on Mobile */}
                    <div className="flex-1 min-w-[180px] md:space-y-2.5 border-l md:border-l-0 pl-6 md:pl-0 border-gray-100">
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <h4 className="font-semibold text-gray-900 text-xs md:text-sm">Xếp hạng</h4>
                        {selectedRating !== null && (
                          <button
                            onClick={() => setSelectedRating(null)}
                            className="text-[10px] md:text-xs text-[var(--primary)] font-bold hover:underline"
                          >
                            Xóa lọc
                          </button>
                        )}
                      </div>
                      {ratingDistribution.map((item) => (
                        <div
                          key={item.stars}
                          onClick={() => setSelectedRating(selectedRating === item.stars ? null : item.stars)}
                          className={`flex items-center gap-2.5 cursor-pointer p-1 rounded-lg transition-colors ${selectedRating === item.stars ? 'bg-gray-100 ring-1 ring-gray-200' : 'hover:bg-gray-50'
                            }`}
                        >
                          <span className={`text-xs w-2 ${selectedRating === item.stars ? 'text-[#1A1A1A] font-bold' : 'text-gray-600'}`}>
                            {item.stars}
                          </span>
                          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className={`h-full rounded-full ${selectedRating === item.stars ? 'bg-[var(--primary)]' : 'bg-gray-900'}`}
                            />
                          </div>
                          {selectedRating === item.stars && <CheckCircle2 className="w-3 h-3 text-[var(--primary)]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Scrollable Reviews */}
                <div className="flex-1 overflow-y-auto px-5 md:pr-12 md:pl-8 py-6">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        {filteredReviews.length} lượt đánh giá
                      </h2>

                      <div className="relative">
                        <button
                          onClick={() => setIsSortOpen(!isSortOpen)}
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-gray-300 transition-colors text-gray-700 min-w-[160px] justify-between"
                        >
                          <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isSortOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-30 overflow-hidden"
                            >
                              {sortOptions.map(option => (
                                <button
                                  key={option.value}
                                  onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-[var(--primary)] font-bold bg-[var(--primary)]/5' : 'text-gray-700'
                                    }`}
                                >
                                  {option.label}
                                  {sortBy === option.value && <CheckCircle2 className="w-4 h-4" />}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm tất cả đánh giá"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors text-sm"
                      />
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6 pt-2">
                      {filteredReviews.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 text-sm">
                          Không tìm thấy đánh giá nào
                        </div>
                      ) : (
                        filteredReviews.map((review) => (
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3 pb-6 border-b border-gray-100 last:border-0"
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
                                {review.tenure && (
                                  <div className="text-xs text-gray-500">{review.tenure} trên Eatzy</div>
                                )}
                              </div>
                            </div>

                            {/* Rating & Date */}
                            <div className="flex items-center gap-2 text-xs">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-gray-900 text-gray-900' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-gray-400">·</span>
                              <span className="text-gray-600">{review.date}</span>
                            </div>

                            {/* Review Content */}
                            <p className="text-gray-700 leading-relaxed text-[14px]">
                              {review.content}
                            </p>

                            {review.location && (
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Map className="w-3 h-3" />
                                {review.location}
                              </div>
                            )}
                          </motion.div>
                        ))
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
