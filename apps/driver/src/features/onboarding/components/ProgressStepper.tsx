"use client";
import { ONBOARDING_STEPS, type OnboardingStepId } from "../types";
import { motion } from "@repo/ui/motion";
import { useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";

export default function ProgressStepper({
  currentIndex,
  onClickId,
  navHidden,
  visibleIds
}: {
  currentIndex: number;
  onClickId?: (id: OnboardingStepId) => void;
  navHidden?: boolean;
  visibleIds?: OnboardingStepId[]
}) {
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
      {/* Navigation Tabs - Matching OrderDetailsModal header style */}
      {!navHidden && (
        <div ref={containerRef} className="relative bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 mb-4">
          <HoverHighlightOverlay rect={rect} style={style} />
          <div className="overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-4 px-4 py-4 min-w-full">
              {displayIds.map((id) => {
                const s = ONBOARDING_STEPS.find((x) => x.id === id)!;
                const idx = displayIds.indexOf(id);
                const active = id === currentId;
                const done = idx < localIndex;
                return (
                  <button
                    key={s.id}
                    onClick={(e) => {
                      onClickId?.(s.id);
                      moveHighlight(e, { borderRadius: 16, backgroundColor: "rgba(132,204,22,0.1)", opacity: 1, scaleEnabled: true, scale: 1.02 });
                    }}
                    onMouseLeave={clearHover}
                    className={`text-xs font-bold uppercase tracking-wider transition-all relative py-2 px-3 rounded-xl whitespace-nowrap ${active
                        ? "text-[#1A1A1A] bg-lime-100 border border-lime-200"
                        : done
                          ? "text-lime-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar - Matching OrderDetailsModal lime accent */}
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 h-3 bg-lime-500 rounded-full shadow-lg shadow-lime-500/30"
        />
        {localIndex >= 0 && localIndex < total - 1 && (
          <motion.div
            initial={{ left: `${segStartPct}%` }}
            animate={{ left: [`${segStartPct}%`, `${segEndPct}%`] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: `${highlightWidthPct}%` }}
            className="absolute top-0 h-3 rounded-full bg-lime-300/70 shadow-[0_0_12px_rgba(132,204,22,0.6)]"
          />
        )}
      </div>

      {/* Step Counter */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bước {localIndex + 1}/{total}</span>
        <span className="text-xs font-bold text-lime-600 uppercase tracking-wider">{Math.round(progressPercent)}% hoàn thành</span>
      </div>
    </div>
  );
}
