from playwright.sync_api import Page, expect, sync_playwright
import time

def test_input_behavior(page: Page):
    # 1. Go to blog page
    page.goto("http://localhost:3000/blog")

    # 2. Find the Email input
    # It might be in the footer or newsletter section
    # Placeholder is "Email"
    input_locator = page.get_by_placeholder("Email")

    # Scroll to it
    input_locator.scroll_into_view_if_needed()

    # 3. Type text
    input_locator.fill("test@example.com")

    # 4. Assert value
    expect(input_locator).to_have_value("test@example.com")

    # Take screenshot filled
    page.screenshot(path="verification/input_filled.png")

    # 5. Clear text
    input_locator.fill("")

    # 6. Assert empty
    expect(input_locator).to_have_value("")

    # Take screenshot empty
    page.screenshot(path="verification/input_empty.png")

    print("Verification successful!")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_input_behavior(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
