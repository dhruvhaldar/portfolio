## 2025-05-15 - Select Component Display Value Mismatch
**Learning:** The `Select` component was displaying the internal `value` (ID) in the trigger input instead of the user-facing `label`. This is a common pattern failure where reusing a generic `Input` component (which expects value=display) for a Select trigger (where value!=display) causes UX friction (users see "us-east-1" instead of "US East").
**Action:** Always verify that "Select" or "Combobox" components compute a dedicated `displayValue` derived from the selected option's label, separate from the form submission `value`.

## 2026-01-20 - Unique IDs in Reusable Components
**Learning:** Reusable components like `Select` often hardcode IDs (e.g., `id="search"`) for internal elements. This creates duplicate IDs when the component is used multiple times on a page, breaking accessibility (labels point to the wrong input) and HTML validity.
**Action:** Always use a generated unique ID (via `useId()`) as a namespace for internal element IDs (e.g., `id={`${generatedId}-search`}`) in reusable components.

## 2026-02-04 - Standardized Loading State in Input
**Learning:** The `Input` component lacked a standardized `loading` state, forcing consumers to implement custom solutions (often inaccessible). Providing a built-in `loading` prop that handles both visual (Spinner) and semantic (`aria-busy`) feedback ensures consistency and accessibility across the application.
**Action:** When designing atomic input components, always include a first-class `loading` state that manages `aria-busy` and visual indicators automatically.
