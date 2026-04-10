import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Collections — Debts', () => {
  test('table loads and status filter is visible', async ({ page }) => {
    // Login first
    await page.goto(BASE_URL);
    await page.getByPlaceholder('Correo electrónico').fill('admin@mitla.local');
    await page.getByPlaceholder('Contraseña').fill('Mitla2026!');
    await page.getByRole('button', { name: /entrar|iniciar sesión/i }).click();
    await expect(page).toHaveURL(/\/sales\/dashboard/);

    // Navigate to debts list
    await page.goto(`${BASE_URL}/collections/debts`);
    await page.waitForLoadState('networkidle');

    // Verify table loads
    await expect(page.locator('table, .ant-table, [role="table"]').first()).toBeVisible({ timeout: 10000 });

    // Verify status filter is present
    await expect(page.getByPlaceholder(/estado/i).or(page.locator('.ant-select').filter({ hasText: /estado/i })).first()).toBeVisible();
  });
});
