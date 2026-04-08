import { FileText, Zap, Shield, Download } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <h1 className="text-xl font-semibold text-slate-900">Saga Invoice</h1>
            </div>
            <a
              href="/editor"
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Create Invoice
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light text-slate-900 mb-6 tracking-tight">
            Professional Invoices in 30 Seconds
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Create, customize, and send beautiful invoices. No signup required.
            Perfect for Amazon, Shopify, and Etsy sellers.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/editor"
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-lg shadow-primary/25"
            >
              Create Your First Invoice
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-light text-center text-slate-900 mb-12">
            Everything You Need
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Zap className="h-8 w-8 mb-4 text-primary" />
              <h4 className="text-lg font-medium text-slate-900 mb-2">Lightning Fast</h4>
              <p className="text-slate-600">Create professional invoices in under 30 seconds.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Shield className="h-8 w-8 mb-4 text-primary" />
              <h4 className="text-lg font-medium text-slate-900 mb-2">Privacy First</h4>
              <p className="text-slate-600">Your data stays in your browser. No server storage.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Download className="h-8 w-8 mb-4 text-primary" />
              <h4 className="text-lg font-medium text-slate-900 mb-2">Export Anywhere</h4>
              <p className="text-slate-600">Download as PDF or CSV. Print directly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p>&copy; 2026 Saga Invoice. Built for e-commerce sellers.</p>
        </div>
      </footer>
    </main>
  );
}
