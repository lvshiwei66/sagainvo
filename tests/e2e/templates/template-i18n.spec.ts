import { test, expect } from '@playwright/test';
import { switchToLanguage, waitForTranslation } from '../utils/i18n-helpers';

test.describe('Template Preview Component Internationalization', () => {
  test.beforeEach(async ({ page }) => {
    // 设置桌面视口，确保侧边栏可见且不会遮挡内容
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.goto('/templates');
    // 等待页面加载完成
    await expect(page.locator('h1')).toContainText(/Invoice Templates|发票模板/);

    // 确保没有打开的 modal
    await page.evaluate(() => {
      const backdrop = document.querySelector('[data-testid="modal-backdrop"]');
      if (backdrop) {
        (backdrop as HTMLElement).click();
      }
    });
    await page.waitForTimeout(300);
  });

  test('should display localized text in English', async ({ page }) => {
    // 切换到英文（默认）
    await switchToLanguage(page, 'en');

    // 等待翻译完成
    await waitForTranslation(page);

    // 点击预览第一个模板
    const firstTemplateCard = page.locator('[data-testid="template-card"]').first();
    await firstTemplateCard.click();

    // 等待预览弹窗出现 - 使用更具体的选择器
    await expect(page.locator('.fixed.inset-0')).toBeVisible();

    // 验证英文文本是否正确显示
    await expect(page.locator('button').filter({ hasText: 'Close' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Use Template' })).toBeVisible();

    // 关闭预览
    await page.locator('button').filter({ hasText: 'Close' }).click();
    await expect(page.locator('.fixed.inset-0')).not.toBeVisible();
  });

  test('should display localized text in Chinese', async ({ page }) => {
    // 切换到中文
    await switchToLanguage(page, 'zh-CN');

    // 等待翻译完成
    await waitForTranslation(page);

    // 点击预览第一个模板
    const firstTemplateCard = page.locator('[data-testid="template-card"]').first();
    await firstTemplateCard.click();

    // 等待预览弹窗出现 - 使用更具体的选择器
    await expect(page.locator('.fixed.inset-0')).toBeVisible();

    // 验证中文文本是否正确显示
    await expect(page.locator('button').filter({ hasText: '关闭' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: '使用模板' })).toBeVisible();

    // 关闭预览
    await page.locator('button').filter({ hasText: '关闭' }).click();
    await expect(page.locator('.fixed.inset-0')).not.toBeVisible();
  });

  test('should display template content in correct language', async ({ page }) => {
    // 测试英文状态下发票模板内容
    await switchToLanguage(page, 'en');

    // 等待翻译完成
    await waitForTranslation(page);

    const firstTemplateCard = page.locator('[data-testid="template-card"]').first();
    await firstTemplateCard.click();

    // 等待翻译完成后再检查
    await waitForTranslation(page);

    // 验证发票模板中的英文内容 - 使用更精确的选择器
    const previewModal = page.locator('.fixed.inset-0');
    await expect(previewModal).toBeVisible();
    await expect(previewModal.getByText('INVOICE', { exact: true }).first()).toBeVisible();
    await expect(previewModal.getByText('FROM', { exact: true }).first()).toBeVisible();
    await expect(previewModal.getByText('TO', { exact: true }).first()).toBeVisible();
    await expect(previewModal.getByText('Description', { exact: true }).first()).toBeVisible();
    await expect(previewModal.getByText('Qty', { exact: true }).first()).toBeVisible();
    await expect(previewModal.getByText('TOTAL:', { exact: true }).first()).toBeVisible();

    // 关闭预览
    await page.locator('button').filter({ hasText: 'Close' }).click();
    await expect(previewModal).not.toBeVisible();

    // 切换到中文并再次验证
    await switchToLanguage(page, 'zh-CN');

    // 等待翻译完成
    await waitForTranslation(page);

    await firstTemplateCard.click();

    // 等待翻译完成后再检查
    await waitForTranslation(page);

    // 验证发票模板中的中文内容 - 使用更精确的选择器
    await expect(previewModal).toBeVisible();
    await expect(previewModal.getByText('发票', { exact: true }).first()).toBeVisible();
    await expect(previewModal.getByText('来自', { exact: true }).first()).toBeVisible();
    await expect(previewModal.getByText('致', { exact: true }).first()).toBeVisible();
    await expect(previewModal.getByText('描述', { exact: true }).first()).toBeVisible();
    await expect(previewModal.getByText('数量', { exact: true }).first()).toBeVisible();
    await expect(previewModal.getByText('总计:', { exact: true }).first()).toBeVisible();

    // 关闭预览
    await page.locator('button').filter({ hasText: '关闭' }).click();
  });

  test('should handle language switching properly', async ({ page }) => {
    await switchToLanguage(page, 'en');

    // 等待翻译完成
    await waitForTranslation(page);

    const firstTemplateCard = page.locator('[data-testid="template-card"]').first();
    await firstTemplateCard.click();

    // 等待翻译完成后再检查
    await waitForTranslation(page);

    // 验证初始状态是英文 - 使用更精确的选择器
    const previewModal = page.locator('.fixed.inset-0');
    await expect(previewModal).toBeVisible();
    await expect(previewModal.getByText('Use Template')).toBeVisible();
    await expect(previewModal.getByText('INVOICE')).toBeVisible();

    // 关闭预览
    await page.locator('button').filter({ hasText: 'Close' }).click();
    await expect(previewModal).not.toBeVisible();

    // 重新打开并验证中文
    await switchToLanguage(page, 'zh-CN');

    // 等待翻译完成
    await waitForTranslation(page);

    await firstTemplateCard.click();

    // 等待翻译完成后再检查
    await waitForTranslation(page);

    await expect(previewModal).toBeVisible();
    await expect(previewModal.getByText('使用模板', { exact: true }).first()).toBeVisible();
    await expect(previewModal.getByText('发票', { exact: true }).first()).toBeVisible();
  });
});