// src/utils/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import ar from "../locales/ar.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;

// Safe wrapper for ESLint
export const changeLanguage = (lang: string | undefined) => {
  if (typeof lang !== "string") return; // ✅ prevents ESLint "possibly undefined" warning
  if (!i18n || typeof i18n.changeLanguage !== "function") return;
  i18n.changeLanguage(lang);
};
