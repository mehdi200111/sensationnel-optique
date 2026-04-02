import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'fr', name: 'FR', flag: '🇫🇷' },
    { code: 'en', name: 'EN', flag: '🇬🇧' },
    { code: 'ar', name: 'AR', flag: '🇸🇦' }
  ];

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-md p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`
            px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${i18n.language === lang.code 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }
          `}
          title={lang.name}
        >
          <span className="mr-2">{lang.flag}</span>
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
