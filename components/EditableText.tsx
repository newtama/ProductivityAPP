import React, { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
    initialText: string;
    onSave: (newText: string) => void;
    isTextarea?: boolean;
    placeholder?: string;
    textClasses: string;
    inputClasses: string;
}

const EditableText: React.FC<EditableTextProps> = ({ initialText, onSave, isTextarea = false, placeholder, textClasses, inputClasses }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(initialText);
    const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

    const handleSave = () => {
        if (text.trim() && text.trim() !== initialText.trim()) {
            onSave(text.trim());
        } else {
            // Revert if the text is empty or unchanged
            setText(initialText);
        }
        setIsEditing(false);
    };

    useEffect(() => {
        setText(initialText);
    }, [initialText]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isTextarea) {
            handleSave();
            e.preventDefault();
        }
        if (e.key === 'Escape') {
            setText(initialText);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        const commonProps = {
            ref: inputRef,
            value: text,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setText(e.target.value),
            onBlur: handleSave,
            onKeyDown: handleKeyDown,
            className: inputClasses,
            placeholder: placeholder,
        };
        return isTextarea ? <textarea {...commonProps} rows={3} /> : <input type="text" {...commonProps} />;
    }

    return (
        <div onClick={() => setIsEditing(true)} className={`${textClasses} min-h-[24px] cursor-pointer w-full`}>
            {text || <span className="text-brand-text-secondary/60 dark:text-dark-text-secondary">{placeholder}</span>}
        </div>
    );
};

export default EditableText;
