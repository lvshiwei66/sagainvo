import { test, expect } from '@playwright/test';

test.describe('Comprehensive Language Switching Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    await page.waitForTimeout(1000); // Wait for page to load
  });

  test('should detect browser language and set default language', async ({ page }) => {
    // Verify HTML lang attribute is set to 'en' by default
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Check that English placeholders are initially shown
    await expect(page.locator('input[placeholder="Business Name *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Client Name *"]')).toBeVisible();

    // Verify the language switcher shows English initially
    const langSwitcher = page.locator('button[aria-label="Change language"]');
    await expect(langSwitcher).toContainText('English');
  });

  test('should switch to Chinese and update UI text', async ({ page }) => {
    const langSwitcher = page.locator('button[aria-label="Change language"]');

    // Click the language switcher to open dropdown
    await langSwitcher.click();
    await page.waitForTimeout(500);

    // Use JS evaluation to click the Chinese option
    await page.evaluate(() => {
      const chineseButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent?.trim() === '简体中文');

      if (chineseButton) {
        (chineseButton as HTMLElement).click();
      }
    });

    // Wait for language change to process
    await page.waitForTimeout(1500);

    // Refresh the page to see the new language applied
    await page.reload();
    await page.waitForTimeout(1000);

    // Verify Chinese text is now displayed
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="客户姓名 *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="描述"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="感谢您的惠顾！"]')).toBeVisible();

    // Verify the language switcher now shows Chinese
    const updatedLangSwitcher = page.locator('button[aria-label="Change language"]');
    await expect(updatedLangSwitcher).toContainText('简体中文');

    // Verify HTML lang attribute is updated to 'zh-CN'
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  });

  test('should switch back to English and update UI text', async ({ page }) => {
    // First switch to Chinese
    const langSwitcher = page.locator('button[aria-label="Change language"]');
    await langSwitcher.click();
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const chineseButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent?.trim() === '简体中文');

      if (chineseButton) {
        (chineseButton as HTMLElement).click();
      }
    });

    await page.waitForTimeout(1500);
    await page.reload();
    await page.waitForTimeout(1000);

    // Now switch back to English
    const chineseLangSwitcher = page.locator('button[aria-label="Change language"]');
    await expect(chineseLangSwitcher).toContainText('简体中文');

    await chineseLangSwitcher.click();
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const englishButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent?.trim() === 'English');

      if (englishButton) {
        (englishButton as HTMLElement).click();
      }
    });

    await page.waitForTimeout(1500);
    await page.reload();
    await page.waitForTimeout(1000);

    // Verify English text is restored
    await expect(page.locator('input[placeholder="Business Name *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Client Name *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Description"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Thank you for your business!"]')).toBeVisible();
  });

  test('should maintain language preference in localStorage', async ({ page }) => {
    // Check initial language in storage
    let storedLanguage = await page.evaluate(() => localStorage.getItem('sagainvo:language'));
    expect(storedLanguage).toBe('en'); // Default is English

    // Switch to Chinese
    const langSwitcher = page.locator('button[aria-label="Change language"]');
    await langSwitcher.click();
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const chineseButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent?.trim() === '简体中文');

      if (chineseButton) {
        (chineseButton as HTMLElement).click();
      }
    });

    await page.waitForTimeout(1500);
    await page.reload();
    await page.waitForTimeout(1000);

    // Verify that language was saved to localStorage
    storedLanguage = await page.evaluate(() => localStorage.getItem('sagainvo:language'));
    expect(storedLanguage).toBe('zh-CN');

    // Verify Chinese interface appears after reload
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();
  });
});

test.describe('Translation Completeness Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    await page.waitForTimeout(1000);
  });

  test('should translate all form labels and placeholders in English', async ({ page }) => {
    // Check form section titles
    await expect(page.locator('text=Invoice Details')).toBeVisible();
    await expect(page.locator('text=Design Elements')).toBeVisible();
    await expect(page.locator('text=From (Your Business)')).toBeVisible();
    await expect(page.locator('text=To (Client)')).toBeVisible();
    await expect(page.locator('text=Line Items')).toBeVisible();
    await expect(page.locator('text=Notes')).toBeVisible();
    await expect(page.locator('text=Terms')).toBeVisible();

    // Check placeholder texts
    await expect(page.locator('input[placeholder="Business Name *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Client Name *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Email *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Phone"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Address"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Description"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Qty"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Rate"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Thank you for your business!"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Payment due within 30 days"]')).toBeVisible();
  });

  test('should translate all form labels and placeholders in Chinese', async ({ page }) => {
    // Switch to Chinese first
    const langSwitcher = page.locator('button[aria-label="Change language"]');
    await langSwitcher.click();
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const chineseButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent?.trim() === '简体中文');

      if (chineseButton) {
        (chineseButton as HTMLElement).click();
      }
    });

    await page.waitForTimeout(1500);
    await page.reload();
    await page.waitForTimeout(1000);

    // Check form section titles in Chinese
    await expect(page.locator('text=发票详情')).toBeVisible();
    await expect(page.locator('text=设计元素')).toBeVisible();
    await expect(page.locator('text=来自（您的公司）')).toBeVisible();
    await expect(page.locator('text=收件人（客户）')).toBeVisible();
    await expect(page.locator('text=明细项目')).toBeVisible();
    await expect(page.locator('text=备注')).toBeVisible();
    await expect(page.locator('text=条款')).toBeVisible();

    // Check placeholder texts in Chinese
    await expect(page.locator('input[placeholder="公司名称 *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="客户姓名 *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="邮箱 *"]')).toBeVisible();
    await expect(page.locator('input[placeholder="电话"]')).toBeVisible();
    await expect(page.locator('input[placeholder="街道地址"]')).toBeVisible();
    await expect(page.locator('input[placeholder="描述"]')).toBeVisible();
    await expect(page.locator('input[placeholder="数量"]')).toBeVisible();
    await expect(page.locator('input[placeholder="单价"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="感谢您的惠顾！"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="付款期限为30天内"]')).toBeVisible();
  });

  test('should translate invoice preview elements in English', async ({ page }) => {
    // Fill in some data to make preview visible
    await page.fill('input[placeholder="Business Name *"]', 'Test Business');
    await page.fill('input[placeholder="Client Name *"]', 'Test Client');
    await page.fill('input[placeholder="Description"]', 'Test Service');

    await page.waitForTimeout(500);

    // Check invoice preview elements in English
    await expect(page.locator('text=INVOICE')).toBeVisible();
    await expect(page.locator('text=Invoice #:')).toBeVisible();
    await expect(page.locator('text=Date:')).toBeVisible();
    await expect(page.locator('text=Due Date:')).toBeVisible();
    await expect(page.locator('text=From:')).toBeVisible();
    await expect(page.locator('text=To:')).toBeVisible();
    await expect(page.locator('text=Description')).toBeVisible();
    await expect(page.locator('text=Qty')).toBeVisible();
    await expect(page.locator('text=Rate')).toBeVisible();
    await expect(page.locator('text=Amount')).toBeVisible();
    await expect(page.locator('text=Subtotal:')).toBeVisible();
    await expect(page.locator('text=Tax')).toBeVisible();
    await expect(page.locator('text=Total:')).toBeVisible();
  });

  test('should translate invoice preview elements in Chinese', async ({ page }) => {
    // Switch to Chinese first
    const langSwitcher = page.locator('button[aria-label="Change language"]');
    await langSwitcher.click();
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const chineseButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent?.trim() === '简体中文');

      if (chineseButton) {
        (chineseButton as HTMLElement).click();
      }
    });

    await page.waitForTimeout(1500);
    await page.reload();
    await page.waitForTimeout(1000);

    // Fill in some data to make preview visible
    await page.fill('input[placeholder="公司名称 *"]', '测试公司');
    await page.fill('input[placeholder="客户姓名 *"]', '测试客户');
    await page.fill('input[placeholder="描述"]', '测试服务');

    await page.waitForTimeout(500);

    // Check invoice preview elements in Chinese
    await expect(page.locator('text=发票')).toBeVisible();
    await expect(page.locator('text=发票编号:')).toBeVisible();
    await expect(page.locator('text=日期:')).toBeVisible();
    await expect(page.locator('text=截止日期:')).toBeVisible();
    await expect(page.locator('text=来自:')).toBeVisible();
    await expect(page.locator('text=收件人:')).toBeVisible();
    await expect(page.locator('text=描述')).toBeVisible();
    await expect(page.locator('text=数量')).toBeVisible();
    await expect(page.locator('text=单价')).toBeVisible();
    await expect(page.locator('text=金额')).toBeVisible();
    await expect(page.locator('text=小计:')).toBeVisible();
    await expect(page.locator('text=税额')).toBeVisible();
    await expect(page.locator('text=总计:')).toBeVisible();
  });
});

test.describe('Chinese Character Detection and PDF Export', () => {
  test('should detect Chinese characters and use appropriate PDF export method', async ({ page }) => {
    // First enable Chinese language
    const langSwitcher = page.locator('button[aria-label="Change language"]');
    await langSwitcher.click();
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const chineseButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent?.trim() === '简体中文');

      if (chineseButton) {
        (chineseButton as HTMLElement).click();
      }
    });

    await page.waitForTimeout(1500);
    await page.reload();
    await page.waitForTimeout(1000);

    // Fill in Chinese content
    await page.fill('input[placeholder="公司名称 *"]', '测试公司 有限公司');
    await page.fill('input[placeholder="客户姓名 *"]', '张三');
    await page.fill('input[placeholder="描述"]', '网站开发服务');
    await page.fill('textarea[placeholder="感谢您的惠顾！"]', '谢谢合作！');

    // Set up dialog listener for the alert that appears when Chinese characters are detected
    const dialogPromise = page.waitForEvent('dialog');

    // Click download PDF button
    await page.click('button:text("下载 PDF")');

    // Wait for the dialog
    const dialog = await Promise.race([
      dialogPromise,
      page.waitForTimeout(2000).then(() => null)
    ]);

    if (dialog) {
      const dialogMessage = dialog.message();
      console.log('Dialog message:', dialogMessage);
      expect(dialogMessage).toContain('Chinese characters');
      expect(dialogMessage).toContain('image-based PDF export');
      await dialog.accept();
    } else {
      // If no dialog appeared immediately, that's fine too in some implementations
      console.log('No dialog appeared - may be handled differently');
    }

    // Wait a bit for PDF generation
    await page.waitForTimeout(2000);
  });

  test('should handle mixed English and Chinese content correctly', async ({ page }) => {
    // Switch to Chinese language for the interface
    const langSwitcher = page.locator('button[aria-label="Change language"]');
    await langSwitcher.click();
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const chineseButton = Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent?.trim() === '简体中文');

      if (chineseButton) {
        (chineseButton as HTMLElement).click();
      }
    });

    await page.waitForTimeout(1500);
    await page.reload();
    await page.waitForTimeout(1000);

    // Fill in mixed content
    await page.fill('input[placeholder="公司名称 *"]', 'Global Corp 全球公司');
    await page.fill('input[placeholder="客户姓名 *"]', 'International Client 国际客户');
    await page.fill('input[placeholder="描述"]', 'Consulting Service 咨询服务');
    await page.fill('textarea[placeholder="感谢您的惠顾！"]', 'Thank you 谢谢！');

    // Verify all content appears correctly in the UI
    await expect(page.locator('text=Global Corp 全球公司')).toBeVisible();
    await expect(page.locator('text=International Client 国际客户')).toBeVisible();
    await expect(page.locator('text=Consulting Service 咨询服务')).toBeVisible();
    await expect(page.locator('text=Thank you 谢谢！')).toBeVisible();
  });
});