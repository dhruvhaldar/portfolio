## 2025-07-03 - [SmartLink aria-current]
**Learning:** For site-wide navigation (e.g., in Header), applying conditional styles or underlines for active states is insufficient for assistive technologies. We need semantic attributes like `aria-current="page"` to broadcast the active route. Since `SmartLink` is often used to wrap Next.js Links with custom styling based on an explicit `selected` prop, we should utilize this prop to also handle `aria-current`.
**Action:** When creating navigational components or link wrappers with explicit active/selected states, map that state directly to the appropriate `aria-current` or `aria-selected` attributes automatically to ensure accessibility wins site-wide.
## 2024-05-14 - Dynamic Tooltip Accessibility Linking
**Learning:** Screen readers cannot infer the relationship between a button and its custom tooltip unless they are explicitly linked, even if the tooltip renders directly near the button in the DOM. Relying solely on `aria-label` often duplicates text or masks actual visual tooltip content from assistive technologies.
**Action:** When a button triggers a custom `Tooltip`, generate a unique ID using React's `useId()` and conditionally apply `aria-describedby` to the button trigger that points to the tooltip's ID when the tooltip is rendered.

## 2025-07-03 - React inert attribute behavior
**Learning:** When using the `inert` attribute in React to hide content from assistive technologies (like in a closed `Accordion` or behind a `Dialog`), React expects a boolean value (`inert={true}` or `inert={false}`) rather than a string (`inert="true"`). Passing a string causes React to throw a warning and may result in the attribute not being applied correctly to the DOM, potentially breaking keyboard/screen reader accessibility.
**Action:** Always pass boolean values to the `inert` attribute in JSX to ensure closed or hidden content is truly removed from the accessibility tree.
