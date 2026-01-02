import React, { useState } from 'react';
import { motion } from '@repo/ui/motion';
import { ChevronLeft, ChevronRight } from '@repo/ui/icons';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface WalletDateRangePickerProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

export default function WalletDateRangePicker({ dateRange, onChange }: WalletDateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number, monthOffset: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);
    // Reset time to 00:00:00 to avoid time shifts
    selectedDate.setHours(0, 0, 0, 0);

    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      onChange({ from: selectedDate, to: null });
    } else {
      if (selectedDate < dateRange.from) {
        onChange({ from: selectedDate, to: dateRange.from });
      } else {
        onChange({ from: dateRange.from, to: selectedDate });
      }
    }
  };

  const isStartDate = (day: number, monthOffset: number) => {
    if (!dateRange.from) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);
    return date.toDateString() === dateRange.from.toDateString();
  };

  const isEndDate = (day: number, monthOffset: number) => {
    if (!dateRange.to) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);
    return date.toDateString() === dateRange.to.toDateString();
  };

  const isInRange = (day: number, monthOffset: number) => {
    if (!dateRange.from || !dateRange.to) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, day);
    // Compare times
    return date.getTime() > dateRange.from.getTime() && date.getTime() < dateRange.to.getTime();
  };

  const renderMonth = (monthOffset: number) => {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset);
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    return (
      <div className="flex-1 min-w-[240px]">
        <div className="font-bold font-anton text-gray-800 text-center mb-4 uppercase tracking-wide">
          {monthNames[month.getMonth()]} {month.getFullYear()}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-gray-400 py-1 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1 gap-x-1">
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="aspect-square" />
          ))}
          {days.map(day => {
            const isStart = isStartDate(day, monthOffset);
            const isEnd = isEndDate(day, monthOffset);
            const inRange = isInRange(day, monthOffset);
            const dayOfWeek = (firstDay + day - 1) % 7;
            const isRowStart = dayOfWeek === 0;
            const isRowEnd = dayOfWeek === 6;

            return (
              <div key={day} className="relative">
                {inRange && (
                  <div className={`absolute inset-y-0 left-0 right-0 bg-lime-100/50 ${isRowStart ? 'rounded-l-lg' : ''
                    } ${isRowEnd ? 'rounded-r-lg' : ''}`} />
                )}
                {isStart && dateRange.to && (
                  <div className="absolute inset-y-0 right-0 left-1/2 bg-lime-100/50" />
                )}
                {isEnd && dateRange.from && (
                  <div className="absolute inset-y-0 left-0 right-1/2 bg-lime-100/50" />
                )}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDateClick(day, monthOffset)}
                  className={`relative aspect-square w-full flex items-center justify-center text-xs font-bold transition-all rounded-lg ${isStart || isEnd
                    ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/30 z-10'
                    : inRange
                      ? 'text-lime-700'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {day}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 border-4 border-gray-100 relative">
      <div className="flex items-center justify-between absolute top-6 left-6 right-6 z-20 pointer-events-none">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all text-gray-500 pointer-events-auto"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all text-gray-500 pointer-events-auto"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 relative z-10 md:px-2">
        {renderMonth(0)}
        <div className="hidden md:block w-px bg-gray-100 my-2"></div>
        <div className="hidden md:block flex-1">
          {renderMonth(1)}
        </div>
      </div>
    </div>
  );
}
