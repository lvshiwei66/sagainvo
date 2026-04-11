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

---

## Documentation Hub

### 文档地图

```
docs/
├── README.md              ← 文档索引（本文档）
├── PRD.md                 ← 产品需求文档
├── design.md              ← UI/UX 设计系统
├── DEVLOG.md              ← 开发日志
├── PROJECT_STATUS.md      ← 项目状态
├── BRANCH_GUIDELINES.md   ← Git 分支管理规范
└── adr/                   ← 架构决策记录
    ├── README.md          ← ADR 索引
    └── NNNN-title.md      ← 具体决策
```

### 各文档用途

| 文档 | 用途 | 何时查阅 | 何时更新 |
|------|------|----------|----------|
| **[PRD.md](PRD.md)** | 产品需求、功能规格、验收标准 | 开发新功能前 | 需求变更时 |
| **[design.md](design.md)** | UI/UX 设计系统、Polanyi 原则 | 编写前端组件时 | 设计变更时 |
| **[DEVLOG.md](DEVLOG.md)** | 开发进展、决策、问题记录 | 了解开发历史 | 每次开发后 |
| **[PROJECT_STATUS.md](PROJECT_STATUS.md)** | 迭代进度、待办事项、风险 | 了解项目状态 | 每周/每迭代 |
| **[BRANCH_GUIDELINES.md](BRANCH_GUIDELINES.md)** | Git 分支管理、PR 规范、提交规范 | 创建分支/提交/PR 时 | 流程变更时 |
| **[adr/](docs/adr/)** | 架构决策记录 | 重大技术决策后 | 创建新 ADR 时 |

---

## Git 工作流规范

### 核心规则

**必须在操作前查阅**: [BRANCH_GUIDELINES.md](docs/BRANCH_GUIDELINES.md)

| 操作 | 规范 |
|------|------|
| 分支命名 | `feature/xxx`, `fix/xxx`, `docs/xxx` |
| 提交格式 | `feat: description`, `fix: description` |
| PR 合并 | Squash and Merge (优先) |
| 分支清理 | 合并后删除 |

### 提交规范 (Conventional Commits)

**类型**:
- `feat` - 新功能
- `fix` - Bug 修复
- `docs` - 文档更新
- `style` - 代码格式
- `refactor` - 重构
- `test` - 测试
- `chore` - 构建/配置

**示例**:
```bash
✅ feat: add invoice PDF export
✅ fix: correct tax calculation
✅ docs: add PRD documentation
❌ update code
❌ fixed stuff
```

### 分支工作流程

```bash
# 1. 创建分支
git checkout main && git pull origin main
git checkout -b feature/invoice-editor

# 2. 提交
git commit -m "feat: implement invoice editor UI"

# 3. 推送
git push -u origin feature/invoice-editor

# 4. 创建 PR (使用模板)

# 5. 合并后删除分支
```

### AI 助手责任

**每次操作 Git 时**:
1. [ ] 遵循分支命名规范
2. [ ] 使用 Conventional Commits 格式
3. [ ] 提醒用户使用 PR 模板
4. [ ] 合并后提醒删除分支
5. [ ] 在 DEVLOG.md 记录重大变更

---

## 文档维护规范

### 1. DEVLOG.md - 开发日志

**更新时机**:
- 完成一个功能开发后
- 遇到并解决一个问题后
- 做出一个技术决策后
- 每日开发结束时

**如何更新**:
```bash
# 使用技能
/ecc:architecture-decision-records  # 如有架构决策
# 或手动编辑 DEVLOG.md，追加到文件开头
```

**记录内容**:
- 日期和参与者
- 完成的功能
- 遇到的问题及解决方案
- 明日计划

### 2. PROJECT_STATUS.md - 项目状态

**更新时机**:
- 每个迭代开始/结束时
- 功能状态变更时
- 发现新风险时
- 每周至少一次

**如何更新**:
- 更新功能完成度进度条
- 更新待办事项列表
- 更新风险登记表
- 更新里程碑状态

### 3. PRD.md - 产品需求

**更新时机**:
- 新增功能需求时
- 修改现有功能时
- 调整优先级时
- V2 规划变更时

**如何更新**:
- 在功能需求表格中添加/修改行
- 更新修订历史表
- 如有重大变更，更新版本号

### 4. design.md - 设计文档

**更新时机**:
- 新增组件样式时
- 修改设计系统时
- 添加新的交互模式时

**如何更新**:
- 在对应章节添加内容
- 保持与代码实现一致

### 5. adr/ - 架构决策记录

**更新时机**:
- 选择技术栈/框架时
- 选择架构模式时
- 做出重大设计决策时
- 替换现有技术时

**如何创建**:
```bash
# 使用技能
/ecc:architecture-decision-records
# 或手动创建 docs/adr/NNNN-decision-title.md
```

**编号规则**:
- 从 0001 开始递增
- 文件名格式：`NNNN-decision-title.md`
- 创建后更新 `docs/adr/README.md` 索引

---

## 文档链接关系

```
CLAUDE.md (本文件)
    └── 指向所有文档的入口
    
PRD.md
    ├── 依赖 → design.md (设计参考)
    └── 依赖 → adr/ (技术决策)

design.md
    └── 参考 → PRD.md (功能需求)

DEVLOG.md
    ├── 记录 → adr/ (决策日期)
    └── 关联 → PROJECT_STATUS.md (进展同步)

PROJECT_STATUS.md
    ├── 链接 → PRD.md (功能列表)
    ├── 链接 → DEVLOG.md (历史进展)
    └── 链接 → adr/ (决策状态)

adr/README.md
    └── 索引 → 所有 ADR 文件
```

---

## 开发前检查清单

### 开发新功能前

1. [ ] 查阅 [PRD.md](docs/PRD.md) 了解需求规格
2. [ ] 查阅 [design.md](docs/design.md) 了解设计规范
3. [ ] 查阅 [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) 了解当前优先级
4. [ ] 查阅 [DEVLOG.md](docs/DEVLOG.md) 了解相关历史决策
5. [ ] 检查 [adr/](docs/adr/) 是否有相关架构决策

### 开发完成后

1. [ ] 更新 [DEVLOG.md](docs/DEVLOG.md) 记录进展
2. [ ] 更新 [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) 标记功能完成
3. [ ] 如有架构决策，创建 [ADR](docs/adr/)
4. [ ] 如有设计变更，更新 [design.md](docs/design.md)
5. [ ] 提交信息遵循 [Conventional Commits](#git-工作流规范)

### 修复错误前

1. [ ] 确认错误与 issue 描述一致
2. [ ] 从 main 创建新分支，命名要求 `fix/xxx` 或 `bug-fix/xxx`
3. [ ] 必须使用 worktree 模式绑定新分支，确保并行开发不会冲突

### 修复错误后

- 生成的 Pull Request 必须与 Issue 关联, 记录链接和编号

### Git 操作前

1. [ ] 查阅 [BRANCH_GUIDELINES.md](docs/BRANCH_GUIDELINES.md)
2. [ ] 使用正确的分支命名 (`feature/`, `fix/`, `docs/`)
3. [ ] 准备符合规范的提交信息

### 测试时

- 只能 Kill自己启动的服务线程, 避免把其他并行的测试服务进程杀死


---

## License

CC BY-NC-SA 4.0 - 禁止商业用途
