"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  label?: string;
  value?: string | Date | null;
  onChange: (value: string | Date | null) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  allowFutureDates?: boolean;
  allowPastDates?: boolean;
  className?: string;
};

export default function CalendarDatePicker({
  label,
  value = "",
  onChange,
  error,
  required,
  disabled,
  placeholder = "DD/MM/YYYY",
  allowFutureDates = false,
  allowPastDates = true,
  className,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(typeof value === "string" ? value : "");
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    if (!value) {
      setSelectedDay(null);
      setInternalValue("");
      return;
    }
    let dateValue: Date | null = null;
    if (value instanceof Date) {
      dateValue = value;
    } else if (typeof value === "string") {
      const parts = value.split("/");
      if (parts.length === 3) {
        const [dd, mm, yy] = parts as [string, string, string];
        const d = parseInt(dd, 10);
        const m = parseInt(mm, 10) - 1;
        const y = parseInt(yy, 10);
        dateValue = new Date(y, m, d);
      }
    }
    if (dateValue && !isNaN(dateValue.getTime())) {
      const d = dateValue.getDate();
      const m = dateValue.getMonth();
      const y = dateValue.getFullYear();
      setSelectedDay(d);
      setCurrentMonth(m);
      setCurrentYear(y);
      const fd = String(d).padStart(2, "0");
      const fm = String(m + 1).padStart(2, "0");
      setInternalValue(`${fd}/${fm}/${y}`);
    }
  }, [value]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysHeader = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const years = useMemo(() => {
    const yearNow = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => yearNow - i);
  }, []);

  const isFutureDate = (day?: number | null) => {
    if (!day) return false;
    const d = new Date(currentYear, currentMonth, day);
    return d > today;
  };
  const isPastDate = (day?: number | null) => {
    if (!day) return false;
    const d = new Date(currentYear, currentMonth, day);
    return d < today;
  };

  const calendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const dim = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= dim; i++) days.push(i);
    return days;
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const inFuture = isFutureDate(day);
    const inPast = isPastDate(day);
    if ((allowFutureDates || !inFuture) && (allowPastDates || !inPast)) {
      setSelectedDay(day);
      const fd = String(day).padStart(2, "0");
      const fm = String(currentMonth + 1).padStart(2, "0");
      const formatted = `${fd}/${fm}/${currentYear}`;
      setInternalValue(formatted);
      const selected = new Date(currentYear, currentMonth, day);
      if (value instanceof Date) onChange(selected);
      else onChange(formatted);
      setIsOpen(false);
    }
  };

  const handleInputChange = (val: string) => {
    setInternalValue(val);
    const m = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) {
      const dd = m[1] as string;
      const mm = m[2] as string;
      const yy = m[3] as string;
      const d = parseInt(dd, 10);
      const mon = parseInt(mm, 10) - 1;
      const y = parseInt(yy, 10);
      const selected = new Date(y, mon, d);
      if (!allowFutureDates && selected > today) return;
      if (!allowPastDates && selected < today) return;
      setSelectedDay(d);
      setCurrentMonth(mon);
      setCurrentYear(y);
      if (value instanceof Date) onChange(selected);
      else onChange(val);
    } else if (val === "") {
      setSelectedDay(null);
      onChange(value instanceof Date ? null : "");
    }
  };

  const toggleDatePicker = () => {
    if (!disabled) {
      setIsOpen((o) => !o);
      setIsFocused(true);
    }
  };

  return (
    <div className={`${className ?? ""} mb-3`}>
      {label && (
        <label className="block text-gray-700 font-medium mb-2 pl-4">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={datePickerRef}>
        <div className={`relative w-full ${isOpen ? "z-40" : ""}`}>
          <div
            className={`
              w-full border p-3 rounded-xl shadow-md cursor-pointer flex items-center gap-2 hover:shadow-lg transition-all duration-300 ease-in-out ${
                disabled ? "bg-gray-100 text-gray-500" : "bg-white"
              } ${isFocused && !disabled ? "ring-2 ring-[var(--primary)]/30 bg-[var(--primary)]/5" : ""} ${
                error ? "border-red-500 bg-red-50" : ""
              }`
            }
            onClick={toggleDatePicker}
          >
            <Calendar size={18} className="text-gray-400" />
            <input
              type="text"
              className={`flex-grow bg-transparent border-none focus:outline-none p-0 ${
                disabled ? "text-gray-500" : "text-black"
              } ${!internalValue ? "text-gray-400" : ""}`}
              placeholder={placeholder}
              value={internalValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => !disabled && setIsFocused(true)}
              onBlur={() => {
                if (!isOpen) setIsFocused(false);
              }}
              disabled={disabled}
            />
            {!disabled && (
              <ChevronDown className="ml-auto w-5 h-5 text-gray-400" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }} />
            )}
          </div>
        </div>

        <AnimatePresence>
          {isOpen && !disabled && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute w-full mt-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg z-50 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={prevMonth} className="p-1.5 hover:bg-blue-100 rounded-full text-blue-600">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2 items-center">
                      <select
                        value={currentMonth}
                        onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
                        className="text-blue-600 px-2 py-1 rounded-full border border-blue-200 bg-white"
                      >
                        {months.map((m, i) => (
                          <option key={m} value={i}>{m}</option>
                        ))}
                      </select>
                      <select
                        value={currentYear}
                        onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))}
                        className="text-blue-600 px-2 py-1 rounded-full border border-blue-200 bg-white"
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                    <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-blue-100 rounded-full text-blue-600">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-3 rounded-lg">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {daysHeader.map((d) => (
                        <div key={d} className="text-center text-xs font-medium text-gray-500">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays().map((day, idx) => {
                        const inFuture = isFutureDate(day);
                        const inPast = isPastDate(day);
                        const disabledDay = !day || (inFuture && !allowFutureDates) || (inPast && !allowPastDates);
                        const isSelected =
                          day === selectedDay &&
                          currentMonth === (internalValue ? new Date(parseInt(internalValue.split("/")[2] || "0", 10), parseInt(internalValue.split("/")[1] || "0", 10) - 1, parseInt(internalValue.split("/")[0] || "0", 10)).getMonth() : currentMonth) &&
                          currentYear === parseInt(internalValue.split("/")[2] || "0", 10);
                        return (
                          <button
                            key={`day-${idx}`}
                            type="button"
                            onClick={() => day && handleDateSelect(day)}
                            disabled={disabledDay}
                            className={`p-2 text-center rounded-lg text-sm font-medium ${
                              !day ? "invisible" : disabledDay ? "cursor-not-allowed text-gray-400" : "cursor-pointer"
                            } ${isSelected ? "bg-blue-500 text-white" : disabledDay ? "text-gray-400" : "hover:bg-blue-200 text-gray-700"}`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-xs text-red-500 px-4 p-1 mt-1">{error}</p>}
    </div>
  );
}