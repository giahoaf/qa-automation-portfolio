// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';

test.describe('Inventory Browsing', () => {
  test('Sort products by price (low to high)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Start from the seed file state and log in with valid credentials
    //    (standard_user / secret_sauce), landing on '/inventory.html'.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);

    // The product list is displayed in the default 'Name (A to Z)' order. This
    // default value is set by the app (not by a Playwright action), so asserting
    // it establishes the baseline the following re-sorts must change.
    await expect(inventoryPage.sortDropdown).toHaveValue('az');
    await expect(inventoryPage.itemNames).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ]);

    // 2. Select 'Price (low to high)' (value 'lohi') from the sort dropdown.
    await inventoryPage.sortBy('lohi');

    // The product list re-renders in ascending price order.
    await expect(inventoryPage.itemNames).toHaveText([
      'Sauce Labs Onesie',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Backpack',
      'Sauce Labs Fleece Jacket',
    ]);
    await expect(inventoryPage.itemPrices).toHaveText([
      '$7.99',
      '$9.99',
      '$15.99',
      '$15.99',
      '$29.99',
      '$49.99',
    ]);

    // 3. Select 'Price (high to low)' (value 'hilo') from the same dropdown.
    await inventoryPage.sortBy('hilo');

    // The list re-renders in descending price order. Characterization: the sort
    // is stable, so the two equal-priced $15.99 items keep their low-to-high
    // relative order (Sauce Labs Bolt T-Shirt before Test.allTheThings() T-Shirt
    // (Red)) rather than reversing. This order was verified live, so we assert
    // the observed order instead of a naive reverse of the ascending list.
    await expect(inventoryPage.itemNames).toHaveText([
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Backpack',
      'Sauce Labs Bolt T-Shirt',
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Bike Light',
      'Sauce Labs Onesie',
    ]);
    await expect(inventoryPage.itemPrices).toHaveText([
      '$49.99',
      '$29.99',
      '$15.99',
      '$15.99',
      '$9.99',
      '$7.99',
    ]);
  });
});
