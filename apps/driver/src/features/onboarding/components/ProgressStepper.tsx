"use client";
import { ONBOARDING_STEPS, type OnboardingStepId } from "../types";
import { motion } from "@repo/ui/motion";
import { useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";

export default function ProgressStepper({ currentIndex, onClickId, navHidden, visibleIds }: { currentIndex: number; onClickId?: (id: OnboardingStepId) => void; navHidden?: boolean; visibleIds?: OnboardingStepId[] }) {
  const currentId = ONBOARDING_STEPS[currentIndex]?.id;
  const defaultIds: OnboardingStepId[] = ONBOARDING_STEPS.map((x) => x.id);
  const displayIds: OnboardingStepId[] = visibleIds ?? defaultIds;
  const localIndex = Math.max(0, displayIds.findIndex((id) => id === currentId));
  const total = displayIds.length;
  const progressPercent = Math.min(100, Math.max(0, ((localIndex + 1) / total) * 100));
  const segWidthPct = 100 / total;
  const segStartPct = localIndex * segWidthPct;
  const segEndPct = segStartPct + segWidthPct;
  const highlightWidthPct = Math.max(6, segWidthPct * 0.4);
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();
  return (
    <div className="w-full">
      {!navHidden && (
        <div ref={containerRef} className="relative bg-white border-b border-gray-200">
          <HoverHighlightOverlay rect={rect} style={style} />
          <div className="overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-6 px-3 py-3 min-w-full">
              {displayIds.map((id) => {
                const s = ONBOARDING_STEPS.find((x) => x.id === id)!;
                const idx = displayIds.indexOf(id);
                const active = id === currentId;
                const done = idx < localIndex;
                return (
                  <button
                    key={s.id}
                    onClick={(e) => { onClickId?.(s.id); moveHighlight(e, { borderRadius: 12, backgroundColor: "rgba(0,0,0,0.06)", opacity: 1, scaleEnabled: true, scale: 1.05 }); }}
                    onMouseLeave={clearHover}
                    className={`text-[14px] font-bold uppercase tracking-wide transition-all relative pb-1 whitespace-nowrap ${active ? "text-[#1A1A1A]" : done ? "text-emerald-400" : "text-gray-400"}`}
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="mt-2 relative h-2 bg-gray-200 rounded-full">
        <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="absolute left-0 top-0 h-2 bg-[var(--primary)] rounded-full" />
        {localIndex >= 0 && localIndex < total - 1 && (
          <motion.div initial={{ left: `${segStartPct}%` }} animate={{ left: [`${segStartPct}%`, `${segEndPct}%`] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} style={{ width: `${highlightWidthPct}%` }} className="absolute top-0 h-2 rounded-full bg-[var(--primary)]/50 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
        )}
      </div>
    </div>
  );
}
