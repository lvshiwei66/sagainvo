import React from 'react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-3">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="mt-2">
        {children}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4"></div>
    </div>
  );
};

export default SettingsSection;