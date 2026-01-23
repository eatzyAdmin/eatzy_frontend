"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImageWithFallback, RestaurantDetailShimmer, FloatingRestaurantCartShimmer } from "@repo/ui";
import { ChevronLeft, ChevronRight, Star, MapPin, ArrowLeft, Plus, Minus, CheckCircle2 } from "@repo/ui/icons";
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
  } = useRestaurantWithMenu(params.slug);

  // Sort categories by displayOrder
  const categories: MenuCategory[] = useMemo(() =>
    [...(apiCategories || [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [apiCategories]
  );

  // Get dishes for a specific category
  const getDishesByCategoryId = (categoryId: string): Dish[] => {
    return apiDishes.filter(dish => dish.menuCategoryId === categoryId);
  };

  // Hide global loader when finished
  useEffect(() => {
    if (!isApiLoading) {
      hide();
    }
  }, [hide, isApiLoading]);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(categories[0]?.id ?? null);
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
  const { containerRef: menuContainerRef, rect: menuRect, style: menuStyle, moveHighlight: menuMove, clearHover: menuClear } = useHoverHighlight<HTMLDivElement>();
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
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 md:top-24 md:left-6 z-50 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white hover:scale-110 transition-all flex items-center justify-center group"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
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
              <div ref={leftColumnRef} className="relative md:overflow-y-auto no-scrollbar md:pr-2 space-y-6 mb-0 md:mb-12 shrink-0 px-4 pt-[60px] md:px-0 md:pt-0">

                {/* Mobile Hero Image - Artistic Blend */}
                <div className="absolute top-0 left-0 w-full h-[160px] z-0 md:hidden border-none outline-none ring-0 -mb-1">
                  <div className="relative w-full h-full overflow-hidden">
                    <ImageWithFallback src={restaurant.imageUrl || "https://placehold.co/600x400?text=Restaurant"} alt={restaurant.name} fill className="object-cover" />
                    {/* Gradient for text blend */}
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F7F7F7] via-[#F7F7F7]/80 to-transparent" />
                    {/* Top gradient for header visibility */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (numericRestaurantId) toggleFavorite(numericRestaurantId);
                      }}
                      disabled={isMutating}
                      className={`absolute top-4 right-4 backdrop-blur-md border px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all active:scale-95 ${favorited ? 'bg-[#FFC107] border-yellow-200 text-white' : 'bg-white/20 border-white/30 text-white'
                        }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${favorited ? 'fill-white' : 'fill-white/80'}`} />
                      <span className="text-[12px] font-bold uppercase tracking-wide">
                        {favorited ? 'Saved' : 'Save'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Restaurant Title & Info */}
                <div className="relative z-10">
                  <div className="flex gap-4 items-start md:block">
                    {/* Small Image - Mobile Only */}
                    <div className="shrink-0 w-[120px] h-[120px] rounded-[20px] overflow-hidden shadow-lg border-2 border-gray-200 md:hidden relative bg-gray-100">
                      <ImageWithFallback src={restaurant.imageUrl || "https://placehold.co/400x400?text=Restaurant"} alt={restaurant.name} fill className="object-cover" />
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
                            className="flex items-center gap-0.5 bg-yellow-50 pl-2 pr-1.5 py-1 rounded-lg border border-yellow-100 active:scale-95 transition-transform"
                          >
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                            <span className="text-[13px] font-bold text-[#1A1A1A]">{restaurant.rating}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                        )}
                        {restaurant.address && (
                          <div className="flex items-center gap-1 text-[12px] text-[#555555] line-clamp-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{restaurant.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Desktop only Address/Rating placement fallback if needed, but we can share structure if careful. 
                          For Desktop, we usually want these elements separate.
                          Let's hide the mobile specific rating/address block above on desktop, and keep the original desktop structure below.
                       */}
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

                {/* Rating - Desktop Position (Hidden on Mobile now) */}
                <div className="hidden md:flex items-center gap-10 relative z-10 mt-4 md:mt-0">
                  {restaurant.rating && (
                    <button
                      onClick={() => setIsReviewsOpen(true)}
                      className="group bg-white border border-gray-200 shadow-sm rounded-full pl-2 pr-4 py-1.5 hover:shadow-md hover:border-gray-300 active:scale-95 transition-all duration-300 flex items-center gap-2"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50 group-hover:scale-110 transition-transform">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[16px] font-bold text-[#1A1A1A]">{restaurant.rating}</span>
                        <span className="text-[13px] font-medium text-gray-500 group-hover:text-gray-900 transition-colors">Xem đánh giá</span>
                      </div>
                    </button>
                  )}
                </div>


                {/* Small illustration image - Desktop only */}
                <div className="hidden md:block rounded-[24px] overflow-hidden">
                  <div className="relative aspect-[16/11]">
                    <ImageWithFallback
                      src={restaurant.imageUrl || "https://placehold.co/600x400?text=Restaurant"}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Main Image & Menu (Scrollable independently on desktop) */}
              <div ref={rightColumnRef} className="relative md:overflow-y-auto no-scrollbar md:pl-2 mb-12 shrink-0 px-4 md:px-0">
                {/* Main Hero Image with Save Button - Desktop Only */}
                <div className="hidden md:block relative mb-6">
                  <div className="relative aspect-[16/8] rounded-[24px] overflow-hidden shadow-md bg-white">
                    <ImageWithFallback
                      src={restaurant.imageUrl || "https://placehold.co/600x400?text=Restaurant"}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (numericRestaurantId) toggleFavorite(numericRestaurantId);
                    }}
                    disabled={isMutating}
                    className={`absolute top-4 right-4 z-20 px-4 py-2 rounded-[12px] shadow-lg border-2 flex items-center gap-2 transition-all active:scale-95 ${favorited
                      ? 'bg-[#FFC107] hover:bg-[#FFB300] text-white border-yellow-200'
                      : 'bg-[#28A745] hover:bg-[#218838] text-white border-white/80'
                      }`}
                  >
                    <Star className={`w-4 h-4 ${favorited ? 'fill-white' : 'fill-none'}`} />
                    <span className="text-[14px] font-medium uppercase tracking-wide">
                      {favorited ? 'Saved to Favorites' : 'Save to Favorites'}
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
                    <AnimatePresence>
                      {canRight && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            tabsRef.current?.scrollBy({
                              left: 240,
                              behavior: "smooth",
                            })
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hidden md:flex"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-700" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div ref={menuContainerRef} className="relative space-y-8 px-0 md:px-4">
                  {categories.map((c) => {
                    const dishes: Dish[] = getDishesByCategoryId(c.id);
                    return (
                      <section
                        key={c.id}
                        ref={(el) => { sectionRefs.current[c.id] = el; }}
                        data-id={c.id}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-[20px] md:text-[24px] font-bold text-[#1A1A1A] uppercase tracking-wide">
                            {c.name}
                          </h2>
                          <div className="text-[12px] text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 font-medium">
                            {dishes.length} items
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                          {dishes.map((d) => {
                            const count = getDishCount(d.id);
                            const cartItem = getCartItemForDish(d.id);
                            const variantGroup = (d.optionGroups ?? []).find((g) => String(g.title || '').toLowerCase().startsWith('variant')) || null;
                            const minPrice = variantGroup && Array.isArray(variantGroup.options) && variantGroup.options.length > 0
                              ? (Number(d.price || 0) + Math.min(...(variantGroup.options ?? []).map((v) => Number(v.price || 0))))
                              : Number(d.price || 0);
                            return (
                              <div
                                key={d.id}
                                className="group relative bg-white rounded-[16px] md:rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                                onClick={() => {
                                  setDrawerDish(d);
                                  setDrawerOpen(true);
                                }}
                                onMouseEnter={(e) =>
                                  menuMove(e, {
                                    borderRadius: 24,
                                    backgroundColor: "rgba(0,0,0,0.04)",
                                    opacity: 1,
                                    scaleEnabled: true,
                                    scale: 1.02,
                                  })
                                }
                                onMouseMove={(e) =>
                                  menuMove(e, {
                                    borderRadius: 24,
                                    backgroundColor: "rgba(0,0,0,0.04)",
                                    opacity: 1,
                                    scaleEnabled: true,
                                    scale: 1.02,
                                  })
                                }
                                onMouseLeave={menuClear}
                              >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                  <ImageWithFallback
                                    src={d.imageUrl}
                                    alt={d.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                  />
                                  {d.isAvailable === false && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white text-sm font-bold uppercase tracking-widest">
                                      Hết hàng
                                    </div>
                                  )}
                                  <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
                                    {count > 0 ? (
                                      <motion.div
                                        layoutId={`item-${d.id}-btn`}
                                        className="rounded-full bg-white/90 backdrop-blur text-[#1A1A1A] shadow-lg flex items-center gap-1 md:gap-2 px-1 py-1 h-8 md:h-10 border border-gray-100"
                                      >
                                        <button
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            if (cartItem) {
                                              if (cartItem.quantity <= 1) {
                                                await removeCartItem(cartItem.id);
                                              } else {
                                                await updateItemQuantity(cartItem.id, cartItem.quantity - 1);
                                              }
                                            }
                                          }}
                                          className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        >
                                          <Minus className="w-3 h-3 md:w-4 md:h-4" />
                                        </button>
                                        <span className="text-xs md:text-sm font-bold min-w-[16px] md:min-w-[20px] text-center">
                                          {count}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDrawerDish(d);
                                            setDrawerOpen(true);
                                          }}
                                          className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[var(--primary)] text-white hover:brightness-110 flex items-center justify-center shadow-md shadow-[var(--primary)]/30 transition-all"
                                        >
                                          <Plus className="w-3 h-3 md:w-4 md:h-4" />
                                        </button>
                                      </motion.div>
                                    ) : (
                                      <motion.button
                                        layoutId={`item-${d.id}-btn`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDrawerDish(d);
                                          setDrawerOpen(true);
                                        }}
                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-[#1A1A1A] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
                                      >
                                        <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:text-[var(--primary)] transition-colors" />
                                      </motion.button>
                                    )}
                                  </div>
                                </div>
                                <div className="p-3 md:p-5">
                                  <div className="flex justify-between items-start gap-2 mb-1 md:mb-2">
                                    <h3 className="font-bold text-[15px] md:text-[17px] text-[#1A1A1A] leading-snug line-clamp-2">
                                      {d.name}
                                    </h3>
                                  </div>
                                  <p className="text-[12px] md:text-[13px] text-gray-500 line-clamp-2 mb-2 md:mb-4 min-h-[2.5em] leading-relaxed">
                                    {d.description}
                                  </p>
                                  <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-gray-50">
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-[16px] md:text-[18px] font-bold text-[var(--primary)]">
                                        {formatVnd(minPrice)}
                                      </span>
                                    </div>
                                    <div className="hidden md:block text-[12px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                                      Còn {d.availableQuantity}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                  <HoverHighlightOverlay rect={menuRect} style={menuStyle} />
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
