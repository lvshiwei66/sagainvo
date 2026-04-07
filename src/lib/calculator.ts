import { LineItem, Totals } from "./types";

export function calculateTotals(items: LineItem[], taxRate: number): Totals {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return {
    subtotal,
    taxAmount,
    total,
  };
}
