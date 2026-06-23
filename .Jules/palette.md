## 2024-06-20 - [Added Accessible Empty State to Select]
**Learning:** Empty states resulting from dynamic filtering (like a search within a Select component) are visually apparent but completely invisible to screen readers unless explicitly marked up.
**Action:** Always wrap dynamically rendered empty states in a container with `role="status"` and `aria-live="polite"` to proactively inform assistive technology users of zero-result states.
## 2024-03-24 - Toast Global Escape Dismissal
**Learning:** `Toast` components with inline `onKeyDown` listeners checking for the `Escape` key are inaccessible if the container doesn't natively receive focus (or lack a `tabIndex`).
**Action:** Always implement global dismissal (using a `document.addEventListener('keydown')` inside a `useEffect`) for transient status alerts/notifications like toasts so keyboard users can dismiss them without having to chase focus.
