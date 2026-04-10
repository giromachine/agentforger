import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const USER = 'admin@mitla.local';
const PASS = 'Mitla2026!';

test.describe('Auth', () => {
  test('login redirects to /sales/dashboard and shows username in header', async ({ page }) => {
    await page.goto(BASE_URL);

    // Fill login form
    await page.getByPlaceholder('Correo electrónico').fill(USER);
    await page.getByPlaceholder('Contraseña').fill(PASS);
    await page.getByRole('button', { name: /entrar|iniciar sesión/i }).click();

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/sales\/dashboard/);

    // Verify username appears in header
    await expect(page.getByText(/admin/i).first()).toBeVisible();
  });
});
