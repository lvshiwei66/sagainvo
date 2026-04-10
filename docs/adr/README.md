# Architecture Decision Records

| ADR # | Title | Status | Date |
|-------|-------|--------|------|
| [0001](0001-documentation-system.md) | 建立项目文档体系 | ✅ Accepted | 2026-04-10 |
| [0002](0002-git-branch-model.md) | 采用 GitHub Flow 分支模型 | ✅ Accepted | 2026-04-10 |
| [0003](0003-internationalization-strategy.md) | 国际化策略：next-intl + localStorage | ✅ Accepted | 2026-04-10 |
| [0004](0004-pdf-export-approach.md) | PDF 导出方案：html2canvas + jsPDF | ✅ Accepted | 2026-04-10 |
| [0005](0005-template-system-design.md) | 模板系统设计：主题色 + 字体配置 | ✅ Accepted | 2026-04-10 |

---

## About ADRs

Architecture Decision Records 记录项目中重要的架构决策，帮助团队成员理解技术选型的原因和背景。

### ADR 结构

每个 ADR 文件包含：
- 标题
- 状态 (Proposed, Accepted, Deprecated, Superseded)
- 背景/问题
- 决策
- 替代方案
- 后果/影响

### 何时创建 ADR

- 选择技术栈/框架时
- 选择架构模式时
- 做出重大设计决策时
- 替换现有技术时

### 如何创建

1. 复制 `template.md` 为 `NNNN-title.md`
2. 填写 ADR 内容
3. 更新本索引文件
4. 在 DEVLOG.md 中记录

---

**模板**: [template.md](template.md)
