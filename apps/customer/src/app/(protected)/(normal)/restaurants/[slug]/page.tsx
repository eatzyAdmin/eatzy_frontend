"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RestaurantDetailShimmer, FloatingRestaurantCartShimmer } from "@repo/ui";
import { ChevronLeft, ChevronRight, Star, MapPin, Loader2, Store, ArrowLeft } from "@repo/ui/icons";
import { RestaurantVouchers, MobileRestaurantVouchers } from "@/features/restaurant/components/RestaurantVouchers";
import { useRestaurantShippingInfo } from "@/features/restaurant/hooks/useRestaurantShippingInfo";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useLoading, useHoverHighlight, useFlyToCart, FlyToCartLayer } from "@repo/ui";
import type { Restaurant, Dish, MenuCategory } from "@repo/types";
import { useRestaurantCart } from "@/features/cart/hooks/useCart";
import { useRestaurantWithMenu } from "@/features/restaurant";
import DishCustomizeDrawer from "@/features/cart/components/DishCustomizeDrawer";
import { ReviewsModal } from "@/features/restaurant/components/ReviewsModal";
import FloatingRestaurantCart from "@/features/cart/components/FloatingRestaurantCart";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { RestaurantHeader } from "@/features/restaurant/components/RestaurantHeader";
import { RestaurantShipping } from "@/features/restaurant/components/RestaurantShipping";
import { RestaurantRating } from "@/features/restaurant/components/RestaurantRating";
import StoreClosedModal from "@/features/restaurant/components/StoreClosedModal";
import { RestaurantIllustration } from "@/features/restaurant/components/RestaurantIllustration";
import { RestaurantHero } from "@/features/restaurant/components/RestaurantHero";
import { RestaurantMenu } from "@/features/restaurant/components/RestaurantMenu";
import { RestaurantCategoryTabs } from "@/features/restaurant/components/RestaurantCategoryTabs";
import { MobileRestaurantHero } from "@/features/restaurant/components/MobileRestaurantHero";
import { MobileRestaurantAvatar } from "@/features/restaurant/components/MobileRestaurantAvatar";
import { sileo } from "@/components/DynamicIslandToast";
import { useDeliveryDistanceValidator } from "@/features/checkout/hooks/useDeliveryDistanceValidator";
import DistanceWarningModal from "@/features/checkout/components/DistanceWarningModal";

export default function RestaurantDetailPage() {
  const params = useParams() as { slug: string };
  const router = useRouter();
  const { hide } = useLoading();

  // Fetch restaurant detail and menu from API
  const {
    restaurant,
    categories: apiCategories,
    dishes: apiDishes,
    isLoading: isApiLoading,
    isError,
    detail,
  } = useRestaurantWithMenu(params.slug);

  // Sort categories by displayOrder and filter out empty ones
  const categories: MenuCategory[] = useMemo(() => {
    const sorted = [...(apiCategories || [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    return sorted.filter(cat => apiDishes?.some(dish => dish.menuCategoryId === cat.id));
  }, [apiCategories, apiDishes]);

  // Get dishes for a specific category
  const getDishesByCategoryId = (categoryId: string): Dish[] => {
    return apiDishes.filter(dish => dish.menuCategoryId === categoryId);
  };

  // Hide global loader when finished
  useEffect(() => {
    if (!isApiLoading) {
      const timer = setTimeout(() => {
        hide();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hide, isApiLoading]);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Sync active category when data loads
  useEffect(() => {
    if (!activeCategoryId && categories.length > 0) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const rightColumnRef = useRef<HTMLDivElement | null>(null);
  const leftColumnRef = useRef<HTMLDivElement | null>(null);

  // Cart API hook - will be initialized after restaurant data loads
  const numericRestaurantId = restaurant ? Number(restaurant.id) : null;
  const { addToCart, cartItems, updateItemQuantity, removeItem: removeCartItem, isAddingToCart, isUpdating } = useRestaurantCart(numericRestaurantId);
  const { isFavorite, toggleFavorite, isMutating } = useFavorites();
  const favorited = numericRestaurantId ? isFavorite(numericRestaurantId) : false;

  // Shipping info hook
  const {
    baseFee,
    finalFee,
    distance,
    minOrderForDiscount,
    hasFreeship,
    isLoading: isLoadingShipping,
    selectedLocation
  } = useRestaurantShippingInfo(numericRestaurantId);

  const {
    showWarning,
    setShowWarning,
    handleRestrictedAction,
    maxDistance,
    isOverDistance
  } = useDeliveryDistanceValidator(distance);


  const { ghosts, fly } = useFlyToCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDish, setDrawerDish] = useState<Dish | null>(null);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [showClosedModal, setShowClosedModal] = useState(false);

  // Handle Closed Modal vs Distance Warning Priority
  useEffect(() => {
    if (!isApiLoading && restaurant && restaurant.status !== 'OPEN') {
      setShowClosedModal(true);
      // Priority: Hide distance warning if store is closed
      if (showWarning) setShowWarning(false);
    }
  }, [restaurant?.status, isApiLoading, showWarning, setShowWarning]);

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    if (isApiLoading) return;
    
    // Use a small delay to ensure DOM is fully rendered after shimmer removal
    const timer = setTimeout(() => {
      const container = document.getElementById("mobile-scroll-container");
      if (!container) return;
      
      const handleScroll = () => {
        setScrollY(container.scrollTop);
      };
      
      container.addEventListener("scroll", handleScroll, { passive: true });
      // Initial sync
      handleScroll();
      
      return () => container.removeEventListener("scroll", handleScroll);
    }, 100);

    return () => clearTimeout(timer);
  }, [isApiLoading]);

  useEffect(() => {
    const rightCol = rightColumnRef.current;
    if (!rightCol) return;

    const isMobile = window.innerWidth < 768;
    const root = isMobile ? document.getElementById("mobile-scroll-container") : rightCol;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top));
        if (visible[0]) setActiveCategoryId(visible[0].target.getAttribute("data-id"));
      },
      {
        root: root,
        rootMargin: "-170px 0px -40% 0px", // Adjusted margin for sticky header
        threshold: 0.1
      }
    );
    categories.forEach((c) => {
      const node = sectionRefs.current[c.id];
      if (node) obs.observe(node);
    });
    return () => obs.disconnect();
  }, [categories]);


  // Show loading shimmer while fetching
  if (isApiLoading) {
    return <RestaurantDetailShimmer />;
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Không tìm thấy quán</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] overflow-hidden">
      <FlyToCartLayer ghosts={ghosts} />

      {/* Mobile Closed Fixed Drawer */}
      {restaurant.status !== 'OPEN' && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 w-full h-[72px] bg-red-600 z-[300] rounded-b-[30px] shadow-lg flex items-center justify-between px-4 pr-6 md:hidden"
        >
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-[14px] font-bold uppercase tracking-tight text-white drop-shadow-sm pt-0.5">
              Nhà hàng tạm đóng cửa
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Store size={18} strokeWidth={3} className="text-white" />
            </div>
          </div>
        </motion.div>
      )}

      <div
        className="fixed top-0 left-0 right-0 z-50 h-[56px] md:hidden pointer-events-none"
      >
        <motion.div
          style={{
            opacity: Math.min(scrollY / 100, 1),
          }}
          className="absolute inset-0 bg-[#F7F7F7]"
        />

        <div className="relative h-full flex items-center px-1">
          <motion.button
            onClick={() => router.back()}
            style={{
              opacity: Math.min(1, scrollY / 50),
              pointerEvents: scrollY > 0 ? "auto" : "none",
            }}
            className="w-10 h-10 flex items-center justify-center shrink-0"
          >
            <ArrowLeft className="w-6 h-6 text-[#1A1A1A]" />
          </motion.button>

          <motion.div
            style={{
              opacity: Math.max(0, (scrollY - 50) / 50),
              transform: `translateY(${Math.max(0, 4 - (scrollY - 50) / 10)})`,
            }}
            className="flex-1 min-w-0 pr-10 pointer-events-auto"
          >
            <h1
              className="text-[22px] font-black uppercase tracking-tight text-[#1A1A1A] line-clamp-1 text-center"
              style={{
                fontStretch: "condensed",
                letterSpacing: "-0.01em",
                fontFamily: "var(--font-anton), var(--font-sans)",
              }}
            >
              {restaurant.name}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Top Back Button (ChevronLeft) - Fades out on scroll */}
      <motion.button
        onClick={() => router.back()}
        style={{
          opacity: Math.max(0, 1 - scrollY / 50),
          pointerEvents: scrollY < 100 ? "auto" : "none",
        }}
        className={`fixed top-4 left-4 z-[60] w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl shadow-md border border-gray-100 md:hidden flex items-center justify-center group active:scale-95 transition-all ${restaurant.status !== 'OPEN' ? 'hidden' : ''}`}
      >
        <ChevronLeft className="w-6 h-6 text-[#1A1A1A]" />
      </motion.button>

      {/* Main Content - Two Column Layout */}
      {isApiLoading ? (
        <>
          <RestaurantDetailShimmer />
          <FloatingRestaurantCartShimmer />
        </>
      ) : (
        <div className="flex-1 overflow-hidden">
          <div className="max-w-[1400px] mx-auto md:pr-16 md:px-8 px-0 pt-0 pb-0 md:pt-20 md:pb-0 h-full">
            <div className="flex flex-col md:grid md:grid-cols-[30%_70%] md:gap-8 h-full overflow-y-auto md:overflow-visible no-scrollbar md:pb-0" id="mobile-scroll-container">
              <div ref={leftColumnRef} className="relative md:overflow-y-auto no-scrollbar md:pr-2 space-y-6 mb-0 shrink-0 px-4 pt-[60px] md:px-0 md:pt-0">

                {/* Mobile Hero Image - Artistic Blend */}
                <MobileRestaurantHero
                  coverImageUrl={detail?.coverImageUrl}
                  restaurantName={restaurant.name}
                  numericRestaurantId={numericRestaurantId}
                  favorited={favorited}
                  isMutating={isMutating}
                  onToggleFavorite={toggleFavorite}
                  status={restaurant.status}
                />

                {/* Restaurant Title & Info */}
                <div className="relative z-10">
                  <div className="flex gap-4 items-start md:block">
                    <MobileRestaurantAvatar
                      avatarUrl={detail?.avatarUrl}
                      restaurantName={restaurant.name}
                    />

                    <RestaurantHeader restaurant={restaurant}>
                      {/* Mobile Rating & Shipping - Nested inside to maintain correct column layout */}
                      <div className="flex items-center gap-2 mt-1 flex-nowrap overflow-x-auto no-scrollbar">
                        <RestaurantRating
                          rating={restaurant.rating}
                          variant="mobile-badge"
                          onClick={() => setIsReviewsOpen(true)}
                        />

                        <RestaurantShipping
                          isLoading={isLoadingShipping}
                          distance={distance}
                          baseFee={baseFee}
                          finalFee={finalFee}
                          hasFreeship={hasFreeship}
                          variant="mobile"
                          isOverDistance={isOverDistance}
                        />
                      </div>
                    </RestaurantHeader>

                    <RestaurantShipping
                      isLoading={isLoadingShipping}
                      distance={distance}
                      baseFee={baseFee}
                      finalFee={finalFee}
                      hasFreeship={hasFreeship}
                      variant="desktop"
                      isOverDistance={isOverDistance}
                    />
                  </div>

                  {/* Mobile Vouchers List */}
                  <div className="md:hidden mt-3 -mx-4 overflow-hidden">
                    <MobileRestaurantVouchers restaurantId={numericRestaurantId} />
                  </div>
                </div>

                <RestaurantIllustration
                  restaurant={restaurant}
                  avatarUrl={detail?.avatarUrl}
                  onRatingClick={() => setIsReviewsOpen(true)}
                />
              </div>

              {/* Right Column - Main Image & Menu (Scrollable independently on desktop) */}
              <div ref={rightColumnRef} className="relative md:overflow-y-auto no-scrollbar md:pl-2 shrink-0 px-1.5 md:px-0">
                {/* Main Hero Image with Save Button - Desktop Only */}
                <RestaurantHero
                  restaurant={restaurant}
                  coverImageUrl={detail?.coverImageUrl}
                  favorited={favorited}
                  isMutating={isMutating}
                  onToggleFavorite={toggleFavorite}
                />

                {/* Category tabs - positioned here, sticky on scroll */}
                <RestaurantCategoryTabs
                  categories={categories}
                  activeCategoryId={activeCategoryId}
                  sectionRefs={sectionRefs}
                  scrollContainerRef={rightColumnRef}
                />

                <RestaurantMenu
                  categories={categories}
                  allDishes={apiDishes}
                  cartItems={cartItems}
                  isUpdating={isUpdating}
                  sectionRefs={sectionRefs}
                  onDishClick={(d) => {
                    if (restaurant.status !== 'OPEN') {
                      sileo.error({
                        actionType: "store_closed",
                        description: restaurant.name,
                      });
                      return;
                    }
                    setDrawerDish(d);
                    setDrawerOpen(true);
                  }}
                  updateItemQuantity={updateItemQuantity}
                  removeItem={removeCartItem}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <DishCustomizeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        dish={drawerDish}
        onConfirm={async (payload, startRect) => {
          if (!drawerDish || !restaurant) return;

          // Check distance restriction
          if (handleRestrictedAction()) return;

          // Collect selected option IDs for API
          const selectedOptionIds: { id: number }[] = [];

          // Add variant option if selected
          if (payload.variant?.id) {
            selectedOptionIds.push({ id: Number(payload.variant.id) });
          }

          // Add addon options
          payload.addons.forEach(addon => {
            selectedOptionIds.push({ id: Number(addon.id) });
          });

          // Add options from groups
          payload.groups?.forEach(group => {
            group.options.forEach(opt => {
              selectedOptionIds.push({ id: Number(opt.id) });
            });
          });

          // Call API to add to cart
          const success = await addToCart(
            Number(drawerDish.id),
            payload.quantity,
            selectedOptionIds.length > 0 ? selectedOptionIds : undefined
          );

          if (success) {
            sileo.success({
              actionType: "cart_add",
              avatarUrl: drawerDish.imageUrl,
              description: drawerDish.name,
              dishOptions: [
                ...(payload.variant ? [payload.variant.name] : []),
                ...payload.addons.map(a => a.name)
              ]
            } as any);

            // Only after success, we start the drawer closing and then the animation
            setDrawerOpen(false);

            // Fly animation - trigger immediately as drawer starts closing
            // We use setTimeout to let the drawer start its exit animation
            setTimeout(() => {
              const endEl = document.getElementById("local-cart-fab") || document.getElementById("header-cart-button");
              if (startRect && endEl) {
                fly({
                  start: startRect,
                  end: endEl.getBoundingClientRect(),
                  imageUrl: drawerDish.imageUrl,
                });
              }
            }, 100);
          }
        }}
      />
      <ReviewsModal restaurant={restaurant} isOpen={isReviewsOpen} onClose={() => setIsReviewsOpen(false)} />
      {!isApiLoading && restaurant && restaurant.status === 'OPEN' && (
        <FloatingRestaurantCart
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
        />
      )}

      <DistanceWarningModal
        isOpen={showWarning && restaurant?.status === 'OPEN'}
        onClose={() => setShowWarning(false)}
        maxDistance={maxDistance}
        currentDistance={distance || 0}
        currentAddress={selectedLocation?.address}
        onSelectLocation={() => {
          setShowWarning(false);
          window.dispatchEvent(new CustomEvent('openLocationPicker'));
        }}
      />

      <StoreClosedModal
        isOpen={showClosedModal}
        onClose={() => setShowClosedModal(false)}
        restaurantName={restaurant?.name || ""}
      />
    </div>
  );
}
