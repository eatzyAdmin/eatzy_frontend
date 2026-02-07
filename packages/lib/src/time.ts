/**
 * Parses a time string in HH:mm format to the total number of minutes.
 * @param time Time string (e.g., "14:30")
 * @returns Total minutes from the start of the day
 */
export const parseTimeToMinutes = (time: string): number => {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

/**
 * Formats a number of minutes into a HH:mm time string.
 * @param minutes Total minutes from the start of the day
 * @returns Formatted time string (e.g., "09:00")
 */
export const formatMinutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};
