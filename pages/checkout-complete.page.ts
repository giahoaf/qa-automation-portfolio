import { type Page, type Locator } from '@playwright/test';

// Page Object cho trang hoàn tất đơn hàng (/checkout-complete.html).
export class CheckoutCompletePage {
  readonly page: Page;
  readonly title: Locator;
  readonly ponyExpressImage: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}
