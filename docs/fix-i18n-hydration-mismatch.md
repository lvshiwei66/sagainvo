# 修复 i18n Hydration Mismatch 问题

## 问题描述
在应用中遇到了 "Text content does not match server-rendered HTML" 错误，具体表现为：Server: "English" Client: "中文"。

## 根本原因
React 的 hydration 过程中，服务器端渲染的内容与客户端首次渲染的内容不匹配。这通常发生在：
1. 服务器端使用默认语言（通常是英语）渲染
2. 客户端挂载后立即从 localStorage 加载用户首选语言
3. 导致文本内容发生变化，触发 hydration mismatch 警告

## 解决方案

### 1. 修改 I18nProvider
- 将初始化逻辑改为首先使用服务器提供的 `initialLocale`，确保初次渲染与服务器一致
- 调整 `useEffect` 钩子，使其只在组件挂载后运行一次（空依赖数组），而不是依赖于 `initialLocale`
- 添加微小延迟以确保状态更新发生在 hydration 完成之后

### 2. 增强语言检测逻辑
- 改进 `getStoredLanguageServerSafe` 函数以更好地从服务器端获取用户首选语言
- 利用 Next.js 的 `cookies()` 服务端函数来读取语言偏好
- 保持客户端和服务端渲染的一致性

### 3. 更新根布局
- 创建 `I18nProviderWrapper` 服务器组件来处理国际化上下文的初始化
- 从根布局中移除直接的客户端逻辑，将语言检测移到服务器组件中

### 4. 优化模板页面
- 修复了可能导致文本节点不匹配的长文本连接问题
- 确保模板页面中的国际化文本正确分离

## 文件修改

1. `src/i18n/context.tsx` - 修复 I18nProvider 的 hydration 逻辑
2. `src/lib/i18n-storage.ts` - 改进服务器端语言检测
3. `src/app/layout.tsx` - 使用服务器组件处理国际化
4. `src/app/i18n-provider-wrapper.tsx` - 新增服务器组件
5. `src/app/templates/page.tsx` - 修复文本连接问题
6. `middleware.ts` - 新增中间件处理语言检测

## 测试验证

通过以下方式验证修复：
1. 页面初次加载时不再出现 hydration mismatch 警告
2. 语言偏好正确从 localStorage 加载并应用
3. 服务器和客户端渲染结果一致

## 预防措施

为避免未来出现类似问题：
1. 在处理国际化状态时，始终确保服务器端和客户端初次渲染的一致性
2. 使用适当的延迟或条件渲染来处理客户端特定的状态更新
3. 充分利用 Next.js 的服务器组件来预处理语言偏好