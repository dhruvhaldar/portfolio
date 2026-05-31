## 2024-05-24 - Async Button Loading State
**Learning:** For asynchronous form submissions, the design system's `Button` component provides a native `loading` prop that automatically handles the loading spinner and sets `aria-busy="true"`. Manual implementations (changing text to "Loading..." and setting `disabled`) provide a worse UX and lower accessibility.
**Action:** Always prefer the `loading` prop over manually toggling text and `disabled` attributes for `Button` components handling async operations.
## 2024-05-25 - Table of Contents Accessibility
**Learning:** Table of Contents components using internal anchors (`#id`) lack critical structural context and state for screen readers by default. Wrapping them in a `<nav aria-label="Table of contents">` exposes them as a discrete navigation landmark, and applying `aria-current="true"` dynamically to active elements clearly signals the user's current position within the document outline.
**Action:** Always wrap Table of Contents navigation components in a semantically labeled `<nav>` element and explicitly indicate the currently active section using `aria-current="true"` on the relevant internal link.
