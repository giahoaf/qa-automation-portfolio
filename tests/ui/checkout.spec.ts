import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';
import { CheckoutInformationPage } from '../../pages/checkout-information.page';
import { CheckoutOverviewPage } from '../../pages/checkout-overview.page';
import { CheckoutCompletePage } from '../../pages/checkout-complete.page';

// End-to-end purchase flow: login → add to cart → checkout → confirmation.

test('user can buy a product end-to-end', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutInfo = new CheckoutInformationPage(page);
  const checkoutOverview = new CheckoutOverviewPage(page);
  const checkoutComplete = new CheckoutCompletePage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.addToCart('sauce-labs-backpack');
  await expect(inventoryPage.cartBadge).toHaveText('1');

  await inventoryPage.openCart();
  await cartPage.checkout();

  await checkoutInfo.submitInformation('Bosco', 'Nguyen', '700000');

  await checkoutOverview.finish();
  await expect(checkoutComplete.completeHeader).toHaveText('Thank you for your order!');
});
