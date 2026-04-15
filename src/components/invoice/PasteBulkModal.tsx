import { useState, useCallback } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { LineItem } from '@/lib/types';
import { parseCSV, validateLineItems } from '@/lib/bulk-import';
import { useI18n } from '@/i18n/context';

interface PasteBulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: LineItem[]) => void;
}

export default function PasteBulkModal({ isOpen, onClose, onImport }: PasteBulkModalProps) {
  const { tInvoice } = useI18n();
  const [csvText, setCsvText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setCsvText('');
    setResult(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const processCsvText = () => {
    if (!csvText.trim()) {
      setError(tInvoice('invoice.lineItems.paste.emptyError') || 'Please paste some CSV data');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const parseResult = parseCSV(csvText);

      if (parseResult.success && parseResult.items) {
        // Validate parsed items
        const validation = validateLineItems(parseResult.items);

        if (validation.valid) {
          setResult(parseResult);
        } else {
          setError(validation.errors.join('\n'));
        }
      } else {
        setError(parseResult.error || 'Failed to parse CSV text');
      }
    } catch (err) {
      console.error('Error processing CSV text:', err); // TODO: Replace with proper error logging in production
      setError(tInvoice('invoice.lineItems.paste.processingError') || 'Error processing CSV text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (result?.success && result.items) {
      onImport(result.items);
      handleClose();
    }
  };

  const exampleCsv = `description,quantity,rate
Web Development,1,500.00
Logo Design,1,200.00
SEO Consultation,1,300.00`;

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
              {tInvoice('invoice.lineItems.paste.title') || 'Paste CSV Data'}
            </h3>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {tInvoice('invoice.lineItems.paste.instructions') || 'Paste your CSV data here:'}
              </label>
              <textarea
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value);
                  // Clear result and error when user types
                  if (result || error) {
                    setResult(null);
                    setError(null);
                  }
                }}
                rows={8}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                placeholder={tInvoice('invoice.lineItems.paste.placeholder') || 'Paste CSV data here... Example:\ndescription,quantity,rate\nWeb Development,1,500.00\nLogo Design,1,200.00'}
              />
            </div>

            <div className="bg-slate-50 p-4 rounded border">
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                {tInvoice('invoice.lineItems.paste.example') || 'Example CSV format:'}
              </h4>
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto whitespace-pre-wrap">
                {exampleCsv}
              </pre>
              <p className="text-xs text-slate-500 mt-2">
                {tInvoice('invoice.lineItems.paste.formatNote') || 'Columns can be in any order and can include headers like "description", "quantity", "rate", "desc", "price", etc.'}
              </p>
            </div>

            {isProcessing && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-red-800 text-sm whitespace-pre-wrap">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  {tInvoice('invoice.lineItems.paste.clearError') || 'Clear error'}
                </button>
              </div>
            )}

            {result?.success && result.items && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <p className="text-green-800">
                    {tInvoice('invoice.lineItems.paste.success', { count: result.rowCount ?? 0 }) ||
                      `Successfully parsed ${result.rowCount ?? 0} items.`}
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
                        {result.items.slice(0, 10).map((item: LineItem, index: number) => (
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
                        {result.items.length > 10 && (
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-sm text-slate-500 italic text-center">
                              {tInvoice('invoice.lineItems.paste.andMore', { count: result.items.length - 10 }) ||
                                `... and ${result.items.length - 10} more items`}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
                  >
                    {tInvoice('invoice.lineItems.paste.cancel') || 'Cancel'}
                  </button>
                  <button
                    onClick={handleImport}
                    className="px-4 py-2 bg-primary hover:bg-blue-700 rounded-md text-white"
                  >
                    {tInvoice('invoice.lineItems.paste.confirm') || 'Import Items'}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              {!result && (
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
                >
                  {tInvoice('invoice.lineItems.paste.cancel') || 'Cancel'}
                </button>
              )}
              {!result && (
                <button
                  onClick={processCsvText}
                  disabled={!csvText.trim() || isProcessing}
                  className={`px-4 py-2 rounded-md text-white ${
                    csvText.trim() && !isProcessing
                      ? 'bg-primary hover:bg-blue-700'
                      : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  {tInvoice('invoice.lineItems.paste.preview') || 'Preview'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}