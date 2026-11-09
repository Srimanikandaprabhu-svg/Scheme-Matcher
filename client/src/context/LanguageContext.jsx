import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations.js';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('scheme_lang') || 'en');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('scheme_font_size') || 'md');

  useEffect(() => {
    localStorage.setItem('scheme_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('scheme_font_size', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, fontSize, setFontSize, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
