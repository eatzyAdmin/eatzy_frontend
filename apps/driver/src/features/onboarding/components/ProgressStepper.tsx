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
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();

  return (
    <div className="w-full">
      {/* Navigation Tabs - Transparent modern style */}
      {!navHidden && (
        <div ref={containerRef} className="relative mb-6">
          <HoverHighlightOverlay rect={rect} style={style} />
          <div className="overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-3 py-2 min-w-full">
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
                      moveHighlight(e, { borderRadius: 12, backgroundColor: "rgba(132,204,22,0.08)", opacity: 1, scaleEnabled: true, scale: 1.02 });
                    }}
                    onMouseLeave={clearHover}
                    className={`text-[10px] font-black uppercase tracking-widest transition-all relative py-2.5 px-4 rounded-xl whitespace-nowrap ${active
                        ? "text-black bg-lime-400/20 shadow-sm"
                        : done
                          ? "text-lime-600"
                          : "text-gray-400 hover:text-gray-900"
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

      {/* Progress Bar - Simplified, no shimmer or labels */}
      <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 h-full bg-lime-500 rounded-full shadow-lg shadow-lime-500/20"
        />
      </div>
    </div>
  );
}
