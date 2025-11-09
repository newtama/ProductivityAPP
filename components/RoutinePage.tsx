
import React, { useMemo, useCallback } from 'react';
import { TaskItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { BackIcon } from './icons/BackIcon';
import { RoutineIcon } from './icons/RoutineIcon';
import { getLocalDateString } from '../lib/utils';

// Helper to get last N days, from oldest to newest.
const getLastNDays = (n: number): Date[] => {
    const dates = [];
    for (let i = 0; i < n; i++) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - (n - 1 - i));
        dates.push(d);
    }
    return dates;
};

interface RoutinePageProps {
  items: TaskItem[];
  onUpdateItem: (item: TaskItem) => void;
  onPermanentDeleteItem: (id: string) => void;
  onNavigateBack: () => void;
}

const RoutinePage: React.FC<RoutinePageProps> = ({ items, onUpdateItem, onPermanentDeleteItem, onNavigateBack }) => {
  const { t, language } = useLanguage();

  const routineItems = useMemo(() => {
    return items
        .filter(item => item.isRoutine && item.category !== 'IGNORED')
        .sort((a,b) => b.createdAt - a.createdAt);
  }, [items]);

  const last5Days = useMemo(() => getLastNDays(5), []);

  const handleToggleDate = useCallback((item: TaskItem, dateString: string) => {
      const currentHistory = item.completionHistory || [];
      const isCompleted = currentHistory.includes(dateString);

      const newHistory = isCompleted
          ? currentHistory.filter(d => d !== dateString)
          : [...currentHistory, dateString];

      onUpdateItem({ ...item, completionHistory: newHistory });
  }, [onUpdateItem]);


  return (
    <div className="flex flex-col h-screen overflow-hidden bg-brand-bg dark:bg-dark-bg">
      <header className="relative flex-shrink-0 bg-brand-bg/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-brand-border dark:border-dark-border p-4 flex items-center justify-between z-20">
        <button
          onClick={onNavigateBack}
          className="text-brand-text-secondary dark:text-dark-text-secondary hover:text-brand-text-primary dark:hover:text-dark-text-primary transition-colors p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-dark-elev1/60"
          aria-label="Back to Home"
        >
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-brand-text-primary dark:text-dark-text-primary text-center absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <RoutineIcon className="w-6 h-6" />
            {t('routines')}
        </h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {routineItems.length > 0 ? (
            <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-ios border dark:border-dark-border/50 overflow-x-auto no-scrollbar">
              <table className="w-full border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-brand-border dark:border-dark-border">
                    <th className="p-4 text-left font-semibold text-sm text-brand-text-secondary dark:text-dark-text-secondary sticky left-0 bg-white dark:bg-dark-surface z-10 w-2/5">{/* Intentionally blank for alignment */}</th>
                    {last5Days.map(day => (
                      <th key={day.toISOString()} className="p-2 text-center font-semibold text-sm text-brand-text-secondary dark:text-dark-text-secondary w-[12%]">
                        <div>{day.toLocaleDateString(language, { weekday: 'short' }).toUpperCase()}</div>
                        <div className="text-xs font-normal">{day.getDate()}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                    {routineItems.map(item => (
                        <tr key={item.id} className="border-b border-brand-border dark:border-dark-border last:border-b-0">
                          <td className="p-4 sticky left-0 bg-white dark:bg-dark-surface z-10">
                            <p className="font-semibold text-brand-text-primary dark:text-dark-text-primary pr-2">{item.text}</p>
                          </td>
                          {last5Days.map(day => {
                            const dateString = getLocalDateString(day);
                            const isCompleted = item.completionHistory?.includes(dateString);
                            const today = new Date();
                            today.setHours(0,0,0,0);
                            const isPast = day.getTime() < today.getTime();

                            return (
                              <td key={dateString} className="p-2 text-center align-middle">
                                <button 
                                    onClick={() => handleToggleDate(item, dateString)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-colors duration-200 mx-auto ${
                                        isCompleted 
                                        ? 'bg-brand-primary text-white'
                                        : 'bg-slate-100 dark:bg-dark-elev1 text-slate-400 dark:text-dark-muted hover:bg-slate-200 dark:hover:bg-dark-border'
                                    }`}
                                    aria-label={`Toggle routine ${item.text} for ${dateString}`}
                                >
                                  {isCompleted ? '✓' : (isPast ? '✕' : '')}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-10 text-center text-brand-text-secondary dark:text-dark-text-secondary text-sm h-full flex items-center justify-center p-4 border-2 border-dashed border-brand-border dark:border-dark-border rounded-2xl">
              <p>{t('noRoutinesYet')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RoutinePage;
