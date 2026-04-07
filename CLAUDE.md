# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**sagainvo** - Saga Invoice 是一个面向国际电商卖家的发票生成工具

## Core Features

- **Invoice Editor** - 三栏式布局：侧边导航 + 编辑器 + 预览
- **Local Storage** - 自动保存到浏览器 localStorage
- **PDF/CSV Export** - 导出 PDF 或 CSV 格式发票
- **No Auth Required** - MVP 版本无需登录注册

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: localStorage

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── editor/
│       └── page.tsx       # Invoice editor (main workspace)
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx    # Sidebar navigation
│   └── invoice/
│       ├── InvoiceForm.tsx    # Invoice form component
│       └── InvoicePreview.tsx # Live preview component
└── lib/
    ├── types.ts           # TypeScript types
    ├── utils.ts           # Utility functions
    ├── calculator.ts      # Amount calculation
    ├── storage.ts         # localStorage wrapper
    └── pdf-export.ts      # PDF/CSV export
```

## Key Files

- `src/app/editor/page.tsx` - Main invoice editor page
- `src/components/invoice/InvoiceForm.tsx` - From/To sections and line items
- `src/components/invoice/InvoicePreview.tsx` - Real-time preview
- `src/lib/types.ts` - Invoice, LineItem, Totals types

## Design Reference

See `docs/design.md` for complete design system based on Polanyi tacit knowledge theory.

## License

CC BY-NC-SA 4.0 - 禁止商业用途
