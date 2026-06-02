## 2025-06-02 - Removed redundant aria-required
**Learning:** In React components that spread `...props` onto native form elements like `<input>` or `<textarea>`, explicitly setting `aria-required={props.required}` causes the native `required` attribute and the ARIA attribute to both be applied, leading to duplicate screen reader announcements.
**Action:** Avoid applying `aria-required` if the component already forwards standard HTML boolean attributes.
