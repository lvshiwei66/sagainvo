import React from 'react';
import { InvoiceTemplate } from '@/lib/types';
import TemplateThumbnail from './TemplateThumbnail';
import { useI18n } from '@/i18n/context';

interface TemplateCardProps {
  template: InvoiceTemplate;
  isSelected?: boolean;
  onClick: () => void;
}

export default function TemplateCard({
  template,
  isSelected = false,
  onClick
}: TemplateCardProps) {
  const { tCommon } = useI18n();

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'
      }`}
      onClick={onClick}
      data-testid="template-card"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-slate-900 truncate">{template.name}</h3>
          {template.isDefault && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {tCommon('templates.builtIn')}
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-slate-500 line-clamp-2">{template.description}</p>
      </div>

      <div className="border-t border-slate-200 p-2">
        <TemplateThumbnail
          themeColor={template.themeColor}
          textFont={template.textFont}
          numberFont={template.numberFont}
          category={template.category}
        />
      </div>
    </div>
  );
}