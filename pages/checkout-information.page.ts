import { type Page, type Locator } from '@playwright/test';

// Page Object cho bước 1 checkout — form thông tin khách hàng (/checkout-step-one.html).
export class CheckoutInformationPage {
  readonly page: Page;
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorBanner: Locator;
  readonly errorDismissButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorBanner = page.locator('[data-test="error"]');
    this.errorDismissButton = page.locator('[data-test="error-button"]');
  }

  // Điền cả 3 field rồi bấm Continue trong một bước (happy path).
  async submitInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }
}
