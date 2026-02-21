"use client";

import { motion } from "@repo/ui/motion";
import { ImageWithFallback, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { Plus, Minus, Info } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import type { Dish } from "@repo/types";

interface DishCardProps {
  dish: Dish;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
  onClick: () => void;
}

export default function DishCard({ dish, count, onAdd, onRemove, onClick }: DishCardProps) {
  const {
    containerRef,
    rect,
    style: highlightStyle,
    moveHighlight,
    clearHover,
  } = useHoverHighlight<HTMLDivElement>();

  const variantGroup = (dish.optionGroups ?? []).find((g) => String(g.title || '').toLowerCase().startsWith('variant')) || null;
  const minPrice = variantGroup && Array.isArray(variantGroup.options) && variantGroup.options.length > 0
    ? (Number(dish.price || 0) + Math.min(...(variantGroup.options ?? []).map((v) => Number(v.price || 0))))
    : Number(dish.price || 0);

  return (
    <motion.div
      ref={containerRef}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 1
      }}
      onClick={onClick}
      onMouseEnter={(e) =>
        moveHighlight(e, {
          borderRadius: 32,
          backgroundColor: "rgba(255,255,255,0.05)",
          opacity: 1,
          scaleEnabled: false,
        })
      }
      onMouseMove={(e) =>
        moveHighlight(e, {
          borderRadius: 32,
          backgroundColor: "rgba(255,255,255,0.05)",
          opacity: 1,
          scaleEnabled: false,
        })
      }
      onMouseLeave={clearHover}
      className="group relative w-full aspect-[4/5] overflow-hidden rounded-[28px] md:rounded-[36px] shadow-[0_0_20px_rgba(0,0,0,0.08)] cursor-pointer bg-white"
    >
      <HoverHighlightOverlay rect={rect} style={highlightStyle} />

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={dish.imageUrl || ""}
          alt={dish.name}
          fill
          placeholderMode="vertical"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Gradients */}
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      {/* Out of Stock Overlay */}
      {dish.isAvailable === false && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
          <span className="text-white text-sm font-black uppercase tracking-[0.2em] border-2 border-white/30 px-4 py-2 rounded-full">
            Out of Stock
          </span>
        </div>
      )}

      {/* Content Layout */}
      <div className="relative z-10 h-full p-3 md:p-4 flex flex-col justify-between">
        {/* Top Actions */}
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="w-8 h-8 md:w-9 md:h-9 rounded-3xl md:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg"
          >
            <Info className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>

        {/* Bottom Information */}
        <div className="space-y-2 md:space-y-4">
          <div className="space-y-0.5 md:space-y-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <h3 className="text-base md:text-xl font-anton font-semibold text-white tracking-wide uppercase line-clamp-2 leading-tight">
              {dish.name}
            </h3>
            <p className="text-[9px] md:text-xs text-white/50 font-medium line-clamp-1 leading-relaxed">
              {dish.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-[14px] md:rounded-[16px] shadow-sm border border-white/20 shrink-0">
              <span className="text-[13px] md:text-lg font-black font-anton uppercase text-[var(--primary)]">
                {formatVnd(minPrice)}
              </span>
            </div>

            <div className="flex items-center">
              {count > 0 ? (
                <div className="flex items-center gap-1 md:gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 md:p-1 shadow-lg">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                  >
                    <Minus className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                  <span className="text-xs md:text-sm font-black text-white min-w-[16px] md:min-w-[20px] text-center font-anton">
                    {count}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd();
                    }}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[var(--primary)] hover:brightness-110 flex items-center justify-center text-white transition-all shadow-md shadow-[var(--primary)]/30"
                  >
                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd();
                  }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-[var(--primary)] text-white hover:scale-110 active:scale-95 transition-all shadow-lg shadow-[var(--primary)]/25 flex items-center justify-center border border-white/20"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Glossy Overlay for Premium Feel */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}
