import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, X, RotateCcw } from 'lucide-react';
import { LineItem } from '@/lib/types';
import { parseExcel, parseCSV, validateLineItems, ParseResult } from '@/lib/bulk-import';
import { useI18n } from '@/i18n/context';

interface ImportFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: LineItem[]) => void;
}

export default function ImportFileModal({ isOpen, onClose, onImport }: ImportFileModalProps) {
  const { tInvoice } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      // 验证文件类型
      if (!isValidFileType(droppedFile.name)) {
        setError(tInvoice('invoice.lineItems.import.invalidFileType') || 'Invalid file type. Please upload a CSV or Excel file.');
        return;
      }

      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // 验证文件类型
      if (!isValidFileType(selectedFile.name)) {
        setError(tInvoice('invoice.lineItems.import.invalidFileType') || 'Invalid file type. Please upload a CSV or Excel file.');
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const isValidFileType = (fileName: string): boolean => {
    const ext = fileName.toLowerCase().split('.').pop();
    return ext === 'csv' || ext === 'xlsx' || ext === 'xls';
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      let parseResult: ParseResult;

      if (file.name.toLowerCase().endsWith('.csv')) {
        // Read CSV file as text
        const text = await file.text();
        parseResult = parseCSV(text);
      } else {
        // Read Excel file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        parseResult = parseExcel(arrayBuffer);
      }

      if (parseResult.success && parseResult.items) {
        // Validate parsed items
        const validation = validateLineItems(parseResult.items);

        if (validation.valid) {
          setResult(parseResult);
        } else {
          setError(validation.errors.join('\n'));
        }
      } else {
        setError(parseResult.error || 'Failed to parse file');
      }
    } catch (err) {
      console.error('Error processing file:', err);
      setError(tInvoice('invoice.lineItems.import.processingError') || 'Error processing file. Please try again.');
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

  // Process file when it's selected
  useEffect(() => {
    if (file && !result && !error) {
      processFile();
    }
  }, [file, result, error]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

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
              {tInvoice('invoice.lineItems.import.title') || 'Import Line Items'}
            </h3>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!file ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-primary bg-blue-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDrop={handleDrop}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600 mb-2">
                {tInvoice('invoice.lineItems.import.dragAndDrop') || 'Drag & drop your file here, or click to browse'}
              </p>
              <p className="text-sm text-slate-500">
                {tInvoice('invoice.lineItems.import.supportedFormats') || 'Supported formats: CSV, XLS, XLSX (max 50 rows)'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded">
                <div className="flex items-center">
                  <span className="font-medium truncate max-w-xs">{file.name}</span>
                  <span className="text-slate-500 text-sm ml-2">
                    ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {isProcessing && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-red-800 text-sm whitespace-pre-wrap">{error}</p>
                  <button
                    onClick={resetState}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    {tInvoice('invoice.lineItems.import.tryAgain') || 'Try Again'}
                  </button>
                </div>
              )}

              {result?.success && result.items && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <p className="text-green-800">
                      {tInvoice('invoice.lineItems.import.success', { count: result.rowCount }) ||
                        `Successfully parsed ${result.rowCount} items.`}
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
                          {result.items.slice(0, 10).map((item, index) => (
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
                                {tInvoice('invoice.lineItems.import.andMore', { count: result.items.length - 10 }) ||
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
                      {tInvoice('invoice.lineItems.import.cancel') || 'Cancel'}
                    </button>
                    <button
                      onClick={handleImport}
                      className="px-4 py-2 bg-primary hover:bg-blue-700 rounded-md text-white"
                    >
                      {tInvoice('invoice.lineItems.import.confirm') || 'Import Items'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}