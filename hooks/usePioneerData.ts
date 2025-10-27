import { useState, useEffect, useCallback, useMemo } from 'react';
import { DailyEntry, MonthlyTotals, YearlyTotals } from '../types';
import { YEARLY_GOAL } from '../constants';

const getServiceYear = (date: Date): number => {
  const month = date.getMonth(); // 0-11
  const year = date.getFullYear();
  return month >= 8 ? year + 1 : year; // Service year starts in September
};

const getServiceYearMonths = (serviceYear: number): string[] => {
    const months: string[] = [];
    for (let i = 0; i < 12; i++) {
        const date = new Date(serviceYear - 1, 8 + i, 1);
        months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    }
    return months;
};


export const usePioneerData = (now: Date) => {
  const [entries, setEntries] = useState<DailyEntry[]>(() => {
    try {
      const savedEntries = localStorage.getItem('pioneerEntries');
      return savedEntries ? JSON.parse(savedEntries) : [];
    // FIX: Added curly braces to the catch block to correctly scope its content.
    } catch (error) {
      console.error("Failed to parse pioneer entries from localStorage", error);
      return [];
    }
  });
  
  useEffect(() => {
    localStorage.setItem('pioneerEntries', JSON.stringify(entries));
  }, [entries]);

  const currentServiceYear = useMemo(() => getServiceYear(now), [now]);
  const serviceYearMonths = useMemo(() => getServiceYearMonths(currentServiceYear), [currentServiceYear]);

  const addEntry = useCallback((newEntryData: Omit<DailyEntry, 'id'>) => {
    const newEntry: DailyEntry = {
      ...newEntryData,
      id: new Date().toISOString() + Math.random(),
    };
    setEntries(prevEntries => [...prevEntries, newEntry].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  }, []);

  const importEntries = useCallback((importedEntries: DailyEntry[]) => {
    // Basic validation could be added here
    setEntries(importedEntries);
  }, []);

  const clearAllEntries = useCallback(() => {
    setEntries([]);
  }, []);

  const { monthlyTotals, yearlyTotals } = useMemo(() => {
    const newMonthlyTotals: MonthlyTotals = {};
    const newYearlyTotals: YearlyTotals = { hours: 0 };
    
    const serviceYearEntries = entries.filter(entry => {
        // Fix for timezone issue when parsing date string
        const parts = entry.date.split('-').map(Number);
        const entryDate = new Date(parts[0], parts[1] - 1, parts[2]);
        return getServiceYear(entryDate) === currentServiceYear;
    });

    serviceYearEntries.forEach(entry => {
      const monthKey = entry.date.substring(0, 7); // YYYY-MM
      if (!newMonthlyTotals[monthKey]) {
        newMonthlyTotals[monthKey] = { hours: 0 };
      }
      newMonthlyTotals[monthKey].hours += entry.hours;
      
      newYearlyTotals.hours += entry.hours;
    });

    return { monthlyTotals: newMonthlyTotals, yearlyTotals: newYearlyTotals };
  }, [entries, currentServiceYear]);

  return { 
    entries, 
    addEntry, 
    deleteEntry, 
    monthlyTotals, 
    yearlyTotals, 
    currentServiceYear, 
    serviceYearMonths,
    yearlyGoal: YEARLY_GOAL,
    importEntries,
    clearAllEntries,
  };
};