import { useState, MouseEvent } from 'react';
import { MoreHorizontal, Upload, ClipboardPaste, Shuffle, Trash2 } from 'lucide-react';
import { LineItem } from '@/lib/types';
import ImportFileModal from './ImportFileModal';
import PasteBulkModal from './PasteBulkModal';
import RandomGenerateModal from './RandomGenerateModal';
import { useI18n } from '@/i18n/context';

interface LineItemsBulkActionsProps {
  onImportItems: (items: LineItem[]) => void;
  onClearItems?: () => void;
}

export default function LineItemsBulkActions({ onImportItems, onClearItems }: LineItemsBulkActionsProps) {
  const { tInvoice } = useI18n();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [showRandomModal, setShowRandomModal] = useState(false);

  const toggleDropdown = (e: MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleImportFromFile = (items: LineItem[]) => {
    onImportItems(items);
    setShowImportModal(false);
  };

  const handlePasteFromText = (items: LineItem[]) => {
    onImportItems(items);
    setShowPasteModal(false);
  };

  const handleRandomGenerate = (items: LineItem[]) => {
    onImportItems(items);
    setShowRandomModal(false);
  };

  const handleClearItems = () => {
    if (onClearItems && window.confirm(tInvoice('invoice.lineItems.bulkActions.confirmClear') || 'Are you sure you want to clear all items? This action cannot be undone.')) {
      onClearItems();
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-sm font-medium text-slate-700 hover:text-primary"
          aria-haspopup="true"
          aria-expanded={showDropdown}
          aria-label={tInvoice('invoice.lineItems.bulkActions.label') || 'Bulk actions menu'}
        >
          <MoreHorizontal className="h-4 w-4 mr-1" />
          {tInvoice('invoice.lineItems.bulkActions.title') || 'Bulk Actions'}
        </button>

        {showDropdown && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              <button
                onClick={() => {
                  setShowImportModal(true);
                  setShowDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-left text-slate-700 hover:bg-slate-100"
              >
                <Upload className="h-4 w-4 mr-2" />
                {tInvoice('invoice.lineItems.bulkActions.importFile') || 'Import File'}
              </button>

              <button
                onClick={() => {
                  setShowPasteModal(true);
                  setShowDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-left text-slate-700 hover:bg-slate-100"
              >
                <ClipboardPaste className="h-4 w-4 mr-2" />
                {tInvoice('invoice.lineItems.bulkActions.pasteText') || 'Paste Text'}
              </button>

              <button
                onClick={() => {
                  setShowRandomModal(true);
                  setShowDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-left text-slate-700 hover:bg-slate-100"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                {tInvoice('invoice.lineItems.bulkActions.randomGenerate') || 'Random Generate'}
              </button>

              {onClearItems && (
                <>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      handleClearItems();
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {tInvoice('invoice.lineItems.bulkActions.clearList') || 'Clear List'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <ImportFileModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportFromFile}
      />

      <PasteBulkModal
        isOpen={showPasteModal}
        onClose={() => setShowPasteModal(false)}
        onImport={handlePasteFromText}
      />

      <RandomGenerateModal
        isOpen={showRandomModal}
        onClose={() => setShowRandomModal(false)}
        onImport={handleRandomGenerate}
      />
    </>
  );
}