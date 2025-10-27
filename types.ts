export interface DailyEntry {
  id: string;
  date: string; // YYYY-MM-DD
  hours: number;
}

export interface MonthlyTotals {
  [key: string]: { // key is YYYY-MM
    hours: number;
  };
}

export interface YearlyTotals {
    hours: number;
}

export type Page = 'home' | 'progress' | 'history' | 'settings';