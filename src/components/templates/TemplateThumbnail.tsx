import React from 'react';

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
              INVOICE
            </div>
            <div className={`text-xs mt-1 ${textFontClass} text-gray-500`}>
              {category === 'modern' ? 'Modern' : category === 'classic' ? 'Classic' : category === 'minimal' ? 'Minimal' : 'Colorful'}
            </div>
          </div>
          <div className="text-right">
            <div className={`${numberFontClass} text-sm`}>INV-001</div>
            <div className={`${textFontClass} text-xs text-gray-500`}>Date: 04/09/2026</div>
          </div>
        </div>

        {/* From/To 区域 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className={`${textFontClass} text-xs font-medium mb-1 opacity-75`}>FROM</div>
            <div className={`${textFontClass} text-xs mb-1`}>Your Company</div>
            <div className={`${textFontClass} text-xs mb-1`}>Address Line</div>
            <div className={`${textFontClass} text-xs mb-1`}>City, State 12345</div>
            <div className={`${textFontClass} text-xs`}>contact@email.com</div>
          </div>
          <div>
            <div className={`${textFontClass} text-xs font-medium mb-1 opacity-75`}>TO</div>
            <div className={`${textFontClass} text-xs mb-1`}>Client Name</div>
            <div className={`${textFontClass} text-xs mb-1`}>Company Name</div>
            <div className={`${textFontClass} text-xs mb-1`}>Address Line</div>
            <div className={`${textFontClass} text-xs`}>contact@client.com</div>
          </div>
        </div>

        {/* 表格头部 */}
        <div className="flex justify-between border-b pb-1 mb-1">
          <div className={`${textFontClass} text-xs font-medium w-1/2`}>Description</div>
          <div className={`${textFontClass} text-xs font-medium w-[15%] text-right`}>Qty</div>
          <div className={`${textFontClass} text-xs font-medium w-[15%] text-right`}>Rate</div>
          <div className={`${textFontClass} text-xs font-medium w-[20%] text-right`}>Amount</div>
        </div>

        {/* 表格行 */}
        <div className="flex justify-between mb-1">
          <div className={`${textFontClass} text-xs w-1/2 truncate`}>Service Description</div>
          <div className={`${numberFontClass} text-xs w-[15%] text-right`}>1</div>
          <div className={`${numberFontClass} text-xs w-[15%] text-right`}>$100.00</div>
          <div className={`${numberFontClass} text-xs w-[20%] text-right`}>$100.00</div>
        </div>
        <div className="flex justify-between mb-1">
          <div className={`${textFontClass} text-xs w-1/2 truncate`}>Another Service</div>
          <div className={`${numberFontClass} text-xs w-[15%] text-right`}>2</div>
          <div className={`${numberFontClass} text-xs w-[15%] text-right`}>$50.00</div>
          <div className={`${numberFontClass} text-xs w-[20%] text-right`}>$100.00</div>
        </div>

        {/* 总计区域 */}
        <div className="ml-auto w-1/3 border-t pt-1 mt-2">
          <div className="flex justify-between text-xs">
            <span className={textFontClass}>Subtotal:</span>
            <span className={numberFontClass}>$200.00</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className={textFontClass}>Tax (8%):</span>
            <span className={numberFontClass}>$16.00</span>
          </div>
          <div className="flex justify-between text-xs font-bold mt-1 pt-1 border-t">
            <span className={textFontClass}>TOTAL:</span>
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
            <div>Notes: Thank you!</div>
          </div>
          <div className={textFontClass}>
            <div>Terms: Net 30</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateThumbnail;