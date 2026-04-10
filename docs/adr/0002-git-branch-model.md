# ADR-0002: 采用 GitHub Flow 分支模型

**Date**: 2026-04-10  
**Status**: accepted  
**Deciders**: lvshiwei

## Context

项目需要轻量级的分支管理模型来支持：
- 快速迭代的 MVP 开发
- 清晰的功能开发流程
- 简单的代码审查机制
- 自动化 CI/CD 集成

约束条件：
- 团队规模小（1-2 人）
- 发布频率高（按需发布）
- 需要受保护的主分支

## Decision

采用 **GitHub Flow** 分支模型：

1. **main 分支** - 受保护，始终是可部署状态
2. **功能分支** - `feature/*`, `fix/*`, `docs/*` 从 main 创建
3. **Pull Request** - 所有变更通过 PR 合并
4. **Squash and Merge** - 优先使用，保持历史清晰
5. **删除已合并分支** - 自动清理

提交信息采用 **Conventional Commits** 格式：
```
<type>: <description>
```

类型：feat, fix, docs, style, refactor, test, chore

## Alternatives Considered

### Alternative 1: Git Flow
- **Pros**: 严格的发布流程、支持并行版本
- **Cons**: 复杂、分支类型多、不适合持续部署
- **Why not**: 过度工程化，不适合 MVP 快速迭代

### Alternative 2: Trunk Based Development
- **Pros**: 极简、适合持续集成
- **Cons**: 需要高度自动化测试、小步提交文化
- **Why not**: 项目初期测试基础设施不完善

## Consequences

### Positive
- 分支模型简单易懂
- PR 流程天然支持代码审查
- 与 GitHub 原生功能完美集成
- 适合小团队快速迭代

### Negative
- 需要手动创建 PR
- 不适合多版本并行维护

### Risks
- **风险**: main 分支被意外破坏 - **缓解**: 启用分支保护规则
