import React from 'react';
import { InvoiceTemplate } from '@/lib/types';
import TemplateThumbnail from './TemplateThumbnail';

interface TemplatePreviewProps {
  template: InvoiceTemplate;
  onClose: () => void;
  onSelect: () => void;
}

export default function TemplatePreview({
  template,
  onClose,
  onSelect
}: TemplatePreviewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{template.name}</h2>
              <p className="text-slate-600 mt-1">{template.description}</p>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-6 border border-slate-200 rounded-lg p-4 min-h-[400px]">
            <TemplateThumbnail
              themeColor={template.themeColor}
              textFont={template.textFont}
              numberFont={template.numberFont}
              category={template.category}
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
            <button
              onClick={onSelect}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}