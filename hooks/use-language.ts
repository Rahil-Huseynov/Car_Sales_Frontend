"use client"

import { useState, useEffect } from "react"
import { type Language, defaultLanguage } from "@/lib/i18n"

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["az", "en", "ru"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  return { language, changeLanguage }
}
