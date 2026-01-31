'use client';

import { useState, useEffect } from 'react';

export interface ReportDateRange {
  startDate: Date | null;
  endDate: Date | null;
  isMounted: boolean;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  handleDateChange: (start: Date, end: Date) => void;
  getISODates: () => { startIso: string; endIso: string } | null;
}

/**
 * Hook to manage report date range with hydration safety
 * Initializes to current month by default
 */
export function useReportDates(): ReportDateRange {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize dates on client mount to avoid hydration mismatch
  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(firstDayOfMonth);
    setEndDate(lastDayOfMonth);
    setIsMounted(true);
  }, []);

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const getISODates = () => {
    if (!startDate || !endDate) return null;
    return {
      startIso: startDate.toISOString(),
      endIso: endDate.toISOString()
    };
  };

  return {
    startDate,
    endDate,
    isMounted,
    setStartDate,
    setEndDate,
    handleDateChange,
    getISODates
  };
}
