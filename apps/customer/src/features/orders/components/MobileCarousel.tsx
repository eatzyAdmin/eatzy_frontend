import { useState } from "react";

interface MobileCarouselProps {
  children: React.ReactNode[];
  singleFocus?: boolean;
}

export function MobileCarousel({ children, singleFocus = false }: MobileCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = e.currentTarget.scrollLeft;
    const slideWidth = e.currentTarget.offsetWidth;
    if (slideWidth > 0) {
      const index = Math.round(scrollPosition / slideWidth);
      if (index !== currentSlide) setCurrentSlide(index);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth gap-4 -mx-4 px-4 py-6 -my-6"
        onScroll={handleScroll}
      >
        {children.map((child, idx) => (
          <div
            key={idx}
            className={`snap-center shrink-0 flex items-stretch justify-center py-4 ${singleFocus ? "w-full" : "w-[calc(100vw-48px)]"
              }`}
          >
            <div className="w-full">
              {child}
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-1">
        {children.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-6 bg-[var(--primary)]" : "w-1.5 bg-gray-200"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
