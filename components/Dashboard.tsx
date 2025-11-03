

import React, { useMemo, useState, useRef, useEffect, UIEvent } from 'react';
import { GoogleGenAI } from "@google/genai";
import useLocalStorage from '../hooks/useLocalStorage';
import { TaskItem, Category } from '../types';
import AddItemForm from './AddItemForm';
import { BackIcon } from './icons/BackIcon';
import { AIIcon } from './icons/AIIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { RestoreIcon } from './icons/RestoreIcon';
import ItemCard from './ItemCard';
import SuggestionDisplay from './SuggestionDisplay';
import { useLanguage } from '../contexts/LanguageContext';
import { IdeasLayout } from '../App';


interface DashboardProps {
  items: TaskItem[];
  onAddItem: (text: string) => void;
  onUpdateItem: (item: TaskItem) => void;
  onPermanentDeleteItem: (id: string) => void;
  onNavigateBack: () => void;
  hourlyRate: number;
  ideasLayout: IdeasLayout;
}


const Dashboard: React.FC<DashboardProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onPermanentDeleteItem,
  onNavigateBack,
  hourlyRate,
  ideasLayout,
}) => {
  const [isThinking, setIsThinking] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const { t, currentLang, formatCurrency } = useLanguage();

  const [makeMoneyAnswer] = useLocalStorage('profile_makeMoney', '');
  const [increaseRateAnswer] = useLocalStorage('profile_increaseRate', '');
  const [giveEnergyAnswer] = useLocalStorage('profile_giveEnergy', '');
  
  const { normalItems, delegatedItems, deletedItems, batchedItems, routineItems } = useMemo(() => {
    const normal: TaskItem[] = [];
    const delegated: TaskItem[] = [];
    const deleted: TaskItem[] = [];
    const batched: TaskItem[] = [];
    const routine: TaskItem[] = [];

    items.forEach(item => {
        if (item.category === Category.IGNORED) {
            deleted.push(item);
        } else if (item.isRoutine) {
            routine.push(item);
        } else if (item.delegated) {
            delegated.push(item);
        } else if (item.batched) {
            batched.push(item);
        } else {
            normal.push(item);
        }
    });

    const sortNormalItems = (a: TaskItem, b: TaskItem) => {
        // Pushes automated items to the bottom
        if (a.automated && !b.automated) return 1;
        if (!a.automated && b.automated) return -1;
        
        // Then sorts by rating and recency
        return b.rating - a.rating || b.createdAt - a.createdAt;
    };
    const sortByRating = (a: TaskItem, b: TaskItem) => b.rating - a.rating || b.createdAt - a.createdAt;
    const sortRecency = (a: TaskItem, b: TaskItem) => b.createdAt - a.createdAt;

    return {
        normalItems: normal.sort(sortNormalItems),
        delegatedItems: delegated.sort(sortByRating),
        batchedItems: batched.sort(sortByRating),
        routineItems: routine.sort(sortByRating),
        deletedItems: deleted.sort(sortRecency)
    };
  }, [items]);

  const [activeTab, setActiveTab] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);


  const TABS = useMemo(() => [
    { title: t('ideas'), items: normalItems },
    { title: t('routines'), items: routineItems },
    { title: t('batched'), items: batchedItems },
    { title: t('delegated'), items: delegatedItems },
  ], [t, normalItems, routineItems, batchedItems, delegatedItems]);

  useEffect(() => {
    const activeTabEl = tabRefs.current[activeTab];
    const indicatorEl = tabIndicatorRef.current;
    if (activeTabEl && indicatorEl) {
        indicatorEl.style.width = `${activeTabEl.offsetWidth}px`;
        indicatorEl.style.left = `${activeTabEl.offsetLeft}px`;
    }
  }, [activeTab, TABS]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    scrollContainerRef.current?.scrollTo({
      left: scrollContainerRef.current.offsetWidth * index,
      behavior: 'smooth',
    });
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
      const scrollLeft = event.currentTarget.scrollLeft;
      const containerWidth = event.currentTarget.offsetWidth;
      // Add a small tolerance to prevent floating point inaccuracies
      const newIndex = Math.round(scrollLeft / containerWidth + 0.01);
      if (newIndex !== activeTab && newIndex < TABS.length) {
          setActiveTab(newIndex);
      }
  };


  const handleSetAsOneThing = (id: string) => {
    const itemToUpdate = items.find(item => item.id === id);
    if (itemToUpdate) {
        // Set a high rating and update the timestamp to ensure it becomes the new "One Thing"
        onUpdateItem({ ...itemToUpdate, rating: 6, createdAt: Date.now() }); 
        onNavigateBack();
    }
  };


  const handleGetSuggestion = async () => {
    const taskItems = items.filter(i => i.category === Category.TASK && !i.delegated && !i.automated && !i.completed);
    if (taskItems.length === 0) {
        alert(t('addSomeItemsFirst'));
        return;
    }

    setIsThinking(true);
    setError(null);
    setSuggestion(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are a world-class productivity coach. Your goal is to help me identify my "one thing" and streamline my idea list by suggesting ideas to automate or delegate.

        Here is some context about me:
        My target hourly rate is: ${formatCurrency(hourlyRate, {minimumFractionDigits: 2, maximumFractionDigits: 2})}.
        This is what "making money" means to me: ${makeMoneyAnswer || 'Not provided'}
        This is what "increasing my hourly rate" means to me: ${increaseRateAnswer || 'Not provided'}
        This is what "giving me energy" means to me: ${giveEnergyAnswer || 'Not provided'}

        Here is my current list of ideas:
        - ${taskItems.map(item => item.text).join('\n- ')}

        Based on all this information, analyze my list and provide the following suggestions.

        1.  **Identify my "one thing"**: The single idea that will create the biggest positive domino effect.
        2.  **Suggest automation**: Identify any repetitive ideas that could be automated.
        3.  **Suggest delegation**: Identify any ideas that could be done by someone else.
        
        IMPORTANT: Your entire response must be in ${currentLang.name}.

        Structure your response exactly like this, using the translated terms for your response language, with markdown for bolding:

        **${t('suggestionOneThing')}:** [The suggested idea]

        **${t('whyItMatters')}:**
        [Your 2-3 sentence explanation of its domino effect.]

        **${t('streamlineList')}:**
        - **${t('automate')}**: [List of ideas to automate, comma-separated. If none, write "${t('noneIdentified')}"].
        - **${t('delegate')}**: [List of ideas to delegate, comma-separated. If none, write "${t('noneIdentified')}"].
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setSuggestion(response.text);

    } catch (e) {
      console.error(e);
      setError(t('suggestionError'));
    } finally {
      setIsThinking(false);
    }
  };


  const closeModal = () => {
    setSuggestion(null);
    setError(null);
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
        <h1 className="text-xl md:text-2xl font-bold text-brand-text-primary dark:text-dark-text-primary text-center absolute left-1/2 -translate-x-1/2">
            {t('myIdeas')}
        </h1>
        <div className="flex items-center gap-2">
            <button
                onClick={() => setShowRestoreModal(true)}
                className={`text-brand-text-secondary dark:text-dark-text-secondary hover:text-brand-text-primary dark:hover:text-dark-text-primary transition-colors p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-dark-elev1/60`}
                aria-label={t('deletedItems')}
            >
                <RestoreIcon className="w-6 h-6" />
            </button>
            <button
              onClick={handleGetSuggestion}
              disabled={isThinking}
              className="text-brand-primary dark:text-dark-text-primary hover:text-brand-accent transition-colors p-2 rounded-full hover:bg-brand-primary-tonal-bg dark:hover:bg-dark-elev1 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t('aiSuggestion')}
            >
              {isThinking ? <SpinnerIcon className="w-6 h-6" /> : <AIIcon className="w-6 h-6" />}
            </button>
        </div>
      </header>
      
      {ideasLayout === 'categorized' && (
        <>
            {/* Tab Navigation */}
            <div ref={tabsContainerRef} className="relative flex-shrink-0 border-b border-brand-border dark:border-dark-border px-4">
                <div className="flex items-center space-x-4 overflow-x-auto whitespace-nowrap no-scrollbar">
                {TABS.map((tab, index) => (
                    <button
                    key={tab.title}
                    ref={el => tabRefs.current[index] = el}
                    onClick={() => handleTabClick(index)}
                    className={`py-3 text-sm font-semibold transition-colors duration-200 relative ${
                        activeTab === index 
                        ? 'text-brand-primary dark:text-dark-text-primary' 
                        : 'text-brand-text-secondary dark:text-dark-text-secondary hover:text-brand-text-primary dark:hover:text-dark-text-primary'
                    }`}
                    >
                    {tab.title}
                    <span className="ml-1.5 bg-slate-200 dark:bg-dark-elev1 text-xs font-medium px-2 py-0.5 rounded-full">
                        {tab.items.length}
                    </span>
                    </button>
                ))}
                </div>
                <div 
                    ref={tabIndicatorRef}
                    className="absolute bottom-0 h-0.5 bg-brand-primary dark:bg-dark-text-primary transition-all duration-300"
                />
            </div>
            <main 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-grow flex snap-x snap-mandatory overflow-x-auto no-scrollbar"
            >
                {TABS.map((tab, index) => (
                <div key={index} className="w-full flex-shrink-0 snap-start p-4 overflow-y-auto">
                    <div className="space-y-3 max-w-4xl mx-auto">
                    {tab.items.length > 0 ? (
                        <>
                        {tab.title === t('ideas') ? (
                            (() => {
                            const activeIdeas = tab.items.filter(item => !item.completed);
                            const completedIdeas = tab.items.filter(item => item.completed).sort((a, b) => b.createdAt - a.createdAt);

                            return (
                                <>
                                {activeIdeas.map(item => (
                                    <ItemCard
                                    key={item.id}
                                    item={item}
                                    onUpdate={onUpdateItem}
                                    onPermanentDelete={onPermanentDeleteItem}
                                    onSetAsOneThing={handleSetAsOneThing}
                                    />
                                ))}

                                {completedIdeas.length > 0 && activeIdeas.length > 0 && (
                                    <div className="flex items-center pt-3 pb-1">
                                    <div className="flex-grow border-t border-brand-border dark:border-dark-border"></div>
                                    <span className="flex-shrink mx-4 text-xs font-semibold text-brand-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{t('completed')}</span>
                                    <div className="flex-grow border-t border-brand-border dark:border-dark-border"></div>
                                    </div>
                                )}

                                {completedIdeas.map(item => (
                                    <ItemCard
                                    key={item.id}
                                    item={item}
                                    onUpdate={onUpdateItem}
                                    onPermanentDelete={onPermanentDeleteItem}
                                    onSetAsOneThing={handleSetAsOneThing}
                                    />
                                ))}
                                </>
                            );
                            })()
                        ) : (
                            tab.items.map(item => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                onUpdate={onUpdateItem}
                                onPermanentDelete={onPermanentDeleteItem}
                                onSetAsOneThing={handleSetAsOneThing}
                            />
                            ))
                        )}
                        </>
                    ) : (
                        <div className="mt-10 text-center text-brand-text-secondary dark:text-dark-text-secondary text-sm h-full flex items-center justify-center p-4 border-2 border-dashed border-brand-border dark:border-dark-border rounded-2xl">
                        <p>{t('addFirstIdea')}</p>
                        </div>
                    )}
                    </div>
                </div>
                ))}
            </main>
        </>
      )}

      {ideasLayout === 'simple' && (
        <main className="flex-grow overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto pb-4">
            {(() => {
              const activeIdeas = normalItems.filter(item => !item.completed);
              const completedIdeas = normalItems.filter(item => item.completed).sort((a, b) => b.createdAt - a.createdAt);

              const renderSection = (title: string, sectionItems: TaskItem[]) => {
                if (!sectionItems || sectionItems.length === 0) return null;
                return (
                  <div className="mt-6">
                    <div className="flex items-center pt-3 pb-1">
                      <div className="flex-grow border-t border-brand-border dark:border-dark-border"></div>
                      <h2 className="flex-shrink mx-4 text-xs font-semibold text-brand-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">{title}</h2>
                      <div className="flex-grow border-t border-brand-border dark:border-dark-border"></div>
                    </div>
                    <div className="space-y-3 mt-2">
                      {sectionItems.map(item => (
                        <ItemCard key={item.id} item={item} onUpdate={onUpdateItem} onPermanentDelete={onPermanentDeleteItem} onSetAsOneThing={handleSetAsOneThing} />
                      ))}
                    </div>
                  </div>
                );
              };

              return (
                <>
                  <div className="space-y-3">
                    {activeIdeas.length > 0 ? (
                      activeIdeas.map(item => <ItemCard key={item.id} item={item} onUpdate={onUpdateItem} onPermanentDelete={onPermanentDeleteItem} onSetAsOneThing={handleSetAsOneThing} />)
                    ) : (
                      items.length === 0 && <div className="mt-10 text-center text-brand-text-secondary dark:text-dark-text-secondary text-sm h-full flex items-center justify-center p-4 border-2 border-dashed border-brand-border dark:border-dark-border rounded-2xl">
                        <p>{t('addFirstIdea')}</p>
                      </div>
                    )}
                  </div>

                  {renderSection(t('routines'), routineItems)}
                  {renderSection(t('batched'), batchedItems)}
                  {renderSection(t('delegated'), delegatedItems)}
                  {renderSection(t('completed'), completedIdeas)}
                </>
              );
            })()}
          </div>
        </main>
      )}


       {showRestoreModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={() => setShowRestoreModal(false)}>
            <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-ios p-6 w-full max-w-md flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold text-brand-text-primary dark:text-dark-text-primary flex items-center">
                        <RestoreIcon className="w-6 h-6 me-2 text-brand-text-secondary dark:text-dark-text-secondary"/> {t('deletedItems')}
                    </h2>
                    <button onClick={() => setShowRestoreModal(false)} className="text-brand-text-secondary dark:text-dark-text-secondary text-2xl leading-none">&times;</button>
                </div>

                <div className="overflow-y-auto space-y-3 flex-grow pe-2">
                    {deletedItems.length > 0 ? (
                        deletedItems.map(item => (
                            <ItemCard 
                                key={item.id}
                                item={item}
                                onUpdate={onUpdateItem}
                                onPermanentDelete={onPermanentDeleteItem}
                            />
                        ))
                    ) : (
                        <div className="text-center text-brand-text-secondary dark:text-dark-text-secondary text-sm h-full flex items-center justify-center p-4 border-2 border-dashed border-brand-border dark:border-dark-border rounded-2xl">
                            <p>{t('noDeletedItems')}</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex-shrink-0">
                    <button
                        onClick={() => setShowRestoreModal(false)}
                        className="w-full h-12 bg-slate-100 dark:bg-dark-elev1 hover:bg-slate-200 dark:hover:bg-dark-surface text-brand-text-primary dark:text-dark-text-primary font-semibold py-2 px-4 rounded-xl transition-colors"
                    >
                        {t('done')}
                    </button>
                </div>
            </div>
        </div>
       )}

      {(suggestion || error || isThinking) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-ios p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brand-text-primary dark:text-dark-text-primary flex items-center">
                  <AIIcon className="w-6 h-6 me-2 text-brand-primary dark:text-dark-text-primary"/> {t('aiSuggestion')}
              </h2>
              <button onClick={closeModal} className="text-brand-text-secondary dark:text-dark-text-secondary text-2xl leading-none">&times;</button>
            </div>
            
            {(isThinking && !suggestion && !error) && (
                <div className="flex flex-col items-center justify-center min-h-[150px]">
                  <SpinnerIcon className="w-8 h-8 text-brand-primary dark:text-dark-text-primary"/>
                  <p className="mt-4 text-brand-text-secondary dark:text-dark-text-secondary">{t('analyzingIdeas')}</p>
                </div>
            )}
            {error && <p className="text-brand-error">{error}</p>}
            {suggestion && (
              <>
                <div className="mb-6 max-h-[60vh] overflow-y-auto pe-2">
                  <SuggestionDisplay suggestion={suggestion} />
                </div>
               <div className="mt-6">
                  <button
                    onClick={closeModal}
                    className="w-full h-12 bg-brand-primary-tonal-bg dark:bg-dark-elev1 text-brand-primary-tonal-text dark:text-dark-text-primary font-semibold py-2 px-4 rounded-xl transition-colors hover:bg-blue-200 dark:hover:bg-dark-surface"
                  >
                    {t('thanks')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <AddItemForm onAddItem={onAddItem} />
    </div>
  );
};

export default Dashboard;