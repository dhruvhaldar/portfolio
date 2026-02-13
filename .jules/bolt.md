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

## 2025-02-26 - [Review Bot Fallibility]
**Learning:** Automated code review tools may incorrectly flag existing imports as missing or misidentify the test environment (e.g., claiming Vitest is not used when it is).
**Action:** Always verify "missing" imports by reading the file content and verify test environment by checking `package.json` and running tests locally. Trust empirical evidence over automated claims when they conflict.

## 2025-02-26 - [SmartImage Regex Optimization]
**Learning:** `SmartImage` executes a YouTube regex check on every render. While fast, this adds up in lists or during interactions (like enlarging) that trigger re-renders.
**Action:** Memoized the `isVideo`, `isYouTube`, and `youtubeEmbedUrl` calculations using `useMemo`. This ensures these checks only run when `src` changes, not when internal state (like `isEnlarged`) changes.

## 2025-02-26 - [User Component Memoization]
**Learning:** The `User` component was not memoized, but it constructs new object props (`restAvatarProps`) for its child `Avatar` component (which *is* memoized). This caused `Avatar` to re-render unnecessarily whenever `User` re-rendered, defeating the purpose of `Avatar`'s memoization.
**Action:** Memoize container components like `User` that construct props for memoized children, ensuring that stable props from the parent result in stable props for the child.

## 2025-02-26 - [Scroller Children Memoization]
**Learning:** The `Scroller` component manages its own state (scroll buttons visibility) but uses `React.Children.map` + `React.cloneElement` to attach handlers to its children. Without memoization, every internal state update of `Scroller` re-creates these handlers, forcing all children to re-render.
**Action:** Memoize the result of `React.Children.map` in wrapper components if they have internal state that changes independently of the children. This preserves referential identity of props passed to children.

## 2025-02-26 - [Unstable Injected Handlers in Cloned Children]
**Learning:** Components like `Scroller` that inject handlers (e.g., `onClick`) via `cloneElement` often pass new function instances on every render. To effectively memoize the child components (e.g., `CarouselThumbnail`), `React.memo` requires a custom comparison function to ignore these unstable injected handlers.
**Action:** When memoizing a component intended to be a child of an interactive wrapper (like `Scroller`), implement `arePropsEqual` to explicitly check only relevant data props (like `image`, `isActive`) and ignore unstable callbacks if they don't affect rendering output.

## 2025-02-26 - [Input/Textarea Double Render]
**Learning:** `Input` and `Textarea` components were using `useEffect` and `useState` to synchronize `isFilled` and `internalLength` state with `props.value`. This caused a double render on every keystroke for controlled inputs.
**Action:** Use derived state calculation during render for properties that depend on props (like `isFilled` depending on `value`), and only use local state for uncontrolled behavior.

## 2026-02-13 - [Dual MDX Pipeline Conflict]
**Learning:** Using `@next/mdx` (via `withMDX()` in `next.config.mjs`) alongside `next-mdx-remote` creates a dual MDX processing pipeline. `@next/mdx` intercepts MDX compilation at the webpack/turbopack level and strips JSX component props before `next-mdx-remote`'s runtime `<MDXRemote>` can process them. This results in custom components receiving empty `{}` props.
**Action:** When using `next-mdx-remote` (especially v6+ with RSC), do NOT also use `@next/mdx` in `next.config.mjs`. They serve different purposes — `@next/mdx` is for importing `.mdx` files as pages/components, while `next-mdx-remote` is for rendering MDX from dynamic string sources.

## 2026-02-13 - [next-mdx-remote v6 Expression Prop Stripping]
**Learning:** `next-mdx-remote` v6 does not preserve JSX expression props (arrays/objects wrapped in `{}`) when passed directly to custom components in MDX content. String props like `text="hello"` work fine, but `headers={["A","B"]}` gets silently dropped and the component receives `{}`. This is a breaking change from v5.
**Action:** Pass complex data to MDX components as JSON strings: `<MyComponent data='{"key":"value"}' />`. Parse the JSON inside the component with `JSON.parse()`. Wrap in try/catch for safety.

## 2026-02-13 - [removeConsole Masking Debug Output]
**Learning:** The `compiler.removeConsole` option in `next.config.mjs` (set to `process.env.NODE_ENV === 'production'`) strips ALL `console.*` calls during production builds via SWC. This includes `console.error` used for debugging, making it impossible to debug build-time issues via console output.
**Action:** When debugging production build issues, temporarily set `removeConsole: false` in `next.config.mjs`. Alternatively, use `throw new Error()` for one-shot debugging since errors will always surface in build output.
