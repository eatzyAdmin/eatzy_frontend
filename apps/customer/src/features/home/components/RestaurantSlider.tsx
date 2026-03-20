'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { motion, AnimatePresence, PanInfo } from '@repo/ui/motion';
import { Restaurant } from '@repo/types';
import { ChevronLeft, ChevronRight, Loader2, Store, MapPin } from '@repo/ui/icons';
import { ImageWithFallback } from '@repo/ui';
import { useDeliveryLocationStore } from '@/store/deliveryLocationStore';

interface RestaurantSliderProps {
  restaurants: Restaurant[];
  activeIndex: number;
  onRestaurantChange: (index: number) => void;
  onNext?: () => void;  // Called when user wants to go next (handles load more logic)
  onPrevious?: () => void;  // Called when user wants to go previous
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
}

export default function RestaurantSlider({
  restaurants,
  activeIndex,
  onRestaurantChange,
  onNext,
  onPrevious,
  isFetchingNextPage = false,
  hasNextPage = false,
}: RestaurantSliderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const handleRestaurantClick = (restaurant: Restaurant) => {
    if (restaurant.slug) {
      router.push(`/restaurants/${restaurant.slug}`);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      // Fallback: simple loop
      const newIndex = activeIndex === 0 ? restaurants.length - 1 : activeIndex - 1;
      onRestaurantChange(newIndex);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      // Fallback: simple loop
      const newIndex = activeIndex === restaurants.length - 1 ? 0 : activeIndex + 1;
      onRestaurantChange(newIndex);
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;

    const momentumDistance = velocity * 0.08;
    const totalDistance = dragDistance + momentumDistance;

    if (Math.abs(totalDistance) > 40) {
      if (totalDistance > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
  };

  const { selectedLocation } = useDeliveryLocationStore();

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 md:py-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          {/* Subtle Home-themed Icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[30px] bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/5 shadow-inner">
              <Store className="w-8 h-8 md:w-10 md:h-10 text-white/30" strokeWidth={1.2} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-[#1A1A1A]">
              <MapPin className="w-4 h-4 text-white/40" strokeWidth={2.5} />
            </div>
          </div>

          {/* Text Content - EmptyState Style */}
          <div className="max-w-md space-y-2 mb-8">
            {isFetchingNextPage ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-white/20" />
                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  Đang tìm kiếm...
                </h3>
              </div>
            ) : (
              <>
                <h3 className="text-md md:text-xl font-bold md:font-extrabold text-white tracking-tight">
                  Không tìm thấy quán
                </h3>
                <p className="text-[13px] md:text-[14px] text-gray-400 font-medium leading-relaxed max-w-[280px] md:max-w-none mx-auto">
                  Rất tiếc, chưa có nhà hàng nào trong danh mục này tại
                  <span className="text-white font-semibold px-1">
                    {selectedLocation?.address
                      ? selectedLocation.address
                        .split(',')
                        .map(s => s.trim())
                        // Filter out parts that are purely numbers (postal codes)
                        .filter(s => !/^\d+$/.test(s))
                        // Clean leading house numbers from the first part
                        .map((s, idx) => idx === 0 ? s.replace(/^\d+[\d\-/]*\s+/, '') : s)
                        .slice(0, 3)
                        .join(', ')
                      : "địa chỉ đã chọn"
                    }
                  </span>
                </p>
              </>
            )}
          </div>

          {/* Home Style Action Button */}
          {!isFetchingNextPage && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.dispatchEvent(new CustomEvent('openLocationPicker'))}
              className="group relative flex items-center gap-2.5 px-6 py-3 bg-primary/60 border-2 border-white/20 backdrop-blur-sm rounded-full text-white/90 font-semibold font-anton text-lg md:text-xl uppercase shadow-lg shadow-black/10 transition-all hover:bg-white hover:text-[#1A1A1A]"
            >
              <MapPin className="w-4 h-4" strokeWidth={2.5} />
              Chọn điểm giao khác
              <ChevronRight className="w-4 h-4 opacity-40 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  // Get visible items
  const getVisibleRestaurants = () => {
    const visible = [];
    const total = restaurants.length;

    // If only 1 restaurant, show it in the center
    if (total === 1) {
      return [{
        restaurant: restaurants[0],
        position: 'center' as const,
        actualIndex: 0,
      }];
    }

    // On mobile, we might focus on the center one more, but 3 items ensures continuity
    for (let i = -1; i <= 1; i++) {
      let index = activeIndex + i;

      if (index < 0) index = total + index;
      if (index >= total) index = index - total;

      const restaurant = restaurants[index];
      if (restaurant) {
        visible.push({
          restaurant,
          position: i === -1 ? 'left' as const : i === 0 ? 'center' as const : 'right' as const,
          actualIndex: index,
        });
      }
    }

    return visible;
  };

  const visibleRestaurants = getVisibleRestaurants();

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 md:px-0">
      <div className="relative flex items-center justify-center gap-4 md:gap-12">
        <motion.button
          whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 md:translate-y-0 md:static flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-colors z-30"
        >
          <ChevronLeft className="w-5 h-5 md:w-7 md:h-7 text-white" />
        </motion.button>

        <div className={`relative w-full ${isMobile ? 'max-w-full' : 'max-w-5xl'} ${isMobile ? 'h-[50vh]' : 'h-[380px]'} flex items-start justify-center overflow-hidden`}>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
            className="relative w-full h-full flex items-start justify-center cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence mode="popLayout">
              <div className="flex items-start justify-center gap-2 md:gap-4 w-full">
                {visibleRestaurants.map(({ restaurant, position, actualIndex }) => {
                  const isCenter = position === 'center';

                  // Mobile widths
                  const mobileCenterWidth = typeof window !== 'undefined' ? window.innerWidth * 0.65 : 260;
                  const mobileSideWidth = typeof window !== 'undefined' ? 20 : 20; // Just a sliver

                  const centerWidth = isMobile ? mobileCenterWidth : 340;
                  const sideWidth = isMobile ? mobileSideWidth : 290;

                  const baseWidth = isCenter ? centerWidth : sideWidth;
                  const aspectRatio = isMobile ? 1.35 : 1.85;
                  const imageHeight = Math.round(baseWidth / aspectRatio);

                  return (
                    <motion.div
                      key={`${restaurant.id}-${actualIndex}`}
                      layoutId={`restaurant-card-${restaurant.id}`}
                      layout
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{
                        scale: isCenter ? 1.0 : 0.92,
                        opacity: isCenter ? 1.0 : (isMobile ? 0.3 : 1.0), // Fade sides more on mobile
                        zIndex: isCenter ? 20 : 10,
                      }}
                      whileHover={!isMobile ? { y: 6, scale: 1.02, transition: { duration: 0.2 } } : {}}
                      whileTap={{ scale: 0.98 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                      onClick={() => {
                        if (isCenter) {
                          handleRestaurantClick(restaurant);
                        } else {
                          onRestaurantChange(actualIndex);
                        }
                      }}
                      className="cursor-pointer flex-shrink-0 origin-top bg-transparent"
                      style={{
                        width: `${baseWidth}px`,
                        minWidth: `${baseWidth}px`,
                        maxWidth: `${baseWidth}px`,
                        transformOrigin: "top center",
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className="relative w-full rounded-[28px] md:rounded-[30px] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.12)]"
                          style={{ height: `${imageHeight}px`, width: isCenter ? '100%' : (isMobile ? '0px' : '100%'), opacity: isCenter ? 1 : (isMobile ? 0 : 1) }}
                        >
                          {/* Side items hidden on mobile effectively via width 0 */}
                          <ImageWithFallback
                            src={restaurant.imageUrl ?? 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'}
                            alt={restaurant.name}
                            fill
                            placeholderMode="horizontal"
                            className="object-cover"
                            sizes={isMobile ? "80vw" : "340px"}
                          />
                        </div>
                        <AnimatePresence mode="wait">
                          {isCenter && (
                            <motion.div
                              key={`info-${restaurant.id}`}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -15 }}
                              transition={{
                                duration: 0.35,
                                ease: [0.33, 1, 0.68, 1],
                              }}
                              className="mt-5 text-left w-full"
                            >
                              <h3
                                className="font-anton text-[clamp(20px,5vw,26px)] font-semibold text-white uppercase tracking-[0.05em] leading-none mb-3"
                                style={{
                                  fontStretch: "condensed",
                                  letterSpacing: "-0.01em",
                                }}
                              >
                                {restaurant.name}
                              </h3>
                              <p className="text-[12px] text-gray-300 leading-relaxed mb-4 line-clamp-3">
                                {restaurant.description}
                              </p>
                              <motion.button
                                whileHover={{
                                  scale: 1.06,
                                  backgroundColor: "rgba(255, 255, 255, 0.24)",
                                }}
                                whileTap={{ scale: 0.96 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRestaurantClick(restaurant);
                                }}
                                className="inline-flex items-center pl-1 gap-2.5 rounded-lg text-[13px] font-bold text-white transition-colors uppercase"
                              >
                                KHÁM PHÁ
                                <ChevronRight className="w-4 h-4" />
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.15, backgroundColor: 'rgba(255, 255, 255, 0.28)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 md:translate-y-0 md:static flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/12 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-colors z-30"
        >
          <ChevronRight className="w-5 h-5 md:w-7 md:h-7 text-white" />
        </motion.button>
      </div>
    </div>
  );
}
