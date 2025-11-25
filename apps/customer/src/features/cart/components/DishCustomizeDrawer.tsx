"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ImageWithFallback } from "@repo/ui";
import { useState, useMemo, useRef, useEffect } from "react";
import type { Dish, DishVariant, OptionGroup, OptionChoice } from "@repo/types";
import { formatVnd } from "@repo/lib";
import { useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { ChefHat } from "@repo/ui/icons";

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
    const byTitle = optionGroups.find((g) => String(g.title || "").toLowerCase().startsWith(VARIANT_PREFIX));
    return byTitle ?? null;
  }, [optionGroups]);

  const nonVariantGroups: OptionGroup[] = useMemo(() => {
    return optionGroups.filter((g) => {
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
            initial={{ y: 480, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 480, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed z-[70] left-0 right-0 bottom-0 max-h-[88vh] rounded-t-[48px] bg-[#F7F7F7] border-t border-gray-200 overflow-hidden"
          >
            <div className="grid grid-cols-[40%_60%] gap-0 h-full">
              <div className="relative overflow-y-auto no-scrollbar p-8 pb-24">
                <div>
                  <div
                    className="text-[48px] font-anton font-extrabold text-[#1A1A1A]"
                    style={{}}
                  >
                    {dish.name.toUpperCase()}
                  </div>
                  <div className="text-sm text-[#555] mt-1">
                    {dish.description}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-16 bg-gray-200 rounded-3xl px-6 py-4 mx-28 mt-6 mb-6 shadow-sm">
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
                <div className="mt-4 mx-8 relative rounded-[30px] overflow-hidden bg-white shadow">
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
                    <div
                      className="text-3xl text-gray-600 font-semibold text-[#1A1A1A] tracking-wide mb-2"
                      style={{
                        fontStretch: "condensed",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Variant
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {(variantGroup?.options ?? []).map((v: OptionChoice) => (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`px-8 py-4 rounded-2xl text-md font-medium transition-all shadow-sm border ${currentVariantId === v.id ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-gray-300 text-gray-400 border-gray-300 hover:bg-gray-100"} `}
                        >
                          {v.name} • {formatVnd((dish?.price ?? 0) + Number(v.price || 0))}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <div
                ref={rightColRef}
                className="relative overflow-y-auto px-12 p-6 pb-24 bg-white border-l border-gray-100"
              >
                {nonVariantGroups && nonVariantGroups.length > 0 && (
                  <div className="sticky top-0 z-10 -mt-6 pt-6 bg-white">
                    <div
                      ref={addonContainerRef}
                      className="relative mb-12 border-b-2 border-gray-300"
                    >
                      <HoverHighlightOverlay
                        rect={addonRect}
                        style={addonStyle}
                      />
                      <div className="overflow-x-auto">
                        <div className="inline-flex items-center gap-6 px-1 py-3">
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
                                className={`relative text-2xl font-semibold font-anton ${activeGroupId === g.id ? "text-[#1A1A1A]" : "text-[#555]"} px-3 py-2`}
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
                {nonVariantGroups && nonVariantGroups.length > 0 ? (
                  <div className="space-y-6">
                    {nonVariantGroups.map((g) => (
                      <section
                        key={g.id}
                        ref={(el) => {
                          groupRefs.current[g.id] = el;
                        }}
                        data-id={g.id}
                      >
                        <div className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide mb-2">
                          {String(g.title || "")}
                          {typeof g.minSelect === "number" && (
                            <span className="ml-2 text-gray-500 lowercase">
                              chọn tối thiểu {g.minSelect}
                              {typeof g.maxSelect === "number"
                                ? `, tối đa ${g.maxSelect}`
                                : ""}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {(g.options ?? []).map((opt) => {
                            const set =
                              selectedAddonIds[g.id] ?? new Set<string>();
                            const active = set.has(opt.id);
                            const disable =
                              !active &&
                              typeof g.maxSelect === "number" &&
                              set.size >= (g.maxSelect ?? 0);
                            return (
                              <button
                                key={opt.id}
                                onClick={() => toggleAddon(g.id, opt.id)}
                                disabled={disable}
                                className={`text-left px-3 py-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${active ? "bg-[var(--primary)]/20 border-[var(--primary)] ring-1 ring-[var(--primary)]" : "bg-gray-50 border-gray-200 hover:bg-gray-50"} ${disable ? "opacity-50 pointer-events-none" : ""}`}
                              >
                                <div className="w-8 h-8 rounded-xl bg-gray-200 text-[var(--primary)] border border-gray-200 flex items-center justify-center">
                                  <ChefHat className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-sm text-[#1A1A1A]">
                                    {String(opt.name || "")}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {formatVnd(Number(opt.price || 0))}
                                  </div>
                                </div>
                                <div
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${active ? "bg-[var(--primary)] border-[var(--primary)] text-white" : "bg-white border-gray-300"}`}
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    className={`w-4 h-4 ${active ? "opacity-100" : "opacity-0"}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                  >
                                    <path d="M20 6 9 17l-5-5" />
                                  </svg>
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
                <div className="flex items-center justify-center mt-8 border-t border-gray-100 bg-white">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!canConfirm}
                    ref={confirmRef}
                    onClick={() =>
                      onConfirm(
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
                      )
                    }
                    className={`w-full max-w-sm h-16 rounded-2xl flex items-center justify-center gap-2 transition-all ${canConfirm ? "bg-[var(--primary)] text-white shadow-sm" : "bg-gray-200 text-gray-500"} font-semibold`}
                  >
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
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
