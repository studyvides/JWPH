import React, { useState } from 'react';
import { MonthlyTotals } from '../types';
import { formatHoursMinutes } from '../utils';
import { useLocalization } from '../hooks/useLocalization';

interface ServiceYearHistoryProps {
  monthlyTotals: MonthlyTotals;
  serviceYearMonths: string[];
  currentServiceYear: number;
}

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const ServiceYearHistory: React.FC<ServiceYearHistoryProps> = ({
  monthlyTotals,
  serviceYearMonths,
  currentServiceYear,
}) => {
  const [copiedMonth, setCopiedMonth] = useState<string | null>(null);
  const { t, getLocalizedMonthNames } = useLocalization();

  const handleShare = (monthKey: string) => {
    const hours = monthlyTotals[monthKey]?.hours || 0;
    const [year, month] = monthKey.split('-').map(Number);
    const monthName = getLocalizedMonthNames()[month - 1];
    const textToCopy = t('history.shareText', monthName, year, formatHoursMinutes(hours));
    navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedMonth(monthKey);
        setTimeout(() => setCopiedMonth(null), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert("Copy failed");
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to the start of the day

  return (
    <div className="bg-white dark:bg-[#2c2c2c] p-6 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
        <h3 className="text-xl font-bold text-stone-700 dark:text-stone-200 mb-2">{t('history.title', currentServiceYear)}</h3>
        <ul>
        {serviceYearMonths.map(monthKey => {
            const [year, monthNum] = monthKey.split('-').map(Number);
            const monthDate = new Date(year, monthNum - 1, 1);
            if (monthDate.getTime() > today.getTime() && monthDate.getMonth() !== today.getMonth()) return null;
            
            const monthData = monthlyTotals[monthKey] || { hours: 0 };
            const monthName = getLocalizedMonthNames()[monthNum - 1];

            return (
                <li key={monthKey} className="flex items-center justify-between py-4 border-b border-stone-200 dark:border-white/10 last:border-b-0">
                  <div className="flex-grow">
                      <div className="font-bold text-base text-jw-purple-800 dark:text-jw-purple-300 mb-1">
                          {monthName} {year}
                      </div>
                      <div className="flex gap-x-4 text-sm">
                          <div className="font-semibold text-stone-600 dark:text-stone-300">{t('history.hours')} <span className="font-normal">{formatHoursMinutes(monthData.hours)}</span></div>
                      </div>
                  </div>
                  <button 
                      onClick={() => handleShare(monthKey)} 
                      className={`ml-4 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${copiedMonth === monthKey ? 'bg-green-600 text-white' : 'bg-jw-purple-100 text-jw-purple-800 dark:bg-jw-purple-900/50 dark:text-jw-purple-200 hover:bg-jw-purple-200 dark:hover:bg-jw-purple-900'}`}
                      aria-label={t('history.share')}
                  >
                      {copiedMonth === monthKey ? <CheckIcon /> : <ShareIcon />}
                  </button>
                </li>
            );
        })}
        </ul>
    </div>
  );
};

export default ServiceYearHistory;