// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';
import { CartPage } from '../../../pages/cart.page';

test.describe('Inventory Browsing', () => {
  test('Add a product to the cart and verify the cart badge updates', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // 1. Start from the seed file state and log in with valid credentials
    //    (standard_user / secret_sauce), landing on '/inventory.html'.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Products');
    // No cart badge is visible while the cart is empty.
    await expect(inventoryPage.cartBadge).toHaveCount(0);

    // 2. Add 'Sauce Labs Backpack' to the cart (slug: sauce-labs-backpack).
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.removeButton('sauce-labs-backpack')).toBeVisible();

    // 3. Add 'Sauce Labs Bike Light' (slug: sauce-labs-bike-light).
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await expect(inventoryPage.removeButton('sauce-labs-backpack')).toBeVisible();
    await expect(inventoryPage.removeButton('sauce-labs-bike-light')).toBeVisible();

    // 4. Remove 'Sauce Labs Backpack' via its Remove button.
    await inventoryPage.removeFromCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.addToCartButton('sauce-labs-backpack')).toBeVisible();

    // 5. Open the cart via the cart icon.
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/\/cart\.html$/);
    // The cart lists exactly the remaining item (badge count matches contents).
    await expect(cartPage.itemRows).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText('Sauce Labs Bike Light');
  });
});
