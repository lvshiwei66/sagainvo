# DOMPDF 高度计算修复 - getBoundingClientRect() 方案

## 问题回顾

之前的修复尝试：
1. ❌ 使用固定高度调整因子（-22.67mm/-64px）- 失败
2. ❌ 移除 scale 配置，使用 `minHeight: 'unset'` 和 `height: 'auto'` - 失败
3. ❌ Notes 和 Terms 区域仍然缺失
4. ❌ PDF 高度与预览高度不一致

## 根本原因分析

**问题核心**：DOMPDF 渲染的 PDF 高度与预览容器的实际渲染高度不一致

原因：
- 预览容器在浏览器中渲染，高度由内容自然决定
- DOMPDF 使用自己的布局引擎，可能对 CSS 的解释不同
- 没有明确设置高度时，DOMPDF 可能使用内部默认值或 A4 固定高度

## 新解决方案：使用 getBoundingClientRect() 精确计算高度

### 核心思路
1. 在导出前，使用 `getBoundingClientRect()` 获取预览容器的实际渲染高度
2. 将这个精确高度应用到导出容器上
3. DOMPDF 基于这个精确高度生成 PDF

### 实现细节

#### src/lib/dompdf-export.ts

```typescript
// 添加像素到毫米的转换因子
const PX_TO_MM = 0.264583;

// 使用 getBoundingClientRect() 获取精确高度
const rect = invoiceElement.getBoundingClientRect();
const contentHeightPx = rect.height;
const contentHeightMm = contentHeightPx * PX_TO_MM;

console.log(`Invoice container dimensions: ${rect.width.toFixed(2)}x${contentHeightPx.toFixed(2)}px`);

// 设置精确高度用于 PDF 生成
invoiceElement.style.height = `${contentHeightPx}px`;
invoiceElement.style.minHeight = 'unset';

// 强制重排以确保高度应用
void invoiceElement.offsetHeight;
```

#### src/components/invoice/InvoicePreview.dompdf.tsx

```typescript
const handleExportPDF = async () => {
  // 导出前记录预览容器的尺寸
  if (invoiceContainerRef.current) {
    const rect = invoiceContainerRef.current.getBoundingClientRect();
    console.log(`Invoice container rendered dimensions: ${rect.width.toFixed(2)}x${rect.height.toFixed(2)}px`);
  }

  await exportPDFWithLogo(invoice, totals);
};
```

### 关键变化

| 参数 | 之前 | 现在 |
|------|------|------|
| 高度计算 | `A4_HEIGHT_MM - adjustment` | `getBoundingClientRect().height` |
| 高度单位 | mm | px（DOMPDF 内部处理） |
| 高度设置 | 固定值 | 动态获取的实际渲染值 |
| 重排确认 | 无 | `void element.offsetHeight` |

## 预期效果

1. ✅ PDF 高度与预览高度完全一致
2. ✅ Notes 和 Terms 区域完整显示
3. ✅ 不再需要手动调整高度因子
4. ✅ 无论内容多少，PDF 都能自适应

## 验证步骤

1. 打开 http://localhost:3000/editor
2. 填写完整的发票数据（包括 Notes 和 Terms）
3. 打开浏览器控制台查看尺寸日志
4. 点击"Download PDF"导出
5. 检查导出的 PDF：
   - Notes 和 Terms 应该完整显示
   - 高度应该与预览一致
   - 不应该有多余空白页

## 技术说明

### getBoundingClientRect() 优势
- 返回元素相对于视口的精确尺寸
- 考虑了所有 CSS 样式和布局
- 包括 padding、border、margin（如果适用）
- 返回亚像素精度值（小数）

### 强制重排（Reflow）
```typescript
void invoiceElement.offsetHeight;
```
这行代码强制浏览器立即计算并应用新的样式，确保 DOMPDF 获取到的是最新布局。

### 像素到毫米转换
```typescript
const PX_TO_MM = 0.264583; // 96 DPI 标准
```
这个转换因子用于日志记录，实际 DOMPDF 使用像素值。

## 故障排除

如果仍然有问题，检查：
1. 控制台日志中的尺寸值是否合理
2. Notes/Terms 是否被填写
3. PDF 查看器是否有额外的边距设置
4. 尝试清除浏览器缓存后重试
