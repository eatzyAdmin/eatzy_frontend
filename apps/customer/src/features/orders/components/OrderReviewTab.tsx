"use client";

import { useState } from "react";
import { Star, Send, Award, ShieldCheck, Quote } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useSwipeConfirmation, useNotification } from "@repo/ui";
import type { Order } from "@repo/types";

interface OrderReviewTabProps {
  order: Order;
  driver: {
    name: string;
    profilePhoto: string;
    licensePlate: string;
  };
  restaurant: {
    name: string;
    imageUrl?: string;
  } | null;
}

export default function OrderReviewTab({
  driver,
  restaurant,
}: OrderReviewTabProps) {
  const { confirm } = useSwipeConfirmation();
  // const { show, hide } = useLoading();
  const { showNotification } = useNotification();

  const [restaurantRating, setRestaurantRating] = useState(0);
  const [restaurantComment, setRestaurantComment] = useState("");
  const [driverRating, setDriverRating] = useState(0);
  const [driverComment, setDriverComment] = useState("");

  const [hoveredRestaurantRating, setHoveredRestaurantRating] = useState(0);
  const [hoveredDriverRating, setHoveredDriverRating] = useState(0);

  const [isRestaurantSubmitted, setIsRestaurantSubmitted] = useState(false);
  const [isDriverSubmitted, setIsDriverSubmitted] = useState(false);

  const handleSubmitRestaurant = async () => {
    if (restaurantRating === 0 || !restaurantComment.trim()) {
      showNotification({ type: "error", message: "Vui lòng chọn số sao và viết nhận xét!", format: "Điền đầy đủ thông tin trước khi gửi đánh giá nhé!" });
      return;
    }

    confirm({
      title: "Gửi đánh giá nhà hàng?",
      type: "success",
      description: "Vuốt để xác nhận gửi đánh giá của bạn",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsRestaurantSubmitted(true);
        showNotification({ type: "success", message: "Đánh giá nhà hàng thành công!", format: "Đánh giá đã được ghi nhận thành công!" });
      }
    });
  };

  const handleSubmitDriver = async () => {
    if (driverRating === 0 || !driverComment.trim()) {
      showNotification({ type: "error", message: "Vui lòng chọn số sao và viết nhận xét!", format: "Điền đầy đủ thông tin trước khi gửi đánh giá nhé!" });
      return;
    }

    confirm({
      title: "Gửi đánh giá tài xế?",
      type: "success",
      description: "Vuốt để xác nhận gửi đánh giá của bạn",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsDriverSubmitted(true);
        showNotification({ type: "success", message: "Đánh giá tài xế thành công!", format: "Đánh giá đã được ghi nhận thành công!" });
      }
    });
  };

  const renderRestaurantCard = (isSubmitted: boolean) => (
    <div className="bg-white rounded-[32px] p-8 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center h-full max-h-[600px] relative overflow-hidden">
      {!isSubmitted ? (
        <>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Đánh giá nhà hàng</h2>

          {/* Restaurant Avatar */}
          <div className="relative w-24 h-24 mb-4">
            <div className="w-full h-full rounded-full overflow-hidden relative z-10 bg-gray-50 border border-gray-100 shadow-sm">
              {restaurant?.imageUrl && (
                <ImageWithFallback
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">{restaurant?.name}</h3>
          <p className="text-sm text-gray-500 mb-8">Bạn thấy món ăn thế nào?</p>

          {/* Star Rating */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="transition-transform hover:scale-110 focus:outline-none"
                onMouseEnter={() => setHoveredRestaurantRating(star)}
                onMouseLeave={() => setHoveredRestaurantRating(0)}
                onClick={() => setRestaurantRating(star)}
              >
                <Star
                  className={`w-10 h-10 transition-colors ${star <= (hoveredRestaurantRating || restaurantRating)
                    ? "fill-[var(--primary)] text-[var(--primary)]"
                    : "text-gray-200"
                    }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          {/* Comment Input */}
          <textarea
            value={restaurantComment}
            onChange={(e) => setRestaurantComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về món ăn..."
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-all resize-none mb-6 flex-1 min-h-[120px]"
          />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSubmitRestaurant}
            className="w-full h-16 rounded-2xl bg-[var(--primary)] text-white text-xl uppercase font-anton font-semibold shadow-sm flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            COMPLETE REVIEW
          </motion.button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center w-full h-full"
        >
          <div className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-xs font-bold mb-6 flex items-center gap-1.5 align-middle">
            <ShieldCheck className="w-4 h-4" />
            Đã đánh giá thành công
          </div>

          {/* Submitted Profile Card */}
          <div className="relative w-28 h-28 mb-3">
            <div className="w-full h-full rounded-full overflow-hidden relative z-10 bg-gray-50 border-4 border-white shadow-md">
              {restaurant?.imageUrl && (
                <ImageWithFallback src={restaurant.imageUrl} alt={restaurant.name} fill className="object-cover" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 z-20 bg-[var(--primary)] text-white p-1.5 rounded-full shadow-md border-2 border-white">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">{restaurant?.name}</h2>
          <div className="text-xs font-medium text-gray-500 mb-6">{restaurantRating}/5 Sao</div>

          {/* Review Content */}
          <div className="bg-gray-50 rounded-2xl p-6 w-full text-left relative mt-auto mb-auto">
            <Quote className="w-8 h-8 text-gray-200 absolute -top-3 -left-2 fill-gray-200" />
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < restaurantRating ? 'fill-[var(--primary)] text-[var(--primary)]' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-[#1A1A1A] text-sm italic leading-relaxed">
              &quot;{restaurantComment || "Không có nhận xét"}&quot;
            </p>
          </div>

          <button className="text-gray-400 text-xs font-medium hover:text-gray-600 mt-6">
            Chỉnh sửa đánh giá
          </button>
        </motion.div>
      )}
    </div>
  );

  const renderDriverCard = (isSubmitted: boolean) => (
    <div className="bg-white rounded-[32px] p-8 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center h-full max-h-[600px] relative overflow-hidden">
      {!isSubmitted ? (
        <>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Đánh giá tài xế</h2>

          {/* Driver Avatar */}
          <div className="relative w-24 h-24 mb-4">
            <div className="w-full h-full rounded-full overflow-hidden relative z-10 bg-gray-50 border border-gray-100 shadow-sm">
              <ImageWithFallback
                src={driver.profilePhoto}
                alt={driver.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">{driver.name}</h3>
          <p className="text-sm text-gray-500 mb-8">{driver.licensePlate}</p>

          {/* Star Rating */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="transition-transform hover:scale-110 focus:outline-none"
                onMouseEnter={() => setHoveredDriverRating(star)}
                onMouseLeave={() => setHoveredDriverRating(0)}
                onClick={() => setDriverRating(star)}
              >
                <Star
                  className={`w-10 h-10 transition-colors ${star <= (hoveredDriverRating || driverRating)
                    ? "fill-[var(--primary)] text-[var(--primary)]"
                    : "text-gray-200"
                    }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          {/* Comment Input */}
          <textarea
            value={driverComment}
            onChange={(e) => setDriverComment(e.target.value)}
            placeholder="Tài xế có thân thiện không?"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-all resize-none mb-6 flex-1 min-h-[120px]"
          />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSubmitDriver}
            className="w-full h-16 rounded-2xl bg-[var(--primary)] text-white text-xl uppercase font-anton font-semibold shadow-sm flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            COMPLETE REVIEW
          </motion.button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center w-full h-full"
        >
          <div className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-xs font-bold mb-6 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Đã đánh giá thành công
          </div>

          {/* Submitted Profile Card */}
          <div className="relative w-28 h-28 mb-3">
            <div className="w-full h-full rounded-full overflow-hidden relative z-10 bg-gray-50 border-4 border-white shadow-md">
              <ImageWithFallback src={driver.profilePhoto} alt={driver.name} fill className="object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 z-20 bg-[#E31C5F] text-white p-1.5 rounded-full shadow-md border-2 border-white">
              <Star className="w-4 h-4 fill-white" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">{driver.name}</h2>
          <div className="text-xs font-medium text-gray-500 mb-6">{driverRating}/5 Sao</div>

          {/* Review Content */}
          <div className="bg-gray-50 rounded-2xl p-6 w-full text-left relative mt-auto mb-auto">
            <Quote className="w-8 h-8 text-gray-200 absolute -top-3 -left-2 fill-gray-200" />
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < driverRating ? 'fill-[var(--primary)] text-[var(--primary)]' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-[#1A1A1A] text-sm italic leading-relaxed">
              &quot;{driverComment || "Không có nhận xét"}&quot;
            </p>
          </div>

          <button className="text-gray-400 text-xs font-medium hover:text-gray-600 mt-6">
            Chỉnh sửa đánh giá
          </button>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="flex h-full items-start overflow-hidden pt-4">
      {/* Left Column - Restaurant Review */}
      <div
        className="flex-1 h-full overflow-y-auto p-4 pl-12 pr-6"
        style={{ scrollbarWidth: "none" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isRestaurantSubmitted ? "submitted" : "form"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            {renderRestaurantCard(isRestaurantSubmitted)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-[1px] h-[90%] my-auto bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-60 flex-shrink-0" />

      {/* Right Column - Driver Review */}
      <div
        className="flex-1 h-full overflow-y-auto p-4 pl-6 pr-12"
        style={{ scrollbarWidth: "none" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isDriverSubmitted ? "submitted" : "form"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            {renderDriverCard(isDriverSubmitted)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
