"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ImageWithFallback } from "@repo/ui";
import { useState, useMemo, useRef, useEffect } from "react";
import type { Dish, DishVariant, OptionGroup, OptionChoice } from "@repo/types";
import { formatVnd } from "@repo/lib";
import { useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { ChefHat, X, Loader2, Check, Plus, Sparkles, Utensils, AlertCircle } from "@repo/ui/icons";

export default function DishCustomizeDrawer({
  open,
  onClose,
  dish,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  dish: Dish | null;
  onConfirm: (
    payload: {
      variant?: DishVariant;
      addons: { id: string; name: string; price: number }[];
      groups?: { id: string; title: string; options: { id: string; name: string; price: number }[] }[];
      quantity: number;
      totalPrice: number;
    },
    startRect?: DOMRect
  ) => void;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<
    Record<string, Set<string>>
  >({});
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const groupRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const {
    containerRef: addonContainerRef,
    rect: addonRect,
    style: addonStyle,
    moveHighlight: addonMove,
    clearHover: addonClear,
  } = useHoverHighlight<HTMLDivElement>();

  const optionGroups: OptionGroup[] = useMemo(() => {
    const og = dish?.optionGroups;
    if (og && Array.isArray(og)) return og as OptionGroup[];
    const legacy = (dish as unknown as { addonGroups?: OptionGroup[] } | null)?.addonGroups;
    return Array.isArray(legacy) ? legacy : [];
  }, [dish]);

  const VARIANT_PREFIX = "variant";
  const variantGroup: OptionGroup | null = useMemo(() => {
    const byTitle = optionGroups.find((g) => g.type === 'variant' || String(g.title || "").toLowerCase().startsWith(VARIANT_PREFIX));
    return byTitle ?? null;
  }, [optionGroups]);

  const nonVariantGroups: OptionGroup[] = useMemo(() => {
    return optionGroups.filter((g) => {
      if (g.type === 'variant') return false;
      const title = String(g.title || "").toLowerCase();
      return !title.startsWith(VARIANT_PREFIX);
    });
  }, [optionGroups]);

  const variant: DishVariant | undefined = useMemo(() => {
    if (variantGroup && Array.isArray(variantGroup.options) && variantGroup.options.length > 0) {
      const id = selectedVariantId ?? variantGroup.options[0].id;
      const found = (variantGroup.options as OptionChoice[]).find((v) => v.id === id);
      return found ? ({ id: found.id, name: found.name, price: found.price }) : undefined;
    }
    return undefined;
  }, [selectedVariantId, variantGroup]);
  const currentVariantId = variant?.id;

  const addons = useMemo(() => {
    const res: { id: string; name: string; price: number }[] = [];
    nonVariantGroups.forEach((g) => {
      const set = selectedAddonIds[g.id];
      if (set) {
        (g.options ?? []).forEach((opt) => {
          if (set.has(opt.id)) res.push({ id: opt.id, name: String(opt.name || ""), price: Number(opt.price || 0) });
        });
      }
    });
    return res;
  }, [selectedAddonIds, nonVariantGroups]);

  const basePrice = Number(dish?.price ?? 0);
  const variantPrice = Number(variant?.price ?? 0);
  const addonsSum = addons.reduce((s, a) => s + Number(a.price || 0), 0);
  const totalPrice = (basePrice + variantPrice + addonsSum) * qty;

  const canConfirm = useMemo(() => {
    if (!dish) return false;
    if (!nonVariantGroups || nonVariantGroups.length === 0) return true;
    for (const g of nonVariantGroups) {
      const set = selectedAddonIds[g.id] ?? new Set<string>();
      const count = set.size;
      if (g.required && (g.minSelect ?? 1) > count) return false;
      if (typeof g.minSelect === "number" && count < g.minSelect) return false;
      if (typeof g.maxSelect === "number" && count > g.maxSelect) return false;
    }
    return true;
  }, [dish, selectedAddonIds, nonVariantGroups]);

  const toggleAddon = (groupId: string, optionId: string) => {
    setSelectedAddonIds((prev) => {
      const next = { ...prev };
      const set = new Set(next[groupId] ?? new Set<string>());

      const group = nonVariantGroups.find(g => g.id === groupId);
      const isSingleSelect = group?.maxSelect === 1;

      if (set.has(optionId)) {
        set.delete(optionId);
      } else {
        if (isSingleSelect) {
          set.clear();
        }
        set.add(optionId);
      }
      next[groupId] = set;
      return next;
    });
  };

  useEffect(() => {
    const first = nonVariantGroups[0]?.id ?? null;
    setActiveGroupId(first);
  }, [nonVariantGroups]);

  useEffect(() => {
    const root = rightColRef.current;
    if (!root || !nonVariantGroups || nonVariantGroups.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0])
          setActiveGroupId(visible[0].target.getAttribute("data-id"));
      },
      { root, rootMargin: "-100px 0px -60% 0px", threshold: 0.2 }
    );
    nonVariantGroups.forEach((g) => {
      const node = groupRefs.current[g.id];
      if (node) obs.observe(node);
    });
    return () => obs.disconnect();
  }, [nonVariantGroups]);

  if (!dish) return null;

  const scrollToGroup = (id: string) => {
    const root = rightColRef.current;
    const target = groupRefs.current[id];
    if (!root || !target) return;
    const top = target.offsetTop - 12;
    root.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="fixed z-[70] left-0 right-0 bottom-0 h-auto max-h-[90vh] md:h-auto md:max-h-[90vh] rounded-t-[32px] md:rounded-t-[48px] bg-[#F7F7F7] border-t border-gray-200 shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col"
          >
            {/* Mobile Sticky Header */}
            <div className="md:hidden sticky top-0 left-0 right-0 z-[80] bg-[#F7F7F7] px-6 py-4 border-b border-gray-200 flex items-start gap-4 shrink-0">
              <div className="flex-1 min-w-0 pt-1">
                <div className="text-[28px] font-anton font-extrabold text-[#1A1A1A] leading-tight line-clamp-1">
                  {dish.name.toUpperCase()}
                </div>
                {dish.description && (
                  <div className="text-xs text-[#555] mt-0.5 line-clamp-2 leading-snug">
                    {dish.description}
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-4 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-[40%_60%] gap-0 pb-0 flex-1 min-h-0">

              {/* Left Column - Image & Qty */}
              <div className="relative shrink-0 h-auto md:h-full md:overflow-y-auto no-scrollbar p-5 pt-0 md:p-8 md:pt-8 md:pb-24">
                <div className="hidden md:block">
                  <div className="text-[32px] md:text-[48px] font-anton font-extrabold text-[#1A1A1A] leading-tight">
                    {dish.name.toUpperCase()}
                  </div>
                  <div className="text-sm text-[#555] mt-1">
                    {dish.description}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8 md:gap-16 bg-gray-200 rounded-[32px] px-4 py-3 md:px-6 md:py-4 mx-8 md:mx-28 mt-5 md:mt-6 mb-5 md:mb-6 shadow-sm">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="text-4xl font-semibold text-gray-600 w-8 h-8 flex items-center justify-center"
                  >
                    −
                  </motion.button>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-md text-gray-800 font-semibold">
                      Quantity
                    </span>
                    <div className="flex items-center gap-0">
                      <svg
                        className="w-8 h-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <div className="relative h-9 w-12">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={qty}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-[#1A1A1A]"
                          >
                            {qty}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {qty} {qty === 1 ? "person" : "persons"}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setQty(qty + 1)}
                    className="text-3xl font-bold text-gray-600 w-8 h-8 flex items-center justify-center"
                  >
                    +
                  </motion.button>
                </div>

                <div className="hidden md:block mt-4 mx-0 md:mx-6 relative rounded-[32px] md:rounded-[44px] overflow-hidden bg-white shadow">
                  <div className="relative aspect-[16/12]">
                    <ImageWithFallback
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      placeholderMode="horizontal"
                      className="object-cover"
                    />
                  </div>
                </div>

                {(variantGroup && variantGroup.options?.length > 0) ? (
                  <div className="mt-6">
                    <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3">
                      {(variantGroup?.options ?? []).map((v: OptionChoice) => (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`
                            px-4 py-2.5 md:px-6 md:py-4 rounded-[18px] md:rounded-[22px] border-2 transition-all duration-300 flex-1 md:flex-none min-w-[100px] md:min-w-[120px] text-center
                            ${currentVariantId === v.id
                              ? "bg-lime-500 text-white border-lime-400 shadow-lg shadow-lime-500/20 font-bold"
                              : "bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50 font-medium"
                            }
                          `}
                        >
                          <div className="text-[12px] md:text-sm uppercase tracking-wider mb-0.5 opacity-80">{v.name}</div>
                          <div className="text-sm md:text-base font-anton">{formatVnd((dish?.price ?? 0) + Number(v.price || 0))}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Right Column - Options */}
              <div
                className="relative flex-1 min-h-0 h-auto md:h-full md:overflow-hidden flex flex-col bg-[#f8f9fa] border-t md:border-t-0 md:border-l border-gray-100"
              >
                {nonVariantGroups && nonVariantGroups.length > 0 && (
                  <div className="shrink-0 z-20 bg-[#f8f9fa] px-5 md:px-12 pt-4 md:pt-6 pb-0">
                    <div
                      ref={addonContainerRef}
                      className="relative border-b-2 border-gray-200 pb-2"
                    >
                      <HoverHighlightOverlay
                        rect={addonRect}
                        style={addonStyle}
                      />
                      <div className="overflow-x-auto no-scrollbar">
                        <div className="inline-flex items-center gap-4 md:gap-8 px-2 py-2">
                          {nonVariantGroups.map((g) => {
                            const set =
                              selectedAddonIds[g.id] ?? new Set<string>();
                            const unmet =
                              (g.required || typeof g.minSelect === "number") &&
                              set.size < (g.minSelect ?? 1);
                            return (
                              <button
                                key={g.id}
                                onClick={() => scrollToGroup(g.id)}
                                onMouseEnter={(e) =>
                                  addonMove(e, {
                                    borderRadius: 16,
                                    backgroundColor: "rgba(0,0,0,0.06)",
                                    opacity: 1,
                                  })
                                }
                                onMouseLeave={addonClear}
                                className={`relative text-lg md:text-2xl font-semibold font-anton ${activeGroupId === g.id ? "text-[#1A1A1A]" : "text-[#555]"} px-3 py-2`}
                              >
                                {String(g.title || "").toUpperCase()}
                                {unmet && (
                                  <span className="absolute top-0.5 -right-0.5 w-[12px] h-[12px] rounded-full bg-red-500 shadow-sm border border-white" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  ref={rightColRef}
                  className="flex-1 md:overflow-y-auto px-4 md:px-12 py-5 pb-32 md:pb-32"
                >
                  {nonVariantGroups && nonVariantGroups.length > 0 ? (
                    <div className="space-y-5">
                      {nonVariantGroups.map((g) => (
                        <section
                          key={g.id}
                          ref={(el) => {
                            groupRefs.current[g.id] = el;
                          }}
                          data-id={g.id}
                          className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 scroll-mt-36"
                        >
                          <div className="px-6 py-4 md:py-5 pb-0 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-lime-100 flex items-center justify-center text-lime-600 flex-shrink-0">
                                <ChefHat className="w-5 h-5 md:w-6 md:h-6" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-[#1A1A1A] text-base md:text-lg leading-none truncate">
                                  {String(g.title || "")}
                                </h4>
                                {(typeof g.minSelect === "number" || typeof g.maxSelect === "number") && (
                                  <div className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1 md:mt-1.5 truncate">
                                    {typeof g.minSelect === "number" ? `Min ${g.minSelect}` : "Optional"}
                                    {typeof g.maxSelect === "number" ? ` • Max ${g.maxSelect}` : ""}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Status Indicator: Morphing Badge - Adaptive for Mobile/Desktop */}
                            {(() => {
                              const set = selectedAddonIds[g.id] ?? new Set<string>();
                              const count = set.size;
                              const isSatisfied = (!g.required || count >= (g.minSelect ?? 1)) && (!g.maxSelect || count <= g.maxSelect);
                              const isRequired = g.required || (g.minSelect ?? 0) > 0;

                              if (!isSatisfied && !isRequired) return null;

                              return (
                                <motion.div
                                  layout
                                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                  className={`
                                    relative flex items-center overflow-hidden border-2 flex-shrink-0 shadow-sm
                                    ${isSatisfied
                                      ? "px-1 md:px-1.5 py-1 md:py-1.5 rounded-full bg-lime-50 border-lime-100"
                                      : "pl-1.5 pr-3 md:pr-4 py-1.5 rounded-full bg-red-50 border-red-100"
                                    }
                                  `}
                                >
                                  {/* Icon Box - Restored to TableFilterBadges style */}
                                  <motion.div
                                    layout
                                    className={`
                                      flex-shrink-0 items-center justify-center flex
                                      ${isSatisfied
                                        ? "w-5 h-5 md:w-7 md:h-7 rounded-full md:rounded-[12px] bg-lime-200 text-lime-700"
                                        : "w-5 h-5 md:w-7 md:h-7 rounded-full md:rounded-[12px] bg-red-100 text-red-600"
                                      }
                                    `}
                                  >
                                    <AnimatePresence mode="wait" initial={false}>
                                      {isSatisfied ? (
                                        <motion.div
                                          key="check"
                                          initial={{ opacity: 0, scale: 0.5 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.5 }}
                                        >
                                          <Check size={13} strokeWidth={5} />
                                        </motion.div>
                                      ) : (
                                        <motion.div
                                          key="alert"
                                          initial={{ opacity: 0, scale: 0.5 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.5 }}
                                        >
                                          <AlertCircle className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 animate-pulse" strokeWidth={3} />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </motion.div>

                                  {/* Text Section - Adaptive style with small gap for icon */}
                                  <AnimatePresence mode="popLayout" initial={false}>
                                    {!isSatisfied && (
                                      <motion.div
                                        key="text"
                                        layout
                                        initial={{ opacity: 0, width: 0, x: -5 }}
                                        animate={{ opacity: 1, width: "auto", x: 0 }}
                                        exit={{ opacity: 0, width: 0, x: -5 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col -space-y-0.5 ml-1.5 md:ml-2.5 pointer-events-none text-left overflow-hidden"
                                      >
                                        <span className="hidden md:block text-[9px] font-black uppercase tracking-widest text-red-600/60 transition-colors">
                                          Selection
                                        </span>
                                        <span className="text-[9px] md:text-[12px] font-bold tracking-tight text-red-500 md:text-red-700 uppercase transition-colors">
                                          Required
                                        </span>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              );
                            })()}
                          </div>

                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(g.options ?? []).map((opt) => {
                              const set = selectedAddonIds[g.id] ?? new Set<string>();
                              const active = set.has(opt.id);
                              // Only disable if it's a multi-select group (max > 1) and limit is reached.
                              // For single-select (max === 1), we allow clicking to swap options.
                              const disable = !active && typeof g.maxSelect === "number" && g.maxSelect > 1 && set.size >= g.maxSelect;

                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => toggleAddon(g.id, opt.id)}
                                  disabled={disable}
                                  className={`
                                    relative w-full text-left p-2 md:p-2.5 rounded-[24px] md:rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-3 md:gap-4
                                    ${active
                                      ? "bg-lime-50 border-lime-100 shadow-sm"
                                      : "bg-white border-gray-50 hover:border-gray-100 hover:bg-gray-50/30"
                                    }
                                    ${disable ? "opacity-40 pointer-events-none" : ""}
                                  `}
                                >
                                  {/* Left Icon Box (Mimics the modal style) */}
                                  <div className={`
                                    w-9 h-9 md:w-11 md:h-11 rounded-[14px] md:rounded-[18px] flex items-center justify-center flex-shrink-0 transition-all duration-300
                                    ${active
                                      ? 'bg-lime-200 text-lime-700'
                                      : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                                    }
                                  `}>
                                    <Utensils className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={2.2} />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className={`text-sm md:text-[15px] font-bold tracking-tight transition-all ${active ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                                      {String(opt.name || "")}
                                    </div>
                                    <div className={`text-[11px] md:text-sm font-semibold transition-all ${active ? "text-lime-600/80" : "text-gray-400"}`}>
                                      {Number(opt.price || 0) === 0 ? (
                                        <span className="text-[9px] md:text-[12px] font-semibold">Miễn phí</span>
                                      ) : (
                                        `+ ${formatVnd(Number(opt.price || 0))}`
                                      )}
                                    </div>
                                  </div>

                                  {/* Right Checkmark Circle (Mimics the modal style) */}
                                  <div className={`
                                    w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                                    ${active
                                      ? "bg-lime-500 text-white scale-100 shadow-sm"
                                      : "bg-gray-100 text-transparent scale-90"
                                    }
                                  `}>
                                    <Check className={`w-[14px] h-[14px] md:w-4 md:h-4 ${active ? "opacity-100" : "opacity-0"}`} strokeWidth={4} />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </section>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center min-h-[280px]">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-[var(--primary)] shadow-sm">
                          <ChefHat className="w-8 h-8" />
                        </div>
                        <div className="mt-3 text-base font-semibold text-[#1A1A1A]">
                          Không có tuỳ chọn thêm
                        </div>
                        <div className="text-sm text-gray-500">
                          Chọn phân loại hoặc tiếp tục
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="fixed md:absolute bottom-0 left-0 right-0 p-4 md:py-6 md:px-12 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-[90] md:z-10 md:w-[60%] md:left-auto flex justify-center">
              <motion.button
                whileHover={canConfirm && !isAdding ? { y: -2 } : {}}
                whileTap={canConfirm && !isAdding ? { scale: 0.98 } : {}}
                disabled={!canConfirm || isAdding}
                ref={confirmRef}
                onClick={async () => {
                  setIsAdding(true);
                  try {
                    await onConfirm(
                      {
                        variant,
                        addons,
                        groups: [
                          ...(
                            variantGroup && variant
                              ? [
                                {
                                  id: String(variantGroup.id),
                                  title: String(variantGroup.title || ""),
                                  options: [
                                    { id: String(variant.id), name: String(variant.name), price: Number(variant.price) },
                                  ],
                                },
                              ]
                              : []
                          ),
                          ...nonVariantGroups
                            .map((g) => {
                              const set = selectedAddonIds[g.id] ?? new Set<string>();
                              const opts = (g.options ?? []).filter((o) => set.has(o.id));
                              return {
                                id: String(g.id),
                                title: String(g.title || ""),
                                options: opts.map((o) => ({ id: String(o.id), name: String(o.name || ""), price: Number(o.price || 0) })),
                              };
                            })
                            .filter((g) => g.options.length > 0),
                        ],
                        quantity: qty,
                        totalPrice,
                      },
                      confirmRef.current?.getBoundingClientRect() || undefined
                    );
                  } finally {
                    setIsAdding(false);
                  }
                }}
                className={`group/btn relative w-full max-w-[420px] h-[72px] rounded-[32px] flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${canConfirm && !isAdding
                  ? "bg-lime-500 text-white hover:bg-lime-600"
                  : "bg-gray-200 text-gray-400"
                  } disabled:opacity-70 overflow-hidden`}
              >
                <div className="flex items-center gap-3 relative z-10">
                  {isAdding ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${canConfirm ? "bg-white/20 group-hover/btn:bg-white/30" : "bg-black/5"}`}>
                      <Plus className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                  )}
                  <span className="text-base font-bold tracking-tight">
                    {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                  </span>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="h-8 w-px bg-white/20 mx-1" />
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] opacity-70 leading-none mb-1 text-white">Total</span>
                    <span className="text-[20px] font-anton leading-none whitespace-nowrap">
                      {formatVnd(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Glossy Overlay */}
                {canConfirm && !isAdding && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

