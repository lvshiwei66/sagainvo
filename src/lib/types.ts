export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

export interface BusinessInfo {
  businessName: string;
  address: string;
  cityStateZip: string;
  country: string;
  email: string;
  phone: string;
}

export interface ClientInfo {
  clientName: string;
  company: string;
  address: string;
  cityStateZip: string;
  country: string;
  email: string;
  phone: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  from: BusinessInfo;
  to: ClientInfo;
  items: LineItem[];
  taxRate: number;
  notes: string;
  terms: string;
  status: "draft" | "sent" | "paid";
  createdAt: string;
  updatedAt: string;
  logoUrl?: string;
  backgroundUrl?: string;
  signatureUrl?: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: "modern" | "classic" | "minimal" | "colorful";
  tags: string[];
  template: Invoice;
  isDefault: boolean;
}

export interface Totals {
  subtotal: number;
  taxAmount: number;
  total: number;
}

export const defaultInvoice: Invoice = {
  id: "",
  number: "INV-001",
  date: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  from: {
    businessName: "",
    address: "",
    cityStateZip: "",
    country: "",
    email: "",
    phone: "",
  },
  to: {
    clientName: "",
    company: "",
    address: "",
    cityStateZip: "",
    country: "",
    email: "",
    phone: "",
  },
  items: [{ description: "", quantity: 1, rate: 0 }],
  taxRate: 8,
  notes: "",
  terms: "",
  status: "draft",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  logoUrl: undefined,
  backgroundUrl: undefined,
  signatureUrl: undefined,
};
