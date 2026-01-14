## 2024-03-24 - Accessible Labels for Icon-Only Buttons

**Learning:**
Discovered that responsive designs often toggle between text-labeled buttons for desktop and icon-only buttons for mobile. While the desktop versions are accessible by default (due to visible text), the mobile versions often strip the text label without adding an `aria-label` or `title` substitute. This leaves screen reader users on mobile devices navigating a list of "unlabeled buttons," significantly degrading the experience.

**Action:**
When hiding text labels for responsiveness (e.g., using `display: none` or conditional rendering), always ensure the icon-only alternative includes a descriptive `aria-label` mirroring the hidden text content.

## 2025-02-23 - PasswordInput Accessibility

**Learning:** `IconButton` components use `tooltip` as a fallback for `aria-label`. Relying on icon names like "eye" or "eyeOff" (the default if `tooltip` is missing) provides a confusing experience for screen reader users.
**Action:** Always provide explicit `tooltip` or `aria-label` for interactive state toggles like password visibility to ensure the announcement conveys intent ("Show password") rather than visual description.

## 2025-05-21 - Consistent Form Accessibility

**Learning:** Discovered that while `Input` components correctly linked helper text via `aria-describedby`, `Textarea` components only visually displayed the text without the programmatic association. Inconsistent accessibility patterns within the same form system can confuse screen reader users who expect similar behaviors from similar controls.
**Action:** When creating or maintaining form components, audit all input types (`Input`, `Textarea`, `Select`) together to ensure feature parity for accessibility attributes like `aria-describedby`, `aria-invalid`, and `aria-required`.

## 2025-05-22 - Focus Rings on Flexible Containers

**Learning:** Found that making a parent `Flex` container interactive (to increase the hit area) without constraining its width can cause the focus ring to stretch unexpectedly in column layouts, confusing the user about which element is focused.
**Action:** When delegating interaction to a container wrapper, explicitly set `fit` or `width: fit-content` on the container unless a full-width clickable area is intentionally designed.

## 2025-10-26 - Button Loading State Accessibility

**Learning:** The `Button` component visually indicated loading with a spinner but remained interactive, allowing for accidental double-submissions. Additionally, the lack of `aria-busy` meant screen readers weren't informed of the processing state.
**Action:** Always couple visual loading states with functional disabling (`disabled` attribute) and semantic state indicators (`aria-busy="true"`) to prevent errors and communicate status effectively.

## 2025-10-27 - Clickable Divs without Keyboard Support

**Learning:** Identified a `Carousel` component where the main image acted as a "Next Slide" button via `onClick`, but lacked `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers. This made the primary navigation method inaccessible to keyboard users, forcing them to rely on small indicator dots.
**Action:** When adding `onClick` to non-interactive elements (div, span, image), always ensure they are accompanied by:
1. `role="button"` (or appropriate role)
2. `tabIndex={0}` (to make focusable)
3. `onKeyDown` handler (listening for Enter/Space)
4. A descriptive `aria-label` if the element lacks visible text.
