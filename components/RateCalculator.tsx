
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageIcon } from './icons/LanguageIcon';
import { LANGUAGES, LanguageCode } from '../lib/i18n';

interface RateCalculatorProps {
  initialIncome: string;
  onRateSet: (income: string, rate: number) => void;
}

const WORKING_WEEKS_PER_YEAR = 50;
const WORKING_HOURS_PER_WEEK = 40;

const RateCalculator: React.FC<RateCalculatorProps> = ({ onRateSet, initialIncome }) => {
  const [annualIncome, setAnnualIncome] = useState(initialIncome); // This is the raw string of numbers
  const { t, currentLang, language, setLanguage } = useLanguage();

  const calculateRate = () => {
    // annualIncome is the raw numeric string, so parseFloat is correct.
    const income = parseFloat(annualIncome);
    if (isNaN(income) || income <= 0) {
      alert(t('enterValidIncome'));
      return;
    }
    const rate = income / (WORKING_WEEKS_PER_YEAR * WORKING_HOURS_PER_WEEK);
    onRateSet(annualIncome, rate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateRate();
  };
  
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Remove non-digit characters to store only the number.
    const numericValue = rawValue.replace(/[^\d]/g, '');
    setAnnualIncome(numericValue);
  };

  const formattedAnnualIncome = useMemo(() => {
    if (!annualIncome) return '';
    try {
      // Format the number string with locale-specific thousand separators.
      return new Intl.NumberFormat(language).format(Number(annualIncome));
    } catch (e) {
      // Fallback if something goes wrong, though unlikely with the regex guard.
      return annualIncome;
    }
  }, [annualIncome, language]);

  const placeholder = useMemo(() => {
    try {
        return new Intl.NumberFormat(language).format(100000000);
    } catch {
        return '100000000';
    }
  }, [language]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg dark:bg-dark-bg p-4">
      <div className="w-full max-w-md text-center bg-brand-surface dark:bg-dark-surface rounded-3xl shadow-ios p-8 border dark:border-dark-border">
        <h1 className="text-3xl font-bold text-brand-text-primary dark:text-dark-text-primary mb-2">{t('appName')}</h1>
        <p className="text-brand-text-secondary dark:text-dark-text-secondary mb-8">{t('knowYourWorth')}</p>
        
        <div className="mb-8 text-left">
            <label htmlFor="language-select" className="block text-sm font-medium text-brand-text-secondary dark:text-dark-text-secondary mb-2">
                {t('language')}
            </label>
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="annualIncome" className="block text-sm font-medium text-brand-text-secondary dark:text-dark-text-secondary mb-2 text-left">
              {t('targetAnnualIncome')}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-brand-text-secondary dark:text-dark-text-secondary">
                {currentLang.currency}
              </span>
              <input
                type="text"
                inputMode="numeric"
                id="annualIncome"
                value={formattedAnnualIncome}
                onChange={handleIncomeChange}
                placeholder={placeholder}
                className="w-full h-12 ps-12 pe-4 bg-white dark:bg-dark-elev1 border border-brand-border dark:border-dark-border rounded-xl text-brand-text-primary dark:text-dark-text-primary placeholder:text-brand-text-secondary/50 dark:placeholder:text-dark-muted focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-primary transition duration-200"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full h-12 bg-brand-primary hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface dark:focus:ring-offset-dark-surface focus:ring-brand-primary dark:shadow-[0_2px_6px_rgba(0,0,0,0.4)] disabled:opacity-40"
          >
            {t('calculateRate')}
          </button>
        </form>
        <p className="text-xs text-brand-text-secondary dark:text-dark-text-secondary mt-6">
          {t('basedOn', {hours: WORKING_HOURS_PER_WEEK, weeks: WORKING_WEEKS_PER_YEAR})}
        </p>
      </div>
    </div>
  );
};

export default RateCalculator;