---
layout: post
title: Converting Selenium Tests to Playwright
categories: [Testing]
tags: [Selenium, Playwright, Test Automation]
---

## Why move away from Selenium?

Selenium has been the default choice for browser automation for over a decade. It works. Teams have built massive test suites on it. But if you have been maintaining a Selenium test suite for any length of time, you already know the pain points.

Flaky tests are the big one. Selenium interacts with browsers through the WebDriver protocol, which means every command is a separate HTTP request to a browser driver process. This architecture introduces latency and race conditions. You end up littering your code with explicit waits, retry loops, and sleep statements. Tests that pass locally fail in CI. Tests that pass in CI fail when you add a new one to the suite. The phrase "just re-run it" becomes part of your team's vocabulary, and that is a problem.

Playwright was built at Microsoft by engineers who previously worked on Google's Puppeteer project. It was designed from the ground up to solve the reliability and developer experience problems that Selenium never fully addressed. It communicates with browsers over a persistent WebSocket connection using the Chrome DevTools Protocol (for Chromium) and equivalent internal protocols for Firefox and WebKit. This means commands are faster, state is more consistent, and the framework has much deeper visibility into what the browser is actually doing.

Here is what you get by switching:

- **Auto-waiting built in.** Playwright automatically waits for elements to be actionable before interacting with them. No more `WebDriverWait` with `expected_conditions`. No more `time.sleep(2)` scattered through your tests.
- **Better isolation.** Each test can run in its own browser context, which is lighter than a full browser instance. Contexts share a browser process but have completely separate cookies, storage, and cache. This means true parallel execution without interference.
- **Network interception.** Playwright lets you intercept, modify, and mock network requests natively. In Selenium, you need a proxy like BrowserMob or a separate tool entirely.
- **Tracing and debugging.** Playwright's trace viewer gives you a step-by-step replay of your test with screenshots, DOM snapshots, network logs, and console output. Debugging a failed test in CI goes from guesswork to straightforward analysis.
- **Multi-browser from one API.** Chromium, Firefox, and WebKit are all first-class citizens with the same API surface. No driver management, no compatibility surprises.

## The mental model shift

The biggest adjustment is not syntax. It is how you think about waiting and element interaction.

In Selenium, the default mental model is imperative: find an element, then act on it, and hope it is ready. You learn to distrust the framework and add defensive code everywhere.

```python
# Selenium: defensive by necessity
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

wait = WebDriverWait(driver, 10)
element = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "#submit-btn")))
element.click()
```

In Playwright, the mental model is declarative: tell the framework what you want to do, and it figures out when the element is ready.

```python
# Playwright: auto-waits for the element to be clickable
page.locator("#submit-btn").click()
```

That single line handles visibility checks, enabled state, stable position, and receiving pointer events. If the element is not ready within the timeout, you get a clear error message telling you exactly why.

## Mapping Selenium patterns to Playwright

Here is a practical reference for the most common patterns you will encounter during conversion.

#### Browser and driver setup

```python
# Selenium
from selenium import webdriver
driver = webdriver.Chrome()
driver.get("https://example.com")
# ... tests ...
driver.quit()

# Playwright
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://example.com")
    # ... tests ...
    browser.close()
```

With Playwright, there is no driver binary to manage. `playwright install` downloads the browsers once and you are done.

#### Finding elements

Selenium uses `find_element` with a `By` strategy. Playwright uses locators, which are lazy and auto-waiting.

```python
# Selenium
driver.find_element(By.ID, "username")
driver.find_element(By.CSS_SELECTOR, ".login-form input[type='email']")
driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")

# Playwright
page.locator("#username")
page.locator(".login-form input[type='email']")
page.get_by_role("button", name="Submit")
```

Playwright's `get_by_role`, `get_by_text`, `get_by_label`, and `get_by_placeholder` methods encourage writing locators that mirror how users actually find elements on a page. This makes tests more resilient to DOM structure changes.

#### Filling forms

```python
# Selenium
driver.find_element(By.ID, "email").clear()
driver.find_element(By.ID, "email").send_keys("user@example.com")

# Playwright
page.locator("#email").fill("user@example.com")
```

`fill` clears the field first automatically.

#### Dropdowns

```python
# Selenium
from selenium.webdriver.support.ui import Select
select = Select(driver.find_element(By.ID, "country"))
select.select_by_visible_text("Canada")

# Playwright
page.locator("#country").select_option(label="Canada")
```

#### Waiting for conditions

```python
# Selenium
WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.CSS_SELECTOR, ".results"))
)

# Playwright
page.locator(".results").wait_for(state="visible")
# Or often you don't need this at all, since actions auto-wait
```

#### Assertions

If you are using pytest with Selenium, your assertions probably look like raw `assert` statements that check element properties manually. Playwright provides built-in assertions that auto-retry.

```python
# Selenium
assert driver.find_element(By.ID, "status").text == "Complete"

# Playwright
from playwright.sync_api import expect
expect(page.locator("#status")).to_have_text("Complete")
```

The Playwright assertion will retry for up to 5 seconds (configurable) before failing. This eliminates an entire class of timing-related flaky tests.

#### Handling iframes

```python
# Selenium
driver.switch_to.frame("iframe-name")
driver.find_element(By.ID, "inner-element").click()
driver.switch_to.default_content()

# Playwright
page.frame_locator("#iframe-name").locator("#inner-element").click()
# No need to switch back, the main page locators still work
```

#### File uploads

```python
# Selenium
driver.find_element(By.CSS_SELECTOR, "input[type='file']").send_keys("/path/to/file.pdf")

# Playwright
page.locator("input[type='file']").set_input_files("/path/to/file.pdf")
```

#### Screenshots

```python
# Selenium
driver.save_screenshot("screenshot.png")

# Playwright
page.screenshot(path="screenshot.png")
# Or capture just one element
page.locator(".chart").screenshot(path="chart.png")
```

Selenium 4 added element-level screenshots, but Playwright's version is more consistent across browsers and integrates with its tracing infrastructure.

## Conversion strategy

Do not try to convert everything at once. Here is an approach that works.

**1. Start with your most flaky tests.** These are the ones that will benefit the most from Playwright's auto-waiting. They are also the tests your team trusts the least, so improving them first builds confidence in the migration.

**2. Run both frameworks in parallel.** Keep your existing Selenium suite running in CI while you convert tests one by one or one module at a time. Do not delete the old tests until the new ones have proven stable over several CI runs.

**3. Convert page objects, not just tests.** If you are using the Page Object pattern (and you should be), convert the page objects first. The test logic on top often translates almost directly once the underlying interactions are updated.

```python
# Before: Selenium page object
class LoginPage:
    def __init__(self, driver):
        self.driver = driver

    def login(self, username, password):
        self.driver.find_element(By.ID, "username").send_keys(username)
        self.driver.find_element(By.ID, "password").send_keys(password)
        self.driver.find_element(By.ID, "login-btn").click()
        WebDriverWait(self.driver, 10).until(
            EC.url_contains("/dashboard")
        )

# After: Playwright page object
class LoginPage:
    def __init__(self, page):
        self.page = page

    def login(self, username, password):
        self.page.locator("#username").fill(username)
        self.page.locator("#password").fill(password)
        self.page.locator("#login-btn").click()
        self.page.wait_for_url("**/dashboard")
```

**4. Use Playwright's codegen for complex flows.** If you have a test that exercises a complicated UI workflow and you are unsure about the right locators, run `playwright codegen` to record the interaction. It generates usable code that you can clean up and incorporate.

**5. Update your CI configuration.** Playwright needs browsers installed. Add `playwright install --with-deps` to your CI setup step. The `--with-deps` flag handles system-level dependencies on Linux.

## What to watch out for

**Custom waits with business logic.** If your Selenium tests have custom wait conditions that check application-specific state (like polling an API until a background job completes), those will not automatically translate. You will need to reimplement them using Playwright's `page.wait_for_function` or custom polling logic.

**Browser-specific behavior.** If your Selenium tests only ran on Chrome via ChromeDriver, running Playwright across Chromium, Firefox, and WebKit might surface cross-browser issues that were always there but never tested. This is a feature, not a bug, but it means your first CI run might have unexpected failures.

**Third-party Selenium plugins.** If you depend on Selenium Grid for distributed execution, Playwright has its own parallelism model built into the test runner. If you use Selenium with Appium for mobile testing, that is a separate consideration. Playwright's mobile support is limited to emulation, not real device testing.

**Authentication state.** A common Selenium pattern is logging in once and reusing the browser session. Playwright has a cleaner version of this: you can save and reuse authentication state across tests using `storage_state`.

```python
# Save auth state after login
context.storage_state(path="auth.json")

# Reuse in another test
context = browser.new_context(storage_state="auth.json")
```

## Is it worth it?

If your team spends meaningful time debugging flaky tests, re-running failed CI pipelines, or working around Selenium's limitations, yes. The migration is not trivial for a large test suite, but the payoff is a test suite that is faster, more reliable, and significantly easier to debug when something does fail.

The best part: you do not have to commit fully up front. Start with a handful of tests, measure the difference, and let the results make the case for continuing.
