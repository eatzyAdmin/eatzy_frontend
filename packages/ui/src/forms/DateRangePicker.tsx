import React, { useState, useEffect, useRef } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type DateRangePickerProps = {
  className?: string;
  startDate?: string;
  endDate?: string;
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  label?: string;
  error?: string | { start?: string; end?: string };
  required?: boolean;
  onBlur?: () => void;
  disabled?: boolean;
  startPlaceholder?: string;
  endPlaceholder?: string;
};

const DateRangePicker = ({ className = "", startDate = "", endDate = "", onStartDateChange, onEndDateChange, label = "", error = "", required = false, onBlur = () => {}, disabled = false, startPlaceholder = "DD/MM/YYYY", endPlaceholder = "DD/MM/YYYY" }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [internalStartDate, setInternalStartDate] = useState<string>(startDate ?? "");
  const [internalEndDate, setInternalEndDate] = useState<string>(endDate ?? "");
  const [selectedField, setSelectedField] = useState<'start' | 'end'>('start');
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedStartDay, setSelectedStartDay] = useState<number | null>(null);
  const [selectedEndDay, setSelectedEndDay] = useState<number | null>(null);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  useEffect(() => { const sd: string = startDate ?? ""; if (sd.length > 0) { const d = parseDate(sd); if (d) { setSelectedStartDay(d.getDate()); if (selectedField === 'start') { setCurrentMonth(d.getMonth()); setCurrentYear(d.getFullYear()); } setInternalStartDate(sd); } } else { setSelectedStartDay(null); setInternalStartDate(""); } }, [startDate, selectedField]);
  useEffect(() => { const ed: string = endDate ?? ""; if (ed.length > 0) { const d = parseDate(ed); if (d) { setSelectedEndDay(d.getDate()); if (selectedField === 'end') { setCurrentMonth(d.getMonth()); setCurrentYear(d.getFullYear()); } setInternalEndDate(ed); } } else { setSelectedEndDay(null); setInternalEndDate(""); } }, [endDate, selectedField]);
  useEffect(() => { const handleClickOutside = (event: MouseEvent) => { if (datePickerRef.current && !(datePickerRef.current as any).contains(event.target)) { setIsOpen(false); setIsFocused(false); onBlur(); } }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [onBlur]);
  const months = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"]; const shortMonths = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"]; const days = ["CN","T2","T3","T4","T5","T6","T7"]; const yearNow = new Date().getFullYear(); const years = Array.from({ length: 100 }, (_, i) => yearNow - i);
  const generateCalendarDays = () => { const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); const calendarDays: (number | null)[] = []; for (let i = 0; i < firstDayOfMonth; i++) { calendarDays.push(null); } for (let i = 1; i <= daysInMonth; i++) { calendarDays.push(i); } return calendarDays; };
  const parseDate = (dateString?: string) => { if (!dateString) return null; const m = /^\d{2}\/\d{2}\/\d{4}$/.exec(dateString); if (!m) return null; const day = parseInt(dateString.slice(0, 2), 10); const month = parseInt(dateString.slice(3, 5), 10) - 1; const year = parseInt(dateString.slice(6, 10), 10); return new Date(year, month, day); };
  const isDayInRange = (day?: number | null) => { if (!selectedStartDay || !selectedEndDay || !day || !internalStartDate || !internalEndDate) return false; const startDateObj = parseDate(internalStartDate); const endDateObj = parseDate(internalEndDate); if (!startDateObj || !endDateObj) return false; const currentDate = new Date(currentYear, currentMonth, day as number); return currentDate > startDateObj && currentDate < endDateObj; };
  const isFutureDate = (day?: number | null) => { if (!day) return false; const dateToCheck = new Date(currentYear, currentMonth, day as number); return dateToCheck > today; };
  const prevMonth = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else { setCurrentMonth(currentMonth - 1); } };
  const nextMonth = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else { setCurrentMonth(currentMonth + 1); } };
  const toggleYearSelector = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setShowYearSelector(!showYearSelector); setShowMonthSelector(false); };
  const toggleMonthSelector = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setShowMonthSelector(!showMonthSelector); setShowYearSelector(false); };
  const selectYear = (e: React.MouseEvent, year: number) => { e.preventDefault(); e.stopPropagation(); setCurrentYear(year); setShowYearSelector(false); };
  const selectMonth = (e: React.MouseEvent, monthIndex: number) => { e.preventDefault(); e.stopPropagation(); setCurrentMonth(monthIndex); setShowMonthSelector(false); };
  const handleDateSelect = (e: React.MouseEvent, day?: number | null) => { e.preventDefault(); e.stopPropagation(); if (!day || isFutureDate(day)) return; const formattedDay = String(day).padStart(2, '0'); const formattedMonth = String(currentMonth + 1).padStart(2, '0'); const formattedDate = `${formattedDay}/${formattedMonth}/${currentYear}`; if (selectedField === 'start') { setSelectedStartDay(day as number); setInternalStartDate(formattedDate); onStartDateChange(formattedDate); if (internalEndDate) { const endDateObj = parseDate(internalEndDate); const newStartDateObj = new Date(currentYear, currentMonth, day as number); if (endDateObj && newStartDateObj > endDateObj) { setSelectedEndDay(day as number); setInternalEndDate(formattedDate); onEndDateChange(formattedDate); } } if (!internalEndDate) { setSelectedField('end'); } else { setIsOpen(false); } } else { const startDateObj = internalStartDate ? parseDate(internalStartDate) : null; const newEndDateObj = new Date(currentYear, currentMonth, day as number); if (startDateObj && newEndDateObj < startDateObj) { setSelectedStartDay(day as number); setInternalStartDate(formattedDate); onStartDateChange(formattedDate); } else { setSelectedEndDay(day as number); setInternalEndDate(formattedDate); onEndDateChange(formattedDate); setIsOpen(false); } } };
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { const newValue = e.target.value; setInternalStartDate(newValue); const d = parseDate(newValue); if (d) { setSelectedStartDay(d.getDate()); if (selectedField === 'start') { setCurrentMonth(d.getMonth()); setCurrentYear(d.getFullYear()); } onStartDateChange(newValue); } else if (newValue === '') { setSelectedStartDay(null); onStartDateChange(''); } };
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { const newValue = e.target.value; setInternalEndDate(newValue); const d = parseDate(newValue); if (d) { setSelectedEndDay(d.getDate()); if (selectedField === 'end') { setCurrentMonth(d.getMonth()); setCurrentYear(d.getFullYear()); } onEndDateChange(newValue); } else if (newValue === '') { setSelectedEndDay(null); onEndDateChange(''); } };
  const toggleDatePicker = (field: 'start' | 'end' | null = null) => { if (disabled) return; if (field) { setSelectedField(field); if (field === 'start' && internalStartDate) { const d = parseDate(internalStartDate); if (d) { setCurrentMonth(d.getMonth()); setCurrentYear(d.getFullYear()); } } else if (field === 'end' && internalEndDate) { const d = parseDate(internalEndDate); if (d) { setCurrentMonth(d.getMonth()); setCurrentYear(d.getFullYear()); } } } setIsOpen(!isOpen); setIsFocused(true); };
  return (
    <motion.div layout transition={{ duration: 0.3, type: "spring" }} className={`${className} mb-3 sm:mb-2`}>
      <label className="block text-gray-700 font-medium mb-2 pl-4">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <div className="relative" ref={datePickerRef}>
        <motion.div className={`relative w-full ${isOpen ? "z-40" : ""}`} initial={false} animate={{ scale: isOpen ? 1.02 : 1 }} transition={{ duration: 0.2 }}>
          <div className={`flex gap-2 items-center`}>
            <div className={`flex-1 border p-3 sm:p-4 rounded-xl shadow-md cursor-pointer flex items-center gap-2 hover:shadow-lg transition-all duration-300 ease-in-out ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'} ${isFocused && selectedField === 'start' && !disabled ? "ring-2 ring-emerald-200 bg-emerald-50" : ""} ${(typeof error === 'object' && error.start) ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:bg-red-100' : ''}`} onClick={() => toggleDatePicker('start')}>
              <Calendar size={18} className="text-gray-400" />
              <input type="text" className={`flex-grow bg-transparent border-none focus:outline-none p-0 ${disabled ? 'text-gray-500' : 'text-black'} ${!internalStartDate ? 'text-gray-400' : ''}`} placeholder={startPlaceholder} value={internalStartDate} onChange={handleStartDateChange} onFocus={() => { if (!disabled) { setIsFocused(true); setSelectedField('start'); } }} onBlur={() => { if (!isOpen) setIsFocused(false); }} disabled={disabled} />
              {!disabled && (<motion.svg animate={{ rotate: isOpen && selectedField === 'start' ? 180 : 0 }} transition={{ duration: 0.3 }} className="ml-auto w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></motion.svg>)}
            </div>
            <div className={`flex-1 border p-3 sm:p-4 rounded-xl shadow-md cursor-pointer flex items-center gap-2 hover:shadow-lg transition-all duration-300 ease-in-out ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'} ${isFocused && selectedField === 'end' && !disabled ? "ring-2 ring-emerald-200 bg-emerald-50" : ""} ${(typeof error === 'object' && error.end) ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:bg-red-100' : ''}`} onClick={() => toggleDatePicker('end')}>
              <Calendar size={18} className="text-gray-400" />
              <input type="text" className={`flex-grow bg-transparent border-none focus:outline-none p-0 ${disabled ? 'text-gray-500' : 'text-black'} ${!internalEndDate ? 'text-gray-400' : ''}`} placeholder={endPlaceholder} value={internalEndDate} onChange={handleEndDateChange} onFocus={() => { if (!disabled) { setIsFocused(true); setSelectedField('end'); } }} onBlur={() => { if (!isOpen) setIsFocused(false); }} disabled={disabled} />
              {!disabled && (<motion.svg animate={{ rotate: isOpen && selectedField === 'end' ? 180 : 0 }} transition={{ duration: 0.3 }} className="ml-auto w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></motion.svg>)}
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {isOpen && !disabled && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30" onClick={() => setIsOpen(false)}></motion.div>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute w-full mt-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg z-50 overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center pb-3 mb-2 border-b border-blue-200">
                    <button type="button" onClick={() => setSelectedField('start')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedField === 'start' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`}>{internalStartDate || 'Ngày bắt đầu'}</button>
                    <div className="text-blue-600"><ArrowRight size={20} /></div>
                    <button type="button" onClick={() => setSelectedField('end')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedField === 'end' ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-100'}`}>{internalEndDate || 'Ngày kết thúc'}</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={prevMonth} className="p-1.5 hover:bg-blue-100 rounded-full text-blue-600 transition-colors duration-200"><ChevronLeft className="w-5 h-5" /></button>
                    <div className="flex gap-2">
                      <div className="relative">
                        <button type="button" onClick={toggleMonthSelector} className="font-medium text-blue-600 flex items-center justify-center px-2 py-1 hover:bg-blue-100 rounded-full transition-colors duration-200"><span>{months[currentMonth]}</span><ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${showMonthSelector ? 'transform rotate-180' : ''}`} /></button>
                        <AnimatePresence>
                          {showMonthSelector && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="absolute z-10 mt-1 bg-white border-2 border-blue-200 rounded-xl shadow-lg max-h-52 overflow-auto w-36 left-1/2 transform -translate-x-1/2" style={{ top: 'calc(100% + 4px)', left: 'calc(100% - 125px)' }}>
                              <div className="grid grid-cols-3 gap-1 p-2">{shortMonths.map((month, index) => (<button key={month} type="button" onClick={(e) => selectMonth(e, index)} className={`p-1.5 rounded-lg text-sm transition-colors duration-150 ${index === currentMonth ? 'bg-blue-500 text-white font-medium' : 'text-gray-700 hover:bg-blue-100'}`}>{month}</button>))}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="relative">
                        <button type="button" onClick={toggleYearSelector} className="font-medium text-blue-600 flex items-center justify-center px-2 py-1 hover:bg-blue-100 rounded-full transition-colors duration-200"><span>{currentYear}</span><ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${showYearSelector ? 'transform rotate-180' : ''}`} /></button>
                        <AnimatePresence>
                          {showYearSelector && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="absolute z-10 mt-1 bg-white border-2 border-blue-200 rounded-xl shadow-lg max-h-52 overflow-auto w-32 left-1/2 transform -translate-x-1/2" style={{ top: 'calc(100% + 4px)', left: 'calc(100% - 105px)' }}>
                              {years.map((year) => (<button key={year} type="button" onClick={(e) => selectYear(e, year)} className={`w-full px-3 py-1.5 text-center text-sm hover:bg-blue-100 transition-colors duration-150 ${year === currentYear ? 'bg-blue-500 text-white font-medium' : 'text-gray-700'}`}>{year}</button>))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-blue-100 rounded-full text-blue-600 transition-colors duration-200"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                  <div className="p-3 rounded-lg">
                    <div className="grid grid-cols-7 gap-1 mb-2">{days.map((day) => (<div key={day} className="text-center text-xs font-medium text-gray-500">{day}</div>))}</div>
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDays().map((day, index) => {
                        const startDateObj = parseDate(internalStartDate); const endDateObj = parseDate(internalEndDate);
                        const isStartDay = startDateObj && day === startDateObj.getDate() && currentMonth === startDateObj.getMonth() && currentYear === startDateObj.getFullYear();
                        const isEndDay = endDateObj && day === endDateObj.getDate() && currentMonth === endDateObj.getMonth() && currentYear === endDateObj.getFullYear();
                        const isInRange = isDayInRange(day);
                        const isFuture = isFutureDate(day);
                        return (
                          <button type="button" key={`day-${index}`} onClick={(e) => day && !isFuture && handleDateSelect(e, day)} disabled={!day || isFuture} className={`p-2 text-center rounded-lg text-sm font-medium ${!day ? 'invisible' : isFuture ? 'cursor-not-allowed text-gray-300' : 'cursor-pointer'} ${isStartDay ? 'bg-blue-500 text-white' : isEndDay ? 'bg-indigo-500 text-white' : isInRange ? 'bg-blue-100 text-blue-800' : !isFuture ? 'hover:bg-blue-200 text-gray-700' : ''}`}>{day}</button>
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
      <AnimatePresence>
        {Boolean(error) && (
          <motion.p key="error" initial={{ opacity: 0, y: -5, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -5, height: 0 }} transition={{ duration: 0.3 }} className="text-xs text-red-500 px-4 p-1 mt-1">
            {typeof error === 'string' ? error : (error.start || error.end || '')}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DateRangePicker;