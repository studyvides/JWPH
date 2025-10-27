import React, { useRef } from 'react';
import { DailyEntry } from '../types';
import { useLocalization } from '../hooks/useLocalization';

interface SettingsPageProps {
  entries: DailyEntry[];
  onImport: (entries: DailyEntry[]) => void;
  onClear: () => void;
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ entries, onImport, onClear, currentTheme, onToggleTheme }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, language, setLanguage } = useLocalization();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `pioneer_hours_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File could not be read");
        const importedEntries = JSON.parse(text);
        if (Array.isArray(importedEntries)) {
          onImport(importedEntries);
          alert(t('settings.importSuccess'));
        } else {
          throw new Error('Invalid backup file format');
        }
      } catch (err) {
        console.error("Failed to import data:", err);
        alert(t('settings.importError'));
      }
    };
    reader.readAsText(file);
    event.target.value = ''; 
  };

  const handleClearData = () => {
    if (window.confirm(t('settings.clearConfirm'))) {
      onClear();
      alert(t('settings.clearSuccess'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#2c2c2c] p-6 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
        <h3 className="text-xl font-bold text-stone-700 dark:text-stone-200">{t('settings.title')}</h3>
      </div>
      
      <div className="bg-white dark:bg-[#2c2c2c] p-6 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
          <h4 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-4">{t('settings.appearance')}</h4>
          <div className="flex items-center justify-between mb-6">
              <span className="text-stone-600 dark:text-stone-400">{t('settings.darkTheme')}</span>
              <button onClick={onToggleTheme} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${currentTheme === 'dark' ? 'bg-jw-purple-700' : 'bg-stone-300'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentTheme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
          </div>
           <div className="flex items-center justify-between">
              <label htmlFor="language-select" className="text-stone-600 dark:text-stone-400">{t('settings.language')}</label>
              <select 
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 px-3 py-1 rounded-md border border-stone-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-jw-purple-500"
              >
                  <option value="it">Italiano</option>
                  <option value="en">English</option>
              </select>
          </div>
      </div>
      
      <div className="bg-white dark:bg-[#2c2c2c] p-6 rounded-xl shadow-sm border border-black/5 dark:border-white/5">
        <h4 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-4">{t('settings.dataManagement')}</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
            <button onClick={handleExport} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-jw-purple-700 dark:text-jw-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{t('settings.createBackup')}</span>
            </button>
            <button onClick={handleImportClick} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-jw-purple-700 dark:text-jw-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{t('settings.importBackup')}</span>
            </button>
            <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button onClick={handleClearData} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-stone-100 dark:bg-white/5 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-sm font-medium text-red-600 dark:text-red-500">{t('settings.clearData')}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;