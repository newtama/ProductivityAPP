import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Vision, VisionHorizon } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { UploadIcon } from './icons/UploadIcon';
import { PlusIcon } from './icons/PlusIcon';

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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    
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
                    horizon,
                    text: vision?.text || text,
                    imageUrl: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (text.trim() !== (vision?.text || '').trim()) {
             onUpdate({
                horizon,
                text: text.trim(),
                imageUrl: vision?.imageUrl,
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
            <div className="relative aspect-[16/9] bg-slate-100 dark:bg-dark-elev1">
                {vision.imageUrl ? (
                    <img src={vision.imageUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full flex-col text-slate-400 dark:text-dark-muted p-4 text-center">
                        <UploadIcon className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">{t('uploadImage')}</span>
                    </div>
                )}
                <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="absolute bottom-3 end-3 h-9 px-3 bg-black/50 text-white text-xs font-semibold rounded-lg backdrop-blur-sm hover:bg-black/70 transition-colors"
                >
                    {vision.imageUrl ? t('changeImage') : t('uploadImage')}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>

            <div className="p-4">
                <h3 className="font-bold text-brand-text-primary dark:text-dark-text-primary">{title}</h3>
                <p className="text-sm text-brand-text-secondary dark:text-dark-text-secondary mb-3">{prompt}</p>
                <textarea 
                    ref={textAreaRef}
                    data-horizon={horizon}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleSave}
                    placeholder={t('addYourVision')}
                    rows={1}
                    className="w-full bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent rounded-xl p-3 text-brand-text-primary dark:text-dark-text-primary placeholder:text-sm dark:placeholder:text-dark-muted focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-dark-surface transition duration-200 resize-none overflow-hidden"
                />
            </div>
        </div>
    );
};

export default VisionCard;