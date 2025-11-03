
import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface AddItemFormProps {
  onAddItem: (text: string) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
  const [text, setText] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem(text);
    setText('');
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg border-t border-brand-border dark:border-dark-border p-4 z-20">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('pourYourIdeas')}
          className="flex-grow h-12 bg-slate-100 dark:bg-dark-elev1 border-2 border-transparent dark:border-dark-border rounded-xl px-4 text-brand-text-primary dark:text-dark-text-primary dark:placeholder:text-dark-muted focus:ring-2 focus:ring-brand-primary dark:focus:border-brand-primary focus:bg-white dark:focus:bg-dark-surface transition duration-200"
        />
        <button
          type="submit"
          className="flex-shrink-0 bg-brand-primary hover:bg-blue-700 text-white font-semibold w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-bg focus:ring-brand-primary dark:shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
          aria-label={t('addKeyAction')}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </form>
    </footer>
  );
};

export default AddItemForm;
