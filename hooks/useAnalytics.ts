import { useMemo } from 'react';
import { TaskItem, Category } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { getCategoryFromRating } from '../lib/utils';

export const useAnalytics = (oneThingHistory: Array<{date: string; task: TaskItem}>, hourlyRate: number) => {
  const { t } = useLanguage();

  const weeklyData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const last7DaysHistory = oneThingHistory.filter(entry => {
        const entryDate = new Date(entry.date + 'T00:00:00');
        const diffDays = (today.getTime() - entryDate.getTime()) / (1000 * 3600 * 24);
        return diffDays < 7 && diffDays >= 0;
    });

    const dailySuccessRates = last7DaysHistory.map(entry => {
        const plan = entry.task.actionPlan;
        if (plan && plan.keyActions.length > 0) {
            const completedCount = plan.keyActions.filter(a => a.completed).length;
            return (completedCount / plan.keyActions.length) * 100;
        }
        return 0; // No plan or no actions, 0% success for that day
    });

    const totalFocusDays = last7DaysHistory.length;
    const totalSuccessPercentage = dailySuccessRates.reduce((sum, rate) => sum + rate, 0);
    const successRate = totalFocusDays > 0 ? totalSuccessPercentage / totalFocusDays : 0;

    const completedActions = last7DaysHistory.reduce((sum, entry) => {
        return sum + (entry.task.actionPlan?.keyActions.filter(a => a.completed).length || 0);
    }, 0);

    const potentialValue = last7DaysHistory.reduce((total, entry) => {
        const plan = entry.task.actionPlan;
        let dailySuccessFraction = 0;
        if (plan && plan.keyActions.length > 0) {
            const completedCount = plan.keyActions.filter(a => a.completed).length;
            dailySuccessFraction = completedCount / plan.keyActions.length;
        }
        return total + (dailySuccessFraction * 8 * hourlyRate);
    }, 0);


    return { successRate, totalFocusDays, completedActions, potentialValue };
  }, [oneThingHistory, hourlyRate]);

  const trendData = useMemo(() => {
    const today = new Date();
    const data = [
      { id: 'week1', label: '-4w', value: 0, count: 0 },
      { id: 'week2', label: '-3w', value: 0, count: 0 },
      { id: 'week3', label: '-2w', value: 0, count: 0 },
      { id: 'week4', label: t('today'), value: 0, count: 0 },
    ];
    
    oneThingHistory.forEach(entry => {
      const entryDate = new Date(entry.date + 'T00:00:00');
      const diffWeeks = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 3600 * 24 * 7));
      if (diffWeeks >= 0 && diffWeeks < 4) {
        const weekIndex = 3 - diffWeeks;
        const plan = entry.task.actionPlan;
        if (plan && plan.keyActions.length > 0) {
          data[weekIndex].count++;
          if (plan.keyActions.every(a => a.completed)) {
            data[weekIndex].value++;
          }
        }
      }
    });

    return data.map(d => ({ ...d, value: d.count > 0 ? (d.value / d.count) * 100 : 0 }));
  }, [oneThingHistory, t]);

  const focusData = useMemo(() => {
    const breakdown = {
      [Category.MAKE_MONEY]: 0,
      [Category.INCREASE_RATE]: 0,
      [Category.GIVE_ENERGY]: 0,
    };
    
    const last30DaysHistory = oneThingHistory.slice(0, 30);

    last30DaysHistory.forEach(entry => {
       const category = getCategoryFromRating(entry.task.rating);
       if(category && category in breakdown) {
         breakdown[category]++;
       }
    });
    
    return [
      { label: t('makeMoney'), value: breakdown[Category.MAKE_MONEY], color: 'text-brand-accent' },
      { label: t('increaseRate'), value: breakdown[Category.INCREASE_RATE], color: 'text-brand-primary' },
      { label: t('giveEnergy'), value: breakdown[Category.GIVE_ENERGY], color: 'text-brand-info' },
    ].filter(d => d.value > 0);

  }, [oneThingHistory, t]);

  return { weeklyData, trendData, focusData };
};
