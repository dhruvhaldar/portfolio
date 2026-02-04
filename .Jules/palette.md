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

## 2026-01-31 - Event Handler Composition
**Learning:** Spreading `...props` after internal event handlers (like `onKeyDown`) in reusable components silently overrides internal logic (like tag creation), leading to "it works until I add a custom listener" bugs.
**Action:** Always compose event handlers by calling the external handler within the internal one, and respect `event.defaultPrevented` to allow external control.
## 2025-05-24 - Avatar Alt Text Gap
**Learning:** The `Avatar` component was hardcoding `alt="Avatar"`, preventing accessible descriptions for user images. This forces screen readers to announce "Avatar" repeatedly instead of the user's name.
**Action:** Ensure all components wrapping images (like `Avatar`) expose an `alt` prop to the consumer, defaulting to a generic label only if absolutely necessary.
## 2025-05-18 - Skeleton Visibility Mismatch
**Learning:** The `SmartImage` component only displayed a skeleton when explicitly told to load via `isLoading` prop, but showed empty space while the image itself was downloading (`onLoad` not yet fired). This created a layout shift or blank space for users.
**Action:** Ensure Skeleton components are conditionally rendered based on both external data loading state AND internal asset loading state (e.g., `!isLoaded`), positioning them absolutely if necessary to avoid layout shifts when content loads.

## 2025-05-25 - ARIA Role Nesting in Dropdowns
**Learning:** The `DateInput` component nested a `DatePicker` (grid) inside a `Dropdown` (listbox), causing invalid ARIA nesting (`grid` inside `listbox`). This confuses screen readers which expect `option` children for a `listbox`.
**Action:** When creating generic wrapper components (like `DropdownWrapper`), allow the consumer to specify the ARIA role (e.g., `dialog` for popups containing complex content) to match the actual content structure, rather than enforcing a single default role.

## 2026-02-01 - Disabled State Accessibility in Custom Controls
**Learning:** The `Checkbox` component implemented a custom interactive element but failed to manage `tabIndex` and `aria-disabled` for the disabled state, leaving it focusable but non-functional.
**Action:** When building custom interactive controls, explicitly manage `tabIndex` (set to -1 if disabled) and `aria-disabled` to ensure keyboard and screen reader users perceive the disabled state correctly.
