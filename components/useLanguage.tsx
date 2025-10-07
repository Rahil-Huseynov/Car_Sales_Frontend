"use client";
import { useState, useEffect } from "react";
import { defaultLanguage, getStoredLanguage, setStoredLanguage, Language } from "@/lib/i18n";

export function useDefaultLanguage() {
  const [lang, setLang] = useState<Language>(defaultLanguage);

  useEffect(() => {
    const stored = getStoredLanguage();
    if (stored) setLang(stored);
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    setStoredLanguage(newLang);
  };

  return { lang, setLang: changeLanguage };
}
