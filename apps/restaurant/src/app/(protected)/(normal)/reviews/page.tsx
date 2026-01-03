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
    <div className="h-screen flex flex-col bg-[#F7F7F7] overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 bg-white/50 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 shadow-sm shrink-0">
        <h1 className="text-4xl mb-2 font-anton font-bold text-[#1A1A1A]">REVIEWS & FEEDBACK</h1>
        <p className="text-gray-500 text-sm font-medium">Theo dõi đánh giá và phản hồi từ khách hàng</p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden p-8 gap-8">

        {/* Left Column - Scrollable Stats */}
        {isLoading ? (
          <ReviewStatsShimmer />
        ) : (
          <div className="w-[400px] flex-shrink-0 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Hero Rating */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span className="text-4xl">🏆</span>
                  <div className="text-[80px] leading-none font-bold text-[#1A1A1A]">
                    {rating.toFixed(1).replace('.', ',')}
                  </div>
                  <span className="text-4xl">🏆</span>
                </div>

                <h3 className="text-[18px] font-bold text-[#1A1A1A]">Được khách yêu thích</h3>
                <p className="text-gray-600 text-[13px] leading-relaxed">
                  Trong số các quán ăn đủ điều kiện dựa trên điểm xếp hạng, lượt đánh giá và độ tin cậy, quán này nằm trong <span className="font-bold text-gray-900">nhóm 10% quán ăn hàng đầu</span>
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Xếp hạng tổng thể</h4>
                  {selectedRating !== null && (
                    <button
                      onClick={() => setSelectedRating(null)}
                      className="text-xs text-[var(--primary)] font-bold hover:underline"
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

              {/* Categories */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.label} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-gray-700" strokeWidth={1.5} />
                        <span className="text-sm text-gray-900">{cat.label}</span>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{cat.score.toFixed(1).replace('.', ',')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Right Column - Scrollable Reviews */}
        <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4">
                {isLoading ? (
                  <TextShimmer width={150} height={28} rounded="lg" />
                ) : (
                  <h2 className="text-xl font-bold text-gray-900">
                    {filteredReviews.length} lượt đánh giá
                  </h2>
                )}

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
                {isLoading ? (
                  <ReviewItemShimmer count={5} />
                ) : filteredReviews.length === 0 ? (
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
                          <div className="text-xs text-gray-500">Khách hàng thân thiết trên Eatzy</div>
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

                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Map className="w-3 h-3" />
                        Thành phố Hồ Chí Minh
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
