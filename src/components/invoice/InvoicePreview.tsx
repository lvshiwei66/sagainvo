"use client";

import { Invoice, Totals, InvoiceTemplate } from "@/lib/types";
import { exportPDFWithLogo } from "@/lib/pdf-export";
import { exportToJpg } from "@/lib/image-export";
import { useRef, useLayoutEffect, useState } from "react";

// 本地定义 LayoutMeasurements 类型以避免导出问题
interface LayoutMeasurements {
  headerTopY: number;
  headerBottomY: number;
  bodyRowLineYs: number[];
  notesTermsLineY: number | null;
}

const DEFAULT_THEME_COLOR = '#2563EB';

interface InvoicePreviewProps {
  invoice: Invoice;
  totals: Totals;
  template?: InvoiceTemplate;
  className?: string;
  onLoadDemoData?: () => void;
}

export default function InvoicePreview({
  invoice,
  totals,
  template,
  className,
  onLoadDemoData,
}: InvoicePreviewProps) {
  const headerRowRef = useRef<HTMLTableRowElement>(null);
  const bodyRowsRefs = useRef<HTMLTableRowElement[]>([]);
  const notesTermsRef = useRef<HTMLDivElement>(null);

  const [measurements, setMeasurements] = useState<LayoutMeasurements | null>(null);

  const themeColor = template?.themeColor || DEFAULT_THEME_COLOR;
  const textFontFamily = template?.textFont || 'sans';
  const numberFontFamily = template?.numberFont || 'sans';

  // Measure DOM elements after layout
  useLayoutEffect(() => {
    const measure = () => {
      const headerRow = headerRowRef.current;
      const bodyRows = bodyRowsRefs.current.filter(Boolean);
      const notesTerms = notesTermsRef.current;

      if (!headerRow || bodyRows.length === 0) return;

      const headerRect = headerRow.getBoundingClientRect();
      const notesTermsRect = notesTerms?.getBoundingClientRect() ?? null;

      setMeasurements({
        headerTopY: headerRect.top,
        headerBottomY: headerRect.bottom,
        bodyRowLineYs: bodyRows.map((row) => row.getBoundingClientRect().bottom),
        notesTermsLineY: notesTermsRect?.top ?? null,
      });
    };

    // Measure after fonts load
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        setTimeout(measure, 50);
      });
    } else {
      setTimeout(measure, 100);
    }
  }, [invoice, totals, template]);

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
    await exportPDFWithLogo(invoice, totals, measurements);
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
      console.error('Failed to export to JPG:', error);
      alert('Failed to export to JPG. Please try again.');
    }
  };

  const handlePrint = () => {
    // 获取发票预览包装器元素
    const previewWrapper = document.querySelector('.invoice-preview-wrapper');

    if (previewWrapper) {
      // 为预览包装器添加打印类，激活CSS中的打印样式
      previewWrapper.classList.add('invoice-print-area');

      // 定义清理函数
      const cleanup = () => {
        setTimeout(() => {
          previewWrapper.classList.remove('invoice-print-area');
        }, 100);
        window.removeEventListener('afterprint', cleanup);
      };

      // 添加打印完成事件监听器
      window.addEventListener('afterprint', cleanup);

      // 触发浏览器打印功能
      window.print();
    } else {
      // 如果找不到发票预览元素，使用普通打印
      window.print();
    }
  };

  return (
    <div className={className}>
      <h2 className="text-lg font-medium text-slate-900 mb-4">Invoice Preview</h2>
      <div className="shadow-sm overflow-hidden">
        {/* Invoice preview container with specific class for print targeting */}
        <div className="invoice-preview-wrapper pb-6 drop-shadow-md">
          <div
            className="border p-6 bg-white"
            style={{ borderColor: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined }}
          >
            {/* Title and Logo */}
            <div className="flex justify-between items-start mb-6">
              <div className="text-center">
                <h1
                  className={`text-2xl font-light text-slate-900 tracking-wide ${getTextFontClass()}`}
                  style={{ color: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined }}
                >
                  INVOICE
                </h1>
              </div>
              {invoice.logoUrl && (
                <div className="max-w-[120px] max-h-[60px]">
                  <img src={invoice.logoUrl} alt="Company Logo" className="max-w-full max-h-full object-contain" />
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="flex justify-between mb-6">
              <div className={`text-sm text-slate-600 ${getTextFontClass()}`}>
                <div>
                  <span className="font-medium">Invoice #:</span>{" "}
                  <span className={getNumberFontClass()}>{invoice.number || "---"}</span>
                </div>
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
            <div className="grid grid-cols-2 gap-6 mb-6">
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
            <table className="w-full mb-6">
              <thead>
                <tr
                  ref={headerRowRef}
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
                    ref={(el) => { if (el) bodyRowsRefs.current[index] = el; }}
                    className="border-b last:border-0"
                    style={{ borderColor: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined }}
                  >
                    <td className={`py-3 text-sm text-slate-900 ${getTextFontClass()}`}>{item.description || "---"}</td>
                    <td className={`py-3 text-sm text-slate-600 text-right ${getNumberFontClass()}`}>{item.quantity}</td>
                    <td className={`py-3 text-sm text-slate-600 text-right ${getNumberFontClass()}`}>${item.rate.toFixed(2)}</td>
                    <td className={`py-3 text-sm text-slate-900 text-right ${getNumberFontClass()}`}>${(item.quantity * item.rate).toFixed(2)}</td>
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
                ref={notesTermsRef}
                className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t"
                style={{ borderColor: themeColor !== DEFAULT_THEME_COLOR ? themeColor : undefined }}
              >
                {invoice.notes && (
                  <div>
                    <h3 className={`text-sm font-medium text-slate-500 mb-1 ${getTextFontClass()}`}>Notes:</h3>
                    <p className={`text-sm text-slate-600 ${getTextFontClass()}`}>{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <h3 className={`text-sm font-medium text-slate-500 mb-1 ${getTextFontClass()}`}>Terms:</h3>
                    <p className={`text-sm text-slate-600 ${getTextFontClass()}`}>{invoice.terms}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Export Actions - will be hidden during print */}
        <div className="no-print px-6 py-4 bg-white border-t flex gap-3">
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
