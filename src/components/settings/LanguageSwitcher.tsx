// src/components/settings/LanguageSwitcher.tsx
import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '@/i18n/context';

const LanguageSwitcher = () => {
  const { locale } = useI18n();

  // Get current language's native name for display
  const getNativeName = () => {
    if (locale === 'zh-CN') {
      return '中文';
    }
    return 'English';
  };

  return (
    <div className="mt-2 px-3 py-2 text-xs text-gray-400">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span>{getNativeName()}</span>
      </div>
    </div>
  );
};

export default LanguageSwitcher;