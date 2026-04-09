"use client";

import { Invoice, LineItem, InvoiceTemplate } from "@/lib/types";
import { X, RotateCcw } from "lucide-react";
import { useI18n } from '@/i18n/context';
import ImageUpload from "@/components/ui/ImageUpload";

interface InvoiceFormProps {
  invoice: Invoice;
  onUpdate: (updates: Partial<Invoice>) => void;
  onLineItemChange: (index: number, updates: Partial<LineItem>) => void;
  onAddLineItem: () => void;
  onRemoveLineItem: (index: number) => void;
  onLoadDemoData: () => void;
  onApplyTemplate?: (template: InvoiceTemplate) => void;
}

export default function InvoiceForm({
  invoice,
  onUpdate,
  onLineItemChange,
  onAddLineItem,
  onRemoveLineItem,
  onLoadDemoData,
  onApplyTemplate,
}: InvoiceFormProps) {
  const { tInvoice } = useI18n();

  return (
    <div className="space-y-6">
      {/* Invoice Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">
          {tInvoice('invoice.details.header') || 'Invoice Details'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {tInvoice('invoice.details.number') || 'Invoice Number'} *
            </label>
            <input
              type="text"
              value={invoice.number}
              onChange={(e) => onUpdate({ number: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={tInvoice('invoice.details.numberPlaceholder') || 'INV-001'}
              aria-label={tInvoice('invoice.details.number') || 'Invoice Number'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {tInvoice('invoice.details.date') || 'Date'} *
            </label>
            <input
              type="date"
              value={invoice.date}
              onChange={(e) => onUpdate({ date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label={tInvoice('invoice.details.date') || 'Date'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {tInvoice('invoice.details.dueDate') || 'Due Date'}
            </label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => onUpdate({ dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label={tInvoice('invoice.details.dueDate') || 'Due Date'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {tInvoice('invoice.details.taxRate') || 'Tax Rate (%)'}
            </label>
            <input
              type="number"
              value={invoice.taxRate}
              onChange={(e) =>
                onUpdate({ taxRate: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              step="0.1"
              min="0"
              max="100"
              aria-label={tInvoice('invoice.details.taxRate') || 'Tax Rate'}
            />
          </div>
        </div>
      </div>

      {/* Design Section with Logo */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">
          {tInvoice('invoice.design.header') || 'Design Elements'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <ImageUpload
            label={tInvoice('invoice.design.logoLabel') || 'Company Logo'}
            value={invoice.logoUrl}
            onChange={(logoUrl) => onUpdate({ logoUrl })}
          />
        </div>
      </div>

      {/* From Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">
          {tInvoice('invoice.from.header') || 'From (Your Business)'}
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            value={invoice.from.businessName}
            onChange={(e) =>
              onUpdate({
                from: { ...invoice.from, businessName: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={tInvoice('invoice.from.businessNamePlaceholder') || 'Business Name *'}
            aria-label={tInvoice('invoice.from.businessName') || 'Business Name'}
          />
          <input
            type="text"
            value={invoice.from.address}
            onChange={(e) =>
              onUpdate({ from: { ...invoice.from, address: e.target.value } })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={tInvoice('invoice.from.addressPlaceholder') || 'Street Address'}
            aria-label={tInvoice('invoice.from.address') || 'From Address'}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={invoice.from.cityStateZip}
              onChange={(e) =>
                onUpdate({
                  from: { ...invoice.from, cityStateZip: e.target.value },
                })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={tInvoice('invoice.from.locationPlaceholder') || 'City, State, ZIP'}
              aria-label={tInvoice('invoice.from.location') || 'From City, State, ZIP'}
            />
            <input
              type="text"
              value={invoice.from.country}
              onChange={(e) =>
                onUpdate({ from: { ...invoice.from, country: e.target.value } })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={tInvoice('invoice.from.countryPlaceholder') || 'Country'}
              aria-label={tInvoice('invoice.from.country') || 'From Country'}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="email"
              value={invoice.from.email}
              onChange={(e) =>
                onUpdate({ from: { ...invoice.from, email: e.target.value } })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={tInvoice('invoice.from.emailPlaceholder') || 'Email *'}
              aria-label={tInvoice('invoice.from.email') || 'From Email'}
            />
            <input
              type="tel"
              value={invoice.from.phone}
              onChange={(e) =>
                onUpdate({ from: { ...invoice.from, phone: e.target.value } })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={tInvoice('invoice.from.phonePlaceholder') || 'Phone'}
              aria-label={tInvoice('invoice.from.phone') || 'From Phone'}
            />
          </div>
        </div>
      </div>

      {/* To Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">{tInvoice('invoice.to.header') || 'To (Client)'}</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={invoice.to.clientName}
            onChange={(e) =>
              onUpdate({ to: { ...invoice.to, clientName: e.target.value } })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={tInvoice('invoice.to.clientNamePlaceholder') || 'Client Name *'}
            aria-label={tInvoice('invoice.to.clientName') || 'Client Name'}
          />
          <input
            type="text"
            value={invoice.to.company}
            onChange={(e) =>
              onUpdate({ to: { ...invoice.to, company: e.target.value } })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={tInvoice('invoice.to.companyPlaceholder') || 'Company'}
            aria-label={tInvoice('invoice.to.company') || 'Client Company'}
          />
          <input
            type="text"
            value={invoice.to.address}
            onChange={(e) =>
              onUpdate({ to: { ...invoice.to, address: e.target.value } })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={tInvoice('invoice.to.addressPlaceholder') || 'Street Address'}
            aria-label={tInvoice('invoice.to.address') || 'Client Address'}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={invoice.to.cityStateZip}
              onChange={(e) =>
                onUpdate({
                  to: { ...invoice.to, cityStateZip: e.target.value },
                })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={tInvoice('invoice.to.locationPlaceholder') || 'City, State, ZIP'}
              aria-label={tInvoice('invoice.to.location') || 'Client City, State, ZIP'}
            />
            <input
              type="text"
              value={invoice.to.country}
              onChange={(e) =>
                onUpdate({ to: { ...invoice.to, country: e.target.value } })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={tInvoice('invoice.to.countryPlaceholder') || 'Country'}
              aria-label={tInvoice('invoice.to.country') || 'Client Country'}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="email"
              value={invoice.to.email}
              onChange={(e) =>
                onUpdate({ to: { ...invoice.to, email: e.target.value } })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={tInvoice('invoice.to.emailPlaceholder') || 'Email'}
              aria-label={tInvoice('invoice.to.email') || 'Client Email'}
            />
            <input
              type="tel"
              value={invoice.to.phone}
              onChange={(e) =>
                onUpdate({ to: { ...invoice.to, phone: e.target.value } })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={tInvoice('invoice.to.phonePlaceholder') || 'Phone'}
              aria-label={tInvoice('invoice.to.phone') || 'Client Phone'}
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">{tInvoice('invoice.lineItems.header') || 'Line Items'}</h2>
        <div className="space-y-3">
          {invoice.items.map((item, index) => (
            <div key={index} className="flex gap-3 items-start group">
              <input
                type="text"
                value={item.description}
                onChange={(e) =>
                  onLineItemChange(index, { description: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={tInvoice('invoice.lineItems.descriptionPlaceholder') || 'Description'}
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  onLineItemChange(index, {
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                className="w-20 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={tInvoice('invoice.lineItems.quantityPlaceholder') || 'Qty'}
                min="0"
              />
              <input
                type="number"
                value={item.rate}
                onChange={(e) =>
                  onLineItemChange(index, {
                    rate: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-24 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={tInvoice('invoice.lineItems.ratePlaceholder') || 'Rate'}
                min="0"
                step="0.01"
              />
              <div className="w-24 py-2 text-right font-mono text-slate-900">
                ${(item.quantity * item.rate).toFixed(2)}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveLineItem(index);
                }}
                className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onAddLineItem}
          className="mt-4 w-full py-2 border-2 border-dashed border-slate-300 rounded-md text-slate-500 hover:border-primary hover:text-primary transition-colors"
        >
          {tInvoice('invoice.lineItems.addButton') || '+ Add Line Item'}
        </button>
      </div>

      {/* Notes and Terms */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {tInvoice('invoice.notes.label') || 'Notes'}
            </label>
            <textarea
              value={invoice.notes}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder={tInvoice('invoice.notes.placeholder') || 'Thank you for your business!'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {tInvoice('invoice.terms.label') || 'Terms'}
            </label>
            <textarea
              value={invoice.terms}
              onChange={(e) => onUpdate({ terms: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder={tInvoice('invoice.terms.placeholder') || 'Payment due within 30 days'}
            />
          </div>
        </div>
      </div>

      {/* Demo Data Button */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <button
          onClick={onLoadDemoData}
          className="w-full py-3 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          {tInvoice('invoice.demo.button') || 'Try Demo'}
        </button>
      </div>
    </div>
  );
}
