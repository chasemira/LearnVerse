// src/context/TranslationContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { translateRemote } from '../lib/translationApi';

const STORAGE_KEY = 'appLanguage';

export const TranslationContext = createContext({
  language: 'en',
  setLanguage: () => {},
  translations: {},
  translateText: async (t) => t,
  translateObject: async () => {},
  isTranslating: false,
});

export const TranslationProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en';
    } catch {
      return 'en';
    }
  });
  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, []);

  const translateText = useCallback(
    async (text) => {
      if (!text || language === 'en') return text;
      return translateRemote(text, language);
    },
    [language]
  );

  const translateObject = useCallback(async (obj) => {
    if (language === 'en') {
      setTranslations(obj);
      return;
    }

    setIsTranslating(true);
    const keys = Object.keys(obj);

    try {
      const results = await Promise.all(
        keys.map((key) => translateRemote(obj[key], language))
      );

      const newTranslations = keys.reduce((acc, key, index) => {
        acc[key] = results[index];
        return acc;
      }, {});

      setTranslations(newTranslations);
    } catch (error) {
      console.error('Translation batch error:', error);
      setTranslations(obj);
    } finally {
      setIsTranslating(false);
    }
  }, [language]);

  useEffect(() => {
    translateObject({
      home: 'Home',
      contact: 'Contacts',
      services: 'Services',
      multilingual: 'Multilingual Resources',
      skills: 'Skills Marketplace',
      login: 'Login',
      logout: 'Logout',
      profile: 'Profile',
      search: 'Search in site',
    });
  }, [language, translateObject]);

  return (
    <TranslationContext.Provider
      value={{
        language,
        setLanguage,
        translations,
        translateText,
        translateObject,
        isTranslating,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};
