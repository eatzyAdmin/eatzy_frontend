'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronsRight } from 'lucide-react';
import styles from './SwipeToConfirm.module.css';

type SwipeType = "primary" | "success" | "warning" | "danger" | "info" | "pink" | "withdrawal" | "deposit" | "unlock" | "update" | "add";

function isTouchEvent(e: React.MouseEvent | React.TouchEvent): e is React.TouchEvent {
  return (e as React.TouchEvent).touches !== undefined;
}

export function SwipeToConfirm({
  onComplete,
  text = "Quẹt để xác nhận",
  disabled = false,
  className,
  type = "primary",
}: {
  onComplete?: () => void;
  text?: string;
  disabled?: boolean;
  className?: string;
  type?: SwipeType;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const knobRef = useRef<HTMLDivElement | null>(null);
  const initialPos = useRef<number | null>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  useEffect(() => {
    if (sliderRef.current) setSliderWidth(sliderRef.current.offsetWidth);
    const onResize = () => {
      if (sliderRef.current) setSliderWidth(sliderRef.current.offsetWidth);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (disabled) reset();
  }, [disabled]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || isComplete) return;
    const pos = isTouchEvent(e) ? e.touches[0]?.clientX ?? 0 : (e as React.MouseEvent).clientX;
    initialPos.current = pos;
    setIsDragging(true);
  };

  const onDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || disabled || isComplete) return;
    e.preventDefault();
    const pos = isTouchEvent(e) ? e.touches[0]?.clientX ?? 0 : (e as React.MouseEvent).clientX;
    const knobWidth = knobRef.current ? knobRef.current.offsetWidth : 50;
    const maxDrag = sliderWidth - knobWidth - 8;
    const dragDistance = pos - (initialPos.current ?? pos);
    const newPos = Math.max(0, Math.min(dragDistance, maxDrag));
    setDragPosition(newPos);
    if (newPos >= maxDrag * 0.95 && !hasCompleted) {
      setIsComplete(true);
      setHasCompleted(true);
      setDragPosition(maxDrag);
      setIsDragging(false);
      onComplete && onComplete();
    }
  };

  const endDrag = () => {
    if (!isDragging || isComplete) return;
    setIsDragging(false);
    if (!isComplete) {
      reset();
    }
  };

  const reset = () => {
    setDragPosition(0);
    setIsComplete(false);
    setHasCompleted(false);
  };

  const percent = Math.min(
    100,
    (dragPosition / (sliderWidth - (knobRef.current?.offsetWidth || 50) - 8)) * 100
  );

  const theme = (() => {
    switch (type) {
      case "success":
        return { start: "#16a34a", end: "#22c55e" };
      case "warning":
        return { start: "#d97706", end: "#f59e0b" };
      case "danger":
        return { start: "#ef4444", end: "#dc2626" };
      case "info":
        return { start: "#0ea5e9", end: "#38bdf8" };
      case "pink":
        return { start: "#db2777", end: "#ec4899" };
      case "unlock":
      case "update":
      case "add":
      case "withdrawal":
        return { start: "#0ea5e9", end: "#38bdf8" };
      case "deposit":
        return { start: "#0ea5e9", end: "#38bdf8" };
      case "primary":
        return { start: "#0ea5e9", end: "#38bdf8" };
      default:
        return { start: "#0ea5e9", end: "#38bdf8" };
    }
  })();

  return (
    <div
      ref={sliderRef}
      className={`relative flex items-center rounded-full h-14 w-80 sm:w-80 shadow-md select-none overflow-hidden ${className || ""} ${
        disabled ? "opacity-70" : ""
      }`}
      style={{
        background: `linear-gradient(to right, ${theme.start} ${percent}%, ${theme.end} ${percent}%)`,
      }}
    >
      {/* Shimmering overlay effect */}
      <div className={`absolute inset-0 z-0 ${styles.shimmerOverlay}`} />
      
      {/* Touch/click capture area */}
      <div
        className="absolute inset-0 z-10"
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onMouseMove={onDrag}
        onTouchMove={onDrag}
        onMouseUp={endDrag}
        onTouchEnd={endDrag}
        onMouseLeave={endDrag}
      />

      {/* Slider Knob with shimmering effect */}
      <div
        ref={knobRef}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-1.5 z-20 pointer-events-none"
        style={{
          transform: `translate(${dragPosition}px, -50%)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
      >
        <div className="bg-white rounded-full h-11 w-11 flex items-center justify-center shadow-md overflow-hidden">
          <div className={styles.shimmerContainer}>
            <ChevronsRight size={28} className={`text-neutral-700 ${styles.shimmerIcon}`} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Text with shimmering effect */}
      <span className="flex-grow text-center text-white text-lg font-semibold pl-10 pr-4">
        {text}
      </span>
    </div>
  );
}

export default SwipeToConfirm;
