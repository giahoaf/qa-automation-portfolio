import { type Page, type Locator } from '@playwright/test';

// Page Object cho trang danh sách sản phẩm (/inventory.html) của SauceDemo.
export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('.inventory_item');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  // Row của một sản phẩm theo tên hiển thị (dùng cho assert theo từng sản phẩm).
  itemByName(name: string): Locator {
    return this.inventoryItems.filter({ hasText: name });
  }

  // slug là phần đuôi trong data-test của nút, ví dụ 'sauce-labs-backpack'.
  addToCartButton(slug: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${slug}"]`);
  }

  removeButton(slug: string): Locator {
    return this.page.locator(`[data-test="remove-${slug}"]`);
  }

  async addToCart(slug: string) {
    await this.addToCartButton(slug).click();
  }

  async removeFromCart(slug: string) {
    await this.removeButton(slug).click();
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(value);
  }

  async openCart() {
    await this.cartLink.click();
  }
}
