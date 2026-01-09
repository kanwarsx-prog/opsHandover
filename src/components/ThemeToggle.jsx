import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/themeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    const getThemeIcon = () => {
        switch (theme) {
            case 'dark':
                return '🌙';
            case 'light':
                return '☀️';
            case 'high-contrast':
                return '◐';
            default:
                return '🌙';
        }
    };

    const getThemeLabel = () => {
        switch (theme) {
            case 'dark':
                return 'Dark';
            case 'light':
                return 'Light';
            case 'high-contrast':
                return 'High Contrast';
            default:
                return 'Dark';
        }
    };

    return (
        <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Current theme: ${getThemeLabel()}. Click to switch.`}
            aria-label={`Switch theme. Current: ${getThemeLabel()}`}
        >
            <span className="theme-icon">{getThemeIcon()}</span>
            <span className="theme-label">{getThemeLabel()}</span>
        </button>
    );
};

export default ThemeToggle;
