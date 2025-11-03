import React, { useMemo, useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { TaskItem, Category } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { AIIcon } from './icons/AIIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
// FIX: Import ChecklistIcon to resolve 'Cannot find name' error.
import { ChecklistIcon } from './icons/ChecklistIcon';
// FIX: Import StarIcon to resolve 'Cannot find name' error.
import { StarIcon } from './icons/StarIcon';
import { useAnalytics } from '../hooks/useAnalytics';

interface AnalyticsPageProps {
  oneThingHistory: Array<{date: string; task: TaskItem}>;
  hourlyRate: number;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ oneThingHistory, hourlyRate }) => {
  const { t, formatCurrency, currentLang } = useLanguage();
  const [isThinking, setIsThinking] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { weeklyData, trendData, focusData } = useAnalytics(oneThingHistory, hourlyRate);


  const handleGenerateInsight = async () => {
      setIsThinking(true);
      setError(null);
      setInsight(null);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const dataSummary = `
          - Weekly Success Rate: ${weeklyData.successRate.toFixed(0)}%
          - Weekly Focus Days: ${weeklyData.totalFocusDays}
          - Weekly Actions Completed: ${weeklyData.completedActions}
          - Performance Trend (success rate last 4 weeks): ${trendData.map(d => `${d.label}: ${d.value.toFixed(0)}%`).join(', ')}
          - Focus Breakdown (task counts): ${focusData.map(d => `${d.label}: ${d.value}`).join(', ')}
        `;

        const prompt = `You are a world-class productivity coach. Here is my performance data summary:\n${dataSummary}\nBased on this data, analyze my performance. Your entire response must be in ${currentLang.name}. Structure your response exactly like this, using markdown:\n\n**[Your positive reinforcement here, 1 sentence]**\n\n**[Your single, most impactful, actionable suggestion for improvement here, 1-2 sentences]**`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        setInsight(response.text);

      } catch (e) {
        console.error(e);
        setError(t('suggestionError'));
      } finally {
        setIsThinking(false);
      }
  };

  const StatCard: React.FC<{label: string, value: string, icon: React.ReactNode}> = ({ label, value, icon }) => (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl flex items-center space-x-4 shadow-sm border dark:border-dark-border/50">
        <div className="bg-slate-100 dark:bg-dark-elev1 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-brand-text-secondary dark:text-dark-text-secondary">{label}</p>
            <p className="text-xl font-bold text-brand-text-primary dark:text-dark-text-primary">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-brand-bg dark:bg-dark-bg min-h-screen">
      <header className="mb-8 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-text-primary dark:text-dark-text-primary">{t('analytics')}</h1>
      </header>
      
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Weekly Overview */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border">
          <h2 className="text-xl font-semibold text-brand-text-primary dark:text-dark-text-primary mb-4">{t('weeklyOverview')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-dark-elev1 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                  <div className="relative w-28 h-28">
                       <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path className="text-slate-200 dark:text-dark-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8"></path>
                          <path className="text-brand-accent"
                              strokeDasharray={`${weeklyData.successRate}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" transform="rotate(-90 18 18)"
                          ></path>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold text-brand-text-primary dark:text-dark-text-primary">{weeklyData.successRate.toFixed(0)}<span className="text-xl">%</span></span>
                      </div>
                  </div>
                  <p className="text-sm font-semibold mt-2 text-brand-text-secondary dark:text-dark-text-secondary">{t('weeklySuccessRate')}</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 <StatCard label={t('focusDays')} value={`${weeklyData.totalFocusDays} / 7`} icon={<ChecklistIcon className="w-6 h-6 text-brand-primary"/>} />
                 <StatCard label={t('completedActions')} value={`${weeklyData.completedActions}`} icon={<StarIcon isSelected className="w-6 h-6 text-yellow-500"/>} />
              </div>
              <div className="sm:col-span-2">
                 <StatCard label={t('potentialWeeklyValue')} value={formatCurrency(weeklyData.potentialValue)} icon={<span className="text-2xl">💰</span>} />
              </div>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border">
          <h2 className="text-xl font-semibold text-brand-text-primary dark:text-dark-text-primary mb-1">{t('performanceTrend')}</h2>
          <p className="text-sm text-brand-text-secondary dark:text-dark-text-secondary mb-4">{t('last4Weeks')}</p>
          <div className="h-48">
            <BarChart data={trendData} />
          </div>
        </div>

        {/* Focus Breakdown */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border">
          <h2 className="text-xl font-semibold text-brand-text-primary dark:text-dark-text-primary mb-1">{t('focusBreakdown')}</h2>
          <p className="text-sm text-brand-text-secondary dark:text-dark-text-secondary mb-4">{t('basedOnOneThing')}</p>
          <div className="h-48">
            <DonutChart data={focusData} />
          </div>
        </div>
        
        {/* AI Insights */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border">
          <h2 className="text-xl font-semibold text-brand-text-primary dark:text-dark-text-primary mb-4">{t('aiPoweredInsights')}</h2>
          {insight ? (
            <div className="p-4 bg-slate-100 dark:bg-dark-elev1 rounded-xl space-y-2 text-brand-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap">
              {insight.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          ) : (
            <button
                onClick={handleGenerateInsight}
                disabled={isThinking}
                className="w-full h-12 bg-brand-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-surface focus:ring-brand-primary disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isThinking ? <SpinnerIcon className="w-5 h-5"/> : <AIIcon className="w-5 h-5"/>}
                <span>{isThinking ? t('generating') : t('generateInsights')}</span>
            </button>
          )}
           {error && <p className="text-sm text-brand-error mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;