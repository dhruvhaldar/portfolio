## 2024-03-24 - Accessible Labels for Icon-Only Buttons

**Learning:**
Discovered that responsive designs often toggle between text-labeled buttons for desktop and icon-only buttons for mobile. While the desktop versions are accessible by default (due to visible text), the mobile versions often strip the text label without adding an `aria-label` or `title` substitute. This leaves screen reader users on mobile devices navigating a list of "unlabeled buttons," significantly degrading the experience.

**Action:**
When hiding text labels for responsiveness (e.g., using `display: none` or conditional rendering), always ensure the icon-only alternative includes a descriptive `aria-label` mirroring the hidden text content.

## 2025-02-23 - PasswordInput Accessibility

**Learning:** `IconButton` components use `tooltip` as a fallback for `aria-label`. Relying on icon names like "eye" or "eyeOff" (the default if `tooltip` is missing) provides a confusing experience for screen reader users.
**Action:** Always provide explicit `tooltip` or `aria-label` for interactive state toggles like password visibility to ensure the announcement conveys intent ("Show password") rather than visual description.
