import { Invoice, Totals, InvoiceTemplate } from "@/lib/types";

interface InvoicePrintViewProps {
  invoice: Invoice;
  totals: Totals;
  template?: InvoiceTemplate;
  className?: string;
}

export default function InvoicePrintView({
  invoice,
  totals,
  template,
  className = "",
}: InvoicePrintViewProps) {
  const themeColor = template?.themeColor || '#2563EB';
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

  return (
    <div className={`bg-white p-8 ${className}`}>
      <div
        className="border bg-white"
        style={{
          borderColor: themeColor,
          fontFamily: textFontFamily === 'serif' ? 'Georgia, serif' :
                     textFontFamily === 'mono' ? 'Courier New, monospace' :
                     'Inter, sans-serif'
        }}
      >
        {/* Title and Logo */}
        <div className="flex justify-between items-start p-6 border-b" style={{ borderColor: themeColor }}>
          <div className="text-center">
            <h1
              className="text-2xl font-light tracking-wide"
              style={{ color: themeColor }}
            >
              INVOICE
            </h1>
            {invoice.number && (
              <div className={`mt-2 font-medium ${getNumberFontClass()}`} style={{ color: themeColor }}>
                #{invoice.number}
              </div>
            )}
          </div>
          {invoice.logoUrl && (
            <div className="max-w-[120px] max-h-[60px]">
              <img src={invoice.logoUrl} alt="Company Logo" className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>

        {/* Meta Information */}
        <div className="p-6 border-b" style={{ borderColor: themeColor }}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="font-medium mb-1">Date</div>
              <div className={getNumberFontClass()}>{invoice.date || "---"}</div>
            </div>
            <div>
              <div className="font-medium mb-1">Due Date</div>
              <div className={getNumberFontClass()}>{invoice.dueDate || "---"}</div>
            </div>
            <div>
              <div className="font-medium mb-1">Invoice #</div>
              <div className={getNumberFontClass()}>{invoice.number || "---"}</div>
            </div>
          </div>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-2 gap-6 p-6 border-b" style={{ borderColor: themeColor }}>
          <div>
            <h3 className={`text-sm font-medium mb-3 ${getTextFontClass()}`}>From:</h3>
            <div className={getTextFontClass()}>
              <div style={{ color: themeColor }}>{invoice.from.businessName || "---"}</div>
              {invoice.from.address && <div>{invoice.from.address}</div>}
              {(invoice.from.cityStateZip || invoice.from.country) && (
                <div>{[invoice.from.cityStateZip, invoice.from.country].filter(Boolean).join(", ")}</div>
              )}
              {invoice.from.email && <div>{invoice.from.email}</div>}
              {invoice.from.phone && <div>{invoice.from.phone}</div>}
            </div>
          </div>
          <div>
            <h3 className={`text-sm font-medium mb-3 ${getTextFontClass()}`}>To:</h3>
            <div className={getTextFontClass()}>
              <div style={{ color: themeColor }}>{invoice.to.clientName || "---"}</div>
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
        <div className="p-6 border-b" style={{ borderColor: themeColor }}>
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: themeColor }}>
                <th className={`text-left py-2 ${getTextFontClass()}`}>Description</th>
                <th className={`text-right py-2 ${getTextFontClass()}`}>Qty</th>
                <th className={`text-right py-2 ${getTextFontClass()}`}>Rate</th>
                <th className={`text-right py-2 ${getTextFontClass()}`}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b last:border-0" style={{ borderColor: themeColor }}>
                  <td className={`py-3 ${getTextFontClass()}`}>{item.description || "---"}</td>
                  <td className={`py-3 text-right ${getNumberFontClass()}`}>{item.quantity}</td>
                  <td className={`py-3 text-right ${getNumberFontClass()}`}>${item.rate.toFixed(2)}</td>
                  <td className={`py-3 text-right ${getNumberFontClass()}`}>${(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-6">
          <div className="flex justify-end">
            <div className="w-48 space-y-2">
              <div className={`flex justify-between ${getTextFontClass()}`}>
                <span>Subtotal:</span>
                <span className={getNumberFontClass()}>${totals.subtotal.toFixed(2)}</span>
              </div>
              {invoice.taxRate && invoice.taxRate > 0 && (
                <div className={`flex justify-between ${getTextFontClass()}`}>
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span className={getNumberFontClass()}>${totals.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div
                className={`flex justify-between pt-2 border-t ${getTextFontClass()}`}
                style={{ borderColor: themeColor }}
              >
                <span className="font-medium">Total:</span>
                <span
                  className={getNumberFontClass()}
                  style={{ color: themeColor }}
                >
                  ${totals.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        {(invoice.notes || invoice.terms) && (
          <div className="p-6 border-t" style={{ borderColor: themeColor }}>
            <div className="grid grid-cols-2 gap-6">
              {invoice.notes && (
                <div>
                  <h3 className={`text-sm font-medium mb-2 ${getTextFontClass()}`}>Notes:</h3>
                  <p className={`${getTextFontClass()} text-sm`}>{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h3 className={`text-sm font-medium mb-2 ${getTextFontClass()}`}>Terms:</h3>
                  <p className={`${getTextFontClass()} text-sm`}>{invoice.terms}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}