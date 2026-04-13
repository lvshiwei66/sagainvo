import { Invoice, Totals } from "./types";
import { jsPDF } from "jspdf";

// Import Chinese font definition
import registerChineseFont from './fonts/NotoSansSC-Regular';

/**
 * Set consistent default styles for PDF
 * Uses NotoSansSC font which supports both Chinese and Latin characters
 */
function setDefaultStyles(doc: jsPDF): void {
  doc.setTextColor(0, 0, 0); // Black text
  doc.setFont("NotoSansSC");
  doc.setFontSize(12);
  doc.setLineWidth(0.5); // Consistent line width
}

// Async version that properly handles logo and Chinese characters
export async function exportPDFWithLogo(invoice: Invoice, totals: Totals): Promise<void> {
  const doc = new jsPDF();

  // Register Chinese font first (supports both Chinese and Latin)
  registerChineseFont(doc);

  // Set default styles (now using NotoSansSC)
  setDefaultStyles(doc);

  // Add title
  doc.setFontSize(20);
  doc.setFont('NotoSansSC', 'bold');
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
    doc.setFont('NotoSansSC', 'bold');
    doc.text(`#${invoice.number}`, 20, 40);
  }

  // Add date and due date
  doc.setFontSize(12);
  doc.setFont('NotoSansSC', 'normal');
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
  doc.setFont('NotoSansSC', 'bold');
  doc.text("From:", 20, fromToYOffset);
  doc.setFontSize(12);
  doc.setFont('NotoSansSC', 'normal');
  if (invoice.from.businessName) doc.text(invoice.from.businessName, 20, fromToYOffset + 10);
  if (invoice.from.address) doc.text(invoice.from.address, 20, fromToYOffset + 16);
  if (invoice.from.cityStateZip) doc.text(invoice.from.cityStateZip, 20, fromToYOffset + 22);
  if (invoice.from.country) doc.text(invoice.from.country, 20, fromToYOffset + 28);
  if (invoice.from.email) doc.text(invoice.from.email, 20, fromToYOffset + 34);
  if (invoice.from.phone) doc.text(invoice.from.phone, 20, fromToYOffset + 40);

  // To section
  doc.setFontSize(14);
  doc.setFont('NotoSansSC', 'bold');
  doc.text("To:", 120, fromToYOffset);
  doc.setFontSize(12);
  doc.setFont('NotoSansSC', 'normal');
  if (invoice.to.clientName) doc.text(invoice.to.clientName, 120, fromToYOffset + 10);
  if (invoice.to.company) doc.text(invoice.to.company, 120, fromToYOffset + 16);
  if (invoice.to.address) doc.text(invoice.to.address, 120, fromToYOffset + 22);
  if (invoice.to.cityStateZip) doc.text(invoice.to.cityStateZip, 120, fromToYOffset + 28);
  if (invoice.to.country) doc.text(invoice.to.country, 120, fromToYOffset + 34);
  if (invoice.to.email) doc.text(invoice.to.email, 120, fromToYOffset + 40);
  if (invoice.to.phone) doc.text(invoice.to.phone, 120, fromToYOffset + 46);

  // Draw items table header
  const tableTopY = fromToYOffset + 55;
  doc.setFontSize(12);
  doc.setFont('NotoSansSC', 'bold');
  doc.text("Description", 20, tableTopY);
  doc.text("Qty", 100, tableTopY);
  doc.text("Rate", 130, tableTopY);
  doc.text("Amount", 160, tableTopY);

  // Draw separator line
  doc.line(20, tableTopY + 5, 190, tableTopY + 5);

  // Draw items table rows
  doc.setFont('NotoSansSC', 'normal');
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
  doc.setFont('NotoSansSC', 'bold');
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
    doc.setFont('NotoSansSC', 'normal');
    doc.setFontSize(12);
    doc.text("Notes:", 20, notesY);
    const notesLines = doc.splitTextToSize(invoice.notes, 170);
    doc.text(notesLines, 20, notesY + 7);
  }

  // Add terms if any
  if (invoice.terms) {
    const termsY = notesY !== undefined ? notesY + 30 : totalsY + 25;
    doc.setFont('NotoSansSC', 'normal');
    doc.setFontSize(12);
    doc.text("Terms:", 20, termsY);
    const termsLines = doc.splitTextToSize(invoice.terms, 170);
    doc.text(termsLines, 20, termsY + 7);
  }

  // Save the PDF
  doc.save(`${invoice.number || "invoice"}.pdf`);
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
