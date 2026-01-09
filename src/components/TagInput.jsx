import React, { useState, useRef, useEffect } from 'react';
import '../styles/tagInput.css';

const TagInput = ({ tags = [], onTagsChange, placeholder = 'Add tags...', disabled = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);

    // Common tag suggestions
    const commonTags = [
        'documentation', 'runbook', 'sop', 'training',
        'security', 'compliance', 'infrastructure', 'deployment',
        'monitoring', 'backup', 'recovery', 'testing',
        'configuration', 'architecture', 'integration'
    ];

    useEffect(() => {
        if (inputValue.trim()) {
            const filtered = commonTags.filter(tag =>
                tag.toLowerCase().includes(inputValue.toLowerCase()) &&
                !tags.includes(tag)
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [inputValue, tags]);

    const addTag = (tag) => {
        const trimmedTag = tag.trim().toLowerCase();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            onTagsChange([...tags, trimmedTag]);
            setInputValue('');
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const removeTag = (tagToRemove) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        addTag(suggestion);
        inputRef.current?.focus();
    };

    return (
        <div className="tag-input-container">
            <div className={`tag-input-wrapper ${disabled ? 'disabled' : ''}`}>
                <div className="tags-list">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag-chip">
                            {tag}
                            {!disabled && (
                                <button
                                    type="button"
                                    className="tag-remove"
                                    onClick={() => removeTag(tag)}
                                    aria-label={`Remove ${tag}`}
                                >
                                    ×
                                </button>
                            )}
                        </span>
                    ))}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className="tag-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    disabled={disabled}
                />
            </div>

            {showSuggestions && (
                <div className="tag-suggestions">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            className="tag-suggestion"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {tags.length === 0 && !inputValue && (
                <p className="tag-hint">
                    Press Enter to add a tag. Common tags will be suggested as you type.
                </p>
            )}
        </div>
    );
};

export default TagInput;
