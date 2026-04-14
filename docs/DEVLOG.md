# Saga Invoice - 开发日志

> 记录开发过程中的进展、决策和问题

---

## 2026-04-14

### PDF 导出 dompdf 迁移 - 布局优化和 Bug 修复

**参与者**: lvshiwei

#### 完成内容

- [x] 修复 PDF 导出后右侧空白问题（水平居中渲染）
- [x] 调整 PDF 边距至 48px（原始 16px 的 3 倍）
- [x] 修复导出后预览组件样式恢复失效问题（添加强制 reflow）
- [x] 修复导出后 Logo 元素丢失问题（使用 DOM 克隆而非直接操作）

#### 问题与解决方案

**问题 1: PDF 右侧出现较大空白**
- **原因**: dompdf 渲染时可能对内容应用缩放，且 `margin: '0 auto'` 被解释为保留两侧边距
- **解决方案**: 
  - 设置 `margin: '0'` 移除自动边距
  - 添加 `transform: 'none'` 移除可能的缩放变换
  - 内容整体水平居中渲染

**问题 2: 预览组件恢复样式失效**
- **原因**: 恢复样式后浏览器未立即重新计算布局
- **解决方案**: 
  - 保存和恢复 `transform` 和 `webkitTransform` 属性
  - 恢复后调用 `void element.offsetHeight` 强制 reflow

**问题 3: 导出后 Logo 元素丢失**
- **原因**: dompdf.js 在渲染时会操作传入的 DOM 元素，导致原始元素被移动或清空
- **解决方案**: 
  - 使用 `cloneNode(true)` 创建预览组件的深拷贝
  - 将克隆元素放到离屏位置供 dompdf 使用
  - 生成完成后删除克隆元素
  - 原始预览组件完全不受影响

#### 代码变更

**文件**: `src/lib/dompdf-export.ts`

主要修改：
1. 导出时使用 DOM 克隆而非直接操作原始元素
2. PDF 边距从 16px 增大到 48px
3. 添加 transform 相关属性的保存和恢复
4. 强制 reflow 确保样式立即生效
5. 修复 dompdf.js pageConfig 类型定义

#### 提交记录

- `2d388c3` - fix: increase PDF export padding to 48px and improve style restoration
- （后续提交）- fix: use DOM clone to prevent logo loss during PDF export

---

## 2026-04-10

### 项目全面调查与文档同步

**参与者**: lvshiwei

#### 完成内容

- [x] 全面调查项目现状（代码、测试、文档）
- [x] 更新 MEMORY.md 知识库
- [x] 创建项目文档体系记忆
- [x] 创建功能完成状态记忆
- [x] 创建 5 个架构决策记录 (ADR)

#### 项目现状总结

**代码统计**:
- TypeScript 文件：36 个 (src 目录)
- E2E 测试文件：10+ 个 (Playwright)
- 单元测试文件：4 个 (Jest + React Testing Library)

**功能完成状态**:
| 功能 | 状态 |
|------|------|
| 发票编辑器 | ✅ 完成 |
| 本地存储 | ✅ 完成 |
| PDF 导出 | ✅ 完成 |
| CSV 导出 | ✅ 完成 |
| i18n (en/zh-CN) | ✅ 完成 |
| 发票模板系统 | ✅ 完成 |
| 设置模块 | ✅ 完成 |
| 图片上传 | ✅ 完成 |

**技术栈**:
- Next.js 14.2 + TypeScript + Tailwind CSS
- next-intl (国际化)
- html2canvas + jsPDF (PDF 导出)
- Playwright (E2E 测试)
- Jest + React Testing Library (单元测试)

#### 待跟进事项

- [ ] 更新 PROJECT_STATUS.md 刷新功能完成度
- [ ] 创建架构决策记录 (ADR)
- [ ] 客户管理/商品库完整 CRUD 界面
- [ ] 发票历史列表页面

---

### 删除客户管理和商品库模块

**参与者**: lvshiwei

#### 决策背景

重新评估 MVP 范围后，决定删除客户管理和商品/服务库模块：
- 这两个功能偏离核心场景（快速开具发票）
- 用户可通过模板复用实现类似功能
- 减少复杂度和维护成本

#### 完成内容

- [x] 删除 Sidebar 中的客户和项目导航项
- [x] 从翻译文件中移除 clients 和 items 键
- [x] 更新 PRD.md 标记为已移除
- [x] 更新 PROJECT_STATUS.md 标记为已移除
- [x] 在 PRD.md 的"不做的事情"中添加这两个功能

#### 影响范围

| 文件 | 变更 |
|------|------|
| `src/components/layout/Sidebar.tsx` | 移除 Users/Package 图标和导航项 |
| `src/locales/en/common.json` | 移除 nav.clients, nav.items |
| `src/locales/zh-CN/common.json` | 移除 nav.clients, nav.items |
| `docs/PRD.md` | 功能状态标记为已移除 |
| `docs/PROJECT_STATUS.md` | 功能状态标记为已移除 |

#### 后续计划

- 聚焦核心功能：发票创建、PDF/CSV 导出
- 打印支持待开发
- 历史发票功能延后

---

## 模板

### YYYY-MM-DD

#### 进展

**参与者**: [姓名]

- [ ] 完成内容 1
- [ ] 完成内容 2

#### 决策记录

- [决策标题]
  - 描述：...

#### 遇到的问题

| 问题 | 解决方案 | 状态 |
|------|----------|------|
| 问题描述 | 如何解决 | 已解决/进行中 |

#### 明日计划

- [ ] 计划内容

---
