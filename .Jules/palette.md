## 2024-06-20 - [Added Accessible Empty State to Select]
**Learning:** Empty states resulting from dynamic filtering (like a search within a Select component) are visually apparent but completely invisible to screen readers unless explicitly marked up.
**Action:** Always wrap dynamically rendered empty states in a container with `role="status"` and `aria-live="polite"` to proactively inform assistive technology users of zero-result states.
