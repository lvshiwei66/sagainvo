import { Invoice } from "./types";

export const demoInvoiceData: Invoice = {
  id: "demo-" + Date.now(),
  number: "INV-001",
  date: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  from: {
    businessName: "Acme Corporation",
    address: "123 Business Ave",
    cityStateZip: "New York, NY 10001",
    country: "USA",
    email: "billing@acme.com",
    phone: "+1 (555) 123-4567",
  },
  to: {
    clientName: "John Doe",
    company: "Global Solutions Inc.",
    address: "456 Client Street",
    cityStateZip: "Los Angeles, CA 90210",
    country: "USA",
    email: "john.doe@example.com",
    phone: "+1 (555) 987-6543",
  },
  items: [
    {
      description: "Website Design",
      quantity: 1,
      rate: 2500.00,
    },
    {
      description: "Hosting Setup",
      quantity: 1,
      rate: 200.00,
    },
    {
      description: "SEO Optimization",
      quantity: 5,
      rate: 300.00,
    },
  ],
  taxRate: 8.5,
  notes: "Thank you for your business!",
  terms: "Payment due within 30 days of invoice date.",
  status: "draft",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  logoUrl: undefined,
  backgroundUrl: undefined,
  signatureUrl: undefined,
};