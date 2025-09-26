import React, { createContext, useContext, useState, useEffect } from 'react';

const TranslationContext = createContext();

export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};

export const TranslationProvider = ({ children }) => {
    const [language, setLanguage] = useState('mk'); // Default to Macedonian
    const [translations, setTranslations] = useState({});

    // Load translations based on selected language
    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const translationModule = await import(`../translations/${language}.json`);
                setTranslations(translationModule.default);
            } catch (error) {
                console.error('Error loading translations:', error);
                // Fallback to Macedonian (main language)
                try {
                    const macedonianModule = await import('../translations/mk.json');
                    setTranslations(macedonianModule.default);
                } catch (fallbackError) {
                    console.error('Error loading fallback translations:', fallbackError);
                    setTranslations({});
                }
            }
        };

        loadTranslations();
    }, [language]);

    // Translation function with variable replacement
    const t = (key, variables = {}) => {
        let translation = translations[key];

        // If translation not found, return the key (you can modify this behavior)
        if (!translation) {
            console.warn(`Translation missing for key: ${key} in language: ${language}`);
            return key;
        }

        // Replace variables like {{variableName}}
        Object.keys(variables).forEach(variable => {
            translation = translation.replace(`{{${variable}}}`, variables[variable]);
        });

        return translation;
    };

    const switchLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('preferredLanguage', lang);
    };

    // Initialize language from localStorage or default to Macedonian
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');

        if (savedLanguage) {
            setLanguage(savedLanguage);
        } else {
            // Default to Macedonian if no preference saved
            setLanguage('mk');
            localStorage.setItem('preferredLanguage', 'mk');
        }
    }, []);

    const value = {
        t,
        language,
        switchLanguage,
        availableLanguages: [
            { code: 'mk', name: 'Macedonian', nativeName: 'Македонски' },
            { code: 'en', name: 'English', nativeName: 'English' }
        ]
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
};