# Lessons Learned - Saga Invoice 项目经验总结

> 记录本项目遇到的关键问题、解决方案和可复用的经验，为将来其他项目提供参考

---

## 目录

1. [PDF 导出方案选型](#1-pdf 导出方案选型)
2. [国际化策略](#2-国际化策略)
3. [模板系统设计](#3-模板系统设计)
4. [文档体系建设](#4-文档体系建设)
5. [Git 工作流](#5-git 工作流)
6. [DOM 操作陷阱](#6-dom 操作陷阱)
7. [测试驱动开发](#7-测试驱动开发)

---

## 1. PDF 导出方案选型

### 问题背景

发票需要导出 PDF 格式，且支持多语言（英文/中文）。

### 方案演进

| 方案 | 问题 | 状态 |
|------|------|------|
| jsPDF + html2canvas | 中文字体文件过大 (20MB+)，需额外加载字体 | ❌ 已弃用 |
| dompdf.js | 纯 CSS 渲染，边框样式支持不完整 | ⚠️ 当前方案 |

### 关键教训

#### 教训 1: 评估方案时要考虑多语言支持

**问题**: jsPDF 方案在测试阶段未验证中文字符渲染，导致后期需要迁移。

**解决**: 迁移到 dompdf.js，使用浏览器原生渲染能力。

**经验**: 
- 在 MVP 技术选型时，必须用真实数据验证核心场景
- 多语言支持不是"附加功能"，而是核心需求的一部分
- 字体文件大小直接影响加载性能，需提前评估

#### 教训 2: 预览与导出的一致性难以保证

**问题**: dompdf.js 导出的 PDF 与预览页面存在视觉差异：
- 表格边框线丢失
- Notes/Terms 分隔线丢失
- 数字字体不一致

**原因分析**:
1. dompdf.js 对 Tailwind CSS 的 `border-b` 等 utility class 支持不完整
2. 预览组件使用 React + Tailwind，PDF 生成使用内联样式
3. 两套渲染逻辑，无法保证完全一致

**解决**:
```typescript
// ❌ 错误：依赖 CSS class
row.style.borderBottom = '1px solid #e2e8f0'  // dompdf 可能忽略

// ✅ 正确：使用内联样式明确指定
row.setAttribute('style', 'border-bottom: 1px solid #e2e8f0')
```

**经验**: 
- 预览和导出应使用同一套渲染逻辑
- 如果必须分离，建立视觉回归测试确保一致性
- CSS utility class 在跨环境渲染时可能失效

#### 教训 3: 边距和居中问题需要显式处理

**问题**: 导出的 PDF 右侧出现较大空白。

**原因**: 
- `margin: '0 auto'` 被 dompdf 解释为保留两侧边距
- 内容可能被应用了缩放变换

**解决**:
```typescript
// 移除自动边距，显式设置
clonedElement.style.margin = '0'
clonedElement.style.transform = 'none'
clonedElement.style.webkitTransform = 'none'
// 增大内边距补偿
clonedElement.style.padding = '48px'  // 原 16px 的 3 倍
```

**经验**: 打印/导出场景的布局需要独立验证，不要假设与屏幕渲染一致。

---

## 2. 国际化策略

### 方案选择

采用 **next-intl** + **localStorage** 方案：

```
locales/
├── en/common.json
└── zh-CN/common.json
```

### 关键教训

#### 教训 1: 语言设置需要持久化且跨路由保持

**问题**: 用户切换语言后，路由变化时语言设置丢失。

**原因**: 语言偏好仅保存在组件 state，未持久化或未在路由变化时恢复。

**解决**:
```typescript
// 使用 localStorage 持久化
localStorage.setItem('preferred-language', locale)

// 路由变化时从 localStorage 恢复
const savedLocale = localStorage.getItem('preferred-language')
```

**经验**: 用户偏好设置必须持久化，且在应用生命周期内保持一致。

#### 教训 2: 翻译文件需要与功能同步更新

**问题**: 新增功能后忘记更新翻译文件，导致硬编码字符串。

**解决**: 在代码审查检查清单中添加："所有用户可见文案必须使用 `t()` 函数"。

**经验**: 
- 将翻译检查纳入 CI/CD 流程
- 使用 ESLint 规则禁止非翻译函数的硬编码文案

---

## 3. 模板系统设计

### 核心设计

```typescript
interface InvoiceTemplate {
  id: string;
  name: string;
  category: "modern" | "classic" | "minimal" | "colorful";
  themeColor: string;
  textFont: "sans" | "serif" | "mono";
  numberFont: "sans" | "serif" | "mono";
  template: Invoice;
}
```

### 关键教训

#### 教训 1: 模板应用前需要确认

**问题**: 用户可能误操作覆盖当前编辑的发票数据。

**解决**: 点击"应用模板"时弹出确认对话框。

**经验**: 任何会覆盖用户数据操作都需要二次确认。

#### 教训 2: 模板预览缩略图需要固定高度

**问题**: 模板缩略图高度失控，导致 Gallery 页面布局错乱。

**解决**: 
```css
.template-thumbnail {
  height: 200px;  /* 固定高度 */
  overflow: hidden;
}
```

**经验**: Gallery/列表类组件的尺寸必须显式约束。

---

## 4. 文档体系建设

### 文档结构

```
docs/
├── README.md              # 文档索引
├── PRD.md                 # 产品需求文档
├── design.md              # UI/UX 设计系统
├── DEVLOG.md              # 开发日志
├── PROJECT_STATUS.md      # 项目状态
├── BRANCH_GUIDELINES.md   # Git 分支规范
└── adr/                   # 架构决策记录
```

### 关键教训

#### 教训 1: 文档与代码同步更新

**问题**: 文档容易过时，失去参考价值。

**解决**: 
- 在 CLAUDE.md 中定义文档更新时机
- 每次开发后更新 DEVLOG.md
- 功能状态变更时更新 PROJECT_STATUS.md

**经验**: 文档维护成本与文档数量成正比，保持精简实用。

#### 教训 2: ADR 记录重大决策

**价值**: 架构决策记录 (ADR) 帮助理解"为什么这样设计"，避免重复讨论。

**经验**: 
- 每个 ADR 记录一个决策
- 包含备选方案和取舍分析
- 编号从 0001 开始递增

---

## 5. Git 工作流

### 分支模型

采用 **GitHub Flow**:
- `main` 分支受保护
- 功能分支：`feature/*`, `fix/*`, `docs/*`
- PR 合并：Squash and Merge
- 合并后删除分支

### 关键教训

#### 教训 1: 提交信息需要规范化

**格式**:
```
<type>: <description>

[optional body]
```

**类型**: feat, fix, docs, style, refactor, test, chore, perf

**经验**: 提交信息规范化有助于：
- 自动生成变更日志
- 快速定位特定类型的提交
- 理解提交意图

#### 教训 2: PR 需要关联 Issue

**问题**: PR 合并后无法追溯到对应的 Issue。

**解决**: PR 描述中包含 `Fixes #123` 或 `Closes #123`。

**经验**: Issue 和 PR 的关联有助于追踪需求实现历史。

---

## 6. DOM 操作陷阱

### 问题：PDF 导出后 Logo 元素丢失

**原因**: dompdf.js 在渲染时会操作传入的 DOM 元素，导致原始元素被移动或清空。

**解决**: 使用深拷贝克隆元素，在离屏位置渲染：

```typescript
// 克隆原始元素
const clonedElement = invoiceElement.cloneNode(true) as HTMLElement;

// 将克隆元素放到离屏位置
clonedElement.style.position = 'absolute';
clonedElement.style.left = '-9999px';
document.body.appendChild(clonedElement);

// 使用克隆元素生成 PDF
await dompdf(clonedElement, {...});

// 清理克隆元素
document.body.removeChild(clonedElement);
```

**经验**: 
- 第三方库可能修改传入的 DOM 元素
- 始终保留原始 DOM 的引用
- 使用克隆元素进行有风险的操作

### 问题：样式恢复失效

**原因**: 恢复样式后浏览器未立即重新计算布局。

**解决**: 强制 reflow：

```typescript
// 恢复样式后调用
void element.offsetHeight  // 强制浏览器重新计算布局
```

**经验**: DOM 操作后可能需要强制 reflow 确保样式立即生效。

---

## 7. 测试驱动开发

### E2E 测试覆盖

使用 Playwright 进行 E2E 测试：

```typescript
test('exports Chinese invoice PDF', async ({ page }) => {
  await page.goto('/editor');
  // ... 填写中文发票数据
  await page.getByRole('button', { name: 'Download PDF' }).click();
  // ... 验证 PDF 下载
});
```

### 关键教训

#### 教训 1: 迁移前编写测试

**价值**: dompdf 迁移前编写了 13 个 E2E 测试，确保迁移后功能一致。

**经验**: 
- 重大重构前先写测试
- 测试是回归的保障
- 测试覆盖率目标：80%+

#### 教训 2: 测试关键用户流程

**测试范围**:
- 英文/中文发票导出
- 多语言切换
- 模板应用
- 数据持久化

**经验**: E2E 测试聚焦关键用户流程，不要试图测试所有细节。

---

## 总结：可复用的检查清单

### 技术选型检查清单

- [ ] 用真实数据验证核心场景（尤其是多语言、大数据量）
- [ ] 评估第三方依赖的大小和性能影响
- [ ] 考虑边界情况和错误处理
- [ ] 记录决策过程和备选方案（ADR）

### 前端开发检查清单

- [ ] 所有用户可见文案使用翻译函数
- [ ] 用户偏好设置持久化
- [ ] DOM 操作前考虑是否需要克隆
- [ ] 打印/导出功能独立验证

### 代码审查检查清单

- [ ] 无硬编码文案
- [ ] 无 console.log（生产代码）
- [ ] 错误处理显式
- [ ] 翻译文件同步更新
- [ ] 测试覆盖关键流程

### 文档维护检查清单

- [ ] DEVLOG.md 记录本次开发内容
- [ ] PROJECT_STATUS.md 更新功能状态
- [ ] 如有架构决策，创建 ADR
- [ ] 提交信息符合 Conventional Commits

---

## 附录：相关文件

- [DEVLOG.md](DEVLOG.md) - 开发日志
- [adr/](adr/) - 架构决策记录
- [PRD.md](PRD.md) - 产品需求文档
- [BRANCH_GUIDELINES.md](BRANCH_GUIDELINES.md) - Git 分支规范
