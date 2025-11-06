import React from 'react';
import { Vision, VisionHorizon } from '../types';
import VisionCard from './VisionCard';
import { useLanguage } from '../contexts/LanguageContext';
import { BackIcon } from './icons/BackIcon';

interface VisionPageProps {
  visions: Vision[];
  onUpdateVisions: (visions: Vision[]) => void;
  onNavigateBack: () => void;
}

const VisionPage: React.FC<VisionPageProps> = ({ visions, onUpdateVisions, onNavigateBack }) => {
    const { t } = useLanguage();

    const horizons: { horizon: VisionHorizon; titleKey: string; promptKey: string; }[] = [
        { horizon: '5y', titleKey: 'vision5y', promptKey: 'visionPrompt5y' },
        { horizon: '1y', titleKey: 'vision1y', promptKey: 'visionPrompt1y' },
        { horizon: '3m', titleKey: 'vision3m', promptKey: 'visionPrompt3m' },
        { horizon: '1m', titleKey: 'vision1m', promptKey: 'visionPrompt1m' },
    ];
    
    const handleUpdateVision = (updatedVision: Vision) => {
        const existingIndex = visions.findIndex(v => v.horizon === updatedVision.horizon);
        let newVisions;
        if (existingIndex > -1) {
            newVisions = [...visions];
            newVisions[existingIndex] = updatedVision;
        } else {
            newVisions = [...visions, updatedVision];
        }
        onUpdateVisions(newVisions);
    };

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
                <div className="text-center absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-xl md:text-2xl font-bold text-brand-text-primary dark:text-dark-text-primary">{t('visionTitle')}</h1>
                    <p className="text-xs text-brand-text-secondary dark:text-dark-text-secondary hidden sm:block">{t('visionDesc')}</p>
                </div>
                <div className="w-10"></div>
            </header>
            <main className="relative flex-grow overflow-y-auto p-4 md:p-8">
                <div className="max-w-2xl mx-auto space-y-8 py-4">
                    <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-0.5 bg-slate-200 dark:bg-dark-border -z-10" aria-hidden="true" />
                    {horizons.map(h => (
                        <VisionCard 
                            key={h.horizon}
                            horizon={h.horizon}
                            title={t(h.titleKey)}
                            prompt={t(h.promptKey)}
                            vision={visions.find(v => v.horizon === h.horizon)}
                            onUpdate={handleUpdateVision}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default VisionPage;