## 2025-02-18 - Accessible Character Counts
**Learning:** Visual-only character counts (e.g., "50 / 100") are confusing for screen reader users as they lack context.
**Action:** Use `sr-only` text to provide a full description (e.g., "50 characters entered out of 100 maximum") while hiding the concise visual text from assistive technology using `aria-hidden="true"`.

## 2025-02-18 - Lazyframe Accessibility
**Learning:** Third-party libraries like `lazyframe` often rely on native DOM click events to initialize. React's state handlers (e.g., `handlePlay`) bypass this.
**Action:** In `onKeyDown` handlers for such elements, use `ref.current.click()` instead of calling the state setter directly to ensure the library's event listeners are triggered.
