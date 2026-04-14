# DOMPDF Notes/Terms 渲染问题修复报告

## 问题描述
从截图和 PDF 文件分析发现：
1. PDF 底部显示页码"1/1"
2. Notes 和 Terms 区域内容完全缺失
3. Total 行下面直接就是页码和分隔线

## 根本原因分析

### 1. DOMPDF 的 scale 配置问题
原来的 `scale: 0.88` 配置会将内容缩小到 88%，但 DOMPDF 仍然使用固定的 A4 页面边界。这导致：
- 内容被缩小
- 页面可渲染区域没有相应扩大
- Notes/Terms 区域可能被截断在页面边界外

### 2. 页面边距设置
dompdf.js 的 margin 配置可能不足以防止浏览器默认打印行为

### 3. 容器高度计算
虽然我们设置了 `minHeight: 'unset'` 和 `height: 'auto'`，但 DOMPDF 可能仍然使用内部页面边界来计算内容布局

## 修复方案

### 已实施的修复
1. **移除 scale 配置** - 让内容以自然大小渲染
2. **保持动态高度计算** - `minHeight: 'unset'` 和 `height: 'auto'`

### 建议的额外修复
1. 添加 `@page` CSS 规则到容器样式中，明确禁用页眉页脚
2. 调整 margin 设置以确保内容不会被截断
3. 考虑增加底部 padding 以防止内容太靠近页面边缘

## 修改的文件

### src/lib/dompdf-export.ts
- 移除了两个地方的 `scale: 0.88` 配置
- 更新了注释说明不再使用缩放

## 验证步骤
1. 启动开发服务器
2. 填写包含 Notes 和 Terms 的发票数据
3. 导出 PDF
4. 验证 Notes 和 Terms 区域是否正确显示
5. 验证页码是否仍然出现

## 预期结果
- Notes 和 Terms 内容应该完整显示
- PDF 不应该有页码（如果页码是 dompdf.js 添加的）
- 内容高度应该与预览一致
