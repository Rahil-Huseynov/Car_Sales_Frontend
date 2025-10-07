"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Language } from "@/lib/i18n";
import { defaultLanguage, getStoredLanguage, setStoredLanguage } from "@/lib/i18n";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    const stored = getStoredLanguage();
    if (stored) setLangState(stored);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    setStoredLanguage(newLang);
  };

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
