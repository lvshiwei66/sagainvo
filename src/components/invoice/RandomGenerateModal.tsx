import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { LineItem } from '@/lib/types';
import { productCatalog, Product } from '@/lib/product-catalog';
import { useI18n } from '@/i18n/context';

interface RandomGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: LineItem[]) => void;
}

export default function RandomGenerateModal({ isOpen, onClose, onImport }: RandomGenerateModalProps) {
  const { tInvoice, locale } = useI18n();
  const [count, setCount] = useState(10);
  const [previewItems, setPreviewItems] = useState<any[]>([]);
  const [generatedItems, setGeneratedItems] = useState<LineItem[]>([]);

  const resetState = useCallback(() => {
    setCount(10);
    setPreviewItems([]);
    setGeneratedItems([]);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const generateItems = () => {
    const shuffledProducts = [...productCatalog].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffledProducts.slice(0, count);

    const items: LineItem[] = selectedProducts.map((product: Product) => ({
      description: product.name[locale as keyof typeof product.name] || product.name.en,
      quantity: product.defaultQuantity,
      rate: product.defaultRate
    }));

    setGeneratedItems(items);

    // Preview only first 10 items
    setPreviewItems(items.slice(0, 10));
  };

  const handleGenerate = () => {
    generateItems();
  };

  const handleImport = () => {
    onImport(generatedItems);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-slate-900">
              {tInvoice('invoice.lineItems.random.title') || 'Random Generate Items'}
            </h3>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {tInvoice('invoice.lineItems.random.countLabel') || 'Number of items to generate (max 50):'}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => {
                    const val = Math.min(50, Math.max(1, parseInt(e.target.value) || 1));
                    setCount(val);
                  }}
                  className="w-20 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {tInvoice('invoice.lineItems.random.countDescription', { count }) ||
                  `Generating ${count} random items from our product catalog.`}
              </p>
            </div>

            {!generatedItems.length ? (
              <div className="flex justify-center pt-8 pb-12">
                <button
                  onClick={handleGenerate}
                  className="px-6 py-3 bg-primary hover:bg-blue-700 rounded-md text-white font-medium"
                >
                  {tInvoice('invoice.lineItems.random.generateButton') || 'Generate Items'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <p className="text-blue-800">
                    {tInvoice('invoice.lineItems.random.success', { count: generatedItems.length }) ||
                      `Generated ${generatedItems.length} items successfully.`}
                  </p>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {tInvoice('invoice.lineItems.descriptionHeader') || 'Description'}
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {tInvoice('invoice.lineItems.quantityHeader') || 'Quantity'}
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {tInvoice('invoice.lineItems.rateHeader') || 'Rate'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {previewItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900 max-w-xs truncate">
                              {item.description}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">
                              {item.rate.toFixed(4)}
                            </td>
                          </tr>
                        ))}
                        {generatedItems.length > 10 && (
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-sm text-slate-500 italic text-center">
                              {tInvoice('invoice.lineItems.random.andMore', { count: generatedItems.length - 10 }) ||
                                `... and ${generatedItems.length - 10} more items`}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setGeneratedItems([]);
                      setPreviewItems([]);
                    }}
                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
                  >
                    {tInvoice('invoice.lineItems.random.regenerate') || 'Regenerate'}
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
                  >
                    {tInvoice('invoice.lineItems.random.cancel') || 'Cancel'}
                  </button>
                  <button
                    onClick={handleImport}
                    className="px-4 py-2 bg-primary hover:bg-blue-700 rounded-md text-white"
                  >
                    {tInvoice('invoice.lineItems.random.confirm') || 'Import Items'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}