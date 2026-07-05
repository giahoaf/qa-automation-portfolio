// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Inventory Browsing', () => {
  test('Add a product to the cart and verify the cart badge updates', async ({ page }) => {
    const cartBadge = page.locator('.shopping_cart_badge');
    const backpackItem = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    const bikeLightItem = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bike Light' });

    // 1. Start from the seed file state and log in with valid credentials
    //    (standard_user / secret_sauce), landing on '/inventory.html'.
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);

    // The product list is displayed and no cart badge is visible next to the cart icon.
    await expect(backpackItem).toBeVisible();
    await expect(cartBadge).toHaveCount(0);

    // 2. Click the 'Add to cart' button for the 'Sauce Labs Backpack' product.
    await backpackItem.getByRole('button', { name: 'Add to cart' }).click();

    // A cart badge appears showing the count '1', and the Backpack button now reads 'Remove'.
    await expect(cartBadge).toHaveText('1');
    await expect(backpackItem.getByRole('button', { name: 'Remove' })).toBeVisible();

    // 3. Click the 'Add to cart' button for a second product, 'Sauce Labs Bike Light'.
    await bikeLightItem.getByRole('button', { name: 'Add to cart' }).click();

    // The cart badge count increments to '2', and both products show a 'Remove' button.
    await expect(cartBadge).toHaveText('2');
    await expect(backpackItem.getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(bikeLightItem.getByRole('button', { name: 'Remove' })).toBeVisible();

    // 4. Click the 'Remove' button for the 'Sauce Labs Backpack' product.
    await backpackItem.getByRole('button', { name: 'Remove' }).click();

    // The cart badge count decrements to '1', and the Backpack button reverts to 'Add to cart'.
    await expect(cartBadge).toHaveText('1');
    await expect(backpackItem.getByRole('button', { name: 'Add to cart' })).toBeVisible();

    // 5. Click the shopping cart icon in the top-right corner.
    await page.locator('[data-test="shopping-cart-link"]').click();

    // The browser navigates to the cart page, listing exactly the remaining item: 'Sauce Labs Bike Light'.
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(['Sauce Labs Bike Light']);
  });
});
