import React, { useState, useCallback, useMemo, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { TaskItem, Category, ReflectionData, Vision, UserRole } from './types';
import RateCalculator from './components/RateCalculator';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import Navigation, { Page } from './components/Navigation';
import { LanguageProvider } from './contexts/LanguageContext';
import AnalyticsPage from './components/AnalyticsPage';
import ReflectionPage from './components/ReflectionPage';
import RoutinePage from './components/RoutinePage';
import VisionPage from './components/VisionPage';
import CommunityPage from './components/CommunityPage';
import { getLocalDateString } from './lib/utils';

export type Theme = 'light' | 'dark' | 'system';
export type IdeasLayout = 'simple' | 'categorized';

function App() {
  const [annualIncome, setAnnualIncome] = useLocalStorage<string>('annualIncome', '');
  const [hourlyRate, setHourlyRate] = useLocalStorage<number | null>('hourlyRate', null);
  const [items, setItems] = useLocalStorage<TaskItem[]>('taskItems', []);
  const [page, setPage] = useState<Page>('home');
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');
  const [ideasLayout, setIdeasLayout] = useLocalStorage<IdeasLayout>('ideasLayout', 'categorized');
  const [oneThingHistory, setOneThingHistory] = useLocalStorage<Array<{date: string; task: TaskItem; reflection?: ReflectionData}>>('oneThingHistory', []);
  const [lastVisitDate, setLastVisitDate] = useLocalStorage<string>('lastVisitDate', '');
  const [visions, setVisions] = useLocalStorage<Vision[]>('visions', []);
  const [role, setRole] = useLocalStorage<UserRole>('userRole', 'user');


  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);
  }, [theme]);

  
  // Daily Reset Logic
  useEffect(() => {
    const todayStr = getLocalDateString(new Date());
    if (lastVisitDate && lastVisitDate !== todayStr) {
      // It's a new day, find yesterday's "One Thing" and reset its action plan
      const yesterdayEntry = oneThingHistory.find(entry => entry.date === lastVisitDate);
      if (yesterdayEntry) {
          const taskToResetId = yesterdayEntry.task.id;
          setItems(prevItems => prevItems.map(item => {
              if (item.id === taskToResetId) {
                  const resetActionPlan = item.actionPlan ? {
                      ...item.actionPlan,
                      keyActions: item.actionPlan.keyActions.map(action => ({...action, completed: false}))
                  } : undefined;
                  
                  // Also un-complete the main task if it was marked as such to allow it to be the one thing again.
                  return { ...item, actionPlan: resetActionPlan, completed: false };
              }
              return item;
          }));
      }
    }
    // Update the last visit date for the next check, but only if it has changed.
    if (lastVisitDate !== todayStr) {
        setLastVisitDate(todayStr);
    }
  }, []); // Run only on initial app mount

  useEffect(() => {
    if (hourlyRate === null) {
      // Stay on the calculator if it hasn't been set, which is handled below.
    } else {
      // If they have a rate, default to home page on load.
      setPage('home');
    }
  }, []); // Empty dependency array ensures this runs only once on mount.


  const handleRateSet = (income: string, rate: number) => {
    setAnnualIncome(income);
    setHourlyRate(rate);
    setPage('profile');
  };

  const handleResetRate = () => {
    setHourlyRate(null);
  };

  const handleAddItem = useCallback((text: string) => {
    if (!text.trim()) return;
    const newItem: TaskItem = {
      id: crypto.randomUUID(),
      text,
      category: Category.TASK,
      rating: 0,
      delegated: false,
      automated: false,
      completed: false,
      batched: false,
      isRoutine: false,
      createdAt: Date.now(),
      subTasks: [],
    };
    setItems(prevItems => [newItem, ...prevItems]);
  }, [setItems]);

  const handleUpdateItem = useCallback((updatedItem: TaskItem) => {
    setItems(prevItems =>
      prevItems.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, [setItems]);
  
  const handleUpdateVisions = useCallback((updatedVisions: Vision[]) => {
      setVisions(updatedVisions);
  }, [setVisions]);

  const handlePermanentDeleteItem = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, [setItems]);


  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset and start over? This will clear all your data.")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  const theOneThing = useMemo(() => {
    const sortedFocusItems = items
      .filter(
        item =>
          item.rating > 0 &&
          !item.delegated &&
          !item.automated &&
          !item.completed &&
          !item.isRoutine &&
          item.category !== Category.IGNORED
      )
      .sort((a, b) => b.rating - a.rating || b.createdAt - a.createdAt);
    return sortedFocusItems.length > 0 ? sortedFocusItems[0] : null;
  }, [items]);

  useEffect(() => {
    if (!theOneThing) return;

    const todayStr = getLocalDateString(new Date());

    setOneThingHistory(prevHistory => {
        const historyForTodayIndex = prevHistory.findIndex(entry => entry.date === todayStr);

        if (historyForTodayIndex !== -1) {
            // Entry for today exists, update it if the task is different
            if (prevHistory[historyForTodayIndex].task.id !== theOneThing.id) {
                const updatedHistory = [...prevHistory];
                // Preserve reflection if task changes on the same day
                const existingReflection = prevHistory[historyForTodayIndex].reflection;
                updatedHistory[historyForTodayIndex] = { date: todayStr, task: theOneThing, reflection: existingReflection };
                return updatedHistory;
            }
            // It's the same task, no change needed
            return prevHistory;
        } else {
            // No entry for today, add a new one at the beginning
            return [{ date: todayStr, task: theOneThing }, ...prevHistory];
        }
    });
  }, [theOneThing, setOneThingHistory]);
  
  const handleSaveReflection = useCallback((reflectionData: ReflectionData) => {
    const todayStr = getLocalDateString(new Date());
    setOneThingHistory(prevHistory => {
        const historyIndex = prevHistory.findIndex(entry => entry.date === todayStr);
        if (historyIndex !== -1) {
            const updatedHistory = [...prevHistory];
            const currentEntry = updatedHistory[historyIndex];
            if (currentEntry) {
                 updatedHistory[historyIndex] = { ...currentEntry, reflection: reflectionData };
                 return updatedHistory;
            }
        }
        return prevHistory;
    });
  }, [setOneThingHistory]);


  if (hourlyRate === null) {
    return (
        <LanguageProvider>
            <RateCalculator onRateSet={handleRateSet} initialIncome={annualIncome} />
        </LanguageProvider>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage visions={visions} theOneThing={theOneThing} onUpdateItem={handleUpdateItem} oneThingHistory={oneThingHistory} hourlyRate={hourlyRate} onNavigate={setPage} />;
      case 'ideas':
        return (
          <Dashboard
            items={items}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onPermanentDeleteItem={handlePermanentDeleteItem}
            onNavigateBack={() => setPage('home')}
            hourlyRate={hourlyRate}
            ideasLayout={ideasLayout}
          />
        );
       case 'vision':
        return <VisionPage visions={visions} onUpdateVisions={handleUpdateVisions} onNavigateBack={() => setPage('home')} />;
       case 'community':
        return <CommunityPage role={role} />;
       case 'routine':
        return (
          <RoutinePage
            items={items}
            onUpdateItem={handleUpdateItem}
            onPermanentDeleteItem={handlePermanentDeleteItem}
            onNavigateBack={() => setPage('home')}
          />
        );
       case 'analytics':
        return <AnalyticsPage oneThingHistory={oneThingHistory} hourlyRate={hourlyRate} items={items} role={role} />;
      case 'profile':
        return <ProfilePage hourlyRate={hourlyRate} onReset={handleReset} theme={theme} onSetTheme={setTheme} onResetRate={handleResetRate} ideasLayout={ideasLayout} onSetIdeasLayout={setIdeasLayout} role={role} onSetRole={setRole} />;
      case 'reflection': {
        const todayStr = getLocalDateString(new Date());
        const todayHistory = oneThingHistory.find(h => h.date === todayStr);
        return <ReflectionPage
                  onNavigateBack={() => setPage('home')}
                  onSaveReflection={handleSaveReflection}
                  initialReflectionData={todayHistory?.reflection}
                />;
      }
      default:
        return <HomePage visions={visions} theOneThing={theOneThing} onUpdateItem={handleUpdateItem} oneThingHistory={oneThingHistory} hourlyRate={hourlyRate} onNavigate={setPage} />;
    }
  };

  const pagesWithNav = ['home', 'community', 'analytics', 'profile', 'vision'];
  const showNav = pagesWithNav.includes(page);

  return (
    <LanguageProvider>
      <div className="bg-brand-bg dark:bg-dark-bg min-h-screen font-sans">
        <div className={showNav ? 'pb-28' : ''}>
          {renderPage()}
        </div>
        {showNav && <Navigation currentPage={page} onNavigate={setPage} />}
      </div>
    </LanguageProvider>
  );
}

export default App;