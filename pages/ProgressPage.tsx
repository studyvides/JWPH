import React from 'react';
import { YearlyTotals, MonthlyTotals } from '../types';
import { formatHoursMinutes } from '../utils';
import { useLocalization } from '../hooks/useLocalization';

interface ProgressPageProps {
  yearlyTotals: YearlyTotals;
  yearlyGoal: number;
  monthlyTotals: MonthlyTotals;
}

const ProgressPage: React.FC<ProgressPageProps> = ({ yearlyTotals, yearlyGoal, monthlyTotals }) => {
  const { t } = useLocalization();
  const totalHoursYTD = yearlyTotals.hours;
  const progressPercentage = Math.min((totalHoursYTD / yearlyGoal) * 100, 100);

  const currentDate = new Date();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthData = monthlyTotals[currentMonthKey] || { hours: 0 };

  const serviceYearStartMonth = 8; // September
  const monthsPassed = currentDate.getMonth() >= serviceYearStartMonth -1 
    ? currentDate.getMonth() - (serviceYearStartMonth - 1) + 1
    : currentDate.getMonth() + (12 - (serviceYearStartMonth - 1)) + 1;
  
  const monthsRemaining = 12 - monthsPassed;
  
  const hoursNeeded = yearlyGoal - totalHoursYTD;
  const monthlyAverageNeeded = monthsRemaining > 0 ? (hoursNeeded / monthsRemaining) : 0;

  const monthlyGoal = yearlyGoal / 12;
  const monthlyStatus = currentMonthData.hours - monthlyGoal;
  
  const getProgressColor = () => {
    const proratedGoal = monthlyGoal * monthsPassed;
    const deficit = proratedGoal - totalHoursYTD;

    if (deficit > monthlyGoal / 2) { // More than 2 weeks behind
      return 'bg-red-500';
    }
    if (totalHoursYTD > proratedGoal + monthlyGoal) { // More than a month ahead
      return 'bg-jw-purple-600';
    }
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#2c2c2c] p-6 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
        <h3 className="text-xl font-bold text-stone-700 dark:text-stone-200">{t('progress.title')}</h3>
      </div>
      
      <div className="bg-white dark:bg-[#2c2c2c] p-6 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-stone-600 dark:text-stone-300">{t('progress.goal', yearlyGoal)}</span>
            <span className="text-2xl font-bold text-jw-purple-700 dark:text-jw-purple-300">{formatHoursMinutes(totalHoursYTD)} <span className="text-lg font-medium text-stone-500 dark:text-stone-400">{t('progress.hours')}</span></span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-white/10 rounded-full h-4">
            <div className={`${getProgressColor()} h-4 rounded-full transition-all duration-500`} style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="text-right font-semibold text-stone-600 dark:text-stone-300">{progressPercentage.toFixed(1)}{t('progress.completed')}</div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-stone-100 dark:bg-white/5 rounded-lg">
                <p className="text-stone-500 dark:text-stone-400 text-sm">{t('progress.monthlyStatus')}</p>
                <p className={`font-bold text-lg ${monthlyStatus >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {monthlyStatus >= 0 ? '+' : '-'}{formatHoursMinutes(Math.abs(monthlyStatus))}
                </p>
            </div>
            <div className="p-3 bg-stone-100 dark:bg-white/5 rounded-lg">
                <p className="text-stone-500 dark:text-stone-400 text-sm">{t('progress.hoursRemaining')}</p>
                <p className="font-bold text-lg text-stone-800 dark:text-stone-200">{hoursNeeded > 0 ? formatHoursMinutes(hoursNeeded) : '0:00'}</p>
            </div>
            <div className="p-3 bg-stone-100 dark:bg-white/5 rounded-lg">
                <p className="text-stone-500 dark:text-stone-400 text-sm">{t('progress.monthlyAvgNeeded')}</p>
                <p className="font-bold text-lg text-jw-purple-800 dark:text-jw-purple-300">{formatHoursMinutes(monthlyAverageNeeded)}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;