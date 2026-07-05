import { type Page, type Locator } from '@playwright/test';

// Page Object cho trang giỏ hàng (/cart.html) của SauceDemo.
export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly qtyLabel: Locator;
  readonly descLabel: Locator;
  readonly itemRows: Locator;
  readonly itemNames: Locator;
  readonly itemQuantities: Locator;
  readonly itemPrices: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.qtyLabel = page.locator('[data-test="cart-quantity-label"]');
    this.descLabel = page.locator('[data-test="cart-desc-label"]');
    this.itemRows = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemQuantities = page.locator('[data-test="item-quantity"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  itemByName(name: string): Locator {
    return this.itemRows.filter({ hasText: name });
  }

  removeButton(slug: string): Locator {
    return this.page.locator(`[data-test="remove-${slug}"]`);
  }

  async removeItem(slug: string) {
    await this.removeButton(slug).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
