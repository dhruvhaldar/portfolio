## 2025-06-03 - Added aria-haspopup to UserMenu trigger
**Learning:** Custom menu triggers built with generic elements (like `<Flex role="button">`) require `aria-haspopup="menu"` so screen readers announce that activating the button will open a sub-menu.
**Action:** Always verify that interactive elements serving as menu triggers have both `role="button"` and `aria-haspopup="menu"`.
## 2025-06-02 - Removed redundant aria-required
**Learning:** In React components that spread `...props` onto native form elements like `<input>` or `<textarea>`, explicitly setting `aria-required={props.required}` causes the native `required` attribute and the ARIA attribute to both be applied, leading to duplicate screen reader announcements.
**Action:** Avoid applying `aria-required` if the component already forwards standard HTML boolean attributes.
