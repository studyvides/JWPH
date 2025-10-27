import React, { useState, useMemo } from 'react';
import { DailyEntry } from '../types';
import AddHoursModal from './AddHoursModal';
import { formatHoursMinutes, toLocalDateString } from '../utils';
import { useLocalization } from '../hooks/useLocalization';

interface CalendarViewProps {
  entries: DailyEntry[];
  onAddEntry: (entry: Omit<DailyEntry, 'id'>) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ entries, onAddEntry }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { getLocalizedMonthNames, t } = useLocalization();

  const dailyHours = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach(entry => {
      const dateKey = entry.date;
      const currentHours = map.get(dateKey) || 0;
      map.set(dateKey, currentHours + entry.hours);
    });
    return map;
  }, [entries]);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const handleSaveHours = (data: { date: string; hours: number }) => {
    onAddEntry({
      date: data.date,
      hours: data.hours,
    });
    setIsModalOpen(false);
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Add empty cells for the days before the first day of the month
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust so Monday is the first day
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="border-r border-b border-stone-200 dark:border-white/10"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = toLocalDateString(date);
      const hours = dailyHours.get(dateKey);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className="relative p-1 border-r border-b border-stone-200 dark:border-white/10 text-center cursor-pointer hover:bg-jw-purple-50 dark:hover:bg-white/5 transition-colors h-16 sm:h-20 flex flex-col justify-start items-center"
          onClick={() => handleDayClick(date)}
        >
          <span className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-sm ${isToday ? 'bg-jw-purple-700 text-white font-bold' : 'text-stone-700 dark:text-stone-300'}`}>
            {day}
          </span>
          {hours && hours > 0 && (
            <span className="mt-1 text-[10px] sm:text-xs font-semibold bg-jw-purple-100 text-jw-purple-800 dark:bg-jw-purple-900/50 dark:text-jw-purple-200 px-1.5 py-0.5 rounded-full">
              {formatHoursMinutes(hours)}
            </span>
          )}
        </div>
      );
    }

    return days;
  };
  
  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));


  return (
    <div className="bg-white dark:bg-[#2c2c2c] p-4 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10">&lt;</button>
        <h3 className="text-xl font-bold text-stone-700 dark:text-stone-200">
          {getLocalizedMonthNames()[viewDate.getMonth()]} {viewDate.getFullYear()}
        </h3>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10">&gt;</button>
      </div>
      <div className="grid grid-cols-7 border-t border-l border-stone-200 dark:border-white/10">
        {t('days.short').split(',').map(day => (
          <div key={day} className="p-2 text-center font-semibold text-sm text-stone-500 dark:text-stone-400 border-r border-b border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/5">{day}</div>
        ))}
        {renderCalendar()}
      </div>
      {isModalOpen && selectedDate && (
        <AddHoursModal
          selectedDate={selectedDate}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveHours}
        />
      )}
    </div>
  );
};

export default CalendarView;