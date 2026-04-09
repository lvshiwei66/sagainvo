import { InvoiceTemplate } from '../types';

export const demoTemplates: InvoiceTemplate[] = [
  {
    id: 'tmpl-modern-professional',
    name: 'Modern Professional',
    description: 'Clean and professional design with subtle blue accents, perfect for corporate clients.',
    category: 'modern',
    themeColor: '#2563EB',        // Professional blue
    textFont: 'sans',            // Sans-serif for text
    numberFont: 'mono',          // Monospace for numbers
    template: {
      id: '',
      number: 'INV-001',
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      from: {
        businessName: 'Your Company Name',
        address: '123 Business Street',
        cityStateZip: 'New York, NY 10001',
        country: 'USA',
        email: 'billing@company.com',
        phone: '+1 (555) 123-4567',
      },
      to: {
        clientName: 'Client Name',
        company: 'Client Company',
        address: '456 Client Avenue',
        cityStateZip: 'Los Angeles, CA 90001',
        country: 'USA',
        email: 'contact@client.com',
        phone: '+1 (555) 987-6543',
      },
      items: [
        { description: 'Web Design Services', quantity: 10, rate: 100 },
        { description: 'Hosting Fee', quantity: 1, rate: 50 },
      ],
      taxRate: 8,
      notes: 'Thank you for your business!',
      terms: 'Payment due within 30 days of invoice date.',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logoUrl: undefined,
      backgroundUrl: undefined,
      signatureUrl: undefined,
    },
    isDefault: true,
  },
  {
    id: 'tmpl-classic-business',
    name: 'Classic Business',
    description: 'Traditional business layout with elegant typography and timeless design.',
    category: 'classic',
    themeColor: '#78716C',        // Classic gray-brown
    textFont: 'serif',           // Serif for traditional feel
    numberFont: 'sans',          // Sans-serif for numbers
    template: {
      id: '',
      number: 'INV-001',
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      from: {
        businessName: 'Your Established Business',
        address: '789 Main Street',
        cityStateZip: 'Chicago, IL 60601',
        country: 'USA',
        email: 'info@business.com',
        phone: '+1 (555) 234-5678',
      },
      to: {
        clientName: 'Valued Customer',
        company: 'Customer Corp',
        address: '321 Market Street',
        cityStateZip: 'San Francisco, CA 94101',
        country: 'USA',
        email: 'hello@customer.com',
        phone: '+1 (555) 876-5432',
      },
      items: [
        { description: 'Consulting Services', quantity: 20, rate: 75 },
        { description: 'Software License', quantity: 1, rate: 500 },
      ],
      taxRate: 10,
      notes: 'Please review and let us know if you have any questions.',
      terms: 'Net payment terms: 30 days.',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logoUrl: undefined,
      backgroundUrl: undefined,
      signatureUrl: undefined,
    },
    isDefault: true,
  },
  {
    id: 'tmpl-minimal-clean',
    name: 'Minimal Clean',
    description: 'Ultra clean and minimal design focusing on essential information.',
    category: 'minimal',
    themeColor: '#000000',        // Black for high contrast
    textFont: 'sans',            // Clean sans-serif
    numberFont: 'sans',          // Same sans-serif for numbers (clean look)
    template: {
      id: '',
      number: 'INV-001',
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      from: {
        businessName: 'Simple Business',
        address: '101 Easy Street',
        cityStateZip: 'Austin, TX 78701',
        country: 'USA',
        email: 'hi@simple.com',
        phone: '+1 (555) 345-6789',
      },
      to: {
        clientName: 'Client Person',
        company: 'Client Ltd',
        address: '202 Simple Road',
        cityStateZip: 'Seattle, WA 98101',
        country: 'USA',
        email: 'person@client.co',
        phone: '+1 (555) 987-6543',
      },
      items: [
        { description: 'Design Consultation', quantity: 5, rate: 120 },
        { description: 'Development Work', quantity: 15, rate: 80 },
      ],
      taxRate: 0, // No tax for simplicity
      notes: 'Looking forward to our continued partnership.',
      terms: 'Payment due upon receipt.',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logoUrl: undefined,
      backgroundUrl: undefined,
      signatureUrl: undefined,
    },
    isDefault: true,
  },
  {
    id: 'tmpl-colorful-creative',
    name: 'Colorful Creative',
    description: 'Vibrant and creative design suitable for agencies and creative professionals.',
    category: 'colorful',
    themeColor: '#EC4899',        // Vibrant pink
    textFont: 'sans',            // Modern sans-serif
    numberFont: 'mono',          // Monospace for digital feel
    template: {
      id: '',
      number: 'INV-001',
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      from: {
        businessName: 'Creative Agency',
        address: 'Creative Boulevard 555',
        cityStateZip: 'Miami, FL 33101',
        country: 'USA',
        email: 'hello@creative.com',
        phone: '+1 (555) 555-5555',
      },
      to: {
        clientName: 'Innovative Client',
        company: 'Innovation Inc',
        address: 'Innovation Drive 777',
        cityStateZip: 'Portland, OR 97201',
        country: 'USA',
        email: 'innovate@client.com',
        phone: '+1 (555) 777-7777',
      },
      items: [
        { description: 'Brand Identity Package', quantity: 1, rate: 2500 },
        { description: 'Social Media Kit', quantity: 1, rate: 800 },
        { description: 'Marketing Materials', quantity: 1, rate: 1200 },
      ],
      taxRate: 5,
      notes: 'Thanks for trusting us with your creative vision!',
      terms: 'Payment due within 14 days.',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logoUrl: undefined,
      backgroundUrl: undefined,
      signatureUrl: undefined,
    },
    isDefault: true,
  }
];