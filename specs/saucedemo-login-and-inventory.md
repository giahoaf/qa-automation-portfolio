# SauceDemo Login and Inventory Test Plan

## Application Overview

This test plan covers the first iteration of automated UI test coverage for the SauceDemo web application (https://www.saucedemo.com), a demo e-commerce site used for QA practice. The scope is intentionally focused on two areas: (1) login functionality, including successful authentication, failed-login scenarios, and logout; and (2) basic inventory browsing after a successful login, including verifying the product list is displayed, sorting products by price, and adding a product to the cart with cart badge verification.

All scenarios were manually verified against the live site prior to being written up below:
- The login page at https://www.saucedemo.com/ presents a Username field (#user-name), a Password field (#password), and a Login button (#login-button). The page also lists accepted usernames (standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user) and the shared password (secret_sauce) directly beneath the login form.
- Logging in with standard_user / secret_sauce navigates to https://www.saucedemo.com/inventory.html and renders 6 products (.inventory_item), a "Products" header, and a product sort dropdown ([data-test="product-sort-container"]) defaulting to "Name (A to Z)".
- An incorrect password produces the error banner: "Epic sadface: Username and password do not match any user in this service".
- The locked_out_user account (correct password) produces the error banner: "Epic sadface: Sorry, this user has been locked out.".
- Submitting the login form with both fields empty produces the error banner: "Epic sadface: Username is required".
- Selecting "Price (low to high)" in the sort dropdown re-orders the 6 products so prices ascend: $7.99 (Sauce Labs Onesie), $9.99 (Sauce Labs Bike Light), $15.99 (Sauce Labs Bolt T-Shirt), $15.99 (Test.allTheThings() T-Shirt (Red)), $29.99 (Sauce Labs Backpack), $49.99 (Sauce Labs Fleece Jacket).
- Clicking "Add to cart" on a product changes that button's label to "Remove" and causes a cart badge (.shopping_cart_badge) to appear next to the cart icon (data-test="shopping-cart-link") showing the count "1".
- The hamburger menu (#react-burger-menu-btn) opens a side panel containing "All Items", "About", "Logout" (#logout_sidebar_link), and "Reset App State" links. Clicking Logout returns the user to the login page at https://www.saucedemo.com/.

The Playwright project to use for automation is "ui-chromium" (baseURL https://www.saucedemo.com, testDir ./tests/ui), and all tests should be based on the seed file tests/ui/seed.spec.ts, which currently just navigates to "/".

## Test Scenarios

### 1. Login

**Seed:** `tests/ui/seed.spec.ts`

#### 1.1. Successful login with standard_user

**File:** `tests/ui/login.spec.ts`

**Steps:**
  1. Start from the seed file state: navigate to the base URL '/' (the SauceDemo login page).
    - expect: The login page loads with the title 'Swag Labs', showing a Username field, a Password field, and a Login button.
    - expect: A panel listing accepted usernames (standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user) and the password 'secret_sauce' is visible below the form.
  2. Fill the Username field (#user-name) with 'standard_user'.
    - expect: The typed value 'standard_user' appears in the Username field.
  3. Fill the Password field (#password) with 'secret_sauce'.
    - expect: The typed value is masked/entered in the Password field.
  4. Click the Login button (#login-button).
    - expect: The browser navigates to '/inventory.html'.
    - expect: The page header shows the title 'Products'.
    - expect: Six product items (.inventory_item) are rendered, each with a name, description, price, image, and an 'Add to cart' button.
    - expect: No error banner is displayed.

#### 1.2. Failed login with wrong password

**File:** `tests/ui/login.spec.ts`

**Steps:**
  1. Start from the seed file state on the login page ('/').
    - expect: The login form is visible and empty.
  2. Fill the Username field with the valid username 'standard_user'.
    - expect: The Username field contains 'standard_user'.
  3. Fill the Password field with an incorrect password, e.g. 'wrong_password'.
    - expect: The Password field contains the entered (masked) value.
  4. Click the Login button (#login-button).
    - expect: The page remains on the login URL ('/'); no navigation to the inventory page occurs.
    - expect: An error banner is displayed with the exact text: 'Epic sadface: Username and password do not match any user in this service'.
    - expect: The Username and Password input containers are shown with an error (red-outlined) state and an error icon.
  5. Click the 'X' icon on the error banner to dismiss it.
    - expect: The error banner is no longer visible and the form returns to its normal (non-error) state.

#### 1.3. Failed login with locked_out_user

**File:** `tests/ui/login.spec.ts`

**Steps:**
  1. Start from the seed file state on the login page ('/').
    - expect: The login form is visible and empty.
  2. Fill the Username field with 'locked_out_user'.
    - expect: The Username field contains 'locked_out_user'.
  3. Fill the Password field with the correct shared password 'secret_sauce'.
    - expect: The Password field contains the entered (masked) value.
  4. Click the Login button (#login-button).
    - expect: The page remains on the login URL ('/'); no navigation to the inventory page occurs.
    - expect: An error banner is displayed with the exact text: 'Epic sadface: Sorry, this user has been locked out.'

#### 1.4. Failed login with empty credentials

**File:** `tests/ui/login.spec.ts`

**Steps:**
  1. Start from the seed file state on the login page ('/'), leaving both the Username and Password fields empty.
    - expect: The login form is visible with both fields empty.
  2. Click the Login button (#login-button) without entering any credentials.
    - expect: The page remains on the login URL ('/').
    - expect: An error banner is displayed with the exact text: 'Epic sadface: Username is required'.

#### 1.5. Logout returns user to the login page

**File:** `tests/ui/login.spec.ts`

**Steps:**
  1. Start from the seed file state and log in with valid credentials: fill Username with 'standard_user', fill Password with 'secret_sauce', and click the Login button (#login-button).
    - expect: The browser navigates to '/inventory.html' and the product list is displayed.
  2. Click the hamburger menu button (#react-burger-menu-btn) in the top-left corner.
    - expect: A side menu panel slides in, showing links: 'All Items', 'About', 'Logout', and 'Reset App State'.
  3. Click the 'Logout' link (#logout_sidebar_link).
    - expect: The browser navigates back to the login page at the base URL ('/').
    - expect: The Username and Password fields and the Login button are visible again, and the fields are empty.
    - expect: Navigating directly back to '/inventory.html' (e.g. via browser back button or manual navigation) redirects back to the login page rather than showing the inventory, confirming the session was cleared.

### 2. Inventory Browsing

**Seed:** `tests/ui/seed.spec.ts`

#### 2.1. Product list is displayed after login

**File:** `tests/ui/inventory.spec.ts`

**Steps:**
  1. Start from the seed file state and log in with valid credentials (Username: 'standard_user', Password: 'secret_sauce'), then click Login.
    - expect: The browser navigates to '/inventory.html'.
  2. Inspect the inventory page contents: the page title/header and the list of product items (.inventory_item).
    - expect: The page header/title reads 'Products'.
    - expect: Exactly 6 product items are displayed, in this default order: Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99), Sauce Labs Bolt T-Shirt ($15.99), Sauce Labs Fleece Jacket ($49.99), Sauce Labs Onesie ($7.99), Test.allTheThings() T-Shirt (Red) ($15.99).
    - expect: Each product item shows a product image, a name, a short description, a price prefixed with '$', and an 'Add to cart' button.
    - expect: The sort dropdown ([data-test="product-sort-container"]) is visible and defaults to the option 'Name (A to Z)'.
    - expect: The shopping cart icon is visible in the top-right corner with no cart badge/count shown (cart is empty).

#### 2.2. Sort products by price (low to high)

**File:** `tests/ui/inventory.spec.ts`

**Steps:**
  1. Start from the seed file state and log in with valid credentials (standard_user / secret_sauce), landing on '/inventory.html'.
    - expect: The product list is displayed in the default 'Name (A to Z)' order.
  2. Select the option 'Price (low to high)' (value 'lohi') from the sort dropdown ([data-test="product-sort-container"]).
    - expect: The dropdown now displays 'Price (low to high)' as the selected value.
    - expect: The product list re-renders in ascending price order: Sauce Labs Onesie ($7.99), Sauce Labs Bike Light ($9.99), Sauce Labs Bolt T-Shirt ($15.99), Test.allTheThings() T-Shirt (Red) ($15.99), Sauce Labs Backpack ($29.99), Sauce Labs Fleece Jacket ($49.99).
  3. Select the option 'Price (high to low)' (value 'hilo') from the same sort dropdown.
    - expect: The product list re-renders in descending price order, the exact reverse of the low-to-high order: Sauce Labs Fleece Jacket ($49.99) first and Sauce Labs Onesie ($7.99) last.

#### 2.3. Add a product to the cart and verify the cart badge updates

**File:** `tests/ui/inventory.spec.ts`

**Steps:**
  1. Start from the seed file state and log in with valid credentials (standard_user / secret_sauce), landing on '/inventory.html'.
    - expect: The product list is displayed and no cart badge is visible next to the cart icon.
  2. Click the 'Add to cart' button for the 'Sauce Labs Backpack' product ([data-test="add-to-cart-sauce-labs-backpack"]).
    - expect: A cart badge (.shopping_cart_badge) appears next to the shopping cart icon showing the count '1'.
    - expect: The button previously labeled 'Add to cart' for that product now reads 'Remove'.
  3. Click the 'Add to cart' button for a second product, e.g. 'Sauce Labs Bike Light' ([data-test="add-to-cart-sauce-labs-bike-light"]).
    - expect: The cart badge count increments to '2'.
    - expect: Both products now show a 'Remove' button in place of 'Add to cart'.
  4. Click the 'Remove' button for the 'Sauce Labs Backpack' product.
    - expect: The cart badge count decrements to '1'.
    - expect: The 'Sauce Labs Backpack' button reverts to reading 'Add to cart'.
  5. Click the shopping cart icon (data-test="shopping-cart-link") in the top-right corner.
    - expect: The browser navigates to the cart page ('/cart.html').
    - expect: The cart page lists exactly the remaining item: 'Sauce Labs Bike Light', confirming the badge count matched the actual cart contents.
