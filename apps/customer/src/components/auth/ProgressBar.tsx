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
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-[18px] left-0 w-full h-[2px] bg-gray-100">
          <motion.div
            className="h-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.1)]"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Steps */}
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
                className={`w-9 h-9 flex items-center justify-center font-anton text-[10px] tracking-widest transition-all duration-500 ${isCompleted
                    ? "bg-black text-white"
                    : isCurrent
                      ? "bg-lime-500 text-black shadow-[0_10px_20px_rgba(163,230,53,0.3)] scale-110"
                      : "bg-white border-2 border-gray-100 text-gray-300"
                  }`}
              >
                {isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  `0${stepNumber}`
                )}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={`mt-3 text-[9px] font-anton uppercase tracking-[0.2em] whitespace-nowrap ${isCurrent ? "text-black" : isCompleted ? "text-gray-400" : "text-gray-200"
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

