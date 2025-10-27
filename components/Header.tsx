import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

// Define LogoIcon component inside Header.tsx
const LogoIcon: React.FC = () => (
    <svg width="40" height="40" viewBox="0 0 100 100" className="rounded-lg" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#e7e5e4" />
      <text x="50%" y="55%" dominantBaseline="middle" text-anchor="middle" fontFamily="sans-serif" fontSize="50" fontWeight="bold" fill="#6d28d9">
        JW
      </text>
    </svg>
);


const Header: React.FC = () => {
  const { t } = useLocalization();
  return (
    <header className="bg-stone-100 dark:bg-stone-800 shadow-sm border-b border-black/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <LogoIcon />
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-jw-purple-700 dark:text-jw-purple-400">
                    Pioneer Hours
                </h1>
                <p className="text-sm sm:text-base text-jw-purple-600 dark:text-jw-purple-500">
                    {t('header.subtitle')}
                </p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;