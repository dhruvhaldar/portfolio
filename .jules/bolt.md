# Bolt's Journal

This journal documents critical performance learnings for the codebase.

## 2024-05-22 - [Initialization]
**Learning:** Initializing Bolt's journal.
**Action:** Document critical learnings here as they are discovered.

## 2024-05-22 - [LCP Optimization]
**Learning:** `SmartImage` component defaults to `unoptimized=true`, disabling Next.js built-in Image Optimization. This is likely to support static exports where image optimization requires a custom loader or external service.
**Action:** When working with static exports, rely on `priority` (preload) for above-the-fold images to improve LCP, as automatic optimization is not available. Manually pre-optimize images during build if possible.

## 2024-05-22 - [RevealFx Redundant Effect]
**Learning:** The `RevealFx` component was scheduling a `setTimeout` to set state to `true` even when `revealedByDefault` was `true`. This caused an unnecessary effect execution and potential re-render check on critical path (LCP) elements.
**Action:** Always check if the target state is already achieved before scheduling effects that update state, especially for "initial" states like `revealedByDefault`.

## 2024-05-22 - [AvatarGroup Style Anti-Pattern]
**Learning:** `AvatarGroup` generates a new `style` object for each `Avatar` child in every render (inside `.map()`), which breaks the memoization of the `Avatar` component.
**Action:** In future optimizations, ensure mapped components receive stable props or memoize the parent component (`AvatarGroup`) to prevent cascading re-renders.
