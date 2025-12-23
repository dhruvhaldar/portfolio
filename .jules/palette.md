## 2025-02-23 - Icon-only Buttons and Empty Labels
**Learning:** Some components (like `ToggleButton`) rely on a `label` prop for both visual text and accessibility. When the design calls for an icon-only button by setting the label to an empty string, the button becomes inaccessible.
**Action:** Always check if a `label` prop is empty. If so, manually add `aria-label` with a descriptive string to ensure screen readers can announce the button's purpose.
