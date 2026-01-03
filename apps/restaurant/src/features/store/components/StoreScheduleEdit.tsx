import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Clock, X, Save, Trash2, Plus, Check } from "@repo/ui/icons";
import { TimeInput, useNotification, useSwipeConfirmation } from "@repo/ui";

interface DaySchedule {
  day: string;
  isOpen: boolean;
  shifts: Shift[];
  open?: string;
  close?: string;
}

interface StoreScheduleEditProps {
  store: { openingHours: DaySchedule[] };
  onSave: (updates: { openingHours: DaySchedule[] }) => void;
  onClose: () => void;
  layoutId?: string;
}

interface Shift {
  open: string;
  close: string;
  isTemp?: boolean;
}

const PASTEL_PALETTE = [
  'bg-[#D8EBFD] text-[#1A56DB]', // Pastel Blue
  'bg-[#DFFFE5] text-[#1E7E34]', // Pastel Green
  'bg-[#FFF4DE] text-[#B75501]', // Pastel Orange
];

const ZONES = [
  { label: 'SÁNG', start: 0, end: 11 },
  { label: 'TRƯA', start: 11, end: 14 },
  { label: 'CHIỀU', start: 14, end: 18 },
  { label: 'TỐI', start: 18, end: 24 },
];

const parseTimeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const formatMinutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export default function StoreScheduleEdit({ store, onSave, onClose, layoutId }: StoreScheduleEditProps) {
  const [openingHours, setOpeningHours] = useState<DaySchedule[]>(() => {
    const data = JSON.parse(JSON.stringify(store.openingHours));
    data.forEach((day: DaySchedule) => {
      if (!day.shifts) {
        day.shifts = [];
        if (day.open && day.close) day.shifts.push({ open: day.open, close: day.close });
      }
      if (day.shifts.length > 0) day.isOpen = true;
    });
    return data;
  });

  const [selectedShift, setSelectedShift] = useState<{ dayIndex: number, shiftIndex: number } | null>(null);
  const [draftShift, setDraftShift] = useState<{ open: string, close: string } | null>(null);

  const [hoverDayIndex, setHoverDayIndex] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<string | null>(null);
  const [hoveredShiftRange, setHoveredShiftRange] = useState<{ start: string, end: string } | null>(null);

  const [conflictShifts, setConflictShifts] = useState<{ dayIndex: number, shiftIndex: number }[]>([]);
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();

  // Store initial state for comparison
  const [initialJson] = useState(() => JSON.stringify(openingHours));

  const [resizingState, setResizingState] = useState<{ dayIndex: number, shiftIndex: number, edge: 'start' | 'end', startMins: number, startY: number } | null>(null);
  const hoursRef = useRef(openingHours);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hoursRef.current = openingHours;
  }, [openingHours]);

  const startResize = (e: React.MouseEvent, dayIndex: number, shiftIndex: number, edge: 'start' | 'end', time: string) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingState({
      dayIndex,
      shiftIndex,
      edge,
      startMins: parseTimeToMinutes(time),
      startY: e.clientY
    });
    setSelectedShift(null); // Deselect to focus on resizing
  };

  useEffect(() => {
    if (!resizingState) return;

    const handleGlobalResizeMove = (e: MouseEvent) => {
      if (!gridRef.current) return;

      const rect = gridRef.current.getBoundingClientRect();
      const deltaY = e.clientY - resizingState.startY;
      // Calculate minutes based on grid height
      const totalMinutes = 24 * 60;
      const deltaMinutes = (deltaY / rect.height) * totalMinutes;

      let newMins = resizingState.startMins + deltaMinutes;
      // Snap to 5 mins
      newMins = Math.round(newMins / 5) * 5;

      // Clamp 0-24h
      if (newMins < 0) newMins = 0;
      if (newMins > totalMinutes) newMins = totalMinutes;

      const { dayIndex, shiftIndex, edge } = resizingState;
      const currentHours = [...hoursRef.current];
      const dayShifts = currentHours[dayIndex].shifts;
      const currentShift = dayShifts[shiftIndex];

      const otherShifts = dayShifts.filter((_: Shift, idx: number) => idx !== shiftIndex);

      // Validate
      const otherMins = edge === 'start' ? parseTimeToMinutes(currentShift.close) : parseTimeToMinutes(currentShift.open);

      // 1. Check self-integrity (start < end) - Minimum 1 hour
      const MIN_DURATION = 60;
      let isTooShort = false;

      if (edge === 'start') {
        if (otherMins - newMins < MIN_DURATION) isTooShort = true;
      } else {
        if (newMins - otherMins < MIN_DURATION) isTooShort = true;
      }

      if (isTooShort) {
        setConflictShifts([{ dayIndex, shiftIndex }]);
        setTimeout(() => setConflictShifts([]), 500);
        return;
      }

      // 2. Check overlap with others
      let conflictIdx = -1;

      const checkStart = edge === 'start' ? newMins : otherMins;
      const checkEnd = edge === 'start' ? otherMins : newMins;

      for (let i = 0; i < otherShifts.length; i++) {
        const s = parseTimeToMinutes(otherShifts[i].open);
        const e = parseTimeToMinutes(otherShifts[i].close);

        // Intersection
        if (checkStart < e && checkEnd > s) {
          // Conflict
          // Find original index
          const originalIndex = currentHours[dayIndex].shifts.indexOf(otherShifts[i]);
          conflictIdx = originalIndex;
          break;
        }
      }

      if (conflictIdx !== -1) {
        // Collision!
        // Trigger animation
        setConflictShifts([{ dayIndex, shiftIndex }, { dayIndex, shiftIndex: conflictIdx }]);
        setTimeout(() => setConflictShifts([]), 500);
        return; // Don't update time
      }

      // Update time
      const newTimeStr = formatMinutesToTime(newMins);

      // Only update if changed
      if ((edge === 'start' && currentShift.open !== newTimeStr) || (edge === 'end' && currentShift.close !== newTimeStr)) {
        if (edge === 'start') currentShift.open = newTimeStr;
        else currentShift.close = newTimeStr;

        setOpeningHours(currentHours);
      }
    };

    const handleGlobalResizeUp = () => {
      setResizingState(null);
    };

    window.addEventListener('mousemove', handleGlobalResizeMove);
    window.addEventListener('mouseup', handleGlobalResizeUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalResizeMove);
      window.removeEventListener('mouseup', handleGlobalResizeUp);
    };
  }, [resizingState]);

  useEffect(() => {
    if (selectedShift) {
      const shift = openingHours[selectedShift.dayIndex].shifts[selectedShift.shiftIndex];
      setDraftShift({ ...shift });
      setHoveredShiftRange({ start: shift.open, end: shift.close });
    } else {
      setDraftShift(null);
      setHoveredShiftRange(null);
    }
  }, [selectedShift, openingHours]);

  const handleGlobalSave = () => {
    const currentJson = JSON.stringify(openingHours);
    if (currentJson === initialJson) {
      showNotification({
        type: 'error',
        message: 'Bạn chưa thực hiện thay đổi nào!',
        format: 'Kiểm tra lại các thay đổi và thử lại!',
        autoHideDuration: 3000
      });
      return;
    }

    confirm({
      title: 'Cập nhật lịch làm việc',
      description: 'Lịch làm việc mới sẽ được áp dụng cho cửa hàng của bạn. Lưu ý là đây chỉ là lịch hiển thị cho khách hàng thôi, thời gian hoạt động của quán sẽ phụ thuộc vào lúc bạn bật/tắt app.',
      type: 'info',
      confirmText: 'Lưu thay đổi',
      onConfirm: async () => {
        onSave({ openingHours });
      }
    });
  };

  const getPositionStyle = (start: string, end: string) => {
    const startMins = parseTimeToMinutes(start);
    const endMins = parseTimeToMinutes(end);
    const topPerc = (startMins / (24 * 60)) * 100;
    const heightPerc = ((endMins - startMins) / (24 * 60)) * 100;
    return { top: `${topPerc}%`, height: `${heightPerc}%` };
  };

  const getHoverGap = useCallback(() => {
    if (hoverDayIndex === null || !hoverTime) return null;
    const hoverMins = parseTimeToMinutes(hoverTime);
    const day = openingHours[hoverDayIndex];
    if (!day.isOpen) return null;

    const dayShifts = day.shifts;

    // Sort shifts
    const sortedShifts = [...dayShifts].sort((a: Shift, b: Shift) => parseTimeToMinutes(a.open) - parseTimeToMinutes(b.open));

    let startBound = 0;
    let endBound = 24 * 60;

    for (const shift of sortedShifts) {
      const S = parseTimeToMinutes(shift.open);
      const E = parseTimeToMinutes(shift.close);

      // If cursor is INSIDE a shift, strict overlap check
      if (hoverMins >= S && hoverMins < E) return null;

      if (E <= hoverMins) {
        // This shift is before the cursor
        if (E > startBound) startBound = E;
      }
      if (S >= hoverMins) {
        // This shift is after the cursor
        if (S < endBound) endBound = S;
      }
    }

    return {
      start: formatMinutesToTime(startBound),
      end: formatMinutesToTime(endBound)
    };
  }, [hoverDayIndex, hoverTime, openingHours]);

  const hoverGap = useMemo(() => getHoverGap(), [getHoverGap]);

  const cancelEdit = () => {
    if (selectedShift) {
      const { dayIndex, shiftIndex } = selectedShift;
      const shift = openingHours[dayIndex].shifts[shiftIndex];
      if (shift?.isTemp) {
        const newHours = [...openingHours];
        newHours[dayIndex].shifts.splice(shiftIndex, 1);
        setOpeningHours(newHours);
      }
    }
    setSelectedShift(null);
    setHoveredShiftRange(null);
  }

  const handleGridClick = (dayIndex: number) => {
    if (selectedShift) {
      cancelEdit();
      return;
    }

    // If day is closed, just open it
    if (!openingHours[dayIndex].isOpen) {
      const newHours = [...openingHours];
      newHours[dayIndex].isOpen = true;
      setOpeningHours(newHours);
      return;
    }

    if (!hoverTime) return;

    // Create new shift at hover time
    // Default 1 hour duration or less if bound is closer
    const startMins = parseTimeToMinutes(hoverTime);
    let endMins = startMins + 60;

    // Check if endMins overlaps next bound
    if (hoverGap) {
      const gapEnd = parseTimeToMinutes(hoverGap.end);
      if (endMins > gapEnd) endMins = gapEnd;
    }

    if (endMins > 24 * 60) endMins = 24 * 60;
    if (endMins <= startMins) return; // invalid

    const endStr = formatMinutesToTime(endMins);

    const newHours = [...openingHours];
    newHours[dayIndex].isOpen = true; // ensure open
    newHours[dayIndex].shifts.push({ open: hoverTime, close: endStr, isTemp: true }); // Mark as temp
    setOpeningHours(newHours);

    // Select newly created shift
    setSelectedShift({ dayIndex, shiftIndex: newHours[dayIndex].shifts.length - 1 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const perc = y / rect.height;
    const minutes = Math.max(0, Math.min(24 * 60, perc * 24 * 60));
    const roundedMinutes = Math.floor(minutes / 15) * 15; // Snap at 15
    setHoverTime(formatMinutesToTime(roundedMinutes));
  };

  const saveDraft = () => {
    if (!selectedShift || !draftShift) return;

    // Check for overlaps
    const dayIndex = selectedShift.dayIndex;
    const currentShiftIndex = selectedShift.shiftIndex;
    const dayShifts = openingHours[dayIndex].shifts;

    const startMins = parseTimeToMinutes(draftShift.open);
    const endMins = parseTimeToMinutes(draftShift.close);

    const conflicts: number[] = [];

    dayShifts.forEach((shift: Shift, index: number) => {
      if (index === currentShiftIndex) return; // Skip self
      const s = parseTimeToMinutes(shift.open);
      const e = parseTimeToMinutes(shift.close);

      // Check intersection: (StartA < EndB) && (EndA > StartB)
      if (startMins < e && endMins > s) {
        conflicts.push(index);
      }
    });

    if (conflicts.length > 0) {
      // Handle collision
      const newConflicts = [...conflicts, currentShiftIndex].map(idx => ({ dayIndex, shiftIndex: idx }));
      setConflictShifts(newConflicts);
      showNotification({
        type: 'error',
        message: 'Oops! Bị trùng với một lịch khác mất rồi!',
        format: 'Kiểm tra lại các lịch trình khác và điều chỉnh phù hợp nha.',
        autoHideDuration: 3000
      });

      // Clear conflict state after animation
      setTimeout(() => {
        setConflictShifts([]);
      }, 1000); // 1s animation
      return;
    }

    const newHours = [...openingHours];
    const shift = { ...draftShift } as Shift;
    delete shift.isTemp;
    newHours[selectedShift.dayIndex].shifts[selectedShift.shiftIndex] = shift;
    setOpeningHours(newHours);
    setSelectedShift(null);
    setHoveredShiftRange(null);
    setConflictShifts([]);
  };

  const deleteShift = () => {
    if (!selectedShift) return;
    const newHours = [...openingHours];
    newHours[selectedShift.dayIndex].shifts.splice(selectedShift.shiftIndex, 1);
    setOpeningHours(newHours);
    setSelectedShift(null);
    setHoveredShiftRange(null);
  };

  const toggleDay = (index: number) => {
    const newHours = [...openingHours];
    newHours[index].isOpen = !newHours[index].isOpen;
    setOpeningHours(newHours);
  }

  // Generate sparse markers
  const TIME_MARKERS = [0, 11, 14, 18, 23];

  return (
    <motion.div
      layoutId={layoutId}
      className="bg-white w-[1200px] max-w-[95vw] rounded-[32px] pt-4 p-6 shadow-2xl relative overflow-hidden flex flex-col h-[90vh]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0 px-2 h-14">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            WEEKLY SCHEDULE
          </h2>

          {selectedShift && (
            <motion.div
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-white border border-gray-100 p-1.5 pr-4 rounded-2xl shadow-lg ml-28 -mt-3"
            >
              {draftShift && (
                <>
                  <div className="bg-gray-50 px-3 py-1.5 rounded-xl flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">From</span>
                    <TimeInput
                      value={draftShift.open}
                      onChange={v => {
                        setDraftShift(prev => {
                          if (!prev) return null;
                          const s = parseTimeToMinutes(v);
                          const e = parseTimeToMinutes(prev.close);
                          return {
                            ...prev,
                            open: v,
                            close: e < s + 60 ? formatMinutesToTime(Math.min(24 * 60, s + 60)) : prev.close
                          };
                        });
                      }}
                    />
                  </div>
                  <span className="text-gray-300">-</span>
                  <div className="bg-gray-50 px-3 py-1.5 rounded-xl flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">To</span>
                    <TimeInput
                      value={draftShift.close}
                      minTime={formatMinutesToTime(Math.min(24 * 60, parseTimeToMinutes(draftShift.open) + 60))}
                      onChange={v => setDraftShift(prev => prev ? ({ ...prev, close: v }) : null)}
                    />
                  </div>
                </>
              )}

              <div className="w-px h-6 bg-gray-200 mx-2" />

              <button
                onClick={deleteShift}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Delete Shift"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <button
                onClick={saveDraft}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                title="Update Schedule"
              >
                <Check className="w-6 h-6" strokeWidth={3} />
              </button>

              <button
                onClick={cancelEdit}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                title="Cancel Edit"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGlobalSave}
            className="p-4 rounded-full font-bold bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="p-4 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 overflow-hidden relative border-2 border-gray-200 rounded-3xl bg-white flex flex-col shadow-inner">

        {/* Days Header Row */}
        <div className="flex border-b border-gray-200 bg-gray-50/30">
          <div className="w-20 shrink-0 border-r border-gray-200 bg-gray-50/50" /> {/* Corner Spacer */}
          {openingHours.map((day, index) => (
            <div
              key={index}
              className="flex-1 py-3 text-center border-r border-gray-200 last:border-0 relative group hover:bg-white transition-colors"
              onMouseEnter={() => setHoverDayIndex(index)}
              onMouseLeave={() => setHoverDayIndex(null)}
            >
              <div className="flex flex-row items-center justify-center h-full">
                <span className={`text-xs font-bold uppercase transition-colors ${day.isOpen ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>{day.day}</span>

                <motion.div
                  initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                  animate={{
                    width: hoverDayIndex === index ? 'auto' : 0,
                    opacity: hoverDayIndex === index ? 1 : 0,
                    marginLeft: hoverDayIndex === index ? 8 : 0
                  }}
                  className="overflow-hidden flex items-center"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleDay(index); }}
                    className={`w-8 h-4 rounded-full relative shrink-0 transition-colors ${day.isOpen ? 'bg-[var(--primary)]' : 'bg-gray-200'}`}
                  >
                    <motion.div
                      animate={{ x: day.isOpen ? 18 : 2 }}
                      className="w-3 h-3 bg-white rounded-full absolute top-0.5"
                    />
                  </button>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 flex relative overflow-hidden">
          {/* Time Axis */}
          <div className="w-20 shrink-0 border-r border-gray-200 bg-gray-50/50 relative z-20 select-none">
            {/* Zones - Absolute positioned on axis */}
            {ZONES.map(zone => {
              const top = (zone.start / 24) * 100;
              const height = ((zone.end - zone.start) / 24) * 100;
              return (
                <div key={zone.label} className="absolute left-0 w-8 flex items-center justify-center pointer-events-none" style={{ top: `${top}%`, height: `${height}%` }}>
                  <div className={`flex items-center justify-center`}>
                    <span className="text-[10px] font-black -rotate-90 tracking-widest text-gray-200">{zone.label}</span>
                  </div>
                </div>
              );
            })}

            {/* Shift Markers (Hover/Select) */}
            <AnimatePresence>
              {hoveredShiftRange && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    className="absolute right-1 px-1.5 py-0.5 bg-[#1A1A1A] text-white text-[10px] font-bold rounded z-50 pointer-events-none"
                    style={{ top: `${(parseTimeToMinutes(hoveredShiftRange.start) / (24 * 60)) * 100}%`, transform: 'translateY(-50%)' }}
                  >
                    {hoveredShiftRange.start}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    className="absolute right-1 px-1.5 py-0.5 bg-[#1A1A1A] text-white text-[10px] font-bold rounded z-50 pointer-events-none"
                    style={{ top: `${(parseTimeToMinutes(hoveredShiftRange.end) / (24 * 60)) * 100}%`, transform: 'translateY(-50%)' }}
                  >
                    {hoveredShiftRange.end}
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Sparse Hours Markers */}
            {TIME_MARKERS.map(h => (
              <div key={h} className="absolute right-2 text-[10px] font-bold text-gray-400" style={{ top: `${(h / 24) * 100}%`, transform: 'translateY(-50%)' }}>
                {h}:00
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="flex-1 flex relative" ref={gridRef} onMouseMove={handleMouseMove} onMouseLeave={() => { setHoverTime(null); setHoveredShiftRange(selectedShift ? { start: draftShift!.open, end: draftShift!.close } : null); }}>

            {/* Grid Horizontal Lines */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {/* No grid lines */}
            </div>

            {/* Days Columns */}
            {openingHours.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="flex-1 border-r border-gray-200 last:border-0 relative h-full z-10"
                onMouseEnter={() => setHoverDayIndex(dayIndex)}
                onMouseLeave={() => setHoverDayIndex(null)}
              >
                {/* Column Click Area */}
                <div
                  className="flex-1 relative w-full h-full cursor-pointer"
                  onClick={() => handleGridClick(dayIndex)}
                >
                  {!day.isOpen && (
                    <div className="absolute inset-0 bg-gray-50/50 backdrop-grayscale-[0.5] flex items-center justify-center z-30 pointer-events-none">
                      <span className="text-gray-200 font-black text-5xl -rotate-90 tracking-widest opacity-50">CLOSED</span>
                    </div>
                  )}

                  {/* Hover Phantom Shift (Fill Gap) */}
                  {hoverDayIndex === dayIndex && hoverGap && !selectedShift && !resizingState && day.isOpen && (() => {
                    const pos = getPositionStyle(hoverGap.start, hoverGap.end);
                    return (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-2 right-2 rounded-[20px] bg-gray-200/50 border-2 border-dashed border-gray-300 pointer-events-none z-10 flex items-center justify-center"
                        style={{ top: `calc(${pos.top} + 8px)`, height: `calc(${pos.height} - 16px)` }}
                      >
                        <Plus className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    );
                  })()}

                  {/* Actual Shifts */}
                  <AnimatePresence>
                    {day.isOpen && day.shifts.map((shift: Shift, shiftIndex: number) => {
                      const pos = getPositionStyle(shift.open, shift.close);
                      const isSelected = selectedShift?.dayIndex === dayIndex && selectedShift?.shiftIndex === shiftIndex;
                      const isConflict = conflictShifts.some(c => c.dayIndex === dayIndex && c.shiftIndex === shiftIndex);
                      const colorClass = isSelected
                        ? 'bg-white border-[var(--primary)] text-[var(--primary)] z-50 shadow-2xl ring-4 ring-[var(--primary)]/10'
                        : PASTEL_PALETTE[shiftIndex % PASTEL_PALETTE.length];

                      const originalBgHex = shiftIndex % PASTEL_PALETTE.length === 0 ? '#D8EBFD' : (shiftIndex % PASTEL_PALETTE.length === 1 ? '#DFFFE5' : '#FFF4DE');

                      return (
                        <motion.div
                          key={shiftIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isConflict ? {
                            opacity: 1,
                            scale: 1,
                            x: [0, -8, 8, -8, 8, 0],
                            backgroundColor: ["#FECACA", isSelected ? "#FFFFFF" : originalBgHex],
                            transition: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
                          } : { opacity: 1, scale: 1, x: 0, backgroundColor: isSelected ? "#FFFFFF" : originalBgHex }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          whileHover={{ scale: 1.02, filter: "brightness(0.95)", zIndex: 60 }}
                          onClick={(e) => { e.stopPropagation(); setSelectedShift({ dayIndex, shiftIndex }); }}
                          onMouseEnter={() => !selectedShift && setHoveredShiftRange({ start: shift.open, end: shift.close })}
                          onMouseLeave={() => !selectedShift && setHoveredShiftRange(null)}
                          className={`absolute left-2 right-2 rounded-[20px] shadow-sm cursor-pointer flex flex-col justify-center px-3 overflow-hidden ${colorClass}`}
                          style={pos}
                        >
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 opacity-50 shrink-0" />
                            <div className="flex flex-col leading-none">
                              <span className="text-[10px] font-bold">{shift.open} - {shift.close}</span>
                            </div>
                          </div>

                          {/* Resize Handles */}
                          <div
                            className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize z-50 hover:bg-black/5 transition-colors"
                            onMouseDown={(e) => startResize(e, dayIndex, shiftIndex, 'start', shift.open)}
                          />
                          <div
                            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize z-50 hover:bg-black/5 transition-colors"
                            onMouseDown={(e) => startResize(e, dayIndex, shiftIndex, 'end', shift.close)}
                          />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
