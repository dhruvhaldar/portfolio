## 2026-01-22 - Critical Accessibility Fix in Dialog Component
**Learning:** The `Dialog` component's focus trapping mechanism (setting `inert` on siblings) was flawed because it rendered directly into `document.body` but iterated over `document.body.childNodes` to set `inert`. This caused two issues:
1. It accidentally included the dialog itself (if `portal-root` was missing or assumed to be excluded).
2. It assumed `portal-root` was a direct child of `body`. If `portal-root` was nested inside another wrapper (e.g. during testing or different layouts), that wrapper would be marked inert, disabling the dialog.

**Action:**
1. Ensure `portal-root` exists in the layout.
2. Update `Dialog` to explicitly target `portal-root`.
3. Crucially, when iterating DOM nodes for `inert`, check `!node.contains(portalRoot)` to protect against scenarios where `portal-root` is nested inside a sibling of the other content. This makes the component robust against layout changes.
