import React, { useState, useRef, useEffect, useCallback } from 'react';

interface WalletPriceRangeFilterProps {
  min: number;
  max: number;
  step?: number;
  value: { min: number; max: number };
  onChange: (range: { min: number; max: number }) => void;
}

export default function WalletPriceRangeFilter({ min, max, step = 1, value, onChange }: WalletPriceRangeFilterProps) {
  const [localRange, setLocalRange] = useState<[number, number]>([value.min || min, value.max || max]);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<'min' | 'max' | null>(null);

  useEffect(() => {
    setLocalRange([value.min || min, value.max || max]);
  }, [value, min, max]);

  const getPercentage = (val: number) => {
    return Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
  };

  const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
    isDragging.current = type;
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    let newVal = min + (percent / 100) * (max - min);

    // Apply step
    newVal = Math.round(newVal / step) * step;

    // Clamp
    newVal = Math.max(min, Math.min(max, newVal));

    setLocalRange(prev => {
      const newRange = [...prev] as [number, number];
      if (isDragging.current === 'min') {
        // Ensure min doesn't cross max - some buffer
        newRange[0] = Math.min(newVal, prev[1] - (max - min) * 0.05);
      } else {
        // Ensure max doesn't cross min
        newRange[1] = Math.max(newVal, prev[0] + (max - min) * 0.05);
      }
      return newRange;
    });
  }, [min, max, step]);

  const handleMouseUp = useCallback(() => {
    if (isDragging.current) {
      onChange({ min: localRange[0], max: localRange[1] });
      isDragging.current = null;
    }
  }, [localRange, onChange]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

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
    // Validate bounds on blur
    let [newMin, newMax] = localRange;
    if (newMin < min) newMin = min;
    if (newMax > max) newMax = max;
    if (newMin > newMax) {
      // Swap if inverted
      const temp = newMin;
      newMin = newMax;
      newMax = temp;
    }
    setLocalRange([newMin, newMax]);
    onChange({ min: newMin, max: newMax });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">

      {/* Visual Slider Track */}
      <div className="relative h-6 mb-8 select-none" ref={trackRef}>
        <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-100 rounded-full -translate-y-1/2"></div>

        {/* Active Range Bar */}
        <div
          className="absolute top-1/2 h-1.5 bg-lime-500 rounded-full -translate-y-1/2 pointer-events-none"
          style={{
            left: `${getPercentage(localRange[0])}%`,
            right: `${100 - getPercentage(localRange[1])}%`
          }}
        ></div>

        {/* Min Thumb */}
        <div
          className="absolute top-1/2 w-6 h-6 bg-white border-2 border-lime-500 shadow-md rounded-full -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 flex items-center justify-center group"
          style={{ left: `${getPercentage(localRange[0])}%` }}
          onMouseDown={handleMouseDown('min')}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-lime-500 group-hover:bg-lime-600"></div>
        </div>

        {/* Max Thumb */}
        <div
          className="absolute top-1/2 w-6 h-6 bg-white border-2 border-lime-500 shadow-md rounded-full -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 flex items-center justify-center group"
          style={{ left: `${getPercentage(localRange[1])}%` }}
          onMouseDown={handleMouseDown('max')}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-lime-500 group-hover:bg-lime-600"></div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative group">
          <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-wider pl-1">Min Amount</label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-lime-100 focus-within:border-lime-200 transition-all">
            <span className="text-gray-400 font-medium mr-2 text-xs">₫</span>
            <input
              type="text"
              value={formatCurrency(localRange[0])}
              onChange={(e) => handleInputChange('min', e.target.value)}
              onBlur={handleInputBlur}
              className="w-full bg-transparent font-mono font-bold text-gray-700 text-sm outline-none"
            />
          </div>
        </div>

        <div className="text-gray-300 pt-5 font-bold">-</div>

        <div className="flex-1 relative group">
          <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block tracking-wider pl-1">Max Amount</label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-lime-100 focus-within:border-lime-200 transition-all">
            <span className="text-gray-400 font-medium mr-2 text-xs">₫</span>
            <input
              type="text"
              value={formatCurrency(localRange[1])}
              onChange={(e) => handleInputChange('max', e.target.value)}
              onBlur={handleInputBlur}
              className="w-full bg-transparent font-mono font-bold text-gray-700 text-sm outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
