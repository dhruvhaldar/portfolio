
import os
from playwright.sync_api import sync_playwright

def verify_projects_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to home page
            print("Navigating to home page...")
            page.goto("http://localhost:3000", timeout=60000)

            # Wait for content to load
            print("Waiting for content...")
            page.wait_for_selector("h1", timeout=30000)

            # Check for project cards
            project_cards = page.locator('a[href^="work/"]')
            count = project_cards.count()
            print(f"Found {count} project cards")

            # Screenshot the projects section
            # Scroll to projects
            projects_section = page.get_by_text("Selected Projects").first
            if projects_section.is_visible():
                projects_section.scroll_into_view_if_needed()

            page.screenshot(path="verification/home_projects.png", full_page=True)
            print("Screenshot saved to verification/home_projects.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_projects_page()
