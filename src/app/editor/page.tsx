"use client";

import { useState, useEffect } from "react";
import { useIsClient } from "usehooks-ts";
import Sidebar from "@/components/layout/Sidebar";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import InvoicePreview from "@/components/invoice/InvoicePreview.dompdf";
import { Invoice, LineItem, defaultInvoice, InvoiceTemplate } from "@/lib/types";
import { calculateTotals } from "@/lib/calculator";
import { saveInvoice, loadInvoice } from "@/lib/storage";
import { demoInvoiceData } from "@/lib/demo-data";

// 导入打印样式
import '@/styles/print.css';

export default function EditorPage() {
  const isClient = useIsClient();
  const [invoice, setInvoice] = useState<Invoice>(() => {
    // Load from localStorage on mount
    if (typeof window !== "undefined") {
      const saved = loadInvoice();
      if (saved) return saved;
    }
    return defaultInvoice;
  });

  // Auto-save to localStorage whenever invoice changes
  useEffect(() => {
    if (isClient) {
      saveInvoice(invoice);
    }
  }, [invoice, isClient]);

  const updateInvoice = (updates: Partial<Invoice>) => {
    setInvoice((prev) => ({ ...prev, ...updates }));
  };

  const updateLineItem = (index: number, updates: Partial<LineItem>) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, ...updates } : item,
      ),
    }));
  };

  const addLineItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, rate: 0 }],
    }));
  };

  const bulkAddLineItems = (items: LineItem[]) => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, ...items],
    }));
  };

  const clearLineItems = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [],
    }));
  };

  const removeLineItem = (index: number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const loadDemoData = () => {
    // Confirm with user before loading demo data if there's existing data
    if (invoice.items.length > 1 || invoice.from.businessName || invoice.to.clientName || invoice.number || invoice.date) {
      if (!window.confirm('This will replace your current invoice data with demo data. Continue?')) {
        return;
      }
    }

    setInvoice(demoInvoiceData);
  };

  const applyTemplate = (template: InvoiceTemplate) => {
    // Confirm with user before applying template if there's existing data
    if (invoice.items.length > 1 || invoice.from.businessName || invoice.to.clientName) {
      if (!window.confirm('This will replace your current invoice data with the template. Continue?')) {
        return;
      }
    }

    setInvoice(template.template);
  };

  const totals = calculateTotals(invoice.items, invoice.taxRate);

  // Prevent rendering until client-side hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="lg:ml-64 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="lg:ml-64">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-0px)]">
          {/* Editor Section with independent scroll */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-0px)]">
            <InvoiceForm
              invoice={invoice}
              onUpdate={updateInvoice}
              onLineItemChange={updateLineItem}
              onAddLineItem={addLineItem}
              onRemoveLineItem={removeLineItem}
              onApplyTemplate={applyTemplate}
              onBulkItemsAdd={bulkAddLineItems}
              onClearLineItems={clearLineItems}
            />
          </div>

          {/* Preview Section with independent scroll */}
          <div className="w-full lg:w-[50%] p-6 overflow-y-auto max-h-[calc(100vh-0px)] border-l ">
            <InvoicePreview invoice={invoice} totals={totals} className="" onLoadDemoData={loadDemoData} />
          </div>
        </div>
      </div>
    </div>
  );
}
