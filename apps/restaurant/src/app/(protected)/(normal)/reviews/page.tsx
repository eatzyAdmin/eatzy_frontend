'use client';

import { useState, useMemo, useEffect } from "react";
import { Search, Star, Sparkles, CheckCircle2, MessageSquare, Map, Tag, ChefHat, ChevronDown } from "@repo/ui/icons";
import { ImageWithFallback, ReviewItemShimmer, ReviewStatsShimmer, TextShimmer, useLoading } from "@repo/ui";
import { motion, AnimatePresence } from "@repo/ui/motion";
import type { Review } from "@repo/types";

// Mock Data
const mockReviews: Review[] = [
  {
    id: 'rev-1',
    authorName: 'Nguyễn Văn A',
    rating: 5,
    date: '2 ngày trước',
    content: 'Món ăn rất ngon, phục vụ nhiệt tình. Sẽ quay lại!',
    authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100'
  },
  {
    id: 'rev-2',
    authorName: 'Trần Thị B',
    rating: 4.5,
    date: '1 tuần trước',
    content: 'Không gian đẹp, món ăn ổn. Giá hơi cao một chút.',
  },
  {
    id: 'rev-3',
    authorName: 'Lê Văn C',
    rating: 5,
    date: '2 tuần trước',
    content: 'Tuyệt vời! Giao hàng nhanh, đồ ăn vẫn còn nóng hổi.',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
  },
  {
    id: 'rev-4',
    authorName: 'Phạm Thị D',
    rating: 4,
    date: '1 tháng trước',
    content: 'Đồ ăn khá ngon nhưng ship hơi lâu.',
  },
  {
    id: 'rev-5',
    authorName: 'Hoàng Văn E',
    rating: 3,
    date: '1 tháng trước',
    content: 'Món cơm hơi khô, cần cải thiện.',
  },
  {
    id: 'rev-6',
    authorName: 'Mai Thị F',
    rating: 5,
    date: '2 tháng trước',
    content: 'Quán ruột của mình, ăn mãi không chán!',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
  },
  {
    id: 'rev-7',
    authorName: 'Ngô Văn G',
    rating: 4.8,
    date: '2 tháng trước',
    content: 'Đóng gói cẩn thận, sạch sẽ.',
  },
  {
    id: 'rev-8',
    authorName: 'Đặng Thị H',
    rating: 5,
    date: '3 tháng trước',
    content: '10 điểm cho chất lượng!',
  }
];

export default function ReviewsPage() {
  const { hide } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const reviews = useMemo(() => mockReviews, []);

  // Initial loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [hide]);

  // Calculate average rating
  const rating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

  const categories = [
    { label: "Mức độ ngon", score: 4.9, icon: ChefHat },
    { label: "Độ chính xác", score: 4.9, icon: CheckCircle2 },
    { label: "Phục vụ", score: 5.0, icon: Sparkles },
    { label: "Giao tiếp", score: 5.0, icon: MessageSquare },
    { label: "Vị trí", score: 4.8, icon: Map },
    { label: "Giá trị", score: 5.0, icon: Tag },
  ];

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
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const star = Math.floor(r.rating);
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
    // For 'relevant' and 'recent', we keep default order for now

    return result;
  }, [reviews, searchQuery, sortBy, selectedRating]);

  const sortOptions = [
    { value: 'relevant', label: 'Phù hợp nhất' },
    { value: 'recent', label: 'Gần đây nhất' },
    { value: 'highest', label: 'Đánh giá cao nhất' },
    { value: 'lowest', label: 'Đánh giá thấp nhất' },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FA] overflow-hidden">
      {/* Header - Premium Design */}
      <div className="px-8 py-5 pb-0 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Star size={12} />
              Customer Feedback
            </span>
          </div>
          <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
            Reviews & Feedback
          </h1>
          <p className="text-gray-500 font-medium mt-1">Monitor customer satisfaction and ratings.</p>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">

        {/* Left Column - Scrollable Stats */}
        {isLoading ? (
          <ReviewStatsShimmer />
        ) : (
          <div className="w-[400px] flex-shrink-0 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
              {/* Hero Rating */}
              <div className="text-center bg-gray-50 rounded-[28px] p-6 border border-gray-100">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span className="text-4xl drop-shadow-md">🏆</span>
                  <div className="text-[80px] leading-none font-anton font-bold text-[#1A1A1A] tracking-tighter drop-shadow-sm">
                    {rating.toFixed(1).replace('.', ',')}
                  </div>
                  <span className="text-4xl drop-shadow-md">🏆</span>
                </div>

                <h3 className="text-xl font-anton font-bold text-[#1A1A1A] uppercase tracking-wide mb-2">Được khách yêu thích</h3>
                <p className="text-gray-600 text-sm leading-relaxed px-2">
                  Top 10% quán ăn hàng đầu dựa trên đánh giá và độ tin cậy.
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-anton font-bold text-[#1A1A1A] uppercase text-lg">Rating Breakdown</h4>
                  {selectedRating !== null && (
                    <button
                      onClick={() => setSelectedRating(null)}
                      className="text-xs text-[var(--primary)] font-bold hover:underline bg-lime-50 px-2 py-1 rounded-lg"
                    >
                      CLEAR FILTER
                    </button>
                  )}
                </div>
                {ratingDistribution.map((item) => (
                  <div
                    key={item.stars}
                    onClick={() => setSelectedRating(selectedRating === item.stars ? null : item.stars)}
                    className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-all ${selectedRating === item.stars ? 'bg-gray-100 ring-2 ring-gray-200' : 'hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-1 w-8 justify-center">
                      <span className={`text-base font-anton ${selectedRating === item.stars ? 'text-[#1A1A1A]' : 'text-gray-500'}`}>
                        {item.stars}
                      </span>
                      <Star className={`w-3 h-3 ${selectedRating === item.stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                    </div>

                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-full rounded-full ${selectedRating === item.stars ? 'bg-lime-500' : 'bg-[#1A1A1A]'}`}
                      />
                    </div>

                    <span className="text-xs font-bold text-gray-400 w-8 text-right">{Math.round(item.percentage)}%</span>
                  </div>
                ))}
              </div>

              {/* Categories */}
              <div className="space-y-4 pt-6 border-t-2 border-dashed border-gray-100">
                <h4 className="font-anton font-bold text-[#1A1A1A] uppercase text-lg">Detailed Scores</h4>
                <div className="grid grid-cols-1 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <div key={cat.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm">
                            <Icon className="w-4 h-4" strokeWidth={2} />
                          </div>
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">{cat.label}</span>
                        </div>
                        <span className="font-anton text-lg text-[#1A1A1A]">{cat.score.toFixed(1).replace('.', ',')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column - Scrollable Reviews */}
        <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                {isLoading ? (
                  <TextShimmer width={150} height={28} rounded="lg" />
                ) : (
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-3xl font-anton font-bold text-[#1A1A1A]">
                      {filteredReviews.length}
                    </h2>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Customer Reviews</span>
                  </div>
                )}

                <div className="relative z-20">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-3 px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold hover:bg-white hover:shadow-md transition-all text-[#1A1A1A] min-w-[180px] justify-between"
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
                        className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                      >
                        {sortOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                            className={`w-full text-left px-5 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${sortBy === option.value ? 'text-[var(--primary)] font-bold bg-lime-50' : 'text-gray-600 font-medium'
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
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1A1A1A] transition-colors" />
                <input
                  type="text"
                  placeholder="Search reviews by content or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-lime-200 focus:outline-none focus:shadow-lg focus:shadow-lime-500/10 transition-all font-medium text-[#1A1A1A] placeholder:text-gray-400"
                />
              </div>

              {/* Reviews List */}
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  <ReviewItemShimmer count={4} />
                ) : filteredReviews.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-4xl">🤔</div>
                    <h3 className="text-lg font-bold text-gray-900">No reviews found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  filteredReviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-lime-200 transition-all group"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-white shadow-sm">
                            <ImageWithFallback
                              src={review.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.authorName}`}
                              alt={review.authorName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#1A1A1A] text-base">{review.authorName}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verified Customer</div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="flex gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < Math.floor(review.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-gray-400 mt-1">{review.date}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="pl-16">
                        <div className="bg-gray-50/50 rounded-2xl p-4 relative">
                          <div className="absolute top-4 left-0 -translate-x-1/2 w-3 h-3 bg-gray-50 rotate-45 border-l border-b border-white hidden"></div>
                          <p className="text-[#1A1A1A] leading-relaxed font-medium">
                            "{review.content}"
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mt-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <Map className="w-3 h-3 text-[var(--primary)]" />
                          <span>Ho Chi Minh City</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
