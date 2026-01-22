## 2025-05-15 - Select Component Display Value Mismatch
**Learning:** The `Select` component was displaying the internal `value` (ID) in the trigger input instead of the user-facing `label`. This is a common pattern failure where reusing a generic `Input` component (which expects value=display) for a Select trigger (where value!=display) causes UX friction (users see "us-east-1" instead of "US East").
**Action:** Always verify that "Select" or "Combobox" components compute a dedicated `displayValue` derived from the selected option's label, separate from the form submission `value`.

## 2026-01-20 - Unique IDs in Reusable Components
**Learning:** Reusable components like `Select` often hardcode IDs (e.g., `id="search"`) for internal elements. This creates duplicate IDs when the component is used multiple times on a page, breaking accessibility (labels point to the wrong input) and HTML validity.
**Action:** Always use a generated unique ID (via `useId()`) as a namespace for internal element IDs (e.g., `id={`${generatedId}-search`}`) in reusable components.

## 2025-05-16 - Dialog Focus Restoration
**Learning:** Modal dialogs often fail to restore focus to the triggering element upon closure, forcing keyboard users to navigate from the top of the document. This happens because the previous `document.activeElement` is not stored before focus moves into the dialog.
**Action:** In `Dialog` components, store `document.activeElement` in a `ref` when the dialog opens (`isOpen: true`), and call `.focus()` on that element when the dialog closes (`isOpen: false`). Ensure this restoration happens after any closing animations but before the dialog unmounts or becomes inaccessible.
