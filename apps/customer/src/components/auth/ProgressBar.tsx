"use client";

import { motion } from "@repo/ui/motion";
import { Check } from "@repo/ui/icons";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Line - Thickened and recessed like an AuthInput track */}
        <div className="absolute top-[20px] left-0 w-full h-[6px] bg-slate-100 rounded-full shadow-[inset_0_0_8px_rgba(0,0,0,0.06)]">
          <motion.div
            className="h-full bg-lime-500 rounded-full shadow-[0_0_15px_rgba(120,200,65,0.4)]"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Steps - Tactile Rounded Squares */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex flex-col items-center relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`w-10 h-10 flex items-center justify-center font-black text-[12px] rounded-[14px] transition-all duration-500 shadow-[inset_0_0_15px_rgba(0,0,0,0.06)] border border-white ${isCompleted
                  ? "bg-[#1A1A1A] text-white shadow-none"
                  : isCurrent
                    ? "bg-lime-500 text-white shadow-[0_10px_25px_rgba(120,200,65,0.3)] scale-110"
                    : "bg-slate-50 text-slate-300"
                  }`}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={4} />
                ) : (
                  stepNumber
                )}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={`mt-4 text-[10px] font-extrabold uppercase tracking-[0.2em] whitespace-nowrap ${isCurrent ? "text-slate-900" : isCompleted ? "text-slate-400" : "text-slate-200"
                  }`}
              >
                {step}
              </motion.p>
            </div>
          );
        })}
      </div>
    </div>
  );
}


