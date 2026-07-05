// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Inventory Browsing', () => {
  test('Product list is displayed after login', async ({ page }) => {
    // 1. Start from the seed file state and log in with valid credentials
    //    (Username: 'standard_user', Password: 'secret_sauce'), then click Login.
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);

    // 2. Inspect the inventory page contents: the page title/header and the
    //    list of product items (.inventory_item).

    // The page header/title reads 'Products'.
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    // Exactly 6 product items are displayed, in the default Name (A to Z) order.
    const items = page.locator('.inventory_item');
    await expect(items).toHaveCount(6);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ]);
    // Prices match the expected products in order, each prefixed with '$'.
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText([
      '$29.99',
      '$9.99',
      '$15.99',
      '$49.99',
      '$7.99',
      '$15.99',
    ]);

    // Each product item shows an image, a name, a short description, a price
    // prefixed with '$', and an 'Add to cart' button.
    for (const item of await items.all()) {
      await expect(item.getByRole('img')).toBeVisible();
      await expect(item.locator('[data-test="inventory-item-name"]')).toBeVisible();
      await expect(item.locator('[data-test="inventory-item-desc"]')).toBeVisible();
      const price = item.locator('[data-test="inventory-item-price"]');
      await expect(price).toBeVisible();
      await expect(price).toHaveText(/^\$/);
      await expect(item.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    }

    // The sort dropdown is visible and defaults to the option 'Name (A to Z)'.
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await expect(sortDropdown).toBeVisible();
    await expect(sortDropdown).toHaveValue('az');
    await expect(sortDropdown.locator('option:checked')).toHaveText('Name (A to Z)');

    // The shopping cart icon is visible in the top-right corner with no cart
    // badge/count shown (cart is empty).
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
