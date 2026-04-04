"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ArrowLeft, Star, Heart, CheckCircle2, ChevronRight, ChevronLeft, Store, Truck } from "@repo/ui/icons";
import { useOrderDetail } from "@/features/orders/hooks/useOrderDetail";
import { useReview } from "@/features/orders/hooks/useReview";
import { RestaurantReviewCard } from "@/features/orders/components/order-review/RestaurantReviewCard";
import { DriverReviewCard } from "@/features/orders/components/order-review/DriverReviewCard";
import { RestaurantReviewShimmer } from "@/features/orders/components/order-review/RestaurantReviewShimmer";
import { DriverReviewShimmer } from "@/features/orders/components/order-review/DriverReviewShimmer";
import { OrderReviewTabShimmer } from "@repo/ui";
import { useLoading, PullToRefresh } from "@repo/ui";

export default function OrderReviewPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);
  const { hide } = useLoading();

  const [activeTab, setActiveTab] = useState<'restaurant' | 'driver'>('restaurant');

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Auto-select tab if one is reviewed
  useEffect(() => {
    if (isReviewsLoading) return;
    if (isRestaurantReviewed && !isDriverReviewed) {
      setActiveTab('driver');
    } else if (!isRestaurantReviewed && isDriverReviewed) {
      setActiveTab('restaurant');
    }
  }, [isRestaurantReviewed, isDriverReviewed, isReviewsLoading]);

  const isLoading = isOrderLoading || isReviewsLoading || !order;

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] overflow-hidden">
      {/* Header - Exactly like Favorites Page */}
      <PullToRefresh
        id="review-scroll-container"
        onRefresh={async () => {
          if (orderId) await fetchOrder(orderId);
        }}
        disabled={!isMobile}
        className="flex-1 no-scrollbar"
        pullText="Kéo để làm mới"
        releaseText="Thả tay để làm mới"
        refreshingText="Đang làm mới"
      >
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
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center z-20 group flex-shrink-0"
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

          {/* Review Cards Area */}
          <div className="mx-auto w-full md:block">
            {isLoading ? (
              <div className="w-full">
                {/* DESKTOP LOADING: Dual-column Grid */}
                <div className="hidden md:block max-w-[1200px] mx-auto px-8 py-10">
                  <div className="grid grid-cols-2 gap-12 items-stretch">
                    <RestaurantReviewShimmer />
                    <DriverReviewShimmer />
                  </div>
                </div>

                {/* MOBILE LOADING: Focused Shimmer Area (Vertically Centered) */}
                <div className="md:hidden min-h-[calc(100vh-250px)] flex flex-col justify-center">
                  <div className="px-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {activeTab === 'restaurant' ? (
                          <RestaurantReviewShimmer />
                        ) : (
                          <DriverReviewShimmer />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                {/* DESKTOP VIEW: Dual-column Grid (md and up) */}
                <div className="hidden md:block max-w-[1200px] mx-auto px-8">
                  <div className="grid grid-cols-2 gap-12 items-stretch">
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

                  {/* Desktop Bottom Note */}
                  <div className="my-12 flex flex-col items-center text-center opacity-30">
                    <CheckCircle2 className="w-8 h-8 text-gray-500 mb-4" />
                    <span className="text-sm font-bold max-w-xs leading-relaxed">
                      Your feedback helps us maintain high quality standards for the Eatzy community
                    </span>
                  </div>
                </div>

                {/* MOBILE VIEW: BottomNav-style Carousel (Vertically Centered) */}
                <div className="md:hidden min-h-[calc(100vh-250px)] flex flex-col justify-center">
                  {/* Fixed Bottom Switcher */}
                  <div className="fixed bottom-2 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="pointer-events-auto backdrop-blur-xl bg-white/40 border border-white/40 rounded-[32px] px-3 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.15)] border-white/20 flex items-center justify-center gap-1.5"
                    >
                      {/* Restaurant Tab Item */}
                      <motion.button
                        key="orders-mobile"
                        initial={false}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 180, damping: 10 }}
                        onClick={() => setActiveTab('restaurant')}
                        className="flex flex-col items-center justify-center outline-none select-none h-[60px] min-w-[64px]"
                      >
                        <div className={`flex items-center justify-center rounded-full transition-all duration-300 relative z-10 w-12 h-12
                                ${activeTab === 'restaurant'
                            ? "bg-black text-white shadow-md scale-110"
                            : "text-gray-400 active:bg-gray-200/50 active:scale-95"
                          }`}
                        >
                          <div className="relative">
                            <Store className="w-6 h-6" strokeWidth={2.5} />
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold whitespace-nowrap text-gray-400 relative z-20 transition-all duration-300 ${activeTab === 'restaurant' ? 'mt-1' : 'mt-[-5px]'}`}>
                          Cửa hàng
                        </span>
                      </motion.button>

                      {/* Driver Tab Item */}
                      <motion.button
                        key="driver-mobile"
                        initial={false}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 180, damping: 10 }}
                        onClick={() => setActiveTab('driver')}
                        className="flex flex-col items-center justify-center outline-none select-none h-[60px] min-w-[64px]"
                      >
                        <div className={`flex items-center justify-center rounded-full transition-all duration-300 relative z-10 w-12 h-12
                                ${activeTab === 'driver'
                            ? "bg-black text-white shadow-md scale-110"
                            : "text-gray-400 active:bg-gray-200/50 active:scale-95"
                          }`}
                        >
                          <div className="relative">
                            <Truck className="w-6 h-6" strokeWidth={2.5} />
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold whitespace-nowrap text-gray-400 relative z-20 transition-all duration-300 ${activeTab === 'driver' ? 'mt-1' : 'mt-[-5px]'}`}>
                          Tài xế
                        </span>
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Shadow-safe Locked Carousel (Individual card centering) */}
                  <div className="-mx-4 px-4 -my-20 py-20 overflow-hidden touch-none">
                    <motion.div
                      animate={{ x: activeTab === 'restaurant' ? "0%" : "calc(-100% - 40px)" }}
                      transition={{ type: "spring", stiffness: 280, damping: 32 }}
                      className="flex gap-[40px] items-center"
                    >
                      {/* Restaurant Page Section */}
                      <div className="w-full flex-shrink-0 px-0">
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

                      {/* Driver Page Section */}
                      <div className="w-full flex-shrink-0 px-0">
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
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </PullToRefresh>

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
