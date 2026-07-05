# Toolshop Catalog and Login Test Plan

## Application Overview

This test plan covers the first iteration of automated UI test coverage for the Practice Software Testing "Toolshop" web application (https://practicesoftwaretesting.com), a demo e-commerce site for tools built specifically for test-automation practice. The scope is limited to three areas: (1) the home page / product catalog — product grid display, pagination, sorting by name and price, the search box (search + reset), category filter checkboxes, and the price range slider; (2) the product detail page — opening a product from the grid, verifying its name/price/description/category, quantity increase/decrease, and add-to-cart with cart icon badge updates; and (3) the customer sign-in flow at /auth/login. Checkout/payment, admin role, account management pages, favorites, contact form, and API testing are explicitly out of scope.

All scenarios were manually verified against the live site (v5.0) prior to being written up below:

- The app uses data-test attributes extensively. Stable ones observed: sort (select), search-query, search-reset, search-submit, search-caption, search-term, search-result-count, no-results, product-name, product-price, out-of-stock, pagination-prev, pagination-next, unit-price, product-description, quantity, increase-quantity, decrease-quantity, add-to-cart, nav-cart, cart-quantity, nav-sign-in, login-form, email, password, login-submit, login-error, email-error, password-error, page-title, nav-menu.
- IMPORTANT — dynamic IDs: product cards use data-test="product-<ULID>" and category/brand checkboxes use data-test="category-<ULID>" / "brand-<ULID>". These ULIDs are regenerated whenever the demo database reseeds (observed changing between two page loads a few minutes apart). Tests must NOT hard-code these IDs; select category checkboxes by accessible label (e.g. getByLabel('Hammer', { exact: true })) and product cards structurally (e.g. locator('a.card') or [data-test^="product-"]).
- The default grid shows 9 product cards per page, each with an image, a name (h5 [data-test="product-name"]), and a price ([data-test="product-price"]) matching /^\$\d+\.\d{2}$/. Because the catalog data may change over time, tests should prefer structural assertions over pinning exact catalog contents.
- QUIRK (pagination count): on initial load the app fires two product requests — GET /products?page=1&is_rental=false (50 products, 6 pages) and GET /products?page=1&between=price,1,100&is_rental=false (45 products, 5 pages). Depending on which response renders last, the pager may show 5 or 6 page buttons. Do not assert an exact page count; assert "at least 5 numbered pages" or simply that page 2 exists.
- The price range slider (ngx-slider) has floor 0 / ceiling 200 and defaults to min=1, max=100. The default filter between=price,1,100 therefore hides products above $100 (with Price High-Low sort the highest visible price was $89.55). Slider handles (span.ngx-slider-pointer-min / -max) respond to keyboard once focused: ArrowLeft/ArrowRight step by 1, PageDown/PageUp step by 20. Each step triggers a re-fetch with between=price,<min>,<max>.
- Sorting is server-side via the sort select ([data-test="sort"]) with option values: name,asc / name,desc / price,desc / price,asc (plus CO2 rating options, out of scope). Verified live: Name (A - Z) page 1 started "Adjustable Wrench", "Angled Spanner", "Belt Sander"; Price (Low - High) page 1 prices ascended $3.55 → $9.17; Price (High - Low) descended $89.55 → $46.50.
- Searching 'Pliers' rendered a caption h3 [data-test="search-caption"] reading "Searched for: Pliers" and 4 matching cards (Combination Pliers, Pliers, Long Nose Pliers, Slip Joint Pliers), with pagination hidden. Searching a nonsense term rendered [data-test="no-results"] = "There are no products found." and [data-test="search-result-count"] = "0 products found for '<term>'".
- QUIRK (stale sort after reset): clicking the search reset button ([data-test="search-reset"], labeled X) clears the input and restores the default-order grid, but the sort dropdown keeps its previously selected value (e.g. still shows "Price (Low - High)") while the grid is no longer sorted — the UI state is stale. Tests should not assume the sort survives a reset.
- Checking the "Hammer" category checkbox filtered the grid to 7 products, every name matching /hammer/i, with pagination hidden; the filter request resets to the first page (API called with page=0). Checking "Sander" in addition produced the union (9 products, all matching /hammer|sander/i). Unchecking both restored the paginated 9-card grid.
- Product detail page: h1 [data-test="product-name"]; price rendered as e.g. "$14.15" where span [data-test="unit-price"] contains only "14.15" (the "$" sign sits outside the span); category and brand badges have aria-label="category" / aria-label="brand" (verified: "Pliers" / "ForgeFlex Tools"); non-empty [data-test="product-description"]; quantity spinner ([data-test="quantity"], default "1") with increase/decrease buttons; Add to cart, Add to favourites, Compare buttons; a Specifications table ([data-test="product-specs"]); and a "Related products" section. The browser tab title becomes "<Product Name> - Practice Software Testing - Toolshop - v5.0".
- Quantity clamps at 1: clicking decrease at quantity 1 has no effect (the button stays enabled but the value does not go below 1).
- Cart badge: the cart icon [data-test="nav-cart"] (links to /checkout) is NOT rendered while the cart is empty; it appears after the first add-to-cart with badge [data-test="cart-quantity"] showing the total number of units (adding quantity 2 shows "2", not "1"). Each add shows a toast "Product added to shopping cart." that auto-dismisses after a few seconds. The cart persists across navigation and even across login.
- Out-of-stock handling: the "Long Nose Pliers" product (seeded as out of stock, $14.24, page 1 of the default grid) shows an "Out of stock" badge ([data-test="out-of-stock"]) on its card, and on its detail page the add-to-cart button, quantity input, and increase/decrease buttons are all disabled.
- Login: /auth/login shows a "Login" heading, [data-test="login-form"] with email/password fields and a submit button, plus "Register your account" and "Forgot your Password?" links. Logging in with customer@practicesoftwaretesting.com / welcome01 redirects to /account with tab title "Overview - Practice Software Testing - Toolshop - v5.0", page title [data-test="page-title"] = "My account", and the nav "Sign in" link replaced by a "Jane Doe" menu ([data-test="nav-menu"]). A wrong password yields the alert [data-test="login-error"] with exact text "Invalid email or password". Submitting the empty form yields [data-test="email-error"] = "Email is required" and [data-test="password-error"] = "Password is required".
- Expected console noise: guest page loads log 401 errors from GET /users/me (the app probing auth state); this is not a defect.

The Playwright project to use for automation is "toolshop-chromium" (baseURL https://practicesoftwaretesting.com, testDir ./tests/toolshop), and all tests should be based on the seed file tests/toolshop/seed.spec.ts, which navigates to '/'. Generated test files live under tests/toolshop/generated/.

## Test Scenarios

### 1. Product Catalog (Home Page)

**Seed:** `tests/toolshop/seed.spec.ts`

#### 1.1. Default product grid display and pagination

**File:** `tests/toolshop/generated/product-grid-and-pagination.spec.ts`

**Steps:**
  1. Start from the seed file state: navigate to the base URL '/' and wait for the product grid to finish loading (product cards visible).
    - expect: The page title is 'Practice Software Testing - Toolshop - v5.0'.
    - expect: The product grid displays exactly 9 product cards (anchor elements a.card, each with data-test starting with 'product-').
    - expect: Every card shows a product image, a non-empty name (h5 [data-test="product-name"]), and a price ([data-test="product-price"]) matching the pattern /^\$\d+\.\d{2}$/.
    - expect: The left sidebar shows a 'Sort' dropdown ([data-test="sort"]), a 'Price Range' slider with handles at 1 and 100 on a 0–200 scale, a 'Search' box with an 'X' reset button and a 'Search' button, and 'By category:' / 'By brand:' filter checkbox groups, all unchecked.
  2. Inspect the pagination control below the grid.
    - expect: A pagination bar is visible with a Previous button ('«', [data-test="pagination-prev"]), numbered page buttons, and a Next button ('»', [data-test="pagination-next"]).
    - expect: Page 1 is the active page (its li has the 'active' class) and the Previous button's li has the 'disabled' class.
    - expect: At least 5 numbered page buttons are shown. Do NOT assert an exact page count: due to a race between the initial unfiltered request (50 products / 6 pages) and the default price-filtered request (between=price,1,100 → 45 products / 5 pages), the pager can show 5 or 6 pages.
  3. Record the name of the first product card, then click the Next ('»') button ([data-test="pagination-next"]) and wait for the grid to re-render.
    - expect: Page 2 becomes the active page in the pagination bar.
    - expect: The grid re-renders with 9 product cards whose names differ from page 1 (verified live: page 2 started with 'Sledgehammer', 'Claw Hammer with Fiberglass Handle', 'Court Hammer').
    - expect: The Previous button is no longer disabled.
  4. Click the Previous ('«') button ([data-test="pagination-prev"]) and wait for the grid to re-render.
    - expect: Page 1 becomes the active page again.
    - expect: The first product card shows the same name recorded in the previous step (the original page-1 set is restored; verified live: 'Combination Pliers').

#### 1.2. Sort products by name and by price

**File:** `tests/toolshop/generated/product-sorting.spec.ts`

**Steps:**
  1. Start from the seed file state on '/' with the product grid loaded.
    - expect: The sort dropdown ([data-test="sort"]) is visible with an empty default selection and the options 'Name (A - Z)', 'Name (Z - A)', 'Price (High - Low)', 'Price (Low - High)' (values 'name,asc', 'name,desc', 'price,desc', 'price,asc').
  2. Select 'Name (A - Z)' (value 'name,asc') in the sort dropdown and wait for the grid to re-render.
    - expect: 9 product cards are displayed and their names are in ascending alphabetical order (compare the collected [data-test="product-name"] texts to a locale-insensitively sorted copy of themselves).
    - expect: Verified live: page 1 began 'Adjustable Wrench', 'Angled Spanner', 'Belt Sander' — but do not pin exact names, as catalog data may change.
  3. Select 'Name (Z - A)' (value 'name,desc') and wait for the grid to re-render.
    - expect: The 9 displayed product names are in descending alphabetical order (verified live: began 'Wood Saw', 'Wood Carving Chisels', 'Washers').
  4. Select 'Price (Low - High)' (value 'price,asc') and wait for the grid to re-render.
    - expect: The 9 displayed prices, parsed as numbers from [data-test="product-price"], are in non-decreasing order (verified live: $3.55, $3.95, $4.65, $4.92, $5.55, $6.25, $7.23, $7.99, $9.17).
    - expect: Every price is at least $1.00 (the default slider minimum).
  5. Select 'Price (High - Low)' (value 'price,desc') and wait for the grid to re-render.
    - expect: The 9 displayed prices are in non-increasing order (verified live: $89.55 down to $46.50).
    - expect: Every price is at most $100.00 — the default price range filter (between=price,1,100) caps results, so products priced above $100 do not appear.

#### 1.3. Search for products and reset the search

**File:** `tests/toolshop/generated/product-search.spec.ts`

**Steps:**
  1. Start from the seed file state on '/' with the product grid loaded.
    - expect: The Search input ([data-test="search-query"]) is empty and no search caption is shown.
  2. Fill the Search input with 'Pliers' and click the Search button ([data-test="search-submit"]).
    - expect: A caption heading ([data-test="search-caption"]) appears reading 'Searched for: Pliers' (the term itself is in [data-test="search-term"]).
    - expect: Only matching products are displayed: every visible [data-test="product-name"] contains the substring 'Pliers' (verified live: 4 results — Combination Pliers, Pliers, Long Nose Pliers, Slip Joint Pliers; assert on the substring match rather than the exact count of 4, which may drift with catalog data).
    - expect: The pagination bar is hidden because the results fit on a single page.
  3. Click the search reset button ([data-test="search-reset"], labeled 'X').
    - expect: The Search input is cleared (empty value).
    - expect: The 'Searched for:' caption disappears.
    - expect: The full default grid is restored: 9 product cards on page 1 and the pagination bar is visible again.

#### 1.4. Search with no matching results

**File:** `tests/toolshop/generated/product-search-no-results.spec.ts`

**Steps:**
  1. Start from the seed file state on '/' with the product grid loaded.
    - expect: 9 product cards are displayed.
  2. Fill the Search input ([data-test="search-query"]) with 'nonexistentproduct123' and click the Search button ([data-test="search-submit"]).
    - expect: No product cards are displayed (zero [data-test="product-name"] elements).
    - expect: A message ([data-test="no-results"]) is displayed with the exact text 'There are no products found.'.
    - expect: A result count ([data-test="search-result-count"]) is displayed with the exact text "0 products found for 'nonexistentproduct123'".
    - expect: The search caption ([data-test="search-caption"]) reads 'Searched for: nonexistentproduct123'.

#### 1.5. Filter products by category checkboxes

**File:** `tests/toolshop/generated/category-filter.spec.ts`

**Steps:**
  1. Start from the seed file state on '/' with the product grid loaded.
    - expect: The 'By category:' filter group shows parent categories (Hand Tools, Power Tools, Other) with child checkboxes (e.g. Hammer, Hand Saw, Wrench, Screwdriver, Pliers, Chisels, Measures under Hand Tools), all unchecked.
  2. Check the 'Hammer' category checkbox. IMPORTANT: locate it by its accessible label (e.g. getByLabel('Hammer', { exact: true })), NOT by its data-test attribute — the attribute is 'category-<ULID>' and the ULID changes every time the demo database reseeds.
    - expect: The grid re-renders showing only hammer products: every [data-test="product-name"] matches /hammer/i (verified live: 7 products — Claw Hammer with Shock Reduction Grip, Hammer, Claw Hammer, Thor Hammer, Sledgehammer, Claw Hammer with Fiberglass Handle, Court Hammer; assert the name pattern, not the exact count).
    - expect: The pagination bar is hidden (results fit on one page).
    - expect: The filter resets the result list to the first page (the API is called with page=0 and by_category=<id>).
  3. Additionally check the 'Sander' category checkbox (again located by label).
    - expect: The grid shows the union of both categories: every [data-test="product-name"] matches /hammer|sander/i (verified live: 9 products — the 7 hammers plus Sheet Sander and Belt Sander).
    - expect: The 'Hammer' checkbox remains checked (filters are additive).
  4. Uncheck both the 'Hammer' and 'Sander' checkboxes.
    - expect: The full default grid is restored: 9 product cards on page 1 with the pagination bar visible.

#### 1.6. Filter products with the price range slider

**File:** `tests/toolshop/generated/price-range-slider.spec.ts`

**Steps:**
  1. Start from the seed file state on '/' with the product grid loaded, and inspect the Price Range slider handles (span.ngx-slider-pointer-min and span.ngx-slider-pointer-max).
    - expect: The min handle has aria-valuenow='1' and the max handle has aria-valuenow='100'.
    - expect: Both handles have aria-valuemin='0' and aria-valuemax='200' (the slider scale runs 0–200).
  2. Focus the max handle programmatically (e.g. locator('span.ngx-slider-pointer-max').evaluate(el => el.focus())) — do NOT click it, as clicking the slider can jump the handle to the click position — then press PageDown once.
    - expect: The max handle's aria-valuenow decreases by 20, from 100 to 80 (keyboard steps: PageDown/PageUp = 20, ArrowLeft/ArrowRight = 1).
  3. With the max handle still focused, press PageDown three more times (80 → 20) and then ArrowRight/ArrowLeft as needed to land exactly on 15 (e.g. from 20 press ArrowLeft five times), then wait for the grid to settle.
    - expect: The max handle's aria-valuenow is '15' and the slider's max value label shows '15'.
    - expect: The grid re-fetches with the new range (final API request uses between=price,1,15; each keyboard step triggers its own request, so wait for the grid to be stable before asserting).
  4. Collect all displayed prices from [data-test="product-price"] and parse them as numbers.
    - expect: Every displayed price is less than or equal to 15.00 and greater than or equal to 1.00 (verified live: page 1 showed $14.15, $12.01, $14.24, $9.17, $13.41, $12.58, $11.48, $11.14, $12.18).
    - expect: The grid still shows product cards (the 1–15 range is non-empty in the seeded catalog).

### 2. Product Detail Page

**Seed:** `tests/toolshop/seed.spec.ts`

#### 2.1. Open a product from the grid and verify its details

**File:** `tests/toolshop/generated/product-detail.spec.ts`

**Steps:**
  1. Start from the seed file state on '/' with the product grid loaded. Record the name ([data-test="product-name"]) and price ([data-test="product-price"]) of the first product card (verified live: 'Combination Pliers', '$14.15' — but read them dynamically rather than hard-coding).
    - expect: The first card shows a non-empty name and a price matching /^\$\d+\.\d{2}$/.
  2. Click the first product card (a.card).
    - expect: The browser navigates to a URL matching /product/<id> (the id is a ULID that changes when the database reseeds — match the pattern, not a fixed id).
    - expect: The browser tab title becomes '<recorded product name> - Practice Software Testing - Toolshop - v5.0'.
  3. Verify the detail page content against the values recorded from the grid card.
    - expect: The h1 [data-test="product-name"] equals the recorded card name.
    - expect: The [data-test="unit-price"] span equals the recorded card price WITHOUT the '$' sign (e.g. card '$14.15' → unit-price text '14.15'; the '$' is rendered outside the span).
    - expect: A category badge ([aria-label="category"]) and a brand badge ([aria-label="brand"]) are visible with non-empty text (verified live: 'Pliers' and 'ForgeFlex Tools').
    - expect: The description paragraph ([data-test="product-description"]) is visible and non-empty.
    - expect: The quantity input ([data-test="quantity"]) shows '1', flanked by decrease ([data-test="decrease-quantity"]) and increase ([data-test="increase-quantity"]) buttons.
    - expect: 'Add to cart' ([data-test="add-to-cart"]), 'Add to favourites' ([data-test="add-to-favorites"]), and 'Compare' ([data-test="add-to-compare"]) buttons are visible and enabled.
    - expect: A 'Specifications' table ([data-test="product-specs"]) with spec rows and a 'Related products' section are displayed.

#### 2.2. Increase and decrease the quantity with lower-bound clamping

**File:** `tests/toolshop/generated/product-quantity.spec.ts`

**Steps:**
  1. Start from the seed file state on '/', then open the first product from the grid.
    - expect: The quantity input ([data-test="quantity"]) shows the default value '1'.
  2. Click the increase button ([data-test="increase-quantity"]) twice.
    - expect: The quantity input value is '3' (each click increments by 1).
  3. Click the decrease button ([data-test="decrease-quantity"]) once.
    - expect: The quantity input value is '2'.
  4. Click the decrease button two more times (attempting to go below 1).
    - expect: The quantity input value is '1' — the value clamps at 1 and never goes to 0 or negative.
    - expect: EDGE CASE (documented behavior): the decrease button remains enabled at quantity 1; clicking it simply has no effect rather than disabling.

#### 2.3. Add a product to the cart and verify the cart badge updates

**File:** `tests/toolshop/generated/product-add-to-cart.spec.ts`

**Steps:**
  1. Start from the seed file state on '/' (fresh browser context, empty cart), then open the first product from the grid (verified live to be in stock: 'Combination Pliers').
    - expect: No cart icon is present in the navigation bar: [data-test="nav-cart"] does not exist while the cart is empty (it is not merely hidden — the element is absent).
  2. Click the increase button once to set the quantity to '2', then click 'Add to cart' ([data-test="add-to-cart"]).
    - expect: A toast notification appears with the exact text 'Product added to shopping cart.' (it auto-dismisses after a few seconds, so assert it promptly after the click).
    - expect: The cart icon ([data-test="nav-cart"], an anchor linking to /checkout) appears in the navigation bar.
    - expect: The cart badge ([data-test="cart-quantity"]) shows '2' — the badge counts total units, not distinct products.
  3. Click 'Add to cart' again (the quantity input still shows '2').
    - expect: The cart badge ([data-test="cart-quantity"]) updates to '4' (2 + 2 units of the same product).
    - expect: The toast 'Product added to shopping cart.' appears again.
  4. Navigate back to the home page '/' via the 'Home' nav link ([data-test="nav-home"]).
    - expect: The cart badge persists and still shows '4' (the cart is stored client-side and survives navigation).

#### 2.4. Out-of-stock product cannot be added to the cart

**File:** `tests/toolshop/generated/product-out-of-stock.spec.ts`

**Steps:**
  1. Start from the seed file state on '/' with the product grid loaded, and locate a product card displaying the 'Out of stock' badge ([data-test="out-of-stock"]). Verified live: 'Long Nose Pliers' ($14.24) on page 1 of the default grid is seeded as out of stock; to stay robust against reseeds, find the badge structurally (first card containing [data-test="out-of-stock"]) rather than by product name, and search additional pages if none is on page 1.
    - expect: At least one product card shows the badge with the exact text 'Out of stock' alongside its price.
  2. Click the out-of-stock product card to open its detail page.
    - expect: The detail page shows the same product name and an 'Out of stock' label ([data-test="out-of-stock"]).
    - expect: The 'Add to cart' button ([data-test="add-to-cart"]) is disabled.
    - expect: The quantity input ([data-test="quantity"]) and both the increase ([data-test="increase-quantity"]) and decrease ([data-test="decrease-quantity"]) buttons are disabled.
    - expect: No cart icon appears in the navigation (the cart remains empty).

### 3. Customer Login

**Seed:** `tests/toolshop/seed.spec.ts`

#### 3.1. Successful login with the demo customer account

**File:** `tests/toolshop/generated/login-success.spec.ts`

**Steps:**
  1. Start from the seed file state on '/', then click the 'Sign in' link in the navigation bar ([data-test="nav-sign-in"]).
    - expect: The browser navigates to '/auth/login' and the tab title becomes 'Login - Practice Software Testing - Toolshop - v5.0'.
    - expect: A 'Login' heading is displayed above a form ([data-test="login-form"]) with an 'Email address *' field ([data-test="email"]), a 'Password *' field ([data-test="password"], type=password), and a login submit button ([data-test="login-submit"]).
    - expect: A 'Register your account' link ([data-test="register-link"]) and a 'Forgot your Password?' link ([data-test="forgot-password-link"]) are visible below the form.
  2. Fill the email field with 'customer@practicesoftwaretesting.com' and the password field with 'welcome01', then click the login submit button.
    - expect: The browser navigates to '/account' and the tab title becomes 'Overview - Practice Software Testing - Toolshop - v5.0'.
    - expect: The page title ([data-test="page-title"]) reads 'My account'.
    - expect: The navigation bar no longer shows 'Sign in'; instead a user menu ([data-test="nav-menu"]) shows the customer's name 'Jane Doe'.
    - expect: The account page shows navigation tiles for Favorites ([data-test="nav-favorites"]), Profile ([data-test="nav-profile"]), Invoices ([data-test="nav-invoices"]), and Messages ([data-test="nav-messages"]). (These pages themselves are out of scope — only verify the tiles are present.)

#### 3.2. Failed login with wrong password

**File:** `tests/toolshop/generated/login-wrong-password.spec.ts`

**Steps:**
  1. Start from the seed file state on '/', then navigate to '/auth/login' (directly or via the 'Sign in' nav link).
    - expect: The login form is visible with both fields empty.
  2. Fill the email field ([data-test="email"]) with the valid account email 'customer@practicesoftwaretesting.com' and the password field ([data-test="password"]) with an incorrect password, e.g. 'wrongpassword', then click the login submit button ([data-test="login-submit"]).
    - expect: The page remains on '/auth/login'; no navigation to '/account' occurs.
    - expect: An error alert ([data-test="login-error"]) is displayed with the exact text 'Invalid email or password'.
    - expect: The navigation bar still shows the 'Sign in' link and no user menu ([data-test="nav-menu"]) appears.

#### 3.3. Login form validation with empty fields

**File:** `tests/toolshop/generated/login-empty-fields.spec.ts`

**Steps:**
  1. Start from the seed file state on '/', then navigate to '/auth/login'.
    - expect: The login form is visible with both fields empty.
  2. Click the login submit button ([data-test="login-submit"]) without entering any credentials.
    - expect: The page remains on '/auth/login'.
    - expect: A field-level error ([data-test="email-error"]) is displayed with the exact text 'Email is required'.
    - expect: A field-level error ([data-test="password-error"]) is displayed with the exact text 'Password is required'.
    - expect: No server-side error alert ([data-test="login-error"]) is shown — validation is client-side.
