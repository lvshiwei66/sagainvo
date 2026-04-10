# Saga Invoice - 开发日志

> 记录开发过程中的进展、决策和问题

---

## 2026-04-10

### 项目初始化

**参与者**: lvshiwei

#### 决策记录

1. **创建架构决策记录 (ADR) 系统**
   - 目的：记录项目中的架构决策，避免决策散落在聊天记录中
   - 目录：`docs/adr/`
   - 格式：遵循 Michael Nygard 的轻量 ADR 格式

2. **建立项目文档体系**
   - 创建 `PRD.md` - 产品需求文档
   - 创建 `DEVLOG.md` - 开发日志
   - 创建 `PROJECT_STATUS.md` - 项目状态

#### 技术决策

| 决策 | 选择 | 备选方案 | 理由 |
|------|------|----------|------|
| 前端框架 | Next.js 14 | React SPA, Vue | App Router、SSG 支持 |
| 样式方案 | Tailwind CSS | CSS Modules, Styled Components | 快速开发、一致的设计系统 |
| 数据存储 | localStorage | IndexedDB, 后端 API | MVP 简单、无需登录 |
| 语言 | TypeScript | JavaScript | 类型安全、更好的开发体验 |

#### 当前状态

- [x] 项目文档体系创建
- [x] Git 分支管理规范创建
- [x] GitHub 模板创建 (PR, Issues)
- [ ] 发票编辑器核心功能
- [ ] PDF 导出功能

#### 问题与风险

暂无

---

## 2026-04-10 (下午)

### 分支管理规范

**参与者**: lvshiwei

#### 完成内容

- [x] 创建 `BRANCH_GUIDELINES.md` - Git 分支管理规范
- [x] 创建 `.github/PULL_REQUEST_TEMPLATE.md` - PR 模板
- [x] 创建 `.github/ISSUE_TEMPLATE/bug_report.md` - Bug 报告模板
- [x] 创建 `.github/ISSUE_TEMPLATE/feature_request.md` - 功能请求模板
- [x] 更新 `docs/README.md` - 添加分支管理文档链接

#### 决策记录

- **采用 GitHub Flow 模型**
  - 描述：轻量级分支模型，适合快速迭代的 MVP 项目
  - 主分支：`main`（受保护）
  - 功能分支：`feature/*`, `fix/*`, `docs/*`
  
- **采用 Conventional Commits**
  - 类型：feat, fix, docs, style, refactor, test, chore
  - 格式：`<type>: <description>`

- **PR 合并策略**
  - 优先使用 Squash and Merge
  - 保持提交历史清晰

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
