import React, { useState, useMemo, useCallback } from 'react';
import { BackIcon } from './icons/BackIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { ReflectionIcon } from './icons/ReflectionIcon';
import { ReflectionData, SurveyAnswers } from '../types';

interface ReflectionPageProps {
    initialReflectionData?: ReflectionData;
    onSaveReflection: (reflectionData: ReflectionData) => void;
    onNavigateBack: () => void;
}

export const getSurveyQuestions = (t: (key: string) => string) => [
    {
        key: 'satisfaction' as const,
        question: t('reflectionQ1'),
        options: [t('reflectionQ1A1'), t('reflectionQ1A2'), t('reflectionQ1A3')],
    },
    {
        key: 'focusFactor' as const,
        question: t('reflectionQ2'),
        options: [t('reflectionQ2A1'), t('reflectionQ2A2'), t('reflectionQ2A3'), t('reflectionQ2A4'), t('reflectionQ2A5')],
    },
    {
        key: 'improvement' as const,
        question: t('reflectionQ3'),
        options: [t('reflectionQ3A1'), t('reflectionQ3A2'), t('reflectionQ3A3'), t('reflectionQ3A4')],
    },
    {
        key: 'timeWasted' as const,
        question: t('reflectionQ4'),
        options: [t('reflectionQ4A1'), t('reflectionQ4A2'), t('reflectionQ4A3'), t('reflectionQ4A4'), t('reflectionQ4A5')],
    },
    {
        key: 'trigger' as const,
        question: t('reflectionQ5'),
        options: [t('reflectionQ5A1'), t('reflectionQ5A2'), t('reflectionQ5A3'), t('reflectionQ5A4'), t('reflectionQ5A5')],
    },
    {
        key: 'strategy' as const,
        question: t('reflectionQ6'),
        options: [t('reflectionQ6A1'), t('reflectionQ6A2'), t('reflectionQ6A3'), t('reflectionQ6A4')],
    },
];


const ReflectionPage: React.FC<ReflectionPageProps> = ({ initialReflectionData, onSaveReflection, onNavigateBack }) => {
    const { t } = useLanguage();
    const [answers, setAnswers] = useState<SurveyAnswers>(initialReflectionData?.survey || {});
    const [notes, setNotes] = useState(initialReflectionData?.notes || '');
    const [currentStep, setCurrentStep] = useState(0);

    const surveyQuestions = useMemo(() => getSurveyQuestions(t), [t]);

    const totalSteps = surveyQuestions.length + 1; // +1 for notes page
    const progressPercentage = (currentStep / (totalSteps - 1)) * 100;

    const handleNext = useCallback(() => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    }, [currentStep, totalSteps]);

    const handleSave = useCallback(() => {
        onSaveReflection({ survey: answers, notes });
        onNavigateBack();
    }, [answers, notes, onSaveReflection, onNavigateBack]);
    
    const handleAnswerSelect = useCallback((questionKey: keyof SurveyAnswers, answer: string) => {
        setAnswers(prev => ({...prev, [questionKey]: answer}));
        handleNext();
    }, [handleNext]);
    
    const handleCustomClick = useCallback((questionKey: keyof SurveyAnswers) => {
        // Set an empty string to signify custom input is active
        setAnswers(prev => ({...prev, [questionKey]: ''}));
    }, []);
    
    const renderContent = () => {
        if (currentStep < surveyQuestions.length) {
            const { key, question, options } = surveyQuestions[currentStep];
            const currentAnswer = answers[key];
            const isCustomActive = currentAnswer !== undefined && !options.includes(currentAnswer);

            return (
                 <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border w-full">
                    <h2 className="text-lg font-semibold text-brand-text-primary dark:text-dark-text-primary mb-4 text-center">{question}</h2>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {options.map(option => (
                            <button
                                key={option}
                                onClick={() => handleAnswerSelect(key, option)}
                                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 border-2 ${
                                    currentAnswer === option
                                        ? 'bg-brand-primary text-white border-brand-primary'
                                        : 'bg-slate-100 dark:bg-dark-elev1 border-transparent hover:border-slate-300 dark:hover:border-dark-border text-brand-text-secondary dark:text-dark-text-secondary'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                        <button
                            onClick={() => handleCustomClick(key)}
                            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 border-2 ${
                                isCustomActive
                                    ? 'bg-brand-primary text-white border-brand-primary'
                                    : 'bg-slate-100 dark:bg-dark-elev1 border-transparent hover:border-slate-300 dark:hover:border-dark-border text-brand-text-secondary dark:text-dark-text-secondary'
                            }`}
                        >
                            {t('customOption')}
                        </button>
                    </div>
                    {isCustomActive && (
                        <div className="flex items-center gap-3 mt-4">
                            <input
                                type="text"
                                value={currentAnswer}
                                onChange={(e) => setAnswers(prev => ({...prev, [key]: e.target.value}))}
                                placeholder={t('customOption')}
                                className="flex-grow h-12 bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent dark:border-dark-border rounded-xl px-4 text-brand-text-primary dark:text-dark-text-primary dark:placeholder:text-dark-muted focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-dark-surface transition duration-200"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleNext();
                                    }
                                }}
                            />
                             <button
                                onClick={handleNext}
                                className="flex-shrink-0 h-12 px-6 bg-brand-primary hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
                                aria-label={t('nextButton')}
                            >
                                {t('nextButton')}
                            </button>
                        </div>
                    )}
                </div>
            );
        } else {
             return (
                <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border w-full">
                    <h2 className="text-lg font-semibold text-brand-text-primary dark:text-dark-text-primary mb-4 text-center">{t('whatsOnYourMind')}</h2>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={`${t('customOption')} (optional)`}
                        rows={8}
                        className="w-full bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent dark:border-dark-border rounded-xl p-4 text-brand-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-dark-surface transition duration-200"
                    />
                    <button
                        onClick={handleSave}
                        className="w-full mt-4 h-12 bg-brand-accent hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-200"
                    >
                        {t('saveReflection')}
                    </button>
                </div>
            );
        }
    }


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
                    <ReflectionIcon className="w-6 h-6"/>
                    {t('dailyReflection')}
                </h1>
                <div className="w-10 text-sm font-semibold text-brand-text-secondary dark:text-dark-text-secondary">
                    {currentStep + 1}/{totalSteps}
                </div>
            </header>
            
            <div className="w-full bg-slate-200 dark:bg-dark-elev1 h-1 flex-shrink-0">
                <div 
                    className="bg-brand-primary h-1 transition-all duration-300" 
                    style={{ width: `${progressPercentage}%`}}
                ></div>
            </div>

            <main className="flex-grow overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full flex flex-col items-center justify-center">
                {renderContent()}
            </main>
        </div>
    );
};

export default ReflectionPage;