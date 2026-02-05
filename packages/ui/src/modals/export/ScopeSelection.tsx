'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ListFilter, Database, Check } from 'lucide-react';

interface ScopeSelectionProps {
  scope: 'current' | 'all';
  setScope: (scope: 'current' | 'all') => void;
  scopeLabels: {
    current: { title: string; desc: string };
    all: { title: string; desc: string };
  };
}

export const ScopeSelection: React.FC<ScopeSelectionProps> = ({ scope, setScope, scopeLabels }) => {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Export Scope</label>
      <div className="space-y-3 px-2">
        {/* Current View */}
        <motion.div
          onClick={() => setScope('current')}
          whileTap={{ scale: 0.98 }}
          className={`
            group flex items-center justify-between p-2 rounded-[24px] cursor-pointer transition-all duration-300 border-2
            ${scope === 'current'
              ? 'bg-lime-50 border-lime-100 shadow-sm'
              : 'bg-white border-gray-50 hover:border-lime-100/60 hover:bg-lime-50/40'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-all duration-300
              ${scope === 'current'
                ? 'bg-lime-100 text-lime-600'
                : 'bg-gray-50 text-gray-400 group-hover:bg-white'
              }
            `}>
              <ListFilter className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className={`text-[14px] font-bold tracking-tight block transition-all ${scope === 'current' ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                {scopeLabels.current.title}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{scopeLabels.current.desc}</span>
            </div>
          </div>
          <div className={`
            w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
            ${scope === 'current'
              ? "bg-lime-500 text-white scale-100"
              : "bg-gray-100 text-transparent scale-90"
            }
          `}>
            <Check size={12} strokeWidth={4} className={scope === 'current' ? "opacity-100" : "opacity-0"} />
          </div>
        </motion.div>

        {/* All History */}
        <motion.div
          onClick={() => setScope('all')}
          whileTap={{ scale: 0.98 }}
          className={`
            group flex items-center justify-between p-2 rounded-[24px] cursor-pointer transition-all duration-300 border-2
            ${scope === 'all'
              ? 'bg-lime-50 border-lime-100 shadow-sm'
              : 'bg-white border-gray-50 hover:border-lime-100/60 hover:bg-lime-50/40'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`
              w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-all duration-300
              ${scope === 'all'
                ? 'bg-lime-100 text-lime-600'
                : 'bg-gray-50 text-gray-400 group-hover:bg-white'
              }
            `}>
              <Database className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className={`text-[14px] font-bold tracking-tight block transition-all ${scope === 'all' ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
                {scopeLabels.all.title}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{scopeLabels.all.desc}</span>
            </div>
          </div>
          <div className={`
            w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
            ${scope === 'all'
              ? "bg-lime-500 text-white scale-100"
              : "bg-gray-100 text-transparent scale-90"
            }
          `}>
            <Check size={12} strokeWidth={4} className={scope === 'all' ? "opacity-100" : "opacity-0"} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
