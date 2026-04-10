# ADR-0001: 建立项目文档体系

**Date**: 2026-04-10  
**Status**: accepted  
**Deciders**: lvshiwei

## Context

项目启动初期，需要建立清晰的文档体系来：
- 记录产品需求和功能规格
- 记录开发进展和决策历史
- 为 AI 助手和人类开发者提供项目指南
- 确保团队协作时有统一的参考标准

约束条件：
- MVP 阶段资源有限，文档应精简实用
- 需要支持 AI 助手高效工作
- 文档应易于维护和更新

## Decision

建立以下文档体系：

1. **PRD.md** - 产品需求文档，定义功能规格和验收标准
2. **design.md** - UI/UX 设计系统，基于 Polanyi 隐性知识理论
3. **DEVLOG.md** - 开发日志，记录每日进展和决策
4. **PROJECT_STATUS.md** - 项目状态，追踪进度和风险
5. **BRANCH_GUIDELINES.md** - Git 分支管理规范
6. **docs/adr/** - 架构决策记录目录
7. **CLAUDE.md** - 项目指南，为 Claude Code 提供上下文

## Alternatives Considered

### Alternative 1: 使用 Notion/Confluence 等 Wiki 系统
- **Pros**: 协作友好、版本历史、搜索强大
- **Cons**: 需要额外工具、离线访问受限、Git 版本控制分离
- **Why not**: 增加工具复杂度，偏离开发者熟悉的 Markdown + Git 工作流

### Alternative 2: 最小文档（仅 README）
- **Pros**: 维护成本最低
- **Cons**: 信息过于集中、难以导航、缺少结构化记录
- **Why not**: 不适合 MVP 以上的长期维护

## Consequences

### Positive
- 文档与代码同库，版本同步
- AI 助手可直接读取和更新
- 新成员快速上手
- 决策历史可追溯

### Negative
- 需要持续维护文档更新
- 多个文件需要导航结构

### Risks
- **风险**: 文档过时 - **缓解**: 在 CLAUDE.md 中定义更新时机和责任
