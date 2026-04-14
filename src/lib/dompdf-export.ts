import { Invoice, Totals } from "./types";
import dompdf from "dompdf.js";

// Define A4 dimensions - use actual A4 size
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
// Pixel to mm conversion factor (96 DPI standard)
const PX_TO_MM = 0.264583;

/**
 * DOM measurements from InvoicePreview component
 * All values in pixels relative to viewport
 * Kept for API compatibility, though not used with dompdf
 */
export interface LayoutMeasurements {
  // Table header top and bottom Y positions
  headerTopY: number;
  headerBottomY: number;
  // Each body row's bottom Y position (where border lines should be)
  bodyRowLineYs: number[];
  // Notes/terms section top Y position (for its border line)
  notesTermsLineY: number | null;
}

/**
 * Export invoice as PDF using dompdf.js
 * This function takes the DOM element from the preview and converts it directly to PDF
 */
export async function exportPDFWithLogo(
  invoice: Invoice,
  totals: Totals,
  // measurements parameter kept for compatibility but not used with dompdf
  measurements?: LayoutMeasurements | null
): Promise<void> {
  try {
    // Find the invoice container in the DOM
    const invoiceElement = document.querySelector('.invoice-container') as HTMLElement;

    if (!invoiceElement) {
      console.error('Invoice container not found in DOM');
      // If not found in DOM, we'll need to temporarily create it for conversion
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.className = 'invoice-container';
      document.body.appendChild(tempDiv);

      // Create the invoice content as HTML in the temp container
      createInvoiceHtmlContent(tempDiv, invoice, totals);

      try {
        const pdfResult = await dompdf(tempDiv, {
          pagination: true,
          format: 'a4',
          useCORS: true,
          backgroundColor: '#ffffff',
          precision: 16,
          pageConfig: {
            header: {
              content: '',      // 删除页眉
              height: 0,
            },
            footer: {
              content: '',      // 删除页脚
              height: 0,
            },
          },
        });

        const link = document.createElement('a');
        const pdfBlob = pdfResult as Blob;
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `${invoice.number || "invoice"}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } finally {
        document.body.removeChild(tempDiv);
      }
    } else {
      // Use getBoundingClientRect() to get the exact rendered dimensions
      const rect = invoiceElement.getBoundingClientRect();
      const contentHeightPx = rect.height;
      const contentHeightMm = contentHeightPx * PX_TO_MM;

      console.log(`Invoice container dimensions: ${rect.width.toFixed(2)}x${contentHeightPx.toFixed(2)}px (${(contentHeightMm).toFixed(2)}mm height)`);

      // Store original styles for restoration
      const originalStyles = {
        width: invoiceElement.style.width,
        minHeight: invoiceElement.style.minHeight,
        height: invoiceElement.style.height,
        boxSizing: invoiceElement.style.boxSizing,
        padding: invoiceElement.style.padding,
        fontSize: invoiceElement.style.fontSize,
        margin: invoiceElement.style.margin,
      };

      // Set A4 width and let dompdf handle pagination automatically
      invoiceElement.style.width = `${A4_WIDTH_MM}mm`;
      invoiceElement.style.boxSizing = 'border-box';
      invoiceElement.style.padding = '16px';
      invoiceElement.style.fontSize = '12px';
      invoiceElement.style.margin = '0 auto';

      // Force reflow to ensure the new width is applied
      void invoiceElement.offsetHeight;

      try {
        const pdfResult = await dompdf(invoiceElement, {
          pagination: true,
          format: 'a4',
          useCORS: true,
          backgroundColor: '#ffffff',
          precision: 16,
          pageConfig: {
            header: {
              content: '',      // 删除页眉
              height: 0,
            },
            footer: {
              content: '',      // 删除页脚
              height: 0,
            },
          },
        });

        const link = document.createElement('a');
        const pdfBlob = pdfResult as Blob;
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `${invoice.number || "invoice"}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } finally {
        // Restore original styles
        invoiceElement.style.width = originalStyles.width;
        invoiceElement.style.minHeight = originalStyles.minHeight;
        invoiceElement.style.height = originalStyles.height;
        invoiceElement.style.boxSizing = originalStyles.boxSizing;
        invoiceElement.style.padding = originalStyles.padding;
        invoiceElement.style.fontSize = originalStyles.fontSize;
        invoiceElement.style.margin = originalStyles.margin;
      }
    }
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('Failed to generate PDF: ' + (error as Error).message);
    throw error;
  }
}

/**
 * Populates a DOM element with invoice content (for temporary container)
 */
function createInvoiceHtmlContent(container: HTMLElement, invoice: Invoice, totals: Totals): void {
  const themeColor = '#2563EB'; // Default theme color

  // Create the invoice content as DOM elements instead of HTML string
  container.innerHTML = '';

  // Apply A4 page styles to ensure proper sizing
  container.style.width = '210mm';
  container.style.minHeight = 'unset'; // Allow content to determine actual height
  container.style.height = 'auto'; // Let DOMPDF calculate actual height
  container.style.boxSizing = 'border-box';
  container.style.padding = '16px';  // Reduced from 24px to save space
  container.style.backgroundColor = '#ffffff';
  container.style.margin = '0 auto';
  container.style.fontSize = '12px';  // Consistent font size with preview

  // Title and Logo
  const headerDiv = document.createElement('div');
  headerDiv.style.display = 'flex';
  headerDiv.style.justifyContent = 'space-between';
  headerDiv.style.alignItems = 'flex-start';
  headerDiv.style.marginBottom = '24px';

  const titleDiv = document.createElement('div');
  titleDiv.style.textAlign = 'center';

  const h1 = document.createElement('h1');
  h1.textContent = 'INVOICE';
  h1.style.color = themeColor;
  h1.style.fontSize = '24px';
  h1.style.fontWeight = 'normal';
  h1.style.textAlign = 'center';
  h1.style.marginBottom = '10px';

  titleDiv.appendChild(h1);

  if (invoice.number) {
    const numberDiv = document.createElement('div');
    numberDiv.textContent = `#${invoice.number}`;
    numberDiv.style.fontSize = '16px';
    numberDiv.style.fontWeight = 'bold';
    titleDiv.appendChild(numberDiv);
  }

  headerDiv.appendChild(titleDiv);

  if (invoice.logoUrl) {
    const logoDiv = document.createElement('div');
    logoDiv.style.maxWidth = '120px';
    logoDiv.style.maxHeight = '60px';

    const logoImg = document.createElement('img');
    logoImg.src = invoice.logoUrl;
    logoImg.alt = 'Company Logo';
    logoImg.style.maxWidth = '100%';
    logoImg.style.maxHeight = '100%';
    logoImg.style.objectFit = 'contain';

    logoDiv.appendChild(logoImg);
    headerDiv.appendChild(logoDiv);
  }

  container.appendChild(headerDiv);

  // Dates
  const metaInfoDiv = document.createElement('div');
  metaInfoDiv.style.fontSize = '14px';
  metaInfoDiv.style.color = '#64748b';
  metaInfoDiv.style.marginBottom = '24px';

  if (invoice.date) {
    const dateDiv = document.createElement('div');
    dateDiv.innerHTML = `<strong>Date:</strong> ${invoice.date}`;
    metaInfoDiv.appendChild(dateDiv);
  }

  if (invoice.dueDate) {
    const dueDateDiv = document.createElement('div');
    dueDateDiv.innerHTML = `<strong>Due Date:</strong> ${invoice.dueDate}`;
    metaInfoDiv.appendChild(dueDateDiv);
  }

  container.appendChild(metaInfoDiv);

  // From / To
  const fromToContainer = document.createElement('div');
  fromToContainer.style.display = 'grid';
  fromToContainer.style.gridTemplateColumns = '1fr 1fr';
  fromToContainer.style.gap = '24px';
  fromToContainer.style.marginBottom = '24px';

  // From section
  const fromDiv = document.createElement('div');
  const fromTitle = document.createElement('div');
  fromTitle.textContent = 'From:';
  fromTitle.style.fontSize = '14px';
  fromTitle.style.color = '#64748b';
  fromTitle.style.marginBottom = '8px';
  fromTitle.style.fontWeight = 'bold';

  const fromContact = document.createElement('div');
  fromContact.style.fontSize = '14px';
  fromContact.style.color = '#1e293b';

  const fromBusinessName = document.createElement('div');
  fromBusinessName.textContent = invoice.from.businessName || '---';
  fromBusinessName.style.color = themeColor;
  fromContact.appendChild(fromBusinessName);

  if (invoice.from.address) {
    const addr = document.createElement('div');
    addr.textContent = invoice.from.address;
    fromContact.appendChild(addr);
  }

  if (invoice.from.cityStateZip || invoice.from.country) {
    const cityCountry = document.createElement('div');
    cityCountry.textContent = [invoice.from.cityStateZip, invoice.from.country].filter(Boolean).join(', ');
    fromContact.appendChild(cityCountry);
  }

  if (invoice.from.email) {
    const email = document.createElement('div');
    email.textContent = invoice.from.email;
    fromContact.appendChild(email);
  }

  if (invoice.from.phone) {
    const phone = document.createElement('div');
    phone.textContent = invoice.from.phone;
    fromContact.appendChild(phone);
  }

  fromDiv.appendChild(fromTitle);
  fromDiv.appendChild(fromContact);
  fromToContainer.appendChild(fromDiv);

  // To section
  const toDiv = document.createElement('div');
  const toTitle = document.createElement('div');
  toTitle.textContent = 'To:';
  toTitle.style.fontSize = '14px';
  toTitle.style.color = '#64748b';
  toTitle.style.marginBottom = '8px';
  toTitle.style.fontWeight = 'bold';

  const toContact = document.createElement('div');
  toContact.style.fontSize = '14px';
  toContact.style.color = '#1e293b';

  const toClientName = document.createElement('div');
  toClientName.textContent = invoice.to.clientName || '---';
  toClientName.style.color = themeColor;
  toContact.appendChild(toClientName);

  if (invoice.to.company) {
    const company = document.createElement('div');
    company.textContent = invoice.to.company;
    toContact.appendChild(company);
  }

  if (invoice.to.address) {
    const addr = document.createElement('div');
    addr.textContent = invoice.to.address;
    toContact.appendChild(addr);
  }

  if (invoice.to.cityStateZip || invoice.to.country) {
    const cityCountry = document.createElement('div');
    cityCountry.textContent = [invoice.to.cityStateZip, invoice.to.country].filter(Boolean).join(', ');
    toContact.appendChild(cityCountry);
  }

  if (invoice.to.email) {
    const email = document.createElement('div');
    email.textContent = invoice.to.email;
    toContact.appendChild(email);
  }

  if (invoice.to.phone) {
    const phone = document.createElement('div');
    phone.textContent = invoice.to.phone;
    toContact.appendChild(phone);
  }

  toDiv.appendChild(toTitle);
  toDiv.appendChild(toContact);
  fromToContainer.appendChild(toDiv);

  container.appendChild(fromToContainer);

  // Line Items Table
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '24px';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.style.borderBottom = `1px solid ${themeColor}`;

  const descTh = document.createElement('th');
  descTh.textContent = 'Description';
  descTh.style.textAlign = 'left';
  descTh.style.padding = '8px';
  descTh.style.color = '#64748b';
  descTh.style.fontWeight = 'bold';
  descTh.style.fontSize = '14px';

  const qtyTh = document.createElement('th');
  qtyTh.textContent = 'Qty';
  qtyTh.style.textAlign = 'right';
  qtyTh.style.padding = '8px';
  qtyTh.style.color = '#64748b';
  qtyTh.style.fontWeight = 'bold';
  qtyTh.style.fontSize = '14px';

  const rateTh = document.createElement('th');
  rateTh.textContent = 'Rate';
  rateTh.style.textAlign = 'right';
  rateTh.style.padding = '8px';
  rateTh.style.color = '#64748b';
  rateTh.style.fontWeight = 'bold';
  rateTh.style.fontSize = '14px';

  const amountTh = document.createElement('th');
  amountTh.textContent = 'Amount';
  amountTh.style.textAlign = 'right';
  amountTh.style.padding = '8px';
  amountTh.style.color = '#64748b';
  amountTh.style.fontWeight = 'bold';
  amountTh.style.fontSize = '14px';

  headerRow.appendChild(descTh);
  headerRow.appendChild(qtyTh);
  headerRow.appendChild(rateTh);
  headerRow.appendChild(amountTh);

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (const item of invoice.items) {
    const row = document.createElement('tr');
    row.style.borderBottom = '1px solid #e2e8f0';

    const descTd = document.createElement('td');
    descTd.textContent = item.description || '---';
    descTd.style.padding = '12px 8px';
    descTd.style.fontSize = '14px';
    descTd.style.color = '#1e293b';

    const qtyTd = document.createElement('td');
    qtyTd.textContent = item.quantity.toString();
    qtyTd.style.padding = '12px 8px';
    qtyTd.style.fontSize = '14px';
    qtyTd.style.color = '#1e293b';
    qtyTd.style.textAlign = 'right';

    const rateTd = document.createElement('td');
    rateTd.textContent = `$${item.rate.toFixed(2)}`;
    rateTd.style.padding = '12px 8px';
    rateTd.style.fontSize = '14px';
    rateTd.style.color = '#1e293b';
    rateTd.style.textAlign = 'right';

    const amountTd = document.createElement('td');
    amountTd.textContent = `$${(item.quantity * item.rate).toFixed(2)}`;
    amountTd.style.padding = '12px 8px';
    amountTd.style.fontSize = '14px';
    amountTd.style.color = '#1e293b';
    amountTd.style.textAlign = 'right';

    row.appendChild(descTd);
    row.appendChild(qtyTd);
    row.appendChild(rateTd);
    row.appendChild(amountTd);

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  container.appendChild(table);

  // Totals
  const totalsDiv = document.createElement('div');
  totalsDiv.style.display = 'flex';
  totalsDiv.style.justifyContent = 'flex-end';
  totalsDiv.style.marginBottom = '24px';

  const totalsTable = document.createElement('div');
  totalsTable.style.width = '192px';

  const subtotalRow = document.createElement('div');
  subtotalRow.style.display = 'flex';
  subtotalRow.style.justifyContent = 'space-between';
  subtotalRow.style.padding = '4px 0';

  const subtotalLabel = document.createElement('span');
  subtotalLabel.textContent = 'Subtotal:';
  subtotalLabel.style.color = '#64748b';
  subtotalLabel.style.fontSize = '14px';

  const subtotalValue = document.createElement('span');
  subtotalValue.textContent = `$${totals.subtotal.toFixed(2)}`;
  subtotalValue.style.color = '#1e293b';
  subtotalValue.style.fontSize = '14px';

  subtotalRow.appendChild(subtotalLabel);
  subtotalRow.appendChild(subtotalValue);

  totalsTable.appendChild(subtotalRow);

  if (invoice.taxRate && invoice.taxRate > 0) {
    const taxRow = document.createElement('div');
    taxRow.style.display = 'flex';
    taxRow.style.justifyContent = 'space-between';
    taxRow.style.padding = '4px 0';

    const taxLabel = document.createElement('span');
    taxLabel.textContent = `Tax (${invoice.taxRate}%):`;
    taxLabel.style.color = '#64748b';
    taxLabel.style.fontSize = '14px';

    const taxValue = document.createElement('span');
    taxValue.textContent = `$${totals.taxAmount.toFixed(2)}`;
    taxValue.style.color = '#1e293b';
    taxValue.style.fontSize = '14px';

    taxRow.appendChild(taxLabel);
    taxRow.appendChild(taxValue);

    totalsTable.appendChild(taxRow);
  }

  const totalRow = document.createElement('div');
  totalRow.style.display = 'flex';
  totalRow.style.justifyContent = 'space-between';
  totalRow.style.padding = '4px 0';
  totalRow.style.borderTop = `1px solid ${themeColor}`;
  totalRow.style.paddingTop = '8px';
  totalRow.style.fontWeight = 'bold';
  totalRow.style.color = themeColor;

  const totalLabel = document.createElement('span');
  totalLabel.textContent = 'Total:';
  totalLabel.style.color = '#1e293b';
  totalLabel.style.fontSize = '14px';

  const totalValue = document.createElement('span');
  totalValue.textContent = `$${totals.total.toFixed(2)}`;
  totalValue.style.color = themeColor;
  totalValue.style.fontSize = '14px';

  totalRow.appendChild(totalLabel);
  totalRow.appendChild(totalValue);

  totalsTable.appendChild(totalRow);
  totalsDiv.appendChild(totalsTable);
  container.appendChild(totalsDiv);

  // Notes and Terms
  if (invoice.notes || invoice.terms) {
    const notesTermsDiv = document.createElement('div');
    notesTermsDiv.style.display = 'grid';
    notesTermsDiv.style.gridTemplateColumns = '1fr 1fr';
    notesTermsDiv.style.gap = '24px';
    notesTermsDiv.style.borderTop = `1px solid ${themeColor}`;
    notesTermsDiv.style.paddingTop = '24px';
    notesTermsDiv.style.marginTop = '24px';

    if (invoice.notes) {
      const notesDiv = document.createElement('div');
      const notesTitle = document.createElement('div');
      notesTitle.textContent = 'Notes:';
      notesTitle.style.fontWeight = 'bold';
      notesTitle.style.marginBottom = '4px';
      notesTitle.style.color = '#64748b';
      notesTitle.style.fontSize = '14px';

      const notesContent = document.createElement('div');
      notesContent.textContent = invoice.notes;
      notesContent.style.fontSize = '14px';
      notesContent.style.color = '#64748b';

      notesDiv.appendChild(notesTitle);
      notesDiv.appendChild(notesContent);
      notesTermsDiv.appendChild(notesDiv);
    }

    if (invoice.terms) {
      const termsDiv = document.createElement('div');
      const termsTitle = document.createElement('div');
      termsTitle.textContent = 'Terms:';
      termsTitle.style.fontWeight = 'bold';
      termsTitle.style.marginBottom = '4px';
      termsTitle.style.color = '#64748b';
      termsTitle.style.fontSize = '14px';

      const termsContent = document.createElement('div');
      termsContent.textContent = invoice.terms;
      termsContent.style.fontSize = '14px';
      termsContent.style.color = '#64748b';

      termsDiv.appendChild(termsTitle);
      termsDiv.appendChild(termsContent);
      notesTermsDiv.appendChild(termsDiv);
    }

    container.appendChild(notesTermsDiv);
  }
}

export function exportCSV(invoice: Invoice, totals: Totals): void {
  const headers = ["Description", "Quantity", "Rate", "Amount"];
  const rows = invoice.items.map((item) => [
    item.description,
    item.quantity.toString(),
    item.rate.toString(),
    (item.quantity * item.rate).toFixed(2),
  ]);
  rows.push(["", "", "Subtotal:", totals.subtotal.toFixed(2)]);
  rows.push(["", "", `Tax (${invoice.taxRate}%):`, totals.taxAmount.toFixed(2)]);
  rows.push(["", "", "Total:", totals.total.toFixed(2)]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${invoice.number || "invoice"}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}