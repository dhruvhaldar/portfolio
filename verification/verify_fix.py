from playwright.sync_api import sync_playwright

def verify_fix():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the About page
        page.goto("http://localhost:3000/about")

        # Find the "Schedule a call" link
        schedule_link = page.locator("a", has_text="Schedule a call")

        # Scroll it into view
        schedule_link.scroll_into_view_if_needed()

        # Take a screenshot of the button/link
        page.screenshot(path="verification/schedule_call_button.png", clip={
            "x": 0,
            "y": 0,
            "width": 1000,
            "height": 1000
        }, full_page=True)

        # Locate the decorative icon container (the Flex that replaced IconButton)
        # We can find it by looking inside the schedule link for the div with specific class or style,
        # or just visually verify the screenshot.
        # But to be programmatic:
        # The replacement is a Flex with Icon inside. Flex renders a div.
        # We expect NO <button> inside this <a>.

        buttons_inside_link = schedule_link.locator("button").count()
        print(f"Buttons inside link: {buttons_inside_link}")

        if buttons_inside_link == 0:
            print("SUCCESS: No button found inside the link.")
        else:
            print("FAILURE: Button found inside the link!")

        # Take a focused screenshot of the element
        schedule_link.screenshot(path="verification/schedule_call_focused.png")

        browser.close()

if __name__ == "__main__":
    verify_fix()
