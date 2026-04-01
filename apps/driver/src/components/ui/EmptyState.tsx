"use client";
import React from 'react';
import { motion } from "@repo/ui/motion";
import { ChevronRight, type LucideIcon } from "@repo/ui/icons";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
  buttonText?: string;
  buttonIcon?: LucideIcon;
  onButtonClick?: () => void;
  className?: string; // Root container classes
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonIcon: ButtonIcon,
  onButtonClick,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center px-0 w-full ${className}`}
    >
      <div className="mb-6">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-[32px] md:rounded-[36px] bg-gray-50 flex items-center justify-center text-gray-200 border-2 border-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] md:shadow-[inset_0_2px_10px_rgba(0,0,0,0.06)] mx-auto relative group">
          <Icon className="size-10 md:size-12 relative z-10 transition-transform duration-500 group-hover:scale-110" strokeWidth={2.0} />
        </div>
      </div>

      <h3 className="text-md md:text-xl font-bold md:font-extrabold tracking-tight text-[#1A1A1A] mb-1 md:mb-1.5">
        {title}
      </h3>
      <p className="text-gray-400 text-[11px] md:text-sm font-medium leading-relaxed max-w-[220px] md:max-w-[280px]">
        {description}
      </p>

      {buttonText && (
        <div className="bg-[#E4F8D5] rounded-full p-1.5 mt-6 md:mt-10 mx-auto w-fit">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onButtonClick}
            className="group/btn relative h-[60px] md:h-[72px] bg-[var(--primary)] hover:bg-[#A9E23D] text-[#154D1B] rounded-full flex items-center justify-center px-12 md:px-20 shadow-[0_12px_30px_rgba(0,0,0,0.1)] md:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-center gap-3 md:gap-4 relative z-10 transition-all">
              {ButtonIcon && (
                <ButtonIcon
                  size={20}
                  className="md:size-6 group-hover/btn:rotate-12 transition-all duration-300"
                  strokeWidth={2.5}
                />
              )}
              <span className="text-xl md:text-2xl font-anton font-black tracking-tight uppercase">
                {buttonText}
              </span>
              <ChevronRight
                size={18}
                className="md:size-5 group-hover/btn:translate-x-1.5 transition-transform duration-300"
                strokeWidth={3}
              />
            </div>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
