"use client";

import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, ReactNode, forwardRef, useImperativeHandle } from "react";
import { ArrowDown, ArrowUp, RotateCcw } from "../icons";

/**
 * Premium jumping dots animation (Telegram style)
 */
const ThreeDots = () => (
  <div className="flex items-center gap-1.5 px-1 py-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{ y: [0, -5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.6,
          delay: i * 0.15,
          ease: "easeInOut"
        }}
        className="w-1.5 h-1.5 rounded-full bg-current"
      />
    ))}
  </div>
);

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  pullThreshold?: number;
  className?: string;
  disabled?: boolean;
  position?: 'top' | 'bottom';
  pullText?: string;
  releaseText?: string;
  refreshingText?: string;
}

const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(({
  children,
  onRefresh,
  pullThreshold = 220,
  className = "",
  disabled = false,
  position = 'top',
  pullText = "Pull to refresh",
  releaseText = "Release to refresh",
  refreshingText = "Refreshing"
}, ref) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pullY = useMotionValue(0);

  useImperativeHandle(ref, () => containerRef.current!);

  const isTop = position === 'top';

  const contentY = useTransform(pullY, (y) => {
    const absoluteY = Math.abs(y);
    if (absoluteY <= 0) return 0;
    return (y > 0 ? 1 : -1) * Math.pow(absoluteY, 0.80);
  });

  const pullProgress = useTransform(pullY, (y) => {
    const absProgress = Math.min(Math.abs(y) / pullThreshold, 1.5);
    return absProgress;
  });

  // Sophisticated indicator animations
  const indicatorScale = useTransform(pullProgress, [0, 0.2, 0.8, 1], [0, 0.4, 0.9, 1.0]);
  const indicatorWidth = useTransform(pullProgress, [0, 0.6, 1], [40, 40, 140]);
  const indicatorOpacity = useTransform(pullProgress, [0, 0.1, 0.3], [0, 0, 1]);

  // Indicator moves at a cohesive pace with the content
  const indicatorPos = useTransform(pullY, (y) => {
    const absY = Math.abs(y);
    const dampenedY = Math.pow(absY, 0.75);
    const offset = isTop ? 12 : -12;
    return (y > 0 ? 1 : -1) * dampenedY + offset;
  });

  useEffect(() => {
    if (disabled) return;

    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let isPulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      const scrollY = container.scrollTop;
      const atTop = scrollY <= 0;
      const atBottom = Math.abs(container.scrollHeight - container.clientHeight - scrollY) < 1;

      if (isRefreshing || !e.touches[0]) return;

      if (isTop && atTop) {
        startY = e.touches[0].pageY;
        isPulling = true;
      } else if (!isTop && atBottom) {
        startY = e.touches[0].pageY;
        isPulling = true;
      }
    };

    const reachedRef = { current: hasReachedThreshold };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing || !e.touches[0]) return;

      const currentY = e.touches[0].pageY;
      const diff = currentY - startY;

      // Handle pull directions
      if (isTop && diff > 0) {
        if (e.cancelable) e.preventDefault();
        pullY.set(diff);

        const reached = diff >= pullThreshold;
        if (reached !== reachedRef.current) {
          if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(reached ? 15 : 12);
          }
          reachedRef.current = reached;
          setHasReachedThreshold(reached);
        }
      } else if (!isTop && diff < 0) {
        if (e.cancelable) e.preventDefault();
        pullY.set(diff);

        const reached = Math.abs(diff) >= pullThreshold;
        if (reached !== reachedRef.current) {
          if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(reached ? 15 : 12);
          }
          reachedRef.current = reached;
          setHasReachedThreshold(reached);
        }
      } else {
        pullY.set(0);
        isPulling = false;
        setHasReachedThreshold(false);
        reachedRef.current = false;
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling || isRefreshing) return;
      isPulling = false;

      const currentPull = Math.abs(pullY.get());
      if (currentPull >= pullThreshold) {
        setIsRefreshing(true);
        const stickyPos = 160;
        animate(pullY, isTop ? stickyPos : -stickyPos, { type: "spring", stiffness: 200, damping: 25 });

        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setHasReachedThreshold(false);
          animate(pullY, 0, { type: "spring", stiffness: 300, damping: 30 });
        }
      } else {
        animate(pullY, 0, { type: "spring", stiffness: 300, damping: 30 });
        setHasReachedThreshold(false);
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullY, pullThreshold, isRefreshing, onRefresh, disabled, isTop]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overscroll-none overflow-y-auto ${className}`}
      style={{ touchAction: "pan-x pan-y" } as any}
    >
      <motion.div
        className={`absolute left-0 right-0 flex justify-center pointer-events-none z-50 ${isTop ? 'top-[-48px]' : 'bottom-[-15px]'}`}
        style={{
          y: indicatorPos,
          scale: indicatorScale,
          opacity: indicatorOpacity,
          width: indicatorWidth,
          margin: "0 auto"
        }}
      >
        <motion.div
          layout
          initial={false}
          animate={{
            scale: hasReachedThreshold ? [1, 1.25, 1] : 1,
            y: hasReachedThreshold ? (isTop ? [0, -12, 0] : [0, 12, 0]) : 0,
            backgroundColor: isRefreshing || hasReachedThreshold ? '#1A1A1A' : '#FFFFFF',
            color: isRefreshing || hasReachedThreshold ? '#FFFFFF' : '#1F2937'
          }}
          transition={{
            layout: { type: "spring", stiffness: 300, damping: 25 },
            backgroundColor: { duration: 0.4 },
            color: { duration: 0.4 },
            scale: { type: "spring", stiffness: 700, damping: 20 },
            y: { type: "spring", stiffness: 700, damping: 20 }
          }}
          className="flex items-center gap-3 px-6 py-3.5 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.18)] backdrop-blur-xl border border-gray-100/10"
        >
          <div className="flex items-center justify-center">
            {isRefreshing ? (
              <ThreeDots />
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={hasReachedThreshold ? 'rotate' : 'arrow'}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.2, opacity: 0 }}
                  className={`${hasReachedThreshold ? 'text-lime-400' : 'text-gray-400'}`}
                >
                  {hasReachedThreshold ? (
                    <RotateCcw size={20} strokeWidth={3} />
                  ) : (
                    isTop ? <ArrowDown size={20} strokeWidth={3} /> : <ArrowUp size={20} strokeWidth={3} />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {!isRefreshing && (
              <motion.span
                key={hasReachedThreshold ? 'release' : 'pull'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-[14px] font-bold tracking-tight whitespace-nowrap"
              >
                {hasReachedThreshold ? releaseText : pullText}
              </motion.span>
            )}
            {isRefreshing && (
              <motion.span
                key="refreshing"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="text-[14px] font-bold tracking-tight whitespace-nowrap text-lime-400"
              >
                {refreshingText}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
});

PullToRefresh.displayName = "PullToRefresh";

export default PullToRefresh;
