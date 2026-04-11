'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TemplateSelector from '@/components/templates/TemplateSelector';
import { demoTemplates } from '@/lib/templates/demo-templates';
import { InvoiceTemplate } from '@/lib/types';
import { useI18n } from '@/i18n/context';

export default function TemplatesPage() {
  const { tCommon } = useI18n();
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null);

  const handleTemplateSelect = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    // Here we would typically redirect to the editor with the selected template
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">{tCommon('templates.title')}</h1>
            <p className="mt-2 text-slate-600">
              {tCommon('templates.subtitle')}
            </p>
          </div>

          {selectedTemplate ? (
            <div
              className="bg-white rounded-lg shadow-sm p-6 mb-6"
              style={{ borderLeft: `4px solid ${selectedTemplate.themeColor}` }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-slate-900">{tCommon('templates.usingTemplate')} {selectedTemplate.name}</h2>
                  <p className="text-slate-600">{selectedTemplate.description}</p>

                  {/* Display template theme characteristics */}
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">{tCommon('templates.themeColor')}:</span>
                      <div className="flex items-center mt-1">
                        <div
                          className="w-4 h-4 rounded mr-2 border"
                          style={{ backgroundColor: selectedTemplate.themeColor }}
                        ></div>
                        <span>{selectedTemplate.themeColor}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">{tCommon('templates.textFont')}:</span>
                      <span className={`ml-2 px-2 py-1 rounded ${selectedTemplate.textFont === 'sans' ? 'font-family-sans' : selectedTemplate.textFont === 'serif' ? 'font-family-serif' : 'font-family-mono'}`}>
                        {selectedTemplate.textFont}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">{tCommon('templates.numberFont')}:</span>
                      <span className={`ml-2 px-2 py-1 rounded ${selectedTemplate.numberFont === 'sans' ? 'font-family-sans' : selectedTemplate.numberFont === 'serif' ? 'font-family-serif' : 'font-family-mono'}`}>
                        {selectedTemplate.numberFont}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
                >
                  {tCommon('templates.chooseDifferent')}
                </button>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700">
                  {tCommon('templates.selectedTemplateMessage1')}<strong>{selectedTemplate.name}</strong>{tCommon('templates.selectedTemplateMessage2')}{selectedTemplate.themeColor}{tCommon('templates.selectedTemplateMessage3')}{selectedTemplate.textFont}{tCommon('templates.selectedTemplateMessage4')}{selectedTemplate.numberFont}{tCommon('templates.selectedTemplateMessage5')}
                </p>
                <a
                  href="/editor"
                  className="mt-4 inline-block px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
                >
                  {tCommon('templates.createWithTemplate')}
                </a>
              </div>
            </div>
          ) : null}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <TemplateSelector onSelect={handleTemplateSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}