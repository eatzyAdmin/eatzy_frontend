'use client';

import { useState, useEffect } from 'react';

import { motion, AnimatePresence, PanInfo } from '@repo/ui/motion';
import { Restaurant } from '@repo/models';
import { ChevronLeft, ChevronRight } from '@repo/ui/icons';
import { ImageWithFallback } from '@repo/ui';

interface RestaurantSliderProps {
  restaurants: Restaurant[];
  activeIndex: number;
  onRestaurantChange: (index: number) => void;
}

export default function RestaurantSlider({
  restaurants,
  activeIndex,
  onRestaurantChange,
}: RestaurantSliderProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrevious = () => {
    const newIndex = activeIndex === 0 ? restaurants.length - 1 : activeIndex - 1;
    onRestaurantChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex === restaurants.length - 1 ? 0 : activeIndex + 1;
    onRestaurantChange(newIndex);
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

  // Get visible items
  const getVisibleRestaurants = () => {
    const visible = [];
    const total = restaurants.length;

    // On mobile, we might focus on the center one more, but 3 items ensures continuity
    for (let i = -1; i <= 1; i++) {
      let index = activeIndex + i;

      if (index < 0) index = total + index;
      if (index >= total) index = index - total;

      visible.push({
        restaurant: restaurants[index],
        position: i === -1 ? 'left' : i === 0 ? 'center' : 'right',
        actualIndex: index,
      });
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
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                      onClick={() =>
                        !isCenter && onRestaurantChange(actualIndex)
                      }
                      className={`${isCenter ? "" : "cursor-pointer"} flex-shrink-0 origin-top bg-transparent`}
                      style={{
                        width: `${baseWidth}px`,
                        minWidth: `${baseWidth}px`,
                        maxWidth: `${baseWidth}px`,
                        transformOrigin: "top center",
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className="relative w-full rounded-xl overflow-hidden shadow-2xl"
                          style={{ height: `${imageHeight}px`, width: isCenter ? '100%' : (isMobile ? '0px' : '100%'), opacity: isCenter ? 1 : (isMobile ? 0 : 1) }}
                        >
                          {/* Side items hidden on mobile effectively via width 0 */}
                          <ImageWithFallback
                            src={restaurant.imageUrl ?? 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'}
                            alt={restaurant.name}
                            fill
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
                                className="inline-flex items-center gap-2.5 rounded-full text-[13px] font-bold text-white transition-colors uppercase tracking-[0.12em]"
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
