// src/context/TranslationContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Context
export const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default: English
  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);

  const apiKey = import.meta.env.VITE_AZURE_TRANSLATOR_KEY;
  const endpoint = import.meta.env.VITE_AZURE_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com';
  const region = import.meta.env.VITE_AZURE_TRANSLATOR_REGION || 'canadaeast';

  // Function to translate text
  const translateText = async (text) => {
    if (!text || language === 'en' || !apiKey) return text; // Skip if English or missing API key
  
    try {
      const response = await axios.post(
        `${endpoint}/translate?api-version=3.0&to=${language}`,
        [{ Text: text }],
        {
          headers: {
            'Ocp-Apim-Subscription-Key': apiKey,
            'Content-type': 'application/json',
            'Ocp-Apim-Subscription-Region': region,
          },
        }
      );
      return response.data[0].translations[0].text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // fallback to original text on error
    }
  };

  // Function to translate a whole object of text (e.g., Navbar labels)
  const translateObject = async (obj) => {
    if (language === 'en' || !apiKey) {
      setTranslations(obj);
      return;
    }

    setIsTranslating(true);
    const keys = Object.keys(obj);
    
    try {
      const results = await Promise.all(
        keys.map((key) => translateText(obj[key]))
      );

      const newTranslations = keys.reduce((acc, key, index) => {
        acc[key] = results[index];
        return acc;
      }, {});

      setTranslations(newTranslations);
    } catch (error) {
      console.error('Translation batch error:', error);
      setTranslations(obj); // Fallback to original texts
    } finally {
      setIsTranslating(false);
    }
  };

  // Common UI elements to translate when language changes
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
  }, [language]); // Re-translate when language changes

  return (
    <TranslationContext.Provider value={{ 
      language, 
      setLanguage, 
      translations, 
      translateText,
      translateObject,
      isTranslating 
    }}>
      {children}
    </TranslationContext.Provider>
  );
};