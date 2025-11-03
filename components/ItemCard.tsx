
import React, { useState, useRef, useEffect } from 'react';
import { TaskItem, Category, SubTask } from '../types';
import StarRating from './StarRating';
import { TrashIcon } from './icons/TrashIcon';
import { DelegateIcon } from './icons/DelegateIcon';
import { AutomateIcon } from './icons/AutomateIcon';
import { RestoreIcon } from './icons/RestoreIcon';
import { ChecklistIcon } from './icons/ChecklistIcon';
import { PlusIcon } from './icons/PlusIcon';
import EditableText from './EditableText';
import { useLanguage } from '../contexts/LanguageContext';
import { BatchIcon } from './icons/BatchIcon';
import { RoutineIcon } from './icons/RoutineIcon';
import { EllipsisIcon } from './icons/EllipsisIcon';

interface ItemCardProps {
  item: TaskItem;
  onUpdate: (item: TaskItem) => void;
  onPermanentDelete: (id: string) => void;
  onSetAsOneThing?: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onUpdate, onPermanentDelete, onSetAsOneThing }) => {
  const [isChecklistVisible, setIsChecklistVisible] = useState(false);
  const [newSubTaskText, setNewSubTaskText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  // New state and refs for swipe
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dragStartXRef = useRef(0);
  const currentTranslateXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const SWIPE_THRESHOLD = -100; // pixels to trigger action

  // New state and ref for dynamic menu
  const [isMenuUp, setIsMenuUp] = useState(true);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const canBeOneThing = !!(onSetAsOneThing && !item.delegated && !item.automated && !item.batched);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canBeOneThing) return;
    dragStartXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
    setIsTransitioning(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !canBeOneThing) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - dragStartXRef.current;
    
    // Only allow swiping left
    if (deltaX < 0) {
        currentTranslateXRef.current = deltaX;
        setTranslateX(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current || !canBeOneThing) return;
    isDraggingRef.current = false;
    setIsTransitioning(true);

    if (currentTranslateXRef.current < SWIPE_THRESHOLD) {
      onSetAsOneThing(item.id);
      // No need to snap back, component will unmount or navigate away
    } else {
      // Snap back
      setTranslateX(0);
    }
    currentTranslateXRef.current = 0;
  };

  const toggleMenu = () => {
    if (!isMenuOpen) {
        if (menuButtonRef.current) {
            const rect = menuButtonRef.current.getBoundingClientRect();
            const menuHeight = 220; // Approximate height of the menu
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;

            // Default to up, but if not enough space above AND more space below, open down.
            if (spaceAbove < menuHeight && spaceBelow > spaceAbove) {
                setIsMenuUp(false);
            } else {
                setIsMenuUp(true);
            }
        }
    }
    setIsMenuOpen(prev => !prev);
  };


  const handleSoftDelete = () => {
    onUpdate({ ...item, category: Category.IGNORED });
  };

  const handleRestore = () => {
    onUpdate({ ...item, category: Category.TASK, rating: 0 });
  };
  
  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTaskText.trim()) return;
    const newSubTask: SubTask = {
      id: crypto.randomUUID(),
      text: newSubTaskText.trim(),
      completed: false,
    };
    onUpdate({ ...item, subTasks: [...item.subTasks, newSubTask] });
    setNewSubTaskText('');
  };

  const handleToggleSubTask = (subTaskId: string) => {
    const updatedSubTasks = item.subTasks.map(sub => 
      sub.id === subTaskId ? { ...sub, completed: !sub.completed } : sub
    );
    onUpdate({ ...item, subTasks: updatedSubTasks });
  };
  
  const handleDeleteSubTask = (subTaskId: string) => {
     const updatedSubTasks = item.subTasks.filter(sub => sub.id !== subTaskId);
     onUpdate({ ...item, subTasks: updatedSubTasks });
  }

  const completedSubTasks = item.subTasks?.filter(st => st.completed).length || 0;
  const totalSubTasks = item.subTasks?.length || 0;
  const allSubTasksCompleted = totalSubTasks > 0 && completedSubTasks === totalSubTasks;


  if (item.category === Category.IGNORED) {
    return (
      <div className="bg-slate-100/80 dark:bg-dark-surface/50 rounded-2xl p-3 flex items-center justify-between transition-all hover:bg-slate-200/60 dark:hover:bg-dark-surface/80">
        <p className="text-brand-text-secondary dark:text-dark-text-secondary line-through truncate pe-4">
          {item.text}
        </p>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button 
            title={t('restore')}
            onClick={handleRestore} 
            className="flex items-center gap-1.5 bg-white dark:bg-dark-elev1/50 hover:bg-green-100 dark:hover:bg-green-500/20 text-brand-text-secondary dark:text-dark-text-secondary hover:text-green-700 dark:hover:text-green-300 font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors shadow-sm border border-slate-200 dark:border-dark-border"
          >
            <RestoreIcon className="w-4 h-4" />
            <span>{t('restore')}</span>
          </button>
          <button title={t('deletePermanently')} onClick={() => onPermanentDelete(item.id)} className="p-2 text-brand-text-secondary dark:text-dark-text-secondary hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-brand-error dark:hover:text-red-400 rounded-lg transition-colors">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl ${isMenuOpen ? 'z-30' : ''}`}>
        {canBeOneThing && (
            <div className="absolute inset-0 bg-brand-primary rounded-2xl flex items-center justify-end p-6 pointer-events-none">
                <div 
                    className="flex items-center text-white transition-opacity"
                    style={{ opacity: Math.min(Math.abs(translateX) / Math.abs(SWIPE_THRESHOLD), 1) }}
                >
                    <span className="text-xl font-bold">{t('swipeToOneThing')}</span>
                </div>
            </div>
        )}
        <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ 
                transform: `translateX(${translateX}px)`, 
                transition: isTransitioning ? 'transform 0.3s ease' : 'none',
                touchAction: canBeOneThing ? 'pan-y' : 'auto',
            }}
            className={`relative bg-white dark:bg-dark-surface rounded-2xl p-3 shadow-ios transition-all duration-200 border dark:border-dark-border/50 ${
                item.delegated 
                ? 'bg-slate-50 dark:bg-dark-elev1/60 border-transparent' 
                : 'border-transparent'
            } ${item.completed ? 'bg-slate-50/50 dark:bg-dark-surface/50' : ''}`}
        >
            <div className="absolute top-2.5 end-2.5 flex items-center gap-1 z-10">
                {/* Status Icons */}
                {item.isRoutine && (
                <div title={t('setAsRoutine')} className="text-amber-600 bg-amber-500/10 dark:bg-amber-500/20 p-1.5 rounded-full flex items-center justify-center">
                    <RoutineIcon className="w-4 h-4" />
                </div>
                )}
                {item.automated && (
                <div title={t('automated')} className="text-brand-accent bg-green-500/10 dark:bg-green-500/20 p-1.5 rounded-full flex items-center justify-center">
                    <AutomateIcon className="w-4 h-4" />
                </div>
                )}
                {item.batched && (
                <div title={t('batched')} className="text-brand-info bg-cyan-500/10 dark:bg-cyan-500/20 p-1.5 rounded-full flex items-center justify-center">
                    <BatchIcon className="w-4 h-4" />
                </div>
                )}
                {item.delegated && (
                <div title={t('delegated')} className="text-brand-primary bg-blue-500/10 dark:bg-blue-500/20 p-1.5 rounded-full flex items-center justify-center">
                    <DelegateIcon className="w-4 h-4" />
                </div>
                )}
            </div>

            <div className="flex items-start gap-3">
                <input 
                type="checkbox" 
                checked={item.completed}
                onChange={() => onUpdate({ ...item, completed: !item.completed })}
                className="custom-checkbox flex-shrink-0 mt-1"
                />
                <div className="flex-grow mb-2 pr-20">
                    <EditableText
                    initialText={item.text}
                    onSave={(newText) => onUpdate({ ...item, text: newText })}
                    textClasses={`text-brand-text-primary dark:text-dark-text-primary ${(item.completed || allSubTasksCompleted) ? 'line-through text-brand-text-secondary dark:text-dark-text-secondary' : ''} ${item.delegated ? 'text-brand-text-secondary dark:text-dark-text-secondary' : ''}`}
                    inputClasses={`w-full bg-slate-100 dark:bg-dark-elev1 rounded-md p-1 -m-1 border-brand-primary focus:outline-none text-brand-text-primary dark:text-dark-text-primary ${item.delegated ? 'text-brand-text-secondary dark:text-dark-text-secondary' : ''}`}
                    placeholder={t('enterIdeaName')}
                    />
                </div>
            </div>

            {!item.completed && (
                <div className="flex items-center justify-between pt-2 pl-8">
                    <StarRating rating={item.rating} onRate={rating => onUpdate({ ...item, rating })} />
                    <div className="flex items-center space-x-1">
                        <button
                            title={t('checklist')}
                            onClick={() => setIsChecklistVisible(!isChecklistVisible)}
                            className={`p-1.5 rounded-full transition-colors relative ${isChecklistVisible ? 'bg-brand-primary-tonal-bg dark:bg-dark-elev1 text-brand-primary dark:text-dark-text-primary' : 'text-brand-text-secondary dark:text-dark-text-secondary hover:bg-brand-primary-tonal-bg dark:hover:bg-dark-elev1'}`}
                            >
                            <ChecklistIcon className="w-5 h-5" />
                            {totalSubTasks > 0 && (
                                <span className="absolute -top-1 -end-1.5 text-xs bg-brand-primary text-white rounded-full min-w-[16px] h-4 text-center px-1 font-semibold text-[10px] flex items-center justify-center">
                                    {completedSubTasks}/{totalSubTasks}
                                </span>
                            )}
                        </button>
                        
                        <div className="relative" ref={menuRef}>
                            <button
                                ref={menuButtonRef}
                                title="More actions"
                                onClick={toggleMenu}
                                className="p-1.5 rounded-full text-brand-text-secondary dark:text-dark-text-secondary hover:bg-brand-primary-tonal-bg dark:hover:bg-dark-elev1"
                            >
                                <EllipsisIcon className="w-5 h-5" />
                            </button>
                            {isMenuOpen && (
                            <div className={`absolute right-0 w-48 bg-white dark:bg-dark-elev1 rounded-xl shadow-lg border dark:border-dark-border z-20 py-2 ${ isMenuUp ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
                                <button onClick={() => { onUpdate({ ...item, isRoutine: !item.isRoutine }); setIsMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-dark-surface transition-colors ${item.isRoutine ? 'text-amber-600' : 'text-brand-text-primary dark:text-dark-text-primary'}`}>
                                <RoutineIcon className="w-5 h-5" />
                                <span>{t('setAsRoutine')}</span>
                                </button>
                                <button onClick={() => { onUpdate({ ...item, batched: !item.batched }); setIsMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-dark-surface transition-colors ${item.batched ? 'text-brand-info' : 'text-brand-text-primary dark:text-dark-text-primary'}`}>
                                <BatchIcon className="w-5 h-5" />
                                <span>{t('batch')}</span>
                                </button>
                                <button onClick={() => { onUpdate({ ...item, delegated: !item.delegated }); setIsMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-dark-surface transition-colors ${item.delegated ? 'text-brand-primary' : 'text-brand-text-primary dark:text-dark-text-primary'}`}>
                                <DelegateIcon className="w-5 h-5" />
                                <span>{t('delegate')}</span>
                                </button>
                                <button onClick={() => { onUpdate({ ...item, automated: !item.automated }); setIsMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-dark-surface transition-colors ${item.automated ? 'text-brand-accent' : 'text-brand-text-primary dark:text-dark-text-primary'}`}>
                                <AutomateIcon className="w-5 h-5" />
                                <span>{t('automate')}</span>
                                </button>
                                <div className="my-1 h-px bg-brand-border dark:bg-dark-border"></div>
                                <button onClick={() => { handleSoftDelete(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-brand-error hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                <TrashIcon className="w-5 h-5" />
                                <span>{t('delete')}</span>
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {isChecklistVisible && (
                <div className="mt-4 pt-4 border-t border-brand-border dark:border-dark-border">
                <div className="space-y-2">
                    {item.subTasks.map(sub => (
                    <div key={sub.id} className="group flex items-center gap-3">
                        <input 
                        type="checkbox" 
                        checked={sub.completed}
                        onChange={() => handleToggleSubTask(sub.id)}
                        className="custom-checkbox flex-shrink-0"
                        />
                        <span className={`flex-grow ${sub.completed ? 'line-through text-brand-text-secondary dark:text-dark-text-secondary' : 'text-brand-text-primary dark:text-dark-text-primary'}`}>
                        {sub.text}
                        </span>
                        <button onClick={() => handleDeleteSubTask(sub.id)} className="opacity-0 group-hover:opacity-100 text-brand-text-secondary dark:text-dark-text-secondary hover:text-brand-error dark:hover:text-dark-text-primary transition-opacity">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                    ))}
                </div>
                <form onSubmit={handleAddSubTask} className="flex items-center gap-2 mt-3">
                    <input 
                    type="text"
                    value={newSubTaskText}
                    onChange={(e) => setNewSubTaskText(e.target.value)}
                    placeholder={t('addSubTask')}
                    className="flex-grow h-8 bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent rounded-lg px-2 text-sm text-brand-text-primary dark:text-dark-text-primary focus:ring-1 focus:ring-brand-primary focus:border-brand-primary focus:bg-white dark:focus:bg-dark-surface transition duration-200"
                    />
                    <button type="submit" className="flex-shrink-0 bg-slate-200 dark:bg-dark-elev1 hover:bg-slate-300 dark:hover:bg-dark-surface text-brand-text-primary dark:text-dark-text-primary font-semibold w-8 h-8 flex items-center justify-center rounded-lg transition-colors">
                    <PlusIcon className="w-4 h-4" />
                    </button>
                </form>
                </div>
            )}
        </div>
    </div>
  );
};

export default ItemCard;
