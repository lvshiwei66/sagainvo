import { LineItem } from "./types";
import * as XLSX from 'xlsx';

export interface ParseResult {
  success: boolean;
  items?: LineItem[];
  error?: string;
  rowCount?: number;
}

export interface ParseOptions {
  maxRows?: number;
}

const DEFAULT_MAX_ROWS = 50;

/**
 * 解析 CSV 文本内容
 * @param content CSV 文本内容
 * @param options 解析选项
 * @returns 解析结果
 */
export function parseCSV(content: string, options: ParseOptions = {}): ParseResult {
  const maxRows = options.maxRows || DEFAULT_MAX_ROWS;

  try {
    // 处理换行符差异
    const lines = content.trim().split(/\r?\n/);

    if (lines.length === 0 || (lines.length === 1 && lines[0].trim() === '')) {
      return { success: false, error: 'CSV content is empty' };
    }

    const parsedItems: LineItem[] = [];
    let headerProcessed = false;
    let descIndex = -1, qtyIndex = -1, rateIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (i >= maxRows + 1) break; // +1 for header

      const line = lines[i].trim();
      if (!line) continue;

      // 解析 CSV 行，处理引号包围的内容
      const values = parseCSVRow(line);

      if (!headerProcessed) {
        // 尝试找到描述、数量、价格列的索引
        descIndex = findColumnIndex(values, ['description', 'desc', 'name', 'item', 'product']);
        qtyIndex = findColumnIndex(values, ['quantity', 'qty', 'amount', 'count']);
        rateIndex = findColumnIndex(values, ['rate', 'price', 'cost', 'unit price', 'amount']);

        // 如果找不到匹配列，则假定顺序为 description, quantity, rate
        if (descIndex === -1) descIndex = 0;
        if (qtyIndex === -1) qtyIndex = Math.min(1, values.length - 1);
        if (rateIndex === -1) qtyIndex < values.length - 1 ? rateIndex = Math.min(2, values.length - 1) : rateIndex = -1;

        headerProcessed = true;
        continue;
      }

      // 创建 LineItem
      const description = values[descIndex]?.trim() || '';
      const quantityStr = values[qtyIndex]?.toString().trim() || '0';
      const rateStr = values[rateIndex]?.toString().trim() || '0';

      // 验证并转换数量
      let quantity: number;
      if (quantityStr === '') {
        quantity = 1; // 默认数量
      } else {
        const parsedQty = parseFloat(quantityStr);
        if (isNaN(parsedQty)) {
          return {
            success: false,
            error: `Invalid quantity at row ${i + 1}: "${quantityStr}". Quantity must be a number.`
          };
        }
        // 保留原始数值，最多保留8位小数
        quantity = parseFloat(parsedQty.toFixed(8));
      }

      // 验证并转换价格
      let rate: number;
      if (rateStr === '') {
        rate = 0; // 默认价格
      } else {
        const parsedRate = parseFloat(rateStr);
        if (isNaN(parsedRate)) {
          return {
            success: false,
            error: `Invalid rate at row ${i + 1}: "${rateStr}". Rate must be a number.`
          };
        }
        // 保留原始数值，最多保留4位小数
        rate = parseFloat(parsedRate.toFixed(4));
      }

      parsedItems.push({
        description,
        quantity,
        rate
      });
    }

    return {
      success: true,
      items: parsedItems,
      rowCount: parsedItems.length
    };
  } catch (error) {
    return {
      success: false,
      error: `Error parsing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 解析 Excel 文件
 * @param buffer Excel 文件的 ArrayBuffer
 * @param options 解析选项
 * @returns 解析结果
 */
export function parseExcel(buffer: ArrayBuffer, options: ParseOptions = {}): ParseResult {
  const maxRows = options.maxRows || DEFAULT_MAX_ROWS;

  try {
    const workbook = XLSX.read(buffer, { type: 'array' });

    // 获取第一个工作表
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return { success: false, error: 'No sheets found in Excel file' };
    }

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // 获取二维数组

    if (jsonData.length === 0) {
      return { success: false, error: 'Excel sheet is empty' };
    }

    const parsedItems: LineItem[] = [];
    let headerProcessed = false;
    let descIndex = -1, qtyIndex = -1, rateIndex = -1;

    for (let i = 0; i < Math.min(jsonData.length, maxRows + 1); i++) { // +1 for header
      const row: any[] = Array.isArray(jsonData[i]) ? jsonData[i] : [];

      if (row.length === 0) continue;

      if (!headerProcessed) {
        // 尝试找到描述、数量、价格列的索引
        descIndex = findColumnIndex(row.map(String), ['description', 'desc', 'name', 'item', 'product']);
        qtyIndex = findColumnIndex(row.map(String), ['quantity', 'qty', 'amount', 'count']);
        rateIndex = findColumnIndex(row.map(String), ['rate', 'price', 'cost', 'unit price', 'amount']);

        // 如果找不到匹配列，则假定顺序为 description, quantity, rate
        if (descIndex === -1) descIndex = 0;
        if (qtyIndex === -1) qtyIndex = Math.min(1, row.length - 1);
        if (rateIndex === -1) qtyIndex < row.length - 1 ? rateIndex = Math.min(2, row.length - 1) : rateIndex = -1;

        headerProcessed = true;
        continue;
      }

      // 创建 LineItem
      const description = String(row[descIndex] || '').toString().trim();
      const quantityStr = String(row[qtyIndex] || '0').toString().trim();
      const rateStr = String(row[rateIndex] || '0').toString().trim();

      // 验证并转换数量
      let quantity: number;
      if (quantityStr === '') {
        quantity = 1; // 默认数量
      } else {
        const parsedQty = parseFloat(quantityStr);
        if (isNaN(parsedQty)) {
          return {
            success: false,
            error: `Invalid quantity at row ${i + 1}: "${quantityStr}". Quantity must be a number.`
          };
        }
        // 保留原始数值，最多保留8位小数
        quantity = parseFloat(parsedQty.toFixed(8));
      }

      // 验证并转换价格
      let rate: number;
      if (rateStr === '') {
        rate = 0; // 默认价格
      } else {
        const parsedRate = parseFloat(rateStr);
        if (isNaN(parsedRate)) {
          return {
            success: false,
            error: `Invalid rate at row ${i + 1}: "${rateStr}". Rate must be a number.`
          };
        }
        // 保留原始数值，最多保留4位小数
        rate = parseFloat(parsedRate.toFixed(4));
      }

      parsedItems.push({
        description,
        quantity,
        rate
      });
    }

    return {
      success: true,
      items: parsedItems,
      rowCount: parsedItems.length
    };
  } catch (error) {
    return {
      success: false,
      error: `Error parsing Excel: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * 验证明细项数组
 * @param items 明细项数组
 * @returns 验证结果
 */
export function validateLineItems(items: LineItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // 验证数量必须是非负数
    if (typeof item.quantity !== 'number' || isNaN(item.quantity) || item.quantity < 0) {
      errors.push(`Item ${i + 1}: Quantity must be a non-negative number`);
    }

    // 验证价格必须是非负数
    if (typeof item.rate !== 'number' || isNaN(item.rate) || item.rate < 0) {
      errors.push(`Item ${i + 1}: Rate must be a non-negative number`);
    }

    // 验证描述长度
    if (item.description && item.description.length > 200) {
      errors.push(`Item ${i + 1}: Description is too long (max 200 characters)`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 解析 CSV 行，处理引号内的逗号
 */
function parseCSVRow(row: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1] || '';

    if (char === '"' && !inQuotes) {
      inQuotes = true;
    } else if (char === '"' && nextChar === '"') {
      current += '"';
      i++; // Skip next quote
    } else if (char === '"' && inQuotes && nextChar !== '"') {
      inQuotes = false;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

/**
 * 查找列索引
 */
function findColumnIndex(headers: string[], possibleNames: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toLowerCase().trim();
    if (possibleNames.some(name => header.includes(name))) {
      return i;
    }
  }
  return -1;
}