import React, { useState, useRef, useEffect } from "react";
import { Language } from "../constants/translations";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSelector = ({ currentLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        className="language-selector__button"
        onClick={() => setIsOpen(!isOpen)}
        title="Change language / Cambiar idioma"
        aria-label="Change language / Cambiar idioma"
        aria-expanded={isOpen}
      >
        <svg
          className="language-selector__icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z"
            fill="currentColor"
          />
        </svg>
        <span className="language-selector__current">{currentLanguage.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="language-selector__dropdown">
          <button
            className={`language-selector__option ${currentLanguage === "en" ? "active" : ""}`}
            onClick={() => handleLanguageSelect("en")}
          >
            <span className="language-selector__flag">🇬🇧</span>
            <span className="language-selector__name">English</span>
          </button>
          <button
            className={`language-selector__option ${currentLanguage === "es" ? "active" : ""}`}
            onClick={() => handleLanguageSelect("es")}
          >
            <span className="language-selector__flag">🇪🇸</span>
            <span className="language-selector__name">Español</span>
          </button>
        </div>
      )}
    </div>
  );
};
