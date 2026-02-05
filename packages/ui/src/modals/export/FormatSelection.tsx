'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, LayoutGrid, Check } from 'lucide-react';

interface FormatSelectionProps {
  format: 'pdf' | 'excel';
  setFormat: (format: 'pdf' | 'excel') => void;
}

export const FormatSelection: React.FC<FormatSelectionProps> = ({ format, setFormat }) => {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Select Format</label>
      <div className="grid grid-cols-2 gap-4 px-2">
        {/* PDF Format */}
        <motion.div
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setFormat('pdf')}
          className={`
            group relative p-4 rounded-[28px] border-2 cursor-pointer flex flex-col items-center justify-center transition-all duration-300
            ${format === 'pdf'
              ? 'bg-red-50 border-red-100 shadow-[0_10px_25px_-5px_rgba(239,68,68,0.1)]'
              : 'bg-white border-gray-50 hover:border-red-100/60 hover:bg-red-50/40'
            }
          `}
        >
          <div className={`
            w-14 h-14 rounded-[20px] flex items-center justify-center mb-3 transition-all duration-300
            ${format === 'pdf'
              ? 'bg-red-100 text-red-600 shadow-sm'
              : 'bg-gray-50 text-gray-400 group-hover:bg-white'
            }
          `}>
            <FileText className="w-7 h-7" />
          </div>
          <span className={`text-[15px] font-bold tracking-tight transition-all ${format === 'pdf' ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
            PDF
          </span>

          {/* Checkmark Circle */}
          <div className={`
            absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500
            ${format === 'pdf'
              ? "bg-red-500 text-white scale-100 shadow-sm"
              : "bg-gray-100/50 text-transparent scale-0"
            }
          `}>
            <Check size={12} strokeWidth={4} />
          </div>
        </motion.div>

        {/* Excel Format */}
        <motion.div
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setFormat('excel')}
          className={`
            group relative p-4 rounded-[28px] border-2 cursor-pointer flex flex-col items-center justify-center transition-all duration-300
            ${format === 'excel'
              ? 'bg-lime-50 border-lime-100 shadow-[0_10px_25px_-5px_rgba(132,204,22,0.1)]'
              : 'bg-white border-gray-50 hover:border-lime-100/60 hover:bg-lime-50/40'
            }
          `}
        >
          <div className={`
            w-14 h-14 rounded-[20px] flex items-center justify-center mb-3 transition-all duration-300
            ${format === 'excel'
              ? 'bg-lime-100 text-lime-600 shadow-sm'
              : 'bg-gray-50 text-gray-400 group-hover:bg-white'
            }
          `}>
            <LayoutGrid className="w-7 h-7" />
          </div>
          <span className={`text-[15px] font-bold tracking-tight transition-all ${format === 'excel' ? "text-[#1A1A1A]" : "text-gray-500 group-hover:text-gray-700"}`}>
            Excel
          </span>

          {/* Checkmark Circle */}
          <div className={`
            absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500
            ${format === 'excel'
              ? "bg-lime-500 text-white scale-100 shadow-sm"
              : "bg-gray-100/50 text-transparent scale-0"
            }
          `}>
            <Check size={12} strokeWidth={4} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
