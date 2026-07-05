import { type Page, type Locator } from '@playwright/test';

// Page Object cho bước 2 checkout — trang tổng quan đơn hàng (/checkout-step-two.html).
export class CheckoutOverviewPage {
  readonly page: Page;
  readonly title: Locator;
  readonly itemRows: Locator;
  readonly itemNames: Locator;
  readonly itemQuantities: Locator;
  readonly itemPrices: Locator;
  readonly paymentInfoValue: Locator;
  readonly shippingInfoValue: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.itemRows = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemQuantities = page.locator('[data-test="item-quantity"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.paymentInfoValue = page.locator('[data-test="payment-info-value"]');
    this.shippingInfoValue = page.locator('[data-test="shipping-info-value"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  itemByName(name: string): Locator {
    return this.itemRows.filter({ hasText: name });
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
