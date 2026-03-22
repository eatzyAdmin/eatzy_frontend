"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ArrowLeft, Star, Heart, CheckCircle2, ChevronRight, Store } from "@repo/ui/icons";
import { useOrderDetail } from "@/features/orders/hooks/useOrderDetail";
import { useReview } from "@/features/orders/hooks/useReview";
import { RestaurantReviewCard } from "@/features/orders/components/order-review/RestaurantReviewCard";
import { DriverReviewCard } from "@/features/orders/components/order-review/DriverReviewCard";
import { OrderReviewTabShimmer } from "@repo/ui";
import { useLoading } from "@repo/ui";

export default function OrderReviewPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);
  const { hide } = useLoading();

  const { order, isLoading: isOrderLoading, fetchOrder } = useOrderDetail();

  useEffect(() => {
    hide();
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId, fetchOrder, hide]);

  const restaurant = order?.restaurant;
  const driver = order?.driver;

  const {
    restaurantReview,
    driverReview,
    isLoading: isReviewsLoading,
    isRestaurantReviewed,
    isDriverReviewed,
    handleReviewRestaurant,
    handleReviewDriver,
    isSubmitting,
  } = useReview(orderId, restaurant?.imageUrl, driver?.avatarUrl);

  const [restaurantRating, setRestaurantRating] = useState(0);
  const [restaurantComment, setRestaurantComment] = useState("");
  const [driverRating, setDriverRating] = useState(0);
  const [driverComment, setDriverComment] = useState("");

  const [hoveredRestaurantRating, setHoveredRestaurantRating] = useState(0);
  const [hoveredDriverRating, setHoveredDriverRating] = useState(0);

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll handler for header visibility
  useEffect(() => {
    const container = document.getElementById('review-scroll-container');
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      const isMobile = window.innerWidth < 768;

      if (direction === 'down' && currentScrollY > 20) {
        setIsHeaderVisible(false);
        // Dispatch event for layout header if any
        window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: false } }));
      } else {
        setIsHeaderVisible(true);
        window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: true } }));
      }
      setLastScrollY(currentScrollY);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Sync existing reviews to local state when they load
  useEffect(() => {
    if (restaurantReview) {
      setRestaurantRating(restaurantReview.rating);
      setRestaurantComment(restaurantReview.comment || "");
    }
    if (driverReview) {
      setDriverRating(driverReview.rating);
      setDriverComment(driverReview.comment || "");
    }
  }, [restaurantReview, driverReview]);

  const isLoading = isOrderLoading || isReviewsLoading || !order;

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] overflow-hidden">
      {/* Header - Exactly like Favorites Page */}
      <div id="review-scroll-container" className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-[1400px] mx-auto px-3 md:px-4 md:px-8">
          <motion.div
            initial={false}
            animate={{
              y: isHeaderVisible ? 0 : -20,
              opacity: isHeaderVisible ? 1 : 0,
              scale: isHeaderVisible ? 1 : 0.95
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`flex items-center gap-4 py-3 md:py-6 pb-2 md:pt-20 transition-all duration-300 ${!isHeaderVisible ? 'pointer-events-none' : ''}`}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.back()}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center group flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
            </motion.button>
            <div>
              <h1
                className="text-[32px] md:text-[56px] font-bold leading-tight text-[#1A1A1A] uppercase"
                style={{
                  fontStretch: "condensed",
                  letterSpacing: "-0.01em",
                  fontFamily: "var(--font-anton), var(--font-sans)",
                }}
              >
                Rate Your Experience
              </h1>
              <p className="text-sm font-medium md:text-base text-gray-500 mt-1">
                {order ? `Share your feedback about #${order.id}` : "Loading order details..."}
              </p>
            </div>
          </motion.div>

          <div className="h-px w-full my-3 md:my-4" />

          {/* Review Cards Grid */}
          <div className="pb-24 max-w-5xl mx-auto">
            {isLoading ? (
              <div className="py-10">
                <OrderReviewTabShimmer />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
                  <div className="w-full h-full flex flex-col">

                    <RestaurantReviewCard
                      restaurant={restaurant}
                      isReviewed={isRestaurantReviewed}
                      rating={restaurantRating}
                      setRating={setRestaurantRating}
                      hoveredRating={hoveredRestaurantRating}
                      setHoveredRating={setHoveredRestaurantRating}
                      comment={restaurantComment}
                      setComment={setRestaurantComment}
                      onSubmit={handleReviewRestaurant}
                      isSubmitting={isSubmitting}
                    />
                  </div>

                  <div className="w-full h-full flex flex-col">
                    <DriverReviewCard
                      driver={driver}
                      isReviewed={isDriverReviewed}
                      rating={driverRating}
                      setRating={setDriverRating}
                      hoveredRating={hoveredDriverRating}
                      setHoveredRating={setHoveredDriverRating}
                      comment={driverComment}
                      setComment={setDriverComment}
                      onSubmit={handleReviewDriver}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                </div>

                {/* Bottom Note */}
                <div className="mt-20 flex flex-col items-center text-center opacity-30">
                  <CheckCircle2 className="w-8 h-8 text-gray-500 mb-4" />
                  <span className="text-sm font-bold max-w-xs leading-relaxed">
                    Your feedback helps us maintain high quality standards for the Eatzy community
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
