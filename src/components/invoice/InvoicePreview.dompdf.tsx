"use client";

import { Invoice, Totals, InvoiceTemplate } from "@/lib/types";
import { exportPDFWithLogo } from "@/lib/dompdf-export"; // Use new dompdf export
import { exportToJpg } from "@/lib/image-export";
import { useRef, useLayoutEffect, useState } from "react";

const DEFAULT_THEME_COLOR = '#2563EB';
const A4_HEIGHT_MM = 297; // Standard A4 height in mm
const A4_WIDTH_MM = 210; // Standard A4 width in mm

interface InvoicePreviewProps {
  invoice: Invoice;
  totals: Totals;
  template?: InvoiceTemplate;
  className?: string;
}

export default function InvoicePreview({
  invoice,
  totals,
  template,
  className,
}: InvoicePreviewProps) {
  // We keep this ref to potentially share the DOM element with dompdf
  const invoiceContainerRef = useRef<HTMLDivElement>(null);

  const themeColor = template?.themeColor || DEFAULT_THEME_COLOR;
  const textFontFamily = template?.textFont || 'sans';
  const numberFontFamily = template?.numberFont || 'sans';

  const getTextFontClass = () => {
    switch(textFontFamily) {
      case 'serif': return 'font-family-serif';
      case 'mono': return 'font-family-mono';
      default: return 'font-family-sans';
    }
  };

  const getNumberFontClass = () => {
    switch(numberFontFamily) {
      case 'serif': return 'font-family-serif';
      case 'mono': return 'font-family-mono';
      default: return 'font-family-sans';
    }
  };

  const handleExportPDF = async () => {
    // Get the actual rendered dimensions of the invoice container before export
    if (invoiceContainerRef.current) {
      const rect = invoiceContainerRef.current.getBoundingClientRect();
      // Log removed for production: console.log(`Invoice container rendered dimensions: ${rect.width.toFixed(2)}x${rect.height.toFixed(2)}px`);
    }

    // Pass invoice data to dompdf export function
    await exportPDFWithLogo(invoice, totals);
  };

  const handleExportJPG = async () => {
    try {
      // 获取预览容器元素，使用更精确的选择器
      const previewContainer = document.querySelector('.drop-shadow-md');
      if (previewContainer) {
        // 给预览容器添加一个临时ID以便截图
        previewContainer.setAttribute('id', 'invoice-preview-container');

        // 添加临时类名以确保在截图期间应用正确的样式
        previewContainer.classList.add('screenshot-mode');

        await exportToJpg(invoice, totals, 'invoice-preview-container');

        // 移除临时ID和类名
        previewContainer.removeAttribute('id');
        previewContainer.classList.remove('screenshot-mode');
      } else {
        throw new Error('Invoice preview container not found');
      }
    } catch (error) {
      // Removed console.error for production, keeping user feedback
      alert('Failed to export to JPG. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={className}>
      <h2 className="text-lg font-medium text-slate-900 mb-4">Invoice Preview</h2>
      <div className="shadow-sm overflow-hidden">
        <div className="pb-6 drop-shadow-md">
          <div
            ref={invoiceContainerRef} // Reference for potential direct DOM access
            className="invoice-container border p-4 bg-white max-w-[210mm] mx-auto shadow-md"
            style={{
              borderColor: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined,
              width: `${A4_WIDTH_MM}mm`,
              minHeight: 'unset', // Let content determine actual height instead of fixed A4 height
              maxWidth: '100%',
              boxSizing: 'border-box',
              margin: '0 auto',
              fontSize: '12px',
            }}
          >
            {/* Title and Logo */}
            <div className="flex justify-between items-start mb-4">
              <div className="text-center">
                <h1
                  className={`text-2xl font-light text-slate-900 tracking-wide ${getTextFontClass()}`}
                  style={{ color: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined }}
                >
                  INVOICE
                </h1>
                {invoice.number && (
                  <div className={`text-lg font-medium mt-1 ${getNumberFontClass()}`}>
                    #{invoice.number}
                  </div>
                )}
              </div>
              {invoice.logoUrl && (
                <div className="max-w-[120px] max-h-[60px]">
                  <img
                    src={invoice.logoUrl}
                    alt="Company Logo"
                    className="max-w-full max-h-full object-contain"
                    crossOrigin="anonymous"  // Important for dompdf.js when dealing with images
                  />
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="flex justify-between mb-4">
              <div className={`text-sm text-slate-600 ${getTextFontClass()}`}>
                <div>
                  <span className="font-medium">Date:</span>{" "}
                  <span className={getNumberFontClass()}>{invoice.date || "---"}</span>
                </div>
                <div>
                  <span className="font-medium">Due Date:</span>{" "}
                  <span className={getNumberFontClass()}>{invoice.dueDate || "---"}</span>
                </div>
              </div>
            </div>

            {/* From / To */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className={`text-sm font-medium text-slate-500 mb-2 ${getTextFontClass()}`}>From:</h3>
                <div className={`text-sm text-slate-900 ${getTextFontClass()}`}>
                  <div style={{ color: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined }}>
                    {invoice.from.businessName || "---"}
                  </div>
                  {invoice.from.address && <div>{invoice.from.address}</div>}
                  {(invoice.from.cityStateZip || invoice.from.country) && (
                    <div>{[invoice.from.cityStateZip, invoice.from.country].filter(Boolean).join(", ")}</div>
                  )}
                  {invoice.from.email && <div>{invoice.from.email}</div>}
                  {invoice.from.phone && <div>{invoice.from.phone}</div>}
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-medium text-slate-500 mb-2 ${getTextFontClass()}`}>To:</h3>
                <div className={`text-sm text-slate-900 ${getTextFontClass()}`}>
                  <div style={{ color: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined }}>
                    {invoice.to.clientName || "---"}
                  </div>
                  {invoice.to.company && <div>{invoice.to.company}</div>}
                  {invoice.to.address && <div>{invoice.to.address}</div>}
                  {(invoice.to.cityStateZip || invoice.to.country) && (
                    <div>{[invoice.to.cityStateZip, invoice.to.country].filter(Boolean).join(", ")}</div>
                  )}
                  {invoice.to.email && <div>{invoice.to.email}</div>}
                  {invoice.to.phone && <div>{invoice.to.phone}</div>}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full mb-4">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined }}
                >
                  <th className={`text-left text-sm font-medium text-slate-500 py-2 ${getTextFontClass()}`}>Description</th>
                  <th className={`text-right text-sm font-medium text-slate-500 py-2 ${getTextFontClass()}`}>Qty</th>
                  <th className={`text-right text-sm font-medium text-slate-500 py-2 ${getTextFontClass()}`}>Rate</th>
                  <th className={`text-right text-sm font-medium text-slate-500 py-2 ${getTextFontClass()}`}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-0"
                    style={{ borderColor: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined }}
                  >
                    <td className={`py-2 text-sm text-slate-900 ${getTextFontClass()}`}>{item.description || "---"}</td>
                    <td className={`py-2 text-sm text-slate-600 text-right ${getNumberFontClass()}`}>{item.quantity}</td>
                    <td className={`py-2 text-sm text-slate-600 text-right ${getNumberFontClass()}`}>${item.rate.toFixed(2)}</td>
                    <td className={`py-2 text-sm text-slate-900 text-right ${getNumberFontClass()}`}>${(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-48 space-y-2">
                <div className={`flex justify-between text-sm ${getTextFontClass()}`}>
                  <span className="text-slate-600">Subtotal:</span>
                  <span className={`text-slate-900 ${getNumberFontClass()}`}>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-sm ${getTextFontClass()}`}>
                  <span className="text-slate-600">Tax</span>
                  <span className={`text-slate-900 ${getNumberFontClass()}`}>${totals.taxAmount.toFixed(2)}</span>
                </div>
                <div
                  className={`flex justify-between text-base font-medium border-t pt-2 ${getTextFontClass()}`}
                  style={{ borderColor: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined }}
                >
                  <span className="text-slate-900">Total:</span>
                  <span
                    className={`text-slate-900 ${getNumberFontClass()}`}
                    style={{ color: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined }}
                  >
                    ${totals.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            {(invoice.notes || invoice.terms) && (
              <div
                className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t"
                style={{
                  borderColor: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined,
                  minHeight: 'unset',
                }}
              >
                {invoice.notes && (
                  <div className="break-words">
                    <h3 className={`text-sm font-medium text-slate-500 mb-1 ${getTextFontClass()}`}>Notes:</h3>
                    <p className={`text-sm text-slate-600 ${getTextFontClass()} whitespace-pre-wrap`} style={{ wordBreak: 'break-word' }}>{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div className="break-words">
                    <h3 className={`text-sm font-medium text-slate-500 mb-1 ${getTextFontClass()}`}>Terms:</h3>
                    <p className={`text-sm text-slate-600 ${getTextFontClass()} whitespace-pre-wrap`} style={{ wordBreak: 'break-word' }}>{invoice.terms}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Export Actions */}
        <div className="px-6 py-4 bg-white border-t flex gap-3">
          <button onClick={handleExportPDF} className="flex-1 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-medium transition-colors">
            Download PDF
          </button>
          <button onClick={handleExportJPG} className="flex-1 border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-md font-medium transition-colors">
            Download JPG
          </button>
          <button onClick={handlePrint} className="flex-1 border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-md font-medium transition-colors">
            Print
          </button>
        </div>
      </div>
    </div>
  );
}