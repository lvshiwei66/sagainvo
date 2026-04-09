import React from 'react';
import { InvoiceTemplate } from '@/lib/types';

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
              Built-in
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-slate-500 line-clamp-2">{template.description}</p>

        <div className="mt-3 flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 p-4 min-h-[120px] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center mb-1">
            <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs text-slate-500">Template Preview</p>
        </div>
      </div>
    </div>
  );
}