import React from 'react';
import { useI18n } from '@/i18n/context';

interface TemplateThumbnailProps {
  themeColor: string;
  textFont: 'sans' | 'serif' | 'mono';
  numberFont: 'sans' | 'serif' | 'mono';
  category: 'modern' | 'classic' | 'minimal' | 'colorful';
  className?: string;
}

const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  themeColor,
  textFont,
  numberFont,
  category,
  className = ''
}) => {
  // 使用国际化
  const { tInvoice, tCommon } = useI18n();

  // 字体映射
  const textFontClass = textFont === 'sans' ? 'font-sans' : textFont === 'serif' ? 'font-serif' : 'font-mono';
  const numberFontClass = numberFont === 'sans' ? 'font-sans' : numberFont === 'serif' ? 'font-serif' : 'font-mono';

  return (
    <div className={`relative bg-white border rounded-lg shadow-sm overflow-hidden w-full h-64 flex items-center justify-center ${className}`}>
      {/* 发票主体容器 */}
      <div
        className="absolute inset-4 border rounded p-3"
        style={{ borderColor: themeColor }}
      >
        {/* 标题行 */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div
              className={`text-lg font-bold ${textFontClass}`}
              style={{ color: themeColor }}
            >
              {tInvoice('invoice.title') || 'INVOICE'}
            </div>
            <div className={`text-xs mt-1 ${textFontClass} text-gray-500`}>
              {tCommon(`templates.category.${category}`) || category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
          </div>
          <div className="text-right">
            <div className={`${numberFontClass} text-sm`}>{tInvoice('invoice.meta.invoiceNumber') || 'INV'}-001</div>
            <div className={`${textFontClass} text-xs text-gray-500`}>{tInvoice('invoice.meta.dateLabel') || 'Date'}: 04/09/2026</div>
          </div>
        </div>

        {/* From/To 区域 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className={`${textFontClass} text-xs font-medium mb-1 opacity-75`}>{tInvoice('invoice.labels.from') || 'FROM'}</div>
            <div className={`${textFontClass} text-xs mb-1`}>{tInvoice('invoice.demo.company') || 'Your Company'}</div>
            <div className={`${textFontClass} text-xs mb-1`}>{tInvoice('invoice.demo.address') || 'Address Line'}</div>
            <div className={`${textFontClass} text-xs mb-1`}>{tInvoice('invoice.demo.city') || 'City, State 12345'}</div>
            <div className={`${textFontClass} text-xs`}>{tInvoice('invoice.demo.email') || 'contact@email.com'}</div>
          </div>
          <div>
            <div className={`${textFontClass} text-xs font-medium mb-1 opacity-75`}>{tInvoice('invoice.labels.to') || 'TO'}</div>
            <div className={`${textFontClass} text-xs mb-1`}>{tInvoice('invoice.demo.clientName') || 'Client Name'}</div>
            <div className={`${textFontClass} text-xs mb-1`}>{tInvoice('invoice.demo.clientCompany') || 'Company Name'}</div>
            <div className={`${textFontClass} text-xs mb-1`}>{tInvoice('invoice.demo.address') || 'Address Line'}</div>
            <div className={`${textFontClass} text-xs`}>{tInvoice('invoice.demo.clientEmail') || 'contact@client.com'}</div>
          </div>
        </div>

        {/* 表格头部 */}
        <div className="flex justify-between border-b pb-1 mb-1">
          <div className={`${textFontClass} text-xs font-medium w-1/2`}>{tInvoice('invoice.labels.description') || 'Description'}</div>
          <div className={`${textFontClass} text-xs font-medium w-[15%] text-right`}>{tInvoice('invoice.labels.quantity') || 'Qty'}</div>
          <div className={`${textFontClass} text-xs font-medium w-[15%] text-right`}>{tInvoice('invoice.labels.rate') || 'Rate'}</div>
          <div className={`${textFontClass} text-xs font-medium w-[20%] text-right`}>{tInvoice('invoice.labels.amount') || 'Amount'}</div>
        </div>

        {/* 表格行 */}
        <div className="flex justify-between mb-1">
          <div className={`${textFontClass} text-xs w-1/2 truncate`}>{tInvoice('invoice.demo.serviceDesc') || 'Service Description'}</div>
          <div className={`${numberFontClass} text-xs w-[15%] text-right`}>1</div>
          <div className={`${numberFontClass} text-xs w-[15%] text-right`}>$100.00</div>
          <div className={`${numberFontClass} text-xs w-[20%] text-right`}>$100.00</div>
        </div>
        <div className="flex justify-between mb-1">
          <div className={`${textFontClass} text-xs w-1/2 truncate`}>{tInvoice('invoice.demo.anotherService') || 'Another Service'}</div>
          <div className={`${numberFontClass} text-xs w-[15%] text-right`}>2</div>
          <div className={`${numberFontClass} text-xs w-[15%] text-right`}>$50.00</div>
          <div className={`${numberFontClass} text-xs w-[20%] text-right`}>$100.00</div>
        </div>

        {/* 总计区域 */}
        <div className="ml-auto w-1/3 border-t pt-1 mt-2">
          <div className="flex justify-between text-xs">
            <span className={textFontClass}>{tInvoice('invoice.labels.subtotal') || 'Subtotal'}:</span>
            <span className={numberFontClass}>$200.00</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className={textFontClass}>{tInvoice('invoice.labels.tax') || 'Tax'} (8%):</span>
            <span className={numberFontClass}>$16.00</span>
          </div>
          <div className="flex justify-between text-xs font-bold mt-1 pt-1 border-t">
            <span className={textFontClass}>{tInvoice('invoice.labels.total') || 'TOTAL'}:</span>
            <span
              className={numberFontClass}
              style={{ color: themeColor }}
            >
              $216.00
            </span>
          </div>
        </div>

        {/* 底部注释 */}
        <div className="mt-2 text-xs flex justify-between">
          <div className={textFontClass}>
            <div>{tInvoice('invoice.labels.notes') || 'Notes'}: {tInvoice('invoice.demo.thankYou') || 'Thank you!'}</div>
          </div>
          <div className={textFontClass}>
            <div>{tInvoice('invoice.labels.terms') || 'Terms'}: {tInvoice('invoice.demo.net30') || 'Net 30'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateThumbnail;