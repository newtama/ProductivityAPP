import React, { useMemo } from 'react';
import { TaskItem } from '../types';
import ItemCard from './ItemCard';
import { useLanguage } from '../contexts/LanguageContext';
import { BackIcon } from './icons/BackIcon';
import { RoutineIcon } from './icons/RoutineIcon';

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
        .filter(item => item.isRoutine && !item.completed && item.category !== 'IGNORED')
        .sort((a,b) => b.createdAt - a.createdAt);
  }, [items]);
  
  const completedRoutines = useMemo(() => {
     return items
        .filter(item => item.isRoutine && item.completed && item.category !== 'IGNORED')
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

      <main className="flex-grow overflow-y-auto p-4 space-y-3">
        {routineItems.length > 0 ? (
          routineItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onPermanentDelete={onPermanentDeleteItem}
            />
          ))
        ) : (
          <div className="text-center text-brand-text-secondary dark:text-dark-text-secondary text-sm h-full flex items-center justify-center p-4 border-2 border-dashed border-brand-border dark:border-dark-border rounded-2xl">
            <p>{t('noRoutinesYet')}</p>
          </div>
        )}
        
        {completedRoutines.length > 0 && (
            <>
                <div className="flex items-center pt-3 pb-1">
                    <div className="flex-grow border-t border-brand-border dark:border-dark-border"></div>
                    <span className="flex-shrink mx-4 text-xs font-semibold text-brand-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{t('completed')}</span>
                    <div className="flex-grow border-t border-brand-border dark:border-dark-border"></div>
                </div>
                {completedRoutines.map(item => (
                     <ItemCard
                      key={item.id}
                      item={item}
                      onUpdate={onUpdateItem}
                      onPermanentDelete={onPermanentDeleteItem}
                    />
                ))}
            </>
        )}
      </main>
    </div>
  );
};

export default RoutinePage;