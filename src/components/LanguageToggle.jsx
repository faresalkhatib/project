// src/components/LanguageToggle.js
import React from "react";
import { Button, Icon } from "semantic-ui-react";
import { useLanguage } from "../i18n/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      onClick={toggleLanguage}
      style={{
        backgroundColor: "#8B0000",
        color: "#ffffff",
        borderRadius: "8px",
        padding: "0.7rem 1.2rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontWeight: "600",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#c41e3a";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#8B0000";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Icon name="language" />
      {language === "ar" ? "English" : "العربية"}
    </Button>
  );
};

export default LanguageToggle;
