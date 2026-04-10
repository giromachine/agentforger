import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Sales — Prospects', () => {
  test('page loads and "Nuevo prospecto" button is visible', async ({ page }) => {
    // Login first
    await page.goto(BASE_URL);
    await page.getByPlaceholder('Correo electrónico').fill('admin@mitla.local');
    await page.getByPlaceholder('Contraseña').fill('Mitla2026!');
    await page.getByRole('button', { name: /entrar|iniciar sesión/i }).click();
    await expect(page).toHaveURL(/\/sales\/dashboard/);

    // Navigate to prospects list
    await page.goto(`${BASE_URL}/sales/prospects`);
    await page.waitForLoadState('networkidle');

    // Verify list loads (table or empty state)
    await expect(page.locator('table, .ant-table, [role="table"]').first()).toBeVisible({ timeout: 10000 });

    // Verify "Nuevo prospecto" button
    await expect(page.getByRole('button', { name: /nuevo prospecto/i })).toBeVisible();
  });
});
