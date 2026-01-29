'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';

interface PremiumDatePickerProps {
  label: string;
  value: string | Date | null;
  onChange: (date: string) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export default function PremiumDatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date...",
  required,
  error,
  disabled
}: PremiumDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'calendar' | 'month' | 'year'>('calendar');
  const [popoverPosition, setPopoverPosition] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize month view
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setCurrentMonth(d);
        setSelectedDate(d);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setView('calendar');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smart Positioning Logic
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const popoverHeight = 350; // Estimated height

      if (spaceBelow < popoverHeight && rect.top > popoverHeight) {
        setPopoverPosition('top');
      } else {
        setPopoverPosition('bottom');
      }
    }
  }, [isOpen]);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    // Format as YYYY-MM-DD for consistency with input[type=date] if needed, or ISO
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(newDate.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${d}`);
    setIsOpen(false);
  };

  const handleYearSelect = (year: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setFullYear(year);
    setCurrentMonth(newMonth);
    setView('calendar');
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(monthIndex);
    setCurrentMonth(newMonth);
    setView('calendar');
  };

  const renderYearView = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => (maxDate?.getFullYear() || currentYear) - i);

    return (
      <div className="p-4 bg-white h-[280px] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-3 gap-2">
          {years.map(year => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              className={`py-3 rounded-2xl text-sm font-bold transition-all
                ${currentMonth.getFullYear() === year
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'hover:bg-gray-50 text-gray-600'}`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="p-4 bg-white h-[280px]">
        <div className="grid grid-cols-3 gap-2 h-full">
          {monthNames.map((month, index) => (
            <button
              key={month}
              onClick={() => handleMonthSelect(index)}
              className={`rounded-2xl text-sm font-bold transition-all
                ${currentMonth.getMonth() === index
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'hover:bg-gray-50 text-gray-600'}`}
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    if (!mounted) return null;

    if (view === 'year') return renderYearView();
    if (view === 'month') return renderMonthView();

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    return (
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)); }}
            className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="font-bold font-anton text-gray-900 uppercase tracking-wide text-sm flex gap-2">
            <button
              onClick={() => setView('month')}
              className="hover:text-primary transition-colors px-1"
            >
              {(monthNames[currentMonth.getMonth()] || "").slice(0, 3)}
            </button>
            <button
              onClick={() => setView('year')}
              className="hover:text-primary transition-colors px-1 border-l border-gray-100 pl-2"
            >
              {currentMonth.getFullYear()}
            </button>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)); }}
            className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-gray-400 py-1 uppercase">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {days.map(day => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

            const isSelected = selectedDate &&
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear();

            const isToday = new Date().toDateString() === date.toDateString();

            let isDisabled = false;
            if (minDate) {
              const minD = new Date(minDate);
              minD.setHours(0, 0, 0, 0);
              const curD = new Date(date);
              curD.setHours(0, 0, 0, 0);
              if (curD < minD) isDisabled = true;
            }
            if (maxDate) {
              const maxD = new Date(maxDate);
              maxD.setHours(23, 59, 59, 999);
              const curD = new Date(date);
              curD.setHours(0, 0, 0, 0);
              if (curD > maxD) isDisabled = true;
            }

            return (
              <button
                key={day}
                type="button"
                disabled={isDisabled}
                onClick={(e) => { e.stopPropagation(); handleDateClick(day); }}
                className={`
                  aspect-square rounded-xl text-xs font-bold flex items-center justify-center transition-all
                  ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-primary/10 text-gray-600'}
                  ${isToday && !isSelected ? 'text-primary border border-primary/20' : ''}
                  ${isDisabled ? 'opacity-20 cursor-not-allowed' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const displayValue = mounted && selectedDate ? selectedDate.toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }) : '';

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors z-10 pointer-events-none">
          <Calendar size={18} />
        </div>

        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full bg-gray-50 border-2 rounded-[20px] pl-12 pr-6 py-4 text-gray-900 font-bold cursor-pointer
            flex items-center justify-between border-transparent transition-all duration-300
            ${isOpen ? 'bg-white border-primary/30 ring-4 ring-primary/5 shadow-xl shadow-black/5' : 'hover:bg-gray-100/50'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${error ? 'border-red-500/50' : ''}
          `}
        >
          <span className={!selectedDate ? 'text-gray-300' : 'text-gray-900'}>
            {displayValue || placeholder}
          </span>

          {selectedDate && !disabled && !required && isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDate(null);
                onChange('');
              }}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isOpen && mounted && (
            <motion.div
              initial={{ opacity: 0, y: popoverPosition === 'bottom' ? 10 : -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: popoverPosition === 'bottom' ? 10 : -10, scale: 0.98 }}
              style={{
                [popoverPosition === 'bottom' ? 'top' : 'bottom']: 'calc(100% + 8px)',
                transformOrigin: popoverPosition === 'bottom' ? 'top center' : 'bottom center',
                position: 'absolute'
              }}
              className="left-0 right-0 bg-white rounded-[28px] shadow-2xl shadow-black/10 border border-gray-100 z-50 overflow-hidden"
            >
              {renderCalendar()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{error}</p>}
    </div>
  );
}
