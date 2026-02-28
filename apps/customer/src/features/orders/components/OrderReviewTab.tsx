import { useState, useEffect } from "react";
import { OrderReviewTabShimmer } from "@repo/ui";
import type { OrderResponse } from "@repo/types";
import { useReview } from "@/features/orders/hooks/useReview";
import { RestaurantReviewCard } from "./order-review/RestaurantReviewCard";
import { DriverReviewCard } from "./order-review/DriverReviewCard";
import { MobileCarousel } from "./MobileCarousel";

interface OrderReviewTabProps {
  order: OrderResponse;
  driver: OrderResponse['driver'];
  restaurant: OrderResponse['restaurant'];
}

export default function OrderReviewTab({
  order,
  driver,
  restaurant,
}: OrderReviewTabProps) {
  const {
    restaurantReview,
    driverReview,
    isLoading,
    isRestaurantReviewed,
    isDriverReviewed,
    handleReviewRestaurant,
    handleReviewDriver,
    isSubmitting,
  } = useReview(order.id, restaurant.imageUrl, driver?.avatarUrl);

  const [restaurantRating, setRestaurantRating] = useState(0);
  const [restaurantComment, setRestaurantComment] = useState("");
  const [driverRating, setDriverRating] = useState(0);
  const [driverComment, setDriverComment] = useState("");

  const [hoveredRestaurantRating, setHoveredRestaurantRating] = useState(0);
  const [hoveredDriverRating, setHoveredDriverRating] = useState(0);

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

  if (isLoading) {
    return <OrderReviewTabShimmer />;
  }

  return (
    <div className="pb-12 w-full max-w-7xl mx-auto px-4 relative overflow-hidden">

      {/* Desktop Layout - 2 Columns */}
      <div className="hidden md:flex flex-row items-stretch justify-center gap-8 md:gap-12 relative z-10">
        <div className="w-full max-w-[440px] shrink-0">
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
        <div className="w-full max-w-[440px] shrink-0">
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

      {/* Mobile Layout - Swipeable Carousel */}
      <div className="md:hidden">
        <MobileCarousel>
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
        </MobileCarousel>
      </div>
    </div>
  );
}
