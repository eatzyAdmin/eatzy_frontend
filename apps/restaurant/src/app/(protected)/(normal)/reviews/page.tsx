'use client';

import { useState, useMemo, useEffect } from "react";
import { Search, Star, Sparkles, CheckCircle2, MessageSquare, Map, Tag, ChefHat, ChevronDown, Send, X } from "@repo/ui/icons";
import { ImageWithFallback, ReviewItemShimmer, ReviewStatsShimmer, TextShimmer, useLoading } from "@repo/ui";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useMyRestaurantReviews, useReplyToReview } from "@/features/store/hooks";

export default function ReviewsPage() {
  const { hide } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  // Fetch reviews from API
  const {
    reviews,
    isLoading,
    totalReviews,
    averageRating,
    ratingDistribution,
    unrepliedCount
  } = useMyRestaurantReviews();

  const { replyToReview, isReplying } = useReplyToReview();

  // Hide global loading on mount
  useEffect(() => {
    hide();
  }, [hide]);

  // Convert API response to display format
  const displayReviews = useMemo(() => {
    return reviews.map(review => ({
      id: review.id,
      authorName: review.customer.name,
      rating: review.rating,
      date: formatRelativeDate(review.createdAt),
      content: review.comment,
      reply: review.reply,
      orderId: review.order.id,
    }));
  }, [reviews]);

  const categories = [
    { label: "Mức độ ngon", score: averageRating, icon: ChefHat },
    { label: "Độ chính xác", score: averageRating, icon: CheckCircle2 },
    { label: "Phục vụ", score: averageRating, icon: Sparkles },
    { label: "Giao tiếp", score: averageRating, icon: MessageSquare },
    { label: "Vị trí", score: averageRating, icon: Map },
    { label: "Giá trị", score: averageRating, icon: Tag },
  ];

  const ratingDistributionDisplay = useMemo(() => {
    const total = totalReviews || 1;
    return [
      { stars: 5, count: ratingDistribution.fiveStar, percentage: (ratingDistribution.fiveStar / total) * 100 },
      { stars: 4, count: ratingDistribution.fourStar, percentage: (ratingDistribution.fourStar / total) * 100 },
      { stars: 3, count: ratingDistribution.threeStar, percentage: (ratingDistribution.threeStar / total) * 100 },
      { stars: 2, count: ratingDistribution.twoStar, percentage: (ratingDistribution.twoStar / total) * 100 },
      { stars: 1, count: ratingDistribution.oneStar, percentage: (ratingDistribution.oneStar / total) * 100 },
    ];
  }, [ratingDistribution, totalReviews]);

  const filteredReviews = useMemo(() => {
    const result = displayReviews.filter(review =>
      (review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.authorName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedRating === null || Math.floor(review.rating) === selectedRating)
    );

    if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [displayReviews, searchQuery, sortBy, selectedRating]);

  const sortOptions = [
    { value: 'relevant', label: 'Phù hợp nhất' },
    { value: 'recent', label: 'Gần đây nhất' },
    { value: 'highest', label: 'Đánh giá cao nhất' },
    { value: 'lowest', label: 'Đánh giá thấp nhất' },
  ];

  const handleReply = async (reviewId: number) => {
    if (!replyText.trim()) return;
    try {
      await replyToReview({ reviewId, reply: replyText });
      setReplyingTo(null);
      setReplyText("");
    } catch {
      // Error handled by hook
    }
  };

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
            {unrepliedCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                {unrepliedCount} chưa phản hồi
              </span>
            )}
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
                    {averageRating.toFixed(1).replace('.', ',')}
                  </div>
                  <span className="text-4xl drop-shadow-md">🏆</span>
                </div>

                <h3 className="text-xl font-anton font-bold text-[#1A1A1A] uppercase tracking-wide mb-2">Được khách yêu thích</h3>
                <p className="text-gray-600 text-sm leading-relaxed px-2">
                  Dựa trên {totalReviews} đánh giá từ khách hàng.
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
                {ratingDistributionDisplay.map((item) => (
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

                    <span className="text-xs font-bold text-gray-400 w-12 text-right">{item.count}</span>
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
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.authorName}`}
                              alt={review.authorName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#1A1A1A] text-base">{review.authorName}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Đơn #{review.orderId}</div>
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
                          <p className="text-[#1A1A1A] leading-relaxed font-medium">
                            "{review.content}"
                          </p>
                        </div>

                        {/* Reply Section */}
                        {review.reply ? (
                          <div className="mt-3 bg-lime-50 rounded-2xl p-4 border border-lime-100">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-lime-600" />
                              <span className="text-xs font-bold text-lime-700 uppercase tracking-wider">Phản hồi của bạn</span>
                            </div>
                            <p className="text-lime-900 text-sm font-medium">{review.reply}</p>
                          </div>
                        ) : replyingTo === review.id ? (
                          <div className="mt-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Nhập phản hồi của bạn..."
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-lime-300 focus:ring-2 focus:ring-lime-100 focus:outline-none text-sm"
                                disabled={isReplying}
                              />
                              <button
                                onClick={() => handleReply(review.id)}
                                disabled={isReplying || !replyText.trim()}
                                className="px-4 py-3 bg-lime-500 text-white rounded-xl font-bold text-sm hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                <Send className="w-4 h-4" />
                                {isReplying ? 'Đang gửi...' : 'Gửi'}
                              </button>
                              <button
                                onClick={() => { setReplyingTo(null); setReplyText(""); }}
                                className="px-3 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyingTo(review.id)}
                            className="mt-3 flex items-center gap-2 text-sm font-bold text-lime-600 hover:text-lime-700 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Phản hồi đánh giá
                          </button>
                        )}
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

// Helper function to format relative date
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
  return `${Math.floor(diffDays / 365)} năm trước`;
}
