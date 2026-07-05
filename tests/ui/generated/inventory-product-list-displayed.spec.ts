// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';

test.describe('Inventory Browsing', () => {
  test('Product list is displayed after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Start from the seed file state and log in with valid credentials
    //    (standard_user / secret_sauce).
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);

    // 2. Inspect the inventory page contents.

    // The page header/title reads 'Products'.
    await expect(inventoryPage.title).toHaveText('Products');

    // Exactly 6 product items are displayed, in the default Name (A to Z) order.
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
    await expect(inventoryPage.itemNames).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ]);
    // Prices match the expected products in order, each prefixed with '$'.
    await expect(inventoryPage.itemPrices).toHaveText([
      '$29.99',
      '$9.99',
      '$15.99',
      '$49.99',
      '$7.99',
      '$15.99',
    ]);

    // Each product item shows an image, a name, a description, a price prefixed
    // with '$', and an 'Add to cart' button. Names and prices are already
    // asserted in order above; this loop covers the remaining structural
    // elements the page object does not expose per item (image, description,
    // and the generic 'Add to cart' button — addToCartButton is keyed by slug).
    for (const item of await inventoryPage.inventoryItems.all()) {
      await expect(item.getByRole('img')).toBeVisible();
      await expect(item.locator('[data-test="inventory-item-desc"]')).toBeVisible();
      await expect(item.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    }

    // The sort dropdown is visible and defaults to 'Name (A to Z)'.
    await expect(inventoryPage.sortDropdown).toBeVisible();
    await expect(inventoryPage.sortDropdown).toHaveValue('az');
    await expect(inventoryPage.sortDropdown.locator('option:checked')).toHaveText('Name (A to Z)');

    // The shopping cart icon is visible with no cart badge (cart is empty).
    await expect(inventoryPage.cartLink).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });
});
