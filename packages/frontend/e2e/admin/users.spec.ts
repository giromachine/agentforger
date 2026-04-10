import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Admin — Users', () => {
  test('user list loads and "Nuevo usuario" button is visible', async ({ page }) => {
    // Login first
    await page.goto(BASE_URL);
    await page.getByPlaceholder('Correo electrónico').fill('admin@mitla.local');
    await page.getByPlaceholder('Contraseña').fill('Mitla2026!');
    await page.getByRole('button', { name: /entrar|iniciar sesión/i }).click();
    await expect(page).toHaveURL(/\/sales\/dashboard/);

    // Navigate to admin users
    await page.goto(`${BASE_URL}/admin/users`);
    await page.waitForLoadState('networkidle');

    // Verify user list loads
    await expect(page.locator('table, .ant-table, [role="table"]').first()).toBeVisible({ timeout: 10000 });

    // Verify "Nuevo usuario" button
    await expect(page.getByRole('button', { name: /nuevo usuario/i })).toBeVisible();
  });
});
