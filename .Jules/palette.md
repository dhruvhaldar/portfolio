## 2025-05-15 - Select Component Display Value Mismatch
**Learning:** The `Select` component was displaying the internal `value` (ID) in the trigger input instead of the user-facing `label`. This is a common pattern failure where reusing a generic `Input` component (which expects value=display) for a Select trigger (where value!=display) causes UX friction (users see "us-east-1" instead of "US East").
**Action:** Always verify that "Select" or "Combobox" components compute a dedicated `displayValue` derived from the selected option's label, separate from the form submission `value`.

## 2026-01-20 - Unique IDs in Reusable Components
**Learning:** Reusable components like `Select` often hardcode IDs (e.g., `id="search"`) for internal elements. This creates duplicate IDs when the component is used multiple times on a page, breaking accessibility (labels point to the wrong input) and HTML validity.
**Action:** Always use a generated unique ID (via `useId()`) as a namespace for internal element IDs (e.g., `id={`${generatedId}-search`}`) in reusable components.

## 2026-02-15 - Interactive Roles on Containers
**Learning:** Hardcoding `role="button"` and `tabIndex={0}` on reusable container components (like `Chip`) causes severe accessibility issues (nested buttons, confusing navigation) when they are used as static containers for other interactive elements (like a remove button).
**Action:** Conditionally apply interactive roles and tab indices only when the component actually receives an interaction handler (e.g., `onClick`).
