# SauceDemo Checkout Flow Test Plan

## Application Overview

This test plan covers the full purchase journey of the SauceDemo web application (https://www.saucedemo.com) after login: the cart page, the two-step checkout (customer information and order overview), order completion, and related edge cases. Login itself is covered by the existing plan specs/saucedemo-login-and-inventory.md and is not re-planned here; every scenario below simply starts by logging in with standard_user / secret_sauce from the seed state.

All scenarios were manually verified against the live site prior to being written up:

- The cart page at /cart.html shows the title 'Your Cart' ([data-test="title"]), column labels 'QTY' ([data-test="cart-quantity-label"]) and 'Description' ([data-test="cart-desc-label"]), one [data-test="inventory-item"] row per product (quantity [data-test="item-quantity"] = '1', name [data-test="inventory-item-name"], description [data-test="inventory-item-desc"], price [data-test="inventory-item-price"], and a 'Remove' button such as [data-test="remove-sauce-labs-backpack"]), plus 'Continue Shopping' ([data-test="continue-shopping"]) and 'Checkout' ([data-test="checkout"]) buttons.
- Removing an item deletes its row immediately and decrements the header cart badge ([data-test="shopping-cart-badge"]); removing the last item removes the badge element entirely. 'Continue Shopping' navigates back to /inventory.html with the cart contents preserved.
- 'Checkout' navigates to /checkout-step-one.html, titled 'Checkout: Your Information', with three inputs — [data-test="firstName"] (placeholder 'First Name'), [data-test="lastName"] (placeholder 'Last Name'), [data-test="postalCode"] (placeholder 'Zip/Postal Code') — and 'Cancel' ([data-test="cancel"]) / 'Continue' ([data-test="continue"]) buttons. Submitting with missing fields produces an error banner ([data-test="error"]) whose text depends on the first missing field, in order: 'Error: First Name is required', 'Error: Last Name is required', 'Error: Postal Code is required'. All three inputs gain the 'error' CSS class, and the banner has a dismiss X ([data-test="error-button"]). Previously entered values are retained after a validation error. 'Cancel' returns to /cart.html.
- Valid customer info leads to /checkout-step-two.html, titled 'Checkout: Overview', which lists the cart items (without Remove buttons), 'Payment Information:' with value 'SauceCard #31337' ([data-test="payment-info-value"]), 'Shipping Information:' with value 'Free Pony Express Delivery!' ([data-test="shipping-info-value"]), and a 'Price Total' block: [data-test="subtotal-label"], [data-test="tax-label"], [data-test="total-label"]. For Sauce Labs Backpack ($29.99) + Sauce Labs Bike Light ($9.99) the observed values are 'Item total: $39.98', 'Tax: $3.20', 'Total: $43.18'; for the Backpack alone they are 'Item total: $29.99', 'Tax: $2.40', 'Total: $32.39' (tax is 8% of the subtotal, rounded to 2 decimals). 'Cancel' on this page returns to /inventory.html with the cart intact.
- 'Finish' ([data-test="finish"]) navigates to /checkout-complete.html, titled 'Checkout: Complete!', showing a 'Pony Express' image ([data-test="pony-express"]), the heading 'Thank you for your order!' ([data-test="complete-header"]), the text 'Your order has been dispatched, and will arrive just as fast as the pony can get there!' ([data-test="complete-text"]), and a 'Back Home' button ([data-test="back-to-products"]). Completing an order empties the cart (badge disappears) and 'Back Home' returns to /inventory.html with all product buttons reset to 'Add to cart'.
- Known product quirk (verified live): the app does NOT block checkout with an empty cart. The 'Checkout' button stays enabled on an empty /cart.html, the whole flow can be completed with zero items, and the overview shows 'Item total: $0' (no decimals), 'Tax: $0.00', 'Total: $0.00'. The scenario below documents this observed behavior so a future fix will surface as a test failure.

The Playwright project to use for automation is "ui-chromium" (baseURL https://www.saucedemo.com, testDir ./tests/ui). All tests are based on the seed file tests/ui/seed.spec.ts, which navigates to '/'. Generated test files should live under tests/ui/generated/. Scenarios are independent and can run in any order; each starts from a fresh session with an empty cart.

## Test Scenarios

### 1. Cart Page

**Seed:** `tests/ui/seed.spec.ts`

#### 1.1. Cart page displays all added items with quantities, prices, and actions

**File:** `tests/ui/generated/cart.spec.ts`

**Steps:**
  1. Start from the seed file state on '/' and log in with 'standard_user' / 'secret_sauce' (#user-name, #password, #login-button).
    - expect: The browser navigates to '/inventory.html' and the product list is displayed with no cart badge visible.
  2. Add two products to the cart: click [data-test="add-to-cart-sauce-labs-backpack"] and [data-test="add-to-cart-sauce-labs-bike-light"].
    - expect: The cart badge ([data-test="shopping-cart-badge"]) shows '2'.
  3. Click the shopping cart link ([data-test="shopping-cart-link"]).
    - expect: The browser navigates to '/cart.html'.
    - expect: The page title ([data-test="title"]) reads 'Your Cart'.
    - expect: The list header shows 'QTY' ([data-test="cart-quantity-label"]) and 'Description' ([data-test="cart-desc-label"]).
  4. Inspect the cart item rows ([data-test="inventory-item"]).
    - expect: Exactly 2 items are listed: 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' ([data-test="inventory-item-name"]).
    - expect: Each item shows quantity '1' ([data-test="item-quantity"]).
    - expect: The Backpack row shows the description 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.' and the price '$29.99' ([data-test="inventory-item-price"]).
    - expect: The Bike Light row shows the description starting with "A red light isn't the desired state in testing" and the price '$9.99'.
    - expect: Each row has a 'Remove' button ([data-test="remove-sauce-labs-backpack"], [data-test="remove-sauce-labs-bike-light"]).
    - expect: A 'Continue Shopping' button ([data-test="continue-shopping"]) and a 'Checkout' button ([data-test="checkout"]) are visible below the list.

#### 1.2. Removing items from the cart updates the list and the cart badge

**File:** `tests/ui/generated/cart.spec.ts`

**Steps:**
  1. Start from the seed file state, log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to the cart, and open the cart via [data-test="shopping-cart-link"].
    - expect: The cart page at '/cart.html' lists 2 items and the cart badge shows '2'.
  2. Click the 'Remove' button for the Bike Light ([data-test="remove-sauce-labs-bike-light"]).
    - expect: The 'Sauce Labs Bike Light' row disappears from the cart list immediately (no page reload).
    - expect: Only 'Sauce Labs Backpack' remains in the cart.
    - expect: The cart badge ([data-test="shopping-cart-badge"]) decrements to '1'.
  3. Click the 'Remove' button for the Backpack ([data-test="remove-sauce-labs-backpack"]).
    - expect: The cart list is now empty (zero [data-test="inventory-item"] rows).
    - expect: The cart badge element is removed entirely (no badge is rendered on the cart icon).
    - expect: The 'Continue Shopping' and 'Checkout' buttons are still displayed.

#### 1.3. Continue Shopping returns to the inventory with the cart preserved

**File:** `tests/ui/generated/cart.spec.ts`

**Steps:**
  1. Start from the seed file state, log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' to the cart, and open the cart via [data-test="shopping-cart-link"].
    - expect: The cart page at '/cart.html' lists 'Sauce Labs Backpack' and the badge shows '1'.
  2. Click the 'Continue Shopping' button ([data-test="continue-shopping"]).
    - expect: The browser navigates back to '/inventory.html'.
    - expect: The cart badge still shows '1' (cart contents are preserved).
    - expect: The Backpack's button on the inventory page reads 'Remove' ([data-test="remove-sauce-labs-backpack"]), confirming it is still in the cart.

### 2. Checkout Step One: Customer Information

**Seed:** `tests/ui/seed.spec.ts`

#### 2.1. Validation errors are shown for each missing required field, in order

**File:** `tests/ui/generated/checkout-information.spec.ts`

**Steps:**
  1. Start from the seed file state, log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' to the cart, open the cart, and click 'Checkout' ([data-test="checkout"]).
    - expect: The browser navigates to '/checkout-step-one.html'.
    - expect: The page title ([data-test="title"]) reads 'Checkout: Your Information'.
    - expect: Three empty inputs are shown: [data-test="firstName"] (placeholder 'First Name'), [data-test="lastName"] (placeholder 'Last Name'), [data-test="postalCode"] (placeholder 'Zip/Postal Code'), plus 'Cancel' and 'Continue' buttons.
  2. Click 'Continue' ([data-test="continue"]) with all three fields empty.
    - expect: The page stays on '/checkout-step-one.html'.
    - expect: An error banner ([data-test="error"]) shows the exact text: 'Error: First Name is required'.
    - expect: All three inputs gain the 'error' CSS class (red-outlined state).
    - expect: The banner has a dismiss 'X' button ([data-test="error-button"]).
  3. Fill only First Name ([data-test="firstName"]) with 'Bosco' and click 'Continue' again.
    - expect: The page stays on '/checkout-step-one.html'.
    - expect: The error banner text changes to exactly: 'Error: Last Name is required'.
  4. Fill Last Name ([data-test="lastName"]) with 'Nguyen', leave Zip/Postal Code empty, and click 'Continue' again.
    - expect: The page stays on '/checkout-step-one.html'.
    - expect: The error banner text changes to exactly: 'Error: Postal Code is required'.
  5. Click the 'X' button on the error banner ([data-test="error-button"]).
    - expect: The error banner is removed from the page.
    - expect: The previously entered values ('Bosco', 'Nguyen') are retained in their fields.

#### 2.2. Valid customer information proceeds to the order overview

**File:** `tests/ui/generated/checkout-information.spec.ts`

**Steps:**
  1. Start from the seed file state, log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' to the cart, open the cart, and click 'Checkout'.
    - expect: The checkout information page at '/checkout-step-one.html' is displayed with an empty form.
  2. Fill First Name with 'Bosco', Last Name with 'Nguyen', and Zip/Postal Code with '70000', then click 'Continue' ([data-test="continue"]).
    - expect: No error banner is shown.
    - expect: The browser navigates to '/checkout-step-two.html'.
    - expect: The page title ([data-test="title"]) reads 'Checkout: Overview'.

#### 2.3. Cancel on the information page returns to the cart with contents intact

**File:** `tests/ui/generated/checkout-information.spec.ts`

**Steps:**
  1. Start from the seed file state, log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' to the cart, open the cart, and click 'Checkout'.
    - expect: The checkout information page at '/checkout-step-one.html' is displayed.
  2. Click the 'Cancel' button ([data-test="cancel"]).
    - expect: The browser navigates back to '/cart.html'.
    - expect: The cart still lists 'Sauce Labs Backpack' and the cart badge still shows '1' (canceling does not clear the cart).

### 3. Checkout Step Two: Order Overview

**Seed:** `tests/ui/seed.spec.ts`

#### 3.1. Overview lists the ordered items with payment, shipping, and correct totals for a two-item cart

**File:** `tests/ui/generated/checkout-overview.spec.ts`

**Steps:**
  1. Start from the seed file state, log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' ($29.99) and 'Sauce Labs Bike Light' ($9.99) to the cart, open the cart, click 'Checkout', fill the customer form (First Name 'Bosco', Last Name 'Nguyen', Zip/Postal Code '70000'), and click 'Continue'.
    - expect: The browser navigates to '/checkout-step-two.html'.
    - expect: The page title ([data-test="title"]) reads 'Checkout: Overview'.
  2. Inspect the item list on the overview page.
    - expect: Both items are listed with quantity '1' each: 'Sauce Labs Backpack' at '$29.99' and 'Sauce Labs Bike Light' at '$9.99'.
    - expect: The item rows show name, description, and price but no 'Remove' buttons (items cannot be removed on this page).
  3. Inspect the payment and shipping information block.
    - expect: 'Payment Information:' ([data-test="payment-info-label"]) shows the value 'SauceCard #31337' ([data-test="payment-info-value"]).
    - expect: 'Shipping Information:' ([data-test="shipping-info-label"]) shows the value 'Free Pony Express Delivery!' ([data-test="shipping-info-value"]).
  4. Inspect the 'Price Total' block ([data-test="total-info-label"]).
    - expect: The subtotal ([data-test="subtotal-label"]) reads exactly 'Item total: $39.98' (29.99 + 9.99).
    - expect: The tax ([data-test="tax-label"]) reads exactly 'Tax: $3.20' (8% of $39.98, rounded to 2 decimals).
    - expect: The total ([data-test="total-label"]) reads exactly 'Total: $43.18' (item total + tax).
    - expect: 'Cancel' ([data-test="cancel"]) and 'Finish' ([data-test="finish"]) buttons are displayed.

#### 3.2. Totals are computed correctly for a single-item cart (8% tax)

**File:** `tests/ui/generated/checkout-overview.spec.ts`

**Steps:**
  1. Start from the seed file state, log in with 'standard_user' / 'secret_sauce', add only 'Sauce Labs Backpack' ($29.99) to the cart, open the cart, click 'Checkout', fill the customer form with valid values, and click 'Continue'.
    - expect: The overview page at '/checkout-step-two.html' lists exactly one item: 'Sauce Labs Backpack' at '$29.99'.
  2. Inspect the 'Price Total' block.
    - expect: The subtotal ([data-test="subtotal-label"]) reads exactly 'Item total: $29.99'.
    - expect: The tax ([data-test="tax-label"]) reads exactly 'Tax: $2.40' (8% of $29.99 = 2.3992, rounded to 2.40).
    - expect: The total ([data-test="total-label"]) reads exactly 'Total: $32.39'.

#### 3.3. Cancel on the overview page returns to the inventory with the cart intact

**File:** `tests/ui/generated/checkout-overview.spec.ts`

**Steps:**
  1. Start from the seed file state, log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to the cart, and proceed through checkout step one with valid customer info to reach '/checkout-step-two.html'.
    - expect: The overview page is displayed with the cart badge showing '2'.
  2. Click the 'Cancel' button ([data-test="cancel"]).
    - expect: The browser navigates to '/inventory.html' (note: cancel from the overview goes to the inventory, not back to the cart).
    - expect: The cart badge still shows '2' — the order was not placed and the cart contents are preserved.

### 4. Order Completion

**Seed:** `tests/ui/seed.spec.ts`

#### 4.1. Finishing the order shows the confirmation page, empties the cart, and Back Home returns to the inventory

**File:** `tests/ui/generated/checkout-complete.spec.ts`

**Steps:**
  1. Start from the seed file state, log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to the cart, open the cart, click 'Checkout', fill the customer form (First Name 'Bosco', Last Name 'Nguyen', Zip/Postal Code '70000'), click 'Continue' to reach the overview.
    - expect: The overview page at '/checkout-step-two.html' shows 'Total: $43.18' and a 'Finish' button.
  2. Click the 'Finish' button ([data-test="finish"]).
    - expect: The browser navigates to '/checkout-complete.html'.
    - expect: The page title ([data-test="title"]) reads 'Checkout: Complete!'.
    - expect: A 'Pony Express' image ([data-test="pony-express"]) is displayed.
    - expect: A level-2 heading ([data-test="complete-header"]) reads exactly 'Thank you for your order!'.
    - expect: The confirmation text ([data-test="complete-text"]) reads exactly 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'.
    - expect: The cart badge is no longer displayed in the header — the cart was emptied by placing the order.
    - expect: A 'Back Home' button ([data-test="back-to-products"]) is displayed.
  3. Click the 'Back Home' button ([data-test="back-to-products"]).
    - expect: The browser navigates to '/inventory.html'.
    - expect: No cart badge is displayed (cart is empty).
    - expect: All product buttons read 'Add to cart' again (e.g. [data-test="add-to-cart-sauce-labs-backpack"] exists and the 'Remove' variant does not), confirming the app state was fully reset for a new purchase.

### 5. Checkout Edge Cases

**Seed:** `tests/ui/seed.spec.ts`

#### 5.1. Checkout with an empty cart is permitted and produces a $0 order (known product quirk)

**File:** `tests/ui/generated/checkout-edge-cases.spec.ts`

**Steps:**
  1. Start from the seed file state, log in with 'standard_user' / 'secret_sauce' (do NOT add any products), and click the shopping cart link ([data-test="shopping-cart-link"]).
    - expect: The cart page at '/cart.html' is displayed with zero item rows ([data-test="inventory-item"]).
    - expect: The 'Checkout' button ([data-test="checkout"]) is still visible and enabled — the app does not block checkout for an empty cart (documented quirk).
  2. Click 'Checkout', then fill the customer form (First Name 'Empty', Last Name 'Cart', Zip/Postal Code '00000') and click 'Continue'.
    - expect: The browser reaches '/checkout-step-two.html' with an empty item list (zero [data-test="inventory-item"] rows).
    - expect: The subtotal ([data-test="subtotal-label"]) reads exactly 'Item total: $0' (note: no decimal places, unlike non-zero subtotals).
    - expect: The tax ([data-test="tax-label"]) reads exactly 'Tax: $0.00'.
    - expect: The total ([data-test="total-label"]) reads exactly 'Total: $0.00'.
  3. Click the 'Finish' button ([data-test="finish"]).
    - expect: The browser navigates to '/checkout-complete.html' and shows 'Thank you for your order!' — the app currently allows completing a zero-item order. This scenario intentionally pins the observed behavior; if the product later blocks empty-cart checkout, this test should fail and be updated.
