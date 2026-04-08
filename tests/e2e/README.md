# E2E 测试套件 - Saga Invoice

本文档描述了 Saga Invoice 应用的 E2E 测试结构和覆盖范围。

## 测试文件结构

```
tests/e2e/
├── i18n.test.ts                    # i18n 核心功能测试 (待整合)
├── i18n-edge-cases.test.ts         # i18n 边界情况测试
├── pdf-export-i18n.test.ts         # PDF 导出与语言支持测试
├── settings-modal.test.ts          # 设置模态框测试 (待整合)
├── language-switching.test.ts      # 语言切换测试 (待整合)
├── utils/
│   └── i18n-helpers.ts             # i18n 测试工具函数
└── README.md                       # 本文档
```

## 测试分类

### 核心测试 (Critical Path)

这些测试必须始终通过，保证基本功能可用：

| 测试文件 | 描述 | 优先级 |
|----------|------|--------|
| `i18n.test.ts` | 语言切换核心功能 | P0 |
| `pdf-export-i18n.test.ts` | PDF 导出功能 | P0 |
| `settings-modal.test.ts` | 设置模态框功能 | P0 |

### 重要功能测试 (Important)

| 测试文件 | 描述 | 优先级 |
|----------|------|--------|
| `i18n-edge-cases.test.ts` | 边界情况测试 | P1 |
| `language-switching.test.ts` | 语言切换详细测试 | P1 |

### 视觉回归测试 (Visual Regression)

| 测试文件 | 描述 | 优先级 |
|----------|------|--------|
| `visual/i18n-visual.test.ts` | 多语言视觉对比 | P2 |

## 测试工具函数

位于 `tests/e2e/utils/i18n-helpers.ts`：

### `switchToLanguage(page, language)`
切换到指定语言
```typescript
await switchToLanguage(page, 'zh-CN');
```

### `getCurrentLanguage(page)`
获取当前语言
```typescript
const lang = await getCurrentLanguage(page);
```

### `waitForTranslation(page, timeout?)`
等待翻译完成
```typescript
await waitForTranslation(page, 1000);
```

### `expectLangAttribute(page, expectedLang)`
验证 HTML lang 属性
```typescript
await expectLangAttribute(page, 'zh-CN');
```

### `fillInvoiceForm(page, data?)`
填充发票表单
```typescript
await fillInvoiceForm(page, {
  businessName: 'Test Business',
  clientName: 'Test Client'
});
```

## 运行测试

```bash
# 运行所有测试
npx playwright test

# 运行特定测试文件
npx playwright test tests/e2e/i18n-edge-cases.test.ts

# 运行 PDF 导出测试
npx playwright test tests/e2e/pdf-export-i18n.test.ts

# 运行带标签的测试
npx playwright test --grep @i18n
npx playwright test --grep @pdf-export
```

## 测试报告

```bash
# 查看 HTML 报告
npx playwright show-report
```

## 测试覆盖范围

### i18n 功能覆盖

- [x] 语言切换 (EN ↔ ZH)
- [x] localStorage 持久化
- [x] HTML lang 属性更新
- [x] 表单占位符翻译
- [x] 导航项翻译
- [x] 按钮文本翻译
- [x] 发票预览翻译
- [x] 设置模态框翻译
- [x] 浏览器语言检测
- [x] 跨页面语言保持
- [x] 快速切换处理
- [x] 缺失翻译键回退
- [x] 无障碍支持 (ARIA, lang 属性)

### PDF 导出覆盖

- [x] 英文 PDF 导出
- [x] 中文 PDF 导出 (html2canvas)
- [x] 混合语言内容处理
- [x] 中文检测触发警告
- [x] 纯英文不触发警告
- [x] 导出取消处理
- [x] 下载按钮文本翻译

## 已知问题

1. **测试文件重复** - 多个测试文件包含重复的测试用例，需要整合
2. **Debug 测试文件** - `debug-*.test.ts` 文件应在调试完成后删除

## 整合计划

以下测试文件需要整合到统一的 `i18n.test.ts`：

- `language-switching.test.ts`
- `i18n-comprehensive.test.ts`
- `i18n-journey.test.ts`
- `i18n-functional.test.ts`
- `i18n-final-verification.test.ts`
- `i18n-core-functionality.test.ts`

## 添加新测试

添加新的 i18n 测试时：

1. 优先使用 `i18n-edge-cases.test.ts` 添加边界情况
2. 使用 `i18n-helpers.ts` 的工具函数保持一致性
3. 为新功能创建专用的测试文件
4. 更新此文档的测试覆盖范围清单

## CI/CD 集成

在 GitHub Actions 中运行：

```yaml
- name: Run E2E tests
  run: npx playwright test

- name: Upload test report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 调试测试

```bash
# 有头模式（查看浏览器）
npx playwright test --headed

# 调试模式
npx playwright test --debug

# 生成测试代码
npx playwright codegen http://localhost:3000/editor
```
