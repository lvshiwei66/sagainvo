import React, { useState } from 'react';
import { InvoiceTemplate } from '@/lib/types';
import TemplateGallery from './TemplateGallery';

interface TemplateSelectorProps {
  onSelect: (template: InvoiceTemplate) => void;
}

export default function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-900">Choose a Template</h3>
      <TemplateGallery onSelect={onSelect} />
    </div>
  );
}