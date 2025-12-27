# Bolt's Journal

This journal documents critical performance learnings for the codebase.

## 2024-05-22 - [Initialization]
**Learning:** Initializing Bolt's journal.
**Action:** Document critical learnings here as they are discovered.

## 2024-05-22 - [LCP Optimization]
**Learning:** `SmartImage` component defaults to `unoptimized=true`, disabling Next.js built-in Image Optimization. This is likely to support static exports where image optimization requires a custom loader or external service.
**Action:** When working with static exports, rely on `priority` (preload) for above-the-fold images to improve LCP, as automatic optimization is not available. Manually pre-optimize images during build if possible.
