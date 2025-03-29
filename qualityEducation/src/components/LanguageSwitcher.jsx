// src/components/LanguageSwitcher.jsx
import React, { useContext } from "react";
import { TranslationContext } from "../context/TranslationContext";

const LanguageSwitcher = () => {
  const { language, setLanguage, isTranslating } = useContext(TranslationContext);

  const handleChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
  };

  return (
    <div className="language-switcher">
      <select 
        value={language} 
        onChange={handleChange}
        disabled={isTranslating}
        className={isTranslating ? 'translating' : ''}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="de">Deutsch</option>
        <option value="zh-Hans">中文 (简体)</option>
        <option value="ja">日本語</option>
        <option value="ko">한국어</option>
        <option value="ar">العربية</option>
        <option value="ru">Русский</option>
        <option value="pt">Português</option>
        <option value="it">Italiano</option>
      </select>
      {isTranslating && <span className="loading-indicator">...</span>}
    </div>
  );
};

export default LanguageSwitcher;