import React, { useMemo, useCallback } from 'react';
import { TaskItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { BackIcon } from './icons/BackIcon';
import { RoutineIcon } from './icons/RoutineIcon';
import { getLocalDateString } from '../lib/utils';
import { TrashIcon } from './icons/TrashIcon';

// --- Start of inner components ---

const getLastNDays = (n: number): Date[] => {
    const dates = [];
    for (let i = 0; i < n; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d);
    }
    return dates.reverse(); // So it's [4 days ago, ..., today]
};

interface RoutineTrackerProps {
    completionHistory: string[];
    onToggleDate: (date: string) => void;
}

const RoutineTracker: React.FC<RoutineTrackerProps> = ({ completionHistory, onToggleDate }) => {
    const last5Days = useMemo(() => getLastNDays(5), []);

    return (
        <div className="flex items-center gap-2 sm:gap-3">
            {last5Days.map(date => {
                const dateString = getLocalDateString(date);
                const isCompleted = completionHistory.includes(dateString);
                const dayInitial = date.toLocaleDateString('en-US', { weekday: 'narrow' });
                const isToday = getLocalDateString(new Date()) === dateString;

                return (
                    <div key={dateString} className="flex flex-col items-center gap-1">
                        <span className={`text-xs font-bold ${isToday ? 'text-brand-primary dark:text-dark-text-primary' : 'text-brand-text-secondary dark:text-dark-text-secondary'}`}>
                            {dayInitial}
                        </span>
                        <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => onToggleDate(dateString)}
                            className="custom-checkbox h-5 w-5"
                            aria-label={`Mark routine as completed for ${date.toLocaleDateString()}`}
                        />
                    </div>
                );
            })}
        </div>
    );
};


interface RoutineItemProps {
    item: TaskItem;
    onUpdate: (item: TaskItem) => void;
    onPermanentDelete: (id: string) => void;
}

const RoutineItem: React.FC<RoutineItemProps> = ({ item, onUpdate, onPermanentDelete }) => {
    const { t } = useLanguage();
    
    const handleToggleDate = useCallback((dateString: string) => {
        const currentHistory = item.completionHistory || [];
        const isCompleted = currentHistory.includes(dateString);
        
        const newHistory = isCompleted
            ? currentHistory.filter(d => d !== dateString)
            : [...currentHistory, dateString];
        
        onUpdate({ ...item, completionHistory: newHistory });
    }, [item, onUpdate]);

    return (
        <div className="group bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-ios transition-all duration-200 border dark:border-dark-border/50 flex items-center justify-between gap-4">
            <p className="text-brand-text-primary dark:text-dark-text-primary font-medium flex-grow pr-4">{item.text}</p>
            <div className="flex items-center gap-4">
                <RoutineTracker completionHistory={item.completionHistory || []} onToggleDate={handleToggleDate} />
                 <button 
                    title={t('deletePermanently')}
                    onClick={() => onPermanentDelete(item.id)} 
                    className="opacity-0 group-hover:opacity-100 p-2 text-brand-text-secondary dark:text-dark-text-secondary hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-brand-error dark:hover:text-red-400 rounded-lg transition-colors"
                 >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// --- End of inner components ---


interface RoutinePageProps {
  items: TaskItem[];
  onUpdateItem: (item: TaskItem) => void;
  onPermanentDeleteItem: (id: string) => void;
  onNavigateBack: () => void;
}

const RoutinePage: React.FC<RoutinePageProps> = ({ items, onUpdateItem, onPermanentDeleteItem, onNavigateBack }) => {
  const { t } = useLanguage();

  const routineItems = useMemo(() => {
    return items
        .filter(item => item.isRoutine && item.category !== 'IGNORED')
        .sort((a,b) => b.createdAt - a.createdAt);
  }, [items]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-brand-bg dark:bg-dark-bg">
      <header className="relative flex-shrink-0 bg-brand-bg/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-brand-border dark:border-dark-border p-4 flex items-center justify-between z-10">
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

      <main className="flex-grow overflow-y-auto p-4 space-y-3 max-w-4xl mx-auto w-full">
        {routineItems.length > 0 ? (
          routineItems.map(item => (
            <RoutineItem
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onPermanentDelete={onPermanentDeleteItem}
            />
          ))
        ) : (
          <div className="mt-10 text-center text-brand-text-secondary dark:text-dark-text-secondary text-sm h-full flex items-center justify-center p-4 border-2 border-dashed border-brand-border dark:border-dark-border rounded-2xl">
            <p>{t('noRoutinesYet')}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoutinePage;