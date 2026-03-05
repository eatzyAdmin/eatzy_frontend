'use client';

import { motion } from '@repo/ui/motion';
import { useEffect, useState } from 'react';

export default function CategoryScrollerShimmer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemSpacing = isMobile ? 40 : 60;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: isMobile ? '160px' : '240px' }}
    >
      {/* Category Text Shimmer Layer */}
      <div className={`absolute pb-12 left-0 right-0 ${isMobile ? 'bottom-2' : 'bottom-10'} flex items-end justify-center z-20`}>
        <div className="flex items-end" style={{ gap: `${itemSpacing}px` }}>
          {[1, 2, 3, 4, 5].map((i) => {
            const isCenter = i === 3;
            const activeFontSize = isMobile ? 50 : 110;
            const inactiveFontSize = isMobile ? 34 : 70;
            const size = isCenter ? activeFontSize : inactiveFontSize;

            return (
              <div
                key={i}
                className="flex flex-col items-center"
                style={{ opacity: isCenter ? 1 : 0.6 }}
              >
                <motion.div
                  animate={{
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1
                  }}
                  className="bg-white/20 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                  style={{
                    width: isCenter ? (isMobile ? '120px' : '280px') : (isMobile ? '80px' : '180px'),
                    height: `${size}px`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Ruler Background Shimmer */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-10 transform translate-y-8">
        <div className="relative h-12 w-full opacity-20">
          <div className="flex justify-center gap-1">
            {Array.from({ length: 120 }).map((_, i) => {
              const isMajor = i % 20 === 0;
              const isMedium = i % 10 === 0;
              let height = 12;
              if (isMedium) height = 20;
              if (isMajor) height = 30;

              return (
                <div
                  key={i}
                  className="w-[1.5px] bg-white/40"
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* Center Indicator */}
        <div className={`absolute ${isMobile ? 'top-24' : 'top-36'} left-1/2 -translate-x-1/2`}>
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-[2.8px] h-12 bg-white/40 shadow-lg rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
