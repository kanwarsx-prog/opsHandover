import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
    const [fontSize, setFontSize] = useState('medium');

    // Load preferences from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const savedFontSize = localStorage.getItem('fontSize') || 'medium';

        setTheme(savedTheme);
        setFontSize(savedFontSize);
    }, []);

    // Apply theme and font size to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-font-size', fontSize);

        // Save to localStorage
        localStorage.setItem('theme', theme);
        localStorage.setItem('fontSize', fontSize);
    }, [theme, fontSize]);

    const toggleTheme = () => {
        setTheme(prev => {
            if (prev === 'dark') return 'light';
            if (prev === 'light') return 'high-contrast';
            return 'dark';
        });
    };

    const value = {
        theme,
        setTheme,
        fontSize,
        setFontSize,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
