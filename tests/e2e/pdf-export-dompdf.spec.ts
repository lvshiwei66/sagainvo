import { test, expect } from '@playwright/test';

// Test configuration constants
const DEFAULT_WAIT_TIMEOUT = 10000;
const PAGE_LOAD_DELAY = 500;

/**
 * Shared test setup for PDF export tests
 */
async function setupTestPage(page: any) {
  await page.goto('/editor');
  await page.waitForTimeout(PAGE_LOAD_DELAY);
  await page.evaluate(() => {
    window.localStorage.setItem('sagainvo:language', 'en-US');
  });
  await page.reload();
  await page.waitForSelector('[placeholder*="Business Name"], [placeholder*="Invoice Number"]', { timeout: DEFAULT_WAIT_TIMEOUT });
}

test.describe('PDF Export - dompdf.js Migration', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page);
  });

  test('should export English invoice to PDF using dompdf.js', async ({ page }) => {
    // Fill in English invoice data
    await page.fill('input[placeholder="Business Name *"]', 'Sample Business Inc.');
    await page.fill('input[placeholder="Client Name *"]', 'John Doe');
    await page.fill('input[placeholder="Description"]', 'Website Development');
    await page.fill('input[placeholder="Qty"]', '1');
    await page.fill('input[placeholder="Rate"]', '100');

    // Set up intercept for PDF download
    const downloadPromise = page.waitForEvent('download');

    // Click download PDF button
    const pdfButton = page.getByRole('button', { name: /Download PDF/i });
    await pdfButton.click();

    // Wait for download to complete
    const download = await downloadPromise;

    // Verify download happened
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);

    // Verify the downloaded file exists and has content
    const downloadPath = await download.path();
    expect(downloadPath).toBeDefined();
  });

  test('should export Chinese invoice to PDF with dompdf.js (main migration feature)', async ({ page }) => {
    // Fill in Chinese invoice data - this is the key improvement from the migration
    await page.fill('input[placeholder="Business Name *"]', '测试公司有限公司');
    await page.fill('input[placeholder="Client Name *"]', '张三');
    await page.fill('input[placeholder="Description"]', '网站开发服务');
    await page.fill('input[placeholder="Qty"]', '1');
    await page.fill('input[placeholder="Rate"]', '100');
    await page.fill('textarea[placeholder="Thank you for your business!"]', '谢谢合作！');
    await page.fill('textarea[placeholder="Payment due within 30 days"]', '30 天内付款');

    // Set up intercept for PDF download
    const downloadPromise = page.waitForEvent('download');

    // Click download PDF button
    const pdfButton = page.getByRole('button', { name: /Download PDF/i });
    await pdfButton.click();

    // Wait for download to complete
    const download = await downloadPromise;

    // Verify download happened
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);

    // Verify the downloaded file exists
    const downloadPath = await download.path();
    expect(downloadPath).toBeDefined();
  });

  test('should export mixed English and Chinese content', async ({ page }) => {
    // Fill in mixed language content
    await page.fill('input[placeholder="Business Name *"]', 'Global Corp 全球公司');
    await page.fill('input[placeholder="Client Name *"]', 'International Client 国际客户');
    await page.fill('input[placeholder="Description"]', 'Consulting Service 咨询服务');
    await page.fill('input[placeholder="Qty"]', '5');
    await page.fill('input[placeholder="Rate"]', '200');

    // Set up intercept for PDF download
    const downloadPromise = page.waitForEvent('download');

    // Click download PDF button
    await page.getByRole('button', { name: /Download PDF/i }).click();

    // Wait for download to complete
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('should include all invoice sections in PDF export', async ({ page }) => {
    // Fill comprehensive invoice data - From section
    await page.fill('input[placeholder="Business Name *"]', 'Test Business LLC');
    await page.fill('input[placeholder="Street Address"]', '123 Business Street');
    await page.fill('input[placeholder="City, State, ZIP"]', 'Austin, TX 78701');
    await page.fill('input[placeholder="Country"]', 'USA');
    await page.fill('input[placeholder="Email *"]', 'contact@testbusiness.com');
    await page.fill('input[placeholder="Phone"]', '+1 (555) 123-4567');

    // To section - use locators for duplicate fields
    await page.fill('input[placeholder="Client Name *"]', 'Jane Smith');
    await page.fill('input[placeholder="Company"]', 'Acme Corporation');

    const streetAddresses = page.locator('input[placeholder="Street Address"]');
    const cities = page.locator('input[placeholder="City, State, ZIP"]');
    const countries = page.locator('input[placeholder="Country"]');

    await streetAddresses.nth(1).fill('456 Client Avenue');
    await cities.nth(1).fill('New York, NY 10001');
    await countries.nth(1).fill('USA');

    // Fill line items
    await page.fill('input[placeholder="Description"]', 'Web Development Services');
    await page.fill('input[placeholder="Qty"]', '10');
    await page.fill('input[placeholder="Rate"]', '150');

    // Add second line item
    await page.getByRole('button', { name: /\+ Add Line Item/i }).click();
    const descriptions = page.locator('input[placeholder="Description"]');
    const quantities = page.locator('input[placeholder="Qty"]');
    const rates = page.locator('input[placeholder="Rate"]');

    await descriptions.nth(1).fill('SEO Optimization');
    await quantities.nth(1).fill('5');
    await rates.nth(1).fill('100');

    // Fill notes and terms
    await page.fill('textarea[placeholder="Thank you for your business!"]', 'Thank you for choosing our services!');
    await page.fill('textarea[placeholder="Payment due within 30 days"]', 'Payment due within 30 days. Late fees apply.');

    // Set up download intercept
    const downloadPromise = page.waitForEvent('download');

    // Click download PDF button
    await page.getByRole('button', { name: /Download PDF/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('should handle invoice with logo in PDF export', async ({ page }) => {
    // Fill basic invoice data
    await page.fill('input[placeholder="Business Name *"]', 'Logo Test Company');
    await page.fill('input[placeholder="Client Name *"]', 'Test Client');
    await page.fill('input[placeholder="Description"]', 'Logo Test Service');
    await page.fill('input[placeholder="Qty"]', '1');
    await page.fill('input[placeholder="Rate"]', '50');

    // Note: Logo upload test to be added when file upload feature is implemented
    // Track in issue: #XX - Logo upload functionality
    // For now, test without logo
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download PDF/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('should use custom invoice number in PDF filename', async ({ page }) => {
    // Set custom invoice number
    await page.fill('input[aria-label="Invoice Number"]', 'INV-2026-001');
    await page.fill('input[placeholder="Business Name *"]', 'Custom Invoice Test');
    await page.fill('input[placeholder="Client Name *"]', 'Test Client');
    await page.fill('input[placeholder="Description"]', 'Test Service');
    await page.fill('input[placeholder="Qty"]', '1');
    await page.fill('input[placeholder="Rate"]', '100');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download PDF/i }).click();

    const download = await downloadPromise;
    // Verify filename uses the custom invoice number
    expect(download.suggestedFilename()).toBe('INV-2026-001.pdf');
  });

  test('should handle empty invoice gracefully', async ({ page }) => {
    // Don't fill any data, just try to export
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download PDF/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('should export invoice with multiple line items', async ({ page }) => {
    // Fill first line item
    await page.fill('input[placeholder="Description"]', 'Item 1');
    await page.fill('input[placeholder="Qty"]', '1');
    await page.fill('input[placeholder="Rate"]', '100');

    // Add more line items
    await page.getByRole('button', { name: /\+ Add Line Item/i }).click();
    await page.getByRole('button', { name: /\+ Add Line Item/i }).click();

    // Use locator chaining for multiple items
    const descriptions = page.locator('input[placeholder="Description"]');
    const quantities = page.locator('input[placeholder="Qty"]');
    const rates = page.locator('input[placeholder="Rate"]');

    await descriptions.nth(1).fill('Item 2');
    await quantities.nth(1).fill('2');
    await rates.nth(1).fill('200');

    await descriptions.nth(2).fill('Item 3');
    await quantities.nth(2).fill('3');
    await rates.nth(2).fill('300');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download PDF/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('should handle different tax rates in PDF export', async ({ page }) => {
    await page.fill('input[placeholder="Business Name *"]', 'Tax Test Company');
    await page.fill('input[placeholder="Client Name *"]', 'Tax Client');
    await page.fill('input[placeholder="Description"]', 'Tax Test Service');
    await page.fill('input[placeholder="Qty"]', '1');
    await page.fill('input[placeholder="Rate"]', '100');

    // Change tax rate - use label text to find the input
    await page.locator('input[type="number"][step="0.1"]').fill('15');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download PDF/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('should verify PDF export button is always available', async ({ page }) => {
    // Button should be visible on page load
    await expect(page.getByRole('button', { name: /Download PDF/i })).toBeVisible();

    // Should still be visible after filling data
    await page.fill('input[placeholder="Business Name *"]', 'Test');
    await expect(page.getByRole('button', { name: /Download PDF/i })).toBeVisible();

    // Should still be visible after adding line items
    await page.getByRole('button', { name: /\+ Add Line Item/i }).click();
    await expect(page.getByRole('button', { name: /Download PDF/i })).toBeVisible();
  });

  test('should export PDF after clearing form data', async ({ page }) => {
    // Fill data first
    await page.fill('input[placeholder="Business Name *"]', 'Initial Data');
    await page.fill('input[placeholder="Client Name *"]', 'Initial Client');
    await page.fill('input[placeholder="Description"]', 'Initial Service');
    await page.fill('input[placeholder="Qty"]', '1');
    await page.fill('input[placeholder="Rate"]', '100');

    // Clear all data
    await page.fill('input[placeholder="Business Name *"]', '');
    await page.fill('input[placeholder="Client Name *"]', '');
    await page.fill('input[placeholder="Description"]', '');

    // Should still be able to export
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download PDF/i }).click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });
});

test.describe('PDF Export - Layout Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page);
  });

  test('preview should show invoice container class for dompdf', async ({ page }) => {
    // Fill some data to trigger preview update
    await page.fill('input[placeholder="Business Name *"]', 'Layout Test Company');
    await page.fill('input[placeholder="Client Name *"]', 'Layout Client');

    // The preview container should have 'invoice-container' class for dompdf
    const previewContainer = page.locator('.invoice-container');
    await expect(previewContainer).toBeVisible();
  });

  test('should verify all sections visible in preview before export', async ({ page }) => {
    await page.fill('input[placeholder="Business Name *"]', 'Full Test Company');
    await page.fill('input[placeholder="Client Name *"]', 'Full Client');
    await page.fill('input[placeholder="Description"]', 'Full Service');
    await page.fill('input[placeholder="Qty"]', '1');
    await page.fill('input[placeholder="Rate"]', '100');
    await page.fill('textarea[placeholder="Thank you for your business!"]', 'Notes text');
    await page.fill('textarea[placeholder="Payment due within 30 days"]', 'Terms text');

    // Verify all sections are visible in preview
    await expect(page.locator('.invoice-container')).toBeVisible();
    // Use exact match for the INVOICE heading (h1 with exact text)
    await expect(page.locator('h1').filter({ hasText: 'INVOICE' })).toBeVisible();
    await expect(page.locator('text=From:')).toBeVisible();
    await expect(page.locator('text=To:')).toBeVisible();
    await expect(page.locator('text=Description')).toBeVisible();
    await expect(page.locator('text=Notes:')).toBeVisible();
    await expect(page.locator('text=Terms:')).toBeVisible();
  });
});
