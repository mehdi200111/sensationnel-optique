import { useTranslation } from 'react-i18next';

// Hook personnalisé pour les traductions avec gestion RTL
export const useAppTranslation = () => {
  const { t, i18n } = useTranslation();
  
  return {
    t,
    currentLanguage: i18n.language,
    isRTL: i18n.language === 'ar',
    changeLanguage: i18n.changeLanguage
  };
};

// Export par défaut pour compatibilité
export { useTranslation };
export default useAppTranslation;
