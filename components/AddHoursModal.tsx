import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { toLocalDateString } from '../utils';

interface AddHoursModalProps {
  selectedDate: Date;
  onClose: () => void;
  onSave: (data: { date: string; hours: number }) => void;
}

const AddHoursModal: React.FC<AddHoursModalProps> = ({ selectedDate, onClose, onSave }) => {
  const [hours, setHours] = useState('');
  const { t, language } = useLocalization();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const totalHours = parseFloat(hours.replace(',', '.')) || 0;
    if (totalHours > 0) {
      onSave({
        date: toLocalDateString(selectedDate),
        hours: totalHours,
      });
    }
  };
  
  const formattedDate = selectedDate.toLocaleDateString(language, { day: 'numeric', month: 'long' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 z-40 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-[#2c2c2c] rounded-2xl shadow-2xl w-full max-w-sm border border-black/5 dark:border-white/10">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-stone-200 dark:border-white/10">
            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200">
              {t('calendar.addHoursFor', formattedDate)}
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="modal-hours" className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">{t('calendar.hours')}</label>
              <input
                type="number"
                id="modal-hours"
                value={hours}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setHours(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 dark:border-white/20 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-200 rounded-md shadow-sm focus:outline-none focus:ring-jw-purple-500 focus:border-jw-purple-500"
                placeholder={t('calendar.hoursPlaceholder')}
                autoFocus
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="p-4 bg-stone-50 dark:bg-white/5 border-t border-stone-200 dark:border-white/10 flex justify-end items-center gap-3">
            <button type="button" onClick={onClose} className="bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 px-4 py-2 rounded-lg font-semibold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors">
              {t('calendar.cancel')}
            </button>
            <button type="submit" className="bg-jw-purple-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-jw-purple-800 transition-colors">
              {t('calendar.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHoursModal;