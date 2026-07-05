// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Inventory Browsing', () => {
  test('Sort products by price (low to high)', async ({ page }) => {
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    const productNames = page.locator('[data-test="inventory-item-name"]');
    const productPrices = page.locator('[data-test="inventory-item-price"]');

    // 1. Start from the seed file state and log in with valid credentials
    //    (standard_user / secret_sauce), landing on '/inventory.html'.
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);

    // The product list is displayed in the default 'Name (A to Z)' order.
    await expect(sortDropdown.locator('option:checked')).toHaveText('Name (A to Z)');
    await expect(productNames).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ]);

    // 2. Select the option 'Price (low to high)' (value 'lohi') from the sort dropdown.
    await sortDropdown.selectOption('lohi');

    // The dropdown now displays 'Price (low to high)' as the selected value.
    await expect(sortDropdown.locator('option:checked')).toHaveText('Price (low to high)');

    // The product list re-renders in ascending price order.
    await expect(productNames).toHaveText([
      'Sauce Labs Onesie',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Backpack',
      'Sauce Labs Fleece Jacket',
    ]);
    await expect(productPrices).toHaveText([
      '$7.99',
      '$9.99',
      '$15.99',
      '$15.99',
      '$29.99',
      '$49.99',
    ]);

    // 3. Select the option 'Price (high to low)' (value 'hilo') from the same sort dropdown.
    await sortDropdown.selectOption('hilo');

    // The product list re-renders in descending price order: Sauce Labs Fleece
    // Jacket ($49.99) first and Sauce Labs Onesie ($7.99) last.
    await expect(productNames).toHaveText([
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Backpack',
      'Sauce Labs Bolt T-Shirt',
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Bike Light',
      'Sauce Labs Onesie',
    ]);
    await expect(productPrices).toHaveText([
      '$49.99',
      '$29.99',
      '$15.99',
      '$15.99',
      '$9.99',
      '$7.99',
    ]);
  });
});
