import React from 'react';
import { useI18n } from '@/i18n/context';
import SettingsSection from './SettingsSection';

const LanguageSettings: React.FC = () => {
  const { locale, tCommon, setLocale } = useI18n();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh-CN', name: '中文', nativeName: '中文' },
  ];

  const handleLanguageChange = (langCode: string) => {
    if (locale !== langCode) {
      setLocale(langCode as 'en' | 'zh-CN');
    }
  };

  return (
    <SettingsSection
      title={tCommon('settings.language.title') || 'Language'}
      description={tCommon('settings.language.description') || 'Choose your preferred language'}
    >
      <div className="space-y-3">
        {languages.map((lang) => (
          <div key={lang.code} className="flex items-center">
            <input
              id={`language-${lang.code}`}
              name="language"
              type="radio"
              checked={locale === lang.code}
              onChange={() => handleLanguageChange(lang.code)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <label
              htmlFor={`language-${lang.code}`}
              className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              {lang.name}
            </label>
          </div>
        ))}
      </div>
    </SettingsSection>
  );
};

export default LanguageSettings;
