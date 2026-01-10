'use client';

import { motion, useMotionValue, useTransform } from '@repo/ui/motion';
import { RestaurantCategory } from '@repo/models';
import { useEffect, useRef, useState, useCallback } from 'react';

interface CategoryScrollerProps {
  categories: RestaurantCategory[];
  activeIndex: number;
  onCategoryChange: (index: number) => void;
}

export default function CategoryScroller({
  categories,
  activeIndex,
  onCategoryChange,
}: CategoryScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [scales, setScales] = useState<number[]>([]);
  const [rulerFixedY, setRulerFixedY] = useState<number | null>(null);
  const aligningRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemSpacing = isMobile ? 40 : 60;

  // Create infinite loop by triplicating categories
  const infiniteCategories = [...categories, ...categories, ...categories];
  const centerOffset = categories.length; // Start from middle set

  // Calculate scale based on distance from screen center
  const calculateScales = () => {
    const screenCenter = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    const newScales: number[] = [];

    itemRefs.current.forEach((element) => {
      if (!element) {
        newScales.push(1.0);
        return;
      }

      const elementRect = element.getBoundingClientRect();
      const elementCenter = elementRect.left + elementRect.width / 2;
      const distanceFromCenter = Math.abs(elementCenter - screenCenter);

      const range = isMobile ? 120 : 200; // Smaller scale range on mobile

      // Scale items within range of center
      if (distanceFromCenter < range) {
        const scaleFactor = 1 - (distanceFromCenter / range);
        newScales.push(1.0 + (scaleFactor * 0.5)); // From 1.0 to 1.5
      } else {
        newScales.push(1.0);
      }
    });

    setScales(newScales);
  };

  // Update scales during drag
  useEffect(() => {
    if (!isDragging) return;
    const unsubscribe = x.on('change', () => {
      calculateScales();
    });
    return unsubscribe;
  }, [x, isDragging, isMobile]);

  // Auto snap to center when activeIndex changes
  const alignActiveToViewportCenter = useCallback(() => {
    const activeDisplayIndex = centerOffset + activeIndex;
    const el = itemRefs.current[activeDisplayIndex];
    if (!el) return;
    aligningRef.current = true;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    const step = () => {
      if (!aligningRef.current) return;
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.left + rect.width / 2;
      const screenCenter = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
      const delta = screenCenter - elementCenter;
      if (Math.abs(delta) <= 0.5) {
        aligningRef.current = false;
        calculateScales();
        return;
      }
      x.set(x.get() + delta);
      rafIdRef.current = requestAnimationFrame(step);
    };
    rafIdRef.current = requestAnimationFrame(step);
  }, [activeIndex, centerOffset, x]); // Removed dependency on isMobile causing loops?

  useEffect(() => {
    alignActiveToViewportCenter();
  }, [alignActiveToViewportCenter]);

  // Re-calculate scales on resize/mobile change
  useEffect(() => {
    calculateScales();
  }, [isMobile]);

  useEffect(() => {
    const updateRulerFixedY = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const y = rect.bottom - (isMobile ? 16 : 22);
      setRulerFixedY(y);
    };

    updateRulerFixedY();
    window.addEventListener('resize', updateRulerFixedY);
    window.addEventListener('scroll', updateRulerFixedY, { passive: true });
    return () => {
      window.removeEventListener('resize', updateRulerFixedY);
      window.removeEventListener('scroll', updateRulerFixedY);
    };
  }, [isMobile]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    if (!containerRef.current) return;

    const screenCenter = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;

    // Find which category is closest to screen center
    let closestIndex = activeIndex;
    let minDistance = Infinity;

    itemRefs.current.forEach((element, displayIndex) => {
      if (!element) return;

      const actualIndex = displayIndex % categories.length;
      // Only consider the middle set to avoid duplicates
      if (displayIndex < centerOffset || displayIndex >= centerOffset + categories.length) return;

      const elementRect = element.getBoundingClientRect();
      const elementCenter = elementRect.left + elementRect.width / 2;
      const distance = Math.abs(elementCenter - screenCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = actualIndex;
      }
    });

    if (closestIndex !== activeIndex) {
      onCategoryChange(closestIndex);
    } else {
      alignActiveToViewportCenter();
    }
  };

  const handleCategoryClick = (displayIndex: number) => {
    if (isDragging) return;

    // Map display index to actual category index
    const actualIndex = displayIndex % categories.length;
    if (actualIndex !== activeIndex) {
      onCategoryChange(actualIndex);
    }
  };

  // Transform for ruler that follows the category movement
  const rulerX = useTransform(x, (latest) => latest * 1.5);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: isMobile ? '160px' : '240px' }}
    >
      {/* Center marker - marks the exact center of screen */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className={`w-[2px] ${isMobile ? 'h-24' : 'h-32'} bg-purple-500/0 shadow-lg shadow-purple-500/0`} />
        </motion.div>
      </div>

      {/* Category Text Layer */}
      <div className={`absolute pb-12 left-0 right-0 ${isMobile ? 'bottom-2' : 'bottom-10'} flex items-end justify-center z-20`}>
        <motion.div
          drag="x"
          dragElastic={0.05}
          dragTransition={{
            power: 0.12,
            timeConstant: 200,
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="flex items-center cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-end" style={{ gap: `${itemSpacing}px` }}>
            {infiniteCategories.map((category, displayIndex) => {
              // Calculate which is the "active" one in the infinite loop
              const actualIndex = displayIndex % categories.length;
              const isActive = actualIndex === activeIndex &&
                displayIndex >= centerOffset &&
                displayIndex < centerOffset + categories.length;

              // Get scale from calculated scales
              const scale = scales[displayIndex] || 1.0;
              const opacity = 0.7 + ((scale - 1.0) / 0.5) * 0.6; // Opacity from 0.4 to 1.0

              const activeFontSize = isMobile ? 'clamp(40px, 10vw, 60px)' : 'clamp(82px, 6.8vw, 136px)';
              const inactiveFontSize = isMobile ? 'clamp(28px, 6vw, 40px)' : 'clamp(55px, 4.55vw, 91px)';

              // Calculated dragging font size
              // Mobile base: 30px -> scale 1.5 -> 45px
              // Desktop base: 54px -> scale 1.5 -> 81px
              const baseDragSize = isMobile ? 30 : 54;

              return (
                <motion.div
                  key={`${category.id}-${displayIndex}`}
                  ref={(el) => {
                    itemRefs.current[displayIndex] = el;
                  }}
                  onClick={() => handleCategoryClick(displayIndex)}
                  className="select-none"
                  animate={{
                    opacity: isDragging ? opacity : (isActive ? 1.0 : 0.7),
                  }}
                  transition={{
                    duration: 0.1,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  style={{
                    cursor: isActive ? 'default' : 'pointer',
                    width: 'fit-content',
                    flexShrink: 0,
                    display: 'inline-flex',
                    position: 'relative',
                  }}
                >
                  <motion.h2
                    className="font-anton font-bold uppercase whitespace-nowrap leading-none"
                    animate={{
                      fontSize: isDragging
                        ? `clamp(${baseDragSize * scale}px, ${4.55 * scale}vw, ${91 * scale}px)`
                        : (isActive ? activeFontSize : inactiveFontSize),
                    }}
                    transition={{
                      duration: isDragging ? 0.05 : 0.3,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                    style={{
                      color: (isActive && !isDragging) || (isDragging && scale > 1.2) ? '#FFFFFF' : '#8a8a8a',
                      textShadow: (isActive && !isDragging) || (isDragging && scale > 1.2)
                        ? '0 4px 40px rgba(0, 0, 0, 0.9), 0 2px 12px rgba(0, 0, 0, 0.7)'
                        : '0 2px 20px rgba(0, 0, 0, 0.6)',
                      transition: 'color 0.3s ease-out, text-shadow 0.3s ease-out',
                      fontStretch: 'condensed',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {category.name}
                  </motion.h2>
                  <div
                    className="pointer-events-none opacity-0"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      top: 'calc(100% + 12px)',
                      width: '2px',
                      height: '16px',
                      backgroundColor: '#8b5cf6',
                      boxShadow: '0 2px 10px rgba(139, 92, 246, 0.35)',
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-10 transform translate-y-8">
        <div className="absolute inset-x-0 bottom-0 h-12 rounded-t-md z-0" />
        <motion.div
          style={{ x: rulerX }}
          className="relative h-12 z-10"
        >
          {/* Ruler content is visual only, keep it generic */}
          <div className="flex" style={{ width: '20000px', marginLeft: '-10000px' }}>
            {Array.from({ length: 40 }).map((_, segmentIndex) => (
              <div key={segmentIndex} className="relative" style={{ width: '500px' }}>
                {Array.from({ length: 100 }).map((_, i) => {
                  const isMajor = i % 20 === 0;
                  const isMedium = i % 10 === 0;
                  let height = 16;
                  let opacity = 0.4;
                  if (isMedium) {
                    height = 27;
                    opacity = 0.4;
                  }
                  if (isMajor) {
                    height = 38.2;
                    opacity = 0.4;
                  }
                  return (
                    <div
                      key={i}
                      className="absolute bottom-0"
                      style={{
                        left: `${(i / 100) * 100}%`,
                        height: `${height}px`,
                        borderLeftWidth: '1.4px',
                        borderLeftStyle: 'solid',
                        borderLeftColor: `rgba(255,255,255,${opacity})`,
                        transform: 'translateX(-50%)',
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>
        <div className={`absolute ${isMobile ? 'top-24' : 'top-36'} left-1/2 -translate-x-1/2`}>
          <motion.div
            animate={{
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-[2.8px] h-12 bg-white shadow-lg rounded-full shadow-white/40" />
          </motion.div>
        </div>
        {rulerFixedY !== null && (
          <div
            className="fixed left-1/2 -translate-x-1/2 pointer-events-none z-50"
            style={{ top: rulerFixedY, width: '2px', height: '24px', backgroundColor: '#22c55e', boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)' }}
          />
        )}
      </div>
    </div>
  );
}