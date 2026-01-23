"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ImageWithFallback } from "@repo/ui";
import { useState, useMemo, useRef, useEffect } from "react";
import type { Dish, DishVariant, OptionGroup, OptionChoice } from "@repo/types";
import { formatVnd } from "@repo/lib";
import { useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { ChefHat, X, Loader2, Check } from "@repo/ui/icons";

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
      if (set.has(optionId)) set.delete(optionId);
      else set.add(optionId);
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

                <div className="flex items-center justify-center gap-8 md:gap-16 bg-gray-200 rounded-3xl px-4 py-3 md:px-6 md:py-4 mx-8 md:mx-28 mt-5 md:mt-6 mb-5 md:mb-6 shadow-sm">
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

                <div className="hidden md:block mt-4 mx-0 md:mx-8 relative rounded-[20px] md:rounded-[30px] overflow-hidden bg-white shadow">
                  <div className="relative aspect-[16/7]">
                    <ImageWithFallback
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {(variantGroup && variantGroup.options?.length > 0) ? (
                  <div className="mt-6">
                    <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3">
                      {(variantGroup?.options ?? []).map((v: OptionChoice) => (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`px-2 py-4 md:px-8 rounded-2xl text-md font-medium transition-all shadow-sm border flex flex-col items-center justify-center md:block text-center ${currentVariantId === v.id ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-gray-300 text-gray-400 border-gray-300 hover:bg-gray-100"} `}
                        >
                          {v.name} • {formatVnd((dish?.price ?? 0) + Number(v.price || 0))}
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
                                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
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
                  className="flex-1 md:overflow-y-auto px-5 md:px-12 py-6 pb-32 md:pb-32"
                >
                  {nonVariantGroups && nonVariantGroups.length > 0 ? (
                    <div className="space-y-6">
                      {nonVariantGroups.map((g) => (
                        <section
                          key={g.id}
                          ref={(el) => {
                            groupRefs.current[g.id] = el;
                          }}
                          data-id={g.id}
                          className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 scroll-mt-36"
                        >
                          <div className="px-6 py-5 pb-0 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-lime-50 flex items-center justify-center text-lime-500">
                                <ChefHat className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="font-bold text-[#1A1A1A] text-lg leading-none">
                                  {String(g.title || "")}
                                </h4>
                                {(typeof g.minSelect === "number" || typeof g.maxSelect === "number") && (
                                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1.5">
                                    {typeof g.minSelect === "number" ? `Min ${g.minSelect}` : "Optional"}
                                    {typeof g.maxSelect === "number" ? ` • Max ${g.maxSelect}` : ""}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Optional: Checkmark if satisfied */}
                            {(() => {
                              const set = selectedAddonIds[g.id] ?? new Set<string>();
                              const count = set.size;
                              const isSatisfied = (!g.required || count >= (g.minSelect ?? 1)) && (!g.maxSelect || count <= g.maxSelect);
                              return isSatisfied && (
                                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              );
                            })()}
                          </div>

                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(g.options ?? []).map((opt) => {
                              const set = selectedAddonIds[g.id] ?? new Set<string>();
                              const active = set.has(opt.id);
                              const disable = !active && typeof g.maxSelect === "number" && set.size >= (g.maxSelect ?? 0);

                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => toggleAddon(g.id, opt.id)}
                                  disabled={disable}
                                  className={`
                                    relative w-full text-left p-3 md:p-4 rounded-[20px] border transition-all duration-200 group
                                    ${active
                                      ? "bg-lime-50 border-lime-200 shadow-sm"
                                      : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm hover:bg-gray-50/50"
                                    }
                                    ${disable ? "opacity-50 pointer-events-none" : ""}
                                  `}
                                >
                                  <div className="flex items-center gap-3 md:gap-4">
                                    <div className={`
                                      w-5 h-5 md:w-6 md:h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all
                                      ${active
                                        ? "bg-lime-500 border-lime-500 text-white"
                                        : "bg-transparent border-gray-300 group-hover:border-gray-400"
                                      }
                                    `}>
                                      {active && <Check className="w-3 md:w-3.5 h-3 md:h-3.5" />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className={`text-[14px] md:text-[15px] font-bold truncate ${active ? "text-[#1A1A1A]" : "text-gray-600"}`}>
                                        {String(opt.name || "")}
                                      </div>
                                      <div className="text-xs md:text-sm font-medium text-gray-400">
                                        {formatVnd(Number(opt.price || 0))}
                                      </div>
                                    </div>
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
            <div className="fixed md:absolute bottom-0 left-0 right-0 p-4 md:py-4 md:p-8 bg-white border-t border-gray-100 z-[90] md:z-10 md:w-[60%] md:left-auto flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
                className={`w-full max-w-sm h-16 rounded-2xl flex items-center justify-center gap-2 transition-all ${canConfirm && !isAdding ? "bg-[var(--primary)] text-white shadow-sm" : "bg-gray-200 text-gray-500"} font-semibold disabled:opacity-70`}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang thêm...</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 4h-2l-1 2v2h2l2-4h9l1 4h-2l-1-2h-8"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M5 8h12l-1 7H7L5 8z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle cx="8" cy="20" r="2" fill="currentColor" />
                      <circle cx="17" cy="20" r="2" fill="currentColor" />
                    </svg>
                    <span>Thêm vào giỏ - {formatVnd(totalPrice)}</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
