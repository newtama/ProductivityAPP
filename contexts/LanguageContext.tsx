import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { translations, LANGUAGES, LanguageCode } from '../lib/i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  formatCurrency: (amount: number, options?: Intl.NumberFormatOptions) => string;
  currentLang: typeof LANGUAGES[LanguageCode];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): LanguageCode => {
    if (typeof window !== 'undefined') {
        const storedLang = window.localStorage.getItem('language');
        if (storedLang && storedLang in LANGUAGES) {
            return storedLang as LanguageCode;
        }
        const browserLang = navigator.language.split('-')[0];
        if (browserLang in LANGUAGES) {
            return browserLang as LanguageCode;
        }
    }
    return 'en';
};


export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<LanguageCode>('language', getInitialLanguage());

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    let translation = translations[key]?.[language] || translations[key]?.['en'] || key;
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            translation = translation.replace(`{${rKey}}`, String(replacements[rKey]));
        });
    }
    return translation;
  }, [language]);

  const currentLang = useMemo(() => LANGUAGES[language], [language]);

  const formatCurrency = useCallback((amount: number, options?: Intl.NumberFormatOptions): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: currentLang.currencyCode,
    };
    
    const mergedOptions = {...defaultOptions, ...options};

    // Do not show decimal places for currency formatting by default.
    if (mergedOptions.minimumFractionDigits === undefined && mergedOptions.maximumFractionDigits === undefined) {
        mergedOptions.minimumFractionDigits = 0;
        mergedOptions.maximumFractionDigits = 0;
    }
    
    try {
        const formatter = new Intl.NumberFormat(language, mergedOptions);
        let formatted = formatter.format(amount);
        
        // Add a space after Rp for Indonesian locale for better readability.
        if (language === 'id') {
            formatted = formatted.replace('Rp', 'Rp ');
        }

        return formatted;
    } catch (e) {
        console.warn(`Could not format currency for locale ${language}`, e);
        // Fallback for unsupported locales
        const maxDigits = mergedOptions.maximumFractionDigits ?? 0;
        const formattedAmount = amount.toFixed(maxDigits);

        let parts = formattedAmount.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Fallback to comma grouping
        const finalAmount = parts.join('.'); // Fallback to dot decimal
        
        if (language === 'ar') {
            return `${finalAmount} ${currentLang.currency}`;
        }

        // Add space for Indonesian in fallback as well.
        const prefix = (language === 'id' && currentLang.currency === 'Rp') 
            ? 'Rp ' 
            : currentLang.currency;
            
        return `${prefix}${finalAmount}`;
    }
  }, [language, currentLang]);

  const value = {
    language,
    setLanguage,
    t,
    formatCurrency,
    currentLang,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};