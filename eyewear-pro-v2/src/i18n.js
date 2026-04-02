import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des fichiers de traduction
import frTranslation from './locales/fr.json';
import enTranslation from './locales/en.json';
import arTranslation from './locales/ar.json';

const resources = {
  fr: {
    translation: frTranslation
  },
  en: {
    translation: enTranslation
  },
  ar: {
    translation: arTranslation
  }
};

// Configuration de i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'fr', // Langue par défaut: français
    fallbackLng: 'fr',
    debug: false,

    // Options de détection de langue
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false
    }
  });

// Gestion du changement de langue
i18n.on('languageChanged', (lng) => {
  // Sauvegarder la langue dans localStorage
  localStorage.setItem('language', lng);
  
  // Appliquer les attributs RTL/LTR pour l'arabe
  if (lng === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lng;
  }
});

// Appliquer la configuration initiale au chargement
const currentLanguage = i18n.language;
if (currentLanguage === 'ar') {
  document.documentElement.dir = 'rtl';
  document.documentElement.lang = 'ar';
} else {
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = currentLanguage;
}

export default i18n;
