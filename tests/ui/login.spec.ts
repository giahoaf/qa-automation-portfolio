import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

// SauceDemo is a demo web shop built for practising UI automation:
// https://www.saucedemo.com (test accounts are listed on the login page)

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard user can log in', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('locked out user sees an error message', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorBanner).toContainText('locked out');
  });
});
