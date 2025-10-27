import React, { useState, useEffect } from 'react';
import { usePioneerData } from './hooks/usePioneerData';
import { DailyEntry, Page } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import ProgressPage from './pages/ProgressPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const updateDate = () => {
      setNow(new Date());
    };

    // Update when tab becomes visible or window is focused to catch date changes
    document.addEventListener('visibilitychange', updateDate);
    window.addEventListener('focus', updateDate);

    return () => {
      document.removeEventListener('visibilitychange', updateDate);
      window.removeEventListener('focus', updateDate);
    };
  }, []);

  const {
    entries,
    addEntry,
    monthlyTotals,
    yearlyTotals,
    yearlyGoal,
    serviceYearMonths,
    currentServiceYear,
    importEntries,
    clearAllEntries,
  } = usePioneerData(now);

  const [activePage, setActivePage] = useState<Page>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleAddEntry = (entry: Omit<DailyEntry, 'id'>) => {
    addEntry(entry);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage 
                  entries={entries} 
                  onAddEntry={handleAddEntry} 
                  monthlyTotals={monthlyTotals} 
                  yearlyTotals={yearlyTotals} 
                />;
      case 'progress':
        return <ProgressPage 
                  yearlyTotals={yearlyTotals} 
                  yearlyGoal={yearlyGoal} 
                  monthlyTotals={monthlyTotals} 
                />;
      case 'history':
        return <HistoryPage 
                  monthlyTotals={monthlyTotals} 
                  serviceYearMonths={serviceYearMonths} 
                  currentServiceYear={currentServiceYear} 
                />;
      case 'settings':
        return <SettingsPage 
                  entries={entries} 
                  onImport={importEntries} 
                  onClear={clearAllEntries}
                  currentTheme={theme}
                  onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                />;
      default:
        return <HomePage entries={entries} onAddEntry={handleAddEntry} monthlyTotals={monthlyTotals} yearlyTotals={yearlyTotals} />;
    }
  }

  return (
    <div className="h-screen flex flex-col bg-stone-100 dark:bg-[#1e1e1e] font-sans text-stone-800 dark:text-stone-200">
      <Header />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl w-full mx-auto px-4 pt-6 pb-20">
          {renderPage()}
        </div>
      </main>

      <BottomNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
};

export default App;