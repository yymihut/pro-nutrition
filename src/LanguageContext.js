import React, { createContext, useState } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  
// Funcție pentru a determina limba implicită
const getDefaultLanguage = () => {
  // Obținem limba din navigator (de ex. "en-US", "fr-FR", "de-DE", "ro-RO", etc.)
  const lang = navigator.language || navigator.userLanguage || "en";
  const langPrefix = lang.split("-")[0].toLowerCase();

  // Dacă limba este una din cele suportate, o returnăm, altfel folosim "en" ca fallback
  if (["ro", "fr", "de", "en"].includes(langPrefix)) {
    return langPrefix;
  }
  return "en";
};

// Setăm starea inițială cu limba detectată
const [language, setLanguage] = useState(getDefaultLanguage());

const toggleLanguage = (lang) => {
  if (["ro", "en", "fr", "de"].includes(lang)) {
    setLanguage(lang);
  }
};


  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
