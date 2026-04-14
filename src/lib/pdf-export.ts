import { Invoice, Totals } from "./types";
import { exportPDFWithLogo as exportPDFWithLogoDompdf } from "./dompdf-export";

// Re-export the dompdf version as the main exportPDFWithLogo
export { exportPDFWithLogoDompdf as exportPDFWithLogo };