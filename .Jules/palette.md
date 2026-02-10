## 2025-02-18 - Accessible Character Counts
**Learning:** Visual-only character counts (e.g., "50 / 100") are confusing for screen reader users as they lack context.
**Action:** Use `sr-only` text to provide a full description (e.g., "50 characters entered out of 100 maximum") while hiding the concise visual text from assistive technology using `aria-hidden="true"`.

## 2025-02-18 - Lazyframe Accessibility
**Learning:** Third-party libraries like `lazyframe` often rely on native DOM click events to initialize. React's state handlers (e.g., `handlePlay`) bypass this.
**Action:** In `onKeyDown` handlers for such elements, use `ref.current.click()` instead of calling the state setter directly to ensure the library's event listeners are triggered.

## 2025-02-23 - Dynamic Content Focus Management
**Learning:** When a user interaction replaces a DOM element (e.g., clicking a video placeholder injects an iframe), the focus context is lost, forcing keyboard users to navigate again.
**Action:** Explicitly move focus to the newly injected element (e.g., `iframe.focus()`) within the library's completion callback (e.g., `onAppend`) to maintain the interaction flow.

## 2025-05-23 - [Toast Dismissal on Escape]
**Learning:** Transient UI elements like Toasts often trap keyboard focus or require excessive tabbing to dismiss. Adding `Escape` key support provides a native-feeling, quick dismissal method for keyboard users.
**Action:** When building overlay or transient components, always consider adding a global or local `Escape` key listener to allow easy exit.
