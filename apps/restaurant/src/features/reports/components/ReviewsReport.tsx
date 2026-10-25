'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { ReviewSummaryDTO, ReviewReportItemDTO } from '@repo/types';
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
  data: ReviewSummaryDTO;
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

const ReviewCard = ({ review }: { review: ReviewReportItemDTO }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all
        max-md:bg-gray-200/40 max-md:rounded-[24px] max-md:border-none max-md:p-4 max-md:space-y-2
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4 max-md:mb-1 max-md:gap-2">
        <div className="flex items-center gap-3 max-md:gap-2.5">
          <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center text-lime-750 font-bold text-sm max-md:w-9 max-md:h-9 max-md:text-xs">
            {review.customerName.charAt(0)}
          </div>
          <div>
            <h5 className="font-bold text-gray-900 text-sm max-md:text-sm max-md:font-bold max-md:text-[#1A1A1A] max-md:tracking-tight">{review.customerName}</h5>
            <p className="text-xs text-gray-400 max-md:text-xs max-md:text-gray-400 max-md:font-medium max-md:tracking-tight">
              {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 max-md:gap-0.5">
          <StarRating rating={review.rating} size="sm" />
          <span className="text-xs font-medium text-gray-400 max-md:text-[11px] max-md:font-semibold max-md:text-gray-400">#{review.orderCode}</span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-750 leading-relaxed mb-3 max-md:mb-1.5 max-md:text-[14px] max-md:font-medium max-md:text-[#1A1A1A] max-md:leading-relaxed max-md:tracking-tight">
        "{review.comment}"
      </p>

      {/* Dishes */}
      <div className="flex flex-wrap gap-2 mb-4 max-md:mb-2 max-md:gap-1.5">
        {review.dishNames.map((dish, i) => (
          <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-lime-50 text-lime-600 max-md:text-[11px] max-md:font-semibold">
            {dish}
          </span>
        ))}
      </div>

      {/* Reply */}
      {review.reply ? (
        <div className="
          bg-gray-50 rounded-xl p-4 border-l-4 border-lime-500
          max-md:bg-white/80 max-md:rounded-[20px] max-md:p-3
        ">
          <div className="flex items-center gap-2 mb-2 max-md:mb-1">
            <Reply className="w-4 h-4 text-lime-600 max-md:w-3.5 max-md:h-3.5" />
            <span className="
              text-xs font-bold text-gray-500 uppercase tracking-wider
              max-md:text-[10px] max-md:font-bold max-md:text-[#1A1A1A] max-md:tracking-tight
            ">
              Phản hồi của nhà hàng
            </span>
          </div>
          <p className="text-sm text-gray-600 max-md:text-[13px] max-md:font-medium max-md:leading-relaxed max-md:tracking-tight">{review.reply}</p>
        </div>
      ) : (
        <button className="flex items-center gap-2 text-sm font-medium text-lime-600 hover:text-lime-700 transition-colors max-md:text-xs max-md:font-bold">
          <Reply className="w-4 h-4 max-md:w-3.5 max-md:h-3.5" />
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

  const safeReviews = Array.isArray(data?.recentReviews) ? data.recentReviews : [];
  const ratingDistribution = data?.ratingDistribution || {
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
  };
  const totalReviews = data?.totalReviews || 0;
  const averageRating = data?.averageRating || 0;
  const responseRate = data?.responseRate || 0;
  const averageResponseTime = data?.averageResponseTime || 0;

  const filteredReviews = ratingFilter
    ? safeReviews.filter(r => r.rating === ratingFilter)
    : safeReviews;

  // Calculate positive vs negative
  const positiveCount = (ratingDistribution.fiveStar || 0) + (ratingDistribution.fourStar || 0);
  const negativeCount = (ratingDistribution.oneStar || 0) + (ratingDistribution.twoStar || 0);
  const positivePercent = totalReviews > 0 ? (positiveCount / totalReviews) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Rating - Hero Card */}
        <div className="
          sm:col-span-2 lg:col-span-1 bg-[#1A1A1A] text-center text-white
          md:p-6 md:rounded-2xl md:shadow-xl md:flex md:flex-col md:items-center md:justify-center md:min-h-[180px]
          max-md:bg-[#1A1A1A] max-md:rounded-[32px] max-md:p-5 max-md:h-auto max-md:space-y-1.5 max-md:shadow-none max-md:flex max-md:flex-col max-md:items-center max-md:justify-center
        ">
          <div className="mb-3 max-md:mb-1">
            <StarRating rating={Math.round(averageRating)} size="lg" />
          </div>
          <span className="
            font-anton text-lime-400 block
            md:text-5xl md:mb-2
            max-md:text-2xl max-md:font-black max-md:tracking-tighter
          ">
            {averageRating.toFixed(1)}
          </span>
          <p className="
            text-sm font-medium text-gray-400 block
            max-md:text-xs max-md:text-gray-400 max-md:font-medium max-md:tracking-tight
          ">
            Điểm đánh giá trung bình
          </p>
          <p className="
            text-xs text-gray-500 mt-1 block
            max-md:mt-0 max-md:text-[11px] max-md:text-gray-500 max-md:font-medium
          ">
            {totalReviews} đánh giá
          </p>
        </div>

        {/* Response Rate */}
        <div className="
          flex flex-col justify-between
          md:p-6 md:rounded-2xl md:border md:border-gray-100 md:shadow-sm md:bg-white
          max-md:bg-gray-200/60 max-md:rounded-[32px] max-md:p-5 max-md:h-auto max-md:space-y-1.5 max-md:border-none max-md:shadow-none
        ">
          <div className="flex items-center justify-between mb-4 max-md:mb-1">
            <span className="
              text-xs font-bold text-gray-400 uppercase tracking-wider block
              max-md:text-[10px] max-md:font-bold max-md:text-gray-505 max-md:uppercase max-md:tracking-widest max-md:mb-0.5
            ">
              Tỷ Lệ Phản Hồi
            </span>
            <div className="p-2 rounded-xl bg-green-150 max-md:hidden">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="flex flex-col justify-end max-md:space-y-1">
            <span className="
              font-anton text-green-600 block
              md:text-4xl
              max-md:text-2xl max-md:font-black max-md:tracking-tighter
            ">
              {responseRate.toFixed(0)}%
            </span>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden max-md:hidden">
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
        <div className="
          flex flex-col justify-between
          md:p-6 md:rounded-2xl md:border md:border-gray-100 md:shadow-sm md:bg-white
          max-md:bg-gray-200/60 max-md:rounded-[32px] max-md:p-5 max-md:h-auto max-md:space-y-1.5 max-md:border-none max-md:shadow-none
        ">
          <div className="flex items-center justify-between mb-4 max-md:mb-1">
            <span className="
              text-xs font-bold text-gray-400 uppercase tracking-wider block
              max-md:text-[10px] max-md:font-bold max-md:text-gray-505 max-md:uppercase max-md:tracking-widest max-md:mb-0.5
            ">
              Thời Gian Phản Hồi
            </span>
            <div className="p-2 rounded-xl bg-blue-150 max-md:hidden">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-0.5 max-md:mt-0">
            <span className="
              font-anton text-blue-600 block
              md:text-4xl
              max-md:text-2xl max-md:font-black max-md:tracking-tighter
            ">
              {averageResponseTime}
            </span>
            <span className="
              text-lg text-gray-400 ml-1 block
              max-md:text-xs max-md:font-bold max-md:text-blue-600 max-md:ml-0.5
            ">
              phút
            </span>
          </div>
        </div>

        {/* Positive vs Negative */}
        <div className="
          md:p-6 md:rounded-2xl md:border md:border-gray-100 md:shadow-sm md:bg-white
          max-md:bg-gray-200/60 max-md:rounded-[32px] max-md:p-5 max-md:h-auto max-md:space-y-1.5 max-md:border-none max-md:shadow-none
        ">
          <div className="flex items-center justify-between mb-4 max-md:mb-1">
            <span className="
              text-xs font-bold text-gray-400 uppercase tracking-wider block
              max-md:text-[10px] max-md:font-bold max-md:text-gray-505 max-md:uppercase max-md:tracking-widest max-md:mb-0.5
            ">
              Tích Cực / Tiêu Cực
            </span>
          </div>
          <div className="flex items-center gap-4 max-md:gap-2">
            <div className="flex items-center gap-2 max-md:gap-1">
              <ThumbsUp className="w-5 h-5 text-green-500 max-md:w-4.5 max-md:h-4.5" />
              <span className="
                font-anton text-green-600
                md:text-2xl
                max-md:text-xl max-md:font-black max-md:tracking-tighter
              ">
                {positiveCount}
              </span>
            </div>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex max-md:h-2">
              <div
                className="h-full bg-lime-500"
                style={{ width: `${positivePercent}%` }}
              />
              <div
                className="h-full bg-red-400"
                style={{ width: `${100 - positivePercent}%` }}
              />
            </div>
            <div className="flex items-center gap-2 max-md:gap-1">
              <span className="
                font-anton text-red-500
                md:text-2xl
                max-md:text-xl max-md:font-black max-md:tracking-tighter
              ">
                {negativeCount}
              </span>
              <ThumbsDown className="w-5 h-5 text-red-500 max-md:w-4.5 max-md:h-4.5" />
            </div>
          </div>
          <p className="
            text-xs text-gray-400 mt-3 text-center
            max-md:mt-1 max-md:text-xs max-md:text-gray-400 max-md:font-medium max-md:tracking-tight
          ">
            {positivePercent.toFixed(0)}% đánh giá tích cực (4-5 sao)
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="
        bg-white shadow-sm
        md:p-6 md:rounded-[32px] md:border md:border-gray-100
        max-md:rounded-[32px] max-md:p-5 max-md:shadow-[0_4px_25px_rgba(0,0,0,0.03)] max-md:border max-md:border-gray-100/50
      ">
        <h4 className="
          text-lg font-bold text-gray-900 mb-6
          max-md:text-[16px] max-md:font-bold max-md:text-gray-500 max-md:tracking-tight
        ">
          Phân Bố Đánh Giá
        </h4>
        <div className="space-y-4">
          <RatingBar stars={5} count={ratingDistribution.fiveStar} total={totalReviews} color="bg-lime-500" />
          <RatingBar stars={4} count={ratingDistribution.fourStar} total={totalReviews} color="bg-lime-400" />
          <RatingBar stars={3} count={ratingDistribution.threeStar} total={totalReviews} color="bg-yellow-400" />
          <RatingBar stars={2} count={ratingDistribution.twoStar} total={totalReviews} color="bg-orange-400" />
          <RatingBar stars={1} count={ratingDistribution.oneStar} total={totalReviews} color="bg-red-400" />
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="
        bg-white shadow-sm
        md:p-6 md:rounded-[32px] md:border md:border-gray-100
        max-md:rounded-[32px] max-md:p-5 max-md:shadow-[0_4px_25px_rgba(0,0,0,0.03)] max-md:border max-md:border-gray-100/50
      ">
        {/* Header */}
        <div className="
          flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6
          max-md:mb-4 max-md:gap-3
        ">
          <div>
            <h4 className="
              text-xl font-bold text-gray-900 font-anton
              max-md:text-lg max-md:font-bold max-md:text-[#1A1A1A] max-md:tracking-tight
            ">
              Đánh Giá Gần Đây
            </h4>
            <p className="
              text-sm text-gray-400 mt-1
              max-md:text-xs max-md:text-gray-400 max-md:font-medium max-md:tracking-tight max-md:mt-0.5
            ">
              {filteredReviews.length} đánh giá
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setRatingFilter(null)}
              className={`
                px-4 py-2 rounded-xl text-sm font-bold transition-all max-md:text-xs max-md:px-3 max-md:py-1.5
                ${ratingFilter === null
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              Tất cả
            </button>
            {[5, 4, 3, 2, 1].map(star => (
              <button
                key={star}
                onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
                className={`
                  px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1 max-md:text-xs max-md:px-2.5 max-md:py-1.5
                  ${ratingFilter === star
                    ? 'bg-lime-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
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
