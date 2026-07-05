import { type Page, type Locator } from '@playwright/test';

// Page Object cho trang login của SauceDemo.
// Quy tắc: MỌI locator và thao tác của trang login sống ở đây,
// test không được sờ trực tiếp vào locator của trang này nữa.
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorBanner = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
