# ADR-0005: 模板系统设计：主题色 + 字体配置

**Date**: 2026-04-10  
**Status**: accepted  
**Deciders**: lvshiwei

## Context

用户需要快速创建专业发票，同时保持一定程度的个性化：
- 提供预设模板，减少从零开始
- 支持主题色自定义
- 支持字体选择
- 模板可预览和应用

约束条件：
- 本地存储，无云端同步
- 模板数据与发票数据分离
- 支持后续扩展更多模板

## Decision

设计 **模板系统** 包含以下能力：

1. **模板数据结构**：
   ```typescript
   interface InvoiceTemplate {
     id: string;
     name: string;
     category: "modern" | "classic" | "minimal" | "colorful";
     themeColor: string;        // 主题色 HEX
     textFont: "sans" | "serif" | "mono";
     numberFont: "sans" | "serif" | "mono";
     template: Invoice;         // 预填充数据
   }
   ```

2. **模板 Gallery 页面**：
   - 卡片式展示
   - 缩略图预览
   - 分类筛选

3. **应用逻辑**：
   - 点击应用时确认（避免误操作覆盖）
   - 替换当前发票数据
   - 自动保存

## Alternatives Considered

### Alternative 1: 纯 CSS 主题切换
- **Pros**: 实现简单
- **Cons**: 无法预填充数据、灵活性低
- **Why not**: 用户期望的是完整模板，不只是颜色变化

### Alternative 2: 后端模板服务
- **Pros**: 集中管理、可更新
- **Cons**: 需要后端、离线不可用
- **Why not**: 偏离 MVP 本地优先策略

## Consequences

### Positive
- 用户快速上手，减少空白页面焦虑
- 提供专业起点，提升输出质量
- 为未来付费模板奠定基础

### Negative
- 需要维护模板数据
- 增加存储占用

### Risks
- **风险**: 用户误操作丢失当前编辑 - **缓解**: 应用前确认提示
