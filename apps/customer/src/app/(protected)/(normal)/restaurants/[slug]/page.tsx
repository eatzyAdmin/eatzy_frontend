"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImageWithFallback } from "@repo/ui";
import { ChevronLeft, ChevronRight, Tag, Star, Clock, MapPin, ArrowLeft, ChefHat, Plus, Minus } from "@repo/ui/icons";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useLoading, useHoverHighlight, HoverHighlightOverlay, useFlyToCart, FlyToCartLayer } from "@repo/ui";
import type { Restaurant, Dish, MenuCategory, Voucher } from "@repo/types";
import { useCartStore } from "@repo/store";
import { formatVnd } from "@repo/lib";
import {
  getRestaurantBySlug,
  getDishesByMenuCategory,
  getMenuCategoriesForRestaurant,
  getVouchersForRestaurant,
} from "@/features/search/data/mockSearchData";
import DishCustomizeDrawer from "@/features/cart/components/DishCustomizeDrawer";

export default function RestaurantDetailPage() {
  const params = useParams() as { slug: string };
  const router = useRouter();
  const { hide } = useLoading();

  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);

  const restaurant: Restaurant | undefined = useMemo(() => getRestaurantBySlug(params.slug), [params.slug]);
  const categories: MenuCategory[] = useMemo(() => restaurant ? getMenuCategoriesForRestaurant(restaurant.id).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)) : [], [restaurant]);
  const vouchers: Voucher[] = useMemo(() => restaurant ? getVouchersForRestaurant(restaurant.id) : [], [restaurant]);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(categories[0]?.id ?? null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const rightColumnRef = useRef<HTMLDivElement | null>(null);
  const leftColumnRef = useRef<HTMLDivElement | null>(null);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const items = useCartStore((s) => s.items);
  const { addItem, setActiveRestaurant, removeItem } = useCartStore();
  const { containerRef: catContainerRef, rect: catRect, style: catStyle, moveHighlight: catMove, clearHover: catClear } = useHoverHighlight<HTMLDivElement>();
  const { containerRef: menuContainerRef, rect: menuRect, style: menuStyle, moveHighlight: menuMove, clearHover: menuClear } = useHoverHighlight<HTMLDivElement>();
  const { ghosts, fly } = useFlyToCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDish, setDrawerDish] = useState<Dish | null>(null);

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
    
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top));
        if (visible[0]) setActiveCategoryId(visible[0].target.getAttribute("data-id"));
      },
      { 
        root: rightCol,
        rootMargin: "-120px 0px -60% 0px", 
        threshold: 0.2 
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
    if (!node || !rightCol) return;
    
    const containerRect = rightCol.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const offsetTop = nodeRect.top - containerRect.top + rightCol.scrollTop - 140;
    
    rightCol.scrollTo({ top: offsetTop, behavior: "smooth" });
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7]">
      <FlyToCartLayer ghosts={ghosts} />
      {/* Back button - Fixed position */}
      <button
        onClick={() => router.back()}
        className="fixed top-24 left-6 z-50 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white hover:scale-110 transition-all flex items-center justify-center group"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
      </button>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1400px] mx-auto pr-16 px-8 pt-20 h-full">
            <div className="grid grid-cols-[30%_70%] gap-8 h-full">
            <div ref={leftColumnRef} className="relative overflow-y-auto no-scrollbar pr-2 space-y-6 mb-12">
              {/* Restaurant Title */}
              <div>
                <h1
                  className="text-[62px] font-bold leading-tight text-[#1A1A1A] mb-3"
                  style={{
                    fontStretch: "condensed",
                    letterSpacing: "-0.01em",
                    fontFamily: "var(--font-anton), var(--font-sans)",
                  }}
                >
                  {restaurant.name.toUpperCase()}
                </h1>
                {restaurant.description && (
                  <p className="text-[14px] text-[#555555] leading-relaxed mb-4">{restaurant.description}</p>
                )}

                {restaurant.categories && restaurant.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {restaurant.categories.map((cat) => (
                      <span
                        key={typeof cat === "string" ? cat : cat.id}
                        className="text-[12px] bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full shadow-sm"
                      >
                        {typeof cat === "string" ? cat : cat.name}
                      </span>
                    ))}
                  </div>
                )}

                {restaurant.address && (
                  <div className="flex items-start gap-2 text-[13px] text-[#555555] mb-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{restaurant.address}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-10">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#555555]" />
                  <span className="text-[14px] font-medium text-[#555555]">15 min.</span>
                </div>
                <div className="w-px h-5 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-[#555555]" />
                  <span className="text-[14px] font-medium text-[#555555]">Easy</span>
                </div>
              </div>

              {/* Small illustration image */}
              {restaurant.imageUrl && (
                <div className="rounded-[24px] overflow-hidden">
                  <div className="relative aspect-[16/11]">
                    <ImageWithFallback
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {vouchers.length > 0 && (
                <div>
                  <div className="text-[13px] font-semibold text-[#1A1A1A] mb-3 uppercase tracking-wide">
                    Available Offers
                  </div>
                  <div className="space-y-3">
                    {vouchers.map((v) => (
                      <div
                        key={v.id}
                        className="relative bg-white rounded-[14px] p-4 border-2 border-dashed border-[var(--primary)]/50 shadow-sm"
                      >
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F7F7F7] rounded-full border border-[var(--primary)]/50"></div>
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F7F7F7] rounded-full border border-[var(--primary)]/50"></div>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center flex-shrink-0">
                            <Tag className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[#1A1A1A] text-[13px]">
                              {v.title ?? (v.discountType === 'PERCENT' && typeof v.discountValue === 'number'
                                ? `Giảm ${v.discountValue}%`
                                : v.discountType === 'AMOUNT' && typeof v.discountValue === 'number'
                                  ? `Giảm ${new Intl.NumberFormat('vi-VN').format(v.discountValue)}đ`
                                  : v.description ?? ''
                              )}
                            </div>
                            {v.description && (
                              <div className="text-[12px] text-[#555] mt-0.5 line-clamp-2">
                                {v.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--secondary)]/10 via-transparent to-[var(--primary)]/10 pointer-events-none rounded-[14px]"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Main Image & Menu (Scrollable independently) */}
            <div ref={rightColumnRef} className="relative overflow-y-auto no-scrollbar pl-2 mb-12">
              {/* Main Hero Image with Save Button */}
              {restaurant.imageUrl && (
                <div className="relative mb-6">
                  <div className="relative aspect-[16/8] rounded-[24px] overflow-hidden shadow-md bg-white">
                    <ImageWithFallback
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button className="absolute top-4 right-4 bg-[#28A745] hover:bg-[#218838] text-white px-4 py-2 rounded-[12px] shadow-lg flex items-center gap-2 transition-all">
                    <Star className="w-4 h-4 fill-white" />
                    <span className="text-[14px] font-medium uppercase tracking-wide">
                      Save to Favorites
                    </span>
                  </button>
                </div>
              )}

              {/* Category tabs - positioned here, becomes sticky on scroll */}
              <div
                className={`${isTabsSticky ? "sticky top-0 z-40 bg-[#F7F7F7] pt-4 -mt-4" : ""} mb-6`}
              >
                <div ref={catContainerRef} className="relative bg-[#F7F7F7] border-b-2 border-gray-300">
                  <HoverHighlightOverlay rect={catRect} style={catStyle} />
                  <div ref={tabsRef} className="overflow-x-auto no-scrollbar">
                    <div className="inline-flex items-center gap-8 px-6 py-4 min-w-full justify-start relative z-10">
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => scrollToCategory(c.id)}
                          className={`text-[28px] font-bold uppercase tracking-wide transition-all relative pb-1 whitespace-nowrap ${
                            activeCategoryId === c.id
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
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center"
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
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-700" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div ref={menuContainerRef} className="relative space-y-8 px-4">
                {categories.map((c) => {
                  const dishes: Dish[] = getDishesByMenuCategory(c.id);
                  return (
                    <section
                      key={c.id}
                      ref={(el) => { sectionRefs.current[c.id] = el; }}
                      data-id={c.id}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[24px] font-bold text-[#1A1A1A] uppercase tracking-wide">
                          {c.name}
                        </h2>
                        <div className="text-[12px] text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 font-medium">
                          {dishes.length} items
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-5">
                        {dishes.map((d) => {
                          const count = items
                            .filter(
                              (it) =>
                                it.id === d.id || it.id.startsWith(`${d.id}::`)
                            )
                            .reduce((s, it) => s + it.quantity, 0);
                          const variantGroup = (d.optionGroups ?? []).find((g) => String(g.title || '').toLowerCase().startsWith('variant')) || null;
                          const minPrice = variantGroup && Array.isArray(variantGroup.options) && variantGroup.options.length > 0
                            ? (Number(d.price || 0) + Math.min(...(variantGroup.options ?? []).map((v) => Number(v.price || 0))))
                            : Number(d.price || 0);
                          return (
                            <div
                              key={d.id}
                              className="group relative bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                              onMouseEnter={(e) =>
                                menuMove(e, {
                                  borderRadius: 16,
                                  backgroundColor: "rgba(0,0,0,0.06)",
                                  opacity: 1,
                                  scaleEnabled: true,
                                  scale: 1.1,
                                })
                              }
                              onMouseMove={(e) =>
                                menuMove(e, {
                                  borderRadius: 16,
                                  backgroundColor: "rgba(0,0,0,0.06)",
                                  opacity: 1,
                                  scaleEnabled: true,
                                  scale: 1.1,
                                })
                              }
                              onMouseLeave={menuClear}
                            >
                              <div className="relative aspect-[4/3] overflow-hidden">
                                <ImageWithFallback
                                  src={d.imageUrl}
                                  alt={d.name}
                                  fill
                                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                />
                                {d.isAvailable === false && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-semibold">
                                    Hết hàng
                                  </div>
                                )}
                                <div className="absolute top-3 right-3">
                                  {count > 0 ? (
                                    <motion.div
                                      layoutId={`item-${d.id}-btn`}
                                      className="rounded-full bg-[var(--primary)] text-white shadow flex items-center gap-2 px-3 h-9"
                                    >
                                      <button
                                        onClick={() => {
                                          const target = items.find(
                                            (it) =>
                                              it.id === d.id ||
                                              it.id.startsWith(`${d.id}::`)
                                          );
                                          if (target) removeItem(target.id);
                                        }}
                                        className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"
                                      >
                                        <Minus className="w-4 h-4" />
                                      </button>
                                      <span className="text-sm font-semibold">
                                        {count}
                                      </span>
                                      <button
                                        onClick={() => {
                                          setActiveRestaurant(restaurant.id);
                                          setDrawerDish(d);
                                          setDrawerOpen(true);
                                        }}
                                        className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                    </motion.div>
                                  ) : (
                                    <motion.button
                                      layoutId={`item-${d.id}-btn`}
                                      onClick={() => {
                                        setActiveRestaurant(restaurant.id);
                                        setDrawerDish(d);
                                        setDrawerOpen(true);
                                      }}
                                      className="w-9 h-9 rounded-full bg-[var(--primary)] text-white shadow flex items-center justify-center hover:scale-105 transition-transform"
                                    >
                                      <Plus className="w-5 h-5" />
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="font-semibold text-[#1A1A1A] mb-1 line-clamp-1">
                                  {d.name}
                                </div>
                                <div className="text-[13px] text-[#555] line-clamp-2 mb-2 min-h-[2.5rem]">
                                  {d.description}
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="text-[16px] font-bold text-[var(--primary)]">
                                    {formatVnd(minPrice)}
                                  </div>
                                  <div className="text-[11px] text-gray-500">
                                    SL: {d.availableQuantity}
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
            </div>
          </div>
        </div>
      </div>
      <DishCustomizeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        dish={drawerDish}
        onConfirm={(payload, startRect) => {
          if (!drawerDish) return;
          const variantId = payload.variant?.id ?? "base";
          const addonIds = payload.addons.map((a) => a.id).sort();
          const uniqueId = `${drawerDish.id}::${variantId}::${addonIds.join(".")}`;
          const endEl = document.getElementById("header-cart-button");
          if (startRect && endEl) {
            fly({
              start: startRect,
              end: endEl.getBoundingClientRect(),
              imageUrl: drawerDish.imageUrl,
            });
          }
          setActiveRestaurant(restaurant.id);
                          addItem({
                            id: uniqueId,
                            name: drawerDish.name,
                            price: payload.totalPrice / payload.quantity,
                            imageUrl: drawerDish.imageUrl,
                            restaurantId: restaurant.id,
                            quantity: payload.quantity,
                            options: {
                              variant: payload.variant
                                ? {
                                    id: payload.variant.id,
                                    name: payload.variant.name,
                                    price: payload.variant.price,
                                  }
                                : undefined,
                              addons: payload.addons,
                              groups: payload.groups,
                            },
                          });
          setDrawerOpen(false);
        }}
      />
    </div>
  );
}
