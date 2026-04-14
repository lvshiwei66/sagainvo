import { Invoice, Totals } from "./types";
import { jsPDF } from "jspdf";

// Import Inter font definitions (for text)
import registerInterRegularFont from './fonts/Inter-Regular';
import registerInterBoldFont from './fonts/Inter-Bold';

// Import Courier Prime font definitions (for numbers)
import registerCourierRegularFont from './fonts/CourierPrime-Regular';
import registerCourierBoldFont from './fonts/CourierPrime-Bold';

/**
 * DOM measurements from InvoicePreview component
 * All values in pixels relative to viewport
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
 * Scale factor for converting DOM pixels to PDF mm
 * Calibrated so that the measured DOM heights match expected PDF output
 */
const PDF_SCALE = 0.28; // ~1px = 0.28mm (calibrated for 96 DPI screen)

/**
 * Layout constants
 */
const LAYOUT = {
  LEFT_MARGIN: 20,
  RIGHT_MARGIN: 190,
  BORDER_COLOR: [226, 232, 240] as const,
  FONT_SIZE: 12,
};

function setDefaultStyles(doc: jsPDF): void {
  doc.setTextColor(0, 0, 0);
  doc.setFont("Inter");
  doc.setFontSize(LAYOUT.FONT_SIZE);
  doc.setLineWidth(0.25);
}

export async function exportPDFWithLogo(
  invoice: Invoice,
  totals: Totals,
  measurements?: LayoutMeasurements | null
): Promise<void> {
  const doc = new jsPDF();

  try {
    registerInterRegularFont(doc);
    registerInterBoldFont(doc);
    registerCourierRegularFont(doc);
    registerCourierBoldFont(doc);
  } catch (error) {
    console.warn('Font registration failed:', error);
  }

  setDefaultStyles(doc);

  // Add title
  doc.setFontSize(20);
  doc.setFont('Inter', 'bold');
  doc.text("INVOICE", 20, 30);

  // Add logo
  if (invoice.logoUrl) {
    try {
      await addImageToPDF(doc, invoice.logoUrl, 145, 15, 60, 60);
    } catch (e) {
      console.warn("Could not load logo:", e);
    }
  }

  // Add invoice number
  if (invoice.number) {
    doc.setFontSize(16);
    doc.setFont('Inter', 'bold');
    doc.text(`#${invoice.number}`, 20, 40);
  }

  // Add dates
  doc.setFontSize(12);
  doc.setFont('Inter', 'normal');
  let dateYOffset = invoice.number ? 50 : 40;
  if (invoice.date) doc.text(`Date: ${invoice.date}`, 20, dateYOffset);
  if (invoice.dueDate) doc.text(`Due Date: ${invoice.dueDate}`, 20, dateYOffset + 10);

  // Add from/to
  const fromToYOffset = Math.max(dateYOffset + 30, 80);

  doc.setFontSize(14);
  doc.setFont('Inter', 'bold');
  doc.text("From:", LAYOUT.LEFT_MARGIN, fromToYOffset);
  doc.setFontSize(12);
  doc.setFont('Inter', 'normal');
  if (invoice.from.businessName) doc.text(invoice.from.businessName, LAYOUT.LEFT_MARGIN, fromToYOffset + 10);
  if (invoice.from.address) doc.text(invoice.from.address, LAYOUT.LEFT_MARGIN, fromToYOffset + 16);
  if (invoice.from.cityStateZip) doc.text(invoice.from.cityStateZip, LAYOUT.LEFT_MARGIN, fromToYOffset + 22);
  if (invoice.from.country) doc.text(invoice.from.country, LAYOUT.LEFT_MARGIN, fromToYOffset + 28);
  if (invoice.from.email) doc.text(invoice.from.email, LAYOUT.LEFT_MARGIN, fromToYOffset + 34);
  if (invoice.from.phone) doc.text(invoice.from.phone, LAYOUT.LEFT_MARGIN, fromToYOffset + 40);

  doc.setFontSize(14);
  doc.setFont('Inter', 'bold');
  doc.text("To:", 120, fromToYOffset);
  doc.setFontSize(12);
  doc.setFont('Inter', 'normal');
  if (invoice.to.clientName) doc.text(invoice.to.clientName, 120, fromToYOffset + 10);
  if (invoice.to.company) doc.text(invoice.to.company, 120, fromToYOffset + 16);
  if (invoice.to.address) doc.text(invoice.to.address, 120, fromToYOffset + 22);
  if (invoice.to.cityStateZip) doc.text(invoice.to.cityStateZip, 120, fromToYOffset + 28);
  if (invoice.to.country) doc.text(invoice.to.country, 120, fromToYOffset + 34);
  if (invoice.to.email) doc.text(invoice.to.email, 120, fromToYOffset + 40);
  if (invoice.to.phone) doc.text(invoice.to.phone, 120, fromToYOffset + 46);

  // Draw table header
  const tableTopY = fromToYOffset + 55;
  doc.setFont('Inter', 'bold');
  doc.text("Description", LAYOUT.LEFT_MARGIN, tableTopY);
  doc.text("Qty", 100, tableTopY);
  doc.text("Rate", 130, tableTopY);
  doc.text("Amount", 160, tableTopY);

  if (measurements && measurements.bodyRowLineYs.length > 0) {
    // Calculate scale: DOM pixels -> PDF mm
    // Use header row as reference: DOM header height -> PDF header height
    const headerDomHeight = measurements.headerBottomY - measurements.headerTopY;
    const HEADER_PDF_HEIGHT = 7; // mm (matching Tailwind py-2 ≈ 8px top/bottom)
    const scale = HEADER_PDF_HEIGHT / headerDomHeight;

    // Header line position in PDF
    const headerLineY = tableTopY + HEADER_PDF_HEIGHT;

    // Draw header line
    doc.setDrawColor(...LAYOUT.BORDER_COLOR);
    doc.line(LAYOUT.LEFT_MARGIN, headerLineY, LAYOUT.RIGHT_MARGIN, headerLineY);

    // Draw body row lines
    measurements.bodyRowLineYs.forEach((domLineY, index) => {
      if (index >= invoice.items.length) return;

      // Distance from header top in DOM
      const domDistance = domLineY - measurements.headerTopY;
      // Convert to PDF distance and add to table top
      const pdfDistance = domDistance * scale;
      const pdfLineY = tableTopY + pdfDistance;

      // Page break
      if (pdfLineY > 250) {
        doc.addPage();
        return;
      }

      const item = invoice.items[index];
      const textY = pdfLineY - 5;

      doc.setFont('Inter', 'normal');
      const descriptionLines = doc.splitTextToSize(item.description, 70);
      doc.text(descriptionLines, LAYOUT.LEFT_MARGIN, textY);

      doc.setFont('Courier Prime', 'normal');
      doc.text(item.quantity.toString(), 105, textY);
      doc.text(item.rate.toFixed(2), 135, textY);
      doc.text((item.quantity * item.rate).toFixed(2), 165, textY);

      doc.setDrawColor(...LAYOUT.BORDER_COLOR);
      doc.line(LAYOUT.LEFT_MARGIN, pdfLineY, LAYOUT.RIGHT_MARGIN, pdfLineY);
    });

    // Notes/terms line
    if (measurements.notesTermsLineY) {
      const domDistance = measurements.notesTermsLineY - measurements.headerTopY;
      const pdfDistance = domDistance * scale;
      const notesTermsPdfY = tableTopY + pdfDistance - 8;

      if (notesTermsPdfY < 280 && notesTermsPdfY > headerLineY) {
        doc.setDrawColor(...LAYOUT.BORDER_COLOR);
        doc.line(LAYOUT.LEFT_MARGIN, notesTermsPdfY, LAYOUT.RIGHT_MARGIN, notesTermsPdfY);
      }
    }
  } else {
    // Fallback: calculated positions
    doc.setDrawColor(...LAYOUT.BORDER_COLOR);
    doc.line(LAYOUT.LEFT_MARGIN, tableTopY + 8, LAYOUT.RIGHT_MARGIN, tableTopY + 8);

    let currentY = tableTopY + 11;
    invoice.items.forEach((item) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont('Inter', 'normal');
      const descriptionLines = doc.splitTextToSize(item.description, 70);
      const textY = currentY + 2;
      doc.text(descriptionLines, LAYOUT.LEFT_MARGIN, textY);

      doc.setFont('Courier Prime', 'normal');
      doc.text(item.quantity.toString(), 105, textY);
      doc.text(item.rate.toFixed(2), 135, textY);
      doc.text((item.quantity * item.rate).toFixed(2), 165, textY);

      const rowHeight = 10;
      const lineY = currentY + rowHeight;
      doc.setDrawColor(...LAYOUT.BORDER_COLOR);
      doc.line(LAYOUT.LEFT_MARGIN, lineY, LAYOUT.RIGHT_MARGIN, lineY);

      currentY = lineY + 0.5;
    });
  }

  // Add totals
  const totalsY = 200;
  doc.setFont('Inter', 'bold');
  doc.text(`Subtotal: $`, 130, totalsY);
  doc.setFont('Courier Prime', 'bold');
  doc.text(totals.subtotal.toFixed(2), 170, totalsY);

  if (invoice.taxRate && invoice.taxRate > 0) {
    doc.setFont('Inter', 'bold');
    doc.text(`Tax (${invoice.taxRate}%): $`, 130, totalsY + 7);
    doc.setFont('Courier Prime', 'bold');
    doc.text(totals.taxAmount.toFixed(2), 170, totalsY + 7);

    doc.setFont('Inter', 'bold');
    doc.text(`Total: $`, 130, totalsY + 14);
    doc.setFont('Courier Prime', 'bold');
    doc.text(totals.total.toFixed(2), 170, totalsY + 14);
  } else {
    doc.setFont('Inter', 'bold');
    doc.text(`Total: $`, 130, totalsY + 7);
    doc.setFont('Courier Prime', 'bold');
    doc.text(totals.total.toFixed(2), 170, totalsY + 7);
  }

  // Add notes and terms
  const notesAndTermsY = totalsY + 25;
  doc.setFont('Inter', 'normal');
  doc.setFontSize(12);

  if (invoice.notes) {
    doc.text("Notes:", 20, notesAndTermsY);
    const notesLines = doc.splitTextToSize(invoice.notes, 80);
    doc.text(notesLines, 20, notesAndTermsY + 7);
  }

  if (invoice.terms) {
    doc.text("Terms:", 120, notesAndTermsY);
    const termsLines = doc.splitTextToSize(invoice.terms, 80);
    doc.text(termsLines, 120, notesAndTermsY + 7);
  }

  doc.save(`${invoice.number || "invoice"}.pdf`);
}

function addImageToPDF(doc: jsPDF, imageUrl: string, x: number, y: number, maxWidth: number, maxHeight: number): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const imgRatio = img.width / img.height;
        let width = maxWidth;
        let height = maxHeight;
        if (imgRatio > 1) {
          height = maxWidth / imgRatio;
        } else {
          width = maxHeight * imgRatio;
        }
        doc.addImage(img, 'JPEG', x, y, width, height);
        resolve();
      } catch (error) {
        resolve();
      }
    };
    img.onerror = () => resolve();
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
