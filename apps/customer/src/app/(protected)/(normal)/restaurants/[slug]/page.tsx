"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImageWithFallback, RestaurantDetailShimmer, FloatingRestaurantCartShimmer } from "@repo/ui";
import { ChevronLeft, ChevronRight, Star, MapPin, ArrowLeft, Plus, Minus, CheckCircle2, Loader2 } from "@repo/ui/icons";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useLoading, useHoverHighlight, HoverHighlightOverlay, useFlyToCart, FlyToCartLayer } from "@repo/ui";
import type { Restaurant, Dish, MenuCategory } from "@repo/types";
import { useRestaurantCart } from "@/features/cart/hooks/useCart";
import { formatVnd } from "@repo/lib";
import { useRestaurantWithMenu } from "@/features/restaurant";
import DishCustomizeDrawer from "@/features/cart/components/DishCustomizeDrawer";
import { ReviewsModal } from "@/features/search/components/ReviewsModal";
import FloatingRestaurantCart from "@/features/cart/components/FloatingRestaurantCart";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import DishCard from "@/features/restaurant/components/DishCard";

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
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const rightColumnRef = useRef<HTMLDivElement | null>(null);
  const leftColumnRef = useRef<HTMLDivElement | null>(null);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  // Cart API hook - will be initialized after restaurant data loads
  const numericRestaurantId = restaurant ? Number(restaurant.id) : null;
  const { addToCart, cartItems, updateItemQuantity, removeItem: removeCartItem, isAddingToCart } = useRestaurantCart(numericRestaurantId);
  const { isFavorite, toggleFavorite, isMutating } = useFavorites();
  const favorited = numericRestaurantId ? isFavorite(numericRestaurantId) : false;


  // Helper to get count of a dish in cart
  const getDishCount = (dishId: string): number => {
    return cartItems
      .filter((item) => String(item.dish.id) === dishId)
      .reduce((sum: number, item) => sum + item.quantity, 0);
  };

  // Helper to get cart item for a dish
  const getCartItemForDish = (dishId: string) => {
    return cartItems.find((item) => String(item.dish.id) === dishId);
  };
  const { containerRef: catContainerRef, rect: catRect, style: catStyle, moveHighlight: catMove, clearHover: catClear } = useHoverHighlight<HTMLDivElement>();
  const { ghosts, fly } = useFlyToCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDish, setDrawerDish] = useState<Dish | null>(null);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const update = () => {
      setCanLeft(el.scrollLeft > 4);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [categories.length]);

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
        rootMargin: "-120px 0px -60% 0px",
        threshold: 0.1
      }
    );
    categories.forEach((c) => {
      const node = sectionRefs.current[c.id];
      if (node) obs.observe(node);
    });
    return () => obs.disconnect();
  }, [categories]);

  useEffect(() => {
    const rightCol = rightColumnRef.current;
    if (!rightCol) return;

    const handleScroll = () => {
      setIsTabsSticky(rightCol.scrollTop > 400);
    };

    rightCol.addEventListener('scroll', handleScroll, { passive: true });
    return () => rightCol.removeEventListener('scroll', handleScroll);
  }, []);



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

  const scrollToCategory = (id: string) => {
    const node = sectionRefs.current[id];
    const rightCol = rightColumnRef.current;
    const mobileContainer = document.getElementById("mobile-scroll-container");
    const isMobile = window.innerWidth < 768;
    const container = isMobile ? mobileContainer : rightCol;

    if (!node || !container) return;

    const containerRect = container.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    // 180 = Header offset + Tabs height approx
    const offsetTop = nodeRect.top - containerRect.top + container.scrollTop - (isMobile ? 180 : 140);

    container.scrollTo({ top: offsetTop, behavior: "smooth" });
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] overflow-hidden">
      <FlyToCartLayer ghosts={ghosts} />
      {/* Back button - Fixed position */}
      {/* Mobile Back Button - Strictly md:hidden */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-40 w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl shadow-md border border-gray-100 md:hidden flex items-center justify-center group active:scale-95 transition-all"
      >
        <ChevronLeft className="w-6 h-6 text-[#1A1A1A]" />
      </button>

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
              <div ref={leftColumnRef} className="relative md:overflow-y-auto no-scrollbar md:pr-2 space-y-6 mb-0 md:mb-6 shrink-0 px-4 pt-[60px] md:px-0 md:pt-0">

                {/* Mobile Hero Image - Artistic Blend */}
                <div className="absolute top-0 left-0 w-full h-[160px] z-0 md:hidden border-none outline-none ring-0 -mb-1">
                  <div className="relative w-full h-full overflow-hidden">
                    <ImageWithFallback src={detail?.coverImageUrl || "https://placehold.co/600x400?text=Restaurant"} alt={restaurant.name} fill placeholderMode="horizontal" className="object-cover" />

                    {/* Gradient for text blend */}
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F7F7F7] via-[#F7F7F7]/80 to-transparent" />

                    {/* Save Button for Mobile */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (numericRestaurantId) toggleFavorite(numericRestaurantId);
                      }}
                      disabled={isMutating}
                      className={`absolute top-4 right-4 z-10 backdrop-blur-xl border-2 px-4 py-2 rounded-[20px] shadow-2xl flex items-center gap-2 transition-all active:scale-95 ${favorited
                        ? 'bg-[#1A1A1A] border-white/10 text-white'
                        : 'bg-black/30 border-white/30 text-white shadow-black/20'
                        }`}
                    >
                      {isMutating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Star className={`w-4 h-4 transition-transform ${favorited ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
                      )}
                      <span className="text-[11px] font-anton uppercase tracking-widest pt-0.5">
                        {favorited ? 'Saved' : 'Save'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Restaurant Title & Info */}
                <div className="relative z-10">
                  <div className="flex gap-4 items-start md:block pb-2">
                    {/* Small Image - Mobile Only - Fixed clipping */}
                    <div className="shrink-0 w-[120px] h-[120px] rounded-[30px] shadow-md border-4 border-white md:hidden relative bg-white overflow-visible">
                      <div className="absolute inset-0 rounded-[28px] overflow-hidden">
                        <ImageWithFallback src={detail?.avatarUrl} alt={restaurant.name} fill placeholderMode="vertical" className="object-cover" />
                      </div>
                    </div>


                    {/* Text Content */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2 md:gap-0">
                      <h1
                        className="text-[24px] md:text-[62px] font-bold leading-[1.1] text-[#1A1A1A] md:mb-3 md:drop-shadow-none"
                        style={{
                          fontStretch: "condensed",
                          letterSpacing: "-0.01em",
                          fontFamily: "var(--font-anton), var(--font-sans)",
                        }}
                      >
                        {restaurant.name.toUpperCase()}
                      </h1>

                      {restaurant.description && (
                        <p className="hidden md:block text-[14px] text-[#555555] leading-relaxed mb-4">{restaurant.description}</p>
                      )}

                      {restaurant.description && (
                        <p className="md:hidden text-[13px] text-[#555555] leading-snug line-clamp-2 mb-2">{restaurant.description}</p>
                      )}

                      {/* Rating Component - Moved Inside for Mobile */}
                      <div className="flex items-center gap-2 mt-1 md:hidden">
                        {restaurant.rating && (
                          <button
                            onClick={() => setIsReviewsOpen(true)}
                            className="flex items-center bg-lime-50 border border-lime-100 shadow-sm rounded-[14px] pl-1 pr-2 py-1 gap-2 active:scale-95 transition-transform"
                          >
                            <div className="w-6 h-6 rounded-[10px] bg-[#1A1A1A] flex items-center justify-center shadow-sm">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[15px] font-anton text-[#1A1A1A] leading-none pt-0.5">{restaurant.rating}</span>
                              <ChevronRight className="w-3 h-3 text-gray-300" />
                            </div>
                          </button>
                        )}
                        {restaurant.address && (
                          <div className="flex items-center gap-1 text-[12px] text-[#555555] line-clamp-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{restaurant.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Desktop only Address/Rating placement fallback if needed */}
                      <div className="hidden md:block">
                        {restaurant.address && (
                          <div className="flex items-start gap-2 text-[13px] text-[#555555] mb-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{restaurant.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating - Desktop Position - Premium Badge Style */}
                <div className="hidden md:flex items-center gap-10 relative z-10 mt-4 md:mt-0">
                  {restaurant.rating && (
                    <button
                      onClick={() => setIsReviewsOpen(true)}
                      className="group bg-white border-2 border-gray-50 shadow-sm rounded-[24px] pl-2 pr-5 py-2 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-300 flex items-center gap-3"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#1A1A1A] shadow-lg shadow-black/10 group-hover:scale-105 transition-transform">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex flex-col items-start -space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[20px] font-anton text-[#1A1A1A] leading-none tracking-tight">{restaurant.rating}</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded-md">Rating</span>
                        </div>
                        <span className="text-[13px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors">Xem đánh giá quán</span>
                      </div>
                      <div className="ml-1 w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  )}
                </div>


                {/* Small illustration image - Desktop only */}
                <div className="hidden md:block group relative rounded-[32px] shadow-sm md:rounded-[36px] overflow-hidden cursor-pointer">
                  <div className="relative aspect-[16/11]">
                    <ImageWithFallback
                      src={detail?.avatarUrl || "https://placehold.co/600x400?text=Restaurant"}
                      alt={restaurant.name}
                      fill
                      placeholderMode="vertical"
                      className="object-cover transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                </div>
              </div>

              {/* Right Column - Main Image & Menu (Scrollable independently on desktop) */}
              <div ref={rightColumnRef} className="relative md:overflow-y-auto no-scrollbar md:pl-2 shrink-0 px-3 md:px-0">
                {/* Main Hero Image with Save Button - Desktop Only */}
                <div className="hidden md:block relative mb-10">
                  <div className="relative aspect-[16/8] rounded-[32px] shadow-sm md:rounded-[40px] overflow-hidden group">
                    <ImageWithFallback
                      src={detail?.coverImageUrl || "https://placehold.co/600x400?text=Restaurant"}
                      alt={restaurant.name}
                      fill
                      placeholderMode="horizontal"
                      className="object-cover transition-transform duration-[1.5s]"
                    />
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (numericRestaurantId) toggleFavorite(numericRestaurantId);
                    }}
                    disabled={isMutating}
                    className={`absolute bottom-6 right-8 z-20 px-6 py-3 rounded-[24px] backdrop-blur-xl border-2 shadow-2xl flex items-center gap-3 transition-all active:scale-95 group/save ${favorited
                      ? 'bg-black/60 text-white border-white/20'
                      : 'bg-black/40 text-white border-white/20 hover:bg-black/60'
                      }`}
                  >
                    {isMutating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Star className={`w-5 h-5 transition-transform group-hover/save:scale-125 ${favorited ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                    )}
                    <span className="text-[15px] font-anton font-bold uppercase tracking-widest">
                      {favorited ? 'Saved' : 'Save Venue'}
                    </span>
                  </button>
                </div>

                {/* Category tabs - positioned here, sticky on scroll */}
                <div
                  className={`sticky top-0 z-40 bg-[#F7F7F7] mb-6 transition-all pt-6 md:pt-0 ${isTabsSticky ? "md:pt-4 md:-mt-4" : ""
                    }`}
                >
                  <div ref={catContainerRef} className="relative bg-[#F7F7F7] border-b-2 border-gray-300">
                    <HoverHighlightOverlay rect={catRect} style={catStyle} />
                    <div ref={tabsRef} className="overflow-x-auto no-scrollbar">
                      <div className="inline-flex items-center gap-8 px-6 py-4 min-w-full justify-start relative z-10">
                        {categories.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => scrollToCategory(c.id)}
                            className={`text-[20px] md:text-[28px] font-bold uppercase tracking-wide transition-all relative pb-1 whitespace-nowrap ${activeCategoryId === c.id
                              ? "text-[#1A1A1A]"
                              : "text-gray-400"
                              }`}
                            style={{
                              fontStretch: "condensed",
                              letterSpacing: "-0.01em",
                              fontFamily: "var(--font-anton), var(--font-sans)",
                            }}
                            onMouseEnter={(e) =>
                              catMove(e, {
                                borderRadius: 12,
                                backgroundColor: "rgba(0,0,0,0.06)",
                                opacity: 1,
                                scaleEnabled: true,
                                scale: 1.1,
                              })
                            }
                            onMouseMove={(e) =>
                              catMove(e, {
                                borderRadius: 12,
                                backgroundColor: "rgba(0,0,0,0.06)",
                                opacity: 1,
                                scaleEnabled: true,
                                scale: 1.1,
                              })
                            }
                            onMouseLeave={catClear}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Scroll indicators */}
                    <AnimatePresence>
                      {canLeft && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            tabsRef.current?.scrollBy({
                              left: -240,
                              behavior: "smooth",
                            })
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hidden md:flex"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-700" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="relative space-y-12 px-0 md:px-4">
                  {categories.map((c) => {
                    const dishes: Dish[] = getDishesByCategoryId(c.id);
                    return (
                      <section
                        key={c.id}
                        ref={(el) => { sectionRefs.current[c.id] = el; }}
                        data-id={c.id}
                      >
                        <div className="flex items-center justify-center gap-3 mb-6">
                          <h2 className="text-[20px] md:text-[24px] font-bold text-[#1A1A1A] uppercase tracking-wide font-anton">
                            {c.name}
                          </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                          {dishes.map((d) => {
                            const count = getDishCount(d.id);
                            const cartItem = getCartItemForDish(d.id);
                            return (
                              <DishCard
                                key={d.id}
                                dish={d}
                                count={count}
                                onAdd={() => {
                                  setDrawerDish(d);
                                  setDrawerOpen(true);
                                }}
                                onRemove={async () => {
                                  if (cartItem) {
                                    if (cartItem.quantity <= 1) {
                                      await removeCartItem(cartItem.id);
                                    } else {
                                      await updateItemQuantity(cartItem.id, cartItem.quantity - 1);
                                    }
                                  }
                                }}
                                onClick={() => {
                                  setDrawerDish(d);
                                  setDrawerOpen(true);
                                }}
                              />
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
                {/* End of list indicator */}
                <div className="py-12 flex items-center justify-center gap-4 opacity-60">
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <span className="text-[14px] font-bold text-gray-400 uppercase font-anton">End of list</span>
                  </div>
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
                </div>
              </div>
            </div>
          </div>
        </div >
      )
      }
      <DishCustomizeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        dish={drawerDish}
        onConfirm={async (payload, startRect) => {
          if (!drawerDish || !restaurant) return;

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
      {!isApiLoading && restaurant && <FloatingRestaurantCart restaurantId={restaurant.id} restaurantName={restaurant.name} />}
    </div >
  );
}
