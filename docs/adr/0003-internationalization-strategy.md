# ADR-0003: 国际化策略：next-intl + localStorage

**Date**: 2026-04-10  
**Status**: accepted  
**Deciders**: lvshiwei

## Context

产品面向国际电商卖家，需要支持多语言：
- 默认语言：English
- 第二语言：简体中文
- 用户偏好需要持久化
- 翻译内容应与代码分离

约束条件：
- Next.js 14 App Router
- 客户端渲染为主
- 无需后端服务

## Decision

采用 **next-intl** 库实现国际化：

1. **翻译文件结构**：
   ```
   locales/
   ├── en/common.json
   └── zh-CN/common.json
   ```

2. **语言检测优先级**：
   - 用户选择的语言（localStorage 持久化）
   - 浏览器语言设置
   - 默认 English

3. **实现方式**：
   - 使用 `useTranslations` hook 获取翻译
   - 所有用户可见文案必须使用 `t()` 函数
   - 语言切换器组件全局可用

## Alternatives Considered

### Alternative 1: react-i18next
- **Pros**: 功能丰富、生态系统大
- **Cons**: 配置复杂、与 Next.js App Router 集成不如 next-intl 原生
- **Why not**: next-intl 更轻量和 Next.js 友好

### Alternative 2: 手动实现 i18n
- **Pros**: 完全控制、无依赖
- **Cons**: 重复造轮子、缺少类型支持
- **Why not**: 已有成熟解决方案，无需自建

## Consequences

### Positive
- 类型安全的翻译键
- 支持服务端渲染（如需要）
- 翻译文件与代码分离
- 用户偏好持久化

### Negative
- 增加一个依赖项
- 需要维护翻译文件

### Risks
- **风险**: 翻译内容过时 - **缓解**: 在添加新功能时同步更新翻译
