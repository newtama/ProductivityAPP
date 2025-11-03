

import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Theme, IdeasLayout } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageIcon } from './icons/LanguageIcon';
import { LANGUAGES, LanguageCode } from '../lib/i18n';

interface ProfilePageProps {
  hourlyRate: number;
  onReset: () => void;
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
  onResetRate: () => void;
  ideasLayout: IdeasLayout;
  onSetIdeasLayout: (layout: IdeasLayout) => void;
}

// Helper icons for the theme switcher
const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);
const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25c0 5.385 4.365 9.75 9.75 9.75 1.432 0 2.786-.312 4.024-.877Z" />
  </svg>
);
const SystemIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.375 1.5-1.5 1.5 0 0 0-.375.375h-1.5a1.5 1.5 0 0 0-.375-.375 3 3 0 0 1-.375-1.5V17.25m15-3.375v1.007a3 3 0 0 1-.375 1.5-1.5 1.5 0 0 0-.375.375h-1.5a1.5 1.5 0 0 0-.375-.375 3 3 0 0 1-.375-1.5V13.875m-9-3.375v1.007a3 3 0 0 1-.375 1.5-1.5 1.5 0 0 0-.375.375h-1.5a1.5 1.5 0 0 0-.375-.375 3 3 0 0 1-.375-1.5V10.5m15 3.375c-1.33 0-2.597-.266-3.752-.748V10.5a9.753 9.753 0 0 0-4.5-8.25c-5.385 0-9.75 4.365-9.75 9.75 0 1.432.312 2.786.877 4.024" />
  </svg>
);


const ProfilePage: React.FC<ProfilePageProps> = ({ hourlyRate, onReset, theme, onSetTheme, onResetRate, ideasLayout, onSetIdeasLayout }) => {
    const [makeMoneyAnswer, setMakeMoneyAnswer] = useLocalStorage('profile_makeMoney', '');
    const [increaseRateAnswer, setIncreaseRateAnswer] = useLocalStorage('profile_increaseRate', '');
    const [giveEnergyAnswer, setGiveEnergyAnswer] = useLocalStorage('profile_giveEnergy', '');
    const { t, language, setLanguage, formatCurrency } = useLanguage();

    return (
        <div className="p-4 md:p-8 min-h-screen bg-brand-bg dark:bg-dark-bg">
            <header className="mb-8 max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-brand-text-primary dark:text-dark-text-primary">{t('profileAndSettings')}</h1>
            </header>

            <main className="space-y-8 max-w-4xl mx-auto">
                {/* Hourly Rate */}
                <section className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border">
                    <h2 className="font-semibold text-brand-text-secondary dark:text-dark-text-secondary mb-2">{t('yourHourlyRate')}</h2>
                    <div className="flex items-baseline justify-between">
                        <span className="text-4xl font-bold text-brand-text-primary dark:text-dark-text-primary">
                            {formatCurrency(hourlyRate, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            <span className="text-xl font-semibold text-brand-text-secondary dark:text-dark-text-secondary">{t('perHour')}</span>
                        </span>
                        <button onClick={onResetRate} className="font-semibold text-brand-primary dark:text-dark-text-primary hover:underline">
                            {t('change')}
                        </button>
                    </div>
                </section>
                
                {/* Ideas View Setting */}
                <section className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border">
                    <h2 className="font-semibold text-brand-text-secondary dark:text-dark-text-secondary mb-4">Ideas View</h2>
                    <div className="flex bg-slate-100 dark:bg-dark-elev1 rounded-xl p-1 space-x-1">
                        {(['simple', 'categorized'] as IdeasLayout[]).map(layout => (
                            <button
                                key={layout}
                                onClick={() => onSetIdeasLayout(layout)}
                                className={`w-full h-10 rounded-lg text-sm font-semibold transition-all duration-300 ${ideasLayout === layout ? 'bg-white dark:bg-dark-surface shadow' : 'hover:bg-white/50 dark:hover:bg-dark-surface/50'}`}
                            >
                                <span className="capitalize">{layout}</span>
                            </button>
                        ))}
                    </div>
                </section>


                {/* Appearance */}
                <section className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border">
                    <h2 className="font-semibold text-brand-text-secondary dark:text-dark-text-secondary mb-4">{t('appearance')}</h2>
                    <div className="flex bg-slate-100 dark:bg-dark-elev1 rounded-xl p-1 space-x-1">
                        {(['light', 'dark', 'system'] as Theme[]).map(themeOption => (
                            <button
                                key={themeOption}
                                onClick={() => onSetTheme(themeOption)}
                                className={`w-full h-10 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${theme === themeOption ? 'bg-white dark:bg-dark-surface shadow' : 'hover:bg-white/50 dark:hover:bg-dark-surface/50'}`}
                            >
                                {themeOption === 'light' && <SunIcon className="w-5 h-5" />}
                                {themeOption === 'dark' && <MoonIcon className="w-5 h-5" />}
                                {themeOption === 'system' && <SystemIcon className="w-5 h-5" />}
                                <span className="capitalize">{t(themeOption)}</span>
                            </button>
                        ))}
                    </div>
                </section>
                
                {/* Language */}
                <section className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border">
                    <h2 className="font-semibold text-brand-text-secondary dark:text-dark-text-secondary mb-2">{t('language')}</h2>
                     <div className="relative">
                        <LanguageIcon className="w-5 h-5 absolute top-1/2 -translate-y-1/2 start-4 text-brand-text-secondary dark:text-dark-text-secondary pointer-events-none z-10" />
                        <select
                            id="language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                            className="w-full h-12 ps-12 pe-4 bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text-primary focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-dark-surface transition duration-200 appearance-none"
                            aria-label={t('language')}
                        >
                            {(Object.keys(LANGUAGES) as LanguageCode[]).map(langCode => (
                                <option key={langCode} value={langCode}>
                                {LANGUAGES[langCode].nativeName}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-4 text-brand-text-secondary dark:text-dark-text-secondary">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </section>


                {/* AI Tuning */}
                <section className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-ios border dark:border-dark-border space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-brand-text-primary dark:text-dark-text-primary">{t('aiTuning')}</h2>
                        <p className="text-sm text-brand-text-secondary dark:text-dark-text-secondary">{t('aiTuningDesc')}</p>
                    </div>
                    
                    <div className="space-y-4 pt-2">
                        <div>
                            <label className="block text-sm font-semibold text-brand-text-primary dark:text-dark-text-primary mb-1" htmlFor="q1">{t('q1')}</label>
                            <input type="text" id="q1" value={makeMoneyAnswer} onChange={e => setMakeMoneyAnswer(e.target.value)} placeholder={t('q1_placeholder')} className="w-full h-12 bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent dark:border-dark-border rounded-xl px-4 text-brand-text-primary dark:text-dark-text-primary placeholder:text-sm dark:placeholder:text-dark-muted focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-dark-surface transition duration-200" />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-brand-text-primary dark:text-dark-text-primary mb-1" htmlFor="q2">{t('q2')}</label>
                            <input type="text" id="q2" value={increaseRateAnswer} onChange={e => setIncreaseRateAnswer(e.target.value)} placeholder={t('q2_placeholder')} className="w-full h-12 bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent dark:border-dark-border rounded-xl px-4 text-brand-text-primary dark:text-dark-text-primary placeholder:text-sm dark:placeholder:text-dark-muted focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-dark-surface transition duration-200" />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-brand-text-primary dark:text-dark-text-primary mb-1" htmlFor="q3">{t('q3')}</label>
                            <input type="text" id="q3" value={giveEnergyAnswer} onChange={e => setGiveEnergyAnswer(e.target.value)} placeholder={t('q3_placeholder')} className="w-full h-12 bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent dark:border-dark-border rounded-xl px-4 text-brand-text-primary dark:text-dark-text-primary placeholder:text-sm dark:placeholder:text-dark-muted focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-dark-surface transition duration-200" />
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-red-50 dark:bg-red-500/10 p-6 rounded-3xl border border-red-200 dark:border-red-500/20">
                    <h2 className="text-xl font-bold text-red-800 dark:text-red-200">{t('dangerZone')}</h2>
                    <p className="text-sm text-red-600 dark:text-red-300 mt-1 mb-4">{t('resetWarning')}</p>
                    <button onClick={onReset} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto transition-colors">
                        {t('resetAllData')}
                    </button>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
