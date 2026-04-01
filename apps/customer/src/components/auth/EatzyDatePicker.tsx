"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "@repo/ui/icons";

interface EatzyDatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  error?: string;
  placeholder?: string;
}

export default function EatzyDatePicker({
  label,
  value,
  onChange,
  error,
  placeholder = "Select date...",
}: EatzyDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setCurrentMonth(d);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    const dateStr = newDate.toISOString().split("T")[0]; // YYYY-MM-DD
    onChange(dateStr);
    setIsOpen(false);
  };

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  return (
    <div ref={containerRef} className="w-full space-y-2 relative group animate-in fade-in slide-in-from-top-1 duration-500">
      {/* Label - Synchronized with AuthInput */}
      <div className="flex items-center justify-between px-1">
        <label className="text-[15px] font-extrabold text-gray-400">
          {label}
        </label>
      </div>

      {/* Trigger - Synchronized with AuthInput */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`relative h-[60px] w-full rounded-[24px] cursor-pointer transition-all duration-300 flex items-center bg-slate-50 border-2 border-white shadow-[inset_0_0_20px_rgba(0,0,0,0.08)] ${
          error
            ? "border-red-200/50"
            : isOpen
            ? "ring-[6px] ring-blue-500/20 bg-white"
            : "hover:bg-white"
        }`}
      >
        <div className="px-6 flex-1 flex items-center justify-between">
           <span className={`text-base font-bold ${selectedDate ? "text-gray-900" : "text-gray-300 italic font-medium"}`}>
            {displayValue || placeholder}
          </span>
          <CalendarIcon className={`w-5 h-5 transition-colors ${isOpen ? 'text-lime-500' : 'text-gray-300'}`} />
        </div>
      </div>

      {error && (
        <p className="px-2 text-[10px] font-bold text-red-500 leading-tight uppercase tracking-wider">
          {error}
        </p>
      )}

      {/* Custom Calendar Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 z-[100] overflow-hidden p-5"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6 px-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
                }}
                className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-black transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="text-sm font-black text-black uppercase tracking-widest flex gap-2">
                <span>{monthNames[currentMonth.getMonth()]}</span>
                <span className="text-gray-200">{currentMonth.getFullYear()}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
                }}
                className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-black transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-[10px] font-black text-gray-300 py-1 uppercase tracking-tighter">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                <div key={`blank-${i}`} />
              ))}
              {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                const day = i + 1;
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDateClick(day);
                    }}
                    className={`
                      aspect-square rounded-[14px] text-xs font-bold flex items-center justify-center transition-all duration-200
                      ${isSelected 
                        ? "bg-lime-500 text-white shadow-[0_8px_20px_rgba(120,200,65,0.4)] scale-110" 
                        : "hover:bg-gray-50 text-gray-600"}
                      ${isToday && !isSelected ? "border-2 border-lime-500/20 text-lime-600" : ""}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
