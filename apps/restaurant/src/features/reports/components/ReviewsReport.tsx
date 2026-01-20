'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { ReviewSummaryDto, ReviewReportItem } from '../services/reportService';
import {
  Star,
  MessageCircle,
  Clock,
  CheckCircle,
  Reply,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

interface ReviewsReportProps {
  data: ReviewSummaryDto;
}

const StarRating = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-200 fill-gray-200'
            }`}
        />
      ))}
    </div>
  );
};

const RatingBar = ({
  stars,
  count,
  total,
  color
}: {
  stars: number;
  count: number;
  total: number;
  color: string;
}) => {
  const percent = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3 group">
      <div className="flex items-center gap-1 w-16 shrink-0">
        <span className="text-sm font-bold text-gray-700">{stars}</span>
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      </div>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: (5 - stars) * 0.1 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-sm font-medium text-gray-500 w-12 text-right">{count}</span>
      <span className="text-xs font-bold text-gray-400 w-12 text-right">{percent.toFixed(0)}%</span>
    </div>
  );
};

const ReviewCard = ({ review }: { review: ReviewReportItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center text-lime-700 font-bold text-sm">
            {review.customerName.charAt(0)}
          </div>
          <div>
            <h5 className="font-bold text-gray-900 text-sm">{review.customerName}</h5>
            <p className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={review.rating} size="sm" />
          <span className="text-xs font-medium text-gray-400">#{review.orderCode}</span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        "{review.comment}"
      </p>

      {/* Dishes */}
      <div className="flex flex-wrap gap-2 mb-4">
        {review.dishNames.map((dish, i) => (
          <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-lime-50 text-lime-600">
            {dish}
          </span>
        ))}
      </div>

      {/* Reply */}
      {review.reply ? (
        <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-lime-500">
          <div className="flex items-center gap-2 mb-2">
            <Reply className="w-4 h-4 text-lime-600" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phản hồi của nhà hàng</span>
          </div>
          <p className="text-sm text-gray-600">{review.reply}</p>
        </div>
      ) : (
        <button className="flex items-center gap-2 text-sm font-medium text-lime-600 hover:text-lime-700 transition-colors">
          <Reply className="w-4 h-4" />
          Phản hồi đánh giá
        </button>
      )}
    </motion.div>
  );
};

export default function ReviewsReport({ data }: ReviewsReportProps) {
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  if (!data) {
    return (
      <div className="p-12 text-center text-gray-400 font-medium bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <Star className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg">Không có dữ liệu đánh giá.</p>
      </div>
    );
  }

  const { ratingDistribution, recentReviews, totalReviews, averageRating, responseRate, averageResponseTime } = data;

  const filteredReviews = ratingFilter
    ? recentReviews.filter(r => r.rating === ratingFilter)
    : recentReviews;

  // Calculate positive vs negative
  const positiveCount = ratingDistribution.fiveStar + ratingDistribution.fourStar;
  const negativeCount = ratingDistribution.oneStar + ratingDistribution.twoStar;
  const positivePercent = totalReviews > 0 ? (positiveCount / totalReviews) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Rating - Hero Card */}
        <div className="sm:col-span-2 lg:col-span-1 bg-[#1A1A1A] p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center min-h-[180px]">
          <div className="mb-3">
            <StarRating rating={Math.round(averageRating)} size="lg" />
          </div>
          <span className="text-5xl font-anton text-lime-400 mb-2">{averageRating.toFixed(1)}</span>
          <p className="text-gray-400 text-sm font-medium">Điểm đánh giá trung bình</p>
          <p className="text-gray-500 text-xs mt-1">{totalReviews} đánh giá</p>
        </div>

        {/* Response Rate */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tỷ Lệ Phản Hồi</span>
            <div className="p-2 rounded-xl bg-green-100">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-anton text-green-600">{responseRate.toFixed(0)}%</span>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${responseRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-lime-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thời Gian Phản Hồi</span>
            <div className="p-2 rounded-xl bg-blue-100">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-anton text-blue-600">{averageResponseTime}</span>
            <span className="text-lg text-gray-400 ml-1">phút</span>
            <p className="text-xs text-gray-400 mt-2">Trung bình</p>
          </div>
        </div>

        {/* Positive vs Negative */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tích Cực / Tiêu Cực</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-anton text-green-600">{positiveCount}</span>
            </div>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-lime-500"
                style={{ width: `${positivePercent}%` }}
              />
              <div
                className="h-full bg-red-400"
                style={{ width: `${100 - positivePercent}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-anton text-red-500">{negativeCount}</span>
              <ThumbsDown className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            {positivePercent.toFixed(0)}% đánh giá tích cực (4-5 sao)
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
        <h4 className="text-lg font-bold text-gray-900 mb-6">Phân Bố Đánh Giá</h4>
        <div className="space-y-4">
          <RatingBar stars={5} count={ratingDistribution.fiveStar} total={totalReviews} color="bg-lime-500" />
          <RatingBar stars={4} count={ratingDistribution.fourStar} total={totalReviews} color="bg-lime-400" />
          <RatingBar stars={3} count={ratingDistribution.threeStar} total={totalReviews} color="bg-yellow-400" />
          <RatingBar stars={2} count={ratingDistribution.twoStar} total={totalReviews} color="bg-orange-400" />
          <RatingBar stars={1} count={ratingDistribution.oneStar} total={totalReviews} color="bg-red-400" />
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900 font-anton">Đánh Giá Gần Đây</h4>
            <p className="text-sm text-gray-400 mt-1">{filteredReviews.length} đánh giá</p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setRatingFilter(null)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${ratingFilter === null
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Tất cả
            </button>
            {[5, 4, 3, 2, 1].map(star => (
              <button
                key={star}
                onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1 ${ratingFilter === star
                    ? 'bg-lime-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {star} <Star className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          <AnimatePresence>
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </AnimatePresence>
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Không tìm thấy đánh giá phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
}
