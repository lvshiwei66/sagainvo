import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Set English language after page load to ensure consistent test environment
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      window.localStorage.setItem('sagainvo:language', 'en-US');
    });
    await page.reload();
  });

  test('should display correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Saga Invoice/);
  });

  test('should display hero section with main heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /Professional Invoices in 30 Seconds/i });
    await expect(heading).toBeVisible();
  });

  test('should display value proposition', async ({ page }) => {
    const subheading = page.getByText(/Create, customize, and send beautiful invoices/i);
    await expect(subheading).toBeVisible();
  });

  test('should have CTA button that links to editor', async ({ page }) => {
    const ctaButton = page.getByRole('link', { name: /Create Your First Invoice/i });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute('href', '/editor');
  });

  test('should navigate to editor when clicking header Create Invoice button', async ({ page }) => {
    const headerButton = page.getByRole('link', { name: /Create Invoice/i });
    await headerButton.click();

    await expect(page).toHaveURL('/editor');
    await expect(page.getByRole('heading', { name: /Invoice Details/i })).toBeVisible();
  });

  test('should display all three feature cards', async ({ page }) => {
    const features = [
      { icon: '⚡', name: 'Lightning Fast' },
      { icon: '🔒', name: 'Privacy First' },
      { icon: '📥', name: 'Export Anywhere' },
    ];

    for (const feature of features) {
      const featureCard = page.getByText(feature.name);
      await expect(featureCard).toBeVisible();
    }
  });

  test('should display footer with copyright', async ({ page }) => {
    const footer = page.getByText(/© 2026 Saga Invoice/i);
    await expect(footer).toBeVisible();
  });

  test('should have responsive layout on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const heading = page.getByRole('heading', { name: /Professional Invoices in 30 Seconds/i });
    await expect(heading).toBeVisible();

    const ctaButton = page.getByRole('link', { name: /Create Your First Invoice/i });
    await expect(ctaButton).toBeVisible();
  });
});
