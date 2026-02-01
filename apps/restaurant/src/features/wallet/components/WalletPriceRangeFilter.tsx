import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';

interface WalletPriceRangeFilterProps {
  min: number;
  max: number;
  step?: number;
  value: { min: number; max: number };
  onChange: (range: { min: number; max: number }) => void;
}

export default function WalletPriceRangeFilter({ min, max, step = 1, value, onChange }: WalletPriceRangeFilterProps) {
  const [localRange, setLocalRange] = useState<[number, number]>([value.min || min, value.max || max]);
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<'min' | 'max' | null>(null);

  useEffect(() => {
    setLocalRange([value.min || min, value.max || max]);
  }, [value.min, value.max, min, max]);

  const getPercentage = (val: number) => {
    return Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
  };

  const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = type;
    setActiveThumb(type);

    // Prevent scrolling on touch
    if (e.type === 'touchstart') {
      // e.preventDefault(); // Might need to be careful with this
    }
  };

  const updateRange = useCallback((clientX: number) => {
    if (!isDragging.current || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    let newVal = min + (percent / 100) * (max - min);

    // Apply step
    newVal = Math.round(newVal / step) * step;
    newVal = Math.max(min, Math.min(max, newVal));

    setLocalRange(prev => {
      const newRange = [...prev] as [number, number];
      const buffer = (max - min) * 0.02; // Small buffer to prevent overlap

      if (isDragging.current === 'min') {
        newRange[0] = Math.min(newVal, prev[1] - buffer);
      } else {
        newRange[1] = Math.max(newVal, prev[0] + buffer);
      }
      return newRange;
    });
  }, [min, max, step]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    updateRange(clientX);
  }, [updateRange]);

  const handleEnd = useCallback(() => {
    if (isDragging.current) {
      onChange({ min: localRange[0], max: localRange[1] });
      isDragging.current = null;
      setActiveThumb(null);
    }
  }, [localRange, onChange]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [handleMove, handleEnd]);

  const handleInputChange = (type: 'min' | 'max', valStr: string) => {
    const val = parseInt(valStr.replace(/\D/g, ''), 10) || 0;
    setLocalRange(prev => {
      const newRange = [...prev] as [number, number];
      if (type === 'min') newRange[0] = val;
      else newRange[1] = val;
      return newRange;
    });
  };

  const handleInputBlur = () => {
    let [newMin, newMax] = localRange;
    if (newMin < min) newMin = min;
    if (newMax > max) newMax = max;
    if (newMin > newMax) [newMin, newMax] = [newMax, newMin];

    setLocalRange([newMin, newMax]);
    onChange({ min: newMin, max: newMax });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  const rangeLabels = [
    { value: min, label: 'Min' },
    { value: (max - min) * 0.25 + min, label: '25%' },
    { value: (max - min) * 0.5 + min, label: '50%' },
    { value: (max - min) * 0.75 + min, label: '75%' },
    { value: max, label: 'Max' },
  ];

  return (
    <div className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-[0_0_30px_rgba(0,0,0,0.06)]">

      {/* Price Display */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Selected range</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#1A1A1A] tracking-tighter">{formatCurrency(localRange[0])}</span>
            <span className="text-gray-200 font-bold">/</span>
            <span className="text-3xl font-bold text-[#1A1A1A] tracking-tighter">{formatCurrency(localRange[1])}</span>
            <span className="text-sm font-black text-gray-400 ml-1">VND</span>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="px-3 py-1.5 rounded-full bg-lime-50 border border-lime-100 text-[10px] font-bold text-lime-700 uppercase tracking-wider">
            Flexible Search
          </div>
        </div>
      </div>

      {/* Modern Slider Container */}
      <div className="relative h-20 flex items-center mb-8 px-4">
        <div className="relative w-full h-2 group" ref={trackRef}>
          {/* Base Track */}
          <div className="absolute inset-0 bg-gray-100 rounded-full overflow-hidden">
            {/* Dynamic background patterns or dots could go here */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
          </div>

          {/* Active Progress Bar */}
          <div
            className="absolute h-full bg-gradient-to-r from-lime-400 to-lime-500 rounded-full shadow-[0_0_20px_rgba(132,204,22,0.3)] transition-all duration-75"
            style={{
              left: `${getPercentage(localRange[0])}%`,
              right: `${100 - getPercentage(localRange[1])}%`
            }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>

          {/* Range Markers */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-1">
            {rangeLabels.map((marker, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-1 h-1 rounded-full bg-gray-200 mb-2"></div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{marker.label}</span>
              </div>
            ))}
          </div>

          {/* Min Thumb */}
          <div
            className={`absolute top-1/2 w-10 h-10 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing z-20 group/thumb`}
            style={{ left: `${getPercentage(localRange[0])}%` }}
            onMouseDown={handleMouseDown('min')}
            onTouchStart={handleMouseDown('min')}
          >
            <motion.div
              animate={{ scale: activeThumb === 'min' ? 1.2 : 1 }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="w-6 h-6 bg-white border-4 border-lime-500 rounded-full shadow-lg ring-4 ring-white transition-all group-hover/thumb:border-lime-600"></div>

              {/* Value Tooltip on Hover/Drag */}
              <AnimatePresence>
                {(activeThumb === 'min' || isDragging.current === 'min') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -45 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute px-3 py-1.5 bg-[#1A1A1A] text-white text-[10px] font-black rounded-lg shadow-xl whitespace-nowrap after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-[#1A1A1A]"
                  >
                    {formatCurrency(localRange[0])}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Max Thumb */}
          <div
            className="absolute top-1/2 w-10 h-10 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing z-20 group/thumb"
            style={{ left: `${getPercentage(localRange[1])}%` }}
            onMouseDown={handleMouseDown('max')}
            onTouchStart={handleMouseDown('max')}
          >
            <motion.div
              animate={{ scale: activeThumb === 'max' ? 1.2 : 1 }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="w-6 h-6 bg-white border-4 border-lime-500 rounded-full shadow-lg ring-4 ring-white transition-all group-hover/thumb:border-lime-600"></div>

              <AnimatePresence>
                {(activeThumb === 'max' || isDragging.current === 'max') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -45 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute px-3 py-1.5 bg-[#1A1A1A] text-white text-[10px] font-black rounded-lg shadow-xl whitespace-nowrap after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-[#1A1A1A]"
                  >
                    {formatCurrency(localRange[1])}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Manual Input Section */}
      <div className="grid grid-cols-2 gap-6 pt-4">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Minimum</label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-lg">₫</div>
            <input
              type="text"
              value={formatCurrency(localRange[0])}
              onChange={(e) => handleInputChange('min', e.target.value)}
              onBlur={handleInputBlur}
              className="w-full bg-gray-50 border-2 border-transparent group-hover:bg-white group-hover:border-gray-100 focus:bg-white focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10 rounded-2xl py-5 pl-12 pr-6 text-xl font-bold tracking-tight text-[#1A1A1A] transition-all outline-none"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Maximum</label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-lg">₫</div>
            <input
              type="text"
              value={formatCurrency(localRange[1])}
              onChange={(e) => handleInputChange('max', e.target.value)}
              onBlur={handleInputBlur}
              className="w-full bg-gray-50 border-2 border-transparent group-hover:bg-white group-hover:border-gray-100 focus:bg-white focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10 rounded-2xl py-5 pl-12 pr-6 text-xl font-bold tracking-tight text-[#1A1A1A] transition-all outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
