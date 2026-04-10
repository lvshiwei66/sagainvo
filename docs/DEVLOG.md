# Saga Invoice - 开发日志

> 记录开发过程中的进展、决策和问题

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
