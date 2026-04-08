import { Invoice, defaultInvoice } from "./types";
import { getBase64Size } from './image-utils';

const STORAGE_KEY = "sagainvo:currentInvoice";
const STORAGE_LIMIT = 4 * 1024 * 1024; // 4MB limit to stay under browser limits

export function saveInvoice(invoice: Invoice): void {
  try {
    // Check if any image data is too large
    const imageFields = ['logoUrl']; // Only logo for now, exclude background and signature
    for (const field of imageFields) {
      const imageUrl = invoice[field as keyof Invoice] as string | undefined;
      if (imageUrl && getBase64Size(imageUrl) > 512 * 1024) { // 512KB limit per image
        console.warn(`Image in ${field} is too large (${Math.round(getBase64Size(imageUrl)/1024)}KB)`);
        // Consider notifying user about large image
      }
    }

    const serializedInvoice = JSON.stringify(invoice);

    // Check total size
    if (serializedInvoice.length > STORAGE_LIMIT) {
      console.warn('Invoice data is too large, consider removing some images');
      // Optionally remove images until size is acceptable
      let tempInvoice = { ...invoice };
      let reducedSize = false;

      for (const field of imageFields) {
        if (tempInvoice[field as keyof typeof tempInvoice] && getBase64Size(tempInvoice[field as keyof typeof tempInvoice] as string) > 256 * 1024) { // 256KB threshold
          console.warn(`Removing ${field} to reduce size`);
          (tempInvoice as any)[field] = undefined;
          reducedSize = true;
        }
      }

      if (reducedSize) {
        const reducedSerialized = JSON.stringify(tempInvoice);
        if (reducedSerialized.length <= STORAGE_LIMIT) {
          localStorage.setItem(STORAGE_KEY, reducedSerialized);
          return;
        }
      }
    }

    localStorage.setItem(STORAGE_KEY, serializedInvoice);
  } catch (error) {
    console.error("Failed to save invoice to localStorage:", error);
    // Handle quota exceeded error or other localStorage issues
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded. Consider clearing some data.');
    }
  }
}

export function loadInvoice(): Invoice | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure the loaded invoice has all required fields
      return { ...defaultInvoice, ...parsed };
    }
  } catch (error) {
    console.error("Failed to load invoice from localStorage:", error);
  }
  return null;
}

export function clearInvoice(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear invoice:", error);
  }
}
