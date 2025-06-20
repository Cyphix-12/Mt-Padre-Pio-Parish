import React, { useState, useEffect } from 'react';

interface LanguageSwitchProps {
  onLanguageChange?: (language: string) => void;
  className?: string;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ 
  onLanguageChange, 
  className = '' 
}) => {
  const [language, setLanguage] = useState('en');

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') || 'en';
    setLanguage(savedLanguage);
    onLanguageChange?.(savedLanguage);
  }, [onLanguageChange]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferred-language', newLanguage);
    onLanguageChange?.(newLanguage);
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