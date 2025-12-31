import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export const LanguageProvider = ({ children, defaultLanguage = "ar" }) => {
  const [language, setLanguage] = useState(defaultLanguage);
  const [direction, setDirection] = useState(
    defaultLanguage === "ar" ? "rtl" : "ltr"
  );

  useEffect(() => {
    const saved = localStorage.getItem("language");
    const lang = saved || defaultLanguage;
    setLanguage(lang);
    const dir = lang === "ar" ? "rtl" : "ltr";
    setDirection(dir);
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [defaultLanguage]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next = prev === "ar" ? "en" : "ar";
      const dir = next === "ar" ? "rtl" : "ltr";
      localStorage.setItem("language", next);
      document.documentElement.dir = dir;
      document.documentElement.lang = next;
      setDirection(dir);
      return next;
    });
  }, []);

  const t = useCallback(
    (key) => {
      if (!key) return "";
      const langObj = translations[language];
      if (!langObj) return key;
      return langObj[key] ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{ language, direction, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
