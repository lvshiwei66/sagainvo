import React, { useState } from 'react';
import { InvoiceTemplate } from '@/lib/types';
import TemplateGallery from './TemplateGallery';
import { useI18n } from '@/i18n/context';

interface TemplateSelectorProps {
  onSelect: (template: InvoiceTemplate) => void;
}

export default function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const { tCommon } = useI18n();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-900">{tCommon('templates.chooseTemplate')}</h3>
      <TemplateGallery onSelect={onSelect} />
    </div>
  );
}