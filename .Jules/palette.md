## 2024-05-24 - Async Button Loading State
**Learning:** For asynchronous form submissions, the design system's `Button` component provides a native `loading` prop that automatically handles the loading spinner and sets `aria-busy="true"`. Manual implementations (changing text to "Loading..." and setting `disabled`) provide a worse UX and lower accessibility.
**Action:** Always prefer the `loading` prop over manually toggling text and `disabled` attributes for `Button` components handling async operations.
