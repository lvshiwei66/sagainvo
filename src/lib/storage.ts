import { Invoice } from "./types";

const STORAGE_KEY = "sagainvo:currentInvoice";

export function saveInvoice(invoice: Invoice): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
  } catch (error) {
    console.error("Failed to save invoice to localStorage:", error);
  }
}

export function loadInvoice(): Invoice | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
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
