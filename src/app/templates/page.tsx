'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TemplateSelector from '@/components/templates/TemplateSelector';
import { demoTemplates } from '@/lib/templates/demo-templates';
import { InvoiceTemplate } from '@/lib/types';

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null);

  const handleTemplateSelect = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    // Here we would typically redirect to the editor with the selected template
    console.log('Selected template:', template);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Invoice Templates</h1>
            <p className="mt-2 text-slate-600">
              Choose from our professionally designed templates to create beautiful invoices.
            </p>
          </div>

          {selectedTemplate ? (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-slate-900">Using Template: {selectedTemplate.name}</h2>
                  <p className="text-slate-600">{selectedTemplate.description}</p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
                >
                  Choose Different Template
                </button>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700">
                  You've selected the <strong>{selectedTemplate.name}</strong> template.
                  Click the button below to start creating your invoice with this template.
                </p>
                <a
                  href="/editor"
                  className="mt-4 inline-block px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
                >
                  Create Invoice with Template
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