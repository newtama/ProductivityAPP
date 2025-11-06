
import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { ChecklistIcon } from './icons/ChecklistIcon';
import { ProfileIcon } from './icons/ProfileIcon';
import { AnalyticsIcon } from './icons/AnalyticsIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { RoutineIcon } from './icons/RoutineIcon';
import { CommunityIcon } from './icons/CommunityIcon';

export type Page = 'home' | 'ideas' | 'vision' | 'community' | 'routine' | 'analytics' | 'profile' | 'reflection';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { t } = useLanguage();
  
  const navItems = [
    { page: 'home' as Page, label: t('home'), icon: HomeIcon },
    { page: 'ideas' as Page, label: t('ideas'), icon: ChecklistIcon },
    { page: 'community' as Page, label: t('community'), icon: CommunityIcon },
    { page: 'analytics' as Page, label: t('analytics'), icon: AnalyticsIcon },
    { page: 'profile' as Page, label: t('profile'), icon: ProfileIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg border-t border-brand-border dark:border-dark-border z-30">
      <div className="flex justify-around max-w-4xl mx-auto h-20">
        {navItems.map(({ page, label, icon: Icon }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex-1 flex flex-col items-center justify-center pt-3 pb-2 px-1 text-sm font-medium transition-colors duration-200 focus:outline-none ${
                isActive ? 'text-brand-primary dark:text-dark-text-primary' : 'text-brand-text-secondary dark:text-dark-text-secondary hover:text-brand-text-primary dark:hover:text-dark-text-primary'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;