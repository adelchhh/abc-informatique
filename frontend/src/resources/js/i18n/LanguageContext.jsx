import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Récupérer la langue sauvegardée dans localStorage ou utiliser 'fr' par défaut
    return localStorage.getItem('language') || 'fr';
  });

  // Sauvegarder la langue dans localStorage quand elle change
  useEffect(() => {
    localStorage.setItem('language', language);
    // Appliquer la direction pour l'arabe
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  // Fonction pour obtenir la traduction
  const t = (key) => {
    return translations[language]?.[key] || translations.fr[key] || key;
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
