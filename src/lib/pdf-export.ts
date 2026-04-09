import { Invoice, Totals } from "./types";
import { jsPDF } from "jspdf";

// Helper function to detect Chinese characters
export function containsChineseChars(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

// Function to detect if invoice contains Chinese characters
export function invoiceHasChinese(invoice: Invoice): boolean {
  // Check invoice fields
  if (containsChineseChars(invoice.number || '') ||
      containsChineseChars(invoice.from.businessName) ||
      containsChineseChars(invoice.from.address) ||
      containsChineseChars(invoice.from.cityStateZip) ||
      containsChineseChars(invoice.from.country) ||
      containsChineseChars(invoice.to.clientName) ||
      containsChineseChars(invoice.to.company) ||
      containsChineseChars(invoice.to.address) ||
      containsChineseChars(invoice.to.cityStateZip) ||
      containsChineseChars(invoice.to.country) ||
      containsChineseChars(invoice.notes || '') ||
      containsChineseChars(invoice.terms || '')) {
    return true;
  }

  // Check line items
  for (const item of invoice.items) {
    if (containsChineseChars(item.description)) {
      return true;
    }
  }

  return false;
}

// Helper function to add image to PDF with aspect ratio preservation
function addImageToPDF(doc: jsPDF, imageUrl: string, x: number, y: number, maxWidth: number, maxHeight: number): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        // Calculate dimensions preserving aspect ratio
        const imgRatio = img.width / img.height;
        let width = maxWidth;
        let height = maxHeight;

        if (imgRatio > 1) {
          // Wide image: constrain by width
          height = maxWidth / imgRatio;
        } else {
          // Tall image: constrain by height
          width = maxHeight * imgRatio;
        }

        doc.addImage(img, 'JPEG', x, y, width, height);
        resolve();
      } catch (error) {
        console.warn("Could not add image to PDF:", error);
        resolve();
      }
    };
    img.onerror = () => {
      console.warn("Could not load image for PDF:", imageUrl);
      resolve();
    };
    img.src = imageUrl;
  });
}

/**
 * Set consistent default styles for PDF
 * Uses jsPDF default font (Helvetica) which is visually similar to Inter
 */
function setDefaultStyles(doc: jsPDF): void {
  doc.setTextColor(0, 0, 0); // Black text
  doc.setFont("helvetica");
  doc.setFontSize(12);
  doc.setLineWidth(0.5); // Consistent line width
}

// Async version that properly handles logo
export async function exportPDFWithLogo(invoice: Invoice, totals: Totals): Promise<void> {
  // Check if invoice contains Chinese characters
  if (invoiceHasChinese(invoice)) {
    // Show notification about using html2canvas
    alert("Invoice contains Chinese characters. Using image-based PDF export to ensure correct display.");

    // Use html2canvas as fallback for Chinese characters
    await exportPDFWithHTML2Canvas(invoice, totals);
    return;
  }

  // Use standard jspdf for non-Chinese invoices
  const doc = new jsPDF();

  // Set default styles
  setDefaultStyles(doc);

  // Add title
  doc.setFontSize(20);
  doc.setFont('', 'bold');
  doc.text("INVOICE", 20, 30);

  // Add logo if exists (align with the top of the invoice title)
  if (invoice.logoUrl) {
    try {
      // Place logo at the top right, aligned with title
      // Max dimensions: 60mm preserving aspect ratio
      await addImageToPDF(doc, invoice.logoUrl, 145, 15, 60, 60);
    } catch (e) {
      console.warn("Could not load logo for PDF:", e);
    }
  }

  // Add invoice number
  if (invoice.number) {
    doc.setFontSize(16);
    doc.setFont('', 'bold');
    doc.text(`#${invoice.number}`, 20, 40);
  }

  // Add date and due date
  doc.setFontSize(12);
  doc.setFont('', 'normal');
  let dateYOffset = invoice.number ? 50 : 40;
  if (invoice.date) {
    doc.text(`Date: ${invoice.date}`, 20, dateYOffset);
  }
  if (invoice.dueDate) {
    doc.text(`Due Date: ${invoice.dueDate}`, 20, dateYOffset + 10);
  }

  // Add from/to information
  const fromToYOffset = Math.max(dateYOffset + 30, 80);

  // From section
  doc.setFontSize(14);
  doc.setFont('', 'bold');
  doc.text("From:", 20, fromToYOffset);
  doc.setFontSize(12);
  doc.setFont('', 'normal');
  if (invoice.from.businessName) doc.text(invoice.from.businessName, 20, fromToYOffset + 10);
  if (invoice.from.address) doc.text(invoice.from.address, 20, fromToYOffset + 16);
  if (invoice.from.cityStateZip) doc.text(invoice.from.cityStateZip, 20, fromToYOffset + 22);
  if (invoice.from.country) doc.text(invoice.from.country, 20, fromToYOffset + 28);
  if (invoice.from.email) doc.text(invoice.from.email, 20, fromToYOffset + 34);

  // To section
  doc.setFontSize(14);
  doc.setFont('', 'bold');
  doc.text("To:", 120, fromToYOffset);
  doc.setFontSize(12);
  doc.setFont('', 'normal');
  if (invoice.to.clientName) doc.text(invoice.to.clientName, 120, fromToYOffset + 10);
  if (invoice.to.company) doc.text(invoice.to.company, 120, fromToYOffset + 16);
  if (invoice.to.address) doc.text(invoice.to.address, 120, fromToYOffset + 22);
  if (invoice.to.cityStateZip) doc.text(invoice.to.cityStateZip, 120, fromToYOffset + 28);
  if (invoice.to.email) doc.text(invoice.to.email, 120, fromToYOffset + 34);

  // Draw items table header
  const tableTopY = fromToYOffset + 50;
  doc.setFontSize(12);
  doc.setFont('', 'bold');
  doc.text("Description", 20, tableTopY);
  doc.text("Qty", 100, tableTopY);
  doc.text("Rate", 130, tableTopY);
  doc.text("Amount", 160, tableTopY);

  // Draw separator line
  doc.line(20, tableTopY + 5, 190, tableTopY + 5);

  // Draw items table rows
  doc.setFont('', 'normal');
  let currentY = tableTopY + 15;
  invoice.items.forEach((item) => {
    // Check if we need a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    // Description (with multi-line handling if needed)
    const maxWidth = 70;
    const descriptionLines = doc.splitTextToSize(item.description, maxWidth);
    doc.text(descriptionLines, 20, currentY);

    // Quantity, rate, and amount
    doc.text(item.quantity.toString(), 105, currentY);
    doc.text(item.rate.toFixed(2), 135, currentY);
    doc.text((item.quantity * item.rate).toFixed(2), 165, currentY);

    currentY += Math.max(10, descriptionLines.length * 6);
  });

  // Add totals section
  const totalsY = currentY + 15;
  doc.setFont('', 'bold');
  doc.text(`Subtotal: $${totals.subtotal.toFixed(2)}`, 130, totalsY);
  if (invoice.taxRate && invoice.taxRate > 0) {
    doc.text(`Tax (${invoice.taxRate}%): $${totals.taxAmount.toFixed(2)}`, 130, totalsY + 7);
    doc.text(`Total: $${totals.total.toFixed(2)}`, 130, totalsY + 14);
  } else {
    doc.text(`Total: $${totals.total.toFixed(2)}`, 130, totalsY + 7);
  }

  // Add notes if any
  let notesY: number | undefined;
  if (invoice.notes) {
    notesY = totalsY + 25;
    doc.setFont('', 'normal');
    doc.setFontSize(12);
    doc.text("Notes:", 20, notesY);
    const notesLines = doc.splitTextToSize(invoice.notes, 170);
    doc.text(notesLines, 20, notesY + 7);
  }

  // Add terms if any
  if (invoice.terms) {
    const termsY = notesY !== undefined ? notesY + 30 : totalsY + 25;
    doc.setFont('', 'normal');
    doc.setFontSize(12);
    doc.text("Terms:", 20, termsY);
    const termsLines = doc.splitTextToSize(invoice.terms, 170);
    doc.text(termsLines, 20, termsY + 7);
  }

  // Save the PDF
  doc.save(`${invoice.number || "invoice"}.pdf`);
}

// Function to use html2canvas for PDF export when Chinese characters are detected
export async function exportPDFWithHTML2Canvas(invoice: Invoice, totals: Totals): Promise<void> {
  // Dynamically import html2canvas
  const html2canvas = (await import('html2canvas')).default;

  // Create a hidden div with the invoice content styled for printing
  const printDiv = document.createElement('div');
  printDiv.innerHTML = `
    <div style="font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
        <div style="text-align: center;">
          <h1 style="font-size: 28px; font-weight: 300; margin: 0;">INVOICE</h1>
        </div>
        ${invoice.logoUrl ? `<img src="${invoice.logoUrl}" style="max-width: 120px; max-height: 60px; object-fit: contain;" />` : ''}
      </div>

      <div style="margin-bottom: 30px;">
        ${invoice.number ? `<div><strong>Invoice #:</strong> ${invoice.number}</div>` : ''}
        ${invoice.date ? `<div><strong>Date:</strong> ${invoice.date}</div>` : ''}
        ${invoice.dueDate ? `<div><strong>Due Date:</strong> ${invoice.dueDate}</div>` : ''}
      </div>

      <div style="display: flex; margin-bottom: 40px;">
        <div style="flex: 1;">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">From:</h3>
          <div>${invoice.from.businessName || '---'}</div>
          ${invoice.from.address ? `<div>${invoice.from.address}</div>` : ''}
          ${(invoice.from.cityStateZip || invoice.from.country) ?
            `<div>${[invoice.from.cityStateZip, invoice.from.country].filter(Boolean).join(', ')}</div>` : ''}
          ${invoice.from.email ? `<div>${invoice.from.email}</div>` : ''}
          ${invoice.from.phone ? `<div>${invoice.from.phone}</div>` : ''}
        </div>
        <div style="flex: 1;">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">To:</h3>
          <div>${invoice.to.clientName || '---'}</div>
          ${invoice.to.company ? `<div>${invoice.to.company}</div>` : ''}
          ${invoice.to.address ? `<div>${invoice.to.address}</div>` : ''}
          ${(invoice.to.cityStateZip || invoice.to.country) ?
            `<div>${[invoice.to.cityStateZip, invoice.to.country].filter(Boolean).join(', ')}</div>` : ''}
          ${invoice.to.email ? `<div>${invoice.to.email}</div>` : ''}
          ${invoice.to.phone ? `<div>${invoice.to.phone}</div>` : ''}
        </div>
      </div>

      <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #ccc;">
            <th style="text-align: left; padding: 8px 0; font-weight: bold;">Description</th>
            <th style="text-align: right; padding: 8px 0; font-weight: bold;">Qty</th>
            <th style="text-align: right; padding: 8px 0; font-weight: bold;">Rate</th>
            <th style="text-align: right; padding: 8px 0; font-weight: bold;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0;">${item.description || '---'}</td>
              <td style="text-align: right; padding: 12px 0;">${item.quantity}</td>
              <td style="text-align: right; padding: 12px 0;">$${item.rate.toFixed(2)}</td>
              <td style="text-align: right; padding: 12px 0;">$${(item.quantity * item.rate).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 300px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span>$${totals.subtotal.toFixed(2)}</span>
          </div>
          ${invoice.taxRate && invoice.taxRate > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Tax (${invoice.taxRate}%):</span>
              <span>$${totals.taxAmount.toFixed(2)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #ccc; font-weight: bold;">
            <span>Total:</span>
            <span>$${totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      ${(invoice.notes || invoice.terms) ? `
        <div style="display: flex; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc;">
          ${invoice.notes ? `
            <div style="flex: 1; margin-right: 30px;">
              <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">Notes:</h3>
              <p>${invoice.notes}</p>
            </div>
          ` : ''}
          ${invoice.terms ? `
            <div style="flex: 1;">
              <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">Terms:</h3>
              <p>${invoice.terms}</p>
            </div>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;

  printDiv.style.position = 'absolute';
  printDiv.style.left = '-9999px';
  printDiv.style.top = '0';
  printDiv.style.backgroundColor = 'white';
  printDiv.style.fontSize = '14px';

  document.body.appendChild(printDiv);

  try {
    // @ts-ignore - scale is a valid option for html2canvas
    const canvas = await html2canvas(printDiv, {
      scale: 2, // Higher resolution for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add new pages if content is taller than A4
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${invoice.number || "invoice"}.pdf`);
  } finally {
    document.body.removeChild(printDiv);
  }
}

// Backwards compatible synchronous version
export function exportPDF(invoice: Invoice, totals: Totals): void {
  console.warn("exportPDF is deprecated. Use exportPDFWithLogo for proper logo support.");

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text("INVOICE", 20, 30);

  // Add invoice number
  if (invoice.number) {
    doc.setFontSize(16);
    doc.text(`#${invoice.number}`, 20, 40);
  }

  // Add logo if exists
  let yOffset = 50;
  if (invoice.logoUrl) {
    // Note: The logo won't be properly rendered in this synchronous version
    yOffset += 20;
  }

  // Add date and due date
  doc.setFontSize(12);
  if (invoice.date) {
    doc.text(`Date: ${invoice.date}`, 20, yOffset);
  }
  if (invoice.dueDate) {
    doc.text(`Due Date: ${invoice.dueDate}`, 20, yOffset + 10);
  }

  // Add from/to information
  const fromToYOffset = yOffset + 30;

  // From section
  doc.setFontSize(14);
  doc.text("From:", 20, fromToYOffset);
  doc.setFontSize(12);
  doc.setFont('', 'normal');
  if (invoice.from.businessName) doc.text(invoice.from.businessName, 20, fromToYOffset + 10);
  if (invoice.from.address) doc.text(invoice.from.address, 20, fromToYOffset + 16);
  if (invoice.from.cityStateZip) doc.text(invoice.from.cityStateZip, 20, fromToYOffset + 22);
  if (invoice.from.country) doc.text(invoice.from.country, 20, fromToYOffset + 28);
  if (invoice.from.email) doc.text(invoice.from.email, 20, fromToYOffset + 34);

  // To section
  doc.setFontSize(14);
  doc.text("To:", 120, fromToYOffset);
  doc.setFontSize(12);
  if (invoice.to.clientName) doc.text(invoice.to.clientName, 120, fromToYOffset + 10);
  if (invoice.to.company) doc.text(invoice.to.company, 120, fromToYOffset + 16);
  if (invoice.to.address) doc.text(invoice.to.address, 120, fromToYOffset + 22);
  if (invoice.to.cityStateZip) doc.text(invoice.to.cityStateZip, 120, fromToYOffset + 28);
  if (invoice.to.email) doc.text(invoice.to.email, 120, fromToYOffset + 34);

  // Draw items table header
  const tableTopY = fromToYOffset + 50;
  doc.setFontSize(12);
  doc.setFont('', 'bold');
  doc.text("Description", 20, tableTopY);
  doc.text("Qty", 100, tableTopY);
  doc.text("Rate", 130, tableTopY);
  doc.text("Amount", 160, tableTopY);

  // Draw separator line
  doc.line(20, tableTopY + 5, 190, tableTopY + 5);

  // Draw items table rows
  doc.setFont('', 'normal');
  let currentY = tableTopY + 15;
  invoice.items.forEach((item) => {
    // Check if we need a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    // Description (with multi-line handling if needed)
    const maxWidth = 70; // Maximum width for description
    const descriptionLines = doc.splitTextToSize(item.description, maxWidth);
    doc.text(descriptionLines, 20, currentY);

    // Quantity, rate, and amount
    doc.text(item.quantity.toString(), 105, currentY);
    doc.text(item.rate.toFixed(2), 135, currentY);
    doc.text((item.quantity * item.rate).toFixed(2), 165, currentY);

    currentY += Math.max(10, descriptionLines.length * 6); // Adjust for multi-line descriptions
  });

  // Add totals section
  const totalsY = Math.max(currentY + 20, tableTopY + 180);
  doc.setFont('', 'bold');
  doc.text(`Subtotal: $${totals.subtotal.toFixed(2)}`, 130, totalsY);
  if (invoice.taxRate && invoice.taxRate > 0) {
    doc.text(`Tax (${invoice.taxRate}%): $${totals.taxAmount.toFixed(2)}`, 130, totalsY + 10);
    doc.text(`Total: $${totals.total.toFixed(2)}`, 130, totalsY + 20);
  } else {
    doc.text(`Total: $${totals.total.toFixed(2)}`, 130, totalsY + 10);
  }

  // Add notes if any
  let notesY: number | undefined;
  if (invoice.notes) {
    notesY = Math.max(totalsY + 40, currentY + 40);
    doc.setFont('', 'normal');
    doc.setFontSize(12);
    doc.text("Notes:", 20, notesY);
    const notesLines = doc.splitTextToSize(invoice.notes, 170);
    doc.text(notesLines, 20, notesY + 10);
  }

  // Add terms if any
  if (invoice.terms) {
    const termsY = Math.max(
      notesY !== undefined ? notesY + 40 : totalsY + 40,
      currentY + 60
    );
    doc.text("Terms:", 20, termsY);
    const termsLines = doc.splitTextToSize(invoice.terms, 170);
    doc.text(termsLines, 20, termsY + 10);
  }

  // Save the PDF
  doc.save(`${invoice.number || "invoice"}.pdf`);
}

export function exportCSV(invoice: Invoice, totals: Totals): void {
  const headers = ["Description", "Quantity", "Rate", "Amount"];

  const rows = invoice.items.map((item) => [
    item.description,
    item.quantity.toString(),
    item.rate.toString(),
    (item.quantity * item.rate).toFixed(2),
  ]);

  // Add totals
  rows.push(["", "", "Subtotal:", totals.subtotal.toFixed(2)]);
  rows.push(["", "", `Tax (${invoice.taxRate}%):`, totals.taxAmount.toFixed(2)]);
  rows.push(["", "", "Total:", totals.total.toFixed(2)]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${invoice.number || "invoice"}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}