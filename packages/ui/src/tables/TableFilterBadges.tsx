import React from 'react';
import { X } from '../icons';
import { motion, AnimatePresence } from '../motion';

export type BadgeTheme = 'primary' | 'secondary' | 'amber' | 'blue' | 'rose' | 'indigo' | 'emerald' | 'sky' | 'violet' | 'lime' | 'red' | 'gray' | 'orange';

export interface FilterBadge {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode | React.ReactNode[];
  onRemove: () => void;
  theme?: BadgeTheme;
}

interface TableFilterBadgesProps {
  badges: FilterBadge[];
  showActiveLabel?: boolean;
}

export default function TableFilterBadges({
  badges,
  showActiveLabel = true
}: TableFilterBadgesProps) {
  if (badges.length === 0) return null;

  const themes: Record<BadgeTheme, any> = {
    primary: {
      bg: 'bg-primary/5 border-primary/20',
      label: 'text-primary/60 group-hover:text-white/70',
      value: 'text-primary group-hover:text-white',
      iconBox: 'bg-primary/10 text-primary group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    },
    secondary: {
      bg: 'bg-secondary/5 border-secondary/20',
      label: 'text-secondary/70 group-hover:text-white/70',
      value: 'text-secondary group-hover:text-white',
      iconBox: 'bg-secondary/15 text-secondary group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    },
    amber: {
      bg: 'bg-amber-50 border-amber-100',
      label: 'text-amber-600/60 group-hover:text-white/70',
      value: 'text-amber-800 group-hover:text-white',
      iconBox: 'bg-amber-200 text-amber-700 group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    },
    blue: {
      bg: 'bg-blue-50 border-blue-100',
      label: 'text-blue-600/60 group-hover:text-white/70',
      value: 'text-blue-800 group-hover:text-white',
      iconBox: 'bg-blue-200 text-blue-700 group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    },
    rose: {
      bg: 'bg-rose-50 border-rose-100',
      label: 'text-rose-600/60 group-hover:text-white/70',
      value: 'text-rose-800 group-hover:text-white',
      iconBox: 'bg-rose-200 text-rose-700 group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    },
    indigo: {
      bg: 'bg-indigo-50 border-indigo-100',
      label: 'text-indigo-600/60 group-hover:text-white/70',
      value: 'text-indigo-800 group-hover:text-white',
      iconBox: 'bg-indigo-200 text-indigo-700 group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    },
    emerald: {
      bg: 'bg-emerald-50 border-emerald-100',
      label: 'text-emerald-600/60 group-hover:text-white/70',
      value: 'text-emerald-800 group-hover:text-white',
      iconBox: 'bg-emerald-200 text-emerald-700 group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    },
    sky: {
      bg: 'bg-sky-50 border-sky-100',
      label: 'text-sky-600/60 group-hover:text-white/70',
      value: 'text-sky-800 group-hover:text-white',
      iconBox: 'bg-sky-200 text-sky-700 group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    },
    violet: {
      bg: 'bg-violet-50 border-violet-100',
      label: 'text-violet-600/60 group-hover:text-white/70',
      value: 'text-violet-800 group-hover:text-white',
      iconBox: 'bg-violet-200 text-violet-700 group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    },
    lime: {
      bg: 'bg-lime-50 border-lime-100',
      label: 'text-lime-600/60 group-hover:text-white/70',
      value: 'text-lime-800 group-hover:text-white',
      iconBox: 'bg-lime-200 text-lime-700 group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    },
    red: {
      bg: 'bg-red-50 border-red-100',
      label: 'text-red-600/60 group-hover:text-white/70',
      value: 'text-red-800 group-hover:text-white',
      iconBox: 'bg-red-200 text-red-700 group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    },
    gray: {
      bg: 'bg-gray-50 border-gray-100',
      label: 'text-gray-500 group-hover:text-white/70',
      value: 'text-gray-900 group-hover:text-white',
      iconBox: 'bg-gray-100 text-gray-400 group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    },
    orange: {
      bg: 'bg-orange-50 border-orange-100',
      label: 'text-orange-600/60 group-hover:text-white/70',
      value: 'text-orange-800 group-hover:text-white',
      iconBox: 'bg-orange-200 text-orange-700 group-hover:bg-white/20 group-hover:text-white',
      hover: 'hover:bg-red-500 hover:border-red-500 hover:shadow-red-200'
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
      {showActiveLabel && (
        <div className="flex items-center gap-2 mr-1">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Active Insights:</span>
        </div>
      )}
      <AnimatePresence mode="popLayout">
        {badges.map((badge) => {
          const theme = themes[badge.theme || 'primary'];
          return (
            <motion.button
              layout
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={badge.id}
              onClick={(e) => {
                e.stopPropagation();
                badge.onRemove();
              }}
              className={`
                group relative flex items-center gap-2.5 pl-1.5 pr-2 py-1.5 rounded-[22px] border-2 
                transition-all duration-300 shadow-sm outline-none
                ${theme.bg} ${theme.hover}
              `}
            >
              {/* Icon Box - Support for stacking multiple icons */}
              {badge.icon && (
                <div className={`flex items-center ${Array.isArray(badge.icon) ? '-space-x-3 ml-0.5' : ''}`}>
                  {(Array.isArray(badge.icon) ? badge.icon : [badge.icon]).map((icon, idx, arr) => (
                    <div
                      key={idx}
                      className={`
                        w-7 h-7 rounded-[12px] flex items-center justify-center flex-shrink-0 transition-all duration-300 
                        ${theme.iconBox} ${arr.length > 1 && idx < arr.length - 1 ? 'shadow-[2px_0_8px_-2px_rgba(0,0,0,0.15)]' : ''}
                      `}
                      style={{ zIndex: 10 - idx }}
                    >
                      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 14, strokeWidth: 2.5 }) : icon}
                    </div>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col -space-y-0.5 pointer-events-none text-left">
                <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${theme.label}`}>
                  {badge.label}
                </span>
                <span className={`text-[12px] font-bold tracking-tight transition-colors ${theme.value}`}>
                  {badge.value}
                </span>
              </div>

              {/* Remove Icon - Animated on hover */}
              <div className="flex items-center justify-center w-0 opacity-0 group-hover:w-6 group-hover:opacity-100 transition-all duration-300 ml-0.5 overflow-hidden">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <X size={12} strokeWidth={3} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
