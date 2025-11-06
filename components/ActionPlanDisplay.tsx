import React, { useState } from 'react';
import { ActionPlan } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import EditableText from './EditableText';
import { useLanguage } from '../contexts/LanguageContext';

interface ActionPlanDisplayProps {
  plan: ActionPlan;
  onToggleAction: (id: string) => void;
  onAddAction: (text: string) => void;
  onEditAction: (id: string, newText: string) => void;
  onDeleteAction: (id: string) => void;
}

const ActionPlanDisplay: React.FC<ActionPlanDisplayProps> = ({ plan, onToggleAction, onAddAction, onEditAction, onDeleteAction }) => {
  const [newActionText, setNewActionText] = useState('');
  const { t } = useLanguage();

  const handleAddAction = (e: React.FormEvent) => {
      e.preventDefault();
      if (newActionText.trim()) {
          onAddAction(newActionText);
          setNewActionText('');
      }
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-ios p-6 border border-brand-border dark:border-dark-border text-left">
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider text-brand-text-secondary dark:text-dark-text-secondary mb-3">{t('checklist')}</h3>
        <ul className="space-y-3">
          {plan.keyActions.map((action) => (
            <li key={action.id} className="group flex items-center gap-3">
               <input 
                type="checkbox" 
                id={`action-${action.id}`}
                checked={action.completed}
                onChange={() => onToggleAction(action.id)}
                className="custom-checkbox flex-shrink-0"
              />
              <div className="flex-grow">
                 <EditableText
                    initialText={action.text}
                    onSave={(newText) => onEditAction(action.id, newText)}
                    placeholder={t('emptyTask')}
                    textClasses={`cursor-pointer ${action.completed ? 'line-through text-brand-text-secondary dark:text-dark-text-secondary' : 'text-brand-text-primary dark:text-dark-text-primary'}`}
                    inputClasses={`w-full bg-transparent border-b border-brand-primary focus:outline-none ${action.completed ? 'line-through text-brand-text-secondary dark:text-dark-text-secondary' : 'text-brand-text-primary dark:text-dark-text-primary'}`}
                 />
              </div>
              <button onClick={() => onDeleteAction(action.id)} className="opacity-0 group-hover:opacity-100 text-brand-text-secondary dark:text-dark-text-secondary hover:text-brand-error dark:hover:text-dark-text-primary transition-opacity p-1 rounded-full">
                  <TrashIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddAction} className="flex items-center gap-2 mt-3 ms-7">
            <input 
              type="text"
              value={newActionText}
              onChange={(e) => setNewActionText(e.target.value)}
              placeholder={t('addKeyAction')}
              className="flex-grow h-8 bg-transparent border-b-2 border-slate-200 dark:border-dark-border rounded-none px-0 text-sm text-brand-text-primary dark:text-dark-text-primary focus:ring-0 focus:outline-none focus:border-brand-primary transition duration-200"
            />
            <button type="submit" className="flex-shrink-0 bg-slate-200 dark:bg-dark-elev1 hover:bg-slate-300 dark:hover:bg-dark-surface text-brand-text-primary dark:text-dark-text-primary font-semibold w-8 h-8 flex items-center justify-center rounded-lg transition-colors">
              <PlusIcon className="w-4 h-4" />
            </button>
          </form>
      </div>
    </div>
  );
};

export default ActionPlanDisplay;