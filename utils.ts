/**
 * Formats a decimal number of hours into H:MM format.
 * @param totalHours - The total hours in decimal format (e.g., 8.5).
 * @returns A string formatted as H:MM (e.g., "8:30").
 */
export const formatHoursMinutes = (totalHours: number): string => {
  if (isNaN(totalHours) || totalHours < 0) {
    return '0:00';
  }

  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  const paddedMinutes = String(minutes).padStart(2, '0');

  return `${hours}:${paddedMinutes}`;
};

/**
 * Converts a Date object to a 'YYYY-MM-DD' string based on its local date parts, ignoring timezone.
 * @param date - The Date object.
 * @returns A string formatted as 'YYYY-MM-DD'.
 */
export const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
