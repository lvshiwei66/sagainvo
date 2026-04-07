"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import { Invoice, LineItem, defaultInvoice } from "@/lib/types";
import { calculateTotals } from "@/lib/calculator";
import { saveInvoice, loadInvoice } from "@/lib/storage";

export default function EditorPage() {
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
    saveInvoice(invoice);
  }, [invoice]);

  const updateInvoice = (updates: Partial<Invoice>) => {
    setInvoice((prev) => ({ ...prev, ...updates }));
  };

  const updateLineItem = (index: number, updates: Partial<LineItem>) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...updates } : item)),
    }));
  };

  const addLineItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, rate: 0 }],
    }));
  };

  const removeLineItem = (index: number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const totals = calculateTotals(invoice.items, invoice.taxRate);

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="lg:ml-64">
        <div className="flex flex-col lg:flex-row">
          {/* Editor Section */}
          <div className="flex-1 p-6">
            <InvoiceForm
              invoice={invoice}
              onUpdate={updateInvoice}
              onLineItemChange={updateLineItem}
              onAddLineItem={addLineItem}
              onRemoveLineItem={removeLineItem}
            />
          </div>

          {/* Preview Section */}
          <div className="w-full lg:w-[450px] p-6">
            <InvoicePreview
              invoice={invoice}
              totals={totals}
              className="sticky top-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
