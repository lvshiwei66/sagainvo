"use client";

import { Invoice, Totals, InvoiceTemplate } from "@/lib/types";
import { exportPDFWithLogo, exportCSV } from "@/lib/pdf-export";
import { useI18n } from "@/i18n/context";

interface InvoicePreviewProps {
  invoice: Invoice;
  totals: Totals;
  template?: InvoiceTemplate;  // Optional template for theme customization
  className?: string;
}

export default function InvoicePreview({
  invoice,
  totals,
  template,
  className,
}: InvoicePreviewProps) {
  const { tCommon, tInvoice } = useI18n();

  // Default values when no template is applied
  const themeColor = template?.themeColor || '#2563EB'; // Default to primary blue
  const textFontFamily = template?.textFont || 'sans';
  const numberFontFamily = template?.numberFont || 'sans';

  // Map font preferences to CSS classes
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
    await exportPDFWithLogo(invoice, totals);
  };

  const handleExportCSV = () => {
    exportCSV(invoice, totals);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={className}>
      <div className="shadow-sm overflow-hidden">
        {/* Invoice Preview */}
        <div className="pb-6 drop-shadow-md">
          <div
            className="border p-6 bg-white"
            style={{
              // Apply theme color to borders if needed
              borderColor: themeColor !== '#2563EB' ? themeColor : undefined
            }}
          >
            {/* Invoice Title and Logo */}
            <div className="flex justify-between items-start mb-6">
              <div className="text-center">
                <h1
                  className={`text-2xl font-light text-slate-900 tracking-wide ${getTextFontClass()}`}
                  style={{
                    // Apply theme color to title if it's different from default
                    color: themeColor !== '#2563EB' ? themeColor : undefined
                  }}
                >
                  {tInvoice("title")}
                </h1>
              </div>
              {invoice.logoUrl && (
                <div className="max-w-[120px] max-h-[60px]">
                  <img
                    src={invoice.logoUrl}
                    alt="Company Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Invoice Meta */}
            <div className="flex justify-between mb-6">
              <div className={`text-sm text-slate-600 ${getTextFontClass()}`}>
                <div>
                  <span className="font-medium">{tInvoice("meta.invoiceNumber")}</span>{" "}
                  <span className={getNumberFontClass()}>{invoice.number || "---"}</span>
                </div>
                <div>
                  <span className="font-medium">{tInvoice("meta.date")}</span>{" "}
                  <span className={getNumberFontClass()}>{invoice.date || "---"}</span>
                </div>
                <div>
                  <span className="font-medium">{tInvoice("meta.dueDate")}</span>{" "}
                  <span className={getNumberFontClass()}>{invoice.dueDate || "---"}</span>
                </div>
              </div>
            </div>

            {/* From / To */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className={`text-sm font-medium text-slate-500 mb-2 ${getTextFontClass()}`}>
                  {tInvoice("from")}
                </h3>
                <div className={`text-sm text-slate-900 ${getTextFontClass()}`}>
                  <div style={{ color: themeColor !== '#2563EB' ? themeColor : undefined }}>
                    {invoice.from.businessName || "---"}
                  </div>
                  {invoice.from.address && <div>{invoice.from.address}</div>}
                  {(invoice.from.cityStateZip || invoice.from.country) && (
                    <div>
                      {[invoice.from.cityStateZip, invoice.from.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                  {invoice.from.email && <div>{invoice.from.email}</div>}
                  {invoice.from.phone && <div>{invoice.from.phone}</div>}
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-medium text-slate-500 mb-2 ${getTextFontClass()}`}>
                  {tInvoice("to")}
                </h3>
                <div className={`text-sm text-slate-900 ${getTextFontClass()}`}>
                  <div style={{ color: themeColor !== '#2563EB' ? themeColor : undefined }}>
                    {invoice.to.clientName || "---"}
                  </div>
                  {invoice.to.company && <div>{invoice.to.company}</div>}
                  {invoice.to.address && <div>{invoice.to.address}</div>}
                  {(invoice.to.cityStateZip || invoice.to.country) && (
                    <div>
                      {[invoice.to.cityStateZip, invoice.to.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                  {invoice.to.email && <div>{invoice.to.email}</div>}
                  {invoice.to.phone && <div>{invoice.to.phone}</div>}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full mb-6">
              <thead>
                <tr className="border-b" style={{ borderColor: themeColor !== '#2563EB' ? themeColor : undefined }}>
                  <th className={`text-left text-sm font-medium text-slate-500 py-2 ${getTextFontClass()}`}>
                    {tInvoice("table.description")}
                  </th>
                  <th className={`text-right text-sm font-medium text-slate-500 py-2 ${getTextFontClass()}`}>
                    {tInvoice("table.qty")}
                  </th>
                  <th className={`text-right text-sm font-medium text-slate-500 py-2 ${getTextFontClass()}`}>
                    {tInvoice("table.rate")}
                  </th>
                  <th className={`text-right text-sm font-medium text-slate-500 py-2 ${getTextFontClass()}`}>
                    {tInvoice("table.amount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-0"
                    style={{ borderColor: themeColor !== '#2563EB' ? themeColor : undefined }}
                  >
                    <td className={`py-3 text-sm text-slate-900 ${getTextFontClass()}`}>
                      {item.description || "---"}
                    </td>
                    <td className={`py-3 text-sm text-slate-600 text-right ${getNumberFontClass()}`}>
                      {item.quantity}
                    </td>
                    <td className={`py-3 text-sm text-slate-600 text-right ${getNumberFontClass()}`}>
                      <span className={getNumberFontClass()}>${item.rate.toFixed(2)}</span>
                    </td>
                    <td className={`py-3 text-sm font-mono text-slate-900 text-right ${getNumberFontClass()}`}>
                      <span className={getNumberFontClass()}>${(item.quantity * item.rate).toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-48 space-y-2">
                <div className={`flex justify-between text-sm ${getTextFontClass()}`}>
                  <span className="text-slate-600">{tInvoice("totals.subtotal")}</span>
                  <span className={`text-slate-900 ${getNumberFontClass()}`}>
                    <span className={getNumberFontClass()}>${totals.subtotal.toFixed(2)}</span>
                  </span>
                </div>
                <div className={`flex justify-between text-sm ${getTextFontClass()}`}>
                  <span className="text-slate-600">
                    {tInvoice("totals.tax", { rate: invoice.taxRate })}
                  </span>
                  <span className={`text-slate-900 ${getNumberFontClass()}`}>
                    <span className={getNumberFontClass()}>${totals.taxAmount.toFixed(2)}</span>
                  </span>
                </div>
                <div
                  className={`flex justify-between text-base font-medium border-t pt-2 ${getTextFontClass()}`}
                  style={{
                    borderColor: themeColor !== '#2563EB' ? themeColor : undefined
                  }}
                >
                  <span className="text-slate-900">{tInvoice("totals.total")}</span>
                  <span
                    className={`text-slate-900 ${getNumberFontClass()}`}
                    style={{ color: themeColor !== '#2563EB' ? themeColor : undefined }}
                  >
                    <span className={getNumberFontClass()}>${totals.total.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            {(invoice.notes || invoice.terms) && (
              <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t"
                style={{ borderColor: themeColor !== '#2563EB' ? themeColor : undefined }}>
                {invoice.notes && (
                  <div>
                    <h3 className={`text-sm font-medium text-slate-500 mb-1 ${getTextFontClass()}`}>
                      {tInvoice("notes")}
                    </h3>
                    <p className={`text-sm text-slate-600 ${getTextFontClass()}`}>{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <h3 className={`text-sm font-medium text-slate-500 mb-1 ${getTextFontClass()}`}>
                      {tInvoice("terms")}
                    </h3>
                    <p className={`text-sm text-slate-600 ${getTextFontClass()}`}>{invoice.terms}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Export Actions */}
        <div className="px-6 py-4 bg-white border-t flex gap-3">
          <button
            onClick={handleExportPDF}
            className="flex-1 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {tCommon("actions.downloadPDF")}
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            {tCommon("actions.downloadCSV")}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            {tCommon("actions.print")}
          </button>
        </div>
      </div>
    </div>
  );
}