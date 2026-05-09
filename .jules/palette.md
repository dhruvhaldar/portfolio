## 2024-10-24 - [Dynamic ARIA labels for copy-to-clipboard buttons]
**Learning:** Icon-only copy buttons (like those used for citations or direct links) often lack sufficient context when they only say "Copy". Furthermore, when the state changes to "Copied!", the `aria-label` needs to reflect this state change dynamically to ensure screen reader users receive the same confirmation as sighted users who see a checkmark icon.
**Action:** Always bind the `aria-label` of a copy button to its `copied` state (e.g., `aria-label={copied ? "Citation copied" : \`Copy citation for ${title}\`}`) and ensure the default label describes *what* is being copied rather than just the action.
## 2024-05-18 - Prevent Keyboard Bubbling on Interactive Details
**Learning:** Keyboard navigation (Enter/Space) on inner interactive elements like an IconButton tooltip can bubble up to the parent Checkbox/Switch, causing accidental toggling.
**Action:** When nesting interactive elements inside a clickable row/label, explicitly add `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); }}` to the inner element's wrapper to trap these specific interaction keys without breaking global keys like Escape.
## 2024-05-18 - ColorInput Prefix/Suffix Keyboard Accessibility
**Learning:** Custom form elements built with structural wrappers like `<Flex>` for prefixes and suffixes (e.g., color swatches) often miss default keyboard accessibility. Adding an `onClick` handler is not enough; they require explicit `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers listening for 'Enter' or 'Space' to be fully usable by keyboard-only users.
**Action:** Always check custom interactive elements (prefixes/suffixes) for `role`, `tabIndex`, and `onKeyDown` handlers if they have `onClick` behaviors.
## 2024-10-25 - [Add aria-disabled to polymorphic buttons]
**Learning:** Polymorphic components (like Button or IconButton) that render as standard `<a>` or `<Link>` elements when an `href` prop is supplied do not natively support the HTML5 `disabled` attribute to communicate status to screen readers or for CSS `:disabled` selectors.
**Action:** Always map the `disabled` prop to `aria-disabled="true"` in the underlying rendered element and update CSS selectors to target both `:disabled` and `[aria-disabled="true"]`.
