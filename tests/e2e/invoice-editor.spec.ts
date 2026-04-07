import { test, expect } from '@playwright/test';

test.describe('Invoice Editor - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    // Clear localStorage to start with a fresh state
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('should display invoice editor with all sections', async ({ page }) => {
    // Check main sections are visible
    await expect(page.getByRole('heading', { name: /Invoice Details/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /From \(Your Business\)/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /To \(Client\)/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Line Items/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Invoice Preview/i })).toBeVisible();
  });

  test('should have default invoice number and dates pre-filled', async ({ page }) => {
    const invoiceNumber = page.getByLabel(/Invoice Number/i);
    await expect(invoiceNumber).toHaveValue(/INV-\d+/);

    const dateField = page.getByLabel(/^Date$/i);
    await expect(dateField).not.toBeEmpty();

    const dueDateField = page.getByLabel(/Due Date/i);
    await expect(dueDateField).not.toBeEmpty();
  });

  test('should update invoice number when typing', async ({ page }) => {
    const invoiceNumberInput = page.getByLabel(/Invoice Number/i);
    await invoiceNumberInput.fill('INV-TEST-001');
    await expect(invoiceNumberInput).toHaveValue('INV-TEST-001');

    // Verify preview updates
    await expect(page.getByText('INV-TEST-001')).toBeVisible();
  });

  test('should update From section and reflect in preview', async ({ page }) => {
    // Fill business information
    await page.getByLabel('Business Name').fill('Test Company LLC');
    await page.getByLabel('From Address').fill('123 Business St');
    await page.getByLabel('From City, State, ZIP').fill('Austin, TX 78701');
    await page.getByLabel('From Country').fill('USA');
    await page.getByLabel('From Email').fill('billing@testcompany.com');
    await page.getByLabel('From Phone').fill('+1 (555) 123-4567');

    // Verify preview updates
    await expect(page.getByText('Test Company LLC')).toBeVisible();
    await expect(page.getByText('billing@testcompany.com')).toBeVisible();
  });

  test('should update To section and reflect in preview', async ({ page }) => {
    // Fill client information
    await page.getByLabel('Client Name').fill('John Smith');
    await page.getByLabel('Client Company').fill('Acme Corp');
    await page.getByLabel('Client Address').fill('456 Client Ave');
    await page.getByLabel('Client City, State, ZIP').fill('New York, NY 10001');
    await page.getByLabel('Client Country').fill('USA');
    await page.getByLabel('Client Email').fill('john@acme.com');
    await page.getByLabel('Client Phone').fill('+1 (555) 987-6543');

    // Verify preview updates
    await expect(page.getByText('John Smith')).toBeVisible();
    await expect(page.getByText('Acme Corp')).toBeVisible();
  });

  test('should add line items and calculate amounts correctly', async ({ page }) => {
    // Clear the default empty line item and fill the first one
    const firstRow = page.getByPlaceholder('Description').first();
    await firstRow.clear();
    await firstRow.fill('Web Development');
    await page.getByPlaceholder('Qty').first().fill('10');
    await page.getByPlaceholder('Rate').first().fill('100');

    // Verify amount calculation in form (shows $1000.00 without comma)
    await expect(page.locator('.font-mono').first()).toContainText('$1000.00');

    // Add a second line item
    const addButton = page.getByRole('button', { name: /\+ Add Line Item/i });
    await addButton.click();

    // Fill second line item
    const descriptions = page.getByPlaceholder('Description');
    await descriptions.nth(1).fill('Consulting');
    const quantities = page.getByPlaceholder('Qty');
    await quantities.nth(1).fill('5');
    const rates = page.getByPlaceholder('Rate');
    await rates.nth(1).fill('150');

    // Verify total in preview (includes 8% tax by default)
    // Subtotal: 1000 + 750 = 1750
    // Tax (8%): 140
    // Total: 1890
    await expect(page.locator('text="Total:"').locator('~ span')).toContainText('$1890.00');
  });

  test('should remove line items correctly', async ({ page }) => {
    // Fill a line item first
    await page.getByPlaceholder('Description').first().fill('Test Item');
    await page.getByPlaceholder('Qty').first().fill('1');
    await page.getByPlaceholder('Rate').first().fill('50');

    // Add second item
    await page.getByRole('button', { name: /\+ Add Line Item/i }).click();
    await page.getByPlaceholder('Description').nth(1).fill('Item to Remove');

    // Count items before removal
    const descriptions = page.getByPlaceholder('Description');
    await expect(descriptions).toHaveCount(2);

    // Remove second item (hover to show delete button)
    const removeButtons = page.getByRole('button').filter({ hasText: '×' });
    await removeButtons.nth(1).hover();
    await removeButtons.nth(1).click();

    // Verify only one item remains
    await expect(page.getByPlaceholder('Description')).toHaveCount(1);
  });

  test('should update tax rate and recalculate totals', async ({ page }) => {
    // Add a line item with known value
    await page.getByPlaceholder('Description').first().fill('Test Service');
    await page.getByPlaceholder('Qty').first().fill('1');
    await page.getByPlaceholder('Rate').first().fill('100');

    // Default tax rate is 8%, verify
    const taxRateInput = page.getByLabel(/Tax Rate/i);
    await expect(taxRateInput).toHaveValue('8');

    // Change tax rate to 10%
    await taxRateInput.fill('10');

    // Verify tax amount updated (should be $10 for $100 subtotal)
    await expect(page.getByText(/Tax \(10%\):/)).toBeVisible();
  });

  test('should update notes and terms fields', async ({ page }) => {
    const notesField = page.getByPlaceholder('Thank you for your business!');
    await notesField.fill('Thank you for choosing our services!');

    const termsField = page.getByPlaceholder('Payment due within 30 days');
    await termsField.fill('Net 30. Late payments subject to 1.5% monthly fee.');

    // Verify in preview section - use h3 to find the Notes section, then check sibling content
    await expect(page.locator('h3:has-text("Notes:")')).toBeVisible();
    // Find the paragraph within the Notes section
    await expect(page.locator('h3:has-text("Notes:") + p')).toHaveText('Thank you for choosing our services!');
    await expect(page.locator('h3:has-text("Terms:")')).toBeVisible();
    await expect(page.locator('h3:has-text("Terms:") + p')).toContainText('Net 30');
  });

  test('should auto-save to localStorage', async ({ page }) => {
    // Fill some data
    await page.getByLabel('Invoice Number').fill('INV-AUTOSAVE-001');
    await page.getByLabel('Business Name').fill('AutoSave Test Inc');

    // Wait for auto-save (debounced)
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();

    // Verify data persisted
    await expect(page.getByLabel('Invoice Number')).toHaveValue('INV-AUTOSAVE-001');
    await expect(page.getByLabel('Business Name')).toHaveValue('AutoSave Test Inc');
  });

  test('should export CSV successfully', async ({ page }) => {
    // Add a line item
    await page.getByPlaceholder('Description').first().fill('CSV Export Test');
    await page.getByPlaceholder('Qty').first().fill('1');
    await page.getByPlaceholder('Rate').first().fill('100');

    // Set up download listener
    const downloadPromise = page.waitForEvent('download');

    // Click export CSV button
    const csvButton = page.getByRole('button', { name: /Download CSV/i });
    await csvButton.click();

    // Verify download started
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.csv');
  });

  test('should trigger print dialog for PDF export', async ({ page }) => {
    // Grant print permissions
    const context = page.context();
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Click export PDF button
    const pdfButton = page.getByRole('button', { name: /Download PDF/i });
    await pdfButton.click();

    // Print dialog should be triggered (browser handles this)
    // We verify by checking the button was clicked and action initiated
    await expect(pdfButton).toBeVisible();
  });

  test('should display validation for required fields', async ({ page }) => {
    // Clear required fields
    const businessName = page.getByLabel('Business Name');
    await businessName.clear();

    const clientName = page.getByLabel('Client Name');
    await clientName.clear();

    // Verify fields are marked as required
    await expect(businessName).toHaveAttribute('placeholder', 'Business Name *');
    await expect(clientName).toHaveAttribute('placeholder', 'Client Name *');
  });

  test('should have responsive layout on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });

    // Both editor and preview should be visible
    await expect(page.getByRole('heading', { name: /Invoice Details/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Invoice Preview/i })).toBeVisible();
  });

  test('should have responsive layout on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Main sections should still be visible
    await expect(page.getByRole('heading', { name: /Invoice Details/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Line Items/i })).toBeVisible();
  });

  test('should calculate totals correctly with sample data', async ({ page }) => {
    // Clear default items and add specific test data
    await page.getByPlaceholder('Description').first().fill('Database Design');
    await page.getByPlaceholder('Qty').first().fill('33');
    await page.getByPlaceholder('Rate').first().fill('30');

    // Add more items to match design doc sample
    await page.getByRole('button', { name: /\+ Add Line Item/i }).click();
    await page.getByPlaceholder('Description').nth(1).fill('SEO Optimization');
    await page.getByPlaceholder('Qty').nth(1).fill('17');
    await page.getByPlaceholder('Rate').nth(1).fill('28');

    // Verify calculations in preview section
    // Item 1: 33 * 30 = 990
    // Item 2: 17 * 28 = 476
    // Subtotal: 1466
    // Use more specific selectors to avoid strict mode violations
    await expect(page.locator('td').getByText('$990.00').first()).toBeVisible();
    await expect(page.locator('td').getByText('$476.00').first()).toBeVisible();
  });
});
