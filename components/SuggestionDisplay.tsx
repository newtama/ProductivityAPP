

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SuggestionDisplayProps {
  suggestion: string;
}

const SuggestionDisplay: React.FC<SuggestionDisplayProps> = ({ suggestion }) => {
  // FIX: Destructure only the necessary values from useLanguage. `translations` is not available.
  const { t } = useLanguage();

  const oneThingMarker = t('suggestionOneThing');
  const whyMattersMarker = t('whyItMatters');
  const streamlineMarker = t('streamlineList');
  const automateMarker = t('automate');
  const delegateMarker = t('delegate');
  const noneIdentifiedMarker = t('noneIdentified');
  
  const oneThingRegex = new RegExp(`\\*\\*${oneThingMarker}:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*${whyMattersMarker}:\\*\\*|\\*\\*${streamlineMarker}:\\*\\*|$)`);
  const oneThingMatch = suggestion.match(oneThingRegex);
  const oneThing = oneThingMatch ? oneThingMatch[1].trim() : null;

  const whyMattersRegex = new RegExp(`\\*\\*${whyMattersMarker}:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*${streamlineMarker}:\\*\\*|$)`);
  const whyMattersMatch = suggestion.match(whyMattersRegex);
  const whyMatters = whyMattersMatch ? whyMattersMatch[1].trim() : null;
  
  const automateRegex = new RegExp(`-\\s*\\*\\*${automateMarker}\\*\\*:\\s*([\\s\\S]*?)(?=-\\s*\\*\\*${delegateMarker}\\*\\*:|$)`, 'i');
  const automateMatch = suggestion.match(automateRegex);
  const automateText = automateMatch ? automateMatch[1].trim().replace(/\.$/, '') : null;
  
  const delegateRegex = new RegExp(`-\\s*\\*\\*${delegateMarker}\\*\\*:\\s*([\\s\\S]*)`, 'i');
  const delegateMatch = suggestion.match(delegateRegex);
  const delegateText = delegateMatch ? delegateMatch[1].trim().replace(/\.$/, '') : null;

  const hasStreamlineSuggestions = (automateText && automateText !== noneIdentifiedMarker) || (delegateText && delegateText !== noneIdentifiedMarker);

  return (
    <div className="text-brand-text-secondary dark:text-dark-text-secondary font-sans space-y-5 p-1">
      {oneThing && (
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-brand-text-secondary dark:text-dark-text-secondary mb-2">{t('suggestionOneThing')}</h3>
          <p className="text-lg text-brand-text-primary dark:text-dark-text-primary bg-slate-100 dark:bg-dark-elev1 p-3 rounded-xl border border-brand-border dark:border-dark-border">{oneThing}</p>
        </div>
      )}
      {whyMatters && (
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-brand-text-secondary dark:text-dark-text-secondary mb-2">{t('whyItMatters')}</h3>
          <p className="text-base leading-relaxed">{whyMatters}</p>
        </div>
      )}
      
      {(automateText || delegateText) && (
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-brand-text-secondary dark:text-dark-text-secondary mb-2">{t('streamlineList')}</h3>
          {hasStreamlineSuggestions ? (
             <ul className="space-y-2">
              {automateText && automateText !== noneIdentifiedMarker && (
                <li className="flex items-start">
                  <span className="font-semibold text-brand-text-primary dark:text-dark-text-primary w-24 flex-shrink-0">{t('automate')}:</span>
                  <span>{automateText}</span>
                </li>
              )}
              {delegateText && delegateText !== noneIdentifiedMarker && (
                <li className="flex items-start">
                  <span className="font-semibold text-brand-text-primary dark:text-dark-text-primary w-24 flex-shrink-0">{t('delegate')}:</span>
                  <span>{delegateText}</span>
                </li>
              )}
            </ul>
          ) : (
             <p className="text-sm italic">{t('noStreamline')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestionDisplay;