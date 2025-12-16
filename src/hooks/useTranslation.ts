import { useEffect, useState } from "react";
import { Language, LANGUAGE_STORAGE_KEY, translations, TranslationKey } from "../constants/translations";

export function useTranslation() {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (savedLanguage === "es" || savedLanguage === "en") ? savedLanguage : "en";
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey, replacements?: Record<string, string | number>): string => {
    let text: string = translations[language][key];
    
    if (replacements) {
      for (const placeholder in replacements) {
        if (replacements.hasOwnProperty(placeholder)) {
          const value = replacements[placeholder];
          text = text.replace(`{${placeholder}}`, String(value));
        }
      }
    }
    
    return text;
  };

  return { language, setLanguage, t };
}
