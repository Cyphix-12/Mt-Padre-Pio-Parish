import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSwitchProps {
  className?: string;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: 'en' | 'sw') => {
    if (language !== newLanguage) {
      setLanguage(newLanguage);
    }
  };

  return (
    <div className={`inline-flex bg-white border border-gray-200 rounded-full p-1 shadow-sm ${className}`}>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ${
          language === 'en'
            ? 'bg-blue-500 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('sw')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ${
          language === 'sw'
            ? 'bg-blue-500 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
        }`}
        aria-label="Switch to Swahili"
      >
        SW
      </button>
    </div>
  );
};

export default LanguageSwitch;
