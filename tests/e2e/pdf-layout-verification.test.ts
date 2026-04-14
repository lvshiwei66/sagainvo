import { test, expect } from '@playwright/test';

test.describe('PDF Layout Verification - Notes and Terms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    // Wait for editor to load
    await page.waitForSelector('input[placeholder="Business Name *"]');
  });

  test('should display Notes and Terms side by side in preview', async ({ page }) => {
    // Fill in invoice data with notes and terms
    await page.fill('input[placeholder="Business Name *"]', 'Test Business');
    await page.fill('input[placeholder="Client Name *"]', 'Test Client');
    await page.fill('input[placeholder="Description"]', 'Test Service');
    await page.fill('textarea[placeholder="Thank you for your business!"]', 'Thank you for your business!');
    await page.fill('textarea[placeholder="Payment due within 30 days"]', 'Payment due within 30 days.');

    // Wait for preview to update
    await page.waitForTimeout(500);

    // Verify Notes and Terms are visible in preview
    await expect(page.locator('text=Notes:')).toBeVisible();
    await expect(page.locator('text=Terms:')).toBeVisible();

    // Verify they are in a grid layout (side by side)
    const notesSection = page.locator('text=Notes:').locator('xpath=..');
    const termsSection = page.locator('text=Terms:').locator('xpath=..');

    // Get their positions
    const notesBox = await notesSection.boundingBox();
    const termsBox = await termsSection.boundingBox();

    // They should be at approximately the same Y position (side by side)
    expect(notesBox).toBeTruthy();
    expect(termsBox).toBeTruthy();

    if (notesBox && termsBox) {
      // Y positions should be within 20px of each other (same row)
      expect(Math.abs(notesBox.y - termsBox.y)).toBeLessThan(20);
    }
  });

  test('should export PDF with Notes and Terms', async ({ page }) => {
    // Fill in invoice data with notes and terms
    await page.fill('input[placeholder="Business Name *"]', 'Test Business');
    await page.fill('input[placeholder="Client Name *"]', 'Test Client');
    await page.fill('input[placeholder="Description"]', 'Test Service');
    await page.fill('textarea[placeholder="Thank you for your business!"]', 'Thank you for your business!');
    await page.fill('textarea[placeholder="Payment due within 30 days"]', 'Payment due within 30 days.');

    // Set up intercept for PDF download
    const downloadPromise = page.waitForEvent('download');

    // Click download PDF button
    await page.click('button:text("Download PDF")');

    // Wait for download to complete
    const download = await downloadPromise;
    const downloadPath = await download.path();

    // Verify download happened
    expect(downloadPath).toBeDefined();
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);

    // The PDF should contain both Notes and Terms
    // (actual content verification would require PDF parsing)
  });

  test('should handle Notes only (no Terms)', async ({ page }) => {
    // Fill in invoice data with only notes
    await page.fill('input[placeholder="Business Name *"]', 'Test Business');
    await page.fill('input[placeholder="Client Name *"]', 'Test Client');
    await page.fill('input[placeholder="Description"]', 'Test Service');
    await page.fill('textarea[placeholder="Thank you for your business!"]', 'Thank you for your business!');

    // Wait for preview to update
    await page.waitForTimeout(500);

    // Verify Notes is visible but Terms is not
    await expect(page.locator('text=Notes:')).toBeVisible();
    await expect(page.locator('text=Terms:')).not.toBeVisible();
  });

  test('should handle Terms only (no Notes)', async ({ page }) => {
    // Fill in invoice data with only terms
    await page.fill('input[placeholder="Business Name *"]', 'Test Business');
    await page.fill('input[placeholder="Client Name *"]', 'Test Client');
    await page.fill('input[placeholder="Description"]', 'Test Service');
    await page.fill('textarea[placeholder="Payment due within 30 days"]', 'Payment due within 30 days.');

    // Wait for preview to update
    await page.waitForTimeout(500);

    // Verify Terms is visible but Notes is not
    await expect(page.locator('text=Terms:')).toBeVisible();
    await expect(page.locator('text=Notes:')).not.toBeVisible();
  });
});
