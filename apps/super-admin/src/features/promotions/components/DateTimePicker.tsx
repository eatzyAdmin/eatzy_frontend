'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';

interface DateTimePickerProps {
  label: string;
  value: string | Date | null;
  onChange: (date: string) => void;
  minDate?: Date;
}

export default function DateTimePicker({ label, value, onChange, minDate }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize with fixed values to avoid hydration mismatch
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setCurrentMonth(d);
        setSelectedDate(d);
        setHours(d.getHours());
        setMinutes(d.getMinutes());
      }
    } else {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      setCurrentMonth(d);
      setHours(0);
      setMinutes(0);
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (value && mounted && !isOpen) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setHours(d.getHours());
        setMinutes(d.getMinutes());
        setCurrentMonth(d);
      }
    }
  }, [value, mounted, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, hours, minutes);
    setSelectedDate(newDate);
    onChange(formatToISO(newDate));
  };

  const formatToISO = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${min}:00`;
  };

  const updateTimeState = (newH: number, newM: number) => {
    const clampedH = Math.max(0, Math.min(23, newH));
    const clampedM = Math.max(0, Math.min(59, newM));

    setHours(clampedH);
    setMinutes(clampedM);

    if (selectedDate) {
      const resultDate = new Date(selectedDate);
      resultDate.setHours(clampedH);
      resultDate.setMinutes(clampedM);
      resultDate.setSeconds(0);
      resultDate.setMilliseconds(0);

      setSelectedDate(resultDate);
      onChange(formatToISO(resultDate));
    }
  };

  const incrementHours = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextH = hours + 1;
    if (nextH <= 23) {
      updateTimeState(nextH, minutes);
    }
  };

  const decrementHours = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevH = hours - 1;
    if (prevH >= 0) {
      updateTimeState(prevH, minutes);
    }
  };

  const incrementMinutes = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextM = minutes + 1;
    if (nextM <= 59) {
      updateTimeState(hours, nextM);
    }
  };

  const decrementMinutes = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevM = minutes - 1;
    if (prevM >= 0) {
      updateTimeState(hours, prevM);
    }
  };

  const renderCalendar = () => {
    if (!mounted) return null;
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
          <div className="font-bold font-anton text-gray-900 uppercase tracking-wide text-sm">
            {monthNames[currentMonth.getMonth()].slice(0, 3)} {currentMonth.getFullYear()}
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
            const currentYear = currentMonth.getFullYear();
            const currentMonthIdx = currentMonth.getMonth();
            const date = new Date(currentYear, currentMonthIdx, day);

            const isSelected = selectedDate &&
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear();

            const isToday = new Date().toDateString() === date.toDateString();

            // Fixed comparison for isDisabled
            let isDisabled = false;
            if (minDate) {
              const minDateReset = new Date(minDate);
              minDateReset.setHours(0, 0, 0, 0);
              const compareDate = new Date(date);
              compareDate.setHours(0, 0, 0, 0);
              isDisabled = compareDate < minDateReset;
            }

            return (
              <button
                key={day}
                type="button"
                disabled={!!isDisabled}
                onClick={(e) => { e.stopPropagation(); handleDateClick(day); }}
                className={`
                  aspect-square rounded-xl text-xs font-bold flex items-center justify-center transition-all
                  ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-primary/10 text-gray-600'}
                  ${isToday && !isSelected ? 'text-primary border border-primary/20' : ''}
                  ${isDisabled ? 'opacity-20 cursor-not-allowed hover:bg-transparent' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Clock size={12} /> Time Picker
          </div>
          <div className="flex items-center justify-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {/* Hours */}
            <div className="flex flex-col items-center gap-1">
              <button type="button" onClick={incrementHours} className="p-1 hover:bg-white rounded-lg text-gray-400 hover:text-primary transition-all">
                <ChevronRight size={14} className="-rotate-90" />
              </button>
              <div className="w-12 py-2 bg-white rounded-xl border border-gray-200 text-center font-anton text-lg text-gray-900 shadow-sm">
                {hours.toString().padStart(2, '0')}
              </div>
              <button type="button" onClick={decrementHours} className="p-1 hover:bg-white rounded-lg text-gray-400 hover:text-primary transition-all">
                <ChevronRight size={14} className="rotate-90" />
              </button>
            </div>

            <span className="font-anton text-2xl text-gray-300 mb-1">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center gap-1">
              <button type="button" onClick={incrementMinutes} className="p-1 hover:bg-white rounded-lg text-gray-400 hover:text-primary transition-all">
                <ChevronRight size={14} className="-rotate-90" />
              </button>
              <div className="w-12 py-2 bg-white rounded-xl border border-gray-200 text-center font-anton text-lg text-gray-900 shadow-sm">
                {minutes.toString().padStart(2, '0')}
              </div>
              <button type="button" onClick={decrementMinutes} className="p-1 hover:bg-white rounded-lg text-gray-400 hover:text-primary transition-all">
                <ChevronRight size={14} className="rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const displayValue = mounted && value ? new Date(value).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: false
  }) : '';

  return (
    <div ref={containerRef} className="relative">
      <label className="text-[11px] uppercase font-bold text-gray-400 block mb-2 px-1 tracking-wider">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
           w-full bg-[#F8F9FA] rounded-[18px] px-5 py-4 text-sm font-bold text-gray-900 cursor-pointer
           flex items-center justify-between border-2 transition-all duration-300
           ${isOpen ? 'border-primary/30 ring-4 ring-primary/5 bg-white shadow-xl shadow-black/5' : 'border-transparent hover:bg-gray-100/50'}
        `}
      >
        <span className={!value ? 'text-gray-300' : 'text-gray-900'}>{displayValue || (mounted ? 'Chọn thời gian...' : '')}</span>
        <Calendar size={18} className={`${isOpen ? 'text-primary' : 'text-gray-400'} transition-colors`} />
      </div>

      <AnimatePresence>
        {isOpen && mounted && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute top-full mt-3 left-0 w-[300px] bg-white rounded-[28px] shadow-2xl shadow-black/10 border border-gray-100 z-50 overflow-hidden"
          >
            {renderCalendar()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
