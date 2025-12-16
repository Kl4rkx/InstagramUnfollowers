import { useEffect, useState } from "react";
import { Language, LANGUAGE_STORAGE_KEY, translations, TranslationKey } from "../constants/translations";

// Detect preferred language from browser settings and approximate location (timezone heuristic)
const detectPreferredLanguage = (): Language => {
  // Browser language preference takes priority
  const nav = typeof navigator !== "undefined" ? navigator : undefined;
  const candidates = nav?.languages?.length ? nav.languages : nav?.language ? [nav.language] : [];
  const normalized = candidates.map(code => code.toLowerCase());

  const fromLang = normalized.find(code => code.startsWith("es") || code.startsWith("en"));
  if (fromLang) {
    return fromLang.startsWith("es") ? "es" : "en";
  }

  // Fallback: timezone heuristic for Spanish-speaking regions
  const timeZone = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "";
  const spanishTimeZones = [
    "Europe/Madrid",
    "Atlantic/Canary",
    "America/Mexico_City",
    "America/Bogota",
    "America/Lima",
    "America/Santiago",
    "America/Buenos_Aires",
    "America/Montevideo",
    "America/Asuncion",
    "America/Caracas",
    "America/Guayaquil",
    "America/La_Paz",
    "America/Panama",
    "America/Santo_Domingo",
  ];

  if (timeZone && spanishTimeZones.indexOf(timeZone) !== -1) {
    return "es";
  }

  return "en";
};

export function useTranslation() {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === "es" || savedLanguage === "en") {
      return savedLanguage;
    }
    return detectPreferredLanguage();
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
