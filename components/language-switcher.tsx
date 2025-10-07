"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import type { Language, LanguagesMap } from "@/lib/i18n";
import { languages } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

interface LanguageSwitcherProps {
  currentLanguage?: Language;
  onLanguageChange?: (language: Language) => void;
  displayLanguage?: Language; 
}

export function LanguageSwitcher({
  currentLanguage: currentLanguageProp,
  onLanguageChange: onLanguageChangeProp,
  displayLanguage: displayLanguageProp,
}: LanguageSwitcherProps) {
  let ctx;
  try {
    ctx = useLanguage();
  } catch {
    ctx = undefined;
  }
  const currentLanguage = currentLanguageProp ?? ctx?.lang;
  const onLanguageChange = onLanguageChangeProp ?? ctx?.setLang;
  const displayLanguage = displayLanguageProp ?? (currentLanguage as Language) ?? ("en" as Language);
  const activeLang: Language = (currentLanguage ?? "en") as Language;
  const entries = Object.entries(languages) as [Language, LanguagesMap[Language]][];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span>{languages[activeLang].flag}</span>
          <span className="hidden sm:inline">{languages[activeLang].label[displayLanguage]}</span>
          <span className="sm:hidden">{activeLang.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="mt-2.5 mr-[-18px]">
        {entries.map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => {
              if (onLanguageChange) onLanguageChange(code);
            }}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label[displayLanguage]}</span>
            </span>
            {activeLang === code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
