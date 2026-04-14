# 打印功能实现指南

> 记录 react-to-print 集成过程中的问题、解决方案和最佳实践

## 目录

- [背景](#背景)
- [核心问题](#核心问题)
- [解决方案](#解决方案)
- [关键教训](#关键教训)
- [代码示例](#代码示例)
- [检查清单](#检查清单)
- [故障排查](#故障排查)

---

## 背景

在实现发票打印功能时，我们遇到了以下问题：
- 使用 `window.print()` 无法精确控制打印内容
- 浏览器默认的页眉页脚和页码无法移除
- 打印时包含不需要的 UI 元素（按钮、导航等）

**Issue**: [#29](https://github.com/lvshiwei66/sagainvo/issues/29)

---

## 核心问题

### 问题 1：`window.print()` 的局限性

```typescript
// ❌ 错误做法
const handlePrint = () => {
  window.print();
};
```

**问题**：
- 打印整个页面，无法精确控制打印内容
- 依赖 `@media print` CSS 隐藏元素，但可能有遗漏
- 无法自定义打印窗口的行为

### 问题 2：`react-to-print` 的独立文档特性

`react-to-print` 库会创建一个**新的浏览器窗口/iframe**来进行打印。这个打印窗口：
- 是一个独立的文档上下文
- **不会自动继承**主页面的 CSS 样式
- 只有显式注入的样式才会生效

### 问题 3：Tailwind CSS 的层叠优先级

Tailwind 的实用类（如 `border`、`shadow-md`、`drop-shadow-md`）在 CSS 层叠中可能具有较高的优先级，普通的 `@media print` 规则可能无法覆盖。

**受影响的元素**：
```tsx
<div className="invoice-container border shadow-md">  {/* border 和 shadow-md 难以覆盖 */}
<div className="invoice-preview-wrapper drop-shadow-md">  {/* drop-shadow-md 难以覆盖 */}
```

---

## 解决方案

### 1. 使用 `react-to-print` 的 `pageStyle` 注入样式

```typescript
// ✅ 正确做法
import { useReactToPrint } from 'react-to-print';

const handlePrint = useReactToPrint({
  contentRef: invoiceContainerRef,
  documentTitle: `Invoice_${invoice.number}_${invoice.date}`,
  pageStyle: `
    @page {
      margin: 10mm;
      size: A4;
    }
    body {
      margin: 0;
      padding: 0;
    }
    /* 必须在这里重复定义样式，因为打印窗口是独立文档 */
    .invoice-container {
      box-shadow: none !important;
      border: none !important;
      border-width: 0 !important;
    }
    .invoice-container.border {
      border-width: 0 !important;
    }
    .invoice-container.shadow-md {
      box-shadow: none !important;
    }
    .invoice-preview-wrapper.drop-shadow-md {
      filter: none !important;
    }
  `,
  onPrintError: (errorLocation, error) => {
    console.error('Print error:', error);
    alert('打印失败，请重试');
  },
});
```

**关键点**：
- `pageStyle` 中的样式会**直接注入**到打印窗口
- 必须使用 `!important` 覆盖 Tailwind 的样式
- 需要同时处理 `box-shadow` 和 `filter`（用于 `drop-shadow`）

### 2. 导入 `print.css` 到页面

```typescript
// src/app/editor/page.tsx
import '@/styles/print.css';
```

**注意**：
- `print.css` 只在主页面生效，作为 `pageStyle` 的补充
- 打印窗口可能不会加载外部 CSS 文件

### 3. 使用 `contentRef` 精确指定打印内容

```typescript
const invoiceContainerRef = useRef<HTMLDivElement>(null);

const handlePrint = useReactToPrint({
  contentRef: invoiceContainerRef,  // 只打印这个 ref 指向的元素
});

// JSX
<div ref={invoiceContainerRef} className="invoice-container">
  {/* 发票内容 */}
</div>
```

---

## 关键教训

### 教训 1：打印窗口是独立文档

> **核心认知**：`react-to-print` 创建的打印窗口是一个全新的文档，不会继承主页面的 CSS。

这意味着：
- `print.css` 中的 `@media print` 规则可能不会生效
- 必须使用 `pageStyle` 显式注入需要的样式
- 不能假设主页面的样式会自动应用

### 教训 2：Tailwind 实用类的优先级问题

> **核心认知**：Tailwind 的 CSS 在构建时生成，可能具有较高的层叠优先级。

解决方案：
- 使用 `!important` 强制覆盖
- 使用更具体的选择器（如 `.invoice-container.border`）
- 在 `pageStyle` 中重复定义关键样式

### 教训 3：`box-shadow` 和 `drop-shadow` 是不同的

> **核心认知**：`shadow-md` 使用 `box-shadow`，而 `drop-shadow-md` 使用 CSS `filter`。

需要同时移除：
```css
box-shadow: none !important;  /* 移除 shadow-md */
filter: none !important;      /* 移除 drop-shadow-md */
```

### 教训 4：样式来源的优先级

样式优先级从高到低：
1. 内联 `style` 属性
2. `pageStyle` 注入的样式
3. `print.css` 中的 `@media print` 规则
4. `globals.css` 中的样式
5. Tailwind 实用类

---

## 代码示例

### 完整的打印组件

```typescript
"use client";

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function InvoicePreview() {
  const invoiceContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceContainerRef,
    documentTitle: `Invoice_${invoice.number || 'draft'}_${invoice.date || 'no-date'}`,
    pageStyle: `
      @page {
        margin: 10mm;
        size: A4;
      }
      body {
        margin: 0;
        padding: 0;
      }
      .invoice-container {
        box-shadow: none !important;
        border: none !important;
        border-width: 0 !important;
        background: white !important;
      }
      .invoice-container.border {
        border-width: 0 !important;
      }
      .invoice-container.shadow-md {
        box-shadow: none !important;
      }
      .invoice-preview-wrapper.drop-shadow-md {
        filter: none !important;
      }
    `,
    onBeforePrint: () => {
      console.log('准备打印...');
    },
    onAfterPrint: () => {
      console.log('打印完成');
    },
    onPrintError: (errorLocation, error) => {
      console.error(`Print error in ${errorLocation}:`, error);
      alert('打印失败，请重试');
    },
  });

  return (
    <div>
      <button onClick={handlePrint}>Print Invoice</button>
      
      <div className="invoice-preview-wrapper drop-shadow-md">
        <div
          ref={invoiceContainerRef}
          className="invoice-container border shadow-md"
        >
          {/* 发票内容 */}
        </div>
      </div>
    </div>
  );
}
```

### `print.css` 模板

```css
@media print {
  /* 页面设置 */
  @page {
    margin: 10mm;
    size: A4;
  }

  /* Invoice container 打印样式 */
  .invoice-container {
    position: relative !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: auto !important;
    margin: 0 !important;
    padding: 10mm !important;
    box-shadow: none !important;
    border: none !important;
    background: white !important;
    overflow: visible !important;
    page-break-inside: avoid;
  }

  /* 覆盖 Tailwind 类 */
  .invoice-container.border {
    border-width: 0 !important;
  }

  .invoice-container.shadow-md {
    box-shadow: none !important;
  }

  .invoice-preview-wrapper.drop-shadow-md {
    filter: none !important;
  }

  /* 颜色保真 */
  .invoice-container *,
  .invoice-container *::before,
  .invoice-container *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  /* 表格分页处理 */
  table {
    page-break-inside: auto;
    width: 100%;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }
}
```

---

## 检查清单

在提交打印功能前，检查以下项目：

### 代码层面

- [ ] 使用 `useReactToPrint` 而非 `window.print()`
- [ ] 设置 `contentRef` 精确指定打印内容
- [ ] 在 `pageStyle` 中注入关键样式
- [ ] 使用 `!important` 覆盖 Tailwind 样式
- [ ] 移除 `box-shadow` 和 `filter`
- [ ] 配置 `@page` 边距和尺寸
- [ ] 添加错误处理回调

### 样式层面

- [ ] 打印时不显示边框
- [ ] 打印时不显示阴影
- [ ] 打印时不显示按钮和导航
- [ ] 颜色准确（使用 `print-color-adjust: exact`）
- [ ] 表格正确处理分页
- [ ] A4 纸张尺寸正确

### 测试层面

- [ ] 在 Chrome 中测试打印预览
- [ ] 在 Firefox 中测试打印预览
- [ ] 检查 PDF 导出效果
- [ ] 验证页边距合适
- [ ] 确认没有页眉页脚和页码

---

## 故障排查

### 问题：边框/阴影仍然存在

**可能原因**：
1. `pageStyle` 中没有使用 `!important`
2. 选择器不够具体
3. 只处理了 `box-shadow`，没处理 `filter`

**解决方法**：
```css
/* 确保同时处理这两种 */
.invoice-container {
  box-shadow: none !important;
  border: none !important;
}
.invoice-preview-wrapper.drop-shadow-md {
  filter: none !important;
}
```

### 问题：打印内容不完整

**可能原因**：
1. `contentRef` 指向了错误的元素
2. 打印窗口没有加载足够的样式

**解决方法**：
```typescript
// 检查 ref 是否正确
console.log(invoiceContainerRef.current);

// 在 pageStyle 中添加更多样式
pageStyle: `
  * {
    visibility: visible !important;
    display: block !important;
  }
`
```

### 问题：颜色不准确

**可能原因**：浏览器默认会优化打印颜色

**解决方法**：
```css
.invoice-container *,
.invoice-container *::before,
.invoice-container *::after {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
```

### 问题：表格分页不正常

**可能原因**：表格被截断

**解决方法**：
```css
table {
  page-break-inside: auto;
}

tr {
  page-break-inside: avoid;
  page-break-after: auto;
}

thead {
  display: table-header-group;
}
```

---

## 相关资源

- [react-to-print 文档](https://github.com/MatthewHerbst/react-to-print)
- [MDN: @page](https://developer.mozilla.org/en-US/docs/Web/CSS/@page)
- [MDN: print-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

## 修订历史

| 日期 | 版本 | 修改内容 |
|------|------|----------|
| 2026-04-15 | 1.0 | 初始版本，记录 Issue #29 解决方案 |
