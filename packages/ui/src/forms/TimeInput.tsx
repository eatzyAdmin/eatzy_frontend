import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "../motion";
import { ChevronDown } from "../icons";

interface TimeInputProps {
  value: string;
  onChange: (val: string) => void;
  minTime?: string;
}

const TimeInput = ({ value, onChange, minTime }: TimeInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [h = 0, m = 0] = value.split(':').map(Number);
  const containerRef = useRef<HTMLDivElement>(null);

  const [minH = -1, minM = -1] = minTime ? minTime.split(':').map(Number) : [-1, -1];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  // Change step to 1 minute
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-200 hover:border-[var(--primary)] text-[#1A1A1A] px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 min-w-[80px] justify-between transition-colors shadow-sm"
      >
        {value}
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 flex overflow-hidden w-48"
          >
            {/* Hours */}
            <div className="flex-1 h-48 overflow-y-auto scrollbar-hide border-r border-gray-100">
              <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase text-center sticky top-0 bg-white">Giờ</div>
              {hours.map(hour => {
                const isDisabled = minTime ? hour < minH : false;
                if (isDisabled) return null;
                return (
                  <button
                    key={hour}
                    onClick={() => { onChange(`${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`); }}
                    className={`w-full text-center py-1 text-sm font-medium hover:bg-gray-50 ${hour === h ? 'text-[var(--primary)] font-bold bg-[var(--primary)]/5' : 'text-gray-600'}`}
                  >
                    {hour.toString().padStart(2, '0')}
                  </button>
                );
              })}
            </div>
            {/* Minutes */}
            <div className="flex-1 h-48 overflow-y-auto scrollbar-hide">
              <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase text-center sticky top-0 bg-white">Phút</div>
              {minutes.map(min => {
                const isDisabled = minTime ? (h < minH || (h === minH && min <= minM)) : false;
                if (isDisabled) return null;
                return (
                  <button
                    key={min}
                    onClick={() => { onChange(`${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`); setIsOpen(false); }}
                    className={`w-full text-center py-1 text-sm font-medium hover:bg-gray-50 ${min === m ? 'text-[var(--primary)] font-bold bg-[var(--primary)]/5' : 'text-gray-600'}`}
                  >
                    {min.toString().padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeInput;
