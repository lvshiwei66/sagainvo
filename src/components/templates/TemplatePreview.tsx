import React from 'react';
import { InvoiceTemplate } from '@/lib/types';

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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{template.name}</h2>
              <p className="text-slate-600 mt-1">{template.description}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {template.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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

          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Template Preview</h3>
              <p className="text-slate-500">This represents how the "{template.name}" template would look when applied to your invoice.</p>
            </div>
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