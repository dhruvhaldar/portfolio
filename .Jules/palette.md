## 2025-05-15 - Select Component Display Value Mismatch
**Learning:** The `Select` component was displaying the internal `value` (ID) in the trigger input instead of the user-facing `label`. This is a common pattern failure where reusing a generic `Input` component (which expects value=display) for a Select trigger (where value!=display) causes UX friction (users see "us-east-1" instead of "US East").
**Action:** Always verify that "Select" or "Combobox" components compute a dedicated `displayValue` derived from the selected option's label, separate from the form submission `value`.

## 2026-01-20 - Unique IDs in Reusable Components
**Learning:** Reusable components like `Select` often hardcode IDs (e.g., `id="search"`) for internal elements. This creates duplicate IDs when the component is used multiple times on a page, breaking accessibility (labels point to the wrong input) and HTML validity.
**Action:** Always use a generated unique ID (via `useId()`) as a namespace for internal element IDs (e.g., `id={`${generatedId}-search`}`) in reusable components.

## 2025-05-23 - Interactive Roles on Containers
**Learning:** The `Chip` component was unconditionally applying `role="button"` and `tabIndex={0}`, creating invalid HTML (button inside button) and confusing accessibility when used as a static container for removable tags in `TagInput`.
**Action:** Conditionally apply interactive roles (`button`, `link`, etc.) only when the component actually receives an interaction handler (like `onClick`). For composite components (like tags with remove buttons), ensure the container is static if the interaction is only on the inner button.

## 2026-05-15 - Loading States vs Data Props
**Learning:** The `User` component was only rendering skeletons if the `name` prop was present. This created a Catch-22 where loading skeletons (needed before data arrives) wouldn't show because the data (name) wasn't there yet.
**Action:** When implementing loading states, ensure skeletons or placeholders are rendered even if the data props (like `name`) are missing, as they are often undefined during the initial fetch.
