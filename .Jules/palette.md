## 2024-10-24 - [Dynamic ARIA labels for copy-to-clipboard buttons]
**Learning:** Icon-only copy buttons (like those used for citations or direct links) often lack sufficient context when they only say "Copy". Furthermore, when the state changes to "Copied!", the `aria-label` needs to reflect this state change dynamically to ensure screen reader users receive the same confirmation as sighted users who see a checkmark icon.
**Action:** Always bind the `aria-label` of a copy button to its `copied` state (e.g., `aria-label={copied ? "Citation copied" : \`Copy citation for ${title}\`}`) and ensure the default label describes *what* is being copied rather than just the action.

## $(date +%Y-%m-%d) - [ColorInput Accessibility]
**Learning:** Custom prefix/suffix interactives in generic layout wrappers (like `<Flex>` for color swatches) bypass standard accessibility checks. They act as buttons but don't natively receive focus, announce their role, or support keyboard interaction (Space/Enter).
**Action:** Always assign `role="button"`, `tabIndex={0}`, an explicit `aria-label`, and `onKeyDown` handlers (mapping Space and Enter keys) to custom layout wrappers acting as inputs or actions, to ensure they remain accessible to keyboard and screen reader users.
