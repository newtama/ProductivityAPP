import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { TaskItem, ActionPlan, ActionPlanItem, ReflectionData, SurveyAnswers, Vision } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import ActionPlanDisplay from './ActionPlanDisplay';
import EditableText from './EditableText';
import { useLanguage } from '../contexts/LanguageContext';
import { FolderIcon } from './icons/FolderIcon';
import { Page } from './Navigation';
import { AIIcon } from './icons/AIIcon';
import { PlusIcon } from './icons/PlusIcon';
import { ReflectionIcon } from './icons/ReflectionIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { getSurveyQuestions } from './ReflectionPage';
import { VisionIcon } from './icons/VisionIcon';


interface HomePageProps {
  visions: Vision[];
  theOneThing: TaskItem | null;
  onUpdateItem: (item: TaskItem) => void;
  oneThingHistory: Array<{date: string; task: TaskItem; reflection?: ReflectionData}>;
  hourlyRate: number;
  onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ visions, theOneThing, onUpdateItem, oneThingHistory, hourlyRate, onNavigate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, language, currentLang } = useLanguage();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  const surveyQuestions = useMemo(() => getSurveyQuestions(t), [t]);
  const surveyQuestionMap = useMemo(() =>
    surveyQuestions.reduce((acc, q) => {
        acc[q.key] = q.question;
        return acc;
    }, {} as Record<keyof SurveyAnswers, string>),
  [surveyQuestions]);

  const oneMonthVision = useMemo(() => {
    return visions.find(v => v.horizon === '1m');
  }, [visions]);

  const formatReflection = (reflection: ReflectionData) => {
    const surveyLines = Object.entries(reflection.survey)
        .filter(([, answer]) => answer && typeof answer === 'string' && answer.trim() !== '')
        .map(([key, answer]) => {
            const question = surveyQuestionMap[key as keyof SurveyAnswers];
            if (question) {
                 return `Q: ${question}\nA: ${answer}`;
            }
            return null;
        }).filter(Boolean).join('\n\n');

    let result = surveyLines;

    if (reflection.notes) {
        if (result) {
            result += `\n\n---\n\n`;
        }
        result += `Notes:\n${reflection.notes}`;
    }
    return result;
  };

  // Filtered history based on dateFilter
  const filteredHistory = useMemo(() => {
    if (!dateFilter) return oneThingHistory;
    return oneThingHistory.filter(entry => entry.date === dateFilter);
  }, [dateFilter, oneThingHistory]);


  const handleGeneratePlan = async () => {
    if (!theOneThing) return;

    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are a world-class productivity coach and strategist. My "one thing" - my most important idea - is: "${theOneThing.text}".

        Your goal is to help me achieve this goal effectively. I need a comprehensive, step-by-step action plan.

        Please select and apply the BEST and most PROVEN productivity framework (like GTD, SMART goals, etc.) that is perfectly suited for this specific idea.

        Then, generate a list of 9 concrete, sequential, and actionable steps. Each step MUST be a single, concise sentence.
        
        IMPORTANT: Your entire response must be in ${currentLang.name}.

        Structure your response exactly like this, using the translated terms for your response language, with markdown for the list:

        **${t('framework')}:** [Name of the framework you chose]

        **${t('checklist')}:**
        - [Concise, sequential, step 1]
        - [Concise, sequential, step 2]
        - [Concise, sequential, step 3]
        - [Concise, sequential, step 4]
        - [Concise, sequential, step 5]
        - [Concise, sequential, step 6]
        - [Concise, sequential, step 7]
        - [Concise, sequential, step 8]
        - [Concise, sequential, step 9]
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const planText = response.text;

      const frameworkRegex = new RegExp(`\\*\\*${t('framework')}:\\*\\*\\s*(.*)`);
      const keyActionsRegex = new RegExp(`\\*\\*${t('checklist')}:\\*\\*\\s*([\\s\\S]*)`);

      const frameworkMatch = planText.match(frameworkRegex);
      const framework = frameworkMatch ? frameworkMatch[1].trim() : undefined;

      const keyActionsMatch = planText.match(keyActionsRegex);
      const keyActionsText = keyActionsMatch ? keyActionsMatch[1].trim() : '';
      const keyActions = keyActionsText.split('\n').map(action => ({ id: crypto.randomUUID(), text: action.replace(/^- /, '').trim(), completed: false })).filter(a => a.text);
      
      const newActionPlan: ActionPlan = { framework, keyActions };

      onUpdateItem({ ...theOneThing, actionPlan: newActionPlan });


    } catch (e) {
      console.error(e);
      setError(t('suggestionError'));
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleAddMoreSteps = async () => {
    if (!theOneThing || !theOneThing.actionPlan) return;

    setIsAdding(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const existingSteps = theOneThing.actionPlan.keyActions.map(a => `- ${a.text}`).join('\n');

      const prompt = `
You are a world-class productivity coach. My "one thing" is: "${theOneThing.text}".

Here is my current action plan, based on the ${theOneThing.actionPlan.framework} framework:
${existingSteps}

Your task is to add 3 more sequential and actionable steps to continue this plan.

IMPORTANT:
- Each new step MUST be a single, concise sentence.
- Your entire response must be in ${currentLang.name}.
- Only output the new steps as a markdown list. Do not add any other text, titles, or explanations. For example:
- [New step 1]
- [New step 2]
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const newStepsText = response.text;
      const newActions = newStepsText.split('\n')
        .map(action => ({ id: crypto.randomUUID(), text: action.replace(/^- /, '').trim(), completed: false }))
        .filter(a => a.text);

      if (newActions.length === 0) {
        return;
      }

      const updatedPlan: ActionPlan = {
        ...theOneThing.actionPlan,
        keyActions: [...theOneThing.actionPlan.keyActions, ...newActions],
      };

      onUpdateItem({ ...theOneThing, actionPlan: updatedPlan });
    } catch (e) {
      console.error(e);
      setError(t('suggestionError'));
    } finally {
      setIsAdding(false);
    }
  };


  const handleToggleActionItem = (id: string) => {
    if (!theOneThing || !theOneThing.actionPlan) return;

    const newKeyActions = theOneThing.actionPlan.keyActions.map(action => 
        action.id === id ? { ...action, completed: !action.completed } : action
    );

    const updatedPlan: ActionPlan = {
        ...theOneThing.actionPlan,
        keyActions: newKeyActions
    };

    onUpdateItem({ ...theOneThing, actionPlan: updatedPlan });
  };
  
  const handleAddActionItem = (text: string) => {
    if (!theOneThing || !text.trim()) return;

    const newItem: ActionPlanItem = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
    };
    
    const currentPlan = theOneThing.actionPlan || { keyActions: [] };

    const updatedPlan: ActionPlan = {
      ...currentPlan,
      keyActions: [...currentPlan.keyActions, newItem],
    };

    onUpdateItem({ ...theOneThing, actionPlan: updatedPlan });
  };

  const handleEditActionItem = (id: string, newText: string) => {
    if (!theOneThing || !theOneThing.actionPlan || !newText.trim()) return;

    const newKeyActions = theOneThing.actionPlan.keyActions.map(action =>
      action.id === id ? { ...action, text: newText } : action
    );

    const updatedPlan: ActionPlan = {
      ...theOneThing.actionPlan,
      keyActions: newKeyActions,
    };

    onUpdateItem({ ...theOneThing, actionPlan: updatedPlan });
  };
  
  const handleDeleteActionItem = (id: string) => {
    if (!theOneThing || !theOneThing.actionPlan) return;
    
    const newKeyActions = theOneThing.actionPlan.keyActions.filter(action => action.id !== id);

    const updatedPlan: ActionPlan = {
      ...theOneThing.actionPlan,
      keyActions: newKeyActions,
    };
    
    onUpdateItem({ ...theOneThing, actionPlan: updatedPlan });
  };

  const formatDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Create a new Date object from the dateString and include the timezone offset
    const targetDate = new Date(dateString + 'T00:00:00');
    
    if (targetDate.getTime() === today.getTime()) {
        return t('today');
    }
    if (targetDate.getTime() === yesterday.getTime()) {
        return t('yesterday');
    }

    // Default formatting for other dates
    return new Intl.DateTimeFormat(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(targetDate);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-slate-50 to-slate-200 dark:from-dark-bg dark:to-black">
      <div className="text-center w-full max-w-2xl mt-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary dark:text-dark-text-primary">{t('yourOneThing')}</h1>
          <p className="text-brand-text-secondary dark:text-dark-text-secondary mt-2 text-lg">{t('dominoEffect')}</p>
        </header>
        <main className="space-y-6">
            {theOneThing ? (
              <>
              <div className="relative">
                <div className="bg-gradient-to-br from-white to-slate-50 dark:from-dark-surface dark:to-dark-elev1/50 rounded-3xl shadow-ios p-8 border border-brand-border dark:border-dark-border/50 text-left">
                  <EditableText
                    initialText={theOneThing.text}
                    onSave={(newText) => onUpdateItem({ ...theOneThing, text: newText })}
                    textClasses="text-2xl md:text-3xl font-semibold text-brand-text-primary dark:text-dark-text-primary"
                    inputClasses="w-full bg-transparent text-2xl md:text-3xl font-semibold text-brand-text-primary dark:text-dark-text-primary border-b-2 border-brand-primary focus:outline-none"
                    placeholder={t('whatIsYourOneThing')}
                  />
                  {oneMonthVision?.text && (
                    <p className="mt-2 text-sm text-brand-text-secondary dark:text-dark-text-secondary">
                        {t('forTheSakeOf')}{' '}
                        <span className="font-semibold italic text-brand-text-primary dark:text-dark-text-primary">{oneMonthVision.text}</span>
                    </p>
                  )}
                </div>
                <div className="absolute bottom-0 end-6 translate-y-1/2 flex items-center gap-3 z-10">
                    <button
                        onClick={() => onNavigate('vision')}
                        className="p-3 rounded-full text-brand-text-secondary dark:text-dark-muted bg-white dark:bg-dark-surface shadow-lg hover:bg-slate-100 dark:hover:bg-dark-elev1 transition-all transform hover:scale-110"
                        aria-label={t('myVision')}
                        title={t('myVision')}
                    >
                        <VisionIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => onNavigate('reflection')}
                        className="p-3 rounded-full text-brand-text-secondary dark:text-dark-muted bg-white dark:bg-dark-surface shadow-lg hover:bg-slate-100 dark:hover:bg-dark-elev1 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={t('dailyReflection')}
                        title={t('dailyReflection')}
                        disabled={!theOneThing}
                    >
                        <ReflectionIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setIsHistoryModalOpen(true)}
                        className="p-3 rounded-full text-brand-text-secondary dark:text-dark-muted bg-white dark:bg-dark-surface shadow-lg hover:bg-slate-100 dark:hover:bg-dark-elev1 transition-all transform hover:scale-110"
                        aria-label={t('history')}
                        title={t('history')}
                    >
                        <FolderIcon className="w-6 h-6" />
                    </button>
                </div>
              </div>

                <ActionPlanDisplay 
                    plan={theOneThing.actionPlan || { keyActions: [] }} 
                    onToggleAction={handleToggleActionItem}
                    onAddAction={handleAddActionItem}
                    onEditAction={handleEditActionItem}
                    onDeleteAction={handleDeleteActionItem}
                />
             
              <div className="text-center pt-2">
                {theOneThing.actionPlan?.framework ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={handleAddMoreSteps}
                      disabled={isGenerating || isAdding}
                      className="h-12 w-full sm:w-auto px-6 bg-brand-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg dark:focus:ring-offset-dark-bg focus:ring-brand-primary dark:shadow-[0_2px_6px_rgba(0,0,0,0.4)] disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {isAdding ? (
                        <>
                          <SpinnerIcon className="w-5 h-5" />
                          <span>{t('adding')}</span>
                        </>
                      ) : (
                        <>
                          <PlusIcon className="w-5 h-5" />
                          <span>{t('addMore')}</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleGeneratePlan}
                      disabled={isGenerating || isAdding}
                      className="h-12 w-full sm:w-auto px-6 bg-slate-200 hover:bg-slate-300 dark:bg-dark-elev1 dark:hover:bg-dark-surface text-brand-text-primary dark:text-dark-text-primary font-semibold py-3 rounded-xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg dark:focus:ring-offset-dark-bg focus:ring-slate-400 disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <SpinnerIcon className="w-5 h-5" />
                          <span>{t('recreating')}</span>
                        </>
                      ) : (
                        <>
                          <AIIcon className="w-5 h-5" />
                          <span>{t('recreate')}</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={handleGeneratePlan}
                      disabled={isGenerating || isAdding}
                      className="h-12 w-full sm:w-auto px-6 bg-brand-primary hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg dark:focus:ring-offset-dark-bg focus:ring-brand-primary dark:shadow-[0_2px_6px_rgba(0,0,0,0.4)] disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <SpinnerIcon className="w-5 h-5" />
                          <span>{t('generating')}</span>
                        </>
                      ) : (
                         <>
                          <AIIcon className="w-5 h-5" />
                          <span>{t('generateActionPlan')}</span>
                         </>
                      )}
                    </button>
                  </div>
                )}
                {error && <p className="text-brand-error mt-4 text-sm">{error}</p>}
              </div>
              </>
            ) : (
              <div className="text-center bg-white/50 dark:bg-dark-surface/50 rounded-2xl p-8 border-2 border-dashed border-brand-border dark:border-dark-border">
                <h2 className="text-xl font-semibold text-brand-text-primary dark:text-dark-text-primary">{t('noOneThing')}</h2>
                <p className="text-brand-text-secondary dark:text-dark-text-secondary mt-2">
                  {t('goToIdeas')}
                </p>
              </div>
            )}
        </main>
      </div>

       {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={() => setIsHistoryModalOpen(false)}>
            <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-ios p-6 w-full max-w-md flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold text-brand-text-primary dark:text-dark-text-primary flex items-center">
                        <FolderIcon className="w-6 h-6 me-2 text-brand-text-secondary dark:text-dark-text-secondary"/> {t('history')}
                    </h2>
                    <button onClick={() => setIsHistoryModalOpen(false)} className="text-brand-text-secondary dark:text-dark-text-secondary text-2xl leading-none">&times;</button>
                </div>
                
                <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                    <div className="relative flex-grow">
                         <CalendarIcon className="w-5 h-5 absolute top-1/2 -translate-y-1/2 start-3 text-brand-text-secondary dark:text-dark-text-secondary pointer-events-none z-10" />
                         <input 
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full h-10 ps-10 pe-3 bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-dark-surface transition duration-200"
                         />
                    </div>
                    {dateFilter && (
                         <button onClick={() => setDateFilter('')} className="text-sm font-semibold text-brand-primary dark:text-dark-text-primary hover:underline">
                            {t('clearFilter')}
                         </button>
                    )}
                </div>

                <div className="overflow-y-auto space-y-4 flex-grow pe-2">
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map(entry => (
                            <div key={entry.date}>
                                <h3 className="font-semibold text-brand-text-secondary dark:text-dark-text-secondary text-sm mb-1">{formatDate(entry.date)}</h3>
                                <p className="bg-slate-100 dark:bg-dark-elev1 p-3 rounded-xl text-brand-text-primary dark:text-dark-text-primary">{entry.task.text}</p>
                                {entry.reflection && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-sm font-semibold text-brand-primary dark:text-dark-text-secondary select-none">{t('viewReflection')}</summary>
                                        <p className="mt-1 p-3 bg-slate-50 dark:bg-dark-elev1/50 rounded-lg text-sm text-brand-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap leading-relaxed">{formatReflection(entry.reflection)}</p>
                                    </details>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-brand-text-secondary dark:text-dark-text-secondary text-sm h-full flex items-center justify-center p-4 border-2 border-dashed border-brand-border dark:border-dark-border rounded-2xl">
                            <p>{t('noHistory')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
       )}

    </div>
  );
};

export default HomePage;