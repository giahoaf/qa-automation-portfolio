// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';
import { CartPage } from '../../../pages/cart.page';
import { CheckoutInformationPage } from '../../../pages/checkout-information.page';
import { CheckoutOverviewPage } from '../../../pages/checkout-overview.page';
import { CheckoutCompletePage } from '../../../pages/checkout-complete.page';

test.describe('Order Completion', () => {
  test('Finishing the order shows the confirmation page, empties the cart, and Back Home returns to the inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfo = new CheckoutInformationPage(page);
    const checkoutOverview = new CheckoutOverviewPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    // 1. Log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to the cart, open the cart, click 'Checkout', submit the customer form ('Bosco' / 'Nguyen' / '70000') to reach the overview.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutInfo.submitInformation('Bosco', 'Nguyen', '70000');
    // The overview page at '/checkout-step-two.html' shows 'Total: $43.18' and a 'Finish' button.
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkoutOverview.totalLabel).toHaveText('Total: $43.18');
    await expect(checkoutOverview.finishButton).toBeVisible();

    // 2. Click the 'Finish' button.
    await checkoutOverview.finish();
    // The browser navigates to '/checkout-complete.html'.
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    // The page title reads 'Checkout: Complete!'.
    await expect(checkoutComplete.title).toHaveText('Checkout: Complete!');
    // A 'Pony Express' image is displayed.
    await expect(checkoutComplete.ponyExpressImage).toBeVisible();
    // A heading reads exactly 'Thank you for your order!'.
    await expect(checkoutComplete.completeHeader).toHaveText('Thank you for your order!');
    // The confirmation text reads exactly 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'.
    await expect(checkoutComplete.completeText).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    // The cart badge is no longer displayed — the cart was emptied by placing the order.
    await expect(checkoutComplete.cartBadge).toHaveCount(0);
    // A 'Back Home' button is displayed.
    await expect(checkoutComplete.backHomeButton).toBeVisible();

    // 3. Click the 'Back Home' button.
    await checkoutComplete.backHome();
    // The browser navigates to '/inventory.html'.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    // No cart badge is displayed (cart is empty).
    await expect(inventoryPage.cartBadge).toHaveCount(0);
    // The Backpack's button reads 'Add to cart' again, confirming the app state was reset.
    await expect(inventoryPage.addToCartButton('sauce-labs-backpack')).toHaveText('Add to cart');
  });
});
