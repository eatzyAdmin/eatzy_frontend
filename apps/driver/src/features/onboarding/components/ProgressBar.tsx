"use client";

import { motion } from "@repo/ui/motion";
import { Check } from "@repo/ui/icons";

export default function ProgressBar({ currentStep, totalSteps, steps }: { currentStep: number; totalSteps: number; steps: string[] }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Container */}
      <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
        <div className="flex items-center justify-between relative">
          {/* Progress Line Background */}
          <div className="absolute top-5 left-0 w-full h-2 bg-gray-100 rounded-full">
            <motion.div
              className="h-full bg-lime-500 rounded-full shadow-lg shadow-lime-500/30"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Step Indicators */}
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
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-anton text-sm transition-all duration-300 ${isCompleted
                      ? "bg-lime-500 text-[#1A1A1A] shadow-lg shadow-lime-500/30"
                      : isCurrent
                        ? "bg-white border-4 border-lime-500 text-lime-600 shadow-lg scale-110"
                        : "bg-gray-100 border-2 border-gray-200 text-gray-400"
                    }`}
                >
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.3 }}>
                      <Check size={18} strokeWidth={3} />
                    </motion.div>
                  ) : (
                    stepNumber
                  )}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={`mt-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${isCurrent ? "text-lime-600" : isCompleted ? "text-[#1A1A1A]" : "text-gray-400"
                    }`}
                >
                  {step}
                </motion.p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
