"use client";

import { motion } from "@repo/ui/motion";
import { Check } from "@repo/ui/icons";

export default function ProgressBar({ currentStep, totalSteps, steps }: { currentStep: number; totalSteps: number; steps: string[] }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          return (
            <div key={stepNumber} className="flex flex-col items-center relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-[var(--primary)] text-white shadow-lg"
                    : isCurrent
                      ? "bg-white border-4 border-[var(--primary)] text-[var(--primary)] shadow-lg scale-110"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.3 }}>
                    <Check size={20} strokeWidth={3} />
                  </motion.div>
                ) : (
                  stepNumber
                )}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={`mt-2 text-xs md:text-sm font-medium whitespace-nowrap ${
                  isCurrent ? "text-[var(--primary)]" : isCompleted ? "text-gray-700" : "text-gray-400"
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
