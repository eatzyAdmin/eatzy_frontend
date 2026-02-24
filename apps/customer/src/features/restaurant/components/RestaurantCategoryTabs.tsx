'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ChevronLeft } from "@repo/ui/icons";
import { HoverHighlightOverlay, useHoverHighlight } from "@repo/ui";
import type { MenuCategory } from "@repo/types";

interface RestaurantCategoryTabsProps {
  categories: MenuCategory[];
  activeCategoryId: string | null;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const RestaurantCategoryTabs: React.FC<RestaurantCategoryTabsProps> = ({
  categories,
  activeCategoryId,
  sectionRefs,
  scrollContainerRef
}) => {
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const { containerRef: catContainerRef, rect: catRect, style: catStyle, moveHighlight: catMove, clearHover: catClear } = useHoverHighlight<HTMLDivElement>();

  // Scroll indicator logic
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const update = () => {
      setCanLeft(el.scrollLeft > 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [categories.length]);

  // Sticky logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsTabsSticky(container.scrollTop > 400);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef]);

  const scrollToCategory = (id: string) => {
    const node = sectionRefs.current[id];
    const container = scrollContainerRef.current;
    const mobileContainer = document.getElementById("mobile-scroll-container");
    const isMobile = window.innerWidth < 768;
    const scrollTarget = isMobile ? mobileContainer : container;

    if (!node || !scrollTarget) return;

    const containerRect = scrollTarget.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const offsetTop = nodeRect.top - containerRect.top + scrollTarget.scrollTop - (isMobile ? 180 : 140);

    scrollTarget.scrollTo({ top: offsetTop, behavior: "smooth" });
  };

  return (
    <div
      className={`sticky top-0 z-40 bg-[#F7F7F7] mb-6 transition-all pt-0 md:pt-0 ${isTabsSticky ? "md:pt-4 md:-mt-4" : ""}`}
    >
      <div ref={catContainerRef} className="relative bg-[#F7F7F7] border-b-2 border-gray-300">
        <HoverHighlightOverlay rect={catRect} style={catStyle} />
        <div ref={tabsRef} className="overflow-x-auto no-scrollbar">
          <div className="inline-flex items-center gap-6 md:gap-8 px-6 py-4 min-w-full justify-start relative z-10">
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
  );
};
