"use client";

import { Invoice, Totals } from "@/lib/types";
import { exportPDFWithLogo, exportCSV } from "@/lib/pdf-export";
import { useI18n } from "@/i18n/context";

interface InvoicePreviewProps {
  invoice: Invoice;
  totals: Totals;
  className?: string;
}

export default function InvoicePreview({
  invoice,
  totals,
  className,
}: InvoicePreviewProps) {
  const { tCommon, tInvoice } = useI18n();

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
          <div className="border p-6 bg-white">
            {/* Invoice Title and Logo */}
            <div className="flex justify-between items-start mb-6">
              <div className="text-center">
                <h1 className="text-2xl font-light text-slate-900 tracking-wide">
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
              <div className="text-sm text-slate-600">
                <div>
                  <span className="font-medium">{tInvoice("meta.invoiceNumber")}</span>{" "}
                  {invoice.number || "---"}
                </div>
                <div>
                  <span className="font-medium">{tInvoice("meta.date")}</span>{" "}
                  {invoice.date || "---"}
                </div>
                <div>
                  <span className="font-medium">{tInvoice("meta.dueDate")}</span>{" "}
                  {invoice.dueDate || "---"}
                </div>
              </div>
            </div>

            {/* From / To */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">
                  {tInvoice("from")}
                </h3>
                <div className="text-sm text-slate-900">
                  {invoice.from.businessName || "---"}
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
                <h3 className="text-sm font-medium text-slate-500 mb-2">{tInvoice("to")}</h3>
                <div className="text-sm text-slate-900">
                  {invoice.to.clientName || "---"}
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
                <tr className="border-b">
                  <th className="text-left text-sm font-medium text-slate-500 py-2">
                    {tInvoice("table.description")}
                  </th>
                  <th className="text-right text-sm font-medium text-slate-500 py-2">
                    {tInvoice("table.qty")}
                  </th>
                  <th className="text-right text-sm font-medium text-slate-500 py-2">
                    {tInvoice("table.rate")}
                  </th>
                  <th className="text-right text-sm font-medium text-slate-500 py-2">
                    {tInvoice("table.amount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 text-sm text-slate-900">
                      {item.description || "---"}
                    </td>
                    <td className="py-3 text-sm text-slate-600 text-right">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-sm text-slate-600 text-right">
                      ${item.rate.toFixed(2)}
                    </td>
                    <td className="py-3 text-sm font-mono text-slate-900 text-right">
                      ${(item.quantity * item.rate).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-48 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{tInvoice("totals.subtotal")}</span>
                  <span className="font-mono text-slate-900">
                    ${totals.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    {tInvoice("totals.tax", { rate: invoice.taxRate })}
                  </span>
                  <span className="font-mono text-slate-900">
                    ${totals.taxAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-medium border-t pt-2">
                  <span className="text-slate-900">{tInvoice("totals.total")}</span>
                  <span className="font-mono text-slate-900">
                    ${totals.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            {(invoice.notes || invoice.terms) && (
              <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t">
                {invoice.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1">
                      {tInvoice("notes")}
                    </h3>
                    <p className="text-sm text-slate-600">{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1">
                      {tInvoice("terms")}
                    </h3>
                    <p className="text-sm text-slate-600">{invoice.terms}</p>
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