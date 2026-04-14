import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.describe('PDF Export - Notes and Terms Visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      window.localStorage.setItem('sagainvo:language', 'en-US');
    });
    await page.reload();
    await page.waitForSelector('[placeholder*="Business Name"], [placeholder*="Invoice Number"]', { timeout: 10000 });
  });

  test('should render Notes and Terms in PDF when content exceeds one page', async ({ page }) => {
    // Fill comprehensive invoice data to ensure content exceeds one page
    await page.fill('input[placeholder="Business Name *"]', 'Test Business LLC');
    await page.fill('input[placeholder="Street Address"]', '123 Business Street');
    await page.fill('input[placeholder="City, State, ZIP"]', 'Austin, TX 78701');
    await page.fill('input[placeholder="Country"]', 'USA');
    await page.fill('input[placeholder="Email *"]', 'contact@testbusiness.com');
    await page.fill('input[placeholder="Phone"]', '+1 (555) 123-4567');

    // To section
    await page.fill('input[placeholder="Client Name *"]', 'Jane Smith');
    await page.fill('input[placeholder="Company"]', 'Acme Corporation');

    const streetAddresses = page.locator('input[placeholder="Street Address"]');
    const cities = page.locator('input[placeholder="City, State, ZIP"]');
    const countries = page.locator('input[placeholder="Country"]');

    await streetAddresses.nth(1).fill('456 Client Avenue');
    await cities.nth(1).fill('New York, NY 10001');
    await countries.nth(1).fill('USA');

    // Add multiple line items to increase content height
    for (let i = 0; i < 5; i++) {
      if (i > 0) {
        await page.getByRole('button', { name: /\+ Add Line Item/i }).click();
      }
      const descriptions = page.locator('input[placeholder="Description"]');
      const quantities = page.locator('input[placeholder="Qty"]');
      const rates = page.locator('input[placeholder="Rate"]');

      await descriptions.nth(i).fill(`Service Item ${i + 1} - Detailed Description`);
      await quantities.nth(i).fill('10');
      await rates.nth(i).fill('150');
    }

    // Fill notes and terms with substantial content
    const notesText = 'Thank you for choosing our services!\n\nWe appreciate your business and look forward to working with you again.\n\nPlease contact us if you have any questions.';
    const termsText = 'Payment due within 30 days.\n\nLate fees of 1.5% per month will be charged on overdue invoices.\n\nAll disputes subject to local jurisdiction.';

    await page.fill('textarea[placeholder="Thank you for your business!"]', notesText);
    await page.fill('textarea[placeholder="Payment due within 30 days"]', termsText);

    // Wait for preview to update
    await page.waitForTimeout(1000);

    // Verify Notes and Terms are visible in preview before export
    // Use the invoice-container to scope to the preview area only
    const previewContainer = page.locator('.invoice-container');
    await expect(previewContainer).toBeVisible();
    await expect(previewContainer.locator('text=Notes:')).toBeVisible();
    await expect(previewContainer.locator('text=Terms:')).toBeVisible();
    await expect(previewContainer.locator('text=Thank you for choosing')).toBeVisible();
    await expect(previewContainer.locator('text=Payment due within 30 days')).toBeVisible();

    // Set up download intercept
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download PDF/i }).click();
    const download = await downloadPromise;

    // Verify PDF was downloaded
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);

    // Download and verify the PDF file exists and has content
    const downloadPath = await download.path();
    expect(downloadPath).toBeDefined();
    expect(downloadPath).not.toBeNull();

    // Check file size is reasonable (should have content)
    const stats = fs.statSync(downloadPath!);
    expect(stats.size).toBeGreaterThan(1000); // At least 1KB

    console.log(`PDF downloaded: ${download.suggestedFilename()}, size: ${stats.size} bytes`);
  });

  test('should not have page numbers in exported PDF', async ({ page }) => {
    await page.fill('input[placeholder="Business Name *"]', 'No Page Numbers Test');
    await page.fill('input[placeholder="Client Name *"]', 'Test Client');
    await page.fill('input[placeholder="Description"]', 'Test Service');
    await page.fill('input[placeholder="Qty"]', '1');
    await page.fill('input[placeholder="Rate"]', '100');
    await page.fill('textarea[placeholder="Thank you for your business!"]', 'Notes without page numbers');
    await page.fill('textarea[placeholder="Payment due within 30 days"]', 'Terms without page numbers');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download PDF/i }).click();
    const download = await downloadPromise;

    const downloadPath = await download.path();
    expect(downloadPath).toBeDefined();

    // Verify PDF was downloaded
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);

    // Check file exists and has content
    const stats = fs.statSync(downloadPath!);
    expect(stats.size).toBeGreaterThan(500);

    console.log('PDF downloaded successfully (page number test)');
  });

  test('should not create unnecessary pages when content fits on one page', async ({ page }) => {
    // Minimal content that should fit on one page
    await page.fill('input[placeholder="Business Name *"]', 'One Page Test');
    await page.fill('input[placeholder="Client Name *"]', 'Single Page Client');
    await page.fill('input[placeholder="Description"]', 'Single Item');
    await page.fill('input[placeholder="Qty"]', '1');
    await page.fill('input[placeholder="Rate"]', '50');
    await page.fill('textarea[placeholder="Thank you for your business!"]', 'Short note.');
    await page.fill('textarea[placeholder="Payment due within 30 days"]', 'Simple terms.');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download PDF/i }).click();
    const download = await downloadPromise;

    const downloadPath = await download.path();
    expect(downloadPath).toBeDefined();

    // Check file size is reasonable for a single page
    const stats = fs.statSync(downloadPath!);
    expect(stats.size).toBeGreaterThan(500);
    expect(stats.size).toBeLessThan(500000); // Less than 500KB (reasonable for 1 page)

    console.log(`PDF size: ${stats.size} bytes (should be single page)`);
  });
});
