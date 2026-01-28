## 2025-05-15 - Select Component Display Value Mismatch
**Learning:** The `Select` component was displaying the internal `value` (ID) in the trigger input instead of the user-facing `label`. This is a common pattern failure where reusing a generic `Input` component (which expects value=display) for a Select trigger (where value!=display) causes UX friction (users see "us-east-1" instead of "US East").
**Action:** Always verify that "Select" or "Combobox" components compute a dedicated `displayValue` derived from the selected option's label, separate from the form submission `value`.

## 2026-01-20 - Unique IDs in Reusable Components
**Learning:** Reusable components like `Select` often hardcode IDs (e.g., `id="search"`) for internal elements. This creates duplicate IDs when the component is used multiple times on a page, breaking accessibility (labels point to the wrong input) and HTML validity.
**Action:** Always use a generated unique ID (via `useId()`) as a namespace for internal element IDs (e.g., `id={`${generatedId}-search`}`) in reusable components.

## 2025-05-23 - Interactive Roles on Containers
**Learning:** The `Chip` component was unconditionally applying `role="button"` and `tabIndex={0}`, creating invalid HTML (button inside button) and confusing accessibility when used as a static container for removable tags in `TagInput`.
**Action:** Conditionally apply interactive roles (`button`, `link`, etc.) only when the component actually receives an interaction handler (like `onClick`). For composite components (like tags with remove buttons), ensure the container is static if the interaction is only on the inner button.

## 2025-10-24 - Composite Input Keyboard Support
**Learning:** Multi-value inputs (like `TagInput`) often feel broken to users if they rely solely on mouse interaction for deletion. Users expect `Backspace` on an empty input to act on the previous item.
**Action:** Ensure all composite inputs support `Backspace` deletion of the last item when the input buffer is empty, to match standard text editing expectations.

## 2025-10-25 - Visual Feedback for NumberInput Limits
**Learning:** `NumberInput` controls (increment/decrement) lacked visual disabled states when reaching `min` or `max` limits, confusing users who clicked with no effect.
**Action:** Always disable control buttons (using `disabled` prop) when the corresponding limit is reached to provide immediate visual feedback.
