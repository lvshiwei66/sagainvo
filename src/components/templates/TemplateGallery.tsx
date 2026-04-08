'use client';

import { useState } from 'react';
import { InvoiceTemplate } from '@/lib/types';
import TemplateCard from './TemplateCard';
import TemplatePreview from './TemplatePreview';
import { demoTemplates } from '@/lib/templates/demo-templates';

interface TemplateGalleryProps {
  onSelect: (template: InvoiceTemplate) => void;
}

export default function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  const [showPreview, setShowPreview] = useState<InvoiceTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'modern' | 'classic' | 'minimal' | 'colorful'>('all');

  const filteredTemplates = filter === 'all'
    ? demoTemplates
    : demoTemplates.filter(template => template.category === filter);

  const handleSelect = (template: InvoiceTemplate) => {
    setSelectedTemplate(template.id);
    onSelect(template);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 rounded-full text-sm ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-sm ${
            filter === 'modern'
              ? 'bg-primary text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
          onClick={() => setFilter('modern')}
        >
          Modern
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-sm ${
            filter === 'classic'
              ? 'bg-primary text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
          onClick={() => setFilter('classic')}
        >
          Classic
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-sm ${
            filter === 'minimal'
              ? 'bg-primary text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
          onClick={() => setFilter('minimal')}
        >
          Minimal
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-sm ${
            filter === 'colorful'
              ? 'bg-primary text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
          onClick={() => setFilter('colorful')}
        >
          Colorful
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onClick={() => setShowPreview(template)}
          />
        ))}
      </div>

      {showPreview && (
        <TemplatePreview
          template={showPreview}
          onClose={() => setShowPreview(null)}
          onSelect={() => {
            handleSelect(showPreview);
            setShowPreview(null);
          }}
        />
      )}
    </div>
  );
}