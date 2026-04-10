# ADR-0004: PDF 导出方案：html2canvas + jsPDF

**Date**: 2026-04-10  
**Status**: accepted  
**Deciders**: lvshiwei

## Context

需要支持发票导出为 PDF 格式：
- 保持与预览一致的视觉效果
- 客户端生成，无需后端
- 支持 A4 纸张尺寸
- 金额和文字清晰可读

约束条件：
- Next.js 客户端渲染
- Tailwind CSS 样式
- 国际化内容（英文/中文）

## Decision

采用 **html2canvas + jsPDF** 组合方案：

1. **html2canvas** - 将 DOM 渲染为 Canvas
   - 支持 Tailwind CSS 样式
   - 保持视觉一致性

2. **jsPDF** - 将 Canvas 转换为 PDF
   - 客户端生成
   - 支持 A4 尺寸
   - 可配置图片质量

3. **实现流程**：
   ```
   预览 DOM → html2canvas → Canvas → jsPDF → PDF Blob → 下载
   ```

## Alternatives Considered

### Alternative 1: @react-pdf/renderer
- **Pros**: React 组件式 API、原生 PDF 渲染
- **Cons**: 需要重新实现 PDF 布局、与现有预览不一致
- **Why not**: 需要维护两套渲染逻辑（预览 +PDF）

### Alternative 2: 后端 PDF 服务
- **Pros**: 更专业的 PDF 生成、支持复杂布局
- **Cons**: 需要后端基础设施、增加延迟、成本
- **Why not**: MVP 阶段过于复杂，偏离轻量定位

### Alternative 3: 浏览器打印 → 另存为 PDF
- **Pros**: 零依赖、原生支持
- **Cons**: 用户体验差、样式可能不一致
- **Why not**: 不够专业，用户期望一键导出

## Consequences

### Positive
- 预览与导出效果一致
- 纯客户端实现，无需后端
- 实现简单，依赖成熟库

### Negative
- 生成的 PDF 是图片，文字不可选择
- 文件大小相对较大
- 高分辨率下生成较慢

### Risks
- **风险**: html2canvas 对某些 CSS 支持不完整 - **缓解**: 使用标准 CSS 属性，避免实验性特性
