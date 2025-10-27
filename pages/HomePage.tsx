import React from 'react';
import { DailyEntry, MonthlyTotals, YearlyTotals } from '../types';
import CalendarView from '../components/CalendarView';
import { formatHoursMinutes } from '../utils';
import { useLocalization } from '../hooks/useLocalization';

interface HomePageProps {
  entries: DailyEntry[];
  onAddEntry: (entry: Omit<DailyEntry, 'id'>) => void;
  monthlyTotals: MonthlyTotals;
  yearlyTotals: YearlyTotals;
}

const HomePage: React.FC<HomePageProps> = ({ entries, onAddEntry, monthlyTotals, yearlyTotals }) => {
  const { t, getLocalizedMonthNames } = useLocalization();
  const currentDate = new Date();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthData = monthlyTotals[currentMonthKey] || { hours: 0 };
  const currentMonthName = getLocalizedMonthNames()[currentDate.getMonth()];

  return (
    <div className="space-y-6">
      <CalendarView entries={entries} onAddEntry={onAddEntry} />

      <div className="bg-white dark:bg-[#2c2c2c] p-6 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
        <h3 className="text-xl font-bold text-stone-700 dark:text-stone-200 mb-4">{t('home.quickSummary')}</h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-stone-100 dark:bg-white/5 rounded-lg">
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
                  {t('home.currentMonthHours', currentMonthName)}
                </p>
                <p className="font-bold text-2xl text-jw-purple-700 dark:text-jw-purple-300">{formatHoursMinutes(currentMonthData.hours)}</p>
            </div>
            <div className="p-4 bg-stone-100 dark:bg-white/5 rounded-lg">
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">{t('home.serviceYearHours')}</p>
                <p className="font-bold text-2xl text-jw-purple-700 dark:text-jw-purple-300">{formatHoursMinutes(yearlyTotals.hours)}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;