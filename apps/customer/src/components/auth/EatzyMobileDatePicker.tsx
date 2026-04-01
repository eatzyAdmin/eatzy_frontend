"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "@repo/ui/icons";

interface EatzyMobileDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  error?: string;
  placeholder?: string;
}

export default function EatzyMobileDatePicker({
  value,
  onChange,
  error,
  placeholder = "Select date...",
}: EatzyMobileDatePickerProps) {
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
    <div ref={containerRef} className="w-full relative group animate-in fade-in slide-in-from-top-1 duration-500">
      {/* Trigger - 100% IDENTICAL to other Mobile Auth Inputs */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`relative h-[60px] w-full rounded-full cursor-pointer transition-all duration-300 flex items-center bg-gray-100 border border-transparent ${
          error
            ? "border-red-500/20"
            : isOpen
            ? "ring-4 ring-gray-100/50 bg-white"
            : "hover:bg-white"
        }`}
      >
        <div className="absolute left-2 top-2 bottom-2 w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 box-content">
          <CalendarIcon size={16} strokeWidth={3} />
        </div>
        <div className="pl-16 pr-4 flex-1 flex items-center">
           <span className={`text-base font-bold ${selectedDate ? "text-gray-900" : "text-gray-300 italic font-medium"}`}>
            {displayValue || placeholder}
          </span>
        </div>
      </div>

      {error && (
        <p className="px-6 mt-2 text-[10px] font-bold text-red-500 leading-tight uppercase tracking-wider">
          {error}
        </p>
      )}

      {/* Custom Calendar Popover - Premium Drawer Style */}
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

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-[10px] font-black text-gray-300 uppercase py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                const day = i + 1;
                const isToday = 
                  new Date().getDate() === day && 
                  new Date().getMonth() === currentMonth.getMonth() && 
                  new Date().getFullYear() === currentMonth.getFullYear();
                const isSelected = 
                  selectedDate?.getDate() === day && 
                  selectedDate?.getMonth() === currentMonth.getMonth() && 
                  selectedDate?.getFullYear() === currentMonth.getFullYear();

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDateClick(day);
                    }}
                    className={`relative w-full aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-200 ${
                      isSelected
                        ? "bg-black text-white shadow-lg scale-110 z-10"
                        : isToday
                        ? "bg-lime-50 text-lime-600 ring-1 ring-lime-200"
                        : "hover:bg-gray-50 text-gray-600"
                    }`}
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
