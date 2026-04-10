# Saga Invoice - Git 分支管理规范

**版本**: 1.0  
**日期**: 2026-04-10  
**状态**: 生效中

---

## 1. 分支模型

采用 **GitHub Flow** 轻量模型，适合快速迭代的 MVP 项目。

```
main (受保护分支)
  │
  ├──→ feature/*  (功能分支)
  ├──→ fix/*      (修复分支)
  └──→ docs/*     (文档分支)
```

### 分支类型

| 分支类型 | 命名格式 | 来源 | 存活周期 | 用途 |
|----------|----------|------|----------|------|
| **主分支** | `main` | - | 永久 | 可部署的生产代码 |
| **功能分支** | `feature/xxx` | main | 短期 (1-7 天) | 新功能开发 |
| **修复分支** | `fix/xxx` | main | 短期 (1-3 天) | Bug 修复 |
| **文档分支** | `docs/xxx` | main | 短期 (1-2 天) | 文档更新 |
| **实验分支** | `experiment/xxx` | main | 临时 | 技术验证/原型 |

---

## 2. 分支命名规范

### 格式

```
<type>/<description>
```

### 命名规则

- 使用小写字母和连字符 (`-`)
- 描述使用简短的祈使句（如 `add-login`, `fix-crash`）
- 避免使用下划线或空格
- 长度不超过 50 个字符

### 示例

| 类型 | 正确示例 | 错误示例 |
|------|----------|----------|
| feature | `feature/invoice-editor`, `feature/pdf-export` | `feature/InvoiceEditor`, `feature/add_new_feature` |
| fix | `fix/calculation-bug`, `fix/typo` | `FIX_BUG`, `fix/bugFix` |
| docs | `docs/add-prd`, `docs/update-readme` | `docs/Documentation`, `docs/update` |

---

## 3. 工作流程

### 3.1 功能开发流程

```bash
# 1. 从 main 创建分支
git checkout main
git pull origin main
git checkout -b feature/invoice-editor

# 2. 开发并提交 (遵循提交规范)
git add .
git commit -m "feat: implement invoice editor UI"

# 3. 推送分支
git push -u origin feature/invoice-editor

# 4. 创建 Pull Request (见 PR 规范)

# 5. 合并后删除分支
```

### 3.2 提交规范

采用 **Conventional Commits** 格式：

```
<type>: <description>

[optional body]

[optional footer]
```

#### 类型说明

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add CSV export` |
| `fix` | Bug 修复 | `fix: correct tax calculation` |
| `docs` | 文档更新 | `docs: add branch guidelines` |
| `style` | 代码格式 (不影响功能) | `style: format with prettier` |
| `refactor` | 重构 (非新功能/修复) | `refactor: extract calculator module` |
| `test` | 测试相关 | `test: add invoice validation tests` |
| `chore` | 构建/工具配置 | `chore: update dependencies` |

#### 提交示例

```bash
# ✅ 好的提交
feat: add invoice PDF export
fix: correct total calculation for tax
docs: add PRD and project status
refactor: extract storage module

# ❌ 坏的提交
update code
fixed stuff
wip
```

---

## 4. Pull Request 规范

### 4.1 PR 命名

```
<type>: <description>
```

示例：
- `feat: add invoice editor`
- `fix: correct tax calculation`
- `docs: add project documentation`

### 4.2 PR 模板

创建 `.github/PULL_REQUEST_TEMPLATE.md`：

```markdown
## Summary
<!-- 简要描述此 PR 的变更 -->

## Changes
- [ ] Change 1
- [ ] Change 2

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project guidelines
- [ ] Self-review completed
- [ ] No console.log or debugging statements
- [ ] Documentation updated (if applicable)
```

### 4.3 PR 流程

1. **创建 PR**
   - 从功能分支创建到 `main`
   - 填写 PR 描述
   - 关联相关 Issue（如有）

2. **CI 检查**
   - 确保所有 CI 检查通过
   - 解决冲突

3. **Code Review**
   - 至少 1 人审查
   - 解决所有评论

4. **合并**
   - 使用 **Squash and Merge**（推荐）
   - 或 **Rebase and Merge**（保持提交历史清晰）
   - 不要使用 **Merge Commit**（避免历史混乱）

5. **清理**
   - 删除已合并的分支

---

## 5. 分支清理

### 定期清理（每周）

```bash
# 查看已合并的本地分支
git branch --merged main

# 删除本地已合并分支（除 main 外）
git branch --merged main | grep -v "main" | xargs git branch -d

# 同步远程分支
git fetch --prune
```

### 自动清理

GitHub 设置：
- 启用 "Automatically delete head branches"
- 启用 "Require pull request reviews before merging"

---

## 6. 发布流程

### 版本标签

```bash
# 创建标签
git tag -a v1.0.0 -m "MVP Release v1.0.0"
git push origin v1.0.0
```

### 标签命名

遵循 **Semantic Versioning** (SemVer)：

```
v<major>.<minor>.<patch>
```

- `major`: 破坏性变更
- `minor`: 向后兼容的功能
- `patch`: 向后兼容的修复

---

## 7. 紧急修复流程

### Hotfix 分支

```bash
# 从 main 创建 hotfix 分支
git checkout main
git checkout -b hotfix/critical-bug

# 快速修复并测试
# ...

# 创建 PR（标记为紧急）
# Review 后立即合并

# 打标签
git tag -a v1.0.1 -m "Hotfix: critical bug fix"
```

---

## 8. 分支保护规则

### main 分支设置

在 GitHub 仓库设置中启用：

- [x] **Require a pull request before merging**
  - Require approvals: 1
- [x] **Dismiss stale pull request approvals when new commits are pushed**
- [x] **Require status checks to pass before merging**
  - Lint
  - Build
  - Tests
- [x] **Require branches to be up to date before merging**
- [x] **Automatically delete head branches**

### 保护理由

- 防止意外推送
- 确保代码审查
- 确保 CI 通过

---

## 9. 常见场景处理

### 场景 1: 功能开发中途需要同步 main

```bash
# 在功能分支上
git checkout feature/invoice-editor
git fetch origin main
git rebase origin/main

# 解决冲突（如有）
git add .
git rebase --continue

# 强制推送（小心使用）
git push --force-with-lease
```

### 场景 2: PR 需要多次小提交

使用 `git commit --fixup` 和交互式变基：

```bash
git commit --fixup=abc123
git rebase -i --autosquash main
git push --force-with-lease
```

### 场景 3: 撤销已提交但未推送的提交

```bash
git reset --soft HEAD~1  # 保留更改，撤销提交
git reset --hard HEAD~1  # 丢弃更改，撤销提交
```

### 场景 4: 分支命名错误

```bash
# 重命名本地分支
git branch -m feature/old-name feature/new-name

# 删除远程旧分支
git push origin --delete feature/old-name

# 推送新分支
git push -u origin feature/new-name
```

---

## 10. 工具配置

### Git 别名（推荐）

添加到 `~/.gitconfig`：

```ini
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    last = log -1 HEAD
    unstage = reset HEAD --
```

### 推荐的 Git 客户端

- **CLI**: 最灵活，适合高级用户
- **GitHub Desktop**: 简单易用，适合新手
- **Fork**: 强大的可视化 Git 客户端
- **VS Code GitLens**: 集成在编辑器中

---

## 11. 检查清单

### 创建分支前

- [ ] 从 `main` 分支检出
- [ ] 使用正确的命名格式
- [ ] 确认分支类型（feature/fix/docs）

### 提交前

- [ ] 提交信息符合规范
- [ ] 代码通过 lint 检查
- [ ] 本地测试通过

### 创建 PR 前

- [ ] 分支已推送到远程
- [ ] PR 描述完整
- [ ] 关联相关 Issue

### 合并前

- [ ] CI 检查全部通过
- [ ] Code Review 完成
- [ ] 冲突已解决
- [ ] 删除分支选项已勾选

---

## 附录

### A. 参考资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Semantic Versioning](https://semver.org/)

### B. 修订历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| 1.0 | 2026-04-10 | 初始版本 |
