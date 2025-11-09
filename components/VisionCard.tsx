import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Vision, VisionHorizon, VisionChecklistItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { UploadIcon } from './icons/UploadIcon';
import { PlusIcon } from './icons/PlusIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import EditableText from './EditableText';
import { TrashIcon } from './icons/TrashIcon';

interface VisionCardProps {
  vision: Vision | undefined;
  horizon: VisionHorizon;
  title: string;
  prompt: string;
  onUpdate: (vision: Vision) => void;
}

const VisionCard: React.FC<VisionCardProps> = ({ vision, horizon, title, prompt, onUpdate }) => {
    const { t } = useLanguage();
    const [text, setText] = useState(vision?.text || '');
    const [isImageVisible, setIsImageVisible] = useLocalStorage(`vision-image-visible-${horizon}`, true);
    const [newChecklistItemText, setNewChecklistItemText] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    
    const showImageControls = horizon === '5y' || horizon === '1y';

    useEffect(() => {
        setText(vision?.text || '');
    }, [vision?.text]);

    // Auto-resize textarea
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto'; // Reset height
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [text, vision]); // Depend on vision to resize when it appears

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert("Image is too large. Please choose a file smaller than 2MB.");
                if(fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdate({
                    ...vision!,
                    horizon,
                    text: vision?.text || text,
                    imageUrl: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveText = () => {
        if (!vision) return;
        if (text.trim() !== (vision.text || '').trim()) {
             onUpdate({
                ...vision,
                horizon,
                text: text.trim(),
            });
        }
    };

    const handleCreateVision = useCallback(() => {
        onUpdate({
            horizon,
            text: '',
        });
        setTimeout(() => {
            textAreaRef.current?.focus();
        }, 0);
    }, [horizon, onUpdate]);

    const handleAddChecklistItem = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newChecklistItemText.trim() || !vision) return;
      const newItem: VisionChecklistItem = { id: crypto.randomUUID(), text: newChecklistItemText.trim(), completed: false };
      onUpdate({
          ...vision,
          checklist: [...(vision.checklist || []), newItem],
      });
      setNewChecklistItemText('');
    };

    const handleToggleChecklistItem = (id: string) => {
        if (!vision || !vision.checklist) return;
        const updatedChecklist = vision.checklist.map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
        );
        onUpdate({ ...vision, checklist: updatedChecklist });
    };
    
    const handleEditChecklistItem = (id: string, newText: string) => {
        if (!vision || !vision.checklist) return;
        const updatedChecklist = vision.checklist.map(item => 
            item.id === id ? { ...item, text: newText } : item
        );
        onUpdate({ ...vision, checklist: updatedChecklist });
    };

    const handleDeleteChecklistItem = (id: string) => {
        if (!vision || !vision.checklist) return;
        const updatedChecklist = vision.checklist.filter(item => item.id !== id);
        onUpdate({ ...vision, checklist: updatedChecklist });
    };


    if (!vision) {
        return (
            <button 
                onClick={handleCreateVision} 
                className="relative z-10 w-full text-left p-6 bg-white/60 dark:bg-dark-surface/60 rounded-3xl shadow-ios border border-brand-border dark:border-dark-border hover:bg-white dark:hover:bg-dark-surface hover:border-brand-primary/50 dark:hover:border-dark-text-primary/50 transition-all duration-200 flex items-center gap-4 group"
                aria-label={`${t('addYourVision')} for ${title}`}
            >
                <div className="w-12 h-12 bg-slate-200 dark:bg-dark-elev1 rounded-full flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-brand-primary-tonal-bg dark:group-hover:bg-dark-border">
                    <PlusIcon className="w-6 h-6 text-brand-text-secondary dark:text-dark-text-secondary transition-colors group-hover:text-brand-primary dark:group-hover:text-dark-text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-brand-text-primary dark:text-dark-text-primary">{title}</h3>
                    <p className="text-sm text-brand-text-secondary dark:text-dark-text-secondary mt-1">{prompt}</p>
                </div>
            </button>
        );
    }

    return (
        <div className="relative z-10 bg-white dark:bg-dark-surface rounded-3xl shadow-ios border dark:border-dark-border/50 overflow-hidden">
            {showImageControls && isImageVisible && (
                 <div className="relative aspect-[16/9] bg-slate-100 dark:bg-dark-elev1">
                    {vision.imageUrl ? (
                        <img src={vision.imageUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full flex-col text-slate-400 dark:text-dark-muted p-4 text-center">
                            <UploadIcon className="w-8 h-8 mb-2" />
                            <span className="text-sm font-medium">{t('uploadImage')}</span>
                        </div>
                    )}
                    <div className="absolute bottom-3 end-3 flex items-center gap-2">
                         <button 
                            onClick={() => fileInputRef.current?.click()} 
                            className="h-9 px-3 bg-black/50 text-white text-xs font-semibold rounded-lg backdrop-blur-sm hover:bg-black/70 transition-colors"
                        >
                            {vision.imageUrl ? t('changeImage') : t('uploadImage')}
                        </button>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>
            )}

            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                        <h3 className="font-bold text-brand-text-primary dark:text-dark-text-primary">{title}</h3>
                        <p className="text-sm text-brand-text-secondary dark:text-dark-text-secondary">{prompt}</p>
                    </div>
                    {showImageControls && (
                        <button 
                            onClick={() => setIsImageVisible(prev => !prev)} 
                            className="flex-shrink-0 p-2 text-brand-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-dark-elev1 rounded-full transition-colors"
                            aria-label={isImageVisible ? "Hide image" : "Show image"}
                        >
                            {isImageVisible ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                        </button>
                    )}
                </div>
                <textarea 
                    ref={textAreaRef}
                    data-horizon={horizon}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleSaveText}
                    placeholder={t('addYourVision')}
                    rows={1}
                    className="w-full bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent rounded-xl p-3 text-brand-text-primary dark:text-dark-text-primary placeholder:text-sm dark:placeholder:text-dark-muted focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-dark-surface transition duration-200 resize-none overflow-hidden"
                />
            </div>
             {/* Checklist Section */}
            {typeof vision.checklist !== 'undefined' ? (
                <div className="px-4 pb-4">
                    <div className="pt-3 border-t border-brand-border dark:border-dark-border">
                         <h4 className="font-semibold text-sm uppercase tracking-wider text-brand-text-secondary dark:text-dark-text-secondary mb-3">{t('checklist')}</h4>
                        <ul className="space-y-3">
                          {vision.checklist.map((item) => (
                            <li key={item.id} className="group flex items-center gap-3">
                               <input 
                                type="checkbox" 
                                id={`vision-item-${item.id}`}
                                checked={item.completed}
                                onChange={() => handleToggleChecklistItem(item.id)}
                                className="custom-checkbox flex-shrink-0"
                              />
                              <div className="flex-grow">
                                 <EditableText
                                    initialText={item.text}
                                    onSave={(newText) => handleEditChecklistItem(item.id, newText)}
                                    placeholder={t('emptyTask')}
                                    textClasses={`cursor-pointer ${item.completed ? 'line-through text-brand-text-secondary dark:text-dark-text-secondary' : 'text-brand-text-primary dark:text-dark-text-primary'}`}
                                    inputClasses={`w-full bg-transparent border-b border-brand-primary focus:outline-none ${item.completed ? 'line-through text-brand-text-secondary dark:text-dark-text-secondary' : 'text-brand-text-primary dark:text-dark-text-primary'}`}
                                 />
                              </div>
                              <button onClick={() => handleDeleteChecklistItem(item.id)} className="opacity-0 group-hover:opacity-100 text-brand-text-secondary dark:text-dark-text-secondary hover:text-brand-error dark:hover:text-dark-text-primary transition-opacity p-1 rounded-full">
                                  <TrashIcon className="w-4 h-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                        <form onSubmit={handleAddChecklistItem} className="flex items-center gap-2 mt-3 ms-7">
                            <input 
                              type="text"
                              value={newChecklistItemText}
                              onChange={(e) => setNewChecklistItemText(e.target.value)}
                              placeholder={t('addKeyAction')}
                              className="flex-grow h-8 bg-transparent border-b-2 border-slate-200 dark:border-dark-border rounded-none px-0 text-sm text-brand-text-primary dark:text-dark-text-primary focus:ring-0 focus:outline-none focus:border-brand-primary transition duration-200"
                            />
                            <button type="submit" className="flex-shrink-0 bg-slate-200 dark:bg-dark-elev1 hover:bg-slate-300 dark:hover:bg-dark-surface text-brand-text-primary dark:text-dark-text-primary font-semibold w-8 h-8 flex items-center justify-center rounded-lg transition-colors">
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </form>
                    </div>
                </div>
            ) : (
                <div className="px-4 pb-4">
                    <button 
                        onClick={() => onUpdate({ ...vision, checklist: [] })}
                        className="w-full h-10 bg-slate-100 dark:bg-dark-elev1 hover:bg-slate-200 dark:hover:bg-dark-surface rounded-xl text-sm font-semibold text-brand-text-secondary dark:text-dark-text-secondary transition-colors"
                    >
                        {t('addKeyAction')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default VisionCard;